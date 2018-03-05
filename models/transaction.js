"use strict";

var mongoose = require("mongoose");
var database = require("../config");
// var mongoosePaginate = require("mongoose-paginate");

//Transaction schema
var TransactionSchema = mongoose.Schema({
  senderCard: { type: String, required: true },
  receiverCard: { type: String, required: true },
  description: { type: String},
  transactionBalance: { type: Number, required: true },
  accountBalance: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// TransactionSchema.plugin(mongoosePaginate);

var Transaction = module.exports = mongoose.model("Transaction", TransactionSchema);
