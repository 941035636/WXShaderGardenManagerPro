<template>
	<div class="employerPolicy" id="employerPolicy">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div>
					<el-select v-model="data.type" placeholder="请选择" class="item1" clearable>
						<el-option v-for="item in options" :key="item.productCode" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-input placeholder="请输入" v-model.trim="data.policyNo" class="item2" clearable v-if="data.type == '2'"></el-input>
					<el-input placeholder="请输入" v-model.trim="data.appCode" class="item2" clearable v-else></el-input>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item3">投保人</span>
					<el-input
						v-model="data.holderName"
						placeholder="请输入内容"
						class="item2"
						clearable
					></el-input>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item3">被保人</span>
					<el-input
						v-model="data.insuredName"
						placeholder="请输入内容"
						class="item2"
						clearable
					></el-input>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div>
					<span class="item3">合作渠道</span>
					<el-select v-model="data.state" placeholder="请选择渠道" class="item2" clearable>
						<el-option v-for="item in optionsQD" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item3">地区</span>
					<el-cascader :options="options2" placeholder="请选择" change-on-select v-model="regionCoding" class="item2" clearable></el-cascader>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item3">订单状态</span>
					<el-select v-model="data.applicationStatus" placeholder="请选择订单状态" class="item2" clearable>
						<el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.applicationStatus"></el-option>
					</el-select>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="16"><div>
					<el-select v-model="data.types" placeholder="请选择" class="item4" clearable>
						<el-option v-for="item in options8" :key="item.productCode" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-date-picker v-if="data.types == '1'" v-model="data.applicationStartDate" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
					<el-date-picker v-else v-model="data.polStartDateFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
					<span>--</span>
					<el-date-picker v-if="data.types == '1'" v-model="data.applicationEndDate" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
					<el-date-picker v-else v-model="data.polStartDateEnd" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
				</div></el-col>
				<el-col :span="8"><div>
					<el-button @click="empty" icon="el-icon-delete" round class="empty-button">清空条件</el-button>
					<el-button type="warning" @click="searchview" round class="query-button">查询</el-button>
				</div></el-col>
			</el-row>
		</div>
		<div class="content">
			<div class="content-table">
				<!-- <div class="content-title">
					<span class="title1">订单信息</span>
					<span class="title2">日期</span>
					<span class="title3">保费（元）</span>
					<span class="title5">联系人</span>
					<span class="title6">操作</span>
				</div> -->
				<div class="table" v-for="(row,index) in data1" :key="index">
					<div class="table-title">
						<span>订单号：{{row.orderCode}}</span>
						<span class="fr">{{row.underWriteCompany}}</span>
					</div>
					<div class="table-data">
						<div class="title1 data-item">
							<div class="centered-block">
								<p class="color-gray-3 f14 fb">{{row.productName}}</p>
								<p class="color-gray-3 f14 lh30">
									<span> 投保人：</span>{{row.holderName}}
								</p>
								<p class="color-gray-3 f14 lh30">
									<span> 被保人：</span>{{row.insuredName}}
								</p>
								<p class="color-gray-3 f14 lh30">
									<span> 投保单号：</span><span>{{row.appCode}}</span>
								</p>
								<p class="color-gray-3 f14 lh30" v-if="row.policyNo">
									<span> 保单号：</span><span class="font-colo" @click="accessPolicyDetails(row)">{{row.policyNo}}</span>
								</p>
								<!-- <p class="color-gray-3 f14 lh30">
									<span> 地区：</span>{{row.pName}}/{{row.cName}}/{{row.aName}}
								</p> -->
							</div>
						</div>
						<div class="title2 data-item">
							<div class="centered-block">
								<p class="color-gray-3 f14 mb10 text-center">投保日期：{{row.appStartDate}}</p>
								<p class="color-gray-3 f14 fle" style="justify-content:center;">
									<span style="display:block;"> 保险期间：</span>{{row.polStartDate}}<br/>{{row.polEndDate}}
								</p>
							</div>
						</div>
						<div class="title3 data-item">
							<div class="centered-block text-center">
								<p class="color-gray-3 f14 lh30">{{row.applicationStatusName}}</p>
								<p class="color-gray-3 f14 lh30">保费：￥{{row.prem}}</p>
								<p class="color-gray-3 f14 lh30">{{row.financeStatus == '01' ? '已支付' : row.financeStatus == '00' ? '未支付' : ''}}</p>
							</div>
						</div>
						<div class="title5 data-item">
							<div class="centered-block">
								<p class="color-gray-3 f14 lh30">医疗渠道</p>
								<p class="color-gray-3 f14 lh30"><span>推广人：</span>{{row.agentName}}</p>
								<p class="color-gray-3 f14 lh30"><span>推广人工号：</span>{{row.smsAgentCode}}</p>
							</div>
						</div>
						<div class="title6 data-item">
							<div class="state-item">
								<div class="centered-block text-center">
									<p class="font-colo f14 lh30" @click="enquirydetails(row)">查看详情</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
	</div>
