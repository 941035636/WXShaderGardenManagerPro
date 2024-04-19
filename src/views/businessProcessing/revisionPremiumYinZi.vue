<template>
	<div class="shortTermlist" id="shortTermlist">
        <el-dialog title="修改保费" :visible.sync="outerVisible">
            <div class="content-dialog">
                <div class="content1-dialog">
                    <p class="item1">投保单信息</p>
                    <div class="item2">
                        <el-row>
                            <el-col :span="10">
                                <p><span class="item3">投保人</span><span class="item4">{{data2.holdername}}</span></p>
                            </el-col>
                            <el-col :span="12">
                                <p><span class="item3">投保产品</span><span class="item4">{{data2.productName}}</span></p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <p><span class="item3">投保单号</span><span class="item4">{{data2.applicationFormCode}}</span></p>
                            </el-col>
                            <el-col :span="12">
                                <p><span class="item3">保险期间</span><span class="item4">{{data2.startDate}}&nbsp;&nbsp;-&nbsp;&nbsp;{{data2.endDate}}</span></p>
                            </el-col>
                        </el-row>
                        <p><span class="item3">投保单金额</span><span class="item5">￥{{data2.afterPrem.toFixed(2)}}</span>元</p>
                        
                    </div>
                </div>
                <p style="border:1px dashed #ccc"></p>
                <div class="content1-dialog">
                    <p class="item1">修改信息</p>
                    <p class="ml20"> <span style="color:red">*</span> 因子变更</p>
                    <div class="updataPremium">
                        <div class="updataPremium-title"><p class="item3">优惠类型</p> <p>比例</p></div>
                        <div class="updataPremium-content" style="display:flex;"><p class="item3">优惠因子</p> <p><el-input v-model.trim="premiumDiscount" style="width:200px;" size="small" @blur="calculationPremium"> <template slot="append">%</template></el-input></p></div>
                    </div>
                    <p class="mt10 fr" style="height:20px"><span class="item3">投保单金额 (修改后)</span><span class="item5" style="color:#FF3000">￥{{value.toFixed(2)}}</span>元</p>
                </div>
                <div class="content1-dialog btn-right">
                    <el-button  class="item9 info" @click="close">关闭</el-button>
                    <el-button  class="item9 warning" @click="buttonyes">确认修改</el-button>
                </div>
            </div>
            <el-dialog
            title="保费修改"
            :visible.sync="dialogVisible"
            width="30%"
            append-to-body>
            <span>{{tipText}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifypremium" :disabled="disabled">确 定</el-button>
            </span>
            </el-dialog>
        </el-dialog>
	</div>
</template>

<script>
import {elevator} from '@/server/accidenServer.js';
import ProductService from '@/service/ProductService.js';
import moment from 'moment'
export default {
	data() {
		return {
			tipText: '确定要修改么？',
			Elevator:new elevator(),
			ProductService:new ProductService(),
			data2:{
				"afterPrem":0
			},
			value:0,
			disabled:false,
			fileId:'',
			dialogVisible:false,
			outerVisible:false,
            premiumDiscount:1,
            detailsFactor:[]
		}
	},
	created(){
	},
	methods: {
		async getappdetails(appCode = ''){
			let data ={
				'appCode':appCode
			};
			let res = await this.Elevator.getappdetails(data);
			if(res.code == '0000'){
                this.getPolicyFactorsDetails(appCode)
                this.outerVisible = true
				this.data2 = res.data;
				this.value = res.data.afterPrem;
				if(this.data2.holder.corporation){
					this.data2.holdername = this.data2.holder.corporation.name;
				}else{
					this.data2.holdername = this.data2.holder.human.name;
				};
                if(res.data.financeStatus !== '00') {
					this.$message.error('此订单到账不允许更改保费，2s自动关闭')
					setTimeout(()=>{
						this.outerVisible =  false;
						this.$emit('successCallback')
					},2000)
					return
				}
			}
		},
		async getPolicyFactorsDetails(appCode = ''){
			let res = await this.Elevator.getPolicyFactorsDetails(appCode);
			if(res.code == '0000'){
                let premiumDiscount = res.data[0].factorInfos.find(item=>item.factorCode == '21YZ2448382734566166233')
                this.premiumDiscount = premiumDiscount ? Number(premiumDiscount.stringFactor) * 100 : 1
                this.detailsFactor = res.data[0]
			}
		},
		async buttonyes(){
			let Reg = /^\d+(\.\d{0,2})?$/;
			if(this.value <= 0){
				this.$message({
					message: '修改后的投保单金额必须大于0',
					type: 'warning'
				});
				this.disabled = false;
				return;
			}else if(!Reg.test(this.value)){
				this.$message({
					message: '修改后的投保单金额最多保留两位小数',
					type: 'warning'
				});
				this.disabled = false;
				return;
			}else if(this.value > this.data2.beforePrem*8){
				this.$message({
					message: '修改后的投保单金额最多是原投保单金额的8倍',
					type: 'warning'
				});
				this.disabled = false;
				return;
			}else{
				this.dialogVisible = true;
			}
		},
		close(){
			this.outerVisible = false
		},
		async modifypremium(){
			this.disabled = true;
			
            let data = {
                "operatorId": window.sessionStorage.getItem('userCode'),
                "operatorName ": window.sessionStorage.getItem('userName'),
                "premiumFactorQos": [
                    {
                    "fieldCode": "21YZ2448382734566166233",
                    "fieldName": "",
                    "fieldValue": this.premiumDiscount / 100,
                    "rate": "",
                    "tapplicationFormId": ""
                    }
                ]
            }
            // 
			const res = await this.Elevator.updatePremiumFactors(this.data2.applicationFormCode,data);
			if(res.code == '0000'){
                let reducePrem = (this.data2.afterPrem*100 - this.value*100)/100;
                this.data2.riskList[0].afterPrem = (this.value*100)/100;
                this.data2.riskList[0].beforePrem = this.data2.afterPrem;
                this.data2.riskList[0].actualPrem  = (this.value*100)/100;
                let dataPrem = {
                    'afterPerm':(this.value*100)/100,// 实际价格
                    'applicationFormCode': this.data2.applicationFormCode, //投保单code
                    'beforePerm':this.data2.afterPrem, // 原价格
                    'operatorId': window.sessionStorage.getItem('userCode'), // 操作人code
                    'operatorName': window.sessionStorage.getItem('userName'), // 操作人姓名
                    'orderCode':this.data2.orderCode,
                    'permComputeType': '00', // 优惠计算方式: 00:数值
                    'reducePrem': reducePrem, //优惠金额
                    "riskList":this.data2.riskList
                };
                const resPrem = await this.Elevator.applicationforms(dataPrem);
                if(resPrem.code == '0000') {
                    this.$message({
						message: '修改成功',
						type: 'success'
					});
                    this.disabled = false;
                    this.outerVisible =  false;
                    this.dialogVisible = false;
                    this.$emit('successCallback')
                }
			}else{
				this.disabled = false;
				return;
			}
        },
        /**
         * 计算保费
         */
        async calculationPremium() {
            console.log(this.detailsFactor);
            this.detailsFactor.factorInfos.forEach(item => {
                if(item.factorCode == '21YZ2448382734566166233') {
                    item.stringFactor = this.premiumDiscount / 100
                }
            })
            let params = [{
                "productCode": this.detailsFactor.productCode,	
                "insuranceVOS": this.detailsFactor.insuranceVOS,
                "factorInfos": this.detailsFactor.factorInfos,
                "policyNo":'',
                "renewalStatus":"1",								
                "channelNo": "sequip"								
            }];
            let res = await this.ProductService.premium(params)
            if(res.code == '0000') {
                console.log(res);
                this.value = res.data.totalPremium
            }

        }
	},
}

</script>

<style lang="less" scoped>
#shortTermlist {
	// padding-top: 20px;
	// padding-bottom: 80px;
	background-color: #f2f1ef;
	.content-dialog{
		width: 96%;
		background-color: #ffffff;
		.content1-dialog{
			width: 100%;
			min-height: 60px;
			margin-bottom: 30px;
			color: #666666;
			.item1{
				height: 60px;
				line-height: 60px;
				box-sizing: border-box;
				font-weight: 600;
			}
			.item2{
				font-size: 14px;
				color: #666666;
				.item3{
					margin-right: 10px;
				}
				.item4{
					color: #333333;
					font-weight: 500;
				}
				.item5{
					color: #FF3000;
					font-weight: 500;
				}
				.item6{
					color: #333333;
					font-weight: 500;
				}
			}
			.item2 p{
				line-height: 40px;
			}
			.updataPremium {
                line-height: 40px;
                margin: 0 40px;
                margin-right: 0;
                padding-bottom: 20px;
                border-bottom:2px dashed #ccc;
                .updataPremium-title {
                    display: flex;
                    font-size: 16px;
                    font-weight: 700;
                    p:first-child{
                        width: 180px;   
                    }

                }
                .updataPremium-content {
                    p:first-child{
                        width: 180px;   
                    }
                }
			}
			.item9{
				width: 150px;
				height: 40px;
                margin-left: 40px;
                border-radius:30px;
            }
            .info {
                background-color: #F5F5F5;
                color: #000;
                border-color: #F5F5F5;
            }
            .warning {
                background-color: #FFA940;
                color: #fff;
                border-color: #FFA940;
            }
        }
        .btn-right {
            text-align: right;
            margin-top: 40px;
            margin-bottom: 0px;
        }
	}
}
</style>