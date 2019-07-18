const HtmlWebpackPlugin = require('html-webpack-plugin'),
      webpack = require('webpack'),
      path    = require('path');

module.exports = {
   mode: 'production',
   target: 'node',
   entry: './public/index.js',
   output: {
      path: path.join(__dirname, './dist'),
      filename: '[name].bundle.js',
      publicPath: '/'
   },
   // devServer: {
   //   //useLocalIp: true,
   //   stats: 'errors-only',
   //   //https: true,
   //    historyApiFallback: true,
   //    inline: true,
   //    port: 3000,
   //    //host: 'https://glitch-night-owls.glitch.me',
   //    //host: '172.17.0.1',
   //    public: 'glitch-night-owls.glitch.me',
   //    allowedHosts: ['https://glitch-night-owls.glitch.me',
   //                   'http://glitch-night-owls.glitch.me',
   //                   'https://api.glitch.com',
   //                   'https://glitch.com'],
   //    // proxy: {
   //    //    '/api' : {
   //    //       target: 'https://glitch-night-owls.glitch.me',
   //    //       //target: 'http://localhost:8080',
   //    //       //target: 'https://api.glitch.com:8080',
   //    //       //target: 'https://172.17.0.1:8080',
   //    //       //target: 'node',
   //    //       pathRewrite : {'^/api' : ''},
   //    //       secure: true
   //    //    }
   //    // }     
   // },
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
               presets: ['@babel/preset-env', '@babel/preset-react']
            }
         }, {
             test: /\.css$/,
             include: path.resolve(__dirname, './public/css'),
             use: [
                 'style-loader',
                 'css-loader'
             ]
         }, {
             test: /\.(png|jpe?g|gif|svg|ttf|woff|woff2|ttf)$/,
             include: path.resolve(__dirname, './public'),
             use: [
                 {
                loader: 'file-loader',
                options: {},
               },
            ],
          },
      ],
   },
   plugins:[
     new HtmlWebpackPlugin({
         template: './dist/index.html',
         inject: 'body',
         showErrors: true,
         cache : true
      }),
      // new webpack.HotModuleReplacementPlugin({
      //    multiStep: false
      // })
   ]
}

/*
   entry: [
      './public/index.js',
      'webpack-hot-middleware/client',
      'react-hot-loader/patch'
   ], 
*/

/*
module.exports = {
   // mode: 'development',
   entry: './public/index.js',
   output: {
      path: path.join(__dirname, './dist'),
      filename: '[name].bundle.js',
      publicPath: '/'
   },
   devServer: {
      historyApiFallback: true,
      inline: true,
      port: 8081,
       host: 'glitch-night-owls.glitch.me',
      // allowedHosts: ['glitch-night-owls.glitch.me'],
      proxy: {
         '/api' : {
            target: 'https://glitch-night-owls.glitch.me',
            pathRewrite : {'^/api' : ''},
            secure: false
         }
      }     
   },
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
               presets: ['@babel/preset-env', '@babel/preset-react']
            }
         }, {
             test: /\.css$/,
             include: path.resolve(__dirname, './public/css'),
             use: [
                 'style-loader',
                 'css-loader'
             ]
         }, {
             test: /\.(svg|ttf|woff|woff2|ttf)$/i,
             include: path.resolve(__dirname, './public/fonts'),
             use: [
                 {
                     loader: 'url-loader',
                     options: {
                        limit: 8192,
                     },
                 },
             ],
         }, {
             test: /\.(png|jpe?g|gif)$/,
             include: path.resolve(__dirname, './public/img'),
             use: [
                 {
                loader: 'file-loader',
                options: {},
               },
            ],
          },
      ],
   },
   plugins:[
     new HtmlWebpackPlugin({
         template: './dist/index.html',
         inject: 'body',
         showErrors: true,
         cache : true
      }),
      // new webpack.HotModuleReplacementPlugin({
      //    multiStep: false
      // })
   ]
}
*/