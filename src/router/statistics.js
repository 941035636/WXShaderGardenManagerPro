export default [{
        path: '/trends/dt',
        component: resolve => require(['../views/statistics/statistics.vue'], resolve),
        meta: {
            title: '各省市数据概览'
        }
    },
    {
        path: '/trends/dt/region',
        component: resolve => require(['../views/elevatorDataStatistics/elevatorStatisticsList.vue'], resolve),
        meta: {
            title: '各省市电梯投保清单'
        }
    },
    {
        path: '/trends/intserv',
        component: resolve => require(['../views/statistics/screenstatistical.vue'], resolve),
        meta: {
            title: '电梯雇主数据统计图'
        }
    },
    {
        path: '/trends/businessAccount',
        component: resolve => require(['../views/statistics/businessAccount.vue'], resolve),
        meta: {
            title: '业务台账'
        }
    },
    {
        path: '/trends/sequipAccount',
        component: resolve => require(['../views/statistics/sequipAccount.vue'], resolve),
        meta: {
            title: '业务台账'
        }
    },
    {
        path: '/account/productAccount',
        component: resolve => require(['../views/statistics/productAccount.vue'], resolve),
        meta: {
            title: '业务台账'
        }
    },
]