<template>
  <div id="left">
    <div id="leftPies"></div>
    <div class="leftTable">
      <el-table
        :data="tableData"
        header-row-class-name="headName"
        cell-class-name="cellName"
        :header-cell-style="tableHeaderColor"
        :cell-style="{ color: '#fff' }"
        style="width: 100%"
      >
        <el-table-column
          prop="areaName"
          label="地区"
          width="180"
        ></el-table-column>
        <el-table-column prop="caseNum" label="案件数量" width="180">
          <template slot-scope="scope">
            {{ scope.row.caseNum ? scope.row.caseNum : '0' }}
          </template>
        </el-table-column>
        <el-table-column prop="payMoney" label="赔付金额">
          <template slot-scope="scope">
            {{ scope.row.payMoney ? scope.row.payMoney : '0' }}
          </template>
        </el-table-column>
        <el-table-column prop="caseNumRate" label="案件数占比">
          <template slot-scope="scope">
            {{ scope.row.caseNumRate ? scope.row.caseNumRate : '0%' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
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
      tableData: [],
    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return { color: '#fff' }
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'color: #fff;font-weight: 500;'
      }
    },
    init(data) {
      // this.tableData = data.filter((item) => {
      //   return item.areaCode.slice(0, 2) == '52'
      // })
      this.tableData = data

      let arr = this.tableData.map((item) => {
        return {
          name: item.areaName,
          value: item.caseNum || 0,
          rate: item.caseNumRate || '0%',
        }
      })
      this.myChart = echarts.init(document.getElementById('leftPies'))

      this.myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: function (val) {
            return (
              val.name +
              '：' +
              val.value +
              '起' +
              '<br />' +
              val.marker +
              '占比：' +
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
        ],
        title: {
          text: '地区案件情况',
          top: '3.5%',
          left: '5%',
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
        legend: {
          right: '5%',
          top: 'center',
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
            name: '案件数量',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['18%', '60%'],
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
    },
  },
}
</script>

<style lang="scss" scoped>
#left {
  background-image: url(../../../../assets/echarts_png/jx.png);
  background-repeat: no-repeat;
  background-size: 100% 34px;
  background-position: 0 6px;
  .leftTable {
    padding: 20px 30px;
    box-sizing: border-box;
  }
}
#leftPies {
  padding-bottom: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 40vh;
}
</style>
<style>
html #left .el-table .headName .cell {
  color: #fff;
}
html #left .el-table .headName {
  background-image: url(../../../../assets/echarts_png/jx.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
html #left .el-table .cellName .cell {
  color: #fff;
}
#left .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
/* 表格内背景颜色 */
#left .el-table th,
.el-table tr,
.el-table td {
  background-color: transparent;
}
.leftTable .el-table__row > td {
  border: none;
}
.leftTable .has-gutter th {
  border: none !important;
}
.leftTable .el-table::before {
  height: 0px;
}
.leftTable .el-table tbody tr:hover > td {
  background-color: #ccc !important;
}
</style>
