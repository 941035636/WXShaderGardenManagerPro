<template>
	<div class="overinvoices" id="overinvoices">
		<div class="elesearchs">
			<el-button size="small" @click="takeBack" >{{title}}<i :class="icon"></i></el-button>
		</div>
		<transition name="mybox">
			<div class="elesearch" v-show="show">
				<div class="elesearch1">
					<el-row type="flex" class="row-bg">
						<el-col :span="8"><div>
							<span class="item2">投保单号/保单号</span>
							<el-select v-model="value" placeholder="请选择" class="item11" size="small" clearable>
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<el-input placeholder="请输入" v-model="value2" class="item1" size="small"></el-input>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">投保人名称</span>
							<el-input placeholder="请输入" v-model="value5" class="item1" size="small"></el-input>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">发票抬头</span>
							<el-input placeholder="请输入" v-model="taxpayerName" class="item1" size="small"></el-input>
						</div></el-col>
						<el-col :span="4"><div>
							<span class="item2">发票类型</span>
							<el-select v-model="value3" placeholder="请选择" class="item1" size="small" clearable>
								<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</div></el-col>
					</el-row>
				</div>
				<div class="elesearch1">
					<el-row type="flex" class="row-bg">
						<el-col :span="8"><div>
							<span class="item2">发票状态</span>
							<el-select v-model="value4" placeholder="请选择" class="item1" size="small" clearable>
								<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">产品</span>
							<el-cascader v-model="value6" :options="options4" @change="handleChange1" placeholder="请选择" class="item1" size="small" clearable></el-cascader>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">申请日期</span>
							<el-date-picker v-model="value10" type="daterange" @change="changes" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable  class="item1" size="small"></el-date-picker>
						</div></el-col>
						<el-col :span="4"><div>
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
		<div class="content1">
			<el-button type="primary" size="small" v-if="datas.find(item => item.key == '30001')" @click="exports">导出</el-button>
		</div>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit size='mini'>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="addTime" label="申请日期" align="center" min-width="90">
				</el-table-column>
				<el-table-column prop="invoiceId" label="申请流水号" align="center" min-width="170"></el-table-column>
				<el-table-column prop="applicantName" label="投保人名称" align="center" min-width="100"></el-table-column>
				<el-table-column prop="invoiceType" label="发票类型" align="center" min-width="160">
					<template slot-scope="scope">
						<span v-if="scope.row.invoiceType == '0'">增值税普通发票(电子)</span>
						<span v-if="scope.row.invoiceType == '1'">增值税普通发票(纸质)</span>
						<span v-if="scope.row.invoiceType == '2'">增值税专用发票</span>
					</template>
				</el-table-column>
				<el-table-column prop="taxpayerName" label="发票抬头" align="center" min-width="164"></el-table-column>
				<el-table-column prop="taxpayerNo" label="纳税人识别号" align="center" min-width="200"></el-table-column>
				<el-table-column prop="invoiceAmount" label="发票金额" align="center" min-width="130"></el-table-column>
				<el-table-column prop="status" label="发票状态" align="center" min-width="100">
					<template slot-scope="scope">
						<span v-if="scope.row.status == '0'">未开票</span>
						<span v-if="scope.row.status == '1'">已开票</span>
						<span v-if="scope.row.status == '2'">开票失败<el-button type="text" icon="el-icon-question" @click.native="reasonsFailure(scope.row)"></el-button></span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center" min-width="140">
					<template slot-scope="scope" type="flex">
						<el-button @click="modify(scope.row)" type="text" size="mini" class="item4" v-if="datas.find(item => item.key == '30002')">查看详情</el-button>
						<el-button @click="relation(scope.row)" type="text" size="mini" class="item4" v-if="datas.find(item => item.key == '30003') && scope.row.status == '0'">上传发票</el-button>
						<el-button @click="relation(scope.row)" type="text" size="mini" class="item4" v-if="datas.find(item => item.key == '30004') && scope.row.status == '1'">下载发票</el-button>
					</template>
				</el-table-column>
			 </el-table>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import publicConfiguration from '../../global/publicConfiguration.js';
