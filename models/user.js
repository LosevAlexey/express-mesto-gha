const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://i.ytimg.com/vi/OaeJDxg2Prk/maxresdefault.jpg',
  },
});


module.exports = mongoose.model('user', userSchema);