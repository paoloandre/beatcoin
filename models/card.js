"use strict";

var mongoose = require("mongoose");
var bcryptjs = require("bcryptjs");
var database = require("../config");

//User schema
var CardSchema = mongoose.Schema({
  panCode: { type: String, required: true, unique: true },
  circuit: { type: String, required: true },
  expDate: { type: String, required: true },
  securityNumb: { type: Number, required: true},
  balance: {type: Number, required: true},
  owner: {type: String, required: true},
  visible: {type: Boolean, required: true, default: true}
});

var Card = module.exports = mongoose.model("Card", CardSchema);

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
