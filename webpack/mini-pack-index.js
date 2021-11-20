const fs = require('fs');
const path = require('path');
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const {transformFromAst} = require("babel-core");
let ID = 0;
// 1. 读取文件内容，分析模块依赖
function createAsset(fileName) {
  const content = fs.readFileSync(fileName, "utf-8");

  // 根据内容转成AST
  const ast = babylon.parse(content, {
    sourceType: "module"
  });

  // 遍历AST、收集import声明
  // 这个数组将保存这个模块依赖的模块的相对路径
  let dep = [];
  traverse(ast, {
    ImportDeclaration({node}) {
      dep.push(node.source.value)
    }
  });

  // 把ES6代码转为ES5，转换成浏览器可以运行的代码
  const {code} = transformFromAst(ast, null, {
    presets: ["env"],
  });

  // 返回有关此模块的所有信息
  return {
    //通过递增简单计数器为此模块分配唯一标识符
    id: ID++,
    fileName,
    dep,
    code,
    mapping: {}
  }
}

//2. 构建依赖图：从入口文件递归解析创建图
function createGraph(entry) {
  // 解析入口文件
  const mainAsset = createAsset(entry);
  // 保存依赖关系的数组
  const queue = [mainAsset];
  for (const asset of queue) {
    // 模块所在目录
    const dirName = path.dirname(asset.fileName);
    asset.dep.forEach(d => {
      // 这里的d是相对路径 ./add.js 但是createAsset需要的是绝对路径 进行拼接
      const child = createAsset(path.join(dirName, d));
      // 因为代码中引用的是相对路径 通过相对路径跟id做一个映射
      asset.mapping[d] = child.id;
      // 最后,我们将`child`这个资产推入队列,这样它的依赖关系也将被迭代和解析.
      queue.push(child);
    })
  }

  //到这一步,队列 就是一个包含目标应用中 每个模块 的数组:
  return queue
}

//3. 根据依赖图构建bundle文件
function bundle(graph) {
  // 拼接传入的模块 key是模块的id value是一个数组 其中包括fn代码跟mapping
  let modules = "";
  graph.forEach(mod => {
    modules += `${mod.id}: [
      function (require, module, exports) { ${mod.code} },
      ${JSON.stringify(mod.mapping)}
    ],`
  });

  // 构建require函数，接受模块id，在modules中找到对应的fn跟mapping
  // 因为我们模块代码里面是通过相对路径而不是id调用的require();
  // 所以我们得创建一个新的require函数localRequire 用来接受相对路径 通过mapping映射id在调用require();
  // 通过require()函数先调用入口的ID来启动，把结果写入一个新的js文件
  const result = `
    (function(modules){
      function require(id){
        const [fn, mapping] = modules[id];
        function localRequire(name){
          return require(mapping[name])
        }
        const module = { exports : {} };
        fn(localRequire, module, module.exports); 
        return module.exports;
      }
      require(0);
    })({${modules}})
  `;

  fs.writeFileSync('./bundle.js', result);
}


const graph = createGraph("./example/index.js");
const result = bundle(graph);

