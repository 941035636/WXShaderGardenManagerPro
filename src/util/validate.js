/**
 * @description 判读是否为外链
 * @param path
 * @returns {boolean}
 */
 export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @description 校验密码是否小于6位
 * @param str
 * @returns {boolean}
 */
export function isPassword(str) {
  return str.length >= 6
}

/**
 * @description 判断是否为数字
 * @param value
 * @returns {boolean}
 */
export function isNumber(value) {
  const reg = /^[0-9]*$/
  return reg.test(value)
}
/**
 * @description 判断是否为4-30位的数字字母
 * @param value
 * @returns {boolean}
 */
export function isLsp(value) {
  const reg = /^[a-z0-9]{4,30}$/ //正则表达式
  return reg.test(value)
}
/**
 * @description 判断是否为正整数
 * @param value
 * @returns {boolean}
 */
export function isPositiveNum(value) {
  const reg = /^[1-9]\d{0,7}$/
  return reg.test(value)
}
/**
 * @description 判断是否为金额
 * @param value
 * @returns {boolean}
 */
export function isMoney(value) {
  const reg = /^0\.[0-9]{1,2}$|^[0-9]\d{0,7}\.\d{1,2}$|^[0-9]\d{0,7}$/

  return reg.test(value)
}

/**
 * @description 判断是否是名称
 * @param value
 * @returns {boolean}
 */
export function isName(value) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
  return reg.test(value)
}

/**
 * @description 判断是否为IP
 * @param ip
 * @returns {boolean}
 */
export function isIP(ip) {
  const reg =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(ip)
}

/**
 * @description 判断是否是传统网站
 * @param url
 * @returns {boolean}
 */
export function isUrl(url) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @description 判断是否是小写字母
 * @param str
 * @returns {boolean}
 */
export function isLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @description 判断是否是大写字母
 * @param str
 * @returns {boolean}
 */
export function isUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @description 判断是否是大写字母开头
 * @param str
 * @returns {boolean}
 */
export function isAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @description 判断是否是字符串
 * @param str
 * @returns {boolean}
 */
export function isString(str) {
  return typeof str === 'string' || str instanceof String
}

/**
 * @description 判断是否是数组
 * @param arg
 * @returns {arg is any[]|boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @description 判断是否是端口号
 * @param str
 * @returns {boolean}
 */
export function isPort(str) {
  const reg =
    /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
  return reg.test(str)
}

/**
 * @description 判断是否是手机号
 * @param str
 * @returns {boolean}
 */
export function isPhone(str) {
  const reg = /^1\d{10}$/
  return reg.test(str)
}

/**
 * @description 判断是否是身份证号(第二代)
 * @param str
 * @returns {boolean}
 */
export function isIdCard(str) {
  const reg =
    /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return reg.test(str)
}

/**
 * @description 判断是否是邮箱
 * @param str
 * @returns {boolean}
 */
export function isEmail(str) {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  return reg.test(str)
}

/**
 * @description 判断是否中文
 * @param str
 * @returns {boolean}
 */
export function isChina(str) {
  const reg = /^[\u4E00-\u9FA5]{2,4}$/
  return reg.test(str)
}

/**
 * @description 判断是否为空
 * @param str
 * @returns {boolean}
 */
export function isBlank(str) {
  return (
    str == null ||
    false ||
    str === '' ||
    str.trim() === '' ||
    str.toLocaleLowerCase().trim() === 'null'
  )
}

/**
 * @description 判断是否为固话
 * @param str
 * @returns {boolean}
 */
export function isTel(str) {
  const reg =
    /^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/
  return reg.test(str)
}

/**
 * @description 判断是否为数字且最多两位小数
 * @param str
 * @returns {boolean}
 */
export function isNum(str) {
  const reg = /^\d+(\.\d{1,2})?$/
  return reg.test(str)
}
/**
 * @description 判断是否为json
 * @param value
 * @returns {boolean}
 */
export function isJson(value) {
  if (typeof value == 'string') {
    try {
      var obj = JSON.parse(value)
      if (typeof obj == 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}

/**
 * @description 判断最后一级行业
 * @param code1 code2 code3 code4 对应不同4级行业
 */
export function isLastIndustry(code1, code2, code3, code4) {
  let lastCode = ''
  if (code1 != 'invalidation' && code1) {
    lastCode = code1
  }
  if (code2 != 'invalidation' && code2) {
    lastCode = code2
  }
  if (code3 != 'invalidation' && code3) {
    lastCode = code3
  }
  if (code4 != 'invalidation' && code4) {
    lastCode = code4
  }
  return lastCode
}
/**
 * @description 判断营业执照
 * @param str
 * @returns {boolean}
 */
export function isBlCode(str) {
  const reg = /^[A-Za-z0-9]{2,18}$/
  return reg.test(str)
}
/**
 * 转换金额大写
 * @param {*} n
 */
export function smalltoBIG(n) {
  var fraction = ['角', '分']
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  var unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ]
  var head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  var s = ''
  for (var i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
    ).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = ''
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  )
}
/**
 * 检验起期是否大于止期
 * @param {*} start 开始时间
 * @param {*} end  结束时间
 */
export function dateTest(start, end) {
  var oDate1 = new Date(start)
  var oDate2 = new Date(end)
  if (oDate1.getTime() > oDate2.getTime()) {
    return true
  } else {
    return false
  }
}
/**
 * 统一校3-30的字符
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function valueLength(value, reg=/^.{3,30}$/i) {
  if (reg.test(value)) {
    return true
  } else {
    return false
  }
}
