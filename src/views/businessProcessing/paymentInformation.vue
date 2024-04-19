<template>
	<div class="paymentInformation" id="paymentInformation">
		<div class="elesearchs">
			<el-button size="small" @click="takeBack" >{{title}}<i :class="icon"></i></el-button>
		</div>
		<transition name="mybox">
			<div class="elesearch" v-show="show">
				<div class="elesearch1">
					<el-row type="flex" class="row-bg">
						<el-col :span="6"><div>
							<span class="item2">投保人名称</span>
							<el-input placeholder="请输入投保人名称" v-model.trim="value1" class="item1" size="small" clearable></el-input>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">投保单号</span>
							<el-input placeholder="请输入投保单号" v-model.trim="value2" class="item1" size="small" clearable></el-input>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">保单号</span>
							<el-input placeholder="请输入保单号" v-model.trim="value3" class="item1" size="small" clearable></el-input>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">订单号</span>
							<el-input placeholder="请输入订单号" v-model.trim="value4" class="item1" size="small" clearable></el-input>
						</div></el-col>
					</el-row>
				</div>
				<div class="elesearch1">
					<el-row type="flex" class="row-bg">
						<el-col :span="6"><div>
							<span class="item2">产品</span>
							<el-cascader v-model="value5" :options="options3" @change="handleChange1" placeholder="请选择" class="item1" size="small" clearable></el-cascader>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">分公司机构</span>
							<el-select v-model="value6" placeholder="请选择分公司机构" class="item1" size="small" clearable>
								<el-option v-for="item in options4" :key="item.branchCode" :label="item.branchName" :value="item.branchCode"></el-option>
							</el-select>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">签单时间</span>
							<el-date-picker v-model="value7" type="daterange" @change="changes1" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable  class="item1" size="small"></el-date-picker>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">保险时间</span>
							<el-date-picker v-model="value8" type="daterange" @change="changes2" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable  class="item1" size="small"></el-date-picker>
						</div></el-col>
					</el-row>
				</div>
				<div class="elesearch1">
					<el-row type="flex" class="row-bg">
						<el-col :span="6"><div>
							<span class="item2">商户订单号</span>
							<el-input placeholder="请输入商户订单号" v-model.trim="value9" class="item1" size="small" clearable></el-input>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">支付时间</span>
							<el-date-picker v-model="value10" type="daterange" @change="changes" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable  class="item1" size="small"></el-date-picker>
						</div></el-col>
						<el-col :span="6"><div>
						</div></el-col>
						<el-col :span="6"><div>
						</div></el-col>
					</el-row>
				</div>
				<div class="elesearch2">
					<div class="item3">
						<el-button type="success" size="small" @click="searchview">查询</el-button>
						<el-button type="info" size="small" @click="empty">清空</el-button>
					</div>
				</div>
			</div>
		</transition>
		<div class="content1" v-if="datas.find(item => item.key == '50001')">
			<el-button type="primary" size="small" @click="exports">导出</el-button>
		</div>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit size='mini'>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="applicant_no" label="投保单号" align="center" min-width="180"></el-table-column>
				<el-table-column prop="policy_no" label="保单号" align="center" min-width="164"></el-table-column>
				<el-table-column prop="holder_name" label="投保人名称" align="center" min-width="180"></el-table-column>
				<el-table-column prop="issue_date" label="出单日期" align="center" min-width="180"></el-table-column>
				<el-table-column prop="policy_start_date" label="保险起期" align="center" min-width="180"></el-table-column>
				<el-table-column prop="policy_end_date" label="保险止期" align="center" min-width="180"></el-table-column>
				<el-table-column prop="trade_no" label="商户订单号" align="center" min-width="180"></el-table-column>
				<el-table-column prop="order_no" label="订单号" align="center" min-width="180"></el-table-column>
				<el-table-column prop="branch_name" label="分公司名称" align="center" min-width="180"></el-table-column>
				<el-table-column prop="product_name" label="产品名称" align="center" min-width="180"></el-table-column>
				<el-table-column prop="pay_amount" label="订单支付金额" align="center" min-width="180"></el-table-column>
				<el-table-column prop="pay_time" label="订单支付时间" align="center" min-width="180"></el-table-column>
				<el-table-column prop="pay_serial_no" label="支付渠道返回流水号" align="center" min-width="180"></el-table-column>
			 </el-table>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import ResourcesService from '../../service/ResourcesService.js';
