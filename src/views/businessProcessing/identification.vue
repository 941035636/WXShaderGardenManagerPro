<template>
	<div class="identification" id="identification">
		<div class="content1">
			<span class="item1">到账确认</span>
			<span class="item2"></span>
		</div>
		<div class="content2">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm" size="small">
				<el-form-item label="投保单号">
					<el-input v-model="ruleForm.applicationFormCode" class="item3" disabled></el-input>
				</el-form-item>
				<el-form-item label="投保人名称">
					<el-input v-model="ruleForm.name" class="item3" disabled></el-input>
				</el-form-item>
				<el-form-item label="投保日期">
					 <el-input v-model="ruleForm.applicantStartDate" class="item3" disabled></el-input>
				</el-form-item>
				<el-form-item label="保费金额">
					<el-input v-model="ruleForm.afterPrem" class="item3" disabled><template slot="append">元</template></el-input>
				</el-form-item>
				<el-form-item label="到账金额" prop="afterPrems">
					<el-input v-model="ruleForm.afterPrems" class="item3"><template slot="append">元</template></el-input>
				</el-form-item>
				<el-form-item label="到账时间" prop="validDate">
					<el-date-picker v-model="ruleForm.validDate" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd" class="item3"></el-date-picker>
				</el-form-item>
				<el-form-item label="到账凭证">
					<el-upload class="upload-demo" action="#" :http-request="Upload" :limit="1" :on-remove="handleRemove" :before-remove="beforeRemove" :on-preview="handlePreview" :file-list="fileList" accept=".doc , .docx , .ppt , .pptx , .pdf , .rar , .zip , .xlsx , .xls , .jpg , .jpeg , .png , .gif , .svg">
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
					<p>{{name}}</p>
				</el-form-item>
				<el-form-item label="操作人">
					<el-input v-model="ruleForm.names" class="item3" disabled></el-input>
				</el-form-item>
				<el-form-item label="操作时间">
					<el-date-picker v-model="ruleForm.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" class="item3" disabled></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="item4" @click="onSubmit('ruleForm')" :disabled="disabled">确认到账</el-button>
					<el-button type="info" class="item4" @click="empty">关闭</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import ResourcesService from '../../service/ResourcesService';
import getformatMoney from './js/transformation.js';
export default {
	data() {
		var checkNumber = (rule, value, callback) => {
			const numberReg = /^\d+(\.\d+)?$/
			if (!value) {
			return callback(new Error("到账金额不能为空"))
			}
			if (value<0) {
			return callback(new Error("到账金额必须大于0"))
			}
			setTimeout(() => {
				if (numberReg.test(value)) {
					callback()
				} else {
					callback(new Error("到账金额只能为数字"))
				}
			}, 100)
		};
		return {
			Elevator:new elevator(),
			getformatMoney:new getformatMoney(),
			ResourcesService:new ResourcesService(),
			fileList:[],
			name:'',
            ruleForm:{
				applicationFormCode:'',
				name:'',
				applicantStartDate:'',
				afterPrem:'',
				afterPrems:0,
				validDate:'',
				names:window.sessionStorage.getItem('userName'),
				date:'',
				afterPremOrigin:'',
			},
            options:[],
            clearable:false,
			rules:{
				afterPrems:[{validator: checkNumber, trigger: 'blur' }],
				validDate:[{ type: 'string', required: true, message: '请选择时间', trigger: 'change' }]
			},
			id:'',
			disabled:false,
		}
	},
	computed:{
       
	},
	mounted() {
		
	},
	created(){
		this.getAppDetailPro();
		this.getdatatime();
	},
	methods: {
		async getAppDetailPro(){
			let data = {
				'appCode':this.$route.query.appCode
			}
			const parmes = await this.Elevator.getAppDetailPro(data);
			if(parmes.code == '0000'){
				this.ruleForm.applicationFormCode = parmes.data.applicationFormCode;
				if(parmes.data.holder.corporation){
					this.ruleForm.name = parmes.data.holder.corporation.name;
				}else{
					this.ruleForm.name = parmes.data.holder.human.name;
				}
				this.ruleForm.applicantStartDate = parmes.data.applicantStartDate;
				this.ruleForm.afterPrem=parmes.data.afterPrem;
				this.ruleForm.afterPremOrigin=parmes.data.afterPrem;
			}
		},
		getdatatime(){
			let date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let strDate = date.getDate();
			if(month<10){
				month = '0' + month 
			};
			if(strDate<10){
				strDate = '0' + strDate 
			};
			this.ruleForm.date = year + '-' + month + '-' + strDate;
		},
		async Upload(file){ // 图片上传
			this.fileList = [];
			let data = [file.file]
			const res = await this.ResourcesService.uploadFile('sequip-svc','payInfo','0',data);
			if(res.code == '0000'){
				this.id = res.list[0].fileId;
				this.name = res.list[0].fileName;
			}
		},
		beforeRemove(file, fileList) {
        	return this.$confirm(`确定移除 ${ file.name }？`);
		},
		handleRemove(file, fileList) {
        	
		},
		handlePreview(file) {
        	console.log(file);
      	},
		async bindres(){
			let data = {
				'applicationFormCode':this.ruleForm.applicationFormCode,
				'detailList':[{
					'bizCodeType':'03',
					'resCode':'P003',
					'resId':this.id,
					'resName':'付款凭证'
				}]
			};
			const res = await this.Elevator.bindres(data);
			if(res.code == '0000'){
				
			}
		},
		onSubmit(formName){
			this.disabled = true;
			this.$refs[formName].validate((valid) => {
          		if (valid) {
					
            		this.searchviews();
          		} else {
					this.disabled = false;
            		return false;
          		}
        	});
		},
		async searchviews(){
			if(Number.parseFloat(this.ruleForm.afterPrems) - Number.parseFloat(this.ruleForm.afterPremOrigin) < -1 || Number.parseFloat(this.ruleForm.afterPrems) - Number.parseFloat(this.ruleForm.afterPremOrigin) > 1){
				this.$message({
					showClose: true,
					message: '到账金额不得大于保费金额加1，到账金额不得小于保费金额减1',
					type: 'error'
				});
				this.disabled = false;
				return false;
			}else if(this.ruleForm.afterPrems == 0){
				this.$message({
					showClose: true,
					message: '到账金额必须大于0',
					type: 'error'
				});
				this.disabled = false;
				return false;
			}else if(this.ruleForm.validDate == ''){
				this.$message({
					showClose: true,
					message: '到账时间不能为空',
					type: 'error'
				});
				this.disabled = false;
				return false;
			}else{
				let data = [{
					'afId':this.$route.query.appCode,
					'amount':this.ruleForm.afterPrems,
					'confirmDate':this.ruleForm.validDate,
					'curtype':'01',
					'operator':this.ruleForm.names,
					'payChannel':''
				}];
				const parmes = await this.Elevator.premiumAcceptance(data);
				if(parmes.code == '0000'){
					if(this.id){
						this.bindres();
					}
					this.$message({
						message: '保费到账确认修改成功',
						type: 'success'
					});
					window.location.href="about:blank";
					window.close();
				}else{
					this.disabled = false;
				}
			}
		},
		empty(){
			window.location.href="about:blank";
			window.close();
		},
	},
}

</script>

<style lang="less">
#identification{
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
	.item5{
		width: 70%;
		height: 60px;
		background-color: #1B7AC0;
		color: #FFFFFF;
		padding-left: 20px;
		box-sizing: border-box;
		font-size: 18px;
		font-weight: 600;
		margin-left: 15%;
		line-height: 60px;
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
