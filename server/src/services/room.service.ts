import bcrypt from 'bcrypt';
import { Server } from 'socket.io';
import { RoomModel, RoomShared, RoomInternal } from '../models/room.model';
import { QuestionSetInternal, QuestionSetSchema } from '../models/question.model';
import { Outgoing } from '../utils/event.constants';
import { UserSocket } from '../utils/socket.utils';
import * as game from '../sockets/game.socket';

export { join, adminJoin, create, authorize };

const saltRounds = 8;
const activeRooms: RoomInternal[] = [];

async function create(roomData: RoomShared, socket: UserSocket) {
  if (!roomData.name || !roomData.password) {
    return socket.emit(Outgoing.WARNING, `Błędne dane.`);
  }

  const name = roomData.name;
  const dbRoom = await RoomModel.findOne({ name });

  if (dbRoom) {
    return socket.emit(Outgoing.WARNING, `Pokój o nazwie ${name} już istnieje.`);
  }

  const hash = bcrypt.hashSync(roomData.password, saltRounds);
  await new RoomModel({ name, hash }).save();

  const room = new RoomInternal(name);
  activeRooms.push(room);

  socket.room = room;
  socket.join(socket.room.name);
  socket.emit(Outgoing.ROOM_CREATED, {
    msg: `Pokój o nazwie ${name} został utworzony.`,
    name,
    token: room.token
  });
}

function join(roomData: RoomShared, socket: UserSocket, io: Server) {
  if (!roomData.name) {
    return socket.emit(Outgoing.WARNING, `Błędne dane.`);
  }

  const name = roomData.name;
  const room = activeRooms.find(e => e.name === name);

  if (!room) {
    return socket.emit(Outgoing.WARNING, `Podany pokój nie istnieje lub gra nie jest aktywna.`);
  }

  socket.room = room;
  socket.join(socket.room.name);
  socket.emit(Outgoing.ROOM_JOINED, { msg: `Dołączono do pokoju o nazwie ${name}.`, name });

  game.listen(io, socket);
}

async function adminJoin(roomData: RoomShared, socket: UserSocket) {
  if (!roomData.name || !roomData.password) {
    return socket.emit(Outgoing.WARNING, `Błędne dane.`);
  }

  const name = roomData.name;
  const dbRoom = await RoomModel.findOne({ name }).populate('questions');

  if (!dbRoom || !bcrypt.compareSync(roomData.password, dbRoom.hash)) {
    return socket.emit(Outgoing.UNAUTHORIZED, `Podany pokój nie istnieje lub hasło jest nieprawidłowe.`);
  }

  let room = activeRooms.find(e => e.name === name);
  if (!room) {
    const questions = dbRoom.questions as QuestionSetSchema;
    room = new RoomInternal(name);
    if(questions) {
      room.withQuestions(new QuestionSetInternal(questions.name, questions.categories));
    }
    activeRooms.push(room);
  }

  socket.room = room;
  socket.join(socket.room.name);
  socket.emit(Outgoing.ROOM_JOINED, { msg: `Dołączono do pokoju o nazwie ${name}.`, name, token: room.token });
}

function authorize(roomData: RoomShared, socket: UserSocket, io: Server) {
  if (!roomData.token || !roomData.name) {
    return socket.emit(Outgoing.UNAUTHORIZED, `Brak uprawnień.`);
  }

  const name = roomData.name;
  const room = activeRooms.find(e => e.name === name);

  if (room == null) {
    return socket.emit(Outgoing.UNAUTHORIZED, `Pokój nie jest już aktywny.`);
  }
  if (room.token !== roomData.token) {
    return socket.emit(Outgoing.UNAUTHORIZED, `Brak uprawnień.`);
  }

  socket.room = room;
  socket.join(socket.room.name);
  socket.emit(Outgoing.AUTHORIZED);

  // now we are sure that only authorized sockets will be able to emit game events
  game.listen(io, socket);
  game.listenAdmin(io, socket);
}
