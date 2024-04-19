<template>
	<div id="PolicyInfo">
		<Title :titles="title"></Title>
		<div class="content mt20">
			<el-form :model="policy" class="demo-ruleForm" label-position="right" label-width="130px" :rules="rules" ref="policy">
				<el-form-item label="新保/续保：" prop="type">
					<el-radio-group v-model="policy.type" class="item1" @change="getPlocyType">
						<el-radio :label="1">新保</el-radio>
						<el-radio :label="2">续保</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="原保单号：" prop="renewalLastPolicyNo" v-if="policy.type == '2'">
					<el-input placeholder="请输入原保单号" v-model.trim="policy.renewalLastPolicyNo" class="item1" clearable></el-input>
					<!-- <el-button type="primary" size="small" @click="getRenewPolicy">选择原保单</el-button> -->
				</el-form-item>
				<el-form-item label="出单公司：" prop="inusureCompanyName" v-if="!productLHB"> 
					<el-select v-model.trim="policy.inusureCompanyName" placeholder="请选择" clearable class="item1" @focus="getInusureCompanys" @change="choice">
						<el-option v-for="(item,index) in inusureCompanys" :key="index" :label="item.name" :value="item.code"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="保单号：" prop="policyNo">
					<el-input placeholder="请输入保单号" v-model.trim="policy.policyNo" class="item1" clearable></el-input>
					<el-button size="small" type="primary" style="margin-left:8px;" @click="searchYG">查询</el-button>
					<el-button size="small" type="info" style="margin-left:8px;" @click="policy.policyNo = ''">重置</el-button>
					<span style="margin-left:8px;" class="col-org" v-if="showOrg">保单信息已回显</span>
				</el-form-item>
				<el-form-item label="">
					<span class="tip-style col-bg-gre" v-if="showTip"><i class="el-icon-warning"></i>  输入保单号，通过“业务结算平台”读取线下保单数据</span>
					<span class="tip-style col-bg-red" v-if="!showTip"><i class="el-icon-warning"></i>  未查询到保单信息，请手动录入</span>
				</el-form-item>
				<el-form-item label="">
					<el-switch v-model="policy.isHand" active-color="#13ce66" class="switch-style mr10" @change="changeHand"></el-switch><span class="col-blue">手动录入保单信息</span>
				</el-form-item>
				<el-form-item label="保险期间：" required>
					<div style="display:flex;">
						<el-form-item prop="startDate">
							<el-date-picker v-model="policy.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择起期" class="item2" @change="XZstartDate" :disabled="YEFlag"></el-date-picker> 起
						</el-form-item>
						<span style="padding:0 20px">至</span>
						<el-form-item prop="endDate">
							<el-date-picker v-model="policy.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择止期" class="item2" @change="XZendDate" :disabled="YEFlag"></el-date-picker> 止
						</el-form-item>
					</div>
				</el-form-item>
				<el-form-item label="签单日期："  prop="signedon">
					<el-date-picker v-model="policy.signedon" :pickerOptions="pickerOptions3" :disabled="YEFlag" type="date" value-format="yyyy-MM-dd" placeholder="选择签单日期" class="item1" @change="XZsignedon"></el-date-picker>
				</el-form-item>
				<el-form-item label="保费："  prop="premium">
					<el-input placeholder="请输入保费" v-model.trim="policy.premium" :disabled="YEFlag" class="item1" clearable></el-input>
				</el-form-item>
				<el-form-item label="保额："  prop="amount">
					<el-input placeholder="请输入保额（单位万元）" v-model.trim="policy.amount" class="item1" clearable>
						<template slot="append">万元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="保单影印件："  prop="urlId">
					<el-upload class="upload-demo" action="#" :file-list="fileList" :http-request="Upload" :limit="1" multiple :on-remove="handleRemove" accept=".pdf , .jpg , .png , .rar , .zip">
						<el-button icon="el-icon-upload2">上传</el-button>
					</el-upload>
				</el-form-item>
				<div v-if="policy.selectContract == 'Y'">
					<el-form-item label="关联合同：" prop="contract">
						<span class="choose-btn" @click="chooseContract">请选择合同</span>
					</el-form-item>
					<el-table ref="table" v-if="tableData.length != 0" :data="tableData" tooltip-effect="dark" border style="width: 80%;margin-left:130px" :header-cell-style="getRowClass1">
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
					<div class="tip-text mt10" style="margin-left:130px" v-if="showTipCont"><i class="el-icon-warning mr10"></i> 签单日期不在合同期间，请确认</div>
				</div>
				<el-form-item style="display:none;">
					<el-button type="primary" @click="submitForm5(policy)" round>保存并选择</el-button>
				</el-form-item>
			</el-form>
		</div>
    <el-dialog title="选择原保单" width="80%" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <Renew ref="chilRenew" :renewalData="renewalData" @handlerCancel="handlerAdCancel" @handlerSubmit="handlerAdSubmit"></Renew>
    </el-dialog>
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
		<ContractTemp :validDate="policy" ref="contractTemp"></ContractTemp>
	</div>
