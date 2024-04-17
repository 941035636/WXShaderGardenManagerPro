import request from '@/utils/request'
import { baseURL } from '@/config'

/**
 *
 * 操作日志列表
 */
export function getLogsList( data) {
  return request({
    url: baseURL + `/record/v1/logs`,
    method: 'post',
    data,
  })
}

