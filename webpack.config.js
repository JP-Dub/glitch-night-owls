const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
   mode: 'development',
   entry: [
       './public/index.js',
       'webpack-hot-middleware/client',
       'react-hot-loader/patch',
   ],
   output: {
      path: path.join(__dirname, './dist'),
      filename: 'bundle.js'
   },
   devServer: {
      historyApiFallback: true,
      inline: true,
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
        title : '/login/',
        template: './dist/index.html',
        inject: 'body',
      }),
      new HtmlWebpackPlugin({
         template: './dist/index.html',
         inject: 'body',
         showErrors: true,
         cache : true
      }),
      new webpack.HotModuleReplacementPlugin({
         multiStep: true
      })
   ]
}