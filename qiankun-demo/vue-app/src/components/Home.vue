<template>
    <header-component></header-component>
    <div>
        vue-app的home.vue
        <el-button type="primary">elementUi 按钮</el-button>
    </div>
</template>
<script>
  import {onMounted} from 'vue';
  import {HeaderComponent, utils} from 'rootApp/commonExport'

  export default {
    name: 'Home',
    components: {
      /*HeaderComponent: window.__POWERED_BY_QIANKUN__ ? window.commonComponents.HeaderComponent : '',
      FooterComponent: window.__POWERED_BY_QIANKUN__ ? window.commonComponents.FooterComponent : ''*/
      HeaderComponent
    },
    setup() {
      onMounted(() => {
        utils.commonFn();
        console.log('mounted!')
      })
    }
  }
</script>