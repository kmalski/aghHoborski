import { Outgoing } from '../utils/event.constants';
import { UserSocket } from '../utils/socket.utils';
import { RoomModel } from '../models/room.model';
import { QuestionSetModel, QuestionSetInternal, QuestionSetShared } from '../models/question.model';

export { addQuestionSet, getAllQuestionSets, changeQuestionSet };

async function addQuestionSet(questionSet: QuestionSetShared, socket: UserSocket) {
  const dbQuestionSet = await QuestionSetModel.findOne({ name: questionSet.name });

  if (dbQuestionSet) {
    return socket.emit(Outgoing.FAIL, `Zbiór pytań o nazwie ${questionSet.name} już istnieje.`);
  }

  const data = JSON.parse(questionSet.file);
  const questions = await QuestionSetModel.create({ name: questionSet.name, categories: data.categories });
  await questions.save();

  await RoomModel.findOneAndUpdate({ name: socket.room.name }, { questions });

  socket.room.questions = new QuestionSetInternal(questionSet.name, data.categories);
  socket.emit(Outgoing.SUCCESS);
}

async function getAllQuestionSets(socket: UserSocket) {
  const questionSets = await QuestionSetModel.find().select('name createdAt -_id');

  socket.emit(Outgoing.ALL_QUESTION_SETS, questionSets);
}

async function changeQuestionSet(questionSet: QuestionSetShared, socket: UserSocket) {
  const dbQuestionSet = await QuestionSetModel.findOne({ name: questionSet.name });
  if (!dbQuestionSet) {
    return socket.emit(Outgoing.FAIL, `Zbiór pytań o nazwie ${questionSet.name} nie istnieje.`);
  }

  await RoomModel.findOneAndUpdate({ name: socket.room.name }, { questions: dbQuestionSet });

  socket.room.questions = new QuestionSetInternal(dbQuestionSet.name, dbQuestionSet.categories);
  socket.emit(Outgoing.SUCCESS);
}
