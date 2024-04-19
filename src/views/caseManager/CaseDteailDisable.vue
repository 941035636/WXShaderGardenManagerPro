<template>
	<div id="caseDetailDisable">
		<v-head class="v-head"></v-head>
		<div class="content-part">
			<div class="border-style">
				<span class="content-top">案件详情
					<span class="return-list" @click="returnList"><i class="el-icon-refresh-left"></i>关闭当前页</span>
					<!-- <el-button type="primary" v-if="branchCode == 'JT0000'  && reportStatus != '05' && reportStatus != '06' && reportStatus != '07'" round class="fr mt16" style="background-color:#FA8C16;border-color:#FA8C16" @click="changeDialogVisible('dialogVisible')">转移服务人员</el-button>
					<el-button type="primary" v-if="branchCode == 'JT0000' && reportStatus == '05'" style="background-color:#FA8C16;border-color:#FA8C16"  round class="fr mt16" @click="dialogVisible1=true">转移审核人员</el-button> -->
				</span>
			</div>
			<div class="case-stop" v-if="caseStopInfo && caseStopInfo.flag">
				<el-form  :model="caseStopInfo" label-width="80px">
					<el-row>
						<i class="el-icon-video-pause fl"></i>
						<el-col :span="6">
							<el-form-item label="中止类型:" prop="type">
								{{caseStopInfo.typeName}}
							</el-form-item>
						</el-col>
						<el-col :span="6" >
							<el-form-item label="中止时间:" prop="startTime">
								{{caseStopInfo.startTime}}
							</el-form-item>
						</el-col>
						<el-col :span="14">
							<el-form-item label="中止原因:" prop="specificReasons">
								{{caseStopInfo.specificReasons}}
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<div id="contentcase">
				<div :class="[{'flexPo':  scrollTop > tabOffsetTop},'steps']">
					<Progress  @handlerGoAnchor="goAnchor" />
				</div>
				<div class="basicInfo">
					<CaseInfo :disabledBtn="true" ref="getCaseDetail" @insurancePolicy="insurancePolicy"></CaseInfo>	

					<CaseBaseInfo :disabledBtn="true"></CaseBaseInfo>	
					
					<CaseRevisit :disabledBtn="true"></CaseRevisit>

					<AccidentCasualty :disabledBtn="true"></AccidentCasualty>

					<ClaimInformationGuSun :disabledBtn="true"></ClaimInformationGuSun>

					<ClaimInformationPeiFu :disabledBtn="true"></ClaimInformationPeiFu>

					<PayeeInformation :disabledBtn="true"></PayeeInformation>

					<LitigationInformation :disabledBtn="true"></LitigationInformation>

					<ClaimFileInfo :disabledBtn="true"></ClaimFileInfo>
				</div>
			</div>
		</div>
		<el-dialog title="转移服务人员" :visible.sync="dialogVisible" width="30%" :before-close="handleCloseOverManagement">
			<el-form ref="management" :model="management" label-width="100px" :rules="rules">
				<el-form-item label="所在机构:">
					<span style="color:#FA8C16">{{baseInfo.baseInfo.jtBranchName}}</span>
				</el-form-item>
				
				<el-form-item label="服务人员:" prop="mediateName">
					<el-select size="mini" v-model="management.mediateName" filterable placeholder="请选择" @change="getPerson">
						<el-option v-for="(item,index) in customerInfo" :key="index" :label="item.name" :value="item" ></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="服务电话:">
					<el-input style="width:60%" v-model="management.servicerPhone"  size="mini" placeholder="服务电话"></el-input>
				</el-form-item>
			</el-form>
			<div class="btn mt20">
                <span class="btn-left" @click="dialogVisible = false">取消</span>
                <span class="btn-right" @click="submitChangServicePer('management')">确认提交</span>
            </div>
		</el-dialog>
		<el-dialog title="转移审核人员" :visible.sync="dialogVisible1" width="30%" :before-close="handleCloseOverManagement">
			<el-form ref="management" :model="management" label-width="100px" :rules="rules">
				<el-form-item label="所在机构:">
					<span style="color:#096DD9">{{baseInfo.baseInfo.jtBranchName}}</span>
				</el-form-item>
				<el-form-item label="转移说明:">
					<span style="color:#FA8C16">变更审核人员，将驳回当前申请，再由发起人重新选择审核人员</span>
				</el-form-item>
			</el-form>
			<div class="btn mt20">
                <span class="btn-left" @click="dialogVisible1 = false">取消</span>
                <span class="btn-right" @click="submitFun('management')">确认提交</span>
            </div>
		</el-dialog>
	</div>
</template>

