<template>
	<div class="userInfo" id="userInfo">
		<div class="content1">
			<div class="content1-list1">
				<span class="item1"></span><span class="item2">注册信息</span>
			</div>
			<el-form :model="data" ref="data" label-width="100px" class="demo-ruleForm" size="small">
				<el-form-item required>
					<el-col :span="8">
						<el-form-item label="用户名" prop="date1">
							<span>{{data.actualName ? data.actualName : '无'}}</span>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item required>
					<el-col :span="8">
						<el-form-item label="注册手机号" prop="date1">
							<span>{{data.userPhone}}</span>
						</el-form-item>
					</el-col>
				</el-form-item>
			</el-form>
			<div class="content1-list3">
				<img :src="imgUrl" alt="" class="list3">
			</div>
		</div>
		<div class="content1">
			<div class="content1-list1">
				<span class="item1"></span><span class="item2">认证信息</span>
			</div>
			<el-form :model="data1" ref="data1" :rules="rules" label-width="100px" class="demo-ruleForm" size="small">
				<el-form-item required>
					<el-col :span="8">
						<el-form-item label="姓名" prop="orgFullName" v-if="data1.userType=='sequip_A' ||  $route.query.userType == '个人'">
							<el-input v-model="data1.orgFullName" class="item3" autocomplete></el-input>
						</el-form-item>
						<el-form-item label="企业名称" prop="orgFullName" v-else>
							<el-input v-model="data1.orgFullName" class="item3" autocomplete></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="证件号" prop="value">
							<el-input v-model="data1.value" class="item3" autocomplete></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="法定代表" prop="lawMan" v-if="data1.userType=='sequip_C'">
							<el-input v-model="data1.lawMan" class="item3" autocomplete></el-input>
						</el-form-item>
						<el-form-item label="投保人性质" prop="nature" v-if="data1.userType!='sequip_C'">
							<el-select v-model="data1.nature" placeholder="请填写投保人性质" class="item3">
								<el-option v-for="item in options1" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item required>
					<el-col :span="8">
						<el-form-item label="企业地址" prop="selectedOptions" v-if="data1.userType!='sequip_A'">
							<el-cascader :options="options3"  placeholder="请选择" v-model="data1.selectedOptions" @change="handleChange" class="item3" size="small" clearable></el-cascader>
						</el-form-item>
						<el-form-item label="住址" prop="selectedOptions" v-else>
							<el-cascader :options="options3"  placeholder="请选择" v-model="data1.selectedOptions" @change="handleChange" class="item3" size="small" clearable></el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="详细地址" prop="orgAddress">
							<el-input v-model="data1.orgAddress" class="item3" autocomplete></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="营业范围" prop="range" v-if="data1.userType=='sequip_B'">
							<el-input v-model="data1.range" class="item3" autocomplete></el-input>
						</el-form-item>
						<el-form-item label="企业类型" prop="types" v-if="data1.userType=='sequip_C'">
							<el-select v-model="data1.types" placeholder="请选择企业类型" class="item3">
								<el-option v-for="item in options2" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="证件有效期" prop="data4" v-if="data1.userType=='sequip_A' ||  $route.query.userType == '个人'">
							<el-date-picker v-model="data1.data4" class="item3" clearable value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期" @change="changes"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item required v-if="data1.userType=='sequip_A' ||  $route.query.userType == '个人'">
					<el-col :span="8">
						<el-form-item label="身份证正" prop="imageUrl2">
							<el-upload class="avatar-uploader1" accept="image/*" :show-file-list="false"  action="#" :http-request="Upload1" :on-success="handleAvatarSuccess1">
								<img v-if="data1.imageUrl2" :src="data1.imageUrl2" class="avatar1">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="身份证反" prop="imageUrl3">
							<el-upload class="avatar-uploader1" accept="image/*" :show-file-list="false"  action="#" :http-request="Upload2" :on-success="handleAvatarSuccess3">
								<img v-if="data1.imageUrl3" :src="data1.imageUrl3" class="avatar1">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
					</el-col>
					<el-col :span="8">
					</el-col>
				</el-form-item>
				<el-form-item v-if="data1.userType!='sequip_A'">
					<el-col :span="8">
						<el-form-item label="营业执照" v-if="data1.userType=='sequip_B'" prop="imageUrl1">
							<el-upload class="avatar-uploader1" accept="image/*" :show-file-list="false"  action="#" :http-request="Upload3" :on-success="handleAvatarSuccess1">
								<img v-if="data1.imageUrl1" :src="data1.imageUrl1" class="avatar1">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
						<el-form-item label="投保人性质" prop="nature" v-if="data1.userType=='sequip_C'">
							<el-select v-model="data1.nature" placeholder="请填写投保人性质" class="item3">
								<el-option v-for="item in options1" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="营业范围" prop="range" v-if="data1.userType=='sequip_C'">
							<el-input v-model="data1.range" class="item3" autocomplete></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="营业执照" v-if="data1.userType=='sequip_C'" prop="imageUrl1">
							<el-upload class="avatar-uploader1" accept="image/*" :show-file-list="false"  action="#" :http-request="Upload3">
								<img v-if="data1.imageUrl1" :src="data1.imageUrl1" class="avatar1">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-form-item>
			</el-form>
		</div>
		<div class="content1">
			<div class="content1-list1">
				<span class="item1"></span><span class="item2">联系人信息</span>
			</div>
			<el-form :model="data1" ref="data1" :rules="rules" label-width="90px" class="demo-ruleForm" size="small">
				<el-form-item required>
					<el-col :span="8">
						<el-form-item label="姓名" prop="fullname">
							<el-input v-model="data1.fullname" class="item3" autocomplete></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="手机号码" prop="phone">
							<el-input v-model="data1.phone" class="item3" autocomplete></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="data1.email" class="item3" autocomplete></el-input>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item required>
					<el-col :span="8">
						<el-form-item label="联系地址" prop="selectedOptions1">
							<el-cascader :options="options3"  placeholder="请选择" v-model="data1.selectedOptions1" @change="handleChange1" class="item3" size="small" clearable></el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="详细地址" prop="area">
							<el-input v-model="data1.area" class="item3" autocomplete></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="传真">
							<el-input v-model="data1.orgElementVOList[data1.orgElementVOList.map(item => item.elementCode ).indexOf('fax')].elementValues" class="item3" autocomplete></el-input>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item required>
					<el-col :span="8">
						<el-form-item label="邮政编码">
							<el-input v-model="data1.orgElementVOList[data1.orgElementVOList.map(item => item.elementCode ).indexOf('postalCode')].elementValues" class="item3" autocomplete></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8" v-if="data1.orgElementVOList[data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManLandline')]">
						<el-form-item label="座机号码" v-if="data1.userType!='sequip_A'">
							<el-input v-model="data1.orgElementVOList[data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManLandline')].elementValues" class="item3" autocomplete></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
					</el-col>
				</el-form-item>
			</el-form>
		</div>
		<div class="footer-list">
			<el-form :model="data1" ref="data" :rules="rules" label-width="90px" class="demo-ruleForm" size="small">
				<el-form-item>
					<el-button type="primary" class="item5" @click="preservation(data1)">保存</el-button>
					<el-button type="info" class="item5" @click="close">关闭</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
import {elevator} from '../../server/accidenServer.js';
import userService from '../../service/UserService.js';
import weim from '../../assets/images/img.jpg';
import getCascaderObj from './js/selectedOptions'
export default {
	data() {
		var checkPhone = (rule, value, callback) => {
    		const phoneReg = /^1[0-9]{10}$/
    		if (!value) {
      			return callback(new Error('手机号码不能为空'))
    		}
    		setTimeout(() => {
      			if (!Number.isInteger(+value)) {
        			callback(new Error('请输入数字值'))
      			} else {
        			if (phoneReg.test(value)) {
          				callback()
        			} else {
          			callback(new Error('手机号码格式不正确'))
        			}
      			}
    		}, 100)
  		};
		return {
			Elevator:new elevator(),
			select:new getCascaderObj(),
			userService: new userService(),
			imgUrl3:'',
            imgUrl:weim,
			imgUrl1:'',
			imgUrl2:'',
			data:{},
			data1:{
				authenticationType:"1",
				userCode:this.$route.query.userCode,
				createCode:this.$route.query.userCode,
				userType:'', //用户类型
				types:'',//企业类型
				nature:'', //投保人性质
				orgFullName:"",//名称
				value:'',//统一社会信用代码/组织机构代码
				lawMan:'无',//法定代表
				data4:[],//营业期限
				selectedOptions:[],//营业执照住所
				orgAddress:"",//详细地址
				range:'',//营业范围
				imageUrl1:'',//证件照片
				imageUrl2:'',//证件照片
				imageUrl3:'',//证件照片
				fullname:'',//联系人姓名
				phone:'',//联系人手机号
				selectedOptions1:[],//联系地址
				area:'',//详细地址
				email:'',//联系人邮箱
				provinceCode:"",
				provinceName:"",
				radio:0,
				orgElementVOList:[
					{
				elementCode:"orgType",
				elementName:"企业类型",
				elementValues:"",
				valuesCode:""    
				},
				{
				elementCode:"applicantType",
				elementName:"投保人性质",
				elementValues:"",
				valuesCode:""    
				},
				{
				elementCode:"userType",
				elementName:"用户类型",
				elementValues:"",
				valuesCode:""    
				},
				{
				elementCode:"businessScope",
				elementName:"营业范围",
				elementValues:""
				},
				{
				elementCode:"linkManName",
				elementName:"联系人姓名",
				elementValues:""	
				},
				{
				elementCode:"linkManPhone",
				elementName:"联系人电话",
				elementValues:""
				},
				{
				elementCode: "linkManDetailAddress",
				elementName: "详细联系地址",
				elementValues: ""
				},
				{
				elementCode: "linkManAreaCode",
				elementName: "联系人地址编码",
				elementValues: ""
				},
				{
				elementCode: "linkManAreaName",
				elementName: "联系人地址名称",
				elementValues: ""
				},
				{
				elementCode: "linkManEmil",
				elementName: "联系人邮箱",
				elementValues: ""
				},
				{
				elementCode: "businessTerm",
				elementName: "营业期限",
				elementValues: ""
				},
				{
				elementCode: "linkManLandline",
				elementName: "联系人座机",
				elementValues: ""
				},
				{
				elementCode: "postalCode",
				elementName: "邮编",
				elementValues: ""
				},
				{
				elementCode: "fax",
				elementName: "传真",
				elementValues: ""
				},
				{
				elementCode: "weChat",
				elementName: "微信",
				elementValues: ""
				},
				{
				elementCode: "orgStars",
				elementName: "企业星级",
				elementValues: "",
				valuesCode:""    
				},
				{
				elementCode: "sequipExtend01",
				elementName: "扩展字段1",
				elementValues: "",
				},
				{
				elementCode: "sequipExtend02",
				elementName: "扩展字段2",
				elementValues: "",
				},
				{
				elementCode: "sequipExtend03",
				elementName: "扩展字段3",
				elementValues: "",
				}
				],
				paperworkInfoList: [
				{
				code: "",
				name: "",
				url: "",
				value: ""
				}
				]
			},
			rules:{
				orgFullName:[{ required: true, message: '姓名/企业名称不能为空', trigger: 'blur'}],
				value:[{ required: true, message: '证件号不能为空', trigger: 'blur'}],
				nature:[{ required: true, message: '投保人性质不能为空', trigger: 'change'}],
				types:[{ required: true, message: '企业类型不能为空', trigger: 'change'}],
				selectedOptions:[{ required: true, message: '住址不能为空', trigger: 'change'}],
				orgAddress:[{ required: true, message: '住址不能为空', trigger: 'blur'}],
				data4:[{ required: true, message: '有效期限不能为空', trigger: 'change'}],
				range:[{ required: true, message: '营业范围不能为空', trigger: 'blur'}],
				lawMan:[{ required: true, message: '法定代表不能为空', trigger: 'blur'}],
				imageUrl1:[{ required: true, message: '证件照不能为空', trigger: 'change'}],
				imageUrl2:[{ required: true, message: '证件照不能为空', trigger: 'change'}],
				imageUrl3:[{ required: true, message: '证件照不能为空', trigger: 'change'}],
				fullname:[{ required: true, message: '联系人姓名不能为空', trigger: 'blur'}],
				phone:[{ required: true,validator: checkPhone, trigger: 'blur'}],
				email:[{ required: true,type: 'email', message: '联系人邮箱不能为空', trigger: 'blur'}],
				selectedOptions1:[{ required: true, message: '联系人地址不能为空', trigger: 'change'}],
				area:[{ required: true, message: '联系人地址不能为空', trigger: 'blur'}],
			},
			options1:[],
			options2:[],
			options3:[],
			list:[],
			imageUrl2:'',
			imageUrl3:'',
			res_token:'',
			orgFullNameBefore: '',
		}
	},
	computed:{
         
	},
	mounted() {
		this.userinfo();
		this.userinformation();
		this.elementRelaConfId();
		this.enterprisestypes();
		this.getArea();
		this.getResToken();
	},
	methods: {
		async getResToken(){
            this.res_token = await this.userService.getResToken()
       },
		async userinfo(){
			const res = await this.Elevator.getuserinfo(this.$route.query.userCode);
			if(res.code == '0000'){
				this.imgUrl = weim;
				this.data = res.data;
			}
		},
		async userinformation(){
			let channelNo = 'sequip';
			let res = {};
			if(this.$route.query.userType == '个人') {
				res = await this.Elevator.getauthsequipPer({"param":this.$route.query.userCode,"channelNo":channelNo});
			} else {
				res = await this.Elevator.getauthsequip(this.$route.query.userCode,channelNo);
			}
			if(res.code == '0000' && res.data){
				this.data1.orgElementVOList =  res.data.custOrganizationElementList ?  res.data.custOrganizationElementList : res.data.custUserElements ? res.data.custUserElements : [];
				this.data1.paperworkInfoList =  res.data.paperworkInfoList;
				this.data1.userType = this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('userType')] ? this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('userType')].valuesCode : '';
				this.data1.orgFullName = res.data.orgFullName ? res.data.orgFullName : res.data.actualName;
				this.orgFullNameBefore = this.data1.orgFullName
				this.data1.lawMan = res.data.lawMan;
				this.data1.value = this.data1.paperworkInfoList[0].value;
				this.data1.provinceName = res.data.provinceName;
				this.data1.provinceCode = res.data.provinceCode ? res.data.provinceCode : res.data.areaCode;
				this.data1.nature = this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('applicantType')] ? this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('applicantType')].valuesCode : '';
				this.data1.selectedOptions.push(this.data1.provinceCode.slice(0,2) + '0000');
				this.data1.selectedOptions.push(this.data1.provinceCode.slice(0,4) + '00');
				this.data1.selectedOptions.push(this.data1.provinceCode);
				if(this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaCode')]) {
					this.data1.selectedOptions1.push(this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaCode')].elementValues.slice(0,2) + '0000');
					this.data1.selectedOptions1.push(this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaCode')].elementValues.slice(0,4) + '00');
					this.data1.selectedOptions1.push(this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaCode')].elementValues);
				}
				this.data1.orgAddress = res.data.orgAddress ? res.data.orgAddress : res.data.detailAddress;
				this.data1.area = this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('linkManDetailAddress')] ? this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('linkManDetailAddress')].elementValues : '';
				this.data1.fullname = this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('linkManName')] ? this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('linkManName')].elementValues : '';
				this.data1.phone = this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('linkManPhone')] ? this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('linkManPhone')].elementValues : '';
				this.data1.email = this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('linkManEmil')] ? this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('linkManEmil')].elementValues : '';
				if(this.data1.userType == 'sequip_A'){
					if(this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('termOfValidity')] && this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('termOfValidity')].elementValues){
						if(this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('termOfValidity')].elementValues.indexOf(',') != -1){
							this.data1.data4.push(this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('termOfValidity')].elementValues.split(',')[0]);
							this.data1.data4.push(this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('termOfValidity')].elementValues.split(',')[1]);
						}else{
							this.data1.data4 = [];
						}
					}else{
						this.data1.data4 = [];
					}
					if(this.data1.paperworkInfoList[0].preSignUrl){
						if(this.data1.paperworkInfoList[0].preSignUrl.indexOf(',') != -1){
							let dataImg1 = await this.userService.getKaptchaImg(this.$apiUrl.COM_INDENT_SHOW + this.data1.paperworkInfoList[0].preSignUrl.split(',')[0]);
							let dataImg2 = await this.userService.getKaptchaImg(this.$apiUrl.COM_INDENT_SHOW + this.data1.paperworkInfoList[0].preSignUrl.split(',')[1]);
							this.data1.imageUrl2 = dataImg1.data;
							this.data1.imageUrl3 = dataImg2.data;
						}else{
							let dataImg1 = await this.userService.getKaptchaImg(this.$apiUrl.COM_INDENT_SHOW + this.data1.paperworkInfoList[0].preSignUrl.split(',')[0]);
							this.data1.imageUrl2 = dataImg1.data;
							this.data1.imageUrl3 = '';
						}
					}else{
						this.data1.imageUrl2 = '';
						this.data1.imageUrl3 = '';
					}
				}else{
					let dataImg1 = await this.userService.getKaptchaImg(this.$apiUrl.COM_INDENT_SHOW + this.data1.paperworkInfoList[0].preSignUrl);
					this.data1.imageUrl1 = dataImg1.data;
					this.data1.range = this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('businessScope')] ? this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('businessScope')].elementValues : '';
					if(this.data1.userType == 'sequip_C'){
						this.data1.types = this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('orgType')] ? this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode).indexOf('orgType')].valuesCode : '';
					}else{
						let orgType = this.data1.orgElementVOList.find(item => {
							return item.elementCode  == 'orgType';
						});
						if(!orgType){
							let list5 = {
								"elementCode":"orgType",
								"elementName":"企业类型",
								"elementValues":"",
								"valuesCode":""    
							} 
							this.data1.orgElementVOList.push(list5);
						}
						let businessTerm = this.data1.orgElementVOList.find(item => {
							return item.elementCode  == 'businessTerm';
						});
						if(!businessTerm){
							let list6 = {
								"elementCode":"businessTerm",
								"elementName":"营业期限",
								"elementValues":""
							} 
							this.data1.orgElementVOList.push(list6);
						}
						let businessScope = this.data1.orgElementVOList.find(item => {
							return item.elementCode  == 'businessScope';
						});	
						if(businessScope){
							this.data1.range = this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('businessScope')] ? this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('businessScope')].elementValues : '';
						}else{
							let list2 = {
								"elementCode":"businessScope",
								"elementName":"营业范围",
								"elementValues":""
							}
							this.data1.orgElementVOList.push(list2);
							this.data1.range = '';
						}
					}	
				}
			}	
		},
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.options3 = parmes.data;
			}
		},
		async elementRelaConfId() { //获取投保人性质
			let data = await this.Elevator.elementRelaConfId();
			if(data.code == '0000'){
				this.options1 = data.list;
			}
		},
		async enterprisestypes(){ //获取企业类型 
			let data = await this.Elevator.enterprisestypes();
			if(data.code == '0000'){
				this.options2 = data.list;
			}
		},
		changes(value){
			if(value){
				this.data1.data4[0] = value[0];
				this.data1.data4[1] = value[1];
				if(this.data1.data4[1] <= this.data1.data4[0]){
					this.$message.error('开始日期必须小于结束日期');
				}else{
					this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('termOfValidity')].elementValues = value[0] + ',' + value[1];
				}
			}else{
				this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('termOfValidity')].elementValues = '';
			}
		},
		async Upload3(file){ // 图片上传
			const formData = new FormData();
			formData.append('files', file.file)
			formData.append('type', file.file.type)
			formData.append("channelcode", "sequip"); 
			formData.append("resCode", "I002");
			let data = formData
			const res = await this.Elevator.cateUploadAuth(data,'user-svc','0','blUrl');
			if(res.code == '0000'){
				this.data1.paperworkInfoList[0].url = res.list[0].fileId;
			}
		},
		async Upload1(file){ // 图片上传
			const formData = new FormData();
			formData.append('files', file.file)
			formData.append('type', file.file.type)
			formData.append("channelcode", "sequip"); 
			formData.append("resCode", "I002");
			let data = formData
			const res = await this.Elevator.cateUploadAuth(data,'user-svc','0','idCardUrl');
			if(res.code == '0000'){
				this.imageUrl2 = res.list[0].fileId;
				if(this.data1.paperworkInfoList[0].url){
					this.data1.paperworkInfoList[0].url = res.list[0].fileId + ',' + this.data1.paperworkInfoList[0].url.split(',')[1];
				}else{
					this.data1.paperworkInfoList[0].url = res.list[0].fileId + ',' + this.imageUrl3;
				}
			}
		},
		async Upload2(file){ // 图片上传
			const formData = new FormData();
			formData.append('files', file.file)
			formData.append('type', file.file.type)
			formData.append("channelcode", "sequip"); 
			formData.append("resCode", "I002");
			let data = formData
			const res = await this.Elevator.cateUploadAuth(data,'user-svc','0','idCardUrl');
			if(res.code == '0000'){
				this.imageUrl3 = res.list[0].fileId;
				if(this.data1.paperworkInfoList[0].url){
					this.data1.paperworkInfoList[0].url = this.data1.paperworkInfoList[0].url.split(',')[0] + ',' + res.list[0].fileId;
				}else{
					this.data1.paperworkInfoList[0].url = this.imageUrl2 + ',' + res.list[0].fileId;
				}
			}
		},
		handleAvatarSuccess1(res, file) { // 头像上传成功
			this.data1.imageUrl1 = URL.createObjectURL(file.raw);
		},
		handleAvatarSuccess2(res, file) { // 头像上传成功
			this.data1.imageUrl2 = URL.createObjectURL(file.raw);
		},
		handleAvatarSuccess3(res, file) { // 头像上传成功
			this.data1.imageUrl3 = URL.createObjectURL(file.raw);
		},
		handleChange(value){
			if(value!=""){
				var vals = this.select.getlable(this.data1.selectedOptions, this.options3);
				if(vals.length == '1'){
					this.data1.provinceName = vals[0].label;
					this.data1.provinceCode = vals[0].value;
				}else if(vals.length == '2'){
					this.data1.provinceName = vals[0].label + '/' + vals[1].label;
					this.data1.provinceCode = vals[1].value;
				}else{
					this.data1.provinceName = vals[0].label + '/' + vals[1].label + '/' + vals[2].label;
					this.data1.provinceCode = vals[2].value;
				}
			}
		},
		handleChange1(value){
			if(value!=""){
				var vals = this.select.getlable(this.data1.selectedOptions1, this.options3);
				if(vals.length == '1'){
					this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaName')].elementValues =  vals[0].label
					this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaCode')].elementValues = vals[0].value;
				}else if(vals.length == '2'){
					this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaName')].elementValues =  vals[0].label + '/' + vals[1].label
					this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaCode')].elementValues = vals[1].value;
				}else{
					this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaName')].elementValues =  vals[0].label + '/' + vals[1].label + '/' + vals[2].label;
					this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaCode')].elementValues = vals[2].value;
				}
			}
		},
		preservation(data1){
			this.$refs.data1.validate((valid) => {
				if (valid) {
					this.preservations();
				} else {
					return false;
				}
				
			});
		},
		async preservations(){
			this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('applicantType')].valuesCode = this.data1.nature;
			for(var i=0;i<this.options1.length;i++){
				if(this.options1[i].valuesCode == this.data1.nature){
					this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('applicantType')].elementValues = this.options1[i].elementValues
				}
			};
			this.data1.paperworkInfoList[0].value = this.data1.value;
			this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManName')].elementValues = this.data1.fullname;
			this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManPhone')].elementValues = this.data1.phone;
			this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManDetailAddress')].elementValues = this.data1.area;
			this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('linkManEmil')].elementValues = this.data1.email;
			if(this.data1.userType == 'sequip_C'){
				this.data1.authenticationType = '2';
				this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('orgType')].valuesCode = this.data1.types;
				for(var i=0;i<this.options2.length;i++){
					if(this.options2[i].valuesCode == this.data1.types){
						this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('orgType')].elementValues = this.options2[i].elementValues
					}
				};
				this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('businessScope')].elementValues = this.data1.range;
			}
			if(this.data1.userType == 'sequip_B'){
				this.data1.authenticationType = '2';
				this.data1.orgElementVOList[this.data1.orgElementVOList.map(item => item.elementCode ).indexOf('businessScope')].elementValues = this.data1.range;
			}
			this.data1.orgFullNameBefore = this.orgFullNameBefore
			const res = await this.Elevator.authenticationSequipErpTem(this.data1,{"headers":{"X-RESUB-TOKEN":this.res_token}});
			if(res.code == '0000'){
				this.$message({
         	 		message: '修改成功',
          			type: 'success'
        		});
				this.$router.go(-1);
			}else{
				this.getResToken()
			}
		},
		close(){
			this.$router.go(-1);
		},
	},
}
</script>

