import moment from 'moment';
export default class stringHelper {
  constructor() {
    // ...
  }

  /**
   *
   * @desc   字符串替换
   * @param  {String} str
   * @return {String}
   */
  static Format() {
    if (arguments.length === 0) {
      return null
    }
    var str = arguments[0]
    for (var i = 1; i < arguments.length; i++) {
      var re = new RegExp('\\{' + (i - 1) + '\\}', 'g')
      str = str.replace(re, arguments[i])
    }
    return str
  }

  /**
   *
   * @desc   字符串替换
   * @param  {String} str
   * @return {String}
   */
  static FormatStr() {
    if (arguments.length === 0) {
      return null
    }
    var str = arguments[0].actionDetail
    var businessTypeCode = arguments[0].businessTypeCode
    for (var i = 0; i < arguments[0].params.length; i++) {
      var re = new RegExp('\\{' + arguments[0].params[i] + '\\}', 'g')
      let replaceStr = arguments[1][arguments[0].params[i]] ? arguments[1][arguments[0].params[i]]:(arguments[2][arguments[0].params[i]] ? arguments[2][arguments[0].params[i]] : '');
      replaceStr = replaceStr ? replaceStr : '';
      str = str.replace(re, replaceStr)
    }
    arguments[0].actionDetail = str;
    if(businessTypeCode === 'loginAccount') {
      arguments[0].businessTypeCode = window.localStorage.getItem('loginAccount');
    } else {
      let replaceStr = arguments[1][businessTypeCode] ? arguments[1][businessTypeCode]:(arguments[2][businessTypeCode] ? arguments[2][businessTypeCode] : businessTypeCode);
      arguments[0].businessTypeCode = replaceStr;
    }
    return arguments[0];
}

  /**
   * 判断字符串是否为空
   * @param str
   * @returns {boolean}
   */

  static isNull(str) {
    return str == null || str == "null" || str.length === 0 || str === '';

  }

  /**
   *
   * @desc  判断是否为身份证号
   * @param  {String|Number} str
   * @return {Boolean}
   */
  static isIdCard(str) {
    return /^^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(str)
    // return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str)
  }

  /**
   *
   * @desc   判断是否为手机号
   * @param  {String|Number} str
   * @return {Boolean}
   */
  static isPhoneNum(str) {
    return /^(0|86|17951)?(1[3-9][0-9])[0-9]{8}$/.test(str)
  }



  /**
   *
   * @desc   校验必填项
   * @param  {Array} list
   * @param  {Array} arr
   * @return {Boolean}
   */
  static isNullOrArray(list,arr) {
    let num = false;
    list.forEach(item =>{
      let map = new Map(Object.entries(item));
      arr.forEach(ele => {
        if(this.isNull(map.get(ele).trim())){
          num = true;
        }
        
      })
    });
    return num;
  }

   /**
   *
   * @desc   转换类型
   * @param  {Array} list
   * @return {Array}
   */
  static toJSON(list) {
    return JSON.parse(JSON.stringify(list))
  }

  /**
   *
   * @desc   获取省市区
   * @param  {Array} list
   * @param  {String} provinceCode
   * @param  {String} cityCode
   * @return {Object}
   */
  static getArea(list,provinceCode,cityCode) {
    let data = {};
    list.forEach(item => {
      if (item.value == provinceCode){
        data.city = item.children;
        item.children.forEach(ele => {
            if (ele.value == cityCode) {
              data.district = ele.children;
            }
        })
      }
    })
    return data;
  }


  /**
   *
   * @desc   获取保险止期
   * @param  {String} startDate
   * @return {Object}
   */
  static isGetEndDate(startDate) {
    let date = {};
    if(startDate){
      // let start = new Date(startDate);
      // let yearFull = start.getFullYear() + 1;
      // let mouthFull = start.getMonth() + 1;
      // let dayFull = start.getDate();
      // date.endDate = moment(new Date(yearFull + '-' + mouthFull + '-' + dayFull)- 24*60*60*1000).format('YYYY-MM-DD 23:59:59'); 
      // date.startDate = moment(startDate).format('YYYY-MM-DD 00:00:00');
      let start = new Date(startDate);
      date.endDate = moment(new Date(start)).add(Number(1), 'y').subtract(1, 'd').format('YYYY-MM-DD 23:59:59'); 
      date.startDate = moment(startDate).format('YYYY-MM-DD 00:00:00');
    }else{
      date.endDate = "";
      date.startDate = "";
    }
    return date;
  }



