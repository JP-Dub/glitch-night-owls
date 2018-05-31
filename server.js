'use strict';

var express = require('express'),
    routes = require('./app/routes/index.js'),
	mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session'),
    cors = require('cors'),
    app = express();

//app.options('*', cors());    
 
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI, {useMongoClient : true});
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.set('trust proxy', 1);
app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true,
	cookie : {
	    secure: true
		}
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport, cors);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
