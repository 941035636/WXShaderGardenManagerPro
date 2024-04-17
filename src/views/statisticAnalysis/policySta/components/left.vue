<template>
  <div id="leftPolicy"></div>
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
    }
  },
  mounted() {
    // this.init()
    console.log(parseInt(null))
  },
  methods: {
    init(data) {
      console.log(data, 'data')
      data = data.filter((item) => {
        return item.areaCode.slice(0, 2) == sysConfig.provice
      })
      data.map((item) => {
        if (item.insuredRate == null) {
          item.insuredRate = '0'
        }
      })
      data.map((item) => {
        item.insuredRate = parseFloat(item.insuredRate)
      })
      console.log(data, '++++s')
      //排序方法
      let compare = function (item1, item2) {
        //item1 ，item2  默认参数  代表arr中的每一个值
        let val2 = item1.areaName //利用item.name进行排序
        let val1 = item2.areaName
        return val1 && val1.localeCompare(val2, 'zh-CN')
      }

      let arr = data.sort(compare)

      arr = data.sort((item1, item2) => {
        return item1.insuredRate - item2.insuredRate
      })
      let areaData = data.map((item) => {
        return item.areaName
      })
      let xData = arr.map((item) => {
        return item.insuredRate || '0'
      })
      this.myChart = echarts.init(document.getElementById('leftPolicy'))
      this.myChart.setOption({
        color: ['#FF4747'],
        title: {
          text: '各地参保率排名',
          show: true,
          top: '1.5%',
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
          formatter: function (val) {
            return (
              val[0].name +
              '<br />' +
              val[0].marker +
              val[0].seriesName +
              '：' +
              val[0].value +
              '%'
            )
          },
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['参保率'],
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 14,
          },
          right: ' 4%',
          top: '1.5%',
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
          top: '10% ',
          bottom: '7%',
          left: '15%',
          right: '5%',
        },
        // calculable: true,
        xAxis: [
          {
            type: 'value',

            splitLine: {
              //格线样式
              show: false,
              lineStyle: {
                color: '#00c7ff',
              },
            },

            axisLabel: {
              textStyle: {
                color: '#fff',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'category',
            data: areaData,
            axisLabel: {
              formatter: function (value) {
                return value.slice(0, 3)
              },

              textStyle: {
                color: '#fff',
                fontSize: 14,
              },
            },
          },
        ],
        series: [
          {
            name: '参保率',
            type: 'bar',
            barGap: 0,
            data: xData,
            itemStyle: {
              normal: {
                color: 'rgba(87, 150, 255, 0.8)',
                borderWidth: 1,
                borderColor: 'rgba(87, 150, 255, 1)',
              },
            },
            // barWidth: 30, //柱图宽度
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

<style>
#leftPolicy {
  background-image: url(../../../../assets/echarts_png/border.png);

  background-repeat: no-repeat;
  background-size: 100% 97.8%;
  width: 100%;
  height: 100%;
}
</style>
