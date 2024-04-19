<template>
	<div id="PolicyEntryList">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">投保人名称：</span>
					<el-input placeholder="请输入投保人名称" v-model.trim="form.policyHolder" class="item2" clearable></el-input>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">保单号：</span>
					<el-input placeholder="请输入保单号" v-model.trim="form.policyNo" class="item2" clearable></el-input>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">录单时间：</span>
					<el-date-picker v-model="form.createTimeStart" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
					<span class="item1">至</span>
					<el-date-picker v-model="form.createTimeEnd" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">产品名称：</span>
					<el-select v-model="form.productCode" placeholder="请选择" class="item2" clearable>
						<el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.code"></el-option>
					</el-select>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">推送状态：</span>
					<el-select v-model="form.state" placeholder="请选择" class="item2" clearable>
						<el-option v-for="(item,index) in pushStateList" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item3">分支机构：</span>
					<el-select v-model="form.userBranchCode" placeholder="请选择分支机构" class="item2" clearable>
						<el-option v-for="(item,index) in options1" :key="index" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
					</el-select>
				</div></el-col>
			</el-row>
			<div class="elesearch-btn">
				<span @click="search" class="query-button">查询</span>
				<span @click="empty" class="empty-button">清空</span>
			</div>
		</div>

		<div class="content-up" >
			<!-- v-if="isAuth('01001')" -->
			<el-button type="primary" @click="Recordsheet" round>录入保单</el-button>
		</div>

		<div v-if="listFlag" class="no-data">
			暂无数据
		</div>

		<div class="list" v-else>
			<el-table :data="list" :header-cell-style="getRowClass" border>
				<el-table-column  prop="id" label="流水号" align="left" width="200"></el-table-column>
				<el-table-column label="保单信息" align="left">
					<template slot-scope="scope">
						<p class="col-blue">{{scope.row.policyHolder}}</p>
						<p>保单号：{{scope.row.policyNo}}</p>
						<p>产品名称：{{scope.row.productName}}({{scope.row.productCode}})</p>
					</template>
				</el-table-column>
				<el-table-column label="保费/保额" align="left" width="200">
					<template slot-scope="scope">
						<p>保费：{{scope.row.premium.toFixed(2)}}元</p>
						<p>保额：{{scope.row.insuredAmount.toFixed(2)}}元</p>
					</template>
				</el-table-column>
				<el-table-column label="推送" align="left" width="80">
					<template slot-scope="scope">
						<span class="col-gre" v-if="scope.row.state == '1'">成功</span>
						<span class="col-red" v-if="scope.row.state == '0'">失败<i class="el-icon-question col-org" @click="showError(scope.row.failReason)"></i></span>
					</template>
				</el-table-column>
				<el-table-column label="录单时间/人员" align="left">
					<template slot-scope="scope">
						<p>录单时间：{{scope.row.createTime}}</p>
						<p>{{scope.row.userName}}({{scope.row.userBranchName}})</p>
					</template>
				</el-table-column>
      		</el-table>
		</div>

		<BasePagenations v-if="!listFlag" class="mb40" :tolnum="tolnum" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></BasePagenations>
	</div>
</template>

<script>
import BasePagenations from "../../components/common/Base/BasePagenations";
import PolicyentryService from '../../service/PolicyentryService';
import CorrectionManagement from '../../service/CorrectionManagement.js';
import UserService from '../../service/UserService';
import buttonSelection from './js/buttonSelection.js';
import moment from 'moment';
import { getLogger } from '@/util/Logger'
const logger = getLogger("policyentry/policyEntryList");
export default {
	name:'PolicyEntryList',
	computed:{
		BasePagenations
	},
	data() {
		return {
			PolicyentryService:new PolicyentryService(),
			ButtonSelection:new buttonSelection(),
			UserService:new UserService(),
			CorrectionManagement: new CorrectionManagement(),
			form:{
				pageNum:1,
				pageSize:10,
				policyHolder:null,
				policyNo:null,
				createTimeStart:null,
				createTimeEnd:null,
				productCode:null,
				state:null,
				userBranchCode:null,
				userCode:null,
			},
			options:[],
			options1:[],
			areaData:[],
			tolnum: 0,
			listFlag:true,
			list:[],
			pushStateList:[
				{
					value:'1',
					label:'成功'
				},
				{
					value:'0',
					label:'失败'
				}
			]
		};
	},
	computed: {
		
	},
	created() {
		this.getProductList();
		this.loadBranch();
		this.getRecordList();
	},
	mounted(){
	},
	methods: {
		async getProductList(){ // 获取产品列表
			let provinceCode = '';
			if(sessionStorage.getItem('branchCode') == 'JT0000'){
				provinceCode = '000000'
			}else{
				provinceCode = sessionStorage.getItem('provinceCode')
			}
			let data = {
				'areaCodeList':[provinceCode],
				'clientNoList':['offline'],
				'pn':1,
				'ps':100,
				'upOrDown':'1',
				'needDetails':'0'
			};
			let res = await this.PolicyentryService.getProductList(data);
			if(res.code == '0000' && res.list){
				this.options = res.list;
			}
		},
		async loadBranch(){
			let res = await this.CorrectionManagement.getBranchInfo();
			if(res.code == '0000'){
				this.options1 = [];
				let branchCode = window.sessionStorage.getItem('branchCode');
				if(branchCode == 'JT0000'){
					res.list.push({"jtBranchCode":"JT0000","jtBranchName":"江泰保险经纪股份有限公司本部"})
					this.options1 = res.list;
				}else{
					if(branchCode == 'JT0144000') {
						this.options1.push({"jtBranchCode":"JT0144001","jtBranchName":"广东分公司本部"})
					}
					res.list.forEach(item =>{
						if(item.jtBranchCode == branchCode){
							this.options1.push(item)
						}
					})
				}
            }
        },
		async getRecordList(){ // 
			if(sessionStorage.getItem('branchCode') != 'JT0000') {
				this.form.userCode = sessionStorage.getItem('userCode')
			}
			const res = await this.PolicyentryService.getRecordList(this.form);
			if(res.code == '0000'){
				if(res.list.length && res.list){
					this.listFlag = false;
					this.list = res.list;
					this.tolnum = res.total;
				}else{
					this.list = [];
					this.listFlag = true;
				}
			}
		},
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "background:#EFF1F6;color:#404963;";
			} else {
				return "";
			}
		},
		search() {// 点击查询
			this.form.pageNum = 1;
			this.getRecordList();
		},
		empty(){
			this.form = {
				pn:1,
				pageSize :10,
				policyHolder:null,
				policyNo:null,
				createTimeStart:null,
				createTimeEnd:null,
				productCode:null,
				state:null,
				userBranchCode:null,
				userCode:null,
			}
			if(sessionStorage.getItem('branchCode') != 'JT0000') {
				this.form.userCode = sessionStorage.getItem('userCode')
			}
			this.getRecordList();
		},
		handleSizeChange(val) {// 修改条数
			this.form.pageSize  = val;
			this.getRecordList();
		},
		handleCurrentChange(value) {// 修改页数
			this.form.pageNum = value;
			this.getRecordList();
		},
		Recordsheet(){ // 录单
			this.$router.push({
			  path: "/order/offline/add"
			});
		},
		showError(text) {
			this.$message({
				message: text,
				type: 'error'
			})
		}
	}
};
</script>

