import chai from 'chai';
import mocha from 'mocha';
import SocketIOClient from 'socket.io-client';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { ClashServer } from '../src/server';

const should = chai.should();

describe('Test time socket events', function () {
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

        client.emit('createRoom', { name: 'TimeTestName', password: 'TimeTestPassword' });
        client.once('roomCreated', (roomData: any) => {
          client.emit('authorize', { name: 'TimeTestName', token: roomData.token });
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

  it('Start timer', function (done) {
    client.emit('startTime', { newValue: 60 });
    client.once('timeStarted', (data: any) => {
      data.value.should.be.equal(60);
      done();
    });
  });

  it('Fail to start timer with too big time value', function (done) {
    client.emit('startTime', { newValue: 3601 });
    client.once('warning', (msg: any) => {
      msg.should.be.equal('W tyle czasu to każdy może zgadnąć, spróbuj troszkę mniej.');
      done();
    });
  });

  it('Fail to start timer with invalid time value', function (done) {
    client.emit('startTime', { newValue: 35.01 });
    client.once('warning', (msg: any) => {
      msg.should.be.equal('Błędny czas, nie można rozpocząć odliczania.');
      done();
    });
  });

  it('Fail to start timer with negative time value', function (done) {
    client.emit('startTime', { newValue: -250 });
    client.once('warning', (msg: any) => {
      msg.should.be.equal('Błędny czas, nie można rozpocząć odliczania.');
      done();
    });
  });

  it('Stop timer', function (done) {
    client.emit('stopTime');
    client.once('timeStopped', () => {
      done();
    });
  });
});
