<template>
	<div class="caseList" id="caseList">
		<div class="elesearch">
			<el-form :inline="true" :model="formInline" class="demo-form-inline search-style" :label-position="labelPosition" label-width="130px">
				<el-col :span="12">
					<el-form-item label="报案号">
						<el-input v-model="formInline.reportNo" placeholder="请输入报案号" size="medium"></el-input>
					</el-form-item>
					<el-form-item label="保单号/投保人">
						<el-input v-model="formInline.policyNoOrHolderName" placeholder="请输入保单号/投保人" size="medium"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="产品">
						<el-select v-model="formInline.riskTypeOrProductCode" placeholder="请选择" size="medium" clearable>
							<el-option v-for="item in options3" :key="item.productCode" :label="item.productName" :value="item.productCode"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="案件状态">
						<el-select v-model="formInline.reportStatus" placeholder="请选择" size="medium" clearable>
							<el-option v-for="item in reportStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<div>
						<el-select v-model="dataType" placeholder="请选择" class="item4" clearable @change="changeDataType">
							<el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-date-picker v-if="dataType == '1'" v-model="formInline.startReportTime" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<el-date-picker v-else v-model="formInline.startRiskTime" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<span>--</span>
						<el-date-picker v-if="dataType == '1'" v-model="formInline.endReportTime" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
						<el-date-picker v-else v-model="formInline.endRiskTime" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
					</div>
				</el-col>
				<el-col :span="12">
					<el-form-item label="出险地区">
						<el-cascader :options="options2" placeholder="请选择" change-on-select v-model="regionCoding" size="medium" clearable></el-cascader>
					</el-form-item>
					<!-- <el-form-item label="报案时间">
						<el-date-picker v-model="reportTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable size="medium"></el-date-picker>
					</el-form-item>
					<el-form-item label="出险时间">
						<el-date-picker v-model="riskTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable size="medium"></el-date-picker>
					</el-form-item> -->
					<el-form-item label="出险设备/人">
						<el-input v-model="formInline.nameOrCodeOrId" size="medium" placeholder="电梯编号/索道名称/出险人证件号"></el-input>
					</el-form-item>
				</el-col>
			</el-form>
			<div class="elesearch2">
				<div class="item3">
					<el-button type="warning" round size="small" @click="searchview">查询</el-button>
					<el-button type="info" round size="small" @click="empty" class="mr40">清空</el-button>
				</div>
			</div>
		</div>
		<div class="content-table">
			<!-- <div class="content1">
				<span @click="exports" v-if="datas.find(item => item.key == '40001')" class="export-style"><i class="el-icon-edit-outline"></i> 导出</span>
			</div> -->
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header fit>
				<el-table-column label="报案信息" align="left" label-class-name="pl20">
					<template slot-scope="scope">
						<div style="text-align:left;" class="pl20">
						<span>案件号：{{scope.row.caseNo}}</span><br/>
						<span>报案号：{{scope.row.reportNo}}</span><br/>
						<span>报案人：{{scope.row.reportName}}</span><span class="pl30">出险时间：{{scope.row.riskTime}}</span><br/>
						<span>出险地：{{(scope.row.provinceName?scope.row.provinceName:'') + (scope.row.cityName?' / ' + scope.row.cityName:'') + (scope.row.areaName?' / ' + scope.row.areaName:'')}}</span>
						<!-- <span>案件类型：{{scope.row.caseType}}</span> -->
						</div>
					</template>
				</el-table-column>
				<el-table-column label="进度/报案时间" align="center" width="200px">
					<template slot-scope="scope">
						<div style="text-align:center;">
						<span>{{scope.row.reportStatusName}}</span><br/>
						<span>{{scope.row.reportTime}}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="保单信息" align="left" min-width="100">
					<template slot-scope="scope">
						<div style="text-align:left;">
						<span>{{scope.row.productName}}</span><br/>
						<span>保单号：{{scope.row.policyNo}}</span>&nbsp;&nbsp;<a @click="accessPolicyDetails(scope.row)" href="javascript:;" v-if="scope.row.policyNo">查看</a><br/>
						<span v-if="scope.row.emergencyEquipmentCode">事故设备：<span>{{scope.row.riskType =='dt' ? '电梯/' + scope.row.emergencyEquipmentCode :'索道/' + scope.row.emergencyEquipmentCode}}</span></span><br/>
						<span>{{scope.row.holderName}}</span><br/>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="案件类型" align="center" width="120px">
					<template slot-scope="scope">
						<el-popover placement="top">
							<div slot="reference" class="name-wrapper">
								<el-tag size="medium">{{ scope.row.caseType }}</el-tag>
							</div>
						</el-popover>
					</template>
				</el-table-column>
				<!-- <el-table-column label="理赔情况" align="left"  width="160px">
					<template slot-scope="scope">
						<div style="text-align:left;">
						<span>索赔：--</span><br/>
						<span>估损：--</span><br/>
						<span>理赔：--</span>
						</div>
					</template>
				</el-table-column> -->
				<el-table-column fixed="right" label="操作" align="center" width="140px">
					<template slot-scope="scope" type="flex">
						 <el-button type="info" v-if="datas.find(item => item.key == '40002')" plain @click="optionWrite(scope.row)">案件处理</el-button>
						<!-- <span @click="optionWrite(scope.row)" class="hand-style">案件详情</span> -->
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
import CaseService from '../../service/CaseService.js';
import ResourcesService from '../../service/ResourcesService.js';
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
import paymentStatus from '../../../static/data/paymentStatus.json';
import placeSinglechannel from '../../../static/data/placeSinglechannel.json';
import divisor from '@/global/divisor.json';

