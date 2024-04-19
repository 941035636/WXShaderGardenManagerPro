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
					<p><span class="item3">保险期间 (修改后)</span><span class="item6">{{data2.startDate}}&nbsp;&nbsp;-&nbsp;&nbsp;</span><el-date-picker v-model="value1" type="date" placeholder="选择日期" style="width:200px;" size="small" value-format="yyyy-MM-dd" :picker-options="dealDateStartOptions" @change="changedate"></el-date-picker></p>
					<p style="display:flex; height:90px;">
						<span class="item3" style="line-height:90px;">上传短期凭证</span>
						<el-upload class="upload-demo" action="#" :http-request="Upload" :limit="1" :file-list="fileList" accept=" .pdf , .PDF ,.jpg , .JPG  , .png , .PNG , .jpeg , .JPEG">
							<el-button size="small">点击上传</el-button><span style="margin-left:20px;">{{name}}</span>
							<div slot="tip" class="el-upload__tip">请上传用户盖章确认的投保单影印件</div>
						</el-upload>
					</p>
					<p><span class="item3">投保单金额</span><span class="item5">￥{{data2.afterPrem.toFixed(2)}}</span></p>
					<div style="display:flex;">
						<p class="item3">投保单金额 (修改后)</p>
						<div>
							<div>
								<span class="item3">基本险：</span><el-input v-model.trim="value2" style="width:200px;margin-bottom:10px;" size="small" @change="NumChange"></el-input>
							</div>
							<div v-for="(item,index) in list" :key="index">
								<span class="item3">{{item.riskName}}：</span><el-input v-model.trim="item.afterPrem" style="width:200px;margin-bottom:10px;" size="small" @change="NumChange"></el-input>
							</div>
							<span class="item3">总保费：</span><span style="color:#333333;font-weight: bold;">￥{{value.toFixed(2)}}</span>
						</div>
					</div>
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
			<el-button type="primary" @click="AmendingPremium" :disabled="disabled">确 定</el-button>
		</span>
		</el-dialog>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import ResourcesService from '../../service/ResourcesService';
