'use strict';

let path = process.cwd();
const ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = (app, passport, cors) => {
	
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/auth/twitter');
		}
	}
	
	const clickHandler = new ClickHandler();
	let options = ({
	  origin : 'https://glitch-night-owls.glitch.me',
		preflightContinue: true,
		optionsSuccessStatus: 200
	});
	
	app.route('/')
		.get( (req, res) => {
			res.sendFile(path + '/public/index.html');
		});
	
	app.route('/login/:user')
		.get(isLoggedIn, (req, res) => {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/user/location')	
		.get(isLoggedIn, clickHandler.userLocation);
			
	app.route('/businesses/:search')
		.post(clickHandler.getNightlife);
	
	app.route('/api/:id/clicks')
		.get( clickHandler.getClicks)
		.post(isLoggedIn, cors(), clickHandler.addClick);		
		
	app.get('/auth/twitter', cors(), passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(cors(), passport.authenticate('twitter', 
      { failureRedirect: '/' }), (req, res) => {
        res.redirect('/login/' + req.user.twitter['username']);
		});	
		
};