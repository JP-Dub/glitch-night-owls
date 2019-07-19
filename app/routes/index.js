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
			res.redirect('/auth/twitter')
		}
	}
	
	let clickHandler = new ClickHandler();
	// let options = ({
	// 	origin : 'https://glitch-night-owls.glitch.me',
	// 	preflightContinue: true,
	// 	optionsSuccessStatus: 200
	//   })
	
	app.route('/')
		.get( (req, res) => {
			res.sendFile(path + '/public/index.html');
		});
	
	app.route('/login/:user')
		.get(isLoggedIn, (req, res) => {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/user/location')	
		.get(clickHandler.userLocation);
			
	app.route('/businesses/:search')
		.post(clickHandler.getNightlife);
	
	app.route('/api/:id/clicks')
		.get(clickHandler.getClicks)
		.post(clickHandler.addClick);		
		
	app.get('/auth/twitter', cors(), passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(cors(), passport.authenticate('twitter', 
      { failureRedirect: '/' }), (req, res) => {
        let user = req.user.twitter['username'];
    	  res.redirect('/login/' + user);
		});	
		

};

/*
	app.route('/loggedUser')
		.get(isLoggedIn, (req, res) => {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/user/:location')	
		.get(clickHandler.userLocation);
			
	app.route('/businesses/:search')
		.post(clickHandler.getNightlife);
	
	app.route('/api/:id/clicks')
		.get(clickHandler.getClicks)
		.post(clickHandler.addClick);		
		
	app.get('/auth/twitter', cors(), passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(cors(), passport.authenticate('twitter', 
      { failureRedirect: '/' }), (req, res) => {
    	    res.redirect('/loggedUser');
		});	
*/