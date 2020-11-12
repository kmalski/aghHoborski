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
    this.timeout(60000);
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
      data.auctionAmount.should.be.equal(0);
      data.accountBalance.should.be.equal(5000);
      data.hasBlackBox.should.be.equal(false);
      data.hintsCount.should.be.equal(0);
      data.isInGame.should.be.equal(true);
      data.isAuction.should.be.equal(false);
      data.hasLost.should.be.equal(false);
      done();
    });
  });

  it('Disable team', function (done) {
    client.emit('changeTeamStatus', { teamName: 'green', newIsInGame: false });
    client.once('greenTeamStatusChanged', (data: any) => {
      data.isInGame.should.be.equal(false);
      done();
    });
  });

  it('Get state of inactive team', function (done) {
    client.emit('getTeamState', { teamName: 'green' });
    client.once('greenTeamState', (data: any) => {
      data.name.should.be.equal('green');
      data.auctionAmount.should.be.equal(0);
      data.accountBalance.should.be.equal(5000);
      data.hasBlackBox.should.be.equal(false);
      data.hintsCount.should.be.equal(0);
      data.isInGame.should.be.equal(false);
      data.isAuction.should.be.equal(false);
      data.hasLost.should.be.equal(false);
      done();
    });
  });

  it('Enable team', function (done) {
    client.emit('changeTeamStatus', { teamName: 'green', newIsInGame: true });
    client.once('greenTeamStatusChanged', (data: any) => {
      data.isInGame.should.be.equal(true);
      done();
    });
  });

  it('Grant black box', function (done) {
    client.emit('changeBlackBox', { teamName: 'red', newHasBlackBox: true });
    client.once('redBlackBoxChanged', (data: any) => {
      data.hasBlackBox.should.be.equal(true);
      done();
    });
  });

  it('Remove black box', function (done) {
    client.emit('changeBlackBox', { teamName: 'red', newHasBlackBox: false });
    client.once('redBlackBoxChanged', (data: any) => {
      data.hasBlackBox.should.be.equal(false);
      done();
    });
  });

  it('Fail to change black box status of inactive team', function (done) {
    client.emit('changeBlackBox', { teamName: 'masters', newHasBlackBox: false });
    client.once('warning', (msg: any) => {
      msg.should.be.equal('Zmiana czarnej skrzynki jest w tym momencie niedozwolona.');
      done();
    });
  });

  it('Fail to change black box status with invalid data', function (done) {
    client.emit('changeBlackBox', { teamName: 'red', desirednewHasBlackBoxState: 'dsa' });
    client.once('warning', (msg: any) => {
      msg.should.be.equal('Zmiana czarnej skrzynki jest w tym momencie niedozwolona.');
      done();
    });
  });

  it('Change account balance', function (done) {
    client.emit('changeAccountBalance', { teamName: 'yellow', newAccountBalance: 6000 });
    client.once('yellowAccountBalanceChanged', (data: any) => {
      data.accountBalance.should.be.equal(6000);
      data.hasLost.should.be.equal(false);
      done();
    });
  });

  it('Fail to change account balance of inactive team', function (done) {
    client.emit('changeAccountBalance', { teamName: 'masters', newAccountBalance: 6000 });
    client.once('warning', (msg: any) => {
      msg.should.be.equal('Zmiana stanu konta na 6000 jest w tym momencie niedozwolona.');
      done();
    });
  });

  it('Change hints count', function (done) {
    client.emit('changeHintsCount', { teamName: 'blue', newHintsCount: 2 });
    client.once('blueHintsCountChanged', (data: any) => {
      data.hintsCount.should.be.equal(2);
      done();
    });
  });

  it('Fail to change hints count with invalid data', function (done) {
    client.emit('changeHintsCount', { teamName: 'blue', newHintsCount: 'dsa' });
    client.once('warning', (msg: any) => {
      msg.should.be.equal('Zmiana ilości podpowiedzi na dsa jest w tym momencie niedozwolona.');
      done();
    });
  });

  it('Auction with black box as prize and out of the game', function (done) {
    client.emit('startAuction');
    client.once('auctionStarted', () => {
      client.once('yellowAuctionAmountChanged', (data: any) => {
        data.auctionAmount.should.be.equal(200);
        client.emit('changeAuctionAmount', { teamName: 'yellow', newAuctionAmount: 500 });
        client.once('yellowAuctionAmountChanged', (data: any) => {
          data.auctionAmount.should.be.equal(500);
          client.emit('changeAuctionAmount', { teamName: 'blue', newAuctionAmount: 500 });
          client.emit('changeAuctionAmount', { teamName: 'red', newAuctionAmount: 4900 });
          client.once('redAuctionAmountChanged', (data: any) => {
            data.auctionAmount.should.be.equal(4900);
            client.emit('finishAuction', { auctionFinishAction: 'grantBlackBox' });
            client.once('redHasLostChanged', (data: any) => {
              data.hasLost.should.be.equal(true);
            });
            client.once('redBlackBoxChanged', (data: any) => {
              data.hasBlackBox.should.be.equal(true);
              done();
            });
          });
        });
      });
    });
  });

  it('Auction with hint prize', function (done) {
    client.emit('resetAccountBalances', { newAccountBalance: 5000 });
    client.once('greenAccountBalanceChanged', (data: any) => {
      data.accountBalance.should.be.equal(5000);
      client.emit('startAuction');
      client.once('auctionStarted', () => {
        client.once('greenAuctionAmountChanged', (data: any) => {
          data.auctionAmount.should.be.equal(200);
          client.emit('changeAuctionAmount', { teamName: 'blue', newAuctionAmount: 4000 });
          client.once('blueAuctionAmountChanged', (data: any) => {
            data.auctionAmount.should.be.equal(4000);
            client.emit('changeAuctionAmount', { teamName: 'green', newAuctionAmount: 4100 });
            client.once('greenAuctionAmountChanged', (data: any) => {
              data.auctionAmount.should.be.equal(4100);
              client.emit('finishAuction', { auctionFinishAction: 'grantHint' });
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
    client.emit('resetAccountBalances', { newAccountBalance: 5000 });
    client.once('greenAccountBalanceChanged', (data: any) => {
      data.accountBalance.should.be.equal(5000);
      client.emit('startAuction');
      client.once('auctionStarted', () => {
        client.once('greenAuctionAmountChanged', (data: any) => {
          data.auctionAmount.should.be.equal(200);
          client.emit('changeAuctionAmount', { teamName: 'green', newAuctionAmount: 3000 });
          client.once('greenAuctionAmountChanged', (data: any) => {
            data.auctionAmount.should.be.equal(3000);
            client.emit('changeAuctionAmount', { teamName: 'blue', newAuctionAmount: 3100 });
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

  it('Has lost when all money not greater than 200', function (done) {
    client.emit('changeAccountBalance', { teamName: 'blue', newAccountBalance: 199 });
    client.once('blueAccountBalanceChanged', (data: any) => {
      data.accountBalance.should.be.equal(199);
      data.hasLost.should.be.equal(true);
      done();
    });
  });
});
