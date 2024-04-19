<template>
	<div class="policyManagement" id="policyManagement">
		<div class="content1">
			<span class="item1">批单补录</span>
			<span class="item2"></span>
		</div>
		<div class="content2">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm" size="small">
				<el-form-item label="批单申请号">
					<el-input v-model="ruleForm.applyNo" class="item3" v-if="$route.query.index == '1'" disabled></el-input>
					<el-input v-model="ruleForm.applyNo" class="item3" v-else disabled></el-input>
				</el-form-item>
				<el-form-item label="保单号">
					<el-input v-model="ruleForm.insuranceNo" class="item3" disabled v-if="$route.query.index == '1'"></el-input>
					<el-input v-model.trim="ruleForm.insuranceNo" class="item3"  @blur="searchs" v-if="$route.query.index == '2'"><el-button slot="append" @click="search"  icon="el-icon-search"></el-button></el-input>
					<el-input v-model="ruleForm.insuranceNo" class="item3" disabled v-if="$route.query.index == ''"></el-input>
				</el-form-item>
				<el-form-item label="保险期限">
					 <el-date-picker v-model="ruleForm.data" class="item3" :clearable="clearable" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期" disabled></el-date-picker>
				</el-form-item>
				<el-form-item label="批单号" prop="endorsementsNo">
					<el-input v-model.trim="ruleForm.endorsementsNo" class="item3" oncopy="return false" onpaste="return false"></el-input>
				</el-form-item>
				<el-form-item label="确认批单号" prop="endorsementsNos">
					<el-input v-model.trim="ruleForm.endorsementsNos" class="item3" oncopy="return false" onpaste="return false"></el-input>
				</el-form-item>
				<el-form-item label="签单日期" prop="issueDate">
					<el-date-picker v-model="ruleForm.issueDate" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd" class="item3"></el-date-picker>
				</el-form-item>
				<el-form-item label="批单生效日期" prop="validDate">
					<el-date-picker v-model="ruleForm.validDate" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd" class="item3"></el-date-picker>
				</el-form-item>
				<el-form-item label="批单截止日期">
					<el-date-picker v-model="ruleForm.endDate" type="date" placeholder="选择日期" disabled value-format="yyyy-MM-dd" class="item3"></el-date-picker>
				</el-form-item>
				<el-form-item label="批单类型" prop="endorsementsType">
					<el-select v-model="ruleForm.endorsementsType" disabled class="item3" v-if="$route.query.index == '1'">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-select v-model="ruleForm.endorsementsType" placeholder="请选择批单类型" v-else class="item3">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="数量">
					<el-input v-model.trim="ruleForm.increaseOrDecreaseNumber" class="item3"></el-input>
				</el-form-item>
				<el-form-item label="批单金额" prop="batchPremium">
					<el-input v-model="ruleForm.batchPremium" disabled class="item3" v-if="$route.query.index == '1'"></el-input>
					<el-input v-model.trim="ruleForm.batchPremium" class="item3" v-else></el-input>
				</el-form-item>
				<el-form-item label="批单影印件" prop="urlid">
					<el-upload class="upload-demo" drag action="#" :http-request="Upload" multiple accept=".doc , .docx ,  .pptx , .pdf , .rar , .zip , .jpg , .png ">
						<img v-if="ruleForm.urlid" :src="ruleForm.urlid" class="avatar1">
						<i class="el-icon-upload" v-if="!ruleForm.urlid"></i>
						<div class="el-upload__text" v-if="!ruleForm.urlid">将文件拖到此处，或<em>点击上传</em></div>
					</el-upload>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="ruleForm.supplementaryNote" class="item3" type="textarea"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="item4" @click="searchview('ruleForm')" :disabled="disabled">提交</el-button>
					<el-button type="info" class="item4" @click="empty">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import {elevator} from '@/server/accidenServer.js';
