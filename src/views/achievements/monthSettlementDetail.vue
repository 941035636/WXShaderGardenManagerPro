<template>
	<div id="Achievements">
		<!-- <div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="6"><div>
					<span class="item2">姓名：</span>
					<el-input placeholder="请输入姓名" v-model="form.userName" size="medium" class="item1" clearable></el-input>
				</div></el-col>
				<el-col :span="6"><div>
					<span class="item2">分支机构：</span>
					<el-select v-model="form.branchCode" placeholder="请选择分支机构" size="medium" class="item1" clearable filterable>
						<el-option v-for="item in options2" :key="item.jtBranchCode" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
					</el-select>
				</div></el-col>
				<el-col :span="12"><div>
					<span class="item2">生成时间：</span>
					<el-date-picker v-model="form.createTimeStart" type="date" size="medium" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>-
					<el-date-picker v-model="form.createTimeEnd" type="date" size="medium" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="12"><div>
					<span class="item2" style="width: 15%;">提取时间：</span>
					<el-date-picker v-model="form.countTimeStart" type="date" size="medium" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>-
					<el-date-picker v-model="form.countTimeEnd" type="date" size="medium" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
				</div></el-col>
			</el-row>
            <el-row type="flex" class="row-bg">
				<el-col :span="24"><div>
					<el-button @click="empty" icon="el-icon-delete" round class="empty-button">清空条件</el-button>
					<el-button type="warning" @click="searchview" round class="query-button">查询</el-button>
				</div></el-col>
			</el-row>
		</div> -->
		<div class="content-table mt20">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="name" label="绩效保/批单信息" align="center" min-width="150">
					<template slot-scope="scope">
						<div v-if="scope.row.policyNo">
							<p>保单号：{{scope.row.policyNo}}</p>
							<p>投保时间：{{scope.row.applicantDate}}</p>
						</div>
						<div v-if="scope.row.endorseNo">
							<p>批单号：{{scope.row.endorseNo}}</p>
							<p>批单日期：{{scope.row.applicantDate}}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="productName" label="产品信息" align="center"></el-table-column>
				<el-table-column prop="policyHolder" label="投保人信息" min-width="150" align="center"></el-table-column>
				<el-table-column prop="performance" label="绩效金额（元）" align="center" min-width="80">
					<template slot-scope="scope">
						<span>{{scope.row.performance}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="typeName" label="类型" align="center" min-width="50"></el-table-column>
				<el-table-column prop="ratio" label="绩效比例" align="center" min-width="50">
					<template slot-scope="scope">
						<span class="col-org cur-op" v-if="!scope.row.ratio">{{scope.row.ratio}} %</span>
						<span class="col-org cur-op" v-else>{{(scope.row.ratio*100).toFixed(2)}} %</span>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="绩效时间" align="center"></el-table-column>
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
export default {
	data() {
		return {
			Elevator:new elevator(),
			ButtonSelection:new buttonSelection(),
            UserService:new UserService(),
			CorrectionManagement: new CorrectionManagement(),
			AchievementService: new AchievementService(),
			form:{
				pageNum:'',
				pageSize:10,
				name: '',
                issueDateStart: '',
				issueDateEnd: '',
                branchCode: '',
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
		this.getAchDetail()
	},
	methods: {
		
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
			this.getAchDetail()
		},
		searchview(){//查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.getAchDetail()
		},
		empty(){//清空
			this.form = {
				pageNum:1,
				pageSize:10,
				name: '',
                issueDateStart: '',
				issueDateEnd: '',
                branchCode: '',
			};
			this.pageNum = 1;
			this.currentPage = 1;
			this.getAchDetail()
		},
		async getAchDetail() {
			this.form.pageNum = this.pageNum;
			this.form.monthCountId = this.$route.query.id;
			this.form.branchCode = window.sessionStorage.getItem('branchCode') == 'JT0000' ? '' : window.sessionStorage.getItem('branchCode');
			let res = await this.AchievementService.getAchDetail(this.form);
			if(res.code == '0000') {
				let currentTime = new Date();
				res.list.map(item => {
					let num = Number(item.performance);
					if(new Date(item.startDate).getTime() > currentTime.getTime() ) {
						item.typeName = '冻结'
					} else {
						item.typeName = num >= 0 ? '绩效-正' : '绩效-负'
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
		min-height: 140px;
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
				line-height: 15px;
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
