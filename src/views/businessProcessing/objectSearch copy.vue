<template>
	<div class="object-search" id="objectSearch">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="16">
					<div>
						<el-select v-model="data.type" placeholder="请选择" class="item1" @change="data.num = ''">
							<el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-input size="medium" placeholder="请输入设备编号" v-model.trim="data.num" class="item2" clearable v-if="data.type == '02'"></el-input>
						<el-input size="medium" placeholder="请输入物业项目名称" v-model.trim="data.num" class="item2" clearable v-else-if="data.type == '03'"></el-input>
						<el-input size="medium" placeholder="请输入被保人员证件号" v-model.trim="data.num" class="item2" clearable v-else></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查 询</el-button>
						<el-button @click="empty" class="empty-button" type="text">清空条件</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="content">
			<div class="content-table">
				<el-table :data="returnDataList" style="width: 100%;color:#000000" border :header-cell-style="getRowClass1">
					<el-table-column label="保单信息" width="660">
						<template slot-scope="scope">
							<p class="col-blue">{{scope.row.holderName}}</p>
							<p class="mt10">保险期间：{{scope.row.startDate}} 至 {{scope.row.endDate}}</p>
							<p class="mt10">投保单号：{{scope.row.applicationFormCode}} <span class="ml10">保单号：<span v-if="scope.row.policyNo">{{scope.row.policyNo}}</span><span v-else>--</span> </span> </p>
						</template>
					</el-table-column>
					<el-table-column label="类型">
						<template slot-scope="scope">
							<p> <span class="col-blue">保单 ( {{scope.row.statusName}} ) </span> / <span> 保费：￥ {{scope.row.afterPrem.toFixed(2)}} </span></p>
						</template>
					</el-table-column>
					
					<el-table-column label="操作" align="center" width="200">
						<template slot-scope="scope">
							<el-button size="mini" type="text" class="col-blue text-under" @click="goToDetail(scope.row)">查看订单</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import policyStatus from '../../../static/data/policyStatus.json';
import moment from 'moment';
export default {
	components:{
	},
	data() {
		return {
			proSortName:'',
			Elevator:new elevator(),
			data:{
				"userCode":window.sessionStorage.getItem('userCode'),
				'type':'01',
				"holderName":'',//投保人名称
				"branchScope":'',
				"num":''
			},
			options:[
				{
					label: '被保人员证件号',
					value: '01'
				},
				{
					label: '设备编号',
					value: '02'
				},
				{
					label: '物业项目名称',
					value: '03'
				}
			],
			returnDataList:[]
		}
	},
	created(){
		
	},
	methods: {
		async policylist(){ // 获取投保单列表
			let res  = await this.Elevator.getApplication(this.data.num);
			if(res.code == '0000' && res.total != 0) {
				res.list.forEach(item => {
					if(item.policyNo && item.state) {
						item.afterPrem = JSON.parse(item.riskList)[0].actualPrem
						item.statusName = '保障中'
						this.returnDataList.push(item);
					}
				})
			}
			if(this.returnDataList.length == 0) {
				this.$message.warning('设备编号' + this.data.num + ',该设备未在保障中！');
			}
		},
		async policylistGZ(){ // 获取投保单列表
			let res  = await this.Elevator.getpolicypeople(this.data.num);
			if(res.code == '0000' && res.list.length != 0) {
				res.list.forEach(item => {
					if(item.policyNo && item.state) {
						item.statusName = '保障中'
						this.returnDataList.push(item);
					}
				})
				if(this.returnDataList.length == 0) {
					this.$message.warning('证件号' + this.data.num + ',该人员未在保障中！');
				}
			}
		},
		async policylistTY(){ // 获取投保单列表-团意
			let res  = await this.Elevator.postSeachPolicyTY(this.data.num);
			console.log(res,'ty--------')
			if(res.code == '0000' && res.list.length != 0) {
				this.returnDataList = res.list
			}
		},
		searchview(){ //查询
			this.returnDataList = [];
			if(this.data.type == '01') {
				if(!this.data.num) {
					this.$message.warning('请输入被保人员证件号！');
					return
				}
				this.policylistGZ();
			} else if (this.data.type == '02') {
				if(!this.data.num) {
					this.$message.warning('请输入设备编号！');
					return
				}
				this.policylist();
			} else {
				if(!this.data.num) {
					this.$message.warning('请输入物业项目名称！');
					return
				}
				this.postBDInfo();
			}
			
			// this.policylistTY();
			// this.postBDInfo()
		},
		async postBDInfo() {
			let obj = {
				"channelCode":"sequip",
				"flag":true,
				"issueStatus":"Y",
				"key":"S_O_000108",
				"polEndEnd":"",
				"polEndFrom":"",
				"polStartEnd":"",
				"polStartFrom":"",
				"type":"23",
				"value":this.data.num
			};
			let res  = await this.Elevator.postSeachPolicy(obj);
			if(res.code == '0000' && res.list.length != 0) {
				res.list.forEach(item => {
					if(new Date(item.polStartDate) <= new Date() && new Date() <= new Date(item.polEndDate)) {
						item.statusName = '保障中'
						item.startDate = item.polStartDate;
						item.endDate = item.polEndDate;
						item.applicationFormCode = item.appCode;
						this.returnDataList.push(item);
					}
				})
			}
			if(this.returnDataList.length == 0) {
				this.$message.warning('物业项目名称' + this.data.num + ',该项目未在保障中！');
			}
		},
		empty(){ //清空
			this.data.num = '';
			this.returnDataList = [];
		},
		getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #f7f7f7;color:#101010;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
		goToDetail(row) {
			let routeData = this.$router.resolve({
				path:'/order/detail',
				query:{
					appCode:row.applicationFormCode,
					orderStatusName:row.statusName
				}
			});
			window.open(routeData.href, '_blank');
		}
	},
}
</script>

<style lang="less">
#objectSearch {
	padding-bottom: 80px;
	box-sizing: border-box;
	.elesearch{
		width: calc(100% - 40px);
		padding: 20px 20px 10px;
		margin: 0px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;
		.row-bg{
			margin-bottom: 20px;
			.item1{
				width: 15%;
				margin-right: 10px;
				margin-left: 0%;
				input {
					border: none;
					font-size: 16px;
					min-width:110px;
				}
				.el-select__caret {
					color: #000000;
					font-weight: 700;
				}
			}
			.item2{
				width: 50%;
			}
			.query-button{
				float: right;
				font-weight: 600;
				width: 100px;
				margin-left: 20px;
			}
			.empty-button{
				float: right;
				margin-left: 30px;
				color: #2491fc;
				font-weight: 500;
				text-decoration: underline;
			}
		}
	}
	.content{
		width: calc(100% - 40px);
		margin: 20px 20px 0 20px;
		background-color: #ffffff;
		padding-top: 20px;
		.w80 {
			width: 80px;
			border: 1px solid #E6A23C;
			color:#E6A23C;
		}
		.el-button--warning {
			background-color: #ffe7ba;
		}
		.is-round {
			padding: 8px 22px;
		}
		.content-table{
			width: 100%;
			padding: 0 20px 30px;
			margin-bottom: 40px;
			box-sizing: border-box;
		}
	}
	.mr60 {
		margin-right: 60px;
	}
	.col-blue {
		color: #1E90FF;
	}
	.text-under {
		text-decoration: underline;
	}
	.col-red {
		color: #f5222d;
	}
	.col-org {
		color: #DB9728;
	}
}
</style>
