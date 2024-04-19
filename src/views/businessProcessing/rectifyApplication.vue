<template>
	<div id="ApplicationCorrection">
		<div class="query-code" v-if="!this.$route.query.id">
			<Title :titles="title1"></Title>
			<el-form ref="form" :model="form" label-width="150px">
				 <el-form-item label="冲正单类型：">
					<span v-for="(item,index) in options1" :key="index" @click="toSelect(item.value)" :class="form.orderType == item.value?'code-class1':'code-class'">{{item.label}}</span>
				</el-form-item>
				<el-form-item label="冲正单号：">
					<el-input placeholder="请输入保单号/批单号" prefix-icon="el-icon-search" v-model.trim="form.correctNo" class="code-item2" :disabled="show"></el-input>
					<el-button type="primary" @click="querySearch">查询</el-button>
					<el-button @click="empty" v-if="show" style="background-color: #E9E9E9;">清空查询结果</el-button>
				</el-form-item>
			</el-form>
		</div>
        <div class="content" v-if="this.$route.query.id">
            <Title :titles="title1"></Title>
            <el-row type="flex" class="row-bg">
				<el-col :span="9"><div style="display:flex;">
					<span class="content-item5">冲正单类型：</span>
					<span class="content-item3" v-if="form.orderType == '1'">保单</span>
					<span class="content-item3" v-else>批单</span>
				</div></el-col>
				<el-col :span="9"><div style="display:flex;">
					<span class="content-item5">冲正单号(保单号/批单号)：</span>
					<span class="content-item3">{{form.correctNo}}</span>
				</div></el-col>
			</el-row>
            <el-row type="flex" class="row-bg">
				<el-col :span="9"><div style="display:flex;">
					<span class="content-item5">流水号：</span>
					<span class="content-item3">{{editInfo.serialNo}}</span>
				</div></el-col>
				<!-- <el-col :span="9"><div style="display:flex;">
					<span class="content-item5">冲正期次：</span>
					<span class="content-item3">{{form.appCode}}</span>
				</div></el-col> -->
			</el-row>
        </div>

		<div class="content" v-if="!show">
			<Title :titles="title2"></Title>
			<p class="content-item1"><i class="el-icon-info" style="margin-right:10px;"></i>暂无数据，输入保单号或批单号点击查询按钮，显示查询结果</p>
		</div>

		<div class="content" v-if="show">
			<Title :titles="title2"></Title>
			<p class="content-item2"><i class="el-icon-info" style="margin-right:10px;"></i>请认真核对以下保单或批单基本信息，并进行冲正申请</p>
			<el-row type="flex" class="row-bg">
				<el-col :span="9"><div style="display:flex;">
					<span class="content-item4">投保人：</span>
					<span class="content-item3">{{form.policyHolder}}</span>
				</div></el-col>
				<el-col :span="9"><div style="display:flex;">
					<span class="content-item4" v-if="form.orderType == 1">投保单号：</span>
					<span class="content-item4" v-else>批单申请号：</span>
					<span class="content-item3">{{form.appCode}}</span>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="9"><div style="display:flex;">
					<span class="content-item4">保险期间：</span>
					<span class="content-item3">{{form.startTime}}&nbsp;&nbsp;至&nbsp;&nbsp;{{form.endTime}}</span>
				</div></el-col>
				<el-col :span="9"><div style="display:flex;">
					<span class="content-item4" v-if="form.orderType == 1">保单号：</span>
					<span class="content-item4" v-else>批单号：</span>
					<span class="content-item3">{{form.correctNo}}</span>
				</div></el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="9"><div style="display:flex;">
					<span class="content-item4">保险保费：</span>
					<span class="content-item3" style="color:#FC9843;">{{form.premium}}</span>
				</div></el-col>
				<el-col :span="9" v-if="form.orderType == '1'"><div style="display:flex;">
					<span class="content-item4">保单状态：</span>
					<span class="content-item3">{{form.state}}</span>
				</div></el-col>
			</el-row>
		</div>

		<div class="content" v-if="show">
			<Title :titles="title3"></Title>
			<el-form ref="form" :model="form" label-width="150px" :rules="rules">
				<el-form-item label="冲正类型：" prop="correctType">
					<el-radio-group v-model="form.correctType" v-if="form.orderType == 2">
						<el-radio :label="item.value" v-for="(item,index) in options3" :key="index">{{item.label}}</el-radio>
					</el-radio-group>
					<el-radio-group v-model="form.correctType" v-else>
						<el-radio :label="item.value" v-for="(item,index) in options2" :key="index">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<GeneralCorrection v-if="form.correctType != 2 && form.correctType != 3 && form.correctType != 4 && form.orderType == 1" :form="form" ref="getSubmitForm"></GeneralCorrection>
				<GeneralCorrections v-if="form.correctType != 2 && form.correctType != 3 && form.correctType != 4 && form.orderType == 2" :form="form" ref="getSubmitForm"></GeneralCorrections>
				<PremiumReversal :form="form" v-if="form.correctType == 2" ref="getSubmitForm2" :reasonData="reasonData.dataPre"></PremiumReversal>
				<PolicyDeletion :form="form" v-if="form.correctType == 3" ref="getSubmitForm3" :reasonData="reasonData.dataDel"></PolicyDeletion>
				<PolicyAgent :form="form" :policyData="data" v-if="form.correctType == 4" ref="getSubmitForm4"></PolicyAgent>
				<!-- <Reason :multiData="form" :crossForm="form" :typeName="'CZ'"></Reason> -->
				<el-form-item>
					<el-button type="primary" @click="submitForm('form')" :disabled="!disabledFlag">确认提交</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './components/title';
