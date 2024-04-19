<template>
	<div class="payOnlineInformation" id="payOnlineInformation">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">投保人名称</span>
						<el-input placeholder="请输入投保人名称" v-model.trim="data.ext2" class="item2" clearable></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">投保单号</span>
						<el-input placeholder="请输入" v-model.trim="data.orderSubNo" class="item2" clearable></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">订单号</span>
						<el-input placeholder="请输入" v-model.trim="data.orderNo" class="item2" clearable></el-input>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">商户订单号</span>
						<el-input placeholder="请输入商户订单号" v-model.trim="data.id" class="item2"  clearable></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">交易类型</span>
						<el-select v-model="data.tradeType" placeholder="请选择交易类型" class="item2" clearable>
							<el-option v-for="item in options6" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">交易渠道</span>
						<el-select v-model="payChannelCode1" placeholder="请选择交易渠道" class="item2" clearable>
							<el-option v-for="item in options5" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8" v-if="showBranch">
					<div>
						<span class="item3">分公司机构</span>
						<el-select v-model="data.branchCode" placeholder="请选择分公司机构" class="item2"  clearable>
							<el-option v-for="item in options4" :key="item.branchCode" :label="item.branchName" :value="item.branchCode"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">交易流水号</span>
						<el-input placeholder="请输入交易流水号" v-model.trim="data.paySerialNo" class="item2"  clearable></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">交易时间</span>
						<el-date-picker  v-model="data.tradeStartTime" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<span>至</span>
						<el-date-picker  v-model="data.tradeEndTime" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
					</div>
				</el-col>
			</el-row>
			<div class="elesearch-btn">
				<span @click="searchview" class="query-button">查询</span>
				<span @click="empty" class="empty-button">清空</span>
			</div>
		</div>
		<div class="content1">
			<p class="content1-p">共查询到 <span style="color: #FA8C16">{{total}}</span>  条记录</p>
			<div class="contoent1-btn">
				<el-button v-if="datas.find(item => item.key == '50002')" class="contoent1-btn-left"  type="primary" size="small" @click="exports">导出</el-button>
				<el-button v-if="datas.find(item => item.key == '50003')" class="contoent1-btn-right"  type="primary" size="small" @click="dialogVisible=true">财务对账</el-button>
			</div>
			
		</div>
		<div class="content-table">
			<el-table :data="tableList" style="width: 100%; padding-left:10px" highlight-current-row show-header  :header-cell-style="getRowClass" fit  >
				<el-table-column  label="交易信息"  min-width="180">
					<template slot-scope="scope">
						<P>{{scope.row.ext2}}</P>
						<P v-if="scope.row.paySerialNo">流水号：{{scope.row.paySerialNo}}</P>
						<P>商户订单号：{{scope.row.id}}</P>
					</template>
				</el-table-column>
				<el-table-column  label="交易类型" align="center">
					<template slot-scope="scope">
						<P v-if="scope.row.tradeType == '0'">支付</P>
						<P v-else>退款</P>
					</template>
				</el-table-column>
				<el-table-column  label="交易渠道" align="center">
					<template slot-scope="scope">
						<P>
							<span v-if="scope.row.payChannelCode == 'vbao'">微保</span>
							<span v-if="scope.row.payChannelCode == 'weixin'">微信支付</span>
							<span v-if="scope.row.payChannelCode == 'vbao' && scope.row.paySubChannelCode  == 'ali'">- 支付宝</span>
							<span v-if="scope.row.payChannelCode == 'vbao' && scope.row.paySubChannelCode  == 'weixin'">- 微信</span>
						</P>
						<P>{{scope.row.branchName}}</P>
					</template>
				</el-table-column>
				<el-table-column label="交易状态/金额" align="center">
					<template slot-scope="scope">
						<P class="col-red" v-if="scope.row.tradeType == '0'">￥{{(scope.row.tradeAmount/100)}}</P>
						<P class="col-blue" v-if="scope.row.tradeType == '1'">￥{{-(scope.row.tradeAmount/100)}}</P>
						<div v-if="scope.row.tradeType == '0'">
							<P v-if="scope.row.tradeStatus == '1'" class="col-gre">支付成功</P>
							<P v-else-if="scope.row.tradeStatus == '2'" class="col-gery">支付失败</P>
							<P v-else class="col-gery">未支付</P>
						</div>
						<div v-if="scope.row.tradeType == '1'">
							<P v-if="scope.row.tradeStatus == '0'" class="col-gery">退款提交</P>
							<P v-if="scope.row.tradeStatus == '1'" class="col-gery">退款处理中</P>
							<P v-if="scope.row.tradeStatus == '2'" class="col-org">退款成功</P>
							<P v-if="scope.row.tradeStatus == '3'" class="col-gery">退款失败</P>
						</div>
						
					</template>
				</el-table-column>
				<el-table-column  label="日期"  min-width="180">
					<template slot-scope="scope">
						<P>交易时间：{{scope.row.tradeSubmitTime}}</P>
						<P v-if="scope.row.tradeTime">支付完成：{{scope.row.tradeTime}}</P>
					</template>
				</el-table-column>
				<el-table-column  label="订单信息"  min-width="180">
					<template slot-scope="scope">
						<P>{{scope.row.goodsName}}</P>
						<P>订单号：{{scope.row.orderNo}}</P>
						<P>投保单号：{{scope.row.orderSubNo}}</P>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<el-dialog
			title="财务对账"
			:visible.sync="dialogVisible"
			width="30%"
			:before-close="handleClose">
			<el-form  label-width="100px" class="demo-ruleForm" >
				<el-form-item label="下载模板:">
					<span class="exports-btn" @click="downloadTemp">导入模板下载</span>
				</el-form-item>
				<el-form-item label="导入模板:">
					<el-upload class="upload-demo" action="#" :http-request="Upload" multiple :file-list="fileList" :show-file-list="false" :limit="1" :before-upload="beforeAvatarUpload" accept=".xlsx , .xls" :on-exceed="onExceed">
						<span class="exports-btn"> 选择模板文件</span>
					</el-upload>
					<span>只能上传excel文件</span>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
				<el-button type="primary" @click="dialogVisible = false">返 回</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import ResourcesService from '../../service/ResourcesService.js';
