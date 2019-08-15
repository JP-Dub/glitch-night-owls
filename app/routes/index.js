'use strict';

let path = process.cwd();
const ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = (app, passport, cors) => {
	
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}
	
	const clickHandler = new ClickHandler();
	
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
  
  app.route('/rsvp/demo')
     .get( (req, res) => {
      res.sendFile(path + '/public/index.html');
  });
	
	app.route('/rsvp/clicks')
		.get( clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick);	
  
  app.route('/api/resetRSVP')
    .put( clickHandler.resetRSVP );
		 
	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get( passport.authenticate('twitter', { failureRedirect: '/' }), 
         (req, res) => {
           res.redirect('/login/' + req.user.twitter['username']);
		});	
		
};