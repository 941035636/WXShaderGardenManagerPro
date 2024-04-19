<template>
	<div class="elevatorStatisticsList" id="elevatorStatisticsList">
		<div class="elesearch">
			<el-form :inline="true" :model="data" class="demo-form-inline" label-width="125px">
				<el-form-item label="产品名称：">
					<el-select v-model="data.productCode" placeholder="请选择" class="item1" size="medium" clearable>
						<el-option v-for="item in options" :key="item.productCode" :label="item.productName" :value="item.productCode"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="data.type" placeholder="请选择" class="item2" size="medium" @change="changetype">
						<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-input v-model.trim="data.applicationFormCode" class="item1" size="medium" placeholder="请输入" clearable v-if="data.type == '1'"></el-input>
					<el-input v-model.trim="data.policyNo" class="item1" size="medium" placeholder="请输入" clearable v-if="data.type == '2'"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="data.types" placeholder="请选择" class="item2" size="medium" @change="changetypes">
						<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-date-picker type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable class="item1" size="medium" v-model="date1" @change="changedate"></el-date-picker>
				</el-form-item>
				<el-form-item label="电梯编号：">
					<el-input v-model.trim="data.equipmentsCode" class="item1" size="medium" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item label="电梯坐落区域：">
					<el-cascader :options="options3" placeholder="请选择" change-on-select v-model="regioncode" class="item1" size="medium" clearable></el-cascader>
				</el-form-item>
				<el-form-item label="电梯类型：">
					<el-select v-model="data.elevatorType" placeholder="请选择" class="item1" size="medium" clearable>
						<el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="使用场所：">
					<el-select v-model="data.elevatorSiteCode" placeholder="请选择" class="item1" size="medium" clearable>
						<el-option v-for="item in options5" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="检测机构：">
					<el-select class="item1" size="medium" clearable v-model="data.testOrganization" placeholder="请选择">
						<el-option label="省特检院" value="1"></el-option>
						<el-option label="市特检院" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="投保人名称：">
					<el-input v-model.trim="data.holderName" class="item1" size="medium" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item label="使用单位：">
					<el-input v-model.trim="data.useOfUnit" class="item1" size="medium" placeholder="请输入" clearable></el-input>
				</el-form-item>
			</el-form>
		</div>
		<div class="elesearch1">
			<el-button type="warning" round size="medium" @click="searchview">查询</el-button>
			<el-button type="info" round size="medium" @click="empty" class="mr40">清空</el-button>
		</div>
		<div class="content-table">
			<div class="content-export">
				<el-button class="item3" type="text" size="medium" icon="el-icon-document-checked" @click="exports" v-if="datas.find(item => item.key == '80001')">导出</el-button>
			</div>
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header fit>
				<el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
				<el-table-column property="productName" label="产品名称" align="left" min-width="140"></el-table-column>
				<el-table-column property="holderName" label="投保人名称" align="center" min-width="110"></el-table-column>
				<el-table-column property="applicationFormCode" label="投保单号" align="center" min-width="120"></el-table-column>
				<el-table-column property="policyNo" label="保单号" align="center" min-width="120"></el-table-column>
				<el-table-column property="equipmentsCode" label="电梯编号" align="center" min-width="110"></el-table-column>
				<el-table-column property="startDate" label="保险起期" align="center" width="100"></el-table-column>
				<el-table-column property="endDate" label="保险止期" align="center" width="100"></el-table-column>
				<el-table-column property="elevatorType" label="电梯类型" align="center" width="100"></el-table-column>
				<el-table-column property="elevatorSiteCode" label="使用场所" align="center" min-width="100"></el-table-column>
				<el-table-column label="重量/提升高度" align="center" min-width="120">
					<template slot-scope="scope">
						<span v-if="scope.row.height">{{scope.row.height}}m</span>
						<span v-if="scope.row.weight">{{scope.row.weight}}KG</span>
						<span v-if="!scope.row.height && !scope.row.weight">--</span>
					</template>
				</el-table-column>
				<el-table-column  label="检验机构" align="center">
                    <template slot-scope="scope">
						<span v-if="scope.row.testOrganization == '1'">省特检院</span>
						<span  v-else-if="scope.row.testOrganization == '2'">市特检院</span>
					</template>
                </el-table-column>
				<el-table-column property="elevatorYearCode" label="使用年限" align="center" min-width="100"></el-table-column>
				<el-table-column property="useOfUnit" label="使用单位名称" align="center" min-width="110"></el-table-column>
				<el-table-column property="provinceName" label="电梯所在省" align="center" min-width="100">
					<template slot-scope="scope">
						<span v-if="scope.row.provinceName">{{scope.row.provinceName}}</span>
						<span v-else>---</span>
					</template>
				</el-table-column>
				<el-table-column property="cityName" label="电梯所在市" align="center" min-width="100">
					<template slot-scope="scope">
						<span v-if="scope.row.cityName">{{scope.row.cityName}}</span>
						<span v-else>---</span>
					</template>
				</el-table-column>
				<el-table-column property="countyName" label="电梯所在区/县" align="center" min-width="120">
					<template slot-scope="scope">
						<span v-if="scope.row.countyName">{{scope.row.countyName}}</span>
						<span v-else>---</span>
					</template>
				</el-table-column>
				<el-table-column property="useOfAddress" label="电梯详细地址" align="center" min-width="110">
					<template slot-scope="scope">
						<span v-if="scope.row.useOfAddress">{{scope.row.useOfAddress}}</span>
						<span v-else>---</span>
					</template>
				</el-table-column>
				<el-table-column property="createDate" label="投保日期" align="center" min-width="100">
					<template slot-scope="scope">
						<span v-if="scope.row.createDate">{{scope.row.createDate}}</span>
						<span v-else>---</span>
					</template>
				</el-table-column>
				<el-table-column property="issueDate" label="出单日期" align="center" min-width="100">
					<template slot-scope="scope">
						<span v-if="scope.row.issueDate">{{scope.row.issueDate}}</span>
						<span v-else>---</span>
					</template>
				</el-table-column>
			 </el-table>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import StatisticService from '../../service/StatisticService.js';
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
import products from '../businessProcessing/data/dtProductList.json';
import elevatorTypes from '../../../static/data/elevatorTypes.json';
import elevatorType from '../../../static/data/elevatorType.json';
import placeUse from '../../../static/data/placeUse.json';
import ResourcesService from '../../service/ResourcesService';
export default {
	data() {
		return {
			Elevator:new elevator(),
			StatisticService: new StatisticService(),
			ButtonSelection:new buttonSelection(),
			ResourcesService: new ResourcesService(),
			data:{
			"appEndDateMax": "",
			"appStartDateMin": "",
			"applicationFormCode": "",
			"cityCode": "",
			"countyCode": "",
			"elevatorSiteCode": "",
			"elevatorType": "",
			"equipmentsCode": "",
			"insStartDateMax": "",
			"insStartDateMin": "",
			"pageNum": 1,
			"pageSize": 10,
			"policyNo": "",
			"productCode": "",
			"provinceCode": "",
			"type":"1",
			"types":'1',
			"testOrganization":'',
			"holderName":'',
			"useOfUnit":''
			},
			options:[],
			options1:[
				{
					value:"1",
					label:'投保单号'
				},
				{
					value:"2",
					label:'保单号'
				}
			],
			options2:[
				{
					value:"1",
					label:'起保日期'
				},
				{
					value:"2",
					label:'投保日期'
				}
			],
			options3:[],
			regioncode:[],
			options4:[],
			options5:[],
			date1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			data1:[],
			datas:[],
		}
	},
	created(){
		this.policyStatu();//根据权限获取配置文件
		this.getArea();
		if(window.localStorage.getItem('index') == '16'){
			this.gettingCache();
		}else{
			window.localStorage.removeItem('data');
			this.policylist();
		}
	},
	methods: {
		policyStatu(){
			this.options = [];
			this.options4 = elevatorTypes.data;
			this.options5 = placeUse.data;
			this.datas = JSON.parse(window.sessionStorage.getItem('list'));
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				this.options = products.data;
			}else{
				for(var i=0;i<products.data.length;i++){
					if(window.sessionStorage.getItem('branchCode') == products.data[i].branchCode){
						this.options.push(products.data[i]);
					};
					if(window.sessionStorage.getItem('branchCode') == 'JT0167001' || window.sessionStorage.getItem('branchCode') == 'JT0113001'){
						if(products.data[i].branchCode == 'JT0167001' || products.data[i].branchCode == 'JT0113001'){
							this.options.push(products.data[i]);
						}
					}
				}
			}
		},
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.options3 = this.ButtonSelection.Accessarea(parmes.data, window.sessionStorage.getItem('provinceCode'));
			};
		},
		changetypes(value){
			this.date1 = [];
			this.data.insStartDateMin = "";
			this.data.insStartDateMax = "";
			this.data.appStartDateMin = "";
			this.data.appEndDateMax = "";
		},
		changedate(value){
			if(!value){
				this.date1 = [];
			}
		},
		changetype(value){
			if(value == '1'){
				this.data.policyNo = '';
			}else{
				this.data.applicationFormCode = '';
			}
		},
		async policylist(){
			this.data.pageNum = this.pageNum;
			if(this.date1.length && this.data.types == '1'){
				this.data.insStartDateMin = this.date1[0] + ' ' + '00:00:00';
				this.data.insStartDateMax = this.date1[1] + ' ' + '23:59:59';
			}else if(this.date1.length && this.data.types == '2'){
				this.data.appStartDateMin = this.date1[0] + ' ' + '00:00:00';
				this.data.appEndDateMax = this.date1[1] + ' ' + '23:59:59';
			}else{
				this.data.insStartDateMin = "";
				this.data.insStartDateMax = "";
				this.data.appStartDateMin = "";
				this.data.appEndDateMax = "";
			};
			if(this.regioncode.length == 1){
				this.data.provinceCode = this.regioncode[0];
				this.data.cityCode = "";
				this.data.countyCode = "";
			}else if(this.regioncode.length == 2){
				this.data.provinceCode = this.regioncode[0];
				this.data.cityCode = this.regioncode[1];
				this.data.countyCode = "";
			}else if(this.regioncode.length == 3){
				this.data.provinceCode = this.regioncode[0];
				this.data.cityCode = this.regioncode[1];
				this.data.countyCode = this.regioncode[2];
			}else{
				if(window.sessionStorage.getItem("provinceCode") == '000000'){
					this.data.provinceCode = "";
					this.data.cityCode = "";
					this.data.countyCode = "";
				}else{
					if(window.sessionStorage.getItem("provinceCode").slice(2,4) == '00'){
						this.data.provinceCode = window.sessionStorage.getItem("provinceCode");
						this.data.cityCode = "";
						this.data.countyCode = "";
					}else{
						this.data.provinceCode = window.sessionStorage.getItem("provinceCode").slice(0,2) + '0000';
						this.data.cityCode = window.sessionStorage.getItem("provinceCode");
						this.data.countyCode = "";
					}
				}
			};
			let index = '16';
			window.localStorage.setItem('data',JSON.stringify(this.data));
			window.localStorage.setItem('index',index);
			let res = await this.StatisticService.getStatisticlist(this.data);
			if(res.code == '0000'){
				res.list.forEach(item => {
					if(item.elevatorSiteCode == 'invalidation'){
						item.elevatorSiteCode = '---'
					}
					if(!item.elevatorType){
						item.elevatorType = '---'
					}
					this.options5.forEach(ele => {
						if(item.elevatorSiteCode == ele.value){
							item.elevatorSiteCode = ele.label;
						}
					})
					elevatorType.data.forEach(ele => {
						if(item.elevatorType == ele.code){
							item.elevatorType = ele.name;
						}
					})
					if(item.elevatorYearCode && item.elevatorYearCode != 'invalidation'){
						item.elevatorYearCode = item.elevatorYearCode + '年';
					}else{
						item.elevatorYearCode = '---';
					}
				})
				this.data1 = res.list;
				this.total = res.total;
			}
		},
		gettingCache(){
			let data = JSON.parse(window.localStorage.getItem('data'));
			this.data = data;
			if(data.provinceCode){
				this.regioncode.push(data.provinceCode);
			};
			if(data.cityCode){
				this.regioncode.push(data.cityCode);
			};
			if(data.countryCode){
				this.regioncode.push(data.countyCode);
			};
			if(data.insStartDateMin){
				this.date1.push(data.insStartDateMin.split(' ')[0]);
				this.date1.push(data.insStartDateMax.split(' ')[0]);
			};
			if(data.appStartDateMin){
				this.date1.push(data.appStartDateMin.split(' ')[0]);
				this.date1.push(data.appEndDateMax.split(' ')[0]);
			};
			this.pageNum = data.pageNum;
			this.currentPage = data.pageNum;
			this.policylist();
		},
		async exports(){
			if(this.total <= 5000){
				let href = this.$apiUrl.STATISTICS_EXPORT + '?productCode=' + this.data.productCode + '&applicationFormCode=' + this.data.applicationFormCode + '&policyNo=' + this.data.policyNo + '&equipmentsCode=' + this.data.equipmentsCode + '&elevatorType=' + this.data.elevatorType + '&elevatorSiteCode=' + this.data.elevatorSiteCode + '&insStartDateMax=' + this.data.insStartDateMax + '&insStartDateMin=' + this.data.insStartDateMin + '&appEndDateMax=' + this.data.appEndDateMax + '&appStartDateMin=' + this.data.appStartDateMin + '&provinceCode=' + this.data.provinceCode + '&cityCode=' + this.data.cityCode + '&countyCode=' + this.data.countyCode + '&testOrganization=' + this.data.testOrganization + '&holderName=' + this.data.holderName;
				this.ResourcesService.exportsViewFile(href)
				this.trackEvent('统计','导出地区参保统计');

				// window.location.href = this.$apiUrl.STATISTICS_EXPORT + '?productCode=' + this.data.productCode + '&applicationFormCode=' + this.data.applicationFormCode + '&policyNo=' + this.data.policyNo + '&equipmentsCode=' + this.data.equipmentsCode + '&elevatorType=' + this.data.elevatorType + '&elevatorSiteCode=' + this.data.elevatorSiteCode + '&insStartDateMax=' + this.data.insStartDateMax + '&insStartDateMin=' + this.data.insStartDateMin + '&appEndDateMax=' + this.data.appEndDateMax + '&appStartDateMin=' + this.data.appStartDateMin + '&provinceCode=' + this.data.provinceCode + '&cityCode=' + this.data.cityCode + '&countyCode=' + this.data.countyCode + '&testOrganization=' + this.data.testOrganization + '&holderName=' + this.data.holderName;
			}else{
				this.$message({
					message: "数据量过大,超过500页,请缩小查询范围！",
						type: 'warning'
				});
			}
		},
		searchview(){
			this.pageNum = 1;
			this.currentPage = 1;
			this.policylist();
		},
		empty(){
			this.data = {
				"appEndDateMax": "",
				"appStartDateMin": "",
				"applicationFormCode": "",
				"cityCode": "",
				"countyCode": "",
				"elevatorSiteCode": "",
				"elevatorType": "",
				"equipmentsCode": "",
				"insStartDateMax": "",
				"insStartDateMin": "",
				"pageNum": 1,
				"pageSize": 10,
				"policyNo": "",
				"productCode": "",
				"provinceCode": "",
				"type":"1",
				"types":'1',
				"testOrganization":null,
				"holderName":''
			}, 
			this.pageNum = 1;
			this.currentPage = 1;
			this.date1 = [];
			this.regioncode = [];
			this.policylist();
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.policylist();
		},
	},
}
</script>

<style lang="less">
#elevatorStatisticsList {
	padding-bottom: 80px;
	background-color: #f2f1ef;
	.elesearch{
		width: 96%;
		margin-left: 2%;
		padding-top: 10px;
		margin-right: 20px;
		.item1{
			width: 270px;
		}
		.item2{
			width: 120px;
		}
	}
	.elesearch1{
		width: 96%;
		margin-left: 2%;
		text-align: right;
		margin-bottom: 20px;
		.mr40 {
			margin-right:40px;
		}
	}
	.content-table{
		width: 96%;
		margin-left: 2%;
		background-color: #ffffff;
		.content-export{
			width: 100%;
			text-align: right;
			.item3{
				font-size: 18px;
				margin:10px 40px 10px 0;
			}
		}
	}
	.content-total{
		width: 96%;
		margin-left: 2%;
		text-align: right;
	}
}
</style>
