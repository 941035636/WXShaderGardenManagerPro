import request from '@/utils/request'
import { tokenName, baseURL } from '@/config'

export function accidentDanger(params) {
  return request({
    url: baseURL + '/statics/v1/accident-danger',
    method: 'get',
    params,
  })
}

export function riskManagement(params) {
  return request({
    url: baseURL + '/statics/v1/risk-management',
    method: 'get',
    params,
  })
}

export function getAccidentInfo(params) {
  return request({
    url: baseURL + '/statics/v1/accident',
    method: 'get',
    params,
  })
}
