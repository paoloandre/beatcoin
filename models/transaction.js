"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _database = require("../config/database");

var _database2 = _interopRequireDefault(_database);

var _mongoosePaginate = require("mongoose-paginate");

var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Transaction schema
var TransactionSchema = _mongoose2.default.Schema({
  senderCard: { type: String, required: true },
  receiverCard: { type: String, required: true },
  transactionBalance: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

TransactionSchema.plugin(_mongoosePaginate2.default);

var Transaction = module.exports = _mongoose2.default.model("Transaction", TransactionSchema);

//get transaction by id
module.exports.getTransactionById = function (id, callback) {
  Transaction.findById(id, callback);
};

module.exports.getTransactionsOfCard = function (card, callback) {
  var query = {
    $or: [{ senderCard: card }, { receiverCard: card }]
  };
  // query of user that is either a sender or a receiver
  Transaction.find(query, callback).sort('-date');
};

module.exports.AddTransaction = function (newTransaction, callback) {
  newTransaction.save(callback);
};
