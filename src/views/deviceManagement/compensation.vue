<template>
	<div class="compensation" id="compensation">
		<div class="modifyele">
			<p>赔付情况</p>
			<span class="elesearch-item1"></span>
		</div>
		<div class="conten1" @click="newlyadded">
			<i class="el-icon-circle-plus"></i><el-button type="text" size="small">新增</el-button>
		</div>
		<div class="content-table">
			<el-table :data="data1" style="width: 40%" highlight-current-row show-header border size='small'>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="year" label="年度" align="center" width="100">
					<template slot-scope="scope">
						<span v-if="scope.row.type == '1'">{{scope.row.year}}</span>
						<el-input v-if="scope.row.type == '2'" v-model="scope.row.year" placeholder="年度" size="small"></el-input>
					</template>
				</el-table-column>
<!-- 				<el-table-column prop="equipmentsName" label="保单号" align="center" width="200"></el-table-column>
				<el-table-column prop="equipmentsType" label="保险起期" align="center" width="150"></el-table-column>
				<el-table-column prop="passengerLastyear" label="保险止期" align="center" width="150"></el-table-column>
				<el-table-column prop="gradeCode" label="保单金额(元)" align="center" width="100"></el-table-column> -->
				<el-table-column prop="lossAmount" label="赔付额(元)" align="center" width="150">
					<template slot-scope="scope">
						<span v-if="scope.row.type == '1'">{{scope.row.lossAmount}}</span>
						<el-input v-if="scope.row.type == '2'" v-model="scope.row.lossAmount" placeholder="赔付额" size="small"></el-input>
					</template>
				</el-table-column>
<!-- 				<el-table-column prop="licenceNo" label="赔付率" align="center" width="80"></el-table-column> -->
				<el-table-column fixed="right" label="操作" align="center">
					<template slot-scope="scope" type="flex">
						<el-button @click="modify(scope.$index, scope.row)" type="text" size="small" class="item4"  icon="el-icon-edit"></el-button>
						<el-button @click="relation(scope.$index, scope.row)" type="text" size="small" class="item4" icon="el-icon-remove"></el-button>
						<el-button @click="savinformation(scope.$index, scope.row)" type="text" size="small" class="item4 item6" icon="el-icon-circle-check
"></el-button>
					</template>
				</el-table-column>
			 </el-table>
		</div>
		<div class="content2">
			<el-button type="info" class="item5" @click="resetForm">关闭</el-button>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js'
import elevatorType from '../../../static/data/elevatorType.json';
import safetyEvaluation from '../../../static/data/safetyEvaluation.json';
export default {
	data() {
		return {
			Elevator:new elevator(),
			data1:[],
			data2:[],
			id:0,
			list:[],
		}
	},
	created(){
      this.getCompensation();
	},
	methods: {
		async getCompensation(){
			this.data1 = [];
			this.data2 = [];
			let res = await this.Elevator.getCompensation(this.$route.query.id);
			if(res.code == '0000'){
				for(var i=0;i<res.list.length;i++){
					let data = {
						'year':'',
						'lossAmount':0,
						'type':'1',
						'id':0,
						'equipmentsId':0,
						'updateBy':'',
						'equipmentsType':'',
					};
					this.data1.push(data);
					this.data1[i].year = res.list[i].year;
					this.data1[i].lossAmount = res.list[i].lossAmount;
					this.data1[i].id = res.list[i].id;
					this.data1[i].equipmentsId = this.$route.query.id;
					this.data1[i].updateBy = res.list[i].createBy;
					this.data1[i].equipmentsType = res.list[i].equipmentsType;
				};
				this.data2 = this.data1;
			}
		},
		newlyadded(){
			let data = {
				'year':'',
				'lossAmount':0,
				'type':'2',
				'equipmentsId':this.$route.query.id,
				'createBy':window.sessionStorage.getItem('userCode'),
				'equipmentsType':'2'
			}
			this.data1.push(data);
		},
		modify(index,row){
			this.data1[index].type = '2';
		},
		async relation(index,row){
			if(this.data1[index].id){
				let res = await this.Elevator.deletePayoutByID(row.id);
				if(res.code == '0000'){
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getCompensation();
				}
			}else{
				this.data1.splice(index,1);
			}
		},
		async savinformation(index,row){
			var data3 = [];
			if(this.data1[index].id){
				data3.push(this.data1[index])
				let res = await this.Elevator.toupdate(data3);
				if(res.code == '0000'){
					this.$message({
						message: '修改成功',
						type: 'success'
					});
					this.getCompensation();
				}	
			}else{
				data3.push(this.data1[index]);
				let res = await this.Elevator.newadded(data3);
				if(res.code == '0000'){
					this.$message({
						message: '添加成功',
						type: 'success'
					});
					this.getCompensation();
				}
			}
		},
		resetForm(){
			this.$router.push({path:'/device/sd'})
		},
	},
}

</script>

<style lang="less">
#compensation{
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
	.content-table{
		width: 90%;
		margin-left: 5%;
		margin-top: 20px;
		.item4{
			font-size: 20px;
			text-decoration: underline;
			color: #4E80FF;
		}
		.item6{
			color: #28A627;
		}
		.el-dropdown-link{
			cursor:pointer;
		}
	}
	.conten1{
		width: 40%;
		text-align: right;
		height: 25px;
		line-height: 25px;
		.el-icon-circle-plus{
			color: #28A627;
		}
	}
	.content-total{
		width: 95%;
		height: 60px;
		line-height: 60px;
		text-align: right;
	}
	.content2{
		width: 100%;
		text-align: center;
		height: 60px;
		line-height: 60px;
		margin-top: 30px;
		.item5{
			width: 200px;
			height: 50px;
		}
	}
}
</style>
