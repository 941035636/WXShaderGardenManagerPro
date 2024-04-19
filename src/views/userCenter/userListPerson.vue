<template>
	<div class="userListPerson" id="userListPerson">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8"><div>
					<span class="item2">用户名称/用户名</span>
					<el-input placeholder="请输入用户名称/用户名" v-model="form.loginIdOrUserName" class="item1" clearable></el-input>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item2">证件号</span>
					<el-input placeholder="请输入证件号" v-model="form.papers" class="item1" clearable></el-input>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item2">区域</span>
					<el-cascader :options="options1"  placeholder="请选择" change-on-select v-model="options" class="item1" clearable></el-cascader>
				</div></el-col>
				<!-- <el-col :span="8"><div>
					<span class="item2">用户类型</span>
					<el-select v-model="form.userType" placeholder="请选择用户类型" class="item1" clearable>
						<el-option v-for="item in options2" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
					</el-select>
				</div></el-col> -->
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="24"><div>
					<el-button @click="empty" icon="el-icon-delete" round class="empty-button">清空条件</el-button>
					<el-button type="warning" @click="searchview" round class="query-button">查询</el-button>
				</div></el-col>
			</el-row>
		</div>
		<div class="content1"  v-if="datas.find(item => item.key == '70011')">
			<el-button type="primary" icon="el-icon-plus" @click="NewlyAdded" round>添加用户</el-button>
			<!-- <el-button type="primary" v-if="datas.find(item => item.key == '70001')">导出</el-button> -->
		</div>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" :header-cell-style="getRowClass" highlight-current-row show-header border >
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="userloginId" label="用户名" align="center" min-width="200"></el-table-column>
				<el-table-column prop="custFullName" label="用户名称" align="center" min-width="300"></el-table-column>
				<el-table-column prop="userType" label="用户类型" align="center" min-width="150"></el-table-column>
				<el-table-column prop="areaCode" label="所在区域" align="center" min-width="300">
					<template slot-scope="scope">
						<span>{{scope.row.province}}</span>
						<span>{{scope.row.city}}</span>
						<span>{{scope.row.area}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="用户状态" align="center" min-width="130">
					<template slot-scope="scope">
						<span v-if="scope.row.status == '1'">启用</span>
						<span v-if="scope.row.status == '0'">停用</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template slot-scope="scope" type="flex">
						<el-dropdown size="small" trigger="click">
							<span class="el-dropdown-link" style="cursor:pointer">操作</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item @click.native="modify(scope.row)" v-if="datas.find(item => item.key == '70002')">编辑</el-dropdown-item>
								<el-dropdown-item @click.native="relation(scope.row)" v-if="datas.find(item => item.key == '70003')">电梯设备</el-dropdown-item>
								<el-dropdown-item @click.native="relation1(scope.row)" v-if="datas.find(item => item.key == '70004')">索道设备</el-dropdown-item>
								<el-dropdown-item @click.native="enable(scope.row)" v-if="scope.row.status == '1' && datas.find(item => item.key == '70006')" >停用</el-dropdown-item>
								<el-dropdown-item @click.native="enable(scope.row)" v-if="scope.row.status == '0' && datas.find(item => item.key == '70005')">启用</el-dropdown-item>
								<el-dropdown-item @click.native="resetpassword(scope.row)" v-if="datas.find(item => item.key == '70010')">重置密码</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
			 </el-table>
		</div>
		<div class="content-total">
			<el-pagination v-if="total != 0" background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"> </el-pagination>
		</div>
		<el-dialog title="重置密码" :visible.sync="exhibition" width="35%" center>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
				<el-form-item label="用户名称">
					<span style="margin-right:5%;">{{row.userloginId}}</span><span>{{row.custFullName}}</span>
				</el-form-item>
				<el-form-item label="设置密码" prop="password">
					<el-input v-model="ruleForm.password" placeholder="请输入密码" style="width:60%;"></el-input><el-button @click="randomGeneration" style="margin-left:10px;">随机生成</el-button>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
			<el-button @click="exhibition = false">取 消</el-button>
			<el-button type="primary" @click="paymentnotices(ruleForm)">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog :visible.sync="dialogVisible" width="30%" center :close-on-click-modal="false">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
				<el-form-item label="手机号" prop="userLoginId">
					<el-input v-model="ruleForm.userLoginId" placeholder="请输入手机号" style="width:60%;"></el-input>
				</el-form-item>
				<el-form-item label="设置密码" prop="password">
					<el-input v-model="ruleForm.password" placeholder="请输入密码" style="width:60%;"></el-input><span @click="randomGeneration" class="generation">随机生成</span>
				</el-form-item>
				<el-form-item>
					<el-checkbox v-model="ruleForm.checked">
					<span class="color6">我已阅读并接受</span></el-checkbox><span class="color-blue" @click="downFile">
					《特设保注册协议》
					</span>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<span @click="register(ruleForm)" class="register-btn">确认注册</span>
			</span>
		</el-dialog>
		<PersonInfo ref="PersonInfo" :options="options1" @successCb="getUserlisy()"></PersonInfo>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import UserService from '../../service/UserService.js';
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
import PersonInfo from './components/PersonInfo'
import { validatePhone } from '@/util/validateFrom'
import ResourcesService from '@/service/ResourcesService'
export default {
	components:{
		PersonInfo,
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
				userType:'sequip_A',
				areaCode:''
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
			rules:{
				userLoginId: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{ required: true, validator: validatePhone, trigger: 'blur' },
					// { max: 30, message: '社会信用统一代码/组织机构代码最大为30位', trigger: 'blur' },
					// {pattern: /^[0-9a-zA-Z]+$/,message: '社会信用统一代码/组织机构代码必须是字母或数字！'}
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
		// this.elementRelaConf();
		this.datas = JSON.parse(window.sessionStorage.getItem('list'));
	},
	methods: {
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.options1 = this.ButtonSelection.Accessarea(parmes.data, window.sessionStorage.getItem('provinceCode'));
				if(window.localStorage.getItem('index') == '9-1'){
					this.gettingCache();
				}
				// else{
				// 	window.localStorage.removeItem('data');
				// 	this.getUserlisy();
				// }
			}
		},
		async getUserlisy(){//获取用户列表
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
				window.localStorage.setItem('index','9-1');
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
			this.form = data;
			this.options = data.options;
			this.pageNum = data.pageNum;
			this.currentPage = data.pageNum;
			this.getUserlisy();
		},
		handleCurrentChange: function(pageNum){//页码
		    this.pageNum = pageNum;
			this.getUserlisy();
		},
		async elementRelaConf() {//获取用户类型		
			let data = await this.Elevator.elementRelaConf();
			if(data.code == '0000'){
				this.options2 = data.list
			}
		},
		searchview(){//查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.getUserlisy();
		},
		empty(){//清空
			this.form = {
				pageNum:1,
				pageSize:10,
				loginIdOrUserName:'',
				papers:'',
				userType:'sequip_A',
				areaCode:''
			};
			this.options = [];
			this.pageNum = 1;
			this.currentPage = 1;
			this.getUserlisy();
		},
		NewlyAdded(){//新增
			this.ruleForm = {
				userLoginId:'',
				password:'',
				checked:true
			};
			this.dialogVisible = true;
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
		modify(row){//跳转详情
			this.$refs.PersonInfo.openInit(row)
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
		async enable(row){//停用与启用
			var status = '';
			if(row.status == "1"){
				status = "0";
			}else{
				status = "1";
			}
			let data = {
				userCode:row.userCode,
				status:status
			};
			let res = await this.Elevator.bind_resources(data);
			if(res.code == '0000'){
				this.$message({
         	 		message: '修改成功',
          			type: 'success'
				});
				this.getUserlisy();
			}
		},
		resetpassword(row){//重置密码
			this.row = row;
			this.ruleForm = {
				userLoginId:'',
				password:'',
				checked:true
			};
			this.exhibition = true;
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
		paymentnotices(ruleForm){//重置密码表单验证
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					this.paymentnotice();
				} else {
					return false;
				}
			});
		},
		async paymentnotice(){//重置密码
			let data ={
				"loginId": this.row.userloginId,
				"password": this.passwordFormat(this.ruleForm.password),
				"userCode": this.row.userCode,
				"isCheck": 1
			};
			const res = await this.Elevator.resetPassword(data);
			if(res.code == '0000'){
				this.$message({
					message: '密码重置成功',
					type: 'success'
				});
				this.exhibition = false;
			}
		},
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "background:#f5f5f5";
			} else {
				return "";
			}
		},
	},
}
</script>

<style lang="less">
#userListPerson{
	padding-bottom: 80px;
	.elesearch{
		width: calc(100% - 40px);
		min-height: 234px;
		padding: 20px 20px 10px;
		margin: 20px 20px 0 20px;
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
		text-align: right;
		padding: 10px 20px 10px 20px;
		margin: 20px 20px 0 20px;
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
		text-align: right;
		background-color: #fff;
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
}
</style>
