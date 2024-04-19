<template>
	<div id="EnterpriseInformation">
    <div class="head">企业信息</div>
    <el-form :model="form" class="demo-ruleForm" label-position="right" label-width="150px" :rules="rules" ref="form">
      <el-form-item label="企业名称：" prop="orgFullName">
        <el-input placeholder="请输入企业名称" v-model.trim="form.orgFullName" class="item4" clearable></el-input>
        <el-button size="medium" type="primary" @click="search">查询</el-button><el-button @click="clearCorp" type="info" size="medium">重置</el-button>
        <span class="text-tip mt10 mb10"><i class="el-icon-warning f16 ml10"></i> 请输入完整企业名称，点击“查询”读取企业信息</span>
      </el-form-item>
      <el-form-item label="企业地址：" required>
        <div style="display:flex;">
          <el-form-item prop="selectedOptions">
            <el-cascader :options="areaData" placeholder="请选择" v-model="form.selectedOptions" class="item1" @change="handleChange"></el-cascader>
          </el-form-item>
          <el-form-item prop="orgAddress">
            <el-input placeholder="请输入详细地址" v-model.trim="form.orgAddress" class="item2" clearable></el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="企业类型：" required>
        <div style="display:flex;">
          <el-form-item prop="typeC">
            <el-select v-model="form.typeC" placeholder="请选择" class="item1" @change="gettypeCName">
              <el-option v-for="item in options2" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="types" v-if="form.typeC == 'sequip_C'">
            <el-select v-model="form.types" placeholder="请选择" class="item2"  @change="gettypesName">
              <el-option v-for="item in options3" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.typeC == 'sequip_B' || form.types == 'sequip_09'">
            <el-checkbox class="ml20" v-model="form.checked">(是/否)检测机构</el-checkbox>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="法定代表" prop="lawMan" v-if="form.typeC == 'sequip_C'">
        <el-input v-model="form.lawMan" class="item4" autocomplete></el-input>
      </el-form-item>
    </el-form>
	</div>
</template>

