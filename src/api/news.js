import request from '@/utils/request'
import {
  loginRSA,
  tokenName,
  baseURL
} from '@/config'

export function getNewsList(params) {
  return request({
    url: baseURL + '/news/v1/news',
    method: 'get',
    params,
  })
}
// 新增动态接口
export function addNews(data) {
  return request({
    url: baseURL + '/news/v1/news',
    method: 'post',
    data,
  })
}
// 编辑动态接口
export function putNews(data) {
  return request({
    url: baseURL + '/news/v1/news',
    method: 'put',
    data,
  })
}
// 删除动态接口
export function deleteNews(id) {
  return request({
    url: baseURL + '/news/v1/news/' + id,
    method: 'delete',
  })
}
// 删除动态接口
export function getNewsDetails(id) {
  return request({
    url: baseURL + '/news/v1/newsDetail/' + id,
    method: 'get',

  })
}

export function getNewsType(policyCode) {
  return request({
    url: baseURL + `/news/v1/newsType`,
    method: 'get',
  })
}
// 富文本文件上传
export function addNewsFile(data) {
  return request({
    url: baseURL + `/files/v1/upEdit`,
    method: 'post',
    data,
  })
}
// 查看日志
export function checkLog(id, params) {
  return request({
    url: baseURL + `/news/v1/newsLog/` + id,
    method: 'get',
    params,
  })
}
// 推荐
export function recommendNews(id) {
  return request({
    url: baseURL + `/news/v1/recommendNews/` + id,
    method: 'get',

  })
}