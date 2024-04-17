<template>
  <div id="rightBottom1"></div>
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
import { PieChart } from 'echarts/charts'
echarts.use([PieChart])
import resize from '../../../../mixins/resize'
export default {
  mixins: [resize],
  data() {
    return {
      myChart: null,
    }
  },
  mounted() {},
  methods: {
    init(data) {
      // data = data.filter((item) => {
      //   return item.areaCode.slice(0, 2) == '52'
      // })
      let arr = []

      data.map((item) => {
        arr.push({
          value: item.prem,
          name: item.areaName,
          rate: item.premRate,
        })
      })
      console.log(arr, '090099')
      let result = data.map((item) => {
        return {
          name: item.areaName,
        }
      })
      let areaData = []
      for (let i = 0; i < result.length; i += 3) {
        areaData.push(result.slice(i, i + 3))
      }

      this.myChart = echarts.init(document.getElementById('rightBottom1'))

      this.myChart.setOption({
        tooltip: {
          trigger: 'item',

          formatter: function (val) {
            return (
              val.name +
              '<br />' +
              val.marker +
              '保费' +
              '：' +
              val.value +
              '万元' +
              '<br />' +
              val.marker +
              '占比' +
              '：' +
              val.data.rate
            )
          },
        },
        color: [
          '#6AD07B',
          '#823E07',
          '#C47240',
          '#0E6DE9',
          '#D7473A',
          '#A93730',
          '#EDC95D',
          '#856306',
          '#98A736',
          '#019D7A',
          '#5D229F',
          '#fff',
        ],
        title: {
          text: '各地市保费占比',
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
        legend: {
          right: '8%',
          top: 'center',
          align: 'left',
          // left: 'right',
          width: 400,
          height: 40,
          orient: 'horizontal',

          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 16,
          },
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['15%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,

              // normal: {
              //   lineStyle: {
              //     color: '#FF4747',
              //   },
              // },
            },
            label: {
              show: false,
              // position: 'center',
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '20',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: true,
            },
            data: arr,
          },
        ],
      })
    },
  },
}
</script>

<style scpoed>
#rightBottom1 {
  width: 100%;
  height: 100%;
}
</style>
