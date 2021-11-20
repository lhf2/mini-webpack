// loader 其实返回的就是一个函数
// 接受一个参数：source 指的是源文件的内容
/* 返回的结果必须是一段标准的 JS 代码字符串：
1. 直接在 Loader 的后面返回一段 JS 代码字符串
2. 在找一个合适的 loader ，用两个 loader 来处理得到 JS 字符串*/

// 可以通过 this 访问Loader API
// this是由webpack提供的，可以直接使用，this 上下文是有用的，所以这个 loader 导出函数不能是箭头函数。

// 用来把 markDown 解析成 Html 的模块
const marked = require('marked');

// 方法1实现 不需要额外的loader处理html 直接返回的JS字符串
module.exports = (source) => {
  //1. 将 markDown 解析成 html 字符串
  const html = marked.parse(source);
  //2. 把 html 拼接成 JS 字符串并导出
  // const code = `module.exports = ${JSON.stringify(html)}`;
  // 用 esm 的方式也可以
  const code = `export default ${JSON.stringify(html)}`;
  return code;
};

// 方法2实现 需要html-loader来处理html转成JS字符串
// 需要在配置中新增html-loader
/*rules: [
  {
    test: /\.md$/,
    use: [
      'html-loader',
      './macDown-loader.js'
    ]
  }
]*/
/*module.exports = (source) =>{
  const code = marked.parse(source);
  return code
};*/
