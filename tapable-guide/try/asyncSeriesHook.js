// AsyncSeriesHook：顺序执行异步函数

const { AsyncSeriesHook } = require('tapable');
const hook = new AsyncSeriesHook(['name']);

console.time('start');
hook.tapAsync('hello', (name, cb) => {
  setTimeout(() => {
    console.log(`hello ${name}`);
    cb();
  }, 2000);
});
hook.tapPromise('hello again', (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`hello ${name}, again`);
      resolve();
    }, 1000);
  });
});

hook.callAsync('world', () => {
  console.log('done');
  console.timeEnd('start');
});

// hello world
// hello world, again
// done
// start: 3.035s