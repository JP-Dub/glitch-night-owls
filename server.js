'use strict'
const express    = require('express'),
      bodyParser = require('body-parser'),
      routes     = require('./app/routes/index.js'),
	    mongoose   = require('mongoose'),
      passport   = require('passport'),
	    session    = require('express-session'),
      cors       = require('cors'),
	    app        = express();
	
const webpackDevServer = require('./node_modules/webpack-dev-server/lib/Server'),
	    webpackConfig = require('./webpack.config'),
      webpack       = require('webpack'),
	    compiler      = webpack(webpackConfig);	
 
require('dotenv').config();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser : true,
	useFindAndModify: false
});

mongoose.Promise = global.Promise;

const devServerOptions = Object.assign({}, webpackConfig.devServer, {
	open: true,
	stats: {
		colors: true
	}
});

const server = new webpackDevServer(compiler, devServerOptions);


// app.use(
// 	require("webpack-dev-middleware")(
//     compiler, {
//       noInfo    : true,
//       publicPath: webpackConfig.output.publicPath	
//     }
// 	)
// );

// app.use(require("webpack-hot-middleware")(compiler));

//app.use('/', express.static(process.cwd() + '/app/controllers/'));

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

// server.listen(8081, () => {
//   console.log('Server listening...')
// })


server.listen(8081, '127.0.0.1', () => {
	console.log('Webpack Dev Server listening on 8081...')
});

