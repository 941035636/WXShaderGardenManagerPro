<template>
	<div id="batchManagement1" class="batch-management">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">保单批单号：</span>
						<el-input v-model.trim="value1" placeholder="请输入保单号、批单号、批单申请号" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">投保人：</span>
						<el-input v-model.trim="value7" placeholder="请输入投保人" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
                <el-col :span="8">
					<div style="display:flex;">
						<span class="item3">签单日期：</span>
						<el-date-picker type="date" placeholder="开始日期" v-model="value6" size="small" class="item5" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<span class="item1">至</span>
						<el-date-picker type="date" placeholder="结束日期" v-model="value66" size="small" class="item5" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
					</div>
				</el-col>
			</el-row>
			<div class="elesearch-btn">
				<span @click="searchview" class="query-button">查询</span>
				<span @click="empty" class="empty-button">清空筛选条件</span>
			</div>
		</div>


		<div class="content-table">
			<div class="content">
				<div class="content-title">
					<el-row type="flex" class="row-bg">
						<el-col :span="7">
							<div style="padding-left:10px;box-sizing: border-box;">
								批单信息
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding-left:10px;box-sizing: border-box;">
								申请方式/批单类型
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding-left:10px;box-sizing: border-box;">
								批单金额/状态
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding-left:10px;box-sizing: border-box;">
								申请日期/操作人
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding-left:10px;box-sizing: border-box;">
								保单信息
							</div>
						</el-col>
						<el-col :span="2">
							<div style="padding-left:10px;box-sizing: border-box;">
								操作
							</div>
						</el-col>
					</el-row>
				</div>
				<div v-if="data1.length == 0" class="no-data">
					暂无数据
				</div>
				<div class="content-item" v-for="(item,index) in data1" :key="index" v-else>
					<el-row type="flex" class="row-bg">
						<el-col :span="7">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span class="col-blue">{{item.holderName}}</span></p>
								<p><span class="mr20">批单申请号：{{item.applyNo}}</span></p>
								<p><span>批单期间：{{item.startDate}} - {{item.endDate}}</span></p>
								<p><span class="mr20" v-if="item.issueDate">签单日期：{{item.issueDate}}</span><span v-if="item.endorsementsNo">批单号：<span class="col-blue cur-op"  @click="BatchDownload(item)">{{item.endorsementsNo}}</span></span></p>
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p>
									<span v-if="item.endorsementsMode=='01'">在线批单</span>
									<span v-if="item.endorsementsMode=='02'">线下批单</span>
									<span v-if="item.endorsementsMode=='03'">半线上批单</span>
								</p>
								<p>
									<span class="col-org" v-if="item.endorsementsType=='01'">一般性批改</span>
									<span class="col-org" v-if="item.endorsementsType=='03'">批增</span>
									<span class="col-org" v-if="item.endorsementsType=='02'">批减</span>
									<span class="col-org" v-if="item.endorsementsType=='04'">批退</span>
									<span class="col-org" v-if="item.endorsementsType=='10'">替换人员</span>
								</p>
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p>
									<span :class="[item.status=='04' || item.status=='06' || item.status=='99' ?'col-grey':'col-gre']">{{item.batchStatus}}</span> / 
									<span class="col-grey" v-if="item.payStatus == '01'">未支付</span>
									<span class="col-gre" v-if="item.payStatus == '02'">已支付</span>
									<span class="col-grey" v-if="item.payStatus == '03'">支付失败</span>
									<span class="col-grey" v-if="item.payStatus == '04'">线下支付</span>
								</p>
								<p v-if="item.batchPremium"><span class="col-red">￥{{item.batchPremium}}</span></p>
								<p v-else><span class="col-grey">￥{{item.batchPremium}}</span></p>
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span>{{item.applyDate}}</span></p>
								<p v-if="item.operateName"><span>操作人：{{item.operateName}}</span></p>
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span>{{item.productName}}</span></p>
								<p><span>保单号：<span class="col-blue cur-op" @click="accessPolicyDetails(item)">{{item.insuranceNo}}</span></span></p>
							</div>
						</el-col>
						<el-col :span="2">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span class="col-blue cur-op" @click="reviewed(item)">审核</span></p>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
        <el-dialog title="审核" :visible.sync="centerDialogVisible" width="35%" center>
            <el-form label-position="right" label-width="100px" :model="sigleData">
                <el-form-item label="投保人：">
                    <span class="col-blue">{{sigleData.holderName}}</span>
                </el-form-item>
                <el-form-item label="批单申请号：">
                    <span class="col-blue">{{sigleData.applyNo}}</span>
                </el-form-item>
                <el-form-item label="批单期间：">
                    <span>{{sigleData.startDate}} - {{sigleData.endDate}}</span>
                </el-form-item>
                <el-form-item label="签单日期：" v-if="sigleData.issueDate">
                    <span>{{sigleData.issueDate}}</span>
                </el-form-item>
                <el-form-item label="批改类型：">
                    <span  v-if="sigleData.endorsementsType=='01'">一般性批改</span>
                    <span  v-if="sigleData.endorsementsType=='03'">批增</span>
                    <span  v-if="sigleData.endorsementsType=='02'">批减</span>
                    <span  v-if="sigleData.endorsementsType=='04'">批退</span>
                    <span  v-if="sigleData.endorsementsType=='10'">替换人员</span>
                </el-form-item>
                <el-form-item label="批单金额：">
                    <p v-if="sigleData.batchPremium"><span class="col-red">￥{{sigleData.batchPremium}}</span></p>
                    <p v-else><span class="col-grey">￥{{sigleData.batchPremium}}</span></p>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="brown1" @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" class="brown" @click="confirmPd">确 认</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import publicConfiguration from '../../global/publicConfiguration.js';
