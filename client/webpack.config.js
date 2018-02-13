const path = require('path');
const webpack = require('webpack');
require('dotenv').config()

module.exports = {
  entry: path.resolve('./src/index.jsx'),
  output: {
    path: path.resolve('./public'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react']
        }
      },
      {
        test: /\.(scss|css)$/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: 65,
              },
              svggo: {},
              webp: {
                quality: 65
              }
            }
          },
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'REST_SERVER_URL': JSON.stringify(process.env.REST_SERVER_URL),
        'SOCKET_SERVER_URL': JSON.stringify(process.env.SOCKET_SERVER_URL),
        'DEV_REST_SERVER_URL': JSON.stringify(process.env.DEV_REST_SERVER_URL),
        'DEV_SOCKET_SERVER_URL': JSON.stringify(process.env.DEV_SOCKET_SERVER_URL),
        'GOOGLE_MAPS_API': JSON.stringify(process.env.GOOGLE_MAPS_API),
        'GOOGLE_GEO_API': JSON.stringify(process.env.GOOGLE_GEO_API)
      }
    }),
  ]
}