<template>
	<div id="pushSetting">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">分支机构：</span>
						<el-select size="medium" v-model="data.branchCode" filterable placeholder="请选择" class="item2" clearable>
							<el-option v-for="(item,index) in branchList" :key="index" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
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
				<el-button type="primary" round size="medium" class="query-button fr mr20 mb10" @click="editRules">添加规则</el-button>
				<el-table :data="data1" style="width: 100%;" highlight-current-row show-header border fit :header-cell-style="getRowClass1">
					<el-table-column label="周期">
						<template slot-scope="scope">
							<p v-if="scope.row">每月20号，01点00分</p>
						</template>
					</el-table-column>
					<el-table-column label="接收人" min-width="110">
						<template slot-scope="scope">
							<p v-for="(item,index) in JSON.parse(scope.row.receiver)" :key="index">{{item.name}} / {{item.email}}</p>
						</template>
					</el-table-column>
					<el-table-column label="分支机构" min-width="100">
						<template slot-scope="scope">
							<p>{{scope.row.branchName}}</p>
						</template>
					</el-table-column>
					<el-table-column label="数据类型" align="center">
						<template slot-scope="scope">
							<p v-if="scope.row.dataType == 1">电梯</p>
						</template>
					</el-table-column>
					<el-table-column label="数据规则" align="center">
						<template slot-scope="scope">
							<p>&lt;{{scope.row.days}}</p>
						</template>
					</el-table-column>
					<el-table-column label="操作人/更新时间">
						<template slot-scope="scope">
							<p><span v-if="scope.row.updateBy">{{scope.row.updateBy}}</span><span v-else>{{scope.row.createBy}}</span> / <span v-if="scope.row.updateTime">{{scope.row.updateTime}}</span><span v-else>{{scope.row.createTime}}</span></p>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="text" @click="editRule(scope.row)">修改</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="content-total">
			<span class="ml20 content1-num">查询结果：<span style="color:#333333;maegin-right:5px">{{total}}</span>条记录</span>
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<el-dialog title="推送规则" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
			<el-form :model="receiverInfo" :rules="rules" ref="receiverInfo" label-width="100px" class="demo-ruleForm">
				<el-row v-for="(item,index) in receiverInfo.receivers" :key="index">
					<el-col :span="7">
						<el-form-item :label="'接收人' +(index+1 > 9 ? (index+1) : '0' + (index+1))" :rules="[
							{ required: true, message: '姓名不能为空', trigger: 'blur' },
							{ min: 2, max: 20, message: '长度在2-20个字符', trigger: 'blur' }
							]" :prop="'receivers.' + index + '.name'">
							<el-input placeholder="请输入姓名" v-model="item.name" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item :rules="[
							{ required: true,message: '邮箱不能为空', trigger: 'blur'},
							{type: 'email',message: '邮箱格式不正确', trigger: ['blur', 'change']},
							{ min: 5,max: 30, message: '邮箱长度5-30个字符', trigger: 'blur'}
							]" :prop="'receivers.' + index + '.email'" label-width="20px">
							<el-input placeholder="请输入邮箱地址" v-model="item.email" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label-width="10px">
							<span v-if="index==0" class="add-person" @click="addPerson"><i class="el-icon-circle-plus mr10 f18"></i>添加多个</span>
							<span v-else class="del-person" @click="delPerson(index)"><i class="el-icon-remove mr10 f18"></i></span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-col :span="24" class="border-top">
					<el-form-item label="数据类型" required>
						<span class="col-red">每月20号，01点00分</span>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="分支机构" prop="branchCode">
						<el-select size="medium" v-model="receiverInfo.branchCode" @change="chooseBranch" filterable placeholder="请选择分支机构" clearable>
							<el-option v-for="(item,index) in branchList" :key="index" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="数据类型" prop="dataType">
						<el-select size="medium" v-model="receiverInfo.dataType" placeholder="请选择数据类型" filterable clearable>
							<el-option v-for="(item,index) in dataTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="数据规则" prop="days">
						<el-select size="medium" v-model="receiverInfo.days" filterable placeholder="请选择数据规则" clearable>
							<el-option v-for="(item,index) in dataRuleList" :key="index" :label=" '&lt;' + item.value" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button round size="medium" @click="resetForm('receiverInfo')">取 消</el-button>
				<el-button round size="medium" type="warning" @click="submitForm('receiverInfo')">确定提交</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import CorrectionManagement from '@/service/CorrectionManagement.js';
