/**
 * 统一校验单位名称
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateDWName(rlue, value, callback) {
	if (value === '') {
		callback(new Error('请输入'))
	} else if (!/^.{1,30}$/i.test(value)) {
		callback(new Error('请输入正确的单位名称!'))
	} else {
		callback()
	}
}
/**
 * 统一校验姓名
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateName(rlue, value, callback) {
	if (value === '') {
		callback(new Error('请输入'))
	} else if (!/^.{2,10}$/i.test(value)) {
		callback(new Error('请输入正确的姓名!'))
	} else {
		callback()
	}
}
//社会信用代码校验
var CheckSocialCreditCode = (Code) => {
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
		} else {}
		return true;
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
		callback(new Error('请输入'))
	} else if (CheckSocialCreditCode(value)) {
		callback()
	} else {

		callback(new Error('请输入正确的社会信用代码!'))
	}
}
// /**
//  * 统一校验社会信用代码
//  * @param {*} rlue
//  * @param {*} value
//  * @param {*} callback
//  */
//  export function validateBlCode(rlue, value, callback) {
//     if (value === '') {
//       callback(new Error('请输入'))
//     }else if (!/^(?=.*\d)[A-Za-z0-9]{2,20}$/i.test(value)) {
//       callback(new Error('请输入正确的代码!'))
//     } else {
//       callback()
//     }
//   }
/**
 * 统一校验机构名称与机构编码
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateOrg(rlue, value, callback) {
	if (value === '') {
		callback(new Error('请输入'))
	} else if (!/^.{1,30}$/i.test(value)) {
		callback(new Error('请输入1-30位!'))
	} else {
		callback()
	}
}
/**
 * 统一校验证件号码
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateIdCard(rlue, value, callback) {
	if (value === '') {
		callback(new Error('请输入'))
	} else if (!/^.{1,30}$/i.test(value)) {
		callback(new Error('请输入正确的证件号码!'))
	} else {
		callback()
	}
}
/**
 * 统一校验8位非0正整数
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validatePositiveNum(rlue, value, callback) {
	if (value === '') {
		callback(new Error('请输入'))
	} else if (!/^[1-9]\d{0,7}$/i.test(value)) {
		callback(new Error('请输入正确的数量!'))
	} else {
		callback()
	}
}
/**
 * 统一校验金额
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateMoney(rlue, value, callback) {
	if (value === '') {
		callback(new Error('请输入金额'))
	} else if (!/^0\.[0-9]{1,2}$|^[0-9]\d{0,7}\.\d{1,2}$|^[1-9]\d{0,7}$/i.test(value)) {
		callback(new Error('请输入正确的金额!'))
	} else {
		callback()
	}
}
/**
 * 统一校验具体的地址
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateAddress(rlue, value, callback) {
	if (value === '') {
		callback(new Error('请输入'))
	} else if (!/^.{1,30}$/i.test(value)) {
		callback(new Error('请输入1-30位地址!'))
	} else {
		callback()
	}
}
/**
 * 统一校验具体的地址
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
 export function validateAddress100(rlue, value, callback) {
	if (value === '') {
		callback(new Error('请输入'))
	} else if (!/^.{1,100}$/i.test(value)) {
		callback(new Error('请输入1-100位地址!'))
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
 * 统一校验手机号
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function checkPhone(rule, value, callback) {
	// undefined
	//var patrn1=/^(1[34578]\d{9}$)/;

	var patrn1 = /^(1[3-9]\d{9}$)/;
	var patrn = /^(([0-9]{3,4}[-])?[0-9]{7,8}$)/;
	if (value === '') {
		callback(new Error('请输入手机号或座机号'))
	} else if (value && value.indexOf("-") == -1 && !patrn1.test(value)) {
		undefined
		callback(new Error('请输入正确的手机号或座机号'));
	} else if (value && !patrn.test(value) && value.indexOf("-") > -1) {
		undefined
		callback(new Error('请输入正确的座机号，例如:0512-67512345'));
	} else {
		undefined
		callback();
	}
};
/**
 * 统一校验最高工作年限
 * @param {*} rlue
 * @param {*} value
 * @param {*} callback
 */
export function validateYears(rlue, value, callback) {
	if (value == '') {
		callback(new Error('请输入工作年限'))
	} else if (!/^([1-9][0-9]{0,1}|100)$/i.test(value)) {
		callback(new Error('工作年限必须为1-100的整数!'))
	} else {
		callback()
	}
}
