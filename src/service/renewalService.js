import $apiUrl from '../api/apiUrl'
import $axios from 'axios';

export default class renewalService {
  /**
   * 保单追踪查询条件
   * @param {*} params 
   * @returns 
   */
  renewalCondition() {
    return $axios({
      method: 'get',
      url: $apiUrl.RENEWAL_CONDITION,
    }).then(res => {
      return res;
    })
  }

  /**
   * 查询保单追踪统计数据
   * @param {*} params 
   * @returns 
   */
  renewalStatistic(params) {
    return $axios({
      method: 'get',
      url: $apiUrl.RENEWAL_STATISTIC,
      params: params,
    }).then(res => {
      return res;
    })
  }

  /**
   * 查询保单追踪列表
   * @param {*} params 
   * @returns 
   */
  renewalTracks(data) {
    return $axios({
      method: 'post',
      url: $apiUrl.RENEWAL_TRACKS,
      data,
    }).then(res => {
      return res;
    })
  }

  /**
   * 查询保单追踪向信息
   * @param {*} params 
   * @returns 
   */
  renewalTrack(id) {
    return $axios({
      method: 'get',
      url: $apiUrl.RENEWAL_TRACK + `/${id}`,
    }).then(res => {
      return res;
    })
  }


  /**
   * 保单追踪修改业务经理信息
   * @param {*} data 
   * @returns 
   */
  renewalManager(data) {
    return $axios({
      method: 'put',
      url: $apiUrl.RENEWAL_MANAGER,
      data,
    }).then(res => {
      return res;
    })
  }

  /**
   * 保单追踪明细表导出
   * @param {*} params 
   * @returns 
   */
  renewalReport(params) {
    return $axios({
      method: 'get',
      url: $apiUrl.RENEWAL_REPORT,
      params: params,
      responseType: "arraybuffer",
    }).then(res => {
      return res;
    })
  }

  /**
   * 产品地区查询条件
   * @param {*} params 
   * @returns 
   */
  productCondition(productCode, branchCode = '0') {
    return $axios({
      method: 'get',
      url: $apiUrl.PRODUCT_CONDITION + `/${productCode}/${branchCode}`,
    }).then(res => {
      return res;
    })
  }

  /**
   * 保单追踪修改续保情况
   * @param {*} data 
   * @returns 
   */
  renewalInfo(data) {
    return $axios({
      method: 'put',
      url: $apiUrl.RENEWAL_INFO,
      data,
    }).then(res => {
      return res;
    })
  }

  renewalConditionPro(projectCode, year, branchCode = '0') {
    return $axios({
      method: 'get',
      url: $apiUrl.RENEWAL_CONDITIONPRO + `/${projectCode}/${year}/${branchCode}`,
    }).then(res => {
      return res;
    })
  }
  /**
   * 获取续保建议书获取案件信息
   * @param {*} params 
   * @returns 
   */
  renewalCaseDetails(params) {
    return $axios({
      method: 'get',
      url: $apiUrl.RENEWAL_CASE_DETAILS,
      params
    }).then(res => {
      return res;
    })
  }
  /**
   * 获取流失未续原因
   * @param {*} params 
   * @returns 
   */
  getLsWxReason(params) {
    return $axios({
      method: 'get',
      url: $apiUrl.LS_WX_REASON,
      params
    }).then(res => {
      return res;
    })
  }

  /**续约Api**/

  /**
  * /续约统计列表查询条件
  * @param {*} params 
  * @returns 
  */

  findContractTrackCondition(params) {
    return $axios({
      method: 'get',
      url: $apiUrl.RENEWAL_XYTION,
      params
    }).then(res => {
      return res;
    })
  }

  /**
* /查询合同追踪统计数据
* @param {*} params 
* @returns 
*/

  renewalContractStatistic(params) {
    return $axios({
      method: 'get',
      url: $apiUrl.RENEWAL_XYSTIC,
      params
    }).then(res => {
      return res;
    })
  }



/**
* /查询续约合同详情
* @param {*} params 
* @returns 
*/

  renewalContractDetails(id) {
    return $axios({
      method: 'get',
      url: $apiUrl.RENEWAL_XYDETAILS + `/${id}`,
    }).then(res => {
      return res;
    })
  }


  /**
  * 查询续约明细列表
  * @param {*} params 
  * @returns 
  */
  renewalContractList(data) {
    return $axios({
      method: 'post',
      url: $apiUrl.RENEWAL_XYLIST,
      data,
    }).then(res => {
      return res;
    })
  }


  /**
* 查询续约明细列表下载
* @param {*} params 
* @returns 
*/
  download(data) {
    return $axios({
      method: 'post',
      url: $apiUrl.RENEWAL_XYDOWNLOAD,
      data,
      responseType:'blob',
    }).then(res => {
      return res;
    })
  }


  /**
 * 批量设置续约合同经理
 * @param {*} data 
 * @returns 
 */
  contractRelationManager(data) {
    return $axios({
      method: 'put',
      url: $apiUrl.RENEWAL_XYMANGER,
      data,
    }).then(res => {
      return res;
    })
  }


  /**
* 续约情况跟进处理
* @param {*} data 
* @returns 
*/
  followUpContract(data) {
    return $axios({
      method: 'put',
      url: $apiUrl.RENEWAL_XYCONTRACT,
      data,
    }).then(res => {
      return res;
    })
  }

/*
  * 续签详情【客户、保单】
   * @param {*} params 
   * @returns 
   */
   renewDetail(params) {
    console.log('');
    return $axios({
      method: 'get',
      url: $apiUrl.CE_RENEW_DETAIL+'/'+params+'/'+1
    }).then(res => {
      return res;
    })
  }


    //已续【客户、保单号】查询接口
    renewDetails(params,state){
      return $axios({
        method: 'get',
        url: $apiUrl.GET_RENEW_POLICY+'/'+params +'/' + state
      }).then(res => {
        return res;
      })
    }
}