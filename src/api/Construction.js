import request from '@/utils/request'
import { baseURL } from '@/config'

/**
 *添加
 * @param {string}
 */
export function mation(data) {
  return request({
    url: baseURL + '/construction/v1/mation',
    method: 'post',
    data
  })
}
//列表
/**
 *
 * @param {string}
 */
export function mationsList(data) {
  return request({
    url: baseURL + '/construction/v1/mations',
    method: 'post',
    data
  })
}
//删除
/**
 *
 * @param {string}
 */
export function deleteJZsg(id) {
  return request({
    url: baseURL + `/construction/v1/mation/${id}`,
    method: 'delete',
  })
}
// GET /api/organization/v1/project/{BlCode}

/**
 *修改状态接口
 * @param {string}
 */
export function statusjz(id) {
  return request({
    url: baseURL + `/construction/v1/status/${id}`,
    method: 'put',

  })
}

/**
 *修改接口
 * @param {string}
 */
export function mationXG(id, data) {
  return request({
    url: baseURL + `/construction/v1/mation/${id}`,
    method: 'put',
    data
  })
}
/**
 *建筑施工详情
 * @param {string}
 */
export function mationXqs(id) {
  return request({
    url: baseURL + `/construction/v1/mation/${id}`,
    method: 'get',
  })
}
/**
 *建筑施工购买条数
 * @param {string}
 */
export function totalNum(data) {
  return request({
    url: baseURL + `/construction/v1/total`,
    method: 'get',
    data
  })
}
/**
 * 建筑施工批量导入
 * @param {string} data
 */
export function convertFileToEntity(data) {
  return request({
    url: baseURL + '/construction/v1/convertFileToEntity',
    method: 'post',
    data,
  })
}
/**
 * 建筑施工批量导出
 * @param {string} data
 */
export function download(data) {
  return request({
    url: baseURL + '/construction/v1/convertFile/download',
    method: 'post',
    data,
    responseType: 'arraybuffer',
  })
} 