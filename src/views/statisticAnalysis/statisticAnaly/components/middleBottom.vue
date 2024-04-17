<template>
  <div id="middleLeft"></div>
</template>

<script>
import { getInsureByArea } from '@/api/staistics'
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import { GridComponent } from 'echarts/components'
echarts.use([GridComponent])
import { BarChart } from 'echarts/charts'
import resize from '@/mixins/resize'
// echarts.use([BarChart])

export default {
  mixins: [resize],
  data() {
    return {
      myChart: null,
      data: [],
    }
  },
  created() {},
  mounted() {},

  methods: {
    init(data) {
      let xData = data.map((item) => {
        return item.areaName
      })
      let yData1 = data.map((item) => {
        return item.caseNum
      })
      let yData2 = data.map((item) => {
        return item.caseCloseNum
      })
      let yData3 = data.map((item) => {
        return item.payMoney
      })
      this.myChart = echarts.init(document.getElementById('middleLeft'))
      this.myChart.setOption({
        title: {
          text: '案件趋势',
          show: true,
          top: '4.5%',
          left: '3%',
          textStyle: {
            //文字颜色
            color: '#58C0F7',
            //字体风格,'normal','italic','oblique'
            fontStyle: 'normal',
            //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
            fontWeight: 'bold',
            //字体系列
            fontFamily: 'sans-serif',
            //字体大小
            fontSize: 14,
          },
        },
        color: ['#009eca', '#f5c847'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['报案数', '结案数', '赔付金额'],
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 12,
          },
          // right: '1%',
          top: '10',
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
        grid: { left: 30, top: 70, bottom: 10, right: 30, containLabel: true },

        // calculable: true,
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisLine: {
              // 坐标轴线

              show: true, // 默认显示，属性show控制显示与否
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: '#fff',
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
            name: '数量（起）',
            splitLine: {
              //格线样式
              show: false,
            },
            axisLine: {
              // 坐标轴线

              show: true, // 默认显示，属性show控制显示与否
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: '#fff',
                width: 1,
                type: 'solid',
              },
            },
            minInterval: 1,
            axisLabel: {
              textStyle: {
                color: '#fff',
              },
            },
          },
          {
            show: true,
            type: 'value',
            name: '金额（万元）',
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
                color: '#fff',
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
            barGap: 0,
            data: yData1,

            itemStyle: {
              normal: {
                borderRadius: 20,
              },
            },
          },
          {
            name: '结案数',
            type: 'bar',
            barGap: 0,
            data: yData2,
            itemStyle: {
              normal: {
                borderRadius: 20,
              },
            },
          },
          {
            name: '赔付金额',
            type: 'line',
            // stack: '总量',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#F58A47',
                lineStyle: {
                  color: '#F58A47',
                },
              },
            },

            smooth: true,
            data: yData3,
          },
        ],
      })
    },
  },
}
</script>

<style scoped>
#middleLeft {
  width: 100%;
  height: 100%;
}
</style>
