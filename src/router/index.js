/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import EmptyLayout from '@/layouts/EmptyLayout'
import {
  publicPath,
  routerMode
} from '@/config'

Vue.use(VueRouter)
export const constantRoutes = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true,
},
{
  path: '/401',
  name: '401',
  component: () => import('@/views/401'),
  hidden: true,
},
{
  path: '/404',
  name: '404',
  component: () => import('@/views/404'),
  hidden: true,
},
]

export const asyncRoutes = [{
  path: '/',
  component: Layout,
  redirect: 'index',
  children: [{
    path: 'index',
    name: 'Index',
    component: () => import('@/views/index/index'),
    meta: {
      title: '首页',
      icon: 'home',
      affix: true,
    },
  },],
},

{
  path: '/sys',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Sys',
  alwaysShow: false,
  meta: {
    title: '系统设置',
    icon: 'box-open',
  },
  children: [
    {
      path: 'UserList',
      name: 'UserList',
      // alwaysShow: true,
      component: () => import('@/views/sys/accountManage'),
      meta: {
        title: '账号管理',
        permissions: ['admin', 'editor'],
      },
      children: [],
    },
    {
      path: 'RoleManageList',
      name: 'RoleManageList',
      // alwaysShow: true,
      component: () => import('@/views/sys/roleManage/list'),
      meta: {
        title: '角色管理',
        permissions: ['admin', 'editor'],
      },
      children: [],
    },

    {
      path: 'MenuManageList',
      name: 'MenuManageList',
      // alwaysShow: true,
      component: () => import('@/views/sys/menuManage/list'),
      meta: {
        title: '菜单管理',
        permissions: ['admin', 'editor'],
      },
      children: [],
    },

  ],
},
{
  path: '/policy',
  component: Layout,
  redirect: 'Redirect',
  name: 'Policy',
  alwaysShow: true,
  meta: {
    title: '保单管理',
    icon: 'box-open',
  },
  children: [{
    path: '/policyList',
    name: 'PolicyManageList',
    // alwaysShow: true,
    component: () => import('@/views/policy/list'),
    meta: {
      title: '保单列表',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  {
    path: '/statisticAnalysis',
    name: 'policyEchart',
    // alwaysShow: true,
    component: () => import('@/views/statisticAnalysis/index'),
    meta: {
      title: '大图',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  {
    path: '/policyLedger',
    name: 'policyLedger',
    // alwaysShow: true,
    component: () => import('@/views/ledger/policyLedger'),
    meta: {
      title: '保单台账',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  {
    path: '/caseLedger',
    name: 'caseLedger',
    // alwaysShow: true,
    component: () => import('@/views/ledger/caseLedger'),
    meta: {
      title: '案件台账',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  {
    path: '/accidentLedger',
    name: 'accidentLedger',
    // alwaysShow: true,
    component: () => import('@/views/ledger/accidentLedger'),
    meta: {
      title: '事故预防台账',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  {
    path: '/serviceLedger',
    name: 'serviceLedger',
    // alwaysShow: true,
    component: () => import('@/views/ledger/serviceLedger'),
    meta: {
      title: '被服务企业台账',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  {
    path: '/policyList/add',
    name: 'AddPolicy',
    component: () => import('@/views/policy/addPolicy'),
    meta: {
      title: '增加保单',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
  },
  {
    path: '/policyList/detail',
    name: 'PolicyDetail',
    // alwaysShow: true,
    component: () => import('@/views/policy/detail'),
    meta: {
      title: '保单详情',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
  },
  ],
},
{
  path: '/case',
  component: Layout,
  redirect: 'Redirect',
  name: 'Case',
  alwaysShow: true,
  meta: {
    title: '理赔管理',
    icon: 'box-open',
  },
  children: [{
    path: '/caseList',
    name: 'CaseManageList',
    // alwaysShow: true,
    component: () => import('@/views/case/list'),
    meta: {
      title: '理赔列表',
      permissions: ['admin', 'editor'],
    },
    children: [],
  },],
},

{
  path: '/enterpriseList',
  component: Layout,
  redirect: 'Redirect',
  name: 'Case',
  alwaysShow: true,
  meta: {
    title: '我的企业',
    icon: 'box-open',
  },
  children: [{
    path: '/enterpriseList',
    name: 'enterpriseList',
    // alwaysShow: true,
    component: () => import('@/views/myEnterprise/enterprise/list'),
    meta: {
      title: '我的企业',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  {
    path: '/userManage',
    name: 'userManage',
    // alwaysShow: true,
    component: () => import('@/views/myEnterprise/userManage/list'),
    meta: {
      title: '用户管理',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },

  {
    path: '/branchList',
    name: 'branchList',
    // alwaysShow: true,
    component: () => import('@/views/myEnterprise/branchManage/list'),
    meta: {
      title: '部门岗位',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  ],
},

{
  path: '/postList',
  component: Layout,
  redirect: 'Redirect',
  name: 'Case',
  alwaysShow: true,
  meta: {
    title: '清单管理',
    icon: 'box-open',
  },
  children: [{
    path: '/postList',
    name: 'postList',
    // alwaysShow: true,
    component: () => import('@/views/listManage/postList/list'),
    meta: {
      title: '岗位清单',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  {
    path: '/editList',
    name: 'editList',
    hidden: true,
    component: () => import('@/views/listManage/postList/edit/list.vue'),
    meta: {
      title: '岗位清单',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  ],
},

{
  path: '/checkList',
  component: Layout,
  redirect: 'Redirect',
  name: 'Case',
  alwaysShow: true,
  meta: {
    title: '隐患管理',
    icon: 'box-open',
  },
  children: [{
    path: '/checkList',
    name: 'checkList',
    component: () => import('@/views/danger/check/list'),
    meta: {
      title: '隐患排查',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  {
    path: '/rectificaList',
    name: 'rectificaList',
    component: () => import('@/views/danger/rectifica/list'),
    meta: {
      title: '隐患整改',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  {
    path: '/acceptList',
    name: 'acceptList',
    component: () => import('@/views/danger/accept/list'),
    meta: {
      title: '隐患整改验收',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  {
    path: '/recordList',
    name: 'recordList',
    component: () => import('@/views/danger/record/list'),
    meta: {
      title: '清单记录',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  {
    path: '/particulars',
    name: 'particulars',
    hidden: true,
    component: () => import('@/views/danger/record/particulars'),
    meta: {
      title: '隐患详情',
      permissions: ['admin', 'editor'],
      isJump: true,
    },
    children: [],
  },
  {
    path: '/checkAndAccept',
    name: 'checkAndAccept',
    hidden: true,
    component: () => import('@/views/danger/record/checkAndAccept'),
    meta: {
      title: '隐患整改验收',
      permissions: ['admin', 'editor'],
      isJump: false,
    },
    children: [],
  },
  {
    path: '/abarbeitungParticulars',
    name: 'abarbeitungParticulars',
    hidden: true,
    component: () => import('@/views/danger/rectifica/abarbeitungParticulars'),
    meta: {
      title: '隐患整改',
      permissions: ['admin', 'editor'],
      isJump: false,
    },
    children: [],
  },

  {
    path: '/checkAndAccParticulars',
    name: 'checkAndAccParticulars',
    hidden: true,
    component: () => import('@/views/danger/accept/checkAndAccParticulars'),
    meta: {
      title: '隐患整改',
      permissions: ['admin', 'editor'],
      isJump: false,
    },
    children: [],
  },
  ],
},


// {
//   path: '/vab',
//   component: Layout,
//   redirect: 'noRedirect',
//   name: 'Vab',
//   alwaysShow: true,
//   meta: {
//     title: '组件',
//     icon: 'box-open'
//   },
//   children: [{
//       path: 'permissions',
//       name: 'Permission',
//       component: () => import('@/views/vab/permissions/index'),
//       meta: {
//         title: '角色权限',
//         permissions: ['admin', 'editor'],
//       },
//     },
//     {
//       path: 'icon',
//       component: EmptyLayout,
//       redirect: 'noRedirect',
//       name: 'Icon',
//       meta: {
//         title: '图标',
//         permissions: ['admin'],
//       },
//       children: [{
//           path: 'awesomeIcon',
//           name: 'AwesomeIcon',
//           component: () => import('@/views/vab/icon/index'),
//           meta: {
//             title: '常规图标'
//           },
//         },
//         {
//           path: 'remixIcon',
//           name: 'RemixIcon',
//           component: () => import('@/views/vab/icon/remixIcon'),
//           meta: {
//             title: '小清新图标'
//           },
//         },
//         {
//           path: 'colorfulIcon',
//           name: 'ColorfulIcon',
//           component: () => import('@/views/vab/icon/colorfulIcon'),
//           meta: {
//             title: '多彩图标'
//           },
//         },
//       ],
//     },
//     {
//       path: 'table',
//       component: () => import('@/views/vab/table/index'),
//       name: 'Table',
//       meta: {
//         title: '表格',
//         permissions: ['admin'],
//       },
//     },
//     {
//       path: 'map',
//       component: () => import('@/views/vab/map/index'),
//       name: 'Map',
//       meta: {
//         title: '地图',
//         permissions: ['admin'],
//       },
//     },

//     {
//       path: 'webSocket',
//       name: 'WebSocket',
//       component: () => import('@/views/vab/webSocket/index'),
//       meta: { title: 'webSocket', permissions: ['admin'] },
//     },
//     {
//       path: 'form',
//       name: 'Form',
//       component: () => import('@/views/vab/form/index'),
//       meta: { title: '表单', permissions: ['admin'] },
//     },
//     {
//       path: 'element',
//       name: 'Element',
//       component: () => import('@/views/vab/element/index'),
//       meta: { title: '常用组件', permissions: ['admin'] },
//     },
//     {
//       path: 'tree',
//       name: 'Tree',
//       component: () => import('@/views/vab/tree/index'),
//       meta: { title: '树', permissions: ['admin'] },
//     },
//     {
//       path: 'card',
//       name: 'Card',
//       component: () => import('@/views/vab/card/index'),
//       meta: { title: '卡片', permissions: ['admin'] },
//     },
//     {
//       path: 'verify',
//       name: 'Verify',
//       component: () => import('@/views/vab/verify/index'),
//       meta: { title: '验证码', permissions: ['admin'] },
//     },
//     {
//       path: 'menu1',
//       component: () => import('@/views/vab/nested/menu1/index'),
//       name: 'Menu1',
//       alwaysShow: true,
//       meta: {
//         title: '嵌套路由 1',
//         permissions: ['admin'],
//       },
//       children: [
//         {
//           path: 'menu1-1',
//           name: 'Menu1-1',
//           alwaysShow: true,
//           meta: { title: '嵌套路由 1-1' },
//           component: () => import('@/views/vab/nested/menu1/menu1-1/index'),

//           children: [
//             {
//               path: 'menu1-1-1',
//               name: 'Menu1-1-1',
//               meta: { title: '嵌套路由 1-1-1' },
//               component: () =>
//                 import('@/views/vab/nested/menu1/menu1-1/menu1-1-1/index'),
//             },
//           ],
//         },
//       ],
//     },
//     {
//       path: 'magnifier',
//       name: 'Magnifier',
//       component: () => import('@/views/vab/magnifier/index'),
//       meta: { title: '放大镜', permissions: ['admin'] },
//     },
//     {
//       path: 'loading',
//       name: 'Loading',
//       component: () => import('@/views/vab/loading/index'),
//       meta: { title: 'loading', permissions: ['admin'] },
//     },
//     {
//       path: 'player',
//       name: 'Player',
//       component: () => import('@/views/vab/player/index'),
//       meta: { title: '视频播放器', permissions: ['admin'] },
//     },
//     {
//       path: 'markdownEditor',
//       name: 'MarkdownEditor',
//       component: () => import('@/views/vab/markdownEditor/index'),
//       meta: { title: 'markdown编辑器', permissions: ['admin'] },
//     },
//     {
//       path: 'editor',
//       name: 'Editor',
//       component: () => import('@/views/vab/editor/index'),
//       meta: {
//         title: '富文本编辑器',
//         permissions: ['admin'],
//         badge: 'New',
//       },
//     },
//     {
//       path: 'backToTop',
//       name: 'BackToTop',
//       component: () => import('@/views/vab/backToTop/index'),
//       meta: { title: '返回顶部', permissions: ['admin'] },
//     },
//     {
//       path: 'lodash',
//       name: 'Lodash',
//       component: () => import('@/views/vab/lodash/index'),
//       meta: { title: 'lodash', permissions: ['admin'] },
//     },
//     {
//       path: 'smallComponents',
//       name: 'SmallComponents',
//       component: () => import('@/views/vab/smallComponents/index'),
//       meta: { title: '小组件', permissions: ['admin'] },
//     },

//     {
//       path: 'upload',
//       name: 'Upload',
//       component: () => import('@/views/vab/upload/index'),
//       meta: { title: '上传', permissions: ['admin'] },
//     },
//     {
//       path: 'log',
//       name: 'Log',
//       component: () => import('@/views/vab/errorLog/index'),
//       meta: { title: '错误日志模拟', permissions: ['admin'] },
//     },
//     {
//       path:
//       name: 'ExternalLink',
//       meta: {
//         title: '外链',
//         target: '_blank',
//         permissions: ['admin', 'editor'],
//         badge: 'New',
//       },
//     },
//     {
//       path: 'more',
//       name: 'More',
//       component: () => import('@/views/vab/more/index'),
//       meta: { title: '关于', permissions: ['admin'] },
//     },
//   ],
// },
// {
//   path: '/personnelManagement',
//   component: Layout,
//   redirect: 'noRedirect',
//   name: 'PersonnelManagement',
//   meta: { title: '配置', icon: 'users-cog', permissions: ['admin'] },
//   children: [
//     {
//       path: 'userManagement',
//       name: 'UserManagement',
//       component: () =>
//         import('@/views/personnelManagement/userManagement/index'),
//       meta: { title: '用户管理' },
//     },
//     {
//       path: 'roleManagement',
//       name: 'RoleManagement',
//       component: () =>
//         import('@/views/personnelManagement/roleManagement/index'),
//       meta: { title: '角色管理' },
//     },
//     {
//       path: 'menuManagement',
//       name: 'MenuManagement',
//       component: () =>
//         import('@/views/personnelManagement/menuManagement/index'),
//       meta: { title: '菜单管理', badge: 'New' },
//     },
//   ],
// },
// {
//   path: '/mall',
//   component: Layout,
//   redirect: 'noRedirect',
//   name: 'Mall',
//   meta: {
//     title: '商城',
//     icon: 'shopping-cart',
//     permissions: ['admin'],
//   },

//   children: [
//     {
//       path: 'pay',
//       name: 'Pay',
//       component: () => import('@/views/mall/pay/index'),
//       meta: {
//         title: '支付',
//         noKeepAlive: true,
//       },
//       children: null,
//     },
//     {
//       path: 'goodsList',
//       name: 'GoodsList',
//       component: () => import('@/views/mall/goodsList/index'),
//       meta: {
//         title: '商品列表',
//       },
//     },
//   ],
// },
// {
//   path: '/error',
//   component: EmptyLayout,
//   redirect: 'noRedirect',
//   name: 'Error',
//   meta: { title: '错误页', icon: 'bug' },
//   children: [
//     {
//       path: '401',
//       name: 'Error401',
//       component: () => import('@/views/401'),
//       meta: { title: '401' },
//     },
//     {
//       path: '404',
//       name: 'Error404',
//       component: () => import('@/views/404'),
//       meta: { title: '404' },
//     },
//   ],
// },
{
  path: '*',
  redirect: '/404',
  hidden: true,
},
]

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})
//注释的地方是允许路由重复点击，如果你觉得框架路由跳转规范太过严格可选择放开
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}

export function resetRouter() {
  router.matcher = new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  }).matcher
}



router.beforeEach((to, form, next) => {
  // 获取用户编码
  const roles = window.sessionStorage.getItem('roles')
  let rolesArr = []
  if (roles != null && roles != undefined) {
    // 用户角色可能会存在多个角色进行格式化
    if (roles.indexOf(',') != -1) {
      rolesArr = roles.split(',')
    } else {
      rolesArr = [roles]
    }
  }
  // 判定如果当前用户为企业用户 点击首页默认覆盖当前首页跳到我的服务首页
  if (to.name == 'Index' && rolesArr.includes('RL1453251619998273537')) {
    router.push({
      name: 'MyService'
    })
    next()
  } else {
    next()
  }
})


export default router

