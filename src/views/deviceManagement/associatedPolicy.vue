<template>
	<div class="associatedPolicy" id="associatedPolicy">
		<div class="modifyele">
			<p>投保历史</p>
			<span class="elesearch-item1"></span>
		</div>
		<div class="content-form">
			<!-- <div class="content-form1">
				<el-button type="primary" size="small">导出</el-button>
			</div> -->
			<div class="content-form2">
				<el-table :data="data" style="width: 100%" highlight-current-row show-header border size='small'>
					<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
					<el-table-column prop="applicationFormCode" label="投保单号" align="center" min-width="170"></el-table-column>
					<el-table-column prop="policyNo" label="保单号" align="center" min-width="170"></el-table-column>
					<el-table-column prop="applicationStatus " label="状态" align="center" min-width="70">
						<template slot-scope="scope">
							<span v-if="scope.row.applicationStatus == '08'">待出单</span>
							<span v-if="scope.row.applicationStatus == '10'">已出单</span>
						</template>
					</el-table-column>
					<el-table-column prop="holderName" label="投保人名称" align="center"></el-table-column>
					<el-table-column prop="elevatorYear" label="使用年限(年)" align="center" min-width="90">
						<template slot-scope="scope">
							<span v-if="scope.row.elevatorYear == 'invalidation'">---</span>
							<span v-else>{{scope.row.elevatorYear}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="elevatorType" label="类型" align="center" min-width="70">
						<template slot-scope="scope">
							<span v-if="scope.row.elevatorType">{{scope.row.elevatorType}}</span>
							<span v-else>---</span>
						</template>
					</el-table-column>
					<el-table-column prop="heightOrWeight" label="重量(kg)/提升高度(m)" align="center" min-width="150">
						<template slot-scope="scope">
							<span v-if="scope.row.heightOrWeight">{{scope.row.heightOrWeight}}</span>
							<span v-if="!scope.row.heightOrWeight">---</span>
						</template>
					</el-table-column>
					<el-table-column prop="elevatorSite" label="使用场所" align="center" min-width="150"></el-table-column>
					<el-table-column prop="startDate" label="保险起期" align="center" min-width="150"></el-table-column>
					<el-table-column prop="endDate" label="保险止期" align="center" min-width="150"></el-table-column>
				 </el-table>
			</div>
			<div class="content-form3">
				<el-button type="info" size="small" class="item2" @click="toback">返回</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js'
import elevatorType from '../../../static/data/elevatorType.json';
import placeUse from '../../../static/data/placeUse.json';
export default {
	data() {
		return {
			Elevator:new elevator(),
			data:[],
			multipleSelection: [],
		}
	},
	created(){
		this.getApplication();
	},
	methods: {
		async getApplication(){
			let res = await this.Elevator.getApplication(this.$route.query.code);
			if(res.code == "0000"){
				this.data = res.list;
				for(var i=0;i<this.data.length;i++){
					for(var l=0;l<elevatorType.data.length;l++){
						if(this.data[i].elevatorType == elevatorType.data[l].code){
							this.data[i].elevatorType = elevatorType.data[l].name
						}
					}
					for(var k=0;k<placeUse.data.length;k++){
						if(this.data[i].elevatorSite == placeUse.data[k].value){
							this.data[i].elevatorSite = placeUse.data[k].label;
						}
					};
				}
			}
		},
		toback(){
			this.$router.go(-1);
		},
	},
}

</script>

<style lang="less">
#associatedPolicy {
	padding-top: 20px;
	padding-bottom: 80px;
	background-color: #ffffff;
	min-height: 900px;
	.modifyele{
		width: 90%;
		height: 46px;
		margin-left: 2%;
		font-size: 18px;
		color: #101010;
		.elesearch-item1{
			display: block;
			width: 72px;
			height: 3px;
			background-color: #3A48E2;	
		}
	}
	.content-form{
		width: 90%;
		margin-left: 5%;
		.content-form1{
			width: 100%;
			height: 40px;
			text-align: right;
		}
		.content-form3{
			width: 100%;
			height: 50px;
			text-align: center;
			margin-top: 20px;
			.item2{
				width: 200px;
				height: 40px;
			}
		}
	}
}
</style>
