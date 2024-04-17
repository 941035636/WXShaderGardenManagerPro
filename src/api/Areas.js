import request from '@/utils/request'
import { baseURL } from '@/config'

/**
 *
 * @param {string} type 格式类型：0 不带全部；1 带全部
 */
export function getAreaInfo(type, params) {
  return request({
    url: baseURL + `/common/area/v1/${type}`,
    method: 'get',
    params,
  })
}

/**
 *
 * @param {string} type 格式类型：0 不带全部；1 带全部
 */
export function getAreaDetail(id, type, params) {
  return request({
    url: baseURL + `/common/area/v1/${id}/${type}`,
    method: 'get',
    params,
  })
}
/**
 *
 * @param {string} type 格式类型：0 不带全部；1 带全部
 */
export function getStreet(id, params) {
  return request({
    url: baseURL + `/common/area/v1/${id}/2`,
    method: 'get',
    params,
  })
}
/**
 *
 * @param {string} type 格式类型：0 不带全部；1 带全部
 */
export function getNextArea(id, type) {
  return request({
    url: baseURL + `/common/area/v1/next/${id}/${type}`,
    method: 'get',
  })
}
/**
 *
 * @param {string} type 格式类型：0 不带全部；1 带全部
 */
export function getAreaName(code) {
  return request({
    url: baseURL + `/common/area/v1/region/` + code,
    method: 'get',
  })
}
