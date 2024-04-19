<template>
	<div class="caseManagement" id="caseManagement">
		<div class="elesearchs">
			<el-button size="small" @click="takeBack" >{{title}}<i :class="icon"></i></el-button>
		</div>
		<transition name="mybox">
			<div class="elesearch" v-show="show">
				<div class="elesearch1">
					<el-row type="flex" class="row-bg">
						<el-col :span="6"><div>
							<span class="item2">案件号</span>
							<el-input placeholder="请输入案件号" v-model="value1" class="item1" size="small" clearable></el-input>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">保单号</span>
							<el-input placeholder="请输入保单号" v-model="value2" class="item1" size="small" clearable></el-input>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">投保人</span>
							<el-input placeholder="请输入投保人" v-model="value3" class="item1" size="small" clearable></el-input>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">产品</span>
							<el-select v-model="value4" placeholder="请选择" class="item4" size="small" clearable @change="handleChange1">
								<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<el-select v-model="value5" placeholder="请选择" class="item4" size="small" clearable @change="handleChange2">
								<el-option v-for="item in options2" :key="item.value" :label="item.name" :value="item.code"></el-option>
							</el-select>
						</div></el-col>
					</el-row>
				</div>
				<div class="elesearch1">
					<el-row type="flex" class="row-bg">
						<el-col :span="6"><div>
							<span class="item2">案件状态</span>
							<el-select v-model="value6" placeholder="请选择案件状态" class="item1" size="small" clearable>
								<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">出险区域</span>
							<el-cascader :options="options4"  placeholder="请选择" v-model="value7" change-on-select @change="handleChange" class="item1" size="small" clearable></el-cascader>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">报案时间</span>
							<el-date-picker v-model="value8" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable  class="item1" size="small"></el-date-picker>
						</div></el-col>
						<el-col :span="6"><div class="item5">
							<el-button type="success" size="small" @click="searchview">查看</el-button>
							<el-button type="info" size="small" @click="empty">清空</el-button>
						</div></el-col>
					</el-row>
				</div>
			</div>
		</transition>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border size='small'>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="appCode" label="案件号" align="center" width="170"></el-table-column>
				<el-table-column prop="policyNo" label="保单信息" align="center" width="170"></el-table-column>
				<el-table-column prop="elevatorYear" label="报案人" align="center" width="100"></el-table-column>
				<el-table-column prop="height" label="出险时间" align="center" width="130"></el-table-column>
				<el-table-column prop="elevatorSite" label="状态" align="center" width="90"></el-table-column>
				<el-table-column prop="areaValue" label="更新时间" align="center" width="180"></el-table-column>
				<el-table-column fixed="right" label="操作" align="center" width="125">
					<template type="flex">
						<el-dropdown @command="handleCommand">
							<span class="el-dropdown-link">操作</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="a">修改</el-dropdown-item>
								<el-dropdown-item command="b">关联投保单</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
			 </el-table>
		</div>
		<div class="content-total">
			<el-pagination layout="prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize"  :total="total"></el-pagination>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js'
