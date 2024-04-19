<template>
	<div class="policyformmanagement" id="policyList">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<el-select v-model="data.type" placeholder="请选择" class="item1">
							<el-option v-for="item in options" :key="item.productCode" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-input size="medium" placeholder="请输入" v-model.trim="data.policyNo" class="item2" clearable v-if="data.type == '2'"></el-input>
						<el-input size="medium" placeholder="请输入" v-model.trim="data.orderCode" class="item2" clearable v-else-if="data.type == '3'"></el-input>
						<el-input size="medium" placeholder="请输入" v-model.trim="data.appCode" class="item2" clearable v-else></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<el-select v-model="data.types" placeholder="请选择" class="item1">
							<el-option v-for="item in options8" :key="item.productCode" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-date-picker size="medium" v-if="data.types == '1'" v-model="data.appStartFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
						<el-date-picker size="medium" v-else-if="data.types == '3'" v-model="data.polStartFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
						<el-date-picker size="medium" v-else-if="data.types == '4'" v-model="data.confirmDateFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
						<el-date-picker size="medium" v-else v-model="data.issueDateStart" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>

						<el-date-picker size="medium" v-if="data.types == '1'" v-model="data.appStartEnd" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
						<el-date-picker size="medium" v-else-if="data.types == '3'" v-model="data.polStartEnd" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
						<el-date-picker size="medium" v-else-if="data.types == '4'" v-model="data.confirmDateEnd" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
						<el-date-picker size="medium" v-else v-model="data.issueDateEnd" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">投保人：</span>
						<el-autocomplete size="medium" v-model="data.holderName" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect" class="item2" clearable ></el-autocomplete>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8" v-if="showBranch">
					<div>
						<span class="item3">分支机构：</span>
						<el-select size="medium" v-model="data.branchScope" filterable placeholder="请选择" class="item2" clearable>
							<el-option v-for="(item,index) in branchList" :key="index" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8" v-else>
					<div>
						<span class="item3">下单渠道：</span>
						<el-select size="medium" v-model="data.source" placeholder="请选择下单渠道" class="item2" clearable>
							<el-option v-for="item in options7" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">销售区域：</span>
						<el-cascader size="medium" :options="options2" placeholder="请选择" change-on-select v-model="regionCoding" class="item2" clearable></el-cascader>
					</div>
				</el-col>
				<el-col :span="8" v-if="!showFlag">
					<div>
						<el-button type="text" class="mr60 fr" v-if="showFlag" @click="showFlag = !showFlag">收起 <i class="el-icon-arrow-up"></i></el-button>
						<el-button type="text" class="mr60 fr" v-if="!showFlag" @click="showFlag = !showFlag">展开 <i class="el-icon-arrow-down"></i></el-button>
						<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查 询</el-button>
						<el-button @click="empty" class="empty-button" type="text">清空条件</el-button>
					</div>
				</el-col>
				<el-col :span="8" v-if="showFlag">
					<div>
						<span class="item3">支付方式：</span>
						<el-select size="medium" v-model="data.payType" placeholder="请选择" class="item5" clearable>
							<el-option v-for="item in options6" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-select size="medium" v-model="data.financeStatus" placeholder="请选择" class="item5" clearable>
							<el-option v-for="item in options5" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg" v-if="showFlag">
				<el-col :span="8" v-if="showBranch">
					<div>
						<span class="item3">下单渠道：</span>
						<el-select size="medium" v-model="data.source" placeholder="请选择下单渠道" class="item2" clearable>
							<el-option v-for="item in options7" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8" v-else>
					<div></div>
				</el-col>
				<el-col :span="8">
					<div></div>
				</el-col>
				<el-col :span="8">
					<div>
						<el-button type="text" class="mr60 fr" v-if="showFlag" @click="showFlag = !showFlag">收起 <i class="el-icon-arrow-up"></i></el-button>
						<el-button type="text" class="mr60 fr" v-if="!showFlag" @click="showFlag = !showFlag">展开 <i class="el-icon-arrow-down"></i></el-button>
						<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查 询</el-button>
						<el-button @click="empty" class="empty-button" type="text">清空条件</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="content">
			<el-tabs type="border-card" v-model="data.state" @tab-click="searchFun" class="state-style">
				<el-tab-pane :label="item.label" :name="item.value" v-for="(item,index) in options4" :key="index"></el-tab-pane>
			</el-tabs>
			<div class="mt10 f16">
				<div style="display:flex">
					<div>
						<span class="ml20">行业类型：</span>
						<el-cascader 
							size="small" 
							@change="setProductCategory('productCategory2List')"
							:options="productCategory2All" 
							placeholder="请选择" 
							change-on-select 
							v-model="productCategory2List" 
							class="item2" 
							clearable  
							:props="{
							checkStrictly: true,
							label: 'value',
							value: 'code',
							children: 'children',
						}"></el-cascader>
					</div>
					<div>
						<span class="ml20">产品类型：</span>
						<el-cascader 
							size="small"
							@change="setProductCategory('productCategory1List')"
							:options="productCategory1All" 
							placeholder="请选择" 
							change-on-select 
							v-model="productCategory1List" 
							class="item2" 
							clearable  
							:props="{
							checkStrictly: true,
							label: 'value',
							value: 'code',
							children: 'children',
						}"></el-cascader>
						
					</div>
				</div>
				<!-- <span class="ml20">险种类型：</span>
				<el-button :type="item.code == data.productCategory1 ? 'warning' : ''" size="medium" round v-for="(item,index) in productCategory" :key="index" class="mr10 w80" @click="checkSort(item)">{{item.value}}</el-button> -->
				<div class="mt10 mb20">
					<span class="item3 ml20">产品名称：</span>
					<el-select v-model="data.productCode" filterable @change="searchFun" placeholder="请选择" class="item2" clearable size="small" style="min-width:500px" @focus="searchFun1">
						<el-option v-for="(item,index) in options3" :key="index" :label="item.name" :value="item.code"></el-option>
					</el-select>
				</div>
			</div>

			<div class="content-table mt10" v-if="data1.length != 0">
				<PolicyComp v-for="(row,index) in data1" :key="index" :row="row"></PolicyComp>
			</div>
			<div v-else class="content-table mt10" style="min-height:440px;">
				<div class="tip-text mt50">
					<p class="search-title mt5">请输入查询条件</p>
					<p style="color: #101010;margin-top:5px;">注：为了提高页面查询速度，列表页优化如下：</p>
					<p class="col-org mt5">1、默认不加载数据。</p>
					<p class="col-org mt5">2、初始化查询条件：投保日期为一年（可修改或删除）。</p>
				</div>
			</div>
		</div>
		<div class="content-total">
			<span class="ml20 content1-num">查询结果：<span style="color:#333333;maegin-right:5px">{{total}}</span>条记录</span>|
			<span class="content1-num">保费总计：<span class="col-red">￥{{totalPrem}}元</span></span> | 
			<span class="content1-num" v-if=" data.productCategory1">设备/人员数量总计：<span class="col-blue">{{totalEquipmentCount}}</span></span> 
			<span class="content1-num" v-else>无法统计 
				<el-tooltip class="item" effect="light" content="同时选择多险种，无法统计设备、人员数量" placement="right">
     				<i class="el-icon-question col-org"></i>
    			</el-tooltip> 
			</span>
			<span class="content1-exports"  @click="exports" v-if="data.productCategory1 && datas.find(item => item.key == '10100')"> <i class="el-icon-download"></i>批量导出</span>
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
	</div>
