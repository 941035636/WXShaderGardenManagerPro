<template>
	<div id="caseDetail">
		<div class="content-part">
			<div class="border-style">
				<span class="content-top">案件详情</span>
				<el-button type="primary" v-if="reportStatus == '04'" round class="fr mt16" @click="overCase">结案申请</el-button>
				<el-button type="primary" v-if="reportStatus == '05'" round class="fr mt16" @click="overCaseAudit">结案审核</el-button>
				<el-button type="primary" v-if="!caseOverInfo.hasPolicy" round class="fr mt16" @click="insurancePolicy">关联保单</el-button>
			</div>
			<CaseInfo ref="getCaseDetail"></CaseInfo>	

			<CaseBaseInfo></CaseBaseInfo>	
			
			<CaseRevisit></CaseRevisit>

			<AccidentCasualty></AccidentCasualty>

			<ClaimInformation></ClaimInformation>

			<FileInfo></FileInfo>

			<FileInfoOver></FileInfoOver>			
		</div>
		<el-dialog title="结案申请" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
			<el-form ref="form" :model="form" label-width="100px" :rules="rules">
				<el-form-item label="结案类型:" prop="settleType">
					<el-select v-model="form.settleType" placeholder="请选择">
						<el-option label="结案" value="01"></el-option>
						<el-option label="销案" value="02"></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="结案说明:" prop="settlementContent">
					<el-input type="textarea" v-model="form.settlementContent"></el-input>
				</el-form-item>
				<el-form-item label="审核人员:" prop="closeAuditorCode">
					<el-select v-model="form.closeAuditorCode" placeholder="请选择审核人员"  @change="setInfoNames()">
						<el-option v-for="(item,index) in customerInfo" :key="index" 
						:label="item.name" :value="item.userCode"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="submitOver('form')">提 交</el-button>
			</span>
		</el-dialog>
		<el-dialog title="结案审核" :visible.sync="dialogVisible1" width="30%" :before-close="handleCloseOver">
			<el-form ref="formOver" :model="formOver" label-width="100px" :rules="rules">
				<el-form-item label="审核类型:" prop="auditOpinion">
					<el-select v-model="formOver.auditOpinion" placeholder="请选择">
						<el-option label="通过" value="01"></el-option>
						<el-option label="驳回" value="02"></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="审核说明:" prop="reviewComments">
					<el-input type="textarea" v-model="formOver.reviewComments"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="submit('formOver')">提 交</el-button>
			</span>
		</el-dialog>
		
		<el-dialog title="提示" :visible.sync="exhibition" width="30%" :close-on-click-modal='false'>
			<el-form ref="insurance" :model="insurance" label-width="140px" :rules="rules">
				<el-form-item label="保单号:" prop="policyNo">
					<el-input v-model.trim="insurance.policyNo" style="width:70%;"></el-input>
					<el-button @click="relation">查询</el-button>
				</el-form-item>
				<el-form-item label="设备代码:" v-if="$route.query.productCategory1 == 'dt'">
					<el-select :disabled="!valueAuto" v-model="insurance.devicecode" filterable placeholder="请选择事故设备代码" style="width:70%;" @change="selectionEquipment">
						<el-option v-for="item in datas" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-switch v-model="valueAuto" active-color="#13ce66" @change="insurance.devicecode = ''"></el-switch>
				</el-form-item>
				<el-form-item label="出险人员:" v-if="$route.query.productCategory1=='gz' || $route.query.productCategory1=='ty'">
					<el-select  :disabled="!valueAutoGZ" v-model="insurance.insuredName" filterable placeholder="请选择出险人员" style="width:70%;" @change="selectionEquipment">
						<el-option v-for="item in datas" :key="item.value2" :label="item.label2" :value="item.value2">
							<span style="float: left">{{item.label2}}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{item.value2}}</span>
						</el-option>
					</el-select>
					<el-switch v-model="valueAutoGZ" active-color="#13ce66" @change="insurance.insuredName = ''"></el-switch>
				</el-form-item>
				<el-form-item label="保费:"  v-if="!valueAutoGZ || !valueAuto" prop="premium">
					<el-input v-model.trim="insurance.premium" style="width:70%;"><template slot="append">元</template></el-input>
				</el-form-item>
				<el-form-item label="产品名称:"  v-if="!valueAutoGZ || !valueAuto">
					<el-input v-model.trim="insurance.productName" style="width:70%;"></el-input>
				</el-form-item>
				<el-form-item label="保险起期:"  v-if="!valueAutoGZ || !valueAuto" prop="polStartDate">
					<el-date-picker v-model="insurance.polStartDate" type="date" class="item5" placeholder="保险起期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
				</el-form-item>
				<el-form-item label="保险止期:"  v-if="!valueAutoGZ || !valueAuto" prop="polEndDate">
					<el-date-picker v-model="insurance.polEndDate" type="date" class="item5" placeholder="保险止期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
				</el-form-item>
				<el-form-item label="设备代码:" prop="value" v-if="$route.query.productCategory1 == 'dt' && !valueAuto" :rules="{required: true, message: '设备代码不能为空', trigger: 'blur' }">
					<el-input v-model.trim="insurance.value" style="width:70%;"></el-input>
				</el-form-item>
				<el-form-item label="电梯坐落地址:" prop="elevatorSeatAddress"  v-if="$route.query.productCategory1 == 'dt' && !valueAuto" :rules="{required: true, message: '电梯坐落地址不能为空', trigger: 'blur' }">
					<el-input v-model.trim="insurance.elevatorSeatAddress" style="width:70%;"></el-input>
				</el-form-item>
				<el-form-item label="出险人员姓名:" prop="label2"  v-if="($route.query.productCategory1=='gz' || $route.query.productCategory1=='ty') && !valueAutoGZ" :rules="{required: true, message: '出险人员姓名不能为空', trigger: 'blur' }">
					<el-input v-model.trim="insurance.label2" style="width:70%;"></el-input>
				</el-form-item>
				<el-form-item label="出险人员证件号码:" prop="value2" v-if="($route.query.productCategory1=='gz' || $route.query.productCategory1=='ty') && !valueAutoGZ" :rules="{required: true, message: '出险人员证件号码不能为空', trigger: 'blur' }">
					<el-input v-model.trim="insurance.value2" style="width:70%;"></el-input>
				</el-form-item>
				<el-form-item label="索道名称:" prop="ropewayName" v-if="$route.query.productCategory1=='sd'">
					<el-select v-model="insurance.ropewayName" filterable placeholder="请选择索道名称" style="width:70%;" @change="selectionEquipment">
						<el-option v-for="item in datas" :key="item.value" :label="item.label1" :value="item.value1"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="relationpolicyNo('insurance')">关联</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import store from '../../store/index'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import CaseBaseInfo from './components/CaseBaseInfo'
