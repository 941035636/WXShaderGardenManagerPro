<template>
	<div class="cableway" id="cableway">
		<div class="elesearchs">
			<el-button size="small" @click="takeBack" >{{title}}<i :class="icon"></i></el-button>
		</div>
		<transition name="mybox">
			<div class="elesearch" v-show="show">
				<el-row type="flex" class="row-bg">
					<el-col :span="6"><div>
						<span class="item2">索道名称/客运索道设备代码</span>
						<el-input placeholder="请输入索道名称/客运索道设备代码" v-model="nameOrCode" class="item1" size="small"></el-input>
					</div></el-col>
					<el-col :span="6"><div>
						<span class="item2">索道投保状态</span>
						<el-select v-model="state" placeholder="请选择" class="item1" size="small">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div></el-col>
					<el-col :span="6"><div>
						<span class="item2">企业名称</span>
						<el-input placeholder="请输入企业名称" v-model="orgFullName" class="item1" size="small"></el-input>
					</div></el-col>
					<el-col :span="6"><div class="item3">
						<el-button type="success" size="small" @click="searchview">查询</el-button>
						<el-button type="info" size="small" @click="empty">清空</el-button>
					</div></el-col>
				</el-row>
			</div>
		</transition>
		<div class="content1">
			<el-button type="primary" size="small" @click="nextto" v-if="datas.find(item => item.key == '60007')">新增</el-button>
			<!-- <el-button type="primary" size="small" v-if="datas.find(item => item.key == '60008')">导出</el-button> -->
		</div>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" border fit size='mini'>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="orgFullName" label="企业名称" align="center" min-width="200"></el-table-column>
				<el-table-column prop="equipmentsName" label="索道名称" align="center" min-width="170"></el-table-column>
				<el-table-column prop="registerNo" label="客运索道设备代码" align="center" min-width="200"></el-table-column>
				<el-table-column prop="equipmentsType" label="索道类型" align="center" min-width="120">
					<template slot-scope="scope">
						<span v-if="scope.row.equipmentsType == '1'">往复式</span>
						<span v-if="scope.row.equipmentsType == '2'">固定抱索式</span>
						<span v-if="scope.row.equipmentsType == '3'">脱挂式</span>
						<span v-if="scope.row.equipmentsType == '4'">其他</span>
					</template>
				</el-table-column>
				<el-table-column prop="passengerLastyear" label="上年度运送乘客人次(万)" align="center" min-width="170">
					<template slot-scope="scope">
						<span v-if="scope.row.passengerLastyear == '1'">10万以下</span>
						<span v-if="scope.row.passengerLastyear == '2'">10万（含）-50万 </span>
						<span v-if="scope.row.passengerLastyear == '3'">50万（含）-100万 </span>
						<span v-if="scope.row.passengerLastyear == '4'">100万及以上 </span>
					</template>
				</el-table-column>
				<el-table-column prop="endDate" label="保险止期" align="center" min-width="150"></el-table-column>
				<el-table-column prop="gradeCode" label="5s评级信息" align="center" min-width="164">
					<template slot-scope="scope">
						<span v-if="scope.row.gradeCode == '0'">未参与评级</span>
						<span v-if="scope.row.gradeCode == '1'">一级</span>
						<span v-if="scope.row.gradeCode == '2'">二级</span>
						<span v-if="scope.row.gradeCode == '3'">三级</span>
						<span v-if="scope.row.gradeCode == '4'">四级</span>
						<span v-if="scope.row.gradeCode == '5'">五级</span>
					</template>
				</el-table-column>
				<el-table-column prop="yearPayout1" label="最近三年出险情况" align="center" min-width="180">
					<template slot-scope="scope">
						<p v-if="scope.row.yearPayout1 != null"><span>{{scope.row.nowYear - 1}}</span>年:{{scope.row.yearPayout1}}元</p>
						<p v-if="scope.row.yearPayout2 != null"><span>{{scope.row.nowYear - 2}}</span>年:{{scope.row.yearPayout2}}元</p>
						<p v-if="scope.row.yearPayout3 != null"><span>{{scope.row.nowYear - 3}}</span>年:{{scope.row.yearPayout3}}元</p>
					</template>
				</el-table-column>
				<el-table-column prop="licenceNo" label="客运索道安全检验合格证编号或监督检验报告编号" align="center" min-width="200"></el-table-column>
				<el-table-column prop="licenceStartDate" label="合格证或检验有效期限开始日期" align="center" min-width="160"></el-table-column>
				<el-table-column prop="licenceEndDate" label="合格证或检验有效期限截止日期" align="center" min-width="160"></el-table-column>
				<el-table-column prop="licenceFile" label="影印件" align="center" min-width="160">
					<template slot-scope="scope">
						<p v-if="scope.row.licenceFile" class="item-next" @click="btnNext(scope.row)">特种设备使用标志影印件</p>
						<p v-if="scope.row.registerFile" class="item-next" @click="btnNexts(scope.row)">客运索道安全检验合格证或监督检验报告影印件</p>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template slot-scope="scope" type="flex">
						<el-dropdown size="small" trigger="click">
							<span class="el-dropdown-link">操作</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item @click.native="modify(scope.row)" v-if="datas.find(item => item.key == '60009')">编辑</el-dropdown-item>
								<el-dropdown-item @click.native="relation(scope.row)" v-if="datas.find(item => item.key == '60010')">删除</el-dropdown-item>
								<el-dropdown-item @click.native="premium(scope.row)" v-if="datas.find(item => item.key == '60011')">赔付情况</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
			 </el-table>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<el-dialog
		  title="提示"
		  :visible.sync="dialogVisible"
		  width="30%">
		  <span>是否删除这条索道信息</span>
		  <span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible=false">取 消</el-button>
			<el-button type="primary" @click="deletes">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js'
