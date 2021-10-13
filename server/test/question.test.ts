import { should } from 'chai';
import { describe, before, after, it } from 'mocha';
import { Socket, io } from 'socket.io-client';

import { ClashServer } from '../src/server';

should();

const validQuestionSet = {
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
    },
    {
      'name': 'Geografia',
      'questions': [
        {
          'content': 'Jakie jezioro jest największe na świecie?',
          'hints': ['Morze Kaspijskie', 'Jezioro Wiktorii', 'Bajkał', 'Jezioro Górne']
        },
        {
          'content': 'Ile łącznie szczytów liczy Korona Gór Polski?',
          'hints': ['28', '22', '26', '30']
        }
      ]
    }
  ]
};

describe('Test question socket events', function () {
  const options = { transports: ['websocket'] };
  let server: ClashServer;
  let client: Socket;

  before(function (done) {
    this.timeout(60000);
    server = new ClashServer();
    server.start()
      .then(() => {
        client = io('http://localhost:' + server.getPort(), options);

        client.emit('createRoom', { name: 'QuestionTestName', password: 'QuestionTestPassword' });
        client.once('roomCreated', (roomData: any) => {
          client.emit('authorize', { name: 'QuestionTestName', token: roomData.token });
          client.once('authorized', () => done());
        });
      });
  });

  after(function (done) {
    client.disconnect();
    server
      .stop()
      .then(() => done());
  });

  it('Add new question set', function (done) {
    client.emit('addQuestionSet', { name: 'testSet', questionSet: validQuestionSet });
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
    client.emit('addQuestionSet', { name: 'testSet2', questionSet: validQuestionSet });
    client.once('success', () => {
      client.emit('changeQuestionSet', { name: 'testSet2' });
      client.once('success', () => done());
    });
  });

  it('Get question set', function (done) {
    client.emit('getQuestionSet', { name: 'testSet2' });
    client.once('questionSet', (data: any) => {
      data.name.should.be.equal('testSet2');
      data.owner.should.be.equal('QuestionTestName');
      data.isPrivate.should.be.equal(true);
      done();
    });
  });

  it('Change visibility', function (done) {
    client.emit('changeVisibility', { name: 'testSet2', isPrivate: false });
    client.once('visibilityChanged', (data: any) => {
      data.isPrivate.should.be.equal(false);
      data.name.should.be.equal('testSet2');
      done();
    });
  });

  it('Get all visible question sets', function (done) {
    client.emit('getAllQuestionSets');
    client.once('allQuestionSets', (data: any) => {
      data.roomName.should.be.equal('QuestionTestName');
      data.questionSets.forEach(x => x.should.satisfy(q => q.isPrivate === false || q.owner === 'QuestionTestName'));
      done();
    });
  });
});
