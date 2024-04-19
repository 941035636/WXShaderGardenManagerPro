<template>
	<div class="statistical-show" id="statisticalshow">
		<p style="text-align:center;line-height:50px;font-size:36px;color:#333;margin:10px 0;">特设保实时出单数据</p>
		<div class="title-content">
			<span class="gross-data" style="background-color:#2b908f;">
				<p class="data-content"><span>昨日数据</span></p>
				<p class="data-content"><span>保单：</span><span class="content-item">{{oldpolicySumm}}</span></p>
				<p class="data-content"><span>保费：</span><span class="content-item">{{oldpremSum}}</span></p>
			</span>
			<span class="gross-data" style="margin-left:27px;background-color:#f45b5b;">
				<p class="data-content"><span>今日数据</span></p>
				<p class="data-content"><span>保单：</span><span class="content-item">{{policySum}}</span></p>
				<p class="data-content"><span>保费：</span><span class="content-item">{{premSum}}</span></p>
			</span>
		</div>
		<div class="bottomdiv">
			<div class="tables">
				<span class="tables-icon" style="background-color:#fc7d11;"></span>
				<span style="color:#fc7d11;">去年同期数据</span>
				<span style="margin-left:10%;color:#333333;">{{oldyearday}}</span>
				<span style="margin-left:15%;color:#333333;">保单：{{oldyearcount}}</span>
				<span style="float: right;color:#333333;">保费：{{oldyearprem}}</span>
			</div>
		</div>
		<div style="display:flex;justify-content: center;">
			<el-progress :text-inside="true" :percentage="oldPer" color="#fc7d11" :stroke-width="16"  :format="lastyearFormt" style="width:80%;"></el-progress>
		</div>
		<div class="bottomdiv">
			<div class="tables">
				<span class="tables-icon" style="background-color:#5cb87a;"></span>
				<span style="color:#5cb87a;">今年今日数据</span>
				<span style="margin-left:10%;color:#333333;">{{newyearday}}</span>
				<span style="margin-left:15%;color:#333333;">保单：{{policySum}}</span>
				<span style="float: right;color:#333333;">保费：{{premSum}}</span>
			</div>
		</div>
		<div style="display:flex;justify-content: center; margin-bottom:20px;">
         	<el-progress :text-inside="true" :percentage="newPer" color="#5cb87a" :stroke-width="16" :format="newyearFormt" style="width:80%;"></el-progress>
      	</div>
		<div id="chart4" style="width:95%;height:45%;margin-left:3%;"></div>
		<div class="bottomdiv">
			<div class="tables">
				<span class="tables-icon" style="background-color:#fc7d11;"></span>
				<span style="color:#fc7d11;">{{newDateData[0] - 1}}:</span>
				<span style="margin-left:10%;color:#333333;">1/1—{{newDateData[1]}}/{{newDateData[2]}}</span>
				<span style="margin-left:15%;color:#333333;">保单：{{lastPolicy630}}</span>
				<span style="float: right;color:#333333;">保费：{{lastPrem630}}</span>
			</div>
		</div>
		<div style="display:flex;justify-content: center;">
			<el-progress :text-inside="true" :percentage="perLast" color="#fc7d11" :stroke-width="16"  :format="lastyearFormt630" style="width:80%;"></el-progress>
		</div>
		<div class="bottomdiv">
			<div class="tables">
				<span class="tables-icon" style="background-color:#5cb87a;"></span>
				<span style="color:#5cb87a;">{{newDateData[0]}}:</span>
				<span style="margin-left:10%;color:#333333;">1/1—{{newDateData[1]}}/{{newDateData[2]}}</span>
				<span style="margin-left:15%;color:#333333;">保单：{{nowPolicy630}}</span>
				<span style="margin-left:15%;color:#333333;">增比：<span style="color:#5cb87a;font-weight:600;"><span v-if="policyzengzhi > 0" style="color:#F55640;">↑</span><span v-else>↓</span></span>{{policyzengzhi}}%</span>
				<span style="margin-left:10%;color:#333333;">保费：{{nowPrem630}}</span>
				<span style="float: right;color:#333333;">增比：<span style="color:#5cb87a;font-weight:600;"><span v-if="premzengzhi > 0" style="color:#F55640;">↑</span><span v-else>↓</span></span>{{premzengzhi}}%</span>
			</div>
		</div>
		<div style="display:flex;justify-content: center; margin-bottom:70px;">
         	<el-progress :text-inside="true" :percentage="perNow" color="#5cb87a" :stroke-width="16" :format="newyearFormt630" style="width:80%;"></el-progress>
      	</div>
	</div>
