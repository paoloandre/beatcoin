"use strict";

var mongoose = require("mongoose");
var bcryptjs = require("bcryptjs");
var database = require("../config");
// var _CreditCardGenerator = require("../finance/CreditCardGenerator");
// var _CreditCardGenerator2 = _interopRequireDefault(_CreditCardGenerator);

//User schema
var CardSchema = mongoose.Schema({
  panCode: { type: String, required: true, unique: true },
  circuit: { type: String, required: true },
  expDate: { type: String, required: true },
  securityNumb: { type: Number, required: true},
  balance: {type: Number, required: true},
  owner: {type: String, required: true}
});

var Card = module.exports = mongoose.model("Card", CardSchema);

//get user by id
module.exports.getCardById = function (id, callback) {
  Card.findById(id, callback);
};

module.exports.getCardByCircuit = function (circuit, callback) {
  var query = { circuit: circuit };
  Card.findAll(query, callback);
};

module.exports.addCard = function (newCard, callback) {
      newCard.save(callback);
};
