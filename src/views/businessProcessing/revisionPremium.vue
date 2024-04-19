<template>
	<div class="shortTermlist" id="shortTermlist">
		<div class="content-title">修改保费</div>
		<div class="content">
			<div class="content1">
				<p class="item1">订单信息</p>
				<div class="item2">
					<span class="item3">订单号</span>
					<span class="item4">{{data2.orderCode}}</span>
					<span class="item3">订单生成时间</span>
					<span class="item4">{{data2.createDate}}</span>
				</div>
			</div>
			<div class="content1">
				<p class="item1">投保单信息</p>
				<div class="item2">
					<p><span class="item3">投保单号</span><span class="item4">{{data2.applicationFormCode}}</span></p>
					<p><span class="item3">投保人</span><span class="item4">{{data2.holdername}}</span></p>
					<p><span class="item3">投保产品</span><span class="item4">{{data2.productName}}</span></p>
					<p><span class="item3">保险期间</span><span class="item4">{{data2.startDate}}&nbsp;&nbsp;-&nbsp;&nbsp;{{data2.endDate}}</span></p>
					<p><span class="item3">投保单金额</span><span class="item5">￥{{data2.afterPrem.toFixed(2)}}</span></p>
					<p style="display:flex;"><span class="item3">投保单金额 (修改后)</span><el-input v-model.trim="value" style="width:200px;" size="small"></el-input></p>
				</div>
			</div>
			<div class="content1">
				<el-button type="warning" class="item9" @click="buttonyes">确认修改</el-button>
				<el-button type="info" class="item9" @click="close">关闭</el-button>
			</div>
		</div>
		<el-dialog
		title="保费修改"
		:visible.sync="dialogVisible"
		width="30%">
		<span>{{tipText}}</span>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="modifypremium" :disabled="disabled">确 定</el-button>
		</span>
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
		}
	},
	created(){
		this.getappdetails();
	},
	methods: {
		async getappdetails(){
			let data ={
				'appCode':this.$route.query.appCode
			};
			let res = await this.Elevator.getappdetails(data);
			if(res.code == '0000'){
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
						this.close()
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
			}else if(this.value > this.data2.beforePrem*2){
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
			window.location.href="about:blank";
			window.close();
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
						window.location.href="about:blank";
						window.close();
					}
				} else {
					this.$message({
						message: '修改成功',
						type: 'success'
					});
					this.disabled = false;
					window.location.href="about:blank";
					window.close();
				}
			}else{
				this.disabled = false;
				return;
			}
		},
	},
}

</script>

<style lang="less">
#shortTermlist {
	padding-top: 20px;
	padding-bottom: 80px;
	background-color: #f2f1ef;
	.content-title{
		width: 96%;
		height: 40px;
		margin-left: 2%;
		font-size: 20px;
		color: #333333;
		font-weight: bold;
	}
	.content{
		width: 96%;
		margin-left: 2%;
		padding-bottom: 80px;
		background-color: #ffffff;
		.content1{
			width: 100%;
			min-height: 60px;
			margin-bottom: 30px;
			color: #666666;
			.item1{
				padding: 0 20px;
				height: 60px;
				line-height: 60px;
				box-sizing: border-box;
				font-weight: 600;
			}
			.item2{
				margin-left: 40px;
				font-size: 14px;
				color: #666666;
				.item3{
					margin-right: 10px;
				}
				.item4{
					color: #333333;
					margin-right: 150px;
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
			.item9{
				width: 162px;
				height: 44px;
				margin-left: 40px;
			}
		}
	}
}
</style>