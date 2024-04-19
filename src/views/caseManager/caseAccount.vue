<template>
	<div class="case-account" id="caseAccount">
		<div class="content">
			<el-tabs type="border-card" v-model="tabState" @tab-click="changeTab" class="state-style">
				<el-tab-pane :label="item.label" :name="item.value" v-for="(item,index) in options1" :key="index"></el-tab-pane>
			</el-tabs>
			<div class="fg-line"></div>
			<!-- 电梯 -->
			<div v-show="tabState == '1'">
				<dtCaseList ref="dtCaseList"></dtCaseList>
			</div>
			<!-- 雇主 -->
			<div v-show="tabState == '2'">
				<gzCaseList ref="gzCaseList"></gzCaseList>
			</div>
			<!-- 团意 -->
			<div v-show="tabState == '3'">
				<tyCaseList ref="tyCaseList"></tyCaseList>
			</div>
			<!-- 索道 -->
			<div v-show="tabState == '4'">
				<sdCaseList ref="sdCaseList"></sdCaseList>
			</div>
			<!-- 物业 -->
			<div v-show="tabState == '5'">
				<wyCaseList ref="wyCaseList"></wyCaseList>
			</div>
			<!-- 家政 -->
			<div v-show="tabState == '6'">
				<jzCaseList ref="jzCaseList"></jzCaseList>
			</div>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import RidesService from '../../service/RidesService';
import dtCaseList from './ElevatorCaseList.vue'
import gzCaseList from './EmployerCaseList.vue'
import tyCaseList from './RegimentCaseList.vue'
import sdCaseList from './CablewayCaseList.vue'
import jzCaseList from './HousekeepingCaseList.vue'
import wyCaseList from './PropertyCaseList.vue'
export default {
	components:{
		dtCaseList,gzCaseList,tyCaseList,sdCaseList,jzCaseList,wyCaseList
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
					label:'电梯',
					value:'1',	
				},
				{
					label:'雇主',
					value:'2',	
				},
				{
					label:'团意',
					value:'3',	
				},
				{
					label:'索道',
					value:'4',	
				},
				{
					label:'物业',
					value:'5',	
				},
				{
					label:'家政',
					value:'6',	
				}
			],
			options2:[],
			tabState:'1',
		}
	},
	created(){
		// this.getRides();
	},
	mounted() {
		this.tabState = '1';
		// this.$refs.PolicyDetailPerson.initData()
	},
	methods: {
		async getRides() { //获取缓存数据
			let branchRid = await this.RidesService.getRides('sequipListData','sequip','1');
			if(branchRid.code == '0000' && branchRid.data) {
				this.options2 = JSON.parse(branchRid.data).options2;
			} 
		},
		changeTab() {
			
		},
	},
}
</script>

<style lang="less">
#caseAccount {
	padding-bottom: 80px;
	box-sizing: border-box;
	.content{
		width: 100%;
		// background-color: #ffffff;
		.fg-line {
			height: 5px;
			background-color: #e8e8e8;
		}
		.pd-style {
			padding: 20px;
		}
		.state-style {
			margin: 0px 20px 0 20px;
			width: calc(100% - 40px);
			background-color: #ffffff;
			height: 40px;
			font-size: 16px;
			.is-active {
				background: #1890ff;
    			color: #fbfbfb !important;
				font-size: 16px;
				border-right-color: #1890ff;
				border-left-color: #1890ff;
			}
			.el-tabs__header {
				background-color: #ffffff;
				border-bottom: 2px solid #1890ff;
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