</template>

<script>
import StatisticService from '../../service/StatisticService.js';
import moment from 'moment';
import echarts from 'echarts';
export default {
	data() {
		return{
			StatisticService:new StatisticService(),
			premSum: 0,//今天保费
			policySum: 0,//今天保单数
			oldpolicySumm: 0,// 昨天保单数
			oldpremSum: 0,// 昨天保费
			oldyearprem:0,//去年同期保费
			oldyearday:'',//去年日期
			newyearday:'',//现在日期
			oldyearcount:0,//去年同期保单数
			maxNum:0,
			oldPer:0,//去年进度条
			newPer:0,//今年进度条
			perNow:0,
			perLast:0,
			nowPrem630:0,//今年630至今保费数据
			nowPolicy630:0,//今年630至今保单数据
			lastPolicy630:0,//去年630至今保单数据
			lastPrem630:0,//去年630至今保费数据
			newDateData:[],
			policyzengzhi:0,
			premzengzhi:0,
			dateTime: [],
			premium: [],
			policyNum: [],
			oldpolicyNum: [],
			time:'',
			timer: null,  // 定时器
		}
	},
	computed:{
       
	},
	created(){
		this.getdatetime();
	},
	mounted() {
		if(this.timer){
			clearInterval(this.timer);
		}else{
			this.timer = setInterval(() =>{
				this.getdatetime();
			},60*60*1000);
		};
	},
	methods: {
		async getdatetime(){//获取服务器时间
			const res = await this.StatisticService.getdatetime();
			if(res.code == "0000"){
				this.newDateData.unshift(res.data.year,res.data.mouth,res.data.day);
				this.newyearday = res.data.year + '年' + res.data.mouth + '月' + res.data.day + '日';
				this.oldyearday = (res.data.year-1) + '年' + res.data.mouth + '月' + res.data.day + '日';
				if(res.data.minute < 10){
					res.data.minute = '0' + res.data.minute;
				}
				this.time = '数据获取时间' + ' ' + res.data.hour + ':' + res.data.minute;
				let colon = encodeURIComponent(':');
				let today = moment(new Date(res.data.year + '-' + res.data.mouth + '-' + res.data.day)).format('YYYY-MM-DD');
				let yesterday = moment(new Date(res.data.year + '-' + res.data.mouth + '-' + res.data.day) - 24*60*60*1000).format('YYYY-MM-DD');
				let lastyearday = moment(new Date((res.data.year - 1) + '-' + res.data.mouth + '-' + res.data.day)).format('YYYY-MM-DD');
				let datetoday =  res.data.year + '-01-01';
				let dateyesterday = (res.data.year - 1) + '-01-01';
				this.getStatisticData(today,yesterday,colon);
				this.getStatisticToday(today,colon,lastyearday);
				this.getStatisticYesterday(yesterday,colon);
				this.init630(datetoday,today,colon,dateyesterday,lastyearday);
			}
		},
		async getStatisticToday(t,c,l){//今天保单保费
			let s = t + ' ' + '00' + c + '00' + c + '00';
			let e = t + ' ' + '23' + c + '59' + c + '59';
			const res = await this.StatisticService.getStatisticDay(s,e);
			if(res.code == '0000'){
				this.policySum = res.data.policy_num;
				this.premSum = res.data.total_prem;
				this.getStatisticLastyearDay(l,c);
			}
		},
		async getStatisticYesterday(y,c){//昨天保单保费
			let s = y + ' ' + '00' + c + '00' + c + '00';
			let e = y + ' ' + '23' + c + '59' + c + '59';
			const res = await this.StatisticService.getStatisticDay(s,e);
			if(res.code == '0000'){
				this.oldpolicySumm = res.data.policy_num;
				this.oldpremSum = res.data.total_prem;
			}
		},
		async getStatisticLastyearDay(l,c){//去年同期保单保费
			let s = l + ' ' + '00' + c + '00' + c + '00';
			let e = l + ' ' + '23' + c + '59' + c + '59';
			const res = await this.StatisticService.getStatisticDay(s,e);
			if(res.code == '0000'){
				this.oldyearcount = res.data.policy_num;
				this.oldyearprem = res.data.total_prem;
				this.Proportion();
			}
		},
		async init630(dt,t,c,yt,l){//630到今天保单保费
			let s = dt + ' ' + '00' + c + '00' + c + '00';
			let e = t + ' ' + '23' + c + '59' + c + '59';
			const res = await this.StatisticService.getStatisticDay(s,e);
			if(res.code == '0000'){
				this.nowPolicy630 = res.data.policy_num;
				this.nowPrem630 = res.data.total_prem;
				this.dateyesterday630(yt,l,c);
			}
		},
		async dateyesterday630(yt,l,c){//去年630到同期保单保费
			let s = yt + ' ' + '00' + c + '00' + c + '00';
			let e = l + ' ' + '23' + c + '59' + c + '59';
			const res = await this.StatisticService.getStatisticDay(s,e);
			if(res.code == '0000'){
				this.lastPolicy630 = res.data.policy_num;
				this.lastPrem630 = res.data.total_prem;
				this.Proportions();
			}
		},
		Proportion(){//获取比例
			if(this.premSum > this.oldyearprem){
				this.maxNum = this.premSum
			}else{
				this.maxNum = this.oldyearprem;
			}
			this.perOne = this.maxNum/99.9;
			this.oldPer = (this.oldyearprem / this.perOne);
			this.newPer = (this.premSum / this.perOne);
			this.newPer = this.newPer<1?1:this.newPer;
		},
		Proportions(){//获取比例
			let max = 0;
			if(this.nowPrem630>this.lastPrem630){
				max = this.nowPrem630;
			}else{
				max = this.lastPrem630;
			}
			let per6 = max/99.9;
			this.perNow = (this.nowPrem630 / per6);
			this.perNow=this.perNow < 1?1:this.perNow;
			this.perLast = (this.lastPrem630 / per6);
			this.perLast=this.perLast<1?1:this.perLast;
			this.policyzengzhi = ((this.nowPolicy630/this.lastPolicy630-1)*100).toFixed(2)
          	this.premzengzhi = ((Number(this.nowPrem630)/Number(this.lastPrem630)-1)*100).toFixed(2)
		},
		lastyearFormt(perc){
       	 	return perc = `保费：${this.oldyearprem}`;
      	},
		newyearFormt(perc){
			return perc = `保费：${this.premSum}`;
		},
		lastyearFormt630(perc){
			return perc = `保费：${this.lastPrem630}`;
		},
		newyearFormt630(perc){
			return perc = `保费：${this.nowPrem630}`;
		},
		async getStatisticData(t,y,c){
			let s = t + ' ' + '00' + c + '00' + c + '00';
			let e = t + ' ' + '23' + c + '59' + c + '59';
			const res = await this.StatisticService.getStatisticHour(s,e);
			if(res.code == '0000'){
				this.getStatisticYesterData(y,c,res.data);
			}
		},
		async getStatisticYesterData(y,c,list){
			let s = y + ' ' + '00' + c + '00' + c + '00';
			let e = y + ' ' + '23' + c + '59' + c + '59';
			const res = await this.StatisticService.getStatisticHour(s,e);
			if(res.code == '0000'){
				this.dateTime = [];
				this.premium = [];
				this.policyNum = [];
				this.oldpolicyNum = [];
				let premiums = [];
				let policyNums = [];
				let total_prem = 0;
				let last_prem = 0;
				let policy_num = 0;
				let last_num = 0;
				let total = '';
				let last = '';
				let total_list1 = [];
				let last_list1 = [];
				list.forEach(item =>{
					if((item.date.split(' ')[1].split(':')[0] - 10) >= 0){
						let items = {
							time:item.date.split(' ')[1].split(':')[0] + ':' + item.date.split(' ')[1].split(':')[1],
							policy_num:item.policy_num,
							total_prem:item.total_prem
						};
						total_list1.push(items);

					};
					if((item.date.split(' ')[1].split(':')[0] - 10) < 0){
						total_prem += item.total_prem;
						policy_num += item.policy_num;
						total = "00:00-09:00"
					};
				})
				let items = {
					time:total,
					policy_num:policy_num,
					total_prem:total_prem
				};
				total_list1.unshift(items);
				res.data.forEach(item =>{
					if((item.date.split(' ')[1].split(':')[0] - 10) >= 0){
						let items = {
							time:item.date.split(' ')[1].split(':')[0] + ':' + item.date.split(' ')[1].split(':')[1],
							policy_num:item.policy_num,
							total_prem:item.total_prem
						};
						last_list1.push(items);

					};
					if((item.date.split(' ')[1].split(':')[0] - 10) < 0){
						last_prem += item.total_prem;
						last_num += item.policy_num;
						total = "00:00-09:00"
					};
				})
				let ele = {
					time:total,
					policy_num:last_num,
					total_prem:last_prem
				};
				last_list1.unshift(ele);
				total_list1.forEach(item =>{
					last_list1.forEach(ele =>{
						if(item.time == ele.time){
							let items = {
								'product': item.time,
								'今天保费':item.total_prem,
								'昨天保费':ele.total_prem,
							};
							this.dateTime.push(item.time);
							this.premium.push(items);
							this.policyNum.push(item.policy_num);
							this.oldpolicyNum.push(ele.policy_num);
							premiums.unshift(item.total_prem,ele.total_prem);
							policyNums.unshift(item.policy_num,ele.policy_num);
						}
					})
				});
				let premiummax = premiums.reduce(function(a,b){
					return b > a ? b : a;
				})
				let policyNummax = policyNums.reduce(function(a,b){
					return b > a ? b : a;
				})
				this.barStatistics = echarts.init(document.getElementById('chart4'));
				this.chartOptionss = {
					title: {
						text: this.time,
						textStyle: {
							fontSize: 16,
							color:'#333333'
						},
						x: '150',
						y:'0'
					},
					legend: {
						x: '350',
						y:'top',
						data: ['昨天保费', '今天保费','昨天保单','今天保单'],
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
						dimensions: ['product', '昨天保费', '今天保费'],
						source: this.premium
						},
						{
						dimensions: ['product','今天保单'],
						source: this.policyNum
						},
						{
						dimensions: ['product','昨天保单'],
						source: this.oldpolicyNum
						},
					],
					xAxis: [
						{type: 'category',
							data : this.dateTime,
							axisLabel: {
								show: true,
								interval: 0,
								rotate: 0,
								margin: this.dateTime.length,
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
						name: '保费金额（24小时）',
						max: premiummax * 1.2,
						min: 0
					},
					{
						type: 'value',
						scale: true,
						name: '保单数量(24小时)',
						max: policyNummax * 1.5,
						min: 0
					}
					],
					series: [
						{
							type: 'bar',
							itemStyle:{
								normal:{
									color: '#2b908f',
									label: {
										show: true,
										position: 'top', 
										textStyle: {
											color: '#2b908f',
											fontSize: 12
										}
									}
								}
							},
						},
						{
							type: 'bar',
							itemStyle:{
								normal:{
									color: '#f45b5b',
									label: {
										show: true,
										position: 'top', 
										textStyle: {
											color: '#f45b5b',
											fontSize: 12
										}
									}
								}
							},
						},
						{
							name:'昨天保单',
							type:'line',
							yAxisIndex: 1,
							data:this.oldpolicyNum,
							itemStyle:{
								normal:{
									color: '#2b908f',
									label: {
										show: true,
										position: 'top', 
										textStyle: {
											color: '#2b908f',
											fontSize: 12
										}
									}
								}
							},
						},
						{
							name:'今天保单',
							type:'line',
							yAxisIndex: 1,
							data:this.policyNum,
							itemStyle:{
								normal:{
									color: '#f45b5b',
									label: {
										show: true,
										position: 'top', 
										textStyle: {
											color: '#f45b5b',
											fontSize: 12
										}
									}
								}
							},
						},
					]
				}
				this.barStatistics.setOption(this.chartOptionss);
			}
		},
	},
	destroyed(){    
		clearInterval(this.timer)  
	},
}
</script>

<style lang="less">
#statisticalshow{
	width: 100%;
	height: 100%;
	background-color: #fff;
	.title-content{
		width: 100%;
		min-height: 100px;
		text-align: center;
		.gross-data{
			display: inline-block;
			width: 331px;
			height: 100%;
			box-shadow:0px 0px 3px 0px rgba(186,185,185,0.33);
			border-radius:3px;
			color: #fff;
			.data-title{
				width: 100%;
				height: 35px;
				line-height: 35px;
				font-size: 16px;
				font-weight: 600;
				color: #fff;
				text-align: left;
				padding-left: 10px;
				box-sizing: border-box;
			}
			.data-content{
				width: 100%;
				height: 35px;
				line-height: 35px;
				text-align: left;
				font-size: 16px;
				padding-left: 20px;
				box-sizing: border-box;
				.content-item{
					font-size: 26px;
					font-weight: bold;
					font-family:Arial;
				}
			}
		}
	}
	.bottomdiv{
		width: 100%;
		height: 3%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.tables{
			width: 80%;
			font-weight: bold;
			font-size: 12px;
			.tables-icon{
				display: inline-block;
				width: 4px;
				height: 11px;
			}
		}
	}
}
</style>
