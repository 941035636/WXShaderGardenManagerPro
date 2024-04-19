/*
 *操作日志产讯
 * @property { path: {string} 路由地址}
 * @property { meta	: {String}  路由配置项}
 * @property { title	: {String} 路由地址中文名称 }
 * @version 1.0.0
 * @edit: quweina
 */
export default [
    {
        path: '/logs/operation',
        component: resolve => require(['../views/operationManagement/operationList.vue'], resolve),
        meta: {
            title: '操作日志查询'
        }
    },
    {
        path: '/logs/admin',
        component: resolve => require(['../views/operationManagement/operationAdminList.vue'], resolve),
        meta: {
            title: '后台日志查询'
        }
    }
]