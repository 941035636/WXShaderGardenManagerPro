<template>
	<div id="Agent">
		<Title :titles="title" :showSwatich="true" ref="titleRef" :disabled="true"></Title>
		<div class="content-tabel mt20">
			<el-form :model="agentInfo" class="demo-ruleForm num-style" :inline="true" label-position="right" label-width="130px" ref="agentInfo" v-if="showAgrent">
				<el-form-item label="服务人员工号：">
					<span>{{agentInfo.smsAgentCode}}</span>
				</el-form-item>
				<el-form-item label="服务人员姓名：">
					<span>{{agentInfo.agentName}}</span>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './Title'
import AddProductInfo from './AddProductInfo'
import store from "../../../store/index"
export default {
	name:'ProductInfo',
	components:{
		Title,AddProductInfo
	},
	store,
	data() {
		return {
			title:'服务机构',
			agentInfo:{
				smsAgentCode:'',
				agentName:''
			},
			showAgrent:true
		};
  	},
	computed: {
		
	},
	created() {
		this.getData();
	},
	mounted() {
		this.$refs.titleRef.setSwatchVal(this.showAgrent);
	},
	methods: {
		getData(){
			console.log(this.$store.getters.agent)
			this.$store.getters.agent && this.$store.getters.agent.smsAgentCode ? this.showAgrent = true : this.showAgrent = false;
			this.agentInfo = this.$store.getters.agent ? this.$store.getters.agent : {}
		},
	}
};
</script>

<style lang="less">
#Agent{
	background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 20px 40px;
	.content{
		line-height: 40px;
		.content-botton{
			display: inline-block;
			width: 168px;
			height: 40px;
			color: #6683D5;
			margin-left: 20px;
			text-align: center;
			border: 1px solid #ECECEC;
			border-radius: 4px;
			box-sizing: border-box;
			cursor: pointer;
		}
	}
	.content-tabel{
		margin: 20px;
		width: calc(100% - 40px);
		height: 100%;
	}
	.num-style {
		.item1{
			width: 350px;
		}
	}
	.col-org {
		color: #fa8c16;
	}
}
</style>
