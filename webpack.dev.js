const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 9000,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  watchOptions: {
    ignored: /node_modules|dist/,
    aggregateTimeout: 300,
    poll: false,
  },
  performance: {
    hints: false,
  },
});