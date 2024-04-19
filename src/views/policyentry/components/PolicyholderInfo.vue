<template>
	<div id="PolicyholderInfo">
		<Title :titles="title"></Title>
		<div class="content mt20">
			<el-form :model="form" class="demo-ruleForm" label-position="right" label-width="130px" :rules="rules" ref="form">
				<el-form-item label="投保企业名称：" prop="holderName">
					<el-select v-model.trim="form.holderName" filterable remote reserve-keyword placeholder="请输入企业名称（模糊查询）" clearable :remote-method="dataFilter" class="item4" @change="choice">
						<el-option v-for="(item,index) in restaurants" :key="index" :label="item.custFullName" :value="item.userCode"></el-option>
					</el-select>
					<span class="search-icon">
						未注册企业，请点击
						<el-button type="text" @click="AddPolicyholder"  icon="el-icon-circle-plus">添加投保企业</el-button>
					</span>
					<p v-if="form.userLoginId" class="user-id"><i class="el-icon-info"></i> 当前企业账号为“<span>{{form.userLoginId}}</span>”</p>
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
							<el-cascader :options="areaData" placeholder="请选择" v-model="form.location" @change="handleChange" class="item1"></el-cascader>
						</el-form-item>
						<el-form-item prop="position">
							<el-input placeholder="请输入详细地址" v-model.trim="form.position" class="item2" clearable @change="changes"></el-input>
						</el-form-item>
					</div>
				</el-form-item>
				<el-form-item label="证件类型：" required>
					<div style="display:flex;">
						<el-form-item prop="type">
							<el-select v-model.trim="form.type" placeholder="请选择" clearable class="item3" @change="changes">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="threeInOneCode">
							<el-input placeholder="请输入证件号" v-model.trim="form.threeInOneCode" class="item2" clearable @change="changes"></el-input>
						</el-form-item>
					</div>
				</el-form-item>
				<el-form-item label="联系人："  prop="person1">
					<el-input placeholder="请输入联系人姓名" v-model.trim="form.person1" class="item4" clearable @change="changes"></el-input>
				</el-form-item>
				<el-form-item label="联系电话："  prop="phone1">
					<el-input placeholder="请输入联系人电话" v-model.trim="form.phone1" class="item4" clearable @change="changes"></el-input>
				</el-form-item>
				<el-form-item style="display:none;">
					<el-button type="primary" @click="submitForm1(form)">保存并选择</el-button>
				</el-form-item>
			</el-form>
		</div>
		<AddPolicyholderInfo ref="myChildEleList" :options3="options3" :options2="options2" :areaData="areaData" @func="getMsgFormSon"></AddPolicyholderInfo>
	</div>
</template>

