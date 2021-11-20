// AsyncParallelHook：并行执行的异步钩子
// 当注册的所有异步回调并行执行完毕后在执行callAsync 或者promise中的函数

const { AsyncParallelHook } = require('tapable');
const hook = new AsyncParallelHook(['name']);

console.time('start');

hook.tapAsync('hello', (name, cb) => {
  setTimeout(() => {
    console.log(`hello ${name}`);
    cb();
  }, 2000)
});

hook.tapPromise('hello again', (name) => {
  return new Promise(((resolve, reject) => {
    setTimeout(() => {
      console.log(`hello ${name} again`);
      resolve();
    }, 1000)
  }))
});

hook.callAsync("world", ()=>{
  console.log('done');
  console.timeEnd('start');
});

// hello world again
// hello world
// done
// start: 2.006s


// 或者通过 hook.promise() 调用
/*
hook.promise('world').then(()=>{
  console.log('done');
  console.timeEnd('start');
});*/
