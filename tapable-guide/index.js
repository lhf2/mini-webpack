/*AsyncSeries, 一个 async-series 钩子 可以tap 同步钩子, 基于回调的钩子(我估计是类似chunk的东西)和一个基于promise的钩子(使用myHook.tap(), myHook.tapAsync() 和 myHook.tapPromise().).他会按顺序的调用每个方法.*/
/*AsyncParallel, 一个 async-parallel 钩子跟上面的 async-series 一样 不同的是他会把异步钩子并行执行(并行执行就是把异步钩子全部一起开启,不按顺序执行).*/

const {SyncHook, AsyncParallelHook} = require('tapable');

class Car {
  constructor() {
    this.hooks = {
      // 加速
      accelerate: new SyncHook(['newSpeed']),
      // 刹车
      brake: new SyncHook(),
      // 计算路线
      calculateRoutes: new AsyncParallelHook([
        'source',
        'target',
        'routesList'
      ])
    }
  }

  setSpeed(newSpeed) {
    this.hooks.accelerate.call(newSpeed)
  }

  useNavigationSystemPromise(source, target) {
    const routesList = [];
    return this.hooks.calculateRoutes
      .promise(source, target, routesList)
      .then(res => {
        console.log('useNavigationSystemPromise');
        return routesList
      })
  }

  useNavigationSystemAsync(source, target, callback) {
    const routesList = [];
    this.hooks.calculateRoutes.callAsync(source, target, routesList, (err) => {
      console.log('useNavigationSystemAsync');
      if (err) return callback(err);
      callback(routesList);
    })
  }
}

const myCar = new Car();
// 无参数
myCar.hooks.brake.tap('WarningLampPlugin', () => warningLamp.on());
// 有参数
myCar.hooks.accelerate.tap('LoggerPlugin', (newSpeed) => {
  console.log(`Accelerating to ${newSpeed}`)
});
// 异步的promise tapPromise 返回一个promise
myCar.hooks.calculateRoutes.tapPromise(
  "GoogleMapsPlugin",
  (source, target, routesList) => {
    // return a promise
    const route = {
      source,
      target
    };
    return new Promise(((resolve, reject) => {
      setTimeout(() => {
        console.log('tapPromise');
        routesList.push(route);
        resolve();
      }, 1000)
    }))
  });

// 异步tapAsync callback处理
myCar.hooks.calculateRoutes.tapAsync(
  "BingMapsPlugin",
  (source, target, routesList, callback) => {
    const route = {
      source,
      target
    };
    setTimeout(() => {
      console.log('tapAsync');
      routesList.push(route);
      callback()
    }, 2000)
  });

// tap: 绑定同步钩子的API
myCar.hooks.calculateRoutes.tap(
  "CachedRoutesPlugin",
  (source, target, routesList) => {
    console.log('tap');
    routesList.push("sync plugin router");
  });

// promise调用
/*const resultPromise = myCar.useNavigationSystemPromise("北京", "上海");
resultPromise.then((result) => {
  console.log(result);
});*/
// tap
// tapPromise
// tapAsync
// useNavigationSystemPromise
//   [
//   'sync plugin router',
//     { source: '北京', target: '上海' },
//     { source: '北京', target: '上海' }
//   ]

// callBack调用
myCar.useNavigationSystemAsync("北京", "上海", (result) => {
  console.log(result);
});
// tap
// tapPromise
// tapAsync
// useNavigationSystemAsync
//   [
//   'sync plugin router',
//     { source: '北京', target: '上海' },
//     { source: '北京', target: '上海' }
//   ]