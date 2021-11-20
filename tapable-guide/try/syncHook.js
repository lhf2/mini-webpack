// 通过 SyncHook 创建同步钩子
// 使用 tap 注册回调
// 使用 call 来触发回调并传参

const { SyncHook } = require('tapable');
const hook = new SyncHook(['name']);
hook.tap('hello', (name)=>{
  console.log(`hello ${name}`)
});
hook.tap('hello again', (name)=>{
  console.log(`hello ${name} again`)
});
hook.call('world');