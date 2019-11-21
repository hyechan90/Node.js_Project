const express = require('express');
const app = express();
const io = require('socket.io')(3000);
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
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

app.post('/login', (req, res) => {
  const input = {
    name: req.body.name,
    password: req.body.password
  };
  const user = new Users({ input });
  user.findOne({ name: input.name }, (err, result) => {
    if (err) throw err;
    if (!result) {
      console.log('아이디가 잘못되었습니다.');
      alert('아이디가 잘못되었습니다.');
    } else {
    }
  });
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

app.post('/register', (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const input = {
      name: req.body.name,
      email: req.body.email,
      password: hash
    };
    const user = new Users({ input });
    user.save((err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect('/login');
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
