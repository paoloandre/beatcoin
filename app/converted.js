var express = require('express'),
    app = express(),
    exphbs = require('express-handlebars'),
    handlebars = require('handlebars'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'),
    path = require('path'),
    http = require('http'),
    upload = require('./upload'),
    convert = require('./convert'),
    readjsonfile = require('./readjsonfile'),
    fs = require('fs'),
    config       = require('../config');

    var db;
    var coll;

module.exports = function converted(req, search, res){
  mongodb.MongoClient.connect(config.MONGO_URI, function(err, database) {
    if (err) return console.log(err);
      console.log('DB Connected');
      db = database;
      coll = db.collection('test');

  coll.find({"_id" : mongodb.ObjectId(search)}).toArray(function(err, docs) {
    // console.log(docs);
    if (err)
    {
      console.log('error in db');
      res.end();
      return;
    }
    else if (docs.length == '0')
    {
      console.log('No files found');
      res.send('No files found');
    }
    else
    {
      res.send(docs);
      }
    });
  });

}
