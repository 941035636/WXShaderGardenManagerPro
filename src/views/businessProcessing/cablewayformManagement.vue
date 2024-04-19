<template>
	<div class="employerPolicy" id="employerPolicy">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div>
					<el-select v-model="data.type" placeholder="请选择" class="item1" clearable>
						<el-option v-for="item in options" :key="item.productCode" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-input placeholder="请输入" v-model.trim="data.policyNo" class="item2" clearable v-if="data.type == '2'"></el-input>
					<el-input placeholder="请输入" v-model.trim="data.orderCode" class="item2" clearable v-else-if="data.type == '3'"></el-input>
					<el-input placeholder="请输入" v-model.trim="data.appCode" class="item2" clearable v-else></el-input>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item3">投保人</span>
					<!-- <el-input placeholder="请输入投保人名称" v-model.trim="data.holderName" class="item2" clearable></el-input> -->
					<el-autocomplete
						v-model="data.holderName"
						:fetch-suggestions="querySearchAsync"
						placeholder="请输入内容"
						@select="handleSelect"
						class="item2"
						clearable
					></el-autocomplete>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item3">投保单状态</span>
					<el-select v-model="data.state" placeholder="请选择投保单状态" class="item2" clearable>
						<el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div>
					<span class="item3">投保人区域</span>
					<el-cascader :options="options2" placeholder="请选择" change-on-select v-model="regionCoding" class="item2" clearable></el-cascader>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item3">设备代码</span>
					<el-input placeholder="请输入索道设备代码" v-model.trim="data.sequipRegistNo" class="item2" clearable></el-input>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item3">支付状态</span>
					<el-select v-model="data.financeStatus" placeholder="请选择支付状态" class="item2" clearable>
						<el-option v-for="item in options5" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div>
					<el-tooltip class="item" effect="light" content="社会信息统一代码" placement="top">
						<span class="item3">统一社会信用代码</span>
					</el-tooltip>
					<el-input placeholder="请输入社会信息统一代码" v-model.trim="data.threeInOneCode" class="item2" clearable></el-input>
				</div></el-col>
				<el-col :span="8"><div>
					<el-tooltip class="item" effect="light" content="索道安全检验合格证编号" placement="top">
						<span class="item3">索道安全检验合格证编号</span>
					</el-tooltip>
					<el-input placeholder="请输入客运索道安全检验合格证编号或监督检验报告编号" v-model.trim="data.safetyNo" class="item2" clearable></el-input>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item3">新保/续保</span>
					<el-select v-model="data.renewal" placeholder="请选择" class="item2" clearable>
						<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="16"><div>
					<el-select v-model="data.types" placeholder="请选择" class="item4" clearable>
						<el-option v-for="item in options8" :key="item.productCode" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-date-picker v-if="data.types == '1'" v-model="data.appStartFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
					<el-date-picker v-else-if="data.types == '3'" v-model="data.polStartFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
					<el-date-picker v-else v-model="data.issueDateStart" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
					<span>--</span>
					<el-date-picker v-if="data.types == '1'" v-model="data.appStartEnd" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
					<el-date-picker v-else-if="data.types == '3'" v-model="data.polStartEnd" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
					<el-date-picker v-else v-model="data.issueDateEnd" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
				</div></el-col>
				<el-col :span="8"><div>
					<el-button @click="empty" icon="el-icon-delete" round class="empty-button">清空条件</el-button>
					<el-button type="warning" @click="searchview" round class="query-button">查询</el-button>
				</div></el-col>
			</el-row>
		</div>
		<div class="content">
			<div class="content1">
				<span class="content1-num">共<span style="color:#333333;">{{totalEquipmentCount}}</span>条</span>，<span class="content1-num">保费总计：<span style="color:#FF4D24;">{{totalPrem}}元</span></span>
				<span class="content1-exports"  @click="exports" v-if="datas.find(item => item.key == '10034')"><img src="../../../static/img/dus.png" alt="">批量导出</span>
			</div>
			<div class="content-table">
				<div class="content-title">
					<span class="title1">订单信息</span>
					<span class="title2">日期</span>
					<span class="title3">保费（元）</span>
					<span class="title4">保单状态</span>
					<span class="title5">联系人</span>
					<span class="title6">操作</span>
				</div>
				<div class="table" v-for="(row,index) in data1" :key="index">
					<div class="table-title">
						<span>更新时间：{{row.updateDate}}</span>
						<span>订单号：{{row.orderCode}}</span>
					</div>
					<div class="table-data">
						<div class="title1 data-item">
							<div class="centered-block">
								<p class="color-gray-3 f14 fb">{{row.productName}}<span class="new-insurance" v-if="row.renewal=='N'">新保</span><span class="new-insurance" v-if="row.renewal=='Y'">续保</span></p>
								<p class="color-gray-3 f14 lh30" v-if="datas.find(item => item.key == '10039')">
									<span> 投保人：</span><span class="font-colo" @click="userInformation(row)">{{row.policyHolderName}}</span>
								</p>
								<p class="color-gray-3 f14 lh30" v-else>
									<span> 投保人：</span>{{row.policyHolderName}}
								</p>
								<p class="color-gray-3 f14 lh30">
									<span> 投保单号：</span><span class="font-colo" @click="getDetailsPolicy(row)">{{row.appFormCode}}</span>
								</p>
								<p class="color-gray-3 f14 lh30">
									<span> 保单号：</span><span class="font-colo" @click="accessPolicyDetails(row)">{{row.policyNo}}</span>
								</p>
								<p class="color-gray-3 f14 lh30">
									<span> 设备数量：</span>{{row.total}}
								</p>
								<p class="color-gray-3 f14 lh30">
									<span> 投保区域：</span>{{row.region}}
								</p>
								<p class="color-gray-3 f14 lh30" v-if="row.policyKind=='01'">
									<span> 保单邮寄地址：</span><span>{{row.mailAddress}}</span>
								</p>
								<p class="color-gray-3 f14 lh30" v-if="row.policyKind=='00'">
									<span> 电子邮箱：</span><span>{{row.mailAddress}}</span>
								</p>
							</div>
						</div>
						<div class="title2 data-item">
							<div class="centered-block">
								<p class="color-gray-3 f14 mb10 text-center">投保日期：{{row.createDate}}</p>
								<p class="color-gray-3 f14 mb10 text-center" v-if="row.confirmWhitPayDate">到账日期：{{row.confirmWhitPayDate}}</p>
								<p class="color-gray-3 f14 mb10 text-center" v-if="row.issueDate">出单时间：{{row.issueDate}}</p>
								<p class="color-gray-3 f14 fle" style="justify-content:center;">
									<span style="display:block;"> 保险期间：</span>{{row.startDate}}<br/>{{row.endDate}}
								</p>
							</div>
						</div>
						<div class="title3 data-item">
							<div class="centered-block text-center">
								<p class="color-gray-3 f14 lh30">应收：<span class="fb" style="color:#FF4D24;">￥{{row.afterPrem}}</span></p>
								<p class="color-gray-3 f14 lh30" v-if="row.actualPrem">实收：<span class="fb" style="color:#FF4D24;">￥{{row.actualPrem}}</span></p>
								<p class="color-gray-3 f14 lh30" v-if="row.payType=='00'">线下转账</p>
								<p class="color-gray-3 f14 lh30" v-if="row.payType=='01'">微信支付</p>
							</div>
						</div>
						<div class="title4 data-item">
							<div class="centered-block">
								<p class="color-gray-3 f14 lh30" v-if="row.source=='00'">下单渠道：PC</p>
								<p class="color-gray-3 f14 lh30" v-if="row.source=='01'">下单渠道：APP</p>
								<p class="color-gray-3 f14 lh30" v-else><span>保单状态：</span>{{row.appStatus}}</p>
								<p class="color-gray-3 f14 lh30" v-if="row.invoiceStatus=='00'"><span>发票状态：</span>未申请</p>
								<p class="color-gray-3 f14 lh30" v-if="row.invoiceStatus=='01'"><span>发票状态：</span>已申请</p>
								<p class="color-gray-3 f14 lh30" v-if="row.policyKind=='00'"><span>保单类型：</span>电子保单</p>
								<p class="color-gray-3 f14 lh30" v-if="row.policyKind=='01'"><span>保单类型：</span>纸质保单</p>
							</div>
						</div>
						<div class="title5 data-item">
							<div class="centered-block">
								<p class="color-gray-3 f14 lh30"><span>姓名：</span>{{row.linkPerson}}</p>
								<p class="color-gray-3 f14 lh30"><span>电话：</span>{{row.linkTel}}</p>
								<!-- <p class="color-gray-3 f14 lh30"><span>地址：</span>{{row.holderProvinceName}}{{row.holderCityName}}{{row.holderCountyName}}{{row.location}}</p> -->
							</div>
						</div>
						<div class="title6 data-item">
							<div class="state-item">
								<div class="centered-block text-center">
									<p class="font-colo f14 lh30" @click="enquirydetails(row)" v-if="datas.find(item => item.key == '10027')">查看详情</p>
									<p class="font-colo f14 lh30" @click="relation(row)" v-if="datas.find(item => item.key == '10028')">设备清单</p>
									<p class="font-colo f14 lh30" @click="paymentnotice(row)" v-if="row.state == '01' && datas.find(item => item.key == '10030')">支付通知</p>
									<p class="font-colo f14 lh30" @click="premium(row)" v-if="row.state == '01' && datas.find(item => item.key == '10029')">修改保费</p>
									<p class="font-colo f14 lh30" @click="identification(row)" v-if="row.state == '01' && datas.find(item => item.key=='10031')">到账确认</p>
									<p class="font-colo f14 lh30" @click="policyupload(row)" v-if="row.state == '02' && datas.find(item => item.key=='10032')">保单上传</p>
									<!-- <p class="font-colo f14 lh30" @click="endorsements(row)" v-if="datas.find(item => item.key == '10025') && row.state == '03' || datas.find(item => item.key == '10025') && row.state == '04'">批单补录</p> -->
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
	</div>
