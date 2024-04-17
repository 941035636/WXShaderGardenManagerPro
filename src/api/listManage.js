import request from '@/utils/request'
import { loginRSA, tokenName, baseURL } from '@/config'

/**
 * 岗位清单列表分页
 * @param {*} data
 * @returns
 */
export function getStandardList(data) {
  return request({
    url: baseURL + '/standard/getStandardList',
    method: 'POST',
    data,
  })
}
/**
 * 删除岗位清单
 * @param {*} id
 * @returns
 */
export function delStandardList(id) {
  return request({
    url: baseURL + `/standard/delete`,
    method: 'GET',
    params: { id: id }
  })
}


/**
 * 保存岗位清单
 * @param {*} data
 * @returns
 */
export function saveStandardList(data) {
  return request({
    url: baseURL + '/standard/save',
    method: 'POST',
    data,
  })
}


/**
 * 导出岗位清单
 * @param {*} data
 * @returns
 */
export function expStandardList(data) {
  return request({
    url: baseURL + '/standard/export',
    method: 'POST',
    data,
  })
}


/**
 * 导入岗位清单
 * @param {*} data
 * @returns
 */
export function imputStandardList(data) {
  return request({
    url: baseURL + '/standard/imput',
    method: 'POST',
    data,
  })
}


// ------------ 岗位清单 ----------------
/**
 * 岗位清单详情列表
 * @param {*} data
 * @returns
 */
export function getStandardInfoList(data) {
  return request({
    url: baseURL + '/standardInfo/getStandardInfoList',
    method: 'POST',
    data,
  })
}

/**
 * 新增岗位清单详情
 * @param {*} data
 * @returns
 */
export function saveStandardInfo(data) {
  return request({
    url: baseURL + '/standardInfo/save',
    method: 'POST',
    data,
  })
}




/**
 * 批量删除岗位清单详情数据
 * @param {*} data  
 * @returns
 */
export function deleteStandardInfo(data) {
  return request({
    url: baseURL + '/standardInfo/delete',
    method: 'POST',
    data,
  })
}


/**
 * 获取反查数据
 * @param {*} id
 * @returns
 */
export function getDbInfo(standardId, dbStr) {
  return request({
    url: baseURL + `/standardInfo/getDbInfo`,
    method: 'GET',
    params: {
      standardId,
      dbStr
    }
  })
}

/**
 * 手动生成隐患记录
 * @param {*} id
 * @returns
 */
export function createStandardHiddenDangerById(id) {
  return request({
    url: baseURL + `/standardHiddenDanger/createStandardHiddenDangerById`,
    method: 'GET',
    params: {
      id
    }
  })
}

/**
 * 字典
 * @param {*} code
 * @returns
 */
export function dictTrue(code) {
  return request({
    url: baseURL + `/common/dict/items/true/${code}`,
    method: 'GET',
  })
}


/**
 * 台账 - 排查记录 - 列表反查数据
 * @param {*} code
 * @returns
 */
export function getListParams() {
  return request({
    url: baseURL + `/standardHiddenDanger/getListParams`,
    method: 'GET',
  })
}

// 隐患管理 - 清单记录 
/**
 * 台账-排查记录
 * @param {*} data  
 * @returns
 */
export function troubleshootingRecords(data) {
  return request({
    url: baseURL + '/standardHiddenDanger/troubleshootingRecords',
    method: 'POST',
    data,
  })
}

/**
 * 台账-隐患记录
 * @param {*} data  
 * @returns
 */
export function hazardRecords(data) {
  return request({
    url: baseURL + '/rctification/hazardRecords',
    method: 'POST',
    data,
  })
}

/**
 * 台账 - 排查记录 - 查看详情
 * @param {*} data  
 * @returns
 */
export function troubleshootingRecordsDetail(data) {
  return request({
    url: baseURL + '/standardHiddenDanger/troubleshootingRecordsDetail',
    method: 'POST',
    data,
  })
}

/**
 * 导出排查岗位清单
 * @param {*} data  
 * @returns
 */
export function excepTroubleshootingRecordsDetail(data) {
  return request({
    url: baseURL + '/standardHiddenDanger/excepTroubleshootingRecordsDetail',
    method: 'POST',
    data,
    responseType: 'arraybuffer',
  })
}



