<template>
	<div class="auth-person mb20">
    <el-dialog
      title="个人认证"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="handleClose">
      <div class="overflow">
        <div class=" overflow pt15 pl20 bg-white user-info-left">
            <el-form ref="data2" :model="data2" :rules="rules" label-width="140px">
              <el-form-item label="投保人性质:" prop="nature">
                <span v-if="notEdit">{{data2.natureName}}</span>
                <el-select v-model="data2.nature" class="name-input" placeholder="请选择投保人性质" v-else>
                  <el-option v-for="item in options1" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="投保人姓名:" prop="orgFullName">
                <span v-if="notEdit">{{data2.orgFullName}}</span>
                <el-input v-model="data2.orgFullName"  placeholder="请填写姓名" class="name-input" v-else></el-input>
              </el-form-item>
              <el-form-item label="证件类型:">
                <span v-if="notEdit">{{data2.type}}</span>
                <el-input v-model="data2.type" placeholder="请填写证件类型" class="name-input" v-else disabled></el-input>
              </el-form-item>
              <el-form-item label="证件号码:" prop="number">
                <span v-if="notEdit">{{data2.number}}</span>
                <el-input v-model="data2.number" placeholder="请填写证件号码" class="name-input" v-else></el-input>
              </el-form-item>
              <el-form-item label="身份证所在地:" prop="selectedOptions" class="detail-address">
                <span v-if="notEdit">{{data2.provinceName + data2.orgAddress}}</span>
                <el-cascader v-else :options="options" v-model="data2.selectedOptions" @change="handleChange" clearable class="name-input mb10"></el-cascader>
              </el-form-item>
              <el-form-item prop="orgAddress" class="detail-address ml-20" v-if="!notEdit">
                <el-input v-model="data2.orgAddress" placeholder="详细住址" class="name-input2"></el-input>
              </el-form-item>
              <el-form-item label="证件照片:" class="fenge-line" prop="imageUrl2">
                <div style="display: flex;" v-if="!notEdit">
                  <el-form-item prop="imageUrl2">
                    <el-upload v-if="!notEdit" class="avatar-uploader1" accept="image/*" :show-file-list="false" action="#" :http-request="Upload1" :on-success="handleAvatarSuccess1" >
                      <img v-if="data2.imageUrl2" :src="data2.imageUrl2" class="avatar1">
                      <img v-else src="../../../../static/img/id-card-1.png" class="avatar1">
                    </el-upload>
                    <span class="upload-img" v-if="!notEdit">上传身份证正面照</span>
                  </el-form-item>
                  <el-form-item prop="imageUrl3">
                    <el-upload v-if="!notEdit" class="avatar-uploader1" accept="image/*" :show-file-list="false"  action="#" :http-request="Upload2" :on-success="handleAvatarSuccess2" >
                      <img v-if="data2.imageUrl3" :src="data2.imageUrl3" class="avatar1">
                      <img v-else src="../../../../static/img/id-card-2.png" class="avatar1">
                    </el-upload>
                    <span class="upload-img" v-if="!notEdit">上传身份证背面照</span>
                  </el-form-item>
                </div>
                <viewer v-if="data2.imageUrl2 && notEdit && data2.imageUrl3">
                  <div style="display: flex;">
                    <el-form-item prop="imageUrl2">
                      <img :src="data2.imageUrl2" class="avatar1">
                    </el-form-item>
                    <el-form-item prop="imageUrl3">
                      <img :src="data2.imageUrl3" class="avatar1">
                    </el-form-item>
                  </div>
                </viewer>
              </el-form-item>

              <div class="overflow">
                <div class="overflow bg-white user-info-left1">
                  <div class="title pl5 lh60">
                    <h3 class="f18 color-gray-3">
                        <span class="item1"></span>
                        <span class="item2">联系方式</span></h3>
                    </div>
                </div>
              </div>

              <el-form-item label="联系人姓名:" prop="fullname">
                <span v-if="notEdit">{{data2.fullname}}</span>
                <el-input v-else v-model="data2.fullname" class="name-input" placeholder="请填写联系人姓名"></el-input>
              </el-form-item>
              <el-form-item label="联系人手机号:" prop="phone">
                <span v-if="notEdit">{{data2.phone}}</span>
                <el-input v-else v-model="data2.phone" class="name-input" placeholder="请填写联系人电话"></el-input>
              </el-form-item>
              <el-form-item label="联系人邮箱:" prop="email">
                <span v-if="notEdit">{{data2.email}}</span>
                <el-input v-else v-model="data2.email" class="name-input" placeholder="请填写联系人邮箱"></el-input>
              </el-form-item>
              <el-form-item label="联系地址:" prop="selectedOptions1" class="detail-address">
                <span v-if="notEdit">{{data2.selectedOptionsName + data2.area}}</span>
                <el-cascader v-else :options="options" v-model="data2.selectedOptions1" @change="handleChange1" filterable clearable class="name-input mb10"></el-cascader>
              </el-form-item>
              <el-form-item prop="area" class="detail-address ml-20" v-if="!notEdit">
                <el-input  v-model="data2.area" class="name-input2" placeholder="请填写详细地址"></el-input>
              </el-form-item>
            </el-form>
            <div v-if="!notEdit" slot="footer" class="dialog-footer text-center">
              <el-button type="warning" @click="onSubmit('data2')" class="form-btn">提交</el-button>
            </div>
        </div>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import 	UserService from '@/service/UserService';
