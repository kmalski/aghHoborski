import chai, { should } from 'chai';
import mocha from 'mocha';
import SocketIOClient from 'socket.io-client';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { ClashServer } from '../src/server';

should();

describe('Test room socket events', function () {
  const options = { transports: ['websocket'] };
  let server: ClashServer;
  let client: SocketIOClient.Socket;
  let mongo: MongoMemoryServer;
  let token: string;

  before(async function () {
    mongo = new MongoMemoryServer();
    server = new ClashServer();
    const mongoUri = await mongo.getUri();

    await server.connectMongo(mongoUri);
    await server.start();

    client = SocketIOClient.connect('http://localhost:' + server.getPort(), options);
  });

  after(async function () {
    client.disconnect();
    await server.disconnectMongo();
    await mongo.stop();
    server.stop();
  });

  it('Fail to join not created room', function (done) {
    client.emit('joinRoom', { notName: 'test name' });

    client.once('warning', (message: string) => {
      message.should.be.equal('Błędne dane.');
      done();
    });
  });

  it('Create new room', function (done) {
    client.emit('createRoom', { name: 'TestName', password: 'TestPassword' });

    client.once('roomCreated', (roomData: any) => {
      roomData.msg.should.be.equal('Pokój o nazwie TestName został utworzony.');
      roomData.name.should.be.equal('TestName');
      roomData.token.should.exist;
      token = roomData.token;
      done();
    });
  });

  it('Create room with name with whitespaces', function (done) {
    client.emit('createRoom', { name: ' \tSome\t \n Name\n ', password: 'SomePassword' });

    client.once('roomCreated', (roomData: any) => {
      roomData.msg.should.be.equal('Pokój o nazwie SomeName został utworzony.');
      roomData.name.should.be.equal('SomeName');
      roomData.token.should.exist;
      done();
    });
  });

  it('Join room as spectator', function (done) {
    client.emit('joinRoom', { name: 'TestName' });

    client.once('roomJoined', (roomData: any) => {
      roomData.msg.should.be.equal('Dołączono do pokoju o nazwie TestName.');
      roomData.name.should.be.equal('TestName');
      done();
    });
  });

  it('Join room as admin', function (done) {
    client.emit('adminJoinRoom', { name: 'TestName', password: 'TestPassword' });

    client.once('roomJoined', (roomData: any) => {
      roomData.msg.should.be.equal('Dołączono do pokoju o nazwie TestName.');
      roomData.name.should.be.equal('TestName');
      roomData.token.should.be.equal(token);
      done();
    });
  });

  it('Fail to join room as admin with wrong password', function (done) {
    client.emit('adminJoinRoom', { name: 'TestName', password: 'TestWrongPassword' });

    client.once('unauthorized', (msg: any) => {
      msg.should.be.equal('Podany pokój nie istnieje lub hasło jest nieprawidłowe.');
      done();
    });
  });

  it('Admin get state with token', function (done) {
    client.emit('adminGetState', { name: 'TestName', token: token });

    client.once('state', () => {
      done();
    });
  });

  it('Admin fail to get state with wrong token', function (done) {
    client.emit('adminGetState', { name: 'TestName', token: 'WrongToken' });

    client.once('unauthorized', (msg: any) => {
      msg.should.be.equal('Brak uprawnień.');
      done();
    });
  });

  it('Admin fail to get state of not existing room', function (done) {
    client.emit('adminGetState', { name: 'NotExist', token: 'WrongToken' });

    client.once('unauthorized', (msg: any) => {
      msg.should.be.equal('Pokój nie jest już aktywny.');
      done();
    });
  });
});