import GeneralCorrection from './components/GeneralCorrection';
import PremiumReversal from './components/PremiumReversal';
import PolicyDeletion from './components/PolicyDeletion';
import PolicyAgent from './components/PolicyAgent';
import correctionManagement from '../../service/CorrectionManagement';
import GeneralCorrections from './components/GeneralCorrections';
import Reason from './components/Reason';
import statisticService from '../../service/StatisticService';
import moment from 'moment'
import {elevator} from '../../server/accidenServer.js';
import reasonData from './data/rectigyReason.json'
export default {
	name:'ApplicationCorrection',
	components:{
		Title,GeneralCorrection,PremiumReversal,PolicyDeletion,GeneralCorrections,Reason,PolicyAgent
	},
	data() {
		return {
			reasonData:reasonData,
            Elevator:new elevator(),
            CorrectionManagement:new correctionManagement(),
            statisticService: new statisticService(),
			title1:'保单/批单查询',
			title2:'基本信息',
			title3:'冲正信息',
			form:{
                serialNo:'',
				orderType:1,
				correctNo:'',
				correctType:1,
				policyHolder:'',
				threeInOneCode:'',
				appCode:'',
				startTime:'',
				endTime:'',
				signTime:'',
				premium:'',
				insured:'',
				state:'',
				validDate:'',
				kuaQiFlag:false
            },
            editInfo:{},
			rules:{
				correctType:[{ required: true, message: '请选择冲正类型', trigger: 'change' }]
			},
			options1:[
				{
					label:'保单',
					value:1
				},
				{
					label:'批单',
					value:2
				}
			],
			options2:[
				{
					label:'一般性冲正',
					value:1
				},
				{
					label:'保费冲正',
					value:2
				},
				{
					label:'保单删除',
					value:3
				},
				{
					label:'全面营销信息',
					value:4
				}
			],
			options3:[
				{
					label:'一般性冲正',
					value:1
				},
				{
					label:'保费冲正',
					value:2
				},
				{
					label:'批单删除',
					value:3
				}
			],
			data:{},
			show:false,
			date:'',
			disabledFlag: true,
			distDate: []
		};
	},
	computed: {
		
    },
	created() {
        this.getDate();
		this.getDist();
        if(this.$route.query.id) {
            this.getRecData(this.$route.query.id);
        }
		if(this.$route.query.correctNo) {
			this.initData();
		}
	},
	methods: {
		initData() {
			this.form.orderType = this.$route.query.orderType;
			this.form.correctNo = this.$route.query.correctNo;
			this.querySearch()
		},
		//获取冲正原因
		async getDist() {
			const res = await this.CorrectionManagement.getCZReason();
			if(res.code == '0000'){
				this.distDate = res.data;
			}
		},
        async getRecData(id) {
            let res = await this.CorrectionManagement.getDetail(id);
            if(res.code == '0000') {
                this.editInfo = res.data
                this.form.orderType = res.data.orderType;
                this.form.correctNo = res.data.correctNo;
                this.form.editList = res.data.correctContent;
                this.form.correctType = res.data.correctType
                this.form.serialNo = res.data.serialNo
                this.querySearch()
            }
        },
		async getDate(){
			const res = await this.statisticService.getdatetime();
			if(res.code == '0000'){
				this.date = res.data;
			}
		},
		toSelect(val){
			if(!this.show){
				this.form.orderType = val;
				this.form.correctNo = '';
			}
		},
		querySearch(){
			this.form.kuaQiFlag = false;
			if(this.form.orderType == 1){
				this.policydetails();
			}else if(this.form.orderType == 2){
				this.getapprovaldetails();
			}else{
				 this.$message({
					message: '请先选择保单/批单冲正',
					type: 'warning'
				});
			}
		},
		async policydetails(){
			let data = {
				"policyNo": this.form.correctNo
			};
			const res = await this.CorrectionManagement.policydetails(data);
			if(res.code == '0000'){
				if(!res.data){
					this.$message.error('保单号不存在,' + res.msg);
				}else{
					this.data = res.data;
					if(res.data.holder.corporation){
						this.form.policyHolder = res.data.holder.corporation.name;
						this.form.threeInOneCode = res.data.holder.corporation.threeInOneCode;
					}else{
						this.form.policyHolder = res.data.holder.human.name;
					}
					this.form.kuaQiFlag = res.data.extendList.find(item => item.key == 'S_A_000089') &&res.data.extendList.find(item => item.key == 'S_A_000089').value ? true : false//是否跨期 判断依据修改为 是否包含跨期原因 20210810
					this.form.appCode = res.data.appCode;
					this.form.startTime = res.data.polStartDate;
					this.form.endTime = res.data.polEndDate;
					this.form.premium = res.data.actualPrem;
					this.form.signTime = res.data.issueDate;
					this.form.insured = res.data.insuredName;
					this.form.correctNo = res.data.policyNo;
					this.form.agent = res.data.tApplicationForm && res.data.tApplicationForm.schanelCode == '05' && res.data.agents && res.data.agents.length != 0 ? res.data.agents[0].agentName + '(' + res.data.agents[0].smsAgentCode + ')' : '无';
					if(new Date(res.data.polStartDate).getTime() > new Date(this.date).getTime()){
						this.form.state = '已出单';
					}else if(new Date(res.data.polEndDate).getTime() < new Date(this.date).getTime()){
						this.form.state = '已失效';
					}else{
						this.form.state = '保障中';
					}
					this.show = true;
				}
			}
		},
		async getapprovaldetails(){
			if(!this.form.correctNo.trim()) {
				this.$message.error('批单号不能为空');
				return
			}
			let data = {};
            if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				data = {
					'channelCode':'sequip',
					'endorseStatus':'',
					'endorsementsType':'',
					'issueDate':'',
					'pn':1,
					'ps':1,
					'productCode':'',
					'queryConditions':this.form.correctNo,
					'userCode':'',
					'branchScope':'000000',
					'branchCode':'',
					'endorsementMode':'',
				}
			}else{
				data = {
					'channelCode':'sequip',
					'endorseStatus':'',
					'endorsementsType':'',
					'issueDate':'',
					'pn':1,
					'ps':1,
					'productCode':'',
					'queryConditions':this.form.correctNo,
					'userCode':'',
					'branchScope':window.sessionStorage.getItem('authDataInfo'),
					'branchCode':'',
					'endorsementMode':'',
				}
            }
            let res = await this.Elevator.getapprovaldatalist(data);
			if(res.code == '0000' && res.list.length != 0){
				await this.getInfoByCode(res.list[0].applyNo)
			} else {
				this.$message.error('批单号不存在');
			}
		},
		async getInfoByCode(code) {
			let res = await this.Elevator.getDet(code);
			if(res.code == '0000' && res.data){
				this.data = res.data;
				this.form.policyHolder = this.data.applicant;
				this.form.appCode = this.data.applyNo;
				this.form.startTime = this.data.startDate;
				this.form.endTime = this.data.endDate;
				this.form.premium = this.data.batchPremium;
				this.form.signTime = this.data.issueDate;
				this.form.correctNo = this.data.endorsementsNo;
				this.form.kuaQiFlag = res.data.busExtendInfoVOList.find(item => item.fieldCode == 'S_E_000024') && res.data.busExtendInfoVOList.find(item => item.fieldCode == 'S_E_000024').fieldValues? true : false //是否跨期 判断依据修改为 是否包含跨期原因 20210810
				this.form.state = '';
				this.show = true;
			}else if(res.code == '9999' && !res.msg){
				this.$message.error('批单信息获取失败。');
			}
		},
		empty(){
			this.form = {
                serialNo:'',
				orderType:1,
				correctNo:'',
				correctType:1,
				policyHolder :'',
				threeInOneCode:'',
				appCode:'',
				startTime:'',
				endTime:'',
				signTime:'',
				premium:'',
				state:'',
				validDate:''
			};
			this.show = false;
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
                    let obj = {};
					if(this.form.correctType == 1){
                        obj = this.$refs.getSubmitForm.submitForm1();
					}else if(this.form.correctType == 2){
						obj = this.$refs.getSubmitForm2.submitForm1();
					}else if(this.form.correctType == 3){
						obj = this.$refs.getSubmitForm3.submitForm1();
                    } else {
						obj = this.$refs.getSubmitForm4.submitForm1();
					}
					if(JSON.stringify(obj) == '{}'){
						return false;
					}else{
						this.setPunch(obj);
					}
				} else {
					return false;
				}
			});
		},
		getReason(correctNos,signTimes,startTimes,endTimes,policyHolders,threeInOneCode,premiums,premiumS) {
			let arr = [];
			// 1 保单  2批单
			if(this.form.orderType == 1) {
				correctNos ? arr.push({ reasonType: '0', rectifyReason: '09' }) : ''
				signTimes ? arr.push({ reasonType: '0', rectifyReason: '11' }) : ''
				startTimes ? arr.push({ reasonType: '0', rectifyReason: '12' }) : ''
				endTimes ? arr.push({ reasonType: '0', rectifyReason: '12' }) : ''
				policyHolders ? arr.push({ reasonType: '0', rectifyReason: '01' }) : ''
				premiums ? arr.push({ reasonType: '0', rectifyReason: premiums.reason  }) : ''
				premiumS ? arr.push({ reasonType: '0', rectifyReason: premiumS.reason }) : ''
			}
			if(this.form.orderType == 2) {
				correctNos ? arr.push({ reasonType: '3', rectifyReason: '09' }) : ''
				signTimes ? arr.push({ reasonType: '6', rectifyReason: '11' }) : ''
				startTimes ? arr.push({ reasonType: '9', rectifyReason: '12' }) : ''
				endTimes ? arr.push({ reasonType: '2', rectifyReason: '12' }) : ''
				premiums ? arr.push({ reasonType: '1', rectifyReason: premiums.reason }) : ''
				premiumS ? arr.push({ reasonType: '10', rectifyReason: premiumS.reason }) : ''
			}
			return arr;
		},
		async setPunch(obj){
			let correctNos = obj.name.find(item =>(item.value == '00'));
			let signTimes = obj.name.find(item =>(item.value == '01'));
			let startTimes = obj.name.find(item =>(item.value == '02'));
			let endTimes = obj.name.find(item =>(item.value == '03'));
			let policyHolders = obj.name.find(item =>(item.value == '04'));
			let threeInOneCode = obj.name.find(item =>(item.value == '05'));
			let premiums = obj.name.find(item =>(item.value == '06'));
            let premiumS = obj.name.find(item =>(item.value == '07'));
            let agent = obj.name.find(item =>(item.value == '08'));
			
			let reason = this.getReason(correctNos,signTimes,startTimes,endTimes,policyHolders,threeInOneCode,premiums,premiumS);
			let flag = this.data && this.data.tApplicationForm && this.data.tApplicationForm.schanelCode == '05' ? agent && agent.newCode ? '2' : '3' : agent && agent.newCode ? '1' : '' //1 非营销人员到营销人员  2  营销人员信息变更 3 营销人员改为非营销人员
            // if(signTimes) {
            //     obj.name.find(item =>(item.value == '01')).newCode = moment(new Date(signTimes.newCode)).format('YYYY-MM-DD 00:00:00')
            // }
			let data = {
                "serialNo": this.form.serialNo,
				"isCancelIntertemporal":signTimes && signTimes.newCode && this.form.proofReason == '' && this.form.kuaQiFlag ? true : false,//是否将跨期业务冲正为非跨期
				"branchCode": window.sessionStorage.getItem('branchCode'),
				"correctApplyNo": this.form.appCode,
				"correctContent": JSON.stringify(obj.name),
				"correctContentBack": JSON.stringify(obj.name),
				"correctNo": this.form.correctNo,
				"correctNoAlter": correctNos?correctNos.newCode:'',
				"creditCode": threeInOneCode ? threeInOneCode.newCode:'',//信用代码证
				"secondCorrect":threeInOneCode ? true : false,//信用代码证冲正 传true（后端接口原因） 无信用代码证冲正 传false
				"firstCorrect":correctNos|| signTimes || startTimes || endTimes || policyHolders ? true : false,//非信用代码证并包含其他冲正 传true 否则传false
				"correctType": this.form.correctType,
				"endTime": endTimes?endTimes.newCode:'',
				"orderType":this.form.orderType,
                "policyHolder": this.form.policyHolder,
                "policyHolderAlter": policyHolders?policyHolders.newCode:'',
				"premium": premiumS?premiumS.newCode:(premiums?premiums.newCode:''),
				"incomeConfirmTime": signTimes?signTimes.newCode: this.form.signTime,
				"antDatedReason":this.form.proofReason ? this.form.proofReason : '',
				"signTime": signTimes?signTimes.newCode:'',
				// "signTime": signTimes?moment(new Date(signTimes.newCode)).format('YYYY-MM-DD 00:00:00'):'',
				"startTime": startTimes?startTimes.newCode:'',
				"reasons": reason,
				"performanceCode":agent ? agent.newCode : '',//营销人员编码
				"performanceFlag":flag,//全员营销标志位  1 非营销人员到营销人员  2  营销人员信息变更 3 营销人员改为非营销人员
			}
			let id = this.$route.query.id || ''
			const res = await this.CorrectionManagement.setPunch(data,id);
			if(res.code == '0000'){
				this.disabledFlag = true;
                if(this.$route.query.id) {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: '冲正申请成功',
                        type: 'success'
                    });
                }
				this.$router.push({
					path: "/reverse"
				});
			} else {
				this.disabledFlag = false;
				setTimeout(() => {
					this.disabledFlag = true;
				}, 5000);
			}
		}
	}
};
</script>

