import request from '@/utils/request'
import { baseURL } from '@/config'
/**
 * 新增保险机构
 * @param {*} data
 * servicename = insuranceBrokerSvc 保险经纪机构,insuranceCompanySvc 保险机构,safetyOrganizationSvc 安全服务机构
 */
export function addInsuranceBranch(data) {
  return request({
    url: baseURL + `/organization/v1/save/${data.servicename}`,
    method: 'post',
    data,
  })
}
/**
 * 获取保险机构列表
 * @param {*} params
 * servicename = insuranceBrokerSvc 保险经纪机构,insuranceCompanySvc 保险机构,safetyOrganizationSvc 安全服务机构
 */
export function getBranchList(params) {
  return request({
    url: baseURL + `/organization/v1/list/${params.servicename}`,
    method: 'get',
    params,
  })
}
export function getServiceList(params) {
  return request({
    url: baseURL + `/organization/v1/list/safetyorg`,
    method: 'get',
    params,
  })
}
export function getBranchLists(params) {
  return request({
    url: baseURL + `/organization/v1/reverseload/${params.servicename}`,
    method: 'get',
    params,
  })
}
/**
 * 获取保险机构详情
 * @param {*} code
 * servicename = insuranceBrokerSvc 保险经纪机构,insuranceCompanySvc 保险机构,safetyOrganizationSvc 安全服务机构
 */
export function getBranchDetails(params) {
  return request({
    url:
      baseURL + `/organization/v1/details/${params.servicename}/${params.code}`,
    method: 'get',
  })
}
/**
 * 修改保险机构列表
 * @param {*} data
 * servicename = insuranceBrokerSvc 保险经纪机构,insuranceCompanySvc 保险机构,safetyOrganizationSvc 安全服务机构
 */
export function putBranch(data) {
  return request({
    url: baseURL + `/organization/v1/update/${data.servicename}`,
    method: 'put',
    data,
  })
}
/**
 * 删除机构详情
 * @param {*} code
 */
export function delBranch(code, params) {
  return request({
    url: baseURL + `/branch/v1/del/branch/${code}`,
    method: 'delete',
    params,
  })
}
/**
 * 专家列表
 * @param {string} params
 */
export function getExpertList(params) {
  return request({
    url: baseURL + '/expert/v1/list',
    method: 'get',
    params,
  })
}
/**
 * 新增专家
 * @param {string} data
 */
export function addExpert(data) {
  return request({
    url: baseURL + '/expert/v1/save',
    method: 'post',
    data,
  })
}
/**
 * 查看专家详情
 * @param {string} code
 */
export function getExpertDetail(code) {
  return request({
    url: baseURL + `/expert/v1/details/${code}`,
    method: 'get',
  })
}
/**
 * 修改专家信息
 * @param {string} data
 */
export function putExpertinfos(data) {
  return request({
    url: baseURL + `/expert/v1/alter`,
    method: 'put',
    data,
  })
}
/**
 * 修改专家状态
 * @param {string} data
 */
export function putExpertinfo(data) {
  return request({
    url: baseURL + `/expert/v1/alter/dataStatus`,
    method: 'put',
    data,
  })
}
/**
 * 删除机构详情
 * @param {*} code
 */
export function delExpert(code, params) {
  return request({
    url: baseURL + `/user/v1/del/expert/${code}`,
    method: 'delete',
    params,
  })
}
/**
 * 生产企批量导入
 * @param {string} data
 */
export function addorganizationfile(data) {
  return request({
    url: baseURL + '/organization/v1/organizationfile',
    method: 'post',
    data,
  })
}
/**
 * 生产企业列表
 * @param {string} data
 */
export function getOrgList(data) {
  return request({
    url: baseURL + '/organization/v1/mations',
    method: 'post',
    data,
  })
}

/**
 * 生产企业列表 项目信息
 * @param {string} data
 */
