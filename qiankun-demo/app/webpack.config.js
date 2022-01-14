const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader/dist/index');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
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
      directory: path.join(__dirname, './dist')
    },
    port: 8080,
    // 解决微应用刷新报错404
    proxy: {
      '/vue/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/vue': ''
        }
      }
    },
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      filename: 'index.html',
      title: 'qiankun-root-app'
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new ModuleFederationPlugin({
      name: 'root_app',
      filename: "root_app.js",
      exposes: {
        './commonExport': './commonExport'
      }
    })
  ],
  externals: {
    'vue': 'Vue',
    'element-plus': 'ElementPlus'
  }
};