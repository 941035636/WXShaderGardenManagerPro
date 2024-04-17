import request from '@/utils/request'
import {
  loginRSA,
  tokenName,
  baseURL
} from '@/config'

export function getVerifyList(data) {
  return request({
    url: baseURL + '/policy/v1/policylist',
    method: 'post',
    data,
  })
}
export function verifyPolicy(data) {
  return request({
    url: baseURL + '/policy/v1/approve',
    method: 'post',
    data,
  })
}
export function getPolicyList(data) {
  return request({
    url: baseURL + '/policy/v1/mations',
    method: 'post',
    data,
  })
}
export function commentPolicy(data) {
  return request({
    url: baseURL + '/evaluate/v1/mation',
    method: 'post',
    data,
  })
}
export function getHomePolicyList(data) {
  return request({
    url: baseURL + '/policy/api/v1/policys/static',
    method: 'post',
    data,
  })
}

export function policyfile(data) {
  return request({
    url: baseURL + '/policy/v1/policyfile',
    method: 'post',
    data,
  })
}
/**
 * 获取总计数据
 * @param {*} data
 * @returns
 */
export function getTotal(data) {
  return request({
    url: baseURL + '/policy/v1/policyTotal',
    method: 'post',
    data,
  })
}

export function addPolicy(data) {
  return request({
    url: baseURL + '/policy/v1/mation',
    method: 'post',
    data,
  })
}
export function deletePolicy(id) {
  return request({
    url: baseURL + '/policy/v1/mation/' + id,
    method: 'delete',

  })
}
export function editPolicy(data, id) {
  return request({
    url: baseURL + `/policy/v1/mation/${id}`,
    method: 'put',
    data,
  })
}
export function uploadFile(data) {
  return request({
    url: baseURL + '/files/v1/upload/file', //上传图片
    method: 'post',
    data,
  })
}
export function downloadFile(id) {
  return request({
    url: baseURL + '/files/downloadfile/' + id, //下载
    responseType: 'blob',
    method: 'get',
  })
}

export function isRenewal(id) {
  return request({
    url: baseURL + '/policy/v1/renewal/' + id, //是否续保
    method: 'get',
  })
}
export function getPremType(data) {
  return request({
    url: baseURL + '/policy/v1/PremType/', //保费方式
    method: 'post',
    data,
  })
}
export function getIntrilution(data) {
  return request({
    url: baseURL + '/organization/v1/unitInfo/' + data, //保费方式
    method: 'get',
  })
}
export function getIntrilute() {
  return request({
    url: baseURL + '/organization/v1/unitInfo', //保费方式
    method: 'get',
  })
}
export function sameHolder(custFullName) {
  return request({
    url: baseURL + '/organization/v1/blCodeInfo/' + custFullName, //同被保人
    method: 'get',
  })
}
export function dictItem(status, code) {
  return request({
    url: baseURL + `/common/dict/items/${status}/${code}`, //查询下拉框数据
    method: 'get',
  })
}
export function getHolder(id) {
  return request({
    url: baseURL + '/organization/v1/nameInfos/' + id, //模糊查询
    method: 'get',
  })
}
export function getFactor(id) {
  return request({
    url: baseURL + '/policy/v1/rate/' + id, //获取费率因子名称
    method: 'get',
  })
}
export function policyData(id) {
  return request({
    url: baseURL + '/policy/v1/mation/' + id, //保单详情
    method: 'get',
  })
}
export function getPolicyNo(id) {
  return request({
    url: baseURL + '/policy/v1/policysNo/' + id, //保单模糊查询
    method: 'get',
  })
}
export function policyTotalPerm(data) {
  return request({
    url: baseURL + `/insure/api/v1/policy-total-perm`,
    method: 'post',
    data,
  })
}