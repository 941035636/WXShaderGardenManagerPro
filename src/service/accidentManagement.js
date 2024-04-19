// 事故预防
import $apiUrl from '../api/apiUrl'
import {post,get,put,deletes} from '../api/index'
let baseURL = ''
/**
 * 获取项目列表
 * @param {json} data
 * @returns
 */
export function getProjectList(data) {
  return post($apiUrl.GET_PROJECTS_LIST,data).then((res)=>{return res})
}
/**
 * 获取项目列表
 * @param {json} data
 * @returns
 */
export function getTransferList(data) {
  return post($apiUrl.GET_TRANSFER_LIST,data).then((res)=>{return res})
}
/**
 * 项目转移详情
 * @param {json} data
 * @returns
 */
export function getTransfer(data) {
  return post($apiUrl.TRANFER_DETAIL,data).then((res)=>{return res})
}
/**
 * 项目转移
 * @param {json} data
 * @returns
 */
export function Transfer(data) {
  return put($apiUrl.TRANFER_DETAIL,data).then((res)=>{return res})
}
/**
 * 新增项目
 * @param {json} data
 * @returns
 */
export function addProject(data) {
  return post($apiUrl.ADD_PROJECTS,data).then((res)=>{return res})
}
/**
 * 编辑项目
 * @param {json} data
 * @returns
 */
export function updateProject(data, id) {
  return put($apiUrl.ADD_PROJECTS+`/${id}`,data).then((res)=>{return res})
}
/**
 * 新增计划
 * @param {json} data
 * @returns
 */
export function addPlan(data) {
  return post($apiUrl.ADD_PLAN,data).then((res)=>{return res})
}
/**
 * 删除计划
 * @param {json} data
 * @returns
 */
export function deletesPlan(id) {
  return deletes($apiUrl.ADD_PLAN+`/${id}`).then((res)=>{return res})
}
/**
 * 获取项目详情
 * @param {json} id
 * @returns
 */
export function getProjectDetails(id) {
  return get($apiUrl.ADD_PROJECTS+`/${id}`).then((res)=>{return res})
}
/**
 * 新增隐患排查
 * @param {json} data
 * @returns
 */
export function addDanger(data) {
  return post($apiUrl.ADD_DANGER,data).then((res)=>{return res})
}
/**
 * 更改隐患点
 * @param {*} id
 */
export function updateDanger(data, id) {
  return put($apiUrl.ADD_DANGER+`/${id}`,data).then((res)=>{return res})
}
/**
 * 获取隐患点详情
 * @param {*} id
 */
export function getDanger(id) {
  return get($apiUrl.ADD_DANGER+`/${id}`).then((res)=>{return res})
}
/**
 * 获取计划详情
 * @param {json} id
 * @returns
 */
export function getPlanDetails(id) {
  return get($apiUrl.GET_PLAN+`${id}`).then((res)=>{return res})
}
/**
 * 新增隐患复查接口
 * @param {json} data
 * @returns
 */
export function addRecheck(data) {
  return post($apiUrl.ADD_RECHECK,data).then((res)=>{return res})
}
/**
 * 新增安全总结（安全培训）
 * @param {json} data
 * @returns
 */
export function addTrainSummary(data, id) {
  return post($apiUrl.PLAN_SUMMARY+`${id}/train/summary`,data).then((res)=>{return res})
}
/**
 * 新增安全总结（安全风险辨识、评估）
 * @param {json} data
 * @returns
 */
export function addAssessmenSummary(data, id) {
  return post($apiUrl.PLAN_SUMMARY+`${id}/assessment/summary`,data).then((res)=>{return res})
}
/**
 * 新增安全总结（隐患排查）
 * @param {json} data
 * @returns
 */
export function addInvestigateSummary(data, id) {
  return post($apiUrl.PLAN_SUMMARY+`${id}/investigate/summary`,data).then((res)=>{return res})
}
/**
 * 项目总结
 * @param {json} id
 * @returns
 */
export function finishProject(id) {
  return put($apiUrl.PUT_FINISH+id).then(res=>{return res})
}
/**
 * 更新计划状态
 * @param {json} id
 * @returns
 */
export function updatepalnstatus(id) {
  return put($apiUrl.UPDATA_PLAN_STATUS+id).then((res)=>{return res})
}


/**
 * 删除隐患点详情
 * @param {*} id
 */
export function deleteDanger(id) {
  return deletes($apiUrl.ADD_DANGER+`/${id}`)
}
/**
 * 删除项目接口
 * @param {*} id
 */
export function deleteProject(id) {
  return deletes($apiUrl.ADD_PROJECTS+`/${id}`).then((res)=>{return res})
}
/**
 * 查询当前产品
 * @param {*} id
 */
export function getQueryProduct(id) {
  return get($apiUrl.QUERY_ACCIDENT_PRODUCT).then((res)=>{return res})
}
/**
 * 项目附件上传
 * @param {json} data
 * @param {json} url
 * @returns
 */
export function projectFile(data, url) {
  return post($apiUrl.ADD_PROJECT_FILE+url,data).then((res)=>{return res})
}
/**
 * 项目附件删除
 * @param {json} id
 * @returns
 */
export function deleteFiles(id) {
  return deletes($apiUrl.DELETES_FILE+id).then((res)=>{return res})
}
/**
 * 计划附件上传
 * @param {json} data
 * @param {json} url
 * @returns
 */
export function planFile(data, url) {
  return post($apiUrl.ADD_PLAN_FILE+url,data).then(res=>{return res})
}
/**
 * 计划列表数据
 * @param {json} data
 * @param {json} url
 * @returns
 */
export function getPlansList(data, url) {
  return get($apiUrl.GET_PLAN_LIST,data).then(res=>{return res})
}
/**
 * 新增文件标签
 * @param {json} data
 * @param {json} addFileLabel
 * @returns
 */
export function addFileLabel(data,id) {
  return post($apiUrl.ADD_FILE_LABEL+`/${id}`,data).then(res=>{return res})
}
/**
 * 审核列表
 * @param {json} data
 * @param {json} addFileLabel
 * @returns
 */
export function getRolePorjectList(data,id) {
  return get($apiUrl.ROLE_PORJECT_LIST,data).then(res=>{return res})
}
/**
 * 审核详情
 * @param {json} data
 * @param {json} addFileLabel
 * @returns
 */
export function getRolePorjectDetail(data,id) {
  return get($apiUrl.ROLE_PORJECT_DETAILS,data).then(res=>{return res})
}
/**
 * 审核列表
 * @param {json} data
 * @param {json} addFileLabel
 * @returns
 */
export function postRolePorject(data,id) {
  return post($apiUrl.ROLE_PORJECT_HANDLE,data).then(res=>{return res})
}
/**
 * 下载模板
 * @param {json} data
 * @param {json} addFileLabel
 * @returns
 */
export function downloadFile(data,id) {
  return get($apiUrl.DOWNLOAD_TEMPLATE_FLIE,data).then(res=>{return res})
}
