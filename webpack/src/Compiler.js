const path = require('path');
const fs = require('fs');
const Compilation = require("./Compilation");
const createBundleCode = require("./createBundleCode");
const {
  SyncHook,
  AsyncParallelHook,
  AsyncSeriesHook
} = require("tapable");

class Compiler {
  constructor(options) {
    this.hooks = Object.freeze({
      run: new AsyncSeriesHook(["compiler"]),
      emit: new AsyncSeriesHook(["compilation"]),
      compile: new SyncHook(["params"]),
      compilation: new SyncHook(["compilation", "params"]),
      make: new AsyncParallelHook(["compilation"]),
      finishMake: new AsyncSeriesHook(["compilation"]),
    });
    this.options = options;
    this.root = this;

    this.initPlugins();
  }

  // 加载插件： 依次调用插件的 apply 方法
  initPlugins() {
    const plugins = this.options.plugins;
    if (Array.isArray(plugins)) {
      for (const plugin of plugins) {
        plugin.apply.call(plugin, this);
      }
    }
  }

  // 执行 run 方法开始执行编译 完成之后 执行cb函数
  run(callback) {
    // 执行 run 钩子，传参compiler（this）
    this.hooks.run.callAsync(this, err => {
      if (err) callback(err);
      // 执行编译
      this.compile(callback)
    });
  }

  // 编译
  compile(callback) {
    let params = {
      context: this.options.context,
      loaders: this.options.module,
      associatedObjectForCache: this.root,
      entry: this.options.entry
    };
    // 执行 compile 钩子
    this.hooks.compile.call(params);
    // 创建 compilation 对象
    const compilation = new Compilation(params);
    // 执行 compilation 钩子
    this.hooks.compilation.call(compilation, params);
    // 执行 make 钩子
    this.hooks.make.callAsync(compilation, err => {
      if (err) return callback(err);
      // 执行 finishMake 钩子
      this.hooks.finishMake.callAsync(compilation, err => {
        if (err) return callback(err);
        compilation.finish(err => {
          console.log("finish compilation");
          if (err) return callback(err);

          console.log("seal compilation");
          compilation.seal(err => {
            if (err) return callback(err);
            return callback(null, compilation);
          })
        })
      })
    });
    // 生成打包后的资源 compilation.assets
    this.emitAssets(compilation, callback);
  }

  emitAssets(compilation, callback) {
    // 拼接传入的模块 key是模块的id value是一个数组 其中包括fn代码跟mapping
    // {
    //  id: {
    //    code,
    //    mapping
    //  }
    // }
    const modules = compilation.graph.reduce((r, m) => {
      // 需要拿到 mapping ，后面需要使用 绝对路径来获取模块的 id
      r[m.id] = {
        code: m.code,
        mapping: m.mapping,
      };
      return r;
    }, {});

    // 触发 emit 钩子
    this.hooks.emit.callAsync(compilation, err => {
      if (err) return callback(err);
      // 获取输出路径
      const outputFile = this.options.output.path;
      const outputPath = path.join(this.options.output.path, this.options.output.filename);
      // 先清空目标目录 在新建目录 并把内容写入
      deleteFolderRecursive(outputFile);
      fs.mkdir(outputFile, function (err) {
        if(!err){
          fs.writeFileSync(outputPath, createBundleCode({modules}));
        }
      });
    })
  }
}

// 删除文件夹
function deleteFolderRecursive(url) {
  let files = [];
  if (fs.existsSync(url)) {
    files = fs.readdirSync(url);
    files.forEach(function (file, index) {
      const curPath = path.join(url, file);
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(url);

  } else {
    console.log("给定的路径不存在，请给出正确的路径");
  }
}

module.exports = Compiler;