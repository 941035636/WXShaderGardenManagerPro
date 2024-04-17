/**
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import {
  asyncRoutes,
  constantRoutes
} from '@/router'
import {
  getRouterList
} from '@/api/router'
import {
  convertRouter,
  convertRouterJson,
  filterAsyncRoutes,
} from '@/utils/handleRoutes'

const state = () => ({
  routes: [],
  partialRoutes: [],
})
const getters = {
  routes: (state) => state.routes,
  partialRoutes: (state) => state.partialRoutes,
}
const mutations = {
  setRoutes(state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  setAllRoutes(state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  setPartialRoutes(state, routes) {
    state.partialRoutes = constantRoutes.concat(routes)
  },
}
const actions = {
  async setRoutes({
    commit
  }, permissions) {
    //开源版只过滤动态路由permissions，admin不再默认拥有全部权限
    const finallyAsyncRoutes = await filterAsyncRoutes(
      [...asyncRoutes],
      permissions
    )
    console.log(finallyAsyncRoutes, 'finallyAsyncRoutes')
    commit('setRoutes', finallyAsyncRoutes)
    return finallyAsyncRoutes
  },
  async setAllRoutes({
    commit,
    rootGetters
  }) {
    let resource = rootGetters['user/resource']
    let componentsJSON = convertRouterJson(JSON.parse(JSON.stringify(resource)))
    console.log(resource, "resource")
    // if(){

    // }
    const roles = window.sessionStorage.getItem('roles')
    if (roles != null && roles != undefined) {
      let rolesArr = []
      if (roles.indexOf(',') != -1) {
        rolesArr = roles.split(',')
      } else {
        rolesArr = [roles]
      }
      if (!rolesArr.includes('RL1453251619998273537')) {
        // componentsJSON.unshift({
        //   path: '/',
        //   component: 'Layout',
        //   redirect: 'index',
        //   children: [{
        //     path: 'index',
        //     name: 'Index',
        //     component: '@/views/myEnterprise/enterprise/list',
        //     // component: '@/views/index/index',
        //     meta: {
        //       title: '首页',
        //       icon: 'home',
        //       affix: true,
        //     },
        //   },
        //   ],
        // })
      }
    }

    let data = JSON.parse(JSON.stringify(componentsJSON))

    // let { data } = await getRouterList()
    data.push({
      path: '*',
      redirect: '/404',
      hidden: true
    })
    let accessRoutes = convertRouter(data)
    commit('setAllRoutes', accessRoutes)
    return accessRoutes
  },
  setPartialRoutes({
    commit
  }, accessRoutes) {
    commit('setPartialRoutes', accessRoutes)
    return accessRoutes
  },
}
export default {
  state,
  getters,
  mutations,
  actions
}