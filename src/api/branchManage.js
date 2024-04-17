import request from '@/utils/request'
import { tokenName, baseURL } from '@/config'

/**
 * 部门信息保存
 * @param {string} data
 */
export function sysDeptSave(data) {
  return request({
    url: baseURL + '/sysDept/save',
    method: 'post',
    data,
  })
}

/**
 * 部门列表查询
 * @param {string} data
 */
export function sysDeptList(data) {
  return request({
    url: baseURL + '/sysDept/list',
    method: 'post',
    data,
  })
}

/**
 * 部门信息删除
 * @param {string} id
 */
export function sysDeptDel(id) {
  return request({
    url: baseURL + '/sysDept/delete?id=' + id,
    method: 'get',
  })
}

/**
 * 根据部门获取岗位
 * @param {string} data
 */
export function getPostByDept(code) {
  return request({
    url: baseURL + '/sysDeptPost/getDeptPostByDept?deptNo=' + code,
    method: 'get',
  })
}

/**
 * 根据部门获取全部岗位（包括关闭的岗位）
 * @param {string} data
 */
export function getAllPostByDept(code, params) {
  return request({
    url: baseURL + '/sysDeptPost/getAllDeptPostByDept?deptNo=' + code,
    method: 'get',
    params: params
  })
}

/**
 * 岗位信息删除
 * @param {string} id
 */
export function delSysPost(id) {
  return request({
    url: baseURL + '/sysPost/delete?id=' + id,
    method: 'get',
  })
}

/**
 * 岗位信息保存
 * @param {string} data
 */
export function sysPostSave(data) {
  return request({
    url: baseURL + '/sysPost/save',
    method: 'post',
    data,
  })
}


/**
 * 获取账户管理中关联机构
 * @param {string} 
 */
export function getAllList() {
  return request({
    url: baseURL + '/sysEnt/allList',
    method: 'get',
  })
}

/**
 * 获取账户管理中部门
 * @param {string} 
 */
export function getByEntNo(no) {
  return request({
    url: baseURL + '/sysDept/listByEntNo?entNo=' + no,
    method: 'get',
  })
}