require('babel-core/register')({
  presets: ['es2015-node5'],
});

const webpack = require('webpack');
const path = require('path');
const autoprefix = require('autoprefixer');
const precss = require('precss');
const config = require('../universal/config');

const WebpackIsomorphicPlugin = require('webpack-isomorphic-tools/plugin');
const isomorphicPlugin = new WebpackIsomorphicPlugin(require('./isomorphic'));
const nodeModulesPath = path.resolve(__dirname, '..', 'node_modules');

const wpConfig = {
  // Entry point to the project
  entry: {
    vendor: config.get('vendor_dependencies'),
  },
  context: path.resolve(__dirname, '..'),
  /*
  node: {
    fs: 'empty',
    child_process: 'empty'
  },*/
  // Webpack config options on how to obtain modules
  resolve: {
    // When requiring, you don't need to add these extensions
    extensions: ['', '.js', '.jsx'],
    root: path.resolve(__dirname, '..'),
  },
  output: {
    path: config.get('dist_path'), // Path of output file
    publicPath: config.get('webpack_public_path'),
    filename: '[name].js',  // Name of output file
  },
  plugins: [
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __API_ROOT__: JSON.stringify(config.get('__API_ROOT__')),
      __DEV__: config.get('__DEV__'),
      __DEVTOOLS__: config.get('__DEVTOOLS__'),
    }),
    config.get('__DEV__') ? isomorphicPlugin.development() : isomorphicPlugin,
  ],
  module: {
    loaders: [{
      test: /\.(js|jsx)$/, // All .js and .jsx files
      loader: 'babel', // babel loads jsx and es6-7
      include: [path.resolve(__dirname, '..')],
      exclude: [nodeModulesPath],  // exclude node_modules so that they are not all compiled
      query: {
        // cacheDirectory: true,
        plugins: ['transform-decorators-legacy'],
        presets: ['es2015', 'react', 'stage-0'],
        env: {
          development: {
            plugins: [
              ['react-transform', {
                transforms: [{
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module'],
                }],
              }],
            ],
          },
          production: {
            plugins: [
              'transform-react-remove-prop-types',
              'transform-react-inline-elements',
              'transform-react-constant-elements',
            ],
          },
        },
      },
    }, {
      test: isomorphicPlugin.regular_expression('images'),
      loader: 'url-loader?limit=10240',
      // any image below or equal to 10K will be converted to inline base64 instead
    }],
  },
  postcss: function postcss() {
    // return [autoprefix({ browsers: ['> 5%', 'last 2 versions'] }), precss];
    return [autoprefix, precss];
  },
};

wpConfig.cssTestRe = /\.(css|scss)$/;
wpConfig.cssTransformer = `css?modules&importLoaders=1&sourceMap&
  localIdentName=[local]___[hash:base64:5]!postcss?parser=postcss-scss`;

module.exports = wpConfig;
