// var mongoose = require('mongoose'),
// Option = require('../app/schema.js').model('Option');
//
// exports.findAll = function(req, res){
//   var partid = req.params.partid;
//   Option.find({'_part': partid},function(err, docs) {
//     return res.send(docs);
//   });
// };
//
// exports.findById = function(req, res){
//   var id = req.params.id;
//   Option.findOne({'_id':id, '_part': partid},function(err, docs) {
//     return res.send(docs);
//   });
// };
//
// exports.add = function(req, res) {
//   var partid = req.params.partid;
//   Option.create({"nome" : req.body.nome,
//                 "prezzo" : req.body.prezzo,
//                 "forma" : req.body.forma,
//                 "_part": partid}, function (err, docs) {
//     if (err) return console.log(err);
//     return res.send(docs);
//   });
// };
//
// exports.update = function(req, res) {
//   var id = req.params.id;
//   var updates = req.body;
//   console.log(id);
//   Option.update({"_id":id}, req.body,
//     function (err, numberAffected) {
//       if (err) return console.log(err);
//       console.log('Updated %d Lists', numberAffected);
//       return res.sendStatus(202);
//   });
// };
//
// exports.delete = function(req, res) {
//   var id = req.params.id;
//   Option.remove({'_id':id},function(result) {
//     return res.send(result);
//   });
// };
// //
// // exports.import = function(req, res){
// //   Option.create(
// //     { "nome": "Tasto figo", "prezzo": 1, "forma": "/shape/58989010ac3b310e9c419261", "_part": "589a3a2857ba982460b83fb6" },
// //     { "nome": "Testa Yoda", "prezzo": 50, "forma": "/shape/58593a6319290c09984a439b", "_part": "589a3a2857ba982460b83fb7" }
// //   , function (err) {
// //     if (err) return console.log(err);
// //     return res.sendStatus(202);
// //   });
// // };
