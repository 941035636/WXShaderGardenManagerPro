<template>
  <div id="rightCenter"></div>
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
import resize from '../../../mixins/resize'
export default {
  mixins: [resize],
  data() {
    return {
      myChart: null,
    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    init(data) {
      // data = data.filter((item) => {
      //   return item.areaCode.slice(0, 2) == '52'
      // })

      let areaData = data.map((item) => {
        return item.areaName
      })

      let withoutBrokerNum = data.map((item) => {
        return item.amount || 0
      })
      this.myChart = echarts.init(document.getElementById('rightCenter'))
      var Chart = echarts.init(document.getElementById('rightCenter'))
      this.myChart.setOption({
        color: ['rgba(226, 175, 78, 1)'],
        title: {
          text: '各地保额情况',
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
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (val) {
            var txt = val[0].name
            return (
              val[0].name +
              '<br />' +
              val[0].marker +
              val[0].seriesName +
              '：' +
              val[0].value +
              '亿元'
            )
          },

          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['保额'],
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 14,
          },
          top: '4.5%',
          right: '1%',
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
          data: areaData,
          // detail: detailData,
          axisLabel: {
            interval: 0,
            rotate: 20,
            formatter: function (value) {
              return value.slice(0, 3)
            },
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
              color: 'rgba(226, 175, 78, 0.8)',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#fff',
            },
          },
        },
        series: [
          {
            name: '保额',
            type: 'line',
            // stack: '总量',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: 'rgba(226, 175, 78, 1)',
                },
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(226, 175, 78, 1)' },
                  { offset: 0.5, color: 'rgba(226, 175, 78, 0.8)' },
                  { offset: 1, color: 'rgba(226, 175, 78, 0.4)' },
                ]),
              },
            },
            smooth: true,
            data: withoutBrokerNum,
          },
        ],
      })
    },
  },
}
</script>

<style scoped>
#rightCenter {

  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}
</style>
