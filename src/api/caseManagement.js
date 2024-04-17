import request from '@/utils/request'
import { loginRSA, tokenName, baseURL } from '@/config'
/**
 * 案件列表接口
 * @param {string} params 数据
 */
export function getCaseList(data) {
  return request({
    url: baseURL + '/case/v1/mations',
    method: 'post',
    data,
  })
}
/**
 * 新增案件
 * @param {string} data 数据
 */
export function caseAdd(data) {
  return request({
    url: baseURL + '/case/v1/mation',
    method: 'post',
    data,
  })
}
/**
 * 处理案件
 * @param {json} data
 * @returns
 */
export function caseDeal(data) {
  return request({
    url: baseURL + `/case/v1/mation`,
    method: 'put',
    data,
  })
}
/**
 * 关联保单
 * @param {json} data
 * @returns
 */
export function relatePolicy(data) {
  return request({
    url: baseURL + '/case/v1/relation/',
    method: 'post',
    data,
  })
}
/**
 *  案件详情接口
 * @param {string} id 数据
 */
export function getCaseDetails(id) {
  return request({
    url: baseURL + `/case/v1/mation/${id}`,
    method: 'get',
  })
}
/**
 *  删除
 * @param {string} id 数据
 */
export function delCase(id) {
  return request({
    url: baseURL + `/case/v1/mation/${id}`,
    method: 'delete',
  })
}
/**
 *  查询结案状态
 * @param {string} id 数据
 */
export function applyEnd(id) {
  return request({
    url: baseURL + `/case/v1/status/` + id,
    method: 'get',
  })
}
/**
 *  结案
 * @param {string} id 数据
 */
export function CaseEnd(id) {
  return request({
    url: baseURL + `/case/v1/status/confirm/` + id,
    method: 'get',
  })
}
/**
 *  销案
 * @param {json} data 数据
 */
export function closeCase(data) {
  return request({
    url: baseURL + `/case/v1/status/end`,
    method: 'post',
    data,
  })
}
/**
 *  评论理赔满意度
 * @param {string} id 数据
 */
export function commentCase(id, data) {
  return request({
    url: baseURL + `/case/v1/comment/` + id + '/' + data,
    method: 'get',
  })
}
/**
 *  枚举类
 * @param {string} id 数据
 */
export function getEnum(params) {
  return request({
    url: baseURL + '/common/v1/enum',
    method: 'get',
    params,
  })
}
/**
 *  枚举类String
 * @param {string} id 数据
 */
export function getStrEnum(params) {
  return request({
    url: baseURL + '/common/v1/str/enum',
    method: 'get',
    params,
  })
}

/**
 * 查询保险机构
 */
export function getMechanismList() {
  return request({
    url: baseURL + '/case/v1/insurers',
    method: 'get',
  })
}

export function caseFile(data) {
  return request({
    url: baseURL + '/case/v1/casefile',
    method: 'post',
    data,
  })
}
