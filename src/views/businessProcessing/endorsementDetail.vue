<template>
	<div class="PDDetails" id="PDDetails">
		<div class="title">
			<span class="ml10">批单详情</span>
			<div class="order-content">
				|
				<span class="ml10">批单申请号：{{data.applyNo}}</span>
				<span>提交时间：{{data.applyDate}}</span>
				<span>批单状态：
					<span v-if="data.status == '03'" class="col-gre">{{data.statusName}}</span> 
					<span v-else class="col-grey">{{data.statusName}}</span> 
				</span>
			</div>
		</div>
		<div class="content">
			<div class="policy-content">
				<div class="policy-title">批单信息</div>
				<div class="policy-con">
					<el-row type="flex" class="row-bg">
						<el-col :span="12"><div style="display: flex;">
							<span>批单类型：</span>
							<span class="col-org" v-if="data.endorsementsType=='01'">一般性批改</span>
							<span class="col-org" v-if="data.endorsementsType=='03'">批增</span>
							<span class="col-org" v-if="data.endorsementsType=='02'">批减</span>
							<span class="col-org" v-if="data.endorsementsType=='04'">批退</span>
							<span class="col-org" v-if="data.endorsementsType=='10'">替换人员</span>
						</div></el-col>
						<el-col :span="12"><div style="display: flex;">
							<span>申请方式：</span>
							<span v-if="data.endorsementsMode=='01'">在线批单</span>
							<span v-if="data.endorsementsMode=='02'">线下批单</span>
							<span v-if="data.endorsementsMode=='03'">半线上批单</span>
						</div></el-col>
					</el-row>
					<el-row type="flex" class="row-bg">
						<el-col :span="12"><div style="display: flex;">
							<span>批单号：</span>
							<span class="text-right">{{data.endorsementsNo}}</span>
						</div></el-col>
						<el-col :span="12"><div style="display: flex;">
							<span>生效日期：</span>
							<span class="text-right">{{data.startDate}}至{{data.endDate}}</span>
						</div></el-col>
					</el-row>
					<el-row type="flex" class="row-bg">
						<el-col :span="12"><div style="display: flex;">
							<span>批单金额：</span>
							<span style="color:#FF334C;">￥{{data.batchPremium}}元</span>
						</div></el-col>
						<el-col :span="12"><div style="display: flex;">
							<span>签单日期：</span>
							<span class="text-right">{{this.data.validDate}}</span>
						</div></el-col>
						<!-- <el-col :span="12"><div style="display: flex;">
							<span>保额：</span>
							<span style="color:#FF334C;">￥{{data.afterAmount}}元</span>
						</div></el-col> -->
					</el-row>
					<el-row type="flex" class="row-bg">
						
					</el-row>
				</div>
			</div>
			<div class="policy-content">
				<div class="policy-title">保单信息</div>
				<div class="policy-con">
					<el-row type="flex" class="row-bg">
						<el-col :span="12"><div style="display: flex;">
							<span>投保产品：</span>
							<span class="text-right" >{{data.productName}}</span>
						</div></el-col>
						<el-col :span="12"><div style="display: flex;">
							<span>保障期间：</span>
							<span class="text-right">{{dayNum()}}天 &nbsp;&nbsp;{{data.busApplicationForm.startDate}}至{{data.busApplicationForm.endDate}}</span>
						</div></el-col>
					</el-row>
					<el-row type="flex" class="row-bg">
						<el-col :span="12"><div style="display: flex;">
							<span>投保单号：</span>
							<span class="text-right">{{data.applicationFormCode}}</span>
						</div></el-col>
						<el-col :span="12"><div style="display: flex;">
							<span>保单号：</span>
							<span class="text-right">{{data.insuranceNo}}</span>
						</div></el-col>
					</el-row>
					<el-row type="flex" class="row-bg">
						<el-col :span="12"><div style="display: flex;">
							<span>保单保费：</span>
							<span style="color:#FF334C;">￥{{data.policyAmount}}元</span>
						</div></el-col>
						<el-col :span="12"><div style="display: flex;">
							<span>出单公司：</span>
							<span class="text-right">{{data.issueCompanyName}}</span>
						</div></el-col>
					</el-row>
				</div>
			</div>
			<!-- 发票信息 -->
			<div class="policy-content" v-if="data.busInvoiceVOList[0]">
				<div class="policy-title">
					<span>发票信息</span>
				</div>
				<el-row type="flex" class="row-bg">
					<el-col :span="24">
						<el-table :data="data.busInvoiceVOList" style="width: 100%" highlight-current-row show-header border fit>
							<el-table-column  type="index" label="序号" align="center" width="100"></el-table-column>
							<el-table-column label="发票类型" align="center">
								<template slot-scope="scope">
									<span v-if="scope.row.invoiceType == '00' || scope.row.invoiceType == '3'">增值税普通发票(电子)</span>
									<span v-if="scope.row.invoiceType == '01'">增值税专用发票</span>
									<span v-if="scope.row.invoiceType == '02'">增值税普通发票(纸质)</span>
								</template>
							</el-table-column>
							<!-- <el-table-column prop="invoiceTypes" label="发票类型" align="center"></el-table-column> -->
							<el-table-column prop="title" label="发票抬头" align="center"></el-table-column>
							<el-table-column prop="taxpayerIdentificationNumber" label="纳税人识别号" align="center"></el-table-column>
							<el-table-column label="发票金额" align="center">
								<span>{{data.batchPremium}}</span>
							</el-table-column>
							<!-- <el-table-column label="发票状态" align="center">
								<template slot-scope="scope">
									<span v-if="scope.row.status == '0'" style="color: #3574E8;">开票中</span>
									<span v-if="scope.row.status == '1'" style="color: #10AB2A;">开票成功</span>
									<span v-if="scope.row.status == '2'" style="color: #E51C23;">开票失败</span>
								</template>
							</el-table-column> -->
						</el-table>
					</el-col>
				</el-row>
			</div>
      		<BatchSettDetail ref="BatchSettDetail" v-if="dataLoaded" :settlementData="settlementData"></BatchSettDetail>
			<RevenueRecognition></RevenueRecognition>
		</div>
	</div>
