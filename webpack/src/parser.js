const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const {transformFromAst} = require("babel-core");

module.exports = function parse(source) {
  const dependencies = [];
  // 根据内容转成AST
  const ast = babylon.parse(source, {
    sourceType: "module"
  });

  // 遍历AST、收集import声明
  // 这个数组将保存这个模块依赖的模块的相对路径
  traverse(ast, {
    ImportDeclaration({node}) {
      dependencies.push(node.source.value)
    }
  });

  // 把里面的 import 替换成 require
  const {code} = transformFromAst(ast, null, {
    presets: ["env"],
  });

  return {
    code,
    dependencies,
  };
}
