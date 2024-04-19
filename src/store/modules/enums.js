import userManage from '../../service/userManage'
const userMa = new userManage()
// 统一的状态
const state = () => ({
  enumAll: {},

})
// 同步请求处理
const mutations = {
  setEnumAll(state, obj) {
    state.enumAll = obj
  },
}
// 异步请求处理
const actions = {
  async setEnumInfo({ commit }) {
  
    let res = await userMa.getEnum()
    console.log(res,'==========');
    if (res.code === '0000') {
      commit('setEnumAll', res.data)
    }
  },
 
}
// getters
const getters = {

  getEnumAll: (state) =>  state.enumAll,
  getEnumObj: (state, key) => {
    return {}
  },
}
export default { state, getters, mutations, actions }