import batchStatus from '../../../static/data/batchStatus.json';
import paymentStatus from '../../../static/data/paymentStatus.json';
import methodApplication from '../../../static/data/methodApplication.json';
import battenType from '../../../static/data/battenType.json';
import product from './data/gzProductList.json';
import productClassification from './data/productClassification.json';
import ResourcesService from '../../service/ResourcesService.js'
export default {
	data() {
		return {
			Elevator:new elevator(),
			publicConfiguration:new publicConfiguration(),
			ResourcesService:new ResourcesService(),
            value1:'',
			value21:'',
			value22:'',
			value3:'',
			value6:'',
			value66:'',
			value7:'',
			options1:[],
			data1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			state:0,
			currentPage:1,
            datas:[],
            sigleData:{},
            centerDialogVisible:false
		}
	},
	created(){
		this.types();
		if(window.localStorage.getItem('index') == '5'){
			this.gettingCache();
		}else{
			window.localStorage.removeItem('data');
			this.prerecordlist();
		}
	},
	methods: {
		async accessPolicyDetails(row){ // 电子保单
			let data = {
				"bizCodeType": "01",
				"policyNo":row.insuranceNo,
				"resCode": "A002"
			}
			const parmes = await this.Elevator.getResourcesID(data);
			if(parmes.code =='0000'){
				if(parmes.list.length != 0){
					let res = await this.ResourcesService.downloadOrViewFile(parmes.list[0].fileUrl,true)
				}else{
					this.$message({
						message: '还没有电子保单！！！',
						type: 'warning'
					});
				}
			}
		},
		async BatchDownload(row){
			let parmes = await this.Elevator.getDet(row.applyNo);
			if(parmes.code =='0000'){
				let res = await this.ResourcesService.downloadOrViewFile(parmes.data.fileInfoVOS[0].preSignUrl,true)
			}
		},
		types(){
			this.options1 = batchStatus.data;
			this.datas = JSON.parse(window.sessionStorage.getItem('list'));
			// if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
			// 	return;
			// }else{
			// 	for(var i=0;i<this.options.length;i++){
			// 		for(var j=0;j<this.options[i].children.length;j++){
			// 			this.options[i].children[j].disabled = true;
			// 			if(window.sessionStorage.getItem('branchCode') == this.options[i].children[j].branchCode){
			// 				this.options[i].children[j].disabled = false;
			// 			};
			// 			if(window.sessionStorage.getItem('branchCode') == 'JT0167001' || window.sessionStorage.getItem('branchCode') == 'JT0113001'){
			// 				if(this.options[i].children[j].branchCode == 'JT0167001' || this.options[i].children[j].branchCode == 'JT0113001'){
			// 					this.options[i].children[j].disabled = false;
			// 				}
			// 			}
			// 		}
			// 	}
			// }
		},
		async prerecordlist(){
			var data = {};
			data = {
				'channelCode':'sequip',
				'endorseStatus':'05',
				'endorsementsType':'',
				'issueDateStartTime':this.value6,
				'issueDateEndTime':this.value66,
				'pn':this.pageNum,
				'ps':this.pagesize,
				'productCode':this.value22,
				'queryConditions':this.value1,
				'userCode':'',
				'branchScope':window.sessionStorage.getItem('authDataInfo') ? window.sessionStorage.getItem('authDataInfo') == 'JT0000' ? '000000' : window.sessionStorage.getItem('authDataInfo') : window.sessionStorage.getItem('branchCode'),
				'branchCode':'',
				'endorsementMode':'',
				'holderName': this.value7
			}
			let index = '51';
			window.localStorage.setItem('data51',JSON.stringify(data));
			window.localStorage.setItem('index',index);
			let res = await this.Elevator.getapprovaldatalist(data);
			if(res.code == '0000'){
				this.data1 = res.list;
				this.total = res.total;
				for(var i=0;i<this.data1.length;i++){
					for(var j=0;j<product.data.length;j++){
						if(this.data1[i].productCode == product.data[j].productCode){
							this.data1[i].index = '1';
						}
					}
					for(var t=0;t<batchStatus.data.length;t++){
						if(this.data1[i].status == batchStatus.data[t].value){
							this.data1[i].batchStatus = batchStatus.data[t].label;
						}
					}
				}
			}
		},
		gettingCache(){
            let data = JSON.parse(window.localStorage.getItem('data51'));
            if(data) {
                this.value1 = data.queryConditions;
                this.value3 = data.endorseStatus;
                this.value6 = data.issueDate;
                this.pageNum = data.pn;
                this.currentPage = data.pn;
            }
			this.prerecordlist();
		},
		searchview(){
			this.pageNum = 1;
			this.currentPage = 1;
			this.prerecordlist();
		},
		empty(){
			this.value1='';
			this.value3='';
			this.value6='';
			this.value66='';
			this.value7 = '';
			this.pageNum = 1;
			this.currentPage = 1;
			this.prerecordlist();
		},
		handleCurrentChange: function(pageNum){
		    this.pageNum = pageNum;
			this.prerecordlist();
		},
		detailedList(row){
			this.$router.push({
				path:'/detailedList',
				query:{
					applyNo:row.applyNo
				}
			})
		},
        reviewed(item) {
            this.sigleData = item;
            this.centerDialogVisible = true;
        },
        async confirmPd() {
            let obj = {
                "applyNo": this.sigleData.applyNo,
                "auditDesc": "",
                "auditStatus": "1",
                "endorseStatus": '02',
                "fileInfoVO": [],
                "operateName": window.sessionStorage.getItem('userName')
            }
            let res = await this.Elevator.postPDAudit(obj);
            if(res.code == '0000') {
                this.$message({
                    message: '审核成功！',
                    type: 'success'
                });
                this.centerDialogVisible = false;
                this.sigleData = {};
                this.prerecordlist();
            }
        }
	},
}

