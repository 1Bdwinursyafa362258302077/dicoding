const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  performance: {
    hints: 'warning',
  },
  plugins: [
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: path.resolve(__dirname, 'src/scripts/sw.js'),
      swDest: './sw.js',
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
    }),
  ],
});