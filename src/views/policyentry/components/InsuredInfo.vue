<template>
	<div id="InsuredInfo">
		<Title :titles="title"></Title>
		<div class="content mt20">
			<el-form :model="insureds" class="demo-ruleForm" label-position="right" label-width="130px" :rules="rules" ref="insureds">
				<el-form-item label="同投保人：" prop="holderName">
					<el-switch v-model="insureds.value" active-color="#6683D5" @change="identical"></el-switch>
				</el-form-item>
				<el-form-item label="被保企业名称：" prop="holderName">
					<el-input placeholder="请输入企业名称" v-model.trim="insureds.holderName" class="item4 mr10" clearable :disabled="disableb"></el-input>
					<el-button size="medium" type="primary" :disabled="disableb" @click="getCorp">查询</el-button>
					<el-button @click="clearCorp" type="info" size="medium" :disabled="disableb" class="mr10">重置</el-button>
					<span class="text-tip"><i class="el-icon-warning f16 ml10"></i> 请输入完整企业名称，点击“查询”读取企业信息</span>
				</el-form-item>
				<el-form-item label="被保企业地址：" required>
					<div style="display:flex;">
						<el-form-item prop="location">
							<el-cascader :options="areaData" placeholder="请选择" v-model="insureds.location" class="item5" :disabled="disableb" @change="handleChange"></el-cascader>
						</el-form-item>
						<el-form-item prop="position">
							<el-input placeholder="请输入详细地址" v-model.trim="insureds.position" class="item2" clearable :disabled="disableb"></el-input>
						</el-form-item>
					</div>
				</el-form-item>
				<el-form-item label="证件类型：" required>
					<div style="display:flex;">
						<el-form-item prop="type">
							<el-select v-model.trim="insureds.type" placeholder="请选择" clearable class="item3" :disabled="disableb">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="threeInOneCode">
							<el-input placeholder="请输入证件号" v-model.trim="insureds.threeInOneCode" class="item2" clearable :disabled="disableb"></el-input>
						</el-form-item>
					</div>
				</el-form-item>
				<el-form-item label="联系人："  prop="person1">
					<el-input placeholder="请输入联系人姓名" v-model.trim="insureds.person1" class="item4" clearable :disabled="disableb"></el-input>
				</el-form-item>
				<el-form-item label="联系电话："  prop="phone1">
					<el-input placeholder="请输入联系人电话" v-model.trim="insureds.phone1" class="item4" clearable :disabled="disableb"></el-input>
				</el-form-item>
				<el-form-item style="display:none;">
					<el-button type="primary" @click="submitForm2(insureds)" round>保存并选择</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './Title'
