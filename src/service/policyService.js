/**保单模块 */
//导入接口管理模块
import $apiUrl from '../api/apiUrl'
import $axios from 'axios';
import { post, get} from '../api/index'
import { getLogger } from '@/util/Logger'
const logger = getLogger("policyService");

export default class policyService {

	/**
	 * 查询保单列表接口
	 * @param {*} data  参数集合
	 */
	getPolicyList(data) {
		return $axios({
			method: 'get',
			url:$apiUrl.policyListOrder,
			params: data
		}).then(res => {
			return res
		})
	}
	getPolicyLists(data) {
		return $axios({
			method: 'post',
			url:$apiUrl.policyList,
            data: data
		}).then(res => {
			return res
		})
	}


	/**
	 * 查询保单列表接口（个险）
	 * @param {*} data  参数集合
	 */
	getPolicyPersonalList(data) {
		return $axios({
			method: 'post',
			url:$apiUrl.policyPersonalList,
            data: data
		}).then(res => {
			return res
		})
	}

	/**
	 * 获取行业类型接口
	 * @param {*} valuesCode  行业类型code
	 */
	getIndustryType(valuesCode) {
		return $axios({
			method: 'get',
			url:$apiUrl.industryType,
            params: {
                valuesCode:valuesCode
            } 
		}).then(res => {
			return res
		})
    }
	/**
	 * 获取佐证原因接口
	 * @param {*} valuesCode  行业类型code
	 */
	getProofList() {
		return $axios({
			method: 'get',
			url:$apiUrl.GETPROOFLIST, 
		}).then(res => {
			return res.data
		})
    }
    /**
	 * 查询保单详情接口
	 * @param {*} appCode  投保单号
	 */
	getPolicyDetail(appCode,type) {
		return $axios({
			method: 'post',
			url:$apiUrl.policyDetail,
            data: {
                appCode:appCode
            } 
		}).then(res => {
			return res
		})
	}

	failurePacket(appCode) {//报文查询接口
		return get($apiUrl.FAILUREPACKET + appCode).then(res => {
			return res;
		})
	}
	
	ExportMessage(appCode,context) {//报文导出接口
		return post($apiUrl.EXPORTMESSAGE + appCode,context,{responseType: 'blob'}).then(res => {
				return res;
		})
	}
	
	ispush(companyCode,appCode) { //出单重推
		var opData = {
			businessTypeCode: appCode, // 业务类型编码
			failCause: "", // 错误原因
			operationResult: "1", // 是否失败
			appCode: appCode
		}
		return get($apiUrl.ISREPUSH + companyCode + '/' + appCode).then(res => {
			if (res.code === '0000') {
				logger.info("M1-003", opData);
				return res;
			}
		}).catch(error => {
			console.log(error)
			opData.operationResult = "0";
			opData.failCause = error.message?error.message:error;
			logger.info("M1-003", opData);
		})
	}
	
	getReasonsFailure(appCode) {//报文失败原因
		return get($apiUrl.PATOUTS + '?appCode=' + appCode).then(res => {
			return res;
		})
	}
	
	/**
	 * 保单补录
	 * @param {*} data 
	 */
	savePolicyCollec(data){
		var opData = {
			businessTypeCode: data.appCode, // 业务类型编码
			failCause: "", // 错误原因
			operationResult: "1", // 是否失败
			policyNo: data.policyNo
		}
		return post($apiUrl.BULLING, data).then(res=>{
			logger.info("M1-002", opData);
			return res;
		}).catch(error => {
			console.log(error)
			opData.operationResult = "0";
			opData.failCause = error.message?error.message:error;
			logger.info("M1-002", opData);
		})
	}

	AmendingPremium(data) {//修改保费
        return post($apiUrl.AmendingPremium,data).then(res => {
            return res;
        })
	}

	applicationforms(data) {//修改保费
		var opData = {
			businessTypeCode: data.applicationFormCode, // 业务类型编码
			failCause: "", // 错误原因
			operationResult: "1", // 是否失败
			premiumOld: data.beforePerm,
			premiumNew: data.afterPerm
		}
		return post($apiUrl.APPLICATION_FORMS,data).then(res => {
			logger.info("M1-006", opData);
			return res;
		}).catch(error => {
			console.log(error)
			opData.operationResult = "0";
			opData.failCause = error.message?error.message:error;
			logger.info("M1-006", opData);
		})
  }
	
	updateApplicationStatus(data) {//投保单状态更新接口
		return post($apiUrl.updateApplicationStatus,data).then(res => {
			return res;
		})
	}

	/**
   * 添加绑定资源信息
   */
  addBindResources(data){
    return post($apiUrl.BIND_RESOURCES, data)
      .then(res =>{
        return res;
      })
	}
	
	getResourcesBindInfo(appCode = '', bizCodeType = '02', resCode = 'A001'){ // 查询投保单文件信息
    let data = {
      "appCode": appCode,
      "bizCodeType": bizCodeType,
      "resCode": resCode
    }
    return post($apiUrl.RESOURCES_BIND_INFO, data).then(res => {
      return res;
    })
  }
	
	getArea() { //获取地区
        return get($apiUrl.GETAREAUSER+'/0').then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
	}
	
	getAreas() { //获取地区
        return get($apiUrl.GETAREAUSER+'/1').then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    getAreaMap() { //获取地区
      return get($apiUrl.GETAREAUSER+'/2').then(res => {
          if (res.code === '0000') {
              return res;
          }
      })
  }  
	getProductDown(a,b){ // 保单预览
		return get($apiUrl.GET_ORDER_DETAIL + '/' + a + '/' +b).then(res =>{
			return res;
		})
	}
	getInsuredViewAppForm(a,b){
    return get($apiUrl.GET_PRODUCT_PREVIEW_VIEW_APP_FORM + '?appCode=' + a + '&format=' + b)
  }
  
  pushParty(name,data){
    return post($apiUrl.PUSHPARTY+'/'+name, data).then(res => {
      return res;
    })
  }
  policyPrem(policyNo){//保额变更保单查询
    return get($apiUrl.POLICYPREMSEARCH+policyNo).then(res => {
      return res;
    })
  }
  PremHistoryList(policyNo){//保额变更保单查询
    return get($apiUrl.PREMHISTORYSEARCH+policyNo).then(res => {
      return res;
    })
  }
  policyPremChange(data){//保额变更
    return post($apiUrl.POLICYPREMCHANGE,data).then(res => {
      return res;
    })
  }
  policyPremList(params) {//保担保额列表
	return $axios({
		method: 'get',
		url:$apiUrl.POLICYPREMLIST,
		params: params
	}).then(res => {
		return res.data
	})
}
  policyPremDetail(id){//保额变更详情
    return get($apiUrl.POLICYPREMDETAIL+id).then(res => {
      return res;
    })
  }
  // 根据批单号查询批单详情
  getEndorDetail(data) {
	return get($apiUrl.ENDORSEMENT_DETAIL+'?applyNo='+data).then(res =>{
		return res 
	})
}

}