</template>

<script>
import NumberType from '../../../static/data/NumberType.json';
import policyStatus from '../../../static/data/policyStatus.json';
import paymentStatus from '../../../static/data/paymentStatus.json';
import buttonSelection from './js/buttonSelection.js';
import {elevator} from '../../server/accidenServer.js';
import ResourcesService from '../../service/ResourcesService';
import moment from 'moment';
import UserService from '../../service/UserService';
export default {
	data() {
		return {
			Elevator:new elevator(),
			ButtonSelection:new buttonSelection(),
			ResourcesService:new ResourcesService(),
			UserService:new UserService(),
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
				"holderProvinceCode":'',//省编码
				"holderCityCode":'',//市编码
				"holderCountyCode":'',//区编码
				"sequipRegistNo":'',//设备注册证书
				"safetyNo":'',//设备安全检验合格证号
				"threeInOneCode":'',//社会信息统一代码/机构营业执照号
				"state":'',//投保单状态
				"financeStatus":'',//支付状态
				"payType":'',//支付方式
				"types":'',
				"appStartFrom":'',//投保日期查询起期
				"appStartEnd":'',//投保日期查询止期
				"issueDateStart":'',//出单日期开始
				"issueDateEnd":'',//出单日期结束
				"productCategory1":"sd",
				"renewal":'',//新保/续保
				"polStartFrom":'',
				"polStartEnd":''
			},
			options:[],
			options2:[],
			options3:[
				{
					label:'新保',
					value:'N'
				},
				{
					label:'续保',
					value:'Y'
				}
			],
			regionCoding:[],//选择的地区
			options4:[],
			options5:[],
			options8:[
				{
					'value':'1',
					'label':'投保日期'
				},
				{
					'value':'2',
					'label':'出单日期'
				},
				{
					'value':'3',
					'label':'保险起期'
				}
			],
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
			totalEquipmentCount:0,
			totalPrem:0,
		}
	},
	created(){
		this.policyStatu();
		this.getArea();
		if(window.localStorage.getItem('index') == '4' && window.localStorage.getItem('data')){
			this.gettingCache();
		}else{
			window.localStorage.removeItem('data');
			this.policylist();
		}
	},
	methods: {
		policyStatu(){ //根据权限获取配置文件
			this.options = NumberType.data;
			this.datas = JSON.parse(window.sessionStorage.getItem('list'));
			this.options4 = policyStatus.data;
			this.options5 = paymentStatus.data;
		},
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.options2 = this.ButtonSelection.Accessarea(parmes.data, window.sessionStorage.getItem('provinceCode'));
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
				this.data.holderProvinceCode = this.regionCoding[0];
				this.data.holderCityCode = '';
				this.data.holderCountyCode = '';
			}else if(this.regionCoding.length == 2){
				this.data.holderProvinceCode = this.regionCoding[0];
				this.data.holderCityCode = this.regionCoding[1];
				this.data.holderCountyCode = '';
			}else if(this.regionCoding.length == 3){
				this.data.holderProvinceCode = this.regionCoding[0];
				this.data.holderCityCode = this.regionCoding[1];
				this.data.holderCountyCode = this.regionCoding[2];
			}else{
				this.data.holderProvinceCode = '';
				this.data.holderCityCode = '';
				this.data.holderCountyCode = '';
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
			let index = '4';
			window.localStorage.setItem('data',JSON.stringify(this.data));
			window.localStorage.setItem('index',index);
			let res = await this.Elevator.searchAppLists(this.data);
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
						item.region = item.provinceName + (item.cityName ? item.cityName : '') + (item.countyName ? item.countyName : '');
						item.afterPrem = item.afterPrem.toFixed(2);
						if(item.actualPrem){
							item.actualPrem = item.actualPrem.toFixed(2);
						}
						item.totals = item.total;
					});
				}
				this.getLiftStatistics();
			}
		},
		async getLiftStatistics(){
			let res = await this.Elevator.getLiftStatistics(this.data);
			if(res.code == '0000'){
				this.totalPrem = this.$stringHelper.formatMoney(res.data.totalPrem);
				this.totalEquipmentCount = this.$stringHelper.formatMoneys(res.data.totalEquipmentCount);
			}
		},
		gettingCache(){ //获取缓存查询条件
			let data = JSON.parse(window.localStorage.getItem('data'));
			this.data = data;
			if(data.holderProvinceCode){
				this.regionCoding.push(data.holderProvinceCode);
			};
			if(data.holderCityCode){
				this.regionCoding.push(data.holderCityCode);
			};
			if(data.holderCountyCode){
				this.regionCoding.push(data.holderCountyCode);
			};
			this.pageNum = data.pn;
			this.currentPage = data.pn;
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
				"holderProvinceCode":'',//省编码
				"holderCityCode":'',//市编码
				"holderCountyCode":'',//区编码
				"sequipRegistNo":'',//设备注册证书
				"safetyNo":'',//设备安全检验合格证号
				"threeInOneCode":'',//社会信息统一代码/机构营业执照号
				"state":'',//投保单状态
				"financeStatus":'',//支付状态
				"payType":'',//支付方式
				"types":'',
				"appStartFrom":'',//投保日期查询起期
				"appStartEnd":'',//投保日期查询止期
				"issueDateStart":'',//出单日期开始
				"issueDateEnd":'',//出单日期结束
				"productCategory1":"sd",
				"renewal":'',//新保/续保
				"polStartFrom":'',
				"polStartEnd":''
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
					appCode:row.appFormCode,
					orderStatusName:row.appStatus
				}
			})
			window.open(routeData.href, '_blank');
		},
		relation(row){ //人员清单
			let routeData = this.$router.resolve({
				path:'/order/object/list',
				query:{
					appCode:row.appFormCode,
					index:'3'
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
				this.trackEvent('消息','索道支付通知');
			}
		},
		premium(row){ // 修改保费
			let routeData = this.$router.resolve({
				path:'/order/premium/edit',
				query:{
					orderCode:row.orderCode,
					appCode:row.appFormCode
				}
			})
			window.open(routeData.href, '_blank');
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
		exports(){ // 投保单导出
			if(this.total <= 5000){
				let href = this.$apiUrl.EXPORTSSC + '?userCode=' + window.sessionStorage.getItem('userCode') + '&holderName=' + this.data.holderName + '&appCode=' + this.data.appCode + '&policyNo=' + this.data.policyNo + '&orderCode=' + this.data.orderCode + '&productCode=' + this.data.productCode + '&state=' + this.data.state + '&appStartFrom=' + this.data.appStartFrom + '&appStartEnd=' + this.data.appStartEnd + '&issueDateStart=' + this.data.issueDateStart + '&issueDateEnd=' + this.data.issueDateEnd + '&polStartFrom=' +this.data.polStartFrom +  '&polStartEnd=' +this.data.polStartEnd + '&financeStatus=' + this.data.financeStatus + '&payType=' + this.data.payType + "&productCategory1=" + this.data.productCategory1 + "&sequipRegistNo=" + this.data.sequipRegistNo + "&safetyNo	=" + this.data.safetyNo	 + "&threeInOneCode=" + this.data.threeInOneCode + "&renewal=" + this.data.renewal + '&holderProvinceCode=' + this.data.holderProvinceCode + '&holderCityCode=' + this.data.holderCityCode + '&holderCountyCode=' + this.data.holderCountyCode;
				this.$logger.info('A0202','','');
				// window.open(href,"_blank" )
				this.ResourcesService.exportsViewFile(href)
				this.trackEvent('统计','导出索道保单');
			}else{
				this.$message({
         			message: "数据量过大,超过500页,请缩小查询范围！",
          			type: 'warning'
        		});
			}
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.policylist();
		},
		async querySearchAsync(queryString, cb) {
			if(!queryString){
				 cb([]);	
			}else{
				// cb([{ "value": "三全鲜食（北新泾店）" }]);	
				let form = {
					"channelCode":'sequip',
					"pageSize":'20',
					"pageNum":'1',
					"orgName":queryString,
					"branchCode":'',
				}
				let res = await this.UserService.getSerachName(form)
				if(res.code=='0000'){
					let list = res.list.map(item=>{
						let obj = {
							value:item.erpName
						}
						return obj
					})
					cb(list);
				}else{
					cb([{value:'失败'}]);	
				}

			}
			
		},
		 handleSelect(item) {
			console.log(item);
		}
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
				font-size: 16px;
				color: #666666;
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
