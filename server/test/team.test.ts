import chai from 'chai';
import mocha from 'mocha';
import SocketIOClient from 'socket.io-client';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { ClashServer } from '../src/server';

const should = chai.should();

describe('Test team socket events', function () {
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

        client.emit('createRoom', { name: 'TeamTestName', password: 'TeamTestPassword' });
        client.once('roomCreated', (roomData: any) => {
          client.emit('authorize', { name: 'TeamTestName', token: roomData.token });
          client.once('authorized', () => {
            done();
          });
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
});
