<template>
  <div id="superviRightCenter">
   
     <div class="topTitle">电梯责任险总保费数据</div>
     <div class="select-data">
		 <el-select v-model="value" @change="changeYear" placeholder="请选择" style="width:80px;margin-right:10px" class="fr" size="small">
			<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
  		 </el-select>
     </div>
    <div style="width: 100; flex: 3" ref="lineEchart"></div>
    <div class="right-bottom">
      <div class="border_three">
        <p class="elevator_num">{{rightCenterData.prem}}万元</p>
        <p class="elevator_text">阶段总保费</p>
      </div>
      <div class="border_three">
        <p class="elevator_num">{{rightCenterData.premRate}}</p>
        <p class="elevator_text">保费增比</p>
      </div>
      <div class="border_three">
        <p class="elevator_num">{{rightCenterData.policyCount}}</p>
        <p class="elevator_text">阶段保单数</p>
      </div>
	  <div class="border_three">
        <p class="elevator_num">{{rightCenterData.renewalRate}}</p>
        <p class="elevator_text">续保保费占比</p>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import TitleSu from "./Title";
import resize from "../mixins/resize";
export default {
  name: "superviRightCenter",
  components: {
    TitleSu,
  },
   mixins: [resize],
  data() {
    return {
	  value: '2022',
	  options: [],
    };
  },
  props: {
    rightCenterData: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  mounted() {
	  this.options = [];
	  let year = new Date().getFullYear();
	  this.value = year;
	  for(let i = 2020; i <= year; i ++) {
		  this.options.push({
			  value: i,
			  label: i
		  })
	  }
    this.$nextTick((_) => {
    //   this.initlineEchart(this.rightCenterData.monthList);
    });
  },
  methods: {
    handlerPeifu(data) {
      let monthLen = 12;
      let list = [];
      data.forEach(i => {
		  list.unshift({
			month: i.month + "月",
			closed: i.thisPrem,
			report: i.lastPrem,
		  });
      })
      return list;
    },
    initlineEchart(data) {
      let handlerData = this.handlerPeifu(data);
      this.myChart = echarts.init(this.$refs.lineEchart);
      console.log(this.myChart, "000000");
      this.myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          show:false
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom:0,
      top:0,
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
             "axisLine": {       //y轴
                    "show": false
                },
                "axisTick": {       //y轴刻度线
                    "show": false
                },
                 "splitLine": {     //网格线
                    "show": false
                },
                show:false

        },
        yAxis: {
          type: "category",
             axisLine: {
            //y轴
            show: false,
            lineStyle: {
              fontSize:'10%',
                    color: "#fff",
                }
          },
                "axisTick": {       //y轴刻度线
                    "show": false
                },
                 "splitLine": {     //网格线
                    "show": false
                },
          data: handlerData.map((item) => item.month),
        },
        series: [
          {
            name: "本年度（万元）",
            type: "bar",
             barWidth : '30%',
            data: handlerData.map((item) => item.report),
            itemStyle: {
               normal: {
                   color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#2378f7",
                },
                {
                  offset: 1,
                  color: "#2cccfd",
                },
              ]),
                label: {
                
                  show: true,
                  position: "right",
                  textStyle: {
                  
                    fontSize: "50%",
                    color: "#2cccfd"}

                 }},
                
       
            
              shadowColor: "rgba(0, 0, 0, 0.4)",
              shadowBlur: 20,

           
            },
          },
          {
            name: "上一年度（万元）",
            type: "bar",
            barGap:0,
             barWidth : '30%',
            data: handlerData.map((item) => item.closed),
            itemStyle: {
               normal: {
                     color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                   color: "#b9c309",
                 
                },
                {
                  offset: 1,
                  color: "#EEDB61",
                },
              ]),
                label: {
                
                  show: true,
                  position: "right",
                  textStyle: {
                  
                    fontSize: "50%",
                    color: "#EEDB61"}

                 }},
              
              shadowColor: "rgba(0, 0, 0, 0.4)",
              shadowBlur: 20,

              //  color: "#EEDB61",
            },
          },
        ],
      });
    },
	changeYear() {
		this.$parent.getYearAndMonth(this.value);
	}
  },
};
</script>

<style lang="less" scoped>
#superviRightCenter {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
    background-image: url(../../../../../static/img/teshe/bg1.png);
   background-color: #04044f;
    background-size: 100% auto;
      .topTitle{
    color: #32C5FF;
    margin-top: 5px;
    text-align: center;
 
  }
  .select-data {
	  margin-top: -10%;
  }
  .right-bottom {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: row;
  }
  .border_three {
    margin: 5px;
    height: 80px;
    border-radius: 5px;
      background-image: url(../../../../../static/img/teshe/szbf41.png);
  background-repeat: no-repeat;
    background-size:100% 98%;
    text-align: center;
    flex: 1;
    box-sizing: border-box;
    .elevator_num {
      margin-top: 20px;
      font-size: 16px;
      font-weight: 700;
      color: #66fbfd;
    }
    .elevator_text {
      margin-top: 10px;
    
      font-size: 12px;
font-weight: 500;
      color: #fff;
    }
  }
}
</style>