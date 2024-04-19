<template>
	<div class="addcableway" id="addcableway">
		<div class="modifyele">
			<p>索道信息</p>
			<span class="elesearch-item1"></span>
		</div>
		<div class="content-form">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="250px" class="demo-ruleForm" size="small">
				<el-form-item label="企业名称" prop="userName">
					<el-input v-model.trim="ruleForm.userName" v-if="$route.query.valueindex" class="form-item1" disabled></el-input>
					<el-select v-if="!$route.query.valueindex" v-model.trim="ruleForm.userName" filterable remote reserve-keyword placeholder="请输入企业名称" clearable :remote-method="dataFilter" class="form-item1" @change="choice">
						<el-option v-for="item in options" :key="item.value" :label="item.custFullName" :value="item.userCode"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="营业执照编号">
					<el-input v-model.trim="ruleForm.businessNumber" class="form-item1" disabled></el-input>
				</el-form-item>
				<el-form-item label="客运索道名称" prop="equipmentsName">
					<el-input v-model.trim="ruleForm.equipmentsName" placeholder="填写客运索道名称" class="form-item1"></el-input>
				</el-form-item>
				<el-form-item label="客运索道型号" prop="equipmentsType">
					<el-select v-model="ruleForm.equipmentsType" placeholder="请选择客运索道型号" class="form-item1"  @change="getvalue1">
						<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="客运索道设备代码" prop="registerNo">
					<el-input v-model.trim="ruleForm.registerNo" placeholder="请填写客运索道设备代码" class="form-item1"></el-input>
				</el-form-item>
				<el-form-item label="客运索道安全检验合格证编号或监督检验报告编号" prop="licenceNo">
					<el-input v-model.trim="ruleForm.licenceNo" placeholder="请填写客运索道安全检验合格证编号或监督检验报告编号" class="form-item1"></el-input>
				</el-form-item>
				<el-form-item label="上年度运送乘客人次(万)" prop="passengerLastyear">
				  	<el-select v-model="ruleForm.passengerLastyear" placeholder="请选择上年度运送乘客人次" class="form-item1"  @change="getvalue2">
						<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="5s信息评级" prop="gradeCode">
				  	<el-select v-model="ruleForm.gradeCode" placeholder="请选择5s信息评级" class="form-item1" @change="getvalue">
						<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="合格证或检验有效期限开始日期" prop="licenceStartDate">
				  	 <el-date-picker v-model="ruleForm.licenceStartDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" class="form-item1"></el-date-picker>
				</el-form-item>
				<el-form-item label="合格证或检验有效期限截止日期" prop="licenceEndDate">
				  	<el-date-picker v-model="ruleForm.licenceEndDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" class="form-item1"></el-date-picker>
				</el-form-item>
				<el-form-item label="特种设备使用标志影印件" prop="licenceFile">
					<el-upload class="upload-demo" action="#" :http-request="Upload" :show-file-list="false" accept=".pdf , .jpg , .jpeg , .png ,.JPG , .PNG , .JPEG ">
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
					<el-button size="small" type="text" style="margin-top: 10px;" @click="clicks" v-if="ruleForm.licenceFile">特种设备使用标志影印件:{{ruleForm.licenceFile}}</el-button>
				</el-form-item>
				<el-form-item label="客运索道安全检验合格证或监督检验报告影印件" prop="registerFile">
					<el-upload class="upload-demo" action="#" :http-request="Upload1" :show-file-list="false" accept=".pdf , .jpg , .jpeg , .png ,.JPG , .PNG , .JPEG ">
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
					<el-button size="small" type="text" style="margin-top: 10px;" @click="clickss" v-if="ruleForm.registerFile">客运索道安全检验合格证或监督检验报告影印件
:{{ruleForm.registerFile}}</el-button>
				</el-form-item> 
				<el-form-item label="备注">
					<el-input type="textarea" v-model="ruleForm.remark" class="form-item1" placeholder="请填写备注信息"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')" class="form-item2">保存</el-button>
					<el-button @click="resetForm" type="info" class="form-item2">关闭</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js'
