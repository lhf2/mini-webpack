# 实现一个简易版的webpack
## 关于 webpack
- webpack 是一个函数，接收配置对象跟回调函数。回调函数会在webpack compiler 运行时执行；
- 如果你不向 webpack 传入可执行的回调函数，它会返回一个webpack Compiler 实例。

## webpack的构建流程
### 1. 初始化参数：从配置文件和 shell 语句中读取与合并参数，得出最终的参数；
### 2. 开始编译：用上一步得到的参数初始化 Compiler 对象、加载所有配置的插件，依次调用插件的 apply 方法、执行 run 方法开始执行编译；
       run hooks ——> compile hooks ——> 创建 compilation 对象 ——> compilation hooks ——> make hooks ——> finishMake hooks(compilation.finish生成依赖图、compilation.seal生成chunk) ——> emit生成打包后资源(compilation.assets);
### 3. 确定入口
### 4. 编译模块：从入口出发，递归调用loader对模块进行处理；
### 5. 完成模块编译：根据上一步生成依赖图；
### 6. 输出资源：生成chunk
### 7. 输出完成：把文件内容写入文件系统；


## 关于Loader
- 返回的就是一个函数。接受一个参数：source 指的是源文件的内容，返回的结果必须是一段标准的 JS 代码字符串。
- this是由webpack提供的，可以直接使用，this 上下文是有用的，所以这个 loader 导出函数不能是箭头函数。
- 可以使用resolveLoader配置，就不需要写路径了，可以直接写loader名称来使用

## 关于plugin
- 一个 JavaScript 命名函数或 JavaScript 类。一般我们使用的是类。
- 在插件函数的 prototype 上定义一个 apply 方法。以 compiler 为参数。
- 指定一个挂载到 webpack 自身的事件钩子。在内部处理逻辑。
- "assets" 是一个包含 compilation 中所有资源(assets)的对象。该对象的键是资源的路径，值是文件的源码。可以通过它来修改资源的内容以及新增资源。


