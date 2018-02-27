"use strict";

var mongoose = require("mongoose");
var bcryptjs = require("bcryptjs");
var database = require("../config");
var card = require("../models/card");
// var _CreditCardGenerator = require("../finance/CreditCardGenerator");
// var _CreditCardGenerator2 = _interopRequireDefault(_CreditCardGenerator);

//User schema
var UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, require: true, unique: true },
  password: { type: String, required: true },
  creditCard: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card'}],
  balance: { type: Number, default: 0, required: true },
  erAdmin: { type: Boolean }
});

// Decrypting password to compare
UserSchema.methods.comparePassword = function(password, hash, done) {
  bcryptjs.compare(password, hash, function(err, isMatch) {
    done(err, isMatch);
  });
};

var User = module.exports = mongoose.model("User", UserSchema);

//get user by id
// module.exports.findById = function (id, callback) {
//   User.findById(id, callback);
// };

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
  // Crypting password
    bcryptjs.genSalt(10, function(err, salt) {
      bcryptjs.hash(newUser.password, salt, function(err, hash) {
        if (err) {
          throw err;
        }
        newUser.password = hash;
        newUser.save(callback);
      });
    });
};
