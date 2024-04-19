<template>
	<div class="navMenu">
		<template v-for="navMenu in navMenus">
			<el-menu-item v-if="!navMenu.childs&&navMenu.entity" :key="navMenu.entity.id" :data="navMenu" :index="navMenu.entity.name" >
				<i :class="navMenu.entity.icon"></i>
				<span slot="title">{{navMenu.entity.alias}}</span>
			</el-menu-item>
			<el-submenu v-if="navMenu.childs&&navMenu.entity" :key="navMenu.entity.id" :data="navMenu" :index="navMenu.entity.name">
				<template slot="title">
					<i :class="navMenu.entity.icon"></i>
					<span> {{navMenu.entity.alias}}</span>
				</template>
				<NavMenu :navMenus="navMenu.childs"></NavMenu>
			</el-submenu>
		</template>
	</div>
</template>

<script>

/*
*item字段说明
* @property { items : {Array} 菜单数据}
* @property { icon : {String} 菜单对应图标。 }
* @property { title : {String} 菜单对应名称。 }
* @property { index : {String} 路由名称，当有子菜单时index是数字字符串 比如'6',当无字符串时index是‘路由名称’ }
* @property { subs : {Array} 子菜单数据}
* @version 1.0.0
* @edit: quweina
*/

	export default {
		 props: ['navMenus'],
		data() {
			return {
				show:true,
				items: [{
						icon: 'icon-anbaowanghoutai-shezhi',
						index: 'workbench',
						title: '工作台',
						},
						{
						icon: 'icon-anquan',
						index: '2',
						title: '业务办理',
						subs: [{
								index: 'policyformmanagement',
								title: '投保单管理'
								},
								{
								index: 'policymanagement',
								title: '保单管理'
								},
								{
								index: 'casemanagement',
								title: '案件管理'
								},
								{
								index: 'batchmanagement',
								title: '批单管理'
								},]
						},
						{
						icon: 'icon-xiazai',
						index: '3',
						title: '用户中心',
						subs: [{
								index: 'userlist',
								title: '用户列表'
								},]
						},
						{
						icon: 'icon-lianjie',
						index: '4',
						title: '设备管理',
						subs: [{
								index: 'elevator',
								title: '电梯'
								},
								{
								index: 'cableway',
								title: '索道'
								},]
						},
						{
						icon: 'icon-shiguyufangfuwu',
						index: 'statistics',
						title: '统计',
						},
						{
						icon: 'icon-shiguyufangshezhi',
						index: 'Track',
						title: '投保轨迹查询列表',
						}		
					]
			}
		},
		computed: {
			onRoutes() {
				return this.$route.path.replace('/', '');
			}
		},
		methods:{
			cancel(){
				this.show = false;
			},
			display(){
				this.show = true;
			},
		},
	}

</script>



<style lang='less'>
@import '../../assets/styles/public.less';
//  @import '../../assets/styles/element-variables.scss';
	.listbutton1{
		position: absolute;
		width: 18px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		left: 0;
		top: 50%;
		margin-top: -20px;
	}

	.sidebar {
		width: 220px;
		height: 100%;
		background: #2E363F;
		position: relative;
	}
	.listbutton{
		width: 18px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		position: absolute;
		right: 0;
		top: 50%;
		margin-top: -20px;
	}
	.el-icon-arrow-left,.el-icon-arrow-right{
		font-size: 18px;
	}
	.sidebar>ul {
		height: 100%;
	}

	#sidebar {
		.el-menu {
			.iconfont {

				margin-right: 10px;
				font-size: 16px;
				// margin-right: 10px;
				display: inline-block;
				width: 30px;
				text-align: center;
			}

			.icon-shiguyufangshezhi {
				font-size: 20px;
			}

			.icon-baodanguanli1 {
				font-size: 18px;
			}

			.icon-baoansuopeiguanli1 {
				font-size: 20px;
			}

			.icon-yonghuguanli1 {
				font-size: 19px;
			}
		}
		.el-submenu__title{
			color: @sidebar_list1;
		}
		.el-menu-item{
			color: @sidebar_list2;
		}
		.el-menu .is-active {
			color: @sidebar_active;
			.iconfont{
					color: @sidebar_active;
			}
		}

		.el-menu--inline {
			// padding-left: 20px;
		}

		.el-submenu .el-menu-item {
			text-indent: 20px;
		}
	}

</style>