import getCascaderObj from '../js/selectedOptions'
export default {
	name: "personalInfo",
	props:{
		options:{
			type:Array,
		},
		notEdit:{
			type:Boolean,
		},
	},
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
			UserService:new UserService(),
			select:new getCascaderObj(),
      dialogVisible:false,
			res_token:'',
			rules:{
				nature:[{ required: true, message: '投保人性质不能为空', trigger: 'change'}],
				orgFullName:[{ required: true, message: '姓名不能为空', trigger: 'blur'},
				{ min: 2, max: 75,message: '姓名长度2-75位字符', trigger: 'blur'}],
				number:[{ required: true, message: '证件号码不能为空', trigger: 'blur'},
				{ min: 18, max: 18,message: '证件号码必须为18位', trigger: 'blur'}],
				selectedOptions:[{ required: true, message: '身份证所在地不能为空', trigger: 'change'}],
				selectedOptions1:[{ required: true, message: '联系人地址不能为空', trigger: 'change'}],
				orgAddress:[{ required: true, message: '身份证所在地详细地址不能为空', trigger: 'blur'},
				{ min: 6,max: 100,message: '详细地址必须大于等于6位字符小于100位字符', trigger: 'blur'}],
				imageUrl2:[{ required: true, message: '证件照片不能为空'}],
				imageUrl3:[{ required: true, message: '证件照片不能为空'}],
				fullname:[{ required: true, message: '联系人姓名不能为空', trigger: 'blur'},
				{ min: 2,max: 20, message: '联系人长度2-20个字符', trigger: 'blur'}],
				phone:[{ required: true,validator: checkPhone,trigger: 'blur'}],
				area:[{ required: true, message: '联系地址不能为空', trigger: 'blur'},
				{ min: 6,max: 50,message: '联系人详细地址必须大于等于6位字符小于50位字符', trigger: 'blur'}],
				email:[{ required: true,message: '联系人邮箱不能为空', trigger: 'blur'},
				{type: 'email',message: '邮箱格式不正确', trigger: ['blur']},
				{ min: 5,max: 30, message: '邮箱长度5-30个字符', trigger: 'blur'}],
			},
			clearable:false,
			data2:{
				authenticationType:"1",
				userCode:'',
				createCode:'',
				provinceCode:"",
				provinceName:"",
				orgFullName:"",
				orgAddress:"",
				type:'中国居民身份证',
				nature:'',
				number:'',
				selectedOptions:[],
				imageUrl2:'',
				imageUrl3:'',
				fullname:'',
				phone:'',
				radio:0,
				selectedOptions1:[],
				area:'',
				email:"",
				orgElementVOList:[
					{
						elementCode:"applicantType",
						elementName:"投保人性质",
						elementValues:"",
						valuesCode:""    
					},
					{
						elementCode:"userType",
						elementName:"用户类型",
						elementValues:"个人",
						valuesCode:"sequip_A"    
					},
					{
						elementCode:"IssuingAgency",
						elementName:"签发机构",
						elementValues:""
					},
					{
						elementCode:"termOfValidity",
						elementName:"有效期",
						elementValues:""
					},
					{
						elementCode:"linkManName",
						elementName:"联系人姓名",
						elementValues:""
					},
					{
						elementCode:"linkManPhone",
						elementName:"联系人手机号",
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
						elementCode: "sequipExtend01",
						elementName: "扩展字段1",
						elementValues: ""
					},
					{
						elementCode: "sequipExtend02",
						elementName: "扩展字段2",
						elementValues: ""
					},
					{
						elementCode: "sequipExtend03",
						elementName: "扩展字段3",
						elementValues: ""
					}
				],
				paperworkInfoList: [
					{
						code: "idCard",
						name: "身份证",
						url: "",
						value: ""
					}
				]
			},
			options1:[],
		};
	},
	created() {
		this.elementRelaConfId();
	},
	methods: {
    async openInit(row) {
      this.dialogVisible = true
      this.getResToken();
      this.getAuthPerInfo(row.userCode)
    },
    async getAuthPerInfo(userCode) {
			let form = {
				"param":userCode,
				"channelNo":'sequip'
			};
      this.data2.userCode = userCode;
      this.data2.createCode = userCode;
			const res = await this.UserService.queryAuthenticationPer(form);
			let {code,data} = res
			if(code == "0000" && data.custUserElements && data.custUserElements.length !== 0){
				this.data2.orgFullName = data.actualName;
				this.data2.orgAddress = data.detailAddress;
				this.data2.provinceName = data.provinceName;
				this.data2.provinceCode = data.areaCode;
				if(data.custUserElements && data.custUserElements.length != 0) {
					this.data2.orgElementVOList = data.custUserElements;
				}
				this.data2.paperworkInfoList = [];
				this.data2.paperworkInfoList.push(data.paperworkInfoList[0]);
				this.data2.nature = this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('applicantType')] ? this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('applicantType')].valuesCode : '';
				this.data2.natureName = this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('applicantType')] ? this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('applicantType')].elementValues : '';
				this.data2.type = '中国居民身份证';
				this.data2.number = data.paperworkInfoList[0].value;
				this.data2.date1 = [];
				if(this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('termOfValidity')].elementValues){
					if(this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('termOfValidity')].elementValues.indexOf(',') != -1){
						this.data2.date1.push(this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('termOfValidity')].elementValues.split(',')[0]);
						this.data2.date1.push(this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('termOfValidity')].elementValues.split(',')[1]);
					}else{
						this.data2.date1 = [];
					}
				}else{
						this.data2.date1 = [];
				}
				if(data.paperworkInfoList[0].preSignUrl){
					if(data.paperworkInfoList[0].preSignUrl.indexOf(',') != '-1'){
						let resImg1 = await this.UserService.getKaptchaImg(this.$apiUrl.COM_INDENT_SHOW + data.paperworkInfoList[0].preSignUrl.split(',')[0]);
						let resImg2 = await this.UserService.getKaptchaImg(this.$apiUrl.COM_INDENT_SHOW + data.paperworkInfoList[0].preSignUrl.split(',')[1]);
						this.data2.imageUrl2 = resImg1.data
						this.data2.imageUrl3 = resImg2.data
					}else{
						let resImg2 = await this.UserService.getKaptchaImg(this.$apiUrl.COM_INDENT_SHOW + data.paperworkInfoList[0].preSignUrl);
						this.data2.imageUrl2 = resImg2.data
						this.data2.imageUrl3 = '';
					}
				}else{
					this.data2.imageUrl2 = '';
					this.data2.imageUrl3 = '';
				}
				this.data2.selectedOptions = [];
				this.data2.selectedOptions1 = [];
				this.data2.fullname = this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManName')].elementValues;
				this.data2.phone = this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManPhone')].elementValues;
				this.data2.email = this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManEmil')].elementValues;
				this.data2.area = this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManDetailAddress')].elementValues;
				this.data2.selectedOptions.push(data.areaCode.slice(0,2) + '0000') ;
				this.data2.selectedOptions.push(data.areaCode.slice(0,4) + '00');
				this.data2.selectedOptions.push(data.areaCode);
				this.data2.selectedOptions1.push(data.custUserElements[data.custUserElements.map(item => item.elementCode ).indexOf('linkManAreaCode')].elementValues.slice(0,2) + '0000') ;
				this.data2.selectedOptions1.push(data.custUserElements[data.custUserElements.map(item => item.elementCode ).indexOf('linkManAreaCode')].elementValues.slice(0,4) + '00');
				this.data2.selectedOptions1.push(data.custUserElements[data.custUserElements.map(item => item.elementCode ).indexOf('linkManAreaCode')].elementValues);
				this.data2.selectedOptionsName = data.custUserElements[data.custUserElements.map(item => item.elementCode ).indexOf('linkManAreaName')].elementValues;
			}
		},
		async getResToken(){
      this.res_token = await this.UserService.getResToken()
		},
		async elementRelaConfId() { //获取投保人性质
			let data = await this.UserService.elementRelaConfId();
			let {code,list} = data;
			if(code == "0000"){
				this.options1 = list
			}
		},
		handleChange(value){
			if(value!=""){
				var vals = this.select.getlable(this.data2.selectedOptions, this.options);
				if(vals.length == '1'){
					this.data2.provinceName = vals[0].label;
					this.data2.provinceCode = vals[0].value;
				}else if(vals.length == '2'){
					this.data2.provinceName = vals[0].label + '/' + vals[1].label;
					this.data2.provinceCode = vals[1].value;
				}else{
					this.data2.provinceName = vals[0].label + '/' + vals[1].label + '/' + vals[2].label;
					this.data2.provinceCode = vals[2].value;
				}
			}
		},
		handleChange1(value){
			if(value!=""){
				var vals = this.select.getlable(this.data2.selectedOptions1, this.options);
				if(vals.length == '1'){
					this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaName')].elementValues =  vals[0].label
					this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaCode')].elementValues = vals[0].value;
				}else if(vals.length == '2'){
					this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaName')].elementValues =  vals[0].label + '/' + vals[1].label
					this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaCode')].elementValues = vals[1].value;
				}else{
					this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaName')].elementValues =  vals[0].label + '/' + vals[1].label + '/' + vals[2].label;
					this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManAreaCode')].elementValues = vals[2].value;
				}
			}
		},
		async Upload1(file){ // 图片上传
			const formData = new FormData();
			formData.append('files', file.file)
			formData.append('type', file.file.type)
			formData.append("channelcode", "sequip"); 
			formData.append("resCode", "I002");
			let data = formData
			const res = await this.UserService.cateUploadAuth(data,'user-svc','0','idCardUrl');
			let {code} = res
			if(code == "0000"){
				if(this.data2.paperworkInfoList[0].url){
					this.data2.paperworkInfoList[0].url = res.list[0].fileId + ',' + this.data2.paperworkInfoList[0].url.split(',')[1];
				}else{
					this.data2.paperworkInfoList[0].url = res.list[0].fileId + ',' + this.data2.imageUrl3;
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
			const res = await this.UserService.cateUploadAuth(data,'user-svc','0','idCardUrl');
			let {code} = res
			if(code == "0000"){
				if(this.data2.paperworkInfoList[0].url){
					this.data2.paperworkInfoList[0].url = this.data2.paperworkInfoList[0].url.split(',')[0] + ',' + res.list[0].fileId;
				}else{
					this.data2.paperworkInfoList[0].url = this.data2.imageUrl2 + ',' + res.list[0].fileId;
				}

			}
		},
		handleAvatarSuccess1(res, file) {
			this.data2.imageUrl2  = URL.createObjectURL(file.raw);
		},
		handleAvatarSuccess2(res, file) {
			this.data2.imageUrl3  = URL.createObjectURL(file.raw);
		},
		async onSubmit(data2){
			this.$refs[data2].validate((valid) => {
				if (valid) {
					this.authentications();
				} else {
					return false;
				}
			});
		},
		async authentications(){
			this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('applicantType')].valuesCode = this.data2.nature;
			for(var i=0;i<this.options1.length;i++){
				if(this.options1[i].valuesCode == this.data2.nature){
					this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('applicantType')].elementValues = this.options1[i].elementValues
				}
			};
			this.data2.paperworkInfoList[0].value = this.data2.number;
			this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManName')].elementValues = this.data2.fullname;
			this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManPhone')].elementValues = this.data2.phone;
			this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManDetailAddress')].elementValues = this.data2.area;
			this.data2.orgElementVOList[this.data2.orgElementVOList.map(item => item.elementCode ).indexOf('linkManEmil')].elementValues = this.data2.email;
			const res = await this.UserService.authenticationSequipErpTem(this.data2,{"headers":{"X-RESUB-TOKEN":this.res_token}});
			let {code} = res
			if(code == "0000"){
        this.$emit('successCb')
				this.handleClose()
			}else{
				this.getResToken()
			}
		},
    handleClose(done) {
      this.dialogVisible = false
      this.data2 = {
				authenticationType:"1",
				userCode:'',
				createCode:'',
				provinceCode:"",
				provinceName:"",
				orgFullName:"",
				orgAddress:"",
				type:'中国居民身份证',
				nature:'',
				number:'',
				selectedOptions:[],
				imageUrl2:'',
				imageUrl3:'',
				fullname:'',
				phone:'',
				radio:0,
				selectedOptions1:[],
				area:'',
				email:"",
				orgElementVOList:[
					{
						elementCode:"applicantType",
						elementName:"投保人性质",
						elementValues:"",
						valuesCode:""    
					},
					{
						elementCode:"userType",
						elementName:"用户类型",
						elementValues:"个人",
						valuesCode:"sequip_A"    
					},
					{
						elementCode:"IssuingAgency",
						elementName:"签发机构",
						elementValues:""
					},
					{
						elementCode:"termOfValidity",
						elementName:"有效期",
						elementValues:""
					},
					{
						elementCode:"linkManName",
						elementName:"联系人姓名",
						elementValues:""
					},
					{
						elementCode:"linkManPhone",
						elementName:"联系人手机号",
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
						elementCode: "sequipExtend01",
						elementName: "扩展字段1",
						elementValues: ""
					},
					{
						elementCode: "sequipExtend02",
						elementName: "扩展字段2",
						elementValues: ""
					},
					{
						elementCode: "sequipExtend03",
						elementName: "扩展字段3",
						elementValues: ""
					}
				],
				paperworkInfoList: [
					{
						code: "idCard",
						name: "身份证",
						url: "",
						value: ""
					}
				]
			}
    }
	},
};
</script>

