const { normalizeString } = require('../utils');

const rooms = [];

function listen(io, socket) {
  socket.on('createRoom', room => {
    //TODO: encode the password
    if (room.name == null) return;
    name = normalizeString(room.name);

    if (rooms.some(e => e.name === name)) {
      return socket.emit('warning', `Pokój o nazwie ${name} już istnieje.`);
    }

    room.name = name;
    room.admins = [socket.id];
    rooms.push(room);
    socket.room = room;
    socket.join(socket.room.name);

    socket.emit('roomCreated', { msg: `Pokój o nazwie ${name} został utworzony.`, name });
  });

  socket.on('joinRoom', room => {
    if (room.name == null) return;
    name = normalizeString(room.name);

    if (!rooms.some(e => e.name === name)) {
      return socket.emit('warning', `Podany pokój nie istnieje.`);
    }

    socket.room = room;
    socket.join(socket.room.name);

    socket.emit('roomJoined', { msg: `Dołączono do pokoju o nazwie ${name}.`, name });
  });

  socket.on('adminJoinRoom', room => {
    if (room.name == null) return;
    name = normalizeString(room.name);

    const foundRoom = rooms.find(e => e.name === name);
    if (foundRoom == null || foundRoom.password !== room.password) {
      return socket.emit('warning', `Podany pokój nie istnieje lub hasło jest nieprawidłowe.`);
    }

    foundRoom.admins.push(socket.id);
    socket.room = room;
    socket.join(socket.room.name);

    socket.emit('roomJoined', { msg: `Dołączono do pokoju o nazwie ${name}.`, name });
  });
}

module.exports = {
  listen
};
