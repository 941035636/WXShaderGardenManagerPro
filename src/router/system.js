export default [{
    path: '/product/settings',
    component: resolve => require(['../views/system/ProductSettingsList.vue'], resolve),
    meta: {
        title: '产品设置'
    }
},{
    path: '/product/details',
    component: resolve => require(['../views/system/ProductDetails.vue'], resolve),
    meta: {
        title: '详情'
    }
}]