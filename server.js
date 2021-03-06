'use strict'
const express    = require('express'),
      bodyParser = require('body-parser'),
      routes     = require('./app/routes/index.js'),
      mongoose   = require('mongoose'),
      passport   = require('passport'),
      session    = require('express-session'),
      cors       = require('cors'),
      app        = express();

//app.options('/', cors()); 
  
let options = ({
	origin : 'https://night-owls.glitch.me',
	preflightContinue: true,
  optionsSuccessStatus: 200
});

app.use(cors(options));
 
require('dotenv').config();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser : true,
	useFindAndModify: false
});

mongoose.Promise = global.Promise;

app.use('/app', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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

const port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
