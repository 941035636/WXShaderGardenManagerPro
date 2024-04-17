<template>
  <div ref="pie" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import resize from '@/mixins/resize.js'

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
])
export default {
  name: 'Pie',
  mixins: [resize],
  props: {
    color: {
      type: Array,
      default: function () {
        return ['#0E6DE9', '#FFC350']
      },
    },
  },
  data() {
    return {
      myChart: null,
    }
  },
  watch: {
    color: {
      hanlder: function (newValue) {
        this.option.color = newValue
      },
    },
  },
  mounted() {},
  methods: {
    pieInit(data) {
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function (val) {
            console.log(val)
            return (
              val.seriesName +
              '<br />' +
              val.marker +
              val.name +
              '：' +
              val.value +
              '<br />' +
              val.marker +
              '占比' +
              '：' +
              val.percent +
              '%'
            )
          },
          textStyle: {
            align: 'left',
          },
        },
        legend: {
          bottom: 40,
          textStyle: {
            color: '#fff',
          },
        },
        color: this.color, // 图标颜色
        calculable: false,
        series: [
          {
            name: '事故预防企业覆盖率',
            type: 'pie',
            radius: ['40%', '55%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,

            itemStyle: {
              borderRadius: 3,
              borderColor: '#fff',
              borderWidth: 0,
            },
            label: {
              show: true,
              color: '#fff',
            },
            labelLine: {
              show: true,
            },
            data: [
              { value: data.unServiceCorpNum, name: '未服务' },
              { value: data.serviceCorpNum, name: '已服务' },
            ],
          },
        ],
      }
      this.myChart = echarts.init(this.$refs.pie)
      this.myChart.setOption(option)
    },
  },
}
</script>