import equipmentsType from '../../../static/data/equipmentsType.json';
import passengerLastyear from '../../../static/data/passengerLastyear.json';
import informationRating from '../../../static/data/informationRating.json';
import ResourcesService from '../../service/ResourcesService';
export default {
	data() {
		return {
			Elevator:new elevator(),
			ResourcesService:new ResourcesService(),
			options:[],
			options1:[],
			options2:[],
			options3:[], 	
			ruleForm:{
				userName:'',
				businessNumber:'',
				equipmentsName:'',
				equipmentsType:'',
				registerNo:'',
				passengerLastyear:'',
				gradeCode :'',
				gradeCodeCode:'',
				licenceStartDate:'',
				licenceEndDate:'',
				licenceNo:'',
				licenceFile:'',
				registerFile:'',
				remark:'',
			},
			rules: {
			  userName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
			  equipmentsName: [{ required: true, message: '填写客运索道名称', trigger: 'blur' }],
			  equipmentsType: [{ required: true, message: '请选择客运索道型号', trigger: 'change' }],
			  registerNo: [{required: true, message: '请填写客运索道设备代码', trigger: 'blur' }],
			  licenceNo:[{required: true, message: '请填写客运索道安全检验合格证编号或监督检验报告编号', trigger: 'blur' }],
			  passengerLastyear: [{required: true, message: '请选择上年度运送乘客人次', trigger: 'change' }],
			  gradeCode : [{required: true, message: '请选择5s信息评级', trigger: 'change' }],
			  licenceStartDate : [{ type: 'string', required: true, message: '请选择日期', trigger: 'change' }],
			  licenceEndDate : [{ type: 'string', required: true, message: '请选择日期', trigger: 'change' }],
			  licenceFile: [{ type: 'string', required: true, message: '请上传特种设备使用标志影印件', trigger: 'blur' }],
			  registerFile:[{required: true,message: '请上传',trigger: 'blur'}],
			},
			pageNum: 1,
			pagesize: 10,
			id:'',
			id1:'',
			userCode:'',
			equipmentsType:'',
			passengerLastyear:'',
			gradeCode:'',
			values:0,
			href:'',
		}
	},
	created(){
		this.options1 = equipmentsType.data;
		this.options2 = passengerLastyear.data;
		this.options3 = informationRating.data;
		if(this.$route.query.userCode){
			this.userinformation();
		}
	},
	methods: {
		async dataFilter(val){
			var areaCode = '';
			let loginIdOrUserName = val;
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				
			}else{
				areaCode = window.sessionStorage.getItem('provinceCode')
			}
			let data = {
				'areaCode':areaCode,
				'loginIdOrUserName':loginIdOrUserName,
				'pageNum':1,
				'pageSize':10
			};
			let res = await this.Elevator.getuserlist(data);
			if(res.code == '0000'){
				this.options = res.list
			}
		},
		async choice(value){
			if(value){
				this.userCode = value;
				let channelNo = 'sequip'
				let res = await this.Elevator.getauthsequip(this.userCode,channelNo);
				if(res.code == '0000'){
					this.ruleForm.businessNumber = res.data.paperworkInfoList[0].value;
				}
			}else{
				this.ruleForm.businessNumber = '';
			}
		},
		async userinformation(){
			let channelNo = 'sequip';
			const res = await this.Elevator.getauthsequip(this.$route.query.userCode,channelNo);
			if(res.code == '0000'){
				this.ruleForm.userName = res.data.orgFullName;
				this.ruleForm.businessNumber = res.data.paperworkInfoList[0].value;
				this.getcablewaylist();
			}
		},
		async getcablewaylist(){
			let data = {
				"nameOrCode": "",
				'pageNum':1,
				'pageSize':10,
				"states": 0,
				'userCode':this.$route.query.userCode
			}
			let res = await this.Elevator.getcablewaylist(data);
			if(res.code == '0000'){
				let currentData = res.list.find(item=>item.registerNo == this.$route.query.registerNo) || res.list[0]
				this.ruleForm.equipmentsName = currentData.equipmentsName;
				for(var i=0;i<equipmentsType.data.length;i++){
					if(currentData.equipmentsType == equipmentsType.data[i].value){
						this.ruleForm.equipmentsType = equipmentsType.data[i].label
					}
				}
				this.equipmentsType = currentData.equipmentsType;
				this.ruleForm.registerNo = currentData.registerNo;
				this.ruleForm.licenceNo = currentData.licenceNo;
				for(var l=0;l<passengerLastyear.data.length;l++){
					if(currentData.passengerLastyear == passengerLastyear.data[l].value){
						this.ruleForm.passengerLastyear = passengerLastyear.data[l].label
					}
				}
				this.passengerLastyear = currentData.passengerLastyear;
				for(var j=0;j<informationRating.data.length;j++){
					if(currentData.gradeCode == informationRating.data[j].value){
						this.ruleForm.gradeCode = informationRating.data[j].label
					}
				}
				if(currentData.gradeCode =='0' || currentData.gradeCode =='1' || currentData.gradeCode =='2'){
					this.ruleForm.gradeCodeCode = '2303';
				}else if(currentData.gradeCode =='3' || currentData.gradeCode =='4'){
					this.ruleForm.gradeCodeCode = '2302';
				}else{
					this.ruleForm.gradeCodeCode = '2301';
				}
				this.gradeCode = currentData.gradeCode;
				this.ruleForm.licenceStartDate = currentData.licenceStartDate;
				this.ruleForm.licenceEndDate = currentData.licenceEndDate;
				if(currentData.licenceFile){
					this.ruleForm.licenceFile = currentData.licenceFile;
					this.ruleForm.licenceFileUrl = currentData.licenceFileUrl;
				}
				if(currentData.registerFile){
					this.ruleForm.registerFile = currentData.registerFile;
					this.ruleForm.registerFileUrl = currentData.registerFileUrl;
				}
				this.ruleForm.remark = currentData.remark;
				this.values = currentData.id;
			}
		},
		async clicks(){
			let res = await this.ResourcesService.downloadOrViewFile(this.ruleForm.licenceFileUrl,true)
		},
		async clickss(){
			let res = await this.ResourcesService.downloadOrViewFile(this.ruleForm.registerFileUrl,true)
		},
		getvalue1(value){
			this.equipmentsType = value;
		},
		getvalue2(value){
			this.passengerLastyear = value;
		},
		getvalue(value){
			this.gradeCode = value;
			if(value =='0' || value =='1' || value =='2'){
				this.ruleForm.gradeCodeCode = '2303';
			}else if(value =='3' || value =='4'){
				this.ruleForm.gradeCodeCode = '2302';
			}else{
				this.ruleForm.gradeCodeCode = '2301';
			}
			console.log(this.ruleForm.gradeCodeCode)
		},
		async Upload(file){ // 图片上传
			let data = [file.file]
			const res = await this.ResourcesService.uploadFile('sequip-svc','cableway','0',data);
			if(res.code == '0000'){
				this.ruleForm.licenceFile = res.list[0].fileId;
			}
		},
		async Upload1(file){ // 图片上传
			let data = [file.file]
			const res = await this.ResourcesService.uploadFile('sequip-svc','cableway','0',data);
			if(res.code == '0000'){
				this.ruleForm.registerFile = res.list[0].fileId;
			}
		},
		async submitForm(ruleForm){
			this.$refs[ruleForm].validate((valid) => {
				if (valid) {
					this.submitForms();
				} else {
					return false;
				}
			});
		},
		async submitForms(){
			if(this.$route.query.userCode){
				for(var i=0;i<this.options1.length;i++){
					if(this.ruleForm.equipmentsType == this.options1[i].label){
						this.ruleForm.equipmentsType = this.options1[i].value
					}
				}
				for(var l=0;l<this.options2.length;l++){
					if(this.ruleForm.passengerLastyear == this.options2[l].label){
						this.ruleForm.passengerLastyear = this.options2[l].value
					}
				}
				for(var j=0;j<this.options3.length;j++){
					if(this.ruleForm.gradeCode == this.options3[j].label){
						this.ruleForm.gradeCode = this.options3[j].value
					}else{

					}
				}
			}
			if(this.$route.query.userCode){
				let data = {
					'equipmentsName':this.ruleForm.equipmentsName,
					'equipmentsType':this.equipmentsType,
					'registerNo':this.ruleForm.registerNo,
					'licenceNo':this.ruleForm.licenceNo,
					'passengerLastyear':this.passengerLastyear,
					'gradeCode':this.gradeCode,
					'gradeCodeCode':this.ruleForm.gradeCodeCode,
					'licenceStartDate':this.ruleForm.licenceStartDate,
					'licenceEndDate':this.ruleForm.licenceEndDate,
					'licenceFile':this.ruleForm.licenceFile,
					'registerFile':this.ruleForm.registerFile,
					'remark':this.ruleForm.remark,
					'userCode':this.userCode?this.userCode:this.$route.query.userCode,
					'id':this.values
				}
				const res = await this.Elevator.modifycableway(data);
				if(res.code == '0000'){
					this.$message({
						showClose: true,
						message: '修改成功',
						type: 'success'
					});
					this.$router.go(-1);
				}
			}else{
				let data = {
					'equipmentsName':this.ruleForm.equipmentsName,
					'equipmentsType':this.equipmentsType,
					'registerNo':this.ruleForm.registerNo,
					'licenceNo':this.ruleForm.licenceNo,
					'passengerLastyear':this.passengerLastyear,
					'gradeCode':this.gradeCode,
					'gradeCodeCode':this.ruleForm.gradeCodeCode,
					'licenceStartDate':this.ruleForm.licenceStartDate,
					'licenceEndDate':this.ruleForm.licenceEndDate,
					'licenceFile':this.ruleForm.licenceFile,
					'registerFile':this.ruleForm.registerFile,
					'remark':this.ruleForm.remark,
					'userCode':this.userCode?this.userCode:this.$route.query.userCode,
				}
				const res = await this.Elevator.newCableway(data);
				if(res.code == '0000'){
					this.$message({
						showClose: true,
						message: '添加成功',
						type: 'success'
					});
					this.$router.go(-1);
				}
			}
		},
		resetForm(){
			this.$router.go(-1);
		},
	},
}

</script>

<style lang="less">
#addcableway{
	padding-top: 20px;
	padding-bottom: 80px;
	background-color: #ffffff;
	.modifyele{
		width: 90%;
		height: 46px;
		margin-left: 2%;
		font-size: 18px;
		color: #101010;
		.elesearch-item1{
			display: block;
			width: 72px;
			height: 3px;
			background-color: #3A48E2;	
		}
	}
	.content-form{
		width: 90%;
		margin-left: 5%;
		.form-item1{
			width: 300px;
		}
		.form-item2{
			width: 100px;
			margin-right: 60px;
		}
		.el-upload-dragger{
			width: 300px;
		}
		.el-date-editor.el-input{
			width: 300px;
		}
	}
}
</style>
