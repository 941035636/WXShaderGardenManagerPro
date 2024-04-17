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
      underwritingStatisticsOptions: {
        name: '累计保费',
        color: ['#EDC95D'],
        dataList: [],
        xAxisTitles: [],
      },
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
            // formatter: function (value) {
            //   let ret = '' //拼接加\n返回的类目项
            //   let maxLength = 7 //每项显示文字个数
            //   let valLength = value.length //X轴类目项的文字个数
            //   let rowN = Math.ceil(valLength / maxLength) //类目项需要换行的行数
            //   if (rowN > 1) {
            //     //如果类目项的文字大于5,
            //     for (var i = 0; i < rowN; i++) {
            //       var temp = '' //每次截取的字符串
            //       var start = i * maxLength //开始截取的位置
            //       var end = start + maxLength //结束截取的位置
            //       //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
            //       temp = value.substring(start, end) + '\n'
            //       ret += temp //凭借最终的字符串
            //     }
            //     return ret
            //   } else {
            //     return value
            //   }
            // },
            textStyle: {
              color: '#fff',
              fontSize: 13,
            },
          },
          axisLine: {
            show: true,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}',
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
        series: [
          {
            name: e.name,
            data: e.dataList,
            type: 'bar',
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
