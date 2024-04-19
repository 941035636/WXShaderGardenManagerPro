<template>
	<div class="caseSynchro" id="caseSynchro">
		<div class="elesearch">
			<el-row class="mb20">
				<el-col :span="8" v-if="showBranch">
					<span class="text-left">分支机构:</span>
					<el-select v-model="formInline.branchCode" filterable placeholder="请选择" size="medium" clearable>
						<el-option v-for="item in branchList" :key="item.jtBranchCode" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
					</el-select>
				</el-col>
				<el-col :span="8">
					<span class="text-left">报案号:</span>
					<el-input v-model="formInline.reportNo" placeholder="请输入报案号" size="medium"></el-input>
				</el-col>
				<el-col :span="8">
					<div class="item3 fr">
						<el-button type="warning" round size="small" @click="searchview">查询</el-button>
						<el-button type="info" round size="small" @click="empty" class="mr10">重置</el-button>
						<el-button type="text" class="mr40 col-org" v-if="showFlag" @click="showFlag = !showFlag">展开 <i class="el-icon-arrow-up"></i></el-button>
						<el-button type="text" class="mr40 col-org" v-if="!showFlag" @click="showFlag = !showFlag">收起 <i class="el-icon-arrow-down"></i></el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="content-table">
			<div class="content1">
				<div class="contoent1-btn">
					<el-button class="contoent1-btn-left"  type="primary" size="small" @click="chooseCase">批量同步</el-button>
				</div>
			</div>
			<el-table ref="multipleTable" :data="dataCaseList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="reportNo" label="报案号"></el-table-column>
				<el-table-column label="报案人">
					<template slot-scope="scope">{{scope.row.reportName}} <span v-if="scope.row.reportPhone">（{{scope.row.reportPhone}}）</span></template>
				</el-table-column>
				<el-table-column prop="reportTime" label="报案时间"></el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope"><span style="color:#FA8C16">{{scope.row.reportStatusName}}<span v-if="scope.row.substate == '1'" style="color:#f5222d">  (中止)</span></span></template>
				</el-table-column>
				<el-table-column prop="branchName" label="所属分支机构"></el-table-column>
				<el-table-column label="服务人员">
					<template slot-scope="scope">{{scope.row.servicerName}} <span v-if="scope.row.servicerPhone">（{{scope.row.servicerPhone}}）</span></template>
				</el-table-column>
				<el-table-column label="最近同步">
					<template slot-scope="scope"><span @click="openRecord(scope.row)">{{scope.row.synTimeLast}}</span></template>
				</el-table-column>
  			</el-table>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<record ref="record"></record>
	</div>
</template>

<script>
import {elevator} from '@/server/accidenServer.js';
import CaseService from '@/service/CaseService.js';
import CorrectionManagement from '@/service/CorrectionManagement.js';
import ResourcesService from '@/service/ResourcesService.js';
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
import paymentStatus from '../../../static/data/paymentStatus.json';
import placeSinglechannel from '../../../static/data/placeSinglechannel.json';
import jiaZhengUserType from '../../../static/data/jiaZhengUserType.json';
import divisor from '@/global/divisor.json';
import ProductService from '@/service/ProductService.js';
import store from '@/store/index'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import moment from 'moment'
import RelatedPolicyData from './js/RelatedPolicyData.js';
import record from './components/Record'
import {GetBaseData} from '../../mixins/GetBaseData'
export default {
	mixins:[GetBaseData],
	components: {
        record
    },
	data() {
		return {
			Elevator:new elevator(),
			caseService: new CaseService(),
			ButtonSelection:new buttonSelection(),
			ResourcesService:new ResourcesService(),
			CorrectionManagement:new CorrectionManagement(),
			productService: new ProductService(),
			RelatedPolicyData:new RelatedPolicyData(),
			multipleSelection:[],
			showFlag: true,
			formInline:{
				reportNo:null,
				branchCode:null,
				pn:1,
				ps:50,
			},
			labelPosition:'right',
			data1:[],
			dataCaseList:[],
			total:0,
			pageNum: 1,
			pagesize: 50,
			currentPage:1,
			dataJurisdiction:[],
			reportStatus: [],
			branchList:[],
			showBranch:true
		}
	},
	store,
	computed:{
        ...mapGetters([
            "csaeDictionaries",
        ]),
    },
	created(){
		this.getDist();
		this.getRides()
	},
	methods: {
		openRecord(row) {
			this.$refs.record.initData(row) 
		},
		chooseCase() {
			if(this.multipleSelection.length == 0) {
				this.$message.warning('请选择需要同步的数据');
				return
			}
			this.$confirm('案件中心数据同步：' + this.multipleSelection.length + '条数据' , '同步数据确认', {
				confirmButtonText: '确认提交',
				cancelButtonText: '取消',
			}).then(() => {
				this.caseAsync();
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消'
				});          
			});
		},
		async caseAsync() {
			let arr = this.multipleSelection.map(item => item.reportNo)
			let res = await this.caseService.caseAsync(arr);
			if(res.code == '0000') {
				this.$message.success("同步成功");
				this.caseList();
			}
		},
		// 获取案件状态字典表
		async getDist() {
            let res = await this.caseService.getDist();
            if(res.code == '0000') {
				this.reportStatus = res.data.reportStatus;
				this.$store.commit('updataCsaeDictionaries',res.data);
            }
		},
		// 获取案件列表
		async caseList(){ 
			if(!this.formInline.branchCode && !this.formInline.reportNo) {
				this.$message.error('请选择查询内容');
				return
			}
			this.formInline.pn = this.pageNum;
			let res = await this.caseService.getSyncCaseList(this.formInline);
			if(res.code == '0000'){
				this.dataCaseList = res.list.map(item=>{
					let reportStatusName = this.reportStatus.find(v1=>v1.value == item.reportStatus)
					let branchName = this.branchList.find(v2=>v2.jtBranchCode == item.branchCode)
					item.reportStatusName =  reportStatusName?reportStatusName.label:'无'
					item.branchName = branchName ? branchName.jtBranchName : '无'
					// item.reportPhone = this.$stringHelper.changePhone(item.reportPhone)
					return item
				});
				this.total = res.total;
			}
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.caseList();
		},
		empty(){ //清空
			this.formInline = {
				reportNo:null,
				branchCode:null,
				pn:1,
				ps:50,
			};
			this.pageNum = 1;
			this.currentPage = 1;
			this.regionCoding = [];
			this.dataCaseList = [];
			this.total = 0;
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.caseList();
		},
		handleSelectionChange(val) {
        	this.multipleSelection = val;
      	}
	},
}
</script>

