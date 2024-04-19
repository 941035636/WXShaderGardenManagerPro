//导入接口管理模块
import $apiUrl from '../api/apiUrl'
import { post, get ,deletes,put} from '@/api/index'
import {getLogger} from '../util/Logger'
const logger = getLogger('reports')
export default class reports {	 
    getDate() { //地区查询
		return get($apiUrl.GETDATETIME).then(res => {
			return res;
		})
	}

	getBranchInfo(){ // 获取分支机构
		return get($apiUrl.BRANCH_INFO+"/sequip").then(res => {
			return res;
		})
	}

	getBranchInfos(){ // 获取分支机构
		return get($apiUrl.BRANCH_INFO_NEW,{"channelCode":'sequip'}).then(res => {
			return res;
		})
	}

	getBatchDetail(endorsementsNo) {//批单详情
        return get($apiUrl.BATCH_DETAIL + '?applyNo=' + endorsementsNo).then(res => {
            return res;
        })
	}
	
	policydetails(data) { //保单详情
        return post($apiUrl.POLICYDETAILS, data).then(res => {
			return res;
        })
	}
	
	getDate() { //获取服务器时间
		return get($apiUrl.GETDATE).then(res => {
			return res;
		})
	}
	postVerification(data,resToken,dataObj) {
		return post($apiUrl.VERIFICATION_URL, data,resToken).then(res => {
			let obj  = Object.assign(data,dataObj)
			logger.info('M6-003',res,obj)
			return res;
        })
	}
	getDetail(id) {//冲正详情
		return get($apiUrl.GETRECDETAIL + id).then(res => {
			return res;
		})
	}
	getOptionData(id) {//获取操作按钮
		return get($apiUrl.GETOPTION,{"connectId":id}).then(res => {
			return res;
		})
	}
	getHistoryData(id) {//历史
		return get($apiUrl.GETHISTORY,{"connectId":id}).then(res => {
			return res;
		})
	}
	getPunchList(data){ // 冲正列表
		return get($apiUrl.GETPUNCHLIST,data).then(res => {
			return res;
		})
	}

	setPunch(data,id){ // 冲正接口
		return post($apiUrl.SETOUNCH,data).then(res => {
			let typeData = [
				{
					label:'一般性冲正',
					value:1
				},
				{
					label:'保费冲正',
					value:2
				},
				{
					label:'删除冲正',
					value:3
				}
			]
			let correctTypeName	= typeData.find(item=>item.value == data.correctType)
			data.correctTypeName = correctTypeName ? correctTypeName.label : ''
			if (id) {
				logger.info('M6-002',res,data)
			} else {
				logger.info('M6-001',res,data)
			}
			return res;
		})
	}

	getSelectData() {//获取冲正列表查询条件
		return get($apiUrl.GETOPTIONS).then(res => {
			return res;
		})
	}

	getCZReason() {//获取冲正原因字典表
		return get($apiUrl.GETCZDIST).then(res => {
			return res;
		})
	}

	getCommission(data){ // 佣金凭证查询接口
		return get($apiUrl.COMMISSION,data).then(res => {
			return res;
		})
	}

	getPayment(data){ // 解付状态查询接口
		return get($apiUrl.PAYMENT,data).then(res => {
			return res;
		})
	}

	getSettlement(data){ // 结算单查询接口
		return get($apiUrl.SETTLRMENT,data).then(res => {
			return res;
		})
	}
	putSearchKQFlag(data) {//冲正查询跨期状态
		return put($apiUrl.PUTSEARCHKQFLAG , data).then(res => {
			return res;
		})
	}
	//查询分支机构全面营销人员
	getUserByNo(data) {
		return get($apiUrl.GET_USERSTAFF,data).then(res => {
			return res;
		})
	}
}
