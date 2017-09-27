var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    mongodb = require('mongodb')
    convert = require('./convert');

var id;
var screenid;
var path;

module.exports = function readjsonfile(res, data, db){
  var coll = mongoose.connection.db.collection('test');
  coll.save(data);
  path = "./public/tmp/" + data.metadata.sourceFile;
  id = data._id;
  screenid = 'ID:' + id;
  console.log(screenid);
  fs.unlinkSync(path);
  path = (path.substr(0, path.lastIndexOf('.')) || path) + '.json';
  fs.unlinkSync(path);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify('insert success', null, 3));
}
