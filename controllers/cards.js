var mongoose = require('mongoose'),
Card = require('../app/schema.js').model('Card');

exports.findAll = function(req, res){
  Card.find({},function(err, docs) {
    return res.send(docs);
  });
};

exports.findById = function(req, res){
  var id = req.params.id;
  Card.findOne({'_id':id},function(err, docs) {
    return res.send(docs);
  });
};

exports.add = function(req, res) {
  Card.create(req.body, function (err, docs) {
    if (err) return console.log(err);
    return res.send(docs);
  });
};

exports.update = function(req, res) {
  var id = req.params.id;
  var updates = req.body;
  console.log(id);
  Card.update({"_id":id}, req.body,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated %d Cards', numberAffected);
      return res.sendStatus(202);
  });
};

exports.delete = function(req, res) {
  var id = req.params.id;
  Card.remove({'_id':id},function(result) {
    return res.send(result);
  });
};
