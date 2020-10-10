<template lang="pug">
  div
    template(v-show="$route.name !== 'login'")
      LeftMenu
    Login(v-if="$route.name === 'login'")
    div#vue
</template>
<script>
  import { navigateToUrl } from 'single-spa';
  import LeftMenu from './components/LeftMenu'
  import Login from './views/Login'
  export default {
    data() {
      return {
        collapsed: false,
        menus: []
      };
    },
    async created() {
    },
    watch: {
      '$route'(newVal) {
        console.log(newVal)
      }
    },
    methods: {
      goToChildRoute(e) {
        // 官方指定跳转
        e.preventDefault();
        navigateToUrl(e);
      }
    },
    components: {
      LeftMenu,
      Login
    }
  };
</script>
<style lang="stylus">
  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  #components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
  }

  #components-layout-demo-custom-trigger .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
</style>
