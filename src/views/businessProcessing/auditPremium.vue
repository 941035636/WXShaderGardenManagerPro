<template>
	<div class="auditPremium" id="auditPremium">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="7"><div>
					<span class="item3">投保单号</span>
					<el-input placeholder="请输入" v-model.trim="data.appCode" class="item2" clearable></el-input>
				</div></el-col>
				<el-col :span="7"><div>
					<span class="item3">投保人</span>
					<el-input placeholder="请输入投保人名称" v-model.trim="data.holderName" class="item2" clearable></el-input>
				</div></el-col>
				<el-col :span="2"></el-col>
				<el-col :span="16"><div>
					<el-select v-model="data.types" placeholder="请选择" class="item4" clearable>
						<el-option v-for="item in options8" :key="item.productCode" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-date-picker v-if="data.types == '1'" v-model="data.appStartFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
					<el-date-picker v-else v-model="data.polStartFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
					<span>--</span>
					<el-date-picker v-if="data.types == '1'" v-model="data.appStartEnd" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
					<el-date-picker v-else v-model="data.polStartEnd" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="24"><div>
					<el-button @click="empty" icon="el-icon-delete" round class="empty-button">清空条件</el-button>
					<el-button type="warning" @click="searchview" round class="query-button">查询</el-button>
				</div></el-col>
			</el-row>
		</div>
		<div class="content">
			<div class="content-table">
				<div class="table" v-for="(row,index) in data1" :key="index">
					<div class="table-title">
						<span>订单号：{{row.orderCode}}</span>
					</div>
					<div class="table-data">
						<div class="title0 data-item">
							<div class="centered-block">
								<p class="color-gray-3 f14 fb">{{row.productName}}<span class="new-insurance" v-if="row.renewal=='N'">新保</span><span class="new-insurance" v-if="row.renewal=='Y'">续保</span></p>
								<p class="color-gray-3 f14 lh30" v-if="datas.find(item => item.key == '10036')">
									<span> 投保人：</span><span class="font-colo" @click="userInformation(row)">{{row.policyHolderName}}</span>
								</p>
								<p class="color-gray-3 f14 lh30" v-else>
									<span> 投保人：</span>{{row.policyHolderName}}
								</p>
								<p class="color-gray-3 f14 lh30">投保日期：{{row.createDate}}  <span style="margin-left:230px;"> 投保单号：</span><span class="font-colo" @click="getDetailsPolicy(row)">{{row.appFormCode}}</span></p>
								<p class="color-gray-3 f14 lh30" style="justify-content:center;">
									<span> 保险期间：</span>{{row.startDate}} 至 {{row.endDate}}
								</p>
							</div>
						</div>
						<div class="title2 data-item">
							<div class="centered-block text-center">
								<p class="color-gray-3 f14 lh30">应付：<span class="fb" style="color:#FF4D24;">￥{{row.afterPrem}}</span></p>
							</div>
						</div>
						<div class="title2 data-item">
							<div class="state-item">
								<div class="centered-block text-center">
									<p class="font-colo f14 lh30" @click="premium(row)" v-if="datas.find(item => item.key == '10041') ">审核保费</p>
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
		<el-dialog title="提示" :visible.sync="exhibition" width="30%">
			<p class="item11"><span class="item12">投保单号</span><el-input class="item13" v-model="appFormCode" disabled></el-input></p>
			<p class="item11"><span class="item12">下发用户</span><el-input class="item13" v-model="policyHolderName" disabled></el-input></p>
			<p class="item11"><span class="item12">下发邮箱</span><el-input class="item13" type="email" v-model="mailbox"></el-input></p>
			<span slot="footer" class="dialog-footer">
			<el-button @click="exhibition = false">取 消</el-button>
			<el-button type="primary" @click="paymentnotices">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog
		title="报错报文"
		:visible.sync="dialogVisible"
		width="40%">
		<span>{{data2}}</span>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		</span>
		</el-dialog>
	</div>
</template>

<script>
import product from './data/dtProductList.json';
import NumberType from '../../../static/data/NumberType.json';
import policyStatus from '../../../static/data/policyStatus.json';
import paymentStatus from '../../../static/data/paymentStatus.json';
import onlineProducts from '../../../static/data/onlineProducts.json';
import placeSinglechannel from '../../../static/data/placeSinglechannel.json'

