<template>
  <div id="rightTop">
    <div class="top">
      <corner />
      <div class="stitle">政府督查</div>
      <div class="word">
        政府督查企业
        <span class="number">
          {{ data.supervisionNum | ThousandSeparator }}
        </span>
        家次
      </div>
    </div>
    <div class="bottom">
      <corner />
      <div class="stitle">企业自查/专家巡查</div>
      <div class="threeCheck">
        <div class="charts">
          <div class="firtChild">
            <TipsText
              v-if="data.checkNum"
              :text="data.checkNum.toString() | ThousandSeparator"
              :length="9"
            />
            <span v-else>0</span>
          </div>
          <div id="chart1"></div>
          <div id="chart2"></div>
        </div>

        <div class="chart_word">
          <span>检查项</span>
          <span>发现隐患</span>
          <span>已整改隐患</span>
        </div>
      </div>
      <div class="s_table">
        <el-table
          :data="tableData"
          header-row-class-name="headName"
          cell-class-name="cellName"
          border
          style="width: 95%"
        >
          <el-table-column prop="name" label="检查类型"></el-table-column>
          <el-table-column show-overflow-tooltip prop="Num" label="企业">
            <template slot-scope="scope">
              {{ scope.row.Num | ThousandSeparator }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dangerNum"
            label="发现隐患"
          >
            <template slot-scope="scope">
              {{ scope.row.dangerNum | ThousandSeparator }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="rectificationNum"
            label="已整改隐患"
          >
            <template slot-scope="scope">
              {{ scope.row.rectificationNum | ThousandSeparator }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div id="chartsData"></div>
    </div>
  </div>
</template>

<script>
import corner from './corner'
import TipsText from '@/components/TipsText'
import * as echarts from 'echarts/lib/echarts'
import { PolarComponent } from 'echarts/components'
echarts.use([PolarComponent])
import resize from '../../../../mixins/resize'
export default {
  components: { corner, TipsText },
  mixins: [resize],
  data() {
    return {
      data: {},
      myChart: null,
      myChart2: null,
      myChart3: null,
      tableData: [],
    }
  },
  mounted() {},
  methods: {
    init(data, arr) {
      this.setCharts(arr)
      this.data = data
      let list = []
      let temp = {}
      let temp1 = {}
      temp.name = '企业自查'

      temp.Num = data['selfNum']
      temp.dangerNum = data['selfDangerNum']
      temp.rectificationNum = data['selfRectificationNum']
      temp1.name = '专家巡查'
      temp1.Num = data['patrolNum']
      temp1.dangerNum = data['patrolDangerNum']
      temp1.rectificationNum = data['patrolRectificationNum']
      list.push(temp)
      list.push(temp1)

      this.tableData = list
      let option = {
        title: [
          {
            text: data.dangerNumScale + '%',
            x: 'center',
            y: 'center',
            textStyle: {
              fontSize: '10',
              color: 'rgba(22, 206, 185)',
              fontFamily: 'DINAlternate-Bold, DINAlternate',
              foontWeight: '600',
            },
          },
        ],

        polar: {
          radius: ['70%', '100%'],
          center: ['50%', '50%'],
        },
        angleAxis: {
          max: 100,
          show: false,
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: '',
            type: 'bar',
            startAngle: '100',
            roundCap: true,
            barWidth: 50,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(33,187,195, .1)',
            },
            data: [data.dangerNumScale],
            coordinateSystem: 'polar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0.3, 0.8, 1, [
                  {
                    offset: 0,
                    color: 'rgba(22, 206, 185,.5)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(22, 206, 185)',
                  },
                ]),
              },
            },
          },
        ],
      }
      let option1 = {
        title: {
          text: data.rectificationNumScale + '%',
          x: 'center',
          y: 'center',
          width: '20',
          textStyle: {
            fontSize: 10,
            color: 'rgba(102, 72, 255)',
            fontStyle: 'normal',
            fontFamily: 'DINAlternate-Bold, DINAlternate',
            foontWeight: '600',
          },
        },

        polar: {
          radius: ['70%', '100%'],
          center: ['50%', '50%'],
        },
        angleAxis: {
          max: 100,
          show: false,
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: '',
            type: 'bar',
            startAngle: '100',
            roundCap: true,
            barWidth: 50,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(33,187,195, .1)',
            },
            data: [data.rectificationNumScale],
            coordinateSystem: 'polar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0.3, 0.5, 0.8, 1, [
                  {
                    offset: 0,
                    color: 'rgba(102, 72, 255,.5)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(102, 72, 255)',
                  },
                ]),
              },
            },
          },
        ],
      }
      this.myChart = echarts.init(document.getElementById('chart1'))
      this.myChart.setOption(option)
      this.myChart2 = echarts.init(document.getElementById('chart2'))
      this.myChart2.setOption(option1)
    },
    setCharts(data) {
      let areaData = data.map((item) => {
        return item.areaName
      })
      let arr1 = data.map((item) => {
        return item.dangerNum || 0
      })
      let arr2 = data.map((item) => {
        return item.rectificationNum || 0
      })
      let arr3 = data.map((item) => {
        return item.noRectificationNum || 0
      })
      this.myChart3 = echarts.init(document.getElementById('chartsData'))

      this.myChart3.setOption({
        color: ['rgba(226, 175, 78, 1)', 'rgba(1, 175, 255, 1)'],
        title: {
          show: false,
          text: '隐患整改情况',
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
          data: ['隐患数', '已整改', '未整改'],
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 12,
          },
          top: '4.5%',
          right: '1%',
        },
        grid: {
          left: '5%',
          top: '20%',
          right: '5%',
          bottom: '2%',
          containLabel: true,
        },

        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: areaData,
          // detail: detailData,
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
          axisLabel: {
            textStyle: {
              color: '#fff',
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
          splitLine: {
            //格线样式
            show: false,
            lineStyle: {
              // color: 'rgba(226, 175, 78, 0.8)',
            },
          },
        },

        series: [
          {
            name: '隐患数',
            type: 'line',
            // stack: '总量',
            itemStyle: {
              normal: {
                lineStyle: {
                  // color: 'rgba(226, 175, 78, 1)',
                },
              },
            },
            // areaStyle: {
            //   normal: {
            //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       { offset: 0, color: 'rgba(226, 175, 78, 1)' },
            //       { offset: 0.5, color: 'rgba(226, 175, 78, 0.8)' },
            //       { offset: 1, color: 'rgba(226, 175, 78, 0.4)' },
            //     ]),
            //   },
            // },
            smooth: true,
            data: arr1,
          },
          {
            name: '已整改',
            type: 'line',
            // stack: '总量',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: 'rgba(1, 175, 255, 1)',
                },
              },
            },
            // areaStyle: {
            //   normal: {
            //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       { offset: 0, color: 'rgba(1, 175, 255, 1)' },
            //       { offset: 0.5, color: 'rgba(1, 175, 255, 0.8)' },
            //       { offset: 1, color: 'rgba(1, 175, 255, 0.3)' },
            //     ]),
            //   },
            // },
            smooth: true,
            data: arr2,
          },
          {
            name: '未整改',
            type: 'line',
            // stack: '总量',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#ee752f',
                },
              },
            },

            smooth: true,
            data: arr3,
          },
        ],
      })
    },
  },
}
</script>

