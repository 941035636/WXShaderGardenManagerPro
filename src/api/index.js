/*
 *接口请求及响应配置文件
 * @property { axios.interceptors.request.use: {Fun} http request 请求 拦截器}
 * @property { axios.interceptors.response.use: {Fun} http response 接口响应拦截器 }
 * @version 1.0.0
 * @edit: quweina
 */

import axios from 'axios';
import apiUrl from '@/api/apiUrl'
import {
    Loading,
    Message
} from 'element-ui'

// axios.defaults.timeout = 3000;
axios.defaults.baseURL = '';
axios.defaults.withCredentials = true; //设置session不变化
let isRefreshing = false;
// 存储请求的数组
let refreshSubscribers = []
let loading //定义loading变量
function startLoading() {
    //使用Element loading-start 方法
    loading = Loading.service({
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

function endLoading() { //使用Element loading-close 方法
    loading.close()
}
// startLoading()
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}
/* 将所有的请求都push到数组中 */
function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb)
}

// 数组中的请求得到新的token之后自执行，用新的token去请求数据
function onRrefreshed(token) {
    refreshSubscribers.map(cb => cb(token))
}
// 刷新token的过期时间判断
function isRefreshTokenExpired() {
    /* 从localStorage中取出token过期时间 */
    let expiredTime = window.sessionStorage.getItem('tokenExpireTime')
    /* 获取本地时间 */
    let nowTime = Math.round(new Date().getTime() / 1000)
        /* 如果 < 10分钟，则说明即将过期 */
    return (expiredTime - nowTime) < 10 * 60
}

function getRefreshToken() { // 刷新token 注意这里用到的service
    return axios.post(apiUrl.ROOT_GETEWARY + '/auth-svc/refresh_token', window.sessionStorage.getItem('refreshToken'))
        .then((res) => {
            return Promise.resolve(res)
        })
}
function analysisToken(token) {
    let Base64 = require('js-base64').Base64
    token = token.replace('Bearer ', '')
    token = token.split('.')[1]
    var json = Base64.decode(token)

    return json
}

// '++++++++++++++++++++'
//http request 请求 拦截器

axios.interceptors.request.use(config => {
    // 安全策略配置
    config.withCredentials = true;

    config.headers['jtpf.userId'] = sessionStorage.getItem("userCode") //后台本地环境

    config.headers['jtpf.sysCode'] = 'sys_sequip_man'
    config.headers['platform'] = 'sys_sequip_man'

    config.headers['userName'] = encodeURI(sessionStorage.getItem("userName")) //后台本地环境

    config.headers['branchCode'] = sessionStorage.getItem("branchCode") //后台本地环境

    config.headers['dataAuthority'] = sessionStorage.getItem("authDataInfo") 

    let authTk = sessionStorage.getItem("authorization") //线上开发

    config.headers.authorization  = authTk
    if(config.url.indexOf('getStatistics') == -1){
        showFullScreenLoading()
    }

    if (authTk) {
        /* 在请求头中添加token类型、token */
        // config.headers.Authorization = authTk
        // config.url = config.url + '?t=' + (new Date()).getTime().toString() // 清楚缓存
        /* 判断token是否将要过期 */
        if (isRefreshTokenExpired()) {
            if (!isRefreshing) {
                isRefreshing = true
                /* 发起刷新token的请求 */
                getRefreshToken().then(res => {
                        isRefreshing = false
                        window.sessionStorage.getItem("authorization", res.headers.access_token)
                        var jsonObj = JSON.parse(analysisToken(res.headers.access_token))
                        window.localStorage.setItem('tokenExpireTime', jsonObj.exp)
                            // saveTimeStamp(new Date().getTime())
                            /* 执行数组里的函数,重新发起被挂起的请求 */
                        config.headers.authorization = res.headers.access_token
                        onRrefreshed(res.headers.access_token)
                            /* 执行onRefreshed函数后清空数组中保存的请求 */
                        refreshSubscribers = []
                    }).catch(errs => {
                        console.log(errs);
                        /* 清除本地保存的 */
                        window.sessionStorage.clear()
                            // clearAllCache()
                        // window.location.href = '/#/login'
                        window.location.href = '/'
                    })
                    /* 把请求(token)=>{....}都push到一个数组中 */
                    // 不把刷新token的url加入到请求挂起中 如果加入，上面的刷新token将调用不了
                if (config.url.indexOf('refresh_token') === -1) {
                    let retry = new Promise((resolve, reject) => {
                        /* (token) => {...}这个函数就是回调函数 */
                        subscribeTokenRefresh((token) => {
                            // config.headers.common['Authorization'] = 'bearer ' + token;
                            config.headers.Authorization = token
                                /* 将请求挂起 */
                            resolve(config)
                        })
                    })
                    return retry
                }
            }
            return config
        } else {
            
            return config
        }
    } else {
        
        return config
    }

}, error => {

    Message.error({
        message: '加载超时'
    })
    return Promise.reject(error)
})

