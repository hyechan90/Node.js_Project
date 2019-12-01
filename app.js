const express = require('express');
const app = express();
const io = require('socket.io')(3000);
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.static('DB'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const { Users } = require('./DB/Users');
let me = null;

/* GET home page. */
app.get('/', (req, res) => {
  console.log('connected');
  if (me == null) {
    res.redirect('/login');
  } else {
    res.redirect('/main');
  }
});

app.get('/main', (req, res) => {
  if (me == null) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/public/main.html');
  }
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', (req, res) => {
  const user = new Users({
    name: req.body.name,
    password: req.body.password
  });
  Users.findOne({ name: user.name })
    .then(result => {
      if (result == null) {
        res.redirect('/login');
      } else {
        return result;
      }
    })
    .then(result => {
      return bcrypt.compare(req.body.password, result.password);
    })
    .then(samePassword => {
      if (samePassword) {
        console.log('로그인 성공!');
        me = req.body.name;
        onlineUsers++;
        res.redirect('/main');
      } else {
        console.log('로그인 실패');
        res.redirect('/login');
      }
    })
    .catch(err => {
      console.error('로그인 실패', err);
    });
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
      res.redirect('/login');
    });
  } catch (err) {
    console.error('회원가입 실패', err);
  }
});

io.on('connection', socket => {
  socket.on('new-user', () => {
    socket.broadcast.emit('user-connected', me);
  });
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', {
      message: message,
      name: me
    });
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', me);
    me = null;
  });
});

app.listen(80, () => {
  console.log('Listening in port 80');
});
