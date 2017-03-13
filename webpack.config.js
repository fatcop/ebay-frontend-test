const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const productionPluginDefine = isProduction ? [
  new webpack.DefinePlugin({'process.env': {
    'NODE_ENV': JSON.stringify('production'),
    serverRendering: true
  }})
] : [
  new webpack.DefinePlugin({'process.env': {
    serverRendering: false
  }})
  
];

const clientPlugins = isProduction ? productionPluginDefine.concat([
  // new webpack.optimize.DedupePlugin(),
  // new webpack.optimize.OccurrenceOrderPlugin(),
  // new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false })
]) : [];

const serverPlugins = isProduction ? productionPluginDefine.concat([
  // new webpack.optimize.DedupePlugin(),
  // new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({ compress: false, sourceMap: true })
  ,new ExtractTextPlugin({
    filename: 'assets/app.css',
    disable: false,
    allChunks: true
  })
]) : [];

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "8888";

const commonExclude = /(node_modules|dist)/;
const distPath = path.join(__dirname, 'dist');

const commonLoaders = [{
  test: /\.jsx?$/,
  exclude: commonExclude,
  use: [
    {
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    },
  ]
}];

const clientLoaders = [
  ...commonLoaders,
  {
    test: /\.scss$/,
    exclude: commonExclude,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
    })
  }
];

const serverLoaders = clientLoaders;
// [
//   ...commonLoaders,
  // {
  //   test: /\.scss$/,
  //   exclude: commonExclude,
  //   use: [
  //     {
  //       loader: 'css-loader',
  //       options: {
  //         sourceMap: true
  //       }
  //     },
  //     'postcss-loader',
  //     'sass-loader'
  //   ]
  // }  
// ];

const commonResolve = {
  extensions: ['.js', '.jsx']
};

const config = [
  {
    devtool: 'eval-source-map',
    entry: [
      './src/app/browser.js' // app's entry point
    ],
    output: {
      publicPath: '/',
      path: path.join(distPath, 'assets'),
      filename: 'bundle.js',
      sourceMapFilename: 'bundle.js.map'
    },
    resolve: commonResolve,
    module: {
      rules: clientLoaders
    },
    devServer: {
      contentBase: distPath,
      // do not print bundle build stats
      noInfo: true,
      // enable HMR
      hot: true,
      // embed the webpack-dev-server runtime into the bundle
      inline: true,
      // serve index.html in place of 404 responses to allow HTML5 history
      historyApiFallback: true,
      port: PORT,
      host: HOST
    },
    plugins: [
      ...clientPlugins,
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: './src/template.html',
        inject: true,
        hash: isProduction
      }),
      new CopyWebpackPlugin([
        {
          from: 'src/app/assets'
        }
      ])
      ,new ExtractTextPlugin({
        filename: 'assets/app.css',
        disable: false,
        allChunks: true
      })
    ],
  }
];

if (isProduction) {

  // Node server config (for server side rendering)

  config.push({
    entry: './src/server.js',
    output: {
      path: distPath,
      filename: 'server.js',
      libraryTarget: 'commonjs2',
      publicPath: '/'
    },
    target: 'node',
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false
    },
    resolve: commonResolve,
    externals: nodeExternals(),
    plugins: serverPlugins,
    module: {
      rules: serverLoaders
    }
  });
}

module.exports = config;