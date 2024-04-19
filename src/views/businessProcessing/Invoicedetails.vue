<template>
	<div class="Invoicedetails" id="Invoicedetails">
		<div class="content1">
			<span class="item1">发票详情</span>
		</div>
		<div class="content3">
			<span class="item2">投保单号：<span class="item11">{{ruleForm.applicationNo}}</span></span>
			<span class="item2">申请时间：<span class="item11">{{ruleForm.addTime}}</span></span>
			<span class="item21" @click="backto">返回</span>
		</div>
		<div  class="content2">
			<el-form :model="ruleForm" ref="ruleForm" label-width="220px" class="demo-ruleForm">
				<el-form-item label="发票抬头类型">
					<el-select v-model="ruleForm.invoiceType" class="item3" size="small" disabled>
						<el-option v-for="items in options1" :key="items.value" :label="items.label" :value="items.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票抬头:">
					<el-input v-model="ruleForm.taxpayerName" placeholder="请填写发票抬头"  class="item3" size="small" disabled></el-input>
				</el-form-item>
				<el-form-item label="发票金额:">
					<el-input v-model="ruleForm.invoiceAmount" placeholder="请填写发票金额" class="item3" size="small" disabled></el-input>
				</el-form-item>
				<el-form-item v-if="ruleForm.taxpayerType!='2'" label="纳税人识别号:">
					<el-input v-model="ruleForm.taxpayerNo" placeholder="请填写纳税人识别号"  class="item3" size="small" disabled></el-input>
				</el-form-item>
				<el-form-item label="纳税登记地址:">
					<el-input v-model="ruleForm.vatAddress" placeholder="请填写纳税登记地址"  class="item3" size="small" disabled></el-input>
				</el-form-item>
				<el-form-item label="纳税登记联系电话:">
					<el-input v-model="ruleForm.vatPhone" placeholder="请填写纳税登记联系电话"  class="item3" size="small" disabled></el-input>
				</el-form-item>
				<el-form-item label="纳税开户行名称:">
					<el-input v-model="ruleForm.vatBank" placeholder="请填写纳税开户行名称"  class="item3" size="small" disabled></el-input>
				</el-form-item>
				<el-form-item label="纳税开户行账号:">
					<el-input v-model="ruleForm.vatAccount" placeholder="请填写纳税开户行账号"  class="item3" size="small" disabled></el-input>
				</el-form-item>
				<el-form-item label="邮寄地址:" v-if="ruleForm.invoiceType!='0'">
					<el-input v-model="ruleForm.contactAddress" class="item3" size="small" disabled></el-input>
				</el-form-item>
				<el-form-item label="接收人:" v-if="ruleForm.invoiceType=='2' || ruleForm.invoiceType=='1'">
					<el-input v-model="ruleForm.contactName" placeholder="请填写接收人"  class="item3" size="small" disabled></el-input>
				</el-form-item>
				<el-form-item label="联系电话:" v-if="ruleForm.invoiceType=='2' || ruleForm.invoiceType=='1'">
					<el-input v-model="ruleForm.contactPhone" placeholder="请填写联系电话" class="item3" size="small" disabled></el-input>
				</el-form-item>
				<el-form-item label="邮箱:">
					<el-input v-model="ruleForm.contactEmail" type="email" placeholder="请填写邮箱"  class="item3" size="small" disabled></el-input>
				</el-form-item>
				<el-form-item label="下载发票:" v-if="ruleForm.status == '1'">
					<el-button @click="relation" type="text" size="mini">下载发票</el-button>
				</el-form-item>
				<el-form-item label="上传发票:" v-if="ruleForm.status == '0'">
					<el-button @click="relation" type="text" size="mini">上传发票</el-button>
				</el-form-item>
				<el-form-item label="是否邮寄:">
					<span>{{ruleForm.radio}}</span>
				</el-form-item>
			</el-form>
		</div>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit size='mini'>
				<el-table-column prop="appFormCode" label="投保单号" align="center" min-width="170"></el-table-column>
				<el-table-column prop="policyNo" label="保单号" align="center" min-width="190"></el-table-column>
				<el-table-column prop="createDate" label="投保时间" align="center" min-width="150"></el-table-column>
				<el-table-column prop="issueDate" label="出单日期" align="center" min-width="150"></el-table-column>
				<el-table-column prop="insuranceCompanyName" label="出单公司" align="center" min-width="150"></el-table-column>
				<el-table-column prop="startDate" label="保险起期" align="center" min-width="150"></el-table-column>
				<el-table-column prop="endDate" label="保险止期" align="center" min-width="150"></el-table-column>
				<el-table-column prop="productName" label="产品名称" align="center" min-width="200"></el-table-column>
				<el-table-column prop="policyHolderName" label="投保人" align="center" min-width="100"></el-table-column>
				<el-table-column prop="afterPrem" label="保费金额(元)" align="center" min-width="180"></el-table-column>
				<el-table-column prop="appStatus" label="保单状态" align="center" min-width="150"></el-table-column>
			 </el-table>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import ResourcesService from '../../service/ResourcesService';
