<template>
	<div id="Title">
		<span class="item1"></span><span>{{titles}}</span>
		<span v-if="showSwatich" class="qm-style">是否全面营销<el-switch v-model="isQM" :disabled="disabled" active-color="#13ce66" class="ml10" @change="changeStatus"></el-switch></span>
	</div>
</template>

<script>
export default {
	name:'Title',
	props:{
		'titles':String,
		'showSwatich':Boolean,
		'disabled':Boolean,
	},
	data() {
		return {
			isQM:true
		};
	},
	computed: {
		
	},
	created() {
		
	},
	methods: {
		changeStatus() {
			this.$parent.setStatus(this.isQM);
		},
		setSwatchVal(flag) {
			this.isQM = flag;
		}
	}
};
</script>

<style lang="less">
#Title{
	width: 100%;
	height: 60px;
	line-height: 60px;
	font-size: 18px;
	color: #333333;
    border-bottom: 1px solid #e9e9e9;
	.item1{
		display: inline-block;
		width: 5px;
		height: 24px;
		background-color: #ffc069;
		vertical-align: middle;
		margin-right: 20px;
	}
	.qm-style {
		margin-left: 48px;
		font-size: 16px;
		font-weight: 600;
	}
	.ml {
		margin-left: 10px;
	}
}
</style>
