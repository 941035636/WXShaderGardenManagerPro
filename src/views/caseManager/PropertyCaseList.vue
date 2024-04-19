<template>
	<div id="EmployerCaseList">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">保单号</span>
					<el-input size="small" v-model.trim="formInline.policyNo" placeholder="请输入保单号" clearable class="item2"></el-input>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">报案号</span>
					<el-input size="small" v-model.trim="formInline.reportNo" placeholder="请输入报案号" clearable class="item2"></el-input>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">案件状态</span>
					<el-select size="small" v-model="formInline.channelStatus" placeholder="请选择" clearable class="item2">
						<el-option v-for="item in reportStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div></el-col>
				
				
			</el-row>
			<el-row type="flex" class="row-bg">
                <el-col :span="8"><div style="display:flex;">
					<span class="item3">物业项目</span>
					<el-input size="small" v-model.trim="formInline.propertyName" placeholder="请输入项目名称" clearable class="item2"></el-input>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">出险地区</span>
					<el-cascader size="small" :options="optionsArea" placeholder="请选择" change-on-select v-model="regionCoding" clearable class="item2"></el-cascader>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">报案时间</span>
						<el-date-picker size="small" type="date" placeholder="开始日期" v-model="formInline.reportTimeStart" class="item5" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<span class="item1">至</span>
						<el-date-picker size="small" type="date" placeholder="结束日期" v-model="formInline.reportTimeEnd" class="item5" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg" v-if="showBranch">
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">分公司</span>
					<el-select v-model="formInline.branchCode" placeholder="请选择" size="small" clearable class="item2">
						<el-option v-for="(item,key) in branchList" :key="key" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
					</el-select>	
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">产品名称</span>
					<el-select v-model="formInline.productCode" placeholder="请选择" size="small" class="item2" clearable>
						<el-option v-for="item in options3" :key="item.productCode" :label="item.productName" :value="item.productCode"></el-option>
					</el-select>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
				</div></el-col>
			</el-row>
			<div class="elesearch-btn">
				<span @click="searchview" class="query-button">查询</span>
				<span @click="empty" class="empty-button">清空</span>
			</div>
		</div>
		<div v-if="listFlag" class="no-data">
			暂无数据
		</div>

		<div class="content-table" v-else>
			<div class="content-up">
				<p>
					共查询到 <span style="color:#FA9830;">{{total}}</span> 条记录
				</p>
				<el-button v-if="dataJurisdiction.find(item => item.key == '40007')" class="content-up-btn" type="primary" @click="exports" round>导出</el-button>
			</div>
			<div class="content">
				<div class="content-title">
					<el-row type="flex" class="row-bg">
						<el-col :span="2"><div style="padding-left:10px;box-sizing: border-box;">
							状态
						</div></el-col>
						<el-col :span="8"><div style="padding-left:10px;box-sizing: border-box;">
							出险/索赔信息
						</div></el-col>
						<el-col :span="8"><div style="padding-left:10px;box-sizing: border-box;">
							事故信息
						</div></el-col>
						<el-col :span="6"><div style="padding-left:10px;box-sizing: border-box;">
							保单信息
						</div></el-col>
					</el-row>
				</div>
				<div class="content-item" v-for="(item,index) in data1" :key="index">
					<el-row type="flex" class="row-bg">
						<el-col :span="2">
							<div style="padding:15px;box-sizing: border-box;">
								<p class="con-p" style="color:#FA8C16">{{item.channelStatus}}</p> 
								<p class="con-p">{{item.branchName}}</p> 
								<p class="con-p">{{item.servicerName}}</p> 
							</div>
						</el-col>
						<el-col :span="8"><div style="padding:15px;box-sizing: border-box;">
							<p><span>报案人：{{item.reportName}}（{{item.reportPhone}}）</span></p>
							<p> 
								<span class="mr20">报案号：{{item.reportNo}}</span>
								<span>报案时间：{{item.reportTime}}</span>
							</p>
							<p><span>简要说明：<span style="color:#FF6F70;">{{item.accidentsAndLosses}}</span></span></p>
							<p style="color:#000;margin:4px 0;fong-size:14px;font-weight:700">索赔信息</p>
							<p><span>估损：</span><span class="mr40" style="color:#FF6F70;">￥{{item.appraisalAmount}}元</span> <span>赔付金额：</span><span style="color:#FF6F70;">￥{{item.settlementclaimAmount}}元</span></p>
							<p><span>结案时间：{{item.closeCaseTime}}</span></p>
							<p><span>更新时间：{{item.reportTime}}</span></p>
						</div></el-col>
						<el-col :span="8"><div style="padding:15px;box-sizing: border-box;">
							<p><span>物业项目：</span><span style="color:#1890FF">{{item.propertyName}}</span></p>
							<p><span>出险时间：{{item.riskTime}}</span></p>
							<p><span>出险地点：{{item.riskProvinceName}}{{item.riskCityName}}{{item.riskAreaName}}{{item.riskAddrDetail}}</span></p>
							<p><span class="mr40">案件类型：{{item.caseMoldName}}</span><span>受伤人员类型：{{item.injuredPersonName}}</span></p>
							<p><span>事故原因：{{item.accidentReasonName}}</span></p>
							<p style="color:#000;margin:4px 0;fong-size:14px;font-weight:700">转报案信息 <span v-if="!item.insuredCompanyReportNo && !item.reportInsuredCompanyTime" class="mr40" style="font-weight: 400; color: #FA8C16;">未转报案</span></p>
							<p v-if="item.insuredCompanyReportNo || item.reportInsuredCompanyTime"><span class="mr40">保司报案号：{{item.insuredCompanyReportNo}}</span><span>转报案时间：{{item.reportInsuredCompanyTime}}</span></p>
						</div></el-col>
						<el-col :span="6"><div style="padding:15px;box-sizing: border-box;">
							<p><span style="color:#1890FF">{{item.productName}}</span></p>
							<p><span>保单号：{{item.policyNo}}</span></p>
							<p><span>投保人：{{item.holderName}}</span></p>
							<p><span>被保险人：{{item.insuredName}}</span></p>
						</div></el-col>
					</el-row>
				</div>
			</div>
		</div>

		<div class="content-total" v-if="!listFlag">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
	</div>
