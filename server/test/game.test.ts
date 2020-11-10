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
});
