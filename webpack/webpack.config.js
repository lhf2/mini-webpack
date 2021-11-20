const path = require('path');
const RemoveCommentsPlugin = require('./plugins/remove-comments-plugin.js');
const macDownLoader = require('./loaders/macDown-loader.js');

module.exports = {
  entry: './example/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  // 先去node_modules找 如果找不到 就去./loaders找
  /*resolveLoader: {
    modules: [
      'node_modules',
      './loaders'
    ]
  },*/
  module: {
    // use loader 可以使用相对路径
    // 也可以使用resolveLoader进行配置 我们就可以直接写loader的名字了 macDown-loader
    rules: [
      {
        test: /\.md$/,
        use: macDownLoader,
      }
    ]
  },
  plugins: [
    new RemoveCommentsPlugin()
  ]
};