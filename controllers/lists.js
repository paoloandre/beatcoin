var mongoose = require('mongoose'),
List = require('../app/schema.js').model('List');

exports.findAll = function(req, res){
  List.find({},function(err, docs) {
    return res.send(docs);
  });
};

exports.findById = function(req, res){
  var id = req.params.id;
  List.findOne({'_id':id},function(err, docs) {
    return res.send(docs);
  });
};

exports.add = function(req, res) {
  List.create(req.body, function (err, docs) {
    if (err) return console.log(err);
    return res.send(docs);
  });
};

exports.update = function(req, res) {
  var id = req.params.id;
  var updates = req.body;
  console.log(id);
  List.update({"_id":id}, req.body,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated %d Lists', numberAffected);
      return res.sendStatus(202);
  });
};

exports.delete = function(req, res) {
  var id = req.params.id;
  List.remove({'_id':id},function(result) {
    return res.send(result);
  });
};
