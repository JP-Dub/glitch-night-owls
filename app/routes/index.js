'use strict';

const Server = require(process.cwd() + '/app/controllers/server.js'),
      path = require('path'); //process.cwd();

module.exports = (app, passport, cors) => {
	
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next()
		} else {
			res.redirect('/auth/twitter')
		}
	}
	
	let handleServer = new Server();
	
// 	app.route('/')
// 		.get( (req, res) => {
// 			res.sendFile(path + '/dist/index.html');
// 		});
	
	app.route('/login/:user')
		.get(isLoggedIn, (req, res) => {
			res.sendFile(process.cwd() + '/dist/index.html');
    //res.json({success: '/login'})
		});
		
	app.route('/user/:location')	
		.get(handleServer.userLocation);
			
	app.route('/businesses/:search')
		.post(handleServer.getNightlife);
	
	app.route('/api/:id/clicks')
		.get(handleServer.getClicks)
		.post(handleServer.addClick);		
		
	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', 
    { failureRedirect: '/' }), (req, res) => {
          let user = req.user.twitter['username'];
    	    res.redirect('/login/' + user);
		});	
		

};

	// let options = ({
	// 	origin : 'https://glitch-night-owls.glitch.me',
	// 	preflightContinue: true,
	// 	optionsSuccessStatus: 200
	//   })