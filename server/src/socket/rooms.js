module.exports = {
  listen
};

function listen(io, socket) {
  socket.on('createRoom', data => {
    console.log(data);
  });

  socket.on('joinRoom', data => {
    console.log(data);
  });
}
