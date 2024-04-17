import request from '@/utils/request'
import { passwordFormat } from '@/utils/md5Encrypt'
import { baseURL, passwordMD5 } from '@/config'

/**
 * 注册接口
 * @param {json} data 注册 报文
 */
export function register(data) {
  if (passwordMD5) {
    let passwordMD5 = data.password ? passwordFormat(data.password) : null
    let confirmPassMD5 = data.confirmPassword
      ? passwordFormat(data.confirmPassword)
      : null
    data.password = passwordMD5
    data.confirmPassword = confirmPassMD5
  }
  console.log(data)
  return request({
    url: baseURL + '/user/v1/save/account',
    method: 'post',
    data,
  })
}

/**
 * 查询用户列表
 * @param {json} data 查询数据
 */
export function getUserList(data) {
  return request({
    //
    url: baseURL + '/user/v1/account/list',
    method: 'post',
    data,
  })
}
/**
 * 用户详情
 * @param {string} userCode 用户编码
 */
export function getUserDetail(userCode) {
  return request({
    url: baseURL + `/user/v1/user/details/${userCode}`,
    method: 'get',
  })
}
/**
 * 修改密码
 * @param {string} form 修改密码 报文
 */
export function modifyPass(form) {
  let data = {}
  if (passwordMD5) {
    let newPwdMD5 = form.newPwd ? passwordFormat(form.newPwd) : null
    let oldPwdMD5 = form.oldPwd ? passwordFormat(form.oldPwd) : null
    let secondPwdMD5 = form.secondPwd ? passwordFormat(form.secondPwd) : null
    data.newPwd = newPwdMD5
    data.oldPwd = oldPwdMD5
    data.secondPwd = secondPwdMD5
    data.userCode = form.userCode
    data.loginAccount = form.loginAccount
  }
  return request({
    url: baseURL + '/user/v1/update/password',
    method: 'post',
    data,
  })
}

/**
 * 重置密码
 * @param {string} form 重置密码 报文
 */
export function resetPass(form) {
  let data = {}
  if (passwordMD5) {
    let newPwdMD5 = form.newPwd ? passwordFormat(form.newPwd) : null
    data.newPwd = newPwdMD5
    data.userCode = form.userCode
    data.loginAccount = form.loginAccount
  }
  return request({
    url: baseURL + '/user/v1/reset/account',
    method: 'post',
    data,
  })
}

/**
 * 用户状态变更
 * @param {string} userCode 用户编码
 * @param {string} status 状态编码
 */
export function updateUserStatus(userCode, status) {
  return request({
    url: baseURL + `/user/v1/update/user/status/${userCode}/${status}`,
    method: 'get',
  })
}

/**
 * 删除用户信息
 * @param {string} code
 * @returns
 */
export function deleteUserInfo(code) {
  return request({
    url: baseURL + `/user/v1/del/user/${code}`,
    method: 'delete',
  })
}

/**
 * 新增应急局账号
 * @param {json} data 查询数据
 */
export function addYingJiZhanghao(data) {
  return request({
    url: baseURL + '/user/v1/save/supervision',
    method: 'post',
    data,
  })
}
/**
 * 修改应急局账号/状态
 * @param {json} data 查询数据
 */
export function putYingJiZhanghao(data) {
  return request({
    url: baseURL + '/user/v1/save/supervision',
    method: 'put',
    data,
  })
}
/**
 * 查询应急局账号
 * @param {json} data 查询数据
 */
export function getYingJiZhanghaoList(data) {
  return request({
    url: baseURL + '/user/v1/supervision/list',
    method: 'post',
    data,
  })
}
/**
 * 应急局账号详情
 * @param {string} userCode 用户编码
 */
export function getYingJiZhanghaoDetail(userCode) {
  return request({
    url: baseURL + `/user/v1/supervision/detail/${userCode}`,
    method: 'get',
  })
}
/**
 * 删除应急局账号
 * @param {string} id
 */
export function delYingJiZhanghaol(id) {
  return request({
    url: baseURL + `/user/v1/supervision/${id}`,
    method: 'delete',
  })
}
// 根据行业最后一级获取行业中文名称
export function getInsuredName(code) {
  return request({
    url: baseURL + `/industry/v1/areaElementInfo?valuesCode=${code}`,
    method: 'get',
  })
}

/**
 * 获取字典编码
 * @param {string} userCode 用户编码
 * 行政等级：20001-事故类型分类 20002-特殊行业领域事故类型分类 20003-投保单位所属行业编码 20004-事故预防服务分类
 * loop 传 true或false
 */
export function getDictData(loop, code) {
  return request({
    url: baseURL + `/common/dict/items/${loop}/${code}`,
    method: 'get',
  })
}

// 获取行业
export function getInsuredData() {
  return request({
    url: baseURL + '/industry/v1/orgElementList/safety',
    method: 'get',
    params: {
      elementRelaConfId: '6',
      areaCode: '321102',
    },
  })
}
// 获取系统时间
export function getSysDate() {
  return request({
    url: baseURL + '/common/date/v1',
    method: 'get',
  })
}

/**
 * 账号关联机构查询
 */
export function getOrgList(params) {
  return request({
    url: baseURL + '/user/v1/orglist',
    method: 'get',
    params,
  })
}

/**
 * 删除账号
 */
export function delAccount(userCode) {
  return request({
    url: baseURL + `/user/v1/account/${userCode}`,
    method: 'delete',
  })
}

/**
 * 删除账号
 */
export function putUserStatus(code, status) {
  return request({
    url: baseURL + `/user/v1/update/user/status/${code}/${status}`,
    method: 'put',
  })
}
