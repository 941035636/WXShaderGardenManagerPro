import ResourcesService from '@/service/ResourcesService'
import CaseServiceNew from '@/service/CaseServiceNew'
import {elevator} from '@/server/accidenServer.js';
let sequipService = new CaseServiceNew()
let resourcesService = new ResourcesService()
let sysCode = 'sys_sequip_man'
const state = { //要设置的全局访问的state对象
    sequipTime:'',
    enumList:{},
    caseInfoDetails:{},
    pushInsuranceDataNew:{}, // 案件认领详情
    areaOptions:[],
    filesDataComponets:[], // 文件渲染数据
    ebaoIndustry:[],
    litigation:false,
}

const getters = { //实时监听state值的变化(最新状态)
    noPolicyReason:(state)=>state.enumList.noPolicyReason || [],
    accidentType:(state)=>{
        let list = []
        if(!state.caseInfoDetails.policyInfoVo || (state.caseInfoDetails.policyInfoVo.productCategoryCode && (state.caseInfoDetails.policyInfoVo.productCategoryCode === 'DT' || state.caseInfoDetails.policyInfoVo.productCategoryCode === 'SD'))){
            list = state.enumList.accidentType || []
        } else if(!state.caseInfoDetails.policyInfoVo || (state.caseInfoDetails.policyInfoVo.productCategoryCode && (state.caseInfoDetails.policyInfoVo.productCategoryCode === 'GZ'))){
            list = state.enumList.accidentType.filter(item=>item !== '第三者财产' && item !== '滞留')
        } else {
            list = state.enumList.accidentType.filter(item=>item !== '滞留')
        }
        return list
    },
    accidentReason:(state)=>state.enumList.accidentReason || [],
    faultSite:(state)=>state.enumList.faultSite || [],
    faultReason:(state)=>state.enumList.faultReason || [],
    noTransferNoReason:(state)=>state.enumList.noTransferNoReason || [],
    riskPersonType:(state)=>state.enumList.riskPersonType || [],
    elevatorTypes:(state)=>state.enumList.elevatorTypes || [],
    cablewayType:(state)=>state.enumList.cablewayType || [],
    property:(state)=>state.enumList.property || [],
    industry:(state)=>{
        let list = state.enumList.industry.map(v1=>{
            if(v1.key === 'EB') {
                v1.child = state.ebaoIndustry.map(item=>{
                    return {
                        key:item.productCategory,
                        value:item.productCategoryName,
                    }
                })
            }
            return v1
        })
        return list
    },
    caseSettleType:()=>{
        let list = [
            {code:'401',name:'赔付结案',flieType:'结案文件'},
            {code:'404',name:'拒赔',flieType:'拒赔文件'},
            {code:'403',name:'销案',flieType:'销案文件'},
            {code:'405',name:'零结',flieType:'零结文件'},
            {code:'402',name:'无效结案',flieType:''},
        ]
        return list
    },
    // 文件渲染数据
    getFilesDataComponets:(state)=>state.filesDataComponets || [],
    getSequipTime:(state)=>state.sequipTime || [],
    // 案件详情
    caseInfo:(state)=>state.caseInfoDetails.caseInfo || {},
    policyInfoVo:(state)=>state.caseInfoDetails.policyInfoVo || '',
    riskInfo:(state)=>state.caseInfoDetails.riskInfo || {},
    targetInfo:(state)=>state.caseInfoDetails.targetInfo || {},
    injuredList:(state)=>state.caseInfoDetails.injuredList || [],   // 出险人员信息
    claimInfo:(state)=>state.caseInfoDetails.claimInfo || {},
    endCaseInfo:(state)=>state.caseInfoDetails.endCaseInfo || {},
    fileList:(state)=>state.caseInfoDetails.fileList || [],
    pauseVo:(state)=>state.caseInfoDetails.pauseVo || {}, // 中止原因
    // 是否展示受理按钮
    isPendingStatus:(state)=>{
        let caseInfo = state.caseInfoDetails.caseInfo
        return caseInfo && caseInfo.caseProgress == '101' ? true : false
    },
    // 是否展示可以进行处理中的
    isHandleButton:(state)=>{
        let caseInfo = state.caseInfoDetails.caseInfo
        return caseInfo && caseInfo.caseProgress == '201' ? true : false
    },
    // 是否为案件中止
    isCasePause:(state)=>{
        let caseInfo = state.caseInfoDetails.caseInfo
        return caseInfo && caseInfo.caseStatus == '1' ? true : false
    },
    // 地区
    areaOptions:(state)=>state.areaOptions,
    pushInsuranceDataNew: state => {
        return state.pushInsuranceDataNew;
    },
}