import policyStatus from '../../../static/data/policyStatus.json';
export default {
	data() {
		return {
			Elevator:new elevator(),
			ResourcesService:new ResourcesService(),
			show:true,
			title:'收回',
			icon:'el-icon-arrow-up',
			ruleForm:{
				taxpayerType:'',
				invoiceType:"0",
				invoiceTypes:"增值税普通发票(电子)",
				taxpayerName:'',
				invoiceAmount:0,
				taxpayerNo:'',
				vatAddress:'',
				vatPhone:'',
				vatBank:'',
				vatAccount:'',
				contactAddress:[],
				contactAddress1:'',
				contactAddress2:'',
				contactName:'',
				contactPhone:'',
				contactEmail:'',
				radio:'否',
			},
			options1:[
				{
				  value: '0',
				  label: '增值税普通发票(电子)'
				},
				{
				  value: '1',
				  label: '增值税普通发票(纸质)'
				},
				{
				  value: '2',
				  label: '增值税专用发票'
				}
			],
			pageNum: 1,
			pagesize: 10,
			data1:[],
		}
	},
	created(){
		this.getElevator();
	},
	methods: {
		async getElevator(){ //发票列表
			let data = {
				userCode:window.sessionStorage.getItem('userCode'),
				pn:this.pageNum,
				ps:this.pagesize,
				invoiceId:this.$route.query.invoiceId,
			}
			let res = await this.Elevator.checkinvoices(data);
			if(res.code == '0000'){
				this.ruleForm = res.list[0];
				if(res.list[0].invoiceType != "0"){
					this.ruleForm.radio = '是';
				}else{
					this.ruleForm.radio = '否';
				}
				if(res.list[0].invoiceUrl){
					this.ruleForm.status = '1';
				}else{
					this.ruleForm.status = '0';
				}
				this.getAppDetailPro(this.ruleForm.applicationNo,this.ruleForm.insuranceCompanyName);
			}
		},
		async getAppDetailPro(applicationNo,insuranceCompanyName){
			let data = {
				"appCode":applicationNo
			};
			const res = await this.Elevator.searchAppList(data);
			if(res.code == '0000'){
				this.data1 = res.list;
				this.data1[0].insuranceCompanyName = insuranceCompanyName;
				for(var j=0;j<policyStatus.data.length;j++){
					if(this.data1[0].state == policyStatus.data[j].state){
						this.data1[0].appStatus = policyStatus.data[j].label;
					}
				}
			}
		},
		async relation(){
			if(this.ruleForm.status == '0'){
				this.$router.push({
					path:'/invoice/upload',
					query:{
						appCode:this.ruleForm.applicationNo,
						invoiceId :this.ruleForm.invoiceId
					}
				})
			}else{
				let {data}  = await this.Elevator.invoiceDownload( this.ruleForm.invoiceUrl, this.ruleForm.policyNo)
				if(data.code=='0000'){
					 this.ResourcesService.downloadOrViewFile(data.msg,true)
				}
			}
		},
		backto(){
			this.$router.go(-1);
		},
	},
}

</script>

<style lang="less" >
#Invoicedetails{
	padding-top: 20px;
	padding-bottom: 80px;
	background-color: #ffffff;
	.content1{
		width: 100%;
		height: 60px;
		padding-left: 20px;
		.item1{
			display: block;
			font-size: 18px;
			font-weight: 600;
			color: #101010;
		}
	}
	.content3{
		width: 96%;
		height: 40px;
		padding-left: 20px;
		margin-left: 2%;
		background-color: #EFF1F2;
		line-height: 40PX;
		.item11{
			font-weight: normal;
			color: #000000;
		}
		.item2{
			margin-left: 15px;
		}
		.item21{
			margin-right: 20px;
			float: right;
			color: #1581E8;
			cursor: pointer;
		}
	}
	.content2{
		width: 100%;
		padding-left: 20px;
		margin-top: 20px;
		.item3{
			width: 600px;
		}
	}
	.content-table{
		width: 96%;
		margin-left: 2%;
		margin-top: 20px;
		.item5{
			font-size: 12px;
			text-decoration: underline;
			color: #4E80FF;
		}
		.el-dropdown-link{
			cursor:pointer;
		}
		.item15{
			color: #1581E8;
			text-decoration: underline;
			cursor:pointer;
		}
	}
}
</style>
