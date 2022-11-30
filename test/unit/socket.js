const chai = require('chai');
const should = chai.should();
const server = require('../../app');

// Client objects for socket.io
const io = require('socket.io-client');
const ioOptions = {
  transports: ['websocket'],
  forceNew: true,
  reconnection: false
};

// Chat participants
let sender = io('http://localhost:3000/', ioOptions);
let receiver = io('http://localhost:3000/', ioOptions);

describe('lib/socket.js', function () {
  it('client should receive a message when another client connects', function (done) {
    sender.emit('user-connected', { username: 'sender' });
    receiver.on('user-connected', function (user) {
      user.should.be.json;
      user.should.have.property('socketId');
      user.should.have.property('username', 'sender');
      done();
    });
  });
  
  it('client should receive a message when another client updates their user information', function (done) {
    sender.emit('user-updated', { username: 'sender' });
    receiver.on('user-updated', function (user) {
      user.should.be.json;
      user.should.have.property('socketId');
      user.should.have.property('username', 'sender');
      done();
    });
  });
  
  it('client should receive a message when another client begins typing a chat message', function (done) {
    sender.emit('begin-typing', { username: 'sender' });
    receiver.on('begin-typing', function (user) {
      user.should.be.json;
      user.should.have.property('username', 'sender');
      done();
    });
  });
  
  it('client should receive a message when another client is no longer typing a chat message', function (done) {
    sender.emit('end-typing', { username: 'sender' });
    receiver.on('end-typing', function (user) {
      user.should.be.json;
      user.should.have.property('username', 'sender');
      done();
    });
  });
  
  it('client should receive a message when another client emits a chat-message', function (done) {
    sender.emit('chat-message', {  username: 'sender',  messageText: 'test message' });
    receiver.on('chat-message', function (msg) {
      msg.should.be.json;
      msg.should.have.property('username', 'sender');
      msg.should.have.property('messageText', 'test message');
      done();
    });
  });
  
  it('client should receive a message when another client disconnects', function (done) {
    sender.disconnect();
    receiver.on('user-disconnected', function (socketId) {
      socketId.should.be.a.string;
      done();
    });
  });
});
