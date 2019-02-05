'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NightOwl = new Schema({
   current  : {},
   nightlife: {
      name : String,
      id   : String,
      count: Number
   },
   twitter: {
       id         : String,
       displayName: String,
       username   : String,
       location   : String,
       cache      : Array
   }
});

module.exports = mongoose.model('NightOwl', NightOwl);