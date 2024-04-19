<template>
	<div class="productAccount" id="productAccount">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">产品名称：</span>
						<el-select size="medium" v-model="data.productCode" placeholder="请选择" class="item2" clearable filterable>
							<el-option v-for="(item,index) in options7" :key="index" :label="item.productName" :value="item.productCode"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">行业分类：</span>
						<el-cascader filterable size="medium" :options="channelData" placeholder="请选择" @change="chooseHY" change-on-select v-model="regionCodingHY" class="item2" clearable></el-cascader>
					</div>
				</el-col>
				<el-col :span="8" >
					<div>
						<span class="item3">分支机构：</span>
						<el-select size="medium" v-model="data.branchCode" filterable placeholder="请选择" class="item2" clearable>
							<el-option v-for="(item,index) in branchList" :key="index" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg" v-if="!showFlag">
				<el-col :span="8">
					<div>
						<span class="item3">查询日期：</span>
						<el-date-picker size="medium" v-model="data.startTime" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<el-date-picker size="medium"  v-model="data.endTime" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
					</div>
				</el-col>
				<!-- <el-col :span="8">
					<div>
						<span class="item3">主承公司：</span>
						<el-select size="medium" v-model="data.inusureCompanyCode" filterable placeholder="请选择" class="item2" clearable>
							<el-option v-for="(item,index) in companyList" :key="index" :label="item" :value="item"></el-option>
						</el-select>
					</div>
				</el-col> -->
				<el-col :span="8">
					<div>
						<span class="item3">产品上下架：</span>
						<el-select size="medium" v-model="data.state" placeholder="请选择" class="item2" clearable>
							<el-option v-for="(item,index) in options2" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div></div>
				</el-col>
				<el-col :span="8">
					<div></div>
				</el-col>
				<el-col :span="8">
					<div>
						<el-button type="text" class="mr60 fr" v-if="!showFlag" @click="showFlag = !showFlag">收起 <i class="el-icon-arrow-up"></i></el-button>
						<el-button type="text" class="mr60 fr" v-if="showFlag" @click="showFlag = !showFlag">展开 <i class="el-icon-arrow-down"></i></el-button>
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
					<el-table-column label="产品信息" align="left" width="450">
						<template slot-scope="scope">
							<p>产品名称：{{scope.row.productName}}</p>
							<p>主承公司：{{scope.row.inusureCompanyName ? scope.row.inusureCompanyName : '--'}}</p>
							<p>分支机构：{{scope.row.branchName}}</p>
							<p>行业分类：{{scope.row.tradeCategory1Name}}/{{scope.row.tradeCategory2Name}}</p>
							<p>产品上下架：{{scope.row.stateName}}</p>
						</template>
					</el-table-column>
					<el-table-column label="赔款信息/满期保费" align="left">
						<template slot-scope="scope">
							<p>已决赔款：{{scope.row.determinedAmount}}</p>
							<p>未决赔款：{{scope.row.unsettledAmount}}</p>
							<p>满期保费：{{scope.row.prem}}</p>
						</template>
					</el-table-column>
					<el-table-column label="标的数量" align="left">
						<template slot-scope="scope">
							<p>总标的数量：{{scope.row.totalSubjectNum}}</p>
							<p>出险标的数量（死亡）：{{scope.row.accidentsSubjectNum}}</p>
							<p>出险标的数量（非死亡）：{{scope.row.accidentsSubjectNonDeathNum}}</p>
							
						</template>
					</el-table-column>
					<el-table-column label="满期赔付率" align="left">
						<template slot-scope="scope">
							<p>{{scope.row.payRate}}</p>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
	</div>
</template>

