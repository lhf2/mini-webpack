const path = require('path');
const fs = require('fs');
const parse = require("./parser.js");
const {
  SyncHook,
  AsyncSeriesHook
} = require("tapable");

let ID = 0;
class Compilation {
  constructor(options) {
    this.options = options;
    this.loaders = options.loaders;
    this.entry = options.entry;
    this.compiler = options.associatedObjectForCache;
    this.hooks = Object.freeze({
      finishModules: new AsyncSeriesHook(["modules"]),
      seal: new SyncHook([]),
    });
    this.graph = [];
  }
  // 生成依赖图
  finish(callback) {
    const self = this;
    // 递归依赖 处理loader
    function _buildModule(filename) {
      // 构建模块
      // 1. 获取模块的代码
      let sourceCode = fs.readFileSync(filename, { encoding: "utf-8" });
      // 需要在这里调用 loader
      // 把 sourceCode 给到 loader 做处理
      self.loaders.rules.forEach(({ use: loader, test: rule }) => {
        // 先看看这个 filename 是不是符合这个loader 的
        if (rule.test(filename)) {
          // 现在 loader 是个 string ，需要使用 require 加载过来
          // 暂时就支持一个 loader
          // TODO loader 的处理是从后往前的，把前一个 loader 返回值给到下一个 loader 内
          // TODO 需要支持 options
          sourceCode = loader(sourceCode);
        }
      });

      // 2. 获取模块的依赖关系和把 import 替换成 require
      const { code, dependencies } = parse(sourceCode);

      return {
        code,
        dependencies,
        filename,
        mapping: {},
        id: ID++,
      };
    }

    // 通过队列的方式来把所有的文件都处理掉
    const moduleQueue = [];
    const entryModule = _buildModule(this.entry);
    moduleQueue.push(entryModule);
    this.graph.push(entryModule);

    while (moduleQueue.length > 0) {
      const currentModule = moduleQueue.shift();
      currentModule.dependencies.forEach((dependence) => {
        // 提前处理下 dependence 的路径
        // 需要完整的文件路径
        const childPath = path.resolve(
          path.dirname(currentModule.filename),
          dependence
        );
        const childModule = _buildModule(childPath);
        // mapping 的  key  需要是相当路径
        currentModule.mapping[dependence] = childModule.id;
        moduleQueue.push(childModule);
        this.graph.push(childModule);
      });
    }

    // 调用 finishModules 钩子
    this.hooks.finishModules.callAsync(this.graph, err => {
      if (err) return callback(err);
    })
  }

  // 所有模块及其依赖的模块都通过 Loader 转换完成后，根据依赖关系开始生成 Chunk。
  seal(callback) {
    // todo 生成chunk
    this.hooks.seal.call();
    callback()
  }

}


module.exports = Compilation;