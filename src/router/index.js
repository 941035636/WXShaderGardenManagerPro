/*
 *路由配置入口文件
 * @version 1.0.0
 * @edit: quweina
 */
/*jshint esversion: 6 */
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import workBench from './workBench' //工作台
import businessProcessing from './businessProcessing' //业务办理
import userCenter from './userCenter' //用户中心
import deviceManagement from './deviceManagement' //设备管理
import statistics from './statistics' //统计
import accidenManagement from './accidenManagement' //投保轨迹
import caseManager from './caseManager' //案件
import insurancePrerecorded from './insurancePrerecorded' //投保单预录
import accountSettings from './accountSettings' //账户设置
import datapush from './datapush' //数据推送
import operationManagement from './operationManagement' //操作日志
import system from './system' //系统设置
import achievements from './achievements' //绩效查询
import policyEntry from './policyEntry' //绩效查询
import accident from './accident' // 事故预防
import userDataManage from './userDataManage' // 事故预防用户
import template from './template'
import newsManagement from './newsManagement'
import caseManagerNew from './caseManagerNew'
import renewalService from './renewalService' // 续保
import contractService from './contractService' // 续约
import serviceBroker from './serviceBroker' // 服务经纪

import increasePages from './increasePages' //增员管理


const routes = [{
        path: '/StatisticalShow',
        component: resolve => require(['../views/statistics/StatisticalShow.vue'], resolve)
    },

    {
        path: '/elevatorBusiness',
        component: resolve => require(['../views/statistics/elevatorBusiness/Index'], resolve)
    },
    {
        path: '/login',
        component: resolve => require(['../views/Login.vue'], resolve)
    },
    {
        path: '/policyTemplate',
        component: resolve => require(['../views/businessProcessing/policyTemplate.vue'], resolve),
        meta: {
            title: '电梯投保单列表'
        }
    },
    {
        path: '/caseDetail',
        component: resolve => require(['../views/caseManager/CaseDetail.vue'], resolve),
        meta: {
            title: '案件详情'
        }
    },
    {
        path: '/caseDteailDisable',
        component: resolve => require(['../views/caseManager/CaseDteailDisable.vue'], resolve),
        meta: {
            title: '案件详情'
        }
    },
    {
        path: '/case/handle',
        component: resolve => require(['../views/caseManagerNew/handle/caseHandle.vue'], resolve),
        meta: {
            title: '案件处理'
        }
    },
    {
        path: '/case/handle/success',
        component: resolve => require(['../views/caseManagerNew/handle/handleSuccess.vue'], resolve),
        meta: {
            title: '案件处理'
        }
    },
    {
        path: '/pdfDetail',
        name: 'PdfDetail',
        component: resolve => require(['../views/components/PdfDetail.vue'], resolve),
        meta: { requiresAuth: false } // 需要登录
    },
    {
		path: '/recordSheet',
		component: resolve => require(['../views/renewalService/recordSheet.vue'], resolve),
		name: 'recordSheet',
		meta: {
			title: '续保记录表'
		}
	},

    {
		path: '/contractSheet',
		component: resolve => require(['../views/contractService/contractSheet.vue'], resolve),
		name: 'contractSheet',
		meta: {
			title: '续约记录表'
		}
	},




    {
        path: '/',
        component: () =>
            import ('../components/common/Home.vue'),
        meta: {
            title: '自述文件'
        },
        children: [
            ...workBench,
            ...businessProcessing,
            ...userCenter,
            ...deviceManagement,
            ...statistics,
            ...caseManager,
            ...accidenManagement,
            ...insurancePrerecorded,
            ...accountSettings,
            ...datapush,
            ...operationManagement,
            ...system,
            ...achievements,
            ...policyEntry,
            ...accident,
            ...userDataManage,
            ...template,
            ...newsManagement,
            ...caseManagerNew,
            ...renewalService,
            ...contractService,
            ...serviceBroker,
            ...increasePages,
        ]
    },
];



const router = new Router({
    // mode: 'history',
    routes
});


// 全局导航钩子
router.beforeEach((to, from, next) => {
    const role = sessionStorage.getItem('authorization'); //获取token
    if (!role && to.path !== '/login' && to.path !== '/StatisticalShow') { //判断是否有token
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})

// 跳转后返回顶部
router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
})
export default router;