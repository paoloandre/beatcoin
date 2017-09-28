// var mongoose = require('mongoose'),
// Part = require('../app/schema.js').model('Part');
//
// exports.findAll = function(req, res){
//   var objectid = req.params.objectid;
//   Part.find({'_object': objectid},function(err, docs) {
//     return res.send(docs);
//   });
// };
//
// exports.findById = function(req, res){
//   var id = req.params.id;
//   Part.findOne({'_id': id, '_object': objectid},function(err, docs) {
//     return res.send(docs);
//   });
// };
//
// exports.add = function(req, res) {
//   var objectid = req.params.objectid;
//   Part.create({"nome" : req.body.nome, "_object": objectid}, function (err, docs) {
//     if (err) return console.log(err);
//     return res.send(docs);
//   });
// };
//
// exports.update = function(req, res) {
//   var id = req.params.id;
//   var updates = req.body;
//   console.log(id);
//   Part.update({"_id":id}, req.body,
//     function (err, numberAffected) {
//       if (err) return console.log(err);
//       console.log('Updated %d Lists', numberAffected);
//       return res.sendStatus(202);
//   });
// };
//
// exports.delete = function(req, res) {
//   var id = req.params.id;
//   Part.remove({'_id':id},function(result) {
//     return res.send(result);
//   });
// };
