<template>
	<div class="policy-sequip mt20">
        <div class="elesearch">
			<el-row type="flex" class="row-bg">
                 <el-col :span="8">
					<div>
						<span class="item3">设备/出厂编号：</span>
						<el-input size="medium" v-model.trim="data.eleCode" placeholder="请输入" class="item2" clearable ></el-input>
					</div>
				</el-col>
                 <el-col :span="8">
					<div>
						<span class="item3">使用单位：</span>
						<el-input size="medium" v-model.trim="data.useUnit" placeholder="请输入使用单位" class="item2" clearable ></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<el-select v-model="data.typeCode" placeholder="请选择" class="item1" @change="changeType">
							<el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-input size="medium" placeholder="请输入保单号" v-model.trim="data.policyNo" class="item2" clearable v-if="data.typeCode == '1'"></el-input>
						<el-input size="medium" placeholder="请输入批单号" v-model.trim="data.endorNo" class="item2" clearable v-else-if="data.typeCode == '2'"></el-input>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<el-select v-model="data.types" placeholder="请选择" class="item1" @change="changeTypes">
							<el-option v-for="(item,index) in options8" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-date-picker size="medium" v-if="data.types == '1'" v-model="data.startDateFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<el-date-picker size="medium" v-else v-model="data.endDateFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>

						<el-date-picker size="medium" v-if="data.types == '1'" v-model="data.startDateTo" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
						<el-date-picker size="medium" v-else v-model="data.endDateTo" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
					</div>
				</el-col>
                <el-col :span="8">
					<div>
						<span class="item3">坐落地址：</span>
						<el-cascader size="medium" :options="options2" placeholder="请选择" change-on-select v-model="regionCoding" class="item2" clearable></el-cascader>
					</div>
				</el-col>
                <el-col :span="8">
					<div>
						<span class="item3">投保人：</span>
						<el-autocomplete size="medium" v-model.trim="data.policyHolder" :fetch-suggestions="querySearchAsync" placeholder="请输入投保人" @select="handleSelect" class="item2" clearable ></el-autocomplete>
					</div>
				</el-col>
			</el-row>
            <el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">产品名称：</span>
						<el-select v-model="data.productCode" filterable placeholder="请选择" class="item2" clearable size="medium">
							<el-option v-for="(item,index) in productList" :key="index" :label="item.name" :value="item.code"></el-option>
						</el-select>
					</div>
				</el-col>
                <el-col :span="16">
					<div class="fr mr50">
						<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查 询</el-button>
						<el-button @click="empty" class="empty-button" type="text">清空条件</el-button>
					</div>
				</el-col>
            </el-row>
		</div>
        <div class="fg-line"></div>
        <div class="pd-style">
            <el-row type="flex" class="row-bg">
                <el-col :span="24">
					<div style="display:flex;justify-content:space-between">
						<div>
							<span>数据筛选：<el-button :class="[data.dataScope == '' ? 'choose-style btn-style' : 'btn-style']" round @click="search('')">全部</el-button><el-button :class="[data.dataScope == '1' ? 'choose-style btn-style' : 'btn-style']" round @click="search('1')">最终在保</el-button></span>
						</div>
						<div>
							 <el-button type="primary" round @click="exports">导出</el-button>
						</div>					
					</div>
                    <el-table :data="data1" style="width: 100%;margin-top:20px;" highlight-current-row show-header border fit :header-cell-style="getRowClass1">
						<el-table-column label="电梯使用单位" min-width="100">
                            <template slot-scope="scope">
                                <p>{{scope.row.useUnit}}</p>
                            </template>
                        </el-table-column>
						<el-table-column label="设备出厂编号/坐落地址">
                            <template slot-scope="scope">
                                <p v-if="scope.row.equipmentsCode">{{scope.row.equipmentsCode}} <span class="see-style" @click="showPersonDetail(scope.row)">查看</span></p>
                                <p v-else>{{scope.row.factoryNumber}} <span class="see-style" @click="showPersonDetail(scope.row)">查看</span></p>
                                <p>坐落地址：{{scope.row.provinceName}}<span v-if="scope.row.cityName">/{{scope.row.cityName}}</span><span v-if="scope.row.countryName">/{{scope.row.countryName}}</span></p>
                            </template>
                        </el-table-column>
						<el-table-column label="保障期间" min-width="110">
                            <template slot-scope="scope">
                                <p>{{scope.row.startDate}} 至 {{scope.row.endDate}}</p>
								<p class="col-blue1" v-if="scope.row.lostEndorNo">批改记录：{{scope.row.lostEndorNo}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="投保人" prop="policyHolder"></el-table-column>
                        <el-table-column label="类型" align="center" min-width="50">
                            <template slot-scope="scope">
                                <p>
									<span class="col-blue" v-if="scope.row.type == 0">保单</span>
									<span class="col-org" v-if="scope.row.type == 1">批增</span>
									<span class="col-org" v-if="scope.row.type == 2">批减</span>
									<span class="col-org" v-if="scope.row.type == 3">替换</span>
									<span class="col-org" v-if="scope.row.type == 4">批退</span>
									<span class="col-org" v-if="scope.row.type == 5">一般性批改</span>
								</p>
                            </template>
                        </el-table-column>
                        
                        <el-table-column label="保单号/批单号">
                            <template slot-scope="scope">
							    <p v-if="scope.row.endorNo"><span >{{scope.row.endorNo}}</span></p>
							    <p :class="[scope.row.endorNo && scope.row.policyNo ? 'col-grey' : '']">
									<span v-if="scope.row.endorNo && scope.row.policyNo">主保单：</span>
									<span v-if="scope.row.policyNo">{{scope.row.policyNo}}</span>
									<!-- <span @click="$emit('goToDetail',scope.row)" class="see-style">查看</span> -->
								</p>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="mt20" style="text-align: right;">
                        <el-pagination background  @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"> </el-pagination>
                    </div>
                </el-col>
            </el-row>
			<el-dialog title="设备信息" :visible.sync="dialogVisible1" width="30%" :before-close="handleClose" class="dialog-p">
				<div class="f14">
					<p v-if="row.useUnit" class="font-black">使用单位：{{row.useUnit}}</p>
					<p>坐落地址：<span v-if="row.provinceName">{{row.provinceName}}</span><span v-if="row.cityName">/{{row.cityName}}</span><span v-if="row.countryName">/{{row.countryName}}</span><span v-if="row.address">{{row.address}}</span></p>
					<p v-if="row.site">使用场所：{{row.site}}</p>
					<p v-if="row.equipmentsCode">设备代码：{{row.equipmentsCode}}</p>
					<p v-if="row.factoryNumber">出厂编码：{{row.factoryNumber}}</p>
					<p v-if="row.eleType">电梯类型（载重/高度）：{{row.eleType}}<span class="ml10" v-if="row.weight">载重：{{row.weight}} KG</span><span class="ml10" v-if="row.height">提升高度：{{row.height}} m</span></p>
					<p v-if="row.year">年限：{{row.year}}</p>
				</div>
			</el-dialog>
        </div>
    </div>
</template>

<script>
import {elevator} from '../../../server/accidenServer.js';
import UserService from '../../../service/UserService';
import ResourcesService from '../../../service/ResourcesService';
export default {
	name:'PolicyDetailSequip',
    props:{
        'options2':Array,
    },
	data() {
		return {
			data1:[],
            Elevator:new elevator(),
            UserService: new UserService(),
            ResourcesService: new ResourcesService(),
            currentPage: 1,
            pageSize: 10,
            total: 0,
            options: [
                {
					'value':'1',
					'label':'保单号'
				},
				{
					'value':'2',
					'label':'批单号'
				}
            ],
            options8:[
				{
					'value':'1',
					'label':'保险起期'
				},
				{
					'value':'2',
					'label':'保险止期'
				}
			],
            data: {
				pageNum:1,// (integer, optional),
   				pageSize: 10,// (integer, optional),
				eleCode: '',
				useUnit: '',
				policyNo: '',
				endorNo: '',
				startDateFrom: '',
				endDateFrom: '',
				startDateTo: '',
				endDateTo: '',
				policyHolder: '',
                typeCode: '1',
                types: '1',
				dataScope: '',
				provinceName:'',
				cityName: "",// (string, optional): 市名称 ,
				countryName: "",// (string, optional): 区/县名称 ,
				productCode:"",
				userCode:window.sessionStorage.getItem('userCode')
            },
			dialogVisible1:false,
			row: {},
			regionCoding:[],
			productList:[]
		};
	},
	computed: {
		
	},
	created() {
        
	},
	methods: {
		// 获取产品列表1
		async getprolist(){
			let areaArr = window.sessionStorage.getItem('authDataArea') && window.sessionStorage.getItem('authDataArea') != 'undefined' ? window.sessionStorage.getItem('authDataArea').split(',') : window.sessionStorage.getItem('provinceCode').split(',');
			let form = {
				'areaCodeList':areaArr,
				'classCodeList':['LB1618924476970565632'],
				'pn':1,
				'ps':100,
				'upOrDown':"0"
			};
			let res = await this.Elevator.getprolist(form);
			let {code,list} = res;
			if(code=='0000'){
				if(list){
					this.productList = list;
					if(window.sessionStorage.getItem('provinceCode') == '440000'){
						for(var i=0;i<this.productList.length;i++){
							if(this.productList[i].areaBeanList[0].areaCode == '440300'){
								this.productList.splice(i,1)
							}
						}
					}
				}else{
					this.getprolists();
				}
			}
			
		},
		// 获取产品列表2
		async getprolists(){
			let areaArr = window.sessionStorage.getItem('authDataArea') && window.sessionStorage.getItem('authDataArea') != 'undefined' ? window.sessionStorage.getItem('authDataArea').split(',') : window.sessionStorage.getItem('provinceCode').split(',');
			let form = {
				'areaCodeList':areaArr,
				'classCodeList':['LB1618924476970565632'],
				'pn':1,
				'ps':100,
				'upOrDown':"0"
			};
			let res = await this.Elevator.getprolist(form);
			let {code,list} = res;
			if(code=='0000'){
				this.productList = list;
			}
		},
        search(flag) {
			this.data.dataScope = flag;
			this.searchview();
		},
		showPersonDetail(row) {
			this.row = row;
			this.dialogVisible1 = true;
		},
		handleClose() {
			this.row = {};
			this.dialogVisible1 = false;
		},
        searchview() {
			if(this.regionCoding.length == 1){
				this.data.provinceName = this.options2.find(i => i.value == this.regionCoding[0]) ? this.options2.find(i => i.value == this.regionCoding[0]).label : '';
				this.data.cityName = '';
				this.data.countryName = '';
			}else if(this.regionCoding.length == 2){
				let proData = this.options2.find(i => i.value == this.regionCoding[0]);
				this.data.provinceName = proData ? proData.label : '';
				this.data.cityName = proData.children.find(t => t.value == this.regionCoding[1]) ? proData.children.find(t => t.value == this.regionCoding[1]).label : '';
				this.data.countryName = '';
			}else if(this.regionCoding.length == 3){
				let proData = this.options2.find(i => i.value == this.regionCoding[0]);
				let cityData = proData.children.find(t => t.value == this.regionCoding[1]);
				this.data.provinceName = proData ? proData.label : '';
				this.data.cityName = cityData ? cityData.label : '';
				this.data.countryName = cityData.children.find(t => t.value == this.regionCoding[2]) ? cityData.children.find(t => t.value == this.regionCoding[2]).label : '';
			}else{
				this.data.provinceName = '';
				this.data.cityName = '';
				this.data.countryName = '';
			};
			this.data.pageNum = 1;
			this.currentPage = 1;
			if(!this.regionCoding.length && !this.data.productCode && !this.data.eleCode && !this.data.useUnit && !this.data.policyNo && !this.data.endorNo && !this.data.startDateFrom && !this.data.endDateFrom && !this.data.startDateTo && !this.data.endDateTo && !this.data.policyHolder) {
				this.$message({
					message: '请输入至少一个查询条件',
					type: 'warning'
				});
				return 
			}
            this.policylistDT()
        },
        empty() {
			this.data = {
				eleCode: '',
				useUnit: '',
				policyNo: '',
				endorNo: '',
				startDateFrom: '',
				endDateFrom: '',
				startDateTo: '',
				endDateTo: '',
				policyHolder: '',
                typeCode: '1',
                types: '1',
				pageNum: 1,
				pageSize: 10,
				dataScope: '',
				provinceName:'',
				cityName: "",// (string, optional): 市名称 ,
				countryName: "",// (string, optional): 区/县名称 ,
				productCode:"",
				userCode:window.sessionStorage.getItem('userCode')
            };
			this.total = 0;
			this.data1 = [];
			this.regionCoding = [];
        },
        async policylistDT(){ // 获取投保单列表
			this.data.pageNum = this.currentPage;
			let res  = await this.Elevator.postSequipList(this.data);
			if(res.code == '0000' && res.list.length != 0) {
				this.total = res.total;
				this.data1 = res.list;
			} else {
				this.total = 0;
				this.data1 = [];
			}
		},
        initData() {
			if(this.productList.length == 0) {
            	this.getprolist();
			}
        },
		getRowClass1({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#101010;font-weight: 600;background-color:#e8e8e8;";
			} else {
				return "";
			}
		},
        handleCurrentChange: function(pageNum){
			this.currentPage = pageNum;
			this.policylistDT();
		},
        async querySearchAsync(queryString, cb) {
			if(!queryString){
				 cb([]);	
			}else{
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
		},
		changeType() {
			this.data.policyNo = '';
			this.data.endorNo = '';
		},
		changeTypes() {
			this.data.startDateFrom = '';
			this.data.endDateFrom = '';
			this.data.startDateTo = '';
			this.data.endDateTo = '';
		},
		async exports(){
			if(this.regionCoding.length == 1){
				this.data.provinceName = this.options2.find(i => i.value == this.regionCoding[0]) ? this.options2.find(i => i.value == this.regionCoding[0]).label : '';
				this.data.cityName = '';
				this.data.countryName = '';
			}else if(this.regionCoding.length == 2){
				let proData = this.options2.find(i => i.value == this.regionCoding[0]);
				this.data.provinceName = proData ? proData.label : '';
				this.data.cityName = proData.children.find(t => t.value == this.regionCoding[1]) ? proData.children.find(t => t.value == this.regionCoding[1]).label : '';
				this.data.countryName = '';
			}else if(this.regionCoding.length == 3){
				let proData = this.options2.find(i => i.value == this.regionCoding[0]);
				let cityData = proData.children.find(t => t.value == this.regionCoding[1]);
				this.data.provinceName = proData ? proData.label : '';
				this.data.cityName = cityData ? cityData.label : '';
				this.data.countryName = cityData.children.find(t => t.value == this.regionCoding[2]) ? cityData.children.find(t => t.value == this.regionCoding[2]).label : '';
			}else{
				this.data.provinceName = '';
				this.data.cityName = '';
				this.data.countryName = '';
			};
			
			if(!this.regionCoding.length && !this.data.productCode && !this.data.eleCode && !this.data.useUnit && !this.data.policyNo && !this.data.endorNo && !this.data.startDateFrom && !this.data.endDateFrom && !this.data.startDateTo && !this.data.endDateTo && !this.data.policyHolder) {
				this.$message({
					message: '请输入至少一个查询条件',
					type: 'warning'
				});
				return 
			}
			let data = {
				...this.data
			}
			delete data.pageNum
			delete data.pageSize
			this.ResourcesService.exportsViewFile(this.$apiUrl.ELEVATOREXPORT,data)
		},
	}
};
</script>

<style lang="less">
.policy-sequip {
	.el-dialog__title {
		color: #000000;
    	font-weight: bold;
		font-size: 16px;
	}
	.dialog-p {
		p {
			margin-bottom: 10px;
		}
		.font-black {
			color: #000000;
    		font-weight: bold;
		}
	}
	.choose-style {
		color: #e6a23c;
		background-color: #ffe7ba;
	}
	.btn-style {
		border-color: #ffa940;
		border-width: 1px;
		border-style: solid;
		color: #fa8c16;
	}
	.pd-style {
		.el-button:hover {
			color: #e6a23c;
			border-color: #ffa940;
			background-color: #ffe7ba;
		}
	}
}
</style>
