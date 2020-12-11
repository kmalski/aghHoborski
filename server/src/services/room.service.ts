import bcrypt from 'bcrypt';
import { Server } from 'socket.io';
import { Room } from '../models/room';
import { RoomModel } from '../models/schemas/room.schema';
import { QuestionSetSchema } from '../models/schemas/question.schema';
import { QuestionSet } from '../models/question';
import { ClashSocket } from '../utils/socket.util';
import { Outgoing } from '../events/event.constants';
import { GameListener } from '../events/listeners/game.listener';
import { TeamListener } from '../events/listeners/team.listener';
import { TimeListener } from '../events/listeners/time.listener';
import { HintListener } from '../events/listeners/hint.listener';
import { AuctionListener } from '../events/listeners/auction.listener';
import { QuestionListener } from '../events/listeners/question.listener';

export { RoomData, RoomService, LocalRoomService };

interface RoomData {
  name: string;
  token?: string;
  readonly password?: string;
}

class RoomService {
  protected static ACTIVE_ROOMS: Room[] = [];
  protected static SALT_ROUNDS = 8;

  protected useDatabase = true;

  async create(data: RoomData, socket: ClashSocket): Promise<void | boolean> {
    if (!data.name || !data.password) {
      return socket.emit(Outgoing.WARNING, `Błędne dane.`);
    }

    const name = data.name;
    const dbRoom = await RoomModel.findOne({ name });

    if (dbRoom) {
      return socket.emit(Outgoing.WARNING, `Pokój o nazwie ${name} już istnieje.`);
    }

    const hash = bcrypt.hashSync(data.password, RoomService.SALT_ROUNDS);
    await new RoomModel({ name, hash }).save();

    const room = new Room(name, hash);
    RoomService.ACTIVE_ROOMS.push(room);

    socket.room = room;
    socket.join(socket.room.name);
    socket.emit(Outgoing.ROOM_CREATED, {
      msg: `Pokój o nazwie ${name} został utworzony.`,
      name,
      token: room.token
    });
  }

  join(data: RoomData, socket: ClashSocket, io: Server): void | boolean {
    if (!data.name) {
      return socket.emit(Outgoing.WARNING, `Błędne dane.`);
    }

    const name = data.name;
    const room = RoomService.ACTIVE_ROOMS.find(e => e.name === name);

    if (!room) {
      return socket.emit(Outgoing.WARNING, `Podany pokój nie istnieje lub gra nie jest aktywna.`);
    }

    socket.room = room;
    socket.join(socket.room.name);
    socket.emit(Outgoing.ROOM_JOINED, { msg: `Dołączono do pokoju o nazwie ${name}.`, name });

    // order is important
    QuestionListener.configure({ useDatabase: this.useDatabase });
    QuestionListener.listen(io, socket);
    GameListener.listen(io, socket);
    TeamListener.listen(io, socket);
  }

  async adminJoin(data: RoomData, socket: ClashSocket): Promise<void | boolean> {
    if (!data.name || !data.password) {
      return socket.emit(Outgoing.WARNING, `Błędne dane.`);
    }

    const name = data.name;
    const dbRoom = await RoomModel.findOne({ name }).populate('questions');

    if (!dbRoom || !bcrypt.compareSync(data.password, dbRoom.hash)) {
      return socket.emit(Outgoing.UNAUTHORIZED, `Podany pokój nie istnieje lub hasło jest nieprawidłowe.`);
    }

    let room = RoomService.ACTIVE_ROOMS.find(e => e.name === name);
    if (!room) {
      const questions = dbRoom.questions as QuestionSetSchema;
      room = new Room(name, dbRoom.hash);
      if (questions) {
        room.withQuestions(new QuestionSet(questions.name, questions.categories));
      }
      RoomService.ACTIVE_ROOMS.push(room);
    }

    socket.room = room;
    socket.join(socket.room.name);
    socket.emit(Outgoing.ROOM_JOINED, { msg: `Dołączono do pokoju o nazwie ${name}.`, name, token: room.token });
  }

  authorize(data: RoomData, socket: ClashSocket, io: Server): void | boolean {
    if (!data.token || !data.name) {
      return socket.emit(Outgoing.UNAUTHORIZED, `Brak uprawnień.`);
    }

    const name = data.name;
    const room = RoomService.ACTIVE_ROOMS.find(e => e.name === name);

    if (room == null) {
      return socket.emit(Outgoing.UNAUTHORIZED, `Pokój nie jest już aktywny.`);
    }
    if (room.token !== data.token) {
      return socket.emit(Outgoing.UNAUTHORIZED, `Brak uprawnień.`);
    }

    socket.room = room;
    socket.join(socket.room.name);

    // now we are sure that only authorized sockets will be able to emit game events
    // order is important
    QuestionListener.configure({ useDatabase: this.useDatabase });
    QuestionListener.listen(io, socket);
    QuestionListener.listenAdmin(io, socket);
    GameListener.listen(io, socket);
    GameListener.listenAdmin(io, socket);
    TeamListener.listen(io, socket);
    TeamListener.listenAdmin(io, socket);
    HintListener.listenAdmin(io, socket);
    TimeListener.listenAdmin(io, socket);
    AuctionListener.listenAdmin(io, socket);

    socket.emit(Outgoing.AUTHORIZED);
  }
}

class LocalRoomService extends RoomService {
  protected useDatabase = false;

  async create(data: RoomData, socket: ClashSocket): Promise<void | boolean> {
    if (!data || !data.name || !data.password) {
      return socket.emit(Outgoing.WARNING, `Błędne dane.`);
    }

    const name = data.name;

    if (LocalRoomService.ACTIVE_ROOMS.some(r => r.name === name)) {
      return socket.emit(Outgoing.WARNING, `Pokój o nazwie ${name} już istnieje.`);
    }

    const hash = bcrypt.hashSync(data.password, LocalRoomService.SALT_ROUNDS);
    const room = new Room(name, hash);
    LocalRoomService.ACTIVE_ROOMS.push(room);

    socket.room = room;
    socket.join(socket.room.name);
    socket.emit(Outgoing.ROOM_CREATED, {
      msg: `Pokój o nazwie ${name} został utworzony.`,
      name,
      token: room.token
    });
  }

  async adminJoin(data: RoomData, socket: ClashSocket): Promise<void | boolean> {
    if (!data.name || !data.password) {
      return socket.emit(Outgoing.WARNING, `Błędne dane.`);
    }

    const name = data.name;
    const room = LocalRoomService.ACTIVE_ROOMS.find(e => e.name === name);

    if (!room || !bcrypt.compareSync(data.password, room.hash)) {
      return socket.emit(Outgoing.UNAUTHORIZED, `Podany pokój nie istnieje lub hasło jest nieprawidłowe.`);
    }

    socket.room = room;
    socket.join(socket.room.name);
    socket.emit(Outgoing.ROOM_JOINED, { msg: `Dołączono do pokoju o nazwie ${name}.`, name, token: room.token });
  }
}
