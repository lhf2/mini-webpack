<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
  export default {
    setup() {
      const testFn = () => {
        console.log('test')
      };
      return {
        testFn
      }
    }


  }
</script>
<style>
    div {
        color: cyan;
    }
</style>