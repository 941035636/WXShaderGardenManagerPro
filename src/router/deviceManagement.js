export default [{
        path: '/device/dt',
        component: resolve => require(['../views/deviceManagement/elevator.vue'], resolve),
        meta: { title: '电梯列表' },
    },
    {
        path: '/device/dt/edit',
        component: resolve => require(['../views/deviceManagement/editelevator.vue'], resolve),
        meta: {
            title: '修改电梯信息'
        }
    },
    {
        path: '/device/dt/relation',
        component: resolve => require(['../views/deviceManagement/associatedPolicy.vue'], resolve),
        meta: {
            title: '投保历史'
        }
    },
    {
        path: '/device/dt/byl',
        component: resolve => require(['../views/deviceManagement/nationalElevator.vue'], resolve),
        meta: {
            title: '全国电梯保有量'
        }
    },
    {
        path: '/device/dt/byl/add',
        component: resolve => require(['../views/deviceManagement/insuranceCoverage.vue'], resolve),
        meta: {
            title: '新增'
        }
    },
    {
        path: '/device/sd',
        component: resolve => require(['../views/deviceManagement/cableway.vue'], resolve),
        meta: {
            title: '索道列表'
        }
    },
    {
        path: '/device/sd/add',
        component: resolve => require(['../views/deviceManagement/addcableway.vue'], resolve),
        meta: {
            title: '新增索道信息'
        }
    },
    {
        path: '/device/sd/edit',
        component: resolve => require(['../views/deviceManagement/addcableway.vue'], resolve),
        meta: {
            title: '编辑索道信息'
        }
    },
    {
        path: '/device/sd/compensation',
        component: resolve => require(['../views/deviceManagement/compensation.vue'], resolve),
        meta: {
            title: '赔付情况'
        }
    },
]