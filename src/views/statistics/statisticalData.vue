<template>
	<div class="statisticalData" id="statisticalData">
		<h5>全国电梯投保概览</h5>
		<el-row type="flex" class="row-bg" justify="space-between" style="margin-bottom:20px;">
  			<el-col :span="7"><div class="item1">
				<span class="item2">{{data.jt_company_num}}</span><br/>
				<span class="item3">在保企业家数(家)</span>
			</div></el-col>
  			<el-col :span="7"><div class="item1">
				<span class="item2">{{data.lift_count_jt}}</span><br/>
				<span class="item3">江泰在保电梯数(部)</span>
			</div></el-col>
			<el-col :span="7"><div class="item1">
				<span class="item2">{{data.lift_count_total}}</span><br/>
				<span class="item3">全国电梯数(部)</span>
			</div></el-col>
			<el-col :span="7"><div class="item1">
				<span class="item4">{{data.total}}%</span><br/>
				<span class="item3">全国电梯投保率</span>
			</div></el-col>
		</el-row>
		<div class="contents">
			<div id="chart1" style="width:700px;height:500px;"></div>
			<div id="chart2" style="width:500px;height:300px;margin-top:150px;"></div>
		</div>
		<el-row type="flex" class="row-bgs" justify="space-between" style="margin-bottom:20px;">
  			<el-col :span="6"><div>
				<el-select v-model="value" placeholder="请选择" class="item5" size="small">
    				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
  				</el-select>
			</div></el-col>
  			<el-col :span="6"><div>
				<el-date-picker v-model="date1" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" class="item5" size="small"></el-date-picker>
			</div></el-col>
  			<el-col :span="6"><div>
				<el-date-picker v-model="date2" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" class="item5" size="small"></el-date-picker>
			</div></el-col>
			<el-col :span="6"><div>
				<el-button type="primary" size="small" @click="query">查询</el-button>
			</div></el-col>
		</el-row>
		<div class="bar-statistics">
			<p>电梯责任险总保费数据</p>
			<div class="lists">
				<div class="list1">
				<div class="list1-item">
					<span class="item6">{{date3}}至{{date4}}</span>
					<span class="item6 item7">{{totalpremium.toFixed(2)}}</span>
					<span class="item6">上年同比{{totalpremiumlastyear.toFixed(2)}}</span>
				</div>
				<div id="chart3"></div>
				</div>
				<div class="list2">
					<h6><span class="item8">{{totalpremium.toFixed(2)}}</span><span class="item8 item9">{{compared}}%</span></h6>
					<h6><span class="item10">阶段总保费</span><span class="item10">保费同比</span></h6>
					<h6><span class="item8">{{totalpolicynum.toFixed(0)}}</span><span class="item8">{{proportion}}%</span></h6>
					<h6><span class="item10">阶段保单数</span><span class="item10">续保保费占比</span></h6>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
