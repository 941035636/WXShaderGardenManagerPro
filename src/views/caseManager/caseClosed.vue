<template>
	<div class="casePending" id="casePending">
		<div class="elesearch">
			<el-row class="mb20">
        <el-col :span="8">
					<span class="text-left">报案号:</span>
					<el-input v-model="formInline.reportNo" placeholder="请输入报案号" size="medium"></el-input>
				</el-col>
        <el-col :span="8">
					<span class="text-left">保单号:</span>
					<el-input v-model="formInline.policyNo" placeholder="请输入保单号" size="medium"></el-input>
				</el-col>
        <el-col :span="8">
					<span class="text-left">投保人:</span>
					<el-input v-model="formInline.holderName" placeholder="请输入投保人名称" size="medium"></el-input>
				</el-col>
			</el-row>
			<el-row class="mb20">
        <el-col :span="8">
            <el-select v-model="formInline.timeTypes" placeholder="请选择" class="text-left-item1">
							<el-option label="出险时间" value="1"></el-option>
							<el-option label="报案时间" value="2"></el-option>
						</el-select>
						<el-date-picker v-if="formInline.timeTypes == '1'" v-model="formInline.startRiskTime" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<el-date-picker v-if="formInline.timeTypes == '2'" v-model="formInline.startReportTime" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<span>--</span>
						<el-date-picker v-if="formInline.timeTypes == '1'" v-model="formInline.endRiskTime" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
						<el-date-picker v-if="formInline.timeTypes == '2'" v-model="formInline.endReportTime" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
				</el-col>
        <el-col :span="8">
					<span class="text-left">出险设备/人员:</span>
					<el-input v-model="formInline.nameOrCodeOrId" size="medium" placeholder="电梯编号/索道名称/出险人证件号"></el-input>
				</el-col>
        <el-col :span="8">
					<span class="text-left">出险地区:</span>
					<el-cascader :options="optionsArea" placeholder="请选择" change-on-select v-model="regionCoding" size="medium" clearable></el-cascader>
				</el-col>
			</el-row>
			<el-row class="mb20" v-if="showBranch">
        <el-col :span="8" >
					<span class="text-left">所属项目:</span>
					<el-select v-model="formInline.productCode" filterable placeholder="请选择" size="medium" clearable>
						<el-option v-for="(item,index) in options3" :key="index" :label="item.productName" :value="item.productCode"></el-option>
					</el-select>
				</el-col>
				<el-col :span="16">
					<div class="elesearch2">
            <div class="item3">
              <el-button type="warning" round size="small" @click="searchview">查询</el-button>
              <el-button type="info" round size="small" @click="empty" class="mr40">清空筛选条件</el-button>
            </div>
          </div>
				</el-col>
			</el-row>
      <div class="elesearch2 mt20" v-if="!showBranch">
          <div class="item3">
            <el-button type="warning" round size="small" @click="searchview">查询</el-button>
            <el-button type="info" round size="small" @click="empty" class="mr40">清空筛选条件</el-button>
          </div>
        </div>
		</div>
    <div class="content-table">
      <el-tabs type="border-card" v-model="formInline.reportStatusList" @tab-click="caseList" class="state-style">
				<el-tab-pane :label="item.label" :name="item.value" v-for="(item,index) in reportStatus" :key="index"></el-tab-pane>
			</el-tabs>
      <CaseListTable fatherComponents="caseClosed" :tableData="dataCaseList" @successCallback="caseList"> </CaseListTable>
      <div class="content-total">
        <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
      </div>
    </div>
		
	</div>
</template>

