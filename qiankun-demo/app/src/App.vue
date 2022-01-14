<template>
    <div>
        <router-link to="/">首页</router-link>
        <router-link to="/vue">vue应用</router-link>
    </div>
    <router-view></router-view>
    <div id="vue-app"></div>
</template>
<script>
  import {start} from 'qiankun';
  import {onMounted} from 'vue';

  export default {
    setup() {
      onMounted(() => {
        if (!window.qiankunStarted) {
          window.qiankunStarted = true;
          start({singular: false});
        }
      })
    }


  }
</script>
<style>
    div {
        color: cyan;
    }
</style>