export function project(BlCode, projectName) {
  if (projectName) {
    return request({
      url: baseURL + `/organization/v1/project/${BlCode}?projectName=${projectName}`,
      method: 'get',
    })
  } else {
    return request({
      url: baseURL + `/organization/v1/project/${BlCode}`,
      method: 'get',
    })
  }
}
export function projectdata(BlCode, params) {
  return request({
    url: baseURL + `/organization/v1/project/${BlCode}`,
    method: 'get',
    params
  })
}

/**
 * 修改生产经营单位状态
 * @param {string} id
 */
export function changStatus(id) {
  return request({
    url: baseURL + `/organization/v1/Status/${id}`,
    method: 'put',
  })
}
/**
 * 生产经营单位详情
 * @param {string} userCode
 */
export function getOrgDetails(id) {
  return request({
    url: baseURL + `/organization/v1/mation/${id}`,
    method: 'get',
  })
}
/**
 * 新增生产经营单位
 * @param {object} data
 */
export function addOrg(data) {
  return request({
    url: baseURL + `/organization/v1/mation`,
    method: 'post',
    data,
  })
}

/**
 * 修改生产经营单位
 * @param {json} data
 */
export function editOrg(data, id) {
  return request({
    url: baseURL + `/organization/v1/mation/${id}`,
    method: 'put',
    data,
  })
}
/**
 * 删除生产经营单位
 * @param @param {*} id
 */
export function deleteOrg(id) {
  return request({
    url: baseURL + `/organization/v1/mation/${id}`,
    method: 'delete',
  })
}
/**
 * 机构绑定专家接口
 * @param {string} data
 */
export function bindExpert(data) {
  return request({
    url: baseURL + '/branch/v1/bind/expert',
    method: 'post',
    data,
  })
}
/**
 * 变更机构状态
 * @param {string} data
 */
export function updateBranchStatus(branchId, status) {
  return request({
    url: baseURL + `/branch/v1/update/branch/status/${branchId}/${status}`,
    method: 'post',
  })
}
/**
 * 变更专家状态
 */
export function updateExpertStatus(id, status) {
  return request({
    url: baseURL + `/user/v1/update/expert/status/${id}/${status}`,
    method: 'get',
  })
}
/**
 * 变更高危状态
 */
export function updateOrgStatus(id, status) {
  return request({
    url: baseURL + `/user/v1/update/org/status/${id}/${status}`,
    method: 'get',
  })
}
/**
 * 查询高危企业国民经济类型
 */
export function getNational() {
  return request({
    url: baseURL + `/common/v1/national`,
    method: 'get',
  })
}

/**
 * 关联专家查询专家列表（没有关联的专家）
 */
export function getLinkExpertList(params) {
  return request({
    url: baseURL + '/expert/v1/linkExpertList',
    method: 'get',
    params,
  })
}

/**
 * 关联专家查询专家列表（机构关联上的专家）
 */
export function getOrgExpertList(params, servicename, id) {
  return request({
    url: baseURL + `/organization/v1/orgExperts/${servicename}/${id}`,
    method: 'get',
    params,
  })
}

/**
 * 关联专家保存接口
 */
export function postOrgExpert(data, servicename, id) {
  return request({
    url: baseURL + `/organization/v1/linkexpert/${servicename}/${id}`,
    method: 'post',
    data,
  })
}

/**
 * 删除专家信息
 * @param {*} id
 */
export function delExpertInfo(id) {
  return request({
    url: baseURL + `/expert/v1/expert/${id}`,
    method: 'delete',
  })
}

/**
 * 删除关联的专家
 * @param {*} servicename-服务名称   id
 */
