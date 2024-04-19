export default[
    {
        path: '/order/offline',
        component: resolve => require(['../views/policyentry/PolicyEntryList.vue'], resolve),
        meta:{
        title:'录单列表'
        }
    },
    {
        path: '/order/offline/add',
        component: resolve => require(['../views/policyentry/PolicyEntryDetail.vue'], resolve),
        meta:{
        title:'录单详情'
        }
    },
    {
        path: '/PolicyPreviewList',
        component: resolve => require(['../views/policyentry/PolicyPreviewList.vue'], resolve),
        meta:{
        title:'录单上传清单'
        }
    },
    {
        path: '/PolicyPreviewDetail',
        component: resolve => require(['../views/policyentry/PolicyPreviewDetail.vue'], resolve),
        meta:{
        title:'录单详情预览'
        }
    },
    {
        path: '/PolicyEntrySuccess',
        component: resolve => require(['../views/policyentry/PolicyEntrySuccess.vue'], resolve),
        meta:{
        title:'录单成功'
        }
    },
    {
        path: '/SettlementInfo',
        component: resolve => require(['../views/policyentry/SettlementInfo.vue'], resolve),
        meta:{
        title:'结算信息'
        }
    }
]