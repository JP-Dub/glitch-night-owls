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
  function checkit(next) {
    console.log('looks like we made it')
    return next()
  }
	
	app.route( '/login/:user' ) // '/login/:user'
		.get(isLoggedIn, (req, res) => {
      console.log(req.user.twitter)
      //res.redirect('/user/' + req.user.twitter['location']);
			res.sendFile( process.cwd() + '/public/index.js' );
    //res.json({success: req.url, user: req.user.twitter['username']})
		});
		
	app.route( '/user/:location' )	
		.get( handleServer.userLocation );
			
	app.route( '/businesses/:search' )
		.post( checkit(), handleServer.getNightlife );
	
	app.route( '/:id/clicks' )
		.get(  handleServer.getClicks )
		.post( handleServer.addClick );		
		
	app.get( '/auth/twitter', passport.authenticate( 'twitter' ) );

	app.route( '/auth/twitter/callback' )
		.get( passport.authenticate( 'twitter', {failureRedirect: '/'} ), 
        (req, res) => {
          let user = req.user.twitter['username'];
          console.log(req.user.twitter)
    	    res.redirect('/login/' + user);
          //res.redirect('/')
		});	
		

};

	// let options = ({
	// 	origin : 'https://glitch-night-owls.glitch.me',
	// 	preflightContinue: true,
	// 	optionsSuccessStatus: 200
	//   })