import publicConfiguration from '../../global/publicConfiguration.js';
import policyStatus from '../../../static/data/policyStatus.json';
import NumberType from '../../../static/data/NumberType.json';
import mechanismCode from './data/mechanismCode.json';
import productClassification from './data/productClassification.json';
export default {
	data() {
		return {
			Elevator:new elevator(),
			publicConfiguration:new publicConfiguration(),
			ResourcesService:new ResourcesService(),
			showBranch:true,
			title:'收回',
			icon:'el-icon-arrow-up',
			tableList:[],
			datas:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			optionSelect:{
				type:'',
				types:''
			},
			options:[
				{
					"value":"1",
					"label":"投保单号"
				},
				{
					"value":"2",
					"label":"保单号"
				},
				{
					"value":"3",
					"label":"订单号"
				}
			],	// 区分订单、投保单、保单
			options3:[],	// 产品名称
			options4:[],	// 分支机构
			options5:[],	// 交易渠道
			options6:[],	// 交易类型
			data:{
				"bizChannelCode":'sequip',//渠道编码
				'payChannelCode': '',//vbao--微保;ali --支付宝;weixin--微信;allin --通联, ums--银联商务
				"paySubChannelCode":'',//ali--支付宝,weixin--微信APP,nocard--无卡,unionpay--银联, public--公众号支付
				"orderSubNo":'',//投保单号
				"orderNo":'',//订单号
				"ext2":'',//投保人名称
				"id":'',//商户订单号 ,支付中心字段为id
				"paySerialNo":'',//交易流水号
				"tradeStartTime":'',//交易开始时间 格式：yyyy-MM-dd HH:mm:ss
				"tradeEndTime":'',//交易结束时间 格式：yyyy-MM-dd HH:mm:ss
				"tradeType":'',//交易类型, 0--支付, 1--退款
				"branchCode":'',//业务部门编码
				'ps':'10',
				'pn':'1'
			},
			payChannelCode1:'',
			dialogVisible:false,
			fileList:[]
		}
	},
	created(){
		this.policyStatu();
	},
	methods: {
		policyStatu(){ //根据权限获取配置文件
			this.options3 = productClassification.data;
			this.options4 = mechanismCode.data;
			this.options5 = [{
				"value": "weixin",
				"label": "微信支付"
			},{
				"value": "vbao",
				"label": "微保-微信"
			},{
				"value": "vbao1",
				"label": "微保-支付宝"
			}]
			this.options6 = [{
				"value": "0",
				"label": "支付"
			},{
				"value": "1",
				"label": "退款"
			}]
			this.datas = JSON.parse(window.sessionStorage.getItem('list'));
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				this.showBranch = true;
				return;
			}else{
				for(var i=0;i<this.options3.length;i++){
					for(var j=0;j<this.options3[i].children.length;j++){
						this.options3[i].children[j].disabled = true;
						if(window.sessionStorage.getItem('branchCode') == this.options3[i].children[j].branchCode){
							this.options3[i].children[j].disabled = false;
						};
						if(window.sessionStorage.getItem('branchCode') == 'JT0167001' || window.sessionStorage.getItem('branchCode') == 'JT0113001'){
							if(this.options3[i].children[j].branchCode == 'JT0167001' || this.options3[i].children[j].branchCode == 'JT0113001'){
								this.options3[i].children[j].disabled = false;
							}
						}
					}
				}
				this.showBranch = false;
				this.data.branchCode = window.sessionStorage.getItem('branchCode') == 'JT0144000' ? 'JT0144001' : window.sessionStorage.getItem('branchCode');
				for(var o=0;o<this.options4.length;o++){
					this.options4[o].disabled = true;
					if(window.sessionStorage.getItem('branchCode') == this.options4[o].branchCode){
						this.options4[o].disabled = false;
					}
				}
			}
		},
		exports(){ // 投保单导出
			if(!this.data.orderSubNo && !this.data.orderNo && !this.data.tradeStartTime && !this.data.tradeEndTime) {
				this.$message({
					message: '投保单号，订单号，(交易开始时间，交易结束时间)不能同时为空。',
					type: 'warning'
				});
				return
			}
			if(this.payChannelCode1 == 'vbao') {
				this.data.paySubChannelCode = 'weixin'
				this.data.payChannelCode = 'vbao'
			} else if(this.payChannelCode1 == 'vbao1') {
				this.data.paySubChannelCode = 'ali'
				this.data.payChannelCode = 'vbao'
			} else {
				this.data.paySubChannelCode = ''
				this.data.payChannelCode = this.payChannelCode1
			}
			var branchCode = '';
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				branchCode = '';
			}else{
				branchCode = window.sessionStorage.getItem('branchCode') == 'JT0144000' ? 'JT0144001' : window.sessionStorage.getItem('branchCode');
			}
			if(this.total <= 1000){
				let href = this.$apiUrl.PATINTO_ONLINE_EXPORT + '?ext2=' + this.data.ext2 + '&bizChannelCode=sequip&payChannelCode=' + this.payChannelCode1 + '&orderSubNo=' + this.data.orderSubNo + '&orderNo=' + this.data.orderNo + '&id=' + this.data.id + '&paySerialNo=' + this.data.paySerialNo + '&tradeStartTime=' + this.data.tradeStartTime + '&tradeEndTime=' + this.data.tradeEndTime + '&tradeType=' + this.data.tradeType + '&branchCode=' + this.data.branchCode + '&ps=1&pn=1';
				this.ResourcesService.exportsViewFile(href)
				this.$logger.info(
					'M3-002','',
					{
						'userName':window.sessionStorage.getItem('userName'),
						'branchName':window.sessionStorage.getItem('branchName'),
						'total':this.total,
					}
				);
			this.trackEvent('统计','导出流水');
			}else{
				this.$message({
					message: "数据量过大,超过100页,请缩小查询范围！",
						type: 'warning'
				});
			}
			
			// window.open(href,"_blank" )
		},
		// 下载模板
		downloadTemp(){
			let href = this.$apiUrl.TEMPLATEDOWNLOAD+"?productCode=reconciliation" 
			this.ResourcesService.exportsViewFile(href)
		},
		async policylist(){ // 获取支付信息列表
			if(!this.data.orderSubNo && !this.data.orderNo && !this.data.tradeStartTime && !this.data.tradeEndTime) {
				this.$message({
					message: '投保单号，订单号，(交易开始时间，交易结束时间)不能同时为空。',
					type: 'warning'
				});
				return
			}
			if(this.payChannelCode1 == 'vbao') {
				this.data.paySubChannelCode = 'weixin'
				this.data.payChannelCode = 'vbao'
			} else if(this.payChannelCode1 == 'vbao1') {
				this.data.paySubChannelCode = 'ali'
				this.data.payChannelCode = 'vbao'
			} else {
				this.data.paySubChannelCode = ''
				this.data.payChannelCode = this.payChannelCode1
			}
			var branchCode = '';
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				branchCode = '';
			}else{
				branchCode = window.sessionStorage.getItem('branchCode') == 'JT0144000' ? 'JT0144001' : window.sessionStorage.getItem('branchCode');
			}
			window.localStorage.setItem('data',JSON.stringify(this.data));
			let res = await this.Elevator.patintoOnline(this.data);
			if(res.code == '0000'){
				res.list.forEach(element => {
					element.branchName = this.options4.find(item => item.branchCode == element.branchCode) ? this.options4.find(item => item.branchCode == element.branchCode).branchName : ''
				});
				this.tableList = res.list;
				this.total = res.total;
			}
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.policylist();
		},
		empty(){ //清空
			this.data = {
				"bizChannelCode":'sequip',//渠道编码
				'payChannelCode': '',//vbao--微保;ali --支付宝;weixin--微信;allin --通联, ums--银联商务
				"paySubChannelCode":'',//ali--支付宝,weixin--微信APP,nocard--无卡,unionpay--银联, public--公众号支付
				"orderSubNo":'',//投保单号
				"orderNo":'',//订单号
				"ext2":'',//投保人名称
				"id":'',//商户订单号 ,支付中心字段为id
				"paySerialNo":'',//交易流水号
				"tradeStartTime":'',//交易开始时间 格式：yyyy-MM-dd HH:mm:ss
				"tradeEndTime":'',//交易结束时间 格式：yyyy-MM-dd HH:mm:ss
				"tradeType":'',//交易类型, 0--支付, 1--退款
				"branchCode":this.showBranch ? '' : window.sessionStorage.getItem('branchCode') == 'JT0144000' ? 'JT0144001' : window.sessionStorage.getItem('branchCode'),//业务部门编码
				'ps':'10',
				'pn':'1'
			}
			this.payChannelCode1 = '';
			this.pageNum = 1;
			this.currentPage = 1;
			this.tableList = [];
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.data.pn = pageNum
			this.policylist();
		},
		// 设置table表格头部样式
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#333333;"
			}
		},
		async Upload(file){ // 资料上传服务器
			this.$logger.info(
				'M3-003','',
				{
					'userName':window.sessionStorage.getItem('userName'),
					'branchName':window.sessionStorage.getItem('branchName'),
				}
			);
			const formData = new FormData();
			formData.append('file', file.file)
			let data = formData
			const res = await this.Elevator.postReconcilation(data);
			let fileName = this.ResourcesService.getFileName(res.headers['content-disposition']);
			let href = this.ResourcesService.getObjectURL(res.data)
			
			this.ResourcesService.downLoadA(href,fileName)
		},
		beforeAvatarUpload(file) {
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message.error('单文件上限10MB!');
            }
            return isLt10M;
		},
		onExceed(){
            // this.$message.warning('最多支持10个附件')
        },
		handleClose(){
            this.dialogVisible = false
        },


	},
}
</script>

