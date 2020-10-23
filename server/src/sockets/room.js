const { join, create, adminJoin, getState, adminGetState } = require('../services/room');

module.exports = {
  listen
};

function listen(io, socket) {
  socket.on('createRoom', room => create(room, socket));
  socket.on('joinRoom', room => join(room, socket));
  socket.on('adminJoinRoom', room => adminJoin(room, socket));
  socket.on('getState', room => getState(room, socket));
  socket.on('adminGetState', room => adminGetState(room, socket));
}
