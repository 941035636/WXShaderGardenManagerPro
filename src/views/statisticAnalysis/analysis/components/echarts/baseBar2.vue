<template>
  <div ref="underwritingSafety" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as echarts from 'echarts/core'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import resize from '@/mixins/resize.js'

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
])
export default {
  name: 'UnderwritingSafety',
  mixins: [resize],

  data() {
    return {
      myChart: null,
    }
  },

  mounted() {},
  methods: {
    underwritingSafety(e) {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          textStyle: {
            align: 'left',
          },
        },
        legend: {
          data: ['累计保费', '理赔满意度'],
          right: '4%',
          top: '7%',
          textStyle: {
            color: '#fff',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '28%',
          containLabel: true,
        },
        color: e.color,
        xAxis: {
          type: 'category',
          data: e.xAxisTitles,
          axisLabel: {
            formatter: function (value) {
              return value.slice(0, 4)
            },

            textStyle: {
              color: '#fff',
              fontSize: 13,
            },
          },
          axisLine: {
            show: true,
          },
        },
        yAxis: [
          {
            type: 'value',
            name: '累计保费（万元）',

            axisLabel: {
              // formatter: '{value}',
              textStyle: {
                color: '#fff',
              },
            },
            axisLine: {
              show: true,
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: ['rgba(33, 78, 224, .3)'],
                width: 1,
                type: 'solid',
              },
            },
          },
          {
            show: true,
            type: 'value',
            name: '理赔满意度',
            min: 0.0,
            max: 5,

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
            name: '累计保费',
            data: e.dataList,
            type: 'bar',
          },
          {
            name: '理赔满意度',
            data: e.dataList2,
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
          },
        ],
      }

      this.myChart = echarts.init(this.$refs.underwritingSafety)
      this.myChart.setOption(option)
      let that = this
      this.myChart.getZr().on('click', function (params) {
        let pointInPixel = [params.offsetX, params.offsetY]
        if (that.myChart.containPixel('grid', pointInPixel)) {
          let pointInGrid = that.myChart.convertFromPixel(
            { seriesIndex: 0 },
            pointInPixel
          )

          let xIndex = pointInGrid[0]
          let op = that.myChart.getOption()

          let detail = op.xAxis[0].data[xIndex]

          if (detail.length) {
            that.$emit('satisfactionClick', detail)
          } else {
            that.$message.warning('暂无数据！')
          }
        }
      })
    },
  },
}
</script>
