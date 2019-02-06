'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NightOwl = new Schema({
   session  : {},

   twitter: {
     id             : String,
     displayName    : String,
     username       : String,
     location       : String,
     previousSession: String,
     nightlife      : {
       name : String,
       id   : String,
       count: Number
     },
   }
});

module.exports = mongoose.model('NightOwl', NightOwl);