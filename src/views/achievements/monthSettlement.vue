<template>
	<div id="Achievements">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="6"><div>
					<span class="item2">姓名：</span>
					<el-input placeholder="请输入姓名" v-model="form.userName" size="medium" class="item1" clearable></el-input>
				</div></el-col>
				<el-col :span="6"><div>
					<span class="item2">分支机构</span>
					<el-select v-model="form.branchCode" placeholder="请选择分支机构" size="medium" class="item1" clearable filterable>
						<el-option v-for="item in options2" :key="item.jtBranchCode" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
					</el-select>
				</div></el-col>
				<el-col :span="12"><div>
					<span class="item2">提取日期：</span>
					<el-date-picker v-model="form.countDateStart" style="width:32%" type="date" size="medium" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>-
					<el-date-picker v-model="form.countDateEnd" style="width:32%" type="date" size="medium" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
				</div></el-col>
			</el-row>
            <el-row type="flex" class="row-bg">
				<el-col :span="24"><div>
					<el-button @click="empty" icon="el-icon-delete" round class="empty-button">清空条件</el-button>
					<el-button type="warning" @click="searchview" round class="query-button">查询</el-button>
				</div></el-col>
			</el-row>
		</div>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="userName" label="姓名" align="center"></el-table-column>
				<el-table-column prop="branchName" label="渠道/所属分支机构" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.channelName}} / {{scope.row.branchName}}</span>
					</template>
				</el-table-column>
				<el-table-column  label="周期" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.startDate}} 至 {{scope.row.endDate}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="amount" label="本期保单数" align="center">
					<template slot-scope="scope">
						<span class="col-org cur-op" @click="toDetail(scope.row)">{{scope.row.amount}}笔</span>
					</template>
				</el-table-column>
				<el-table-column prop="dataCom" label="同比数据" align="center">
					<template slot-scope="scope">
						比上月 <span v-if="scope.row.up" class="col-red">{{scope.row.dataCom}} %</span><span class="col-gre" v-if="scope.row.down">{{scope.row.dataCom}} %</span><span v-if="scope.row.dataCom == 0">0</span><span v-if="scope.row.dataCom === null">-</span>
					</template>
				</el-table-column>
				<el-table-column prop="performance" label="提取金额（元）" align="center">
					<template slot-scope="scope">
						<span>￥{{scope.row.performance}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="countDate" label="提取日期" align="center"></el-table-column>
			</el-table>
		</div>
		<div class="content-total">
			<el-pagination v-if="total != 0" background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"> </el-pagination>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import UserService from '../../service/UserService.js';
import CorrectionManagement from '../../service/CorrectionManagement.js';
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
import AchievementService from '../../service/AchievementService.js';
import channel from '../../../static/data/channel.json'
export default {
	data() {
		return {
			Elevator:new elevator(),
			ButtonSelection:new buttonSelection(),
            UserService:new UserService(),
			CorrectionManagement: new CorrectionManagement(),
			AchievementService: new AchievementService(),
			form:{
				pageNum:1,
				pageSize:10,
				userName: '',
                branchCode: '',
				countDateStart: '',
                countDateEnd: '',
			},
			options2:[],
			data1:[],
			total:0,
			pageNum: 1,
			pageSize: 10,
			currentPage:1,
			datas:[],
			row:{},
		}
	},
	created(){
		this.loadBranch();
		this.getMonthData();
	},
	methods: {
		toDetail(row) {
			this.$router.push({
				path:'/achievements/monthDetail',
				query:{
					id:row.id
				}
			})
		},
        // 获取分支机构
		async loadBranch(){
			let res = await this.CorrectionManagement.getBranchInfo();
			if(res.code == '0000'){
				this.options2 = [];
				let branchCode = window.sessionStorage.getItem('branchCode') == 'JT0144000' ? 'JT0144001' : window.sessionStorage.getItem('branchCode');
				if(branchCode == 'JT0000'){
					this.options2 = res.list;
				}else{
					res.list.forEach(item =>{
						if(item.jtBranchCode == branchCode){
							this.options2.push(item)
						}
					})
					this.form.branchCode = branchCode
				}
            }
        },
		handleCurrentChange: function(pageNum){//页码
			this.pageNum = pageNum;
			this.getMonthData();
		},
		searchview(){//查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.getMonthData();
		},
		empty(){//清空
			this.form = {
				pageNum:1,
				pageSize:10,
				userName: '',
                branchCode: window.sessionStorage.getItem('branchCode') == 'JT0000' ? '' : window.sessionStorage.getItem('branchCode'),
				countDateStart: '',
                countDateEnd: '',
			};
			this.pageNum = 1;
			this.currentPage = 1;
			this.getMonthData();
		},
		async getMonthData() {
			this.form.pageNum = this.pageNum;
			this.form.branchCode = window.sessionStorage.getItem('branchCode') == 'JT0000' ? this.form.branchCode : window.sessionStorage.getItem('branchCode');
			let res = await this.AchievementService.getMonth(this.form);
			if(res.code == '0000') {
				res.list.map(item => {
					item.channelName = channel.data.find(i => i.code == item.channelCode) ? channel.data.find(i => i.code == item.channelCode).name : item.channelCode;
					if(item.ratio === null) {
						item.dataCom = null;
					} else {
						let num = Number(item.ratio);
						if(num == 0) {
							item.dataCom = 0;
						}else if(num > 0) {
							item.dataCom = (num * 100).toFixed(2);
							item.up = true;
						} else {
							item.dataCom = (Math.abs(num) * 100).toFixed(2);
							item.down = true;
						}
					}
				})
				this.data1 = res.list;
				this.total = res.total;
			}
		},
	},
}
</script>

<style lang="less">
#Achievements{
	padding-bottom: 80px;
	.elesearch{
		width: calc(100% - 40px);
		min-height: 134px;
		padding: 20px 20px 10px;
		margin: 20px 20px 20px 20px;
		box-sizing: border-box;
		background-color: #fff;	
		.row-bg{
			margin-bottom: 20px;
			.item1{
				width: 65%;
			}
			.item2{
				display: inline-block;
				width: 30%;
				text-align: right;
				font-size: 16px;
				color: #666666;
				margin-right: 10px;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				line-height: 17px;
			}
			.query-button{
				width: 100px;
				height: 44px;
				float: right;
				font-weight: 600;
			}
			.empty-button{
				width: 130px;
				height: 44px;
				float: right;
				margin-left: 30px;
				background-color: #DCDCDC;
				color: #333333;
				font-weight: 600;
			}
		}
	}
	.content1{
		width: 100%;
		text-align: right;
		padding: 31px 37px 20px 21px;
		box-sizing: border-box;
	}
	.content-table{
		width: 100%;
		padding: 0 20px 30px;
		box-sizing: border-box;
	}
	.content-total{
		width: calc(100% - 50px);
		margin: 0 30px 0 20px;
		height: 60px;
		line-height: 60px;
		text-align: right;
	}
	.generation{
		display: inline-block;
		width: 103px;
		height: 34px;
		border: 1px solid #C9984A;
		border-radius:4px;
		box-sizing: border-box;
		text-align: center;
		line-height: 34px;
		margin-left: 10px;
		font-size: 14px;
		color: #C9984A;
		font-weight: 600;
		background-color: #FFF8EE;
		cursor: pointer;
	}
	.color6{
		color: #666666;
	}
	.color-blue {
		cursor: pointer;
		color: #2d8cf0;
	}
	.register-btn{
		display: inline-block;
		width: 162px;
		height: 44px;
		background:rgba(201,152,74,1);
		border-radius:4px;
		font-family:Adobe Heiti Std;
		color: #ffffff;
		font-size: 18px;
		text-align: center;
		line-height: 44px;
		cursor: pointer;
	}
	.col-org {
		color: #fa8c16;
	}
	.col-red {
		color: #f5222d;
	}
	.col-gre {
		color:#52c41a;
	}
	.cur-op {
		cursor: pointer;
	}
}
</style>
