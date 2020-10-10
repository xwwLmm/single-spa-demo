import Vue from 'vue'

import axios from 'axios'

const baseAxios = axios.create({
  baseURL: '/m/api/base'
})
Vue.prototype.$http = baseAxios