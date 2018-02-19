import mongoose from "mongoose"
import config from "../config/database"
import mongoosePaginate from "mongoose-paginate"
//Transaction schema
const TransactionSchema = mongoose.Schema({
  senderCard: { type: String, required: true },
  receiverCard: { type: String, required: true },
  transactionBalance: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

TransactionSchema.plugin(mongoosePaginate);

const Transaction = (module.exports = mongoose.model(
  "Transaction",
  TransactionSchema
));

//get transaction by id
module.exports.getTransactionById = function(id, callback) {
  Transaction.findById(id, callback);
};

module.exports.getTransactionsOfCard = function(card, callback) {
  const query = {
    $or: [{ senderCard: card }, { receiverCard: card }]
  };
  // query of user that is either a sender or a receiver
  Transaction.find(query, callback).sort('-date');
};

module.exports.AddTransaction = function(newTransaction, callback) {
  newTransaction.save(callback);
};
