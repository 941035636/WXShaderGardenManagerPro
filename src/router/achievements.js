export default [
    {
        path: '/achievements/search',
        component: resolve => require(['../views/achievements/achievementsIndex.vue'], resolve),
        meta: {
            title: '绩效查询'
        }
    },
    {
        path: '/achievements/detail',
        component: resolve => require(['../views/achievements/achievementsDetail.vue'], resolve),
        meta: {
            title: '绩效明细'
        }
    },
    {
        path: '/achievements/month',
        component: resolve => require(['../views/achievements/monthSettlement.vue'], resolve),
        meta: {
            title: '月结清单'
        }
    },
    {
        path: '/achievements/monthDetail',
        component: resolve => require(['../views/achievements/monthSettlementDetail.vue'], resolve),
        meta: {
            title: '月结明细'
        }
    },
    {
        path: '/ledger/market/brokerage',
        component: resolve => require(['../views/achievements/ledMarTable.vue'], resolve),
        meta: {
            title: '佣金明细表'
        }
    }
]