import publicConfiguration from '../../global/publicConfiguration.js';
import policyStatus from '../../../static/data/policyStatus.json';
import mechanismCode from './data/mechanismCode.json';
import productClassification from './data/productClassification.json';
export default {
	data() {
		return {
			Elevator:new elevator(),
			publicConfiguration:new publicConfiguration(),
			ResourcesService:new ResourcesService(),
			show:true,
			title:'收回',
			icon:'el-icon-arrow-up',
            value1:'',
			value2:'',
			value3:'',
			value4:'',
			value5:[],
			value51:'',
			value52:'',
			value6:'',
			value7:[],
			value71:'',
			value72:'',
			value8:[],
			value81:'',
			value82:'',
			value9:'',
			value10:[],
			value101:'',
			value102:'',
			options3:[],
			options4:[],
			data1:[],
			datas:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
		}
	},
	created(){
		if(window.localStorage.getItem('index') == '8'){
			this.gettingCache();
		}else{
			window.localStorage.removeItem('data');
			this.policylist();
		}
		this.policyStatu();
	},
	methods: {
		policyStatu(){ //根据权限获取配置文件
			this.options3 = productClassification.data;
			this.options4 = mechanismCode.data;
			this.datas = JSON.parse(window.sessionStorage.getItem('list'));
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
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
				for(var o=0;o<this.options4.length;o++){
					this.options4[o].disabled = true;
					if(window.sessionStorage.getItem('branchCode') == this.options4[o].branchCode){
						this.options4[o].disabled = false;
					}
				}
			}
		},
		takeBack(){ // 搜索条件的展开与收回
			let data  = this.publicConfiguration.switchs(this.show);
			this.show = data.show;
			this.title = data.title;
			this.icon = data.icon;
		},
		handleChange1(value){ // 获取选择的产品
			if(value){
				this.value51 = value[0];
				this.value52 = value[1];
			}else{
				this.value5 = [];
				this.value51 = '';
				this.value52 = "";
			}
		},
		changes1(value){ // 签单时间
			if(value){
				this.value71 = value[0] + ' ' + '00:00:00';
				this.value72 = value[1] + ' ' + '23:59:59';
			}else{
				this.value7 = [];
				this.value71 = '';
				this.value72 = '';
			}
		},
		changes2(value){ // 保险时间
			if(value){
				this.value81 = value[0] + ' ' + '00:00:00';
				this.value82 = value[1] + ' ' + '23:59:59';
			}else{
				this.value8 = [];
				this.value81 = '';
				this.value82 = '';
			}
		},
		changes(value){ // 支付时间
			if(value){
				this.value101 = value[0] + ' ' + '00:00:00';
				this.value102 = value[1] + ' ' + '23:59:59';
			}else{
				this.value10 = [];
				this.value101 = '';
				this.value102 = '';
			}
		},
		exports(){ // 投保单导出
			var branchCode = '';
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				branchCode = '';
			}else{
				branchCode = window.sessionStorage.getItem('branchCode');
			}
			if(this.total <= 1000){
				let href = this.$apiUrl.PATOUT + '?channelCode=' + "6" + '&holderName=' + this.value1 + '&applicantNo=' + this.value2 + '&policyNo=' + this.value3 + '&orderNo=' + this.value4 + '&productCode=' + this.value52 + '&branchCode=' + (this.value6?this.value6:branchCode) + '&issueStartDate=' + this.value71 + '&issueEndDate=' + this.value72 + '&policyStartDate=' + this.value81 + '&policyEndDate=' + this.value82 + '&tradeNo=' + this.value9 + '&payStartDate=' + this.value101 + '&payEndDate=' + this.value102;
				this.$logger.info(
					'M3-001','',
					{
						'userName':window.sessionStorage.getItem('userName'),
						'branchName':window.sessionStorage.getItem('branchName'),
						'total':this.total,
					}
				);
				this.ResourcesService.exportsViewFile(href)
				this.trackEvent('统计','导出支付清单');
			}else{
				this.$message({
					message: "数据量过大,超过100页,请缩小查询范围！",
						type: 'warning'
				});
			}
		},
		async policylist(){ // 获取支付信息列表
			var branchCode = '';
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				branchCode = '';
			}else{
				branchCode = window.sessionStorage.getItem('branchCode');
			}
			let form = {
				'applicantNo':this.value2,//投保单号
				'branchCode':this.value6?this.value6:branchCode,//分公司编码
				'channelCode':"6",//数据中心渠道编码
				'holderName':this.value1,//投保人名称
				'issueStartDate':this.value71,//签单起期
				'issueEndDate':this.value72,//签单止期
				'orderNo':this.value4,//订单号
				'payStartDate':this.value101,//支付时间起期
				'payEndDate':this.value102,//支付时间止期
				'pn':this.pageNum,//页码
				'ps':this.pagesize,
				'policyStartDate':this.value81,//保险时间起期
				'policyEndDate':this.value82,//保险时间止期
				'policyNo':this.value3,//保单号
				'productCode':this.value52,
				'tradeNo':this.value9,
			};
			let index = '8';
			window.localStorage.setItem('data',JSON.stringify(form));
			window.localStorage.setItem('index',index);
			window.localStorage.setItem('value5',this.value51);
			let res = await this.Elevator.patinto(form);
			if(res.code == '0000'){
				this.data1 = res.list;
				this.total = res.total;
			}
		},
		gettingCache(){ //获取缓存查询条件
			let data = JSON.parse(window.localStorage.getItem('data'));
			this.value51 = window.localStorage.getItem('value5');
			this.value1 = data.holderName;
			this.value2 = data.applicantNo;
			this.value3 = data.policyNo;
			this.value4 = data.orderNo;
			this.value52 = data.productCode;
			if(this.value6){
				this.value6 = data.branchCode;
			}
			this.value71 = data.issueStartDate;
			this.value72 = data.issueEndDate;
			this.value81 = data.policyStartDate;
			this.value82 = data.policyEndDate;
			this.value9 = data.tradeNo;
			this.value101 = data.payStartDate;
			this.value102 = data.payEndDate;
			this.value5.push(this.value51);
			this.value5.push(this.value52);
			this.value7.push(this.value71);
			this.value7.push(this.value72);
			this.value8.push(this.value81);
			this.value8.push(this.value82);
			this.value10.push(this.value101);
			this.value10.push(this.value102);
			this.pageNum = data.pn;
			this.currentPage = data.pn;
			this.policylist();
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.policylist();
		},
		empty(){ //清空
			this.value1 = '';
			this.value2 = '';
			this.value3 = '';
			this.value4 = '';
			this.value5 = [];
			this.value51 = '';
			this.value52 = '';
			this.value6 = '';
			this.value7 = [];
			this.value71 = '';
			this.value72 = '';
			this.value8 = [];
			this.value81 = '';
			this.value82 = '';
			this.value9 = '';
			this.value10 = [];
			this.value101 = '';
			this.value102 = '';
			this.pageNum = 1;
			this.currentPage = 1;
			this.policylist();
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.policylist();
		},


	},
}

