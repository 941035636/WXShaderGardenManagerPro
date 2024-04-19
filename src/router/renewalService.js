export default[
    {
        path: '/renewalService',
        component: resolve => require(['../views/renewalService/Index.vue'], resolve),
        name:'renewalService',
        meta:{
            title:'续保跟踪表'
        }
    },

]