const mutations = { //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
    // 案件枚举
    setSequipEnum(state,data) {
        state.enumList = data;
    },
    // 案件详情
    setCaseInfoDetails(state,data) {
        state.caseInfoDetails = data;
    },
    // 地区
    setAreaDetails(state,data) {
        state.areaOptions = data;
    },
    // 文件渲染数据
    setFilesDataComponets(state,data) {
        state.filesDataComponets = data;
    },
    // E保行业类型
    setEbaoIndustry(state,data) {
        state.ebaoIndustry = data;
    },
    // 服务器时间
    setSequipTime(state,data) {
        state.sequipTime = data;
    },
    // 认领数据详情
    setPushInsurance(state,data) {
        state.pushInsuranceDataNew = data;
    },
    
}

const actions = { //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
    async getCaseEnumV2({ commit }){
        let {code,data} = await sequipService.getEnum()
        if(code === '0000') {
            commit('setSequipEnum',data)
        }
    },
    async getEbaoIndustry({ commit }){
        let {code,data} = await sequipService.getEbaoIndustry()
        if(code === '0000') {
            commit('setEbaoIndustry',data)
        }
    },
    async getCaseInfo({ commit },reportNo){
        let {code,data} = await sequipService.getCaseInfo({reportNo:reportNo})
        if(code === '0000') {
            commit('setCaseInfoDetails',data)
        }
        return code
    },
    async getArea({ commit }){ //获取地区
        let Elevator = new elevator();
        let {code,data} = await Elevator.getAreas();
        if(code == '0000'){
            commit('setAreaDetails',data)
        };
    },
    async getTime({ commit }){ // 服务器时间
        let Elevator = new elevator();
        let {code,data} = await sequipService.getTime();
        if(code == '0000'){
            commit('setSequipTime',data)
        };
    },
    // 案件受理
    async setAcceptCase({ dispatch ,commit,state },form){
        let caseInfo = state.caseInfoDetails.caseInfo
        let {code,data} = await sequipService.acceptCase(form)
        if(code === '0000') {
            dispatch('getCaseInfo',caseInfo.reportNo)
        }
        return code
    },
    // 出险案件信息修改
    async riskInfoSave({ dispatch ,commit,state },form){
        let caseInfo = state.caseInfoDetails.caseInfo
        let {code,data} = await sequipService.riskInfoSave(form,)
        if(code === '0000') {
            dispatch('getCaseInfo',caseInfo.reportNo)
        }
        return code
    },
    // 标的案件信息修改
    async targetInfoSave({ dispatch ,commit,state },form){
        let caseInfo = state.caseInfoDetails.caseInfo
        let ruleForm = {
            targetInfo:form,
            platform:sysCode,
            reportNo:caseInfo.reportNo,
        }
        let {code,data} = await sequipService.targetInfoSave(ruleForm)
        if(code === '0000') {
            dispatch('getCaseInfo',caseInfo.reportNo)
        }
        return code
    },
    // 出险人信息修改
    async saveInsuredInfo({ dispatch ,commit,state },form){
        let caseInfo = state.caseInfoDetails.caseInfo
        let ruleForm = {
            insured:form,
            platform:sysCode,
            reportNo:caseInfo.reportNo,
        }
        let {code,data} = await sequipService.saveInsuredInfo(ruleForm)
        if(code === '0000') {
            dispatch('getCaseInfo',caseInfo.reportNo)
        }
        return code
    },
    // 标的案件信息删除
    async deleteInsuredInfo({ dispatch ,commit,state },id){
        let caseInfo = state.caseInfoDetails.caseInfo
        let ruleForm = {
            userId:id,
            platform:sysCode,
            reportNo:caseInfo.reportNo,
        }
        let {code,data} = await sequipService.deleteInsuredInfo(ruleForm)
        if(code === '0000') {
            dispatch('getCaseInfo',caseInfo.reportNo)
        }
        return code
    },
    // 文件信息上传
    async fileListInfoUpload({ dispatch ,commit,state },list){
        let caseInfo = state.caseInfoDetails.caseInfo
        let {code,data} = await sequipService.fileListInfoUpload(list)
        if(code === '0000') {
            dispatch('getCaseInfo',caseInfo.reportNo)
        }
        return code
    },
    // 出险信息
    async endCaseInfoSave({ dispatch ,commit,state },form){
        let caseInfo = state.caseInfoDetails.caseInfo
        let obj = {
            "platform": 'sys_sequip_man',
            "reportNo": caseInfo.reportNo,
            "action": form.action,
            endCaseInfo:{
                ...form
            },
        }
        let {code,data} = await sequipService.endCaseInfoSave(obj)
        if(code === '0000') {
            code = await dispatch('getCaseInfo',caseInfo.reportNo)
        }
        return code
    },
    // 索赔信息
    async saveClaimInfo({ dispatch ,commit,state },form){
        let caseInfo = state.caseInfoDetails.caseInfo
        let obj = {
            claim:{
                ...form
            },
            "platform": 'sys_sequip_man',
            "reportNo": caseInfo.reportNo,
            "action": form.action
        }
        let {code,data} = await sequipService.saveClaimInfo(obj)
        if(code === '0000') {
            dispatch('getCaseInfo',caseInfo.reportNo)
        }
        return code
    },
    // 删除文件
    async deleteFileInfo({ dispatch ,commit,state },id){
        let caseInfo = state.caseInfoDetails.caseInfo
        
        let {code,data} = await sequipService.deleteFileInfo({id})
        if(code === '0000') {
            dispatch('getCaseInfo',caseInfo.reportNo)
        }
        return code
    },
    // 案件中止
    async pauseCase({ dispatch ,commit,state },form){
        let caseInfo = state.caseInfoDetails.caseInfo
        let obj = {
            ...form,
            reportNo:caseInfo.reportNo,
        }
        let {code,data} = await sequipService.pauseCase(obj)
        if(code === '0000') {
            dispatch('getCaseInfo',caseInfo.reportNo)
        }
        return code
    },
    // 取消案件中止
    async cancelPauseStatus({ dispatch ,commit,state }){
        let caseInfo = state.caseInfoDetails.caseInfo
        let obj = {
            reportNo:caseInfo.reportNo,
        }
        let {code,data} = await sequipService.cancelPauseStatus(obj)
        if(code === '0000') {
            dispatch('getCaseInfo',caseInfo.reportNo)
        }
        return code
    },
    // 保单更新信息
    async policyInfoSave({ dispatch ,commit,state },form){
        let caseInfo = state.caseInfoDetails.caseInfo
        let obj = {
            policyInfo:{
                ...form,
            },
            reportNo:caseInfo.reportNo,
        }
        let {code,data} = await sequipService.policyInfoSave(obj)
        if(code === '0000') {
            dispatch('getCaseInfo',caseInfo.reportNo)
        }
        return code
    },
    // 下载文件
    async downloadCaseFile({ dispatch ,commit,state },row) {
      let res = await resourcesService.downloadOrViewFile(row.url,row.isDownload)
      return res
    },
}

//getters 和 vue 中的 computed 类似 , 都是用来计算 state 然后生成新的数据 ( 状态 ) 的。

export default {
    state,
    actions,
    mutations,
    getters
};