   /**
   *
   * @desc   验证身份证号是否有效
   * @param  {String} val_
   * @return {Boolean}
   */
	static isCardtValid (val_) {
		//let returnInfo= ["验证通过!", "身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!", "身份证号码校验错误!", "身份证地区非法!","身份证号码位数不对"];
		if (val_.length != 15 && val_.length != 18)
		{
			return false;
		}

		let area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };

		if (area[parseInt(val_.substr(0, 2))] == null)
		{
			return false;
		}

		let tempBirth="";

		switch (val_.length) {
			case 15:
				tempBirth = '19' + val_.substr(6, 2) + '-' + val_.substr(8, 2) + '-' + val_.substr(10, 2);
				return this.isDate(tempBirth);
			case 18:
				tempBirth = val_.substr(6, 4) + '-' + val_.substr(10, 2) + '-' + val_.substr(12, 2);
				let flagData  = this.isDate(tempBirth);

				//校验码判断
				let s = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);   //系数
				let b = new Array('1','0','X','9','8','7','6','5','4','3','2');  //校验码对照表
				let id_array = [...val_];
				let sum = 0;
				for(var k=0;k<17;k++){
					sum+=parseInt(id_array[k])*parseInt(s[k]);
				}

				if(id_array[17].toUpperCase() == b[sum%11].toUpperCase()){
					return true;
				}
				return false;
			default:
				return true;
				break;
		}
  }
  

  /**
   *
   * @desc   获取周岁
   * @param  {String} startDate
   * @param  {Object} item
   * @return {Object}
   */
  static GetYears(startDate,item) {
    let date = startDate.split(' ')[0]
    let timer =	date.split('-')[0];
    let nowMonth = date.split('-')[1];
    let nowDay = date.split('-')[2];
    let dataList = item.birthday.split('-');
      let year = timer - dataList[0] ;
      let month = nowMonth - dataList[1];
      let day = nowDay - dataList[2];
      if(month > 0 ){
          if(day <= -1){
              year = year - 1;
          }
      }else if(month == 0){
          if(day <= -1){
              year = year - 1;
          }
          if(day > 0){
              year = year + 1;
          }
      }else {
          year = year - 1;
      }
    return year;
  }
  /**
   *
   * @desc   获取证件号
   * @param  {String} val_
   * @return {Object}
   */
  static getCertCode(val_){
    let regex=/(\d{15,18}[xX]?|[a-zA-Z]{1,2}\d{6,11}|\d{6,8}|[Ll]\d{17}|\d{2}[a-zA-Z]{2}\d{5}|\s+(?!18|19|20)\d{6,18})(?=[.\/\s]+|$)/;
    var regexPassportNumber= /\s+(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z]{7,}\s+/;
    if (regex.test(val_))
    {
    return val_.replace(/х|ｘ/g, "X").match(regex)[0].trim();
    }else if (regexPassportNumber.test(val_)) {

    return val_.replace(/х|ｘ/g, "X").match(regexPassportNumber)[0].trim();
    }
    return '';
  }
  
