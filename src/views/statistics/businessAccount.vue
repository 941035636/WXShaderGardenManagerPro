<template>
	<div class="businessAccount" id="businessAccount">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<el-select v-model="data.typePerson" placeholder="请选择" class="item1">
							<el-option v-for="(item,index) in options1" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-input size="medium" placeholder="请输入" v-model.trim="data.policyHolder" class="item2" clearable v-if="data.typePerson == '1'"></el-input>
						<el-input size="medium" placeholder="请输入" v-model.trim="data.insured" class="item2" clearable v-else-if="data.typePerson == '2'"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<el-select v-model="data.typeNum" placeholder="请选择" class="item1">
							<el-option v-for="item in options" :key="item.productCode" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-input size="medium" placeholder="请输入" v-model.trim="data.policyNo" class="item2" clearable v-if="data.typeNum == '1'"></el-input>
						<el-input size="medium" placeholder="请输入" v-model.trim="data.endorNo" class="item2" clearable v-else-if="data.typeNum == '2'"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">行业分类：</span>
						<el-cascader filterable size="medium" :options="channelData" placeholder="请选择" change-on-select v-model="regionCodingHY" class="item2" clearable></el-cascader>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<el-select v-model="data.typeDate" placeholder="请选择" class="item1">
							<el-option v-for="item in options8" :key="item.productCode" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-date-picker size="medium" v-if="data.typeDate == '1'" v-model="data.startDateFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
						<el-date-picker size="medium" v-else-if="data.typeDate == '2'" v-model="data.endDateFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
						<el-date-picker size="medium" v-else-if="data.typeDate == '3'" v-model="data.issueDateFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
						<el-date-picker size="medium" v-else v-model="data.applyDateFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>

						<el-date-picker size="medium" v-if="data.typeDate == '1'" v-model="data.startDateTo" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
						<el-date-picker size="medium" v-else-if="data.typeDate == '2'" v-model="data.endDateTo" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
						<el-date-picker size="medium" v-else-if="data.typeDate == '3'" v-model="data.issueDateTo" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
						<el-date-picker size="medium" v-else v-model="data.applyDateTo" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">保险机构：</span>
						<el-select size="medium" v-model="data.insuranceCompanyName" filterable placeholder="请选择" class="item2" clearable>
							<el-option v-for="(item,index) in companyList" :key="index" :label="item" :value="item"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8" v-if="showFlag">
					<div>
						<span class="item3">所在区域：</span>
						<el-cascader filterable size="medium" :options="options2" placeholder="请选择" change-on-select v-model="regionCoding" class="item2" clearable></el-cascader>
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
			</el-row>
			<el-row type="flex" class="row-bg" v-if="showFlag">
				<el-col :span="8">
					<div>
						<span class="item3">业务机构：</span>
						<el-select size="medium" v-model="data.branchCode" filterable placeholder="请选择" class="item2" clearable>
							<el-option v-for="(item,index) in branchList" :key="index" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">产品名称：</span>
						<el-select size="medium" v-model="data.productName" placeholder="请选择下单渠道" class="item2" filterable clearable>
							<el-option v-for="(item,index) in options7" :key="index" :label="item" :value="item"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">保单/批单：</span>
						<el-select size="medium" v-model="data.type" placeholder="请选择" class="item2" clearable>
							<el-option v-for="item in options6" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg" v-if="showFlag">
				<el-col :span="8">
					<div>
						<span class="item3">有无案件：</span>
						<el-select size="medium" v-model="data.hasCase" placeholder="请选择" class="item2" clearable>
							<el-option v-for="(item,index) in options9" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
				
			</el-row>
			<el-row type="flex" class="row-bg" v-if="showFlag">
				<el-col :span="8">
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
			<div class="content-table mt10">
				<div class="fr">
					<el-button type="primary" class="mt10 mb10" @click="exportList" round>导 出</el-button>
				</div>
				<el-table :data="data1" :header-cell-style="getRowClass" border>
					<el-table-column  type="index" label="序号" align="center" width="80"></el-table-column>
					<el-table-column label="保险信息" align="left" width="450">
						<template slot-scope="scope">
							<p v-if="scope.row.endorNo">批单号：{{scope.row.endorNo}}</p>
							<p>保单号：{{scope.row.policyNo}}</p>
							<p>保险期间：{{scope.row.startDate}}-{{scope.row.endDate}}</p>
							<p>签单日期：{{scope.row.issueDate}}</p>
							<p>保险机构：{{scope.row.insuranceCompanyName}}</p>
							<p>操作日期：{{scope.row.applyDate}}</p>
							<p>
								<span class="type-style" v-if="scope.row.type == '0'">{{scope.row.typeName}}</span>
								<span class="type-style bg-ccc" v-else>{{scope.row.typeName}}</span>
								<span class="cate-style" v-if="scope.row.tradeCategory1">{{scope.row.tradeCategory1}}/{{scope.row.tradeCategory2}}</span>
								<span class="type-style bg-58A55C" v-if="scope.row.hasCase && !scope.row.endorNo">  有案件（{{scope.row.caseCount}}）</span>
								<span v-if="scope.row.hasCase && !scope.row.endorNo" @click="seeCaseList(scope.row)" class="see-list">查看</span>
								<span class="type-style bg-ccc" v-if="!scope.row.hasCase && !scope.row.endorNo">无案件</span>
							</p>
						</template>
					</el-table-column>
					<el-table-column label="投保人/被保人" align="left">
						<template slot-scope="scope">
							<p>投保人：{{scope.row.policyHolder}}</p>
							<p v-if="scope.row.insured">被保人：{{scope.row.insured}}</p>
							<p v-else>被保人：--</p>
							<p>所在区域：{{scope.row.provinceName}}<span v-if="scope.row.cityName">/{{scope.row.cityName}}</span><span v-if="scope.row.countryName">/{{scope.row.countryName}}</span></p>
						</template>
					</el-table-column>
					<el-table-column label="费用/简单赔付率/标的信息" align="left">
						<template slot-scope="scope">
							<p>实收保费：<span class="col-red" v-if="scope.row.prem">￥{{scope.row.prem.toFixed(2)}}</span><span class="col-red" v-else>0</span></p>
							<p v-if="!scope.row.endorNo">简单赔付率：<span>{{scope.row.lossRatio ? scope.row.lossRatio : '0.00%'}}</span></p>
							<p>累计责任限额：<span>{{scope.row.amount/10000 > 1 ? scope.row.amount/10000 + '万元' : scope.row.amount + '元'}}</span></p>
							<p>
								<span v-if="scope.row.subjectType == '1'">电梯</span>
								<span v-if="scope.row.subjectType == '2'">人员</span>
								<span v-if="scope.row.subjectType == '3'">索道</span>
								<span v-if="scope.row.subjectType == '4'">物业</span>
								<span v-if="scope.row.subjectType == '5'">人员</span>
								<span v-if="scope.row.subjectType == '6'">项目</span>
								/
								<span v-if="scope.row.subjectType == '1'">
									<span v-if="scope.row.insuranceObjectCount != 0">共 {{scope.row.insuranceObjectCount}} 台 
										<span @click="seeList('dt',scope.row)" class="see-list">查看明细</span>
									</span><span class="col-org" v-else>无清单</span>
								</span>
								<span v-else-if="scope.row.subjectType == '2'">
									<span v-if="scope.row.insuranceObjectCount != 0">共 {{scope.row.insuranceObjectCount}} 人 
										<span @click="seeList('gz',scope.row)" class="see-list">查看明细</span>
									</span><span class="col-org" v-else>无清单</span>
								</span>
								<span v-else-if="scope.row.subjectType == '5'">
									<span v-if="scope.row.insuranceObjectCount-1 != 0">共 {{scope.row.insuranceObjectCount-1}} 人 
										<span @click="seeList('gz',scope.row)" class="see-list">查看明细</span>
									</span><span class="col-org" v-else>无清单</span>
								</span>
								<span v-else>
									<span v-if="scope.row.insuranceObjectCount != 0">共 {{scope.row.insuranceObjectCount}} 个
										<!-- <span @click="seeList('gz',scope.row)" class="see-list">查看清单</span> -->
									</span><span class="col-org" v-else>无清单</span>
								</span>
							</p>
						</template>
					</el-table-column>
					<el-table-column label="业务归属" align="left">
						<template slot-scope="scope">
							<p>{{scope.row.branchName}}</p>
							<p>{{scope.row.productName}}</p>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<el-dialog title="标的记录" :visible.sync="dialogVisible" width="50%">
			<el-table :data="dataSequip" style="width: 100%;margin-top:10px;" v-if="showType == 'dt'" show-header border  :header-cell-style="getRowClass">
				<el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
				<el-table-column label="设备信息">
					<template slot-scope="scope">
						<p>使用单位：<span v-if="scope.row.useUnit">{{scope.row.useUnit}}</span><span v-else>--</span></p>
						<p>坐落地址：{{scope.row.provinceName}}<span v-if="scope.row.cityName">/{{scope.row.cityName}}</span><span v-if="scope.row.countryName">/{{scope.row.countryName}}</span><span v-if="scope.row.lngAndLag" class="col-blue">（有坐标）</span></p>
						<p>设备/出厂编号：
							<span v-if="scope.row.equipmentsCode">{{scope.row.equipmentsCode}}</span>
							<span v-else>{{scope.row.factoryNumber}}</span>
						</p>
					</template>
				</el-table-column>
				<el-table-column label="类型（载重/高度）/年限" align="center" width="180">
					<template slot-scope="scope">
						<p v-if="scope.row.year" class="col-blue">{{scope.row.year}} 年</p>
						<p v-else>{{scope.row.eleType}} <span v-if="scope.row.weight">（{{scope.row.weight}}kg）</span><span v-else-if="scope.row.height">（{{scope.row.height}}m）</span></p>
					</template>
				</el-table-column>
				<el-table-column label="使用场所">
					<template slot-scope="scope">
						<p>{{scope.row.site}} </p>
					</template>
				</el-table-column>
			</el-table>
			<el-table :data="dataSequip" style="width: 100%;margin-top:10px;" v-if="showType == 'gz'"  show-header border  :header-cell-style="getRowClass">
				<el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
				<el-table-column label="姓名" min-width="50">
					<template slot-scope="scope">
						<p>{{scope.row.name}}</p>
					</template>
				</el-table-column>
				<el-table-column prop="licenceNo" label="证件类型">
					<template slot-scope="scope">
						<p v-if="scope.row.licenceType == 1">中国居民身份证</p>
						<p v-if="scope.row.licenceType == 2">护照</p>
						<p v-if="scope.row.licenceType == 3">澳门身份证</p>
						<p v-if="scope.row.licenceType == 4">军官证</p>
					</template>
				</el-table-column>
				<el-table-column prop="licenceNo" label="证件号">
					<template slot-scope="scope">
						<p>{{scope.row.licenceNo}}</p>
					</template>
				</el-table-column>
				<el-table-column label="岗位">
					<template slot-scope="scope">
						<p>{{scope.row.post}}</p>
					</template>
				</el-table-column>
				<el-table-column label="有无工伤保险" align="center">
					<template slot-scope="scope">
						<p v-if="scope.row.isInsured == '1'">有工伤保险</p>
						<p v-else-if="scope.row.isInsured == '0'">无工伤保险</p>
						<p v-else>--</p>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
		<el-dialog title="案件查看" :visible.sync="dialogVisibleCase" width="50%">
			<div style="display:flex;justify-content: space-between;">
				<div>
					<span>共{{dataCase.length}}条记录</span><span class="col-red">（最多展示500条记录）</span>
				</div>
				<div>
					<span>保单保费+批单保费：{{currentDataDetails.totalPrem}}；</span><span>简单赔付率：{{currentDataDetails.lossRatio}}</span>
				</div>
			</div>
			<el-table :data="dataCase" style="width: 100%;margin-top:10px;" show-header border  :header-cell-style="getRowClass">
				<el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
				<el-table-column label="报案号" prop="reportNo">
				</el-table-column>
				<el-table-column label="案件状态" align="center"  prop="caseProgressName" width="180">
				</el-table-column>
				<el-table-column label="赔付金额" prop="totalPayAmount" align="right">
				</el-table-column>
				<el-table-column label="估损金额" prop="estimatedAmount" align="right">
				</el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
