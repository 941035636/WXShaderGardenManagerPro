import request from '@/utils/request'
import { loginRSA, tokenName, baseURL } from '@/config'
/**
 * 保单台账列表接口
 * @param {string} params 数据
 */
export function getPolicyLeagerList(data) {
  return request({
    url: baseURL + '/standingbook/v1/policy',
    method: 'post',
    data,
  })
}
/**
 * 保单台账导出
 * @param {string} params 数据
 */
export function downloadPolicyLeagerList(data) {
  return request({
    url: baseURL + '/standingbook/v1/policy/download',
    method: 'post',
    data,
    responseType: 'arraybuffer',
  })
}
/**
 * 案件台账列表接口
 * @param {string} params 数据
 */
export function getCaseLeagerList(data) {
  return request({
    url: baseURL + '/standingbook/v1/cases',
    method: 'post',
    data,
  })
}
/**
 * 案件台账导出
 * @param {string} params 数据
 */
export function downloadCaseLeagerList(data) {
  return request({
    url: baseURL + '/standingbook/v1/cases/download',
    method: 'post',
    data,
    responseType: 'arraybuffer',
  })
}
/**
 * 事故预防台账列表接口
 * @param {string} params 数据
 */
export function getAccidentLeagerList(data) {
  return request({
    url: baseURL + '/standingbook/v1/accident',
    method: 'post',
    data,
  })
}
/**
 * 事故预防台账导出
 * @param {string} params 数据
 */
export function downloadAccidentLeagerList(data) {
  return request({
    url: baseURL + '/standingbook/v1/accident/download',
    method: 'post',
    data,
    responseType: 'arraybuffer',
  })
}
/**
 * 服务台账列表接口
 * @param {string} params 数据
 */
export function getServedEnterprise(data) {
  return request({
    url: baseURL + '/standingbook/v1/servedEnterprise',
    method: 'post',
    data,
  })
}
/**
 * 服务台账导出
 * @param {string} params 数据
 */
export function downloadServedEnterprise(data) {
  return request({
    url: baseURL + '/standingbook/v1/servedEnterprise/download',
    method: 'post',
    data,
    responseType: 'arraybuffer',
  })
}
