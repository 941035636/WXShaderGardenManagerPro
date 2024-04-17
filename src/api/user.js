import request from '@/utils/request'
// import { encryptedData } from '@/utils/encrypt'
import { passwordFormat } from '@/utils/md5Encrypt'
import { loginRSA, passwordMD5, tokenName, baseURL } from '@/config'
/**
 * 登录
 * @param {json} data 登录参数
 */
export async function login(data) {
  // if (loginRSA) {
  //   data = await encryptedData(data)
  // }
  // return request({
  //   url: '/login',
  //   method: 'post',
  //   data,
  // })
  let imgCode = data.imgCodes
  delete data.imgCodes
  if (passwordMD5) {
    data.password = passwordFormat(data.password)
  }
  return request({
    url: baseURL + '/user/v1/login',
    method: 'post',
    data,
    headers: { imgCode: imgCode },
  })
}

export function getUserInfo() {
  return request({
    url: baseURL + '/user/v1/mation',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}

export function updatePassword(params) {
  return request({
    url: baseURL + '/user/v1/update/password',
    method: 'post',
    params,
  })
}

/**
 * 获取验证码
 * @returns axios
 */
export function getCaptcha(timeStamp) {
  return request({
    url: baseURL + `/user/v1/kaptcha?d=${timeStamp}`,
    method: 'get',
    responseType: 'arraybuffer',
  })
}
/**
 * 获取首页统计数据
 * @returns axios
 */
export function getStatistics(params) {
  return request({
    url: baseURL + `/statistics/api/v1/total/static`,
    method: 'get',
    params,
  })
}

/**
 * 获取当前用户的企业信息
 * @returns axios
 */
export function getEntInfoByUser(params) {
  return request({
    url: baseURL + `/sysEnt/getEntInfoByUser`,
    method: 'get',
    params,
  })
}


/**
 * 修改当前用户的企业信息
 * @returns axios
 */
export function alterSave(data) {
  return request({
    url: baseURL + `/sysEnt/save`,
    method: 'post',
    data,
  })
}

/**
 * 获取企业信息列表
 * @returns axios
 */
export function getSysEntList(data) {
  return request({
    url: baseURL + `/sysEnt/list`,
    method: 'post',
    data,
  })
}

/**
 * 修改当前用户的企业信息
 * @returns axios
 */
export function getItems(key) {
  return request({
    url: baseURL + `/common/dict/items/true/${key}`,
    method: 'get',
  })
}

/**
 * 删除企业信息
 * @returns axios
 */
export function deleteOrg(id) {
  return request({
    url: baseURL + '/sysEnt/delete?id=' + id,
    method: 'post',
  })
}

/**
 * 获取企业信息详情
 * @returns axios
 */
export function getDetail(id) {
  return request({
    url: baseURL + '/sysEnt/getEntInfoByEntNo?entNo=' + id,
    method: 'get',
  })
}