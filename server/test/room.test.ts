import chai, { should } from 'chai';
import mocha from 'mocha';
import SocketIOClient from 'socket.io-client';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { ClashServer } from '../src/server';

should();

describe('Test room socket events', function () {
  const options = { transports: ['websocket'] };
  let server: ClashServer, mongo: MongoMemoryServer;

  before(async function () {
    mongo = new MongoMemoryServer();
    server = new ClashServer();
    const mongoUri = await mongo.getUri();

    await server
      .connectMongo(mongoUri)
      .then(() => server.start())
      .catch((err: Error) => {
        console.log(err);
      });
  });

  after(async function () {
    await server.disconnectMongo();
    await mongo.stop();
    server.stop();
  });

  it('Fail to join not created room', function (done) {
    const client = SocketIOClient.connect('http://localhost:' + server.getPort(), options);

    client.once('connect', () => {
      client.once('warning', (message: string) => {
        message.should.be.equal('Błędne dane.');
        client.disconnect();
        done();
      });

      client.emit('joinRoom', { notName: 'test name' });
    });
  });
});
