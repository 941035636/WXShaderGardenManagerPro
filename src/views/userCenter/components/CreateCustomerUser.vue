<template>
	<div id="CreateCustomerUser">
		<el-dialog :title="form.id?'修改客户':'添加客户'" :visible.sync="dialogVisible" :close-on-click-modal="false" :show-close='false' @closed="clearCorp">
			<el-form :model="form" class="demo-ruleForm" label-position="right" size="mini" label-width="120px" :rules="rules" ref="form">
				<el-form-item label="客户名称" prop="customerName">
					<el-input placeholder="请输入客户名称" v-model.trim="form.customerName" class="item4" clearable></el-input>
					<el-button size="medium" type="primary" @click="search">查询</el-button><el-button @click="clearCorp" type="info" size="medium">重置</el-button>
					<br>
                    <div class="mt10">
					<span class="text-tip mb10"><i class="el-icon-warning f16 ml10"></i> 请输入完整客户名称，点击“查询”读取企业信息</span>
                    </div>
				</el-form-item>
				<el-form-item label="行业类型" prop="industry">
					<el-select v-model="form.industry" placeholder="请选择行业类型" class="name-input" >
						<el-option v-for="item in industryTypeOptins" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
                <div class="display-flex">
                    <el-form-item label="企业地址：" prop="location">
                        <el-cascader :options="areaData" placeholder="请选择" v-model="form.location" class="item1" @change="handleChange"></el-cascader>
                    </el-form-item>
                    <el-form-item prop="address" label-width="0px">
                        <el-input placeholder="请输入详细地址" v-model.trim="form.address" class="item2" clearable></el-input>
                    </el-form-item>
				</div>
				<el-form-item label="社会信用代码" prop="customerId">
					<el-input placeholder="请输入社会信用代码" v-model.trim="form.customerId" class="item1" clearable></el-input>
				</el-form-item>
                <div class="display-flex">
                    <el-form-item label="客户类型"  prop="customerType">
                        <el-select v-model="form.customerType" clearable filterable placeholder="请选择客户类型" class="name-input" >
                            <el-option v-for="item in companyTypeOptins" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="客户星级"  prop="level">
                        <el-select v-model="form.level" clearable filterable placeholder="请选择客户星级" class="name-input" >
                            <el-option v-for="item in levelOptins" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
				</div>
				<el-form-item label="状态"  prop="customerStatus">
					<el-radio-group v-model="form.customerStatus">
                        <el-radio v-for="(item,key) in customerStatusOptins" :key="item.value"  :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
				</el-form-item>
                <div class="display-flex">
                    <el-form-item label="业务机构"  prop="bizBranchCode">
                        <el-select v-model="form.bizBranchCode" clearable filterable placeholder="请选择" class="name-input" @change="getBusinessorData()">
                            <el-option v-for="item in branchOptins" :key="item.jtBranchCode" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="业务人员(选填)">
                        <el-select v-model="form.businessorCode" clearable filterable placeholder="请选择" class="name-input" @change="setDepartment()">
                            <el-option v-for="item in optionsVisitor" :key="item.id" :label="item.personDetails" :value="item.userCode"></el-option>
                        </el-select>
                    </el-form-item>
				</div>
				<el-form-item style="text-align:right;margin-left:-60px;">
					<el-button type="info" size="medium" @click="clearCorp()" round>取消</el-button>
					<el-button type="warning" size="medium" @click="submitForm('form')" round>确认提交</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import userManageService from "@/service/userManageService";
