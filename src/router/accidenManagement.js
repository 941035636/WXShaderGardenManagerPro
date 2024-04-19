/*
 *事故预防路由模块
 * @property { path: {string} 路由地址}
 * @property { meta	: {String}  路由配置项}
 * @property { title	: {String} 路由地址中文名称 }
 * @version 1.0.0
 * @edit: quweina
 */
export default [{
    path: '/order/logs/track',
    component: resolve => require(['../views/accidenManagement/Track.vue'], resolve),
    meta: {
        title: '投保轨迹查询'
    }
}]