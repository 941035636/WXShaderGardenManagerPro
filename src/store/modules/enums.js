import { getEnum, getStrEnum } from '@/api/caseManagement'
// 统一的状态
const state = () => ({
  enumAll: {},
  enumStrAll: {},
})
// 同步请求处理
const mutations = {
  setEnumAll(state, obj) {
    state.enumAll = obj
  },
  setStrEnumAll(state, obj) {
    state.enumStrAll = obj
  },
}
// 异步请求处理
const actions = {
  async setEnumInfo({ commit }) {
    let res = await getEnum()
    if (res.code === '0000') {
      commit('setEnumAll', res.data)
    }
  },
  async setStrEnumInfo({ commit }) {
    let res = await getStrEnum()
    if (res.code === '0000') {
      console.log(res.data)
      commit('setStrEnumAll', res.data)
    }
  },
}
// getters
const getters = {
  getEnumAll: (state) => state.enumAll,
  getEnumObj: (state, key) => {
    return {}
  },
  getStrEnumAll: (state) => state.enumStrAll,
  getStrEnumObj: (state, key) => {
    return {}
  },
}
export default { state, getters, mutations, actions }
