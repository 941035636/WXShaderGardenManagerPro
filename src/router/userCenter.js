export default [{
        path: '/account/company',
        component: resolve => require(['../views/userCenter/userList.vue'], resolve),
        meta: {
            title: '用户列表'
        }
    },
    {
        path: '/account/person',
        component: resolve => require(['../views/userCenter/userListPerson.vue'], resolve),
        meta: {
            title: '个人用户列表'
        }
    },
    {
        path: '/account/company/edit',
        component: resolve => require(['../views/userCenter/userInfo.vue'], resolve),
        meta: {
            title: '用户信息'
        }
    },
    {
        path: '/account/company/detail',
        component: resolve => require(['../views/userCenter/Detail.vue'], resolve),
        meta: {
            title: '用户信息'
        }
    },
    {
        path: '/account/company/elevator',
        component: resolve => require(['../views/userCenter/userElevator.vue'], resolve),
        meta: {
            title: '用户电梯信息'
        }
    },
    {
        path: '/account/company/cableway',
        component: resolve => require(['../views/userCenter/usercableway.vue'], resolve),
        meta: {
            title: '用户索道信息'
        }
    },
    {
        path: '/account/member',
        component: resolve => require(['../views/userCenter/maintenanceStar.vue'], resolve),
        meta: {
            title: '企业会员信息'
        }
    },
    {
        path: '/EnterpriseRegistration',
        component: resolve => require(['../views/userCenter/EnterpriseRegistration.vue'], resolve),
        meta: {
            title: '企业注册'
        }
    },
    {
        path: '/account/thirdAccount',
        component: resolve => require(['../views/userCenter/ThirdAccount.vue'], resolve),
        meta: {
            title: '第三方账号'
        }
    },
    {
        path: '/customerList',
        component: resolve => require(['../views/userCenter/CustomerList.vue'], resolve),
        meta: {
            title: '客户列表'
        }
    },
    {
        path: '/marketingRecords',
        component: resolve => require(['../views/userCenter/marketingRecordsNew.vue'], resolve),
        meta: {
            title: '营销记录'
        }
    },
    {
        path: '/marketingRecords/old',
        component: resolve => require(['../views/userCenter/marketingRecords.vue'], resolve),
        meta: {
            title: '营销记录'
        }
    },
    {
        path: '/userManage',
        component: resolve => require(['../views/userCenter/userManage.vue'], resolve),
        meta: {
            title: '客户管理'
        }
    },
]