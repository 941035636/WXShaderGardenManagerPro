<template>
	<div id="Agent">
		<Title :titles="title" :showSwatich="true"></Title>
		<div class="content-tabel mt20">
			<el-form :model="agentInfo" class="demo-ruleForm num-style" label-position="right" label-width="130px" :rules="rules" ref="agentInfo" v-if="showAgrent">
				<el-form-item label="服务人员工号："  prop="smsAgentCode">
					<el-select filterable v-model.trim="agentInfo.smsAgentCode" placeholder="请输入服务人员姓名、工号（支持模糊查询）"  clearable class="item1" @change="setAgentInfo(agentInfo.smsAgentCode)">
						<el-option v-for="(item,index) in agents" :key="index" :label="item.userName + '(' + item.employeeNum + ')'" :value="item.employeeNum"></el-option>
					</el-select>
					<span style="margin-left:8px;" class="col-org">查询范围："{{branchName}}"服务人员</span>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './Title'
import AddProductInfo from './AddProductInfo'
import store from "../../../store/index"
import Bus from "@/util/busEvent"
import UserService from '../../../service/UserService'
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
				smsAgentCode:''
			},
			rules: {
				smsAgentCode: [{ required: true, message: "请选择", trigger: "change" }],
			},
			UserService:new UserService(),
			agents:[],
			branchName:window.sessionStorage.getItem('branchName'),
			showAgrent:true,
			staffInfo:{}
		};
  	},
	computed: {
		
	},
	created() {
		this.getAgentList()
		if(this.$route.query.flag == 'again'){
			this.getData();
		}
	},
	methods: {
		//切换是否全面营销
		setStatus(flag) {
			this.agentInfo.smsAgentCode = '';
			this.showAgrent = flag;
			this.staffInfo = {
				"branchCode": '',//"服务人员机构编码-显示-非必填",
				"agentCode": '',//"服务人员编码-显示-非必填",
				"smsAgentCode":'',//"销管工号-显示-非必填",
				"agentName": '',//"服务人员姓名-显示-非必填",
				"branchName":'',//"服务人员机构名称-显示-非必填",
				"channelName": '',//"服务人员渠道名称-显示-非必填",
				"departCode": '',//"服务人员部门编码-显示-非必填",
				"channelCode": '',//"服务人员渠道编码-显示-非必填",
				"departName": '',//服务人员部门名称-显示-非必填"
			}
		},
		//设置全面营销人员
		setAgentInfo(code) {
			let item = this.agents.find(i => i.employeeNum == code);
			if(item) {
				this.staffInfo = {
					"branchCode": item.jtBranchCode,//"服务人员机构编码-显示-非必填",
					"agentCode": item.userCode,//"服务人员编码-显示-非必填",
					"smsAgentCode":item.employeeNum,//"销管工号-显示-非必填",
					"agentName": item.userName,//"服务人员姓名-显示-非必填",
					"branchName":item.jtBranchName,//"服务人员机构名称-显示-非必填",
					"channelName": '',//"服务人员渠道名称-显示-非必填",
					"departCode": item.departmentCode,//"服务人员部门编码-显示-非必填",
					"channelCode": item.hrMarketerChannel,//"服务人员渠道编码-显示-非必填",
					"departName": item.departmentName,//服务人员部门名称-显示-非必填"
				}
			}
		},
		//根据分公司查询全面营销人员列表
		async getAgentList() {
			let branchCode = window.sessionStorage.getItem('branchCode')
			let authDataInfo = window.sessionStorage.getItem('authDataInfo')
			let obj = {
				jtBranchCode: branchCode=='JT0000' ? '' : authDataInfo,
				hrPersonCategory: '08',
				pageSize:10000,
				pageNum:1
			}
            let res = await this.UserService.getUserByNo(obj);
			console.log(res)
			if(res.code == '0000' && res.total != 0) {
				this.agents = res.list;
			} else {
				this.agents = [];
			}
		},
		getData(){
			this.agentInfo.smsAgentCode = this.$store.getters.agent ? this.$store.getters.agent.smsAgentCode : '';
			this.staffInfo = this.$store.getters.agent ? this.$store.getters.agent : {};
		},
		submitFormAgent(){
			if(this.showAgrent) {
				let obj = {};
				this.$refs['agentInfo'].validate((valid) => {
					if (valid) {
						obj = this.staffInfo;
						return obj;
					} else {
						this.$message({
							message: '请补全服务机构信息！',
							type: 'warning'
						});
						obj = {};
					}
				});
				return obj;
			} else {
				return true;
			}
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
