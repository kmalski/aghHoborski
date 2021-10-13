import { should } from 'chai';
import { describe, before, after, it } from 'mocha';
import { Socket, io } from 'socket.io-client';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { ClashServer } from '../src/server';

should();

describe('Test time socket events', function () {
  const options = { transports: ['websocket'] };
  let server: ClashServer;
  let client: Socket;
  let mongo: MongoMemoryServer;

  before(function (done) {
    this.timeout(60000);
    server = new ClashServer();
    MongoMemoryServer.create({ instance: { dbName: 'time.test' } })
      .then(mongod => {
        mongo = mongod;
        return server.connectMongo(mongo.getUri());
      })
      .then(() => server.start())
      .then(() => {
        client = io('http://localhost:' + server.getPort(), options);

        client.emit('createRoom', { name: 'TimeTestName', password: 'TimeTestPassword' });
        client.once('roomCreated', (roomData: any) => {
          client.emit('authorize', { name: 'TimeTestName', token: roomData.token });
          client.once('authorized', () => done());
        });
      });
  });

  after(function (done) {
    client.disconnect();
    server
      .disconnectMongo()
      .then(() => server.stop())
      .then(() => mongo.stop(true))
      .then(() => done());
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
