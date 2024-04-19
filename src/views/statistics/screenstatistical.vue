<template>
	<div class="screenstatistical" id="screenstatistical">
		<div class="contents">
			<div id="chart3" style="width:100%;height:700px;"></div>
			<div id="chart4" style="width:100%;height:700px; matgin-top:50px;"></div>
			<div id="chart5" style="width:100%;height:700px; matgin-top:50px;"></div>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
//echarts
import echarts from 'echarts';
export default {
	data() {
		return{
			Elevator:new elevator(),
			data1:[],
			data2:[],
			data3:[],
			data4:[],
			data5:[],
			data6:[],
			data7:[],
		}
	},
	computed:{
       
	},
	created(){
		this.getdatetime();
	},
	mounted() {
		
	},
	methods: {
		async getdatetime(){
			const res = await this.Elevator.getdatetime();
			if(res.code == "0000"){
				let nowdate = res.data.year + '-' + res.data.mouth + '-' + res.data.day;
				let lastdate = (res.data.year-1) + '-' + res.data.mouth + '-' + res.data.day;
				this.getqueryElevatorTotal(nowdate,lastdate);
			}
		},
		async getqueryElevatorTotal(nowdate,lastdate){
			let data = {
				areaScope:'1',
				date1: nowdate + ' 23:59:59',
				date2: lastdate + ' 23:59:59',
			}
			const res = await this.Elevator.getqueryElevatorTotal(data);
			if(res.code == "0000"){
				this.data4 = [];
				res.data.elevatorTotalVOS1.forEach(item => {
					res.data.elevatorTotalVOS2.forEach(ele => {
						if(item.areaCode == ele.areaCode){
							let items = {
								'product': item.areaName,
								'2019年电梯数':item.elevatorTotal,
								'2018年电梯数': ele.elevatorTotal,
							};
							this.data1.push(items),
							this.data2.push(item.areaName)
						}
					})
				})
				this.barStatistics = echarts.init(document.getElementById('chart3'));
				this.chartOptionss = {
					title: {
						text: '各省市电梯责任险投保台数统计',
						textStyle: {
							fontSize: 24,
							color:'#333333'
						},
						x: 'center',
						y:'0'
					},
					legend: {
						x: '150',
						y:'bottom',
						data: ['2019年电梯数', '2018年电梯数'],
					},
					tooltip: {},
					dataset: {
						dimensions: ['product', '2019年电梯数', '2018年电梯数'],
						source: this.data1
					},
					xAxis: {type: 'category',
							data : this.data2,
							axisLabel: {
								show: true,
								interval: 0,
								rotate: 0,
								margin: this.data2.length,
								inside: false,
								textStyle: {
									fontWeight: '500',
									fontsize:'20'
								}
							}
					},
					yAxis: {
						type: 'value',
						scale: true,
						name: '电梯（台）',
						max: 1000000,
						min: 0,
						interval: 50000,
					},
					// Declare several bar series, each will be mapped
					// to a column of dataset.source by default.
					series: [
						{type: 'bar',
							itemStyle: {
								normal: {
									color: '#DFB568',//设置柱子颜色
								}
							}
						},
						{type: 'bar',
							itemStyle: {
								normal: {
									color: '#259B24',//设置柱子颜色
								}
							}
						}
						
					]
				}
				this.barStatistics.setOption(this.chartOptionss);
				res.data.elevatorTotalVOS1.forEach(item => {
					let items = {
						'product': item.areaName,
						'地区电梯数':item.elevatorTotal,
						'在保电梯数': item.insElevatorTotal,
					};
					this.data3.push(items);
					this.data4.push(item.areaName);
					this.data5.push(((item.insElevatorTotal/item.elevatorTotal)*100).toFixed(2)) + '%';
				})
				this.barStatistics = echarts.init(document.getElementById('chart4'));
				this.chartOptionss = {
					title: {
						text: '各省市电梯责任险统保率统计',
						textStyle: {
							fontSize: 24,
							color:'#333333'
						},
						x: 'center',
						y:'0'
					},
					legend: {
						x: '150',
						y:'bottom',
						data: ['地区电梯数', '在保电梯数','统保率'],
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							crossStyle: {
								color: '#999'
							}
						}
					},
					dataset: [
						{
						dimensions: ['product', '地区电梯数', '在保电梯数'],
						source: this.data3
						},
						{
						dimensions: ['product', '统保率'],
						source: this.data5
						},
					],
					xAxis: [
						{type: 'category',
							data : this.data4,
							axisLabel: {
								show: true,
								interval: 0,
								rotate: 0,
								margin: this.data4.length,
								inside: false,
								textStyle: {
									fontWeight: '500',
									fontsize:'20'
								}
							}
						},
					],
					yAxis: [
						{
						type: 'value',
						scale: true,
						name: '电梯（台）',
						max: 1000000,
						min: 0,
						interval: 50000,
					},
					{
						type: 'value',
						scale: true,
						name: '统保率(%)',
						max: 100,
						min: 0,
						interval: 10,
					}
					],
					// Declare several bar series, each will be mapped
					// to a column of dataset.source by default.
					series: [
						{type: 'bar'},
						{type: 'bar'},
						{name:'统保率',
            			type:'line',
						yAxisIndex: 1,
						data:this.data5}
					]
				}
				this.barStatistics.setOption(this.chartOptionss);
				this.data6 = [];
				res.data.employerTotalList.forEach(item => {
					let items = {
						'地区': item.areaName,
						'保费收入':item.premTotal,
					};
					this.data6.push(items);
					this.data7.push(item.areaName);
				})
				this.barStatistics = echarts.init(document.getElementById('chart5'));
				this.chartOptionss = {
					title: {
						text: '各省市电梯雇主责任险累计保费统计',
						textStyle: {
							fontSize: 24,
							color:'#333333'
						},
						x: 'center',
						y:'0'
					},
					legend: {
						x: '150',
						y:'bottom',
						data: ['保费收入'],
						textStyle: {
							color: '#878787',//值的具体的颜色
						}
					},
					tooltip: {},
					dataset: {
						dimensions: ['地区', '保费收入'],
						source: this.data6
					},
					xAxis: {type: 'value',
							scale: true,
							name: '保费（元）',
							max: 3000000,
							min: 0,
							interval: 300000,	
					},
					yAxis: {
						type: 'category',
						data : this.data7,
						axisLabel: {
							show: true,
							interval: 0,
							rotate: 0,
							margin: this.data7.length,
							inside: false,
							textStyle: {
								fontWeight: '500',
								fontsize:'20'
							}
						}
					},
					series: [
						{type: 'bar',
						itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'right', //在上方显示
									textStyle: { //数值样式
										color: 'black',
										fontSize: 16
									}
								}
							}
						}
						}
					]
				}
				this.barStatistics.setOption(this.chartOptionss);
			}
		},
	},
}
</script>

<style lang="less">
#screenstatistical{
	width: 100%;
	min-height: 1000px;
	background-color: #fff;
	padding: 30px 40px 80px;
	box-sizing: border-box;
}
</style>
