'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
   nightlife: {
      id : String,
      going: Number,
      cache: Array
   },
   twitter: {
       id: String,
       displayName: String,
       username: String,
       location: String
   }
});

module.exports = mongoose.model('User', User);