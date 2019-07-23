'use strict';

//var GitHubStrategy = require('passport-github').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy,
      User            = require('../models/users'),
      configAuth      = require('./auth');

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
    	consumerKey    : configAuth.twitter.consumerKey,
    	consumerSecret : configAuth.twitter.consumerSecret,
    	callbackURL    : configAuth.twitter.callbackURL
	},
	function(token, tokenSecret, profile, cb) {
    	User.findOne({ 'twitter.id': profile.id }, function (err, user) {
    		
    		if (err) return cb(err);	
    		
    		if (user) {
					
					return cb(null, user);
				} else {
					
					var newUser = new User();
					
					newUser.twitter.id          = profile.id;
					newUser.twitter.username    = profile.username;
					newUser.twitter.displayName = profile.displayName;
					newUser.twitter.location    = profile._json.location;

					newUser.save(function (err) {
						if (err) return console.error(err);
						
						return cb(null, newUser);
					});
				}
    	});
	}
	));
	
};
