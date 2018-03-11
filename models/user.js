"use strict";

var mongoose = require("mongoose");
var bcryptjs = require("bcryptjs");
var database = require("../config");
var card = require("../models/card");

//User schema
var UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, require: true, unique: true },
  password: { type: String, required: true },
  creditCard: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card'}],
  balance: { type: Number, default: 0, required: true },
  balanceHistory: [{type: String}],
  dateHistory: [{type: Date}],
  enabled: { type: Boolean, default: true}
});

// Decrypting password to compare
UserSchema.methods.comparePassword = function(password, hash, done) {
  bcryptjs.compare(password, hash, function(err, isMatch) {
    done(err, isMatch);
  });
};

var User = module.exports = mongoose.model("User", UserSchema);

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
