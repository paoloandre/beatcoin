// "use strict";
//
// var _express = require("express");
// var _express2 = _interopRequireDefault(_express);
// var _user = require("../models/user");
// var _user2 = _interopRequireDefault(_user);
// var _transaction = require("../models/transaction");
// var _transaction2 = _interopRequireDefault(_transaction);
// var _passport = require("passport");
// var _passport2 = _interopRequireDefault(_passport);
// var _jsonwebtoken = require("jsonwebtoken");
// var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
// var _database = require("../config/database");
// var _database2 = _interopRequireDefault(_database);
// var _bluebird = require("bluebird");
// var _bluebird2 = _interopRequireDefault(_bluebird);
// var _isEmpty = require("lodash/isEmpty");
// var _isEmpty2 = _interopRequireDefault(_isEmpty);
// var _signup = require("../validations/signup");
// var _signup2 = _interopRequireDefault(_signup);
//
// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// var router = _express2.default.Router();
//
// function validateUnique(data, otherValidation) {
//   var _otherValidation = otherValidation(data),
//       errors = _otherValidation.errors;
//
//   return _bluebird2.default.all([
//   /*  Returning the promise */
//   _user2.default.getUserByUsername(data.username, function (err, user) {
//     if (err) throw err;
//
//     if (user) {
//       if (user.username === data.username) {
//         errors.username = "this username is already taken";
//       }
//     }
//   }), _user2.default.getUserByEmail(data.email, function (err, user) {
//     if (err) throw err;
//
//     if (user) {
//       if (user.email === data.email) {
//         errors.email = "this email is already taken";
//       }
//     }
//   })]).then(function () {
//     return {
//       errors: errors,
//       isValid: (0, _isEmpty2.default)(errors)
//     };
//   });
// }
//
// // register route
// router.post("/register", function (req, res) {
//   // timeout for the loading screen thing
//
//   validateUnique(req.body, _signup2.default.validateInput).then(function (_ref) {
//     var errors = _ref.errors,
//         isValid = _ref.isValid;
//
//     if (isValid) {
//       // we actually add the user to the database
//       //create a new user
//       var newUser = new _user2.default({
//         name: req.body.name,
//         email: req.body.email,
//         username: req.body.username,
//         password: req.body.password,
//         passwordConfirmation: req.body.passwordConfirmation
//       });
//       // add a check if username and email already exists and throw that erro
//       // add function user
//       _user2.default.addUser(newUser, function (err, user) {
//         if (err) {
//           res.status(400).json(errors);
//         } else {
//           res.json({ success: true });
//         }
//       });
//     } else {
//       res.json({ errors: errors });
//     }
//   }); // returns isValid and errors
// });
//
// // authentication route
// router.post("/authenticate", function (req, res) {
//   var _req$body = req.body,
//       username = _req$body.username,
//       password = _req$body.password;
//
//
//   _user2.default.getUserByUsername(username, function (err, user) {
//     if (err) throw err;
//     if (!user) {
//       return res.json({ errors: { username: "user not found" } });
//     }
//
//     _user2.default.comparePassword(password, user.password, function (err, isMatch) {
//       if (err) throw err;
//       if (isMatch) {
//         var token = _jsonwebtoken2.default.sign(user, _database2.default.secret, {
//           expiresIn: 604800 // 1 week
//         });
//
//         res.json({
//           success: true,
//           token: token,
//           user: {
//             id: user._id,
//             name: user.name,
//             username: user.username,
//             email: user.email,
//             creditCard: user.creditCard,
//             balance: user.balance
//           }
//         });
//       } else {
//         return res.json({ errors: { password: "wrong password " } });
//       }
//     });
//   });
// });
//
// // profile route USER JWT in front of the tokens, otherwise it won't be able to decode it
// router.get("/profile/:page", _passport2.default.authenticate("jwt", { session: false }), function (req, res) {
//   var userCard = req.user.creditCard;
//   var page = req.params.page;
//   if (req.user == null) {
//     return res.sendStatus(403);
//   }
//   _transaction2.default.paginate(_transaction2.default.find({
//     $or: [{ senderCard: userCard }, { receiverCard: userCard }]
//   }).sort("-date"), { page: page, limit: 20 }, function (err, transactions) {
//     return res.json({ user: req.user, transactions: transactions });
//   });
// });
//
// router.get("/AllTransactions", _passport2.default.authenticate("jwt", { session: false }), function (req, res) {
//   var userCard = req.user.creditCard;
//   if (userCard === null) {
//     return res.sendStatus(403);
//   }
//   _transaction2.default.getTransactionsOfCard(userCard, function (err, transactions) {
//     if (err) {
//       console.log("couldn't fetch the transactions ");
//       return res.sendStatus(404);
//     } else {
//       return res.json({ transactions: transactions });
//     }
//   });
// });
//
// router.put("/transfer", _passport2.default.authenticate("jwt", { session: false }), function (req, res) {
//   // sender and receiver are card numbers
//   var sender = req.body.sender;
//   var receiver = req.body.receiver;
//   var amount = req.body.amount;
//
//   if (req.body == null || req.body.sender == 0 || req.body.receiver == 0 || req.body.amount <= 0 || req.body.sender == undefined || req.body.receiver == undefined || req.body.amount == undefined || req.body.sender == null || req.body.receiver == null || req.body.amount == null) {
//     return res.sendStatus(403);
//   }
//
//   _user2.default.getUserByCard(sender, function (err, sender) {
//     if (err) {
//       res.sendStatus(404);
//     }
//     if (!sender) {
//       res.sendStatus(404);
//     }
//
//     // check if the sender is in the range of 0 or more and that the transaction is less than his actual balance
//     // we got a valid sender at  this point
//     if (sender.balance > 0 && sender.balance >= amount) {
//       _user2.default.getUserByCard(receiver, function (err, receiver) {
//         if (err) {
//           return res.sendStatus(404);
//         }
//         if (!receiver) {
//           return res.sendStatus(404);
//         }
//
//         // we found both the sender and the receiver info are here
//         // we have sender + receiver + amount here
//         var newTransaction = new _transaction2.default({
//           senderCard: sender.creditCard, // sender and receiver are cards here
//           receiverCard: receiver.creditCard,
//           transactionBalance: amount
//         });
//
//         _transaction2.default.AddTransaction(newTransaction, function (err, transaction) {
//           if (err) {
//             console.log("transaction was not registered, something went buggy");
//             return res.sendStatus(500);
//           } else {
//             console.log("transaction was successfully registered on the database");
//           }
//         });
//
//         var newSenderBalance = sender.balance - parseFloat(amount);
//         var newReceiverBalance = parseFloat(receiver.balance) + parseFloat(amount);
//         _user2.default.update({ _id: sender._id }, { $set: { balance: newSenderBalance } }, function (err, nbRows, raw) {
//           if (err) {
//             return res.sendStatus(500);
//           } else {
//             console.log("the sender lost his money");
//           }
//         });
//
//         _user2.default.update({ _id: receiver._id }, { $set: { balance: newReceiverBalance } }, function (err, nbRows, raw) {
//           if (err) {
//             return res.sendStatus(500);
//           } else {
//             console.log("transaction was successfull");
//           }
//         });
//
//         return res.json({
//           transaction: { newBalanceSender: newSenderBalance, msg: "The transfer was successfull !" }
//         });
//       });
//     } else {
//       return res.json({ msg: "not enough funds to do this transaction :( " });
//     }
//   });
// });
//
// module.exports = router;
