<template>
	<div id="PolicyEntrySuccess">
		<div class="title-text common-style">
			<span class="item1">提交成功</span>
		</div>
		<Step :stepNum="stepNum" :showBranch="false"></Step>
		<div class="success">
			<div class="centered-block">
				<el-col :span="10"><div style="text-align: right;margin-right:10px;">
					<i class="el-icon-success" style="color:#E6A23C;font-size:80px;display: block;"></i>
				</div></el-col>
				<el-col :span="14"><div style="text-align: left;line-height: 40px;margin-left:10px;">
					<span style="font-size:20px;font-weight: 600;">您已成功提交，请订单列表查看</span><br/>
					<span>订单号：{{$route.query.orderCode}}</span>
				</div></el-col>
				<div style="text-align:center;margin-left:-100px;">
					<el-button type="info" @click="Success" round class="item1">返回列表</el-button>
					<el-button type="warning" @click="goToAdd" round class="item1">继续录入</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Step from './components/step'
export default {
	components:{
		Step
	},
	name:'PolicyEntrySuccess',
	data() {
		return {
			stepNum:3
		};
	},
	computed: {
		
	},
	created() {
		
	},
	methods: {
		Success(){
			this.$router.push({
				path: '/order/offline',
			});
		},
		goToAdd() {
			this.$router.push({
				path: '/order/offline/add',
			});
		}
	}
};
</script>

<style lang="less">
#PolicyEntrySuccess{
	width: 100%;
	height: 100%;
	margin-top: 20px;
	// background-color: #ffffff;
	font-size: 14px;
	color: #333333;
	.common-style {
		margin: 10px;
		background-color: #ffffff;
		border-radius: 5px;
	}
	.pd20 {
		padding: 20px;
	}
	.title-text {
		height: 50px;
		line-height: 50px;
		font-size: 20px;
		color: #101010;
		padding: 5px 10px;
	}
	.step-line {
		padding: 25px;
		.el-step.is-horizontal .el-step__line {
			top: 20px;
		}
		.el-step__icon {
			width: 40px;
			height: 40px;
		}
		.el-step__title.is-process {
			font-weight: 500;
			color: #C0C4CC;
		}
		.is-finish .el-step__icon.is-text {
			border-width: 1px;
			background-color: #e6f7ff;
		}
		.is-wait .el-step__icon.is-text,.is-process .el-step__icon.is-text {
			border-width: 1px;
			background-color: #f7f7f7;
		}
		.el-step__head.is-process {
			color: #C0C4CC;
			border-color: #C0C4CC;
		}
		.el-step__head.is-finish {
			color: #096dd9;
			border-color:#096dd9;
		}
		.el-step__title.is-finish {
			color:#101010;
		}
	}
	.branch-name {
		background-color: #e6f7ff;
		color: #096dd9;
		border-radius: 5px;
		font-size: 14px;
		padding: 8px 50px;
		text-align: center;
		font-weight: bold;
		margin-left: 39%;
	}
	.success{
		background-color: #ffffff;
		// width: 98%;
		height: 100%;
		margin:10px;
		padding-top: 300px;
		box-sizing: border-box;
		position: relative;
		.centered-block{
			width: 100%;
			position:absolute;
			top:50%;
			left: 50%;
			transform:translate(-50%,-50%);
		}
		.item1{
			width: 160px;
			margin: 30px 0 0 80px;
		}
	}
}
</style>
