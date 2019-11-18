// 로컬 데이터 베이스에 접속
require('dotenv');
const mongoose = require('mongoose');
module.exports = () => {
  mongoose.connect('mongodb://localhost/Project', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = mongoose.connection;

  // 맨 처음 연결
  db.on('error', console.error.bind(console, 'Connection Error:'));
  db.once('open', function callback() {
    console.log('DB On!');
  });

  require('./Users');
};