import policyStatus from '../../../static/data/policyStatus.json';
import insuranceType from '../../../static/data/insuranceType.json';
export default {
	data() {
		return {
			show:true,
			title:'收回',
			icon:'el-icon-arrow-up',
            value1:'',
			value2:'',
			value3:'',
			value4:'',
			value5:'',
			value6:'',
			value7:[],
			value8:[],
			options4:[],
			options1:[],
			options2:[],
			options3:[],
			Elevator:new elevator(),
			data1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			state:0,
			currentPage:1,
			total1:0,
		}
	},
	created(){
		this.policyStatu();
		this.policylist();
        this.getArea();
	},
	methods: {
		takeBack(){
			// $(".elesearch").animate({height:'0',border:'0',width:"0"});
			if(this.show == true){
				this.show = !this.show;
				this.title = '展开';
				this.icon = 'el-icon-arrow-down';
			}else{
				this.show = !this.show;
				this.title = '收回';
				this.icon = 'el-icon-arrow-up';
			}
			
		},
		async policylist(){
			let form = {
				'userCode':window.sessionStorage.getItem('userCode'),
				'pn':this.pageNum,
				'ps':this.pagesize
			};
			let res = await this.Elevator.searchAppList(form);
			if(res.code == '0000'){
				this.data1 = res.list;
			}
		},
		policyStatu(){
			this.options3 = policyStatus.data;
			this.options1 = insuranceType.data;
		},
		async getArea(){ //获取地区
			let res = await this.Elevator.getAreas();
			if(res.code == '0000'){
				this.options4 = res.data;
			}
		},
		handleChange1(value) {
			if(value !=null){
				this.value4 = value;
				this.getprolist();
				this.value5 = '';
			}
		},
		async getprolist(){
			let form = {
				'areaCodeList':['000000'],
				'classCodeList':[this.value4]
			};
			let res = await this.Elevator.getprolist(form);
			if(res.code == '0000'){
				this.total1 = res.total/10;
				this.total1  = Math.ceil(this.total1)*10;
				this.getprolists();
			}
		},
		async getprolists(){
			let form = {
				'areaCodeList':['000000'],
				'classCodeList':[this.value4],
				'ps':this.total1
			};
			let res = await this.Elevator.getprolist(form);
			this.options2 = res.data.list;
		},
		handleChange2(value) {
			console.log(value);
		},
		handleChange(value) {
			console.log(value);
		},
		searchview(){
			if(this.value == ''){
				this.state = 0;
			}else{
				this.state = this.value;
			}
			this.pageNum = 1;
			this.getElevator();
		},
		empty(){
			this.input1 = '';
			this.value = '';
			this.value1 = [];
			this.state = 0;
			this.getElevator();
		},
		handleSizeChange: function (pagesize) {
		    this.pagesize = pagesize;
		},
		handleCurrentChange: function(pageNum){
		    this.pageNum = pageNum;
			this.policylist();
		},
		modify(row){
			if(row.equipmentsCode){
				this.$router.push({
					path:'/device/dt/edit',
					query:{
						productCode:row.productCode,
						code :row.equipmentsCode
					}
				})
			}else{
				this.$router.push({
					path:'/device/dt/edit',
					query:{
						productCode:row.productCode,
						code :row.licenceNo
					}
				})
			}	
		},
		handleCommand(command) {
			this.$message('click on item ' + command);
		},
		relation(row){
			if(row.equipmentsCode){
				this.$router.push({
					path:'/device/dt/relation',
					query:{
						code :row.equipmentsCode
					}
				})
			}else{
				this.$router.push({
					path:'/device/dt/relation',
					query:{
						code :row.licenceNo
					}
				})
			}
		},
	},
}

</script>

<style lang="less">
#caseManagement {
	padding-top: 10px;
	padding-bottom: 80px;
	background-color: #ffffff;
	.mybox-leave-active,.mybox-enter-active{
	    transition:  all .5s linear; 
	}
	.mybox-leave-active,.mybox-enter{
	    height:0px !important;
	}
	.mybox-leave,.mybox-enter-active{
	    height: 80px;
	}
	.elesearchs{
		width: 90%;
		height: 40px;
		margin-left: 5%;
		text-align: right;
		margin-top:10px;
	}
	.elesearch{
		width: 90%;
		height: 150px;
		border: 1px solid #808080;
		margin-left: 5%;
		padding-left: 10px;
		box-sizing: border-box;
		.elesearch1{
			width: 100%;	
			.item1{
				width: 220px;
				margin-top: 5px;
			}
			.item4{
				width: 100px;
				margin-top: 5px;
			}
			.item2{
				display: inline-block;
				width: 200px;
				height: 25px;
				line-height: 25px;
				padding-left:1em;
				box-sizing: border-box;
				font-size: 12px;
			}
			.item5{
				margin-top: 25px;
			}
		}
	}
	.content-table{
		width: 90%;
		margin-left: 5%;
		margin-top: 20px;
		.item4{
			font-size: 12px;
			text-decoration: underline;
			color: #4E80FF;
		}
	}
	.content-total{
		width: 95%;
		height: 60px;
		line-height: 60px;
		text-align: right;
	}
}
</style>
