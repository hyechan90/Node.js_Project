const mongoose = require('mongoose');
const connect = require('./index');
const { Schema } = mongoose;
const Users = new Schema({
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

const userModel = mongoose.model('user', Users);
exports.Users = userModel;
