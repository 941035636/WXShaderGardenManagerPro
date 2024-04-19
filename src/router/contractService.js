export default[
    {
        path: '/contractService',
        component: resolve => require(['../views/contractService/Index.vue'], resolve),
        name:'contractService',
        meta:{
            title:'续约跟踪表'
        }
    },

]