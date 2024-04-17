<template>
  <div id="leftBottom"></div>
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
import { PictorialBarChart } from 'echarts/charts'
echarts.use([PictorialBarChart])

export default {
  mixins: [resize],
  data() {
    return {
      myChart: null,
      data: [],
    }
  },

  methods: {
    async getData() {
      let res = await getCaseByArea()
      if (res.code === '0000') {
        this.init(res.list)
      }
    },
    getSolidOption(data) {
      let data1 = data.map((item) => {
        return item.payMoney || 0
      })
      let lineXAxisData = data.map((item) => {
        return item.areaName
      })

      var colors = [
        {
          type: 'linear',
          x: 0,
          x2: 1,
          y: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: '#0078FF',
            },
            {
              offset: 0.5,
              color: '#0078FF',
            },
            {
              offset: 0.5,
              color: '#4FA6FF',
            },
            {
              offset: 1,
              color: '#4FA6FF',
            },
          ],
        },
      ]
      var barWidth = 15
      var constData1 = []
      var showData1 = []
      data1.filter(function (item) {
        if (item) {
          constData1.push(1)
          showData1.push(item)
        } else {
          constData1.push(0)
          showData1.push({
            value: 1,
            itemStyle: {
              normal: {
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 2,
                color: 'rgba(0,0,0,0)',
              },
            },
          })
        }
      })

      return {
        title: {
          text: '案件赔付情况',
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
          axisPointer: {
            type: 'shadow',
          },
          formatter: function (params) {
            var str = params[0].axisValue + '：'
            params.filter(function (item) {
              if (item.componentSubType == 'bar') {
                str +=
                  '<br/>' + item.marker + item.seriesName + '：' + item.value
              }
            })
            return str
          },
        },

        legend: {
          data: [
            {
              color: '#fff',

              name: '案件赔付金额', // 图例文字内容

              icon: 'rect', // 图例图形的形状，有多个可选值：'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'，
            },
          ],

          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 14,
          },
          right: '1%',
          top: '4.5%',
        },
        grid: {
          left: '3%', //图表距边框的距离
          right: '3%',
          top: '20%',
          bottom: '1%',
          containLabel: true,
        },
        xAxis: {
          data: lineXAxisData,
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
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: '#fff',
            },
          },
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
        },
        series: [
          {
            z: 1,
            name: '案件赔付金额',
            type: 'bar',
            barWidth: barWidth,
            data: data1,
            itemStyle: {
              normal: {
                color: colors[0],
              },
            },
          },
          {
            z: 2,
            name: '案件赔付金额',
            type: 'pictorialBar',
            data: constData1,
            symbol: 'diamond',
            symbolOffset: ['0%', '50%'],
            symbolSize: [barWidth, 14],
            itemStyle: {
              normal: {
                color: colors[0],
              },
            },
            tooltip: {
              show: false,
            },
          },
          {
            z: 3,
            name: '案件赔付金额',
            type: 'pictorialBar',
            symbolPosition: 'end',
            data: showData1,
            symbol: 'diamond',
            symbolOffset: ['0%', '-50%'],
            symbolSize: [barWidth - 2, (10 * barWidth) / barWidth],
            itemStyle: {
              normal: {
                borderColor: '#0078FF',
                borderWidth: 2,
                color: '#0078FF',
              },
            },
            tooltip: {
              show: false,
            },
          },
        ],
      }
    },
    init(data) {
      this.myChart = echarts.init(document.getElementById('leftBottom'))
      let option = this.getSolidOption(data)
      this.myChart.setOption(option)
    },
  },
}
</script>

<style scoped>
#leftBottom {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}
</style>
