const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader/dist/index');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const packageName = require('./package.json').name;
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    library: `${packageName}`,
    libraryTarget: 'umd',
    // webpack5 jsonpFunction 改成了 chunkLoadingGlobal
    chunkLoadingGlobal: `webpackJsonp_${packageName}`
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './dist'),
      publicPath: '/',
    },
    port: 8081,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      filename: 'index.html',
      title: 'qiankun-vue-app'
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new ModuleFederationPlugin({
      name: 'vue_app',
      filename: "vue_app.js",
      remotes: {
        rootApp: 'root_app@http://localhost:8080/root_app.js'
      }
    })
  ],
  externals: {
    'vue': 'Vue',
    'element-plus': 'ElementPlus'
  }
};