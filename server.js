'use strict'
const express    = require('express'),
      bodyParser = require('body-parser'),
      routes     = require('./app/routes/index.js'),
	    mongoose   = require('mongoose'),
      passport   = require('passport'),
	    session    = require('express-session'),
      cors       = require('cors'),
	    app        = express();
	
const webpackConfig = require('./webpack.config'),
      webpack       = require('webpack'),
	    compiler      = webpack(webpackConfig);	  
 
require('dotenv').config();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser : true,
	useFindAndModify: false
});
mongoose.Promise = global.Promise;

app.use(
	require("webpack-dev-middleware")(
    compiler, {
      noInfo    : true,
      publicPath: webpackConfig.output.publicPath	
    }
	)
);

app.use(require("webpack-hot-middleware")(compiler));

app.use('/', express.static(process.cwd() + '/app/controllers/'));

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

var port = process.env.PORT || 3000;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});