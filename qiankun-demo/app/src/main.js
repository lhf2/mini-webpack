import {createApp} from 'vue';
import App from './App.vue';
import router from '../router/index'

const app = createApp(App);
app.use(router);
app.mount('#root-app');


// 注册微应用并启动
import {registerMicroApps, start} from 'qiankun';

import HeaderComponent from '../src/common/header.vue'
import FooterComponent from '../src/common/footer.vue'
window.commonComponents = {
  HeaderComponent,
  FooterComponent
};
let commonComponents = window.commonComponents || {};
registerMicroApps([
  {
    name: 'vue-app',
    entry: 'http://localhost:8081/',
    container: '#vue-app',
    activeRule: '/vue',
    props: {
      data: {
        commonComponents
      }
    }
  }
]);
// 共享组件必须开启多实例
// start({ singular: false });