</template>

<script>
import NumberType from '../../../static/data/NumberType.json';
import policyStatus from '../../../static/data/policyStatus.json';
import paymentStatus from '../../../static/data/paymentStatus.json';
import buttonNone from '../../../static/data/buttonNone.json'
import {elevator} from '../../server/accidenServer.js';
import ResourcesService from '../../service/ResourcesService';
import UserService from '../../service/UserService';
import buttonSelection from './js/buttonSelection.js';
import CorrectionManagement from '@/service/CorrectionManagement.js';
import ProductService from '@/service/ProductService.js';
import ProductConfig from '../../service/ProductConfig.js';
import RidesService from '@/service/RidesService.js';
import moment from 'moment';
import PolicyComp from './components/policyComp'
import sortData from './data/productSort.json'
import JT0000Data from './data/JT0000.json'
export default {
	components:{
		PolicyComp
	},
	data() {
		let defaultDate = new Date(new Date().setFullYear((new Date().getFullYear()-1))).setDate((new Date(new Date().setFullYear((new Date().getFullYear()-1))).getDate()-1));
		return {
			proSortName:'',
			Elevator:new elevator(),
			ButtonSelection:new buttonSelection(),
			ResourcesService: new ResourcesService(),
			UserService: new UserService(),
			CorrectionManagement:new CorrectionManagement(),
			ProductService: new ProductService(),
			RidesService: new RidesService(),
			ProductConfig:new ProductConfig(),
			buttonNoneData:buttonNone,
			JT0000Data:JT0000Data,
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
				"state":'',//投保单状态
				"financeStatus":'',//支付状态
				"payType":'',//支付方式
				"source":'',//下单渠道
				"types":'1',
				"appStartFrom":moment(defaultDate).format('YYYY-MM-DD 00:00:00'),//投保日期查询起期
				"appStartEnd":new Date(),//投保日期查询止期
				"issueDateStart":'',//出单日期开始
				"issueDateEnd":'',//出单日期结束
				"confirmDateFrom": '',//到账时间查询起期
				"confirmDateEnd": '', //到账时间查询止期
				"productCategory1":"",
				"polStartFrom":'',
				"polStartEnd":'',
				"branchScope":''
			},
			options:[],
			options3:[],
			options33:[],
			options2:[],
			options22:[],
			regionCoding:[],//选择的地区
			productCategory1List:[],//选择行业类型
			productCategory2List:[],//选择产品类型
			options4:[],
			options5:[],
			options6:[],
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
					'value':'2',
					'label':'出单日期'
				},
				{
					'value':'3',
					'label':'保险起期'
				},
				{
					'value':'4',
					'label':'到账日期'
				}
			],
			productCategory:sortData.dataProductCategory1,
			productCategory1All:sortData.dataProductCategory1All,
			productCategory2All:sortData.dataProductCategory2All,
			data1:[],
			branchList:[],
			branchList1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			exhibition:false,
			showFlag: false,
			appFormCode:'',
			policyHolderName:'',
			mailbox:'',
			datas:[],
			dialogVisible:false,
			data2:{},
			totalEquipmentCount:0,
			totalPrem:0,
			showBranch:false,
			productList:[]
		}
	},
	created(){
		sessionStorage.getItem('branchCode') == 'JT0000' ? this.showBranch = true : this.showBranch = false
		Promise.all([this.getList(),this.getRides(),this.policyStatu()]).then((res)=> {
			// this.policylist();
		})
	},
	methods: {
		async getRides() { //获取缓存数据
			let branchRid = await this.RidesService.getRides('sequipListData','sequip','1');
			if(branchRid.code == '0000' && branchRid.data) {
				this.options22 = JSON.parse(branchRid.data).options2;
				this.setArea();
				this.branchList1 = JSON.parse(branchRid.data).branchList;
				this.setBranch();
			} else {
				Promise.all([this.getArea(),this.loadBranch()]).then((res)=> {
					this.setRides();
				}) 
			}
		},
		async setRides() {//设置缓存数据
			let obj = {
				branchList: this.branchList1,
				options2: this.options22,
			};
			let dataPar = {
                "time": 10,  // 具体值
                "type": 2,  // 1分钟 2小时"
                "value": JSON.stringify(obj)
            }
			let resSave = await this.RidesService.setRides(dataPar,'sequipListData','sequip','1');
		},
		// 获取产品配置列表
		async getList(){ 
			let form = {
				pageNum:1,
				pageSize:1000
			}
			let res = await this.ProductConfig.getList(form);
			if(res.code == '0000'){
				this.productList =[...res.list,{businessType:1,productCode:'23PR727395'}] ;
			}
		},
		async searchFun() {
			this.pageNum = 1;
			this.policylist();
		},
		async searchFun1() {
			await this.getProductList();
		},
		checkSort(item) {
			this.data.productCategory1 = item.code;
			this.proSortName = item.value
			item.code ? this.options3 = this.options33.filter(item1 => item1.productCategory1 == item.code) : this.options3 = this.options33
			this.data.productCode = '';
			this.pageNum = 1;
			this.policylist();
		},
		async getProductList(){ // 获取产品列表
			if(this.options3.length == 0) {
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
					'upOrDown':"0",
					isStatusDown:1
				};
				let res = await this.ProductService.getProductListV3(data);
				if(res.code == '0000' && res.list){
					res.list.forEach(item => {
						let obj = {
							code: item.code,
							name: item.name,
							productCategory1: item.attrInfoDTOList && item.attrInfoDTOList.find(i => i.attrCode == 'productSort') ? item.attrInfoDTOList.find(i => i.attrCode == 'productSort').attrDTOList[0].valueMark : ''
						}
						this.options3.push(obj);
						this.options33.push(obj);
					})
					if(this.data.productCategory1) {
						if(this.productCategory.find(i => i.code == this.data.productCategory1)) {
							this.checkSort(this.productCategory.find(i => i.code == this.data.productCategory1))
						}
					}
				}
			}
		},
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.options22 = parmes.data;
				this.setArea();
			};
		},
		//处理地区
		setArea() {
			if(window.sessionStorage.getItem('provinceCode') == '000000') {
				this.options2 = this.options22;
			} else {
				this.options2 = this.ButtonSelection.Accessarea(this.options22, window.sessionStorage.getItem('provinceCode'));
			}
		},
		// 获取所有的分支机构
		async loadBranch(){
			let res = await this.CorrectionManagement.getBranchInfo();
			if(res.code == '0000'){
				this.branchList1 = res.list;
				this.setBranch();
			}
        },
		//设置分支机构
		setBranch() {
			let branchCode = window.sessionStorage.getItem('branchCode');
			let authArr = sessionStorage.getItem('authDataInfo').split(',');
			if(branchCode == 'JT0000'){
				if(!this.branchList1.find(item => item.jtBranchCode == 'JT0000')) {
					this.branchList1.push({
						"jtBranchCode":"JT0000","jtBranchName":"江泰保险经纪股份有限公司本部"
					})
				}
				this.branchList = this.branchList1;
			}else{
				authArr.forEach(authBranch => {
					if(authBranch == 'JT0144000') {
						this.branchList.push({"jtBranchCode":"JT0144001","jtBranchName":"广东分公司本部"})
					}
					this.branchList1.forEach(item =>{
						if(item.jtBranchCode == authBranch){
							this.branchList.push(item)
						}
					})
				})
			}
		},
		policyStatu(){ //根据权限获取配置文件
			this.options = NumberType.data;
			this.datas = JSON.parse(window.sessionStorage.getItem('list'));
			this.options4 = policyStatus.dataAll;
			this.options5 = paymentStatus.data;
			this.options6 = [{
					"value": "0",
					"label": "线下转账"
				},{
					"value": "00",
					"label": "微信支付"
				},{
					"value": "81",
					"label": "微保-微信"
				},{
					"value": "82",
					"label": "微保-支付宝"
				}]
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
				// if(!this.data.appStartFrom || !this.data.appStartEnd){
				// 	this.$message({
				// 		message: '请选择投保日期时间段',
				// 		type: 'warning'
				// 	});
				// 	return;
				// }	
				this.data.appStartFrom = this.data.appStartFrom ? moment(this.data.appStartFrom).format('YYYY-MM-DD 00:00:00') : '';
				this.data.appStartEnd = this.data.appStartEnd ? moment(this.data.appStartEnd).format('YYYY-MM-DD 23:59:59') : '';
				this.data.polStartEnd = '';
				this.data.polStartFrom = '';
				this.data.issueDateStart = '';
				this.data.issueDateEnd = '';
				this.data.confirmDateFrom = '';//到账时间查询起期
				this.data.confirmDateEnd = '';//到账时间查询止期
			}else if(this.data.types == '2'){
				// if(!this.data.issueDateStart || !this.data.issueDateEnd){
				// 	this.$message({
				// 		message: '请选择出单日期时间段',
				// 		type: 'warning'
				// 	});
				// 	return;
				// }
				this.data.issueDateStart = this.data.issueDateStart ? moment(this.data.issueDateStart).format('YYYY-MM-DD 00:00:00') : '';
				this.data.issueDateEnd = this.data.issueDateEnd ? moment(this.data.issueDateEnd).format('YYYY-MM-DD 23:59:59') : '';
				this.data.appStartFrom = '';
				this.data.appStartEnd = '';
				this.data.polStartFrom = '';
				this.data.polStartEnd = '';
				this.data.confirmDateFrom = '';//到账时间查询起期
				this.data.confirmDateEnd = '';//到账时间查询止期
			}else if(this.data.types == '3'){
				// if(!this.data.polStartFrom || !this.data.polStartEnd){
				// 	this.$message({
				// 		message: '请选择保险起期时间段',
				// 		type: 'warning'
				// 	});
				// 	return;
				// }
				this.data.appStartFrom = '';
				this.data.appStartEnd = '';
				this.data.issueDateStart = '';
				this.data.issueDateEnd = '';
				this.data.polStartFrom = this.data.polStartFrom ? moment(this.data.polStartFrom).format('YYYY-MM-DD 00:00:00') : '';
				this.data.polStartEnd = this.data.polStartEnd ? moment(this.data.polStartEnd).format('YYYY-MM-DD 23:59:59') : '';
				this.data.confirmDateFrom = '';//到账时间查询起期
				this.data.confirmDateEnd = '';//到账时间查询止期
			} else if(this.data.types == '4'){
				this.data.appStartFrom = '';
				this.data.appStartEnd = '';
				this.data.issueDateStart = '';
				this.data.issueDateEnd = '';
				this.data.polStartFrom = '';
				this.data.polStartEnd = '';
				this.data.confirmDateFrom = this.data.confirmDateFrom ? moment(this.data.confirmDateFrom).format('YYYY-MM-DD 00:00:00') : '';//到账时间查询起期
				this.data.confirmDateEnd = this.data.confirmDateEnd ? moment(this.data.confirmDateEnd).format('YYYY-MM-DD 23:59:59') : '';//到账时间查询止期
			}else {
				this.data.appStartFrom = '';
				this.data.appStartEnd = '';
				this.data.issueDateStart = '';
				this.data.issueDateEnd = '';
				this.data.polStartFrom = '';
				this.data.polStartEnd = '';
				this.data.confirmDateFrom = '';//到账时间查询起期
				this.data.confirmDateEnd = '';//到账时间查询止期
			}
			// if(this.data.state == 0) {
			// 	this.data.state = null
			// }
			// let index = '1';
			// window.localStorage.setItem('data',JSON.stringify(this.data));
			// window.localStorage.setItem('index',index);
			let formData = JSON.parse(JSON.stringify(this.data)) 
			if(formData.state == 0) {
				formData.state = null
			}
			if(this.data.payType == '00' || this.data.payType == '81' || this.data.payType == '82'){
				formData.payChannel = this.data.payType
				formData.payType = ''
				// formData.userCode = ''
			}else if(this.data.payType == '0'){
				formData.payChannel = ''
				formData.payType = this.data.payType
			}else{
				formData.payChannel = ''
				formData.payType = ''
			}
			this.getLiftStatistics(formData);
			
			let res = await this.Elevator.searchAppList(formData);
			if(res.code == '0000'){
				this.data1 = res.list ? res.list : [];
				this.total = res.total;
				if(this.total){
					this.data1.forEach(item =>{
						policyStatus.data.forEach(ele =>{
							if(item.state == ele.state){
								item.appStatus = ele.label;
							}
						})
						let onlineFlag = this.productList.find(i => item.productCode == i.productCode);
						if(onlineFlag) {
							item.productCodes = onlineFlag.businessType == 1 ? '1' : '';
						}
						//增加逻辑（总部结算的产品，只能总部的财务经理能点击到账确认）
						if(JT0000Data.find(code => code.productCode == item.productCode)) {
							window.sessionStorage.getItem('branchCode') == 'JT0000' ? item.showMoney = true : item.showMoney = false
						} else {
							item.showMoney = true
						}
						let sortPro = this.productCategory.find(subItem => subItem.code == item.productCategory1);
						item.sortName = sortPro  ? sortPro.name : '--';
						item.sequipListIndex = sortPro  ? sortPro.index : '';
						item.onlinePro = item.productName.indexOf('线下录单') == -1 && item.productCategory1 != 'zy'
						item.sequipName = item.productCategory1 == 'gz' ? '人员数量' : item.productCategory1 == 'dt' ? '设备数量' : '';
						item.region = item.provinceName + (item.cityName ? item.cityName : '') + (item.countyName ? item.countyName : '');
						item.afterPrem = item.afterPrem.toFixed(2);
						if(item.actualPrem){
							item.actualPrem = item.actualPrem.toFixed(2);
						}
						if((item.payType=='01' || item.payType=='00' )&& item.payChannel == '06'){	// 保险公司支付
							item.payTypeName = '保险公司支付'
						} else if(item.payType=='00'){	// 线下转账
							item.payTypeName = '线下转账'
						}else if(item.payType=='01' && item.payChannel == '00'){	// 微信支付
							item.payTypeName = '微信支付'
						}else if(item.payType=='01' && item.payChannel == '81'){	// 微保-微信
							item.payTypeName = '微保-微信'
						}else if(item.payType=='01' && item.payChannel == '82'){	// 微保-支付宝
							item.payTypeName = '微保-支付宝'
						}else if(item.payType=='01' && item.payChannel == '06'){	// 保险公司支付
							item.payTypeName = '保险公司支付'
						}
						item.applicationTypeName = item.applicationType == '00' ? '非代收' : item.applicationType == '01' ? '代收' : '' 
						item.totals = item.total;
					})
				} else {
					this.$message({
						message: "暂无数据！",
						type: 'warning'
					});
				}
			}
		},
		// 电梯投保单查询统计信息
		async getLiftStatistics(data){
			let res = await this.Elevator.getLiftStatistics(data);
			if(res.code == '0000' && res.data){
				this.totalPrem = this.$stringHelper.formatMoney(res.data.totalPrem);
				this.totalEquipmentCount = this.$stringHelper.formatMoneys(res.data.totalEquipmentCount);
			} else {
				this.totalPrem = 0;
				this.totalEquipmentCount = 0;
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
		// 筛选行业类型和产品类型
		setProductCategory(val){
			console.log(val);
			if(val == 'productCategory1List'){
				let code = this.productCategory1List[this.productCategory1List.length - 1] || ''
				this.data.productCategory1 = code;
				this.data.productCode = '';
				this.pageNum = 1;
				if(this.productCategory1List.length == 2) {
					let [oneCode,twoCode] = this.productCategory1List
					let { value } = this.productCategory1All.find(v1=>v1.code===oneCode).children.find(item=>item.code === twoCode) || ''
					this.options3 = this.options33.filter(item1 => item1.productCategory1 == twoCode) 
					this.proSortName = value
				} else {
					this.proSortName = ''
					this.options3 = this.options33
				}
				this.policylist();
			} else if(val == 'productCategory2List') {
				let code = this.productCategory2List[this.productCategory2List.length - 1] || ''
				this.data.productCategory2 = code;
				this.data.productCode = '';
				this.pageNum = 1;
				this.policylist();
			}
			console.log(this[val]);
		},
		async exports(){ // 投保单导出
			if(this.total <= 5000){
				let formData = JSON.parse(JSON.stringify(this.data)) 
				if(this.data.payType == '00' || this.data.payType == '81' || this.data.payType == '82'){
					formData.payChannel = this.data.payType
					formData.payType = ''
					// formData.userCode = ''
				}else if(this.data.payType == '0'){
					formData.payChannel = ''
					formData.payType = this.data.payType
				}else{
					formData.payChannel = ''
					formData.payType = ''
				}
				formData.state == 0 ? formData.state = '' : formData.state = formData.state
				let href = this.$apiUrl.EXPORTSS +
					'?userCode=' + window.sessionStorage.getItem('userCode') + 
					'&holderName=' +formData.holderName + 
					'&appCode=' +formData.appCode + 
					'&policyNo=' +formData.policyNo + 
					'&orderCode=' +formData.orderCode + 
					'&productCode=' +formData.productCode + 
					'&provinceCode=' +formData.provinceCode + 
					'&cityCode=' +formData.cityCode + 
					'&countryCode=' +formData.countryCode + 
					'&state=' +formData.state + 
					'&appStartFrom=' +formData.appStartFrom + 
					'&appStartEnd=' +formData.appStartEnd + 
					'&issueDateStart=' +formData.issueDateStart + 
					'&issueDateEnd=' +formData.issueDateEnd + 
					'&polStartFrom=' +formData.polStartFrom + 
					'&polStartEnd=' +formData.polStartEnd + 
					'&confirmDateFrom=' +formData.confirmDateFrom + 
					'&confirmDateEnd=' +formData.confirmDateEnd + 
					'&financeStatus=' +formData.financeStatus + 
					'&payType=' +formData.payType + 
					'&payChannel=' +formData.payChannel + 
					"&productCategory1=" +formData.productCategory1 + 
					"&source=" +formData.source +
					"&branchScope=" + formData.branchScope;
				this.$logger.info(
					'M1-004','',
					{
						'userName':window.sessionStorage.getItem('userName'),
						'branchName':window.sessionStorage.getItem('branchName'),
						'productCategory1':this.proSortName,
						'total':this.total,
					}
				);
				this.ResourcesService.exportsViewFile(href)
				this.trackEvent('统计','导出' + this.proSortName + '保单');
			}else{
				this.$message({
					message: "数据量过大,超过500页,请缩小查询范围！",
					type: 'warning'
				});
			}
		},
		empty(){ //清空
			let defaultDate = new Date(new Date().setFullYear((new Date().getFullYear()-1))).setDate((new Date(new Date().setFullYear((new Date().getFullYear()-1))).getDate()-1));
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
				"state":'0',//投保单状态
				"financeStatus":'',//支付状态
				"payType":'',//支付方式
				"source":'',//下单渠道
				"types":'1',
				"appStartFrom":'',//投保日期查询起期
				"appStartEnd":'',//投保日期查询止期
				"issueDateStart":'',//出单日期开始
				"issueDateEnd":'',//出单日期结束
				"confirmDateFrom": '',//到账时间查询起期
				"confirmDateEnd": '', //到账时间查询止期
				"productCategory1":"",
				"polStartFrom":'',
				"polStartEnd":'',
				"branchScope":''
			};
			this.regionCoding = [];
			this.pageNum = 1;
			this.currentPage = 1;
			this.options3 = this.options33;
			this.data1 = [];
			this.total = 0;
			this.totalPrem = 0;
			// this.policylist();
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
#policyList {
	padding-bottom: 80px;
	box-sizing: border-box;
	.elesearch{
		width: calc(100% - 40px);
		min-height: 160px;
		padding: 20px 20px 10px;
		margin: 0px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;
		.row-bg{
			margin-bottom: 20px;
			.item1{
				width: 25%;
				margin-right: 10px;
				margin-left: 0%;
				input {
					border: none;
					font-size: 16px;
					min-width:110px;
				}
				.el-select__caret {
					color: #000000;
					font-weight: 700;
				}
			}
			.item2{
				width: 60%;
			}
			.item3{
				display: inline-block;
				width: 25%;
				text-align: right;
				font-size: 16px;
				color: #666666;
				margin-right: 10px;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				vertical-align: text-bottom;
			}
			.item4{
				width: 18%;
				margin-right: 10px;
			}
			.item5{
				width: 30%;
			}
			.query-button{
				float: right;
				font-weight: 600;
				width: 100px;
				margin-left: 20px;
			}
			.empty-button{
				float: right;
				margin-left: 30px;
				color: #2491fc;
				font-weight: 500;
				text-decoration: underline;
			}
		}
	}
	.content{
		width: calc(100% - 40px);
		margin: 20px 20px 0 20px;
		background-color: #ffffff;
		.w80 {
			min-width: 80px;
			border: 1px solid #E6A23C;
			color:#E6A23C;
		}
		.el-button--warning {
			background-color: #ffe7ba;
		}
		.is-round {
			padding: 8px 22px;
		}
		.el-button:hover {
			background-color: #ffe7ba;
		}
		.state-style {
			background-color: #ffffff;
			font-size: 16px;
			.is-active {
				background: #E6A23C;
    			color: #fbfbfb !important;
				font-size: 16px;
				border-right-color: #E6A23C;
				border-left-color: #E6A23C;
			}
			.el-tabs__header {
				background-color: #ffffff;
				border-bottom: 2px solid #ffa940;
				margin: 0;
			}
			.el-tabs__content {
				display: none;
			}
			.el-tabs__item {
				padding: 0 35px;
				height: 40px;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				line-height: 40px;
				display: inline-block;
				list-style: none;
				font-size: 16px;
				font-weight: 500;
				color: #101010;
				position: relative;
			}
		}
		.content-table{
			width: 100%;
			padding: 0 20px 30px;
			margin-bottom: 40px;
			box-sizing: border-box;
			.tip-text {
				display: flex;
				align-content: space-around;
				flex-wrap: wrap;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				.search-title {
					font-size: 16px;
					color: #101010;
					font-weight: 600;
				}
			}
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
				border: 1px solid #f5f5f5;
				box-sizing: border-box;
				.table-title{
					width: 100%;
					height: 44px;
					line-height: 44px;
					background-color: #f5f5f5;
					padding-left: 20px;
					box-sizing: border-box;
					.new-insurance{
						display: inline-block;
						box-sizing: border-box;
						color: #f5222d;
						text-align: center;
						line-height: 24px;
					}
				}
				.table-data{
					width: 100%;
					min-height: 180px;
					display: flex;
					.title1{
						width: 50%;
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
						padding: 16px 20px;
						box-sizing: border-box;
						border-right: 1px solid #F1EEE9;
						box-sizing: border-box;
						.font-colo{
							color: #1E90FF;
							text-decoration: underline;
							cursor: pointer;
						}
						.font-colo1{
							color: #1E90FF;
						}
						.centered-block{
							width: calc(100% - 40px);
							position:absolute;
							top:50%;
							transform:translate(0,-50%);
						}
						.centered-block1{
							width: calc(100% - 40px);
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
		width: calc(100% - 284px);
		// width: 85.2%;
		margin: 30px 30px 0 20px;
		height: 60px;
		line-height: 60px;
		position: fixed;
		bottom: 0;
		background-color: #f6f7fc;
		z-index: 1000;
		.el-pagination {
    		margin-top: 15px;
			float: right;
		}
		.content1-exports{
			margin-left: 5px;
			font-size: 14px;
			cursor: pointer;
			color: #1E90FF;
		}
		.content1-num {
			font-size: 14px;
			margin-left: 5px;
			margin-right: 5px;
		}
		.col-blue {
			color: #1E90FF;
		}
		.col-red {
			color: #f5222d;
		}
		.col-org {
			color: #DB9728;
		}
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
	.mr60 {
		margin-right: 60px;
	}
}
</style>
