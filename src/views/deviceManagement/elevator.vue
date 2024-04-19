<template>
	<div class="elevator" id="elevator">
		<div class="elesearchs">
			<el-button size="small" @click="takeBack" >{{title}}<i :class="icon"></i></el-button>
		</div>
		<transition name="mybox">
			<div class="elesearch" v-show="show">
				<div class="elesearch1">
					<el-row type="flex" class="row-bg">
						<el-col :span="6"><div>
							<span class="item2">电梯/出厂编号</span>
							<el-input placeholder="请输入电梯/出厂编号" v-model="input1" class="item1" size="small"></el-input>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">电梯投保状态</span>
							<el-select v-model="value" placeholder="请选择" class="item1" size="small">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">坐落地址</span>
							<el-cascader :options="options2" v-model="value1" change-on-select @change="handleChange" clearable class="item1" size="small"></el-cascader>
						</div></el-col>
						<el-col :span="6"><div>
							<span class="item2">使用单位</span>
							<el-input placeholder="请输入使用单位" v-model="value2" class="item1" size="small"></el-input>
						</div></el-col>
					</el-row>
				</div>
				<div class="elesearch2">
					<div class="item3">
						<el-button type="success" size="small" @click="searchview">查询</el-button>
						<el-button type="info" size="small" @click="empty">清空</el-button>
					</div>
				</div>
			</div>
		</transition>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit size='mini'>
				<el-table-column  type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="equipmentsCode" label="设备代码/出厂编号" align="center" min-width="170">
					<template slot-scope="scope">
						<span>{{scope.row.equipmentsCode?scope.row.equipmentsCode:scope.row.licenceNo}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="elevatorType" label="类型" align="center" min-width="70"></el-table-column>
				<el-table-column prop="elevatorYear" label="使用年限" align="center" min-width="80"></el-table-column>
				<el-table-column prop="height" label="重量(kg)/提升高度(m)" align="center" min-width="170"></el-table-column>
				<el-table-column prop="elevatorSite" label="使用场所" align="center" min-width="164"></el-table-column>
				<el-table-column prop="areaValue" label="电梯坐落区域" align="center" min-width="180"></el-table-column>
				<el-table-column prop="useOfAddress" label="坐落地址" align="center" min-width="150"></el-table-column>
				<el-table-column prop="startDate" label="保险起期" align="center" min-width="150"></el-table-column>
				<el-table-column prop="endDate" label="保险止期" align="center" min-width="150"></el-table-column>
				<el-table-column prop="producerName" label="生成商名称(品牌)" align="center" min-width="150"></el-table-column>
				<el-table-column prop="elevatorLevel" label="电梯安全评级" align="center" min-width="110"></el-table-column>
				<el-table-column prop="isManaged" label="有无专职人员管理" align="center" min-width="150">
					<template slot-scope="scope">
						<span v-if="scope.row.isManaged == '1'">有</span>
						<span v-if="scope.row.isManaged == '0'">否</span>
						<span v-if="scope.row.isManaged == null">---</span>
					</template>
				</el-table-column>
				<el-table-column prop="elevatorModel" label="电梯型号" align="center" min-width="80"></el-table-column>
				<el-table-column prop="useOfUnit" label="使用单位名称" align="center" min-width="180"></el-table-column>
				<el-table-column fixed="right" label="操作" align="center" min-width="125">
					<template slot-scope="scope" type="flex">
						<el-button @click="modify(scope.row)" type="text" size="mini" class="item4" v-if="datas.find(item => item.key == '60001')">修改</el-button>
						<el-button @click="relation(scope.row)" type="text" size="mini" class="item4" v-if="datas.find(item => item.key == '60002')">关联投保单</el-button>
					</template>
				</el-table-column>
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
import getCascaderObj from '../userCenter/js/selectedOptions.js';
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
import elevatorType from '../../../static/data/elevatorType.json';
import safetyEvaluation from '../../../static/data/safetyEvaluation.json';
import product from '../businessProcessing/data/dtProductList.json';
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
			datas:[],
			data1:[],
			value1:[],
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
			value:'',
            input1:'',  
			value11:'',
			value12:'',
			value13:"",
			value2:'',
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
		}
	},
	created(){
		this.datas = JSON.parse(window.sessionStorage.getItem('list'));
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
				this.options2 = this.ButtonSelection.Accessarea(parmes.data, window.sessionStorage.getItem('provinceCode'));
				if(window.localStorage.getItem('index') == '11'){
					this.gettingCache();
				}else{
					window.localStorage.removeItem('data');
					this.getElevator();
				}
			};
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
		async getElevator(){ //获取列表
			let data = {
				'state':this.value==""?0:this.value,
				'pageNum':this.pageNum,
				'pageSize':this.pagesize,
				'provinceCode':this.value11,
				'cityCode':this.value12,
				'countryCode':this.value13,
				'code':this.input1,
				'productCode':'',
				"useOfUnit":this.value2
			};
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				data.productCode = '';
			}else if(window.sessionStorage.getItem('branchCode') == 'JT0144000' || window.sessionStorage.getItem('branchCode') == 'JT0144001'){
				data.productCode = "19PR380223";
			}else{
				product.data.find(item =>{
					if(item.branchCode == window.sessionStorage.getItem('branchCode')){
						data.productCode = item.productCode;
					}
				})
			}
			let index = '11';
			window.localStorage.setItem('data',JSON.stringify(data));
			window.localStorage.setItem('index',index);
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
						selectedOptions.push(this.data1[i].areaCodeFirst.slice(0,2) + '0000');
					}
					if(this.data1[i].areaCodeSecond && this.data1[i].areaCodeFirst != this.data1[i].areaCodeSecond){
						selectedOptions.push(this.data1[i].areaCodeSecond.slice(0,4) + '00');
					}
					if(this.data1[i].areaCodeThird && this.data1[i].areaCodeThird != this.data1[i].areaCodeSecond){
						selectedOptions.push(this.data1[i].areaCodeThird);
					}else if(this.data1[i].areaCodeSecond && this.data1[i].areaCodeFirst != this.data1[i].areaCodeSecond && this.data1[i].areaCodeSecond.slice(4,6) != '00'){
						selectedOptions.push(this.data1[i].areaCodeSecond);
					}
					var vals = this.select.getlable(selectedOptions, this.options2);
					if(vals.length == '1'){
						this.data1[i].areaValue = vals[0].label;
					}else if(vals.length == '2'){
						this.data1[i].areaValue = vals[0].label + vals[1].label;
					}else if(vals.length == '3'){
						if(vals[2]){
							this.data1[i].areaValue = vals[0].label + vals[1].label + vals[2].label;
						}else{
							this.data1[i].areaValue = vals[0].label + vals[1].label;
						}
					}else{
						this.data1[i].areaValue = '-';
					}
				}
			}
		},
		gettingCache(){ //获取搜索条件
			let data = JSON.parse(window.localStorage.getItem('data'));
			this.input1 = data.code;
			this.value11 = data.provinceCode;
			this.value12 = data.cityCode;
			this.value13 = data.countryCode;
			this.value2 = data.useOfUnit;
			if(!data.state){
				this.value = '';
			}else{
				this.value = data.state;
			}
			this.pageNum = data.pageNum;
			this.currentPage = data.pageNum;
			this.value1.push(this.value11);
			this.value1.push(this.value12);
			this.value1.push(this.value13);
			this.getElevator();
		},
		searchview(){ //搜索
			this.pageNum = 1;
			this.currentPage = 1;
			this.getElevator();
		},
		empty(){ //清空
			this.input1 = '';
			this.value = '';
			this.value1 = [];
			this.value11 = '';
			this.value12 = '';
			this.value13 = '';
			this.value2 = '';
			this.pageNum = 1;
			this.currentPage = 1;
			this.getElevator();
		},
		handleCurrentChange: function(pageNum){ //翻页
		    this.pageNum = pageNum;
			this.getElevator();
		},
		modify(row){ //修改电梯信息
			this.$router.push({
				path:'/device/dt/edit',
				query:{
					id:row.id
				}
			})	
		},
		relation(row){ //关联投保单
			if(row.equipmentsCode){
				this.$router.push({
					path:'/device/dt/relation',
					query:{
						code:row.equipmentsCode
					}
				})
			}else{
				this.$router.push({
					path:'/device/dt/relation',
					query:{
						code:row.licenceNo
					}
				})
			}
		},
	},
}

</script>

<style lang="less">
#elevator{
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
		min-height: 234px;
		padding: 20px 20px 10px;
		margin: 20px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;	
		overflow: hidden;
		.elesearch1{
			width: 100%;
			.item1{
				width: 220px;
				margin-top: 5px;
			}
			.item4{
				width: 106px;
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
		}
		.elesearch2{
			width: 100%;
			height: 30px;
			margin-top: 10px;
			margin-bottom: 10px;
			.item3{
				width: 100%;
				text-align: right;
				box-sizing: border-box;
			}
		}
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
}
</style>
