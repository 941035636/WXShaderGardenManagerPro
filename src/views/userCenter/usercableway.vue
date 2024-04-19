<template>
	<div class="usercableway" id="usercableway">
		<div class="elesearchs">
			<el-button size="small" @click="takeBack" >{{title}}<i :class="icon"></i></el-button>
		</div>
		<transition name="mybox">
			<div class="elesearch" v-show="show">
				<el-row type="flex" class="row-bg">
					<el-col :span="6"><div>
						<span class="item2">索道名称/索道注册号</span>
						<el-input placeholder="请输入索道名称/索道注册号" v-model="input1" class="item1" size="small"></el-input>
					</div></el-col>
					<el-col :span="6"><div>
						<span class="item2">索道投保状态</span>
						<el-select v-model="value" placeholder="请选择" class="item1" size="small">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div></el-col>
					<el-col :span="6"><div class="item3">
						<el-button type="success" size="small" @click="searchview">查看</el-button>
						<el-button type="info" size="small" @click="empty">清空</el-button>
					</div></el-col>
				</el-row>
			</div>
		</transition>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" border size='small'>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="orgFullName" label="企业名称" align="center" width="170"></el-table-column>
				<el-table-column prop="equipmentsName" label="索道名称" align="center" width="170"></el-table-column>
				<el-table-column prop="equipmentsType" label="索道类型" align="center" width="80">
					<template slot-scope="scope">
						<span v-if="scope.row.equipmentsType == '1'">往复式</span>
						<span v-if="scope.row.equipmentsType == '2'">固定抱索式</span>
						<span v-if="scope.row.equipmentsType == '3'">脱挂式</span>
						<span v-if="scope.row.equipmentsType == '4'">其他</span>
					</template>
				</el-table-column>
				<el-table-column prop="passengerLastyear" label="上年度运送乘客人次(万)" align="center" width="170">
					<template slot-scope="scope">
						<span v-if="scope.row.passengerLastyear == '1'">10万以下</span>
						<span v-if="scope.row.passengerLastyear == '2'">10万（含）-50万 </span>
						<span v-if="scope.row.passengerLastyear == '3'">50万（含）-100万 </span>
						<span v-if="scope.row.passengerLastyear == '4'">100万及以上 </span>
					</template>
				</el-table-column>
				<el-table-column prop="gradeCode" label="5s评级信息" align="center" width="164">
					<template slot-scope="scope">
						<span v-if="scope.row.gradeCode == '0'">未参与评级</span>
						<span v-if="scope.row.gradeCode == '1'">一级</span>
						<span v-if="scope.row.gradeCode == '2'">二级</span>
						<span v-if="scope.row.gradeCode == '3'">三级</span>
						<span v-if="scope.row.gradeCode == '4'">四级</span>
						<span v-if="scope.row.gradeCode == '5'">五级</span>
					</template>
				</el-table-column>
				<el-table-column prop="areaValue" label="最近三年出险情况" align="center" width="180"></el-table-column>
				<el-table-column prop="licenceNo" label="" align="center" width="200"></el-table-column>
				<el-table-column prop="licenceStartDate" label="合格证或检验有效期限开始日期" align="center" width="150"></el-table-column>
				<el-table-column prop="licenceEndDate" label="合格证或检验有效期限截止日期" align="center" width="150"></el-table-column>
				<el-table-column prop="licenceFile" label="影印件" align="center" width="160"></el-table-column>
				<el-table-column prop="registerNo" label="客运索道设备代码" align="center" width="200"></el-table-column>
			 </el-table>
		</div>
		<div class="content-total">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize"  :total="total"></el-pagination>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import publicConfiguration from '../../global/publicConfiguration.js';
import elevatorType from '../../../static/data/elevatorType.json';
import safetyEvaluation from '../../../static/data/safetyEvaluation.json';
export default {
	data() {
		return {
			Elevator:new elevator(),
			publicConfiguration:new publicConfiguration(),
			show:true,
			title:'收回',
			icon:'el-icon-arrow-up',
            input1:'',  
			value:'',
			options:[
				{
					"value": 2,
					"label": "保障中"
				},
				{
					"value": 1,
					"label": "待续保"
				},
				{
					"value": 3,
					"label": "未在保"
				}
			],
			data1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
		}
	},
	created(){
		this.getElevator();
	},
	methods: {
		takeBack(){// 搜索条件的展开与收回
			let data  = this.publicConfiguration.switchs(this.show);
			this.show = data.show;
			this.title = data.title;
			this.icon = data.icon;
		},
		async getElevator(){//获取列表
			let data = {
				'state':this.value==""?0:this.value,
				'pageNum':this.pageNum,
				'pageSize':this.pagesize,
				'nameOrCode':this.input1,
				'userCode':this.$route.query.userCode
			}
			let res = await this.Elevator.getcablewaylist(data);
			if(res.code == '0000'){
				this.data1 = res.list;
				this.total = res.total;
			}
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.getElevator();
		},
		empty(){//清空
			this.input1 = '';
			this.value = '';
			this.getElevator();
		},
		handleCurrentChange: function(pageNum){//翻页
		    this.pageNum = pageNum;
			this.getElevator();
		},	
	},
}

</script>

<style lang="less">
#usercableway{
	padding-top: 20px;
	padding-bottom: 80px;
	background-color: #ffffff;
	.elesearchs{
		width: 90%;
		height: 40px;
		margin-left: 5%;
		text-align: right;
		margin-top:10px;
	}
	.mybox-leave-active,.mybox-enter-active{
	    transition:  all .5s linear; 
	}
	.mybox-leave-active,.mybox-enter{
	    height:0px !important;
	}
	.mybox-leave,.mybox-enter-active{
	    height: 80px;
	}
	.elesearch{
		width: 90%;
		height: 80px;
		margin-left: 5%;
		padding-left: 10px;
		box-sizing: border-box;
		overflow: hidden;
		.item1{
			width: 200px;
			margin-top: 5px;
		}
		.item2{
			display: inline-block;
			width: 200px;
			line-height: 25px;
			padding-left:1em;
			box-sizing: border-box;
			font-size: 12px;
		}
		.item3{
			margin-top: 30px;
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
		.el-dropdown-link{
			cursor:pointer;
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
