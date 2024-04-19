<template>
	<div id="Achievements">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div>
					<span class="item2">姓名：</span>
					<el-input placeholder="请输入姓名" v-model="form.userName" size="medium" class="item1" clearable></el-input>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item2">工号：</span>
					<el-input placeholder="请输入工号" v-model="form.userNo" size="medium" class="item1" clearable></el-input>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item2">分支机构：</span>
					<el-select v-model="form.branchCode" placeholder="请选择分支机构" class="item1" size="medium" filterable clearable>
						<el-option v-for="item in options2" :key="item.jtBranchCode" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
					</el-select>
				</div></el-col>
			</el-row>
            <el-row type="flex" class="row-bg">
				<el-col :span="24"><div>
					<el-button @click="empty" icon="el-icon-delete" round class="empty-button">清空条件</el-button>
					<el-button type="warning" @click="searchview" round class="query-button">查询</el-button>
				</div></el-col>
			</el-row>
		</div>
		<!-- <div class="content1"  v-if="datas.find(item => item.key == '70011')">
			<el-button type="primary" v-if="datas.find(item => item.key == '70001')">导出结果</el-button>
		</div> -->
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column label="人员信息" align="center">
                    <template slot-scope="scope">
                        <p><span>{{scope.row.userName}} </span></p>
                        <p><span>NO:{{scope.row.userNo}} </span><span> {{scope.row.branchName}}</span></p>
					</template>
                </el-table-column>
				<!-- <el-table-column label="渠道" align="center" prop="channelName" min-width="70"></el-table-column> -->
				<el-table-column label="人员类型" align="center" prop="personType" min-width="70"></el-table-column>
				<el-table-column label="累计保费（元）/数量" align="center">
                    <template slot-scope="scope">
                        <p class="cur-op col-blue" @click="toDetail(scope.row)">
                            <span>￥{{scope.row.premiumSum}}</span>
                            <span>/ {{scope.row.amountSum}}</span>
                        </p>
                    </template>
                </el-table-column>
				<el-table-column label="累计绩效金额（元）" align="center">
                    <template slot-scope="scope">
                        <span>￥{{scope.row.performanceSum}}</span>
                    </template>
                </el-table-column>
				<el-table-column label="已结绩效" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.afterPerformanceSum">￥{{scope.row.afterPerformanceSum}}</span>
						<span v-else>0</span>
                    </template>
                </el-table-column>
				<el-table-column fixed="right" label="未结绩效（总计=有效+冻结）" align="center">
					<template slot-scope="scope">
						<span class="col-gre">{{scope.row.beforePerformanceSum ? scope.row.beforePerformanceSum : 0}}</span>=<span class="col-red">{{scope.row.validPerformanceSum ? scope.row.validPerformanceSum : 0}}</span>+<span class="col-grey">{{scope.row.icePerformanceSum ? scope.row.icePerformanceSum : 0}}</span>
					</template>
				</el-table-column>
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
import AchievementService from '../../service/AchievementService.js';
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
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
                userNo: '',
                branchCode: '',
			},
			options:[],
			options1:[],
			options2:[],
			data1:[],
			total:0,
			pageNum: 1,
			pageSize: 10,
			currentPage:1,
			datas:[],
			exhibition:false,
			row:{},
			dialogVisible:false,
			ruleForm:{
				userLoginId:'',
				password:'',
				checked:true
			},
		}
	},
	created(){
		this.loadBranch();
		this.getAchData();
	},
	methods: {
        toDetail(row) {
			this.$router.push({
				path:'/achievements/detail',
				query:{
					id:row.userNo
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
			this.getAchData();
		},
		searchview(){//查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.getAchData();
		},
		empty(){//清空
			this.form = {
				pageNum:1,
				pageSize:10,
				userName:'',
				userNo:'',
				branchCode:window.sessionStorage.getItem('branchCode') == 'JT0000' ? '' : window.sessionStorage.getItem('branchCode')
			};
			this.options = [];
			this.pageNum = 1;
			this.currentPage = 1;
			this.getAchData();
		},
		async getAchData() {
			this.form.pageNum = this.pageNum;
			this.form.branchCode = window.sessionStorage.getItem('branchCode') == 'JT0000' ? this.form.branchCode : window.sessionStorage.getItem('branchCode');
			let res = await this.AchievementService.getAch(this.form);
			if(res.code == '0000') {
				res.list.map(item => {
					item.personType = "全面营销人员";
					// item.channelName = channel.data.find(i => i.code == item.channelCode) ? channel.data.find(i => i.code == item.channelCode).name : item.channelCode;
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
    .col-red {
		color: #f5222d;
	}
	.col-gre {
		color:#52c41a;
	}
	.cur-op {
		cursor: pointer;
    }
    .col-grey {
        color:#848484;
    }
    .col-blue {
        color: #0432ff;
    }
}
</style>
