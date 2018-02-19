import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import config from "../config/database";
import generator from "../finance/CreditCardGenerator";

//User schema
const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, require: true, unique: true },
  password: { type: String, required: true },
  passwordConfirmation: { type: String, required: true },
  creditCard: {
    type: String,
    default: generator.GenCC().toString(),
    required: true
  },
  balance: { type: Number, default: 0, required: true },
  erAdmin: { type: Boolean }
});

const User = (module.exports = mongoose.model("User", UserSchema));

//get user by id
module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback) {
  const query = { username: username };
  User.findOne(query, callback);
};

module.exports.getUserByCard = function(creditCard, callback) {
  const query = { creditCard: creditCard };
  User.findOne(query, callback);
};

module.exports.getUserByEmail = function(email, callback) {
  const query = { email: email };
  User.findOne(query, callback);
};

module.exports.addUser = (newUser, callback) => {
  //hash the password passed here as a param
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        throw err;
      }
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
