<template>
    <header-component></header-component>
    <div>
        我是root-app的Home组件
    </div>
    <footer-component></footer-component>
</template>

<script>
  import HeaderComponent from '../common/header.vue'
  import FooterComponent from '../common/footer.vue'

  export default {
    name: 'Home',
    components: {
      HeaderComponent,
      FooterComponent
    },
    setup(){

    }
  }
</script>