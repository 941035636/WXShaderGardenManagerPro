export default [
    {
        path: '/case/pending',
        component: resolve => require(['../views/caseManager/casePending.vue'], resolve),
        meta: {
            title: '我处理中'
        }
    },
    {
        path: '/case/closed',
        component: resolve => require(['../views/caseManager/caseClosed.vue'], resolve),
        meta: {
            title: '我结案审核'
        }
    },
    {
        path: '/case/list',
        component: resolve => require(['../views/caseManager/caseList.vue'], resolve),
        meta: {
            title: '案件管理'
        }
    },
    {
        path: '/case/synchro',
        component: resolve => require(['../views/caseManager/caseSynchro.vue'], resolve),
        meta: {
            title: '案件管理'
        }
    },
    {
        path: '/case/transfer',
        component: resolve => require(['../views/caseManager/caseTransfer.vue'], resolve),
        meta: {
            title: '案件管理'
        }
    },
    {
        path: '/case/account',
        component: resolve => require(['../views/caseManager/caseAccount.vue'], resolve),
        meta: {
            title: '案件台账'
        }
    },
    {
        path: '/case/dt',
        component: resolve => require(['../views/caseManager/ElevatorCaseList.vue'], resolve),
        meta: {
            title: '电梯责任险'
        }
    },
    {
        path: '/case/gz',
        component: resolve => require(['../views/caseManager/EmployerCaseList.vue'], resolve),
        meta: {
            title: '雇主责任险'
        }
    },
    {
        path: '/case/ty',
        component: resolve => require(['../views/caseManager/RegimentCaseList.vue'], resolve),
        meta: {
            title: '团意责任险'
        }
    },
    {
        path: '/case/sd',
        component: resolve => require(['../views/caseManager/CablewayCaseList.vue'], resolve),
        meta: {
            title: '索道责任险'
        }
    },
    {
        path: '/case/jz',
        component: resolve => require(['../views/caseManager/HousekeepingCaseList.vue'], resolve),
        meta: {
            title: '家政责任险'
        }
    },
    {
        path: '/case/wy',
        component: resolve => require(['../views/caseManager/PropertyCaseList.vue'], resolve),
        meta: {
            title: '物业责任险'
        }
    },
    {
        path: '/case/claimList',
        component: resolve => require(['../views/caseManager/claimList/index.vue'], resolve),
        meta: {
            title: '认领清单'
        }
    }
]