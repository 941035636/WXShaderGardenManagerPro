export default[
    {
        path: '/template/list',
        component: resolve => require(['../views/template/List.vue'], resolve),
        meta:{
            title:'模板列表'
        }
    },
    {
        path: '/template/add',
        component: resolve => require(['../views/template/Add.vue'], resolve),
        meta:{
            title:'新增模板'
        }
    },
    {
        path: '/template/download',
        component: resolve => require(['../views/template/LogList.vue'], resolve),
        meta:{
            title:'下载日志'
        }
    },
    {
        path: '/template/preview',
        component: resolve => require(['../views/template/Preview.vue'], resolve),
        meta:{
            title:'预览模板'
        }
    }
    
]