<style lang="less">
#ApplicationCorrection{
	padding-bottom: 20px;
	box-sizing: border-box;
	.query-code{
		width: 100%;
		background-color: #ffffff;
		margin-top: 20px;
		padding: 20px 20px;
		box-sizing: border-box;
		.code-class{
			display: inline-block;
			margin-right: 20px;
			line-height: 30px;
			padding: 0 30px;
			border: 1px solid #096DD9;
			box-sizing: border-box;
			color: #096DD9;
			border-radius: 25px;
			cursor: pointer;
		}
		.code-class1{
			display: inline-block;
			margin-right: 20px;
			line-height: 30px;
			padding: 0 30px;
			background-color: #40A9FF;
			border: 1px solid #40A9FF;
			box-sizing: border-box;
			color: #ffffff;
			border-radius: 25px;
			cursor: pointer;
		}
		.code-item1{
			width: 250px;
		}
		.code-item2{
			width: 400px;
			margin-right: 20px;
		}
	}
	.content{
		width: 100%;
		background-color: #ffffff;
		padding: 0 20px 20px;
		box-sizing: border-box;
		.content-item1{
			width: 100%;
			line-height: 50px;
			color: #40A9FF;
			padding-left: 30px;
			box-sizing: border-box;
		}
		.content-item2{
			width: 100%;
			line-height: 50px;
			color: #34C697;
			padding-left: 30px;
			box-sizing: border-box;
		}
		.content-item3{
			display: block;
			width: 60%;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			line-height: 40px;
		}
		.content-item4{
			display: block;
			width: 20%;
			text-align: right;
			margin-right: 10px;
			line-height: 40px;
        }
        .content-item5{
			display: block;
			width: 30%;
			text-align: right;
			margin-right: 10px;
			line-height: 40px;
		}
	}
}
</style>
