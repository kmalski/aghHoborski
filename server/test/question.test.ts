import chai from 'chai';
import mocha from 'mocha';
import SocketIOClient from 'socket.io-client';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { ClashServer } from '../src/server';

const should = chai.should();

const validQuestionSet = `
{
  "categories": [
    {
      "name": "Pilka nozna",
      "questions": [
        {
          "content": "W którym roku Polska zdobyła mistrzostwo olimpijskie w piłce nożnej?",
          "hints": ["1972", "1960", "1952", "1976"]
        },
        {
          "content": "Kto był selekcjonerem reprezentacji Polski w piłce nożnej w latach 2000-2002?",
          "hints": ["Jerzy Engel", "Janusz Wójcik", "Paweł Janas", "Zbigniew Boniek"]
        }
      ]
    },
    {
    "name": "Geografia",
    "questions": [
        {
        "content": "Jakie jezioro jest największe na świecie?",
        "hints": ["Morze Kaspijskie", "Jezioro Wiktorii", "Bajkał", "Jezioro Górne"]
        },
        {
        "content": "Ile łącznie szczytów liczy Korona Gór Polski?",
        "hints": ["28", "22", "26", "30"]
        }
      ]
    }
  ]
}`;

describe('Test question socket events', function () {
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

        client.emit('createRoom', { name: 'QuestionTestName', password: 'QuestionTestPassword' });
        client.once('roomCreated', (roomData: any) => {
          client.emit('authorize', { name: 'QuestionTestName', token: roomData.token });
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

  it('Add new question set', function (done) {
    client.emit('addQuestionSet', { name: 'testSet', file: validQuestionSet });
    client.once('success', () => done());
  });

  it('Get all available categories', function (done) {
    client.emit('getAvailableCategories');
    client.once('availableCategories', (data: any) => {
      data.categories.should.have.length(2);
      data.categories.should.have.members(['Pilka nozna', 'Geografia']);
      done();
    });
  });

  it('Fail to change question set', function (done) {
    client.emit('changeQuestionSet', { name: 'testSet123' });
    client.once('fail', (msg: any) => {
      msg.should.be.equal('Zbiór pytań o nazwie testSet123 nie istnieje.');
      done();
    });
  });

  it('Change question set', function (done) {
    client.emit('addQuestionSet', { name: 'testSet2', file: validQuestionSet });
    client.once('success', () => {
      client.emit('changeQuestionSet', { name: 'testSet2' });
      client.once('success', () => done());
    });
  });

  it('Get all question sets', function (done) {
    client.emit('getAllQuestionSets');
    client.once('allQuestionSets', (data: any) => {
      data.should.have.length(2);
      data[0].name.should.be.equal('testSet');
      data[0].should.have.property('createdAt');
      data[1].name.should.be.equal('testSet2');
      data[1].should.have.property('createdAt');
      done();
    });
  });
});
