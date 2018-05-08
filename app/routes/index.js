'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var Client = require('../controllers/serverSide');

module.exports = function (app, passport) {
	
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
	
	var clickHandler = new ClickHandler();

	app.route('/')
		.get( function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get( function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
		
	app.route('/businesses/:search')
		.post(function (req, res) { 
			var locale = req.query.location,
				apiKey = process.env.API_KEY;
			Client(locale, apiKey, function(data){
				res.json(data);
			});
		});
		
	app.route('/auth/twitter')	
	    .get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', { 
			failureRedirect: '/login' }),
			function(req, res) {
    			// Successful authentication, redirect home.
    			res.redirect('/');
		});	
		
	/*
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
		*/
};