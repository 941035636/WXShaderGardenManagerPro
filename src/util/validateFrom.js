import {
  isIdCard,
  isBlCode,
  isNumber,
  isNum,
  isLsp,
  isMoney,
  isPositiveNum,
} from '@/util/validate'
/**
 * 统一校验联系电话
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateTelephone(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入正确的电话号码'))
  } else if (!/^([0-9]{7,11})$/i.test(value)) {
    callback(new Error('请输入正确的电话号码!'))
  } else {
    callback()
  }
}
/**
 * 统一校验手机号
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validatePhone(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else if (!/^(1[3-9][0-9]{9})$/i.test(value)) {
    callback(new Error('请输入正确的手机号格式!'))
  } else {
    callback()
  }
}
/**
 * 统一校验企业名称
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateQiYeName(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入名称'))
  } else if (!/^([\u4e00-\u9fa5a-zA-Z0-9\（\）]{4,100})$/i.test(value)) {
    callback(new Error('请输入正确的名称!'))
  } else {
    callback()
  }
}
/**
 * 统一校验单位名称
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateDWName(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入'))
  } else if (!/^([\u4e00-\u9fa5a-zA-Z0-9\（\）]{2,100})$/i.test(value)) {
    callback(new Error('请输入正确!'))
  } else {
    callback()
  }
}
/**
 * 统一校验详细地址
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateAddress(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入详细地址'))
  } else if (!/^([\u4e00-\u9fa5a-zA-Z0-9]{6,100})$/i.test(value)) {
    callback(new Error('详细地址必须大于等于6个字符小于100个字符!'))
  } else {
    callback()
  }
}
/**
 * 统一校验经营范围
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateBussinessScope(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入'))
  } else if (!/^([\u4e00-\u9fa5a-zA-Z0-9]{2,300})$/i.test(value)) {
    callback(new Error('详细地址必须大于等于2个字符小于300个字符!'))
  } else {
    callback()
  }
}
/**
 * 统一校验联系人名称
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateContactName(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入联系人名称'))
  } else if (!/^([\u4e00-\u9fa5a-zA-Z0-9]{2,20})$/i.test(value)) {
    callback(new Error('联系人名称必须大于等于2个字符小于20个字符!'))
  } else {
    callback()
  }
}
/**
 * 统一校验法人名称
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateLawName(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入法人名称'))
  } else if (!/^([\u4e00-\u9fa5a-zA-Z0-9]{2,20})$/i.test(value)) {
    callback(new Error('法人名称必须大于等于2个字符小于20个字符!'))
  } else {
    callback()
  }
}
/**
 * 统一校验身份证号码
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateIdCard(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入证件号'))
  } else if (!isIdCard(value)) {
    callback(new Error('请输入正确的证件号!'))
  } else {
    callback()
  }
}
/**
 * 统一校验名称
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateName(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入名称'))
  } else if (!/^([\u4e00-\u9fa5a-zA-Z0-9]{2,10})$/i.test(value)) {
    callback(new Error('名称必须大于等于2个字符小于等于10个字符!'))
  } else {
    callback()
  }
}
/**
 * 统一校验用户名
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateUserName(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入名称'))
  } else if (!/^.{3,30}$/i.test(value)) {
    callback(new Error('名称必须大于等于3个字符小于等于30个字符!'))
  } else {
    callback()
  }
}
/**
 * 统一校验社会信用代码
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateBlCode(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入机构代码!'))
  } else if (!isBlCode(value)) {
    callback(new Error('请输入正确的机构代码!'))
  } else {
    callback()
  }
}
/**
 * 统一校验是否是数字
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateNumber(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入内容!'))
  } else if (!isNumber(value)) {
    callback(new Error('请输入正确的内容!'))
  } else {
    callback()
  }
}
/**
 * 统一校验是否是数字且最多两位小数
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateNum(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入内容!'))
  } else if (!isNum(value)) {
    callback(new Error('请输入正确的数字!'))
  } else {
    callback()
  }
}
/**
 * 统一校验是否是数字且最多两位小数
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateLsp(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入内容!'))
  } else if (!isLsp(value)) {
    callback(new Error('请输入4-30位许可证号!'))
  } else {
    callback()
  }
}
/**
 * 统一校验是否是正整数
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validatePositiveNum(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入内容!'))
  } else if (!isPositiveNum(value)) {
    callback(new Error('请输入1-8位正整数!'))
  } else {
    callback()
  }
}
/**
 * 统一校验是否金额
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateMoney(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入金额!'))
  } else if (!isMoney(value)) {
    callback(new Error('请输入1-8位正数，最多两位小数!'))
  } else {
    callback()
  }
}
/**
 * 统一校验数字并且最小是0最大是999
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateNumMinOrMax(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入条数!'))
  } else if (!isNumber(value) || value > 999 || value < 0) {
    callback(new Error('请输入0-999数字!'))
  } else {
    callback()
  }
}
/**
 * 统一校验数字并且最小是1最大是100
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateNumPercent(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入比例!'))
  } else if (!isNumber(value) || value > 100 || value < 1) {
    callback(new Error('请输入1-100!'))
  } else {
    callback()
  }
}
/**
 * 校验合同编号
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateContractNo(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入内容!'))
  } else if (!/^.{1,30}$/i.test(value)) {
    callback(new Error('合同编码必须大于等于1个字符小于等于50个字符!'))
  // } else if (!/^([a-zA-Z0-9\-\#\_\/\\]{1,50})$/i.test(value)) {
  //   callback(new Error('允许输入字母、数字、-、#、_、/、\\'))
  } else {
    callback()
  }
}
/**
 * 统一校验项目名称
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateProjectName(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入项目名称'))
  } else if (!/^.{1,100}$/i.test(value)) {
    callback(new Error('项目名称必须大于等于1个字符小于等于100个字符!'))
  } else {
    callback()
  }
}
/**
 * 统一校验title
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateTitle(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入标题'))
  } else if (!/^.{1,200}$/i.test(value)) {
    callback(new Error('标题必须大于等于1个字符小于等于200个字符!'))
  } else {
    callback()
  }
}
/**
 * 统一备注说明
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateRemark(rlue, value, callback) {
  if (value === '' && !rlue.required) {
    callback()
  } else if (value === '' && rlue.required) {
    callback(new Error('请输入内容'))
  } else if (!/^.{5,200}$/i.test(value)) {
    callback(new Error('必须大于等于5个字符小于等于200个字符!'))
  } else {
    callback()
  }
}
/**
 * 统一校验项目说明
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateProjectRemarks(rlue, value, callback) {
  if (value === '' && !rlue.required) {
    callback()
  } else if (value === '' && rlue.required) {
    callback(new Error('请输入内容'))
  } else if (!/^.{1,500}$/i.test(value)) {
    callback(new Error('必须大于等于1个字符小于等于500个字符!'))
  } else {
    callback()
  }
}
/**
 * 统一校验第三者
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateThirdParty(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入'))
  } else if (!/^.{2,30}$/i.test(value)) {
    callback(new Error('请输入2-30位!'))
  } else {
    callback()
  }
}
/**
 * 统一校验富文本
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateContent(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入内容'))
  } else if (!/^.{2,60000}$/i.test(value)) {
    callback(new Error('内容必须大于等于2个字符小于60000个字符!'))
  } else {
    callback()
  }
}
/**
 * 统一校验文本域
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateCon(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入内容'))
  } else if (!/^.{1,300}$/i.test(value)) {
    callback(new Error('内容必须大于等于1个字符小于300个字符!'))
  } else {
    callback()
  }
}
/**
 * 统一校验是否为处于-100-100的数字
 */