//echarts
import echarts from 'echarts';
import '../../../node_modules/echarts/map/js/china.js';
import provinces from '../../../static/data/provinces.json';
export default {
	props:[
		"activeName"
	],
	data() {
		return{
			Elevator:new elevator(),
			data:{},
			options:[
				{
					value: '1',
          			label: '投保日期'
				},
				{
					value: '2',
          			label: '起保日期'
				}
			],
			value:'1',
			date1:'',
			date2:'',
			date3:'',
			date4:'',
			data3:[],
			data4:[],
			liftcounttotal:0,
			liftcountjt:0,
			liftcountot:0,
			totalpremium:0,
			totalpremiumlastyear:0,
			compared:0,
			totalpolicynum:0,
			totalpremiumrenewal:0,
			proportion:0,
		}
	},
	computed:{
       
	},
	created(){
		this.getNationalElevator();
		this.getProvinceElevator();
		this.getElevatorDutyPremium();
	},
	mounted() {
		
	},
	methods: {
		async getNationalElevator(){
			let data = {};
			const res = await this.Elevator.getNationalElevator(data);
			if(res.code == "0000"){
				this.data = res.data;
				let total = (this.data.lift_count_jt + this.data.lift_count_ot)/this.data.lift_count_total*100;
				this.data.total = total.toFixed(2);
			}
		},
		async getProvinceElevator(){
			let data = {};
			const res = await this.Elevator.getProvinceElevator(data);
			if(res.code == "0000"){
				for(var i=0;i<res.list.length;i++){
					for(var j=0;j<provinces.data.length;j++){
						if(res.list[i].province_code == provinces.data[j].code){
							res.list[i].province_code = provinces.data[j].name
						}
					}
					let total = (res.list[i].lift_count_jt?res.list[i].lift_count_jt:0) / (res.list[i].lift_count_total?res.list[i].lift_count_total:0);
					if(total == Infinity){
						total = 0;
					}else{
						total = total*100;
					};
					res.list[i].downloadSpeep = total.toFixed(2);
					this.liftcounttotal += res.list[i].lift_count_total;
					this.liftcountjt += res.list[i].lift_count_jt;
					this.liftcountot += res.list[i].lift_count_ot;
					let item = {
						'name': res.list[i].province_code,
						'value':res.list[i].lift_count_total?res.list[i].lift_count_total:0,
						'perf': res.list[i].lift_count_jt?res.list[i].lift_count_jt:0,
						'downloadSpeep': res.list[i].downloadSpeep,
					};
					this.data3.push(item)
				}
				this.chinachart = echarts.init(document.getElementById('chart1'));
				this.chartOption = {
					title: {
						text: '全国电梯投保分布',
						textStyle: {
							fontSize: 24,
							color:'#ffffff'
						},
						x: '40',
						y:'20'
					},
					tooltip: { // 鼠标移到图里面的浮动提示框
						formatter (params, ticket, callback) { // params.data 就是series配置项中的data数据遍历
							let localValue,perf,downloadSpeep,usability,point
							if (params.data) {
								localValue = params.data.value
								perf = params.data.perf
								downloadSpeep = params.data.downloadSpeep
								usability = params.data.usability
								point = params.data.point
							} else { // 为了防止没有定义数据的时候报错写的
								localValue = 0
								perf = 0
								downloadSpeep = 0
								usability = 0
								point = 0
							}
							let htmlStr = `<div style='font-size:18px;'> ${params.name}</div>
											<p style='text-align:left;margin-top:10px;'>电梯总数：${localValue}部<br/>
											投保电梯：${perf}部<br/>
											电梯投保率：${downloadSpeep}%<br/>
											</p>
										`
							return htmlStr
						}
					}, 
					dataRange: { // 左下角的颜色区域
						min: 0,
						max: 100000,
						left: 'left',
						top: 'bottom',
						itemWidth:20,
						itemHeight:140,
						inverse:true,
						orient:"horizontal",   
						text: ['高', '低'], // 文本，默认为数值文本
						calculable: true,
						inRange:{                             //定义 在选中范围中 的视觉元素
							color: ['#87CEFA','#FFFF00']
						},
					},
					geo: { // 地理坐标系组件用于地图的绘制
						map: 'china', // 表示中国地图
						roam: false, // 是否开启鼠标缩放和平移漫游
						zoom: 1.2, // 当前视角的缩放比例（地图的放大比例）
						label: {
							show: true
						},
						itemStyle: { // 地图区域的多边形 图形样式。
							borderColor: 'rgba(0, 0, 0, 0.2)',
							emphasis: { // 高亮状态下的多边形和标签样式
								shadowBlur: 20,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					},
					series: [
						{
						name: '', // 浮动框的标题（上面的formatter自定义了提示框数据，所以这里可不写）
						type: 'map',
						geoIndex: 0,
						label: {
							show: true
						},
						data: this.data3
						}
					]
				}
				// 使用刚指定的配置项和数据显示地图数据
				this.chinachart.setOption(this.chartOption);


				this.histogramStatistics = echarts.init(document.getElementById('chart2'));
				this.chartOptions = {
					tooltip: {
						trigger: 'item',
						formatter: "{b}:{d}%"
					},
					legend: {
						orient: 'vertical',
						x: 'right',
						data:['未在保','其他保险公司在保','江泰在保']
					},
					series: [
						{
							name:'访问来源',
							type:'pie',
							radius: ['50%', '70%'],
							avoidLabelOverlap: false,
							label: {
								normal: {
									show: false,
									position: 'center'
								},
								emphasis: {
									show: true,
									textStyle: {
										fontSize: '30',
										fontWeight: 'bold'
									}
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data:[
								{value:(this.liftcounttotal - this.liftcountjt - this.liftcountot), name:'未在保'},
								{value:this.liftcountot, name:'其他在保'},
								{value:this.liftcountjt, name:'江泰在保'}
							]
						}
					]
				}
				this.histogramStatistics.setOption(this.chartOptions);
			}
		},
		query(){
			if(this.date1 && this.date2){
				this.getElevatorDutyPremium();
			}else{
				this.$message({
					message: '请选择日期',
					type: 'warning'
				});
			}
		},
		async getElevatorDutyPremium(){
			var data = {};
			if(!this.date1 && !this.date2){
				data = {};
			}else{
				let date3 = (this.date1.split('-')[0] - 1) + '-' + this.date1.split('-')[1] + '-' + this.date1.split('-')[2];
				let date4 = (this.date2.split('-')[0] - 1) + '-' + this.date2.split('-')[1] + '-' + this.date2.split('-')[2];
				if(this.value == '1'){
					data = {
						"applicationStartDate":this.date1 + " " + "00:00:00",
						"applicationEndDate":this.date2 + " " + "23:59:59",
						"aLastStartDate":date3 + " " + "00:00:00",
						"aLastEndDate":date4 + " " + "23:59:59",
					}
				}else{
					data = {
						"policyStartDate":this.date1 + " " + "00:00:00",
						"policyEndDate":this.date2 + " " + "23:59:59",
						"pLastStartDate":date3 + " " + "00:00:00",
						"pLastEndDate":date4 + " " + "23:59:59",
					}
				}
			}
			const res = await this.Elevator.getElevatorDutyPremium(data);
			if(res.code == "0000"){
				this.data4 = [];
				for(var i=0;i<res.data.list.length;i++){
					let item = {
						'product': res.data.list[i].moths+'月',
						'同比':res.data.list[i].lift_count_jt_lastyear,
						'查询时间': res.data.list[i].lift_count_jt,
					};
					this.data4.push(item)
				}
				let yearFull = new Date().getFullYear();
				this.date3 = this.date1?this.date1:yearFull + '-' + '01' + '-' + '01';
				this.date4 = this.date2?this.date2:yearFull + '-' + '12' + '-' + '31';
				this.totalpremium = res.data.total_premium;
				this.totalpremiumlastyear = res.data.total_premium_lastyear;
				this.totalpolicynum = res.data.total_policynum;
				this.totalpremiumrenewal += res.data.total_premium_renewal;
				let compared = (this.totalpremium - this.totalpremiumlastyear)/this.totalpremiumlastyear*100;
				this.compared = compared.toFixed(2);
				let proportion = (this.totalpremiumrenewal/this.totalpremium)*100;
				this.proportion = proportion.toFixed(2);
				this.barStatistics = echarts.init(document.getElementById('chart3'));
				this.chartOptionss = {
					legend: {
						x: '30',
						y:'bottom',
						data: ['同比', '查询时间'],
					},
					tooltip: {},
					dataset: {
						dimensions: ['product', '同比', '查询时间'],
						source: this.data4
					},
					xAxis: {type: 'category'},
					yAxis: {
						type: 'value',
						scale: true,
						name: '投保电梯数',
						max: 100000,
						min: 0,
						boundaryGap: [0.2, 0.2]
					},
					// Declare several bar series, each will be mapped
					// to a column of dataset.source by default.
					series: [
						{type: 'bar'},
						{type: 'bar'}
					]
				}
				this.barStatistics.setOption(this.chartOptionss);
			}
		},
	},
}
</script>

<style lang="less">
#statisticalData{
	.row-bg{
		margin-top: 20px;
		width: 96%;
		margin-left: 2%;
		height: 100px;
		border: 1px solid #999999;
		.item1{
			text-align: center;
			.item2{
				font-size: 28px;
				color: #259B24;
				line-height: 50px;
			}
			.item3{
				font-size: 12px;
				color: #101010;
				line-height: 50px;
			}
			.item4{
				font-size: 28px;
				color: #101010;
				line-height: 50px;
			}
		}
	}
	.contents{
		display:flex; 
		background-color:#999999;
		width: 96%;
		margin-left: 2%;
	}
	.row-bgs{
		margin-top: 20px;
		width: 96%;
		margin-left: 2%;
		height: 60px;
		line-height: 60px;
		.item5{
			width: 200px;
		}
	}
	.bar-statistics{
		width: 96%;
		margin-left: 2%;
		height: 450px;
		border: 1px solid #999999;
		box-sizing: border-box;
		border-radius: 20px;
		p{
			width: 100%;
			height: 40px;
			line-height: 40px;
			text-align: left;
			padding-left: 20px;
			border-bottom: 1px solid #999999;
			box-sizing: border-box;
			font-weight: 600;
		}
		.lists{
			display:flex;
			width: 100%;
			height: 100%;
			.list1{
				width: 75%;
				height: 100%;
				border-right: 1px solid #999999;
				box-sizing: border-box;
				.list1-item{
					display: flex;
					width: 100%;
					height: 40px;
					justify-content: space-around;
					.item6{
						display: block;
						height: 40px;
						line-height: 40px;
					}
					.item7{
						color: #1581E8;
						font-size: 20px;
						font-weight: 600;
					}
				}
				#chart3{
					width: 100%;
					height: 340px;
				}
			}
			.list2{
				margin-left: 10px;
				margin-top: 100px;
				width: 25%;
				height:100%;
				.item8{
					display: inline-block;
					width: 50%;
					text-align: center;
					height: 60px;
					line-height: 60px;
					font-size: 18px;
					font-weight: 600;
					color: #F2A242;
				}
				.item9{
					color: #CC3300;
				}
				.item10{
					display: inline-block;
					width: 50%;
					text-align: center;
				}
			}
		}
	}
}
</style>
