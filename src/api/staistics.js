import request from '@/utils/request'
import {
  baseURL
} from '@/config'
/**
 * 各保险承保情况
 * @param {*} data

 */
export function getPolicyAnalyse(params) {
  return request({
    url: baseURL + `/statistics/v1/analyse/policy`,
    method: 'get',
    params,
  })
}
/**
 * 案件赔付 情况
 * @param {*} data

 */
export function getCaseByArea(params) {
  return request({
    url: baseURL + `/statistics/v1/caseByArea`,
    method: 'get',
    params,
  })
}
/**
 * 统计大屏展示
 * @param {*} data

 */
export function getStatisticsIndex(params) {
  return request({
    url: baseURL + `/statistics/v1/index`,
    method: 'get',
    params,
  })
}
/**
 * 各地区参保情况
 * @param {*} data

 */
export function getInsureByArea(params) {
  return request({
    url: baseURL + `/statistics/v1/insureByArea`,
    method: 'get',
    params,
  })
}
/**
 * 事故预防统计
 * @param {*} data

 */
export function getReportAccident(params) {
  return request({
    url: baseURL + `/statistics/v1/accidentServiceCorp`,
    method: 'get',
    params,
  })
}
/**
 * 事故预防服务覆盖率
 * @param {*} data

 */
export function getAccidentcoverage(params) {
  return request({
    url: baseURL + `/statistics/v1/analyse/accidentcoverage`,
    method: 'get',
    params,
  })
}
export function getInsuredRate(params) {
  return request({
    url: baseURL + '/statistics/v1/insurance/insuredRate-area',
    method: 'get',
    params,
  })
}
export function getInsuredIndustry(params) {
  return request({
    url: baseURL + '/statistics/v1/insureByIndustry',
    method: 'get',
    params,
  })
}
export function getInsuranceTrendOfMonth(params) {
  return request({
    url: baseURL + '/statistics/v1/insuranceTrendOfMonth',
    method: 'get',
    params,
  })
}
export function getInsuranceView(params) {
  return request({
    url: baseURL + '/statistics/v1/insurance/view',
    method: 'get',
    params,
  })
}
export function getCaseTrendOfMonth(params) {
  return request({
    url: baseURL + '/statistics/v1/caseTrendOfMonth',
    method: 'get',
    params,
  })
}
export function getCaseTrendByAccidentType(params) {
  return request({
    url: baseURL + '/statistics/v1/caseTrendByAccidentType',
    method: 'get',
    params,
  })
}
export function getCaseWithRateByArea(params) {
  return request({
    url: baseURL + '/statistics/v1/caseWithRateByArea',
    method: 'get',
    params,
  })
}
export function getCaseWithRateByIndstry(params) {
  return request({
    url: baseURL + '/statistics/v1/caseWithRateByIndustry',
    method: 'get',
    params,
  })
}
export function getSreviceOrg(params) {
  return request({
    url: baseURL + '/statistics/v1/serviceOrganization',
    method: 'get',
    params,
  })
}
export function getSreviceInsuredCompany(params) {
  return request({
    url: baseURL + '/statistics/v1/serviceOrganization/insuredCompany',
    method: 'get',
    params,
  })
}
export function getSreviceUnderwriting(params) {
  return request({
    url: baseURL + '/statistics/v1/serviceOrganization/underwriting',
    method: 'get',
    params,
  })
}
export function getSreviceTimes(params) {
  return request({
    url: baseURL + '/statistics/v1/serviceOrganization/servTimes',
    method: 'get',
    params,
  })
}
/**
 * 事故预防专家
 * @param {*} data

 */
export function getExpertNum(params) {
  return request({
    url: baseURL + '/statistics/v1/accident/expert',
    method: 'get',
    params,
  })
}
/**
 * 事故预防覆盖率
 * @param {*} data

 */
export function getAccidentCoverage(params) {
  return request({
    url: baseURL + '/statistics/v1/accident/coverage',
    method: 'get',
    params,
  })
}
/**
 * 事故预防费用
 * @param {*} data

 */
export function getAccidentCost(params) {
  return request({
    url: baseURL + '/statistics/v1/accident/cost',
    method: 'get',
    params,
  })
}
/**
 * 事故预防服务情况
 * @param {*} data

 */
export function getAccidentSituation(params) {
  return request({
    url: baseURL + '/statistics/v1/accident/situation',
    method: 'get',
    params,
  })
}
/**
 * 三查记录
 * @param {*} data

 */
export function getCheckInfo(params) {
  return request({
    url: baseURL + '/statistics/v1/check/checkInfo',
    method: 'get',
    params,
  })
}