</template>

<script>
import CaseService from '../../service/CaseService.js';
import ResourcesService from '../../service/ResourcesService';
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
import mechanismCode from '../businessProcessing/data/mechanismCode.json';
import product from '../businessProcessing/data/wyProductList.json';
import {GetBaseData} from '../../mixins/GetBaseData'
export default {
	mixins:[GetBaseData],
	data() {
		return {
			CaseService: new CaseService(),
			ResourcesService: new ResourcesService(),
			ButtonSelection:new buttonSelection(),
			data1:[],
			formInline:{
				policyNo:null,
				reportNo:null,
				riskProvinceCode:null,
				riskCityCode:null,
				riskAreaCode:null,
				identityNumber:null,
				reportTimeStart: null,
				reportTimeEnd: null,
				channelStatus:null,
				riskType:'wy',
				pn:1,
				ps:10,
				productCode:null,
				branchCode:null,
				propertyName:''
			},
			optionsArea:[],
			regionCoding:[],
			reportStatus:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			listFlag:false,
			options3:[],
			options33:[],
			branchList:[],
			dataJurisdiction:[],
			showBranch: true
		}
	},
	created(){
		// this.getDist();
		this.getRides('wy')
		this.policyStatu(); 
	},
	methods: {
		policyStatu(){ //根据权限获取配置文件
			this.dataJurisdiction = JSON.parse(window.sessionStorage.getItem('list'));
			if(sessionStorage.getItem('branchCode') == 'JT0000'){
				this.showBranch = true;
			}else{
				this.showBranch = false;
				// product.data.forEach(item =>{
				// 	if(item.branchCode == sessionStorage.getItem('branchCode') || item.branchCode == 'JT0000'){
				// 		this.options3.push(item)
				// 	}
				// })
				// mechanismCode.data.forEach(item =>{
				// 	if(item.branchCode == sessionStorage.getItem('branchCode')){
				// 		this.branchList.push(item)
				// 	}
				// })
			}
		},
		async getArea(){ //获取地区
			let parmes = await this.CaseService.getAreas();
			if(parmes.code == '0000'){
				this.optionsArea = this.ButtonSelection.Accessarea(parmes.data, window.sessionStorage.getItem('provinceCode'));
			};
		},
		async getDist() {
            let res = await this.CaseService.getDist();
            if(res.code == '0000') {
				this.reportStatus = res.data.reportStatus;
				this.ElevatorCaseList();
            }
		},
		async ElevatorCaseList(){
			this.formInline.pn = this.pageNum;
			if(this.regionCoding.length == 1){
				this.formInline.riskProvinceCode = this.regionCoding[0];
				this.formInline.riskCityCode = null;
				this.formInline.riskAreaCode = null;
			}else if(this.regionCoding.length == 2){
				this.formInline.riskProvinceCode = this.regionCoding[0];
				this.formInline.riskCityCode = this.regionCoding[1];
				this.formInline.riskAreaCode = null;
			}else if(this.regionCoding.length == 3){
				this.formInline.provinceCode = this.regionCoding[0];
				this.formInline.riskCityCode = this.regionCoding[1];
				this.formInline.riskAreaCode = this.regionCoding[2];
			}else{
				this.formInline.provinceCode = null;
				this.formInline.riskCityCode = null;
				this.formInline.riskAreaCode = null;
			};
			if(sessionStorage.getItem('branchCode') == 'JT0000'){
				this.formInline.branchCode = this.formInline.branchCode?this.formInline.branchCode:null
			}else{
				this.formInline.branchCode = null
			}
			let res = await this.CaseService.getcasesjlist(this.formInline);
			if(res.code == '0000' && res.list.length){
				this.listFlag = false;
				this.data1 = res.list;
				this.total = res.total;
				this.data1.forEach(item => {
					item.reportPhone = item.reportPhone ? this.$stringHelper.changePhone(item.reportPhone):''
					item.riskPersonPhone = item.riskPersonPhone ? this.$stringHelper.changePhone(item.riskPersonPhone):''
					item.identityNumber = item.identityNumber ? this.$stringHelper.changeIdNumber(item.identityNumber):''
					item.settlementclaimAmount = item.settlementclaimAmount ? item.settlementclaimAmount : 0
					item.appraisalAmount = item.appraisalAmount ? item.appraisalAmount : 0
				})
			}else{
				this.listFlag = true;
			}
		},
		async exports(){ // 投保单导出
			if(this.total<=500){
				let href = this.$apiUrl.CASE_DCGZ + '?riskType=' + this.formInline.riskType + (this.formInline.reportNo?('&reportNo=' + this.formInline.reportNo):'') + (this.formInline.policyNo?('&policyNo=' + this.formInline.policyNo):'') + (this.formInline.identityNumber?('&identityNumber=' + this.formInline.identityNumber):'') + (this.formInline.riskProvinceCode?('&riskProvinceCode=' + this.formInline.riskProvinceCode):'') + (this.formInline.riskCityCode?('&riskCityCode=' + this.formInline.riskCityCode):'') + (this.formInline.riskAreaCode?('&riskAreaCode=' + this.formInline.riskAreaCode):'') + (this.formInline.reportTimeStart?('&reportTimeStart=' + this.formInline.reportTimeStart):'') + (this.formInline.reportTimeEnd?('&reportTimeEnd=' + this.formInline.reportTimeEnd):'') + (this.formInline.channelStatus?('&channelStatus=' + this.formInline.channelStatus):'') + (this.formInline.branchCode?('&dataBranchCode=' + this.formInline.branchCode):'') + (this.formInline.productCode?('&productCode=' + this.formInline.productCode):'');
				this.ResourcesService.exportsViewFile(href)
				this.trackEvent('统计','导出物业案件');
			} else {
				this.$message({
					message: "数据量过大,超过50页,请缩小查询范围！",
					type: 'warning'
				});
			}
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.ElevatorCaseList();
		},
		empty(){ //清空
			this.formInline = {
				policyNo:null,
				reportNo:null,
				riskProvinceCode:null,
				riskCityCode:null,
				riskAreaCode:null,
				identityNumber:null,
				reportTimeStart: null,
				reportTimeEnd: null,
				channelStatus:null,
				riskType:'gz',
				pn:1,
				ps:10,
				productCode:null,
				branchCode:null,
				propertyName:''
			};
			this.pageNum = 1;
			this.currentPage = 1;
			this.regionCoding = [];
			this.ElevatorCaseList();
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.ElevatorCaseList();
		},
	},
}

