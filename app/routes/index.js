'use strict';
//var cors = require('cors');
//var Client = require('../controllers/serverSide');
const path = process.cwd();
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
	
// 	app.route('/')
// 		.get( (req, res) => {
// 			res.sendFile(path + '/dist/index.html');
// 		});
	
	app.route('/loggedUser')
		.get(isLoggedIn, (req, res) => {
			res.sendFile(path + '/dist/index.html');
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
		

};

	// let options = ({
	// 	origin : 'https://glitch-night-owls.glitch.me',
	// 	preflightContinue: true,
	// 	optionsSuccessStatus: 200
	//   })