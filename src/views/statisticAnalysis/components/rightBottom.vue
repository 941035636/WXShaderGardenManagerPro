<template>
  <div id="rightBottom"></div>
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
echarts.use([BarChart])
import resize from '../../../mixins/resize'
export default {
  mixins: [resize],
  data() {
    return {
      myChart: null,
    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    init(data) {
      data = data.filter((item) => {
        return item.areaCode.slice(0, 2) == sysConfig.provice
      })
      let areaData = data.map((item) => {
        return item.areaName
      })
      let brokerRate = data.map((item) => {
        return item.accidentNum || 0
      })
      let detailData = data.map((item) => {
        return item.analyseAccidentByTypes || 0
      })

      this.myChart = echarts.init(document.getElementById('rightBottom'))
      this.myChart.setOption({
        title: {
          text: '事故预防服务企业数量',
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
        color: ['rgba(126, 215, 106, 1)', '#7ed76a'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          // formatter: '{b0}<br />{a0}:{c0}%<br />{a1}:{c1}%',
        },
        legend: {
          data: ['服务企业数量'],
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 14,
          },
          top: '4.5%',
          right: '1%',
        },
        grid: {
          left: '5%',
          top: '20%',
          right: '5%',
          bottom: '3%',
          containLabel: true,
        },

        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: areaData,
          detail: detailData,
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
        yAxis: {
          type: 'value',

          splitLine: {
            //格线样式
            show: false,
            lineStyle: {
              color: 'rgba(33, 78, 224, 0.6)',
            },
          },
          minInterval: 1,
          axisLabel: {
            show: true,
            interval: 'auto',
            // formatter: '{value} %',
            textStyle: {
              color: '#fff',
            },
          },
        },
        series: [
          {
            name: '服务企业数量',
            type: 'line',
            // stack: '总量',
            smooth: true,
            itemStyle: {
              color: 'rgba(126, 215, 106, 1)',
              normal: {
                lineStyle: {
                  color: 'rgba(126, 215, 106, 1)',
                },
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(126, 215, 106, 0.9)' },
                  { offset: 0.5, color: 'rgba(126, 215, 106, 0.7)' },
                  { offset: 1, color: 'rgba(126, 215, 106, 0.4)' },
                ]),
              },
            },
            data: brokerRate,
          },
        ],
      })
      let that = this
      this.myChart.getZr().off('click')
      this.myChart.getZr().on('click', function (params) {
        console.log('0000000')
        var pointInPixel = [params.offsetX, params.offsetY]
        if (that.myChart.containPixel('grid', pointInPixel)) {
          /*此处添加具体执行代码*/

          var pointInGrid = that.myChart.convertFromPixel(
            { seriesIndex: 0 },
            pointInPixel
          )
          //X轴序号
          var xIndex = pointInGrid[0]

          //获取当前图表的option
          var op = that.myChart.getOption()
          let position = op.xAxis[0].data[xIndex]
          let detail = op.xAxis[0].detail[xIndex]

          if (detail.length) {
            that.$emit('showDetail', detail)
          } else {
            console.log('======')
            that.$message.warning('该地区暂无数据！')
          }
        }
      })
    },
  },
}
</script>

<style scoped>
#rightBottom {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}
</style>
