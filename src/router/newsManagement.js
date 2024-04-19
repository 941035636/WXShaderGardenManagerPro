
export default [
    {
        path: '/news/column',
        component: resolve => require(['../views/newsManagement/columnList.vue'], resolve),
        name: 'columnList',
        meta: {
            title: '栏目管理列表'
        }
    },
    {
        path: '/classification',
        name: 'classification',
        component: resolve => require(['../views/newsManagement/classification.vue'], resolve),
        meta: {
            title: '栏目类别列表'
        }
    }, {
        path: '/news/accidentCases',
        name: 'accidentCases',
        component: resolve => require(['../views/newsManagement/accidentCases/newsManage.vue'], resolve),
        meta: {
            title: '案例列表'
        }
    }, {
        path: '/news/detailArticle',
        name: 'detailArticle',
        component: resolve => require(['../views/newsManagement/accidentCases/detailArticle.vue'], resolve),
        meta: {
            title: '案例详情'
        }
    }, {//更多时跳的案例列表
        path: '/news/newsList',
        name: 'newsList',
        component: resolve => require(['../views/newsManagement/accidentCases/newsList.vue'], resolve),
        meta: {
            title: '案例列表'
        }
    }
]