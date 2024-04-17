import request from '@/utils/request'
import { tokenName, baseURL } from '@/config'

/**
 * 手动生成隐患记录
 * @param {string} data
 */
export function createDangerById(data) {
  return request({
    url: baseURL + '/api/standardHiddenDanger/createStandardHiddenDangerById',
    method: 'get',
    data,
  })
}

/**
 * 获取当前用户的岗位清单
 * @param {string} data
 */
export function getDangerByUser(data) {
  return request({
    url: baseURL + '/standardHiddenDanger/getHiddenDangerByUser',
    method: 'post',
    data,
  })
}


/**
 * 排查进度统计
 * @returns axios
 */
export function getDangerByUserCount() {
  return request({
    url: baseURL + '/standardHiddenDanger/getHiddenDangerByUserCount',
    method: 'get',
  })
}

/**
 * 检查不合格
 * @param {string} id
 */
export function checkNoPass(data) {
  return request({
    url: baseURL + '/standardHiddenDangerInfo/checkNoPass',
    method: 'post',
    data,
  })
}

/**
 * 检查完成
 * @param {string} params
 */
export function checkOver(params) {
  return request({
    url: baseURL + '/standardHiddenDangerInfo/checkOver',
    method: 'get',
    params,
  })
}

/**
 * 检查合格
 * @param {string} id
 */
export function checkPass(id) {
  return request({
    url: baseURL + '/standardHiddenDangerInfo/checkPass?id=' + id,
    method: 'get',
  })
}


/**
 * 隐患详情数据列表
 * @param {string} id
 */
export function getHiddenByUser(id) {
  return request({
    url: baseURL + '/standardHiddenDangerInfo/getHiddenDangerByUser?standardHiddenDangerId=' + id,
    method: 'get',
  })
}


/**
 * 获取当前用户的隐患整改记录
 * @param {string} id
 */
export function getHiddenDangerByUser(data) {
  return request({
    url: baseURL + '/rctification/getHiddenDangerByUser',
    method: 'post',
    data,
  })
}


/**
 * 指派隐患
 * @param {string} id
 */
export function assign(data) {
  return request({
    url: baseURL + '/rctification/assign',
    method: 'post',
    data,
  })
}



/**
 * 查看隐患审批流程数据
 * @param {string} id
 */

export function getHiddenDangerFlowListByBatchId(params) {
  return request({
    url: baseURL + '/rctification/getHiddenDangerFlowListByBatchId',
    method: 'get',
    params,
  })
}




/**
 * 整改隐患
 * @param {string} id
 */
export function rectification(data) {
  return request({
    url: baseURL + '/rctification/rectification',
    method: 'post',
    data,
  })
}



/**
 * 获取当前用户的隐患验收记录
 * @param {string} id
 */
export function getCheckList(data) {
  return request({
    url: baseURL + '/rctification/getCheckList',
    method: 'post',
    data,
  })
}


/**
 * 验收不合格
 * @param {string} id
 */
export function acceptanceCheckCheckNoPass(data) {
  return request({
    url: baseURL + '/rctification/checkNoPass',
    method: 'post',
    data,
  })
}



/**
 * 验收合格
 * @param {string} id
 */
export function acceptanceCheckCheckPass(data) {
  return request({
    url: baseURL + '/rctification/checkPass',
    method: 'post',
    data,
  })
}




/**
 * 指派验收
 */
export function checkAssign(data) {
  return request({
    url: baseURL + '/rctification/checkAssign',
    method: 'post',
    data,
  })
}



/**
 * 获取首页岗位清单
 */

export function getHomeHiddenDangerByUser(data) {
  return request({
    url: baseURL + '/standardHiddenDanger/homePage/getHiddenDangerByUser',
    method: 'post',
    data,
  })
}





/**
 * 上传接口
 */
export function upload(data) {
  return request({
    url: baseURL + '/files/v1/upload/file',
    method: 'post',
    data,
  })
}



/**
 * 检查不合格回显
 */
export function getCheckNoPassInfo(params) {
  return request({
    url: baseURL + '/standardHiddenDangerInfo/getCheckNoPassInfo',
    method: 'get',
    params,
  })
}


/**
 * 修改不合格信息
 */
export function updateCheckNoPass(data) {
  return request({
    url: baseURL + '/standardHiddenDangerInfo/updateCheckNoPass',
    method: 'post',
    data,
  })
}

//获取当前用户的隐患验收记录-反查数据
export function getFindParams(params) {
  return request({
    url: baseURL + '/rctification/getCheckList/getFindParams',
    method: 'get',
    params,
  })
}

//获取当前用户的隐患整改记录-反查数据
export function getDangerParams(params) {
  return request({
    url: baseURL + '/rctification/getHiddenDangerByUser/getFindParams',
    method: 'get',
    params,
  })
}


// 
//获取当前用户的隐患整改记录-反查数据
export function getStandardListByUserPost() {
  return request({
    url: baseURL + '/standard/getStandardListByUserPost',
    method: 'get',
  })
}

/**
 * 新增隐患快报
 */
export function addReport(data) {
  return request({
    url: baseURL + '/rctification/addReport',
    method: 'post',
    data,
  })
}