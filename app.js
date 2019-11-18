const express = require('express');
const app = express();
const io = require('socket.io')(3000);
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

app.use(express.static('DB'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { Users } = require('./DB/Users');

/* GET home page. */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

app.post('/register', (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    user.save((err, result) => {
      if (err) throw err;
      console.log(result);
    });
  } catch (err) {
    console.error('회원가입 실패', err);
  }
});

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', {
      message: message,
      name: users[socket.id]
    });
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});

app.listen(80, () => {
  console.log('Listening in port 80');
});
