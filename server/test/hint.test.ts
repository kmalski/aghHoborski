import { should } from 'chai';
import { describe, before, after, it } from 'mocha';
import { Socket, io } from 'socket.io-client';

import { ClashServer } from '../src/server';

should();

const team = 'green';
const questionSet = {
  'categories': [
    {
      'name': 'Pilka nozna',
      'questions': [
        {
          'content': 'W którym roku Polska zdobyła mistrzostwo olimpijskie w piłce nożnej?',
          'hints': ['1972', '1960', '1952', '1976']
        }
      ]
    }
  ]
};

describe('Test hint socket events', function () {
  const options = { transports: ['websocket'] };
  let server: ClashServer;
  let client: Socket;

  before(function (done) {
    this.timeout(60000);
    server = new ClashServer();
    server.start()
      .then(() => {
        client = io('http://localhost:' + server.getPort(), options);

        client.emit('createRoom', { name: 'HintTestName', password: 'HintTestPassword' });
        client.once('roomCreated', (roomData: any) => {
          client.emit('authorize', { name: 'HintTestName', token: roomData.token });
          client.once('authorized', () => {
            client.emit('addQuestionSet', { name: 'hintTestSet', questionSet });
            client.once('success', () => {
              client.emit('startAuction', { categoryName: 'Pilka nozna' });
              client.once('auctionStarted', () => {
                client.emit('changeAuctionAmount', { teamName: team, newAuctionAmount: 1000 });
                client.once(team + 'AuctionAmountChanged', () => {
                  client.emit('finishAuction');
                  client.once('auctionFinished', () => {
                    done();
                  });
                });
              });
            });
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

  it('Discard hint amount', function (done) {
    client.emit('startHintAuction');
    client.once('hintAuctionStarted', (data: any) => {
      data.hintAmount.should.be.equal(0);
      client.emit('changeHintAmount', { newHintAmount: 500 });
      client.once('hintAmountChanged', (data: any) => {
        data.hintAmount.should.be.equal(500);
        client.emit('discardHintAmount');
        client.once('hintAuctionFinished', () => {
          client.once('hintAmountChanged', (data: any) => {
            data.hintAmount.should.be.equal(0);
            done();
          });
        });
      });
    });
  });

  it('Accept hint amount and use bought hint', function (done) {
    client.emit('startHintAuction');
    client.once('hintAuctionStarted', (data: any) => {
      data.hintAmount.should.be.equal(0);
      client.emit('changeHintAmount', { newHintAmount: 400 });
      client.once('hintAmountChanged', (data: any) => {
        data.hintAmount.should.be.equal(400);
        client.emit('acceptHintAmount');
        client.once('hintAuctionFinished', () => {
          client.once(team + 'HintsCountChanged', (data: any) => {
            data.hintsCount.should.be.equal(1);
            client.once(team + 'AccountBalanceChanged', (data: any) => {
              data.accountBalance.should.be.equal(3600);
              client.once('hintAmountChanged', (data: any) => {
                data.hintAmount.should.be.equal(0);
                done();
                client.emit('useHint');
                client.once('hintUsed', (data: any) => {
                  data.hints.should.have.length(4);
                  client.once(team + 'HintsCountChanged', (data: any) => {
                    data.hintsCount.should.be.equal(0);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
