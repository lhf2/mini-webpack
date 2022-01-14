// webpack 是一个函数，接受配置对象跟回调函数。回调会在 webpack compiler 运行时执行；
// 如果你不向 webpack 传入可执行的回调函数， 它会返回一个 webpack Compiler 实例。提供了.run方法跟.watch方法；

const Compiler = require('./Compiler.js');
const webpack = (options, callback) => {
  // 初始化 Compiler 对象
  const compiler = new Compiler(options);
  // 执行 run 方法开始执行编译；
  compiler.run();
  // webpack() 返回一个 webpack Compiler 实例
  return compiler;
};
module.exports = webpack;