// 一个 JavaScript 类
class RemoveCommentsPlugin {
  constructor(options) {
    this.options = options
  }
  // 在插件函数的 prototype 上定义一个 `apply` 方法，以 compiler 为参数。
  // compiler 对象代表了完整的 webpack 环境配置。
  apply(compiler) {
    console.log('remove-comments-plugin');
    // 指定一个挂载到 webpack 自身的事件钩子。
    compiler.hooks.emit.tap('RemoveCommentsPlugin', compilation => {
      // "assets" 是一个包含 compilation 中所有资源(assets)的对象。
      // 该对象的键是资源的路径，
      // 值是文件的源码
      for (const name in compilation.assets) {
        if (name.endsWith('.js')) {
          // 获取到打包后的代码 用正则替换注释
          const contents = compilation.assets[name].source();
          const noComments = contents.replace(/\/\*{2,}\/\s?/g, '');
          // 更新构建产物对象
          compilation.assets[name] = {
            source: () => noComments,
            size: () => noComments.length
          }
        }
      }
    })
  }
}

function removeJsComments(code) {
  return code.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');
}

module.exports = RemoveCommentsPlugin;