<template>
  <div id="Right">
    <div id="rightPies"></div>
    <div class="rightTable">
      <el-table
        :data="tableData"
        header-row-class-name="headName"
        cell-class-name="cellName"
        :header-cell-style="tableHeaderColor"
        :cell-style="{ color: '#fff' }"
        style="width: 100%"
      >
        <el-table-column
          prop="industryName"
          label="行业"
          width="180"
        ></el-table-column>
        <el-table-column prop="caseNum" label="案件数量" width="180">
          <template slot-scope="scope">
            {{ scope.row.caseNum ? scope.row.caseNum : '0' }}
          </template>
        </el-table-column>
        <el-table-column prop="payMoney" label="赔付金额">
          <template slot-scope="scope">
            {{ scope.row.paymoney ? scope.row.payMoney : '0' }}
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
  mounted() {},
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 == 0) {
        return 'background:rgba(0,0,0,0.5);text-align:center;'
      } else {
        return 'background:rgba(0,0,0,0.5);text-align:center;'
      }
    },
    getRowClass1({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 == 0) {
        return 'background:rgba(0,0,0,0.5);text-align:center;'
      } else {
        return ''
      }
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'color: #fff;font-weight: 500;'
      }
    },
    init(data) {
      this.tableData = data
      let arr = data.map((item) => {
        return {
          name: item.industryName,
          value: item.caseNum,
        }
      })
      this.myChart = echarts.init(document.getElementById('rightPies'))
      this.myChart.setOption({
        title: {
          text: '行业案件情况',
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
        tooltip: {
          trigger: 'item',
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
              // position: 'center',
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
#Right {
  background-image: url(../../../../assets/echarts_png/jx.png);
  background-repeat: no-repeat;
  background-size: 100% 34px;
  background-position: 0 6px;

  .rightTable {
    padding: 20px 30px;
    box-sizing: border-box;
  }
}
#rightPies {
  padding-bottom: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 40vh;
}
</style>
<style>
html #Right .el-table .headName .cell {
  color: #fff;
}
html #Right .el-table .headName {
  background-image: url(../../../../assets/echarts_png/jx.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
html #Right .el-table .cellName .cell {
  color: #fff;
}
#Right .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
/* 表格内背景颜色 */
#Right .el-table th,
.el-table tr,
.el-table td {
  background-color: transparent;
}
.rightTable .el-table__row > td {
  border: none;
}
.rightTable .has-gutter th {
  border: none !important;
}
.rightTable .el-table::before {
  height: 0px;
}
.rightTable .el-table tbody tr:hover > td {
  background-color: #ccc !important;
}
</style>
