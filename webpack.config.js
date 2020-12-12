var path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

var SRC_DIR = path.resolve(__dirname, 'src');
// Github Pages only reads from a folder named `docs/`
var BUILD_DIR = path.resolve(__dirname, 'docs');

var config = {
  entry: [
    SRC_DIR + '/styles/index.scss',
    SRC_DIR + '/js/index.jsx'
  ],
  mode: process.env.NODE_ENV,
  output: {
    path: BUILD_DIR,
    filename: 'index.js'
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          context: `${SRC_DIR}/images`,
          to: BUILD_DIR
        }
      ]
    }),
    new HtmlWebpackPlugin({
      hash: true,
      filename: 'index.html',
      template: './src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css'],
    modules: [
      SRC_DIR + '/styles',
      SRC_DIR + '/js',
      'node_modules'
    ]
  },
  resolveLoader: {
    modules: ['node_modules']
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: process.env.NODE_ENV == 'development' },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: process.env.NODE_ENV == 'development' },
          },
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.jsx?$/u,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      }
    ]
  }
};


if (config.mode == 'development') {

  config.devServer = {
    contentBase: SRC_DIR,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    host: 'localhost',
    hot: true,
    overlay: true,
    port: 3035,
    quiet: false,
    stats: {
      errorDetails: true
    },
    useLocalIp: false,
    watchOptions: {
      ignored: '/node_modules/'
    },

    /*
     * Webpack-dev-server serves assets from memory. Since
     * the images/* files are statically copied (via the
     * `CopyPlugin` above) and not built as a webpack "pack"
     * (using a defined 'entry point') they are not served
     * from webpack dev server's memory. To get around this
     * we write these files to disk and the dev server will
     * fallback to looking for them on the disk since we
     * statically serve everything under the public directory
     */
    writeToDisk: (filePath) => /\/images\//u.test(filePath)
  }

  config.output.publicPath = '/';
}

module.exports = config;