<style lang="less" scoped>
#payOnlineInformation {
	padding-top: 10px;
	padding-bottom: 80px;
	// background-color: #ffffff;
	
	.mybox-leave-active,.mybox-enter-active{
	    transition:  all .5s linear; 
	}
	.mybox-leave-active,.mybox-enter{
	    height:0px !important;
	}
	.mybox-leave,.mybox-enter-active{
	    height: 250px;
	}
	.elesearchs{
		width: 96%;
		height: 40px;
		margin-left: 2%;
		text-align: right;
		margin-top:10px;
	}
	.elesearch{
		width: calc(100% - 40px);
		min-height: 234px;
		padding: 20px 20px 10px;
		margin: 20px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;	
		.row-bg{
			margin-bottom: 20px;
			.item1{
				width: 35%;
				margin-right: 10px;
			}
			.item2{
				width: 60%;
			}
			.item3{
				display: inline-block;
				width: 30%;
				text-align: right;
				font-size: 14px;
				color: #666666;
				margin-right: 10px;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.item4{
				width: 18%;
				margin-right: 10px;
			}
			.item5{
				width: 25%;
			}
			.query-button{
				width: 100px;
				height: 44px;
				float: right;
				font-weight: 600;
			}
			.empty-button{
				width: 130px;
				height: 44px;
				float: right;
				margin-left: 30px;
				background-color: #DCDCDC;
				color: #333333;
				font-weight: 600;
			}
		}
	}
	.elesearch-btn{
		width: 100%;
		height: 100%;
		text-align: center;
		color: #ffffff;
		margin-bottom: 50px;
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
	.content1{
		position: relative;
		height: 60px;
		background-color: #fff;
		width: calc(100% - 40px);
		margin: 20px 20px 0;
		.content1-p{
			line-height: 60px;
			padding-left: 20px;
		}
		.contoent1-btn{
			position: absolute;
			// margin-top: 10px;
			// margin-right: 20px;
			right: 20px;
			top: 20px;
			display: flex;
			.contoent1-btn-left{
				width: 100px;
				border-radius: 30px;
			}
			.contoent1-btn-right{
				width: 100px;
				border-radius: 30px;
				background-color: #FF9959;
				border: 1px solid #FF9959;
			}
		}
	}
	.content-table{
		width: calc(100% - 40px);
		margin: 0 20px ;
		background-color: #fff;
		.item5{
			font-size: 12px;
			text-decoration: underline;
			color: #4E80FF;
		}
		.el-dropdown-link{
			cursor:pointer;
		}
		.item15{
			color: #1581E8;
			text-decoration: underline;
			cursor:pointer;
		}
		p {
			line-height: 30px;
		}
	}
	.content-total{
		margin-top: 20px;
		width: 95%;
		height: 60px;
		line-height: 60px;
		text-align: right;
	}
	.item11{
		display: flex;
		height: 40px;
		line-height: 40px;
		margin-bottom: 20px;
		.item12{
			width: 25%;
			text-align: right;
			padding-right: 15px;
			box-sizing: border-box;
		}
		.item13{
			width: 65%;
		}
	}
	.col-red {
		color: #f5222d;
	}
	.col-blue {
		color: #1890ff;
	}
	.col-gery {
		color: #919191;
	}
	.col-org {
		color: #fa8c16;
	}
	.col-gre {
		color: #52c41a;
	}
	.exports-btn{
		color:#FFFFFF;
		background-color: #E6A23C;
		border:1px solid #E6A23C;
		padding: 3px 5px;
		border-radius: 2px;
		cursor: pointer;
	}
}
</style>
