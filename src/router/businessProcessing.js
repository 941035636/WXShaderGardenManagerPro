export default [{
        path: '/order/dt',
        component: resolve => require(['../views/businessProcessing/policyformmanagement.vue'], resolve),
        meta: {
            title: '电梯投保单列表'
        }
    },
    {
        path: '/order/list',
        component: resolve => require(['../views/businessProcessing/policyList.vue'], resolve),
        meta: {
            title: '投保单列表',
        }
    },
    {
        path: '/order/object',
        component: resolve => require(['../views/businessProcessing/objectSearch.vue'], resolve),
        meta: {
            title: '标的查询',
        }
    },
    {
        path: '/order/gz',
        component: resolve => require(['../views/businessProcessing/employerPolicy.vue'], resolve),
        meta: {
            title: '雇主投保单列表'
        }
    },
    {
        path: '/order/wy',
        component: resolve => require(['../views/businessProcessing/propertyPolicy.vue'], resolve),
        meta: {
            title: '物业投保单列表'
        }
    },
    {
        path: '/order/jz',
        component: resolve => require(['../views/businessProcessing/HousekeepingPolicy.vue'], resolve),
        meta: {
            title: '物业投保单列表'
        }
    },
    {
        path: '/order/ty',
        component: resolve => require(['../views/businessProcessing/groupInsurancePolicy.vue'], resolve),
        meta: {
            title: '团意投保单列表'
        }
    },
    {
        path: '/order/yjsp',
        component: resolve => require(['../views/businessProcessing/merchantPolicy.vue'], resolve),
        meta: {
            title: '商户投保单列表'
        }
    },
    {
        path: '/order/ab',
        component: resolve => require(['../views/businessProcessing/baoAnPolicy.vue'], resolve),
        meta: {
            title: '保安投保单列表'
        }
    },
    {
        path: '/order/cooperation',
        component: resolve => require(['../views/businessProcessing/cooperationPolicy.vue'], resolve),
        meta: {
            title: '合作渠道投保单列表'
        }
    },
    {
        path: '/order/pending',
        component: resolve => require(['../views/businessProcessing/auditPremium.vue'], resolve),
        meta: {
            title: '投保单审核'
        }
    },
    {
        path: '/reverse',
        component: resolve => require(['../views/businessProcessing/rectifyManagement.vue'], resolve),
        meta: {
            title: '冲正管理'
        }
    },
    {
        path: '/rectifyApplication',
        component: resolve => require(['../views/businessProcessing/rectifyApplication.vue'], resolve),
        meta: {
            title: '冲正申请'
        }
    },
    {
        path: '/rectifyResult',
        component: resolve => require(['../views/businessProcessing/rectifyResult.vue'], resolve),
        meta: {
            title: '冲正审核'
        }
    },
    {
        path: '/order/detail',
        component: resolve => require(['../views/businessProcessing/enquirydetails.vue'], resolve),
        meta: {
            title: '详情'
        }
    },
    {
        path: '/order/object/list',
        component: resolve => require(['../views/businessProcessing/electroniCvouchers.vue'], resolve),
        meta: {
            title: '设备/人员清单'
        }
    },
    {
        path: '/order/premium/edit',
        component: resolve => require(['../views/businessProcessing/revisionPremium.vue'], resolve),
        meta: {
            title: '修改保费'
        }
    },
    {
        path: '/revisionPremiumYinZi',
        component: resolve => require(['../views/businessProcessing/revisionPremiumYinZi.vue'], resolve),
        meta: {
            title: '修改保费'
        }
    },
    {
        path: '/order/premium/confirm',
        component: resolve => require(['../views/businessProcessing/identification.vue'], resolve),
        meta: {
            title: '到账确认'
        }
    },
    {
        path: '/order/policy/upload',
        component: resolve => require(['../views/businessProcessing/policyUpload.vue'], resolve),
        meta: {
            title: '保单上传'
        }
    },
    {
        path: '/order/sd',
        component: resolve => require(['../views/businessProcessing/cablewayformManagement.vue'], resolve),
        meta: {
            title: '索道投保单列表'
        }
    },
    {
        path: '/casemanagement',
        component: resolve => require(['../views/businessProcessing/caseManagement.vue'], resolve),
        meta: {
            title: '案件列表'
        }
    },
    {
        path: '/order/pd',
        component: resolve => require(['../views/businessProcessing/batchManagement.vue'], resolve),
        meta: {
            title: '批单管理'
        }
    },
    {
        path: '/order/pd/endorsementDetail',
        component: resolve => require(['../views/businessProcessing/endorsementDetail.vue'], resolve),
        meta: {
            title: '批单详情'
        }
    },
    {
        path: '/order/pd/elevator',
        component: resolve => require(['../views/businessProcessing/batchManagementList.vue'], resolve),
        meta: {
            title: '批单管理'
        }
    },
    {
        path: '/order/pd/person',
        component: resolve => require(['../views/businessProcessing/batchManagementPerList.vue'], resolve),
        meta: {
            title: '批单管理'
        }
    },
    {
        path: '/order/pd/pending',
        component: resolve => require(['../views/businessProcessing/Reviewed.vue'], resolve),
        meta: {
            title: '待审核列表'
        }
    },
    {
        path: '/detailedList',
        component: resolve => require(['../views/businessProcessing/detailedList.vue'], resolve),
        meta: {
            title: '变更清单'
        }
    },
    {
        path: '/AccountAcceptanceConfirmation',
        component: resolve => require(['../views/businessProcessing/AccountAcceptanceConfirmation.vue'], resolve),
        meta: {
            title: '到账确认'
        }
    },
    {
        path: '/order/endorsement/upload1',
        component: resolve => require(['../views/businessProcessing/policyManagement.vue'], resolve),
        meta: {
            title: '批单上传'
        }
    },
    {
        path: '/order/endorsement/upload',
        component: resolve => require(['../views/businessProcessing/policyManagementNew.vue'], resolve),
        meta: {
            title: '批单上传'
        }
    },
    {
        path: '/invoice/upload',
        component: resolve => require(['../views/businessProcessing/seeDetails.vue'], resolve),
        meta: {
            title: '发票上传'
        }
    },
    {
        path: '/order/endorsement/upload1',
        component: resolve => require(['../views/businessProcessing/policyManagement.vue'], resolve),
        meta: {
            title: '批单补录'
        }
    },
    {
        path: '/invoice',
        component: resolve => require(['../views/businessProcessing/overinvoices.vue'], resolve),
        meta: {
            title: '发票管理'
        }
    },
    {
        path: '/invoice/detail',
        component: resolve => require(['../views/businessProcessing/Invoicedetails.vue'], resolve),
        meta: {
            title: '发票详情'
        }
    },
    {
        path: '/financial/payment',
        component: resolve => require(['../views/businessProcessing/paymentInformation.vue'], resolve),
        meta: {
            title: '微信支付管理'
        }
    },
    {
        path: '/financial/fundflow',
        component: resolve => require(['../views/businessProcessing/paymentInformation-online.vue'], resolve),
        meta: {
            title: '在线交易流水'
        }
    },
    {
        path: '/order/premium/dqedit',
        component: resolve => require(['../views/businessProcessing/shortTermlist.vue'], resolve),
        meta: {
            title: '修改保费'
        }
    },
    {
        path: '/addExtends',
        component: resolve => require(['../views/businessProcessing/addExtends.vue'], resolve),
        meta: {
            title: '追加标的信息'
        }
    },
    {
        path: '/video/list',
        component: resolve => require(['../views/video/VideoList.vue'], resolve),
        meta: {
            title: '培训视频列表'
        }
    },
    {
        path: '/renewal/dt',
        component: resolve => require(['../views/businessProcessing/renewalReminder.vue'], resolve),
        meta: {
            title: '电梯续保'
        }
    },
    {
        path: '/renewal/logs/push',
        component: resolve => require(['../views/businessProcessing/pushLogs.vue'], resolve),
        meta: {
            title: '推送日志'
        }
    },
    {
        path: '/renewal/push',
        component: resolve => require(['../views/businessProcessing/pushSetting.vue'], resolve),
        meta: {
            title: '推送设置'
        }
    },
]