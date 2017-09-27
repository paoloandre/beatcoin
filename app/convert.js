var express = require('express'),
    app = express(),
    PythonShell = require('python-shell'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    path = require('path'),
    upload = require('./upload'),
    readjsonfile = require('./readjsonfile');

module.exports = function convert (req, filename, res){
  filename = './public/tmp/' + filename;
  var truncate = filename.substr(0, filename.lastIndexOf('.')) || filename;
  var options = {
      mode: 'text',
      scriptPath: './scripts',
      args: ['-i', filename, '-o', truncate + '.json']};

  PythonShell.run('converter.py', options, function (err, results) {
      if (err){
        throw err;
      }
        console.log('results: %j', results);
        filename = truncate + '.json';
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(filename, null, 3));
  });
};
