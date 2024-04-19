  export default[
    {
      path: '/prev/company',
      component: resolve => require(['../views/userDataManage/highRisk/list/index.vue'], resolve),
      meta:{
          title:'企业单位列表'
      }
    },
    {
      path: '/enterprise/enterpriseAdd',
      component: resolve => require(['../views/userDataManage/highRisk/add/index.vue'], resolve),
      meta:{
          title:'新增企业单位'
      }
    },
    {
      path: '/prev/company/detail',
      component: resolve => require(['../views/userDataManage/highRisk/details/index.vue'], resolve),
      meta:{
          title:'企业单位详情'
      }
    },
    {
      path: '/prev/broker',
      name:'jingjijg',
      component: resolve => require(['../views/userDataManage/JTInsurance/list/index.vue'], resolve),
      meta:{
          title:'经纪机构列表'
      }
    },
    {
      path: '/prev/broker/detail',
      component: resolve => require(['../views/userDataManage/JTInsurance/details/index.vue'], resolve),
      meta:{
          title:'经纪机构详情'
      }
    },
    {
      path: '/prev/jt',
      name:'jtjg',
      component: resolve => require(['../views/userDataManage/JTInsurance/list/index.vue'], resolve),
      meta:{
          title:'江泰机构列表'
      }
    },
    {
      path: '/prev/jt/detail',
      name:'jtjg',
      component: resolve => require(['../views/userDataManage/JTInsurance/details/index.vue'], resolve),
      meta:{
          title:'江泰机构详情'
      }
    },
    {
      path: '/prev/insurers',
      name:'bxjg',
      component: resolve => require(['../views/userDataManage/JTInsurance/list/index.vue'], resolve),
      meta:{
          title:'保险机构列表'
      }
    },
    {
      path: '/prev/insurers/detail',
      name:'bxjg',
      component: resolve => require(['../views/userDataManage/JTInsurance/details/index.vue'], resolve),
      meta:{
          title:'保险机构详情'
      }
    }, 
    {
      path: '/prev/expert',
      component: resolve => require(['../views/userDataManage/safety/list/index.vue'], resolve),
      meta:{
          title:'专家库'
      }
    },
    {
      path: '/prev/ehrpert',
      component: resolve => require(['../views/userDataManage/ehRdatabase/list/index.vue'], resolve),
      meta:{
          title:'EHR专家库'
      }
    },
    {
      path: '/prev/expert/detail',
      component: resolve => require(['../views/userDataManage/safety/details/index.vue'], resolve),
      meta:{
          title:'安全专家详情'
      }
    },
    {
      path: '/prev/agency',
      component: resolve => require(['../views/userDataManage/service/list/index.vue'], resolve),
      meta:{
          title:'服务机构'
      }
    },

    {
      path: '/prev/agency/detail',
      component: resolve => require(['../views/userDataManage/service/details/index.vue'], resolve),
      meta:{
          title:'服务机构详情'
      }
    },
   
]