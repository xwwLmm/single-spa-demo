import Vue from 'vue'
import Vuex from 'vuex'
import permission from './modules/permission'
Vue.use(Vuex)


export default new Vuex.Store({
  strict: true,
  modules: {
    permission
  },
  plugins: []
})