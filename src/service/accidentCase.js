import $apiUrl from '../api/apiUrl'
import { post, get, put, deletes } from '../api/index'

export function AddAccidentCase(data) {
    return post($apiUrl.ACCIDENT_CASE_ADD_UPDATE, data).then((res) => { return res })
}
/**
 * 事故案例列表查询
 * @param {*} data
 * @returns
 */
export function getAccidentCaseList(data) {
    return post($apiUrl.ACCIDENT_CASE_LIST, data).then((res) => { return res })
}

/**
 * 获取服务器时间
 * @returns
 */
export function getDateTime() {
    return get($apiUrl.GETDATETIME).then((res) => { return res })
}

/**
 * 查看事故案例
 * @param {*} id
 * @returns
 */
export function getAccidentCaseDetail(id) {
    return get($apiUrl.ACCIDENT_CASE_DETAIL + id).then((res) => { return res })
}


/**
 * 删除事故案例
 * @param {*} id
 * @returns
 */
export function deleteAccidentCase(id) {
    return deletes($apiUrl.ACCIDENT_CASE_DELETE + id).then((res) => { return res })
}

// ACCIDENT_CASE_LOG_LIST
/**
 * 操作日志列表
 * @param {*}
 * @returns
 */
export function getAccidentCaseLog(data) {
    return post($apiUrl.ACCIDENT_CASE_LOG_LIST, data).then((res) => { return res })
}

/**
 * 添加操作日志
 * @param {*} data
 * @returns
 */
export function addAccidentCaseLog(data) {
    return post($apiUrl.ACCIDENT_CASE_LOG_ADD, data).then((res) => { return res })
}


/**
 * 删除附件
 * @param {*} id
 * @returns
 */
export function deleteAccidentCaseFile(id) {
    return deletes($apiUrl.ACCIDENT_CASEF_ILE_DELETE + id).then((res) => { return res })
}