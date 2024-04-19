/*jshint esversion: 6 */
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import store from './store';

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
// 产品CODE常量
import globalProductCode from './global/global-product.js'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/styles/element-variables.scss'; //element主题色配置文件
import iView from 'iview'; // 导入组件库

//引入Bable transpiler以保证支持ES6
import './util/browser.min.js'
// import Utils from './util/index.js'

// console.log($--color-primary)


import "../static/css/main.css"; //页面布局基础样式
import "../src/assets/styles/common.less"; //页面布局基础样式
import '../src/assets/styles/mainys.css'; //页面内容基础样式
import "../static/css/color-dark.less"; //上部导航条基础样式
import 'assets/icon/iconfont.css'; //图标库

// 引入过滤器
import { format } from './filters/date'
import { setTime } from './filters/date'

/* 
前端插件
*/
// import $ from 'jquery'
import 'babel-polyfill';
//前端密码加密
import md5 from 'js-md5';
// 图片预览插件
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
//时间处理插件
import dayjs from 'dayjs'
import qs from 'qs'

//工具类
import numberHelper from './util/numberHelper'

import btnPermission from './util/btnPermission'

/*
前端配置工具类入口
 */
import stringHelper from './util/stringHelper'
import {getLogger} from './util/Logger'
const logger = getLogger('')

//接口管理api
import axiosSet from './api/index'
import apiUrl from './api/apiUrl';

// 前端地址常量
import globalUrl from './global/global-font.js'
// 常用变量
import publicGlobal from './global/public-global.js'
//引入echarts
import echarts from 'echarts'
import isAuth from './util/index'

//将 Utils 挂载到 vue 的原型上
Vue.prototype.$stringHelper = stringHelper;
Vue.prototype.$echarts = echarts
Vue.prototype.isAuth = isAuth;

import ba from 'vue-ba'
Vue.use(ba, "180182f4276b161054b07477b41f44ad");
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);
// 引入过滤时间
Vue.filter('format', format)
Vue.filter('setTime', setTime)


/**vue配置 */

//组件全局注册
const requireComponent = require.context(
    // 其组件目录的相对路径
    './components/common/Base',
    // 是否查询其子目录
    false,
    // 匹配基础组件文件名的正则表达式
    /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
    // 获取组件配置
    const componentConfig = requireComponent(fileName)

    // 获取组件的 PascalCase 命名
    const componentName = upperFirst(
        camelCase(
            // 剥去文件名开头的 `./` 和结尾的扩展名
            fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
        )
    )

    // 全局注册组件
    Vue.component(
        componentName,
        // 如果这个组件选项是通过 `export default` 导出的，
        // 那么就会优先使用 `.default`，
        // 否则回退到使用模块的根。
        componentConfig.default || componentConfig
    )
})




Vue.use(ElementUI);
Vue.use(preview);
Vue.use(publicGlobal);
Vue.prototype.dayjs = dayjs;
Vue.prototype.$globalUrl = globalUrl;
Vue.prototype.$apiUrl = apiUrl;
Vue.prototype.$axios = axios;
Vue.prototype.$globalProductCode = globalProductCode
Vue.prototype.$md5 = md5;
Vue.prototype.$qs = qs;
Vue.prototype.$logger = logger;



//将 Utils 挂载到 vue 的原型上
Vue.prototype.$numberHelper = numberHelper;
Vue.prototype.trackEvent = function (category, action){
    if(ba) {
        let USER_NB_INFO = window.sessionStorage.getItem('userName') + '|' + window.sessionStorage.getItem('branchName');
        console.log(USER_NB_INFO)
        ba.trackEvent(category,action,USER_NB_INFO);
    }
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');