</template>

<script>
import policyService from "@/service/policyService.js";
import ResourcesService from "@/service/ResourcesService.js";
import RevenueRecognition from './components/RevenueRecognitionPD'
import BatchSettDetail from './components/batchSettDetail'
import batchStatus from '../../../static/data/batchStatus.json';
export default {
	name: "BatchDetail",
	components: {RevenueRecognition,BatchSettDetail},
	data() {
		return {
			data:{
				busApplicationForm:{},
				busInvoiceVOList:[]
			},
			batchDetail:{},
			policyService:new policyService(),
			resourcesService:new ResourcesService(),
			list1:[],
			list2:[],
			list3:[],
			option:[
				{
					value:'01',
					label:'未生成结算凭证'
				},
				{
					value:'02',
					label:'初始化'
				},
				{
					value:'03',
					label:'成功（暂存）'
				},
				{
					value:'04',
					label:'成功（已提交）'
				},
				{
					value:'05',
					label:'成功（已审核）'
				},
				{
					value:'06',
					label:'失败'
				},
				{
					value:'07',
					label:'删除'
				}
			],
			option1:[
				{
					value:'1',
					label:'待结算'
				},
				{
					value:'2',
					label:'已开票'
				},
				{
					value:'3',
					label:'业务款项已确认'
				},
				{
					value:'4',
					label:'部分结算'
				},
				{
					value:'5',
					label:'已结算'
				},
				{
					value:'6',
					label:'业务确认打回'
				},
				{
					value:'7',
					label:'未生成结算单'
				}
			],
      settlementData:{
        afterPrem: "",
        name:"批单金额",
        "insuranceCompanyVOS": [],
        "settlementDepartmentVOs": [],
      },
      dataLoaded:false,
		};
	},
	created() {
		this.inits();
	},
	methods: {
		async inits() {
			let res = await this.policyService.getEndorDetail(this.$route.query.applyNo)
			if (res.code == "0000") {
				res.data.issueCompanyName= res.data.busInsuranceCompanies.find(item=>{
                    return item.role2==='01'
                }).name;
				res.data.policyAmount = res.data.policyAmount.toFixed(2);
				res.data.batchPremium = res.data.batchPremium.toFixed(2);
				res.data.statusName = batchStatus.data.find(i => i.value == res.data.status) ? batchStatus.data.find(i => i.value == res.data.status).label : '';
				this.data = res.data;
				this.settlementData.afterPrem = res.data.batchPremium;
				this.settlementData.settlementDepartmentVOs = res.data.settlementDepartmentVOs
				this.settlementData.insuranceCompanyVOS = res.data.busInsuranceCompanies
				if(this.settlementData.settlementDepartmentVOs){
					this.dataLoaded = true;
				}
			}
		},
		downloadCopy(val){
			this.resourcesService.downloadOrViewFile(val,true)
		},
		goBack(){
			this.$router.go(-1)
		},
		dayNum(){ // 天数
			if(this.data && this.data.busApplicationForm.startDate && this.data.busApplicationForm.endDate){
				return this.$stringHelper.countDay(this.data.busApplicationForm.startDate, this.data.busApplicationForm.endDate);
			}else{
				return 0;
			}
		},
	} 
};
</script>

