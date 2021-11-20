const { SyncHook } = require('tapable');

class Car {
  constructor() {
    this.hooks = {
      // 加速
      accelerate: new SyncHook(['newSpeed'])
    };
    // 注册一个拦截器
    // 所有钩子都提供额外的拦截器API
    this.hooks.accelerate.intercept({
      call: (newSpeed) => {
        // 可以通过 call 拦截器来获取 事件函数的参数
        // 拦截器都是先会被调用的
        console.log("Looking for signal...");
        console.log(`Signal found for ${newSpeed}`);
      }
    })
  }
}

const myCar = new Car();
myCar.hooks.accelerate.tap('acceleratePlugin', (newSpeed) => {
  console.log('accelerate', newSpeed);
});
myCar.hooks.accelerate.call(100);

// Looking for signal...
// Signal found for 100
// accelerate 100