import RidesService from '@/service/RidesService.js';
import moment from 'moment';
export default {
	components:{
	},
	data() {
		return {
			Elevator:new elevator(),
			CorrectionManagement:new CorrectionManagement(),
			RidesService: new RidesService(),
			data:{
				branchCode:'',
				pageNum: 1,
				pageSize: 10,
			},
			data1:[],
			branchList:[],
			branchList1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			exhibition:false,
			showFlag: false,
			appFormCode:'',
			policyHolderName:'',
			mailbox:'',
			datas:[],
			dialogVisible:false,
			data2:{},
			totalEquipmentCount:0,
			productList:[],
			dialogVisible:false,
			rules:{
				branchCode:[
					{ required: true, message: '请选择',trigger: ['blur','change']}
				],
				dataType:[
					{ required: true, message: '请选择',trigger: ['blur','change']}
				],
				days:[
					{ required: true, message: '请选择',trigger: ['blur','change']}
				],
			},
			receiverInfo:{
				createBy:window.sessionStorage.getItem('userName'),
				branchCode: '',
				branchName: '',
				dataType: '',
				days: '',
				receivers:[
					{
						name:'',
						email:''
					}
				],
				receiver:''
			},
			dataRuleList:[
				{
					value:90
				},
				{
					value:60
				},
				{
					value:30
				},
				{
					value:1
				}
			],
			dataTypeList:[
				{
					label:'电梯',
					value:1,
				},
			],
			editFlag:false
		}
	},
	created(){
			this.getRides()
			this.postEmailConfigList();
	},
	methods: {
		async getRides() { //获取缓存数据
			let branchRid = await this.RidesService.getRides('sequipListData','sequip','1');
			if(branchRid.code == '0000' && branchRid.data) {
				this.branchList1 = JSON.parse(branchRid.data).branchList;
				this.setBranch();
			} else {
				this.loadBranch() 
			}
		},
		async searchFun() {
			this.pageNum = 1;
			this.postEmailConfigList();
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
		async postEmailConfigList(){ // 查询邮件配置列表
			this.data.pageNum = this.pageNum;
			let parmes = await this.Elevator.postEmailConfigList(this.data);
			if(parmes.code == '0000') {
				this.data1 = parmes.list
				this.total = parmes.total
			}
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.postEmailConfigList();
		},
		empty(){ //清空
			this.data = {
				branchCode:'',
				pageNum: 1,
				pageSize: 10,
			};
			this.pageNum = 1;
			this.currentPage = 1;
			this.data1 = [];
			this.total = 0;
			this.postEmailConfigList();
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.postEmailConfigList();
		},
		getRowClass1({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#101010;font-weight: 600;background-color:#e8e8e8;";
			} else {
				return "";
			}
		},
		editRules() {
			this.editFlag = false;
			this.dialogVisible = true;
		},
		addPerson() {
			if(this.receiverInfo.receivers.length == 5) {
				this.$message({
					message: '最多支持5个接收人！',
					type: 'warning'
				});
				return
			}
			let obj = {
				name:'',
				email:''
			}
			this.receiverInfo.receivers.push(obj);
		},
		delPerson(index) {
			this.$confirm('是否删除该接收人?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.receiverInfo.receivers.splice(index,1)
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
			});
		},
		editRule(row) {
			this.editFlag = true;
			this.receiverInfo = JSON.parse(JSON.stringify(row));
			this.receiverInfo.receivers = JSON.parse(this.receiverInfo.receiver);
			this.dialogVisible = true;
		},
		chooseBranch() {
			this.receiverInfo.branchName = this.branchList.find(item => item.jtBranchCode == this.receiverInfo.branchCode) ? this.branchList.find(item => item.jtBranchCode == this.receiverInfo.branchCode).jtBranchName : '';
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if(this.editFlag) {
						this.submitEdit()
					} else {
						this.submitFun();
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		async submitFun() {
			this.receiverInfo.receiver = JSON.stringify(this.receiverInfo.receivers);
			let res = await this.Elevator.postAddEmailConfig(this.receiverInfo);
			if(res.code == '0000') {
				this.$message({
					type: 'success',
					message: '设置成功！'
				}); 
				this.resetForm('receiverInfo')
				this.dialogVisible = false;
				this.editFlag = false;
				this.searchview();
			}
		},
		async submitEdit() {
			this.receiverInfo.receiver = JSON.stringify(this.receiverInfo.receivers);
			this.receiverInfo.updateBy = window.sessionStorage.getItem('userName');
			this.receiverInfo.updateTime = '';
			let res = await this.Elevator.postUpdateEmailConfig(this.receiverInfo);
			if(res.code == '0000') {
				this.$message({
					type: 'success',
					message: '修改成功！'
				}); 
				this.resetForm('receiverInfo')
				this.dialogVisible = false;
				this.editFlag = false;
				this.searchview();
			}
		},
      	resetForm(formName) {
			this.receiverInfo = {
				createBy:window.sessionStorage.getItem('userName'),
				branchCode: '',
				branchName: '',
				dataType: '',
				days: '',
				receivers:[
					{
						name:'',
						email:''
					}
				],
				receiver:''
			},
			this.$refs[formName].resetFields();
			this.dialogVisible = false;
		},
		handleClose(done) {
			this.resetForm('receiverInfo');
			done();
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
		min-height: 80px;
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
	.add-person {
		font-size: 16px;
		color: #096dd9;
		cursor: pointer;
	}
	.del-person {
		font-size: 16px;
		color: #919191;
		cursor: pointer;
	}
	.border-top {
		border-top: 1px dashed #ccc;
		padding-top: 20px;
	}
	.col-red {
		color: #f5222d;
	}
}
</style>
