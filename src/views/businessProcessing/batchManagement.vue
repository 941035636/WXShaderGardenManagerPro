<template>
	<div id="batchManagement" class="batch-management">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">保单批单号：</span>
						<el-input v-model.trim="value1" placeholder="请输入保单号、批单号、批单申请号" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">投保人：</span>
						<el-input v-model.trim="value7" placeholder="请输入投保人" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">状态：</span>
						<el-select v-model="value3" placeholder="请选择状态"  size="small" clearable>
							<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">申请方式：</span>
						<el-select v-model="value4" placeholder="请选择申请方式" size="small" clearable>
							<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">产品名称：</span>
						<el-select v-model="value22" filterable placeholder="请选择" class="item2" clearable size="small"  @focus="getProductList">
							<el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.code"></el-option>
						</el-select>
						<!-- <el-cascader v-model="value2" :options="options" @change="handleChange1" placeholder="请选择" size="small" clearable></el-cascader> -->
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">批单类型：</span>
						<el-select v-model="value5" placeholder="请选择批单类型" size="small" clearable>
							<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">签单日期：</span>
						<el-date-picker type="date" placeholder="开始日期" v-model="value6" size="small" class="item5" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<span class="item1">至</span>
						<el-date-picker type="date" placeholder="结束日期" v-model="value66" size="small" class="item5" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
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
				<div style="height:50px">
					<el-button type="primary" style="float:right;margin-top:10px;margin-right:20px;letter-spacing:2px;" round size="medium" @click="supplementaryRecord" v-if="datas.find(item => item.key == '20001')">批单补录</el-button>
					<el-button type="primary" style="float:right;margin-top:10px;margin-right:20px;letter-spacing:2px;" round size="medium" @click="exportData" v-if="datas.find(item => item.key == '20002')">导出</el-button>
					<span style="float:right;margin-top:18px;margin-right:20px;letter-spacing:2px;color:#ff2525;" v-if="datas.find(item => item.key == '20002')">温馨提示：批单信息单次最多可导出5千条，如果需要更多信息，请按照时间或者其他信息进行多次导出</span>
				</div>
				<div class="content-title">
					<el-row type="flex" class="row-bg">
						<el-col :span="7">
							<div style="padding-left:10px;box-sizing: border-box;">
								批单信息
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding-left:10px;box-sizing: border-box;">
								申请方式/批单类型
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding-left:10px;box-sizing: border-box;">
								批单金额/状态
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding-left:10px;box-sizing: border-box;">
								申请日期/操作人
							</div>
						</el-col>
						<el-col :span="5">
							<div style="padding-left:10px;box-sizing: border-box;">
								保单信息
							</div>
						</el-col>
						<el-col :span="2">
							<div style="padding-left:10px;box-sizing: border-box;">
								操作
							</div>
						</el-col>
					</el-row>
				</div>
				<div v-if="data1.length == 0" class="no-data">
					暂无数据
				</div>
				<div class="content-item" v-for="(item,index) in data1" :key="index" v-else>
					<el-row type="flex" class="row-bg">
						<el-col :span="7">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span class="col-blue">{{item.holderName}}</span></p>
								<p><span class="mr20">批单申请号：{{item.applyNo}}</span></p>
								<p><span>批单期间：{{item.startDate}} - {{item.endDate}}</span></p>
								<p><span class="mr20" v-if="item.issueDate">签单日期：{{item.issueDate}}</span><span v-if="item.endorsementsNo">批单号：<span class="col-blue cur-op"  @click="BatchDownload(item)">{{item.endorsementsNo}}</span></span></p>
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p>
									<span v-if="item.endorsementsMode=='01'">在线批单</span>
									<span v-if="item.endorsementsMode=='02'">线下批单</span>
									<span v-if="item.endorsementsMode=='03'">半线上批单</span>
								</p>
								<p>
									<span class="col-org" v-if="item.endorsementsType=='01'">一般性批改</span>
									<span class="col-org" v-if="item.endorsementsType=='03'">批增</span>
									<span class="col-org" v-if="item.endorsementsType=='02'">批减</span>
									<span class="col-org" v-if="item.endorsementsType=='04'">批退</span>
									<span class="col-org" v-if="item.endorsementsType=='10'">替换人员</span>
								</p>
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p>
									<span :class="[item.status=='04' || item.status=='06' || item.status=='99' ?'col-grey':'col-gre']">{{item.batchStatus}}</span> / 
									<span class="col-grey" v-if="item.payStatus == '01'">未支付</span>
									<span class="col-gre" v-if="item.payStatus == '02'">已支付</span>
									<span class="col-grey" v-if="item.payStatus == '03'">支付失败</span>
									<span class="col-grey" v-if="item.payStatus == '04'">线下支付</span>
								</p>
								<p v-if="item.batchPremium"><span class="col-red">￥{{item.batchPremium}}</span></p>
								<p v-else><span class="col-grey">￥{{item.batchPremium}}</span></p>
								<p><span class="col-red">保额：</span><span class="col-red">￥{{item.afterAmount}}</span></p>
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span>{{item.applyDate}}</span></p>
								<p v-if="item.operateName"><span>操作人：{{item.operateName}}</span></p>
							</div>
						</el-col>
						<el-col :span="5">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span>{{item.productName}}</span></p>
								<p><span>保单号：<span class="col-blue cur-op" @click="accessPolicyDetails(item)">{{item.insuranceNo}}</span></span></p>
							</div>
						</el-col>
						<el-col :span="2">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span class="col-blue cur-op" @click="seeDetail(item)">查看详情</span></p>
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
import product from './data/gzProductList.json';
import productClassification from './data/productClassification.json';
import ResourcesService from '../../service/ResourcesService.js'
import ProductService from '../../service/ProductService.js'
export default {
	data() {
		return {
			Elevator:new elevator(),
			publicConfiguration:new publicConfiguration(),
			ResourcesService:new ResourcesService(),
			ProductService: new ProductService(),
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
		if(window.localStorage.getItem('index') == '5'){
			this.gettingCache();
		}else{
			window.localStorage.removeItem('data');
			this.prerecordlist();
		}
	},
	methods: {
		async accessPolicyDetails(row){ // 电子保单
			let data = {
				"bizCodeType": "01",
				"policyNo":row.insuranceNo,
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
			let parmes = await this.Elevator.download_rider(row.applyNo);
			if(parmes.code =='0000'){
				await this.ResourcesService.downloadOrViewFile(parmes.data,true)
			} else {
				this.$message({
					message: '还没有电子批单！！！',
					type: 'warning'
				})
			}
		},
		types(){
			// this.options = productClassification.data;
			this.options1 = batchStatus.data;
			this.options2 = methodApplication.data;
			this.options3 = battenType.data;
			this.datas = JSON.parse(window.sessionStorage.getItem('list'));
			// if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
			// 	return;
			// }else{
			// 	for(var i=0;i<this.options.length;i++){
			// 		for(var j=0;j<this.options[i].children.length;j++){
			// 			this.options[i].children[j].disabled = true;
			// 			if(window.sessionStorage.getItem('branchCode') == this.options[i].children[j].branchCode || this.options[i].children[j].branchCode == 'JT0000'){
			// 				this.options[i].children[j].disabled = false;
			// 			};
			// 			if(window.sessionStorage.getItem('branchCode') == 'JT0167001' || window.sessionStorage.getItem('branchCode') == 'JT0113001'){
			// 				if(this.options[i].children[j].branchCode == 'JT0167001' || this.options[i].children[j].branchCode == 'JT0113001'){
			// 					this.options[i].children[j].disabled = false;
			// 				}
			// 			}
			// 		}
			// 	}
			// }
		},
		async prerecordlist(){
			var data = {};
			data = {
				'channelCode':'sequip',
				'endorseStatus':this.value3,
				'endorsementsType':this.value5,
				'issueDateStartTime':this.value6,
				'issueDateEndTime':this.value66,
				'pn':this.pageNum,
				'ps':this.pagesize,
				'productCode':this.value22,
				'queryConditions':this.value1,
				'userCode':'',
				'branchScope':window.sessionStorage.getItem('authDataInfo') ? window.sessionStorage.getItem('authDataInfo') == 'JT0000' ? '000000' : window.sessionStorage.getItem('authDataInfo') : window.sessionStorage.getItem('branchCode'),
				'branchCode':'',
				'endorsementMode':this.value4,
				'holderName': this.value7
			}
			let index = '5';
			window.localStorage.setItem('data',JSON.stringify(data));
			window.localStorage.setItem('index',index);
			let res = await this.Elevator.getapprovaldatalist(data);
			if(res.code == '0000'){
				this.data1 = res.list;
				this.total = res.total;
				for(var i=0;i<this.data1.length;i++){
					for(var j=0;j<product.data.length;j++){
						if(this.data1[i].productCode == product.data[j].productCode){
							this.data1[i].index = '1';
						}
					}
					for(var t=0;t<batchStatus.data.length;t++){
						if(this.data1[i].status == batchStatus.data[t].value){
							this.data1[i].batchStatus = batchStatus.data[t].label;
						}
					}
				}
			}
		},
		handleChange1(value){ // 获取选择的产品
			if(value){
				this.value21 = value[0];
				this.value22 = value[1];
			}else{
				this.value2 = [];
				this.value21 = '';
				this.value22 = "";
			}
		},
		gettingCache(){
			let data = JSON.parse(window.localStorage.getItem('data'));
			this.value1 = data.queryConditions;
			this.value2 = data.productCode;
			this.value3 = data.endorseStatus;
			this.value5 = data.endorsementsType;
			this.value6 = data.issueDate;
			this.value4 = data.endorsementMode;
			this.pageNum = data.pn;
			this.currentPage = data.pn;
			this.prerecordlist();
		},
		searchview(){
			this.pageNum = 1;
			this.currentPage = 1;
			this.prerecordlist();
		},
		empty(){
			this.value1='';
			this.value2='';
			this.value3='';
			this.value4='';
			this.value5='';
			this.value6='';
			this.value66='';
			this.value7 = '';
			this.pageNum = 1;
			this.currentPage = 1;
			this.prerecordlist();
		},
		handleCurrentChange: function(pageNum){
		    this.pageNum = pageNum;
			this.prerecordlist();
		},
		detailedList(row){
			this.$router.push({
				path:'/detailedList',
				query:{
					applyNo:row.applyNo
				}
			})
		},
		seeDetail(row) {
			this.$router.push({
				path:'/order/pd/endorsementDetail',
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
				path:'/order/endorsement/upload',
				query:{
					index:'2'
				}
			})
		},
		async exportData() {
			this.value6 ? this.value6 = this.value6 : this.value6 = '';
			if(this.value1 || this.value7 || this.value3 || this.value4 || this.value22 || this.value5 || this.value6 || this.value66 || this.total <= 50000) {
				let href = this.$apiUrl.EXPORTPDLIST;
				let branchScope = window.sessionStorage.getItem('branchCode') == 'JT0000' ? '000000' : window.sessionStorage.getItem('authDataInfo');
				href += '?pn=1&ps=50000&channelCode=sequip&endorseStatus=' + this.value3 + '&endorsementsType=' + this.value5 + '&issueDateStartTime=' + this.value6 + '&issueDateEndTime=' + this.value66 + '&productCode=' + this.value22 + '&queryConditions=' + this.value1 + '&branchScope=' + branchScope + '&endorsementMode=' + this.value4 + '&holderName=' + this.value7 + '&branchCode=&userCode=';
				this.ResourcesService.exportsViewFile(href)
				this.$logger.info(
				'M7-005','',
				{
					'userName':window.sessionStorage.getItem('userName'),
					'branchName':window.sessionStorage.getItem('branchName'),
					'total':this.total,
				}
			);
				this.trackEvent('统计','导出批单');
			} else {
				this.$message({
					message: '导出数据过大，为了不影响您的使用，请至少选择一个筛选项。',
					type: 'error'
				});
			}
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
		},
		async getProductList(){ // 获取产品列表
			if(this.options.length == 0) {
				let provinceCode = '';
				if(sessionStorage.getItem('branchCode') == 'JT0000'){
					provinceCode = ['000000']
				}else{
					provinceCode = sessionStorage.getItem('authDataArea').split(',')
				}
				let data = {
					'areaCodeList':provinceCode,
					'channel':'sequip',
					'pn':1,
					'ps':1000,
					'upOrDown':"0"
				};
				let res = await this.ProductService.getProductListV3(data);
				if(res.code == '0000' && res.list){
					res.list.forEach(item => {
						let obj = {
							code: item.code,
							name: item.name,
							productCategory1: item.attrInfoDTOList.find(i => i.attrCode == 'productSort') ? item.attrInfoDTOList.find(i => i.attrCode == 'productSort').attrDTOList[0].valueMark : ''
						}
						this.options.push(obj);
					})
				}
			}
		},
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
				width: 25%;
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
	.cur-op {
		cursor: pointer;
	}
}
</style>