<style lang='scss' scoped>
#rightTop {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .stitle {
    color: #58c0f7;
    font-weight: 600;
    font-size: 14px;
    margin: 10px 0 0 20px;
  }
  .top {
    height: 12%;
    border: 1px solid #2e4481;
    position: relative;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .word {
      height: calc(100% - 26px);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 15px;
      .number {
        letter-spacing: 2px;
        font-weight: 900;
        font-size: 30px;
        margin: 0 15px;
        color: #f5c847;
      }
    }
  }
  .bottom {
    border: 1px solid #2e4481;
    position: relative;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    height: calc(88% - 10px);
    .threeCheck {
      display: flex;
      flex-direction: column;
      height: calc(27% - 24px);
      .charts {
        display: flex;
        height: 70%;
        .firtChild {
          z-index: 10;
          flex: 1;
          display: flex;
          font-size: 20px;
          font-weight: 900;
          color: #f5c847;
          letter-spacing: 2px;
          justify-content: center;
          align-items: center;
        }
        #chart1 {
          overflow: hidden;
          flex: 1;
          letter-spacing: 0 !important;
        }
        #chart2 {
          flex: 1;
          overflow: hidden;
        }
      }
      .chart_word {
        height: 30%;
        display: flex;
        color: #fff;
        align-items: center;
        span {
          display: inline-block;
          flex: 1;
          text-align: center;
        }
      }
    }
    #chartsData {
      flex: 1;
    }
    .s_table .el-table {
      margin: 0 auto;
    }
  }
}
</style>
<style >
html .s_table .el-table .headName .cell {
  color: #fff;
  padding: 0 5px;
  font-size: 12px;
  text-align: center;
  background-color: rgba(47, 118, 155, 0.7);
}
html .s_table .el-table .headName th {
  padding: 0;
}
html .s_table .el-table .headName .gutter {
  background-color: #1e3470;
}
html .s_table .el-table .el-table__body {
  margin: 0 !important;
}
html .s_table .el-table .cellName .cell {
  text-align: center;
  padding: 0px 3px;
  color: #fff;
  background-color: #1e3470;
  font-size: 12px;
}
.s_table .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
/* 表格内背景颜色 */
.s_table .el-table th,
.el-table tr,
.el-table td {
  background-color: transparent;
}
.s_table .el-table__row > td {
  padding: 0;
}
.s_table .has-gutter th {
}
.s_table .el-table::before {
  height: 0px;
}
.s_table .el-table tbody tr:hover > td {
  background-color: black !important;
}
</style>