<style lang="less">
#caseSynchro {
	padding-bottom: 80px;
	min-height: 1000px;
	box-sizing: border-box;
	.el-form-item {
		margin-bottom: 10px;
	}
	.elesearch{
		box-sizing: border-box;
		background-color: #f2f1ef;
		overflow: hidden;
		padding: 20px 0;
		margin: 20px 20px 0 20px;
		background-color: #fff;	
		.item5{
			width: 30%;
		}
		.text-left{
			display: inline-block;
			width: 30%;
			text-align: right;
			font-size: 16px;
			line-height: 16px;
			color: #666666;
			margin-right: 10px;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
		.search-style {
			margin-top:20px;
			.el-form-item {
				margin-bottom: 16px;
			}
		}
		.el-date-editor--daterange.el-input__inner,.el-cascader--medium,.el-input--medium {
			width: 260px;
		}
		.el-button--small.is-round {
			padding: 10px 30px;
			font-size: 16px;
		}
		.mr40 {
			margin-right:40px;
		}
		.elesearch2{
			width: 100%;
			.item3{
				width: 100%;
				text-align: center;
				box-sizing: border-box;
			}
		}
	}
	.content-table{
		background-color: #fff;
		margin: 20px 20px 0;
		padding: 0 20px;
		.content1{
			position: relative;
			height: 60px;
			background-color: #fff;
			width: calc(100% - 40px);
			margin: 20px 20px 0;
			.content1-p{
				line-height: 60px;
			}
			.contoent1-btn{
				position: absolute;
				right: 20px;
				top: 20px;
				display: flex;
				.contoent1-btn-left,.contoent1-btn-right{
					width: 100px;
					border-radius: 30px;
				}
			}
		}
		.btn-link{
			cursor:pointer;
		}
		.content-table-title{
			height: 60px;
			line-height: 60px;
			border-bottom: 1px solid #E9E9E9;
			font-weight: 700;
		}
		.content-table-con{
			padding: 15px 0;
			border-bottom: 1px solid #E9E9E9;
			.con-p{
				height: 26px;
				line-height: 26px;
			}
		}
	}
	.content-total{
		width: 95%;
		height: 60px;
		line-height: 60px;
		text-align: right;
		margin-top: 30px;
	}
	.btn{
		text-align: right;
		width: 100%;
		.btn-left{
			display: inline-block;
			padding: 5px 20px;
			border: 1px solid #ccc;
			color: #000;
			background-color: #F5F5F5;
			border-radius: 20px;
			cursor: pointer;
			margin-right: 20px;
		}
		.btn-right{
			display: inline-block;
			padding: 5px 20px;
			color: #FFF;
			background-color: #FA8C16;
			border-radius: 20px;
			cursor: pointer;
		}
	}
}
</style>
