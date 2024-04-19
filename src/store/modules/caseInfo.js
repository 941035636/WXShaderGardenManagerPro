const state = { //要设置的全局访问的state对象
    //要设置的初始属性值
    baseInfo: {},
    caseStopInfo: {},
    caseOverInfo: {},
    caseReview: [],
    caseProcess: {},
    payInfo: {},
    fileInfo: {},
    accountInfo: {},
    litigationInfo: {},
    csaeDictionaries: {},
    makemoneys: {},
    reportStatus: '',
    caseTrackList:[],
    pushInsuranceData:{},
}
const getters = { //实时监听state值的变化(最新状态)
    baseInfo: state => { //承载变化的showFooter的值
        // if( state.userInfo && state.userInfo.userId){
        return state.baseInfo;
        // }  
    },
    caseOverInfo: state => {
        return state.caseOverInfo;
    },
    caseStopInfo: state => {
        return state.caseStopInfo;
    },
    caseReview: state => {
        return state.caseReview;
    },
    caseProcess: state => {
        return state.caseProcess;
    },
    payInfo: state => {
        return state.payInfo;
    },
    fileInfo: state => {
        return state.fileInfo;
    },
    accountInfo: state => {
        return state.accountInfo;
    },
    litigationInfo: state => {
        return state.litigationInfo;
    },
    csaeDictionaries: state => {
        return state.csaeDictionaries;
    },
    makemoneys: state => {
        return state.makemoneys;
    },
    reportStatus: state => {
        return state.reportStatus;
    },
    caseTrackList: state => {
        return state.caseTrackList;
    },
    pushInsuranceData: state => {
        return state.pushInsuranceData;
    },
}


const mutations = { //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
    updateBaseInfo(state, data) {
        state.baseInfo = data;
    },
    updataCaseOverInfo(state, data) {
        state.caseOverInfo = data;
    },
    updataCaseStopInfo(state, data) {
        state.caseStopInfo = data;
    },
    updataCaseReview(state, data) {
        state.caseReview = data;
    },
    updataCaseProcess(state, data) {
        state.caseProcess = data;
    },
    updataPayInfo(state, data) {
        state.payInfo = data;
    },
    updataFileInfo(state, data) {
        state.fileInfo = data;
    },
    updataAccountInfo(state, data) {
        state.accountInfo = data;
    },
    updataLitigationInfo(state, data) {
        state.litigationInfo = data;
    },
    updataCsaeDictionaries(state, data) {
        state.csaeDictionaries = data;
    },
    updataMakemoneys(state, data) {
        state.makemoneys = data;
    },
    updataReportStatus(state, data) {
        state.reportStatus = data;
    },
    updataCaseTrackList(state, data) {
        state.caseTrackList = data;
    },
    updatePushInsurance(state, data) {
        state.pushInsuranceData = data;
    },
    deleteAllInfo(state) {
        state = {
            caseStopInfo:{},
            baseInfo: {},
            caseOverInfo: {},
            caseReview: [],
            caseProcess: {},
            payInfo: {},
            fileInfo: {},
            accountInfo: {},
            csaeDictionaries: {},
            makemoneys: {},
            litigationInfo: {},
            reportStatus: '',
            caseTrackList: [],
            pushInsuranceData:{},
        }
    }
}


const actions = { //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
}

//getters 和 vue 中的 computed 类似 , 都是用来计算 state 然后生成新的数据 ( 状态 ) 的。


export default {
    state,
    actions,
    mutations,
    getters
};