import PolicyentryService from '../../../service/PolicyentryService'
import UserService from '../../../service/UserService'
import getCascaderObj from '../js/selectedOptions'
import store from "../../../store/index"
import Bus from "@/util/busEvent"
import {address} from '@/util/addressAnalysis'
export default {
	name:'InsuredInfo',
	components:{
		Title
	},
	props:{
		'areaData':Array
	},
	store,
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
			var reg = /^[0-9a-zA-Z]{1,30}$/;
			if (!value) {
				return callback(new Error("请输入证件号"));
			} else if (!reg.test(value)) {
				callback(new Error("请输入正确的证件号(1-30位数字或字母)"));
			}  else {
				callback();
			}
		};
		return {
			address: {},
			PolicyentryService:new PolicyentryService(),
			UserService: new UserService(),
			select:new getCascaderObj(),
			title:'被保人信息',
			options:[
				{
					label:'组织机构代码证',
					value:'1'
				},
				{
					label:'社会信用代码',
					value:'2'
				}
			],
			insureds:{
				userCode:'',
				holderName:'',
				location:[],
				provinceName:'',
				cityName:'',
				countyName :'',
				position:'',
				type:'',
				threeInOneCode:'',
				person1:'',
				phone1:'',
				value:false,
				urlId:'',
				urlId1:'',
			},
			rules: {
				holderName: [{ required: true, message: '请输入被保企业名称', trigger: 'blur' },{ max: 75, message: '企业名称长度小于75位', trigger: 'blur'}],
				location: [{ required: true, message: "请选择企业地址", trigger: "change" }],
				position: [{ required: true, message: "请输入详细地址", trigger: "blur" },{ min: 2,max:100, message: '长度在2-100个字符之间', trigger: 'blur'}],
				type: [{ required: true, message: "请选择", trigger: "change" }],
				threeInOneCode: [{ required: true, validator: checkCode, trigger: "blur" }],
				person1: [{ required: false,min:1,max: 20, message: '联系人姓名长度1-20位', trigger: 'blur'}],
				phone1: [{ required: false, validator: checkPhone, trigger: "blur" }],
			},
			disableb:false,
		};
  },
  watch:{
    "insureds.holderName":{
      handler(curVal,oldVal){
        Bus.$emit("insuredsBus",curVal)
      },
      deep:true,
      immediate:true
    }    
  },
	computed: {
		
	},
	created() {
		if(this.$route.query.flag == 'again'){
			this.getData();
		}
	},
	methods: {
		clearCorp() {
			this.insureds = {
				userCode:'',
				holderName:'',
				location:[],
				provinceName:'',
				cityName:'',
				countyName :'',
				position:'',
				type:'',
				threeInOneCode:'',
				person1:'',
				phone1:'',
				value:false,
				urlId:'',
				urlId1:'',
			};
		},
		async getCorp(){
			this.address = new address(this.areaData)
			if(!this.insureds.holderName.replace(/\s/g,'')){return}
			let res = await this.UserService.getCorp(this.insureds.holderName)
			if(res.code=='0000'){
				this.$message({
					type:"success",
					message:"查询成功"
				})
				
				this.insureds.threeInOneCode = res.data.creditCode;
				this.insureds.type = '2';
				let areaObj = this.address.smart(res.data.regLocation)
				this.insureds.location = [areaObj.provinceCode,areaObj.cityCode,areaObj.countyCode]
				this.insureds.position = areaObj.location
			}
		},
		getData(){
			this.insureds = this.$store.getters.insureds;
			if(this.insureds.value == true){
				this.disableb = !this.disableb;
			}
		},
		identicals(){
			this.insureds.value = false;
			this.disableb = false;
		},
		identical(val){
            if(val){
				let policyHolder = this.$parent.$refs.getholderInfo.submitForm1();
                if(JSON.stringify(policyHolder) == '{}'){
					this.insureds.value = false;
                }else{
					this.insureds = {
						userCode:policyHolder.userCode,
						holderName:policyHolder.holderName,
						location:policyHolder.location,
						provinceName:policyHolder.provinceName,
						cityName:policyHolder.cityName,
						countyName :policyHolder.countyName,
						position:policyHolder.position,
						type:policyHolder.type,
						threeInOneCode:policyHolder.threeInOneCode,
						person1:policyHolder.person1,
						phone1:policyHolder.phone1,
						value:true,
						urlId:'',
						urlId1:'',
					}
					this.disableb = !this.disableb;
                }
            }else{
				this.insureds = {
					userCode:'',
					holderName:'',
					location:[],
					provinceName:'',
					cityName:'',
					countyName :'',
					position:'',
					type:'',
					threeInOneCode:'',
					person1:'',
					phone1:'',
					value:false,
					urlId:'',
					urlId1:''
				}
                this.disableb = !this.disableb; 
            }
		},
		handleChange(value){
			if(value !=''){
				var vals = this.select.getlable(this.insureds.location, this.areaData);
				this.insureds.provinceName = vals[0].label;
				this.insureds.cityName = vals[1].label;
				this.insureds.countyName = vals[2].label;
			}
		},
		submitForm2(insureds){
			let data = {};
			this.$refs.insureds.validate((valid) => {
				if (valid) {
					var vals = this.select.getlable(this.insureds.location, this.areaData);
					this.insureds.provinceName = vals[0]?vals[0].label:'';
					this.insureds.cityName = vals[1]?vals[1].label:'';
					this.insureds.countyName = vals[2]?vals[2].label:'';
					if(!this.insureds.provinceName || !this.insureds.cityName || !this.insureds.countyName){
						this.$message({
							message: '请补全被保人投保企业地址省市区信息！',
							type: 'warning'
						});
					}else{
						data = this.insureds;
					}
				} else {
					this.$message({
                        message: '被保人信息填写不完整！',
                        type: 'warning'
                    });
					return false;
				}
			});
			return data;
		},
	}
};
</script>

<style lang="less">
#InsuredInfo{
	background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 20px 40px;
	.content{
		.options{
			width: 100%;
			margin-bottom: 20px;
		}
		.item4{
			width: 320px;
		}
		.item5{
			width: 220px;
			margin-right: 20px;
		}
		.item2{
			width: 300px;
		}
		.item3{
			width: 150px;
			margin-right: 20px;
		}
		.el-upload--text{
			width: 168px;
			height: 40px;
			border: 1px solid #ECECEC;
			border-radius: 4px;
			text-align: center;
			line-height: 40px;
			.el-button{
				width: 100%;
				height: 100%;
				border: none;
				color: #6683D5;
				font-weight: 600;
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
}
</style>