</template>

<script>
import moment from 'moment'
import Title from './Title'
import PolicyentryService from '../../../service/PolicyentryService'
import ResourcesService from "@/service/ResourcesService.js";
import store from "../../../store/index"
import Renew from "./Renew"
import Bus from "@/util/busEvent"
import ContractTemp from '../../businessProcessing/components/ContractTemp'
import {elevator} from '../../../server/accidenServer.js';
export default {
	name:'PolicyInfo',
	components:{
		Title,Renew,ContractTemp
	},
	store,
	data() {
		let self = this;
		var checkPremium = (rule, value, callback) => {
			let Reg = /^\d+(\.\d{0,2})?$/;
			if (!value) {
				return callback(new Error("请输入保费"));
			} else if (!Reg.test(value)) {
				callback(new Error("保费金额为最多保留两位小数的数字"));
			} else if (value > 1000000000) {
				callback(new Error("保费最多为10亿"));
			} else {
				callback();
			}
		};
		var checkAmount = (rule, value, callback) => {
			let Reg = /^\d+(\.\d{0,2})?$/;
			if (!value) {
				return callback(new Error("请输入保额"));
			} else if (!Reg.test(value)) {
				callback(new Error("保额金额为最多保留两位小数的数字"));
			} else if ((value*10000) < 1000000 || (value*10000) > 10000000000) {
				callback(new Error("保额最低为100万最多为100亿"));
			} else {
				callback();
			}
		};
		var checkPolicyNo = (rule, value, callback) => {
			var reg = /^[A-Za-z0-9]{1,30}$/;
			if (!value) {
				return callback(new Error("请输入保单号"));
			} else if (value === self.policy.renewalLastPolicyNo) {
				callback(new Error("保单号与原保单号不能相同"));
			} else if (!reg.test(value)) {
				callback(new Error("请输入1到30位字符、数字的保单号"));
			} else {
				callback();
			}
		};
		var checkPolicyNos = (rule, value, callback) => {
			var reg = /^[A-Za-z0-9]{1,30}$/;
			if (!value) {
				return callback(new Error("请输入原保单号"));
			} else if (value === self.policy.policyNo) {
				callback(new Error("原保单号与保单号不能相同"));
			}else if (!reg.test(value)) {
				callback(new Error("请输入1到30位字符、数字的原保单号"));
			} else {
				callback();
			}
		};
		let that = this;
		return {
			moment:moment,
			pickerOptions3:{
				disabledDate(time) {
				return time.getTime() > Date.now();
				},
			},
      		dialogFormVisible:false,
			PolicyentryService:new PolicyentryService(),
			ResourcesService:new ResourcesService(),
			Elevator:new elevator(),
			title:'保单信息',
			inusureCompanys:[],
			policy:{
				type:'',
				inusureCompanyName:'',
				inusureCompanyCode:'',
       			policyNo:'',
        		renewalLastPolicyNo:"", // 续保保单号
				startDate:'',
				endDate:'',
				signedon:'',
				premium:'',
				amount: '',
				urlId:[],
        		shareScale:'',
				dataList:[
					{
						policyCode:"",
						holdeName:"",
					}
				],
				selectContract:'',
				contract:'',
				isHand:false,
      		},
			renewalData:{
				threeInOneCode:"",
				insuredName:"",
				projectCode:"",
				ps:"100",
				pn:"1",
				issueStatus:"Y", 
				policyStatus:"00,02",
			},
			fileList:[],
			rules: {
				type: [{ required: true, message: '请选择新保/续保', trigger: 'change' }],
				inusureCompanyName: [{ required: true, message: "请选择出单公司", trigger: "change" }],
				policyNo: [{ required: true, validator: checkPolicyNo, trigger: "blur" }],
				renewalLastPolicyNo: [{ required: true, validator: checkPolicyNos, trigger: "blur" }],
				startDate: [{ type: 'string', required: true, message: '请选择起期', trigger: 'change' }],
				endDate: [{ type: 'string', required: true, message: '请选择止期', trigger: 'change' }],
				signedon: [{ type: 'string', required: true, message: '请选择签单日期', trigger: 'change' }],
				premium: [{ required: true, validator: checkPremium, trigger: "blur" }],
				amount: [{required: true, validator: checkAmount, trigger: "blur"}],
				urlId:[{required: true,message: '请上传保单影印件',trigger: 'blur'}],
				contract:[{required: true, message: '请选择合同', trigger: 'blur'} ],
			},
			tableData:[],
			showTipCont:false,
			contractInfo:{},
			showOrg:false,
			YEFlag: true,
			showTip:true,
			gridData: [],
			dialogTableVisible:false
		};
  	},
	  props: {
		productLHB:{}
	},
  // watch:{
  //   renewalData:{
  //     handler(curVal,oldVal){
  //       this.policy.renewalLastPolicyNo = "";
  //     },
  //     deep:true,
  //     immediate:true
  //   }
  // },
	computed: {
		
	},
	created() {
		Bus.$on('holdeNoBus',item=>{
			this.$set(this.renewalData, 'threeInOneCode', item)
		})
		Bus.$on('insuredsBus',item=>{
			this.$set(this.renewalData, 'insuredName', item)
		})
		Bus.$on('productBus',item=>{
			this.$set(this.renewalData, 'projectCode', item)
		})
		if(this.$route.query.flag == 'again'){
			this.getData();
		}
  	},
	methods: {
		getPlocyType(){
			console.log(this.policy.type)
			if(this.policy.type == "1"){
				this.policy.renewalLastPolicyNo = ""
			}
		},
		handlerAdCancel(){
			this.dialogFormVisible = false;  
		},
		handlerAdSubmit(val){
			this.policy.renewalLastPolicyNo = val.policyNo;
			this.policy.dataList[0].policyCode = val.policyNo;
			this.policy.dataList[0].holdeName = val.insuredName;
			this.dialogFormVisible = false;
		},
		getRenewPolicy(){
			this.dialogFormVisible = true;
			this.$nextTick(_=>{
				console.log(this.renewalData)
				this.$refs.chilRenew.renewal();
			})
		},
		getData(){
			console.log(this.$store.getters.policyInfo)
			this.policy = this.$store.getters.policyInfo;
			this.tableData = this.policy.table;
			this.fileList = this.policy.urlId;
			this.showOrg = this.policy.ywFlag
			if(this.showOrg) {
				this.YEFlag = true;
				this.showTip = true;
				this.policy.isHand = false;
			} 
			if(this.policy.isHand) {
				this.YEFlag = false;
			}
		},
		getInusureCompanys(){
			this.inusureCompanys = JSON.parse(sessionStorage.getItem('inusureCompanys'));
			if(!this.inusureCompanys){
				this.$message({
					message: "请先选择产品信息",
					type: "warning"
				});
			}
		},
		choice(value){
			this.inusureCompanys.find(item =>{
				if(
					item.code == value 
					// && item.shareScale
				){
					this.policy.inusureCompanyName = item.name
					this.policy.inusureCompanyCode = item.code
					this.policy.shareScale = item.shareScale
				}
			})
		},
		XZstartDate(val){
			this.policy.endDate = this.$stringHelper.isGetEndDate(val).endDate;
			this.policy.startDate = this.$stringHelper.isGetEndDate(val).startDate;
			this.$emit('changeStartDate',this.policy.startDate)
		},
		XZendDate(val){
			if(!this.policy.startDate){
				this.$message({
					message: '请先选择保险起期',
					type: 'warning'
				});
				this.policy.endDate = '';
				return;
			}
			if(this.policy.startDate>this.policy.endDate){
				this.$message({
					message: '保险止期应大于保险起期',
					type: 'warning'
				});
				this.policy.endDate = '';
				return;
			}
		},
		XZsignedon(val){
			this.$emit("changeIssueDate",this.policy.signedon)
		},
		async Upload(file){ // 图片上传 ResourcesService
			const isLt2M = file.file.size / 1024 / 1024 < 10;
			if (!isLt2M) {
				this.$message.error('上传影印件大小不能超过 10MB!');
				return;
			}
			let data = [file.file]
			const res = await this.ResourcesService.uploadFile('sequip-svc','epolicy',0,data);
			if(res.code == '0000'){
				let item = {
					fileId:res.list[0].fileId,
					name:file.file.name,
					uid:file.file.uid,
				}
				this.policy.urlId.push(item);
			}
		},
		handleRemove(file, fileList) {
			this.policy.urlId.forEach((item,index) =>{
				if(item.uid == file.uid){
					this.policy.urlId.splice(index,1)
				}
			})
		},
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return 'background:#f5f5f5;text-align:center;'
			} else {
				return ''
			}
		},
		submitForm5(policy){
			let data = {};
			this.$refs.policy.validate((valid) => {
				if (valid) {
					let validDate = moment(new Date(this.policy.signedon)).format('YYYY-MM-DD 00:00:00');
					if( this.policy.selectContract == 'Y' && this.tableData.length != 0 && ( validDate < this.tableData[0].startTime || validDate > this.tableData[0].endTime) ) {
						this.showTipCont = true;
						return false;
					} else {
						this.showTipCont = false;
						let obj = {
							table:this.tableData,
							ywFlag: this.showOrg
						}
						data = Object.assign(this.policy, obj);
					}
				} else {
					this.$message({
                        message: '保单信息填写不完整！',
                        type: 'warning'
                    });
					return false;
				}
			});
			return data;
        },
		chooseContract() {
			this.policy.validDate = moment(new Date(this.policy.signedon)).format('YYYY-MM-DD 00:00:00');
			this.$refs.contractTemp.initData(this.$parent.$refs.getholderInfo.form.holderName);
		},
		setContract(val) {
			this.contractInfo = val;
			this.$set(this.tableData, 0, val);
			this.policy.contract = '1';
		},
		getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #e8e8e8;color:#101010;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
		showTips(name1,name2) {
			this.gridData = [
				{
					name: name1,
					premium: name2,
					premiumColor: 'col-red1',
				}
			]
			this.dialogTableVisible = true;
			this.YEFlag = true;
			this.showTip = true;
			this.policy.isHand = false;
		},
		async searchYG() {
			let obj = {
				'policy_no': this.policy.policyNo,
				'systemcode': 5,
				'org_code': window.sessionStorage.getItem('branchCode'),
				'dept_code': window.sessionStorage.getItem('branchCode') == 'JT0000' ? 'JT0000507' : ''
			};
			let res = await this.Elevator.getPolicyNoDel(obj);
			if(res.code == '0000') {
				if(this.$parent.$refs.getholderInfo.form.holderName && this.$parent.$refs.getholderInfo.form.holderName != res.lccontTarget.applicant) {
					this.gridData = [
						{
							name: this.$parent.$refs.getholderInfo.form.holderName,
							premium: res.lccontTarget.applicant,
							premiumColor: 'col-red1',
						}
					]
					this.dialogTableVisible = true;
					this.YEFlag = true;
					this.showTip = true;
					this.policy.isHand = false;
				} else {
					this.$emit('changeStartDate',res.lccontTarget.startDate);
					this.$emit("changeIssueDate",moment(new Date(res.lccontTarget.pushTime)).add(-1, 'days').format('YYYY-MM-DD 00:00:00'));
					this.policy.startDate = res.lccontTarget.startDate
					this.policy.endDate = res.lccontTarget.endDate
					this.policy.signedon = moment(new Date(res.lccontTarget.pushTime)).add(-1, 'days').format('YYYY-MM-DD 00:00:00');
					this.policy.policyNo = res.lccontTarget.policyNo;
					this.policy.premium = res.lccontTarget.premium;
					this.policy.policyHolder = res.lccontTarget.applicant;
					this.YEFlag = true;
					this.showTip = true;
					this.showOrg = true;
					this.policy.isHand = false;
				}
			} else {
				this.showTip = false;
			}
		},
		changeHand() {
			this.YEFlag = !this.YEFlag;
			this.policy.startDate = '';
			this.policy.endDate = '';
			this.policy.signedon = '';
			this.policy.premium = '';
			this.showOrg = false;
		}
	}
};
</script>

<style lang="less">
#PolicyInfo{
	background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 10px 40px;
	margin-bottom: 0px;
	.content{
		.choose-btn {
			cursor: pointer;
			display: inline-block;
			width: 162px;
			background-color: #40a9ff;
			color: #ffffff;
			border-radius: 4px;
			font-size: 14px;
			text-align: center;
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
		.item1{
			width: 350px;
		}
		.item2{
			width: 230px;
			margin-right: 5px;
		}
		.upload-demo{
			width: 400px;
		}
		.el-upload--text{
			width: 168px;
			height: 40px;
			border: 1px solid #ECECEC;
			border-radius: 4px;
			text-align: center;
			line-height: 40px;
			.el-button{
				width: 100%;
				height: 100%;
				border: none;
				color: #6683D5;
				font-weight: 600;
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
	.col-blue {
		color: #1890ff;
	}
	.col-org {
		color: #fa8c16;
	}
	.col-red1 {
		color: #f5222d;
	}
}
</style>
