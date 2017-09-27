var express = require('express'),
    fileUpload = require('express-fileupload'),
    bodyParser = require('body-parser'),
    app = express(),
    mongodb = require('mongodb'),
    path = require('path'),
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    convert = require('./convert');

app.use(express.static('app'));
app.use(fileUpload());

module.exports = function upload(req, res) {
  var filename = req.files.file.name;
  var ext = path.extname(filename);
  if (ext != '.obj')
   {
    console.log('File is not .obj');
    res.redirect(505, 'Error in file inserted');
  }
  else {
    var target_path = './public/tmp/' + filename;
    req.files.file.mv(target_path,function (err){
        if (err) throw err;
            console.log('File uploaded!');
            convert(req, filename, res);
    });
  };
};
