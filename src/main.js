import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins'
import '@/layouts/export'
import '@/assets/styles/font.css'
// 引入过滤器
import { setTime, setIdCard, setPhone } from './filters/date'
import { ThousandSeparator } from './filters/thounsand'
import { hasBtnPermission } from './utils/permission'
import * as echarts from 'echarts/lib/echarts'
/**
 * @description 生产环境默认都使用mock，如果正式用于生产环境时，记得去掉
 */

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('@/utils/static')
//   mockXHR()
// }
// 引入过滤时间
Vue.filter('setIdCard', setIdCard)
Vue.filter('setTime', setTime)
Vue.filter('setPhone', setPhone)
Vue.filter('ThousandSeparator', ThousandSeparator)
Vue.config.productionTip = false
// 按钮权限
Vue.prototype.$hasBtn = hasBtnPermission
Vue.prototype.$echarts = echarts
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})
