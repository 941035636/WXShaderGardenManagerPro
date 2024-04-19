<template>
	<div id="PolicyEntryDetail">
		<div class="title-text common-style">
			<span class="item1">保单录入</span>
			<div class="fr">
				<el-button  round size="medium" @click="resetForm">取 消</el-button>
				<el-button type="warning" round size="medium" @click="submitForm">下一步</el-button>
			</div>
		</div>
		<Step :stepNum="stepNum" :showBranch="true" ref="stepContent"></Step>
		<ProductInfo ref="getProduct" @setFuncYG="branchYG" @setFuncLHB="setProductLHB"></ProductInfo>
		<PolicyholderInfo :areaData="areaData" ref="getholderInfo"></PolicyholderInfo>
		<InsuredInfoOther v-if="productSort == 'jc'" ref="getInsuredInfo"></InsuredInfoOther>
		<InsuredInfo v-else :areaData="areaData" ref="getInsuredInfo"></InsuredInfo>
		<AgentInfo ref="AgentInfo"></AgentInfo>
		<PolicyInfo ref="getPolicyInfo" @changeIssueDate="changeIssueDate" @changeStartDate="changeStartDate" :productLHB="productLHB"></PolicyInfo>
		<div style="background-color:#ffffff; padding: 0 40px; margin:0 10px">
			<Cross ref="Cross" :typeName="'LD'" :multiData="multiData" :crossForm="crossForm"></Cross>
		</div>
		
	</div>
</template>

