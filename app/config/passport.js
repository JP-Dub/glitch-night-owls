'use strict';

//var GitHubStrategy = require('passport-github').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	
	passport.use(new TwitterStrategy({
    	consumerKey: configAuth.twitter.consumerKey,
    	consumerSecret: configAuth.twitter.consumerSecret,
    	callbackURL: configAuth.twitter.callbackURL//"https://night-owls-jpiazza.c9users.io/auth/twitter/callback"
	},
	function(token, tokenSecret, profile, cb) {
    	User.findOne({ 'twitter.id': profile.id }, function (err, user) {
    		
    		if (err) {
    			console.log("error")
    			return cb(err);
    		}
    		
    		if (user) {
					console.log("RETURNED user")
					return cb(null, user);
				} else {
					
					var newUser = new User();
					
					newUser.twitter.id = profile.id;
					newUser.twitter.username = profile.username;
					newUser.twitter.displayName = profile.displayName;
					newUser.twitter.location = profile._json.location;
					//newUser.nbrClicks.clicks = 0;

					newUser.save(function (err) {
						if (err) return console.error(err);
						console.log("CREATED user")
						return cb(null, newUser);
					});
				}
    	});
	}
	));
	
};