import productClassification from './data/productClassification.json';
import ResourcesService from '../../service/ResourcesService';
export default {
	data() {
		return {
			ResourcesService: new ResourcesService(),
			Elevator:new elevator(),
			publicConfiguration:new publicConfiguration(),
			show:true,
			title:'收回',
			icon:'el-icon-arrow-up',
			data1:[],
			datas:[],
            input1:'',  
			value:'1',
			options:[
				{
				value: '0',
				label: '保单号'
				},{
				value: '1',
				label: '投保单号'
				}
			],
			value2:'',
			value3:'',
			options2:[
				{
				value: '0',
				label: '增值税普通发票(电子)'
				},{
				value: '1',
				label: '增值税普通发票(纸质)'
				},{
				value: '2',
				label: '增值税专用发票'
				}
			],
			value4:'',
			options3:[
				{
				value: '0',
				label: '未开票'
				},{
				value: '1',
				label: '已开票'
				},{
				value: '3',
				label: '开票失败'
				}
			],
			options4:[],
			value6:[],
			value61:'',
			value62:'',
			value5:'',
			value10:[],
			value101:'',
			value102:'',
			taxpayerName:'',
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
		}
	},
	created(){
		if(window.localStorage.getItem('index') == '7'){
			this.gettingCache();
		}else{
			window.localStorage.removeItem('data');
			this.getElevator();
		}
		this.datas = JSON.parse(window.sessionStorage.getItem('list'));
		this.options4 = productClassification.data;
	},
	methods: {
		reasonsFailure(row){//报错原因
			this.$message({
				dangerouslyUseHTMLString: true,
				message: row.errorMsg
			});
		},
		handleChange1(value){ // 获取选择的产品
			if(value){
				this.value61 = value[0];
				this.value62 = value[1];
			}else{
				this.value6 = [];
				this.value61 = '';
				this.value62 = "";
			}
		},
		changes(value){ // 申请时间
			if(value){
				this.value101 = value[0];
				this.value102 = value[1];
			}else{
				this.value10 = [];
				this.value101 = '';
				this.value102 = '';
			}
		},
		takeBack(){ // 搜索条件的展开与收回
			let data  = this.publicConfiguration.switchs(this.show);
			this.show = data.show;
			this.title = data.title;
			this.icon = data.icon;
		},
		async exports(){//导出
		if(this.total<=5000){
				var href = this.$apiUrl.XIAZAIFAPIAO + '?userCode=' + window.sessionStorage.getItem('userCode') + '&oddNo=' + this.value2 + '&type=' + this.value + '&invoiceType=' + this.value3 + '&applicantName=' + this.value5 + '&status=' + this.value4 + '&taxpayerName=' + this.taxpayerName + '&productCode=' + this.value62 + '&addTimeStart=' + this.value101 + '&addTimeEnd=' + this.value102;
				this.$logger.info(
					'M2-003','',
					{
						'userName':window.sessionStorage.getItem('userName'),
						'branchName':window.sessionStorage.getItem('branchName'),
						'total':this.total,
					}
				);
				this.ResourcesService.exportsViewFile(href)
			} else {
				this.$message({
					message: "数据量过大,超过500页,请缩小查询范围！",
					type: 'warning'
				});
			}
			
			// window.open(href,"_blank" )
		},
		async getElevator(){ //发票列表
			let data = {
				'userCode':window.sessionStorage.getItem('userCode'),
				'pn':this.pageNum,
				'ps':this.pagesize,
				'type':this.value,
				'oddNo':this.value2,
				'invoiceType':this.value3,
				'applicantName':this.value5,
				'status':this.value4,
				'taxpayerName':this.taxpayerName,
				'productCode':this.value62,
				'addTimeStart':this.value101,
				'addTimeEnd':this.value102
			};
			let index = '7';
			window.localStorage.setItem('data',JSON.stringify(data));
			window.localStorage.setItem('index',index);
			window.localStorage.setItem('value6',this.value61);
			let res = await this.Elevator.checkinvoices(data);
			if(res.code == '0000'){
				this.data1 = res.list;
				this.data1.forEach(item => {
					if(item.invoiceUrl){
						item.status = '1'
					}else{
						if(item.status != '2'){
							item.status = '0'
						}
					}
				})
				this.total = res.total;
			}
		},
		gettingCache(){
			let data = JSON.parse(window.localStorage.getItem('data'));
			this.value2 = data.oddNo;
			this.value = data.type;
			this.value3 = data.invoiceType;
			this.value5 = data.applicantName;
			this.value62 = data.productCode;
			this.value6.push(this.value61);
			this.value6.push(this.value62);
			this.value10.push(this.value101);
			this.value10.push(this.value102);
			this.taxpayerName = data.taxpayerName;
			this.pageNum = data.pn;
			this.currentPage = data.pn;
			this.getElevator();
		},
		searchview(){
			this.pageNum = 1;
			this.currentPage = 1;
			this.getElevator();
		},
		empty(){
			this.input1 = '';
			this.value = '';
			this.value2 = '';
			this.value3 = '';
			this.value4 = '';
			this.value5 = '';
			this.value6 = [];
			this.value61 = '';
			this.value62 = '';
			this.value10 = [];
			this.value101 = '';
			this.value102 = '';
			this.taxpayerName = '';
			this.pageNum = 1;
			this.currentPage = 1;
			this.getElevator();
		},
		handleCurrentChange: function(pageNum){
		    this.pageNum = pageNum;
			this.getElevator();
		},
		modify(row){
			this.$router.push({
				path:'/invoice/detail',
				query:{
					invoiceId :row.invoiceId,
				}
			})
		},
		async relation(row){
			if(row.status == '0'){
				this.$router.push({
					path:'/invoice/upload',
					query:{
						appCode:row.applicationNo,
						invoiceId :row.invoiceId
					}
				})
			}else{
				let {data}  = await this.Elevator.invoiceDownload(row.invoiceUrl,row.policyNo)
				if(data.code=='0000'){
					this.ResourcesService.downloadOrViewFile(data.msg,true)
				}
				this.$logger.info('M2-002','',{"invoiceId":row.invoiceId,applicationFormCode:row.applicationNo});
			}
		},
	},
}

</script>

<style lang="less">
#overinvoices{
	padding-bottom: 80px;
	.elesearchs{
		height: 70px;
		text-align: right;
		width: calc(100% - 40px);
		padding: 20px 20px 10px;
		margin: 20px 20px 0;
		box-sizing: border-box;
		background-color: #fff;	
	}
	.mybox-leave-active,.mybox-enter-active{
	    transition:  all .5s linear; 
	}
	.mybox-leave-active,.mybox-enter{
	    height:0px !important;
	}
	.mybox-leave,.mybox-enter-active{
	    height: 120px;
	}
	.elesearch{
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
			.item11{
				width: 100px;
				margin-top: 5px;
			}
			.item12{
				width: 120px;
				margin-top: 5px;
			}
			.item4{
				width: 106px;
				margin-top: 5px;
			}
			.item2{
				display: block;
				width: 200px;
				height: 25px;
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
		margin-left: 2%;
	}
	.content-table{
		width: calc(100% - 40px);
		margin: 20px 20px 0;
		background-color: #ffffff;
		.item4{
			font-size: 12px;
			text-decoration: underline;
			color: #4E80FF;
		}
	}
	.content-total{
		width: 96%;
		height: 60px;
		line-height: 60px;
		text-align: right;
	}
}
</style>