</script>

<style lang="less" scoped>
#batchManagement1 {
	padding-bottom: 80px;
	min-height: 1000px;
	box-sizing: border-box;
	.elesearch{
		width: calc(100% - 40px);
		min-height: 234px;
		padding: 20px 20px 10px;
		margin: 20px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;	
		.row-bg{
			margin-bottom: 20px;
			line-height: 40px;
			.item1{
				display: block;
				width: 8%;
				text-align: center;
			}
			.item2{
				width: 70%;
			}
			.item3{
				font-size: 14px;
				color: #666666;
				display: block;
				width: 25%;
				text-align: right;
				padding-right: 10px;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.item5{
				width: 31%;
			}
		}
		.elesearch-btn{
			width: 100%;
			height: 100%;
			text-align: center;
			color: #ffffff;
			.query-button{
				display: inline-block;
				width: 120px;
				height: 40px;
				background-color: #f3ac56;
				text-align: center;
				line-height: 40px;
				margin-right: 40px;
				color: #ffffff;
				font-weight: 600;
				cursor: pointer;
				border-radius: 60px;
			}
			.empty-button{
				display: inline-block;
				width: 120px;
				height: 40px;
				border: 1px solid #e9e9e9;
				text-align: center;
				line-height: 40px;
				color: #999;
				background-color: #e9e9e9;
				font-weight: 600;
				box-sizing: border-box;
				cursor: pointer;
				border-radius: 60px;
			}
		}
	}
	.content-up{
		width: 100%;
		text-align: right;
		padding: 0 30px 20px;
		box-sizing: border-box;
	}
	.no-data{
		width: 100%;
		height: 100%;
		line-height: 70px;
		font-size: 16px;
		color: #999;
		font-weight: 500;
		text-align: center;
	}
	.content-table{
		width: 100%;
		height: 100%;
		padding:0 20px;
		margin-top: 20px;
		box-sizing: border-box;
		.content{
			width: 100%;
			height: 100%;
			padding:0 20px 20px;
			box-sizing: border-box;
			background-color: #ffffff;
			.content-title{
				width: 100%;
				height: 60px;
				line-height: 60px;
				font-size: 14px;
				color: #333333;
				font-weight: 600;
				border-bottom: 1px solid #F1EEE9;
			}
			.content-item{
				width: 100%;
				border-bottom: 1px solid #F1EEE9;
				box-sizing: border-box;
				p{
					line-height: 30px;
				}
			}
		}
	}
	.content-total{
		width: 100%;
		height: 60px;
		padding: 0 30px 20px;
		box-sizing: border-box;
		line-height: 60px;
		text-align: right;
		margin-top: 30px;
	}
	.col-red {
		color: #f5222d;
	}
	.col-blue {
		color: #096dd9;
	}
	.col-org {
		color: #fa8c16;
	}
	.col-gre {
		color: #389e0d;
	}
	.col-grey {
		color: #919191;
	}
	.cur-op {
		cursor: pointer;
    }
    .brown {
        background-color: #C9984A;
        border-radius: 20px;
        width: 100px;
        border-color: #C9984A;
    }
    .brown1 {
        background-color: #bbbbbb;
        border-radius: 20px;
        width: 100px;
        color: #fff;
        border-color: #bbbbbb;
    }
}
</style>
<style lang="less">
    #batchManagement1 { 
        .el-dialog__title {
            font-size: 22px;
            font-weight: 700;
        }
    }
</style>
