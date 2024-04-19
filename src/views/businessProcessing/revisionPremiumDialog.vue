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
                    <p class="ml20"> <span style="color:red">*</span> 投保单保费</p>
                    <div class="updataPremium">
                        <div class="updataPremium-title"><p class="item3">费用类型</p> <p>金额</p></div>
                        <div class="updataPremium-content" style="display:flex;"><p class="item3">总保费</p> <p><el-input v-model.trim="value" style="width:200px;" size="small"> <template slot="append">元</template></el-input></p></div>
                    </div>
                    <p class="mt10 fr" style="height:20px"><span class="item3">投保单金额 (修改后)</span><span class="item5" style="color:#FF3000">￥{{value}}</span>元</p>
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
import {elevator} from '../../server/accidenServer.js';
import moment from 'moment'
export default {
	data() {
		return {
			tipText: '确定要修改么？',
			Elevator:new elevator(),
			data2:{
				"afterPrem":0
			},
			value:0,
			disabled:false,
			fileId:'',
			dialogVisible:false,
			outerVisible:false,
		}
	},
	props:{
            'productCode':String,
        },
	created(){},
	methods: {
		async getappdetails(appCode = ''){
            console.log(appCode);
			let data ={
				'appCode':appCode
			};
			let res = await this.Elevator.getappdetails(data);
			if(res.code == '0000'){
                this.outerVisible = true
				this.data2 = res.data;
				this.value = res.data.afterPrem;
				if(this.data2.holder.corporation){
					this.data2.holdername = this.data2.holder.corporation.name;
				}else{
					this.data2.holdername = this.data2.holder.human.name;
				};
				if(res.data.financeStatus !== '00') {
					this.$message.error('此订单到账不允许更改保费，2s页面自动关闭')
					setTimeout(()=>{
						this.outerVisible =  false;
						this.$emit('successCallback')
					},2000)
					return
				}
			}
		},
		async buttonyes(){
			if(this.data2.applicationStatus == '07') {
				this.tipText = '确认修改并审核保费吗？'
			}
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
			}else if(this.value > this.data2.beforePrem*2 && this.productCode != '20PR390298'){
				this.$message({
					message: '修改后的投保单金额最多是原投保单金额的2倍',
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
			let reducePrem = (this.data2.afterPrem*100 - this.value*100)/100;
			this.data2.riskList[0].afterPrem = (this.value*100)/100;
			this.data2.riskList[0].beforePrem = this.data2.afterPrem;
			this.data2.riskList[0].actualPrem  = (this.value*100)/100;
			let data = {
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
			const res = await this.Elevator.applicationforms(data);
			if(res.code == '0000'){
				if(this.data2.applicationStatus == '07') {
					let objData = [{
						applicationFormCode:this.data2.applicationFormCode,
						newStatus:'08',
						operator:window.sessionStorage.getItem('userCode'),
						type:'00',
						oriStatus:'',
						remarks:''
					}];
					let resOrder = await this.Elevator.appCodeAuth(objData);
					if(resOrder.code == '0000') {
						this.$message({
							message: '修改并审核成功',
							type: 'success'
						});
						this.tipText = '确定要修改么？';
                        this.disabled = false;
                        this.outerVisible =  false;
                        this.dialogVisible = false;
                        this.$emit('successCallback')
					}
				} else {
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