</template>

<script>
import product from './data/gzProductList.json';
import NumberType from '../../../static/data/NumberType.json';
import policyStatus from '../../../static/data/policyStatus.json';
import paymentStatus from '../../../static/data/paymentStatus.json';
import onlineProducts from '../../../static/data/onlineProducts.json';
import placeSinglechannel from '../../../static/data/placeSinglechannel.json';
import buttonNone from '../../../static/data/buttonNone.json'

import buttonSelection from './js/buttonSelection.js';
import {elevator} from '../../server/accidenServer.js';
import UserService from '../../service/UserService';
import ResourcesService from '../../service/ResourcesService';
import moment from 'moment';
import CorrectionManagement from '../../service/CorrectionManagement.js';
import revisionPremiumDialog from './revisionPremiumDialog.vue'
import revisionPremiumYinZi from './revisionPremiumYinZi.vue'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
	computed: {
		...mapGetters('userInfo', {
			userInfoStore: 'renderUserInfo'
		})
	},
	components:{
		revisionPremiumDialog,revisionPremiumYinZi
	},
	data() {
		return {
			Elevator:new elevator(),
			ButtonSelection:new buttonSelection(),
			ResourcesService:new ResourcesService(),
			UserService: new UserService(),
			CorrectionManagement: new CorrectionManagement(),
			buttonNoneData:buttonNone,
			data:{
				"type":'',
				"types":'',
				"agentChannelCode": "",//推广人渠道
				"agentName": "",//推广人姓名 
				"agentPracticeNo": "",//执业证书编号
				"appCode": "",//投保单号 
				"appFormInvalid": "",//投保单失效 Y 
				"applicationEndDate": "",//投保止期 
				"applicationStartDate": "",//投保起期
				"applicationStatus": "",//投保单状态 
				"bnfyOption": "",//受益人选项 
				"cityCode": "",//市编码
				"countyCode": "",//县编码
				"financeStatus": "",//支付状态 
				"holderName": "",//投保人名称 
				"holderNameEncryption": "",//投保人加密名称
				"immediateEffect": "",//即时生效 Y / N ,
				"insuredName": "",//被保人名称 ,
				"insuredNameEncryption": "",//被保人加密名称
				"issueStatus": "",//出单状态
				"linkTel": "",//投保人电话
				"linkTelEncryption": "",//投保人加密电话
				"medicalBranchLevel": "",//医疗机构等级
				"orderCode": "",//订单号
				"partnerSource": "YLQD269",//合作来源 
				"physician": "",//医师
				"planCode": "",//方案编码
				"pn": 1,
				"polEndDateEnd": "",//保险止期查询止期 
				"polEndDateFrom": "",//保险止期查询起期
				"polStartDateEnd": "",//保险起期查询止期 
				"polStartDateFrom": "",//保险起期查询起期
				"policyNo": "",//保单号
				"policyStatus": "",//保单状态 
				"productCode": "",//产品编码
				"promotionChannel": "",//推广渠道
				"provinceCode": "",//省编码 
				"ps": 10,
				"smsAgentCode": '',//工号 
				"underWriteCompany": "",//承保公司
				"userCode": ""//投保人编码
			},
			options:[
				{
					"value":"1",
					"label":"投保单号"
				},
				{
					"value":"2",
					"label":"保单号"
				}
			],
			optionsQD: [
				{
					"value":"1",
					"label":"医疗渠道"
				}
			],
			options2:[],
			regionCoding:[],//选择的地区
			options4:[],
			options7:[
				{
					'value':'00',
					'label':'PC'
				},
				{
					'value':'01',
					'label':'APP'
				}
			],
			options8:[
				{
					'value':'1',
					'label':'投保日期'
				},
				{
					'value':'3',
					'label':'保险起期'
				}
			],
			options9:[],
			regionCoding:[],
			data1:[],
			datas:[],
			data2:{},
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			exhibition:false,
			appFormCode:'',
			policyHolderName:'',
			mailbox:'',
			dialogVisible:false,
			totalEquipmentCount:0,
			totalPrem:0,
		}
	},
	created(){
		this.policyStatu();
		this.getArea();
		this.policylist();
	},
	methods: {
		policyStatu(){ //根据权限获取配置文件
			this.options4 = policyStatus.medData;
		},
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.options2 = this.ButtonSelection.Accessarea(parmes.data, window.sessionStorage.getItem('provinceCode'));
				// this.setPName();
			};
		},
		setPName() {
			this.data1.forEach(item =>{
				item.pNmat = this.options2.find(i => i.value == item.provinceCode).label
				item.cNmat = this.options2.find(i => i.value == item.provinceCode).children.find(c => c.value == item.cityCode).label
				item.aNmat = this.options2.find(i => i.value == item.provinceCode).children.find(c => c.value == item.cityCode).children.find(a => a.value == item.countyCode).label
			});
		},
		async policylist(){ // 获取投保单列表
			if(window.sessionStorage.getItem('branchCode') == 'JT0000') {
				this.data.smsAgentCode = '';
			} else {
				this.data.smsAgentCode =  this.userInfoStore.staffNo;
			}
			this.data.pn = this.pageNum;
			if(this.data.type == '1'){
				this.data.appCode = this.data.appCode;
				this.data.policyNo = '';
				this.data.orderCode = '';
			}else if(this.data.type == '2'){
				this.data.policyNo = this.data.policyNo;
				this.data.appCode = '';
				this.data.orderCode = '';
			}else{
				this.data.appCode = '';
				this.data.policyNo = '';
			}
			if(this.regionCoding.length == 1){
				this.data.provinceCode = this.regionCoding[0];
				this.data.cityCode = '';
				this.data.countryCode = '';
			}else if(this.regionCoding.length == 2){
				this.data.provinceCode = this.regionCoding[0];
				this.data.cityCode = this.regionCoding[1];
				this.data.countryCode = '';
			}else if(this.regionCoding.length == 3){
				this.data.provinceCode = this.regionCoding[0];
				this.data.cityCode = this.regionCoding[1];
				this.data.countryCode = this.regionCoding[2];
			}else{
				this.data.provinceCode = '';
				this.data.cityCode = '';
				this.data.countryCode = '';
			};
			if(this.data.types == '1'){
				if(!this.data.applicationStartDate || !this.data.applicationEndDate){
					this.$message({
						message: '请选择投保日期时间段',
						type: 'warning'
					});
					return;
				}
				this.data.applicationStartDate = moment(this.data.applicationStartDate).format('YYYY-MM-DD 00:00:00');
				this.data.applicationEndDate = moment(this.data.applicationEndDate).format('YYYY-MM-DD 23:59:59');
				this.data.polStartDateFrom = '';
				this.data.polStartDateEnd = '';
			}else if(this.data.types == '3'){
				this.data.applicationStartDate = '';
				this.data.applicationEndDate = '';
				this.data.polStartDateFrom = this.data.polStartDateFrom ? moment(this.data.polStartDateFrom).format('YYYY-MM-DD 00:00:00') : '';
				this.data.polStartDateEnd = this.data.polStartDateEnd ? moment(this.data.polStartDateEnd).format('YYYY-MM-DD 23:59:59') : '';
			} else {
				this.data.applicationStartDate = '';
				this.data.applicationEndDate = '';
				this.data.polStartDateFrom = '';
				this.data.polStartDateEnd = '';
			}
			let res = await this.Elevator.searchComAppList(this.data);
			if(res.code == '0000'){
				this.total = res.total;
				if(this.total){
					res.list.forEach(item =>{
						item.applicationStatusName = this.options4.find(subItem => subItem.applicationStatus == item.applicationStatus).label;
						item.totals = item.total;
						// item.pNmat = this.options2.find(i => i.value == item.provinceCode) ? this.options2.find(i => i.value == item.provinceCode).label :''
						// item.cNmat = this.options2.find(i => i.value == item.provinceCode) ? this.options2.find(i => i.value == item.provinceCode).children.find(c => c.value == item.cityCode).label :''
						// item.aNmat = this.options2.find(i => i.value == item.provinceCode) ? this.options2.find(i => i.value == item.provinceCode).children.find(c => c.value == item.cityCode).children.find(a => a.value == item.countyCode).label : ''
					});
					// if(!this.options2.length) {
					// 	this.setPName();
					// }
					this.data1 = res.list;
				} else {
					this.data1 = [];
				}
			}
		},
		empty(){ //清空
			this.data = {
				"type":'',
				"types":'',
				"agentChannelCode": "",//推广人渠道
				"agentName": "",//推广人姓名 
				"agentPracticeNo": "",//执业证书编号
				"appCode": "",//投保单号 
				"appFormInvalid": "",//投保单失效 Y 
				"applicationEndDate": "",//投保止期 
				"applicationStartDate": "",//投保起期
				"applicationStatus": "",//投保单状态 
				"bnfyOption": "",//受益人选项 
				"cityCode": "",//市编码
				"countyCode": "",//县编码
				"financeStatus": "",//支付状态 
				"holderName": "",//投保人名称 
				"holderNameEncryption": "",//投保人加密名称
				"immediateEffect": "",//即时生效 Y / N ,
				"insuredName": "",//被保人名称 ,
				"insuredNameEncryption": "",//被保人加密名称
				"issueStatus": "",//出单状态
				"linkTel": "",//投保人电话
				"linkTelEncryption": "",//投保人加密电话
				"medicalBranchLevel": "",//医疗机构等级
				"orderCode": "",//订单号
				"partnerSource": "YLQD269",//合作来源 
				"physician": "",//医师
				"planCode": "",//方案编码
				"pn": 1,
				"polEndDateEnd": "",//保险止期查询止期 
				"polEndDateFrom": "",//保险止期查询起期
				"polStartDateEnd": "",//保险起期查询止期 
				"polStartDateFrom": "",//保险起期查询起期
				"policyNo": "",//保单号
				"policyStatus": "",//保单状态 
				"productCode": "",//产品编码
				"promotionChannel": "",//推广渠道
				"provinceCode": "",//省编码 
				"ps": 10,
				"smsAgentCode": '',//工号 
				"underWriteCompany": "",//承保公司
				"userCode": ""//投保人编码
			};
			this.regionCoding = [];
			this.pageNum = 1;
			this.currentPage = 1;
			this.policylist();
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.policylist();
		},
		getDetailsPolicy(row){	// 投保单详情
			let { href } = this.$router.resolve({
				path:'/policyTemplate',
				query:{
					"appCode":row.appCode
				}
			})
			window.open(href,"_blank" )
		},
		async userInformation(row){ //用户信息
			let data = {
				"appCode":row.appFormCode
			};
			const parmes = await this.Elevator.getappdetails(data);
			if(parmes.code == '0000'){
				this.$router.push({
					path:'/account/company/edit',
					query:{
						userCode:parmes.data.holder.holderCode
					}
				})
			}
		},
		async accessPolicyDetails(row){ // 电子保单
			let data = {
                "bizCodeType": "01",
                "appCode":row.appFormCode,
                "resCode": "A002"
            }
			const parmes = await this.Elevator.getResourcesID(data);
			if(parmes.code =='0000'){
				if(parmes.list && parmes.list.length != 0){
					let res = await this.ResourcesService.downloadOrViewFile(parmes.list[0].fileUrl,true)
				}else{
					this.$message({
						message: '还没有电子保单！！！',
						type: 'warning'
					});
				}
			}
		},
		enquirydetails(row){ //查看详情
			let routeData = this.$router.resolve({
				path:'/order/detail',
				query:{
					orderCode:row.orderCode,
					appCode:row.appCode,
					orderStatusName:row.applicationStatusName,
					typeYM:true
				}
			})
			window.open(routeData.href, '_blank');
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.policylist();
		},
		 handleSelect(item) {
			console.log(item);
		},
	},
}
</script>

