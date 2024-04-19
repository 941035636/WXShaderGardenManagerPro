//导入接口管理模块
import apiUrl from '../api/apiUrl'
import { post, get, patch, put, deletes } from '@/api/index'
import axios from 'axios';
import utils from '../util/stringHelper' 
import {getLogger} from '../util/Logger'
const logger = getLogger('elevator')
class elevator {
    getResourcesID(data) {//广东电梯新产品查询资源ID
        return post(apiUrl.QUERYRES,data).then(res => {
            return res;
        })
    }
    modifypremium(data,applicationStatus) {//电梯责任险修改保费
        if(applicationStatus =='07'){
            logger.info('M8-002','',data)
        }else{
            logger.info('M1-001','',data)
        }
        return post(apiUrl.modifypremium,data).then(res => {
            return res;
        })
    }
    appCodeAuth(data) {//审核投保单
        return post(apiUrl.appCodeAuth,data).then(res => {
            return res;
        })
    }
    deletesrecords(code) {//报文失败原因
        return deletes(apiUrl.DELETES_RECORDS + code).then(res => {
            return res;
        })
    }
    resetPassword(data) {//重置密码
        return post(apiUrl.RESETPASSWORD,data).then(res => {
            logger.info('M5-004',res,data)
            return res;
        })
    }
    getdatetime() {//获取服务器时间
        return get(apiUrl.GETDATETIME).then(res => {
            return res;
        })
    }
    getqueryElevatorTotal(data) {//查询电梯统计信息
        return post(apiUrl.STATISTICS_SCREEN,data).then(res => {
            return res;
        })
    }
    getNationalElevator(data) {//全国电梯投保概览
        return post(apiUrl.NationalElevator,data).then(res => {
            return res;
        })
    }
    getProvinceElevator(data) {//全国电梯投保分布
        return post(apiUrl.ProvinceElevator,data).then(res => {
            return res;
        })
    }
    getElevatorDutyPremium(data) {//电梯责任险总保费数据
        return post(apiUrl.ElevatorDutyPremium,data).then(res => {
            return res;
        })
    }
    getAreas() {//地区列表数据接口
        return get(apiUrl.getArea).then(res => {
            return res;
        })
    }
    patinto(data) {//支付中心订单数据查询
        return post(apiUrl.PATINTO,data).then(res => {
            logger.info('A0501',res,data)
            return res;
        })
    }
    patintoOnline(data) {//在线交易列表查询
        return get(apiUrl.PATINTO_ONLINE,data).then(res => {
            logger.info('A0501',res,data)
            return res;
        })
    }
    getElevators(data) {//电梯列表数据接口
        return post(apiUrl.getElevator,data).then(res => {
            logger.info('A0601',res,data)
            return res;
        })
    }
    getApplication(condition) {//特设渠道, 根据电梯编号,出厂编号查询投保单号
        return get(apiUrl.getApplication + '?condition=' + condition).then(res => {
            return res;
        })
    }
    getAppDetailPro(data) {//投保单详情查询
        return post(apiUrl.getAppDetailPro,data).then(res => {
            logger.info('A0103',res,data)
            return res;
        })
    }
    getInsurance(data) {//投保单号查询电梯
        return get(apiUrl.getInsurance,data).then(res => {
            logger.info('A0104',res,data)
            return res;
        })
    }
    modifyElevator(data) {//修改电梯信息
        return put(apiUrl.modifyElevator,data).then(res => {
            let equipmentsCode = data.equipmentsCode? data.equipmentsCode: data.licenceNo
            let datas = {};
            datas.data = data;
            logger.info('A0602',equipmentsCode,datas)
            return res;
        })
    }
    searchAppList(data) {//投保单列表数据接口
        return post(apiUrl.searchAppList,data).then(res => {
            logger.info('A0101',res,data)
            return res;
        })
    }
    searchComAppList(data) {//合作渠道投保单列表数据接口
        return post(apiUrl.searchComAppList,data).then(res => {
            return res;
        })
    }
    getLiftStatistics(data) {//管理端电梯投保单查询统计信息
        return post(apiUrl.LiftStatistics,data).then(res => {
            return res;
        })
    }
    searchAppLists(data) {//管理端索道投保单列表查询
        return post(apiUrl.searchAppLists,data).then(res => {
            logger.info('A0201',res,data)
            return res;
        })
    }
    getprolist(data) {//产品列表数据接口
        return post(apiUrl.PRO_LIST,data).then(res => {
            return res;
        })
    }
    prerecordlist(data) {//预录单列表数据接口
        return post(apiUrl.PRERECORD_LIST,data).then(res => {
            return res;
        })
    }
    getauthsequip(userCode,channelNo) {//认证信息数据接口
        return get(apiUrl.AUTHENTAEQUIP + '?userCode=' + userCode + '&channelNo=' + channelNo).then(res => {
            return res;
        })
    } 
    getauthsequipPer(data) {//认证信息数据接口-个人
        return get(apiUrl.AUTHENTAEQUIPPERSON,{...data, 'channelCode': 'sequip'}).then(res => {
            return res;
        })
    }
    getuserlist(data) {//用户列表查询接口
        return post(apiUrl.USERLIST,data).then(res => {
            return res;
        })
    }
    getuserinfo(userCode) {//用户基本信息查询接口
        return get(apiUrl.USERINFO + '?userCode=' + userCode).then(res => {
            return res;
        })
    }
    elementRelaConfId() {//投保人性质查询接口
        return get(apiUrl.ELEMENYT_RELACONF_ID).then(res => {
            return res;
        })
    }
    enterprisestypes() {//企业类型查询接口
        return get(apiUrl.ELEMENYT_TYPES).then(res => {
            return res;
        })
    }
    elementRelaConf() {//用户类型查询接口
        return get(apiUrl.ELEMENYT_RELACONF).then(res => {
            return res;
        })
    }
    membershiptype() {//会员类型查询接口
        return get(apiUrl.MEMBERSHIPTYPE).then(res => {
            return res;
        })
    }
    cateUpload(data) {//证件上传
        return post(apiUrl.COM_UPLOAD,data).then(res => {
            return res;
        })
    }
    cateUploadAuth(data,applicationName,free,businessTypeCode) { //证件上传
        return post(utils.Format(apiUrl.COM_UPLOAD_AUTH, applicationName,free,businessTypeCode), data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    authenticationSequipErpTem(data,resToken) {//认证
        return post(apiUrl.AUTH_ENTS,data,resToken).then(res => {
            logger.info('M5-002',res,data) 
            return res;
        })
    }
    getapprovaldetails(policyNo) {//批单保单详情函数
        return get(apiUrl.APPROVALTIME + '?policyNo=' + policyNo).then(res => {
            return res;
        })
    }
    getapprovaldatalist(data) {//批单列表
        return post(apiUrl.APPROVALDATALIST,data).then(res => {
            logger.info('A0301',res,data)
            return res;
        })
    }
    getappdetails(data) {//投保单详情
        return post(apiUrl.searchAppDETAILS,data).then(res => {
            return res;
        })
    }
    getReasonsFailure(applicationFormCode) {//报文失败原因
        return get(apiUrl.PATOUTS + applicationFormCode).then(res => {
            return res;
        })
    }
    failurePacket(applicationFormCode) {//根据投保单号查询出但失败的报文
        return get(apiUrl.FAILUREPACKET + '?applicationFormCode=' + applicationFormCode).then(res => {
            logger.info('A0112',res,{"applicationFormCode":applicationFormCode})
            return res;
        })
    }
    applicationforms(data) {//修改保费
        logger.info('M1-001','',data)
        return post(apiUrl.APPLICATION_FORMS,data).then(res => {
            return res;
        })
    }
    updatePremiumFactors(applicationFormCode,data) {//修改因子
        return post(apiUrl.UPDATE_PREMIUM_FACTORS+applicationFormCode,data).then(res => {
            return res;
        })
    }
    searchShortTermHis(applictionFormCode) {//短期单记录查询
        return get(apiUrl.searchShortTermHis + '?applictionFormCode=' + applictionFormCode).then(res => {
            return res;
        })
    }
    getcablewaylist(data) {//索道列表
        return post(apiUrl.CABLEWAYLIST,data).then(res => {
            logger.info('A0701',res,data)
            return res;
        })
    }
    premiumAcceptance(data) {//保费到账
        logger.info('M1-002','',data[0])
        return post(apiUrl.PREMIUMACCE,data).then(res => {
            return res;
        })
    }
    policyUpload(data) {//保单上传
        return post(apiUrl.POLICYUPLOAD,data).then(res => {
            logger.info('M1-003',res,data)
            return res;
        })
    }
    bindres(data) {//付款凭证上传绑定关系
        return post(apiUrl.BINDRES,data).then(res => {
            return res;
        })
    }
    getElevatorStatistics(data) {//全国电梯保有量
        return post(apiUrl.ELEVSTATIS,data).then(res => {
            logger.info('A0801',res,data)
            return res;
        })
    }
    getElevatordetails(id) {//电梯详情
        return get(apiUrl.ELEDETAILS + '?id=' + id).then(res => {
            return res;
        })
    }
    getEquipmentdataentry(data) {//设备数据录入
        return post(apiUrl.EQUIPMENTDATAENTRY,data).then(res => {
            logger.info('A0803',res,data)
            return res;
        })
    }
    getModifyupdate(data) {//设备数据更新
        return put(apiUrl.MODIFYUPDATE,data).then(res => {
            logger.info('A0804',res,data)
            return res;
        })
    }
    getDeleteinformation(id) {//设备数据删除
        return deletes(apiUrl.DELETEINFO + "?id=" + id).then(res => {
            logger.info('A0805',res,id)
            return res;
        })
    }
    getCompensation(equipmentsId) {//赔付信息查询
        return get(apiUrl.COMPENSATION + '?equipmentsId=' + equipmentsId).then(res => {
            return res;
        })
    }
    getDetailedlist(applyNo) {//根据批单申请号查询标的信息
        return get(apiUrl.APPROVALDATALISTS + '?applyNo=' + applyNo).then(res => {
            return res;
        })
    }
    getDet(applyNo) {//特设批单详情
        return get(apiUrl.APPROVAL + '?applyNo=' + applyNo).then(res => {
            return res;
        })
    }
    // 查看批单的接口
    download_rider (data) {
        return get(apiUrl.DOWNLOAD_RIDER+'/'+data).then(res =>{
            return res 
        })
    }
    getDetpays(data) {//批单保费到账确认
        return post(apiUrl.APPROVALPAY,data).then(res => {
            return res;
        })
    }
    getInformationinput(data) {//出单后批单号等批单信息录入
        logger.info('M7-003',res,data.endorsementsNo)
        return post(apiUrl.Informationinput,data).then(res => {
            return res;
        })
    }
    submitEndors(data,code) {//批单申请提交接口
        return post(apiUrl.submitEndors,data,code).then(res => {
            let typeData = [
                {
                    "value": "01",
                    "label": "一般性批改"
                },
                {
                    "value": "03",
                    "label": "批增"
                },
                {
                    "value": "02",
                    "label": "批减"
                },
                {
                    "value": "04",
                    "label": "批退"
                }
            ]
            let endorsementsType = typeData.find(item=>item.value == data.endorsements[0].endorsementsType)
            let name = endorsementsType ? endorsementsType.label : data.endorsements[0].endorsementsType
            let from = {
                endorsementsType:name, // 批改类型
                endorsementsNo:data.endorsements[0].endorsementsNo, // 批单号
            }
            logger.info('M7-001',res,from)
            return res;
        })
    }
    newCableway(data) {//新增索道信息
        return post(apiUrl.NEWCABLEWAY,data).then(res => {
            logger.info('A0705',res,data)
            return res;
        })
    }
    deleteCableway(id) {//删除索道信息
        return deletes(apiUrl.DELETECABLEWAY + '?id=' + id).then(res => {
            logger.info('A0704',res,id)
            return res;
        })
    }
    newadded(data) {//添加赔付信息
        return post(apiUrl.NEWADDED,data).then(res => {
            logger.info('A0706',res,data[0])
            return res;
        })
    }
    toupdate(data) {//更新赔付信息
        return post(apiUrl.TOUPDATE,data).then(res => {
            return res;
        })
    }
    getEnterpriseStar(data) {//特设查询企业星级列表
        return post(apiUrl.ENTERPRISESTAR,data).then(res => {
            logger.info('A1001',res,data) 
            return res;
        })
    }
    revisingStars(data) {//特设渠道修改企业星级
        return post(apiUrl.REVISINGENTERPRISES,data).then(res => {
            return res;
        })
    }
    getqiyestars() {//企业星级
        return get(apiUrl.ELEMENYT_TYPE).then(res => {
            return res;
        })
    }
    deletePayoutByID(id) {//根据索道ID删除赔付信息
        return deletes(apiUrl.deletePayoutByID + '?id=' + id).then(res => {
            return res;
        })
    }
    modifycableway(data) {//修改索道信息
        return put(apiUrl.MODIFYCABLEWAY,data).then(res => {
            let equipmentsName = data.equipmentsName;
            logger.info('A0703',equipmentsName,data)
            return res;
        })
    }
    getappid(policyNo) {//保单资源id
        return get(apiUrl.APP_DETAILSID + '?policyNo=' + policyNo).then(res => {
            return res;
        })
    }
    paymentnotice(sendEmail,applicationFormCode) {//通知用户支付投保单
        logger.info('M1-006','',{applicationFormCode:applicationFormCode})
        return post(apiUrl.PAYMENTNOTICE + '?sendEmail=' + sendEmail + '&applicationFormCode=' + applicationFormCode).then(res => {
            return res;
        })
    }
    TestingUniqueness(endorsementsNo,channelCode) {//校验渠道批单号唯一性
        return get(apiUrl.TestingUniqueness + '?endorsementsNo=' + endorsementsNo + '&channelCode=' + channelCode).then(res => {
            return res;
        })
    }
    checkinvoices(data) {//查看发票接口
        return get(apiUrl.CHECKINVOICE,data).then(res => {
            if(data.invoiceId) {
                logger.info('A0403',res,data)
            } else {
                logger.info('A0401',res,data)
            }
            return res;
        })
    }
    bindinvoice(data) {//上传发票信息
        return get(apiUrl.BINDINVOICE,data).then(res => {
            if(data.applyNo) {
                logger.info('A0304',res,data)   // 批单发票
            } else {
                logger.info('M2-001',res,data)
            }
            return res;
        })
    }
    Batchlistpush(data) {//通过投保单号处理批单数据
        return get(apiUrl.Batchlistpush,data).then(res => {
            return res;
        })
    }
    resourceid(objectId) { //根据标的ID查询资源ID
        return get($apiUrl.RESOURCEID + objectId).then(res => {
            return res;
        })
    }
    bind_resources(data,loginId) {//账号状态修改
        console.log(loginId);
        return get(apiUrl.USERLOGIN,data).then(res => {
            if(data.status==='0') {
                data.userLoginId = loginId
                logger.info('M5-003',res,data)
            }
            return res;
        })
    }
    ispush(data) { //出单重推
        return post(apiUrl.ISREPUSH,data).then(res => {
            if (res.code === '0000') {
                return res;
            }
        })
    }
    /**
	 * 查看投保单
	 * @param {string} appFormCode 投保单号
	 */
	getAppFormTemplate(appFormCode){
		return get(apiUrl.DETAILSPOLICY + appFormCode + '/00').then(res=>{
			return res;
		})
	}
    /**
	 * 查看投保单
	 * @param {string} data 投保单号
	 */
	exportsSheBei(data){
		return get(apiUrl.EXPORTEQUIPMENT,data).then(res=>{
			return res;
		})
    }
       /**
   * 线下开票
   * @param {string} params
   */
    invoiceDownload(fileId,policyNo){
        let userId = window.sessionStorage.getItem("userCode")
        return axios({
        method:'get',
        url:apiUrl.INVOICEDOWNLOAD+'?'+'fileId='+fileId+'&policyNo='+policyNo+'&userId='+userId,
        headers:{"userId":userId}
        }).then(res =>{
        return res
        })
    }
    //业务结算平台保单号查询接口
    getPolicyNoDel(data) {
        return get(apiUrl.YGPOLICYNODEL,data).then(res => {
            return res;
        })
    }
    //业管获取时间
    getPeriod(data) {
        return get(apiUrl.YGDATE,data).then(res => {
            return res;
        })
    }
    //获取跨期原因select数据
    getSelectData() {
        return get(apiUrl.GETKQSELECT).then(res => {
            return res;
        })
    }
    //批单申请审核接口
    postPDAudit(data) {
        return post(apiUrl.PDSHENHE,data).then(res => {
            return res;
        })
    }
    // 支付流水模板上传
    postReconcilation(data) {
        let userId = window.sessionStorage.getItem("userCode")
        return axios({
            method:'post',
            url:apiUrl.POST_RECONCILIATION,
            data:data,
            headers:{"userId":userId},
            'responseType': 'blob'
        }).then(res =>{
            return res
        })


        // return post(apiUrl.POST_RECONCILIATION,data).then(res => {
        //     return res;
        // })
    }
    /**
	 * 上传批单补录设备清单
	 * @param {Onject} data 设备清单数据
	 */
	postSequipList(data){
		return post(apiUrl.POSTSEQUIPLIST , data).then(res=>{
			return res;
		})
    }
    /**
	 * 上传批单补录人员清单
	 * @param {Onject} data 人员清单数据
	 */
    postPersonList(data){
		return post(apiUrl.POSTPERSONLIST , data).then(res=>{
			return res;
		})
    }
    /**
	 * 批单补录设备清单
	 * @param {Onject} data 数据
	 */
	getSequipDataList(data){
		return post(apiUrl.POSTSEQUIPDATALIST , data).then(res=>{
			return res;
		})
    }
     /**
	 * 批单补录人员清单
	 * @param {Onject} data 数据
	 */
	getPersonDataList(data){
		return post(apiUrl.POSTPERSONDATALIST , data).then(res=>{
			return res;
		})
	}
    //业务结算平台认领接口
    policyComfirm(data) {
        return post(apiUrl.YGPOLICYCOMFIRM,data).then(res => {
            try {
                let msg = '';
                if(res.executecode == '0'){
                    msg = "认领成功"
                }else{
                    msg = "认领失败，原因：" + res.executenote
                }
                logger.info('M1-007','',{applicationFormCode:data[0].policyno,msg:msg})
            } catch (error) {
                
            }
            return res;
        })
    }
    /**
     * 获取投保单详情(因子信息)
     * @param {*} appCod 投保单号
     */
    getPolicyFactorsDetails(appCode = '') {
        return get(apiUrl.GETPOLICYFACTORSDETAILS+appCode).then(res => {
            return res;
        })
    }
    postSeachPolicy(data) {
        return post(apiUrl.POSTPOLICYBYCODE,data).then(res => {
            return res;
        })
    }
    postSeachPolicyTY(data) {
        return get(apiUrl.POSTPOLICYBYCODETY + '/' + data).then(res => {
            return res;
        })
    }
    getpolicypeople(condition) { //根据人员编号查询保单
        return get(apiUrl.POLICYSEMPLOY + "?condition=" + condition).then(res => {
            return res;
        })
    }
    postEmployeeList(data) {
        return post(apiUrl.POSTEMPLOYEELIST,data).then(res => {
            return res;
        })
    }
    postSequipList(data) {
        return post(apiUrl.POSTSEQUIPSEARCHLIST,data).then(res => {
            return res;
        })
    }
    postPropertyList(data) {
        return post(apiUrl.POSTPROPERTYLIST,data).then(res => {
            return res;
        })
    }
    getPropertyList(data) {
        return post(apiUrl.GET_CABLEWAY_LIST,data).then(res => {
            return res;
        })
    }
    getShopList(data) {
        return post(apiUrl.GET_SHOP_LIST,data).then(res => {
            return res;
        })
    }
    postConDetail(data) {//订单详情合同查询
        return post(apiUrl.POSTCONDETAIL,data).then(res => {
            return res;
        })
    }
    postSendEmail(data) {//续保提醒发送邮件
        return post(apiUrl.POSTSENDEMAIL,data).then(res => {
            return res;
        })
    }
    postPushLogs(data) { //续保提醒日志查询
        return post(apiUrl.POSTPUSHLOGS, data).then(res => {
            return res;
        })
    }
    postEmailConfigList(data) { //续保提醒日志查询
        return post(apiUrl.POSTEMAILLIST, data).then(res => {
            return res;
        })
    }
    postAddEmailConfig(data) { //新增续保邮件配置
        return post(apiUrl.POSTADDEMAILLIST, data).then(res => {
            return res;
        })
    }
    postUpdateEmailConfig(data) { //POST /api/v1/emailConfig/update修改续保邮件配置
        return post(apiUrl.POSTUPDATEEMAILLIST, data).then(res => {
            return res;
        })
    }
    //在保电梯统计查询
    getSum() {
        return get(apiUrl.GETELESUM).then(res => {
            return res;
        })
    }
    //保费前五分支机构查询
    getRank5() {
        return get(apiUrl.GETTOPFIVE).then(res => {
            return res;
        })
    }
    //省分布图
    getProvinceMap() {
        return get(apiUrl.GETPROMAP).then(res => {
            return res;
        })
    }
    //市分布图
    getCityMap(data) {
        return get(apiUrl.GETCITYMAP,data).then(res => {
            return res;
        })
    }
    //区分布图
    getCountryMap(data) {
        return get(apiUrl.GETCOUNTRYMAP,data).then(res => {
            return res;
        })
    }
    //获取年度和月度同比保费
    getYearAndMonth(data) {
        return get(apiUrl.GETYEARANDMONTH,data).then(res => {
            return res;
        })
    }
}
//投保轨迹查询
class Insurance {
    getInsurance(data) {//列表数据接口
        return get(apiUrl.lists,data).then(res => {
            return res;
        })
    }
}
//投保轨迹查询
class Operation {
    getRecord(data) {//列表数据接口
        return get(apiUrl.GETRECORD,data).then(res => {
            return res;
        })
    }
}
export {
    Insurance,
    elevator,
    Operation
}
