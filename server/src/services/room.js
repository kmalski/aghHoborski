const bcrypt = require('bcrypt');
const saltRounds = 10;
const { normalizeString, generateToken } = require('../helpers/utils');
const { Room } = require('../helpers/db');

module.exports = {
  join,
  adminJoin,
  create,
  getState,
  adminGetState
};

const activeRooms = [];

async function create(room, socket) {
  if (room.name == null || room.password == null) {
    return socket.emit('warning', `Błędne dane.`);
  }

  const name = normalizeString(room.name);
  room.name = name;

  const foundRoom = await Room.findOne({ name });
  if (foundRoom) {
    return socket.emit('warning', `Pokój o nazwie ${name} już istnieje.`);
  }

  const hash = bcrypt.hashSync(room.password, saltRounds);
  await new Room({ name, hash }).save();

  const token = generateToken();
  activeRooms.push({ name, token });
  socket.room = room;
  socket.join(socket.room.name);

  socket.emit('roomCreated', { msg: `Pokój o nazwie ${name} został utworzony.`, name, token });
}

function join(room, socket) {
  if (room.name == null) {
    return socket.emit('warning', `Błędne dane.`);
  }

  const name = normalizeString(room.name);
  room.name = name;

  if (!activeRooms.some(e => e.name === name)) {
    return socket.emit('warning', `Podany pokój nie istnieje lub gra nie jest aktywna.`);
  }

  socket.room = room;
  socket.join(socket.room.name);

  socket.emit('roomJoined', { msg: `Dołączono do pokoju o nazwie ${name}.`, name });
}

async function adminJoin(room, socket) {
  if (room.name == null || room.password == null) {
    return socket.emit('warning', `Błędne dane.`);
  }

  const name = normalizeString(room.name);
  room.name = name;

  const foundRoom = await Room.findOne({ name });
  if (!foundRoom || !bcrypt.compareSync(room.password, foundRoom.hash)) {
    return socket.emit('unauthorized', `Podany pokój nie istnieje lub hasło jest nieprawidłowe.`);
  }

  let activeRoom = activeRooms.find(e => e.name === name);
  if (!activeRoom) {
    const token = generateToken();
    activeRoom = { name, token };
    activeRooms.push(activeRoom);
  }

  socket.room = room;
  socket.join(socket.room.name);

  socket.emit('roomJoined', { msg: `Dołączono do pokoju o nazwie ${name}.`, name, token: activeRoom.token });
}

function getState(room, socket) {
  socket.emit('state');
}

function adminGetState(room, socket) {
  if (room.token == null || room.name == null) {
    return socket.emit('unauthorized', `Brak uprawnień.`);
  }

  const name = normalizeString(room.name);
  const foundRoom = activeRooms.find(e => e.name === room.name);
  if (foundRoom == null) {
    return socket.emit('unauthorized', `Pokój już nie jest aktywny.`);
  }
  if (foundRoom.token !== room.token) {
    return socket.emit('unauthorized', `Brak uprawnień.`);
  }

  socket.room = foundRoom;
  socket.join(socket.room.name);
  socket.emit('state');
}
