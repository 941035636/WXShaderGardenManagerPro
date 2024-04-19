<template>
	<div class="nationalElevator" id="nationalElevator">
		<div class="elesearchs">
			<el-button size="small" @click="takeBack" >{{title}}<i :class="icon"></i></el-button>
		</div>
		<transition name="mybox">
			<div class="elesearch" v-show="show">
				<el-row type="flex" class="row-bg">
					<el-col :span="6"><div>
						<span class="item2">坐落地址</span>
						<el-cascader :options="options2" v-model="areaCode" change-on-select clearable class="item1" size="small"></el-cascader>
					</div></el-col>
					<el-col :span="6"><div  class="item3">
						<!-- <span class="item2">投保渠道</span>
						<el-select v-model="channel" placeholder="请选择" class="item1" size="small">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select> -->
						<el-button type="success" size="small" @click="searchview">查询</el-button>
						<el-button type="info" size="small" @click="empty">清空</el-button>
					</div></el-col>
					<el-col :span="6"><div>
						<!-- <span class="item2">选择年度</span>
						<el-input placeholder="请输入电梯/出厂编号" v-model="year" class="item1" size="small"></el-input> -->
					</div></el-col>
					<el-col :span="6"><div>
						
					</div></el-col>
				</el-row>
			</div>
		</transition>
		<div class="content1">
			<el-button type="primary" size="small" @click="newlyadded" v-if="datas.find(item => item.key == '60003')">新增</el-button>
			<el-button type="primary" size="small" @click="nextto" v-if="datas.find(item => item.key == '60004')">导出</el-button>
		</div>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit size='mini'>
				<!-- <el-table-column prop="" label="年度" align="center" min-width="170"></el-table-column> -->
				<el-table-column prop="provinceName" label="省" align="center" min-width="120"></el-table-column>
				<el-table-column prop="cityName" label="市" align="center" min-width="120"></el-table-column>
				<el-table-column prop="countryName" label="区" align="center" min-width="120"></el-table-column>
				<el-table-column prop="otherEquipmentsCount" label="其他渠道投保数量(部)" align="center" min-width="160"></el-table-column>
				<el-table-column prop="allEquipmentsCount" label="该地区保有量(部)" align="center" min-width="160"></el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template slot-scope="scope" type="flex">
						<el-button @click="modify(scope.row)" type="text" size="small" class="item4"  icon="el-icon-edit" v-if="datas.find(item => item.key == '60005')"></el-button>
						<el-button @click="relation(scope.row)" type="text" size="small" class="item4" icon="el-icon-remove" v-if="datas.find(item => item.key == '60006')"></el-button>
					</template>
				</el-table-column>
			 </el-table>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<el-dialog
		title="修改信息"
		:visible.sync="dialogVisible"
		width="600px">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="230px" class="demo-ruleForm" size="small">
			<el-form-item label="区域" prop="areaCodes">
				<el-cascader :options="options2" v-model="areaCodes" change-on-select disabled class="form-item1" size="small"></el-cascader>
			</el-form-item>
			<el-form-item label="该地区其他渠道投保数量" prop="otherEquipmentsCount">
				<el-input v-model.trim="ruleForm.otherEquipmentsCount" autocomplete="off" placeholder="请输入该地区其他渠道投保数量" class="form-item1"> <template slot="append">部</template></el-input>
			</el-form-item>
			<el-form-item label="该地区保有量" prop="allEquipmentsCount">
				<el-input v-model.trim="ruleForm.allEquipmentsCount" autocomplete="off" placeholder="请输入该地区保有量" class="form-item1"> <template slot="append">部</template></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="modifyupdate">确 定</el-button>
		</span>
		</el-dialog>
		<el-dialog
		title="提示"
		:visible.sync="dialogVisibles"
		width="30%">
		<span>是否删除这条数据</span>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisibles = false">取 消</el-button>
			<el-button type="primary" @click="getDeleteinformation">确 定</el-button>
		</span>
		</el-dialog>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import ResourcesService from '../../service/ResourcesService'
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
import elevatorType from '../../../static/data/elevatorType.json';
export default {
	data() {
		var licenceNoNumber = (rule, value, callback) => {
			const licenceReg = /^\d+$/
			if (value == "" && value != 0) {
			return callback(new Error("投保数量不能为空"))
			}
			if (value<0) {
			return callback(new Error("投保数量不能小于0"))
			}
			setTimeout(() => {
				if (licenceReg.test(value)) {
					callback()
				} else {
					callback(new Error("投保数量只能为数字"))
				}
			}, 100)
		};
		var equipmentsCodeNumber = (rule, value, callback) => {
			const equipmentsCodeReg = /^\d+$/
			if (value == "" && value != 0) {
			return callback(new Error("该地区保有量不能为空"))
			}
			if (value<0) {
			return callback(new Error("该地区保有量不能小于0"))
			}
			setTimeout(() => {
				if (equipmentsCodeReg.test(value)) {
					callback()
				} else {
					callback(new Error("该地区保有量只能为数字"))
				}
			}, 100)
		};
		return {
			Elevator:new elevator(),
			ButtonSelection:new buttonSelection(),
			ResourcesService: new ResourcesService(),
			show:true,
			title:'收回',
			icon:'el-icon-arrow-up',
			datas:[],
			options2:[],  
			areaCode:[],
			data:{
				areaCodeFirst:'',
				areaCodeSecond:'',
				areaCodeThird:'',
				pageNum:1,
				pageSize:10,
				equipmentsType:'1'
			},
			data1:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			dialogVisible:false,
			areaCodes:[],
			ruleForm: {
				userCode:window.sessionStorage.getItem("userCode"),
				provinceCode:'',
				provinceName:'',
				cityCode:'',
				cityName:'',
				countryCode:'',
				countryName:'',
				otherEquipmentsCount:0,
				allEquipmentsCount:0,
				equipmentsType:'1'
			},
			rules: {
			  otherEquipmentsCount: [{validator: licenceNoNumber, required: true,trigger: 'blur' }],
			  allEquipmentsCount: [{ validator: equipmentsCodeNumber,required: true, trigger: 'blur' }],
			},
			dialogVisibles:false,
		}
	},
	created(){
		this.datas = JSON.parse(window.sessionStorage.getItem('list'));
		this.getArea();
		if(window.localStorage.getItem('index') == '13'){
			this.gettingCache();
		}else{
			this.getElevator();
		}
	},
	methods: {
		takeBack(){
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
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.options2 = this.ButtonSelection.Accessarea(parmes.data, window.sessionStorage.getItem('provinceCode'));
			};
		},
		async getElevator(){
			this.data.pageNum = this.pageNum;
			if(this.areaCode.length == 1){
				this.data.areaCodeFirst = this.areaCode[0];
				this.data.areaCodeSecond = '';
				this.data.areaCodeThird = '';
			}else if(this.areaCode.length == 2){
				this.data.provinceCode = this.areaCode[0];
				this.data.areaCodeSecond = this.areaCode[1];
				this.data.areaCodeThird = '';
			}else if(this.areaCode.length == 3){
				this.data.provinceCode = this.areaCode[0];
				this.data.areaCodeSecond = this.areaCode[1];
				this.data.areaCodeThird = this.areaCode[2];
			}else{
				if(window.sessionStorage.getItem('provinceCode').slice(2,4) != '00'){
					this.data.provinceCode = window.sessionStorage.getItem('provinceCode').slice(0,2) + '0000';
					this.data.areaCodeSecond = window.sessionStorage.getItem('provinceCode').slice(0,4) + '00';
					this.data.areaCodeThird = '';
				}else{
					if(window.sessionStorage.getItem('provinceCode') == "000000"){
						this.data.provinceCode = '';
						this.data.areaCodeSecond = '';
						this.data.areaCodeThird = '';
					}else{
						this.data.provinceCode = window.sessionStorage.getItem('provinceCode');
						this.data.areaCodeSecond = '';
						this.data.areaCodeThird = '';
					}
				}
			};
			let index = '13';
			window.localStorage.setItem('data',JSON.stringify(this.data));
			let res = await this.Elevator.getElevatorStatistics(this.data);
			if(res.code == '0000'){
				this.data1 = res.list;
				this.total = res.total;
			}
		},
		gettingCache(){
			let data = JSON.parse(window.localStorage.getItem('data'));
			this.data = data;
			if(data.areaCodeFirst){
				this.areaCode.push(data.areaCodeFirst);
			};
			if(data.areaCodeSecond){
				this.areaCode.push(data.areaCodeSecond);
			};
			if(data.areaCodeThird){
				this.areaCode.push(data.areaCodeThird);
			};
			this.pageNum = data.pageNum;
			this.currentPage = data.pageNum;
			this.getElevator();
		},
		newlyadded(){
			this.$router.push({
				path:'/device/dt/byl/add',
				query:{
					
				}
			})
		},
		nextto(){
			let href = this.$apiUrl.ELEEXPORT + '?areaCodeFirst=' + this.data.areaCodeFirst + '&areaCodeSecond=' + this.data.areaCodeSecond + '&areaCodeThird=' + this.data.areaCodeThird + '&equipmentsType=1' + '&pageNum=' + this.data.pageNum + '&pageSize=10';
			this.$logger.info('A0802','','');
			this.ResourcesService.exportsViewFile(href)
			this.trackEvent('统计','导出电梯保有量');
			
		},
		searchview(){
			this.pageNum = 1;
			this.getElevator();
		},
		empty(){
			this.areaCode = [];
			this.data = {
				areaCodeFirst:'',
				areaCodeSecond:'',
				areaCodeThird:'',
				pageNum:1,
				pageSize:10,
				equipmentsType:'1'
			};
			this.getElevator();
		},
		handleCurrentChange: function(pageNum){
		    this.pageNum = pageNum;
			this.getElevator();
		},
		modify(row){
			this.dialogVisible = true;
			this.ruleForm = {
				userCode:window.sessionStorage.getItem("userCode"),
				provinceCode:row.provinceCode,
				provinceName:row.provinceName,
				cityCode:row.cityCode,
				cityName:row.cityName,
				countryCode:row.countryCode,
				countryName:row.countryName,
				otherEquipmentsCount:row.otherEquipmentsCount?row.otherEquipmentsCount:0,
				allEquipmentsCount:row.allEquipmentsCount?row.allEquipmentsCount:0,
				equipmentsType:'1'
			},
			this.areaCodes = [];
			if(row.provinceCode){
				this.areaCodes.push(row.provinceCode);
			};
			if(row.cityCode){
				this.areaCodes.push(row.cityCode);
			};
			if(row.countryCode){
				this.areaCodes.push(row.countryCode);
			};
		},
		modifyupdate(ruleForm){
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					if(!this.areaCodes){
						this.$message({
          					message: '请选择省市区',
          					type: 'warning'
						});
						return;
					}
					this.preservations();
				} else {
					return false;
				}
				
			});
		},
		async preservations(){
			let parmes = await this.Elevator.getModifyupdate(this.ruleForm);
			if(parmes.code == '0000'){
				this.$message({
          			message: '修改成功',
          			type: 'success'
				});
				this.dialogVisible = false;
				this.getElevator();
			}
		},
		relation(row){
			this.dialogVisibles = true;
			this.ruleForm = {
				userCode:window.sessionStorage.getItem("userCode"),
				provinceCode:row.provinceCode,
				provinceName:row.provinceName,
				cityCode:row.cityCode,
				cityName:row.cityName,
				countryCode:row.countryCode,
				countryName:row.countryName,
				otherEquipmentsCount:row.otherEquipmentsCount,
				allEquipmentsCount:row.allEquipmentsCount,
				equipmentsType:'1',
				id:row.id
			};
		},
		async getDeleteinformation(){
			let parmes = await this.Elevator.getDeleteinformation(this.ruleForm.id);
			if(parmes.code == '0000'){
				this.$message({
          			message: '删除成功',
          			type: 'success'
				});
				this.dialogVisibles = false;
				this.getElevator();
			}
		},
	},
}

</script>

<style lang="less">
#nationalElevator {
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
	    height: 80px;
	}
	.elesearch{
		width: calc(100% - 40px);
		min-height: 150px;
		padding: 20px 20px 10px;
		margin: 20px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;	
		.item1{
			width: 200px;
			margin-top: 5px
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
			margin-top: 30px
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
	}
	.content-total{
		width: 96%;
		height: 60px;
		line-height: 60px;
		text-align: right;
	}
	.form-item1{
		width: 250px;
	}
}
</style>
