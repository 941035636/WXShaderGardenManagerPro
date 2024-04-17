/**
 * @description all模式渲染后端返回路由
 * @param constantRoutes
 * @returns {*}
 */
import path from 'path'
export function convertRouter(asyncRoutes) {
  return asyncRoutes.map((route) => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = () => import(`@/layouts`) //(resolve) => require(['@/layouts'], resolve)
      } else if (route.component === 'EmptyLayout') {
        route.component = (resolve) =>
          require(['@/layouts/EmptyLayout'], resolve)
      } else {
        const index = route.component.indexOf('views')
        const path =
          index > 0 ? route.component.slice(index) : `views/${route.component}`
        console.log(path)
        route.component = () => import(`@/${path}`) //(resolve) => require([`@/${path}`], resolve)
      }
    }
    if (route.children && route.children.length)
      route.children = convertRouter(route.children)
    if (route.children && route.children.length === 0) delete route.children
    return route
  })
}

/**
 * @description 判断当前路由是否包含权限
 * @param permissions
 * @param route
 * @returns {boolean|*}
 */
function hasPermission(permissions, route) {
  if (route.meta && route.meta.permissions) {
    return permissions.some((role) => route.meta.permissions.includes(role))
  } else {
    return true
  }
}

export function convertRouterJson(asyncRoutes) {
  let routerComponents = []
  asyncRoutes.forEach((item) => {
    let obj = {
      path: item.functionUrl,
      component: item.componentUrl,
      name: item.componentName,
      meta: {
        isJump: item.componentUrl !== 'not' ? true : false,
        title: item.name,
        icon: item.icon,
      },
    }
    // let index = item.functionUrl.indexOf('/')
    // if (index == -1) {
    //   obj['name'] = item.functionUrl
    // } else {
    //   obj['name'] = item.functionUrl.substring(
    //     index + 1,
    //     item.functionUrl.length
    //   )
    // }
    if (item.isRootMenu === 'Y') {
      // 只限于两级菜单 两级以上级菜单就有问题了 如果是登录完返回菜单数据
      obj['alwaysShow'] = true
    } else {
      // obj.meta['noKeepAlive'] = true
    }
    if (item.isShow !== '1') {
      // 是否隐藏组件
      obj['hidden'] = true
      // obj.meta['activeMenu'] = route.path = path.resolve(
      //   baseUrl,
      //   item.functionUrl
      // )
    }
    if (item.children && item.children.length) {
      obj['children'] = convertRouterJson(item.children)
    }
    routerComponents.push(obj)
    // if (item.children && item.children.length === 0) delete item.children;
  })
  return routerComponents
}

/**
 * @description intelligence模式根据permissions数组拦截路由
 * @param routes
 * @param permissions
 * @returns {[]}
 */
export function filterAsyncRoutes(routes, permissions) {
  const finallyRoutes = []
  routes.forEach((route) => {
    const item = { ...route }
    if (hasPermission(permissions, item)) {
      if (item.children) {
        item.children = filterAsyncRoutes(item.children, permissions)
      }
      finallyRoutes.push(item)
    }
  })
  return finallyRoutes
}
