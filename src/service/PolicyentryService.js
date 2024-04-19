import $apiUrl from '../api/apiUrl'
import { post, get} from '../api/index'
import { getLogger } from '@/util/Logger'
const logger = getLogger("policyentryService");
export default class policyentryService {
	getUserList(data,TOKEN) { // 用户列表查询
        return post($apiUrl.USERLIST,data,TOKEN).then(res => {
            return res;
        })
    }

    getauthsafety(userCode,channelNo) {//认证信息数据接口
        return get($apiUrl.AUTHENTAEQUIP + '?userCode=' + userCode + '&channelNo=' + channelNo).then(res => {
            return res;
        })
    }

    getArea() { //获取地区
        return get($apiUrl.GETAREAUSER+'/0').then(res => {
            return res;
        })
    }

    getAccessinformation(name){//天眼查获取企业信息接口
		return get($apiUrl.SEARCH_USER_DETAILS + name + '/cat' + '?extendParam=%7B%22type%22%3A%22JSON%22%7D').then(response =>{
			return response;
		})
    }
    
    Register(data){ //特设渠道后台注册用用户
		return post($apiUrl.REGISTER_LD,data).then(res=>{
            return res;
		})
    }

    getClassList(){ // 获取安保网详情信息配置在大平台的产品
      return get($apiUrl.GET_CLASS_LIST).then(res => {
        return res
      })
    }
    
    getProductList (areaList) { // 根据地区查询产品
        return post($apiUrl.PRO_LIST,areaList).then(res=>{
            return res;
        })
    }

    productDetalis (id) {  // 获取产品详情
        return get($apiUrl.PRODUCT_DETAILS, {'id': id,'channelNo':'sequip'}).then(res => {
            return res
        })
    }

    getRiskDisplay (productCode) {  // 查询产品险种信息
        return get($apiUrl.RISK_DISPLAY + '?productCode=' + productCode).then(res => {
            return res
        })
    }
    getResToken() { // 重访攻击校验接口（用户中心获取标识）
        return get($apiUrl.RESUB_TOKEN).then(res => {
            return res;
        })
    }

    getRecordList(data) { // 保单补录接口(查询)
        return post($apiUrl.POLICYSUPPLEMENTLIST,data).then(res => {
            return res;
        })
    }

    setRecordList(data,TOKEN) { // 保单补录接口(保存)
        console.log(data,'-*-*');
        // 操作日志参数
        var opData = {
            businessTypeCode: "not", // 业务类型编码
            failCause: "", // 错误原因
            operationResult: "1", // 是否失败
            policyNo: data.policyNo,
            productName: data.productName,
            companyName: data.policyHolder,
            appCode: "",
            applicationFormCode: "",
            holderName: data.policyHolder,
            amount: data.premium
        }
        return post($apiUrl.POLICYSUPPLEMENT,data,TOKEN).then(res => {
            if(res.code == '0000') {
                let resData = JSON.parse(res.msg)
                opData.applicationFormCode = resData.appCode || ''
            } else {
                opData.applicationFormCode ='无'
            }
            logger.info("M1-008", opData);
            return res;
        }).catch(error => {
            console.log(error);
        })
    }

    getDateFun() { // 获取服务器时间
        return get($apiUrl.GETDATE).then(res => {
            return res;
        })
    }

    personInfo(data) { // 个人信息添加/修改
        return post($apiUrl.UserPersonalS,data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }

    //获取全部产品列表
    getAllProduct(){
      return get($apiUrl.ALLPRODUCT).then(res => {
        if (res.code === '0000') {
            return res;
        }
      })
    }
    productDisplay (productCode = '') {     // 产品因子信息
        return get($apiUrl.PRODUCT_DISPLAY, {'productCode': productCode})
        .then(response => {
            if (response.code === '0000') {
                return response;
            }
        })
    }

  //续保列表查询
  submitSearch(data){
    return post($apiUrl.SEARCHSURED,data).then(res => {
      if(res.code == "0000"){
         return res;
      }  
    })
  }
  /**
	 * 查询保单列表接口
	 * @param {*} data  参数集合
	 */
   getPolicyList(data) {
	return get($apiUrl.policyListOrder,data).then(res => {
		return res;
	}) 
}
    getBranchInfo(data) {
        return get($apiUrl.getBranchByCode,data).then(res => {
            return res;
        }) 
    }
    // 获取全部保险公司（mdm-svc）
    getCompanyList(data){
        return post($apiUrl.GETCOMPANYLIST_BX ,data)
        .then(response => {
        if (response.code === '0000') {
            return response;
        }
        })
    }

}
