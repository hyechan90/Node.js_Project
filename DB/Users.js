const mongoose = require('mongoose');
const connect = require('./index');
const { Schema } = mongoose;
const UsersSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

connect();

module.exports = mongoose.model('Users', UsersSchema);
