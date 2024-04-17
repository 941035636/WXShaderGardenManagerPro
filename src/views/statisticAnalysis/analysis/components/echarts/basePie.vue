<template>
  <div ref="basePie" style="width: 100%; height: 100%"></div>
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
  name: 'BasePie',
  mixins: [resize],
  props: {
    color: {
      type: Array,
      default: function () {
        return ['#07d8ff', '#f26d46', '#766ef6', '#6bd4a0', '#f5ad45']
      },
    },
  },
  data() {
    return {
      myChart: null,
      fmsDevice: [],
    }
  },

  methods: {
    expertStatistics(data) {
      data.map((item) => {
        item.value = item.num || 0
      })
      let option = {
        tooltip: {
          trigger: 'item',
          textStyle: {
            align: 'left',
          },
        },
        textStyle: {
          rich: {
            orgname: {
              fontSize: 12,
              width: 100,
              padding: [0, 0, 0, 2],
            },
            count: {
              fontSize: 12,
              verticalAlign: 'top',
              align: 'center',
              color: '#fff',
              padding: [0, 0, 0, 0],
            },
          },
        },
        legend: {
          top: 'center',
          right: '10%',
          orient: 'vertical',

          itemWidth: 18,
          itemHeight: 12,
          textStyle: {
            color: '#fff',
          },
          formatter: (name) => {
            let target
            let arr = []
            const data = this.fmsDevice
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                target = `${data[i].num}`
              }
            }
            if (this.fmsDevice.length != 0) {
              arr = [`{orgname|${name}}`, `{count|${target}}`]
            } else {
              arr = [`${name}`]
            }
            return arr.join('')
          },
        },
        color: this.color,
        series: [
          {
            name: '专家职称统计',
            type: 'pie',
            radius: ['40%', '60%'],
            center: ['30%', 'center'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 3,
            },
            // barWidth: 100,
            label: {
              normal: {
                show: false,
                position: 'center',
                textStyle: {
                  fontSize: 25,
                  color: '#fff',
                },
                formatter: () => {
                  return '510'
                },
              },
            },
            labelLine: {
              show: false,
            },
            data: data,
          },
        ],
      }
      this.myChart = echarts.init(this.$refs.basePie)
      this.myChart.setOption(option)
    },
  },
}
</script>