<script>
import channelData from '../../../static/data/channel.json'
import StatisticService from '../../service/StatisticService';
import CorrectionManagement from '@/service/CorrectionManagement.js';
import RidesService from '@/service/RidesService.js';
import ProductConfig from '../../service/ProductConfig.js';
import moment from 'moment';
export default {
	components:{
	},
	data() {
		return {
			StatisticService: new StatisticService(),
			ProductConfig:new ProductConfig(),
			CorrectionManagement:new CorrectionManagement(),
			RidesService: new RidesService(),
			data:{
				"branchCode": "",
				"endTime": "",
				"inusureCompanyCode": "",
				"pageNum": 1,
				"pageSize": 10,
				"productCode": "",
				"productName": "",
				"startTime": "",
				"state": '',
				"tradeCategory1": "",
				"tradeCategory2": ""
			},
			regionCodingHY:[],//选择的行业分类
			options7:[],
			options2:[
				{
					value:1,
					label:'上架'
				},
				{
					value:0,
					label:'下架'
				},
			],
			// productCategory:sortData.dataProductCategory1,
			data1:[],
			branchList:[],
			branchList1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			showFlag: false,
			showBranch:false,
			channelData: channelData.hYCategory,
			companyList: [],
		}
	},
	created(){
		sessionStorage.getItem('branchCode') == 'JT0000' ? this.showBranch = true : this.showBranch = false
		Promise.all([this.getList(),this.getRides()]).then((res)=> {
			this.searchview();
		})
	},
	methods: {
		async getRides() { //获取缓存数据
			let branchRid = await this.RidesService.getRides('sequipListData','sequip','1');
			if(branchRid.code == '0000' && branchRid.data) {
				this.branchList1 = JSON.parse(branchRid.data).branchList;
				this.setBranch();
			} else {
				Promise.all([this.loadBranch()]).then((res)=> {
				}) 
			}
		},
		// 产品名称查询
		async getList(){ 
			let data = {
				pageNum: 1,
				pageSize: 1000
			}
			let res = await this.ProductConfig.getList(data);
			if(res.code == '0000' && res.list.length != 0){
				this.options7 = res.list;
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
			this.data.pageNum = 1;
			this.productAccountList();
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
			this.data.pageNum = pageNum;
			this.productAccountList();
		},
		async productAccountList(){ // 获取投保单列表
			let res = await this.StatisticService.getProductAccount(this.data);
			if(res.code == '0000' && res.total && res.list.length != 0){
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
			this.data.pageNum = 1;
			this.currentPage = 1;
			let lastYear = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
			let lastYearAddOne = new Date(lastYear.setDate(lastYear.getDate()+1))
			if(!this.data.productCode) {
				if(!this.data.startTime && !this.data.endTime) {
					this.data.startTime = moment(lastYearAddOne).format('YYYY-MM-DD 00:00:00')
					this.data.endTime = moment(new Date()).format('YYYY-MM-DD 23:59:59');
				} else if(this.data.startTime && !this.data.endTime) {
					this.$message({
						message: '请输入查询止期',
						type: 'warning'
					});
					return
				} else if(!this.data.startTime && this.data.endTime) {
					this.$message({
						message: '请输入查询起期',
						type: 'warning'
					});
					return
				} else {
					let last = new Date(new Date(this.data.startTime).setFullYear(new Date(this.data.startTime).getFullYear() + 1));
					let lastAddOne = moment(new Date(new Date(last.setDate(last.getDate()-1)))).format('YYYY-MM-DD 23:59:59')
					if(new Date(this.data.endTime) > new Date(lastAddOne)) {
						this.$message({
							message: '查询日期最多支持一年',
							type: 'warning'
						});
						return 
					}
				}
			} else {
				if(this.data.startTime && !this.data.endTime) {
					this.$message({
						message: '请输入查询止期',
						type: 'warning'
					});
					return
				} else if(!this.data.startTime && this.data.endTime) {
					this.$message({
						message: '请输入查询起期',
						type: 'warning'
					});
					return 
				}
				this.data.startTime = this.data.startTime ? this.data.startTime : '';
				this.data.endTime = this.data.endTime ? this.data.endTime : '';
			}
			this.productAccountList();
		},
		chooseHY() {
			if(this.regionCodingHY.length == 1) {
				this.data.tradeCategory1 = this.regionCodingHY[0]
			} else if(this.regionCodingHY.length == 2) {
				this.data.tradeCategory1 = this.regionCodingHY[0]
				this.data.tradeCategory2 = this.regionCodingHY[1]
			} else {
				this.data.tradeCategory1 = ''
				this.data.tradeCategory2 = ''
			}
		},
		async exportList(){ // 导出
			let params = JSON.parse(JSON.stringify(this.data));
			params.pageNum = "";
			params.pageSize = "";
			if(this.total <= 5000){
				this.$axios({
				method: "post",
				url: this.$apiUrl.EXPORTPRODUCTACCOUNT,
				data: params,
				responseType: "arraybuffer",
			}).then((res) => {
				this.trackEvent('统计','导出产品台账');
				let blob = new Blob([res.data], { type: res.headers['content-disposition'] });
				const fileName = decodeURIComponent(res.headers['content-disposition'].substr(res.headers['content-disposition'].indexOf("=")+1,res.headers['content-disposition'].length));
				const link = document.createElement("a");
				link.href = window.URL.createObjectURL(blob);
				link.download = fileName;
				link.click();
				window.URL.revokeObjectURL(link.href);
			}).catch((error) => {
				console.log(error);
			});
			}else{
				this.$message({
					message: "数据量过大,超过500页,请缩小查询范围！",
					type: 'warning'
				});
			}
		},
		empty(){ //清空
			this.data = {
				"branchCode": "",
				"endTime": "",
				"inusureCompanyCode": "",
				"pageNum": 1,
				"pageSize": 10,
				"productCode": "",
				"productName": "",
				"startTime": "",
				"state": '',
				"tradeCategory1": "",
				"tradeCategory2": ""
			};
			this.regionCodingHY = [];
			this.searchview();
		},
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#101010;font-weight: 600;background-color:#e8e8e8;";
			} else {
				return "";
			}
		},
	},
}
</script>

<style lang="less">
#productAccount {
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
