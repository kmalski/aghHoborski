import chai from 'chai';
import { describe, before, after, it } from 'mocha';
import SocketIOClient from 'socket.io-client';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { ClashServer } from '../src/server';

const should = chai.should();

const team = 'red';
const questionSet = `
{
  "categories": [
    {
      "name": "Pilka nozna",
      "questions": [
        {
          "content": "W którym roku Polska zdobyła mistrzostwo olimpijskie w piłce nożnej?",
          "hints": ["1972", "1960", "1952", "1976"]
        }
      ]
    },
    {
      "name": "Biologia",
      "questions": [
        {
          "content": "W którym wieku została wymyślona nazwa dziedziny nauki \\"biologia\\"?",
          "hints": ["XIX", "XV", "XIII", "XVII"]
        }
      ]
    },
    {
      "name": "Gramatyka i ortografia",
      "questions": [
        {
          "content": "Ile przypadków jest w języku polskim?",
          "hints": ["7", "6", "5", "8"]
        }
      ]
    }
  ]
}`;

describe('Test one on one socket events', function () {
  const options = { transports: ['websocket'] };
  let server: ClashServer;
  let client: SocketIOClient.Socket;
  let mongo: MongoMemoryServer;

  before(function (done) {
    this.timeout(6000);
    server = new ClashServer();
    MongoMemoryServer.create()
      .then(mongod => {
        mongo = mongod;
        server.connectMongo(mongo.getUri());
      })
      .then(() => server.start())
      .then(() => {
        client = SocketIOClient.connect('http://localhost:' + server.getPort(), options);

        client.emit('createRoom', { name: 'OneOnOneTestName', password: 'OneOnOneTestPassword' });
        client.once('roomCreated', (roomData: any) => {
          client.emit('authorize', { name: 'OneOnOneTestName', token: roomData.token });
          client.once('authorized', () => {
            client.emit('addQuestionSet', { name: 'oneOnOneTestSet', file: questionSet });
            client.once('success', () => {
              client.emit('changeAccountBalance', { teamName: team, newAccountBalance: 6000 });
              client.once(team + 'AccountBalanceChanged', () => {
                client.emit('startSecondStage');
                client.once('secondStageStarted', () => {
                  done();
                });
              });
            });
          });
        });
      });
  });

  after(async function () {
    client.disconnect();
    await server.disconnectMongo();
    await mongo.stop();
    await server.stop();
  });

  it('Get one on one state during idle stage', function (done) {
    client.emit('getOneOnOneState');
    client.once('oneOnOneState', (data: any) => {
      data.roundStage.should.be.equal('idle');
      done();
    });
  });

  it('Get one on one state during one on one', function (done) {
    client.emit('startOneOnOne');
    client.once('oneOnOneStarted', (data: any) => {
      data.teams.should.have.members([team, 'masters']);
      data.categories.should.have.deep.members([
        { enabled: true, name: 'Pilka nozna' },
        { enabled: true, name: 'Biologia' },
        { enabled: true, name: 'Gramatyka i ortografia' }
      ]);
      client.emit('getOneOnOneState');
      client.once('oneOnOneState', (data: any) => {
        data.roundStage.should.be.equal('oneOnOne');
        data.teams.should.have.members([team, 'masters']);
        data.categories.should.have.deep.members([
          { enabled: true, name: 'Pilka nozna' },
          { enabled: true, name: 'Biologia' },
          { enabled: true, name: 'Gramatyka i ortografia' }
        ]);
        should.not.exist(data.category);
        should.not.exist(data.team);
        done();
      });
    });
  });

  it('One on one category picking', function (done) {
    client.emit('changeCategoryState', { category: 'Pilka nozna', enabled: false });
    client.once('categoryStateChanged', (data: any) => {
      data.category.should.be.equal('Pilka nozna');
      data.enabled.should.be.equal(false);

      client.emit('changeCategoryState', { category: 'Gramatyka i ortografia', enabled: false });
      client.once('categoryStateChanged', (data: any) => {
        data.category.should.be.equal('Gramatyka i ortografia');
        data.enabled.should.be.equal(false);

        client.emit('confirmCategory');
        client.once('categoryConfirmed', (data: any) => {
          data.category.should.be.equal('Biologia');
          client.once('nextQuestion', (data: any) => {
            data.category.should.be.equal('Biologia');
            data.question.should.be.equal('W którym wieku została wymyślona nazwa dziedziny nauki "biologia"?');
            data.hints.should.have.members(['XIX', 'XV', 'XIII', 'XVII']);

            client.emit('chooseTeam', { teamName: team });
            client.once('teamChosen', (data: any) => {
              data.team.should.be.equal(team);
              done();
            });
          });
        });
      });
    });
  });
});
