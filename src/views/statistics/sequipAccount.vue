<template>
	<div class="object-search" id="objectSearch">
		<div class="content">
			<el-tabs type="border-card" v-model="tabState" @tab-click="changeTab" class="state-style">
				<el-tab-pane :label="item.label" :name="item.value" v-for="(item,index) in options1" :key="index"></el-tab-pane>
			</el-tabs>
			<div class="fg-line"></div>
			<!-- 人员 -->
			<div v-show="tabState == '2'">
				<PolicyDetailPerson ref="PolicyDetailPerson" @goToDetail='goToDetail' :options2="options2"  :data="data"></PolicyDetailPerson>
			</div>
			<!-- 设备 -->
			<div v-show="tabState == '1'">
				<PolicyDetailSequip ref="PolicyDetailSequip" @goToDetail='goToDetail'  :options2="options2"></PolicyDetailSequip>
			</div>
			<!-- 物业 -->
			<div v-show="tabState == '3'">
				<PolicyProperty ref="PolicyProperty" @goToDetail='goToDetail' :options2="options2"></PolicyProperty>
			</div>
			<!-- 索道 -->
			<div v-show="tabState == '4'">
				<PolicyCableway ref="PolicyCableway" @goToDetail='goToDetail' :options2="options2"></PolicyCableway>
			</div>
			<!-- 物业 -->
			<div v-show="tabState == '5'">
				<PolicyMerchant ref="PolicyMerchant" @goToDetail='goToDetail' :options2="options2"></PolicyMerchant>
			</div>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import RidesService from '../../service/RidesService';
import policyStatus from '../../../static/data/policyStatus.json';
import PolicyDetailPerson from './components/PolicyDetailPerson.vue'
import PolicyDetailSequip from './components/PolicyDetailSequip.vue'
import PolicyProperty from './components/PolicyProperty.vue'
import PolicyCableway from './components/PolicyCableway.vue'
import PolicyMerchant from './components/PolicyMerchant.vue'
import moment from 'moment';
export default {
	components:{
		PolicyDetailPerson,PolicyDetailSequip,PolicyProperty,PolicyCableway,PolicyMerchant
	},
	data() {
		return {
			proSortName:'',
			Elevator:new elevator(),
			RidesService: new RidesService(),
			data:{
				"userCode":window.sessionStorage.getItem('userCode'),
				'type':'01',
				"holderName":'',//投保人名称
				"branchScope":'',
				"num":''
			},
			returnDataList:[],
			options1:[
				{
					label:'电梯库',
					value:'1',	
				},
				{
					label:'人员信息库',
					value:'2',	
				},
				{
					label:'物业项目库',
					value:'3',	
				},
				{
					label:'索道库',
					value:'4',	
				},
				{
					label:'商户库',
					value:'5',	
				}
			],
			options2:[],
			tabState:'1',
		}
	},
	created(){
		this.getRides();
	},
	mounted() {
		this.tabState = '1';
		this.$refs.PolicyDetailSequip.initData()
	},
	methods: {
		async getRides() { //获取缓存数据
			let branchRid = await this.RidesService.getRides('sequipListData','sequip','1');
			if(branchRid.code == '0000' && branchRid.data) {
				this.options2 = JSON.parse(branchRid.data).options2;
			} 
		},
		changeTab() {
			if(this.tabState == '1') {
				this.$refs.PolicyDetailSequip.initData()
			}
			if(this.tabState == '2') {
				this.$refs.PolicyDetailPerson.initData()
			}
			if(this.tabState == '3') {
				this.$refs.PolicyProperty.initData()
			}
		},
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
		min-height: 160px;
		padding: 20px 20px 10px;
		margin: 0px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;
		.row-bg{
			margin-bottom: 20px;
			.item1{
				width: 25%;
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
				width: 60%;
			}
			.item3{
				display: inline-block;
				width: 25%;
				text-align: right;
				font-size: 16px;
				color: #666666;
				margin-right: 10px;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				vertical-align: text-bottom;
			}
			.item4{
				width: 18%;
				margin-right: 10px;
			}
			.item5{
				width: 30%;
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
		margin: 0px 20px 0 20px;
		background-color: #ffffff;
		.fg-line {
			height: 5px;
			background-color: #e8e8e8;
		}
		.pd-style {
			padding: 20px;
		}
		.state-style {
			background-color: #ffffff;
			height: 40px;
			font-size: 16px;
			.is-active {
				background: #fa8c16;
    			color: #fbfbfb !important;
				font-size: 16px;
				border-right-color: #fa8c16;
				border-left-color: #fa8c16;
			}
			.el-tabs__header {
				background-color: #ffffff;
				border-bottom: 2px solid #fa8c16;
				margin: 0;
			}
			.el-tabs__content {
				display: none;
			}
			.el-tabs__item {
				padding: 0 50px;
				height: 40px;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				line-height: 40px;
				display: inline-block;
				list-style: none;
				font-size: 16px;
				font-weight: 500;
				color: #101010;
				position: relative;
			}
		}
		.w80 {
			width: 80px;
			border: 1px solid #E6A23C;
			color:#E6A23C;
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
	.mr50 {
		margin-right: 50px;
	}
	.col-blue {
		color: #1E90FF;
	}
	.col-blue1 {
		color: #40a9ff;
	}
	.col-grey {
		color: #919191;
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
	.query-button {
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
	.see-style {
		margin-left: 5px;
		text-decoration: underline;
		color: #096dd9;
		cursor: pointer;
	}
}
</style>