<script>
import { GetBaseData } from '@/mixins/GetBaseData'
import { CaseList } from '@/mixins/CaseList'
import CaseListTable from './components/CaseListTable'
export default {
  components:{
    CaseListTable
  },
	mixins:[GetBaseData,CaseList],
	data() {
		return {
			formInline:{
				orderBy:'reportTime',
				desc:true,
				reportNo:null,
				policyNo:null,
				holderName:null,
				riskType:null,
				productCode:null,
				reportStatus:null,
				provinceCode:null,
				cityCode:null,
				areaCode:null,
				nameOrCodeOrId:null,
				startReportTime:null,
				endReportTime: null,
				startRiskTime: null,
				endRiskTime: null,
				pn:1,
				ps:10,
				substate: null,
        reportStatusList:'05,06',
				timeTypes: '2', // 时间类型标识
        closeAuditorCode:window.sessionStorage.getItem('userCode')
			},
			reportTime: [],//报案时间
			riskTime: [],//出险时间
			optionsArea:[],
			options33:[],
			options3:[],
			options4:[
				{
					'value':'1',
					'label':'报案时间'
				},
				{
					'value':'2',
					'label':'出险时间'
				}
			],
			regionCoding:[],
			dataCaseList:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			reportStatus: [],
			branchList:[],
			branchList1:[],
		}
	},

	created(){
    this.getRides('','closed')
	},
	methods: {
		async exports(){ // 投保单导出
			window.location.href = this.$apiUrl.CASE_EXCEL + '?orderBy=' + this.formInline.orderBy + '&desc=' + this.formInline.desc + (this.formInline.policyNoOrHolderName?('&policyNoOrHolderName=' + this.formInline.policyNoOrHolderName):'') + (this.formInline.reportNo?('&reportNo=' + this.formInline.reportNo):'') + (this.formInline.nameOrCodeOrId?('&nameOrCodeOrId=' + this.formInline.nameOrCodeOrId):'') + (this.formInline.reportStatus?('&reportStatus=' + this.formInline.reportStatus):'') + (this.formInline.riskTypeOrProductCode?('&riskTypeOrProductCode=' + this.formInline.riskTypeOrProductCode):'') + (this.formInline.startReportTime?('&startReportTime=' + this.formInline.startReportTime):'') + (this.formInline.endReportTime?('&endReportTime=' + this.formInline.endReportTime):'') + (this.formInline.startRiskTime?('&startRiskTime=' + this.formInline.startRiskTime):'') + (this.formInline.endRiskTime?('&endRiskTime=' + this.formInline.endRiskTime):'') + (this.formInline.provinceCode?('&provinceCode=' + this.formInline.provinceCode):'') + (this.formInline.cityCode?('&cityCode=' + this.formInline.cityCode):'') + (this.formInline.areaCode?('&areaCode=' + this.formInline.areaCode):'');
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.caseList();
		},
		empty(){ //清空
			this.formInline = {
				orderBy:"reportTime",
				desc:true,
				reportNo:null,
				policyNoOrHolderName:null,
				riskTypeOrProductCode:null,
				reportStatus:null,
				provinceCode:null,
				nameOrCodeOrId:null,
				startReportTime: null,
				endReportTime: null,
				startRiskTime: null,
				endRiskTime: null,
				pn:1,
				ps:10,
				substate: null,
        reportStatusList:'05,06',
				timeTypes: '2', // 时间类型标识
        closeAuditorCode:window.sessionStorage.getItem('userCode')
			};
			this.regionCoding = [];
			this.reportTime =  [];
			this.riskTime =  [];
			this.caseList();
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.caseList();
		},
	},
}
</script>

<style lang="less">
#casePending {
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
			color: #666666;
			margin-right: 10px;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
    .text-left-item1{
				width: 30%;
				margin-right: 10px;
				margin-left: 0%;
				input {
          text-align: right;
					border: none;
					font-size: 16px;
					min-width:110px;
				}
				.el-select__caret {
					color: #000000;
					font-weight: 700;
				}
			}
			.i
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
				text-align: right;
				box-sizing: border-box;
        padding-right: 64px;
			}
		}
	}
  .content-table {
    background-color: #fff;
		margin: 20px 20px 0;
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
    .content-total{
      width: 100%;
      text-align: center;
      padding-bottom: 10px;
    }
  }
	
}
</style>
