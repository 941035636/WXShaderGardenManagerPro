<template>
  <div
    id="Satisfaction"
    ref="satisfaction"
    style="width: 100%; height: 100%"
  ></div>
</template>

<script>
import * as echarts from 'echarts/core'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import resize from '@/mixins/resize.js'
import { timingSafeEqual } from 'crypto'
echarts.use([
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  TooltipComponent,
  LegendComponent,
])
export default {
  name: 'Satisfaction',
  mixins: [resize],
  props: {
    dataList: {
      type: Array,
      default: function () {
        return [10, 20, 30, 40, 50, 300, 70, 80, 90, 100]
      },
    },
    seriesName: {
      type: String,
      default: '投保满意度',
    },
    color: {
      type: Array,
      default: function () {
        return ['#FFC350']
      },
    },
    colorArr: {
      type: Array,
      default: function () {
        return [
          { offset: 0, color: 'rgba(255, 195, 80, 1)' },
          { offset: 0.5, color: 'rgba(255, 195, 80, .6)' },
          { offset: 1, color: 'rgba(255, 195, 80, .2)' },
        ]
      },
    },
    xAxisTitles: {
      type: Array,
      default: function () {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      },
    },
  },
  data() {
    return {
      myChart: null,
    }
  },

  mounted() {},
  methods: {
    satisfaction(e) {
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
        grid: {
          left: '5%',
          top: '2%',
          right: '5%',
          bottom: '2%',
          containLabel: true,
        },
        legend: {
          right: '4%',
          top: '7%',
          textStyle: {
            color: '#fff',
          },
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
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisLabel: {
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
              color: e.color,
              width: 1,
              type: 'solid',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '28%',
          containLabel: true,
        },
        series: [
          {
            name: e.name,
            data: e.dataList,
            type: 'line',

            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  e.colorArr
                ),
              },
            },
          },
        ],
      }
      this.myChart = echarts.init(this.$refs.satisfaction)
      this.myChart.setOption(option)
      this.myChart.resize()
    },
  },
}
</script>
<style scoped>
div {
  width: 100% !important;
  height: 100% !important;
}
</style>
