"use strict";

var mongoose = require("mongoose");
var database = require("../config");

//Transaction schema
var TransactionSchema = mongoose.Schema({
  senderCard: { type: String, required: true },
  receiverCard: { type: String, required: true },
  description: { type: String},
  transactionBalance: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

var Transaction = module.exports = mongoose.model("Transaction", TransactionSchema);
