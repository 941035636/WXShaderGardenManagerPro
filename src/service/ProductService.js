
// 创建 UserService 服务类
import {post,get,patch,put} from '@/api/index'
import apiUrl from '@/api/apiUrl'
export default class UserService {
    // 根据地区查询产品
    getProductList (areaList) { 
        return post(apiUrl.PRO_LIST,areaList).then(res=>{
            return res;
        })
    }
    // 根据地区查询产品v3
    getProductListV3 (areaList) { 
      return post(apiUrl.PRO_LIST_V3,areaList).then(res=>{
          return res;
      })
    }
    productDetalis (id = '') {  // 获取产品详情
        return get(apiUrl.PRODUCT_DETAILS, {'id': id,'channelNo':'sequip'})
          .then(response => {
            return response
          })
    }
    preRecordIds (id) {  // 预录单条查询
      return get(apiUrl.PRE_RECORDID + id)
        .then(response => {
          return response
        })
    }
    productClauses (productCode = '') {  // 获取产品条款详情
        return post(apiUrl.PRODUCT_CLAUSES, {'productCode': productCode,'channelNo':'sequip'})
          .then(response => {
            return response
          })
    }
   
    getBXGS (code = '',channelNo = 'sequip') {    // 获取保险公司简称
        return get(apiUrl.PRODUCT_BXGS + code, {'channelNo':channelNo})
        .then(response => {
            return response
        })
    }
    productDisplay (productCode = '') {     // 产品因子信息
        return get(apiUrl.PRODUCT_DISPLAY, {'productCode': productCode})
          .then(response => {
            return response
          })
    }
    elementAdd (params = {}) {  //增加电梯
        return post(apiUrl.ELEVATOR_ADD, params)
        .then(response => {
            return response
        })
    } 
    download (productCode = '', templateType = '',codeType = '') {  // 下载电梯模版
        return get(apiUrl.DOWNLODA_FILE, {'productCode': productCode,'templateType':templateType,'codeType':codeType})
        .then(response => {
            return response
        })
    } 
    elementDetails (id = '') {  // 电梯详情
        return get(apiUrl.ELEVATOR_DETAILS, {'id': id})
        .then(response => {
            return response
        })
    } 
    elementList (params = {}) {  // 下载电梯模版
        return post(apiUrl.ELEVATOR_LIST, params)
        .then(response => {
            return response
        })
    } 
    premium (params = {}) {  // 保费试算
        return post(apiUrl.PRODUCT_COMPUTE, params)
        .then(response => {
            return response
        })
    } 
    submitOrder (params = {}) { // 投保中心
        return post(apiUrl.SUBMIT_ORDER, params)
          .then(response => {
            return response
          })
    }
    saveOrder (params = {}) { // 暂存接口
        return post(apiUrl.SAVE_ORDER, params)
          .then(response => {
            return response
          })
    }
    getSaveOrder (params = {}) { // 获取暂存详情接口（投保中心）
        return post(apiUrl.GET_ORDER, params)
          .then(response => {
            return response
          })
    }
    eleVerify (timer = '',params = {}) { // 电梯投保校验
        return post(apiUrl.ELE_VERIFY+`?startDate=${timer}`, params)
    }
    eleInsert (params = {}) { // 电梯批量插入
        return post(apiUrl.ELE_INSERT, params)
    }
    elementBind (params = {}) { // 电梯与投保人绑定关系
        return post(apiUrl.ELE_BIND, params)
          .then(response => {
            return response
          })
    }
    getPayInfo (productCode = '',channelNo = 'sequip') { // 根据产品编码获取线下转账信息
        return post(apiUrl.PAY_INFO + `?channelNo=sequip&productCode=${productCode}`, {'productCode':productCode,'channelNo':channelNo})
          .then(response => {
            return response
          })
    }

    getProgram(params) {
      return post(apiUrl.PROGRAM_INFO, params)
        .then(response => {
          return response
      })
    }
	
	resourceid(objectId){ //根据标的ID查询资源ID
	  return get(apiUrl.RESOURCEID + objectId).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
  }
  
  queryAuthentication(data) { // 企业认证信息
    return get(apiUrl.COM_AUTHENTICATION,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
  }

  getArea() { //地区三级联动
    return get(apiUrl.getArea).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
  }

  preRecord(data) { //预录单预录保存
    return post(apiUrl.PRE_RECORD,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
  }

  updataRecord(id,data) { //预录单预录保存
    return put(apiUrl.PRE_RECORDS + '/' + id,data).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
  }

  saveTempForm(userCode = '', content = '', displayContent = '') { //流水号接口
    return post(apiUrl.SAVE_TEMPFORM ,{ 'userCode': userCode, 'content': content, 'displayContent': displayContent }).then(res=>{
	    if(res.code === '0000'){
	      return res;
	    }
	  })
  }
   // 发票信息查询
	 checkinvoices (bisCode) {
    return get(apiUrl.CHECKINVOICES + bisCode).then(res =>{
        return res 
    })
  }
  /**
	 * 查询开户信息
	 * @param {string} companyCode 产品编码
	 * @param {string} areaCode 地区编码
	 */
	getAccountInfo(data){
		return get(apiUrl.PAY_INFO,data).then(res => {
		if (res.code === '0000'){
			return res;
		}
		})
  }
  /**
	 * 根据地区编码获取地区信息
	 * @param {string} pCode 省编码
	 * @param {string} cCode 市编码
	 * @param {string} counCode 区编码
	 */
	getAreaCode(pCode,cCode,counCode){
		return get(apiUrl.GET_AREA + '?cityCodes=' + pCode + ',' + cCode + ',' + counCode).then(res=>{
			return res;
		})
	}
  /**
	 * 电梯续传接口
	 * @param {string} applicationFormCode 投保单号
	 * @param {string} data   标的数据
	 */
	postElevatorSequel(applicationFormCode,data){
		return post(apiUrl.POSTELEVATORSEQUEL + applicationFormCode,data).then(res=>{
			return res;
		})
	}
}


