module.exports = function (http) {
  const io = require('socket.io')(http, { pingTimeout: 20000, pingInterval: 12000 });
  let users = [];
  
  io.on('connection', function (socket) {
    socket.on('user-connected', function (user) {
      if (users.findIndex(u => u.socketId === socket.id) === -1) {
        user.socketId = socket.id;
        users.forEach(u => socket.emit('user-connected', u)); // let the new user know who all is already connected
        socket.broadcast.emit('user-connected', user);        // let everybody else know that a new user connected
        users.push(user);
      }
    });
    
    socket.on('user-updated', function (user) {
      let index = users.findIndex(u => u.socketId === socket.id);
      users[index] = user;
      users[index].socketId = socket.id;
      socket.broadcast.emit('user-updated', users[index]);
    });
    
    socket.on('begin-typing', function (user) {
      socket.broadcast.emit('begin-typing', user);
    });
    
    socket.on('end-typing', function (user) {
      socket.broadcast.emit('end-typing', user);
    });
    
    socket.on('chat-message', function (msg) {
      socket.broadcast.emit('chat-message', msg);
    });
    
    socket.on('disconnect', function () {
      socket.broadcast.emit('user-disconnected', socket.id);
      users = users.filter(u => u.socketId !== socket.id);
    });
  });
};
