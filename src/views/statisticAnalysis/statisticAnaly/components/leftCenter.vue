<template>
  <div id="leftTop"></div>
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
echarts.use([BarChart])

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
      data = data.filter((item) => {
        return item.areaCode.slice(0, 2) == sysConfig.provice
      })
      let areaData = data.map((item) => {
        return item.areaName
      })
      let corpData = data.map((item) => {
        return item.shouldInsureCorpNum || 0
      })
      let corpJoinData = data.map((item) => {
        return item.policyNum || 0
      })

      this.myChart = echarts.init(document.getElementById('leftTop'))
      this.myChart.setOption({
        title: {
          text: '参保企业情况',
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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['应保企业数', '保单数'],
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 12,
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
          bottom: '13%',
          left: '10%',
          right: '3%',
        },

        // calculable: true,
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
                color: 'rgba(33, 78, 224, 0.4)',
              },
            },
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
            minInterval: 1,
            axisLabel: {
              textStyle: {
                color: '#fff',
              },
            },
          },
        ],
        series: [
          {
            name: '应保企业数',
            type: 'bar',
            barGap: 0,
            data: corpData,
            itemStyle: {
              normal: {
                color: '#d97559',
              },
            },

            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' },
              ],
            },
            barWidth: 10, //柱图宽度
            markLine: {
              data: [{ type: 'average', name: 'Avg' }],
            },
          },
          {
            name: '保单数',
            type: 'bar',
            barGap: 0,
            data: corpJoinData,
            itemStyle: {
              normal: {
                color: '#e4c477',
              },
            },
            barWidth: 10, //柱图宽度
            markPoint: {
              data: [
                { name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 },
                { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 },
              ],
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }],
            },
          },
        ],
      })
    },
  },
}
</script>

<style scoped>
#leftTop {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}
</style>