import CaseInfo from './components/CaseInfo'
import FileInfo from './components/FileInfo'
import FileInfoOver from './components/FileInfoOver'
import CaseRevisit from './components/CaseRevisit'
import AccidentCasualty from './components/AccidentCasualty'
import ClaimInformation from './components/ClaimInformation'
import ConfirmClaimAmount from './components/ConfirmClaimAmount'
import Litigation from './components/Litigation'
import AccountConfirm from './components/AccountConfirm'
import ApplicationClosure from './components/ApplicationClosure'
import ClosingAudit from './components/ClosingAudit'

import CaseService from '../../service/CaseService.js';
import ProductService from '../../service/ProductService.js';
import RelatedPolicyData from './js/RelatedPolicyData.js';
import moment from 'moment';
export default {
	components:{
		AccidentCasualty,ClaimInformation,ConfirmClaimAmount,Litigation,AccountConfirm,
		ApplicationClosure,ClosingAudit,CaseRevisit,CaseBaseInfo,CaseInfo,FileInfo,FileInfoOver
	},
	inject:['reload'],
	store,
	data() {
		var checkCardNum= (rule, value, callback) => {
			var reg = /^[A-Za-z0-9]{5,22}$/;
            if (value === '') {
                callback(new Error('请输入出险人员证件号码'));
            } else if (!reg.test(value)) {
                callback(new Error('请输入正确的证件号码(5-22位数字、字母)!'));
            } else {
                callback();
            }
        };
		var checkNumber = (rule, value, callback) => {
			const numberReg = /^\d+(\.\d+)?$/
			if (!value) {
			return callback(new Error("保费不能为空"))
			}
			if (value<0 || value > 100000000) {
			return callback(new Error("保费必须大于0小于100000000"))
			}
			setTimeout(() => {
				if (numberReg.test(value)) {
					callback()
				} else {
					callback(new Error("保费只能为数字"))
				}
			}, 100)
		};
		return {
			valueAutoGZ:true,
			valueAuto:true,
			customerInfo:[],
			caseService: new CaseService(),
			productService: new ProductService(),
			RelatedPolicyData:new RelatedPolicyData(),
			formOver:{
				auditOpinion: "",
				caseNo: this.$route.query.caseNo,
				id: "",
				reportNo: this.$route.query.reportNo,
				reviewComments: ""
			},
			dialogVisible:false,
			dialogVisible1:false,
			form:{
				caseNo: "",
				id: "",
				reportNo: "",
				closeAuditorCode:"",
				closeAuditorName:"",
				settleType:"",
				settlementContent:"",
				userCode:window.sessionStorage.getItem('userCode'),
				userName:window.sessionStorage.getItem('userName')
			},
			rules:{
				settleType: [
					{required: true, message: '请选择结案类型', trigger: 'change'}
				],
				settlementContent: [
					{required: true, message: '请输入结案说明', trigger: 'change'}
				],
				closeAuditorCode: [
					{required: true, message: '请选择审核人员', trigger: 'change'}
				],
				auditOpinion: [
					{required: true, message: '请选择审核类型', trigger: 'change'}
				],
				reviewComments: [
					{required: true, message: '请输入审核说明', trigger: 'change'}
				],
				policyNo: [
					{required: true, message: '请输入保单号', trigger: 'blur'},
					{ min: 10, max: 30, message: '保单号10-30位', trigger: 'blur' }
				],
				devicecode: [
					{required: true, message: '请选择设备', trigger: 'change'}
				],
				insuredName: [
					{required: true, message: '请选择出险人员', trigger: 'change'}
				],
				ropewayName: [
					{required: true, message: '请选择索道', trigger: 'change'}
				],
				premium: [
					{required: true,validator: checkNumber, trigger: 'blur' }
					],
				polEndDate: [
					{required: true, message: '保险起期不能为空', trigger: 'change' }
				],
				polStartDate: [
					{required: true, message: '保险起期不能为空', trigger: 'change' }
				],
				value: [
					{required: true, message: '设备代码不能为空', trigger: 'blur'},
					{min: 15, max: 25, message: '设备代码10-30位', trigger: 'blur'}
				],
				elevatorSeatAddress: [
					{required: true, message: '电梯坐落地址不能为空', trigger: 'blur'},
					{min: 6, max: 100, message: '保单号6-100位', trigger: 'blur'}
				],
				label2: [
					{required: true, message: '出险人员姓名不能为空', trigger: 'blur'},
					{min: 2, max: 10, message: '出险人员姓名2-10位', trigger: 'blur'}
				],
				value2: [
					{required: true, validator: checkCardNum, trigger: 'blur'},
					{min: 5, max: 22, message: '出险人员证件号码5-22位', trigger: 'blur'}
				],

			},
			exhibition:false,
			insurance:{
				policyNo:'',
				devicecode:'',
				insuredName:'',
				ropewayName:'',
				premium:'',
				productName:'',
				polEndDate:'',
				polStartDate:'',
				channelCode: "sequip",
				channelName: "特设渠道",
				value: '',
				elevatorSeatAddress: '',
				label2: '',
				value2: '',
			},
			data1:{
				premium:'',
				productName:'',
				polEndDate:'',
				polStartDate:'',
				policyNo:'',
				channelCode: "sequip",
				channelName: "特设渠道"
			},
			datas:[],
			selecttdata:{
				elevatorSeatAddress:'',
				theElevatorType:'',
				value:'',
				value1:'',
				label1:'',
				value2:'',
				label2:'',
			},
			optionType:[]
		}
	},
	computed:{
        ...mapGetters([
			"reportStatus",
			"caseOverInfo",
			"csaeDictionaries"
        ]),
    },
	created(){
		
	},
	beforeRouteLeave(to, from, next) {
		this.$store.commit('updataCaseOverInfo',{});
		this.$store.commit('updateBaseInfo',{});
		this.$store.commit('updataCaseReview',[]);
		this.$store.commit('updataCaseProcess',{});
		this.$store.commit('updataPayInfo',{});
		this.$store.commit('updataAccountInfo',{});
		this.$store.commit('updataLitigationInfo',[]);
		this.$store.commit('updataCsaeDictionaries',[]);
		next();
	},
	methods: {
		async overCase() {
			const res = await this.caseService.cateFilequery(this.$route.query.reportNo);
            if(res.code == '0000'){
                if(!res.data.length && !res.data.find(item => item.typeId == '07')){
                    this.$message({
						message: '根据《保险经纪机构基本服务标准》的监管要求，在取得客户或保险公司确认赔付、拒赔、撤销的书面文件后，请上传相关结案证明文件，方可提交案件结案申请。',
						type: 'error'
					});
					return
                }
				if(this.caseOverInfo.isTransferringTheCase == '1'){
					this.getCustomerByJt();
					this.dialogVisible = true;
				}else{
					this.$message({
						message: '请先联系客服转报案',
						type: 'warning'
					});
					return;
				}
			}
		},
		setInfoNames(){
			var obj = {};
			let that = this;
            obj = this.customerInfo.find(function(item){
                return item.userCode === that.form.closeAuditorCode
            });
            if(JSON.stringify(obj) != '{}') {
                this.form.closeAuditorName = obj.name;
            }
        },
		
		overCaseAudit() {
			this.formOver = {
				auditOpinion: "",
				caseNo: this.$route.query.caseNo,
				id: "",
				reportNo: this.$route.query.reportNo,
				reviewComments: ""
			}
			this.dialogVisible1 = true;
		},
		handleCloseOver() {
			this.$refs['formOver'].resetFields();
			this.dialogVisible1 = false;
		},
		handleClose() {
			this.$refs['form'].resetFields();
			this.dialogVisible = false;
		},
		submitOver(name) {//结案申请提交结案申请提交
			this.$refs[name].validate((valid) => {
				if (valid) {
					this.submitOverFun();
				} else {
					return false;
				}
			});	
		},
		async submitOverFun() {
			this.form.caseNo = this.$route.query.caseNo;
			this.form.reportNo = this.$route.query.reportNo;
			let res = await this.caseService.caseApplyOver(this.form);
			if(res.code == '0000') {
				this.submitOvers(res.data);
			}
		},
		async submitOvers(id){
			let res = await this.caseService.casetjsl(this.$route.query.caseNo);
			if(res.code == '0000') {
				this.formOver.id = id;
				if(this.form.settleType == "01"){
					this.$message({
						message: '结案申请成功',
						type: 'success'
					});
					this.$store.commit('updataReportStatus',"05");
				}else{
					this.$message({
						message: '销案申请成功',
						type: 'success'
					});
					this.$store.commit('updataReportStatus',"07");
				}
				this.$refs.getCaseDetail.getCaseDetail();
				this.getCaseDetail();
				this.handleClose();
			}
		},
		// 通过分支机构查询客户经理
		async getCustomerByJt(){
			let data = {
				branchCode: sessionStorage.getItem('branchCode'),
				roleCode: process.env.ROOT_ROLECODE,
			}
			let res = await this.caseService.getCustomerByJt(data);
			if(res.code == '0000'){
				this.customerInfo = res.list;
			}
		},
		//结案审核
		submit(name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					if(this.caseOverInfo.closeAuditorCode == window.sessionStorage.getItem('userCode')){
						this.submitFun();
					}else{
						this.$message({
							message: '您没有权限审核此案件！',
							type: 'warning'
						});
					}
					return false;
				} else {
					return false;
				}
			})
		},
		async submitFun() {
			this.formOver.caseNo = this.$route.query.caseNo;
			this.formOver.reportNo = this.$route.query.reportNo;
			let res = await this.caseService.caseAuditOver(this.formOver);
			if(res.code == '0000'){
				await this.caseService.overFlow(this.$route.query.caseNo);
				if(this.formOver.auditOpinion == "01"){
					this.$message({
						message: '审核成功',
						type: 'success'
					});
				}else{
					this.$message({
						message: '已驳回',
						type: 'success'
					});
				}
				this.handleCloseOver();
				this.$router.push({path:'/case/pending'})
			}
		},
        getRowClass({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #fefbf1;border-bottom:1px solid #f0dfbf;color:#cda160;font-size:16px;';
            } else {
                return 'background: #fff';
            }
		},
		insurancePolicy(){
			this.exhibition = true;
		},
		selectionEquipment(value){
			if(this.$route.query.productCategory1 == 'dt'){
				this.datas.forEach(item => {
					if(value == item .value){
						this.selecttdata = item;
					}
				});
			}else if(this.$route.query.productCategory1 == 'gz' || this.$route.query.productCategory1 == 'ty'){
				this.datas.forEach(item => {
					if(value == item.value2){
						this.selecttdata.label2 = item.label2;
						this.selecttdata.value2 = item.value2;
					}
				});
			}else if(this.$route.query.productCategory1 == 'sd'){
				this.datas.forEach(item => {
					if(value == item .value1){
						this.selecttdata = item;
					}
				});
			}
		},
		async relation(){ //获取保单详情
			if(!this.insurance.policyNo){
				this.$message({
                    type: 'warning',
                    message: '请填写保单号'
                });
                return;
			}
			let data = {
			"policyNo":this.insurance.policyNo
			};
			const res = await this.caseService.policydetails(data);
			if(res.code == '0000'){
				const res1 = await this.productService.productDisplay(res.data.productCode);
				if(res1.code == '0000') {
					this.optionType = res1.data.list.find(item => item.sign == 'theElevatorType') ? res1.data.list.find(item => item.sign == 'theElevatorType').list : []
				}
				if(!res.data){
					this.$message({
						type: 'warning',
						message: '无查询数据'
					});
					return;
				}
				if(new Date(this.caseOverInfo.riskTime).getTime()<new Date(res.data.polStartDate).getTime() || new Date(this.caseOverInfo.riskTime).getTime()> new Date(res.data.polEndDate).getTime()){
					this.$message({
						type: 'warning',
						message: '出险时间不在保障范围内'
					});
					return;
				}
				if(this.$route.query.holderName != res.data.holderName){
					this.$message({
						type: 'warning',
						message: '投保人名称不一致，请重新填写保单号'
					});
					return;
				}
				this.data1 = res.data;
				this.datas = [];
				if(this.$route.query.productCategory1 != 'ty'){
					this.getInsurance(res.data.appCode)
				}else{
					if(res.data.insuredList[0].human.licenceNo){
						res.data.insuredList.forEach(item =>{
							let ele = {
								value: '',
								label: '',
								elevatorSeatAddress: '',
								riskProvinceCode: '',
								riskProvinceName: '',
								riskCityCode: '',
								riskCityName: '',
								riskAreaCode: '',
								riskAreaName: '',
								theElevatorType: '',
								value1: '',
								label1: '',
								value2: item.human.licenceNo,
								label2: item.human.name
							};
							this.datas.push(ele);
						})
					}else{
						this.$message({
							type: 'warning',
							message: '请输入险种类型正确的保单号'
						});
						return false;
					}
				}
			}
		},
		async getInsurance(appFormCode){
			const res = await this.caseService.getInsurance(appFormCode);
			if(!res.length){
				this.$message({
					type: 'warning',
					message: '请输入险种类型正确的保单号'
				});
			}else{
				res.find(item =>{
					if(this.$route.query.productCategory1 == 'gz'){
						if(!item.value2){
							this.$message({
								type: 'warning',
								message: '请输入险种类型正确的保单号'
							});
							return false;
						}
					}else if(this.$route.query.productCategory1 == 'dt'){
						if(!item.value){
							this.$message({
								type: 'warning',
								message: '请输入险种类型正确的保单号'
							});
							return false;
						}
					}else if(this.$route.query.productCategory1 == 'sd'){
						if(!item.value1){
							this.$message({
								type: 'warning',
								message: '请输入险种类型正确的保单号'
							});
							return false;
						}
					}
				})
				this.datas = res;
			}
		},
		relationpolicyNo(name){
			this.$refs[name].validate((valid) => {
				if (valid) {
					if(this.insurance.productName && (this.insurance.productName < 2 || this.insurance.productName > 50)) {
						this.$message({
							type: 'error',
							message: '产品名称位数2-50位。'
						});
						return false;
					}
					if(new Date(this.caseOverInfo.riskTime).getTime()<new Date(this.insurance.polStartDate).getTime() || new Date(this.caseOverInfo.riskTime).getTime()> new Date(this.insurance.polEndDate).getTime()){
						this.$message({
							type: 'error',
							message: '出险时间不在保障范围内'
						});
						return;
					}
					if(moment(this.insurance.polStartDate).format('YYYY-MM-DD') > moment(this.insurance.polEndDate).format('YYYY-MM-DD')) {
						this.$message({
							type: 'error',
							message: '保险起期大于保险止期，请重新选择。'
						});
						return false;
					}
					if(this.$route.query.productCategory1 == 'dt') {
						if(!this.valueAuto && (!this.insurance.value || !this.insurance.elevatorSeatAddress)) {
							this.$message({
								type: 'error',
								message: '请补全出险设备信息。'
							});
						}  else if(this.valueAuto && this.insurance.devicecode == '') {
							this.$message({
								type: 'error',
								message: '请选择设备代码。'
							});
						} else {
							this.PolicyDatas();
						}
					} else if(this.$route.query.productCategory1 == 'gz' || this.$route.query.productCategory1 == 'ty')  {
						let reg = /[A-Za-z0-9]{5,22}/;
						if(!this.valueAutoGZ && (!this.insurance.label2 || !this.insurance.value2 )) {
							this.$message({
								type: 'error',
								message: '请补全出险人员信息。'
							});
						} else if(!this.valueAutoGZ && !reg.test(this.insurance.value2)) {
							this.$message({
								type: 'error',
								message: '请输入正确的证件号码(5-22位数字、字母)!'
							});
						} else if(this.valueAutoGZ && this.insurance.insuredName == '') {
							this.$message({
								type: 'error',
								message: '请选择出险人员。'
							});
						} else {
							this.PolicyDatas();
						}
					} else {
						this.PolicyDatas();
					}
				} else {
					return false;
				}
			});	
		},
		async PolicyDatas(){
			if(!this.valueAutoGZ || !this.valueAuto) {
				this.data1 = this.insurance;
				this.selecttdata.value = this.insurance.value;
				this.selecttdata.elevatorSeatAddress = this.insurance.elevatorSeatAddress;
				this.selecttdata.value2 = this.insurance.value2;
				this.selecttdata.label2 = this.insurance.label2;
			}
			let data = this.RelatedPolicyData.PolicyData(this.data1,this.$route.query.caseNo,this.selecttdata,this.$route.query.productCategory1,this.$route.query.reportNo)
			const res = await this.caseService.addpolicy(data);
			if(res.code == '0000'){
				this.$message({
					type: 'success',
					message: '关联成功'
				});
				this.getCaseDetail();
			};
		},
		async getCaseDetail(){//获取案件详情
			let res = await this.caseService.getCaseDetail(this.$route.query.reportNo);
			if(res.code == '0000') {
				let caseOverInfo = {
					closingReviewList : res.data.closingReviewList,
					settlementList : res.data.settlementList,
					reportNo : res.data.reportNo,
					reportStatus : res.data.reportStatus,
					acceptionList : res.data.acceptionList,
					baseInfo : res.data.reportInfo 
				}
				this.$store.commit('updateBaseInfo',caseOverInfo);
				if(this.$route.query.productCategory1 == 'dt'){
					this.csaeDictionaries.elevator.caseType.find(item => {
						if(item.value == res.data.reportInfo.caseType){
							res.data.reportInfo.caseTypeName = item.label;
						}
					})	
				}else if(this.$route.query.productCategory1 == 'sd'){
					this.csaeDictionaries.repoway.caseType.find(item => {
						if(item.value == res.data.reportInfo.caseType){
							res.data.reportInfo.caseTypeName = item.label;
						}
					})	
				}else{
					this.csaeDictionaries.employer.caseType.find(item => {
						if(item.value == res.data.reportInfo.caseType){
							res.data.reportInfo.caseTypeName = item.label;
						}
					})
				}
				let makemoneys = {
					"paymentDate":res.data.reportInfo.paymentDate,
					"paymentTime":res.data.reportInfo.paymentTime,
				}
				this.$store.commit('updataMakemoneys',makemoneys);
				this.$store.commit('updataCaseOverInfo',res.data.reportInfo);
				this.$store.commit('updataReportStatus',res.data.reportInfo.reportStatus);
				this.$store.commit('updataCaseReview',res.data.revisitList);
				let accidentAndCasualty = res.data.accidentAndCasualty.caseInfoVO;
				accidentAndCasualty.insuredInfoList = res.data.accidentAndCasualty.insuredInfoList?res.data.accidentAndCasualty.insuredInfoList:[];
				this.$store.commit('updataCaseProcess',accidentAndCasualty);
				this.$store.commit('updataPayInfo',res.data.lossDetail);
				let accountInfo = {
                    "bankCardAccount": "",
                    "cardBank": "",
                    "id": "",
                    "payeeName": "",
                    "reportNo": this.$route.query.reportNo
                };
				this.$store.commit('updataAccountInfo',res.data.account?res.data.account:accountInfo);
				if(res.data.litigationList.length){
					this.$store.commit('updataLitigationInfo',res.data.litigationList[0]);
				}else{
					let litigationList = {
						litigationResult:"",
						litigationMoney:"",
						otherContent:"",
						litigationTime:"",
						id:"",
						reportNo: this.$route.query.reportNo,
						caseNo: this.$route.query.caseNo
					};
					this.$store.commit('updataLitigationInfo',litigationList);
				}
				this.exhibition = false;
				this.reload();
			}
		},
	},
}

