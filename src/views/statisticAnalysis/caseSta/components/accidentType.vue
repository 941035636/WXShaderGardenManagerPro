<template>
  <div id="accidentType"></div>
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
import resize from '../../../../mixins/resize'
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
      let arr = []
      arr = data.map((item) => {
        return item.accidentTypeName
      })
      let numArr1 = data.map((item) => {
        return item.caseNum || 0
      })

      this.myChart = echarts.init(document.getElementById('accidentType'))
      var Chart = echarts.init(document.getElementById('accidentType'))
      this.myChart.setOption({
        color: ['#EDC95D'],
        title: {
          text: '事故类型情况',
          top: '3%',
          left: '2%',
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
          data: ['报案数', '结案数', '理赔金额'],
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 14,
          },
          top: '3%',
          right: '5%',
        },
        grid: {
          left: '5%',
          top: '20%',
          right: '5%',
          bottom: '4%',
          containLabel: true,
        },

        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: arr,

          axisLabel: {
            interval: 0,
            rotate: 20,
            formatter: function (value) {
              return value.slice(0, 4)
            },
            textStyle: {
              color: '#fff',
              fontSize: 12,
            },
          },
        },

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
            min: 0,
            minInterval: 1,
            // max: 250,
            // interval: 50,
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
            data: numArr1,
          },
        ],
      })
    },
  },
}
</script>

<style>
#accidentType {
  width: 100%;
  height: 100%;
  background-image: url(../../../../assets/echarts_png/jx.png);
  background-repeat: no-repeat;
  background-size: 100% 34px;
  background-position: -10px 5px;
}
</style>