/**
   *
   * @desc   验证是否为日期格式
   * @param  {String} val_
   * @return {Object}
   */
  static isDate(val_){
    var regex = /^\d{4}-((0{0,1}[1-9]{1})|(1[0-2]{1}))-((0{0,1}[1-9]{1})|([1-2]{1}[0-9]{1})|(3[0-1]{1}))$/;
		var result = false;
		if (regex.test(val_))
		{
			result = true;
		}
		return result;
  }

  /**
   *
   * @desc   获取身份证出生日期
   * @param  {String} val_
   * @return {Object}
   */
  static getCardBirth(val_){
		let tempCertCode= this.getCertCode(val_);
		if (this.isCardtValid(tempCertCode))
		{
			let tempBir= tempCertCode.substr(6, 8);
			if(tempCertCode.length===18)
			{
				return tempBir.substr(0, 4) + "-" + tempBir.substr(4, 2) + "-" + tempBir.substr(6, 2);
			}else
			{
				return "19" + tempBir.substr(0, 2) + "-" + tempBir.substr(2, 2) + "-" + tempBir.substr(4, 2);
			}

		}
		return ""
  }
   /**
     * 计算多少天
     * @param {*} startDate 开始时间
     * @param {*} endDate 结束时间
     */
    static countDay(startDate="",endDate=""){
      
      startDate = startDate.split(' ') 
      endDate = endDate.split(' ') 
      let startDate_split = startDate[0].split("-") ; // 起期
      let endDate_split = endDate[0].split("-")   // 止期
      let sDate1 =new Date(startDate_split[0] , startDate_split[1]- 1 ,startDate_split[2]);  // 起期
      let sDate2 = new Date(endDate_split[0] , endDate_split[1]- 1 ,endDate_split[2]);   // 止期
      let iDays = parseInt(Math.abs(sDate2 - sDate1) / 1000 / 60 / 60 /24) //把相差的毫秒数转换为天数
      return iDays + 1 
  }


  /**
 * @description 格式化金额
 * @param number：要格式化的数字
 * @param decimals：保留几位小数 默认0位
 * @param decPoint：小数点符号 默认.
 * @param thousandsSep：千分位符号 默认为,
 */
  static formatMoney = (number, decimals = 2, decPoint = '.', thousandsSep = ',') => {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '')
    let n = !isFinite(+number) ? 0 : +number
    let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    let s = ''
    let toFixedFix = function (n, prec) {
      let k = Math.pow(10, prec)
      return '' + Math.ceil(n * k) / k
    }
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    let re = /(-?\d+)(\d{3})/
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2')
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || ''
      s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
  }

    /**
 * @description 格式化金额
 * @param number：要格式化的数字
 * @param decimals：保留几位小数 默认0位
 * @param decPoint：小数点符号 默认.
 * @param thousandsSep：千分位符号 默认为,
 */