import ResourcesService from '@/service/ResourcesService.js';
import UserService from '@/service/UserService.js';
import battenType from '../../../static/data/battenType.json';
export default {
	data() {
		var checkNumber = (rule, value, callback) => {
			const numberReg = /^\d+(\.\d+)?$/
			if (value == '' && value != 0) {
			return callback(new Error("请填写批单金额"))
			}
			if (value<0) {
			return callback(new Error("输入批单金额必须大于0"))
			}
			setTimeout(() => {
				if (numberReg.test(value)) {
					callback()
				} else {
					callback(new Error("批单金额只能为数字"))
				}
			}, 100)
		};
		var validatePass3 = (rule, value, callback) => {
			if (value == '') {
				callback(new Error('请再次输入批单号'));
			} else if (value != this.ruleForm.endorsementsNo) {
				callback(new Error('两次输入的批单号不一致,请重新输入'));
			} else {
				callback();
			}
		};
		return {
			Elevator:new elevator(),
			ResourcesService:new ResourcesService(),
			UserService:new UserService(),
             ruleForm:{
				applyNo:'系统自动生成',
				insuranceNo:'',
				data:[],
				endorsementsNo:'',
				endorsementsNos:'',
				issueDate:'',
				validDate:'',
				endDate:'',
				endorsementsType :'',
				increaseOrDecreaseNumber:'',
				batchPremium:'',
				urlid:'',
				supplementaryNote :'',
				fileInfoVO:{
					fileName:'',
					fileType:'',
					fileUrl:'',
				 }
			 },
			 rules:{
				endorsementsNo:[{required: true, message: '请输入批单号', trigger: 'blur'}],
				endorsementsNos:[{required: true,validator: validatePass3,trigger: 'blur'}],
				issueDate:[{ type: 'string', required: true, message: '请选择日期', trigger: 'change' }],
				validDate:[{ type: 'string', required: true, message: '请选择日期', trigger: 'change' }],
				endorsementsType:[{required: true, message: '请选择批单类型', trigger: 'change' }],
				batchPremium:[{required: true,validator: checkNumber, trigger: 'blur'}],
				urlid:[{required: true, message: '请上传批单影印件', trigger: 'change'}]
			 },
			 options:[],
			 clearable:false,
			 id:'',
			 fileName:'',
			 disabled:false,
			 data:{},
			 numbers:0,
			 premiumAmountAfter:0,
			 index:'',
			 res_token:''
		}
	},
	computed:{
       
	},
	mounted() {
		
	},
	created(){
		this.types();
		this.getResToken()
		if(this.$route.query.insuranceNo){
			this.getDet();
			this.getApproval();
		}else if(this.$route.query.policyNo){
			this.getDets();
		};
	},
	methods: {
		types(){
			this.options = battenType.data
		},
		async getDet(){//批单列表页跳转保单详情
			let res = await this.Elevator.getapprovaldetails(this.$route.query.insuranceNo);
			if(res.code == '0000'){
				this.ruleForm.applyNo = this.$route.query.applyNo;
				this.ruleForm.insuranceNo = this.$route.query.insuranceNo;
				this.ruleForm.data.push(res.data.polStartDate);
				this.ruleForm.data.push(res.data.polEndDate);
				this.ruleForm.endDate = res.data.polEndDate;
				this.ruleForm.endorsementsType = this.$route.query.endorsementsType;
			}
		},
		async getApproval(){//特设批单详情
			if(this.$route.query.applyNo){
				let res = await this.Elevator.getDet(this.$route.query.applyNo);
				if(res.code == '0000'){
					this.ruleForm.batchPremium = res.data.payPremium;
				}
			}
		},
		async getDets(){//订单列表页跳转
			let res = await this.Elevator.getapprovaldetails(this.$route.query.policyNo);
			if(res.code == '0000'){
				this.data = res.data;
				this.ruleForm.insuranceNo = this.$route.query.policyNo;
				this.ruleForm.data.push(this.data.polStartDate);
				this.ruleForm.data.push(this.data.polEndDate);
				this.ruleForm.endDate = this.data.polEndDate;
				if(this.data.endorsementsInfo){
					this.numbers = this.data.endorsementsInfo.policyAmount;
					this.premiumAmountAfter = this.data.endorsementsInfo.premiumAmountAfter;
				}else{
					this.numbers = this.data.premium;
					this.premiumAmountAfter = this.data.premium;
				}
			}
		},
		async search(){
			if(this.ruleForm.insuranceNo){
				let res = await this.Elevator.getapprovaldetails(this.ruleForm.insuranceNo);
				if(res.code == '0000'){
					if(res.data){
						this.index = '';
						this.data = res.data;
						this.ruleForm.data = [];
						this.ruleForm.data.push(res.data.polStartDate);
						this.ruleForm.data.push(res.data.polEndDate);
						this.ruleForm.endDate = res.data.polEndDate;
						if(this.data.endorsementsInfo){
							this.numbers = this.data.endorsementsInfo.policyAmount;
							this.premiumAmountAfter = this.data.endorsementsInfo.premiumAmountAfter;
						}else{
							this.numbers = this.data.premium;
							this.premiumAmountAfter = this.data.premium;
						}
					}else{
						this.index = '1';
						this.$message({
							message: res.data.msg,
							type: 'warning'
						});
					}
				}
			}
		},
		async searchs(){
			if(this.ruleForm.insuranceNo){
				let res = await this.Elevator.getapprovaldetails(this.ruleForm.insuranceNo);
				if(res.code == '0000'){
					if(res.data){
						this.index = '';
						this.data = res.data;
						this.ruleForm.data = [];
						this.ruleForm.data.push(res.data.polStartDate);
						this.ruleForm.data.push(res.data.polEndDate);
						this.ruleForm.endDate = res.data.polEndDate;
						if(this.data.endorsementsInfo){
							this.numbers = this.data.endorsementsInfo.policyAmount;
							this.premiumAmountAfter = this.data.endorsementsInfo.premiumAmountAfter;
						}else{
							this.numbers = this.data.premium;
							this.premiumAmountAfter = this.data.premium;
						}
					}else{
						this.index = '1';
						this.$message({
							message: res.data.msg,
							type: 'warning'
						});
					}
				}
			}
		},
		async Upload(file){ // 图片上传
			// const formData = new FormData();
			// formData.append('files', file.file)
			// formData.append('type', file.file.type)
			// formData.append("channelcode", "sequip"); 
			// formData.append("resCode", "I001");
			let data = [file.file]
			const res = await this.ResourcesService.uploadFile('sequip-svc','endorsements','0',data);
			if(res.code == '0000'){
				this.id = res.list[0].fileId;
				this.fileName = res.list[0].fileName;
				this.ruleForm.urlid = this.ResourcesService.downloadOViewLocationFile(file.file);
				
			}
		},
		searchview(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if(this.ruleForm.data.length != 2){
						this.$message({
          					message: '请检查保险期限是否回显',
          					type: 'warning'
						});
						return;
					}
					this.disabled = true;
					this.testingUniqueness();
				} else {
					return false;
				}
			});			
		},
		async testingUniqueness(){
			let channelCode = 'sequip'
			let res = await this.Elevator.TestingUniqueness(this.ruleForm.endorsementsNo,channelCode);
			if(res.code == '0000'){
				if(res.data.size){
					this.$message.error('批单号重复，请检查批单号');
					this.disabled = false;
					return;
				}else{
					this.searchviews();
				}
			}
		},
		async searchviews(){
			this.ruleForm.batchPremium = Number(this.ruleForm.batchPremium);
			if(this.index == '1'){
				this.$message.error('保单信息为空，请检查保单号');
				this.disabled = false;
				return;
			}
			if(this.$route.query.index != '1'){
				if(this.ruleForm.endorsementsType == '02' || this.ruleForm.endorsementsType == '04'){
					this.ruleForm.batchPremium = '-' + this.ruleForm.batchPremium;
				}
			}
			if(this.$route.query.index == '1'){
				let data = {
					"applyNo": this.ruleForm.applyNo,
					"batchPremium": Number(this.ruleForm.batchPremium),
					"endDate": this.ruleForm.endDate + ' ' + '23:59:59',
					"endorseStatus": '03',
					"endorsementsNo": this.ruleForm.endorsementsNo,
					'increaseOrDecreaseNumber':this.ruleForm.increaseOrDecreaseNumber,
					"endorsementsType": this.ruleForm.endorsementsType,
					"fileInfoVO": [
					{
						"fileName": this.fileName,
						"fileType": '05',
						"fileUrl": this.id,
					}
					],
					"issueDate": this.ruleForm.issueDate + ' ' + '00:00:00',
					"validDate":this.ruleForm.validDate + ' ' + '00:00:00',
					'operateId':window.sessionStorage.getItem('userCode'),
					'operateName':window.sessionStorage.getItem('userName'),
				};
				let res = await this.Elevator.getInformationinput(data);
				if(res.code == '0000'){
					//南京，新疆，贵州，河北，深圳
					if(this.data.productCode == '19PR232767' || this.data.productCode == '19PR152821' || this.data.productCode == '19PR344296' || this.data.productCode == '19PR502997' || this.data.productCode == '19PR265735'  || this.data.productCode == '19PR695659' || this.data.productCode == '21PR999909'){
						this.Batchlistpush(this.$route.query.applyNo,this.data.productCode);
					}else{
						this.$message({
							message: '批单上传成功',
							type: 'success'
						});
						this.$router.go(-1);
					}
				}else{
					
					this.disabled = false;
					return;
				}
			}else{
				let datas = {
					"source":"00", //来源：pc端（00） 移动端（01） 合作方（02） 
					"operator":window.sessionStorage.getItem('userCode'), // 批单录入人员Code
					"entryType":"03",// 录入方式\n单笔录入（00）/批量导入（01）/事后补录（03）'
					'operatorName':window.sessionStorage.getItem('userName'), // 操作人
					'kind':'A2',
					"endorsements":[
						{
							"endorsementsType":this.ruleForm.endorsementsType, //批改类型
							"endorsementMode":"02", //批改方式
							"endorsementsNo":this.ruleForm.endorsementsNo, //批单号
							"appCode":this.data.appCode, //投保单编码
							"insuranceNo":this.ruleForm.insuranceNo, //原保单号
							"productCode":this.data.productCode, //产品编码
							"productName":this.data.productName, // 产品名称
							"productType":"00",  //产品类型
							"channelCode":"sequip",  //渠道编码
							"channelName":"特设渠道", //渠道名称
							"applicantCode":this.data.holder.holderCode, // 申请人编码
							"applicant":this.data.holder.corporation?this.data.holder.corporation.name:this.data.holder.human.name, //批单申请人名称
							"branchCode": this.data.branchCode, //机构编码
							"branchName": this.data.branchName,  //机构名称
							"issueDate":this.ruleForm.issueDate + ' ' + '00:00:00', //签单日期
							"validDate":this.ruleForm.validDate + ' ' + '00:00:00', //批单生效日期
							"startDate":this.ruleForm.validDate + ' ' + '00:00:00', //批单保险起期
							"endDate":this.ruleForm.endDate,  //批单保险止期
							"policyPremium":this.numbers, //保单保费（原保单保费 不变的）
							"batchPremium":this.ruleForm.batchPremium, //批单保费 （批减传"-"）
							"totalAmount":this.ruleForm.batchPremium,  //优惠前金额
							"preferentialPrem":0,  //优惠的金额
							"receivablePremium": this.ruleForm.batchPremium, //应收批单金额           
							"payPremium":this.ruleForm.batchPremium, //实收批单金额
							"premiumAmountBefore":Number.parseFloat(this.premiumAmountAfter), //变动前保费金额
							"premiumAmountAfter":Number.parseFloat(this.premiumAmountAfter) + Number.parseFloat(this.ruleForm.batchPremium),  //变动后保费金额
							"note": this.ruleForm.supplementaryNote, // 备注
							"attachments":[
								{
							        "id":this.id, //批单附件id
							        "type":'05', //批单附件类型
							        "name":this.fileName, //批单附件名称
								}
							],
							"returnPremium":{
								"accountName": "", // 账户名称
								"accountBank": "",// 开户行
								"accountNo": "",  // 银行账号
								"note": "" //退费原因
							}
						}
					]
				};
				let res = await this.Elevator.submitEndors(datas,{"headers":{"X-RESUB-TOKEN":this.res_token}});
				if(res.code == '0000'){
					if(this.data.productCode == '19PR232767' || this.data.productCode == '19PR152821' || this.data.productCode == '19PR344296' || this.data.productCode == '19PR502997' || this.data.productCode == '19PR265735' || this.data.productCode == '19PR695659' || this.data.productCode == '21PR999909'){
						this.Batchlistpush(res.data.applyNos[0],this.data.productCode);
					}else{
						this.$message({
							message: '批单上传成功',
							type: 'success'
						});
						this.$router.go(-1);
					}
				}else{
					this.getResToken()
					this.disabled = false;
					return;
				}
			}
		},
		async getResToken(){
			this.res_token = await this.UserService.getResToken()
		},
		async Batchlistpush(applyNos,productCode){
			let data = {
				pdCode:this.ruleForm.endorsementsNo,
				applicationPDCode:applyNos,
				productCode:productCode
			};
			let res = await this.Elevator.Batchlistpush(data);
			if(res.code == '0000'){
				this.$message({
					message: '批单上传成功',
					type: 'success'
				});
				this.$router.go(-1);
			};
		},
		empty(){
			this.$router.go(-1);
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