<style lang="less">
#PolicyEntryList{
	.mb50 {
		margin-bottom: 50px;
	}
	padding-bottom: 20px;
	box-sizing: border-box;
	// background-color: #ffffff;
	.elesearch{
		width: 98%;
		margin: 20px 1%;
		background-color: #fff;
		padding: 20px 30px;
		box-sizing: border-box;
		.row-bg{
			margin-bottom: 20px;
			line-height: 40px;
			.item1{
				display: block;
				width: 10%;
				text-align: center;
			}
			.item2{
				width: 70%;
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
				width: 30%;
			}
		}
		.elesearch-btn{
			width: 100%;
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
		width: 98%;
		margin: 0px 1%;
		background-color: #ffffff;
		text-align: right;
		padding: 20px 30px 20px;
		box-sizing: border-box;
	}
	.no-data{
		width: 98%;
		margin: 0px 1%;
		background-color: #ffffff;
		line-height: 300px;
		font-size: 20px;
		color: #999;
		font-weight: 600;
		text-align: center;
		margin-bottom: 0;
	}
	.list{
		width: 98%;
		margin: 20px 1%;
		background-color: #ffffff;
		height: 100%;
		padding:0 20px 20px;
		margin-top: 0;
		box-sizing: border-box;
		overflow: hidden;
		.list-item{
			width: 100%;
			min-height: 243px;
			border: 1px solid #e9e9ea;
			margin-bottom: 25px;
			box-sizing: border-box;
			.item-title{
				width: 100%;
				height: 41px;
				line-height: 40px;
				background-color: #f7f8fa;
				padding: 0 20px;
				box-sizing: border-box;
				font-size: 14px;
				color: #000000;
				border-bottom: 1px solid #e9e9ea;
				box-sizing: border-box;
			}
			.item-content{
				width: 100%;
				min-height: 200px;
				padding: 30px;
				box-sizing: border-box;
				display: flex;
				.item-content1{
					width: 64%;
					height: 100%;
					color: #84878c;
					padding-right: 30px;
					box-sizing: border-box;
					.item-holderName{
						color:#469ffc;
						margin-bottom: 30px;
					}
					span{
						color: #000000;
					}
					.row-bg{
						margin-bottom: 18px;
					}
				}
				.item-content2{
					width: 18%;
					min-height: 140px;
					border-left: 1px solid #e9e9ea;
					padding: 20px 0;
					box-sizing: border-box;
					p{
						text-align: center;
						line-height: 30px;
					}
				}
				.item-content3{
					width: 18%;
					min-height: 140px;
					border-left: 1px solid #e9e9ea;
					padding: 20px 0;
					box-sizing: border-box;
					color: #fa7b27;
					position: relative;
					.centered-block{
						width: calc(100% - 10px);
						position:absolute;
						top:50%;
						transform:translate(0,-50%);
						p{
							text-align: center;
							line-height: 30px;
							span{
								cursor: pointer;
							}
						}
					}
				}
			}
		}
		.col-gre {
			color: #52c41a;
		}
		.col-red {
			color: #f5222d;
		}
		.col-blue {
			color: #096dd9;
		}
		.col-org {
			color: #ffa940;
		}
	}
}
</style>
