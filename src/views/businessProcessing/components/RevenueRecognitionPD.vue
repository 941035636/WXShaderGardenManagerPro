<template>
	<div class="income-information" v-if="list1.length || list2.length || list3.length">
		<p class="income-title">收入确认信息</p>
		<div class="income-informations">
			<div class="income-content" v-if="list1.length">
				<div class="trainxie">
					<div class="futit-l"></div>
					<div class="futit-r">应收凭证信息</div>
				</div>
				<el-table :data="list1" :header-cell-style="getRowClass" fit>
					<el-table-column prop="pageNo" label="收入明细表编码" show-overflow-tooltip></el-table-column>
					<el-table-column prop="voucherNo" label="准凭证号" show-overflow-tooltip></el-table-column>
					<el-table-column prop="incomeMoney" label="佣金收入（不含税）" show-overflow-tooltip width="150"></el-table-column>
					<el-table-column prop="voucherStatusName" label="收入状态" show-overflow-tooltip width="120"></el-table-column>
					<el-table-column prop="payerName" label="付款人" show-overflow-tooltip></el-table-column>
					<el-table-column prop="signTime" label="推送时间" show-overflow-tooltip></el-table-column>
				</el-table>
			</div>
			<div class="income-content" v-if="list2.length">
				<div class="trainxie">
					<div class="futit-l"></div>
					<div class="futit-r">业务结算信息</div>
				</div>
				<el-table :data="list2" :header-cell-style="getRowClass" fit>
					<el-table-column prop="settlementCode" label="结算单号" show-overflow-tooltip></el-table-column>
					<el-table-column prop="settlementPremium" label="结算金额" show-overflow-tooltip></el-table-column>
					<el-table-column prop="settlementStatusName" label="结算状态" show-overflow-tooltip></el-table-column>
					<el-table-column prop="payerName" label="付款人" show-overflow-tooltip></el-table-column>
					<el-table-column prop="settlementCreateDate" label="结算单生成时间" show-overflow-tooltip></el-table-column>
					<el-table-column prop="settlementDate" label="开票时间" show-overflow-tooltip></el-table-column>
				</el-table>
			</div>
			<div class="income-content" v-if="list3.length">
				<div class="trainxie">
					<div class="futit-l"></div>
					<div class="futit-r">解付信息</div>
				</div>
				<el-table :data="list3" :header-cell-style="getRowClass" fit>
					<el-table-column prop="paymentCode" label="解付单号" show-overflow-tooltip></el-table-column>
					<el-table-column prop="paymentStatus" label="解付状态" show-overflow-tooltip></el-table-column>
					<el-table-column prop="paymentInscompanyName" label="解付公司" show-overflow-tooltip></el-table-column>
					<el-table-column prop="paymentPreium" label="解付金额" show-overflow-tooltip></el-table-column>
					<el-table-column prop="paymentDate" label="解付时间" show-overflow-tooltip></el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>
	
<script>
import correctionManagement from '../../../service/CorrectionManagement';
export default {
	data() {
		return {
			CorrectionManagement:new correctionManagement(),
			list1:[],
			list2:[],
			list3:[],
			option:[
				{
					value:'01',
					label:'未生成结算凭证'
				},
				{
					value:'02',
					label:'初始化'
				},
				{
					value:'03',
					label:'成功（暂存）'
				},
				{
					value:'04',
					label:'成功（已提交）'
				},
				{
					value:'05',
					label:'成功（已审核）'
				},
				{
					value:'06',
					label:'失败'
				},
				{
					value:'07',
					label:'删除'
				}
			],
			option1:[
				{
					value:'1',
					label:'待结算'
				},
				{
					value:'2',
					label:'已开票'
				},
				{
					value:'3',
					label:'业务款项已确认'
				},
				{
					value:'4',
					label:'部分结算'
				},
				{
					value:'5',
					label:'已结算'
				},
				{
					value:'6',
					label:'业务确认打回'
				},
				{
					value:'7',
					label:'未生成结算单'
				}
			]
		}
	},
	computed:{
       
    },
    name:'RevenueRecognition',
	mounted() {
		
	},
	created(){
		if(this.$route.query.applyNo){
			this.getCommission();
			this.getSettlement();
			this.getPayment();	
		}
	},
	methods: {
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#919497;font-weight: 600;";
			} else {
				return "";
			}
		},
		async getCommission(){
			let data = {
				endorsementNo:this.$route.query.applyNo?this.$route.query.applyNo:'',
				pageNum:1,
				pageSize:10
			}
			const res = await this.CorrectionManagement.getCommission(data);
			if(res.code == '0000' && res.list){
				res.list.forEach(item =>{
					this.option.forEach(item1 =>{
						if(item.voucherStatus == item1.value){
							item.voucherStatusName = item1.label;
						}
					})
				})
				this.list1 = res.list?res.list:[];
			}
		},
		async getSettlement(){
			let data = {
				endorsementNo:this.$route.query.applyNo?this.$route.query.applyNo:'',
				pageNum:1,
				pageSize:10
			}
			const res = await this.CorrectionManagement.getSettlement(data);
			if(res.code == '0000' && res.list){
				res.list.forEach(item =>{
					this.option1.forEach(item1 =>{
						if(item.settlementStatus == item1.value){
							item.settlementStatusName = item1.label;
						}
					})
				})
				this.list2 = res.list?res.list:[]
			}
		},
		async getPayment(){
			let data = {
				endorsementNo:this.$route.query.applyNo?this.$route.query.applyNo:'',
				pageNum:1,
				pageSize:10
			}
			const res = await this.CorrectionManagement.getPayment(data);
			if(res.code == '0000' && res.list){
				this.list3 = res.list?res.list:[]
			}
		}	
	}
}

</script>

<style scoped>
.income-information{
	width: 100%;
	height: 100%;
	padding: 20px;
	border: 1px solid #DEE1E8;
	box-sizing: border-box;
}
.income-informations{
	border: 1px solid #DEE1E8;
	box-sizing: border-box;
}
.income-title{
	width: 100%;
	line-height: 60px;
	color: #53A5FF;
	font-size: 16px;
}
.income-content{
	width: 100%;
	height: 100%;
	padding: 0 20px 20px;
	box-sizing: border-box;
}
</style>
