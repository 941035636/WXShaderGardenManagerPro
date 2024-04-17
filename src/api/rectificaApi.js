import request from '@/utils/request'
import { tokenName, baseURL } from '@/config'

/**
 * 获取当前用户的隐患整改记录
 * @param {string} 
 */
export function getRectificaList(data) {
  return request({
    url: baseURL + '/rctification/getHiddenDangerByUser',
    method: 'post',
    data,
  })
}