</script>

<style lang="less">
#caseDetail {
	padding-top: 20px;
	background-color:#f2f1ef;
	padding-bottom: 80px;
	.content-part {
		margin-left: 20px;
		width: 90%;
		padding-bottom: 80px;
		.border-style {
			.el-button--warning.is-plain {
				padding: 15px 60px;
				color: #db9728;
				background: #fff;
				font-size: 18px;
				border-color: #db9728;
				margin: 22px 0;
			}
			.edit-icon {
				font-size: 18px;
				color: #db9728;
				cursor: pointer;
			}
		}
		.content-top {
			font-size: 20px;
			color:#333333;
			font-weight: 700;
			margin: 22px;
			display: inline-block;
		}
		.content-title {
			color:#666666;
			font-weight: 700;
			font-size: 18px;
			padding: 25px 60px 6px;
			display: inline-block;
		}
		.col-black {
			color: #5a503b;
		}
		.el-form {
			margin-left: 60px;
    		margin-right: 60px;
			padding-bottom: 10px;
			.el-form-item__label {
				font-size:14px;
				color:#666666;
			}
			.el-form-item__content {
				font-size:14px;
				color:#333333;
				font-weight:500;
			}
			.el-form-item {
				margin-bottom: 4px;
			}
		}
		.el-table {
			border: 1px solid #f0dfbf;
			margin-bottom: 20px;
		}
		.el-upload-list--picture .el-upload-list__item-thumbnail {
			width: 160px;
			height: 120px;
		}
		.el-upload-list--picture .el-upload-list__item-name {
			display: inline-block;
			margin-right: 0;
			width: 160px;
			text-align: center;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
		.el-upload-list--picture .el-upload-list__item {
			margin-right: 10px;
			display: inline-block;
			padding: 10px;
			height: 180px;
			width: 180px;
		}
		.el-upload-list--picture .el-upload-list__item-thumbnail {
			margin-left: -10px; 
		}
		.el-upload-dragger {
			width: 200px;
		}

	}
	.mt16 {
		margin-top: 16px;
		margin-right: 10px;
	}
	.el-dialog__header {
		border-bottom: 1px solid #ccc;
		padding: 20px;
	}
	.el-dialog__title {
		font-weight: 700;
	}
	.el-dialog__body {
		.el-form {
			.el-form-item {
				margin-bottom: 20px;
			}
		}
	}
	.el-dialog__footer {
		text-align: center;
		.el-button--warning {
			padding: 14px 50px;
			font-size: 14px;
			background-color: #c9984a;
			border-color: #c9984a;
			font-size: 18px;
		}
	}
	.edit-top {
        border-bottom: 1px solid #E8E8E8;
        .col-orange {
            color: #c9984a;
            padding: 15px 0px;
            margin-left: 15px;
            border-bottom: 2px solid #c9984a;
        }
        .edit-icon {
            font-size: 18px;
            color: #db9728;
			cursor: pointer;
			margin-right: 30px;
        }
    }
}
</style>
