<template>
	<div id="PolicyInfos">
		<Title :titles="title"></Title>
		<div class="content mt20">
			<el-form :model="policy" class="demo-ruleForm" label-position="right" label-width="140px" ref="policy">
				<el-form-item label="新保/续保：">
					<el-radio-group v-model="policy.type" class="item1" disabled>
						<el-radio :label="1">新保</el-radio>
						<el-radio :label="2">续保</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="原保单号：" v-if="policy.renewalLastPolicyNo">
					<span>{{policy.renewalLastPolicyNo}}</span>
				</el-form-item>
				<el-form-item label="出单公司：" v-if="policy.inusureCompanyName">
					<span>{{policy.inusureCompanyName}}</span>
				</el-form-item>
				<el-form-item label="保单号：">
					<span>{{policy.policyNo}}</span>
				</el-form-item>
				<el-form-item label="保险期间：">
					<span>{{policy.startDate}} 起</span><span style="padding:0 20px">至</span><span>{{policy.endDate}} 止</span>
				</el-form-item>
				<el-form-item label="签单日期：">
					<span>{{policy.signedon}}</span>
				</el-form-item>
				<el-form-item label="保费：">
					<span>{{policy.premium}}</span>
				</el-form-item>
				<el-form-item label="保单影印件：">
					<span style="color: #21E72B;" class="mr20" v-for="(item,index) in policy.urlId" :key="index">{{item.name}}</span>
				</el-form-item>
				<el-form-item label="合同：" v-if="policy.table.length != 0">
					<el-table ref="table" :data="policy.table" tooltip-effect="dark" border style="width: 80%;" :header-cell-style="getRowClass1">
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
				</el-form-item>
				<div v-if="crossForm">
					<span class="num-bd" v-if="crossForm.incomeDate">跨期业务</span>
					<el-form-item label="收入确认日期：" v-if="crossForm.incomeDate">
						<span>{{crossForm.incomeDate}}</span>
					</el-form-item>
					<el-form-item label="佐证原因：" v-if="crossForm.proofReason">
						<span>{{proofList.find(item => item.value==crossForm.proofReason).label}}</span>
					</el-form-item>
					<el-form-item label="佐证其他原因：" v-if="crossForm.proofReasonOther">
						<span>{{crossForm.proofReasonOther}}</span>
					</el-form-item>
					<el-form-item label="佐证文件：" v-if="crossForm.proofFile.length != 0">
						<span style="color: #21E72B;" class="mr20">{{crossForm.proofFile[0].name}}</span>
					</el-form-item>
					<span class="num-bd" v-if="crossForm.proof">签发日期晚于保险起期</span>
					<el-form-item label="原因：" v-if="crossForm.proof">
						<span>{{issueList.find(item => item.value == crossForm.proof).label}}</span>
					</el-form-item>
					
				</div>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './Title'
import moment from 'moment'
export default {
	name:'PolicyInfos',
	props:{
		'policy':Object,
		'crossForm':Object
	},
	components:{
		Title
	},
	data() {
		return {
			moment:moment,
			title:'保单信息',
			proofList:[
				{
					label:"委托协议签署流程延迟",
					value:"01"
				},
				{
					label:"框架协议/保险协议签署流程延迟",
					value:"02"
				},
				{
					label:"佣金比例确认延迟",
					value:"03"
				},
				{
					label:"保单/批单实际出具延迟",
					value:"04"
				},
				{
					label:"冲正调整重新确认数据",
					value:"05"
				},
				{
					label:"补录确认",
					value:"06"
				},
				{
					label:"承保清单提供延迟",
					value:"07"
				},
				{
					label:"其他",
					value:"08"
				},
				{
					label:"无法提供佐证原因",
					value:"12"
				},
			],
			issueList:[
				{
					label:"保险公司出具延迟",
					value:"01"
				},
				{
					label:"框架协议/保险协议签署流程延迟",
					value:"02"
				},
				{
					label:"先出暂保单后出正式保单",
					value:"03"
				},
				{
					label:"协议约定",
					value:"04"
				},
				{
					label:"其他",
					value:"05"
				},
			],
		};
	},
	computed: {
		
	},
	created() {
		
	},
	methods: {
		getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #e8e8e8;color:#101010;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
		
	}
};
</script>

<style lang="less">
#PolicyInfos{
	background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 10px 40px;
	margin-bottom: 0px;
	.content{
		.item1{
			width: 320px;
		}
		.num-bd {
			font-size: 18px;
			color: #000;
			font-weight: bold;
		}
	}
}
</style>
