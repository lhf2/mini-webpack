const { SyncHook } = require('tapable');

class Car {
  constructor() {
    this.hooks = {
      // 加速
      accelerate: new SyncHook(['newSpeed'])
    };
    this.hooks.accelerate.intercept({
      // 每个钩子执行之前(多个钩子执行多个),就会触发这个函数
      // 类似于 register, 但是不可以更改 tapInfo 的值
      tap: (tapInfo) => {
        console.log(`${tapInfo.name} is getting called`);
        // 修改了 fn 也不管用
        /*tapInfo.fn = ()=>{
          console.log(11111);
        }*/
      }
    });
  }
}

const myCar = new Car();
myCar.hooks.accelerate.tap('acceleratePlugin', (newSpeed) => {
  console.log('accelerate', newSpeed);
});
myCar.hooks.accelerate.call(100);

// acceleratePlugin is getting called
// accelerate 100

