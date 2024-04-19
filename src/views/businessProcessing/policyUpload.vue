<template>
	<div class="policyUpload" id="policyUpload">
		<div class="title-text common-style">
			<span class="item1">保单补录</span>
			<div class="fr">
				<el-button  round size="medium" @click="empty">取 消</el-button>
				<el-button type="warning" round size="medium" @click="searchview('ruleForm')">确认提交</el-button>
			</div>
		</div>
		<div class="policy-info common-style">
			<el-form :model="ruleForm" label-width="140px" class="demo-ruleForm"> 
				<el-row>
					<el-col :span="8">
						<el-form-item label="投保单号：">
							<span>{{ruleForm.applicationFormCode}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="投保人名称：">
							<span>{{ruleForm.name}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="出单公司：">
							<span>{{ruleForm.insuranceCompany}}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div class="step-line common-style">
			<el-steps :active="stepNum" align-center>
				<el-step title="填写保单信息"></el-step>
				<el-step title="提交"></el-step>
			</el-steps>
		</div>
		<div class="common-style pd-content">
			<div class="title-text1">
				<span class="line"></span><span>填写保单信息</span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm mt20" size="small">
				<el-row>
					<el-col :span="10">
						<el-form-item label="保单号" prop="policyNo">
							<el-input v-model.trim="ruleForm.policyNo" class="item3" oncopy="return false" onpaste="return false" placeholder="请输入保单号"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="14">
						<el-button size="small" type="primary" style="margin-left:8px;" @click="searchYG">查询</el-button>
						<el-button size="small" type="info" style="margin-left:8px;" @click="ruleForm.policyNo = ''">重置</el-button>
						<span style="margin-left:8px;" class="col-org" v-if="showOrg">保单信息已回显</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="">
							<span class="tip-style col-bg-gre" v-if="showTip"><i class="el-icon-warning"></i>  输入保单号，通过“业务结算平台”读取线下保单数据</span>
							<span class="tip-style col-bg-red" v-if="!showTip"><i class="el-icon-warning"></i>  未查询到保单信息，请手动录入</span>
						</el-form-item>
					</el-col>
					<el-col :span="15">
						<el-form-item label="">
							<el-switch v-model="isHand" active-color="#13ce66" class="switch-style mr10" @change="changeHand"></el-switch><span class="col-blue">手动录入保单信息</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="确认保单号" prop="policyNos">
							<el-input v-model.trim="ruleForm.policyNos" class="item3" :disabled="YEFlag" oncopy="return false" onpaste="return false" placeholder="请输入保单号"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="保险期间" prop="startDate" style="display:inline-block;margin-right:20px">
							<el-date-picker v-model="ruleForm.startDate" type="date" :disabled="YEFlag" placeholder="选择起期" value-format="yyyy-MM-dd" class="item3" @change="changeSwitch"></el-date-picker><span>00:00:00 起</span>
						</el-form-item>
						至
						<el-form-item style="display:inline-block;margin-left:-120px;">
							<el-date-picker v-model="ruleForm.endDate" type="date" placeholder="选择止期" value-format="yyyy-MM-dd" :disabled="!isEditEnd || YEFlag" class="item3"></el-date-picker><span>23:59:59 止</span>
							<span style="margin:10px;">是否修改止期：</span><el-switch v-model="isEditEnd" :disabled="YEFlag" active-text="是" inactive-text="否" active-color="#13ce66" class="switch-style" @change="changeSwitch"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="签单日期" prop="validDate">
							<el-date-picker v-model="ruleForm.validDate" :picker-options="datePicker" :disabled="YEFlag" type="date" placeholder="选择签单日期"  value-format="yyyy-MM-dd 00:00:00" class="item3"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="20">
						<el-form-item label="保单影印件" prop="urlid">
							<el-upload class="upload-demo" drag action="#" :http-request="Upload" multiple accept=".doc , .docx ,  .pptx , .pdf , .rar , .zip , .jpg , .png ">
								<img v-if="ruleForm.urlid" :src="ruleForm.urlid" class="avatar1">
								<i class="el-icon-upload" v-if="!ruleForm.urlid"></i>
								<div class="el-upload__text" v-if="!ruleForm.urlid">将文件拖到此处，或<em>点击上传</em></div>
							</el-upload>
						</el-form-item>
					</el-col>
					<el-col :span="20" v-if="chooseCon">
						<el-form-item label="关联合同" prop="contract">
							<span class="choose-btn" @click="chooseContract">请选择合同</span>
						</el-form-item>
						<el-table ref="table" v-if="tableData.length != 0" :data="tableData" tooltip-effect="dark" border style="width: 80%;margin-left:140px" :header-cell-style="getRowClass1">
							<el-table-column label="合同编号" prop="code"></el-table-column>
							<el-table-column label="首签/续签">
								<template slot-scope="scope">
									<span>{{ scope.row.renew == 0 ? '首签' : scope.row.renew == 1 ? "续签" : '--' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="客户名称" prop="customerName"></el-table-column>
							<el-table-column label="合同期间">
								<template slot-scope="scope">
									<span>{{ moment(new Date(scope.row.startTime)).format("YYYY-MM-DD") }} 至{{ moment(new Date(scope.row.endTime)).format("YYYY-MM-DD") }}</span>
								</template>
							</el-table-column>
						</el-table>
						<div class="tip-text mt10" style="margin-left:140px" v-if="showTipCont"><i class="el-icon-warning mr10"></i> 签单日期不在合同期间，请确认</div>
					</el-col>
				</el-row>
				<Reason :multiData="ruleForm" ref="reason" :crossForm="ruleForm" :typeName="'CZ1'" :YEFlag="YEFlag"></Reason>
				<ContractTemp :validDate="ruleForm" ref="contractTemp"></ContractTemp>
			</el-form>
		</div>
		<el-dialog title="保单信息不一致" :visible.sync="dialogTableVisible">
			<el-table :data="gridData" :header-cell-style="getRowClass1" border class="mb10">
				<el-table-column label="大平台-保单">
					<template slot-scope="scope">
						<span>{{  scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="结算平台-保单">
					<template slot-scope="scope">
						<span :class="scope.row.premiumColor">{{ scope.row.premium }}</span>
					</template>
				</el-table-column>
			</el-table>
			<span class="col-red1">保单信息不一致。请手动输入</span>
		</el-dialog>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import ResourcesService from '../../service/ResourcesService';
import ContractService from '../../service/ContractService';
import ProductConfig from '../../service/ProductConfig.js';
import Reason from './components/Reason'
import ContractTemp from './components/ContractTemp'
import moment from 'moment';
export default {
	components: {
		Reason,ContractTemp
	},
	data() {
		var validatePass3 = (rule, value, callback) => {
			if (value == '') {
				callback(new Error('请再次输入保单号'));
			} else if (value != this.ruleForm.policyNo) {
				callback(new Error('两次输入的保单号不一致,请重新输入'));
			} else {
				callback();
			}
		};
		return {
			moment:moment,
			stepNum: 1,
			appDetailPro:{},
			Elevator:new elevator(),
			ResourcesService:new ResourcesService(),
			ProductConfig:new ProductConfig(),
			ContractService: new ContractService(),
			isEditEnd:false,
            ruleForm:{
				applicationFormCode:'',
				name:'',
				policyNo:'',
				validDate:'',
				startDate:"",
				endDate:'',
				urlid:'',
				contract:'',
				policyNos:'',
				incomeDate:'',
				proofReason:'',
				proofFile: [],
				proof:'',
				proofReasonOther:'',
			},
			rules:{
				policyNo:[{required: true, message: '请输入保单号', trigger: 'blur'} ],
				policyNos:[{required: true,validator: validatePass3,trigger: 'blur'} ],
				startDate:[{ type: 'string', required: true, message: '请选择时间', trigger: 'change' }],
				endDate:[{ type: 'string', required: true, message: '请选择时间', trigger: 'change' }],
				urlid:[{ required: true, message: '请上传保单', trigger: 'change'}],
				contract:[{required: true, message: '请选择合同', trigger: 'blur'} ],
			},
			id:'',
			disabled:false,
			YEFlag: true,
			showTip:true,
			datePicker:this.beginDate(),
			tableData:[],
			showTipCont:false,
			chooseCon: false,
			contractInfo:{},
			isHand:false,
			showOrg:false,
			gridData: [],
			dialogTableVisible: false
		}
	},
	computed:{
       
	},
	mounted() {
		
	},
	created(){
		this.getAppDetailPro();
		// this.getYGDate();
	},
	methods: {
		beginDate(){
            let self = this
            return {
                disabledDate(time){
                    let startDate = self.serviceData?self.serviceData.split(" ")[0]: new Date();
                    return time.getTime() >  new Date(startDate)
                }
            }
        },
		// 获取产品配置列表
		async getList(code){ 
			let obj = {
				pageNum:1,
				pageSize:1,
				productCode:code
			}
			let res = await this.ProductConfig.getList(obj);
			if(res.code == '0000' && res.list.length != 0){
				res.list[0].businessType == 1 ? this.chooseCon = false : res.list[0].businessType == 2 ? this.chooseCon = true : this.chooseCon = false;
			} else {
				this.chooseCon = false;
			}
		},
		async getAppDetailPro(){
			let data = {
				'appCode':this.$route.query.appCode
			}
			const parmes = await this.Elevator.getAppDetailPro(data);
			if(parmes.code == '0000'){
				await this.getList(parmes.data.productCode);
				this.appDetailPro = parmes.data;
				this.ruleForm.applicationFormCode = parmes.data.applicationFormCode;
				this.ruleForm.insuranceCompany = parmes.data.insuranceCompanyVOS.find(item => item.role2 == '01') ? parmes.data.insuranceCompanyVOS.find(item => item.role2 == '01').name : ''
				this.ruleForm.startDate = parmes.data.startDate;
				this.ruleForm.endDate = parmes.data.endDate;
				if(parmes.data.holder.corporation){
					this.ruleForm.name = parmes.data.holder.corporation.name;
				}else{
					this.ruleForm.name = parmes.data.holder.human.name;
				}
				let start = new Date();
				this.ruleForm.validDate = moment(start).format('YYYY-MM-DD 00:00:00');
			}
		},
		checkTime() {
			let start = new Date(this.ruleForm.startDate);
			let yearFull = start.getFullYear() + 2;
			let mouthFull = start.getMonth() +1;
			let dayFull = start.getDate();
			let middleData = moment(new Date(yearFull + '-' + mouthFull + '-' + dayFull) - 24*60*60*1000).format('YYYY-MM-DD');
			let end = moment(this.ruleForm.endDate).format('YYYY-MM-DD');
			return middleData >= end;
		},
		changeSwitch() {
			if(!this.isEditEnd) {
				let start = new Date(this.ruleForm.startDate);
				this.ruleForm.endDate = moment(new Date(start)).add(Number(1), 'y').subtract(1, 'd').format('YYYY-MM-DD');
			}
		},
		async Upload(file){ // 图片上传
			let data = [file.file]
			const res = await this.ResourcesService.uploadFile('sequip-svc','epolicy','0',data);
			if(res.code == '0000'){
				this.id = res.list[0].fileId;
				this.ruleForm.urlid = `${this.$apiUrl.DOWNLOAD_FILE}?fileId=${res.list[0].fileId}&applicationName=sequip-svc&businessTypeCode=epolicy&businessDataTag=${this.$route.query.appCode}&free=0`;
			}
		},
		empty(){
			this.$router.go(-1);
		},
		searchview(ruleForm){
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					if(moment(this.ruleForm.startDate).format('YYYY-MM-DD') > moment(this.ruleForm.endDate).format('YYYY-MM-DD')) {
						this.$message({
							message: '保险起期大于保险止期，请重新选择。',
							type: 'error'
						});
					}
					else if(this.checkTime()) {
						this.disabled = true;
						this.searchviews();
					} else {
						this.$message({
							message: '保险期间最大支持24个月（2年），请重新选择。',
							type: 'error'
						});
					}
					
				} else {
					return false;
				}
			});
		},
		async searchviews(){
			if(this.$refs.reason && !this.$refs.reason.sava()) {
				return;
			}
			if( this.chooseCon && this.tableData.length != 0 && (this.ruleForm.validDate < this.tableData[0].startTime || this.ruleForm.validDate > this.tableData[0].endTime) ) {
				this.showTipCont = true;
				return;
			}
			let data = {
				'userCode':window.sessionStorage.getItem('userCode'),
				'appCode':this.ruleForm.applicationFormCode,
				'policyNo':this.ruleForm.policyNo,
				'issueDate':this.ruleForm.validDate,
				'startDate':moment(this.ruleForm.startDate).format('YYYY-MM-DD 00:00:00'),
				'endDate':moment(this.ruleForm.endDate).format('YYYY-MM-DD 23:59:59'),
				'extendList': [],
				'attachments':[
					{
					'id':this.id,
					'type':'A002'	
					}
				]
			};
			let extendArr = [];
			if(this.YEFlag && this.appDetailPro.applicationType != '01') {
				data.ifSettlement = '1';
			} else {
				data.ifSettlement = '0';
			}
			let objLP = {
				"code": "S_A_000119",
				"value": window.sessionStorage.getItem('userName')//保单录入人
			};
			let objSP = {
				"code": "S_A_000120",
				"value": window.sessionStorage.getItem('userName')//保单审核人
			};
			extendArr.push(objLP)
			extendArr.push(objSP)
			if(this.ruleForm.incomeDate) {
				let obj = {
					"code": "S_A_000088",
					"value": this.ruleForm.incomeDate//收入确认时间点
				}
				extendArr.push(obj)
				let obj1 = {
					"code": "S_A_000089",
					"value": this.ruleForm.proofReason//收入确认佐证原因
				}
				extendArr.push(obj1)
				let obj3 = {
					"code": "S_A_000091",
					"value": this.ruleForm.proofReasonOther//佐证(其他)原因
				}
				extendArr.push(obj3);
			}
			if(this.ruleForm.proof) {
				let obj = {
					"code": "S_A_000087",
					"value": this.ruleForm.proof//倒签原因
				}
				extendArr.push(obj)
			}
			if(this.chooseCon) {
				let arr = [
					{
						"code":"S_A_000096",//委托合同编码
						"value":this.contractInfo.code
					},
					// {
					// 	"code":"S_A_000095",//佣金结算合同编码
					// 	"value":""
					// },
					{
						"code":"S_A_000097",//委托人编码
						"value":this.contractInfo.customerCode
					},{
						"code":"S_A_000098",//委托人名称
						"value":this.contractInfo.customerName
					},{
						"code":"S_A_000100",//合同起期
						"value":this.contractInfo.startTime
					},{
						"code":"S_A_000101",//合同止期
						"value":this.contractInfo.endTime
					}
				]
				if(this.contractInfo.renew || this.contractInfo.renew == 0) {
					let objCon = {
						"code":"S_A_000109",//合同止期
						"value":this.contractInfo.renew
					}
					arr.push(objCon)
				}
				extendArr = extendArr.concat(arr);
			}
			if(this.ruleForm.proofFile && this.ruleForm.proofFile.length != 0) {//佐证文件
				this.ruleForm.proofFile.map(item => {
					let obj =  {
						"id": item.id,
						"type": "P010"
					}
					data.attachments.push(obj)
				})
			}
			data.extendList = extendArr;
			const parmes = await this.Elevator.policyUpload(data);
			if(parmes.code == '0000'){
				let sendData = {
					applicationFormCode: this.ruleForm.applicationFormCode,
					customerCode: this.contractInfo.customerCode,
					customerName: this.contractInfo.customerName,
					contractEndDate: this.contractInfo.endTime,
					contractStartDate: this.contractInfo.startTime,
					contractCode: this.contractInfo.code
				};
				let resData = await this.ContractService.sendContract(sendData);
				if(this.YEFlag && this.appDetailPro.applicationType != '01') {
					let  paramsData = [
						{ 
							"claimbyid": window.sessionStorage.getItem('userCode'),   //-- 认领人id
							"systemcode": "5",        //-- 所属系统
							"operby": window.sessionStorage.getItem('userName'), // -- 操作人
							"orgcode": this.appDetailPro.branchCode,    //-- 机构编码
							"deptcode": this.appDetailPro.branchCode == 'JT0000' ? 'JT0000507' : '',//部门编码
							"policyno": this.ruleForm.policyNo,  //-- 保单号
							"operbyid": window.sessionStorage.getItem('userCode'),    //-- 操作人id
							"claimby": window.sessionStorage.getItem('userName')  //-- 认领人
						}
					];
					const parmesYW = await this.Elevator.policyComfirm(paramsData);
					if(parmesYW.executecode == '0'){
						this.$message.success("认领成功")
					}else{
						this.$message.error("认领失败，" + parmesYW.executenote)
					}
				}
				this.$message({
					message: '保单上传成功',
					type: 'success'
				});
				this.disabled = false;
				this.$router.go(-1);
			}else{
				this.disabled = false;
				return;
			}
		},
		async searchYG() {
			let obj = {
				'policy_no': this.ruleForm.policyNo,
				'systemcode': 5,
				'org_code': this.appDetailPro.branchCode,
				'dept_code': this.appDetailPro.branchCode == 'JT0000' ? 'JT0000507' : ''
			};
			let res = await this.Elevator.getPolicyNoDel(obj);
			if(res.code == '0000') {
				if(res.lccontTarget.premium == this.appDetailPro.actualPrem && res.lccontTarget.applicant == this.ruleForm.name) {
					this.ruleForm.startDate = res.lccontTarget.startDate
					this.ruleForm.endDate = res.lccontTarget.endDate
					this.ruleForm.validDate = moment(new Date(res.lccontTarget.pushTime)).add(-1, 'days').format('YYYY-MM-DD 00:00:00');
					this.ruleForm.policyNo = res.lccontTarget.policyNo
					this.ruleForm.policyNos = res.lccontTarget.policyNo
					this.YEFlag = true;
					this.showTip = true;
					this.showOrg = true;
					this.isHand = false;
				} else {
					this.gridData = [
						{
							name: this.ruleForm.name,
							premium: res.lccontTarget.applicant,
							premiumColor: res.lccontTarget.applicant == this.ruleForm.name ? '' : 'col-red1',
						},
						{
							name: '￥' + this.appDetailPro.actualPrem.toFixed(2),
							premium: '￥' + res.lccontTarget.premium.toFixed(2),
							premiumColor: res.lccontTarget.premium == this.appDetailPro.actualPrem ? '' : 'col-red1'
						}
					]
					this.dialogTableVisible = true;
					// this.$message({
					// 	message: '特设保保费为' + this.appDetailPro.actualPrem + '；业务结算平台保费为' + res.lccontTarget.premium +'；不一致，请核实',
					// 	type: 'error'
					// });
					this.YEFlag = true;
					this.showTip = true;
				}
			} else {
				this.YEFlag = true;
				this.showTip = false;
			}
		},
		chooseContract() {
			this.$refs.contractTemp.initData(this.ruleForm.name);
		},
		setContract(val) {
			this.contractInfo = val;
			this.$set(this.tableData, 0, val);
			this.ruleForm.contract = '1';
		},
		getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #e8e8e8;color:#101010;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
		changeHand() {
			this.YEFlag = !this.YEFlag
			this.ruleForm.policyNos = '';
			this.ruleForm.startDate = '';
			this.ruleForm.endDate = '';
			this.ruleForm.validDate = '';
			this.showOrg = false;
		}
	},
}
</script>

<style lang="less">
#policyUpload{
	padding-top: 10px;
	padding-bottom: 80px;
	background-color: #FAFAFA;
	.choose-btn {
		cursor: pointer;
		display: inline-block;
		width: 162px;
		height: 32px;
		background-color: #40a9ff;
		color: #ffffff;
		border-radius: 4px;
		font-size: 14px;
		text-align: center;
	}
	.common-style {
		margin: 10px;
		background-color: #ffffff;
		border-radius: 5px;
	}
	.pd20 {
		padding: 20px;
	}
	.title-text {
		height: 50px;
		line-height: 50px;
		font-size: 20px;
		color: #101010;
		padding: 5px 10px;
	}
	.policy-info {
		padding: 20px 10px 10px 10px;
		.el-form-item {
			margin-bottom: 0px;
		}
	}
	.step-line {
		padding: 25px;
		.el-step.is-horizontal .el-step__line {
			top: 20px;
		}
		.el-step__icon {
			width: 40px;
			height: 40px;
		}
		.el-step__title.is-process {
			font-weight: 500;
			color: #C0C4CC;
		}
		.is-finish .el-step__icon.is-text {
			border-width: 1px;
			background-color: #e6f7ff;
		}
		.is-wait .el-step__icon.is-text,.is-process .el-step__icon.is-text {
			border-width: 1px;
			background-color: #f7f7f7;
		}
		.el-step__head.is-process {
			color: #C0C4CC;
			border-color: #C0C4CC;
		}
		.el-step__head.is-finish {
			color: #096dd9;
			border-color:#096dd9;
		}
		.el-step__title.is-finish {
			color:#101010;
		}
	}
	.pd-content {
		padding: 20px;
		.title-text1 {
			font-size: 20px;
			color: #101010;
			padding: 20px 0px;
			border-bottom: 1px solid #ccc;
			.line {
				border-left: 5px solid #ffc069;
				margin-right: 20px;
				margin-left: 20px;
			}
			.all-delete {
				cursor: pointer;
				font-size: 18px;
				color: #ff7150;
				font-weight: 400;
			}
			.ts-download{
				display: inline-block;
				cursor: pointer;
				span{
					vertical-align: middle;
				}
			}
		}
		.tip-style {
			display: inline-block;
			padding: 3px 20px 3px 10px;
			border-radius: 4px;
		}
		.col-bg-red {
			color: #ff7875;
			background-color: #fff1f0;
			
		}
		.col-bg-gre {
			color: #34c697;
			background-color: #dbf9ef;
		}
		.ml50 {
			margin-left: 50px;
		}
		.col-blue {
			color: #1890ff;
			
		}
		.col-org {
			color: #fa8c16;
		}
		.bor-top {
			border-top: 1px solid #f8f8f8;
			padding-top: 30px;
			.content-head {
				display: flex;
				border: 1px solid #ccc;
				margin: 20px 400px 0px 60px;
				li {
					padding: 5px;
					line-height: 40px;
				}
				.li-one {
					width: 240px;
					border-right: 1px solid #ccc;
					box-sizing: border-box;
					padding-left: 5px;
				}
				.li-three {
					box-sizing: border-box;
					padding-left: 5px;
					padding-top: 8px;
				}
				.el-form-item {
					margin-bottom: 0;
					.el-form-item__content {
						margin-left: 0 !important;
					}
				}
			}
			.no-bor-top {
				border-top: none;
				margin-top: 0;
			}
		}
		.no-top-bor {
			border-top: none;
		}
		.tip-text {
			width: 278px;
			height: 40px;
			background-color: #fff1f0;
			color: #ff7875;
			border-radius: 6px;
			font-size: 14px;
			padding: 0px;
			text-align: center;
			line-height: 40px;
		}
	}
	.no-data {
		font-weight: 400;
		font-size: 18px;
		color:#919191;
		letter-spacing: 0px;
		line-height: 30px;
		text-decoration: none;
		text-align: center;
	}
	.col-red {
		color: #ff7150;
	}
	.col-red1 {
		color: #f5222d;
	}
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
