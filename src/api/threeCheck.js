import request from '@/utils/request'
import {
  baseURL
} from '@/config'
// 获取列表接口
export function getList(data) {
  return request({
    url: baseURL + '/check/v1/checks',
    method: 'post',
    data,
  })
}
// 三查台账创建
export function subMit(data) {
  return request({
    url: baseURL + '/check/v1/check',
    method: 'post',
    data,
  })
}
// 查询三查台账详情
export function getDetail(id) {
  return request({
    url: baseURL + `/check/v1/check/${id}`,
    method: 'get',
  })
}

// 修改
export function editCheck(data) {
  return request({
    url: baseURL + '/check/v1/check',
    method: 'put',
    data
  })
}
// 删除
export function delCheck(id) {
  return request({
    url: baseURL + '/check/v1/check/' + id,
    method: 'delete',
  })
}