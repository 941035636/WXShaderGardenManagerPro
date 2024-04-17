<template>
  <div id="caseTendency"></div>
</template>

<script>
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import { GridComponent } from 'echarts/components'
echarts.use([GridComponent])
import { BarChart } from 'echarts/charts'
echarts.use([BarChart])
import resize from '../../../../mixins/resize'
export default {
  mixins: [resize],
  data() {
    return {
      myChart: null,
    }
  },
  mounted() {},
  methods: {
    init(data) {
      let arr = []
      for (let i = 1; i <= 12; i++) {
        arr.push(i + '月')
      }
      let numArr1 = data.map((item) => {
        return item.caseNum
      })
      let numArr2 = data.map((item) => {
        return item.caseCloseNum
      })
      let numArr = data.map((item) => {
        return item.payMoney
      })
      this.myChart = echarts.init(document.getElementById('caseTendency'))
      var Chart = echarts.init(document.getElementById('caseTendency'))
      this.myChart.setOption({
        color: ['#6AD07B', '#FF6950'],
        title: {
          text: '案件趋势',
          top: '3%',
          left: '2%',
          textStyle: {
            //文字颜色
            color: '#fff',
            //字体风格,'normal','italic','oblique'
            fontStyle: 'normal',
            //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
            fontWeight: 'bold',
            //字体系列
            fontFamily: 'sans-serif',
            //字体大小
            fontSize: 18,
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['报案数', '结案数', '理赔金额'],
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 14,
          },
          top: '3%',
          right: '5%',
        },
        grid: {
          left: '5%',
          top: '27%',
          right: '5%',
          bottom: '2%',
          containLabel: true,
        },

        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: arr,

          axisLabel: {
            textStyle: {
              color: '#fff',
              fontSize: 12,
            },
          },
        },

        yAxis: [
          {
            type: 'value',
            name: '数量 起',
            // min: 0,
            // max: 250,

            splitLine: {
              //格线样式
              show: false,
              lineStyle: {
                color: 'rgba(33, 78, 224, 0.6)',
              },
            },
            minInterval: 1,
            axisLabel: {
              textStyle: {
                color: '#fff',
              },
            },
            axisLine: {
              // 坐标轴线
              show: true, // 默认显示，属性show控制显示与否
              itemStyle: {
                color: '#fff',
              },
              lineStyle: {
                // 属性lineStyle控制线条样式

                width: 1,
                type: 'solid',
              },
            },
          },
          {
            show: true,
            type: 'value',
            name: '金额',
            // min: 0.0,
            // max: 1200.0,

            axisLabel: {
              formatter: '{value} 元',
            },
            splitLine: {
              //格线样式
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
              },
            },
            axisLine: {
              // 坐标轴线
              show: true, // 默认显示，属性show控制显示与否
              itemStyle: {
                color: '#fff',
              },
              lineStyle: {
                // 属性lineStyle控制线条样式

                width: 1,
                type: 'solid',
              },
            },
          },
        ],
        series: [
          {
            name: '报案数',
            type: 'bar',
            data: numArr1,
          },
          {
            name: '结案数',
            type: 'bar',
            data: numArr2,
          },
          {
            name: '理赔金额',
            type: 'line',
            // stack: '总量',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#ebb54f',
                lineStyle: {
                  color: '#ebb54f',
                },
              },
            },
            // areaStyle: {
            //   normal: {
            //     show: false,
            //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       { offset: 0, color: '#ebb54f' },
            //       { offset: 0.5, color: '#ebb54f' },
            //       { offset: 1, color: '#ebb54f' },
            //     ]),
            //   },
            // },
            smooth: true,
            data: numArr,
          },
        ],
      })
    },
  },
}
</script>

<style>
#caseTendency {
  width: 100%;
  height: 100%;
  background-image: url(../../../../assets/echarts_png/jx.png);
  background-repeat: no-repeat;
  background-size: 100% 34px;
  background-position: -10px 5px;
}
</style>
