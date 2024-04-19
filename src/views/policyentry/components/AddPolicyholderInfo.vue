<template>
	<div id="AddPolicyholderInfo">
		<el-dialog title="添加投保企业" :visible.sync="dialogVisible" :close-on-click-modal="false" center :show-close='show'>
			<el-form :model="form" class="demo-ruleForm" label-position="right" label-width="150px" :rules="rules" ref="form">
				<el-form-item label="投保企业名称：" prop="holderName">
					<el-input placeholder="请输入企业名称" v-model.trim="form.holderName" class="item4" clearable></el-input>
					<el-button size="medium" type="primary" @click="search">查询</el-button><el-button @click="clearCorp" type="info" size="medium">重置</el-button>
					<br>
					<span class="text-tip mt10 mb10"><i class="el-icon-warning f16 ml10"></i> 请输入完整企业名称，点击“查询”读取企业信息</span>
				</el-form-item>
				<el-form-item label="企业类型：" prop="typeC">
					<el-select v-model="form.typeC" placeholder="请选择企业类型" class="name-input" @change="gettypeCName">
						<el-option v-for="item in options2" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
					</el-select>
					<el-select v-model="form.types" placeholder="请选择" class="name-input" v-if="form.typeC == 'sequip_C'" @change="gettypesName">
						<el-option v-for="item in options3" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="投保企业地址：" required>
					<div style="display:flex;">
						<el-form-item prop="location">
							<el-cascader :options="areaData" placeholder="请选择" v-model="form.location" class="item1" @change="handleChange"></el-cascader>
						</el-form-item>
						<el-form-item prop="position">
							<el-input placeholder="请输入详细地址" v-model.trim="form.position" class="item2" clearable></el-input>
						</el-form-item>
					</div>
				</el-form-item>
				<el-form-item label="社会信用代码：" prop="threeInOneCode" v-if="form.typeC == 'sequip_C'">
					<el-input placeholder="请输入社会信用代码" v-model.trim="form.threeInOneCode" class="item4" clearable></el-input>
				</el-form-item>
				<el-form-item label="组织机构代码证：" prop="threeInOneCode" v-else>
					<el-input placeholder="请输入组织机构代码证" v-model.trim="form.threeInOneCode" class="item4" clearable></el-input>
				</el-form-item>
				<el-form-item label="联系人："  prop="person1">
					<el-input placeholder="请输入联系人姓名" v-model.trim="form.person1" class="item4" clearable></el-input>
				</el-form-item>
				<el-form-item label="联系人手机号："  prop="phone1">
					<el-input placeholder="请输入联系人手机号" v-model.trim="form.phone1" class="item4" clearable></el-input>
				</el-form-item>
				<el-form-item style="text-align:center;margin-left:-60px;">
					<el-button type="info" size="medium" @click="resetForm('form')" round>取消</el-button>
					<el-button type="warning" size="medium" @click="submitForm('form')" round>保存并选择</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import PolicyentryService from '../../../service/PolicyentryService'