import {elevator} from '../../server/accidenServer.js';
import ResourcesService from '../../service/ResourcesService';
import buttonSelection from './js/buttonSelection.js';
import moment from 'moment';
export default {
	data() {
		return {
			Elevator:new elevator(),
			ButtonSelection:new buttonSelection(),
			ResourcesService: new ResourcesService(),
			data:{
				"userCode":window.sessionStorage.getItem('userCode'),
				"pn":1,
				"ps":10,
				'type':'1',
				"appCode":'',//投保单号
				"policyNo":'',//保单号
				"orderCode":'',//订单号
				"holderName":'',//投保人名称
				"productCode":'',//产品编码
				"provinceCode":'',//省编码
				"cityCode":'',//市编码
				"countryCode":'',//区编码
				"state":9,//投保单状态
				"financeStatus":'',//支付状态
				"payType":'',//支付方式
				"source":'',//下单渠道
				"types":'',
				"appStartFrom":'',//投保日期查询起期
				"appStartEnd":'',//投保日期查询止期
				"issueDateStart":'',//出单日期开始
				"issueDateEnd":'',//出单日期结束
				"productCategory1":"",
				"polStartFrom":'',
				"polStartEnd":''
			},
			options:[],
			options3:[],
			options2:[],
			regionCoding:[],//选择的地区
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
			data1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			exhibition:false,
			appFormCode:'',
			policyHolderName:'',
			mailbox:'',
			datas:[],
			dialogVisible:false,
			data2:{},
			totalEquipmentCount:0,
			totalPrem:0,
		}
	},
	created(){
		this.policyStatu();
		// this.getArea();
		if(window.localStorage.getItem('index') == '20' && window.localStorage.getItem('data')){
			this.gettingCache();
		}else{
			window.localStorage.removeItem('data');
			this.policylist();
		}
	},
	methods: {
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.options2 = this.ButtonSelection.Accessarea(parmes.data, window.sessionStorage.getItem('provinceCode'));
			};
		},
		policyStatu(){ //根据权限获取配置文件
			this.options = NumberType.data;
			var options3 = product.data;
			this.datas = JSON.parse(window.sessionStorage.getItem('list'));
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				this.options3 = options3;
			}else{
				for(var i=0;i<options3.length;i++){
					if(window.sessionStorage.getItem('branchCode') == options3[i].branchCode){
						this.options3.push(options3[i]);
					};
					if(window.sessionStorage.getItem('branchCode') == 'JT0167001' || window.sessionStorage.getItem('branchCode') == 'JT0113001'){
						if(options3[i].branchCode == 'JT0167001' || options3[i].branchCode == 'JT0113001'){
							this.options3.push(options3[i]);
						}
					}
				}
			};
		},
		async policylist(){ // 获取投保单列表
			this.data.pn = this.pageNum;
			if(this.data.type == '1'){
				this.data.appCode = this.data.appCode;
				this.data.policyNo = '';
				this.data.orderCode = '';
			}else if(this.data.type == '2'){
				this.data.policyNo = this.data.policyNo;
				this.data.appCode = '';
				this.data.orderCode = '';
			}else if(this.data.type == '3'){
				this.data.orderCode = this.data.orderCode;
				this.data.appCode = '';
				this.data.policyNo = '';
			}else{
				this.data.appCode = '';
				this.data.policyNo = '';
				this.data.orderCode = '';
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
				if(!this.data.appStartFrom || !this.data.appStartEnd){
					this.$message({
						message: '请选择投保日期时间段',
						type: 'warning'
					});
					return;
				}	
				this.data.appStartFrom = moment(this.data.appStartFrom).format('YYYY-MM-DD 00:00:00');
				this.data.appStartEnd = moment(this.data.appStartEnd).format('YYYY-MM-DD 23:59:59');
				this.data.polStartEnd = '';
				this.data.polStartFrom = '';
				this.data.issueDateStart = '';
				this.data.issueDateEnd = '';
			}else if(this.data.types == '2'){
				if(!this.data.issueDateStart || !this.data.issueDateEnd){
					this.$message({
						message: '请选择出单日期时间段',
						type: 'warning'
					});
					return;
				}
				this.data.issueDateStart = moment(this.data.issueDateStart).format('YYYY-MM-DD 00:00:00');
				this.data.issueDateEnd = moment(this.data.issueDateEnd).format('YYYY-MM-DD 23:59:59');
				this.data.appStartFrom = '';
				this.data.appStartEnd = '';
				this.data.polStartFrom = '';
				this.data.polStartEnd = '';
			}else if(this.data.types == '3'){
				if(!this.data.polStartFrom || !this.data.polStartEnd){
					this.$message({
						message: '请选择保险起期时间段',
						type: 'warning'
					});
					return;
				}
				this.data.appStartFrom = '';
				this.data.appStartEnd = '';
				this.data.issueDateStart = '';
				this.data.issueDateEnd = '';
				this.data.polStartFrom = moment(this.data.polStartFrom).format('YYYY-MM-DD 00:00:00');
				this.data.polStartEnd = moment(this.data.polStartEnd).format('YYYY-MM-DD 23:59:59');
			} else {
				this.data.appStartFrom = '';
				this.data.appStartEnd = '';
				this.data.issueDateStart = '';
				this.data.issueDateEnd = '';
				this.data.polStartFrom = '';
				this.data.polStartEnd = '';
			}
			let index = '20';
			window.localStorage.setItem('data',JSON.stringify(this.data));
			window.localStorage.setItem('index',index);
			let res = await this.Elevator.searchAppList(this.data);
			if(res.code == '0000'){
				this.data1 = res.list;
				this.total = res.total;
				if(this.total){
					this.data1.forEach(item =>{
						policyStatus.data.forEach(ele =>{
							if(item.state == ele.state){
								item.appStatus = ele.label;
							}
						})
						onlineProducts.data.forEach(eles =>{
							if(item.productCode == eles.productCode){
								item.productCodes = '1';
							}
						
						});
						item.region = item.provinceName + (item.cityName ? item.cityName : '') + (item.countyName ? item.countyName : '');
						item.afterPrem = item.afterPrem.toFixed(2);
						if(item.actualPrem){
							item.actualPrem = item.actualPrem.toFixed(2);
						}
						item.totals = item.total;
					})
				}
			}
		},
		gettingCache(){ //获取缓存查询条件
			let data = JSON.parse(window.localStorage.getItem('data'));
			this.data = data;
			if(data.provinceCode){
				this.regionCoding.push(data.provinceCode);
			};
			if(data.cityCode){
				this.regionCoding.push(data.cityCode);
			};
			if(data.countryCode){
				this.regionCoding.push(data.countryCode);
			};
			this.pageNum = data.pn;
			this.currentPage = data.pn;
			this.policylist();
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.policylist();
		},
		empty(){ //清空
			this.data = {
				"userCode":window.sessionStorage.getItem('userCode'),
				"pn":1,
				"ps":10,
				'type':'1',
				"appCode":'',//投保单号
				"policyNo":'',//保单号
				"orderCode":'',//订单号
				"holderName":'',//投保人名称
				"productCode":'',//产品编码
				"provinceCode":'',//省编码
				"cityCode":'',//市编码
				"countryCode":'',//区编码
				"state":9,//投保单状态
				"financeStatus":'',//支付状态
				"payType":'',//支付方式
				"source":'',//下单渠道
				"types":'',
				"appStartFrom":'',//投保日期查询起期
				"appStartEnd":'',//投保日期查询止期
				"issueDateStart":'',//出单日期开始
				"issueDateEnd":'',//出单日期结束
				"productCategory1":"",
				"polStartFrom":'',
				"polStartEnd":''
			};
			this.regionCoding = [];
			this.pageNum = 1;
			this.currentPage = 1;
			this.policylist();
		},
		async getDetailsPolicy(row){	// 投保单详情
			let { href } = this.$router.resolve({
				path:'/policyTemplate',
				query:{
					"appCode":row.appFormCode
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
					path:'/account/company/detail',
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
			// const parmes = await this.Elevator.getappid(data);
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
		async reasonsFailure(row){//报错原因
			let res = await this.Elevator.getReasonsFailure(row.appFormCode);
			if(res.code == '0000'){
				this.$message({
					dangerouslyUseHTMLString: true,
					message: res.data
				});
			}
		},
		async missMessage(row){//报错报文
			let res = await this.Elevator.failurePacket(row.appFormCode);
			if(res.code == '0000'){
				this.data2 = res.data;
				this.dialogVisible = true;
			}
		},
		async isPuah(row){ // 出单重推
			product.data.forEach(item =>{
				if(item.productCode == row.productCode){
					row.code = item.code
				}
			})
			let data = {
				"applicationFormCode": row.appFormCode,
  				"companyCode": row.code
			}
			let res = await this.Elevator.ispush(data);
			if(res.code == '0000'){
				this.$message({
					message: '重推成功',
					type: 'success'
				});
				this.policylist();
			}
		},
		enquirydetails(row){ //查看详情
			let routeData = this.$router.resolve({
				path:'/order/detail',
				query:{
					orderCode:row.orderCode,
					appCode:row.appFormCode,
					orderStatusName:row.appStatus
				}
			});
			window.open(routeData.href, '_blank');
		},
		relation(row){ //设备清单
			let routeData = this.$router.resolve({
				path:'/order/object/list',
				query:{
					appCode:row.appFormCode,
					index:'1',
					applicationStatus:row.applicationStatus,
					productCode:row.productCode
				}
			})
			window.open(routeData.href, '_blank');
		},
		premium(row){ // 修改保费
			let path = ''; 
			if(row.productCategory1 == 'dt') {
				path = '/order/premium/dqedit'
			} else if(row.productCategory1 == 'gz') {
				path = '/order/premium/edit';
			}
			let routeData = this.$router.resolve({
				path: path,
				query:{
					orderCode:row.orderCode,
					appCode:row.appFormCode,
					startDate:row.startDate,
					endDate:row.endDate,
				}
			})
			window.open(routeData.href, '_blank');
		},
		paymentnotice(row){ // 发支付通知
			this.appFormCode = row.appFormCode;
			this.policyHolderName = row.policyHolderName;
			this.certificationmailbox(row.appFormCode);
			this.exhibition = true;
		},
		async certificationmailbox(appFormCode){// 发支付通知
			let data = {
				"appCode":appFormCode
			};
			let res = await this.Elevator.getappdetails(data);
			if(res.code == '0000'){
				this.certificationmailboxs(res.data.holder.holderCode);
			}
		},
		async certificationmailboxs(usercode){// 发支付通知
			let channelNo = 'sequip';
			let res = await this.Elevator.getauthsequip(usercode,channelNo);
			if(res.code == '0000'){
				this.mailbox = res.data.custOrganizationElementList.find(item => item.elementCode == 'linkManEmil').elementValues;
			}
		},
		async paymentnotices(){// 发支付通知
			let res = await this.Elevator.paymentnotice(this.mailbox,this.appFormCode);
			if(res.code == '0000'){
				this.exhibition = false;
				this.$message({
					message: '发送成功',
					type: 'success'
				});
			}
		},
		identification(row){ //到账确认
			let routeData = this.$router.resolve({
				path:'/order/premium/confirm',
				query:{
					appCode:row.appFormCode
				}
			})
			window.open(routeData.href, '_blank');
		},
		policyupload(row){ //保单上传
			this.$router.push({
				path:'/order/policy/upload',
				query:{
					appCode:row.appFormCode
				}
			})
		},
		endorsements(row){ //批单补录
			this.$router.push({
				path:'/order/endorsement/upload1',
				query:{
					policyNo:row.policyNo,
					index:'',
				}
			})
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.policylist();
		},
	},
}
</script>

<style lang="less" scoped>
#auditPremium {
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
		padding-top: 20px;
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
			padding: 0 20px 30px;
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
				.title0{
					width: 50%;
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
				.title4{
					width: 13%;
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
					min-height: 200px;
					display: flex;
					.title0{
						padding-left: 2%;
						width: 50%;
						min-height: 100%;
						position: relative;
					}
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
					.title4{
						width: 13%;
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
						// padding: 16px 20px;
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
