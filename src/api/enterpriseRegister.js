import request from '@/utils/request'
import { loginRSA, tokenName, baseURL } from '@/config'

/**
 * 查询企业列表
 * @param {*} params
 * @returns
 */
 export function getBatchaddList(params) {
    return request({
        url: baseURL + '/user/v1/batchadd',
        method: 'GET',
        params,
    })
}

/**
 * 注册企业
 * @param {*} data
 * @returns
 */
export function addBatchadd(data) {
    return request({
        url: baseURL + '/user/v1/batchadd',
        method: 'POST',
        data,
    })
}

/**
 * 修改企业
 * @param {*} data
 * @returns
 */
export function updateBatchadd(data) {
    return request({
        url: baseURL + `/user/v1/batchadd`,
        method: 'POST',
        data,
    })
}

/**
 * 企业详情
 * @param {*} id
 * @returns
 */
export function batchaddDetail(id) {
    return request({
        url: baseURL + `/user/v1/userinfo/${id}`,
        method: 'GET',
    })
}

// /api/user/v1/batchadd/B

/**
 * 批量注册
 * @param {*} data
 * @returns
 */
export function batchImport(data) {
    return request({
        url: baseURL + `/user/v1/batchadd/B`,
        method: 'POST',
        data,
    })
}

/**
 * 删除
 * @param {*} id
 * @returns
 */
export function deleteBatch(id) {
    return request({
        url: baseURL + `/user/v1/userinfo/${id}`,
        method: 'DELETE',
    })
}


/**
 * 获取操作人
 * @param {*} data
 * @returns
 */
export function getPersonqueryList() {
    return request({
        url: baseURL + '/user/v1/personquery',
        method: 'GET',
    })
}