<script>
import PolicyentryService from '@/service/PolicyentryService'
import UserService from '@/service/UserService'
import {address} from "@/util/addressAnalysis"
import getCascaderObj from '../js/selectedOptions'
export default {
	name:'EnterpriseInformation',
	props:{
		'areaData':Array,
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
      options2:[],
      options3:[],
			dialogVisible:false,
			options1:[],
			form:{
				userCode:'',
				orgFullName:'',
				selectedOptions:[],
				provinceName:'',
				provinceCode:'',
				orgAddress:'',
				typeC:'sequip_C',
				types:'',
				typesName:'',
				typeCName:'企业单位',
        lawMan:'',
        checked:false,
			},
			rules: {
				orgFullName: [
					{ required: true, message: '请输入企业名称', trigger: 'blur' },
					{ min:1,max: 75, message: '企业名称长度为1到75位', trigger: 'blur'},
				],
				selectedOptions: [{ required: true, message: "请选择企业地址", trigger: "change" }],
				orgAddress: [{ required: true, message: "请输入详细地址", trigger: "blur" },{ min: 2,max:100, message: '长度在2-100位之间', trigger: 'blur'}],
				threeInOneCode: [{ required: true, validator: checkCode, trigger: "blur" }],
				person1: [{ required: false,min:1,max: 20, message: '联系人姓名长度1-20位', trigger: 'blur'}],
				phone1: [{ required: false, validator: checkPhone, trigger: "blur" }],
				typeC: [{ required: true, message: "请选择用户类型", trigger: "change" }],
        types:[{required: true, message: '企业类型不能为空', trigger:'change'}],
        lawMan:[{ required: true, message: '法定代表不能为空', trigger: 'blur'}],
			},
			show:false
		};
	},
	computed: {
		
	},
	created() {
    this.enterprisestypes()
    this.elementRelaConf()
	},
	methods: {
    initData(row) {
      this.address.constructor(this.areaData);
      this.form.orgFullName = row.orgFullName
      this.form.selectedOptions = [...row.selectedOptions]
      this.form.orgAddress = row.orgAddress
      this.form.provinceName = row.provinceName
      this.form.provinceCode = row.provinceCode
      this.form.typeC = row.userType
      this.form.types = row.types
      this.form.lawMan = row.lawMan
      this.form.checked = row.nature == 'sequip_05' ? true : false
      this.gettypesName(row.types)
      this.gettypeCName(row.userType)
      this.handleChange(this.form.selectedOptions)
    },
		clearCorp() {
			this.form = {
				orgFullName:'',
				selectedOptions:[],
				orgAddress:'',
				provinceName:'',
				cityName:'',
				countyName :'',
				threeInOneCode:'',
				typeC:'',
				types:'',
				typesName:'',
				typeCName:'',
        lawMan:'',
        checked:false,
			};
		},
    async enterprisestypes() {		
			let data = await this.UserService.enterprisestypes();
			let {code,list} = data;
			if(code == "0000"){
				this.options3 = data.list
			}
		},
    // 获取企业类型接口
    async elementRelaConf() {		
			let data = await this.UserService.elementRelaConf();
			let {code,list} = data;
			if(code == "0000"){
				this.options2 = data.list.filter((item)=> item.valuesCode !== 'sequip_A')
			}
		},
		gettypesName(e) {
      let {elementValues} = this.options3.find(item => item.valuesCode == this.form.types) || {}
			this.form.typesName = elementValues
      if(this.form.types !== e) {
        this.form.checked = false
      }
		},
		gettypeCName(e) {
			if(this.form.typeC !== e &&this.form.typeC == 'sequip_C') {
				this.form.types = ''
				this.form.typesName = ''
			}
      if(this.form.typeC !== e) {
        this.form.checked = false
        this.form.lawMan = ''
      }
      let {elementValues} = this.options2.find(item => item.valuesCode == this.form.typeC) || {}
      this.form.typeCName = elementValues
		},
		async search(){ // 企查猫查询企业
			if(this.form.orgFullName){
				const res = await this.UserService.getCorp(this.form.orgFullName);
				if(res.code == '0000'){
					let regLocation = '';
					if(res.data.regLocation.indexOf(res.data.base) == '-1'){
						regLocation = res.data.base + res.data.regLocation
					}else{
						regLocation = res.data.regLocation
					}
					let data = this.address.smart(regLocation)
					if(data.provinceCode && data.cityCode && data.countyCode){
						this.form.selectedOptions = [data.provinceCode,data.cityCode,data.countyCode];
						this.handleChange(this.form.selectedOptions)
					}
					this.form.orgAddress = data.location;
          this.$emit('succeseTherrInoneCode',res.data.creditCode)
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
    handleChange(value){
			if(value!=""){
				var vals = this.select.getlable(this.form.selectedOptions, this.areaData);
				if(vals.length == '1'){
					this.form.provinceName = vals[0].label;
					this.form.provinceCode = vals[0].value;
				}else if(vals.length == '2'){
					this.form.provinceName = vals[0].label + '/' + vals[1].label;
					this.form.provinceCode = vals[1].value;
				}else{
					this.form.provinceName = vals[0].label + '/' + vals[1].label + '/' + vals[2].label;
					this.form.provinceCode = vals[2].value;
				}
			}
		},
    submit() {
      let flag = false
      this.$refs.form.validate((valid)=>{
        if(valid) {
          flag = true
        }
      })
      return !flag || this.form
    }
	}
};
</script>

<style lang="less">
#EnterpriseInformation{
  margin-top: 10px;
		background-color: #fff;
		padding: 20px 50px;
    .head{
      width: 100%;
      box-sizing: border-box;
      line-height: 22px;
      height: 22px;
      margin-bottom: 20px;
      color: #000000;
      font-size: 18px;
      font-weight: 700;
      padding-left: 24px;
      border-left: 4px solid #FFC069;
    }
		.item4{
			width: 280px;
		}
		.search-icon{
			margin-left: 10px;
			font-size: 18px;
		}
		.item1{
			width: 280px;
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
</style>