import store from '../../store/index'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
	data() {
		return {
			Elevator:new elevator(),
			caseService: new CaseService(),
			ButtonSelection:new buttonSelection(),
			ResourcesService:new ResourcesService(),
			dataType:'',
			formInline:{
				orderBy:'reportTime',
				desc:true,
				reportNo:null,
				policyNoOrHolderName:null,
				riskTypeOrProductCode:null,
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
			},
			reportTime: [],//报案时间
			riskTime: [],//出险时间
			labelPosition:'right',
			options2:[],
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
			data1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			datas:[],
			reportStatus: [],
		}
	},
	store,
	computed:{
        ...mapGetters([
            "csaeDictionaries",
        ]),
    },
	created(){
		this.policyStatu();
		this.getDist();
		this.getArea();
	},
	methods: {
		changeDataType() {
			if(this.dataType == '1') {
				this.formInline.startReportTime =  this.reportTime[0] ? this.reportTime[0]: null;
				this.formInline.endReportTime =  this.reportTime[1] ? this.reportTime[1]: null;
				this.formInline.startRiskTime =  this.riskTime[0] ? this.riskTime[0]: null;
				this.formInline.endRiskTime =  this.riskTime[1] ? this.riskTime[1] :null;
			} else {
				this.formInline.startReportTime =  this.reportTime[0] ? this.reportTime[0]: null;
				this.formInline.endReportTime =  this.reportTime[1] ? this.reportTime[1]: null;
				this.formInline.startRiskTime =  this.riskTime[0] ? this.riskTime[0]: null;
				this.formInline.endRiskTime =  this.riskTime[1] ? this.riskTime[1] :null;

			}
		},
		policyStatu(){ //根据权限获取配置文件
			var options3 = divisor.data;
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
			}
		},
		async getDist() {
            let res = await this.caseService.getDist();
            if(res.code == '0000') {
				this.reportStatus = res.data.reportStatus;
				this.$store.commit('updataCsaeDictionaries',res.data);
                await this.policylist();
            }
		},
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.options2 = this.ButtonSelection.Accessarea(parmes.data, window.sessionStorage.getItem('provinceCode'));
			};
		},
		async policylist(){ // 获取投保单列表
			this.formInline.pn = this.pageNum;
			if(this.regionCoding.length == 1){
				this.formInline.provinceCode = this.regionCoding[0];
				this.formInline.cityCode = "";
				this.formInline.areaCode = "";
			}else if(this.regionCoding.length == 2){
				this.formInline.provinceCode = this.regionCoding[0];
				this.formInline.cityCode = this.regionCoding[1];
				this.formInline.areaCode = "";
			}else if(this.regionCoding.length == 3){
				this.formInline.provinceCode = this.regionCoding[0];
				this.formInline.cityCode = this.regionCoding[1];
				this.formInline.areaCode = this.regionCoding[2];
			}else{
				this.formInline.provinceCode = "";
				this.formInline.cityCode = "";
				this.formInline.areaCode = "";
			}
			let res = await this.caseService.getCaseList(this.formInline);
			if(res.code == '0000'){
				for(let i = 0; i < res.list.length; i ++) {
					for(let j = 0; j < this.reportStatus.length; j ++) {
						if(res.list[i].reportStatus == this.reportStatus[j].value) {
							res.list[i].reportStatusName = this.reportStatus[j].label;
						}
					}
				}
				this.data1 = res.list;
				this.total = res.total;
			}
		},
		async optionWrite(row) {
			if(row.reportStatus == '00'){
				this.$message({
					message: '请先联系客服指定服务人员',
					type: 'warning'
				});
				return;
			}
			if(row.reportStatus == '02'){
				let res = await this.caseService.casefwryrl(row.caseNo);
				if(res.code == '0000'){
					if(row.riskType == 'dt'){
						this.getCaseDetail(this.csaeDictionaries.elevator.caseType,row);
					}else if(row.riskType == 'sd'){
						this.getCaseDetail(this.csaeDictionaries.repoway.caseType,row);
					}else{
						this.getCaseDetail(this.csaeDictionaries.employer.caseType,row);
					}
				}
			}else{
				if(row.riskType == 'dt'){
					this.getCaseDetail(this.csaeDictionaries.elevator.caseType,row);
				}else if(row.riskType == 'sd'){
					this.getCaseDetail(this.csaeDictionaries.repoway.caseType,row);
				}else{
					this.getCaseDetail(this.csaeDictionaries.employer.caseType,row);
				}
			}
		},
		async getCaseDetail(caseType,row){//获取案件详情
			let res = await this.caseService.getCaseDetail(row.reportNo);
			if(res.code == '0000') {
				let caseOverInfo = {
					closingReviewList : res.data.closingReviewList,
					settlementList : res.data.settlementList,
					reportNo : res.data.reportNo,
					reportStatus : res.data.reportStatus,
					acceptionList : res.data.acceptionList,
					baseInfo : res.data.reportInfo 
				}
				this.$store.commit('updateBaseInfo',caseOverInfo);
				caseType.find(item => {
                    if(item.value == res.data.reportInfo.caseType){
                        res.data.reportInfo.caseTypeName = item.label;
                    }
				})
				let makemoneys = {
					"paymentDate":res.data.reportInfo.paymentDate,
					"paymentTime":res.data.reportInfo.paymentTime,
				}
				this.$store.commit('updataMakemoneys',makemoneys);
				this.$store.commit('updataCaseOverInfo',res.data.reportInfo);
				this.$store.commit('updataReportStatus',res.data.reportInfo.reportStatus);
				this.$store.commit('updataCaseReview',res.data.revisitList);
				let accidentAndCasualty = res.data.accidentAndCasualty.caseInfoVO;
				accidentAndCasualty.insuredInfoList = res.data.accidentAndCasualty.insuredInfoList?res.data.accidentAndCasualty.insuredInfoList:[];
				this.$store.commit('updataCaseProcess',accidentAndCasualty);
				this.$store.commit('updataPayInfo',res.data.lossDetail);
				let accountInfo = {
                    "bankCardAccount": "",
                    "cardBank": "",
                    "id": "",
                    "payeeName": "",
                    "reportNo": this.$route.query.reportNo
                };
				this.$store.commit('updataAccountInfo',res.data.account?res.data.account:accountInfo);
				if(res.data.litigationList.length){
					this.$store.commit('updataLitigationInfo',res.data.litigationList[0]);
				}else{
					let litigationList = {
						litigationResult:"",
						litigationMoney:"",
						otherContent:"",
						litigationTime:"",
						id:"",
						reportNo: this.$route.query.reportNo,
						caseNo: this.$route.query.caseNo
					};
					this.$store.commit('updataLitigationInfo',litigationList);
				}
				this.$router.push({
					path:'/caseDetail',
					query:{
						reportNo:row.reportNo,
						caseNo:row.caseNo,
						caseId:row.caseId,
						productCategory1:row.riskType,
						holderName:row.holderName
					}
				})
			}
		},
		async exports(){ // 投保单导出
			window.location.href = this.$apiUrl.CASE_EXCEL + '?orderBy=' + this.formInline.orderBy + '&desc=' + this.formInline.desc + (this.formInline.policyNoOrHolderName?('&policyNoOrHolderName=' + this.formInline.policyNoOrHolderName):'') + (this.formInline.reportNo?('&reportNo=' + this.formInline.reportNo):'') + (this.formInline.nameOrCodeOrId?('&nameOrCodeOrId=' + this.formInline.nameOrCodeOrId):'') + (this.formInline.reportStatus?('&reportStatus=' + this.formInline.reportStatus):'') + (this.formInline.riskTypeOrProductCode?('&riskTypeOrProductCode=' + this.formInline.riskTypeOrProductCode):'') + (this.formInline.startReportTime?('&startReportTime=' + this.formInline.startReportTime):'') + (this.formInline.endReportTime?('&endReportTime=' + this.formInline.endReportTime):'') + (this.formInline.startRiskTime?('&startRiskTime=' + this.formInline.startRiskTime):'') + (this.formInline.endRiskTime?('&endRiskTime=' + this.formInline.endRiskTime):'') + (this.formInline.provinceCode?('&provinceCode=' + this.formInline.provinceCode):'') + (this.formInline.cityCode?('&cityCode=' + this.formInline.cityCode):'') + (this.formInline.areaCode?('&areaCode=' + this.formInline.areaCode):'');
		},
		async accessPolicyDetails(row){ // 电子保单
			let data = {
				"bizCodeType": "01",
				"policyNo":row.policyNo,
				"resCode": "A002"
			}
			const parmes = await this.Elevator.getResourcesID(data);
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
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			// this.formInline.startReportTime =  this.reportTime[0] ? this.reportTime[0]: null;
			// this.formInline.endReportTime =  this.reportTime[1] ? this.reportTime[1]: null;
			// this.formInline.startRiskTime =  this.riskTime[0] ? this.riskTime[0]: null;
			// this.formInline.endRiskTime =  this.riskTime[1] ? this.riskTime[1] :null;
			this.policylist();
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
			};
			this.regionCoding = [];
			this.reportTime =  [];
			this.riskTime =  [];
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
#caseList {
	padding-bottom: 80px;
	min-height: 1000px;
	box-sizing: border-box;
	.elesearch{
		box-sizing: border-box;
		background-color: #f2f1ef;
		overflow: hidden;
		padding: 20px 0;
		margin: 20px 20px 0 20px;
		background-color: #fff;	
		.item4{
			width: 14%;
			margin-left: 1%;
		}
		.item5{
			width: 30%;
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
			padding: 10px 20px;
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
			}
		}
	}
	.content-table{
		background-color: #fff;
		margin: 20px 20px 0;
		.content1{
			padding-top: 10px;
			width: 96%;
			margin-top: 10px;
			height: 35px;
			display: flex;
			justify-content: space-between;
			margin-left:94%;
			.export-style {
				font-size: 16px;
				color: #769de4;
				font-weight: 700;
			}
		}
		.el-dropdown-link{
			cursor:pointer;
		}
		.hand-style {
			cursor: pointer;
			color:#2f68d5;
		}
	}
	.content-total{
		width: 95%;
		height: 60px;
		line-height: 60px;
		text-align: right;
		margin-top: 30px;
	}
}
</style>
