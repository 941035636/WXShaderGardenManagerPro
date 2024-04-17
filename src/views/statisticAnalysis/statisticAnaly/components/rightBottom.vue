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
  mounted() {
    // this.init()
  },
  methods: {
    init(data) {
      data = data.filter((item) => {
        return item.areaCode.slice(0, 2) == sysConfig.provice
      })

      let arr = data.map((item) => {
        return {
          name: item.areaName,
          value: item.accidentNum || 0,
          detail: item.analyseAccidentByTypes || 0,
        }
      })
      this.myChart = echarts.init(document.getElementById('rightBottom'))
      this.myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: function (val) {
            return (
              val.name +
              '：' +
              '<br />' +
              val.marker +
              '服务企业数量：' +
              val.value +
              '<br />' +
              val.marker +
              '占比：' +
              val.percent +
              '%'
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
        ],
        title: {
          text: '事故预防服务企业占比',
          top: '3.5%',
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
        legend: {
          right: 20,
          top: 'center',
          width: 200,

          orient: 'horizontal',
          formatter: function (val) {
            return val.slice(0, 3)
          },
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 12,
          },
        },
        series: [
          {
            name: '服务企业数量',
            type: 'pie',
            radius: ['40%', '60%'],
            center: ['30%', '60%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 6,
            },
            label: {
              show: false,
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

      let that = this
      this.myChart.off('click')
      this.myChart.on('click', function (params) {
        if (params.data.detail.length && params.data.detail) {
          that.$emit('showDetail', params.data.detail)
        } else {
          that.$message.warning('该地区暂无数据！')
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
