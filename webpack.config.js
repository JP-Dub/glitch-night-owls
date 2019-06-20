const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
   mode: 'development',
   entry: [
      './app/src/index.js',
      'webpack-dev-middleware/client'
   ],
   output: {
      path: path.join(__dirname, './dist'),
      filename: 'bundle.js'
   },
   devServer: {
      historyApiFallback: true,
      inline: true,
      //hot: true,
      
      // host: 'localhost',
      // port: 3000,
      // proxy : {
      //    '/api/*': {
      //       target: 'http://localhost:8080/api/',
      //       secure: false
      //    }
      // }
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
             include: path.resolve(__dirname, './app/src'),
             use: [
                 'style-loader',
                 'css-loader'
             ]
         }, {
             test: /\.(svg|ttf|woff|woff2|ttf)$/i,
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
         template: './app/dist/index.html',
         inject: 'body',
         showErrors: true,
         cache : true
      }),
      new webpack.HotModuleReplacementPlugin({
         multiStep: true
      })
   ]
}