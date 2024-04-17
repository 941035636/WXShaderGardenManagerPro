// 事故预防
import request from '@/utils/request'
import { loginRSA, tokenName, baseURL } from '@/config'
import { method } from 'lodash'
/**
 * 获取项目列表
 * @param {json} data
 * @returns
 */
export function getProjectList(data) {
  return request({
    url: baseURL + '/accident/v1/projects',
    method: 'post',
    data,
  })
}
/**
 * 新增项目
 * @param {json} data
 * @returns
 */
export function addProject(data) {
  return request({
    url: baseURL + '/accident/v1/project',
    method: 'post',
    data,
  })
}
/**
 * 编辑项目
 * @param {json} data
 * @returns
 */
export function updateProject(data, id) {
  return request({
    url: baseURL + `/accident/v1/project/${id}`,
    method: 'put',
    data,
  })
}
/**
 * 新增计划
 * @param {json} data
 * @returns
 */
export function addPlan(data) {
  return request({
    url: baseURL + '/accident/v1/plan',
    method: 'post',
    data,
  })
}
/**
 * 获取项目详情
 * @param {json} id
 * @returns
 */
export function getProjectDetails(id) {
  return request({
    url: baseURL + `/accident/v1/project/${id}`,
    method: 'get',
  })
}
/**
 * 新增隐患排查
 * @param {json} data
 * @returns
 */
export function addDanger(data) {
  return request({
    url: baseURL + `/accident/v1/danger`,
    method: 'post',
    data,
  })
}
/**
 * 获取计划详情
 * @param {json} id
 * @returns
 */
export function getPlanDetails(id) {
  return request({
    url: baseURL + `/accident/v1/plan/${id}`,
    method: 'get',
  })
}
/**
 * 新增隐患复查接口
 * @param {json} data
 * @returns
 */
export function addRecheck(data) {
  return request({
    url: baseURL + `/accident/v1/recheck`,
    method: 'post',
    data,
  })
}
/**
 * 新增安全总结（安全培训）
 * @param {json} data
 * @returns
 */
export function addTrainSummary(data, id) {
  return request({
    url: baseURL + `/accident/v1/${id}/train/summary`,
    method: 'post',
    data,
  })
}
/**
 * 新增安全总结（隐患排查）
 * @param {json} data
 * @returns
 */
export function addInvestigateSummary(data, id) {
  return request({
    url: baseURL + `/accident/v1/${id}/investigate/summary`,
    method: 'post',
    data,
  })
}
/**
 * 项目总结
 * @param {json} id
 * @returns
 */
export function finishProject(id) {
  return request({
    url: baseURL + `/accident/v1/finish/${id}`,
    method: 'put',
  })
}
/**
 * 更新计划状态
 * @param {json} id
 * @returns
 */
export function updatepalnstatus(id) {
  return request({
    url: baseURL + `/accident/v1/plan/status/${id}`,
    method: 'put',
  })
}
/**
 * 获取隐患点详情
 * @param {*} id
 */
export function getDanger(id) {
  return request({
    url: baseURL + `/accident/v1/danger/${id}`,
    method: 'get',
  })
}
/**
 * 更改隐患点
 * @param {*} id
 */
export function updateDanger(data, id) {
  return request({
    url: baseURL + `/accident/v1/danger/${id}`,
    method: 'put',
    data,
  })
}
/**
 * 删除隐患点详情
 * @param {*} id
 */
export function deleteDanger(id) {
  return request({
    url: baseURL + `/accident/v1/danger/${id}`,
    method: 'delete',
  })
}
/**
 * 删除项目接口
 * @param {*} id
 */
export function deleteProject(id) {
  return request({
    url: baseURL + `/accident/v1/project/${id}`,
    method: 'delete',
  })
}
/**
 * 项目附件上传
 * @param {json} data
 * @param {json} url
 * @returns
 */
export function projectFile(data, url) {
  return request({
    url: baseURL + `/accident/v1/project/${url}`,
    method: 'post',
    data,
  })
}
/**
 * 项目附件删除
 * @param {json} id
 * @returns
 */
export function deleteFiles(id) {
  return request({
    url: baseURL + `/files/v1/file/${id}`,
    method: 'delete',
  })
}
/**
 * 计划附件上传
 * @param {json} data
 * @param {json} url
 * @returns
 */
export function planFile(data, url) {
  return request({
    url: baseURL + `/accident/v1/plan/${url}`,
    method: 'post',
    data,
  })
}
/**
 * 计划列表数据
 * @param {json} data
 * @param {json} url
 * @returns
 */
export function getPlansList(params, url) {
  return request({
    url: baseURL + `/accident/v1/plans`,
    method: 'get',
    params,
  })
}

/**
 * 新增安全总结（安全风险辨识、评估）
 * @param {json} data
 * @returns
 */
export function addAssessmenSummary(data, id) {
  return request({
    url: baseURL + `/accident/v1/${id}/assessment/summary`,
    method: 'post',
    data,
  })
}

/**
 * 下载模板
 * @param {json} data
 * @param {json} addFileLabel
 * @returns
 */
export function downloadFile(params, id) {
  return request({
    url: baseURL + `/accident/v1/templateFile`,
    method: 'get',
    params,
  })
}

/**
 * 获取计划详情
 * @param {json} id
 * @returns
 */
export function updatePlan(data) {
  return request({
    url: baseURL + `/accident/v1/plan`,
    method: 'put',
    data,
  })
}

/**
 * 删除计划详情
 * @param {json} id
 * @returns
 */
export function deletesPlan(id) {
  return request({
    url: baseURL + `/accident/v1/plan/${id}`,
    method: 'delete',
  })
}

/**
 * 企业文件
 * @param {*} id
 */
export function uploadCorpFile(id, data) {
  return request({
    url: baseURL + `/accident/v1/uploadEnterprise/${id}`,
    method: 'post',
    data,
  })
}
export function addFileLabel(data, id) {
  return request({
    url: baseURL + `/common/v1/fileLabelType/${id}`,
    method: 'post',
    data,
  })
}


/**
 * 安全生产标准化
 */
export function addRecord(data) {
  return request({
    url: baseURL + `/accident/v1/record`,
    method: 'post',
    data,
  })
}

export function deleteRecord(id) {
  return request({
    url: baseURL + `/accident/v1/record/${id}`,
    method: 'delete',
  })
}


export function putRecord(data, id) {
  return request({
    url: baseURL + `/accident/v1/record/${id}`,
    method: 'put',
    data,
  })
}

// export function updatePlan(data) {
//   return request({
//     url: baseURL + `/accident/v1/plan`,
//     method: 'put',
//     data,
//   })
// }




