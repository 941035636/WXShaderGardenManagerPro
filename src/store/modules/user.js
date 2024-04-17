/**
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue'
import {
  getUserInfo,
  login,
  logout
} from '@/api/user'
import routerInfo from '@/config/tempRouter.config.js'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import {
  resetRouter
} from '@/router'
import {
  title,
  tokenName,
  storage
} from '@/config'
import {
  isJson
} from '@/utils/validate'

// const getLocalStorage = (key) => {
//   const value = localStorage.getItem(key)
//   if (isJson(value)) {
//     return JSON.parse(value)
//   } else {
//     return false
//   }
// }
// const loginData = getLocalStorage('loginData') || ''

const state = () => ({
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
  permissions: [],
  resource: [],
  buttons: [], // 权限button
  userDataPopedomAreas: '',
  accountType: '', // 用户类型:00-企业用户,01-专家用户,02-应急局用户，03-服务机构用户,04-保险公司用户
  branchId: '',
  // loginData,
})
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
  resource: (state) => state.resource,
  userDataPopedomAreas: (state) => state.userDataPopedomAreas,
  accountType: (state) => state.accountType,
  branchId: (state) => state.branchId,
  buttons: (state) => state.buttons,
  // loginData: (state) => state.loginData,
}
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  setUsername(state, username) {
    state.username = username
  },
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  },
  setResource(state, resource) {
    state.resource = resource
  },
  setUserDataPopedomAreas(state, userDataPopedomAreas) {
    state.userDataPopedomAreas = userDataPopedomAreas
  },
  setAccountType(state, accountType) {
    state.accountType = accountType
  },
  setBranchId(state, branchId) {
    state.branchId = branchId
  },
  setButtons(state, buttons) {
    state.buttons = buttons
  },
  // setLoginData(state, loginData) {
  //   state.loginData = loginData
  //   if ('localStorage' === storage) {
  //     return localStorage.setItem('loginData', JSON.stringify(loginData))
  //   } else if ('sessionStorage' === storage) {
  //     return sessionStorage.setItem('loginData', JSON.stringify(loginData))
  //   } else {
  //     return localStorage.setItem('loginData', JSON.stringify(loginData))
  //   }
  // },
}
const actions = {
  setPermissions({
    commit
  }, permissions) {
    commit('setPermissions', permissions)
  },
  async login({
    commit
  }, userInfo) {
    const {
      data
    } = await login(userInfo)
    const accessToken = data[tokenName]
    console.log(data.roles);
    window.sessionStorage.setItem('roles', data.roles)
    window.sessionStorage.setItem('type', data.type)
    window.sessionStorage.setItem('servOrganizationResp', JSON.stringify(data.servOrganizationResp))
    if (data.yingjijuVO) {
      window.sessionStorage.setItem('yingjijuVO', JSON.stringify(data.yingjijuVO))
    }
    window.sessionStorage.setItem('orgId', data.orgId)
    window.sessionStorage.setItem('userCode', data.userCode)
    window.sessionStorage.setItem('loginAccount', data.loginAccount)
    if (accessToken) {
      commit('setAccessToken', accessToken)
      // data.resourceVMS = routerInfo
      // commit('setLoginData', data)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8 ?
          '早上好' :
          hour <= 11 ?
            '上午好' :
            hour <= 13 ?
              '中午好' :
              hour < 18 ?
                '下午好' :
                '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        'error'
      )
    }
  },
  externalLogin({
    commit
  }, data) {
    if (data) {
      commit('setAccessToken', data)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8 ?
          '早上好' :
          hour <= 11 ?
            '上午好' :
            hour <= 13 ?
              '中午好' :
              hour < 18 ?
                '下午好' :
                '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        'error'
      )
    }
  },
  async getUserInfo({
    commit,
    state,
    dispatch
  }) {
    // const { data } = await getUserInfo(state.accessToken)
    // if (!data) {
    //   Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
    //   return false
    // }
    // let { permissions, username, avatar } = data
    // if (permissions && username && Array.isArray(permissions)) {
    //   commit('setPermissions', permissions)
    //   commit('setUsername', username)
    //   commit('setAvatar', avatar)
    //   return permissions
    // } else {
    //   Vue.prototype.$baseMessage('用户信息接口异常', 'error')
    //   return false
    // }
    // 修改过后的信息
    const {
      data
    } = await getUserInfo()
    if (!data) {
      Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
      return false
    }
    let {
      permissions = ['admin'],
      userName,
      avatar = 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif',
      resourceVMS,
      userDataPopedomAreas,
      type,
      branchId,
    } = data
    if (
      permissions &&
      // userName &&
      // resourceVMS &&
      Array.isArray(resourceVMS) &&
      Array.isArray(permissions)
    ) {
      let buttonList = getButtons(resourceVMS)
      commit('setPermissions', permissions)
      commit('setUsername', userName)
      commit('setAvatar', avatar)
      commit('setResource', resourceVMS)
      commit('setUserDataPopedomAreas', userDataPopedomAreas)
      commit('setAccountType', type)
      commit('setBranchId', branchId)
      commit('setButtons', buttonList)
      console.log(buttonList, '--')
      return permissions
    } else {
      Vue.prototype.$baseMessage('此账号无效，请联系xxx', 'error')
      return false
    }

    // if (!state.loginData) {
    //   await dispatch('logout')
    //   Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
    //   return false
    // }
    // let { userName } = state.loginData
    // let permissions = ['admin']
    // userName = userName ? userName : '无返回名称'
    // if (userName) {
    //   commit('setPermissions', permissions) // 写死一个权限admin
    //   commit('setUsername', userName)
    //   commit(
    //     'setAvatar',
    //     'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif'
    //   )
    //   return permissions
    // } else {
    //   Vue.prototype.$baseMessage('用户信息接口异常', 'error')
    //   return false
    // }
  },
  async logout({
    dispatch
  }) {
    // await logout(state.accessToken)
    await dispatch('resetAccessToken')
    await resetRouter()
  },
  resetAccessToken({
    commit
  }) {
    commit('setPermissions', [])
    commit('setAccessToken', '')
    commit('setResource', '')
    commit('setButtons', [])
    removeAccessToken()
  },
}

function getButtons(data) {
  let buttonList = []

  function getb(list) {
    list.forEach((item) => {
      if (item.functionType === 'A') {
        let obj = {
          name: item.name,
          functionUrl: item.functionUrl,
          functionType: item.functionType,
        }
        buttonList.push(obj)
      } else if (item.children) {
        getb(item.children)
      }
    })
  }
  getb(data)
  return buttonList
}
export default {
  state,
  getters,
  mutations,
  actions
}