<template>
	<div id="Title">
		<span class="item1"></span><span>{{titles}}</span>
	</div>
</template>

<script>
export default {
	name:'Title',
	props:{
		'titles':String
	},
	data() {
		return {
			
		};
	},
	computed: {
		
	},
	created() {
		
	},
	methods: {
		
	}
};
</script>

<style lang="less">
#Title{
	width: 100%;
	height: 80px;
	line-height: 80px;
	font-size: 18px;
	color: #333333;
	.item1{
		display: inline-block;
		width: 5px;
		height: 24px;
		background-color: #0050B3;
		vertical-align: middle;
		margin-right: 20px;
	}
}
</style>