import moment from 'moment'
export default {
	data() {
		let that= this;
		return {
			tipText: '确定要修改么？',
			Elevator:new elevator(),
			ResourcesService:new ResourcesService(),
			data2:{
				"afterPrem":0
			},
			value1:'',
			value:0,
			value2:0,
			list:[],
			disabled:false,
			fileId:'',
			name:'',
			fileList:[],
			dealDateStartOptions:{ //时间选择
				disabledDate(time){
					let s = new Date(that.data2.startDate).getTime();
					let e = new Date(that.data2.endDate).getTime();
					return time.getTime() > e || time.getTime() < s;
				}
			},
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
				this.list = [];
				this.data2 = res.data;
				this.value1 = res.data.endDate;
				this.value = res.data.afterPrem;
				this.value2 = res.data.riskList[0].afterPrem;
				if(res.data.riskList.length > 1){
					this.list = res.data.riskList.slice(1,res.data.riskList.length)
				}
				if(this.data2.holder.corporation){
					this.data2.holdername = this.data2.holder.corporation.name;
				}else{
					this.data2.holdername = this.data2.holder.human.name;
				}
				if(res.data.financeStatus !== '00') {
					this.$message.error('此订单到账不允许更改保费，2s页面自动关闭')
					setTimeout(()=>{
						this.close()
					},2000)
					return
				}
			}
		},
		changedate(val){
			if(val != this.data2.endDate){
				this.value1 = val + " " + '23:59:59';
			}
		},
		async Upload(file){ // 图片上传
			this.fileList = [];
			let data = [file.file]
			const res = await this.ResourcesService.uploadFile('sequip-svc','shortInfo','0',data);
			if(res.code == '0000'){
				this.fileId = res.list[0].fileId;
				this.name = file.file.name;
			}
		},
		NumChange(){
			let num = 0; 
			if(this.list.length){
				this.list.forEach(item =>{
					num += item.afterPrem*100/100;
				})
				this.value = this.value2*100/100 + num
			}else{
				this.value = this.value2*100/100
			}
		},
		async buttonyes(){
			if(this.data2.applicationStatus == '07') {
				this.tipText = '确认修改并审核保费吗？'
			}
			let Reg = /^\d+(\.\d{0,2})?$/;
			if(this.value2 <= 0){
				this.$message({
					message: '修改后的基本险金额必须大于0',
					type: 'warning'
				});
				return;
			}else if(!Reg.test(this.value2)){
				this.$message({
					message: '修改后的基本险金额最多保留两位小数',
					type: 'warning'
				});
				return;
			}else if(this.value2 > this.data2.riskList[0].prem*2 && this.data2.insuredList[0].insuranceObjectVos.length < 20000){
				this.$message({
					message: '修改后的基本险金额最多是原基本险金额的2倍',
					type: 'warning'
				});
				return;
			}else if(this.list.length){
				for(var i=0;i<this.list.length;i++){
					let item = this.list[i]
					if(item.afterPrem < 0){
						this.$message({
							message: '修改后的' + item.riskName + '金额必须大于等于0',
							type: 'warning'
						});
						return;
					}else if(!Reg.test(item.afterPrem)){
						this.$message({
							message: '修改后的' + item.riskName + '金额最多保留两位小数',
							type: 'warning'
						});
						return;
					}else if(item.afterPrem > item.prem*2){
						this.$message({
							message: '修改后的' + item.riskName + '金额最多是原' + item.riskName + '金额的2倍',
							type: 'warning'
						});
						return;
					}
				}
				this.dialogVisible = true;
			}else{
				this.dialogVisible = true;
			}
		},
		close(){
			window.location.href="about:blank";
			window.close();
		},
		async modifypremium(){
			if(this.list.length){
				this.list.forEach(item =>{
					this.data2.riskList.forEach(ele =>{
						if(item.riskCode == ele.riskCode){
							item.afterPrem = (ele.afterPrem*100)/100;
							item.beforePrem = ele.beforePrem;
							item.actualPrem  = (ele.afterPrem*100)/100;
							item.riskType  = ele.riskFlag2;
						}
					})
				})
			}
			let reducePrem = (this.data2.afterPrem*100 - this.value*100)/100;
			this.data2.riskList[0].afterPrem = (this.value2*100)/100;
			this.data2.riskList[0].beforePrem = this.data2.riskList[0].beforePrem;
			this.data2.riskList[0].actualPrem  = (this.value2*100)/100;
			this.data2.riskList[0].riskType  = this.data2.riskList[0].riskFlag2;
			let data = {
				"afterPerm": (this.value*100)/100,
				"applicationFormCode": this.data2.applicationFormCode,
				"beforePerm": this.data2.afterPrem,
				"beforePolEndDate": this.data2.endDate,
				"fileId": this.fileId,
				"operatorId": window.sessionStorage.getItem('userCode'),
				"operatorName": window.sessionStorage.getItem('userName'),
				"orderCode": this.data2.orderCode,
				"permComputeType": "00",
				"polEndDate": this.value1,
				"polStartDate": this.data2.startDate,
				"reducePrem": reducePrem,
				"reduceProportion": 0,
				"riskList":this.data2.riskList
			};
			const res = await this.Elevator.modifypremium(data,this.data2.applicationStatus);
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
						this.dialogVisible = false;
						window.location.href="about:blank";
						window.close();
					}
				} else {
					this.$message({
						message: '修改成功',
						type: 'success'
					});
					this.disabled = false;
					this.dialogVisible = false;
					window.location.href="about:blank";
					window.close();
				}
			}else{
				this.disabled = false;
				return;
			}
		},
		AmendingPremium(){
			this.disabled = true; 
			if(this.value1 != this.data2.endDate){
				if(!this.fileId){
					this.$message({
						message: '请上传短期凭证',
						type: 'warning'
					});
					this.disabled = false;
					return;
				}
				this.modifypremium();
			}else{
				this.modifypremium();
			}
		},
	},
}

</script>

<style lang="less">
#shortTermlist {
	// padding-top: 20px;
	// padding-bottom: 80px;
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