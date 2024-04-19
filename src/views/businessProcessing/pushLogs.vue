<template>
	<div id="pushSetting">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">接收人：</span>
						<el-input size="medium" v-model.trim="data.receiverName" placeholder="请输入" class="item2" clearable ></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">发送日期：</span>
						<el-date-picker size="medium" v-model="data.sendTimeFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<el-date-picker size="medium" v-model="data.sendTimeTo" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">操作人：</span>
						<el-input size="medium" v-model.trim="data.operator" placeholder="请输入" class="item2" clearable ></el-input>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">分支机构：</span>
						<el-select size="medium" v-model="data.operatorBranchName" filterable placeholder="请选择" class="item2" clearable>
							<el-option v-for="(item,index) in branchList" :key="index" :label="item.jtBranchName" :value="item.jtBranchName"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						
					</div>
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
			<div class="content-table">
				<el-table :data="data1" style="width: 100%;margin-top:20px;" highlight-current-row show-header border fit :header-cell-style="getRowClass1">
					<el-table-column label="发送时间">
						<template slot-scope="scope">
							<p>{{scope.row.sendTime}}</p>
						</template>
					</el-table-column>
					<el-table-column label="失效时间">
						<template slot-scope="scope">
							<p>{{scope.row.failureTime}} </p>
						</template>
					</el-table-column>
					<el-table-column label="操作人" min-width="110px">
						<template slot-scope="scope">
							<p v-if="scope.row.type == 1">{{scope.row.operator}}/{{scope.row.operatorBranchName}}</p>
							<p v-if="scope.row.type == 2">系统发送</p>
						</template>
					</el-table-column>
					<el-table-column label="接收人" min-width="130px">
						<template slot-scope="scope">
							<p>{{scope.row.receiverList[0].name}}/{{scope.row.receiverList[0].email}} <span @click="showMore(scope.row.receiverList)" class="num-style" v-if="scope.row.receiverList.length != 1">共{{scope.row.receiverList.length}}人</span></p>
						</template>
					</el-table-column>
					<el-table-column label="发送内容">
						<template slot-scope="scope">
							<p>共{{scope.row.num}}条记录</p>
						</template>
					</el-table-column>
					<el-table-column label="类型" align="center" min-width="50px">
						<template slot-scope="scope">
							<p><span v-if="scope.row.type == 1">手动</span><span v-if="scope.row.type == 2">系统</span></p>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" min-width="60px">
						<template slot-scope="scope">
							<p>
								<el-button @click="downLoadFile(scope.row.url)" v-if="scope.row.isUse" type="text">下载附件</el-button>
								<el-button v-else type="text" disabled>已失效</el-button>
							</p>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="content-total">
			<span class="content1-num ml20">查询结果：<span style="color:#333333;maegin-right:5px">{{total}}</span>条记录</span>
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<el-dialog title="接收人" :visible.sync="dialogVisible" width="30%">
			<el-table :data="tableReceivers" style="width: 100%" border>
				<el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
				<el-table-column label="姓名 邮箱" align="center">
					<template slot-scope="scope">
						<p>
							<span>{{scope.row.name}}</span>
							<span class="ml10">{{scope.row.email}}</span>
						</p>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import ResourcesService from '../../service/ResourcesService';
import UserService from '../../service/UserService';
import buttonSelection from './js/buttonSelection.js';
import CorrectionManagement from '@/service/CorrectionManagement.js';
import ProductService from '@/service/ProductService.js';
import RidesService from '@/service/RidesService.js';
import moment from 'moment';
export default {
	components:{
	},
	data() {
		return {
			Elevator:new elevator(),
			ButtonSelection:new buttonSelection(),
			ResourcesService: new ResourcesService(),
			UserService: new UserService(),
			CorrectionManagement:new CorrectionManagement(),
			ProductService: new ProductService(),
			RidesService: new RidesService(),
			data:{
				pageNum:1,
				pageSize:10,
				operatorBranchName:'',
				operator:sessionStorage.getItem('branchCode') == 'JT0000' ? '' : sessionStorage.getItem('userName'),
				receiverName:'',
				sendTimeFrom:'',
				sendTimeTo:''

			},
			options2:[],
			options22:[],
			data1:[],
			branchList:[],
			branchList1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			showFlag: false,
			dialogVisible:false,
			showBranch:false,
			tableReceivers:[]
		}
	},
	created(){
		sessionStorage.getItem('branchCode') == 'JT0000' ? this.showBranch = true : this.showBranch = false
		Promise.all([this.getRides()]).then((res)=> {
			this.logsList();
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
			this.logsList();
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
			if(window.sessionStorage.getItem('provinceCode') == '000000') {
				this.options2 = this.options22;
			} else {
				this.options2 = this.ButtonSelection.Accessarea(this.options22, window.sessionStorage.getItem('provinceCode'));
			}
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
		async logsList(){ // 获取投保单列表
			this.data.pageNum = this.pageNum;
			this.data.operator = sessionStorage.getItem('branchCode') == 'JT0000' ? this.data.operator : sessionStorage.getItem('userName')
			let res = await this.Elevator.postPushLogs(this.data);
			if(res.code == '0000') {
				if(res.list.length == 0) {
					this.$message({
						type: 'warning',
						message: '暂无数据！'
					}); 
				}
				res.list.forEach(i => {
					if(new Date().getTime() > new Date(i.failureTime).getTime()) {
						i.isUse = false
					} else {
						i.isUse = true
					}
				})
				this.data1 = res.list
				this.total = res.total
			}
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.logsList();
		},
		empty(){ //清空
			this.data = {
				pageNum:1,
				pageSize:10,
				operatorBranchName:'',
				operator:sessionStorage.getItem('branchCode') == 'JT0000' ? '' : sessionStorage.getItem('userName'),
				receiverName:'',
				sendTimeFrom:'',
				sendTimeTo:''
			};
			this.pageNum = 1;
			this.currentPage = 1;
			this.data1 = [];
			this.total = 0;
			this.logsList();
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.logsList();
		},
		getRowClass1({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#101010;font-weight: 600;background-color:#e8e8e8;";
			} else {
				return "";
			}
		},
		downLoadFile(url) {
			window.open(url);
		},
		showMore(data) {
			this.tableReceivers = data;
			this.dialogVisible = true;
		}
	},
}
</script>

<style lang="less">
#pushSetting {
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
			padding: 20px 20px 30px;
			margin-bottom: 40px;
			box-sizing: border-box;
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
			.num-style {
				text-decoration: underline;
				cursor: pointer;
				margin-left: 8px;
				color: #096dd9;
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
			// margin-left: 5px;
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
}
</style>
