# mini-webpack
# 实现一个简易版的webpack
## 关于 webpack
- webpack 是一个函数，接收配置对象跟回调函数。回调函数会在webpack compiler 运行时执行；
- 如果你不向 webpack 传入可执行的回调函数，它会返回一个webpack Compiler 实例。
const compiler = webpack(config);  ——> 一个Compiler类的实例
compiler.run(); // 开始编译

## webpack的构建流程
### 1. 初始化参数：从配置文件和 shell 语句中读取与合并参数，得出最终的参数；
### 2. 开始编译：用上一步得到的参数初始化 Compiler 对象、加载所有配置的插件，依次调用插件的 apply 方法、执行 run 方法开始执行编译；
       run hooks ——> compile hooks ——> 创建 compilation 对象 ——> compilation hooks ——> make hooks ——> finishMake hooks(compilation.finish生成依赖图、compilation.seal生成chunk) ——> emit生成打包后资源(compilation.assets);
### 3. 确定入口
### 4. 编译模块：从入口出发，递归调用loader对模块进行处理；（读取入口文件内容 - 将其解析为AST抽象语法树 - 收集依赖 ImportDeclaration（deps[相对路径] = 绝对路径） - 编译代码：将浏览器中不能识别的代码进行编译 -  递归收集依赖 modules.push(fileInfo) fileInfo={filename, deps, code}）
### 5. 完成模块编译：根据上一步生成依赖图；（graph { 文件名: {code, deps}}）
### 6. 输出资源：生成chunk
### 7. 输出完成：把文件内容写入文件系统；


## 关于Loader
1. 本质上是一个函数，接收三个参数，返回的结果必须是一段标准的 JS 代码字符串。
	- content：源文件的内容
	- map：souce-map的映射信息
	- meta：元信息
   this是由webpack提供的，可以直接使用，this 上下文是有用的，所以这个 loader 导出函数不能是箭头函数。
2. 可以通过 resolveLoader 里面的 modules 配置 loader 解析规则
	```
	resolveLoader: {
	    modules: [
	      'node_modules',
	       path.resolve(__dirname, 'loaders')
	    ]
	}
	```
3. 执行顺序：从下到上，从右到左；
   提前做处理可以定义 pitch 方法；pitch 方法顺序跟 loader 顺序相反；
   module.exports.pitch = function(){}
4. 同步Loader：直接 return 返回值 或者是 this.callback(null, content, map, meta) 两种方法；
   异步Loader（推荐）： const callback = this.async();  setTimeout(()=>{ callback(null, content)}, 1000)
5. 获取loader的options并进行检验

  ```
  const {getOptions} = require('loader-utils');
  const options = getOptions(this);
  ```

   校验options是否合法：
   定义schema.json文件：

   ```
    {
   	"type": "object",
   	"propreties": {
   		"name": {
   			"type": "string",
   			"description": "名称"
   		}
   	},
   	// 允许追加其他属性
     "additionalProperties": true
   }
   ```
   ```
   const {validate} = require('schema-utils');
   const schema = require('./schema');
   validate(schema, options, {
   	// loader的名字
   	name: 'loader3'
   })
   ```

## 关于plugin
1. tapable 的各种钩子 （同步、异步）
   同步：tap、call
   异步：tapAsync 多一个cb参数 或者 tapPromise要求返回一个promise对象、callAsync
2. 插件是一个类，prototype 上定义一个 apply 方法。以 compiler 为参数。
   apply(complier){}
   complier 和 compilation有各种钩子可供使用；
3. "assets" 是一个包含 compilation 中所有资源(assets)的对象。该对象的键是资源的路径，值是文件的源码。可以通过它来修改资源的内容以及新增资源。
    输出资源的三种方式：
    - compilation.assets['文件名'] = {
      		size(){}.
      		source(){}
      }
    -  const { RawSource } = webpack.sources;
       compilation.assets['文件名'] = new RawSource(data)
    -  compilation.emitAssets('文件名', new RawSource(data))
