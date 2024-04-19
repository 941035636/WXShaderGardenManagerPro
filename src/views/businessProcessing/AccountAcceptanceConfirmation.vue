<template>
	<div class="AccountAcceptanceConfirmation" id="AccountAcceptanceConfirmation">
		<div class="content1">
			<span class="item1">到账确认</span>
			<span class="item2"></span>
		</div>
		<div class="content2">
			<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" size="small">
				<el-form-item label="保单号">
					<el-input v-model="ruleForm.applyNo" class="item3" disabled></el-input>
				</el-form-item>
				<el-form-item label="投保人名称">
					<el-input v-model="ruleForm.name" class="item3" disabled></el-input>
				</el-form-item>
				<el-form-item label="批单申请号">
					<el-input v-model="ruleForm.code" class="item3" disabled></el-input>
				</el-form-item>
				<el-form-item label="批单类型">
					<el-select v-model="ruleForm.endorsementsType" disabled class="item3">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="批单金额">
					<el-input v-model="ruleForm.money" class="item3" disabled><template slot="append">元</template></el-input>
				</el-form-item>
				<el-form-item label="到账金额" prop="amount">
					<el-input v-model="ruleForm.amount" class="item3"><template slot="append">元</template></el-input>
				</el-form-item>
				<el-form-item label="到账时间" prop="confirmDate">
					<el-date-picker v-model="ruleForm.confirmDate" type="datetime" placeholder="选择日期"  value-format="yyyy-MM-dd HH:mm:ss" class="item3"></el-date-picker>
				</el-form-item>
				<el-form-item label="打款凭证">
					<el-upload class="upload-demo" action="#" :http-request="Upload" multiple :limit="3" :file-list="fileList" accept=".doc , .docx , .ppt , .pptx , .pdf , .rar , .zip , .xlsx , .xls , .jpg , .jpeg , .png , .gif , .svg">
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="操作人">
					<el-input v-model="ruleForm.code2" class="item3" disabled></el-input>
				</el-form-item>
				<el-form-item label="操作时间">
					<el-date-picker v-model="ruleForm.endDate1" type="date" value-format="yyyy-MM-dd" class="item3" disabled></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="item4" @click="searchview('ruleForm')" :disabled="disabled">确认到账</el-button>
					<el-button type="info" class="item4" @click="empty">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import battenType from '../../../static/data/battenType.json';
import ResourcesService from '../../service/ResourcesService';
export default {
	data() {
		return {
			Elevator:new elevator(),
			ResourcesService:new ResourcesService(),
             ruleForm:{
				applyNo:'',
				name:'',
				code:'',
				data:[],
				money:'',
				amount:'',
				endorsementsNo:'',
				issueDate:'',
				validDate:'',
				confirmDate:'',
				endDate1:'',
				endorsementsType :'',
				code2:'',
				batchPremium:'',
				fileInfoVO:{
					fileName:'',
					fileType:'',
					fileUrl:'',
				 }
			 },
			 rules:{
				amount:[{required: true, message: '请输入到账金额', trigger: 'blur'}],
				confirmDate:[{type: 'string', required: true, message: '请选择日期', trigger: 'change'}]
			 },
			 options:[],
			 clearable:false,
			 fileList:[],
			 id:'',
			 fileUrl:'',
			 fileName:'',
			 disabled:false,
		}
	},
	computed:{
       
	},
	mounted() {
		
	},
	created(){
		this.types();
		this.getDet();
	},
	methods: {
		types(){
			this.options = battenType.data;
			this.ruleForm.endorsementsType = this.$route.query.endorsementsType;
		},
		async getDet(){
			let res = await this.Elevator.getDet(this.$route.query.applyNo);
			if(res.code == '0000'){
				this.ruleForm.applyNo = res.data.insuranceNo;
				this.ruleForm.name = res.data.holderInfoVO.busCorporationVO.name;
				this.ruleForm.code = res.data.applyNo;
				this.ruleForm.money = res.data.receivablePremium;
				this.ruleForm.code2 = window.sessionStorage.getItem('userName');
				this.id = res.data.id;
				let date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let strDate = date.getDate();
				this.ruleForm.endDate1 = year + '-' + month + '-' + strDate;
			}
		},
		async Upload(file){ // 图片上传
			let data = [file.file]
			const res = await this.ResourcesService.uploadFile('sequip-svc','payInfo','0',data);
			if(res.code == '0000'){
				this.fileUrl = res.list[0].fileId;
				this.fileName = res.list[0].fileName;
			}
		},
		async searchview(formName){
			this.$refs[formName].validate((valid) => {
          		if (valid) {
            		this.searchviews();
          		} else {
            		return false;
          		}
        	});
		},
		async searchviews(){
			this.disabled = true;
			const loading = this.$loading({
			  lock: true,
			  text: '加载中',
			  spinner: 'el-icon-loading',
			  background: 'rgba(0, 0, 0, 0.7)'
			});
			setTimeout(() => {
				loading.close();
			}, 2000);
			if(this.ruleForm.amount <= 0){
				 this.$message({
					showClose: true,
					message: '金额不能小于等于0',
					type: 'warning'
				});
				this.disabled = false;
				return;
			}else{
				let data = [
					{
						'amount':this.ruleForm.amount,
						'confirmDate':this.ruleForm.confirmDate,
						'curtype':'01',
						'endorsementsId':this.id,
						'operator':window.localStorage.getItem('loginAccount'),
						'operatorName':this.ruleForm.code2,
						'judgingPaymentStatus':'00',
						'payChannel':'04',
						'fileInfos':{
							'fileName':this.fileName,
							'fileType':'02',
							'fileUrl':this.fileUrl,
						}
					}
				]
				let res = await this.Elevator.getDetpays(data);
				if(res.code == '0000'){
					this.$message({
						message: '修改成功',
						type: 'success'
					});
					this.$router.go(-1);
				}else{
					this.disabled = false;
				}
			}
		},
		empty(){
			this.$router.go(-1);
		},
	},
}

</script>

<style lang="less">
#AccountAcceptanceConfirmation{
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