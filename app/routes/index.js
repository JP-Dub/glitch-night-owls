'use strict';
//var cors = require('cors');
//var Client = require('../controllers/serverSide');
let path = process.cwd();
const ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = (app, passport, cors) => {
	
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next()
		} else {
			//alert("You're not logged in! The page will refresh and you can try again");
			res.redirect('/auth/twitter')
		}
	}
	
	let clickHandler = new ClickHandler();
	let options = ({
		origin : 'https://glitch-night-owls.glitch.me',//'https://www.night-owls-jpiazza.c9users.io:8080',
		preflightContinue: true,
		optionsSuccessStatus: 200
	})
	
	app.route('/')
		.get( (req, res) => {
			res.sendFile(path + '/public/index.html');
		});
	
	app.route('/loggedUser')
		.get(isLoggedIn, (req, res) => {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/user/:location')	
		.get(clickHandler.userLocation);
    //.post(clickHandler.logUserLocale);
			
	app.route('/businesses/:search')
		//.get(clickHandler.getNightlife) // not being used
		.post(clickHandler.getNightlife);
	
	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(clickHandler.addClick);
		//.delete(isLoggedIn, clickHandler.resetClicks);			
		
	app.get('/auth/twitter', cors(options), passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(cors(options), passport.authenticate('twitter', 
      { failureRedirect: '/' }), (req, res) => {
			 // function(req, res) {
    	    res.redirect('/loggedUser');
		});	
		

};