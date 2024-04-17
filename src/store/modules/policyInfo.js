//保单管理块数据
const state = () => ({
  organizationEntity: '', //投保人信息
  insuredInfoParam: '', //被保人信息
  warrantyParam: {}, //保单信息
  insurersInfo: {}, //保单信息
  accidentRate: '', //风险预防信息
  totalForm: {}, //需要提交的数据

  comment: '', //评价信息



})
const getters = {
  organizationEntity: (state) => state.organizationEntity,
  insuredInfoParam: (state) => state.insuredInfoParam,
  warrantyParam: (state) => state.warrantyParam,
  insurersInfo: (state) => state.insurersInfo,
  accidentRate: (state) => state.accidentRate,
  totalForm: (state) => state.totalForm,
  comment: (state) => state.comment,


}
const mutations = {


  submitData(state, data) {
    state.totalForm = data
  },
  organizationEntity(state, data) {
    state.organizationEntity = data
  },
  insuredInfoParam(state, data) {
    state.insuredInfoParam = data
  },
  warrantyParam(state, data) {
    state.warrantyParam = data
  },
  insurersInfo(state, data) {
    state.insurersInfo = data
  },
  accidentRate(state, data) {
    state.accidentRate = data
  },
  comment(state, data) {
    state.comment = data
  },
}
export default {
  state,
  getters,
  mutations,
}