import UserService from '@/service/UserService'
import {address} from "@/util/addressAnalysis"
export default {
	name:'CreateCustomerUser',
	props:{
		areaData:{
            type:Array,
            default:()=>{
                return []
            }
        },
		industryTypeOptins:{
            type:Array,
            default:()=>{
                return []
            }
        },
        // 客户类型
		companyTypeOptins:{
            type:Array,
            default:()=>{
                return []
            }
        },
        // 客户星级
		levelOptins:{
            type:Array,
            default:()=>{
                return []
            }
        },
        // 状态
		customerStatusOptins:{
            type:Array,
            default:()=>{
                return []
            }
        },
        // 分支机构公司
		branchOptins:{
            type:Array,
            default:()=>{
                return []
            }
        },
	},
	data() {
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
        var validateUserLoginId = (rule, value, callback) => {
			if (value == "") {
				callback(new Error("请输入证件号"));
			} else if(this.$stringHelper.CheckSocialCreditCode(value)){
				callback();
			}else{
				callback(new Error("请输入正确的证件号"));
			}
		};
		return {
            userManageService: new userManageService(),
			UserService:new UserService(),
			address:new address(),
            optionsVisitor:[],
			dialogVisible:false,
			form:{
                "location":[],
                "address": "",
                "areaCode": "",
                "areaName": "",
                "bizBranchCode": "",
                "bizBranchName": "",
                "businessorCode": "",
                "businessorName": "",
                "jobNumber": "",    // 工号
                "channel": "sequip",
                "cityCode": "",
                "cityName": "",
                "createTime": "",
                "creatorCode": "",
                "creatorName": "",
                "customerId": "",
                "customerIdType": "营业执照",
                "customerName": "",
                "customerStatus": "",
                "customerStatusName": "",
                "customerType": "",
                "customerTypeName": "",
                "departmentCode": "",
                "departmentName": "",
                "id": "",
                "industry": "",
                "industryName": "",
                "level": "",
                "levelName": "",
                "operationType": "MBKH",
                "operationTypeName": "",
                "provinceCode": "",
                "provinceName": "",
                "sysCode": "sys_sequip_man",
                "updateTime": ""
            },
			rules: {
				customerName: [
					{ required: true, message: '请输入企业名称', trigger: 'blur' },
					{ min:1,max: 75, message: '企业名称长度为1到75位', trigger: 'blur'},
					// { pattern: /^[\u4E00-\u9FA5]+.*$/, message: '企业名称首位必须为中文', trigger: 'blur' }
				],
				industry: [{ required: true, message: "请选择", trigger: "change" }],
				location: [{ required: true, message: "请选择企业地址", trigger: "change" }],
				address: [{ required: true, message: "请输入详细地址", trigger: "blur" },{ min: 2,max:100, message: '长度在4-100位之间', trigger: 'blur'}],
				customerId: [{ required: true, validator: validateUserLoginId, trigger: "blur" }],
				customerType: [{ required: true, message: "请选择", trigger: "change" }],
				level: [{ required: true, message: "请选择", trigger: "change" }],
				customerStatus: [{ required: true, message: "请选择", trigger: "change" }],
				bizBranchCode: [{ required: true, message: "请选择", trigger: "change" }],
			},
			
		};
	},
	computed: {
		
	},
	created() {
	},
	methods: {
		clearCorp() {
			this.form = {
                "location":[],
                "address": "",
                "areaCode": "",
                "areaName": "",
                "bizBranchCode": "",
                "bizBranchName": "",
                "businessorCode": "",
                "businessorName": "",
                "jobNumber":"",
                "channel": "sequip",
                "cityCode": "",
                "cityName": "",
                "createTime": "",
                "creatorCode": "",
                "creatorName": "",
                "customerId": "",
                "customerIdType": "营业执照",
                "customerName": "",
                "customerStatus": "",
                "customerStatusName": "",
                "customerType": "",
                "customerTypeName": "",
                "departmentCode": "",
                "departmentName": "",
                "id": "",
                "industry": "",
                "industryName": "",
                "level": "",
                "levelName": "",
                "operationType": "MBKH",
                "operationTypeName": "",
                "provinceCode": "",
                "provinceName": "",
                "sysCode": "sys_sequip_man",
                "updateTime": ""
            }
            this.resetForm()
		},
		openDialog(val){ // 打开弹框
			this.dialogVisible = true;
			this.address.constructor(this.areaData);
            if(val) {
                this.form = {...val,customerType:String(val.customerType),industry:String(val.industry),level:String(val.level),location:[val.provinceCode,val.cityCode,val.areaCode]}
                this.getBusinessorData(true)
                delete this.form.visitEntity
            }
		},
		async search(){ // 企查猫查询企业
			if(this.form.customerName){
				const res = await this.UserService.getCorp(this.form.customerName);
				if(res.code == '0000'){
                    let reg = /^[A-Za-z]+$/
					let regLocation = '';
					if(!reg.test(res.data.base) && res.data.regLocation.indexOf(res.data.base) == '-1'){
						regLocation = res.data.base + res.data.regLocation
					}else{
						regLocation = res.data.regLocation
					}
					let data = this.address.smart(regLocation)
					if(data.provinceCode && data.cityCode && data.countyCode){
						this.form.location = [data.provinceCode,data.cityCode,data.countyCode];
						var vals = this.getlable(this.form.location, this.areaData);
						this.form.provinceName = vals[0].label || '';
                        this.form.cityName = vals[1].label || '';
                        this.form.areaName = vals[2].label || '';
                        this.form.provinceCode = vals[0].value || '';
                        this.form.cityCode = vals[1].value || '';
                        this.form.areaCode = vals[2].value || '';
					}
					this.form.address = data.location;
					this.form.customerId = res.data.creditCode;
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
				var vals = this.getlable(this.form.location, this.areaData);
				this.form.provinceName = vals[0].label;
				this.form.cityName = vals[1].label;
				this.form.areaName = vals[2].label;
				this.form.provinceCode = vals[0].value;
				this.form.cityCode = vals[1].value;
				this.form.areaCode = vals[2].value;
			} else {
                this.form.provinceName = '';
				this.form.cityName = '';
				this.form.areaName = '';
				this.form.provinceCode = '';
				this.form.cityCode = '';
				this.form.areaCode = '';
            }
		},
        // 获取省市区
        getlable(val, opt){
            let list = val.map(function (value, index, array) {
                let obj = opt.find(item=>item.value == value)
                if(obj){
                    opt = obj.children;
                    return obj;
                } else {
                    return null;
                }
                
            });
            return list
        },
        /**
         * 获取当前分支机构的人员
         *  flag true从修改过来的，没传或者false就是手动选择分支机构
         */ 
        async getBusinessorData(flag=""){
            if(!flag){
                this.form.businessorCode = ''
            }
            if(this.form.bizBranchCode) {
                // 获取全面营销人员
                let data = {
                    jtBranchCode: this.form.bizBranchCode,
                    hrPersonCategory: '',
                    pageSize: 10000,
                    pageNum: 1
                }
                let res = await this.userManageService.getUserByNo(data)
                if(res.code == '0000') {
                    this.optionsVisitor = res.list.map(item=>{
                        let obj = {
                            ...item,
                            personDetails:`${item.userName}/${item.departmentName || ''}(${item.departmentCode||'--'})`
                        }
                        delete obj.systemAndRoleVOList
                        return obj
                    })
                } else {
                    this.optionsVisitor = [];
                }
            } else {
                this.optionsVisitor = [];
            }

            
        },
        // 获取当前分支机构的人员
        async setDepartment(){
            let {departmentCode,departmentName,userName,employeeNum} = this.optionsVisitor.find(item=>item.userCode == this.form.businessorCode) || {departmentCode:'',departmentName:'',userName:''}
            this.form.departmentName = departmentName;
            this.form.departmentCode = departmentCode;
            this.form.businessorName = userName;
            this.form.jobNumber = employeeNum;
        },
		resetForm(formName='form'){ // 取消清空表单关闭弹框
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
            let data = {...this.form}
            data.customerIdType = '营业执照'
            data.channel = 'sequip'
            let {jtBranchName} =  this.branchOptins.find(item=>item.jtBranchCode == data.bizBranchCode) ||{jtBranchName:''}
            data.bizBranchName = jtBranchName
            if(!data.id) {
                data.creatorCode = window.sessionStorage.getItem('userCode');
                data.creatorName = window.sessionStorage.getItem('userName');
			    let {code} = await this.userManageService.postCustomerManagementCreate(data);
                if(code == '0000'){
                    this.$emit('successCallback');
                    this.clearCorp()
                }
            } else {
                let {code} = await this.userManageService.updateCustomerManagementCreate(data);
                if(code == '0000'){
                    this.$emit('successCallback');
                    this.clearCorp()
                }
            }
			
		},
		
	}
};
</script>

<style lang="less">
#CreateCustomerUser{
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