<style lang="less">
#PDDetails{
	background-color: #fff;
	width: 99%;
    margin: 15px;
	padding-bottom: 80px;
	.title{
		width: 98.5%;
		height: 40px;
		line-height: 40px;
		background-color: #fff;
		padding: 20px 10px;
		color: #535F7A;
		border-radius: 2px;
		font-size: 20px;
		position: relative;
		.order-content{
			margin-left: 40px;
			display: inline-block;
			width: 80%;
			height: 40px;
			line-height: 40px;
			color: #181E2D;
			font-size: 16px;
			span{
				margin-right: 40px;
			}
		}
	}
	.content{
		width: 100%;
		min-height: 1332px;
		margin-top: 10px;
		box-sizing: border-box;
		// background-color: #fff;
		border-radius: 14px;
		.policy-content{
			margin-top: 10px;
			background-color: #fff;
			border-radius: 2px;
			padding: 10px 20px 20px 20px;
			.policy-title{
				width: 100%;
				box-sizing: border-box;
				line-height: 22px;
				height: 22px;
				margin: 20px 0 30px 0;
				color: #000000;
				font-size: 18px;
				font-weight: 700;
				padding-left: 24px;
				border-left: 4px solid #273989;
			}
			.policy-con{
				// padding-left: 24px;
				margin: 0 28px;
				.text-title{
					font-size: 16px;
					color: #000;
					font-weight: 700;
				}
			}
			.row-bg{
				margin-top:18px;
				.item3{
					display: block;
					width: 35%;
					padding-left: 50px;
					box-sizing: border-box;
				}
				.item4{
					display: block;
					width: calc(65% - 60px);
					vertical-align:middle;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
			}
		}
		.policy-tit{
				width: 100%;
				box-sizing: border-box;
				line-height: 20px;
				height: 20px;
				margin: 40px 0;
				color: #000000;
				font-size: 14px;
				padding-left: 24px;
				border-left: 4px solid #273989;
			}
		.policyholder-content{
			width: 100%;
			display: flex;
			
			.holder-content{
				width: 50%;
				min-height: 352px;
				box-sizing: border-box;
				margin-top: 20px;
				font-size: 16px;
				color: #181E2D;
				.policy-title{
					width: 100%;
					height: 56px;
					background-color: #F1F4F9;
					border-bottom: 1px solid #D2D2D2;
					padding-left: 24px;
					box-sizing: border-box;
					line-height: 56px;
					color: #535F7A;
					font-size: 14px;
					span{
						float: right;
						margin-right: 16px;
					}
				}
				.row-bg{
					margin-top:18px;
					width: 100%;
					.item3{
						display: block;
						width: 35%;
						padding-left: 50px;
						box-sizing: border-box;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.item4{
						display: block;
						width: calc(65% - 60px);
						vertical-align:middle;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					
					.item5{
						width: calc(65% - 60px);
						.item6{
							display: block;
							width: 70%;
						}
						.item7{
							display: block;
							width: 27%;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
					}
				}
			}
		}
	}
	.col-red {
		color: #f5222d;
	}
	.col-blue {
		color: #096dd9;
	}
	.col-org {
		color: #fa8c16;
	}
	.col-gre {
		color: #389e0d;
	}
	.col-grey {
		color: #919191;
	}
	.cur-op {
		cursor: pointer;
	}
}
.text-right{
	color: #000;
}
</style>
