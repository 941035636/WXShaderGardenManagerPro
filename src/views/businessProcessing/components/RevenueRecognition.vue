<template>
	<div class="policy-content" v-if="list1.length || list2.length || list3.length">
        <div class="policy-title">
            <span>收入确认信息</span>
        </div>
        <el-row type="flex" class="row-bg" v-if="list1.length">
            <el-col :span="24">
                <div class="trainxie">
                    <div class="futit-l"></div>
                    <div class="futit-r">应收凭证信息</div>
                </div>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" v-if="list1.length">
            <el-col :span="24">
                <el-table :data="list1" :header-cell-style="rowClass" fit>
                    <el-table-column prop="pageNo" label="收入明细表编码" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="voucherNo" label="准凭证号" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="voucherSource" label="类型" width="80" align="center"></el-table-column>
                    <el-table-column prop="incomeMoney" label="价税合计" width="180" align="center"></el-table-column>
                    <el-table-column prop="voucherStatusName" label="收入状态" width="180" align="center"></el-table-column>
                    <el-table-column prop="payerName" label="付款人" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="signTime" label="推送时间" align="center" width="180"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" v-if="list2.length">
            <el-col :span="24">
                <div class="trainxie">
                    <div class="futit-l"></div>
                    <div class="futit-r">业务结算信息</div>
                </div>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" v-if="list2.length">
            <el-col :span="24">
                <el-table :data="list2" :header-cell-style="rowClass" fit>
                    <el-table-column prop="settlementCode" label="结算单号" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="voucherSource" label="类型" align="center" width="80"></el-table-column>
                    <el-table-column prop="settlementPremium" label="结算金额" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="settlementStatusName" label="结算状态" align="center" width="180"></el-table-column>
                    <el-table-column prop="payerName" label="付款人" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="settlementCreateDate" align="center" label="结算单生成时间" width="180"></el-table-column>
                    <el-table-column prop="invoiceDate" label="开票时间" align="center" width="180"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" v-if="list3.length">
            <el-col :span="24">
                <div class="trainxie">
                    <div class="futit-l"></div>
                    <div class="futit-r">解付信息</div>
                </div>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" v-if="list3.length">
            <el-col :span="24">
                <el-table :data="list3" :header-cell-style="rowClass" fit>
                    <el-table-column prop="paymentCode" label="解付单号" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="paymentStatus" label="解付状态" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="paymentInscompanyName" label="解付公司" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="paymentPreium" label="解付金额" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="paymentDate" label="解付时间" align="center" show-overflow-tooltip></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import CorrectionManagement from '../../../service/CorrectionManagement';