//http response 接口响应拦截器

axios.interceptors.response.use(function(response) { // 添加响应拦截器

    // loadinginstace.close(response);
    let rc = response.data.code;
    let status = response.status; //接口请求状态码
    if (response.config.url.indexOf('/api/v1/record') === -1) {
        // 对响应数据做点什么
        if (status == '406') {
            //token失效
            sessionStorage.removeItem('authorization');
            sessionStorage.removeItem('userCode');
            sessionStorage.removeItem('userName');
            // router.push('/login');
            // window.location.href = '/#/login'
            window.location.href = '/'
        } else if (rc == '0000') {



        } else if ((rc == '1111' || rc == '3333') && response.config && response.config.url.indexOf('/bms-api/corrections/selectCorrectFperiodBySignTime') != -1) {
           
        } else {
            if(response.data.msg) {
                Message.error({
                    message: response.data.msg
                }) 
            }
        }
    }
    if(response.config.url.indexOf('getStatistics') == -1){
        tryHideFullScreenLoading()
    }
    return response;
}, function(error) {
    if(error.response && error.response.status == '406') {
        localStorage.clear();
        sessionStorage.removeItem('authorization');
        sessionStorage.removeItem('userCode');
        sessionStorage.removeItem('userName');
        // window.location.href = '/#/login'
        window.location.href = '/'
        return Promise.reject(error)
    }else if (error.request.custom.url.indexOf('/api/v1/record') === -1) {
        // 对响应错误做点什么
        Message.error({
            message: '接口错误'
        })
    }
    endLoading();
    return Promise.reject(error)
});

//导出axios插件
export default axios;
/**
 * 封装get方法
 * @param url
 * @param data
 * @param isResponse 是否获取响应内容信息
 * @returns {Promise}
 */

export function get(url, params = {}, headers = {},config = {},isResponse) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
                params: params,
                headers: headers,
                ...config
            })
            .then(response => {
                let data = response.data;
                // 是否获取响应头的数据
                if(isResponse){
                  data = {
                    "headers": response.headers,
                    "data": response.data
                  }
                }
                resolve(data)
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {},config = {},isResponse=false) {
    // refreshToken()
    return new Promise((resolve, reject) => {
        axios.post(url, data, config)
            .then(response => {
                let data = response.data;
                // 是否获取响应头的数据
                if(isResponse){
                  data = {
                    "headers": response.headers,
                    "data": response.data
                  }
                }
                resolve(data)
            }, err => {
                reject(err)
            })
    })
}
/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}, config = {}) {
    // refreshToken()
    return new Promise((resolve, reject) => {
        axios.put(url, data, config)
            .then(response => {
                resolve(response.data)
            }, err => {
                reject(err)
            })
    })
}
/**
 * deletes
 * @param url
 * @param data
 * @returns {Promise}
 */

export function deletes(url, data = {}, config = {}) {
    // refreshToken()
    return new Promise((resolve, reject) => {
        axios.delete(url, data, config)
            .then(response => {
                resolve(response.data)
            }, err => {
                reject(err)
            })
    })
}