export function validateAcquaintance(rule, value, callback) {
  // 输入 8--，value 为 8
  // 估计这里内部使用了 parseInt() / parseFloat()
  if (value < -100 || value > 100) {
    callback(new Error('比例在 -100% 至 100 %之间'))
  } else {
    callback()
  }
}
/**
 * 统一校验是否为处于0-10亿的数字
 */

 export function validateBigMoeny(rule, value, callback) {
  // 输入 8--，value 为 8
  // 估计这里内部使用了 parseInt() / parseFloat()
  let num = value -0
  // if (!isNum(num) || num < 0 || num > 1000000000 ) {
    // callback(new Error('支出金额必须大于等于0个字符小于10亿!'))
  if (isNum(num) && num > 0 && num < 1000000000 ) {
    callback()
  } else {
    callback(new Error('支出金额必须大于0小于10亿!'))
  }
}
/**
 * 统一校验是否为处于0-10亿的数字
 */

 export function validateBigNum(rule, value, callback) {
  // 输入 8--，value 为 8
  // 估计这里内部使用了 parseInt() / parseFloat()
  let num = value -0
  // if (!isNum(num) || num < 0 || num > 1000000000 ) {
    // callback(new Error('支出金额必须大于等于0个字符小于10亿!'))
  if (isNum(num) && num > 0 && num <= 1000000000 ) {
    callback()
  } else {
    callback(new Error('正整数，最大10亿!'))
  }
}

