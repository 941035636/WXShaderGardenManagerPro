export default [{
        path: '/prerecord',
        component: resolve => require(['../views/insurancePrerecorded/prerecordedIndex.vue'], resolve),
        meta: {
            title: '预录管理'
        }
    },
    {
        path: '/selectUser',
        component: resolve => require(['../views/insurancePrerecorded/selectUser.vue'], resolve),
        meta: {
            title: '选择用户'
        }
    },
    {
        path: '/productCategories',
        component: resolve => require(['../views/insurancePrerecorded/productCategories.vue'], resolve),
        meta: {
            title: '选择产品'
        }
    },
    {
        path: '/addPolicy',
        name: 'addPolicy',
        //    component: resolve => require(['../views/insurancePrerecorded/addPolicy.vue'], resolve),
        component: resolve => require(['../views/policy/AddPolicy.vue'], resolve),
        meta: {
            title: '填写保单'
        }
    },
    {
        path: '/policyList',
        name: 'policyList',
        //    component: resolve => require(['../views/insurancePrerecorded/addPolicy.vue'], resolve),
        component: resolve => require(['../views/policy/PolicyList.vue'], resolve),
        meta: {
            title: '保单预览'
        }
    },
    {
        path: '/payOrder',
        name: 'payOrder',
        //    component: resolve => require(['../views/insurancePrerecorded/addPolicy.vue'], resolve),
        component: resolve => require(['../views/policy/PayOrder.vue'], resolve),
        meta: {
            title: '预录成功'
        }
    },
]