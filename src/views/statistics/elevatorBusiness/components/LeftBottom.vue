<template>
  <div id="superviLeftBottom">
    <!-- <TitleSu title="案件走势" /> -->
<div class="topTitle">保费地区排名</div>
    <div style="width: 100; flex: 1" ref="lineEcharts"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import TitleSu from "./Title";
import resize from "../mixins/resize";
export default {
  name: "superviLeftBottom",
  mixins: [resize],
  props: {
    topFiveData: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  components: {
    TitleSu,
  },
  data() {
    return {
      myChart: null,
    };
  },
  mounted() {
    // this.$nextTick((_) => {
    //   this.initLineEcharts();
    // });
  },
  methods: {
    initLineEcharts(topFiveData) {
      this.myChart = echarts.init(this.$refs.lineEcharts);
      console.log(this.myChart);
      let nameArr = [];
      let dataArr = [];
      topFiveData.forEach(i => {
        nameArr.push(i.branchName)
        dataArr.push(i.afterPrem)
      })
      if(dataArr[0] > dataArr[dataArr.length - 1]) {
        nameArr.reverse();
        dataArr.reverse()
      }
      this.myChart.setOption({
         tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: function(arg) {
              return arg[0].name + '：' + arg[0].data + '万'
              //arg[0].name + '的分数是:' + arg[0].data
          }
        },
        yAxis: {
          type: "category",
          data: nameArr,
          axisLine: {
            //y轴
            show: false,
            lineStyle: {
              fontSize:'10%',
                    color: "#fff",
                }
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          splitLine: {
            //网格线
            show: false,
          },
        },
        xAxis: {
          type: "value",
          barCateGory: "12%",
             axisLine: {
            //y轴
            show: false,
            lineStyle: {
              fontSize:'10%',
                    color: "#fff",
                }
          },
        
          splitLine: {
            //网格线
            show: true,
          },
         
        },
        grid: {
          top: 0,
          left: "1%",
          right: "2%",
          bottom: "1%",
          containLabel: true,
       
        },
    
        series: [
          {
            data: dataArr,
            type: "bar",
            barWidth: '40%',
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
              },

              shadowColor: "rgba(0, 0, 0, 0.4)",
              shadowBlur: 20,
            },
          },
        ],
      });
    },
  },
};
</script>

<style lang="less">
#superviLeftBottom {
  // position: relative;
background-image: url(../../../../../static/img/teshe/bg2.png);
   background-color: #04044f;
    background-size: cover;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // flex-grow: 1;
  flex: 1;
    .topTitle{
    color: #32C5FF;
    margin-top: 5px;
    text-align: center;
 
  }
}
</style>