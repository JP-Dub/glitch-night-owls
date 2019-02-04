'use strict';
//var cors = require('cors');
//var Client = require('../controllers/serverSide');
var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport, cors) {
	
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next()
		} else {
			//alert("You're not logged in! The page will refresh and you can try again");
			res.redirect('/auth/twitter')
		}
	}
	
	var clickHandler = new ClickHandler();
	var options = ({
		origin : 'https://jp-dub-night-owls.glitch.me',//'https://www.night-owls-jpiazza.c9users.io:8080',
		preflightContinue: true,
		optionsSuccessStatus: 200
	})
	
	app.route('/')
		.get( function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
	
	app.route('/loggedIn')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/user/:location')	
		.get(clickHandler.userLocation);
			
	app.route('/businesses/:search')
		.get(clickHandler.getNightlife)
		.post(clickHandler.getNightlife);

	
	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(clickHandler.addClick);
		//.delete(isLoggedIn, clickHandler.resetClicks);			
		
	app.get('/auth/twitter', cors(options), passport.authenticate('twitter'));


	app.route('/auth/twitter/callback')
		.get(cors(options), passport.authenticate('twitter', { 
			failureRedirect: '/' }),
			function(req, res) {
    			res.redirect('/loggedIn');
		});	
		

};

		/*.post(function (req, res) {	
			var locale = req.query.location,
				apiKey = process.env.API_KEY;
			
			Client(locale, apiKey, function(data){
				res.json(data);
			});
		});*/

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


/*
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
		
	
	// for cors request
	app.all('*', function(get_request, result, next) {

    var get_response = {
        "AccessControlAllowOrigin": get_request.headers.origin,
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };

    result.header("Access-Control-Allow-Credentials", get_response.AccessControlAllowCredentials);
    result.header("Access-Control-Allow-Origin",  get_response.AccessControlAllowOrigin);
    result.header("Access-Control-Allow-Headers", (get_request.headers['access-control-request-headers']) ? get_request.headers['access-control-request-headers'] : "x-requested-with");
    result.header("Access-Control-Allow-Methods", (get_request.headers['access-control-request-method']) ? get_request.headers['access-control-request-method'] : get_response.AccessControlAllowMethods);

    if ('OPTIONS' == get_request.method) {
        result.send(200);
    }
    else {
        next();
    }

}); 
		
*/