export default {
	data() {
		return {
			CorrectionManagement: new CorrectionManagement(),
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
    props: {
        data: Object,
    },
    name:'RevenueRecognition',
	mounted() {
		
	},
	created(){
		this.getCommission();
        if(this.data.policyNo){
            this.getSettlement();
            this.getPayment();	
        }
		
	},
	methods: {
		rowClass({row, column, rowIndex, columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
				return 'background-color:#e6f7ff;font-size:14px;font-weight:600;text-align: center;color:#0050b3;';
            } else {
                return;
            }
		},
		async getCommission(){
			let data = {
				applicationFormCode:this.$route.query.appCode,
				pageNum:1,
				pageSize:50
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
                
				this.list1 = this.checkData(res.list);
			}
        },
        checkData(arr) {
            let arr1 = [];
            let arr2 = [];
            arr.forEach(item => {
                if(item.voucherSource == '保单') {
                    arr1.push(item);
                } else {
                    arr2.push(item);
                }
            })
            return arr1.concat(arr2)
        },
		async getSettlement(){
			let data = {
				policyNo:this.data.policyNo?this.data.policyNo:'',
				pageNum:1,
				pageSize:50
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
				this.list2 = this.checkData(res.list);
			}
		},
		async getPayment(){
			let data = {
				policyNo:this.data.policyNo?this.data.policyNo:'',
				pageNum:1,
				pageSize:50
			}
			const res = await this.CorrectionManagement.getPayment(data);
			if(res.code == '0000' && res.list){
				this.list3 = res.list?res.list:[]
			}
		},
			
	},
}

</script>

<style lang="less">
#OrderDetails{
	width: 99%;
    margin: 15px;
	padding-bottom: 80px;
	.title{
		width: 98.5%;
		height: 40px;
		line-height: 40px;
		background-color: #fff;
		padding: 20px 10px;
		color: #535F7A;
		border-radius: 2px;
		font-size: 20px;
		position: relative;
		.download-policy{
			display: block;
			width: 120px;
			height: 40px;
			border: 1px solid #213593;
			text-align: center;
			color: #213593;
			box-sizing: border-box;
			font-size: 16px;
			position: absolute;
			right: 10px;
			top: 20px;
			cursor: pointer;
		}
		.order-content{
			display: inline-block;
			width: 80%;
			height: 40px;
			line-height: 40px;
			color: #181E2D;
			font-size: 16px;
			span{
				margin-right: 40px;
			}
		}
	}
	.content{
		width: 100%;
		min-height: 1332px;
		margin-top: 10px;
		box-sizing: border-box;
		border-radius: 14px;
		.policy-content{
			margin-top: 10px;
			background-color: #fff;
			border-radius: 2px;
			padding: 10px 20px 20px 20px;
			.policy-title{
				width: 100%;
				box-sizing: border-box;
				line-height: 22px;
				height: 22px;
				margin: 20px 0 30px 0;
				color: #000000;
				font-size: 18px;
				font-weight: 700;
				padding-left: 24px;
				border-left: 4px solid #273989;
			}
			.policy-con{
				// padding-left: 24px;
				margin: 0 28px;
				.text-title{
					font-size: 16px;
					color: #000;
					font-weight: 700;
				}
			}
			.border-top{
				border-top:1px solid #ccc ;
			}
			.row-bg{
				margin-top:18px;
				.item3{
					display: block;
					width: 35%;
					padding-left: 50px;
					box-sizing: border-box;
				}
				.item4{
					display: block;
					width: calc(65% - 60px);
					vertical-align:middle;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;

				}
				
			}
			.personnel-list{
				width: 100%;
				min-height: 200px;
				padding: 24px;
				box-sizing: border-box;
				position: relative;
				// height: 50px;
				.content-total{
					width: 100%;
					text-align: right;
					position: absolute;
					bottom: 4px;
					right: 24px;
				}
			}
		}
		.policy-tit{
				width: 100%;
				box-sizing: border-box;
				line-height: 20px;
				height: 20px;
				margin: 40px 0;
				color: #000000;
				font-size: 14px;
				padding-left: 24px;
				border-left: 4px solid #273989;
			}
		.policyholder-content{
			width: 100%;
			display: flex;
			
			.holder-content{
				width: 50%;
				min-height: 352px;
				box-sizing: border-box;
				margin-top: 20px;
				font-size: 16px;
				color: #181E2D;
				.policy-title{
					width: 100%;
					height: 56px;
					background-color: #F1F4F9;
					border-bottom: 1px solid #D2D2D2;
					padding-left: 24px;
					box-sizing: border-box;
					line-height: 56px;
					color: #535F7A;
					font-size: 14px;
					span{
						float: right;
						margin-right: 16px;
					}
				}
				.row-bg{
					margin-top:18px;
					width: 100%;
					.item3{
						display: block;
						width: 35%;
						padding-left: 50px;
						box-sizing: border-box;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.item4{
						display: block;
						width: calc(65% - 60px);
						vertical-align:middle;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					
					.item5{
						width: calc(65% - 60px);
						.item6{
							display: block;
							width: 70%;
						}
						.item7{
							display: block;
							width: 27%;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
					}
				}
				.personnel-list{
					width: 100%;
					min-height: 300px;
					padding: 24px;
					box-sizing: border-box;
					position: relative;
					.content-total{
						width: 100%;
						text-align: right;
						position: absolute;
						bottom: -24px;
						right: 24px;
					}
				}
			}
		}
		.closes{
			width: 100%;
			margin-top: 32px;
			text-align: center;
			span{
				display: inline-block;
				width: 120px;
				height: 48px;
				border: 1px solid #213593;
				text-align: center;
				line-height: 48px;
				font-size: 16px;
				color: #213593;
				border-radius:6px;
				box-sizing: border-box;
				cursor: pointer;
			}
		}
	}
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
}
.mglet5{
	margin-left:5px;
	vertical-align:middle;
}
.text-right{
	color: #000;
}
</style>