<style lang="less">
#userInfo {
	padding-top: 20px;
	padding-bottom: 80px;
	background-color: #ffffff;
	.content1{
		width: 100%;
		min-height: 170px;
		margin-bottom: 40px;
		position: relative;
		.content1-list1{
			width: 100%;
			padding-left: 20px;
			height: 40px;
			line-height: 40px;
			display: flex;
			.item1{
				display: block;
				margin-top: 8px;
				height: 24px;
				background-color: #369A39;
				margin-right: 5px;
			}
			.item2{
				font-size: 18px;
				font-weight: 600;
				color: #101010;
			}
		}
		.item3{
			width: 220px;
		}
		.el-form-item__label{
			color: #4E4B4B;
			font-weight: 600;
		}
		.avatar-uploader1{
			width: 200px;
			height: 130px;
		    border: 1px dashed #BBBBBB;
		    cursor: pointer;
		    overflow: hidden;
			box-sizing: border-box;
			 .avatar-uploader1 .el-upload:hover {
			  border-color: #409EFF;
			}
			.avatar-uploader-icon {
			  font-size: 28px;
			  color: #8c939d;
			  width: 200px;
			  height: 130px;
			  line-height: 130px;
			  text-align: center;
			}
			.avatar1{
			  width: 200px;
			  height: 130px;
			  display: block;
			}
		}
		.content1-list3{
			position: absolute;
			right: 40px;
			top: 40px;
			width: 60px;
			height: 60px;
			border-radius: 50%;
			.list3{
				display: block;
				width: 60px;
				height: 60px;
				border-radius: 50%;
			}
		}
	}
	.footer-list{
		width: 100%;
		height: 60px;
		margin-top: 20px;
		text-align: center;
		line-height: 60px;
		.item5{
			width: 150px;
		}
	}
}
</style>
