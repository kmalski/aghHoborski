import { Outgoing } from '../utils/event.constants';
import { UserSocket } from '../utils/socket.utils';
import { RoomModel } from '../models/room.model';
import { QuestionSetModel, QuestionSet, QuestionSetData } from '../models/question.model';

export { addQuestionSet, getAllQuestionSets, changeQuestionSet };

async function addQuestionSet(questionData: QuestionSetData, socket: UserSocket) {
  const questionSet = await QuestionSetModel.findOne({ name: questionData.name });

  if (questionSet) {
    return socket.emit(Outgoing.FAIL, `Zbiór pytań o nazwie ${questionData.name} już istnieje.`);
  }

  const data = JSON.parse(questionData.file);
  const questionSetDb = await QuestionSetModel.create({ name: questionData.name, categories: data.categories });
  await questionSetDb.save();

  await RoomModel.findOneAndUpdate({ name: socket.room.name }, { questions: questionSetDb });

  socket.room.questions = new QuestionSet(questionData.name, data.categories);
  socket.emit(Outgoing.SUCCESS);
}

async function getAllQuestionSets(socket: UserSocket) {
  const questionSetDb = await QuestionSetModel.find().select('name createdAt -_id');

  socket.emit(Outgoing.ALL_QUESTION_SETS, questionSetDb);
}

async function changeQuestionSet(questionData: QuestionSetData, socket: UserSocket) {
  const questionSetDb = await QuestionSetModel.findOne({ name: questionData.name });

  if (!questionSetDb) {
    return socket.emit(Outgoing.FAIL, `Zbiór pytań o nazwie ${questionData.name} nie istnieje.`);
  }
  await RoomModel.findOneAndUpdate({ name: socket.room.name }, { questions: questionSetDb });

  socket.room.questions = new QuestionSet(questionSetDb.name, questionSetDb.categories);
  socket.emit(Outgoing.SUCCESS);
}
