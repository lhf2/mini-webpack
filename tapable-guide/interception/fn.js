const {SyncHook} = require('tapable');

class Car {
  constructor() {
    this.hooks = {
      // 加速
      accelerate: new SyncHook(['newSpeed'])
    };
    this.hooks.accelerate.intercept({
      register: (tapInfo) => {
        if (tapInfo.name === "acceleratePlugin") {
          console.log(`${tapInfo.name} is intercept`);

          // 基于拦截器 ，就可以随意的修改每一个事件的函数了
          tapInfo.fn = () => {
            console.log(`🚨 Police are on their way 🚨`)
          }
        } else {
          console.log(`${tapInfo.name} is register`);
        }
      }
    });
  }
}

const myCar = new Car();
myCar.hooks.accelerate.tap('acceleratePlugin', (newSpeed) => {
  console.log('accelerate', newSpeed);
});
myCar.hooks.accelerate.tap('acceleratePlugin1', (newSpeed) => {
  console.log('accelerate1', newSpeed);
});
myCar.hooks.accelerate.call(100);

// acceleratePlugin is intercept
// acceleratePlugin1 is register
// 🚨 Police are on their way 🚨
// accelerate1 100

