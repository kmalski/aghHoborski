const { normalizeString } = require('../utils');

const rooms = [];

function listen(io, socket) {
  socket.on('createRoom', room => {
    name = normalizeString(room.name);

    if (rooms.some(e => e.name === name)) {
      return socket.emit('warning', `Pokój o nazwie ${name} już istnieje.`);
    }

    room.name = name;
    rooms.push(room);
    socket.room = name;
    socket.join(socket.room);

    socket.emit('roomCreated', { msg: `Pokój o nazwie ${name} został utworzony.`, name });
  });

  socket.on('joinRoom', room => {
    name = normalizeString(room.name);
    const foundRoom = rooms.find(e => e.name === name);
    if (foundRoom == null) {
      return socket.emit('warning', `Pokój o nazwie ${name} nie istnieje.`);
    }

    socket.room = name;
    socket.join(socket.room);

    socket.emit('roomJoined', { msg: `Dołączono do pokoju o nazwie ${name}.`, name });
  });
}

module.exports = {
  listen
};
