

export default [
    {
      path: '/prev/project',
      name: 'projectList',
      component: resolve => require(['@/views/accident/project/list'], resolve),
      meta: {
        title: '项目列表'
      }
    },
    {
      path: '/prev/project/pending',
      name: 'examineList',
      component: resolve => require(['@/views/accident/examine/list'], resolve),
      meta: {
        title: '审核项目列表'
      }
    },
    {
      path: '/accidents/projectAdd',
      name: 'ProjectAdd',
      component: resolve => require(['@/views/accident/project/add'], resolve),
      meta: {
        title: '新增项目'
      }
    },
    {
      path: '/prev/project/detail',
      name: 'ProjectDetails',
      component: resolve => require(['@/views/accident/project/details'], resolve),
      meta: {
        title: '项目详情'
      }
    },
    {
      path: '/accidents/planHandle',
      name: 'PlanHandle',
      component: resolve => require(['@/views/accident/plan/handle'], resolve),
      meta: {
        title: '服务计划'
      }
    },
    {
      path: '/prev/plan/detail',
      name: 'PlanDetails',
      component: resolve => require(['@/views/accident/plan/details'], resolve),
      meta: {
        title: '服务计划'
      }
    },
    {
      path: '/prev/plan',
      name: 'PlanList',
      component: resolve => require(['@/views/accident/myService/list'], resolve),
      meta: {
        title: '服务计划'
      }
    },
    {
      path: '/prev/planTransfer',
      name: 'planTransfer',
      component: resolve => require(['@/views/accident/project/transfer/index.vue'], resolve),
      meta: {
        title: '项目转移'
      }
    },
    {
      // 检查表列表
      path: '/prev/checkList',
      component: resolve => require(['@/views/accident/check/checkList.vue'], resolve),
      meta: {
        title: '检查表列表'
      }
    },
    {
      // 事故预防检查表模板配置
      path: '/AccModConfig',
      component: resolve => require(['@/views/accident/accidentChecklist/AccModConfig.vue'], resolve),
      meta: {
        title: '事故预防检查表模板配置'
      }
    },
    {
      // 事故预防创建检查内容
      path: '/QuestionsList',
      component: resolve => require(['@/views/accident/accidentChecklist/QuestionsList.vue'], resolve),
      meta: {
        title: '事故预防创建检查内容'
      }
    },
]
