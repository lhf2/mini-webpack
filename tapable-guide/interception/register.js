const { SyncHook } = require('tapable');

class Car {
  constructor() {
    this.hooks = {
      // 加速
      accelerate: new SyncHook(['newSpeed'])
    };
    this.hooks.accelerate.intercept({
      // 每添加一个Tap都会触发 你interceptor上的register
      // 你下一个拦截器的register 函数得到的参数 取决于你上一个register返回的值,所以你最好返回一个 tap 钩子.
      register: (tapInfo) => {
        console.log(tapInfo); //{ type: 'sync', fn: [Function (anonymous)], name: 'acceleratePlugin' }
        console.log(`${tapInfo.name} is registered`);
        return tapInfo;
        // return 111;
      }
    });
    this.hooks.accelerate.intercept({
      register: (tapInfo) => {
        // 如果上面返回111 这里就打印111
        console.log(tapInfo);
      }
    });
  }
}

const myCar = new Car();
myCar.hooks.accelerate.tap('acceleratePlugin', (newSpeed) => {
  console.log('accelerate', newSpeed);
});
myCar.hooks.accelerate.call(100);

// acceleratePlugin is registered
// accelerate 100

