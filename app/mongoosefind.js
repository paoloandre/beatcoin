var express = require('express'),
    mongoose = require('mongoose'),
    mongodb = require('mongodb');

module.exports = function find (collec, query, callback) {
    mongoose.connection.db.collection(collec, function (err, collection) {
    collection.find(query).toArray(callback);
    });
};
