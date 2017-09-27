var express = require('express'),
    app = express(),
    exphbs = require('express-handlebars'),
    handlebars = require('handlebars'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'),
    path = require('path'),
    http = require('http'),
    fs = require('fs'),
    config = require('../config');

    var db;
    var coll;

  module.exports = function getshapes(req, res) {
  mongodb.MongoClient.connect(config.MONGO_URI, function(err, database) {
    if (err) return console.log(err);
      console.log('DB Connected');
      db = database;
      coll = db.collection('test');

  coll.find({}, {"_id" : true, "metadata.sourceFile" : true}).toArray(function(err, docs) {
  if (err)
  {
    console.log('error in db');
    res.end();
    return;
  }
  else if (docs.length == '0')
  {
    console.log('No files found');
    res.json({docs:'No shapes found'});
    // mongodb.MongoClient.disconnect();
    // console.log('disconnected');
  }
  else
  {
    return res.json(docs);
    // mongodb.MongoClient.disconnect();
    // console.log('disconnected');
  }
})
});
}
