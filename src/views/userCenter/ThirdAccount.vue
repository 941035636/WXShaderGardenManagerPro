<template>
	<div id="thirdAccount" class="third-account">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">公司名称：</span>
						<el-input v-model.trim="searchForm.companyName" placeholder="请输入公司名称" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">联系方式：</span>
						<el-input v-model.trim="searchForm.phone" placeholder="请输入联系方式" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">状态：</span>
						<el-select v-model="searchForm.state" placeholder="请选择状态"  size="small" clearable>
							<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<div class="elesearch-btn">
				<span @click="searchview" class="query-button">查询</span>
				<span @click="empty" class="empty-button">清空筛选条件</span>
			</div>
		</div>


		<div class="content-table">
			<div class="content">
				<div style="height:50px">
					<el-button type="primary" style="float:right;margin-top:10px;margin-right:20px;letter-spacing:2px;" round size="medium" @click="handUpDialog">新增</el-button>
				</div>
				<div class="content-title">
					<el-row type="flex" class="row-bg">
						<el-col :span="10">
							<div style="padding-left:10px;box-sizing: border-box;">
								企业信息
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding-left:10px;box-sizing: border-box;">
								联系信息/职位
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding-left:10px;box-sizing: border-box;">
								授权平台
							</div>
						</el-col>
						<el-col :span="2">
							<div style="padding-left:10px;box-sizing: border-box;">
								状态
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding-left:10px;box-sizing: border-box;">
								操作
							</div>
						</el-col>
					</el-row>
				</div>
				<div v-if="data1.length == 0" class="no-data">
					暂无数据
				</div>
				<div class="content-item" v-for="(item,index) in data1" :key="index" v-else>
					<el-row type="flex" class="row-bg">
						<el-col :span="10">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span class="col-blue mr20">{{item.companyName}}</span><span>商户类型：设施主</span></p>
								<p><span class="mr20" >商户号：{{item.authCode}}</span><span>创建时间：<span>{{item.createTime}}</span></span></p>
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p>
									<span>{{item.phone}}</span>
								</p>
								<p>
									<span>职位：企业用户</span>
								</p>
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p>
									<span class="col-gre" v-if="item.register == '0'">已申请</span>
									<span class="col-gre" v-if="item.register == '1'">推送成功</span>
									<span class="col-org" v-if="item.register == '2'">推送失败<i class="el-icon-question cur-op" style="margin-left:10px;" @click="showError(item)"></i> </span>
								</p>
								<p><span class="col-grey">智能平台</span></p>
							</div>
						</el-col>
						<el-col :span="2">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p>
									<el-switch v-model="item.stateFlag" :disabled="item.register == '2'" @change="changeState(item)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
								</p>
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span class="col-blue cur-op" @click="deleteAccount(item)">删除</span></p>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<Dialog  ref="dialog"
              :title="dialogTitle"
              :dialogVisible="dialogVisible"
              :size="size"
              :form="configForm"
              :isAdd="isAdd"
              @handUpDialog="handUpDialog"
              @addConfigAccount="addConfigAccount"
              ></Dialog>
			  <!-- @editConfigAccount="editConfigAccount" -->
		<ErrInLog :size="size" :dialogVisible="dialogVisible1" :data="errorInfo" @againAccount="againAccount" @closeLog="closeLog"></ErrInLog>
	</div>
</template>

