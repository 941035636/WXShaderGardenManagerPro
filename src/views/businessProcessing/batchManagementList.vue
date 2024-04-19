<template>
	<div id="batchManagement" class="batch-management">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">设备代码/出厂编号：</span>
						<el-input v-model.trim="formData.eleNo" placeholder="请输入设备代码/出厂编号" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">保单批单号：</span>
						<el-input v-model.trim="formData.applyNo" placeholder="请输入保单号、批单号、批单申请号" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">投保人：</span>
						<el-input v-model.trim="formData.policyHolder" placeholder="请输入投保人" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">使用单位名称：</span>
						<el-input v-model.trim="formData.useOfUnit" placeholder="请输入使用单位名称" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">产品名称：</span>
						<el-select v-model="formData.productCode" placeholder="请选择" class="item2" clearable>
							<el-option v-for="(item,index) in options3" :key="index" :label="item.productName" :value="item.productCode"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">设备批改类型：</span>
						<el-select v-model="formData.endorType" placeholder="请选择设备批改类型" size="small" clearable>
							<el-option  label="批增" :value="1"></el-option>
							<el-option  label="批减" :value="2"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">签单日期：</span>
						<el-date-picker type="date" placeholder="开始日期" v-model="formData.issueDateStart" size="small" class="item5" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<span class="item1">至</span>
						<el-date-picker type="date" placeholder="结束日期" v-model="formData.issueDateEnd" size="small" class="item5" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
					</div>
				</el-col>
			</el-row>
			<div class="elesearch-btn">
				<span @click="searchview" class="query-button">查询</span>
				<span @click="empty" class="empty-button">清空筛选条件</span>
			</div>
		</div>


		<div class="content-table">
			<div class="content">
				<div class="content-title">
					<el-row type="flex" class="row-bg">
						<el-col :span="9">
							<div style="padding-left:10px;box-sizing: border-box;">
								设备信息
							</div>
						</el-col>
						<el-col :span="10">
							<div style="padding-left:10px;box-sizing: border-box;">
								批单信息
							</div>
						</el-col>
						<el-col :span="5">
							<div style="padding-left:10px;box-sizing: border-box;">
								保单信息
							</div>
						</el-col>
					</el-row>
				</div>
				<div v-if="data1.length == 0" class="no-data">
					暂无数据
				</div>
				<div class="content-item" v-for="(item,index) in data1" :key="index" v-else>
					<el-row type="flex" class="row-bg">
						<el-col :span="9">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span class="col-blue">{{item.elevatorType}}</span></p>
								<p><span class="mr20">设备代码/出厂编号：<span v-if="item.equipmentsCode">{{item.equipmentsCode}}</span><span v-if="item.factoryNumber">{{item.factoryNumber}}</span></span></p>
								<p><span class="mr20">坐落地址：{{item.provinceName}}/{{item.cityName}}/{{item.countryName}}/{{item.useOfAddress}}</span></p>
								<p><span>使用单位名称：{{item.useOfUnit}}</span></p>
								<p><span>设备批改类型：<span>{{item.endorType == 1 ? '批增' : '批减'}}</span></span></p>
							</div>
						</el-col>
						<el-col :span="10">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span class="col-blue">{{item.endorsement.policyHolder}}</span></p>
								<p><span>批单申请号：{{item.endorsement.applyNo}}</span></p>
								<p><span>批单期间：{{item.endorsement.startDate}} 至 {{item.endorsement.endDate}}</span></p>
								<p><span>签单日期：{{item.endorsement.issueDate}}</span><span class="ml20">批单号：<span class="col-blue cur-op" @click="BatchDownload(item)">{{item.endorsement.endorsementsNo}}</span></span></p>
								<p><span>批单类型：<span class="col-org">{{item.endorsement.pdTypeName}}</span></span><span class="ml20">批单金额：<span>{{item.endorsement.amount}}</span></span></p>
							</div>
						</el-col>
						<el-col :span="5">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span>{{item.endorsement.productName}}</span></p>
								<p><span>保单号：<span class="col-blue cur-op" @click="accessPolicyDetails(item)">{{item.endorsement.policyNo}}</span></span></p>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import publicConfiguration from '../../global/publicConfiguration.js';