<style lang="less">
#employerPolicy {
	padding-bottom: 80px;
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
			.item1{
				width: 35%;
				margin-right: 10px;
			}
			.item2{
				width: 60%;
			}
			.item3{
				display: inline-block;
				width: 35%;
				text-align: right;
				font-size: 16px;
				color: #666666;
				margin-right: 10px;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.item4{
				width: 18%;
				margin-right: 10px;
			}
			.item5{
				width: 30%;
			}
			.query-button{
				width: 100px;
				height: 44px;
				float: right;
				font-weight: 600;
			}
			.empty-button{
				width: 130px;
				height: 44px;
				float: right;
				margin-left: 30px;
				background-color: #DCDCDC;
				color: #333333;
				font-weight: 600;
			}
		}
	}
	.content{
		width: calc(100% - 40px);
		margin: 20px 20px 0;
		background-color: #ffffff;
		.content1{
			width: 100%;
			height: 69px;
			line-height: 69px;
			padding-left: 20px;
			box-sizing: border-box;
			.content1-num{
				font-size: 18px;
				color: #999999;
			}
			.content1-exports{
				float: right;
				margin-right: 20px;
				color: #DB9728;
				font-size: 18px;
				cursor: pointer;
				img{
					width: 28px;
					height: 28px;
					vertical-align: middle;
				}
			}
		}
		.content-table{
			width: 100%;
			padding: 10px 20px 30px;
			box-sizing: border-box;
			.content-title{
				width: 100%;
				height: 60px;
				line-height: 60px;
				border: 1px solid #F1EEE9;
				box-sizing: border-box;
				color: #666666;
				font-size: 16px;
				font-weight: 600;
				display: flex;
				span{
					display: block;
					text-align: center;
				}
				.title1{
					width: 30%;
				}
				.title2{
					width: 20%;
				}
				.title3{
					width: 12%;
				}
				.title5{
					width: 15%;
				}
				.title6{
					width: 10%;
				}
			}
			.table{
				width: 100%;
				border: 1px solid #F1EEE9;
				box-sizing: border-box;
				.table-title{
					width: 100%;
					height: 40px;
					line-height: 40px;
					background-color: #F1EEE9;
					padding-left: 20px;
					box-sizing: border-box;
					span{
						margin-right: 37px;
					}
				}
				.table-data{
					width: 100%;
					min-height: 300px;
					display: flex;
					.title1{
						width: 30%;
						min-height: 100%;
						position: relative;
					}
					.title2{
						width: 20%;
						min-height: 100%;
						position: relative;
					}
					.title3{
						width: 12%;
						min-height: 100%;
						position: relative;
					}
					.title5{
						width: 15%;
						min-height: 100%;
						position: relative;
					}
					.title6{
						width: 10%;
						min-height: 100%;
						position: relative;
					}
					.data-item{
						padding: 16px 10px;
						box-sizing: border-box;
						border-right: 1px solid #F1EEE9;
						box-sizing: border-box;
						.new-insurance{
							display: inline-block;
							width: 50px;
							height: 26px;
							border: 1px solid #C9984A;
							background-color: #FCEDD5;
							box-sizing: border-box;
							margin-left: 20px;
							color: #C9984A;
							font-size: 12px;
							text-align: center;
							line-height: 24px;
							border-radius:2px;
						}
						.font-colo{
							color: #1E90FF;
							text-decoration: underline;
							cursor: pointer;
						}
						.font-colo1{
							color: #1E90FF;
						}
						.centered-block{
							width: calc(100% - 10px);
							position:absolute;
							top:50%;
							transform:translate(0,-50%);
						}
					}
					.data-item:last-child{
						border-right: 0;
					}
				}
			}
		}
	}
	.content-total{
		width: calc(100% - 50px);
		margin: 30px 30px 0 20px;
		height: 60px;
		line-height: 60px;
		text-align: right;
	}
	.item11{
		display: flex;
		height: 40px;
		line-height: 40px;
		margin-bottom: 20px;
		.item12{
			width: 25%;
			text-align: right;
			padding-right: 15px;
			box-sizing: border-box;
		}
		.item13{
			width: 65%;
		}
	}
}
</style>