<script>
import Step from './components/step'
import PolicyholderInfo from './components/PolicyholderInfo'
import InsuredInfo from './components/InsuredInfo'
import InsuredInfoOther from './components/InsuredInfoOther'
import ProductInfo from './components/ProductInfo'
import PolicyInfo from './components/PolicyInfo'
import AgentInfo from './components/Agent'
import PolicyentryService from '../../service/PolicyentryService'
import UserService from '../../service/UserService'
import store from "../../store/index"
import buttonSelection from './js/buttonSelection.js';
import ProcessProductData from './js/ProcessProductData'
import Cross from "../businessProcessing/components/Reason";
export default {
	name:'PolicyEntryDetail',
	components:{
    	PolicyholderInfo,InsuredInfo,ProductInfo,PolicyInfo,AgentInfo,Cross,Step,InsuredInfoOther
	},
	data() {
		return {
			PolicyentryService:new PolicyentryService(),
			ButtonSelection:new buttonSelection(),
			ProcessProductData:new ProcessProductData(),
			UserService: new UserService(),
			areaData:[],
			multiData:{
				startDate:"", // 保险起期
				validDate:"", // 签单日期
			},
			crossForm:{
				incomeDate:"", // 收入确认时间
				proofReason:"", // 佐证原因
				proofFile:"", // 佐证文件
				proof:"", // 原因
				otherReas:"", // 佐证其他原因
				type:"epolicy",
			},
			stepNum:1,
			productSort:'',
			productLHB:false
		};
	},
	computed: {
		
	},
	store,
	created() {
		this.getArea();
		if(this.$route.query.flag == 'again') {
			this.crossForm =this.$store.getters.cross;
			this.productSort =this.$store.getters.productInfo.productSort;
			this.productLHB = this.$store.getters.productInfo.productType  == "LHB" ? true :  false;
		}
	},
	mounted() {
		this.branchYG(this.$store.getters.productInfo.ygBranchFlag ? this.$store.getters.productInfo.ygBranchFlag : false)
	},
	methods: {
		branchYG(val) {
			this.$refs.stepContent.setFlag(val)
		},
		setProductLHB(val) {
			val == "LHB" ? this.productLHB = true : this.productLHB = false;
		},
		changeIssueDate(val){
			this.multiData.validDate =val; 
		},
		changeStartDate(val){
			this.multiData.startDate =val; 
		},
		async getArea(){
			const res = await this.UserService.getArea();
			this.areaData = this.ButtonSelection.Accessarea(res.data, 'JT0000');
		},
		resetForm(){
			sessionStorage.removeItem('vuex')
			sessionStorage.removeItem('inusureCompanys')
			sessionStorage.removeItem('inusureCompanysData')
			this.$router.push({
				path: '/order/offline',
			});
		},
		submitForm(){
			let policyHolder = this.$refs.getholderInfo.submitForm1()
			if(JSON.stringify(policyHolder) == '{}'){
				return false;
			}

			let insured = this.$refs.getInsuredInfo.submitForm2()
			if(JSON.stringify(insured) == '{}'){
				return false;
			}

			let product = this.$refs.getProduct.submitForm3()
			if(!product){
				return false;
			}

			let agent = this.$refs.AgentInfo.submitFormAgent()
			if(JSON.stringify(agent) == '{}'){
				return false;
			}

			let policy = this.$refs.getPolicyInfo.submitForm5()
			if(JSON.stringify(policy) == '{}'){
				return false;
			}

			if(!this.$refs.getPolicyInfo.policy.isHand && policy.policyHolder != policyHolder.holderName) {
				this.$refs.getPolicyInfo.showTips(policyHolder.holderName,policy.policyHolder);
				return false;
			}

			if(!this.$refs.Cross.sava()){
				return false;
			}

			this.$store.commit('updateCross',this.crossForm);
			this.$store.commit('updatePolicyHolder',policyHolder);
			this.$store.commit('updateInsureds',insured);
			this.$store.commit('updateProductInfo',product);
			if(agent.smsAgentCode) {
				this.$store.commit('updateAgent',agent);
			} else {
				this.$store.commit('updateAgent',{});
			}
			this.$store.commit('updatePolicyInfo',policy);
			if(this.productLHB){ // 灵活版产品跳转结算页面，其他产品跳转详情确认页面
				sessionStorage.setItem("isRec",this.isRec);
				this.$router.push({
					path: "/SettlementInfo",
				});
			}else{
				// this.$router.push({
				// 	path: '/PolicyPreviewDetail',
				// 	query:{
				// 		type:this.productLHB
				// 	}
				// });
				if(product.ygBranchFlag && product.ygBranchFlag == 'Y') {
					let name = window.sessionStorage.getItem('branchName');
					let message = '该保单的业务归属为：' + name + ',推送业管分支机构为：' + name + ',请确认！'
					this.$confirm(message, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						if(this.productSort == 'jc') {
							if(this.$route.query.flag == 'again') {
								this.$router.push({
									path: '/PolicyPreviewList',
									query:{
										flag: 'again',
										type:this.productLHB
									}
								});
							} else{
								this.$router.push({
									path: '/PolicyPreviewList',
									type:this.productLHB
								});
							}
						} else {
							this.$router.push({
								path: '/PolicyPreviewDetail',
								type:this.productLHB
							});
						}
					}).catch(() => {
								
					});
				} else {
					if(this.productSort == 'jc') {
						if(this.$route.query.flag == 'again') {
							this.$router.push({
								path: '/PolicyPreviewList',
								query:{
									flag: 'again',
									type:this.productLHB
								}
							});
						} else{
							this.$router.push({
								path: '/PolicyPreviewList',
								type:this.productLHB
							});
						}
					} else {
						this.$router.push({
							path: '/PolicyPreviewDetail',
							type:this.productLHB
						});
					}
				}
			}
		},
		setContractFlag(data) {
			this.$refs.getPolicyInfo.policy.selectContract = data;
		},
		setProductSort(productSort) {
			this.$forceUpdate();
			this.productSort = productSort;
		},
		setContract(val) {
			this.$refs.getPolicyInfo.setContract(val)
		}
	},
	// 离开当前组件会出发改钩子函数
	beforeRouteLeave (to, from, next) {
        if(to.path != '/PolicyPreviewDetail' && to.path != '/SettlementInfo'){
			this.$store.commit("updateCompanyForm", {});
      		this.$store.commit("updateCompanyRatio", {});
			sessionStorage.removeItem('vuex')
			sessionStorage.removeItem('inusureCompanys')
			sessionStorage.removeItem('inusureCompanysData')
		} 
		next();
  },
};
</script>

<style lang="less">
#PolicyEntryDetail{
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
	.ml20 {
		margin-left: 20px;
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
	#Multi {
		margin-left: -85px;
		.multi {
			margin-top: 0;
		}
	}
}
</style>
