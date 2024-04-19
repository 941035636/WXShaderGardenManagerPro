<template>
	<div class="policyManagement" id="policyManagement">
		<div class="content1">
			<span class="item1">发票上传</span>
			<span class="item2"></span>
		</div>
		<div class="content2">
			<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" size="small">
				<el-form-item label="投保单号/批单号">
					<el-input v-model="ruleForm.applyNo" class="item3" disabled></el-input>
				</el-form-item>
				<el-form-item label="投保人名称">
					<el-input v-model="ruleForm.name" class="item3" disabled></el-input>
				</el-form-item>
				<el-form-item label="发票抬头">
					 <el-input v-model="ruleForm.code" class="item3" disabled></el-input>
				</el-form-item>
				<el-form-item label="发票金额">
					<el-input v-model="ruleForm.endorsementsNo" class="item3" disabled></el-input>
				</el-form-item>
				<el-form-item label="发票号码" prop="code2">
					<el-input v-model="ruleForm.code2" class="item3"></el-input>
				</el-form-item>
				<el-form-item label="发票" prop="urlid">
					<el-upload class="upload-demo" drag action="#" :http-request="Upload" multiple :show-file-list="false" accept=" .pdf">
						<img v-if="ruleForm.urlid" :src="ruleForm.urlid" class="avatar1">
						<i class="el-icon-upload" v-if="!ruleForm.urlid"></i>
						<!-- <div class="el-upload__text" v-if="!ruleForm.urlid">将文件拖到此处，或<em>点击上传</em></div> -->
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="item4" @click="searchview('ruleForm')">保存</el-button>
					<el-button type="info" class="item4" @click="empty">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import ResourcesService from '../../service/ResourcesService';
import battenType from '../../../static/data/battenType.json';
export default {
	data() {
		return {
			Elevator:new elevator(),
			ResourcesService:new ResourcesService(),
             ruleForm:{
				applyNo:'',
				name:'',
				code:'',
				endorsementsNo:'',
				code2:'',
				urlid:'',
				fileInfoVO:{
					fileName:'',
					fileType:'',
					fileUrl:'',
				 }
			 },
			  rules:{
				code2: [{ required: true, message: '发票号码不能为空',trigger: 'blur'}],
				urlid: [{ required: true, message: '请上传发票',trigger: 'change'}],
			  },
			 options:[],
			 clearable:false,
			 fileName:'',
			 id:'',
			 userCode:'',
		}
	},
	computed:{
       
	},
	mounted() {
		
	},
	created(){
		if(this.$route.query.appCode){
			this.getappdetails();
		}else if(this.$route.query.applyNo){
			this.getDet();
		}
	},
	methods: {
		async getappdetails(){
			let data = {
				"appCode":this.$route.query.appCode
			};
			let res = await this.Elevator.getappdetails(data);
			if(res.code == '0000'){
				if(res.data.holder.corporation){
					this.ruleForm.name = res.data.holder.corporation.name;
				}else{
					this.ruleForm.name = res.data.holder.human.name;
				};
				this.checkinvoices();
			}
		},
		async checkinvoices(){
			let form = {
				pn:1,
				ps:10,
				oddNo:this.$route.query.appCode,
				type:'1'
			}
			let res = await this.Elevator.checkinvoices(form);
			if(res.code == '0000'){
				this.ruleForm.applyNo = res.list[0].applicationNo;
				this.ruleForm.code = res.list[0].taxpayerName;
				this.ruleForm.endorsementsNo = res.list[0].invoiceAmount;
				this.userCode = res.list[0].userCode;
			}
		},
		async getDet(){
			let res = await this.Elevator.getDet(this.$route.query.applyNo);
			if(res.code == '0000'){
				this.ruleForm.applyNo = res.data.endorsementsNo;
				this.ruleForm.name = res.data.holderInfoVO.name;
				this.ruleForm.code = res.data.holderInfoVO.name;
				this.ruleForm.endorsementsNo = res.data.batchPremium;
				this.userCode = res.data.holderInfoVO.holderCode;
				this.ruleForm.applicationFormCode = res.data.applicationFormCode;
			}
		},
		async Upload(file){ // 图片上传
			// const formData = new FormData();
			// formData.append('files', file.file)
			// formData.append('type', file.file.type)
			// formData.append("channelcode", "sequip"); 
			// formData.append("resCode", "I001");
			let data = [file.file]
			const res = await this.ResourcesService.uploadFile('invoice-svc','P001','0',data);
			if(res.code == '0000'){
				this.id = res.list[0].fileId;
				this.fileName = res.list[0].fileName;
				this.ruleForm.urlid = this.ResourcesService.downloadOViewLocationFile(file.file);
				console.log(this.ruleForm.urlid);
				
			}
		},
		searchview(ruleForm){
			this.$refs[ruleForm].validate((valid) => {
				if (valid) {
					this.searchviews();
				} else {
					return false;
				}
			});
		},
		async searchviews(){
			let data = {
				applicationFormCode:this.$route.query.appCode,
				invoiceId:this.$route.query.invoiceId,
				resorceId:this.id,
				userCode:window.sessionStorage.getItem('userCode')
			};
			let res = await this.Elevator.bindinvoice(data);
			if(res.code == '0000'){
				this.$router.push({
					path:'/invoice',
				})
				this.$message({
          			message: '发票上传成功',
          			type: 'success'
        		});
			}
		},
		empty(){
			this.$router.push({
				path:'/invoice',
			})
		},
	},
}

</script>

<style lang="less">
#policyManagement{
	padding-top: 10px;
	padding-bottom: 80px;
	background-color: #ffffff;
	.content1{
		width: 100%;
		height: 60px;
		padding-left: 20px;
		.item1{
			display: block;
			font-size: 18px;
			font-weight: 600;
			color: #101010;
		}
		.item2{
			display: block;
			width: 70px;
			height: 3px;
			background-color: #3A48E2;
		}
	}
	.content2{
		width: 100%;
		padding-left: 15%;
		.item3{
			width: 360px;
		}
		.item4{
			width: 170px;
			height: 40px;
		}
	}
}
</style>