import publicConfiguration from '../../global/publicConfiguration.js';
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
import elevatorType from '../../../static/data/elevatorType.json';
import safetyEvaluation from '../../../static/data/safetyEvaluation.json';
import ResourcesService from '../../service/ResourcesService';
export default {
	data() {
		return {
			Elevator:new elevator(),
			publicConfiguration:new publicConfiguration(),
			ButtonSelection:new buttonSelection(),
			ResourcesService:new ResourcesService(),
			show:true,
			title:'收回',
			icon:'el-icon-arrow-up',
            nameOrCode:'',  
			state:'',
			orgFullName:'',
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
			dialogVisible:false,
			nameid:'',
			datas:[],
		}
	},
	created(){
		this.datas = JSON.parse(window.sessionStorage.getItem('list'));
		if(window.localStorage.getItem('index') == '12'){
			this.gettingCache();
		}else{
			window.localStorage.removeItem('data');
			this.getElevator();
		}
	},
	methods: {
		nextto(){
			this.$router.push({
				path:'/device/sd/add',
			})
		},
		takeBack(){ // 搜索条件的展开与收回
			let data  = this.publicConfiguration.switchs(this.show);
			this.show = data.show;
			this.title = data.title;
			this.icon = data.icon;
		},
		async getElevator(){
			let data = {
				'state':this.state==""?0:this.state,
				'pageNum':this.pageNum,
				'pageSize':this.pagesize,
				'nameOrCode':this.nameOrCode,
				"orgFullName":this.orgFullName 
			}
			let index = '12';
			window.localStorage.setItem('data',JSON.stringify(data));
			window.localStorage.setItem('index',index);
			let res = await this.Elevator.getcablewaylist(data);
			if(res.code == '0000'){
				this.data1 = res.list;
				this.total = res.total;
			}
		},
		gettingCache(){
			let data = JSON.parse(window.localStorage.getItem('data'));
			this.nameOrCode = data.nameOrCode;
			if(!data.state){
				this.state = '';
			}else{
				this.state = data.state;
			}
			this.orgFullName = data.orgFullName;
			this.pageNum = data.pageNum;
			this.currentPage = data.pageNum;
			this.getElevator();
		},
		async btnNext(row){
			let res = await this.ResourcesService.downloadOrViewFile(row.licenceFileUrl,true)
		},
		async btnNexts(row){
			let res = await this.ResourcesService.downloadOrViewFile(row.registerFileUrl,true)
		},
		searchview(){
			this.pageNum = 1;
			this.currentPage = 1;
			this.getElevator();
		},
		empty(){
			this.nameOrCode = '';
			this.state = '';
			this.orgFullName = "";
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
				path:'/device/sd/edit',
				query:{
					userCode:row.userCode,
					valueindex:'1',
					registerNo:row.registerNo,
				}
			})
		},
		relation(row){
			this.dialogVisible = true;
			this.nameid = row.id;
		},
		async deletes(){
			let res = await this.Elevator.deleteCableway(this.nameid);
			if(res.code == '0000'){
				this.dialogVisible = false;
				this.$message({
					message: '删除成功',
					type: 'success'
				});
				this.gettingCache();
			}
		},	
		premium(row){
			this.$router.push({
				path:'/device/sd/compensation',
				query:{
					id:row.id
				}
			})
		},
	},
}

</script>

<style lang="less">
#cableway{
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
		min-height: 150px;
		padding: 20px 20px 10px;
		margin: 0px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;	
		overflow: hidden;
		.item1{
			width: 200px;
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
		.item3{
			margin-top: 30px;
		}
	}
	.content1{
		width: 96%;
		margin-top: 20px;
		height: 30px;
		text-align: right;
		margin-left:2%;
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
		.el-dropdown-link{
			cursor:pointer;
		}
		.item-next{
			color: #1581E8;
			text-decoration: underline;
			cursor:pointer;
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
