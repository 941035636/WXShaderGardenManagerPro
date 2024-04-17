<template>
  <div id="rightCenter1"></div>
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
  mounted() {
    console.log('1'.toLocaleUpperCase())
  },
  methods: {
    init(data) {
      let arr = [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
      ]

      let policyData = data.map((item) => {
        return item.policyNum
      })

      this.myChart = echarts.init(document.getElementById('rightCenter1'))
      var Chart = echarts.init(document.getElementById('rightCenter1'))
      this.myChart.setOption({
        color: ['#ff4747', '#ebb547'],
        title: {
          text: '参保趋势',
          top: '4.5%',
          left: '3%',
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
          data: ['保单数'],
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 14,
          },
          top: '2%',
          right: '2%',
        },
        grid: {
          left: '5%',
          top: '20%',
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
              fontSize: 10,
            },
          },
        },
        yAxis: {
          type: 'value',
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
        },
        series: [
          {
            name: '保单数',
            type: 'line',
            // stack: '总量',
            itemStyle: {
              normal: {
                color: 'rgba(1, 175, 255, 1)',
                lineStyle: {
                  color: 'rgba(1, 175, 255, 1)',
                },
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(1, 175, 255, 1)' },
                  { offset: 0.5, color: 'rgba(1, 175, 255, 0.7)' },
                  { offset: 1, color: 'rgba(1, 175, 255, 0.4)' },
                ]),
              },
            },
            smooth: true,
            data: policyData,
          },
        ],
      })
    },
  },
}
</script>

<style>
#rightCenter1 {
  width: 100%;
  height: 100%;
}
</style>
