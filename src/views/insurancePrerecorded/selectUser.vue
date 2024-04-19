<template>
	<div class="selectUser" id="selectUser">
		<div class="elesearchs">
			<el-button size="small" @click="takeBack" >{{title}}<i :class="icon"></i></el-button>
		</div>
		<transition name="mybox">
			<div class="elesearch" v-show="show">
				<div class="elesearch1">
					<el-row type="flex" class="row-bg">
						<el-col :span="6">
							<div class="ts-ht-flex">
								<el-input placeholder="用户名/用户名称/手机号" v-model.trim="value1" class="item1" size="small" clearable @clear="userList"></el-input>
								<el-button class="ts-yl-btn" type="success" size="small" @click="userList">查询</el-button>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</transition>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border size='small'>
				<el-table-column label="选择" width="50" align="center">
					<template slot-scope="scope"> 
						<div style="text-align: center; padding-left:5px">  

							<el-radio :label="scope.row" v-model="templateRadio" >&nbsp;</el-radio>
						</div>
					</template>
				</el-table-column>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="userloginId" label="用户名" align="center" width="170"></el-table-column>
				<el-table-column prop="custFullName" label="用户名称" align="center" width="170"></el-table-column>
				<el-table-column prop="userType" label="用户类型" align="center"></el-table-column>
				<!-- <el-table-column prop="height" label="手机号" align="center" width="130"></el-table-column> -->
				<el-table-column prop="area" label="所在地区" align="center" ></el-table-column>
				<el-table-column prop="areaValue" label="认证状态" align="center" width="180">
					<template slot-scope="scope"> 
						<span >{{scope.row.auditStatus=='1'?'已认证 ':'未认证'}}</span>
					</template>
				</el-table-column>
			 </el-table>
		</div>
		<div class="content-total">
			<el-pagination layout="prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize"  :total="total"></el-pagination>
			<div>
				<el-button type="primary" @click="nextbu" size="small">下一步</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js'
import elevatorType from '../../../static/data/elevatorType.json';
import policyStatus from '../../../static/data/policyStatus.json';
import insuranceType from '../../../static/data/insuranceType.json';
export default {
	data() {
		return {
			show:true,
			title:'收回',
			icon:'el-icon-arrow-up',
            value1:'',
			templateRadio:'',
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
		async userList(){
			var value = '';
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				
			}else{
				value = window.sessionStorage.getItem('provinceCode')
			}
			 let form = {
				'areaCode':value,
				'loginIdOrUserName':this.value1,
				'pageNum':this.pageNum,
				'pageSize':this.pagesize,
				'papers':'',
				'userType':'',
			}
			let res = await this.Elevator.getuserlist(form);
			if(res.code=='0000'){
				this.total=res.total;
				this.data1 = res.list;
				this.data1.forEach(val=>{
					let province = val.areaCode.slice(0,2)+'0000';
					let city = val.areaCode.slice(0,4)+'00';
					let area = val.areaCode;
					let areaValueFirst='';
					let areaValueSecond='';
					let areaValueThird='';
					this.options4.forEach(item =>{
						if(item.value == province){
							areaValueFirst= item.label
							item.children.forEach(cityS=>{
								if(cityS.value == city){
									areaValueSecond= cityS.label
									cityS.children.forEach(areaS=>{
										if(areaS.value== area){
											areaValueThird= areaS.label;
											return
										}
									})
								}
							})
						}
						val.area=`${areaValueFirst}${areaValueSecond}${areaValueThird}`;
					})
				})
			}
		},
		policyStatu(){
			this.options3 = policyStatus.data;
			this.options1 = insuranceType.data;
		},
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code=='0000'){
				this.options4 = parmes.data;
				this.userList();	// 获取用户列表
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
		handleSizeChange(pagesize) {
			this.pagesize = pagesize;
			this.userList();
		},
		handleCurrentChange: function(pageNum){
		    this.pageNum = pageNum;
			this.userList();
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
		nextbu(){
			
			if(!this.templateRadio){
				this.$message.error('请选择预录人员');
				return
			}
			window.sessionStorage.removeItem('policyData')	// 清楚上一个页面的缓存form
			window.sessionStorage.removeItem('applicant')	// 清楚上一个页面的缓存投保人
			window.sessionStorage.removeItem('elevatorMessage')	// 清楚上一个页面的缓存（电梯）
			window.sessionStorage.removeItem('productClassifyList')	// 清楚上一个页面的缓存（方案）
			this.$router.push({
				path:'/productCategories',
				query:{
					userCode:this.templateRadio.userCode,
					userType:this.templateRadio.userType
				}
			})
		},
	},
}

</script>

<style lang="less">
#selectUser {
	padding-top: 10px;
	padding-bottom: 180px;
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
		height: 80px;
		border: 1px solid #808080;
		margin-left: 5%;
		padding-left: 10px;
		box-sizing: border-box;
		.elesearch1{
			width: 100%;	
			.ts-ht-flex{
				display: flex;
				flex-direction: row;
				padding-top: 20px;
				.item1{
					width: 220px;
					margin-top: 5px;
					margin-right: 20px;
				}
				.ts-yl-btn{
					margin-top: 6px;
					height: 30px;
				}
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
