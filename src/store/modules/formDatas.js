//保单管理块数据
const state = () => ({
  applicantParam: '', //投保人信息
  insuredInfoParam: '', //被保人信息
  warrantyParam: {}, //保单信息
  accidentRate: '', //风险预防信息
  totalForm: {}, //需要提交的数据
  imgUrl: '', //被保人的图片
  comment: '', //评价信息
  caseTime: '', //评价信息

  caseInfoEntity: '', //报案信息
  caseLossAssessment: '', //定损信息
  caseSiteSurveyParam: '', //现场查勘信息
  casePaymentIndemnityParam: '', //赔付信息
  projectList1: '',//项目信息
  id: '',
})
const getters = {
  applicantParam: (state) => state.applicantParam,
  insuredInfoParam: (state) => state.insuredInfoParam,
  warrantyParam: (state) => state.warrantyParam,
  accidentRate: (state) => state.accidentRate,
  totalForm: (state) => state.totalForm,
  imgUrl: (state) => state.imgUrl,
  comment: (state) => state.comment,
  caseTime: (state) => state.caseTime,
  caseInfoEntity: (state) => state.caseInfoEntity,
  caseLossAssessment: (state) => state.caseLossAssessment,
  caseSiteSurveyParam: (state) => state.caseSiteSurveyParam,
  casePaymentIndemnityParam: (state) => state.casePaymentIndemnityParam,
  projectList1: (state) => state.projectList1,
  id: (state) => state.id,
}
const mutations = {
  id(state, data) {
    state.id = data
  },
  projectList1(state, data) {
    state.projectList1 = data
  },
  casePaymentIndemnityParam(state, data) {
    state.casePaymentIndemnityParam = data
  },
  caseSiteSurveyParam(state, data) {
    state.caseSiteSurveyParam = data
  },
  caseLossAssessment(state, data) {
    state.caseLossAssessment = data
  },
  caseInfoEntity(state, data) {
    state.caseInfoEntity = data
  },
  imgUrl(state, data) {
    state.imgUrl = data
  },
  submitData(state, data) {
    state.totalForm = data
  },
  applicantParam(state, data) {
    state.applicantParam = data
  },
  insuredInfoParam(state, data) {
    state.insuredInfoParam = data
  },
  warrantyParam(state, data) {
    state.warrantyParam = data
  },
  accidentRate(state, data) {
    state.accidentRate = data
  },
  comment(state, data) {
    state.comment = data
  },
  caseTime(state, data) {
    state.caseTime = data
  },
}
export default {
  state,
  getters,
  mutations,
}
