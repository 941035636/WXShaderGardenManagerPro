const state = {
    policyHolder: {}, // 投保人信息
    insureds: {}, // 被保人信息
    productInfo: {}, // 方案信息
    policyInfo: {}, // 保单信息
    employeeInfo:{}, // 从业人员信息
    attachmentInfo:{}, // 附件信息
    cross:{}, // 跨期信息
    agent:{}, // 全面营销服务人员信息
    jcList: [], // 家财险清单
    settData:{}, // 业管结算平台保单信息
    companyRatio:{},  // 承保公司比例集合
    companyForm:{}, // 结算公司集合
};
const actions = {
  
};
const mutations = {
    updateAgent (state, data) {
        state.agent = data;
    },
    updatePolicyHolder (state, data) {
        state.policyHolder = data;
    },
    updateInsureds (state, data) {
        state.insureds = data;
    },
    updateProductInfo (state, data) {
        state.productInfo = data;
    },
    updatePolicyInfo (state, data) {
        state.policyInfo = data;
    },
    updateEmployeeInfo (state, data) {
        state.employeeInfo = data;
    },
    updateAttachmentInfo (state, data) {
        state.attachmentInfo = data;
    },
    updateJcList (state, data) {
        state.jcList = data;
    },
    updateCross (state, data) {
      state.cross = data;
    },
    updateSettData(state,data){
        state.settData = data;
    },
    updateCompanyRatio(state,data){
        state.companyRatio = data;
    },
    updateCompanyForm(state,data){
        state.companyForm = data;
    }
};
const getters = {
    policyHolder: state => state.policyHolder,
    insureds: state => state.insureds,
    productInfo: state => state.productInfo,
    policyInfo: state => state.policyInfo,
    employeeInfo: state => state.employeeInfo,
    attachmentInfo: state => state.attachmentInfo,
    cross:state => state.cross,
    agent:state => state.agent,
    jcList:state => state.jcList,
    settData:state => state.settData,
    companyRatio:state => state.companyRatio,
    companyForm:state => state.companyForm,
};
  
export default {
    state,
    actions,
    mutations,
    getters
}
  