/**
 * 统一校验机构名称
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateOrgName(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入机构名称'))
  } else if (!/^([\u4e00-\u9fa5a-zA-Z0-9\（\）]{1,30})$/i.test(value)) {
    callback(new Error('请输入正确的机构名称!'))
  } else {
    callback()
  }
}

/**
 * 统一校验社会信用代码
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateBusiness(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入'))
  } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9\（\）]{1,30}$/i.test(value)) {
    callback(new Error('请输入正确的证件号!'))
  } else {
    callback()
  }
}
/**
 * 统一校验个人证件号码
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validatePersonCard(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入个人证件号码'))
  } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9\（\）]{1,30}$/i.test(value)) {
    callback(new Error('请输入正确的个人证件号码!'))
  } else {
    callback()
  }
}
/**
 * 统一校验保单编码
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validatePolicyNo(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入保单编码'))
  } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9]{5,30}$/i.test(value)) {
    callback(new Error('请输入正确保单编码!'))
  } else {
    callback()
  }
}
/**
 * 统一校验立案号
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateCaseNo(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入'))
  } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9]{1,30}$/i.test(value)) {
    callback(new Error('请输入正确的编码!'))
  } else {
    callback()
  }
}

/**
 * 统一校联系人名称
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateCharger(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入姓名'))
  } else if (!/^([\u4e00-\u9fa5a-zA-Z0-9]{2,4})$/i.test(value)) {
    callback(new Error('名称必须大于等于2个字符小于等于4个字符!'))
  } else {
    callback()
  }
}

/**
 * 统一校验最高工作年限
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateYears(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入工作年限'))
  } else if (!/^(?:[1-9]?\d|100)$/i.test(value)) {
    callback(new Error('工作年限必须为1-100的整数!'))
  } else {
    callback()
  }
}
/**
 * 统一校验密码强度
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateKey(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (!/^(?=.*?[a-zA-Z])(?=.*?[0-9])[\w\W]{8,16}$/i.test(value)) {
    callback(new Error('密码必须为8-16位大小写字母和数字或符号组合哦！'))
  } else {
    callback()
  }
}
/**
 * 统一校2-100的字符
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
 export function validateComment(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入'))
  } else if (!/^.{2,100}$/i.test(value)) {
    callback(new Error('内容是2-100字符!'))
  } else {
    callback()
  }
}
/**
 * 统一校验2-10字符
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
 export function validateLabel(rlue, value, callback) {
  if (value === '') {
    callback(new Error('请输入'))
  } else if (!/^.{2,10}$/i.test(value)) {
    callback(new Error('请输入2-10位!'))
  } else {
    callback()
  }
}
