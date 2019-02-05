'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NightOwl = new Schema({
   session  : {},
   nightlife: {
      name : String,
      id   : String,
      count: Number
   },
   twitter: {
       id             : String,
       displayName    : String,
       username       : String,
       location       : String,
       previousSession: String
   }
});

module.exports = mongoose.model('NightOwl', NightOwl);