import batchStatus from '../../../static/data/batchStatus.json';
import paymentStatus from '../../../static/data/paymentStatus.json';
import methodApplication from '../../../static/data/methodApplication.json';
import battenType from '../../../static/data/battenType.json';
import product from './data/dtProductList.json';
import productClassification from './data/productClassification.json';
import ResourcesService from '../../service/ResourcesService.js';
export default {
	data() {
		return {
			Elevator:new elevator(),
			publicConfiguration:new publicConfiguration(),
			ResourcesService:new ResourcesService(),
			formData: {
				"applyNo": "",
				"eleNo": "",
				"endorType": '',
				"issueDateEnd": "",
				"issueDateStart": "",
				"policyHolder": "",
				"productCode": "",
				"useOfUnit": "",
				"pageNum": 1,
  				"pageSize": 10,
			},
            value1:'',
			value2:[],
			value21:'',
			value22:'',
			value3:'',
			value4:'',
			value5:'',
			value6:'',
			value66:'',
			value7:'',
			options:[],
			options1:[],
			options2:[],
			options3:[],
			data1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			state:0,
			currentPage:1,
			datas:[]
		}
	},
	created(){
		this.types();
		if(window.localStorage.getItem('index') == '5-1'){
			this.gettingCache();
		}else{
			window.localStorage.removeItem('data');
			this.getSequipList();
		}
	},
	methods: {
		async accessPolicyDetails(row){ // 电子保单
			let data = {
				"bizCodeType": "01",
				"policyNo":row.endorsement.policyNo,
				"resCode": "A002"
			}
			const parmes = await this.Elevator.getResourcesID(data);
			if(parmes.code =='0000'){
				if(parmes.list.length != 0){
					let res = await this.ResourcesService.downloadOrViewFile(parmes.list[0].fileUrl,true)
				}else{
					this.$message({
						message: '还没有电子保单！！！',
						type: 'warning'
					});
				}
			}
		},
		async BatchDownload(row){
			let parmes = await this.Elevator.getDet(row.endorsement.applyNo);
			if(parmes.code =='0000'){
				let res = await this.ResourcesService.downloadOrViewFile(parmes.data.fileInfoVOS[0].preSignUrl,true)
			}
		},
		types(){
			// this.options = productClassification.data;
			// this.options1 = batchStatus.data;
			// this.options2 = methodApplication.data;
			this.options = battenType.data;
			var options3 = product.data;
			this.datas = JSON.parse(window.sessionStorage.getItem('list'));
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				this.options3 = options3;
			}else{
				for(var i=0;i<options3.length;i++){
					if(window.sessionStorage.getItem('branchCode') == options3[i].branchCode){
						this.options3.push(options3[i]);
						this.formData.productCode = options3[i].productCode
					};
					if(window.sessionStorage.getItem('branchCode') == 'JT0167001' || window.sessionStorage.getItem('branchCode') == 'JT0113001'){
						if(options3[i].branchCode == 'JT0167001' || options3[i].branchCode == 'JT0113001'){
							this.options3.push(options3[i]);
							this.formData.productCode = options3[i].productCode
						}
					}
				}
			};
		},
		async getSequipList(){
			let index = '5-1';
			window.localStorage.setItem('data',JSON.stringify(this.formData));
			window.localStorage.setItem('index',index);
			let res = await this.Elevator.getSequipDataList(this.formData);
			if(res.code == '0000'){
				res.list.forEach(item => {
					item.endorsement.pdTypeName = this.options.find(subItem => subItem.value == item.endorsement.pdType) ? this.options.find(subItem => subItem.value == item.endorsement.pdType).label : ''
				})
				this.data1 = res.list;
				this.total = res.total;
			}
		},
		gettingCache(){
			let data = JSON.parse(window.localStorage.getItem('data'));
			this.formData = data;
			this.getSequipList();
		},
		searchview(){
			this.pageNum = 1;
			this.currentPage = 1;
			this.getSequipList();
		},
		empty(){
			this.formData = {
				"applyNo": "",
				"eleNo": "",
				"endorType": '',
				"issueDateEnd": "",
				"issueDateStart": "",
				"policyHolder": "",
				"productCode": "",
				"useOfUnit": "",
				"pageNum": 1,
  				"pageSize": 10,
			};
			this.pageNum = 1;
			this.currentPage = 1;
			this.types();
			this.getSequipList();
		},
		handleCurrentChange: function(pageNum){
		    this.formData.pageNum = pageNum;
			this.getSequipList();
		},
		detailedList(row){
			this.$router.push({
				path:'/detailedList',
				query:{
					applyNo:row.applyNo
				}
			})
		},
		arrivalaccount(row){
			this.$router.push({
				path:'/AccountAcceptanceConfirmation',
				query:{
					applyNo:row.applyNo,
					endorsementsType:row.endorsementsType
				}
			})
		},
		supplementaryRecord(){
			this.$router.push({
				path:'/order/endorsement/upload1',
				query:{
					index:'2'
				}
			})
		},
		submission(row){
			this.$router.push({
				path:'/order/endorsement/upload1',
				query:{
					applyNo:row.applyNo,
					insuranceNo:row.insuranceNo,
					endorsementsType:row.endorsementsType,
					index:'1'
				}
			})
		}
	},
}