<script>
import Title from './Title'
import AddPolicyholderInfo from './AddPolicyholderInfo'
import PolicyentryService from '../../../service/PolicyentryService'
import UserService from '../../../service/UserService'
import getCascaderObj from '../js/selectedOptions'
import store from "../../../store/index"
import Bus from "@/util/busEvent"
export default {
	name:'PolicyholderInfo',
	components:{
		Title,AddPolicyholderInfo
	},
	store,
	props:{
		'areaData':Array
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
			var reg = /^[0-9a-zA-Z]{1,30}$/;
			if (!value) {
				return callback(new Error("请输入证件号"));
			} else if (!reg.test(value)) {
				callback(new Error("请输入正确的证件号(1-30位数字或字母)"));
			} else {
				callback();
			}
		};
		return {
			PolicyentryService:new PolicyentryService(),
			UserService: new UserService(),
			select:new getCascaderObj(),
			title:'投保人信息',
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
			options2:[],
			options3:[],
			form:{
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
				userLoginId:'',
				typeC: '',
				typeCName: '',
				types: '',
				typesName: '',
			},
			rules: {
				holderName: [{ required: true, message: '请输入投保企业名称', trigger: 'blur' },{ max: 75, message: '企业名称长度小于75位', trigger: 'blur'}],
				location: [{ required: true, message: "请选择企业地址", trigger: "change" }],
				position: [{ required: true, message: "请输入详细地址", trigger: "blur" },{ min: 2,max:100, message: '长度在2-100个字符之间', trigger: 'blur'}],
				type: [{ required: true, message: "请选择", trigger: "change" }],
				threeInOneCode: [{ required: true, validator: checkCode, trigger: "blur" }],
				person1: [{ required: false,min:1,max: 20, message: '联系人姓名长度1-20位', trigger: 'blur'}],
				phone1: [{ required: false, validator: checkPhone, trigger: "blur" }],
				typeC: [{ required: true, message: "请选择企业类型", trigger: "change" }],
			},
			restaurants: [],
		};
  	},
	watch:{
		"form.threeInOneCode":{
			handler(curVal,oldVal){
				Bus.$emit("holdeNoBus",curVal)
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
		this.elementRelaConf();
		this.enterprisestypes();
	},
	methods: {
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
		async elementRelaConf() {		
			let data = await this.UserService.elementRelaConf();
			let {code,list} = data;
			if(code == "0000"){
				for(var i=0;i<data.list.length;i++){
					if(data.list[i].valuesCode == 'sequip_A'){
						data.list.splice(i,1)
					}
					if(data.list[i].valuesCode == 'sequip_B'){
						data.list.splice(i,1)
					}
				}
				this.options2 = data.list
			}
		},
		async enterprisestypes() {		
			let data = await this.UserService.enterprisestypes();
			let {code,list} = data;
			if(code == "0000"){
				this.options3 = data.list
			}
		},
		getData(){
			this.form = this.$store.getters.policyHolder;
		},
		async choice(value){
			if(value){
				let isAttestation = '0';
				this.restaurants.find(item =>{
					if(item.userCode == value){
						this.form.userCode = item.userCode;
						this.form.holderName = item.custFullName;
						this.form.location = item.provinceCode?[item.provinceCode.substring(0, 2) + '0000',item.provinceCode.substring(0, 4) + '00',item.provinceCode]:[];
						this.form.userLoginId = item.userloginId;
						isAttestation = item.isAttestation
					}
				})
				if(isAttestation != '0'){
					const res = await this.PolicyentryService.getauthsafety(value,'sequip');
					if(res.code == '0000'){
						this.form.location = [res.data.provinceCode.substring(0, 2) + '0000',res.data.provinceCode.substring(0, 4) + '00',res.data.provinceCode];
						this.form.position = res.data.orgAddress;
						let typeCO = res.data.custOrganizationElementList.find(item => item.elementCode == 'userType');
						this.form.typeC = typeCO ? typeCO.valuesCode : '';
						this.form.typeCName = typeCO ? typeCO.elementValues : '';
						let typesO = res.data.custOrganizationElementList.find(item => item.elementCode == 'orgType');
						this.form.types = typesO ? typesO.valuesCode : '';
						this.form.typesName = typesO ? typesO.elementValues : '';
						this.form.person1 = res.data.custOrganizationElementList.find(item => item.elementCode == 'linkManName') ? res.data.custOrganizationElementList.find(item => item.elementCode == 'linkManName').elementValues : '';
						this.form.phone1 = res.data.custOrganizationElementList.find(item => item.elementCode == 'linkManPhone') ? res.data.custOrganizationElementList.find(item => item.elementCode == 'linkManPhone').elementValues : '';
						if(res.data.paperworkInfoList.find(item =>(item.code == 'bl'))){
							this.form.threeInOneCode = res.data.paperworkInfoList.find(item =>(item.code == 'bl'))?res.data.paperworkInfoList.find(item =>(item.code == 'bl')).value:'';
							if(res.data.paperworkInfoList.find(item =>(item.code == 'bl'))){
								this.form.type = '2' ;
							}
						}else if(res.data.paperworkInfoList.find(item =>(item.code == 'gai'))){
							this.form.threeInOneCode = res.data.paperworkInfoList.find(item =>(item.code == 'gai'))?res.data.paperworkInfoList.find(item =>(item.code == 'gai')).value:''; 
              				if(res.data.paperworkInfoList.find(item =>(item.code == 'gai'))){
								this.form.type = '1' ;
							}
						}
          			}
				}
			}else{
				this.form.userLoginId = "";
				this.form.threeInOneCode = "";
			}
			this.$parent.$refs.getInsuredInfo.identicals()
		},
		handleChange(value){
			if(value !=''){
				var vals = this.select.getlable(this.form.location, this.areaData);
				this.form.provinceName = vals[0].label;
				this.form.cityName = vals[1].label;
				this.form.countyName = vals[2].label;
			}
			this.$parent.$refs.getInsuredInfo.identicals()
		},
		changes(type){
			console.log(type)
			this.$parent.$refs.getInsuredInfo.identicals()
		},
		AddPolicyholder(){
			this.$refs.myChildEleList.Opendialog();
		},
		async dataFilter(val){
			if(val){
				let data = {
					'loginIdOrUserName':val,
					'pageNum':1,
					'pageSize':10,
					'channelNo':'sequip',
					'userType':'',
					'beginRegisterDate':'',
					'endRegisterDate':'',
					'status':'',
					'provinceCode':'',
					'auditStatus':'',
				};
				let res = await this.PolicyentryService.getUserList(data);
				if(res.code == '0000'){
					this.restaurants = res.list;
				}
			}
		},
		getMsgFormSon(data){
			this.form = data;
		},
		submitForm1(form){
			let data = {};
			this.$refs.form.validate((valid) => {
				if (valid) {
					var vals = this.select.getlable(this.form.location, this.areaData);
					this.form.provinceName = vals[0]?vals[0].label:'';
					this.form.cityName = vals[1]?vals[1].label:'';
					this.form.countyName = vals[2]?vals[2].label:'';
					if(!this.form.provinceName || !this.form.cityName || !this.form.countyName){
						this.$message({
							message: '请补全投保企业地址省市区信息！',
							type: 'warning'
						});
					}else{
						data = this.form;
					}
				} else {
					this.$message({
                        message: '投保人信息填写不完整！',
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
#PolicyholderInfo{
	background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 20px 40px;
	.content{
		.item4{
			width: 320px;
		}
		.search-icon{
			margin-left: 20px;
		}
		.user-id {
			margin-top: 10px;
			min-width: 440px;
			max-width: 840px;
			color: #34c697;
			padding: 1px 10px;
			border-radius: 4px;
			background-color: #dbf9ef;
			font-weight: 600;
		}
		.item1{
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
		.content-tips{
			width: 450px;
			height: 34px;
			line-height: 34px;
			background-color: #F2F5FF;
			color: #6683D5;
			padding: 0 20px;
			box-sizing: border-box;
		}
	}
}
</style>
