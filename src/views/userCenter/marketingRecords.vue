<template>
	<div id="marketingRecords">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">客户名称</span>
						<el-autocomplete size="medium" v-model="data.companyName" :fetch-suggestions="querySearchAsync" placeholder="请输入企业名称" @select="handleSelect" class="item2" clearable ></el-autocomplete>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">服务时间</span>
						<el-date-picker size="medium" v-model="data.visitStartDate" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
						<el-date-picker size="medium" v-model="data.visitEndDate" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
					</div>
				</el-col>
				<el-col :span="8" v-if="showBranch">
					<div>
						<span class="item3">业务员</span>
						<el-input size="medium" v-model="data.name" placeholder="请输入内容" class="item2" clearable></el-input>
					</div>
				</el-col>
				<el-col :span="8" v-else>
					<div>
						<span class="item3">服务方式</span>
						<el-select size="medium" v-model="data.visitMode" placeholder="请选择服务方式" class="item2" clearable>
							<el-option v-for="item in options7" :key="item.code" :label="item.msg" :value="item.code"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8" >
					<div>
						<span class="item3">客户地区</span>
						<el-cascader size="medium" :options="options2" placeholder="请选择" change-on-select v-model="regionCoding" class="item2" clearable></el-cascader>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">服务内容</span>
						<el-select size="medium" v-model="data.visitPeriod" placeholder="请选择" @change="changeServiceCon" class="item5" clearable>
							<el-option v-for="item in options8" :key="item.code" :label="item.msg" :value="item.code"></el-option>
						</el-select>
						<el-select size="medium" v-model="data.visitCause" placeholder="请选择" class="item5" clearable>
							<el-option v-for="item in options9" :key="item.code" :label="item.msg" :value="item.code"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8" v-if="!showFlag">
					<div>
						<span class="mr60 fr" v-if="!showBranch">&nbsp;</span>
						<el-button type="text" class="mr60 fr" v-if="showFlag && showBranch" @click="showFlag = !showFlag">收起 <i class="el-icon-arrow-up"></i></el-button>
						<el-button type="text" class="mr60 fr" v-if="!showFlag && showBranch" @click="showFlag = !showFlag">展开 <i class="el-icon-arrow-down"></i></el-button>
						<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查 询</el-button>
						<el-button @click="empty" class="empty-button" size="medium" round type="info">清空条件</el-button>
					</div>
				</el-col>
				<el-col :span="8" v-if="showFlag && showBranch">
					<div>
						<span class="item3">服务方式</span>
						<el-select size="medium" v-model="data.visitMode" placeholder="请选择服务方式" class="item2" clearable>
							<el-option v-for="item in options7" :key="item.code" :label="item.msg" :value="item.code"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg" v-if="showFlag">
				<el-col :span="8" v-if="showBranch">
					<div>
						<span class="item3">分支机构</span>
						<el-select size="medium" v-model="data.orgCode" filterable placeholder="请选择" class="item2" clearable>
							<el-option v-for="(item,index) in branchList" :key="index" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
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
						<el-button @click="empty" class="empty-button" round size="medium" type="info">清空条件</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="content">
			<div class="content1">
				<el-button type="primary" v-if="datas.find(item => item.key == '70012')" @click="addRecords" round size="medium" class="w100 fr mr20 mt20 mb20">新增</el-button>
			</div>
			<div class="content-table">
				<el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit :header-cell-style="getRowClass">
					<el-table-column label="服务日期" align="center" min-width="200">
						<template slot-scope="scope">
							<p>{{scope.row.visitDate}}</p>
							<p><span class="time-style">{{scope.row.visitDuration}}小时</span></p>
						</template>
					</el-table-column>
					<el-table-column label="客户信息" align="center" min-width="300">
						<template slot-scope="scope">
							<p>{{scope.row.companyName}}</p>
							<p>{{scope.row.provinceName}}/{{scope.row.cityName}}/{{scope.row.areaName}}</p>
						</template>
					</el-table-column>
					<el-table-column label="联系人" align="center" min-width="150">
						<template slot-scope="scope">
							<p>{{scope.row.visitName}}<span v-if="scope.row.visitPost">/{{scope.row.visitPost}}</span></p>
						</template>
					</el-table-column>
					<el-table-column prop="areaCode" label="服务阶段/服务内容" align="center" min-width="300">
						<template slot-scope="scope">
							<span>{{scope.row.periodNames}}</span>
						</template>
					</el-table-column>
					<el-table-column label="服务方式" align="center" min-width="130">
						<template slot-scope="scope">
							<span>{{scope.row.visitModeName}}</span>
						</template>
					</el-table-column>
					<el-table-column label="录入时间" prop="createTime" align="center" min-width="100"></el-table-column>
					<el-table-column label="业务员" align="center" min-width="130">
						<template slot-scope="scope">
							<p>{{scope.row.name.split(',')[0]}}<span class="ml10 col-blue cur-op" @click="showPerson(scope.row.name.split(','))" v-if="scope.row.name.split(',').length > 1">共{{scope.row.name.split(',').length}}人</span></p>
							<p>{{scope.row.orgName}}</p>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" align="center" min-width="130">
						<template slot-scope="scope" type="flex">
							<el-button type="text" v-if="datas.find(item => item.key == '70013')" @click="editRecord(scope.row)">修改</el-button>
							<el-button type="text" v-if="datas.find(item => item.key == '70014')" @click="seeRecord(scope.row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="content-total">
			<span class="ml20 f14 mr10">查询结果：<span style="color:#333333;margin-right:5px">{{total}}</span>条记录</span>
			<!-- | -->
			<span class="content1-exports"  @click="exports" v-if="datas.find(item => item.key == '70015')"> <i class="el-icon-download"></i>批量导出</span>
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<el-dialog title="业务员清单" :visible.sync="dialogFormVisible"  width="30%">
			<el-table :data="personList" border>
				<el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
				<el-table-column property="perName" align="center" label="业务员姓名"></el-table-column>
			</el-table>
		</el-dialog>
		<AddRecord :area="options2" ref="AddRecord" :serviceMode="options7" :serviceContent="options8"></AddRecord>
		<RecordDetail ref="RecordDetail"></RecordDetail>
	</div>
