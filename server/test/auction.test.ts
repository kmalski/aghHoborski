import chai from 'chai';
import { describe, before, after, it } from 'mocha';
import { Socket, io } from 'socket.io-client';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { ClashServer } from '../src/server';

const should = chai.should();

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

describe('Test auction socket events', function () {
  const options = { transports: ['websocket'] };
  let server: ClashServer;
  let client: Socket;
  let mongo: MongoMemoryServer;

  before(function (done) {
    this.timeout(60000);
    server = new ClashServer();
    MongoMemoryServer.create({ instance: { dbName: 'auction.test' } })
      .then(mongod => {
        mongo = mongod;
        server.connectMongo(mongo.getUri());
      })
      .then(() => server.start())
      .then(() => {
        client = io('http://localhost:' + server.getPort(), options);

        client.emit('createRoom', { name: 'AuctionTestName', password: 'AuctionTestPassword' });
        client.once('roomCreated', (roomData: any) => {
          client.emit('authorize', { name: 'AuctionTestName', token: roomData.token });
          client.once('authorized', () => {
            client.emit('addQuestionSet', { name: 'auctionTestSet', questionSet });
            client.once('success', () => done());
          });
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

  it('Auction with black box as prize and out of the game', function (done) {
    client.emit('startAuction', { categoryName: 'blackBox' });
    client.once('auctionStarted', (data: any) => {
      data.category.should.be.equal('blackBox');
      client.once('yellowAuctionAmountChanged', (data: any) => {
        data.auctionAmount.should.be.equal(200);
        client.emit('changeAuctionAmount', { teamName: 'yellow', newAuctionAmount: 500 });
        client.once('yellowAuctionAmountChanged', (data: any) => {
          data.auctionAmount.should.be.equal(500);
          client.emit('changeAuctionAmount', { teamName: 'blue', newAuctionAmount: 500 });
          client.emit('changeAuctionAmount', { teamName: 'red', newAuctionAmount: 4900 });
          client.once('redAuctionAmountChanged', (data: any) => {
            data.auctionAmount.should.be.equal(4900);
            client.emit('finishAuction');
            client.once('auctionFinished', () => {
              client.emit('startNewRound');
              client.once('newRound', () => done());
            });
            client.once('redHasLostChanged', (data: any) => {
              data.hasLost.should.be.equal(true);
            });
            client.once('redBlackBoxChanged', (data: any) => {
              data.hasBlackBox.should.be.equal(true);
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
      client.emit('startAuction', { categoryName: 'hint' });
      client.once('auctionStarted', (data: any) => {
        data.category.should.be.equal('hint');
        client.once('greenAuctionAmountChanged', (data: any) => {
          data.auctionAmount.should.be.equal(200);
          client.emit('changeAuctionAmount', { teamName: 'blue', newAuctionAmount: 4000 });
          client.once('blueAuctionAmountChanged', (data: any) => {
            data.auctionAmount.should.be.equal(4000);
            client.emit('changeAuctionAmount', { teamName: 'green', newAuctionAmount: 4100 });
            client.once('greenAuctionAmountChanged', (data: any) => {
              data.auctionAmount.should.be.equal(4100);
              client.emit('finishAuction');
              client.once('auctionFinished', () => {
                client.emit('startNewRound');
                client.once('newRound', () => done());
              });
              client.once('greenHintsCountChanged', (data: any) => {
                data.hintsCount.should.be.equal(1);
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
      client.emit('startAuction', { categoryName: 'hint' });
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
              client.once('auctionFinished', (data: any) => {
                should.not.exist(data.winningTeam);
                client.emit('getGameState');
                client.once('gameState', (data: any) => {
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
});
