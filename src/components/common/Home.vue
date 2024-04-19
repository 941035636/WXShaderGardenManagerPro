<template>
    <div class="wrapper">
        <v-head></v-head>
		<div class="content-box">
			<v-sidebar></v-sidebar>
			<div class="list">
				<v-tags ref="changeRoute"></v-tags>
				<div class="content">
					<transition name="move" mode="out-in">
						<router-view :key="$route.fullPath"></router-view>
					</transition>
				</div>
			</div>
		</div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
	import vTags from './TagsNew.vue';
    export default {
        components:{
            vHead, vSidebar,vTags
		},
		methods:{
			changeRoutes(){
				this.$refs.changeRoute.save()
			}
		}
    }
</script>
<style lang="less">
.content-box{
	max-height: 100%;
}
.list{
	width: 100%;
	max-height: 100%;
	overflow: scroll;
}
.content{
	min-height: 100%;
}
</style>
