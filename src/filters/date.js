import moment from 'moment'
import 'moment/locale/zh-cn'
export const format = (date, string='YYYY-MM-DD') => {
  if (date) {
    return moment(date).format(string)
  }
}


export const setTime = (date) => {
  if (date) {
    return date.split(' ')[0] || ''
  }
  return ''
}
