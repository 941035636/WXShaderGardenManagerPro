<template>
	<div class="userList" id="userList">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div>
					<span class="item2">用户名称/用户名</span>
					<el-input placeholder="请输入用户名称/用户名" v-model="form.loginIdOrUserName" class="item1" clearable></el-input>
				</div></el-col>
				<!-- <el-col :span="8"><div>
					<span class="item2">信用代码</span>
					<el-input placeholder="请输入" v-model="form.papers" class="item1" clearable></el-input>
				</div></el-col> -->
				<el-col :span="8"><div>
					<span class="item2">企业类型</span>
					<el-select v-model="form.userType" placeholder="请选择企业类型" class="item1" clearable>
						<el-option v-for="item in options2" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
					</el-select>
				</div></el-col>
				<el-col :span="8"><div style="display:flex;">
					<span class="item2">注册时间</span>
					<el-date-picker v-model="form.registeredStartTime" type="datetime" class="item5" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					<span class="item11">至</span>
					<el-date-picker v-model="form.registeredEndTime" type="datetime" class="item5" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<!-- <el-col :span="8"><div>
					<span class="item2">企业类型</span>
					<el-select v-model="form.userType" placeholder="请选择企业类型" class="item1" clearable>
						<el-option v-for="item in options2" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
					</el-select>
				</div></el-col> -->
				<!-- <el-col :span="8"><div>
					<span class="item2">星级</span>
					<el-select v-model="form.starLevel" placeholder="请选择企业类型" class="item1" clearable>
						<el-option v-for="item in optionStar" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div></el-col> -->
				<el-col :span="8"><div>
					<span class="item2">区域</span>
					<el-cascader :options="options1"  placeholder="请选择" change-on-select v-model="options" class="item1" clearable></el-cascader>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div></div></el-col>
				<el-col :span="8"><div></div></el-col>
				<el-col :span="8"><div>
					<el-button @click="empty" icon="el-icon-delete" round class="empty-button">清空条件</el-button>
					<el-button type="warning" @click="searchview" round class="query-button">查询</el-button>
				</div></el-col>
			</el-row>
		</div>
		<el-tabs type="border-card" v-model="form.statusAndAuditStatus" @tab-click="searchFun" class="state-style">
			<el-tab-pane :label="item.label" :name="item.value" v-for="(item,index) in auditStatusSelectData" :key="index"></el-tab-pane>
		</el-tabs>
		<div class="content1"  v-if="datas.find(item => item.key == '70011')">
			<el-button type="primary" @click="newlyAdded" round>添加用户</el-button>
		</div>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit :header-cell-style="getRowClass">
				<el-table-column prop="userloginId" label="登录账号" align="center" min-width="200"></el-table-column>
				<el-table-column prop="custFullName" label="认证信息" min-width="300">
					<template slot-scope="scope">
							<div>
								<span>
									{{scope.row.custFullName}}
								</span>
							</div>
							<div>
								<span>
									<!-- {{'需要用户中心增加证件号字段，企业类型字段，注册时间字段，账号状态字段,投保人性质'}} -->
									{{scope.row.creditCode}}
								</span>
								<span>{{scope.row.province}}/</span>
								<span>{{scope.row.city}}/</span>
								<span>{{scope.row.area}}</span>
							</div>
						</template>
				</el-table-column>
				<el-table-column label="星级" align="center" width="100">
					<template slot-scope="scope">
							<div>
								<span v-if="scope.row.startLevel">
									{{scope.row.startLevel}}星级
								</span>
							</div>
							<div class="cur-op" @click="setStar(scope.row,'update')" v-if="scope.row.startLevel">
								<i class="el-icon-success col-gre"></i>
								<span class="color-blue">
									变更
								</span>
							</div>
							<div class="cur-op" @click="setStar(scope.row,'add')" v-if="!scope.row.startLevel">
								<i class="el-icon-warning col-grey"></i>
								<span>
									设置
								</span>
							</div>
						</template>
				</el-table-column>
				<el-table-column label="企业类型" align="center" width="200">
					<template slot-scope="scope">
						<p>
							<span>{{scope.row.userType}}</span>
							<span v-if="scope.row.applicantTypeValues !='0'">/</span>
							<span v-if="scope.row.applicantTypeValues !='0'">{{scope.row.applicantTypeValues}}</span>
						</p>
					</template>
				</el-table-column>
				<el-table-column label="注册时间/账号状态" align="center" width="200">
					<template slot-scope="scope">
						<p>{{scope.row.createTime}}</p>
						<p>
							<span v-if="scope.row.status == '1'" class="col-gre">启用</span>
							<span v-else-if="scope.row.status == '0'" class="color-red">已停用</span>
						</p>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template slot-scope="scope" type="flex">
						<el-button type="text" @click="detail(scope.row)">查看</el-button>
						<el-dropdown size="small" trigger="click" class="drdown">
							<span class="el-dropdown-link" style="cursor:pointer">操作</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item @click.native="modify(scope.row)" v-if="datas.find(item => item.key == '70002')">编辑</el-dropdown-item>
								<el-dropdown-item @click.native="relation(scope.row)" v-if="datas.find(item => item.key == '70003')">电梯设备</el-dropdown-item>
								<el-dropdown-item @click.native="relation1(scope.row)" v-if="datas.find(item => item.key == '70004')">索道设备</el-dropdown-item>
								<el-dropdown-item @click.native="enable(scope.row)" v-if="scope.row.status == '1' && datas.find(item => item.key == '70006')" >停用</el-dropdown-item>
								<el-dropdown-item @click.native="enable(scope.row)" v-if="scope.row.status == '0' && datas.find(item => item.key == '70005')">启用</el-dropdown-item>
								<el-dropdown-item @click.native="resetPassword(scope.row)" v-if="datas.find(item => item.key == '70010')">重置密码</el-dropdown-item>
								<el-dropdown-item @click.native="resetLoginId(scope.row)" >重置登录账号</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="content-total">
			<el-pagination v-if="total != 0" background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"> </el-pagination>
		</div>
		<el-dialog :visible.sync="dialogVisible" width="30%" center>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
				<el-form-item label="证件号码" prop="userLoginId">
					<el-input v-model="ruleForm.userLoginId" placeholder="社会信用统一代码/组织机构代码" style="width:60%;"></el-input>
				</el-form-item>
				<el-form-item label="设置密码" prop="password">
					<el-input v-model="ruleForm.password" placeholder="请输入密码" style="width:60%;"></el-input><span @click="randomGeneration" class="generation">随机生成</span>
				</el-form-item>
				<el-form-item>
					<el-checkbox v-model="ruleForm.checked"><span class="color6">我已阅读并接受</span></el-checkbox><span class="color-blue" @click="downFile">《特设保注册协议》</span>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<span @click="register(ruleForm)" class="register-btn">确认注册</span>
			</span>
		</el-dialog>
		<!-- 设置星级 -->
		<SetStar ref="SetStar" @successCallback="getUserlist"/>
		<!-- 重置密码 -->
		<ResetPassword ref="ResetPassword" @successCallback="getUserlist"/>
		<!-- 设置账号状态 -->
		<SetUserStatus ref="SetUserStatus" @successCallback="getUserlist"/>
		<!-- 变更登录账号 -->
		<ResetUserLoginId ref="ResetUserLoginId" @successCallback="getUserlist"/>
		<!-- 新增账号组件 -->
		<CreateWebUser ref="CreateWebUser" :areaData="options1" @successCallback="getUserlist"/>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import UserService from '../../service/UserService.js';
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
import SetStar from './components/SetStar'
import ResetPassword from './components/ResetPassword'
import SetUserStatus from './components/SetUserStatus'
import CreateWebUser from './components/CreateWebUser'
import ResetUserLoginId from "./components/ResetUserLoginId"; // 重置账号
import enumeration from '../../../static/data/enumeration.json'
import ResourcesService from '@/service/ResourcesService'
export default {
	components:{
		SetStar,
		ResetPassword,
		SetUserStatus,
		CreateWebUser,
		ResetUserLoginId,
	},
	data() {
		return {
			Elevator:new elevator(),
			ButtonSelection:new buttonSelection(),
			UserService:new UserService(),
			form:{
				pageNum:'',
				pageSize:10,
				loginIdOrUserName:'',
				papers:'',
				userType:'',
				areaCode:'',
				statusAndAuditStatus:'all',
			},
			options:[],
			options1:[],
			options2:[],
			optionStar:enumeration['optionStar'],
			data1:[],
			total:0,
			pageNum: 1,
			pageSize: 10,
			currentPage:1,
			datas:[],
			row:{},
			dialogVisible:false,
			ruleForm:{
				userLoginId:'',
				password:'',
				checked:true
			},
			// 审核状态
			auditStatusSelectData: [
				{ label: "全部", value: "all",status:"",auditStatus:""},
				// { label: "有效", value: "0",status:"1",auditStatus:"0"},
				// { label: "已停用", value: "1",status:"0",auditStatus:"1" }
			],
			rules:{
				userLoginId: [
					{ required: true, message: '请输入证件号码', trigger: 'blur' },
					{ max: 30, message: '社会信用统一代码/组织机构代码最大为30位', trigger: 'blur' },
					{pattern: /^[0-9a-zA-Z]+$/,message: '社会信用统一代码/组织机构代码必须是字母或数字！'}
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{pattern: /^(?=.*?[a-zA-Z])(?=.*?[0-9])[\w\W]{8,20}$/,message: '密码必须为8-20位大小写字母、数字或符号组合哦！'}
				],
			},
		}
	},
	created(){
		this.getArea();
		this.elementRelaConf();
		this.datas = JSON.parse(window.sessionStorage.getItem('list'));
	},
	methods: {
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.options1 = parmes.data;
				if(window.localStorage.getItem('index') == '9'){
					this.gettingCache();
				}
				// else{
				// 	window.localStorage.removeItem('data');
				// 	this.getUserlist();
				// }
			}
		},
		async getUserlist(){//获取用户列表
			this.form.pageNum = this.pageNum;
			if(this.options.length){
				this.form.areaCode = this.options[this.options.length-1]
			}else{
				if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
					this.form.areaCode = ''
				}else{
					this.form.areaCode = window.sessionStorage.getItem('authDataArea') ? window.sessionStorage.getItem('authDataArea') : window.sessionStorage.getItem('provinceCode')
				}
			}
			let res = await this.UserService.getuserlist(this.form);
			if(res.code == '0000'){
				this.form.options = this.options;
				window.localStorage.setItem('data',JSON.stringify(this.form));
				window.localStorage.setItem('index',9);
				this.data1 = res.list;
				this.total = res.total;
				this.data1.forEach(item =>{
					if(item.areaCode){
						item.provinceCode = item.areaCode.slice(0,2)+'0000';
						item.cityCode = item.areaCode.slice(0,4)+'00';
						item.areaCode = item.areaCode;
						this.options1.forEach(ele =>{
							if(item.provinceCode == ele.value){
								item.province = ele.label;
								ele.children.forEach(eles =>{
									if(item.areaCode.slice(2,4) != '00'){
										if(item.cityCode == eles.value){
											item.city = eles.label;
											eles.children.forEach(items =>{
												if(item.areaCode.slice(4,6) != '00')
												if(item.areaCode == items.value){
													item.area = items.label;
												}
											})
										}
									}
								})
							}
						})	
					}
				})
			}
		},
		gettingCache(){//缓存
			let data = JSON.parse(window.localStorage.getItem('data'));
			if(data) {
				this.form = data;
				this.options = data.options;
				this.pageNum = data.pageNum;
				this.currentPage = data.pageNum;
			}
			this.getUserlist();
		},
		handleCurrentChange: function(pageNum){//页码
			this.pageNum = pageNum;
			this.getUserlist();
		},
		async elementRelaConf() {//获取用户类型		
			let data = await this.Elevator.elementRelaConf();
			if(data.code == '0000'){
				this.options2 = data.list.filter((item)=>item.valuesCode != 'sequip_A')
			}
		},
		searchview(){//查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.getUserlist();
		},
		empty(){//清空
			this.form = {
				pageNum:1,
				pageSize:10,
				loginIdOrUserName:'',
				papers:'',
				userType:'',
				areaCode:''
			};
			this.options = [];
			this.pageNum = 1;
			this.currentPage = 1;
			this.getUserlist();
		},
		newlyAdded(){//新增
			this.$refs.CreateWebUser.openDialog()
		},
		downFile() {//下载特设备注册协议
			// let resourcesService = new ResourcesService()
			// resourcesService.downloadOrViewFile(`${this.$apiUrl.DOWNLOAD_FILE}?fileId=1672097804182880373&free=1`,true)
			// window.location.href = `${this.$apiUrl.DOWNLOAD_FILE}?fileId=1672097804182880373&free=1`;
		},
		register(ruleForm){//新增用户表单验证
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					if(!ruleForm.checked){
						this.$message({
							message: '请阅读并勾选特社保注册协议',
							type: 'warning'
						});
						return;
					}
					this.sequipRegister();
				} else {
					return false;
				}
			});
		},
		async sequipRegister(){//新增用户调用
			let data = {
				"channelCode": "sequip",
				"password": this.passwordFormat(this.ruleForm.password),
				"userLoginId": this.ruleForm.userLoginId,
				"isCheck": 1
			};
			const res = await this.UserService.Register(data);
			if(res.code == '0000'){
				this.$message({
					message: '新增用户成功',
					type: 'success'
				});
				this.gettingCache();
				this.dialogVisible = false;
			}
		},
		detail(row){//跳转详情
			this.$router.push({
				path:'/account/company/detail',
				query:{
					userCode:row.userCode,
					userType:row.userType,
					userLoginId:row.userloginId,
					createTime:row.createTime,
				}
			})
		},
		modify(row){//跳转详情
			this.$router.push({
				path:'/account/company/edit',
				query:{
					userCode:row.userCode,
					userType:row.userType,
					userLoginId:row.userloginId,
					createTime:row.createTime,
				}
			})
		},
		relation(row){//用户电梯信息
			this.$router.push({
				path:'/account/company/elevator',
				query:{
					userCode :row.userCode
				}
			})
		},
		relation1(row){//用户索道信息
			this.$router.push({
				path:'/account/company/cableway',
				query:{
					userCode :row.userCode
				}
			})
		},
		enable(row){//停用与启用
			this.$refs.SetUserStatus.initData(row)
		},
		resetPassword(row){//重置密码
			this.$refs.ResetPassword.open(row)
		},
		resetLoginId(row){//重置密码
			this.$refs.ResetUserLoginId.open(row)
		},
		randomGeneration(){//随机生成
			let password = this.$numberHelper.RandomCipher(8);
			let reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9])[\w\W]{8,20}$/;
			if(reg.test(password)){
				this.ruleForm.password = password;
			}else{
				this.randomGeneration();
			}
		},
		passwordFormat(password) {
			let md5Password = this.$md5(password);
			let passArray = md5Password.split('');
			for(let i = 1; i < passArray.length; i+=2) {
				let temporary = passArray[i];
				passArray[i] = passArray[i-1];
				passArray[i-1] = temporary;
			}
			let totalNumber = 0;
			passArray.forEach(item=> {
				totalNumber += parseInt(item, 16); });
			let lastChar = totalNumber%2;
			let result = passArray.join('')+lastChar;
			return result;
		},
		// 查询
		async searchFun() {
			this.pageNum = 1;
			let {status, auditStatus} = this.auditStatusSelectData.find(item=>item.value==this.form.statusAndAuditStatus) || {}
			this.form.status = status
			this.getUserlist();
		},
		// 设置表头样式
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "background:#f5f5f5;color:#000";
			} else {
				return "";
			}
		},
		// 设置星级
		setStar(row,flag) {
			this.$refs.SetStar.initData(row,flag)
		},
	},
}
</script>