<style scoped lang="less">
.auth-person {
	// overflow: hidden;
	/* 用户基本信息 */
	.user-info-left{
		width: 100%;
		box-sizing: border-box;
	}
	.user-info-left1{
		width: 100%;
		height: 60px;
		box-sizing: border-box;
	}
	.title{
		position: relative;
	}
	.item1{
		display: inline-block;
		width: 5px;
		height: 20px;
		background-color: #ca9c51;
		position: absolute;
		top: 20px;
		left: 0px;
	}
	.item2{
		color: #ca9c51;
		font-weight: 600;
    position: absolute;
    left: 10px;
    top: 20px;
	}
	.avatar-uploader1{
		width: 238px;
		height: 148px;
		border: 1px dashed #BBBBBB;
		padding: 11px;
		margin-right: 10px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		box-sizing: border-box;
	}
	.avatar-uploader1 .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		i {
			font-size: 55px;
			margin-left: 59px;
		}
		span {
			font-size: 16px;
			margin-left: 59px;
		}
		
		color: #999999;
		width: 216px;
		height: 126px;
		text-align: center;
	}
	.avatar1{
		width: 216px;
		height: 126px;
		display: block;
	}
	.name-input{
		width: 250px;
	}
	.name-input2 {
		width: 350px;
	}
	.name-input1 {
		width: 625px;
	}
	.form-btn{
		width: 250px;
		text-align: center;
		background-color: #D2A55B;
		color: #FFFFFF;
		font-weight: 600;
	}
	.detail-address {
		display: inline-block;
	}
	.ml-20 {
		margin-left: -120px;
	}
	.fenge-line {
		border-bottom: 1px solid #E4E4E4;
		padding-bottom: 20px;
	}
	.upload-img {
		color: #666666;
		margin-left: 60px;
	}
}

</style>
