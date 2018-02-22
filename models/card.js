"use strict";

var _mongoose = require("mongoose");
var _mongoose2 = _interopRequireDefault(_mongoose);
var _bcryptjs = require("bcryptjs");
var _bcryptjs2 = _interopRequireDefault(_bcryptjs);
var _database = require("../config");
var _database2 = _interopRequireDefault(_database);
// var _CreditCardGenerator = require("../finance/CreditCardGenerator");
// var _CreditCardGenerator2 = _interopRequireDefault(_CreditCardGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//User schema
var CardSchema = _mongoose2.default.Schema({
  panCode: { type: String, required: true, unique: true },
  circuit: { type: String, required: true },
  expDate: { type: Date, required: true },
  securityNumb: { type: Number, required: true}
});

var Card = module.exports = _mongoose2.default.model("Card", CardSchema);

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
