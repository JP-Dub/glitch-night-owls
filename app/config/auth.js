'use strict';

module.exports = {
	'githubAuth': {
		'clientID': process.env.GITHUB_KEY,
		'clientSecret': process.env.GITHUB_SECRET,
		'callbackURL': process.env.APP_URL + 'auth/github/callback'
	},
	'yelpAuth' : {
		'client': process.env.YELP_CLIENT,
		'clientKey' : process.env.API_KEY
	},
	'twitter' : {
		'consumerKey' : process.env.TWITTER_KEY,
		'consumerSecret': process.env.TWITTER_SECRET,
		'callbackURL': process.env.TWITTER_URL
	}
};
