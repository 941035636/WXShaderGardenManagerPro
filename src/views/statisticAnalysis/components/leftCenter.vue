<template>
  <div id="leftCenter"></div>
</template>

<script>
import { getCaseByArea } from '@/api/staistics'
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import { GridComponent } from 'echarts/components'
echarts.use([GridComponent])
import { BarChart } from 'echarts/charts'
import resize from '../../../mixins/resize'
echarts.use([BarChart])

export default {
  mixins: [resize],
  data() {
    return {
      myChart: null,
      data: [],
    }
  },

  methods: {
    init(data) {
      let areaData = data.map((item) => {
        return item.areaName
      })
      let caseData = data.map((item) => {
        return item.caseNum || 0
      })
      let caseCloseData = data.map((item) => {
        return item.caseCloseNum || 0
      })
      this.myChart = echarts.init(document.getElementById('leftCenter'))
      this.myChart.setOption({
        title: {
          text: '事故案件情况',
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
            return (
              val[0].name +
              '<br />' +
              val[2].marker +
              '报案数' +
              '：' +
              val[2].value +
              '<br />' +
              val[3].marker +
              '结案数：' +
              val[3].value
            )
          },
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['报案数', '结案数'],
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 14,
          },
          right: '1%',
          top: '4.5%',
        },
        toolbox: {
          show: false,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        grid: {
          top: '20% ',
          bottom: '15%',
          left: '10%',
          right: '3%',
        },
        xAxis: [
          {
            type: 'category',

            data: areaData,
            axisLine: {
              // 坐标轴线
              show: true, // 默认显示，属性show控制显示与否
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'rgba(33, 78, 224, 0.4)',
                width: 1,
                type: 'solid',
              },
            },
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
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              //格线样式
              show: false,
              lineStyle: {
                color: 'rgba(33, 78, 224, 0.6)',
              },
            },
            minInterval: 1,
            axisLine: {
              // 坐标轴线
              show: true, // 默认显示，属性show控制显示与否
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'rgba(33, 78, 224, 0.4)',
                width: 1,
                type: 'solid',
              },
            },

            axisLabel: {
              textStyle: {
                color: '#fff',
              },
            },
          },
        ],
        series: [
          {
            name: '上部圆',
            type: 'pictorialBar',
            silent: true,
            symbolSize: [12, 6],
            symbolOffset: [-7, -3],
            symbolPosition: 'end',
            z: 12,

            color: 'rgba(255, 71, 71, 0.7)',
            data: caseData,
          },
          {
            name: '上部圆1',
            type: 'pictorialBar',
            silent: true,
            symbolSize: [12, 6],
            symbolOffset: [6, -3],
            symbolPosition: 'end',
            z: 12,

            color: 'rgba(87, 150, 255, 0.6)',
            data: caseCloseData,
          },

          {
            name: '报案数',
            type: 'bar',
            barWidth: '12',
            barGap: '10%', // Make series be overlap
            barCateGoryGap: '10%',
            itemStyle: {
              normal: {
                color: 'rgba(255, 71, 71, 0.6)',
              },
            },
            data: caseData,
          },
          {
            name: '结案数',
            type: 'bar',
            barWidth: '12',
            barGap: '10%', // Make series be overlap
            barCateGoryGap: '10%',
            itemStyle: {
              normal: {
                color: 'rgba(87, 150, 255, 0.6)',
                opacity: 0.8,
              },
            },

            data: caseCloseData,
          },
        ],
      })
    },
  },
}
</script>

<style scoped>
#leftCenter {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}
</style>
