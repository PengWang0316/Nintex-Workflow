const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin'); // Does not support Webpack 4 right now.
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = {
  // entry: {
  //   app: [
  //     'react-hot-loader/patch',
  //     './app/index.js'
  //   ],
  //   vendor: ['react', 'react-dom', 'axios', 'redux', 'redux-thunk', 'prop-types']
  // },
  entry: [
    './app/javascript/index.js',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      { test: /\.(js)$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      // { test: /\.global\.css$/, use: ['style-loader', 'css-loader'], exclude: /\.module\.css$/ },
      // {
      //   test: /\.css$/,
      //   use: [
      //     'style-loader',
      //     { loader: 'css-loader', options: { sourceMap: true, modules: true, localIdentName: '[local]___[hash:base64:5]' } },
      //   ],
      //   exclude: /\.global\.css$/,
      // },
      { test: /\.(png|jpg|gif)$/, use: ['file-loader'] },
    ],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    https: true,
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'app/index.html' }),
    // new webpack.NamedModulesPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.optimize.CommonsChunkPlugin({  Deprecated
    //   name: 'vendor', // Specify the common bundle's name.
    //   minChunks: Infinity
    // }),
    new CopyWebpackPlugin([
      // Copy directory contents to {output}/
      { from: 'app/assets', to: 'assets' },
    ]),
    // new InjectManifest({
    //   swSrc: './app/service-worker.js',
    //   swDest: './service-worker.js',
    // }),
    // new BundleAnalyzerPlugin() // Analyze the bundle file.
  ],
};

if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
  /*
  config.module.rules[2] = ({ // In production model, replace the css rules in order to use ExtractTextPlugin. My css rules is in the position 2.
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1, sourceMap: true, modules: true, localIdentName: '[local]___[hash:base64:5]'
          }
        }
      ]
    }),
    exclude: /\.global\.css$/
  });
*/

  config.module.rules[1] = ({
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          sourceMap: true,
          modules: true,
          // localIdentName: '[local]___[hash:base64:5]',
          minimize: {
            safe: true,
          },
        },
      },
    ],
    exclude: /\.global\.css$/,
  });

  config.mode = 'production';

  config.plugins.push(
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    //   }
    // }),
    // new ExtractTextPlugin({ filename: '[name].css', allChunks: true }), // Extract css to one file.
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          // remove warnings
          warnings: false,
          sequences: true, // Join consecutive simple statements using the comma operator
          dead_code: true,
          conditionals: true, // Apply optimizations for if-s and conditional expressions.
          booleans: true,
          unused: true, // Drop unreferenced functions and variables.
          if_return: true,
          join_vars: true,
          drop_console: true,
        },
      },
    }),
  );
}

module.exports = config;