import UserService from '../../../service/UserService'
import {address} from "../../../util/addressAnalysis"
import getCascaderObj from '../js/selectedOptions'
import { elevator as Elevator } from "../../../server/accidenServer"
export default {
	name:'AddPolicyholderInfo',
	props:{
		'areaData':Array,
		'options3':Array,
		'options2':Array,
	},
	data() {
		var checkPhone = (rule, value, callback) => {
			var reg = /^1[23456789]\d{9}$/;
			if (!reg.test(value) && value) {
				callback(new Error("请输入正确的手机号码"));
			} else {
				callback();
			}
		};
		var checkCode = (rule, value, callback) => {
			let reg = /^[0-9a-zA-Z]{1,30}$/;
			if (!value) {
				return callback(new Error("请输入证件号"));
			} else if (!reg.test(value)) {
				callback(new Error("请输入正确的证件号(1-30位数字或字母)"));
			}  else {
				callback();
			}
		};
		return {
			PolicyentryService:new PolicyentryService(),
			UserService:new UserService(),
			address:new address(),
			select:new getCascaderObj(),
			elevator: new Elevator(),
			dialogVisible:false,
			options1:[],
			form:{
				userCode:'',
				holderName:'',
				location:[],
				provinceName:'',
				cityName:'',
				countyName :'',
				position:'',
				threeInOneCode:'',
				person1:'',
				phone1:'',
				userLoginId:'',
				typeC:'sequip_C',
				types:'',
				typesName:'',
				typeCName:'企业单位',
			},
			rules: {
				holderName: [
					{ required: true, message: '请输入投保企业名称', trigger: 'blur' },
					{ min:1,max: 75, message: '企业名称长度为1到75位', trigger: 'blur'},
					// { pattern: /^[\u4E00-\u9FA5]+.*$/, message: '企业名称首位必须为中文', trigger: 'blur' }
				],
				location: [{ required: true, message: "请选择企业地址", trigger: "change" }],
				position: [{ required: true, message: "请输入详细地址", trigger: "blur" },{ min: 2,max:100, message: '长度在2-100位之间', trigger: 'blur'}],
				threeInOneCode: [{ required: true, validator: checkCode, trigger: "blur" }],
				person1: [{ required: false,min:1,max: 20, message: '联系人姓名长度1-20位', trigger: 'blur'}],
				phone1: [{ required: false, validator: checkPhone, trigger: "blur" }],
				typeC: [{ required: true, message: "请选择企业类型", trigger: "change" }],
			},
			show:false
		};
	},
	computed: {
		
	},
	created() {
	},
	methods: {
		clearCorp() {
			this.form = {
				userCode:'',
				holderName:'',
				location:[],
				provinceName:'',
				cityName:'',
				countyName :'',
				position:'',
				threeInOneCode:'',
				person1:'',
				phone1:'',
				userLoginId:'',
				typeC:'',
				types:'',
				typesName:'',
				typeCName:'',
			};
		},
		gettypesName() {
			this.form.typesName = this.options3.find(item => item.valuesCode == this.form.types).elementValues
		},
		gettypeCName() {
			if(this.form.typeC == 'sequip_C') {
				this.form.types = ''
				this.form.typesName = ''
			} 
			this.form.typeCName = this.options2.find(item => item.valuesCode == this.form.typeC).elementValues
		},
		Opendialog(formName){ // 打开弹框
			this.dialogVisible = true;
			this.address.constructor(this.areaData);
		},
		async search(){ // 企查猫查询企业
			if(this.form.holderName){
				const res = await this.UserService.getCorp(this.form.holderName);
				if(res.code == '0000'){
					let regLocation = '';
					if(res.data.regLocation.indexOf(res.data.base) == '-1'){
						regLocation = res.data.base + res.data.regLocation
					}else{
						regLocation = res.data.regLocation
					}
					let data = this.address.smart(regLocation)
					if(data.provinceCode && data.cityCode && data.countyCode){
						this.form.location = [data.provinceCode,data.cityCode,data.countyCode];
						var vals = this.select.getlable(this.form.location, this.areaData);
						this.form.provinceName = vals[0]?vals[0].label:'';
						this.form.cityName = vals[1]?vals[1].label:'';
						this.form.countyName = vals[2]?vals[2].label:'';
					}
					this.form.position = data.location;
					this.form.threeInOneCode = res.data.creditCode;
					this.$message({
						message: "查询成功",
						type: "success"
					});
				}
			}else{
				this.$message({
					message: "请输入企业名称",
					type: "warning"
				});
			}
		},
		handleChange(value){ // 选择省市区
			if(value !=''){
				var vals = this.select.getlable(this.form.location, this.areaData);
				this.form.provinceName = vals[0].label;
				this.form.cityName = vals[1].label;
				this.form.countyName = vals[2].label;
			}
		},
		resetForm(formName){ // 取消清空表单关闭弹框
			this.$refs[formName].resetFields();
			this.dialogVisible = false;
		},
		submitForm(formName){ // 表单验证
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.sequipRegister();
				} else {
					return false;
				}
			});
		},
		async sequipRegister(){//新增用户调用
			// let list = [
			// 	{
			// 	"account": this.form.threeInOneCode,
			// 	"channelCode": "safety",
			// 	"linkManName":this.form.person1,
			// 	"linkManPhone":this.form.phone1,
			// 	"orgAddress":this.form.position,
			// 	"orgFullName":this.form.holderName,
			// 	"provinceCode":this.form.location[2],
			// 	"password": this.passwordFormat('jiangtai@2020')
			// 	}
			// ];
			let data = {
				"orgFullName":this.form.holderName,
				"isVerifyIndustry":false,
				"provinceCode":this.form.location[2],
				"orgAddress":this.form.position,
				"type":"1",
				"orgElementVOList":[
					{
						"elementCode":"userType",
						"elementName":"用户类型",
						"valuesCode":this.form.typeC,
						"elementValues":this.form.typeCName
					},
					{
						"elementCode":"orgType",
						"elementName":"企业类型",
						"valuesCode":this.form.types,
						"elementValues":this.form.typesName
					}
				],
				"channelCode":"sequip",
				"paperworkInfoList":[
					{
						"code":(this.form.typeC == 'sequip_C')?'bl':'gai',
						"name":(this.form.typeC == 'sequip_C')?'营业执照':'组织机构代码证',
						"value":this.form.threeInOneCode,
						"url":""
					}
				],
				"responseName":null,
				"responsePhone":null,
				"businessPhone":this.form.phone1,
				"businessName":this.form.person1,
				"orgId":null,
				"channelToken":null
			}
			const res = await this.PolicyentryService.Register(data);
			if(res.code == '0000'){
				this.form.userLoginId = this.form.threeInOneCode;
				this.form.userCode = res.data.userCode;
				this.form.type = this.form.typeC == 'sequip_C' ? '2' : '1';
				this.$emit('func',this.form);
				this.resetPassword();
				console.log('添加成功');
				this.dialogVisible = false;
			}
		},
		async resetPassword() {
			let password = `jiangtai@2020`;
            let data = {
                loginId: this.form.userLoginId,
                "isCheck": "1",
                password: this.$stringHelper.passwordFormat(password),
                userCode: this.form.userCode
            };
            const res = await this.elevator.resetPassword(data);
        },
		passwordFormat(password) { // 加密密码方法
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
		}
	}
};
</script>

<style lang="less">
#AddPolicyholderInfo{
	.el-dialog{
		width: 750px;
		.item4{
			width: 280px;
		}
		.search-icon{
			margin-left: 10px;
			font-size: 18px;
		}
		.item1{
			width: 200px;
			margin-right: 20px;
		}
		.item2{
			width: 250px;
		}
		.item5{
			width: 300px;
		}
		.content-tips{
			display: inline-block;
			height: 34px;
			line-height: 34px;
			background-color: #F2F5FF;
			color: #6683D5;
			padding: 0 20px;
			box-sizing: border-box;
		}
	}
	.text-tip {
		background-color: #dbf9ef;
		border: none;
		color: #34c697;
		border-radius: 6px;
		font-size: 14px;
		padding: 9px 15px;
		text-align: center;
		line-height: 20px;
		font-weight: normal;
		font-style: normal;
		opacity: 1;
	}
}
</style>