export function delLinkExpert(data, servicename, id) {
  return request({
    url: baseURL + `/organization/v1/dellinkexpert/${servicename}/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除机构
 * @param {*} servicename-服务名称   id
 */
export function delServiceOrg(servicename, id) {
  return request({
    url: baseURL + `/organization/v1/organization/${servicename}/${id}`,
    method: 'delete',
  })
}

/**
 * 机构详情获取专家详细信息列表
 * @param {*} servicename-服务名称   id
 */
export function getOrgExpertDetail(params, servicename, id) {
  return request({
    url: baseURL + `/organization/v1/orgExpertDetials/${servicename}/${id}`,
    method: 'get',
    params,
  })
}
// 政府监管登录查询的获取地区和行业
export function getSupAuthority() {
  return request({
    url: baseURL + `/user/v1/supervision/authority`,
    method: 'get',
  })
}

/**
 * 企业台账
 * @param {string} data
 */
export function organiList(data) {
  return request({
    url: baseURL + '/standingbook/v1/organization',
    method: 'post',
    data,
  })
}

/**
 * 企业台账导出
 * @param {string} data
 */
export function downloadTz(data) {
  return request({
    url: baseURL + '/standingbook/v1/servedOrganization/download',
    method: 'post',
    data,
    responseType: 'arraybuffer',
  })
}
/**
 * 企业管理列表
 * @param {string} data
 */
export function postOrgList(data) {
  return request({
    url: baseURL + '/organization/v1/history/mations',
    method: 'post',
    data,
  })
}
/**
 * 企业管理历史企业单位列表年份反向加载列表 /api/organization/v1/history/yearLoadList
 * @param {string} data
 */
export function yearLoadList() {
  return request({
    url: baseURL + '/organization/v1/history/yearLoadList',
    method: 'get',
  })
}

/**
 * 企业管理历史企业单位查询详情  /api/organization/v1/history/mation/{id}
 * @param {string} data
 */
export function getdetails(id) {
  return request({
    url: baseURL + `/organization/v1/history/mation/${id}`,
    method: 'get',
  })
}

/**
 * 企业管理历史企业单位更新 /api/organization/v1/history/mation/{id}
 * @param {string} data
 */
export function putupdate(data, id) {
  return request({
    url: baseURL + `/organization/v1/history/mation/${id}`,
    method: 'put',
    data
  })
}
/**
 * 企业管理历史企业单位删除  /api/organization/v1/history/mation/{id}
 * @param {string} data
 */
export function deleteList(id) {
  return request({
    url: baseURL + `/organization/v1/history/mation/${id}`,
    method: 'delete',
  })
}
/**
 * 修改生产经营单位列表企业类型  （鼓励企业、应保企业）
 */
export function putBusinessType(id, businessType) {
  return request({
    url: baseURL + `/organization/v1/type/${id}/${businessType}`,
    method: 'put',
  })
}
/**
 * 建筑施工台账 /api/standingbook / v1 / construction
 */
export function constructionList(data) {
  return request({
    url: baseURL + '/standingbook/v1/construction',
    method: 'post',
    data,
  })
}

/**
 * 企业台账导出 /api/standingbook/v1/construction/download
 * @param {string} data
 */
export function downloadExport(data) {
  return request({
    url: baseURL + '/standingbook/v1/construction/download',
    method: 'post',
    data,
    responseType: 'arraybuffer',
  })
}

/**
 * 建筑施工企业管理历史企业单位列表年份反向加载列表 /api/construction/v1/history/getYears
 * @param {string} data
 */
export function getYearsList() {
  return request({
    url: baseURL + '/construction/v1/history/getYears',
    method: 'get',
  })
}
/**
 * 建筑施工企业管理列表 /api/construction/v1/histories
 * @param {string} data
 */
export function historiesList(data) {
  return request({
    url: baseURL + '/construction/v1/histories',
    method: 'post',
    data,
  })
}
/**
 * 建筑施工管理历史企业单位删除  /api/construction/v1/history/{id}
 * @param {string} data
 */
export function deleteProject(id) {
  return request({
    url: baseURL + `/construction/v1/history/${id}`,
    method: 'delete',
  })
}
/**
 * 建筑施工企业管理历史企业单位更新 /api/construction/v1/history/{id}
 * @param {string} data
 */
export function putProject(data, id) {
  return request({
    url: baseURL + `/construction/v1/history/${id}`,
    method: 'put',
    data
  })
}

/**
 * 建筑施工项目管理导出 // /api/construction/v1/histories/download
 * @param {string} data
 */
export function downloadProject(data) {
  return request({
    url: baseURL + '/construction/v1/histories/download',
    method: 'post',
    data,
    responseType: 'arraybuffer',
  })
}