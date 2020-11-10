import chai from 'chai';
import mocha from 'mocha';
import SocketIOClient from 'socket.io-client';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { ClashServer } from '../src/server';

const should = chai.should();

describe('Test game socket events', function () {
  const options = { transports: ['websocket'] };
  let server: ClashServer;
  let client: SocketIOClient.Socket;
  let mongo: MongoMemoryServer;

  before(function (done) {
    mongo = new MongoMemoryServer();
    server = new ClashServer();
    mongo
      .getUri()
      .then(uri => server.connectMongo(uri))
      .then(() => server.start())
      .then(() => {
        client = SocketIOClient.connect('http://localhost:' + server.getPort(), options);

        client.emit('createRoom', { name: 'GameTestName', password: 'GameTestPassword' });
        client.once('roomCreated', (roomData: any) => {
          client.emit('authorize', { name: 'GameTestName', token: roomData.token });
          client.once('authorized', () => done());
        });
      });
  });

  after(async function () {
    client.disconnect();
    await server.disconnectMongo();
    await mongo.stop();
    server.stop();
  });

  it('Get state of active team', function (done) {
    client.emit('getTeamState', { teamName: 'green' });
    client.once('greenTeamState', (data: any) => {
      data.name.should.be.equal('green');
      data.accountBalance.should.be.equal(5000);
      data.hasBlackBox.should.be.equal(false);
      data.hintsCount.should.be.equal(0);
      data.inGame.should.be.equal(true);
      data.isAuction.should.be.equal(false);
      should.not.exist(data.auctionAmount);
      done();
    });
  });

  it('Disable team', function (done) {
    client.emit('changeTeamStatus', { teamName: 'green', desiredState: false });
    client.once('greenTeamStatusChanged', (data: any) => {
      data.state.should.be.equal(false);
      done();
    });
  });

  it('Get state of inactive team', function (done) {
    client.emit('getTeamState', { teamName: 'green' });
    client.once('greenTeamState', (data: any) => {
      data.name.should.be.equal('green');
      data.accountBalance.should.be.equal(5000);
      data.hasBlackBox.should.be.equal(false);
      data.hintsCount.should.be.equal(0);
      data.inGame.should.be.equal(false);
      data.isAuction.should.be.equal(false);
      should.not.exist(data.auctionAmount);
      done();
    });
  });

  it('Enable team', function (done) {
    client.emit('changeTeamStatus', { teamName: 'green', desiredState: true });
    client.once('greenTeamStatusChanged', (data: any) => {
      data.state.should.be.equal(true);
      done();
    });
  });

  it('Grant black box', function (done) {
    client.emit('changeBlackBox', { teamName: 'red', desiredState: true });
    client.once('redBlackBoxChanged', (data: any) => {
      data.state.should.be.equal(true);
      done();
    });
  });

  it('Remove black box', function (done) {
    client.emit('changeBlackBox', { teamName: 'red', desiredState: false });
    client.once('redBlackBoxChanged', (data: any) => {
      data.state.should.be.equal(false);
      done();
    });
  });

  it('Fail to change black box status of inactive team', function (done) {
    client.emit('changeBlackBox', { teamName: 'masters', desiredState: false });
    client.once('warning', (msg: any) => {
      msg.should.be.equal('Zmiana czarnej skrzynki jest w tym momencie niedozwolona.');
      done();
    });
  });

  it('Fail to change black box status with invalid data', function (done) {
    client.emit('changeBlackBox', { teamName: 'red', desiredState: 'dsa' });
    client.once('warning', (msg: any) => {
      msg.should.be.equal('Zmiana czarnej skrzynki jest w tym momencie niedozwolona.');
      done();
    });
  });

  it('Change account balance', function (done) {
    client.emit('changeAccountBalance', { teamName: 'yellow', newBalance: 6000 });
    client.once('yellowAccountBalanceChanged', (data: any) => {
      data.accountBalance.should.be.equal(6000);
      done();
    });
  });

  it('Fail to change account balance of inactive team', function (done) {
    client.emit('changeAccountBalance', { teamName: 'masters', newBalance: 6000 });
    client.once('warning', (msg: any) => {
      msg.should.be.equal('Zmiana stanu konta na 6000 jest w tym momencie niedozwolona.');
      done();
    });
  });

  it('Change hints count', function (done) {
    client.emit('changeHintsCount', { teamName: 'blue', newCount: 2 });
    client.once('blueHintsCountChanged', (data: any) => {
      data.hintsCount.should.be.equal(2);
      done();
    });
  });

  it('Fail to change hints count with invalid data', function (done) {
    client.emit('changeHintsCount', { teamName: 'blue', newCount: 'dsa' });
    client.once('warning', (msg: any) => {
      msg.should.be.equal('Zmiana ilości podpowiedzi na dsa jest w tym momencie niedozwolona.');
      done();
    });
  });

  it('Auction with black box as prize', function (done) {
    client.emit('startAuction');
    client.once('auctionStarted', () => {
      client.once('yellowAuctionAmountChanged', (data: any) => {
        data.auctionAmount.should.be.equal(200);
        client.emit('changeAuctionAmount', { teamName: 'yellow', newAmount: 500 });
        client.once('yellowAuctionAmountChanged', (data: any) => {
          data.auctionAmount.should.be.equal(500);
          client.emit('changeAuctionAmount', { teamName: 'blue', newAmount: 500 });
          client.emit('changeAuctionAmount', { teamName: 'red', newAmount: 600 });
          client.once('redAuctionAmountChanged', (data: any) => {
            data.auctionAmount.should.be.equal(600);
            client.emit('finishAuction', { finishAuctionAction: 'grantBlackBox' });
            client.once('redBlackBoxChanged', (data: any) => {
              data.state.should.be.equal(true);
              done();
            });
          });
        });
      });
    });
  });

  it('Auction with hint prize', function (done) {
    client.emit('resetAccountBalances', { newBalance: 5000 });
    client.once('greenAccountBalanceChanged', (data: any) => {
      data.accountBalance.should.be.equal(5000);
      client.emit('startAuction');
      client.once('auctionStarted', () => {
        client.once('greenAuctionAmountChanged', (data: any) => {
          data.auctionAmount.should.be.equal(200);
          client.emit('changeAuctionAmount', { teamName: 'blue', newAmount: 4000 });
          client.once('blueAuctionAmountChanged', (data: any) => {
            data.auctionAmount.should.be.equal(4000);
            client.emit('changeAuctionAmount', { teamName: 'green', newAmount: 4100 });
            client.once('greenAuctionAmountChanged', (data: any) => {
              data.auctionAmount.should.be.equal(4100);
              client.emit('finishAuction', { finishAuctionAction: 'grantHint' });
              client.once('greenHintsCountChanged', (data: any) => {
                data.hintsCount.should.be.equal(1);
                done();
              });
            });
          });
        });
      });
    });
  });

  it('Auction with canceling', function (done) {
    client.emit('resetAccountBalances', { newBalance: 5000 });
    client.once('greenAccountBalanceChanged', (data: any) => {
      data.accountBalance.should.be.equal(5000);
      client.emit('startAuction');
      client.once('auctionStarted', () => {
        client.once('greenAuctionAmountChanged', (data: any) => {
          data.auctionAmount.should.be.equal(200);
          client.emit('changeAuctionAmount', { teamName: 'green', newAmount: 3000 });
          client.once('greenAuctionAmountChanged', (data: any) => {
            data.auctionAmount.should.be.equal(3000);
            client.emit('changeAuctionAmount', { teamName: 'blue', newAmount: 3100 });
            client.once('blueAuctionAmountChanged', (data: any) => {
              data.auctionAmount.should.be.equal(3100);
              client.emit('cancelAuction');
              client.once('roundFinished', () => {
                client.emit('getMoneyPool');
                client.once('moneyPool', (data: any) => {
                  data.moneyPool.should.be.equal(0);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
});
