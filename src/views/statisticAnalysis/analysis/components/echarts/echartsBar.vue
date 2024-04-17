<template>
  <div ref="bar" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import resize from '@/mixins/resize.js'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
])

export default {
  name: 'Bar',
  mixins: [resize],
  props: {},
  data() {
    return {
      myChart: null,
    }
  },
  mounted() {},
  methods: {
    barInit(data) {
      let xData = []
      let yData = []
      data.map((item) => {
        xData.push(item.accidentNum)
        yData.push(item.accidentTypeName)
      })
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          top: '2%',

          right: '5%',
          textStyle: {
            color: '#fff',
          },
        },
        grid: {
          top: '10%',
          left: '5%',
          right: '10%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          minInterval: 1,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
            },
          },
        },
        yAxis: {
          type: 'category',
          data: yData,
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: '#fff',
            },
          },
        },
        series: [
          {
            name: '服务次数',
            type: 'bar',
            data: xData,
            itemStyle: {
              normal: {
                color: '#5796FF',
              },
            },
          },
        ],
      }
      this.myChart = echarts.init(this.$refs.bar)
      this.myChart.setOption(option)
    },
  },
}
</script>
