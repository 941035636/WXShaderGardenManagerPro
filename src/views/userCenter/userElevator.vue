<template>
	<div class="userElevator" id="userElevator">
		<div class="elesearchs">
			<el-button size="small" @click="takeBack" >{{title}}<i :class="icon"></i></el-button>
		</div>
		<transition name="mybox">
			<div class="elesearch" v-show="show">
				<el-row type="flex" class="row-bg">
					<el-col :span="6"><div>
						<span class="item2">电梯/出厂编号</span>
						<el-input placeholder="请输入电梯/出厂编号" v-model="value" class="item1" size="small"></el-input>
					</div></el-col>
					<el-col :span="6"><div>
						<span class="item2">电梯投保状态</span>
						<el-select v-model="value2" placeholder="请选择" class="item1" size="small" clearable>
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div></el-col>
					<el-col :span="6"><div>
						<span class="item2">坐落地址</span>
						<el-cascader :options="options2" v-model="value1" change-on-select @change="handleChange" clearable class="item1" size="small"></el-cascader>
					</div></el-col>
					<el-col :span="6"><div class="item3">
						<el-button type="success" size="small" @click="searchview">查询</el-button>
						<el-button type="info" size="small" @click="empty">清空</el-button>
					</div></el-col>
				</el-row>
			</div>
		</transition>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border size='small'>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="equipmentsCode" label="设备代码/出厂编号" align="center" min-width="170">
					<template slot-scope="scope">
						<span>{{scope.row.equipmentsCode?scope.row.equipmentsCode:scope.row.licenceNo}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="elevatorType" label="类型" align="center" width="70"></el-table-column>
				<el-table-column prop="elevatorYear" label="使用年限" align="center" width="80"></el-table-column>
				<el-table-column prop="height" label="重量(kg)/提升高度(m)" align="center" width="170"></el-table-column>
				<el-table-column prop="elevatorSite" label="使用场所" align="center" width="164"></el-table-column>
				<el-table-column prop="areaValue" label="电梯坐落区域" align="center" width="180"></el-table-column>
				<el-table-column prop="useOfAddress" label="坐落地址" align="center" width="150"></el-table-column>
				<el-table-column prop="endDate" label="保险止期" align="center" width="150"></el-table-column>
				<el-table-column prop="producerName" label="生成商名称(品牌)" align="center" width="150"></el-table-column>
				<el-table-column prop="elevatorLevel" label="电梯安全评级" align="center" width="110"></el-table-column>
				<el-table-column prop="isManaged" label="有无专职人员管理" align="center" width="150">
					<template slot-scope="scope">
						<span v-if="scope.row.isManaged == '1'">有</span>
						<span v-if="scope.row.isManaged == '0'">否</span>
						<span v-if="scope.row.isManaged == null"></span>
					</template>
				</el-table-column>
				<el-table-column prop="elevatorModel" label="电梯型号" align="center" width="80"></el-table-column>
				<el-table-column prop="useOfUnit" label="使用单位名称" align="center" width="180"></el-table-column>
			 </el-table>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import publicConfiguration from '../../global/publicConfiguration.js';
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
import getCascaderObj from './js/selectedOptions';
import divisor from '../../global/divisor.json';
import elevatorType from '../../../static/data/elevatorType.json';
import safetyEvaluation from '../../../static/data/safetyEvaluation.json';
export default {
	data() {
		return {
			Elevator:new elevator(),
			publicConfiguration:new publicConfiguration(),
			select:new getCascaderObj(),
			ButtonSelection:new buttonSelection(),
			show:true,
			title:'收回',
			icon:'el-icon-arrow-up',
			productCode:'',
			data1:[],
			value:'',
			value1:[],
			value11:'',
			value12:'',
			value13:"",
			value2:"",
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
			options2:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
		}
	},
	created(){
		for(var i=0;i<divisor.data.length;i++){
			if(window.sessionStorage.getItem('branchCode') == divisor.data.branchCode){
				this.productCode = divisor.data.productCode;
			}
			if(window.sessionStorage.getItem('branchCode') == "JT0000"){
				this.productCode = "";
			}
		};
        this.getArea();
	},
	methods: {
		takeBack(){ // 搜索条件的展开与收回
			let data  = this.publicConfiguration.switchs(this.show);
			this.show = data.show;
			this.title = data.title;
			this.icon = data.icon;
		},
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.options2 = parmes.data;
				this.getElevator();
				this.options2 = this.ButtonSelection.Accessarea(parmes.data, window.sessionStorage.getItem('provinceCode'));
			};
		},
		async getElevator(){ //获取列表
			let data = {
				'state':this.value2==""?0:this.value2,
				'pageNum':this.pageNum,
				'pageSize':this.pagesize,
				'provinceCode':this.value11,
				'cityCode':this.value12,
				'countryCode':this.value13,
				'code':this.value,
				'productCode':this.productCode,
				'userCode':this.$route.query.userCode
			}
			let res = await this.Elevator.getElevators(data);
			if(res.code == '0000'){
				this.data1 = res.list;
				this.total = res.total;
				for(var i=0;i<this.data1.length;i++){
					for(var j=0;j<elevatorType.data.length;j++){
						if(this.data1[i].elevatorType == elevatorType.data[j].code){
							this.data1[i].elevatorType = elevatorType.data[j].name;
						}
					};
					for(var l=0;l<safetyEvaluation.data.length;l++){
						if(this.data1[i].elevatorLevelCode == safetyEvaluation.data[l].value){
							this.data1[i].elevatorLevel = safetyEvaluation.data[l].label;
						}
					};
					if(this.data1[i].elevatorYear){ //年份
						this.data1[i].elevatorYear = this.data1[i].elevatorYear + '年';
					}else{
						this.data1[i].elevatorYear = "";
					};
					if(this.data1[i].elevatorType == "直梯"){ // 根据类型判断是weight还是height
						if(!this.data1[i].weight){
							this.data1[i].height = '';
						}else{
							this.data1[i].height = this.data1[i].weight + 'Kg';
						}
					}else{
						if(!this.data1[i].height){
							this.data1[i].height = '';
						}else{
							this.data1[i].height = this.data1[i].height + 'm';
						}
					};
					var selectedOptions = [];
					if(this.data1[i].areaCodeFirst){
						selectedOptions.push(this.data1[i].areaCodeFirst);
					}
					if(this.data1[i].areaCodeSecond && this.data1[i].areaCodeFirst != this.data1[i].areaCodeSecond){
						selectedOptions.push(this.data1[i].areaCodeSecond);
					}
					if(this.data1[i].areaCodeThird && this.data1[i].areaCodeThird != this.data1[i].areaCodeSecond){
						selectedOptions.push(this.data1[i].areaCodeThird);
					}
					var vals = this.select.getlable(selectedOptions, this.options2);
					if(vals.length == '1'){
						this.data1[i].areaValue = vals[0].label;
					}else if(vals.length == '2'){
						this.data1[i].areaValue = vals[0].label + vals[1].label;
					}else if(vals.length == '3'){
						this.data1[i].areaValue = vals[0].label + vals[1].label + vals[2].label;
					}else{
						this.data1[i].areaValue = '-';
					}
				}
			}
		},
		handleChange(value){ //选择地区
			if(value.length == 1){
				this.value11 = value[0];
				this.value12 = '';
				this.value13 = '';
			}else if(value.length == 2){
				this.value11 = value[0];
				this.value12 = value[1];
				this.value13 = '';
			}else if(value.length == 3){
				this.value11 = value[0];
				this.value12 = value[1];
				this.value13 = value[2];
			}else{
				this.value11 = '';
				this.value12 = '';
				this.value13 = '';
			}
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.getElevator();
		},
		empty(){ //清空
			this.value = '';
			this.value1 = [];
			this.value11 = '';
			this.value12 = '';
			this.value13 = '';
			this.value2 = '';
			this.getElevator();
		},
		handleCurrentChange: function(pageNum){ //翻页
		    this.pageNum = pageNum;
			this.getElevator();
		},
	},
}

</script>

<style lang="less">
#userElevator{
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
	}
	.content-total{
		width: 95%;
		height: 60px;
		line-height: 60px;
		text-align: right;
	}
}
</style>
