<template>
	<div id="app">
		<router-view v-if="isRouterAlive"></router-view>
	</div>
</template>

<script>
 import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
	provide(){
		return{
		reload:this.reload
		}
	},
	data:function(){
		return{
			isRouterAlive:true
		}
	},
	computed:{
		...mapGetters('userInfo',{
				userInfoStore:'renderUserInfo'
			})
	},
	created(){
		
	},
	methods:{
		reload(){
			this.isRouterAlive = false;
			this.$nextTick(function(){
				this.isRouterAlive = true;
			})
		},
  }
}
</script>

<style lang="less">
@import './assets/styles/common.less';
</style>

