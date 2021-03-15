const mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/Shopping", {
  useNewUrlParser: true,
});

const User = mongoose.model(
  "User",
  new Schema({
    name: { type: String, required: true },
    pass: { type: String, required: true }
  })
);

module.exports = User;