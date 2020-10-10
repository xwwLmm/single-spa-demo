require('babel-register')
require('babel-polyfill')
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Ant from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './single-spa-config.js'
import './http'
import './assets/styles/app.styl'
import utils from './utils'
import store from './store'
import './packages'
Vue.config.productionTip = false;
Vue.prototype.$util = utils
Vue.use(Ant);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
