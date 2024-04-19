<template>
	<div id="caseDetail">
		<v-head class="v-head"></v-head>
		<div class="content-part">
			<div class="border-style">
				<span class="content-top">案件详情
					<span class="return-list" @click="returnList"><i class="el-icon-refresh-left"></i>关闭当前页</span>
					<el-button type="primary" v-if="reportStatus == '04'" round class="fr mt16" @click="overCase(false)">无效结案申请</el-button>
					<el-button type="primary" v-if="reportStatus == '04' && showApplyBtn" round class="fr mt16" @click="overCase(true)">结案申请</el-button>
					<el-button type="primary" v-if="reportStatus == '05' && (!caseStopInfo || !caseStopInfo.flag)" round class="fr mt16" @click="overCaseAudit">结案审核</el-button>
					<el-button type="warning" v-if="reportStatus != '05' && (!caseStopInfo || !caseStopInfo.flag)" round class="fr mt16" @click="stopCase">案件中止</el-button>
				</span>
				<!-- <el-button type="primary" v-if="!caseOverInfo.hasPolicy" round class="fr mt16" @click="insurancePolicy">关联保单</el-button> -->
			</div>
			<!-- 案件中止 -->
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
				<el-button type="primary" style="margin-top:-70px" round class="fr" @click="relieveStop">解除中止</el-button>
			</div>
			<div id="contentcase">
				<div :class="[{'flexPo':  scrollTop > tabOffsetTop},'steps']">
					<Progress  @handlerGoAnchor="goAnchor" />
				</div>
				<div class="basicInfo">
					<!-- 展示已认领保险公司案件信息 -->
					<PushInsuranceDetails></PushInsuranceDetails>

					<CaseInfo ref="getCaseDetail" @insurancePolicy="insurancePolicy"></CaseInfo>	

					<CaseBaseInfo @getCaseDetail="getCaseDetail" @changeBtn="changeBtn"></CaseBaseInfo>	
					
					<CaseRevisit @getCaseDetail="getCaseDetail"></CaseRevisit>

					<AccidentCasualty @getCaseDetail="getCaseDetail" @changeBtn="changeBtn"></AccidentCasualty>

					<ClaimInformationGuSun @getCaseDetail="getCaseDetail" @changeBtn="changeBtn"></ClaimInformationGuSun>

					<ClaimInformationPeiFu @getCaseDetail="getCaseDetail" @changeBtn="changeBtn"></ClaimInformationPeiFu>

					<PayeeInformation></PayeeInformation>

					<LitigationInformation></LitigationInformation>

					<ClaimFileInfo @getCaseDetail="getCaseDetail" @changeBtn="changeBtn"></ClaimFileInfo>
				</div>
			</div>
		</div>
		<el-dialog title="结案申请" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
			<PushInsuranceCloseCase></PushInsuranceCloseCase>
			<el-form ref="form" :model="form" label-width="120px" :rules="rules">
				<el-form-item label="结案类型:" prop="settleType">
					<el-radio-group v-model="form.settleType">
						<el-radio :label="item.code" v-for="(item,index) in caseSettleType" :key="index">{{item.name}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="form.settleType == '01'" label="赔付时间:" prop="payForTime">
					<el-date-picker size="mini" v-model="form.payForTime" :picker-options="dealDateStartOptions" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
				</el-form-item>
				<el-form-item v-if="form.settleType == '02'" label="销案时间:" prop="cancelCaseTime">
					<el-date-picker size="mini" v-model="form.cancelCaseTime" :picker-options="dealDateStartOptions" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
				</el-form-item>
				<el-form-item v-if="form.settleType == '03'" label="拒赔时间:" prop="disAgreeCaseTime">
					<el-date-picker size="mini" v-model="form.disAgreeCaseTime" :picker-options="dealDateStartOptions" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
				</el-form-item>
				<el-form-item label="指定审核人员:" prop="closeAuditorCode">
					<el-select size="mini" v-model="form.closeAuditorCode" placeholder="请选择审核人员"  @change="setInfoNames()">
						<el-option v-for="(item,index) in customerInfo" :key="index" 
						:label="item.branchNameAndName" :value="item.userCode"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="form.settleType != '05' ? '结案说明:' : '备注说明'" prop="settlementContent">
					<el-input type="textarea" v-model="form.settlementContent"></el-input>
				</el-form-item>
			</el-form>
			<div class="btn mt20">
                <span class="btn-left" @click="dialogVisible = false">取消</span>
                <span class="btn-right" @click="submitOver('form')">确认提交</span>
            </div>
		</el-dialog>
		<el-dialog title="结案审核" :visible.sync="dialogVisible1" width="30%" :before-close="handleCloseOver">
			<el-form ref="formOver" :model="formOver" label-width="100px" :rules="rules">
				<el-form-item label="审核类型:" prop="auditOpinion">
					<el-select size="mini" v-model="formOver.auditOpinion" placeholder="请选择">
						<el-option label="通过" value="01"></el-option>
						<el-option label="驳回" value="02"></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="审核说明:" prop="reviewComments">
					<el-input size="mini" type="textarea" v-model="formOver.reviewComments"></el-input>
				</el-form-item>
			</el-form>
			<div class="btn mt20">
                <span class="btn-left" @click="dialogVisible1 = false">取消</span>
                <span class="btn-right" @click="submit('formOver')">确认提交</span>
            </div>
		</el-dialog>
		<el-dialog title="案件中止" :visible.sync="dialogVisible2" width="30%" :before-close="handleStopClose" :close-on-click-modal='false'>
			<el-form ref="formStop" :model="formStop" label-width="100px" :rules="rules">
				<el-form-item label="中止类型:" prop="type">
					<el-radio-group v-model="formStop.type">
						<el-radio v-for="(item,index) in caseStopList" :label="item.value" :key="index">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="中止时间:" prop="startTime">
					<el-date-picker size="mini" type="datetime" v-model="formStop.startTime" :picker-options="dealDateStartOptions" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间" />
				</el-form-item>
				
				<el-form-item label="原因说明:" prop="specificReasons">
					<el-input size="mini" type="textarea" :rows="3" v-model="formStop.specificReasons" placeholder="请输入原因说明"></el-input>
				</el-form-item>
			</el-form>
			<div class="btn mt20">
                <span class="btn-left" @click="dialogVisible2 = false">取消</span>
                <span class="btn-right" @click="submitStop('formStop')">确认提交</span>
            </div>
		</el-dialog>
		<!-- 关联保单 -->
		<RelationPolicy ref="RelationPolicy" @successCallback="successCallback"></RelationPolicy>
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
import Progress from './components/Progress'
import RelationPolicy from './components/RelationPolicy'
import PushInsuranceDetails from './components/PushInsuranceDetails'
import PushInsuranceCloseCase from './components/PushInsuranceCloseCase.vue';

import CaseService from '../../service/CaseService.js';
import ProductService from '../../service/ProductService.js';
import RelatedPolicyData from './js/RelatedPolicyData.js';
import jiaZhengUserType from '../../../static/data/jiaZhengUserType.json';
import caseSettleType from '../../../static/data/caseSettleType.json'
import Claim from '@/service/claim'
import moment from 'moment';
export default {
	components:{
		AccidentCasualty,ConfirmClaimAmount,Litigation,AccountConfirm,ClaimInformationGuSun,PayeeInformation,LitigationInformation,
		ClaimFileInfo,ApplicationClosure,ClosingAudit,CaseRevisit,CaseBaseInfo,CaseInfo,ClaimInformationPeiFu,vHead,Progress,RelationPolicy,
		PushInsuranceDetails,PushInsuranceCloseCase
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
			caseSettleType: caseSettleType.data,
			formStop: {
				channel:'sequip',
				specificReasons: '',
				startTime: '',
				state: 1,//1为中止，0为解除中止
				type:'',
				caseNo: this.$route.query.caseNo,
				reportNo: this.$route.query.reportNo,
				caseId: this.$route.query.caseId,
			},
			customerInfo:[],
			caseService: new CaseService(),
			productService: new ProductService(),
			RelatedPolicyData:new RelatedPolicyData(),
			claim:new Claim(),
			formOver:{
				auditOpinion: "",
				caseNo: this.$route.query.caseNo,
				id: "",
				reportNo: this.$route.query.reportNo,
				reviewComments: ""
			},
			dialogVisible:false,
			dialogVisible1:false,
			dialogVisible2:false,
			form:{
				caseNo: "",
				id: "",
				reportNo: "",
				closeAuditorCode:"",
				closeAuditorName:"",
				settleType:"",
				settlementContent:"",
				userCode:window.sessionStorage.getItem('userCode'),
				userName:window.sessionStorage.getItem('userName'),
				cancelCaseTime:'',
				disAgreeCaseTime:'',
				payForTime:'',
				currencyCode:'CNY',
				currencyName:'人民币',
			},
			rules:{
				settleType: [
					{required: true, message: '请选择结案类型', trigger: 'change'}
				],
				settlementContent: [
					{required: true, message: '请输入结案说明', trigger: 'change'}
				],
				payForTime: [
					{required: true, message: '请选择赔付时间', trigger: 'change'}
				],
				cancelCaseTime: [
					{required: true, message: '请选择销案时间', trigger: 'change'}
				],
				disAgreeCaseTime: [
					{required: true, message: '请选择拒赔时间', trigger: 'change'}
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
				holderOrInsuredName: [
					{required: true, message: '请输入被保人名称', trigger: 'blur'}
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
				productName: [
					{required: true, message: '产品名称不能为空', trigger: 'change' }
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
				postName: [
					{required: true, message: '请选择岗位类型', trigger: 'change' }
				],
				type: [
					{required: true, message: '请选择中止类型', trigger: 'change' }
				],
				startTime: [
					{required: true, message: '请选择时间', trigger: 'change' }
				],
				specificReasons: [
					{required: true, message: '请输入原因说明', trigger: 'blur' }
				],
			},
			caseStopList:[],
			optionType:[],
			userTypeList:[],
			dealDateStartOptions:this.beginDate(),
			showApplyBtn:false,
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
			"caseTrackList",
			"pushInsuranceData",
        ]),
    },
	created(){
		this.userTypeList = jiaZhengUserType.userTypeList
		this.caseStopList = this.csaeDictionaries.pauseType;
	},
	mounted() {
		let tabEle = document.getElementById('contentcase')
		this.tabOffsetTop = tabEle.offsetTop
		window.addEventListener('scroll', this.handleScroll)
		this.changeBtn()
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
		beginDate(){
            return {
                disabledDate(time){
                    return time.getTime() >  new Date()
                }
            }
		},
		changeBtn() {
			console.log(this.caseTrackList,'-');
			if(this.caseTrackList.find(item=>  item.status == '12' )) {
				this.showApplyBtn = true
			} else {
				this.showApplyBtn = false
			}
		},
		relieveStop() {
			this.$confirm('此操作将“解除中止”, 是否继续?', '解除中止', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.relieveStopFun();
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消'
				});          
			});
		},
		async relieveStopFun() {
			let res = await this.caseService.relieveStop(this.caseStopInfo.pauseApplyId);
			if(res.code == '0000') {
				this.$message({
					type: 'success',
					message: '解除中止成功!'
				});
				try {
					await this.caseService.caseAsync([this.formStop.reportNo]);
				} catch (error) {
					
				}
				let caseStopInfo = {
					typeName : '',
					startTime : '',
					specificReasons : '',
					flag: false
				}
				this.$store.commit('updataCaseStopInfo',caseStopInfo);
			}
		},
		stopCase() {
			this.formStop = {
				"channel":"sequip",
				"specificReasons": "",
				"startTime": "",
				"state": 1,
				"type": '',
				"caseNo": this.$route.query.caseNo,
				"reportNo": this.$route.query.reportNo,
				"caseId": this.$route.query.caseId,
			};
			this.dialogVisible2 = true;
		},
		async overCase(flag) {
			if(flag) {
				const res = await this.caseService.cateFilequery(this.$route.query.reportNo);
				if(res.code == '0000'){
					if(!res.data.find(item => item.typeId == '07') && !res.data.find(item => item.typeId == '08') && !res.data.find(item => item.typeId == '09')){
						this.$message({
							message: '根据《保险经纪机构基本服务标准》的监管要求，在取得客户或保险公司确认赔付、拒赔、撤销的书面文件后，请上传相关结案证明文件，方可提交案件结案申请。',
							type: 'error'
						});
						return
					}
					if(this.caseOverInfo.isTransferringTheCase == '1'){
						this.getCustomerByJt();
						this.caseSettleType = caseSettleType.data1;
						this.form.settleType = '01';
						this.dialogVisible = true;
						if(this.pushInsuranceData && this.pushInsuranceData.isPushInsuranceFlag){
							this.form.payForTime = this.pushInsuranceData.pushInsuranceDetails.casePayTime
							if(this.pushInsuranceData.pushInsuranceDetails.settleType === '01' || this.pushInsuranceData.pushInsuranceDetails.settleType === '02') {
								this.form.settleType = this.pushInsuranceData.pushInsuranceDetails.settleType
							} else if(this.pushInsuranceData.pushInsuranceDetails.settleType === '04') {
								this.form.settleType = '01'
							} else {
								this.form.settleType = ''
							}
						}
					}else{
						this.$message({
							message: '请先联系客服转报案',
							type: 'warning'
						});
						return;
					}
				}
			} else {
				this.getCustomerByJt();
				this.caseSettleType = caseSettleType.data2;
				this.form.settleType = '05';
				this.dialogVisible = true;
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
		handleStopClose() {
			this.$refs['formStop'].resetFields();
			this.dialogVisible2 = false;
		},
		submitOver(name) {//结案申请提交结案申请提交
			this.$refs[name].validate((valid) => {
				if (valid) {
					if(
						(
							this.caseTrackList.find(item => item.status == '08') &&
							this.caseTrackList.find(item=> item.status == '09' ) &&
							this.caseTrackList.find(item=>  item.status == '10' ) &&
							this.caseTrackList.find(item=>  item.status == '11' ) &&
							this.caseTrackList.find(item=>  item.status == '12' ) && 
							this.form.settleType == '01' 
						) ||
						this.form.settleType == '02' || this.form.settleType == '05' || this.form.settleType == '03'
					) {
						this.submitOverFun();
					} else {
						this.$message({
							message: '不满足赔付结案申请条件，请确认：案件基本信息、事故经过、索赔信息、赔付信息是否已填写。',
							type: 'error'
						});
					}
				} else {
					return false;
				}
			});	
		},
		async submitOverFun() {
			this.form.caseNo = this.$route.query.caseNo;
			this.form.reportNo = this.$route.query.reportNo;
			
			if (this.form.settleType == '01') {
				this.form.cancelCaseTime = ''
				this.form.disAgreeCaseTime = ''
			}else if (this.form.settleType == '02') {
				this.form.payForTime = ''
				this.form.disAgreeCaseTime = ''
			} else if (this.form.settleType == '03') {
				this.form.cancelCaseTime = ''
				this.form.payForTime = ''
			}
			
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
				} else if(this.form.settleType == "05"){
					this.$message({
						message: '无效结案申请成功',
						type: 'success'
					});
					this.$store.commit('updataReportStatus',"05");
				} else if(this.form.settleType == "03"){
					this.$message({
						message: '拒赔申请成功',
						type: 'success'
					});
					this.$store.commit('updataReportStatus',"07");
				}else{
					this.$message({
						message: '销案申请成功',
						type: 'success'
					});
					this.$store.commit('updataReportStatus',"07");
				}
				try {
					await this.caseService.caseAsync([this.formStop.reportNo]);
				} catch (error) {
					
				}
				this.$refs.getCaseDetail.getCaseDetail();
				this.getCaseDetail();
				this.handleClose();
			}
		},
		// 通过分支机构查询客户经理
		async getCustomerByJt(){
			this.customerInfo = [];
			let data = {
				branchCode: sessionStorage.getItem('authDataInfo'),
				roleCode: process.env.ROOT_CASE_CLOSED_CODE,
			}
			let res = await this.caseService.getCustomerByJt(data);
			if(res.code == '0000'){
				res.list.forEach(item => {
					if(item.userCode != window.sessionStorage.getItem('userCode')) {
						this.customerInfo.push({...item,branchNameAndName:`${item.name}(${item.branchName})`})
					}
				})
			}
		},
		submitStop(name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					this.stopCaseFun();
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		async stopCaseFun() {
			let res = await this.caseService.stopCase(this.formStop);
			if(res.code == '0000'){
				this.$message({
					message: '案件中止成功！',
					type: 'success'
				});
				try {
					await this.caseService.caseAsync([this.formStop.reportNo]);
				} catch (error) {
					
				}
				let caseStopInfo = {
					pauseApplyId: res.data,
					typeName: this.caseStopList.find(item => item.value == this.formStop.type).label,
					startTime: this.formStop.startTime,
					specificReasons: this.formStop.specificReasons,
					flag: true
				}
				this.$store.commit('updataCaseStopInfo',caseStopInfo);
				this.handleStopClose();
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
					if(this.pushInsuranceData && this.pushInsuranceData.isPushInsuranceFlag) {
						this.updateBsJtCaseStatus()
						this.updateCaseStatus()
					}
				}else{
					this.$message({
						message: '已驳回',
						type: 'success'
					});
				}
				try {
					await this.caseService.caseAsync([this.formStop.reportNo]);
				} catch (error) {
					
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
		// 打开关联保单弹出框
		insurancePolicy(){
			this.$refs.RelationPolicy.openInit({...this.caseOverInfo,caseNo:this.$route.query.caseNo})
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
				this.reload();
			}
		},
		//返回列表页
		returnList() {
			window.close()
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
		// 关联保单成功之后回调
		async successCallback(val){
			await this.getCaseDetail()
			// 如果险种类型不一致，需要重新刷下路由的险种标识
			if(this.$route.query.productCategory1 !== val.riskType) {
				this.$router.push({
					path:this.$route.path,
					query:{
						...this.$route.query,
						productCategory1:val.riskType
					}
				})
			}
			
		},
		// 修改案件关联表引用状态
        async updateBsJtCaseStatus(){
			let referenceStatus = ''
			if(this.pushInsuranceData.pushInsuranceDetails.referenceStatus == '3') {
				referenceStatus = '2'
			} else if (this.pushInsuranceData.pushInsuranceDetails.referenceStatus == '5') {
				referenceStatus = '3'
			}
            let data = {
                id:this.pushInsuranceData.pushInsuranceDetails.baosiJiangtaiAssociationId,
                referenceStatus:'2', // 引用类型（1.已认领、2.已认领引用结案、3.已关联引用结案、4.引用结案）
            }
            await this.claim.updateBsJtCaseStatus(data)
        },
		// 修改对接案件引用状态
        async updateCaseStatus(){
			let referenceStatus = ''
			if(this.pushInsuranceData.pushInsuranceDetails.referenceStatus == '3') {
				referenceStatus = '4'
			} else if (this.pushInsuranceData.pushInsuranceDetails.referenceStatus == '5') {
				referenceStatus = '6'
			}
            let data = {
                id:this.pushInsuranceData.pushInsuranceDetails.id,
                referenceOperator:window.sessionStorage.getItem('userCode'),
                referenceOperatorName:window.sessionStorage.getItem('userName'),
                referenceStatus:'4',// 引用状态：1.未认领、2.引用结案、3.已认领、4.已认领引用结案、5.已关联、6.已关联引用结案
            }
            await this.claim.updateCaseStatus(data)
        },


	},
	
}

</script>

<style lang="less">
#caseDetail {
	width: 100%;
	background-color:#f2f1ef;
	padding-bottom: 80px;
	max-height: 100%;
	overflow: scroll;
	.v-head {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
	}
	.content-part {
		width: 100%;
		margin-top: 70px;
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
				font-size: 16px;
				color: #db9728;
				cursor: pointer;
			}
		}
		.case-stop {
			background-color: #fffaea;
			margin: 0px 0 20px;
			padding: 15px 10px 0px 20px;
			.el-icon-video-pause {
				color: #ffa940;
				font-size: 34px;
				line-height: 56px;
				margin-right: 20px;
			}
		}
		.content-top {
			font-size: 20px;
			color:#333333;
			display: inline-block;
			height: 70px;
			line-height: 70px;
			background-color: #fff;
			width: calc(100% - 22px);
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
		margin-top: 12px;
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
			color: #000;
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