<script>
import userService from '../../service/UserService'
import Dialog from './components/addFormAccount'
import ErrInLog from './components/errorInfoLog'
export default {
	components:{
		Dialog,ErrInLog
	},
	data() {
		return {
			errorInfo:{},
			dialogVisible1: false,
			dialogVisible: false,
			dialogTitle:'新增授权信息',
			size: "medium",
			isAdd: true,
			userService: new userService(),
			searchForm: {
				companyName:'',
				phone:'',
				state:''
			},
			configForm: {
				companyName: "",                // 公司名称
				authCode: "",            // 
				industry: "",         // 
				linkname: "",               // 联系人名称
				platformCode: "",
				position: "",                   // 
				remark: "",                 // 
				scene: "",               //
				telphone: "",              //联系方式
				thirdCorpId: "",       //用户编号
				thirdCorpType: ""
			},
			options1:[
				{
					label: '有效',
					value: 1
				},
				{
					label: '无效',
					value: 0
				}
			],
			data1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1
		}
	},
	created(){
		this.thirdAccList();
	},
	methods: {
		async thirdAccList(){
			this.searchForm.pageNum = this.pageNum;
			this.searchForm.pageSize = 10;
			let res = await this.userService.getThirdAcc(this.searchForm);
			if(res.code == '0000') {
				this.data1 = res.list.map(i => {
					return {
						...i,
						stateFlag: i.state == 1 ? true : false
					}
				})
				this.total = res.total;
			}
		},
		searchview(){
			this.pageNum = 1;
			this.currentPage = 1;
			this.thirdAccList();
		},
		empty(){
			this.searchForm = {
				companyName:'',
				phone:'',
				state:''
			}
			this.pageNum = 1;
			this.currentPage = 1;
			this.thirdAccList();
		},
		handleCurrentChange: function(pageNum){
		    this.pageNum = pageNum;
			this.thirdAccList();
		},
		handUpDialog() {
			this.dialogTitle = "新增授权信息"
			this.isAdd = true;
			this.$refs['dialog'].dialogVisible = true;
			this.configForm = {
				companyName: "",                // 公司名称
				authCode: "",            // 
				industry: "",         // 
				linkname: "",               // 联系人名称
				platformCode: "",
				position: "",                   // 
				remark: "",                 // 
				scene: "",               //
				telphone: "",              //联系方式
				thirdCorpId: "",       //用户编号
				thirdCorpType: ""
			}
		},
		async addConfigAccount(form) {
			let params = {};
			for (const key in form) {
				if (form[key] != "" && form[key] != null) {
				params[key] = form[key];
				}
			}
			if(!params.thirdCorpId) {
				this.$message({
					message: '请选择企业',
					type: 'error'
				});
				return
			}
			let res = await this.userService.addThirdAccount(params);
			if (res.code === '0000') {
				this.$message({
					message: '添加成功！',
					type: 'success'
				});
				this.$refs['dialog'].dialogVisible = false;
				this.$refs['dialog'].$refs.searchHolder.reSetData();
				this.thirdAccList();
			}
		},
		showError(row) {
			this.errorInfo = row;
			this.dialogVisible1 = true;
		},
		closeLog() {
			this.dialogVisible1 = false;
		},
		againAccount(item) {
			let obj = {
				companyName: item.companyName,                // 公司名称
				authCode: "",            // 
				industry: "",         // 
				linkname: item.linkman,               // 联系人名称
				platformCode: "",
				position: "",                   // 
				remark: "",                 // 
				scene: "",               //
				telphone: item.phone,              //联系方式
				thirdCorpId: item.userCode,       //用户编号
				thirdCorpType: ""
			}
			this.addConfigAccount(obj);
		},
		deleteAccount(item) {
			this.$confirm('是否删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.delFun(item);
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
		},
		async delFun(item) {
			let obj = {
				"deleted": 1,
				"userCode": item.userCode,
				"id": item.id
			}
			let res = await this.userService.updateThirdAcc(obj);
				if(res.code == '0000') {
					this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}
			this.thirdAccList();
		},
		async changeState(row) {
			let obj = {
				"state": row.stateFlag ? 1:0,
				"userCode": row.userCode,
				"id": row.id
			}
			let res = await this.userService.updateThirdAcc(obj);
				if(res.code == '0000') {
					this.$message({
					type: 'success',
					message: '更新成功!'
				});
			}
			this.thirdAccList();
		}
	},
}

</script>

<style lang="less" scoped>
#thirdAccount {
	padding-bottom: 80px;
	min-height: 1000px;
	box-sizing: border-box;
	background-color: #f2f1ef;
	.elesearch{
		// width: 100%;
		min-height: 234px;
		padding: 30px 20px;
		margin: 10px 20px;
		box-sizing: border-box;
		background-color: #ffffff;
		.row-bg{
			margin-bottom: 20px;
			line-height: 40px;
			.item1{
				display: block;
				width: 8%;
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
		width: 100%;
		text-align: right;
		padding: 0 30px 20px;
		box-sizing: border-box;
	}
	.no-data{
		width: 100%;
		height: 100%;
		line-height: 70px;
		font-size: 16px;
		color: #999;
		font-weight: 500;
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
				height: 60px;
				line-height: 60px;
				font-size: 14px;
				color: #333333;
				font-weight: 600;
				border-bottom: 1px solid #F1EEE9;
			}
			.content-item{
				width: 100%;
				border-bottom: 1px solid #F1EEE9;
				box-sizing: border-box;
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
	.col-red {
		color: #f5222d;
	}
	.col-blue {
		color: #096dd9;
	}
	.col-org {
		color: #fa8c16;
	}
	.col-gre {
		color: #389e0d;
	}
	.col-grey {
		color: #919191;
	}
	.cur-op {
		cursor: pointer;
	}
}
</style>