</script>

<style lang="less">
#paymentInformation {
	padding-bottom: 80px;
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
		// width: 96%;
		// height: 40px;
		// margin-left: 2%;
		// text-align: right;
		// margin-top:10px;

		height: 70px;
		text-align: right;
		width: calc(100% - 40px);
		padding: 20px 20px 10px;
		margin: 20px 20px 0;
		box-sizing: border-box;
		background-color: #fff;	
	}
	.elesearch{
		// width: 96%;
		// height: 250px;
		// margin-left: 2%;
		// box-sizing: border-box;
		// overflow: hidden;

		width: calc(100% - 40px);
		min-height: 234px;
		padding: 20px 20px 10px;
		margin: 0px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;	
		.elesearch1{
			width: 100%;
			.item1{
				width: 220px;
				margin-top: 5px;
			}
			.item4{
				width: 106px;
				margin-top: 5px;
			}
			.item2{
				display: block;
				width: 200px;
				line-height: 25px;
				padding-left:1em;
				box-sizing: border-box;
				font-size: 12px;
			}
		}
		.elesearch2{
			width: 100%;
			height: 30px;
			margin-top: 10px;
			margin-bottom: 10px;
			.item3{
				width: 100%;
				text-align: right;
				box-sizing: border-box;
			}
		}
	}
	.content1{
		width: 96%;
		margin-top: 20px;
		height: 35px;
		text-align: right;
		margin-left:2%;
	}
	.content-table{
		width: calc(100% - 40px);
		margin: 20px 20px 0;
		background-color: #ffffff;
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
	}
	.content-total{
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
}
</style>