<style lang="less">
#userList{
	padding-bottom: 80px;
	.elesearch{
		// width: 100%;
		// padding: 31px 37px 0 21px;
		// box-sizing: border-box;
		width: calc(100% - 40px);
		min-height: 234px;
		padding: 20px 20px 10px;
		margin: 0px 20px 0 20px;
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
				vertical-align: middle;
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
			.item11{
				display: block;
				width: 10%;
				text-align: center;
				line-height: 40px;
			}
			.item5{
				width: 30%;
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
	.state-style {
		background-color: #ffffff;
		font-size: 16px;
		margin: 10px 20px 0 20px;
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
	.content1{
		text-align: right;
		padding: 10px 20px 10px 20px;
		margin: 0px 20px 0 20px;
		box-sizing: border-box;
		background-color: #ffffff;
	}
	.content-table{
		background-color: #fff;
		margin: 0px 20px 0 20px;
		padding: 0 20px 30px;
		box-sizing: border-box;
	}
	.content-total{
		margin: 0 20px 0 20px;
		height: 60px;
		line-height: 60px;
		background: #fff;
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
	.col-gre {
		color: #389e0d;
	}
	.col-grey {
		color: #BFBFBF;
	}
	.cur-op {
    cursor: pointer;
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
	.drdown {
		color: #409EFF;
		cursor: pointer;
		line-height: 1;
	}
}
</style>
