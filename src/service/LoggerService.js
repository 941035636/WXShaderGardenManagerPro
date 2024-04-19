
// 创建 UserService 服务类
import {post,get,patch,put,deletes}from '@/api/index'
import apiUrl from '@/api/apiUrl'
import LoggerInfo from '../../static/data/log-info.json'
import LoggerInfoNew from '../../static/data/log-info-new.json'
import stringHelper from '../util/stringHelper'
export default class LoggerService {
  operationTypeCode = "";
  response = null;
  data = null;
  businessTypeCode = null;
  // 构造方案参数
  constructor(operationTypeCode,response,data,businessTypeCode) {
    this.operationTypeCode = operationTypeCode
    this.response = response;
    this.data = data;
    this.businessTypeCode = businessTypeCode || null;
  }
  // 构造方案无参数
  // constructor(){
  // }
	/**
	 * 增加投保轨迹
	 * @param {string} dc  数据编码 用户、订单号、投保单号、保单号、批单号等
	 * @param {string} opDetail  操作详细内容
	 * @param {string} opName  操作名称
	 * @param {string} opNode  操作节点
	 * @param {string} opType  操作业务类型 
	 * @param {string} os  操作系统 
	 * @param {string} sysCode  子系统编码 1.业务端 2.展业端
	 * @param {string} term  使用终端
	 * @param {string} termVer  终端版本
	 * @param {string} uc  操作人编号 用户编码
	 * @param {string} un  操作人全称
	 * @param {string} cc  渠道编码 edu-教育、med-医疗、tour-旅游、pvt-私人保险、sequip-特设、safety-安责
	 */
	sendInsuranceTrack(){
		let list = JSON.parse(JSON.stringify(LoggerInfo.trackLog))
			let sourceData = list.find(item => this.operationTypeCode == item.operationTypeCode);
			sourceData = stringHelper.FormatStr(sourceData, this.response ? this.response : response, this.data);
		let datas = {
		"dc": this.data.dc,
		"opDetail": sourceData.actionDetail,
		"opName": sourceData.opName,
		"opNode": sourceData.opNode,
		"opType": sourceData.opType,
		"os": this.getEquipOS(),
		"sysCode": "1",
		"term": this.getEquipTerm(),
		"termVer": this.getEquipTermVer(),//终端版本,
		"uc": window.localStorage.getItem('userCode') ? window.localStorage.getItem('userCode') : '',//用户编码（用户中心编码）,
		"un": window.localStorage.getItem('userName') ? window.localStorage.getItem('userName') : window.localStorage.getItem('orgFullName') ? window.localStorage.getItem('orgFullName'):'',//用户名称（用户中心）,
		"cc": sysConfig.channel_code
		}
		return post(apiUrl.TRACK,datas).then(response => {
		return response
		})
	}
	//操作日志接口
	sendLog() {
		// let list = JSON.parse(JSON.stringify(LoggerInfo.data))
		let	list = JSON.parse(JSON.stringify(LoggerInfoNew.data))
		let sourceData = list.find(item => this.operationTypeCode == item.operationTypeCode);
		if(sourceData) {
			sourceData = stringHelper.FormatStr(sourceData,this.response.data ? this.response.data : this.response,this.data);
			let obj = {
				"businessType": sourceData.actionYWType,//业务名称 
				"businessTypeCode":sourceData.businessTypeCode,//  业务编码 
				"channelCode": "sequip",//渠道编码（大平台渠道编码）
				"client": "特设大平台管理端",//客户端类型（用户中心）
				"clientCode": "sys_sequip_man",// 客户端编码 
				"operationContent": sourceData.actionDetail, //业务内容
				"operationType": sourceData.actionType, //操作类型类型,渠道自定
				"operationTypeCode": sourceData.operationTypeCode,// 操作类型编码,渠道自定 
				"userCode": window.sessionStorage.getItem('userCode') ? window.sessionStorage.getItem('userCode') : '',//用户编码（用户中心编码）
				"userIp": window.sessionStorage.getItem('userIp') ? window.sessionStorage.getItem('userIp') : '127.0.0.1',//用户ip
				"userName": window.sessionStorage.getItem('userName') ? window.sessionStorage.getItem('userName') : ''//用户名称（用户中心）
			};
			return post(apiUrl.ACTION_LOG,obj).then(res => {
				return res;
			})
		}
  }

  getEquipOS = () => {
		let info = '0';
		let equipInfo = navigator.userAgent;
		if (/(iPhone|iPad|iPod|iOS)/i.test(equipInfo)) { 
			info = '3';
		} else if (/(Android)/i.test(equipInfo)) { 
			info = '4';
		} else { 
			var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
			var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
			var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
			var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
			if (isUnix) {
				info = '5';
			}else if (isLinux) {
				info = '6';
			}else if (isMac) {
				info = '2';
			}else if (isWin) {
				info = '1';
			} else {
				info = '0';
			}
		};
		return info
	}
	getEquipTerm = () => {
		// let term = '0';
		// wx.miniProgram.getEnv(function(res) {
		// 	if(res.miniprogram){
		// 		term = '4'
		// 	}else{
		// 		term = '3'
		// 	}
		// })
		// return term;
		let browserInfo = navigator.userAgent.toLowerCase();
		let sysObj = {};
		let versionInfo = '未知';
        let regular = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
		let vsMsg = browserInfo.match(regular);
		if(vsMsg){
			sysObj.browserName = vsMsg[1].replace(/version/, "safari");
			sysObj.versionInfo = vsMsg[2];
			if(sysObj.browserName && sysObj.versionInfo) {
				versionInfo = sysObj.browserName
			} else {
				versionInfo = '未知';
			}
		}
		return versionInfo;
	}
	getEquipTermVer = () => {
		let browserInfo = navigator.userAgent.toLowerCase();
		let sysObj = {};
		let versionInfo = '未知';
        let regular = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
		let vsMsg = browserInfo.match(regular);
		if(vsMsg){
			sysObj.browserName = vsMsg[1].replace(/version/, "safari");
			sysObj.versionInfo = vsMsg[2];
			if(sysObj.browserName && sysObj.versionInfo) {
				versionInfo = sysObj.browserName + sysObj.versionInfo;
			} else {
				versionInfo = '未知';
			}
		}
		return versionInfo;
	}



	getNewLog(data) {
		return post(apiUrl.GETNEWLOG,data).then(res => {
            return res;
        })
	}
	getNewLogSearch(data) {
		return post(apiUrl.GETLOGSEARCH,data).then(res => {
            return res;
        })
	}

  
 
}


