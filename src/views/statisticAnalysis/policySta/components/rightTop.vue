<template>
  <div id="rightTop1"></div>
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
import resize from '../../../../mixins/resize'
echarts.use([BarChart])

export default {
  mixins: [resize],
  data() {
    return {
      myChart: null,
      data: [],
    }
  },
  mounted() {},
  methods: {
    init(data) {
      let insturyData = data.map((item) => {
        return item.industryName
      })

      let shouldData = data.map((item) => {
        return item.shouldInsureCorpNum || 0
      })
      let joinData = data.map((item) => {
        return item.shouldInsureCorpJoinNum || 0
      })
      this.myChart = echarts.init(document.getElementById('rightTop1'))
      this.myChart.setOption({
        title: {
          text: '各行业应保企业保单数',
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
            fontSize: 18,
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
            fontSize: 14,
          },
          right: '4%',
          top: '4%',
        },

        grid: {
          top: '20% ',
          bottom: '15%',
          left: '8%',
          right: '3%',
        },
        // calculable: true,
        xAxis: [
          {
            type: 'category',

            data: insturyData,
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
                return value.slice(0, 4)
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
            name: '应保企业数',
            type: 'bar',
            barGap: 0,
            data: shouldData,
            itemStyle: {
              normal: {
                color: 'rgba(87, 150, 255, 0.6)',
                borderWidth: 1,
                borderColor: 'rgba(87, 150, 255, 1)',
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
            data: joinData,
            itemStyle: {
              normal: {
                color: 'rgba(255, 195, 80, 0.6)',
                borderWidth: 1,
                borderColor: 'rgba(255, 195, 80, 1)',
              },
            },
            barWidth: 10, //柱图宽度
            markPoint: {
              data: [
                { name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 },
                { name: 'Min', value: 2.3, xAxis: 10, yAxis: 3 },
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

<style>
#rightTop1 {
  width: 100%;
  height: 100%;
}
</style>
