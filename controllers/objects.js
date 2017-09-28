// var mongoose = require('mongoose'),
// Object = require('../app/schema.js').model('Object');
//
// exports.findAll = function(req, res){
//   var listid = req.params.listid;
//   Object.find({'_list': listid},function(err, docs) {
//     return res.send(docs);
//   });
// };
//
// exports.findById = function(req, res){
//   var id = req.params.id;
//   Object.findOne({'_id': id, '_list': listid},function(err, docs) {
//     return res.send(docs);
//   });
// };
//
// exports.add = function(req, res) {
//   var listid = req.params.listid;
//   Object.create({"nome": req.body.nome, "descrizione": req.body.descrizione, "_list": listid}, function (err, docs) {
//     if (err) return console.log(err);
//     return res.send(docs);
//   });
// };
//
// exports.update = function(req, res) {
//   var id = req.params.id;
//   var updates = req.body;
//   console.log(id);
//   Object.update({"_id":id}, req.body,
//     function (err, numberAffected) {
//       if (err) return console.log(err);
//       console.log('Updated %d Lists', numberAffected);
//       return res.sendStatus(202);
//   });
// };
//
// exports.delete = function(req, res) {
//   var id = req.params.id;
//   Object.remove({'_id':id},function(result) {
//     return res.send(result);
//   });
// };