</script>

<style lang="less" scoped>
#batchManagement {
	padding-bottom: 80px;
	min-height: 1000px;
	box-sizing: border-box;
	.elesearch{
		width: calc(100% - 40px);
		min-height: 234px;
		padding: 20px 20px 10px;
		margin: 20px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;	
		.row-bg{
			margin-bottom: 20px;
			line-height: 40px;
			.item1{
				display: block;
				width: 8%;
				text-align: center;
			}
			.item2{
				width: 70%;
			}
			.item3{
				font-size: 14px;
				color: #666666;
				display: block;
				width: 27%;
				text-align: right;
				padding-right: 10px;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.item5{
				width: 31%;
			}
		}
		.elesearch-btn{
			width: 100%;
			height: 100%;
			text-align: center;
			color: #ffffff;
			.query-button{
				display: inline-block;
				width: 120px;
				height: 40px;
				background-color: #f3ac56;
				text-align: center;
				line-height: 40px;
				margin-right: 40px;
				color: #ffffff;
				font-weight: 600;
				cursor: pointer;
				border-radius: 60px;
			}
			.empty-button{
				display: inline-block;
				width: 120px;
				height: 40px;
				border: 1px solid #e9e9e9;
				text-align: center;
				line-height: 40px;
				color: #999;
				background-color: #e9e9e9;
				font-weight: 600;
				box-sizing: border-box;
				cursor: pointer;
				border-radius: 60px;
			}
		}
	}
	.content-up{
		width: 100%;
		text-align: right;
		padding: 0 30px 20px;
		box-sizing: border-box;
	}
	.no-data{
		width: 100%;
		height: 100%;
		line-height: 70px;
		font-size: 16px;
		color: #999;
		font-weight: 500;
		text-align: center;
	}
	.content-table{
		width: 100%;
		height: 100%;
		padding:0 20px;
		margin-top: 20px;
		box-sizing: border-box;
		.content{
			width: 100%;
			height: 100%;
			padding:0 20px 20px;
			box-sizing: border-box;
			background-color: #ffffff;
			.content-title{
				width: 100%;
				height: 60px;
				line-height: 60px;
				font-size: 14px;
				color: #333333;
				font-weight: 600;
				border-bottom: 1px solid #F1EEE9;
			}
			.content-item{
				width: 100%;
				border-bottom: 1px solid #F1EEE9;
				box-sizing: border-box;
				p{
					line-height: 30px;
				}
			}
		}
	}
	.content-total{
		width: 100%;
		height: 60px;
		padding: 0 30px 20px;
		box-sizing: border-box;
		line-height: 60px;
		text-align: right;
		margin-top: 30px;
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
	.col-org {
		color:#fa8c16;
	}
	.cur-op {
		cursor: pointer;
	}
}
</style>
