import { should } from 'chai';
import { describe, before, after, it } from 'mocha';
import { Socket, io } from 'socket.io-client';

import { ClashServer } from '../src/server';

should();

const questionSet = {
  'categories': [
    {
      'name': 'Pilka nozna',
      'questions': [
        {
          'content': 'W którym roku Polska zdobyła mistrzostwo olimpijskie w piłce nożnej?',
          'hints': ['1972', '1960', '1952', '1976']
        },
        {
          'content': 'Kto był selekcjonerem reprezentacji Polski w piłce nożnej w latach 2000-2002?',
          'hints': ['Jerzy Engel', 'Janusz Wójcik', 'Paweł Janas', 'Zbigniew Boniek']
        }
      ]
    }
  ]
};

describe('Test game socket events', function () {
  const options = { transports: ['websocket'] };
  let server: ClashServer;
  let client: Socket;

  before(function (done) {
    this.timeout(60000);
    server = new ClashServer();
    server.start()
      .then(() => {
        client = io('http://localhost:' + server.getPort(), options);

        client.emit('createRoom', { name: 'GameTestName', password: 'GameTestPassword' });
        client.once('roomCreated', (roomData: any) => {
          client.emit('authorize', { name: 'GameTestName', token: roomData.token });
          client.once('authorized', () => {
            client.emit('addQuestionSet', { name: 'gameTestSet', questionSet });
            client.once('success', () => done());
          });
        });
      });
  });

  after(function (done) {
    client.disconnect();
    server
      .stop()
      .then(() => done());
  });

  it('Has lost when all money not greater than 200', function (done) {
    client.emit('changeAccountBalance', { teamName: 'blue', newAccountBalance: 199 });
    client.once('blueAccountBalanceChanged', (data: any) => {
      data.accountBalance.should.be.equal(199);
      data.hasLost.should.be.equal(true);
      done();
    });
  });

  it('Check game setttings', function (done) {
    client.emit('getGameSettings');
    client.once('gameSettings', (data: any) => {
      data.should.have.length(3);
      data.should.have.deep.members([
        { name: 'Nazwa pokoju', value: 'GameTestName' },
        { name: 'Ilość osób w pokoju', value: 1 },
        { name: 'Nazwa puli pytań', value: 'gameTestSet' }
      ]);
      done();
    });
  });

  it('Start second stage', function (done) {
    client.emit('resetGame');
    client.once('gameReset', () => {
      client.emit('startSecondStage');
      client.once('secondStageStarted', () => {
        client.emit('getGameState');
        client.once('gameState', (data: any) => {
          data.stageNumber.should.be.equal(2);

          client.emit('getTeamState', { teamName: 'masters' });
          client.once('mastersTeamState', (data: any) => {
            data.isInGame.should.be.equal(true);
            data.hasLost.should.be.equal(false);
            data.accountBalance.should.be.equal(10000);

            client.emit('getTeamState', { teamName: 'red' });
            client.once('redTeamState', (data: any) => {
              data.isInGame.should.be.equal(true);
              data.hasLost.should.be.equal(false);
              data.accountBalance.should.be.equal(5000);
              done();
            });
          });
        });
      });
    });
  });
});
