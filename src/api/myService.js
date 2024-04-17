import request from '@/utils/request'
import { baseURL } from '@/config'

export function checkcomplete(params) {
  return request({
    url: baseURL + '/user/v1/checkcomplete',
    method: 'get',
    params,
  })
}


export function getPolicyInfos(data) {
  return request({
    url: baseURL + '/policy/v1/policylist',
    method: 'post',
    data,
  })
}

export function getPolicyInfosBz(data) {
  return request({
    url: baseURL + '/policy/v1/mations',
    method: 'post',
    data,
  })
}

export function deletePolicy(id) {
  return request({
    url: baseURL + `/policy/v1/mation/${id}`,
    method: 'delete',
  })
}