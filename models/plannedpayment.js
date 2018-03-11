"use strict";

var mongoose = require("mongoose");
var database = require("../config");

//PlannedPayment schema
var PlannedSchema = mongoose.Schema({
  user: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true}
});

var Planned = module.exports = mongoose.model("Planned", PlannedSchema);