static formatMoneys = (number, decimals = 0, decPoint = '.', thousandsSep = ',') => {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  let n = !isFinite(+number) ? 0 : +number
  let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
  let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
  let s = ''
  let toFixedFix = function (n, prec) {
    let k = Math.pow(10, prec)
    return '' + Math.ceil(n * k) / k
  }
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  let re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}
 /**
   *
   * @desc   字符串替换
   * @param  {String} str
   * @return {String}
   */
  static Format() {
    if (arguments.length === 0) {
      return null
    }
    var str = arguments[0]
    for (var i = 1; i < arguments.length; i++) {
      var re = new RegExp('\\{' + (i - 1) + '\\}', 'g')
      str = str.replace(re, arguments[i])
    }
    return str
  }
  /**
   *
   * @desc   获取保险止期
   * @param  {String} startDate
   * @return {Object}
   */
  static isGetEndDate1(startDate) {
    let endDate = '';
    if(startDate){
      let start = new Date(startDate);
      let mouthFull = start.getMonth() + 1;
      let dayFull = start.getDate();
      if(mouthFull == 2 && dayFull == 29){
        endDate = moment(new Date(start)).add(Number(1), 'y').format('YYYY-MM-DD 23:59:59'); 
      }else{
        endDate = moment(new Date(start)).add(Number(1), 'y').subtract(1, 'd').format('YYYY-MM-DD 23:59:59'); 
      }
    }else{
      endDate = "";
    }
    return endDate;
  }
  static getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function(item, i, arr) {
        return arr.indexOf(item) === arr.lastIndexOf(item);
    });
  }
  static setCookie(data, name)  {
    let exp = new Date();
    exp.setTime(exp.getTime() + 2* 60* 60 * 1000);
    for (let prop in data) {
      document.cookie = prop + "=" + data[prop] + ";domain=" + name + ";expires=" + exp.toGMTString();
      if(prop == 'branchName' || prop == 'managerUserName' ) {
        document.cookie = prop + "=" + UrlEncode(data[prop]) + ";domain=" + name + ";expires=" + exp.toGMTString(); 
      }
    }
  }
  static changePhone(value) {
    var len = value.length;
    var x = value.substring(3, len - 4);
    var values = value.replace(x, "****");
    return values;
  }
  static changeIdNumber(value) {
    var values = value.replace(/^(.{4})(?:\d+)(.{4})$/,"$1******$2");
    return values;
  }
  /**
   * @desc  密码强度控制开始
   * @param  {String} password 密码
   * @param {String} 
   */
   static passwordLevel(password) {
    var Modes = 0;
    for (var i = 0; i < password.length; i++) {
      Modes |= this.CharMode(password.charCodeAt(i));
    }
    return this.bitTotal(Modes);
  }
  // CharMode函数
  static CharMode(iN) {
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
  static bitTotal(num) {
    var modes = 0;
    for (var i = 0; i < 4; i++) {
      if (num & 1) modes++;
      num >>>= 1;
    }
    return modes;
  }
  /**
   *  密码加密规则
   * @param {string} password 
   */
  static passwordFormat(password) {
    const md5 = require("js-md5")
    let md5Password = md5(password);
    let passArray = md5Password.split('');
    for(let i = 1; i < passArray.length; i+=2) {
        let temporary = passArray[i];
        passArray[i] = passArray[i-1];
        passArray[i-1] = temporary;
    }
    let totalNumber = 0;
    passArray.forEach(item=> {
        totalNumber += parseInt(item, 16); });
    let lastChar = totalNumber%2;
    let result = passArray.join('')+lastChar;
    return result;
  }
  //社会信用代码校验
  static CheckSocialCreditCode(Code) {
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
      } else {
      }
      return true;
    }
  }
  static Email(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email)
  }
  static Mobile(mobile) {
    const regex = /^1\d{10}$/
    return regex.test(mobile)
  }
  static checkAmount(value) {
    let Reg = /^\d+(\.\d{0,2})?$/;
    if (!value) {
      return false
    } else if (!Reg.test(value)) {
      return false
    } else {
      return true
    }
  };
  /** 处理出单公司
  * @param {*} 
  */  
  static mergeArray(arr1, arr2) {
    var _arr = new Array();
    for (var i = 0; i < arr1.length; i++) {
      _arr.push(arr1[i]);
    }
    for (var i = 0; i < arr2.length; i++) {
      var flag = true;
      for (var j = 0; j < arr1.length; j++) {
        if (arr2[i] == arr1[j]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        _arr.unshift(arr2[i]);
      }
    }
    return _arr;
  }
  /** 处理出单公司
  * @param {*} 
  */
  static basicUnique(arr, key) {
    let map = new Map();
    arr.forEach((item, index) => {
      if (!map.has(item[key])) {
        map.set(item[key], item);
      }
    });
    return [...map.values()];
  }
  /** 判断数组中指定字段是否重复
  * @param {*} 
  */
  static isRepeat(arr, key) {
    let map = new Map();
    arr.forEach((item, index) => {
      if (!map.has(item[key])) {
        map.set(item[key], item);
      }
    });
    if ([...map.values()].length != arr.length) {
      return true
    } else {
      return false
    }
  }


  /** 判断数组中值是否符合要求
  * @param {*} 
  */
  static addNumber() {
    var args = arguments, //获取所有的参数
      lens = args.length, //获取参数的长度
      d = 0, //定义小数位的初始长度，默认为整数，即小数位为0
      sum = 0 //定义sum来接收所有数据的和
    //循环所有的参数
    for (var key in args) { //遍历所有的参数
      //把数字转为字符串
      var str = "" + args[key];
      if (str.indexOf(".") != -1) { //判断数字是否为小数
        //获取小数位的长度
        var temp = str.split(".")[1].length;
        //比较此数的小数位与原小数位的长度，取小数位较长的存储到d中
        d = d < temp ? temp : d;
      }
    }
    //计算需要乘的数值
    var m = Math.pow(1000, d);
    //遍历所有参数并相加
    for (var key in args) {
      sum += args[key] * m;
    }
    //返回结果
    return sum / m;
  }
}
function UrlEncode(strNative) {
  var output = "";
  for (var i=0; i<strNative.length; i++) {
    var c = strNative.charAt(i);
    var cc = strNative.charCodeAt(i);
    if (cc > 0xff)
    output += "\\u" + toHex(cc >> 8 ) + toHex(cc & 0xff);
    else
    output += c;
  }
    return output;
}
function toHex(n)  {
  var hexChars = "0123456789ABCDEF";
  var nH = (n >> 4) & 0x0f;
  var nL = n & 0x0f;
  return hexChars.charAt(nH) + hexChars.charAt(nL);
}

