import request from '@/utils/request'
import {
  baseURL
} from '@/config'
export function getList(data) {
  return request({
    url: baseURL + '/user/v1/role/list',
    method: 'post',
    data,
  })
}
/**
 * 保存角色
 * @param {json} data
 * @returns
 */
export function doSave(data) {
  return request({
    url: baseURL + '/user/v1/save/role',
    method: 'post',
    data,
  })
}

/**
 * 关联用户保存
 */
export function correUserSave(data) {
  return request({
    url: baseURL + '/user/v1/role/link/user',
    method: 'post',
    data,
  })
}

/**
 * 修改角色状态
 * @param {string} code 角色编码
 * @param {string} status 状态
 * @returns axios
 */
export function updateStatus(code, status) {
  return request({
    url: baseURL + `/user/v1/update/role/status/${code}/${status}`,
    method: 'get',
  })
}
export function doEdit(data) {
  return request({
    url: '/roleManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/roleManagement/doDelete',
    method: 'post',
    data,
  })
}

/**
 * 删除角色
 * @param {*} id 
 * @returns 
 */
export function doDeleteRole(id) {
  return request({
    url: `${baseURL}/user/v1/role/${id}`,
    method: 'delete',
  })
}