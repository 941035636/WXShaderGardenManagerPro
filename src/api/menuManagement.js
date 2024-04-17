import request from '@/utils/request'
import { baseURL } from '@/config'
export function getTree(roleCode) {
  return request({
    url: baseURL + '/user/v1/menu/tree',
    method: 'get',
    params: { roleCode: roleCode },
  })
}

/**
 * 关联菜单
 * @param {json} data
 * @returns
 */
export function corrMenu(data) {
  return request({
    url: baseURL + '/user/v1/role/link/menu',
    method: 'post',
    data,
  })
}

/**
 * 保存菜单
 * @param {json} data 数据
 * @returns axios
 */
export function doSave(data) {
  return request({
    url: baseURL + '/user/v1/save/menu',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/menuManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(id) {
  return request({
    url: baseURL + `/user/v1/menu/${id}`,
    method: 'delete',
  })
}

/**
 * 排序
 * @param {string} code 菜单编码
 * @param {string} flag flag：1-降序，0-升序
 * @returns axios
 */
export function sortMenu(code, flag) {
  return request({
    url: baseURL + '/user/v1/sort/menu/' + code + '/' + flag,
    method: 'post',
  })
}

export function updateStatus(code, status) {
  return request({
    url: baseURL + `/user/v1/update/menu/status/${code}/${status}`,
    method: 'get',
  })
}
