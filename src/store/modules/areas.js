import {
  getAreaInfo
} from '@/api/Areas'
import {
  areas
} from '@/config'
const state = () => ({
  areaList: [], // 不带全部
  areaZJList: [], // 镇江地区
  areaListAll: [], // 带全部
  areaMap: {}, // map类型
})
const getters = {
  areaList: (state) => state.areaList,
  areaZJList: (state) => state.areaZJList,
  areaListAll: (state) => state.areaListAll,
  areaMap: (state) => state.areaMap,
}

const mutations = {
  setAreaList(state, areaList) {
    state.areaList = areaList
  },
  setAreaZJList(state, areaZJList) {
    state.areaZJList = areaZJList
  },
  setAreaListAll(state, areaListAll) {
    state.areaListAll = areaListAll
  },
  setAreaMap(state, areaMap) {
    state.areaMap = areaMap
  },
}
const actions = {
  setAreaInfo({
    commit
  }) {
    areas.forEach(async (element) => {
      let res = await getAreaInfo(element)
      if (res.code === '0000') {
        if (element === 0) {
          commit('setAreaList', res.data)
          let zjList = JSON.parse(JSON.stringify(res.data))
          let areaZJList = []
          let objZjOne = zjList.find((item) => item.value === sysConfig.province_code)
          // let objZjTwo = objZjOne.children.filter(
          //   (item) => item.value === '321100'
          // )
          // objZjOne.children = objZjTwo
          areaZJList.push(objZjOne)
          commit('setAreaZJList', areaZJList)
        } else if (element === 1) {
          commit('setAreaListAll', res.data)
        } else {
          commit('setAreaMap', res.data)
        }
      }
    })
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
}