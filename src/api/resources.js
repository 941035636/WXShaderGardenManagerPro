// 文件下载展示js
import request from '@/utils/request'
import {
  Message
} from 'element-ui'
import {
  baseURL
} from '@/config'

export function getImgFile(url) {
  return request({
    url: baseURL + url,
    method: 'get',
    params: '',
    responseType: 'arraybuffer',
  })
    .then((res) => {
      console.log(res.data, '12')
      let imgData = {}
      imgData.oldData = res.data
      imgData.data =
        'data:image/png;base64,' +
        btoa(
          new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        )

      return imgData
    })
    .then((data) => {
      return data
    })
}
export function getFile(url) {
  return request({
    url: baseURL + url,
    method: 'get',
    params: '',
    responseType: 'blob',
  })
    .then((res) => {
      console.log(res, 'ressss');
      let href = getObjectURL(res.data)
      let fileName = getFileName(res.headers['content-disposition'])
      downLoadA(href, fileName)
      Message({
        message: '下载成功',
        type: 'success',
        duration: 900,
      })
      return res
    })
    .catch((error) => {
      Message({
        message: '下载失败',
        type: 'error',
        duration: 900,
      })
    })
}
export function getFilesList(params) {
  return request({
    url: baseURL + '/files/v1/list', //保单详情
    method: 'get',
    params
  })
}
/**
 * 获取文件展示地址
 * @param {blob} file 文件blob
 */
function getObjectURL(file) {
  let url = null
  if (window.createObjectURL != undefined) {
    url = window.createObjectURL(file)
  } else if (window.webkitURL != undefined) {
    try {
      url = window.webkitURL.createObjectURL(file)
    } catch (error) {
      console.log('not webkiturl')
    }
  } else if (window.URL != undefined) {
    try {
      url = window.URL.createObjectURL(file)
    } catch (error) {
      console.log('not url')
    }
  }
  return url
}
/**
 * 获取文件名称
 * @param {string} str
 */
function getFileName(str) {
  // 获取等于下标
  let fileName = str.substr(str.indexOf('=') + 1, str.length)
  return decodeURIComponent(fileName) //从第一个字符开始截取
}
/**
 * 通过axios获取数据然后通过a标签下载
 * @param {string}} href
 * @param {string} types
 * @param {string} fileName
 */
function downLoadA(href, fileName) {
  try {
    let downloadElement = document.createElement('a')
    downloadElement.href = href
    if (fileName) {
      downloadElement.download = fileName //下载后文件名
    }
    document.body.appendChild(downloadElement)
    downloadElement.click() //点击下载
    document.body.removeChild(downloadElement) //下载完成移除元素
    window.URL.revokeObjectURL(href) //释放掉blob对象
    return '0000'
  } catch (error) {
    return '9999'
  }
}