</template>

<script>
import buttonNone from '../../../static/data/buttonNone.json'
import {elevator} from '../../server/accidenServer.js';
import ResourcesService from '../../service/ResourcesService';
import UserService from '../../service/UserService';
import buttonSelection from '@/views/businessProcessing/js/buttonSelection.js';
import CorrectionManagement from '@/service/CorrectionManagement.js';
import RidesService from '@/service/RidesService.js';
import moment from 'moment';
import AddRecord from './components/addRecord.vue'
import RecordDetail from './components/recordDetail.vue'
export default {
	components:{
		AddRecord,RecordDetail
	},
	data() {
		return {
			proSortName:'',
			Elevator:new elevator(),
			ButtonSelection:new buttonSelection(),
			ResourcesService: new ResourcesService(),
			UserService: new UserService(),
			CorrectionManagement:new CorrectionManagement(),
			RidesService: new RidesService(),
			buttonNoneData:buttonNone,
			data:{
				userCode:'',
				pn:1,
				ps:10,
				provinceCode:'',//省编码
				cityCode:'',//市编码
				areaCode:'',//区编码
				companyName: '',//企业名称(模糊搜索)
				visitStartDate: '',//拜访开始时间
				visitEndDate: '',//拜访结束时间
				name: '',//拜访人模糊搜索
				orgCode: '',//分支机构编码
				visitMode: '',//拜访方式 1-上门拜访 ,2-电话拜访,3-其他 ,4-邮寄 ,5-微信/QQ, 6-电子邮件
				visitPeriod:'',//拜访阶段 1-客户营销 2-指导自助投保 3-期内服务
				visitCause:'',//拜访事由 1-拜访、2-保险推介书、3-历史保单分析、4-产品对比 5-续保、6-事故预防、7-协助索赔
				type:'1',//拜访类型 1-企业拜访 2-行管拜访 3-个人拜访
			},
			options:[],
			options2:[],
			options22:[],
			regionCoding:[],//选择的地区
			options7:[],
			options8: [],
			options9: [],
			data1:[],
			branchList:[],
			branchList1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			exhibition:false,
			showFlag: false,
			dialogVisible:false,
			showBranch:false,
			dialogFormVisible:false,
			personList:[],
			datas:[]
		}
	},
	created(){
		sessionStorage.getItem('branchCode') == 'JT0000' ? this.showBranch = true : this.showBranch = false
		this.datas = JSON.parse(window.sessionStorage.getItem('list'));
		Promise.all([this.getDist(),this.getRides()]).then((res)=> {
			this.getVisitList();
		})
	},
	methods: {
		//获取字典表
		async getDist() {
			let res = await this.UserService.getVisitDist();
			if(res.code == '0000') {
				this.options7 = res.data.visitMode
				res.data.visitStage.forEach(i => {
					i.value = i.code;
					i.label = i.msg;
					i.children = i.group;
					i.group.forEach(t => {
						t.value = t.code;
						t.label = t.msg;
					})
				})
				this.options8 = res.data.visitStage
			}
		},
		// 设置表头样式
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
            	return 'background: #e6f7ff;color: #0050b3;'
            } else {
            	return ''
            }
        },
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
		async searchFun() {
			this.pageNum = 1;
			this.getVisitList();
		},
		async searchFun1() {
			await this.getProductList();
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
			this.options2 = this.options22;
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
		async getVisitList(){ // 获取投保单列表
			this.data.pn = this.pageNum;
			if(this.regionCoding.length == 1){
				this.data.provinceCode = this.regionCoding[0];
				this.data.cityCode = '';
				this.data.areaCode = '';
			}else if(this.regionCoding.length == 2){
				this.data.provinceCode = this.regionCoding[0];
				this.data.cityCode = this.regionCoding[1];
				this.data.areaCode = '';
			}else if(this.regionCoding.length == 3){
				this.data.provinceCode = this.regionCoding[0];
				this.data.cityCode = this.regionCoding[1];
				this.data.areaCode = this.regionCoding[2];
			}else{
				this.data.provinceCode = '';
				this.data.cityCode = '';
				this.data.areaCode = '';
			};
			if(sessionStorage.getItem('branchCode') != 'JT0000') {
				this.data.orgCode = sessionStorage.getItem('branchCode');
				this.data.userCode = sessionStorage.getItem('userCode');
			}
			let res = await this.UserService.getVisitList(this.data);
			if(res.code == '0000'){
				this.data1 = res.list ? res.list : [];
				this.total = res.total;
				if(!this.total){
					this.$message({
						message: "暂无数据！",
						type: 'warning'
					});
				} 
			}
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.getVisitList();
		},
		async exports(){ // 导出
			if(this.total <= 5000){
				let href = this.$apiUrl.EXPORTSS_VISIT +
					'?companyName=' + this.data.companyName + 
					'&name=' +this.data.name + 
					'&visitStartDate=' +this.data.visitStartDate + 
					'&visitEndDate=' +this.data.visitEndDate + 
					'&visitMode=' +this.data.visitMode + 
					'&visitPeriod=' +this.data.visitPeriod + 
					'&provinceCode=' +this.data.provinceCode + 
					'&cityCode=' +this.data.cityCode + 
					'&areaCode=' +this.data.areaCode + 
					'&visitCause=' +this.data.visitCause + 
					'&type=1' + 
					'&orgCode=' +this.data.orgCode + 
					'&userCode=' +this.data.userCode;
				// this.$logger.info(
				// 	'M1-004','',
				// 	{
				// 		'userName':window.sessionStorage.getItem('userName'),
				// 		'branchName':window.sessionStorage.getItem('branchName'),
				// 		'productCategory1':this.proSortName,
				// 		'total':this.total,
				// 	}
				// );
				this.ResourcesService.exportsViewFile(href)
				this.trackEvent('统计','导出拜访列表');
			}else{
				this.$message({
					message: "数据量过大,超过500页,请缩小查询范围！",
					type: 'warning'
				});
			}
		},
		empty(){ //清空
			this.data = {
				userCode:null,
				pn:1,
				ps:10,
				provinceCode:null,//省编码
				cityCode:null,//市编码
				areaCode:null,//区编码
				companyName: null,//企业名称(模糊搜索)
				visitStartDate: null,//拜访开始时间
				visitEndDate: null,//拜访结束时间
				name: null,//拜访人模糊搜索
				orgCode: null,//分支机构编码
				visitMode: null,//拜访方式 1-上门拜访 ,2-电话拜访,3-其他 ,4-邮寄 ,5-微信/QQ, 6-电子邮件
				visitPeriod:null,//拜访阶段 1-客户营销 2-指导自助投保 3-期内服务
				visitCause:null,//拜访事由 1-拜访、2-保险推介书、3-历史保单分析、4-产品对比 5-续保、6-事故预防、7-协助索赔
				type:'1',//拜访类型 1-企业拜访 2-行管拜访 3-个人拜访
			};
			this.regionCoding = [];
			this.pageNum = 1;
			this.currentPage = 1;
			this.data1 = [];
			this.total = 0;
			this.getVisitList();
		},
		addRecords() {
			this.$refs.AddRecord.initData();
		},
		editRecord(row) {
			this.$refs.AddRecord.initData(row.id);
		},
		seeRecord(row) {
			this.$refs.RecordDetail.initData(row.id);
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.getVisitList();
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
		},
		changeServiceCon() {
			this.options9 = [];
			this.data.visitCause = '';
			this.data.visitPeriod && this.options8.find(i => i.code == this.data.visitPeriod) ? this.options9 = this.options8.find(i => i.code == this.data.visitPeriod).group : [];
		},
		showPerson(data) {
			console.log(data)
			this.personList = [];
			data.forEach(i => {
				let obj = {
					perName:i
				}
				this.personList.push(obj)
			})
			console.log(this.personList,'---------')
			this.dialogFormVisible = true;
		}
	},
}
</script>

<style lang="less">
#marketingRecords {
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
				// color: #2491fc;
				font-weight: 500;
				// text-decoration: underline;
			}
		}
	}
	.content{
		width: calc(100% - 40px);
		margin: 20px 20px 0 20px;
		background-color: #ffffff;
		.w100 {
			width: 100px;
		}
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
			.time-style {
				background-color: #ffe7ba;
				border-radius: 13px;
				padding: 2px 6px;
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
	.col-blue {
		color: #1E90FF;
	}
	.cur-op {
		cursor: pointer;
	}
}
</style>
