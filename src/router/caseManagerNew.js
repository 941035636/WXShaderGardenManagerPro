export default [
    {
        path: '/case/new/my/list',
        component: resolve => require(['../views/caseManagerNew/list/myCaseList.vue'], resolve),
        meta: {
            title: '我处理中'
        }
    },
    {
        path: '/case/new/list/account',
        component: resolve => require(['../views/caseManagerNew/list/caseListAccount.vue'], resolve),
        meta: {
            title: '我处理中'
        }
    },
    {
        path: '/case/new/my/closed',
        component: resolve => require(['../views/caseManagerNew/list/myClosedList.vue'], resolve),
        meta: {
            title: '我处理中'
        }
    },
    {
        path: '/case/new/list',
        component: resolve => require(['../views/caseManagerNew/list/caseList.vue'], resolve),
        meta: {
            title: '我处理中'
        }
    },
    {
        path: '/case/new/transfer',
        component: resolve => require(['../views/caseManagerNew/caseTransfer/index.vue'], resolve),
        meta: {
            title: '案件管理'
        }
    },
    {
        path: '/case/datum/list',
        component: resolve => require(['../views/definitionCaseData/caseList/list/index.vue'], resolve),
        meta: {
            title: '案件资料列表'
        }
    },
    {
        path: '/case/newly/datum',
        name:'case/newly/datum',
        component: resolve => require(['../views/definitionCaseData/caseList/newlyIncreased/index.vue'], resolve),
        meta: {
            title: '发布案件资料'
        }
    },
    {
        path: '/case/result',
        component: resolve => require(['../views/definitionCaseData/caseList/result/index.vue'], resolve),
        meta: {
            title: '发布案件资料'
        }
    },
    {
        path: '/case/manner',
        component: resolve => require(['../views/definitionCaseData/manner/index.vue'], resolve),
        meta: {
            title: '赔付方式'
        }
    },
    {
        path: '/case/management',
        component: resolve => require(['../views/definitionCaseData/management/index.vue'], resolve),
        meta: {
            title: '资料管理'
        }
    },
    {
        path: '/case/particulars',
        component: resolve => require(['../views/definitionCaseData/caseList/particulars/index.vue'], resolve),
        meta: {
            title: '案件详情'
        }
    }
]