</script>

<style lang="less">
#EmployerCaseList {
	padding-bottom: 80px;
	min-height: 1000px;
	box-sizing: border-box;
	.elesearch{
		width: calc(100% - 40px);
		min-height: 250px;
		padding: 20px 20px 10px;
		margin: 20px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;
		.row-bg{
			margin-bottom: 20px;
			line-height: 40px;
			.item1{
				display: block;
				width: 8%;
				text-align: center;
			}
			.item2{
				width: 60%;
			}
			.item3{
				font-size: 14px;
				color: #666666;
				display: block;
				width: 25%;
				text-align: right;
				padding-right: 10px;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.item5{
				width: 31%;
			}
		}
		.elesearch-btn{
			width: 100%;
			height: 100%;
			text-align: center;
			color: #ffffff;
			.query-button{
				display: inline-block;
				width: 120px;
				height: 40px;
				background-color: #f3ac56;
				text-align: center;
				line-height: 40px;
				margin-right: 40px;
				color: #ffffff;
				font-weight: 600;
				cursor: pointer;
				border-radius: 60px;
			}
			.empty-button{
				display: inline-block;
				width: 120px;
				height: 40px;
				border: 1px solid #e9e9e9;
				text-align: center;
				line-height: 40px;
				color: #999;
				background-color: #e9e9e9;
				font-weight: 600;
				box-sizing: border-box;
				cursor: pointer;
				border-radius: 60px;
			}
		}
	}
	.content-up{
		position: relative;
		width: 100%;
		padding: 20px 30px 20px;
		box-sizing: border-box;
		margin-top: 20px;
		background-color: #fff;
		.content-up-btn{
			position: absolute;
			right: 25px;
			top: 15px;
		}
	}
	.no-data{
		width: 100%;
		height: 100%;
		line-height: 70px;
		font-size: 20px;
		color: #999;
		font-weight: 600;
		text-align: center;
	}
	.content-table{
		width: 100%;
		height: 100%;
		padding:0 20px;
		box-sizing: border-box;
		.content{
			width: 100%;
			height: 100%;
			padding:0 20px 20px;
			box-sizing: border-box;
			background-color: #ffffff;
			.content-title{
				width: 100%;
				height: 40px;
				line-height: 40px;
				font-size: 14px;
				color: #333333;
				font-weight: 600;
				border-bottom: 1px solid #F1EEE9;
			}
			.content-item{
				width: 100%;
				border-bottom: 1px solid #F1EEE9;
				box-sizing: border-box;
				// margin-bottom: 20px;
				p{
					line-height: 30px;
				}
			}
		}
	}
	.content-total{
		width: 100%;
		height: 60px;
		padding: 0 30px 20px;
		box-sizing: border-box;
		line-height: 60px;
		text-align: right;
		margin-top: 30px;
	}
}
</style>