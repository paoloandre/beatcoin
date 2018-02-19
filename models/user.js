"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _database = require("../config/database");

var _database2 = _interopRequireDefault(_database);

var _CreditCardGenerator = require("../finance/CreditCardGenerator");

var _CreditCardGenerator2 = _interopRequireDefault(_CreditCardGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//User schema
var UserSchema = _mongoose2.default.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, require: true, unique: true },
  password: { type: String, required: true },
  passwordConfirmation: { type: String, required: true },
  creditCard: {
    type: String,
    default: _CreditCardGenerator2.default.GenCC().toString(),
    required: true
  },
  balance: { type: Number, default: 0, required: true },
  erAdmin: { type: Boolean }
});

var User = module.exports = _mongoose2.default.model("User", UserSchema);

//get user by id
module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByUsername = function (username, callback) {
  var query = { username: username };
  User.findOne(query, callback);
};

module.exports.getUserByCard = function (creditCard, callback) {
  var query = { creditCard: creditCard };
  User.findOne(query, callback);
};

module.exports.getUserByEmail = function (email, callback) {
  var query = { email: email };
  User.findOne(query, callback);
};

module.exports.addUser = function (newUser, callback) {
  //hash the password passed here as a param
  _bcryptjs2.default.genSalt(10, function (err, salt) {
    _bcryptjs2.default.hash(newUser.password, salt, function (err, hash) {
      if (err) {
        throw err;
      }
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  _bcryptjs2.default.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};