<script>
import vHead from '../../../src/components/common/Header';
import store from '../../store/index'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import CaseBaseInfo from './components/CaseBaseInfo'
import CaseInfo from './components/CaseInfo'
import ClaimFileInfo from './components/ClaimFileInfo'
import CaseRevisit from './components/CaseRevisit'
import AccidentCasualty from './components/AccidentCasualty'
import ClaimInformationGuSun from './components/ClaimInformationGuSun'
import ClaimInformationPeiFu from './components/ClaimInformationPeiFu'
import PayeeInformation from './components/PayeeInformation'
import LitigationInformation from './components/LitigationInformation'
import ConfirmClaimAmount from './components/ConfirmClaimAmount'
import Litigation from './components/Litigation'
import AccountConfirm from './components/AccountConfirm'
import ApplicationClosure from './components/ApplicationClosure'
import ClosingAudit from './components/ClosingAudit'

import CaseService from '../../service/CaseService.js';
import ProductService from '../../service/ProductService.js';
import RelatedPolicyData from './js/RelatedPolicyData.js';
import moment from 'moment';
import Progress from './components/Progress'
export default {
	components:{
		AccidentCasualty,ConfirmClaimAmount,Litigation,AccountConfirm,ClaimInformationGuSun,PayeeInformation,LitigationInformation,
		ClaimFileInfo,ApplicationClosure,ClosingAudit,CaseRevisit,CaseBaseInfo,CaseInfo,ClaimInformationPeiFu,Progress,vHead
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
			branchCode:sessionStorage.getItem('branchCode'),
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
			management:{
				mediateBranchCode: "",	// 调处中心编码
				mediateBranchName: "", // 调处中心名称
				mediateName: "", // 调处中心调处员
				mediateCode: "",	// 调处中心调处员编码
				servicerPhone: "", //调处员电话
				servicerRemarks: "", //调处员备注
				email: ""
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
				holderName: [
					{required: true, message: '请输入投保人名称', trigger: 'blur'}
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
				mediateName: [
					{required: true, message: '请选择服务人员', trigger: 'change' }
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
				issueCompanyName:'',
				holderName:'',
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
			optionType:[],
			tabOffsetTop: 0,
      		scrollTop: 0,
		}
	},
	computed:{
        ...mapGetters([
			"reportStatus",
			"caseOverInfo",
			"caseStopInfo",
			"csaeDictionaries",
			"baseInfo"
        ]),
    },
	created(){
		// 是否从新案件跳转过来的
		if(this.$route.query.isNewCase){
			this.getCaseDetail();
		}
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
		this.$store.commit('updataCaseStopInfo',{});
		next();
	},
	methods: {
		handleCloseOver() {
			this.$refs['formOver'].resetFields();
			this.dialogVisible1 = false;
		},
		handleClose() {
			this.$refs['form'].resetFields();
			this.dialogVisible = false;
		},
		handleClose1() {
			this.dialogVisible1 = false;
		},
		handleCloseOverManagement(){
			this.$refs['management'].resetFields();
			this.dialogVisible = false;	
			this.dialogVisible1 = false
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
		getPerson(selVal){
			this.management.mediateName = selVal.name;
			this.management.mediateCode = selVal.userCode;
			this.management.servicerPhone = selVal.phone;
			this.management.servicerRemarks = selVal.remarks;
			this.management.email = selVal.email;
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
				branchCode: this.baseInfo.baseInfo.jtBranchCode,
				roleCode: process.env.ROOT_ROLECODE,
			}
			let res = await this.caseService.getCustomerByJt(data);
			if(res.code == '0000'){
				this.customerInfo = res.list;
				let servicesPerson = res.list.find(item=>item.name==this.baseInfo.baseInfo.servicerName)
				this.management.mediateName = this.baseInfo.baseInfo.servicerName
				this.management.servicerPhone = this.baseInfo.baseInfo.servicerPhone
				this.management.mediateCode = servicesPerson.userCode
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
			// this.formOver.caseNo = this.$route.query.caseNo;
			// this.formOver.reportNo = this.$route.query.reportNo;
			let form = {
				"auditOpinion":"02",
				"caseNo":this.$route.query.caseNo,
				"id":"",
				"reportNo":this.$route.query.reportNo,
				"reviewComments":"变更审核人员，回退"}
			let res = await this.caseService.caseAuditOver(form);
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
				this.handleClose1();
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
				if(this.caseOverInfo.holderName != this.insurance.holderName){
					this.$message({
						type: 'warning',
						message: '投保人名称不一致，请重新填写投保人名称'
					});
					return;
				}
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
					baseInfo : res.data.reportInfo, 
					auditAndApplyVOList : res.data.auditAndApplyVOList 
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
				if(res.data.caseTrackList && res.data.caseTrackList.length) {
					this.$store.commit('updataCaseTrackList',res.data.caseTrackList);
				} else {
					this.$store.commit('updataCaseTrackList',[]);
				}
				this.exhibition = false;
				if(!this.$route.query.isNewCase){
					this.reload();
				}
			}
		},
		// 关闭关联保单弹出窗
		close(){
			this.exhibition = false;
			this.valueAutoGZ = true;
			this.valueAuto = true
			this.data1 = []
			this.insurance = {
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
				issueCompanyName:'',
				holderName:'',
			};
			this.selecttdata = {
				elevatorSeatAddress:'',
				theElevatorType:'',
				value:'',
				value1:'',
				label1:'',
				value2:'',
				label2:'',
            }
		},
		/**
		 * 打开dialog弹出窗
		 * @param {string} dialogFlag 弹出框标识
		 */
		changeDialogVisible(dialogFlag = '',){
			this[dialogFlag] = true
			if(dialogFlag == 'dialogVisible'){
				this.getCustomerByJt()
				
			}
		},
		// 变更服务人员
		async submitChangServicePer(name){
			this.$refs[name].validate(async (valid) => {
				if (valid) {
					let data = {
						mediateBranchCode: this.baseInfo.baseInfo.jtBranchCode,
						mediateBranchName: this.baseInfo.baseInfo.jtBranchName,
						mediateCode: this.management.mediateCode,
						mediateName: this.management.mediateName,
						reportNos: this.$route.query.reportNo,
						mediatePhone: this.management.servicerPhone ? this.management.servicerPhone : " ",
						servicerRemarks: this.management.servicerRemarks ? this.management.servicerRemarks : " ",
						mediateEmail: this.management.email ? this.management.email : ""
					};
					let res = await this.caseService.transFormMediateSequip(data)
					if(res.code == '0000'){
						this.$message.success('变更成功')
						this.management = {
							mediateBranchCode: "",	// 调处中心编码
							mediateBranchName: "", // 调处中心名称
							mediateName: "", // 调处中心调处员
							mediateCode: "",	// 调处中心调处员编码
							servicerPhone: "", //调处员电话
							servicerRemarks: "", //调处员备注
							email: ""
						}
						this.handleCloseOverManagement()
						this.$router.push({path:'/case/pending'})
					}
					return false;
				} else {
					return false;
				}
			})
			
		},
		//返回列表页
		returnList() {
			// this.$router.push({
      //           path:'/case/pending',
      //       });
			window.close();
		},
		goAnchor(index){
			let select = "#mao"+(index+1)
			if(this.$el.querySelector(select)){
				this.$el.querySelector(select).scrollIntoView()
			}
		},
		handleScroll () {
			this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || document.scrollingElement.scrollTop || 0
			console.log(this.scrollTop)
		},
	},
	
}

</script>

<style lang="less">
#caseDetailDisable {
	background-color:#f2f1ef;
	margin-bottom: 80px;
	max-height: 100%;
	overflow: scroll;
	.v-head {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
	}
	.content-part {
		margin-top: 70px;
		margin-left: 20px;
		width: 100%;
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
		.case-stop {
			background-color: #fffaea;
			margin: 0px 0 20px;
			padding: 15px 20px 0px;
			.el-icon-video-pause {
				color: #ffa940;
				font-size: 34px;
				line-height: 56px;
				margin-right: 20px;
			}
		}
		.content-top {
			// font-size: 20px;
			// color:#333333;
			// display: inline-block;
			// height: 70px;
			// line-height: 70px;
			// background-color: #fff;
			// width: calc(100% - 22px);
			// padding-left: 22px ;
			// margin: 0px 0 20px;

			font-size: 20px;
			color:#333333;
			display: inline-block;
			height: 70px;
			line-height: 70px;
			background-color: #fff;
			width: calc(100% - 42px);
			padding-left: 22px ;
			margin: 0px 0 20px;
			.return-list {
				font-size: 16px;
				margin-left: 20px;
				color: #FA8C16;
				cursor: pointer;
			}
			
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
				line-height: 30px;
			}
			.el-form-item__content {
				font-size:14px;
				color:#333333;
				font-weight:500;
				line-height: 30px;
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
				margin-bottom: 18px;
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
            padding: 15px 0px;
            margin-left: 15px;
			line-height: 30px;
			vertical-align: middle;
			color: #666666;
			font-size: 18px;
			display: inline-block;
			color: #000;
			.col-orange-bor {
				border-left: 6px solid #FFC069;
				height: 100%;
				display: inline-block;
				width: 2px;
				height: 22px;
				margin-right: 10px;
				vertical-align: middle;
				margin-left: 20px;
			}
        }
        .edit-icon {
            font-size: 18px;
            color: #FA8C16;
			cursor: pointer;
			margin-right: 30px;
        }
	}
	.btn{
		text-align: right;
		width: 100%;
		.btn-left{
			display: inline-block;
			padding: 5px 20px;
			border: 1px solid #ccc;
			color: #ccc;
			background-color: #F5F5F5;
			border-radius: 20px;
			cursor: pointer;
			margin-right: 20px;
		}
		.btn-right{
			display: inline-block;
			padding: 5px 20px;
			color: #FFF;
			background-color: #FA8C16;
			border-radius: 20px;
			cursor: pointer;
		}
	}
	.flexPo{
		position: fixed;
		top: 70px;
	}
	.flex-top {
		position: fixed;
		top:160px;
	}
	.steps{
		width: 20%;
		float: left !important;
		margin: 0 auto;
	}
	.basicInfo{
		float: right !important;
		width: 80%;
		padding-bottom: 50px;
	}
	
}
</style>