import channelData from '../../../static/data/channel.json'
import {elevator} from '../../server/accidenServer.js';
import StatisticService from '../../service/StatisticService';
import CorrectionManagement from '@/service/CorrectionManagement.js';
import ResourcesService from '@/service/ResourcesService.js';
import RidesService from '@/service/RidesService.js';
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
import CaseServiceNew from '@/service/CaseServiceNew'
import moment from 'moment';
export default {
	components:{
	},
	data() {
		let defaultDate = new Date(new Date().setFullYear((new Date().getFullYear()-1))).setDate((new Date(new Date().setFullYear((new Date().getFullYear()-1))).getDate()-1));
		return {
			proSortName:'',
			Elevator:new elevator(),
			StatisticService: new StatisticService(),
			CorrectionManagement:new CorrectionManagement(),
			RidesService: new RidesService(),
			ButtonSelection:new buttonSelection(),
			ResourcesService: new ResourcesService(),
			data:{
				"typeDate": '1',
				"typePerson": '1',
				"typeNum": '1',
				"applyDateFrom": "",
				"applyDateTo": "",
				"branchCode": "",//分支机构编码
				"branchName": "",//分支机构名称
				"cityCode": "",//市编码 ,
				"cityName": "",//市名称
				"countryCode": "",//区编码
				"countryName": "",//区名称
				"endDateFrom": "",
				"endDateTo": "",
				"endorNo": "",//批单号
				"insuranceCompanyCode": "",//保险公司编码
				"insuranceCompanyName": "",//保险公司名称
				"insured": "",//被保人名称
				"insuredNo": "",//被保人证件号
				"issueDateFrom": "",
				"issueDateTo": "",
				"pageNum": 1,
				"pageSize": 10,
				"policyHolder": "",//投保人名称
				"policyHolderNo": "",//投保人证件号
				"policyNo": "",//保单号
				"productCode": "",//产品编码
				"productName": "",//产品名称
				"provinceCode": "",//省编码
				"provinceName": "",//省名称
				"startDateFrom": "",
				"startDateTo": "",
				"tradeCategory1": "",//行业分类1
				"tradeCategory2": "",//行业分类2
				"hasCase": "",//有无案件
				"type": "",//类型：0保单 1批增 2批减 3替换 4批退 5一般性批改
				"userCode": window.sessionStorage.getItem('userCode'),
			},
			options:[
				{
					"value":"1",
					"label":"保单号"
				},
				{
					"value":"2",
					"label":"批单号"
				}
			],
			options1:[
				{
					'value':'1',
					'label':'投保人名称'
				},
				{
					'value':'2',
					'label':'被保人名称'
				}
			],
			options3:[],
			options33:[],
			options2:[],
			options22:[],
			regionCoding:[],//选择的地区
			regionCodingHY:[],//选择的行业分类
			options6:[
				{
					'value':'0',
					'label':'保单'
				},
				{
					'value':'1',
					'label':'批增'
				},
				{
					'value':'2',
					'label':'批减'
				},
				{
					'value':'3',
					'label':'替换'
				},
				{
					'value':'4',
					'label':'批退'
				},
				{
					'value':'5',
					'label':'一般性批改'
				}
			],
			options7:[],
			options8:[
				{
					'value':'1',
					'label':'保险起期'
				},
				{
					'value':'2',
					'label':'保险止期'
				},
				{
					'value':'3',
					'label':'签单日期'
				},
				{
					'value':'4',
					'label':'操作日期'
				}
			],
			options9:[
				{
					'value':true,
					'label':'有案件'
				},
				{
					'value':false,
					'label':'无案件'
				}
			],
			// productCategory:sortData.dataProductCategory1,
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
			dialogVisibleCase:false, // 案件查看
			data2:{},
			totalEquipmentCount:0,
			totalPrem:0,
			showBranch:false,
			productList:[],
			channelData: channelData.hYCategory,
			companyList: [],
			dataSequip:[],
			dataCase:[],
			currentDataDetails:{},
			showType:''
		}
	},
	created(){
		sessionStorage.getItem('branchCode') == 'JT0000' ? this.showBranch = true : this.showBranch = false
		Promise.all([this.getList(),this.getComList(),this.getRides()]).then((res)=> {
			this.policylist();
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
					// this.setRides();
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
		// 产品名称查询
		async getList(){ 
			let res = await this.StatisticService.getProductName();
			if(res.code == '0000' && res.data.length != 0){
				this.options7 = res.data;
			}
		},
		//保险机构查询
		async getComList(){ 
			let res = await this.StatisticService.getCompanyList();
			if(res.code == '0000' && res.data.length != 0){
				this.companyList = res.data;
			}
		},
		async searchFun() {
			this.pageNum = 1;
			this.policylist();
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
			// if(window.sessionStorage.getItem('provinceCode') == '000000' || window.sessionStorage.getItem('branchCode') == 'JT0000') {
				this.options2 = this.options22;
			// } else {
			// 	this.options2 = this.ButtonSelection.Accessarea(this.options22, window.sessionStorage.getItem('provinceCode'));
			// }
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
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.policylist();
		},
		async policylist(){ // 获取投保单列表
			this.data.pageNum = this.pageNum;
			if(this.data.typeNum == '1'){
				this.data.endorNo = '';
			}else if(this.data.typeNum == '2'){
				this.data.policyNo = '';
			}else{
				this.data.policyNo = '';
				this.data.endorNo = '';
			}
			if(this.data.typePerson == '1'){
				this.data.insured = '';
			}else if(this.data.typePerson == '2'){
				this.data.policyHolder = '';
			}else{
				this.data.policyHolder = '';
				this.data.insured = '';
			}
			if(this.regionCodingHY.length == 1){
				this.data.tradeCategory1 =  this.channelData.find(i => i.value == this.regionCodingHY[0]).label;
				this.data.tradeCategory2 = '';
			}else if(this.regionCodingHY.length == 2){
				let hydata = this.channelData.find(i => i.value == this.regionCodingHY[0]);
				this.data.tradeCategory1 = hydata.label;
				this.data.tradeCategory2 = hydata.children.find(i => i.value == this.regionCodingHY[1]).label;
			}else{
				this.data.tradeCategory1 = '';
				this.data.tradeCategory2 = '';
			};
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
			if(this.data.typeDate == '1'){	
				this.data.startDateFrom = this.data.startDateFrom ? moment(this.data.startDateFrom).format('YYYY-MM-DD 00:00:00') : '';
				this.data.startDateTo = this.data.startDateTo ? moment(this.data.startDateTo).format('YYYY-MM-DD 23:59:59') : '';
				this.data.endDateFrom = '';
				this.data.issueDateFrom = '';
				this.data.applyDateFrom = '';
				this.data.endDateTo = '';
				this.data.issueDateTo = '';
				this.data.applyDateTo = '';
			}else if(this.data.typeDate == '2'){
				this.data.endDateFrom = this.data.endDateFrom ? moment(this.data.endDateFrom).format('YYYY-MM-DD 00:00:00') : '';
				this.data.endDateTo = this.data.endDateTo ? moment(this.data.endDateTo).format('YYYY-MM-DD 23:59:59') : '';
				this.data.startDateFrom = '';
				this.data.startDateTo = '';
				this.data.issueDateFrom = '';
				this.data.applyDateFrom = '';
				this.data.issueDateTo = '';
				this.data.applyDateTo = '';
			}else if(this.data.typeDate == '3'){
				this.data.endDateFrom = '';
				this.data.endDateTo = '';
				this.data.startDateFrom = '';
				this.data.startDateTo = '';
				this.data.issueDateFrom = this.data.issueDateFrom ? moment(this.data.issueDateFrom).format('YYYY-MM-DD 00:00:00') : '';
				this.data.issueDateTo = this.data.issueDateTo ? moment(this.data.issueDateTo).format('YYYY-MM-DD 23:59:59') : '';
				this.data.applyDateFrom = '';
				this.data.applyDateTo = '';
			} else if(this.data.typeDate == '4'){
				this.data.endDateFrom = '';
				this.data.endDateTo = '';
				this.data.startDateFrom = '';
				this.data.startDateTo = '';
				this.data.issueDateFrom = '';
				this.data.issueDateTo = '';
				this.data.applyDateFrom = this.data.applyDateFrom ? moment(this.data.applyDateFrom).format('YYYY-MM-DD 00:00:00') : '';
				this.data.applyDateTo = this.data.applyDateTo ? moment(this.data.applyDateTo).format('YYYY-MM-DD 23:59:59') : '';
			}else {
				this.data.endDateFrom = '';
				this.data.endDateTo = '';
				this.data.startDateFrom = '';
				this.data.startDateTo = '';
				this.data.issueDateFrom = '';
				this.data.issueDateTo = '';
				this.data.applyDateFrom = '';
				this.data.applyDateTo = '';
			}
			let res = await this.StatisticService.getAccountList(this.data);
			if(res.code == '0000' && res.list.length != 0){
				res.list.forEach(i => {
					i.typeName = this.options6.find(t => t.value == i.type ) ? this.options6.find(t => t.value == i.type ).label : '';
				})
				this.data1 = res.list;
				this.total = res.total;
			} else {
				this.data1 = [];
				this.total = 0;
				this.$message({
					message: '暂无数据！',
					type: 'warning'
				});
			}
			
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.policylist();
		},
		async exportList(){ // 导出
			if(this.total <= 5000){
				let formData = JSON.parse(JSON.stringify(this.data)) 
				let href = this.$apiUrl.EXPORTACCOUNT +
					'?applyDateFrom=' + formData.applyDateFrom + 
					'&branchCode=' + formData.branchCode + 
					'&applyDateTo=' +formData.applyDateTo + 
					'&cityCode=' +formData.cityCode + 
					'&countryCode=' +formData.countryCode + 
					'&endDateFrom=' +formData.endDateFrom + 
					'&endDateTo=' +formData.endDateTo + 
					'&endorNo=' +formData.endorNo + 
					'&insuranceCompanyName=' +formData.insuranceCompanyName + 
					'&insured=' +formData.insured + 
					'&issueDateFrom=' +formData.issueDateFrom + 
					'&issueDateTo=' +formData.issueDateTo + 
					'&policyHolder=' +formData.policyHolder + 
					'&policyNo=' +formData.policyNo + 
					'&productName=' +formData.productName + 
					'&provinceCode=' +formData.provinceCode + 
					'&startDateFrom=' +formData.startDateFrom + 
					'&startDateTo=' +formData.startDateTo + 
					'&tradeCategory1=' +formData.tradeCategory1 + 
					'&tradeCategory2=' +formData.tradeCategory2 + 
					'&type=' + formData.type +
					'&hasCase=' + formData.hasCase +
					'&userCode='+ window.sessionStorage.getItem('userCode');
				this.ResourcesService.exportsViewFile(href)
				this.trackEvent('统计','导出业务台账');
			}else{
				this.$message({
					message: "数据量过大,超过500页,请缩小查询范围！",
					type: 'warning'
				});
			}
		},
		empty(){ //清空
			this.data = {
				"typeDate": '1',
				"typePerson": '1',
				"typeNum": '1',
				"applyDateFrom": "",
				"applyDateTo": "",
				"branchCode": "",//分支机构编码
				"branchName": "",//分支机构名称
				"cityCode": "",//市编码 ,
				"cityName": "",//市名称
				"countryCode": "",//区编码
				"countryName": "",//区名称
				"endDateFrom": "",
				"endDateTo": "",
				"endorNo": "",//批单号
				"insuranceCompanyCode": "",//保险公司编码
				"insuranceCompanyName": "",//保险公司名称
				"insured": "",//被保人名称
				"insuredNo": "",//被保人证件号
				"issueDateFrom": "",
				"issueDateTo": "",
				"pageNum": 1,
				"pageSize": 10,
				"policyHolder": "",//投保人名称
				"policyHolderNo": "",//投保人证件号
				"policyNo": "",//保单号
				"productCode": "",//产品编码
				"productName": "",//产品名称
				"provinceCode": "",//省编码
				"provinceName": "",//省名称
				"startDateFrom": "",
				"startDateTo": "",
				"tradeCategory1": "",//行业分类1
				"tradeCategory2": "",//行业分类2
				"hasCase": "",//有无案件
				"type": "",//类型：0保单 1批增 2批减 3替换 4批退 5一般性批改
				"userCode": window.sessionStorage.getItem('userCode'),
			};
			this.regionCoding = [];
			this.regionCodingHY = [];
			this.searchFun();
		},
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#101010;font-weight: 600;background-color:#e8e8e8;";
			} else {
				return "";
			}
		},
		async seeList(flag,row) {
			let obj = {
				policyId: row.id,
				pageNum: 1,
				pageSize: 500,
				policyNo:row.endorNo ? '' : row.policyNo,
				endorNo:row.endorNo,
			}
			let res;
			if(flag == 'dt') {
				res  = await this.Elevator.postSequipList(obj);
			} else if(flag == 'gz') {
				res  = await this.Elevator.postEmployeeList(obj);
			}
			if(res.code == '0000' && res.list.length != 0) {
				this.dataSequip = res.list
				this.showType = flag;
				this.dialogVisible = true;
			} else if(res.list.length == 0) {
				this.$message({
					message: "本产品不支持清单。",
					type: 'warning'
				});
			}
		},
		async seeCaseList(row) {
			this.currentDataDetails = row
			this.currentDataDetails.totalPrem = row && row.totalPrem ?`${this.$stringHelper.formatMoney(row.totalPrem)}元`:'-'
			let obj = {
				"reportNo":"",
				"inscompReportNo ":"",
				"accidentType":"",
				"insuredCompany":"",
				"policyNo":row.policyNo,
				"insuredMunicipalDistrict":"",
				"reportTimeEnd":"",
				"reportTimeStart":"",
				"riskTimeStart":"",
				"risktTimeEnd":"",
				"industry":"",
				"productName":"",
				"issueCompanyName":"",
				"serverOrganization":"",
				"serverName":"",
				"targetParam":{
					"targetId":"",
					"targetType":"人员证件号"
				},
				"caseProgress":[101,201,301,401,403,404,405],
				"page":1,
				"pageSize":500,
				"platform":"",
				"serverDepartment":"",
				"riskTimeEnd":"",
				"productCategory":"",
				"type":"list"
			}
			let sequipService = new CaseServiceNew()
			let {code,data} = await sequipService.getCaseAccountPage(obj)
			if(code==='0000') {
				
				this.dataCase = data.list.map(item=>{
					let obj  = {
						reportNo:item.caseInfo.reportNo,
						caseProgressName:item.caseInfo.caseProgressName,
						estimatedAmount:item.claimInfo && item.claimInfo.estimatedAmount?`${this.$stringHelper.formatMoney(item.claimInfo.estimatedAmount)}元`:'-',
						totalPayAmount:item.endCaseInfo && item.endCaseInfo.totalPayAmount?`${this.$stringHelper.formatMoney(item.endCaseInfo.totalPayAmount)}元`:'-',
					}
					return obj
				})
				this.dialogVisibleCase = true;
			}
		},
	},
}
</script>

<style lang="less">
#businessAccount {
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
			width: 80px;
			border: 1px solid #E6A23C;
			color:#E6A23C;
		}
		.el-button--warning {
			background-color: #ffe7ba;
		}
		.is-round {
			padding: 8px 22px;
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
			.type-style {
				color: #fff;
				background-color: #40a9ff;
				border-radius: 8px;
    			padding: 0px 8px;
			}
			.bg-58A55C {
				background-color: #58A55C;
			}
			.bg-ccc {
				background-color: #919191;
			}
			.cate-style {
				color: #fff;
				background-color: #ffa940;
				border-radius: 8px;
    			padding: 0px 8px;
			}
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
	.col-red {
		color: #f5222d;
	}
	.col-org {
		color: #DB9728;
	}
	.see-list {
		cursor: pointer;
		text-decoration: underline;
		color: #096dd9;
		margin-left: 10px;
	}
	.col-blue {
		color: #1E90FF;
	}
}
</style>
