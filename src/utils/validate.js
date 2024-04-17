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
  const reg = /^[0-9]\d{0,7}$/
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
 * @description 判断是否为金额不能等于0，小数点后保留两位小数
 * @param value
 * @returns {boolean}
 */
export function isMoneyNo(value) {
  // const reg = /^[1-9]+\d*(\.\d{0,2})?$|^0?\.\d{0,2}$/
  // const reg = /^0(\.[0-9]{1,2})*$|^[1-9]\d{0,7}(\.\d{1,2})*$/
  const reg = /^0\.[0-9]{1,2}$|^[1-9]\d{0,7}\.\d{1,2}$|^[1-9]\d{0,7}$/
  return reg.test(value)
}

/**
 * @description 判断是否为金额(不能为0)
 * @param value
 * @returns {boolean}
 */
export function isMoneys(value) {
  const reg = /^0\.[1-9]{1,2}$|^[1-9]\d{0,7}\.\d{1,2}$|^[1-9]\d{0,7}$/

  return reg.test(value)
}
/**
 * @description 判断是否为金额(不能为0)
 * @param value
 * @returns {boolean}
 */
export function isBigMoney(value) {
  const reg = /^0\.[1-9]{1,2}$|^[1-9]\d{0,9}\.\d{1,2}$|^[1-9]\d{0,9}$/

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
export function CheckSocialCreditCode(Code) {
  var patrn = /^[0-9A-Z]+$/; //18位校验及大写校验
  if (Code.length != 18 || patrn.test(Code) == false) {
    return false;
  } else {
    var Ancode; //统一社会信用代码的每一个值
    var Ancodevalue; //统一社会信用代码每一个值的权重
    var total = 0;
    var weightedfactors = [
      1,
      3,
      9,
      27,
      19,
      26,
      16,
      17,
      20,
      29,
      25,
      13,
      8,
      24,
      10,
      30,
      28
    ]; //加权因子
    var str = "0123456789ABCDEFGHJKLMNPQRTUWXY"; //不用I、O、S、V、Z
    for (var i = 0; i < Code.length - 1; i++) {
      Ancode = Code.substring(i, i + 1);
      Ancodevalue = str.indexOf(Ancode);
      total = total + Ancodevalue * weightedfactors[i]; //权重与加权因子相乘之和
    }
    var logiccheckcode = 31 - (total % 31);
    if (logiccheckcode == 31) {
      logiccheckcode = 0;
    }
    var Str =
      "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
    var Array_Str = Str.split(",");
    logiccheckcode = Array_Str[logiccheckcode];

    var checkcode = Code.substring(17, 18);
    if (logiccheckcode != checkcode) {
      return false;
    } else { }
    return true;
  }
}
/**
 * @desc  密码强度控制开始
 * @param  {String} password 密码
 * @param {String} 
 */
export function passwordLevel(password) {
  var Modes = 0;
  for (var i = 0; i < password.length; i++) {
    Modes |= CharMode(password.charCodeAt(i));
  }
  return bitTotal(Modes);
}
// CharMode函数
function CharMode(iN) {
  if (iN >= 48 && iN <= 57) {
    // 数字
    return 1;
  }
  // if (iN >= 65 && iN <= 90) { // 大写字母
  //     return 2
  // }
  if ((iN >= 97 && iN <= 122) || (iN >= 65 && iN <= 90)) {
    // 大小写
    return 4;
  } else {
    return 8; // 特殊字符
  }
}
// bitTotal函数
function bitTotal(num) {
  var modes = 0;
  for (var i = 0; i < 4; i++) {
    if (num & 1) modes++;
    num >>>= 1;
  }
  return modes;
}