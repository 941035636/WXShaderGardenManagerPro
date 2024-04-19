export default[
    {
        path: '/serviceBroker',
        component: resolve => require(['../views/serviceBroker/List.vue'], resolve),
        meta:{
            title:'经纪人列表'
        }
    },
    {
      path: '/AppointList',
      component: resolve => require(['../views/serviceBroker/AppointList.vue'], resolve),
      meta:{
          title:'预约列表'
      }
  },
  ]