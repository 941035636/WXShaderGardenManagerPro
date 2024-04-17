import request from '@/utils/request'
import { baseURL } from '@/config'

/**
 * 新增评估
 * @param {json} data
 * @returns
 */
export function addAssessment(data) {
  return request({
    url: baseURL + '/supervise/v1/estimate',
    method: 'post',
    data,
  })
}

/**
 * 删除评估
 * @param {string} id
 * @returns
 */
export function delAssessment(id) {
  return request({
    url: baseURL + `/supervise/v1/estimate/${id}`,
    method: 'delete',
  })
}

/**
 * 修改评估
 * @param {string} id
 * @param {json} data
 * @returns
 */
export function updateAssessment(id, data) {
  return request({
    url: baseURL + `/supervise/v1/estimate/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 根据id查询评估
 * @param {string} id
 * @returns
 */
export function findAssessmentById(id) {
  return request({
    url: baseURL + `/supervise/v1/estimate/${id}`,
    method: 'get',
  })
}

/**
 * 获取评估列表
 * @param {json}} data
 * @returns
 */
export function getAssessmentList(data) {
  return request({
    url: baseURL + '/supervise/v1/estimates',
    method: 'post',
    data,
  })
}

/**
 * 新增投诉
 * @param {json} data
 * @returns
 */
export function addComplaint(data) {
  return request({
    url: baseURL + '/supervise/v1/complain',
    method: 'post',
    data,
  })
}

/**
 * 获取投诉
 * @param {json} data
 * @returns
 */
export function getComplaintList(data) {
  return request({
    url: baseURL + '/supervise/v1/complains',
    method: 'post',
    data,
  })
}

/**
 * 修改投诉
 * @param {string} id
 * @param {json} data
 * @returns
 */
export function updateComplaint(id, data) {
  console.log(id, data)
  return request({
    url: baseURL + `/supervise/v1/complain/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除投诉
 * @param {string} id
 * @returns
 */
export function delComplaint(id) {
  return request({
    url: baseURL + `/supervise/v1/complain/${id}`,
    method: 'delete',
  })
}

/**
 * 根据id查询投诉
 * @param {string} id
 * @returns
 */
export function findComplaintById(id) {
  return request({
    url: baseURL + `/supervise/v1/complain/${id}`,
    method: 'get',
  })
}

/**
 * 新增奖惩
 * @param {json} data
 * @returns
 */
export function addRewards(data) {
  console.log(data)
  return request({
    url: baseURL + '/supervise/v1/reward-punishment',
    method: 'post',
    data,
  })
}

/**
 * 获取奖惩列表
 * @param {json} data
 * @returns
 */
export function getRewardsList(data) {
  return request({
    url: baseURL + '/supervise/v1/reward-punishments',
    method: 'post',
    data,
  })
}

/**
 * 根据id获取奖惩列表
 * @param {string} id
 * @returns
 */
export function findRewardsById(id) {
  return request({
    url: baseURL + `/supervise/v1/reward-punishment/${id}`,
    method: 'get',
  })
}

/**
 * 更新奖惩列表
 * @param {string} id
 * @param {json} data
 * @returns
 */
export function updateRewards(id, data) {
  console.log(id, data)
  return request({
    url: baseURL + `/supervise/v1/reward-punishment/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除奖惩
 * @param {string} id
 * @returns
 */
export function delRewards(id) {
  return request({
    url: baseURL + `/supervise/v1/reward-punishment/${id}`,
    method: 'delete',
  })
}
