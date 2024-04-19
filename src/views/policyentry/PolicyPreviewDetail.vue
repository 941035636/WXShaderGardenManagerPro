<template>
	<div id="PolicyPreviewDetail">
		<div class="title-text common-style">
			<span class="item1">保单录入</span>
			<div class="fr">
				<el-button  round size="medium" @click="resetForm">上一步</el-button>
				<el-button type="warning" round size="medium" @click="submitForm" :disabled="disabled">确认提交</el-button>
			</div>
		</div>
		<Step :stepNum="stepNum" :showBranch="true" ref="stepContent"></Step>
		<ProductInfos :productInfo="productInfo"></ProductInfos>
		<PolicyholderInfos :form="form"></PolicyholderInfos>
		<InsuredInfoOther v-if="productInfo.productSort == 'jc'"></InsuredInfoOther>
		<InsuredInfos v-else :insureds="insureds"></InsuredInfos>
		<InsuredList :addList="addList" v-if="productInfo.productSort == 'jc'"></InsuredList>
		<Agents ref="Agents"></Agents>
		<PolicyInfos :policy="policy" :crossForm="crossForm"></PolicyInfos>
		<SettInfos :settForm="settForm" v-if="$route.query.type"></SettInfos>
	</div>
</template>

<script>
import Step from './components/step'
import PolicyholderInfos from './components/PolicyholderInfos'
import PolicyholderInfo from './components/PolicyholderInfo'
import InsuredInfos from './components/InsuredInfos'
import InsuredInfoOther from './components/InsuredInfoOther'
import InsuredList from './components/InsuredList'
import ProductInfos from './components/ProductInfos'
import PolicyInfos from './components/PolicyInfos'
import AttachmentInfos from './components/AttachmentInfos'
import Agents from './components/Agents'
import PolicyentryService from '../../service/PolicyentryService'
import {elevator} from '../../server/accidenServer.js';
import ContractService from '../../service/ContractService'
import store from "../../store/index"
import {DataStructure} from '../../mixins/DataStructure'
import SettInfos from "./components/SettInfos";
export default {
	name:'PolicyPreviewDetail',
	components:{
		PolicyholderInfos,InsuredInfos,ProductInfos,PolicyInfos,AttachmentInfos,Step,Agents,InsuredInfoOther,InsuredList,SettInfos
	},
	mixins:[DataStructure],
	data() {
		return {
			stepNum:2,
			PolicyentryService:new PolicyentryService(),
			ContractService: new ContractService(),
			Elevator:new elevator(),
			form:{
				userCode:'',
				holderName:'',
				Industrytype:'',
				location:[],
				provinceName:'',
				cityName:'',
				countyName :'',
				position:'',
				type:'',
				threeInOneCode:'',
				person1:'',
				phone1:'',
			},
			insureds:{
				userCode:'',
				holderName:'',
				Industrytype:'',
				location:[],
				provinceName:'',
				cityName:'',
				countyName :'',
				position:'',
				type:'',
				threeInOneCode:'',
				person1:'',
				phone1:'',
				radio:1,
				value:false,
				urlId:'',
				urlId1:'',
				urlName:''
			},
			productInfo:{},
			employee:{
				employees:'',
				costAmount:''
			},
			policy:{
				type:'',
				inusureCompanyName:'',
				inusureCompanyCode:'',
				policyNo:'',
				startDate:'',
				endDate:'',
				signedon:'',
				premium:'',
				urlId:[],
				shareScale:''
			},
			attachment:{
				urlid:'',
				urlName:''
			},
			res_token:'',
			disabled:false,
			agent:{},
			addList:[],
			settForm:{},
		};
	},
	computed: {
		
	},
	store,
	created() {
		this.getData();
		this.getResToken();
		this.getBranchInfo();
	},
	mounted() {
		this.setYGFlag();
	},
	methods: {
		setYGFlag() {
			this.$refs.stepContent.setFlag(this.productInfo.ygBranchFlag?this.productInfo.ygBranchFlag:false)
		},
		getData(){
			this.form = this.$store.getters.policyHolder;
			this.insureds = this.$store.getters.insureds;
			this.productInfo = this.$store.getters.productInfo;
			this.addList = this.$store.getters.jcList;
			// this.employee = this.$store.getters.employeeInfo;
			this.agent = this.$store.getters.agent;
			this.policy = this.$store.getters.policyInfo;
			// this.attachment = this.$store.getters.attachmentInfo;
			this.crossForm = this.$store.getters.cross;
			if(this.$route.query.type){ // 灵活版产品传入参数
				this.settForm = this.$store.getters.companyForm 
			}
		},
		async getResToken(){
			this.res_token = await this.PolicyentryService.getResToken()
		},
		async getBranchInfo() {
			let res = await this.PolicyentryService.getBranchInfo({"branchCode":sessionStorage.getItem('branchCode')});
			if(res.code == '0000' && res.list.length != 0) {
				sessionStorage.setItem('branchInfo_01',JSON.stringify(res.list[0]));
			}
		},
		resetForm(){
			if(this.$route.query.type){
				this.$router.push({
					path: "/SettlementInfo",
					query:{
						flag: "again",
					}
				});
			}else{
				this.$router.push({
					path: "/order/offline/add",
					query: {
						flag: "again",
					},
				});
			}
		},
		async submitForm(){
			this.disabled = true;
			let data = this.OrganizeData(this.form,this.insureds,this.productInfo,this.employee,this.policy,this.attachment,this.crossForm,this.agent,this.addList,this.settForm);
			const res = await this.PolicyentryService.setRecordList(data,{"headers":{"X-RESUB-TOKEN":this.res_token}});
			if(res.code == '0000'){
				let returnData = JSON.parse(res.msg)
				let sendData = {
					applicationFormCode: returnData.appCode,
					customerCode: this.policy.table[0].customerCode,
					customerName: this.policy.table[0].customerName,
					contractEndDate: this.policy.table[0].endTime,
					contractStartDate: this.policy.table[0].startTime,
					contractCode: this.policy.table[0].code
				};
				let resData = await this.ContractService.sendContract(sendData);
				if(this.policy.ywFlag) {
					let  paramsData = [
						{ 
							"claimbyid": window.sessionStorage.getItem('userCode'),   //-- 认领人id
							"systemcode": "5",        //-- 所属系统
							"operby": window.sessionStorage.getItem('userName'), // -- 操作人
							"orgcode": window.sessionStorage.getItem('branchCode'),    //-- 机构编码
							"deptcode": window.sessionStorage.getItem('branchCode') == 'JT0000' ? 'JT0000507' : '',//部门编码
							"policyno": this.policy.policyNo,  //-- 保单号
							"operbyid": window.sessionStorage.getItem('userCode'),    //-- 操作人id
							"claimby": window.sessionStorage.getItem('userName')  //-- 认领人
						}
					];
					const parmesYW = await this.Elevator.policyComfirm(paramsData);
					if(parmesYW.executecode == '0'){
						this.$message.success("认领成功")
					}else{
						this.$message.error("认领失败，" + parmesYW.executenote)
					}
				}
				sessionStorage.removeItem('branchInfo_01');
				this.$router.push({
					path: '/PolicyEntrySuccess',
					query:{
						orderCode:returnData.code
					}
				});
				sessionStorage.removeItem('vuex')
				sessionStorage.removeItem('inusureCompanys')
				sessionStorage.removeItem('inusureCompanysData')
			}else{
				this.disabled = false;
			}
		}
	},
	// 离开当前组件会出发改钩子函数
    beforeRouteLeave (to, from, next) {
        if(to.path != '/SettlementInfo' && to.path != '/order/offline/add'){
			this.$store.commit("updateCompanyForm", {});
      		this.$store.commit("updateCompanyRatio", {});
			sessionStorage.removeItem('vuex')
			sessionStorage.removeItem('inusureCompanys')
		} 
		next();
    },
};
</script>

<style lang="less">
#PolicyPreviewDetail{
	// background-color: #ffffff;
	font-size: 14px;
	color: #333333;
	padding-bottom: 30px;
	box-sizing: border-box;
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
		font-size: 14px;
		text-align: center;
		font-weight: bold;
	}
	.tip-text {
		background-color: #e6f7ff;
		color: #096dd9;
		border-radius: 5px;
		padding: 8px 50px;
	}
	.col-red {
		color: #ec2100;
	}
	.footer{
		width: 100%;
		text-align: center;
		.footer-resetForm{
			width: 110px;
			background-color: #F8F8F8;
			border: 1px solid #ECECEC;
		}
		.footer-submitForm{
			width: 160px;
			background-color: #6683D5;
		}
	}
}
</style>
