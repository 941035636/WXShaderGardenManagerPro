<template>
  <div id="policyEcharts2">
    <div class="header">
      <h1>{{ sysName }}</h1>
      <p class="timeNow">{{ nowTime }}</p>
      <el-date-picker
        type="year"
        class="choseYear"
        v-model="year"
        size="mini"
        @change="choseYear"
        value-format="yyyy"
        :clearable="false"
        :picker-options="pickerOptions"
      ></el-date-picker>
    </div>
    <div class="containers">
      <div class="left-warp">
        <div class="warpLT">
          <div class="stitle">承保概览</div>
          <el-row class="four-wrap">
            <div class="border-four">
              <p>{{ cityData.shouldInsureCorpNum | ThousandSeparator }}</p>
              <p>应保企业总数</p>
            </div>

            <div class="border-four">
              <p>
                {{
                  cityData.encourageInsureCorpJoinNum
                    ? cityData.encourageInsureCorpJoinNum
                    : 0 | ThousandSeparator
                }}
              </p>
              <p>鼓励企业投保数</p>
            </div>

            <div class="border-four">
              <p>
                {{ cityData.shouldInsureCorpJoinNum | ThousandSeparator }}
              </p>
              <p>保单数</p>
            </div>

            <div class="border-four">
              <p>{{ cityData.accidentServicesNum | ThousandSeparator }}</p>
              <p>事故预防服务次数</p>
            </div>
          </el-row>
          <corner />
        </div>
        <div class="warp-two">
          <LeftCenter ref="LeftCenter" />
          <corner />
        </div>
        <div class="warp-two">
          <leftBottom2 ref="leftBottom2" />
          <corner />
        </div>
      </div>
      <div class="center-warp">
        <CenterMap
          class="topMap"
          :year="year"
          ref="Center-Map"
          @refreshMap="refreshMap"
        />
        <div class="middleBottom">
          <middle-bottom ref="middleBottom" />
          <corner />
        </div>
      </div>
      <div class="right-warp">
        <div class="warp-right"><RightTop ref="RightTop" /></div>

        <div class="warp">
          <RightBottom ref="RightBottom" @showDetail="getMsg" />
          <corner />
        </div>
      </div>
    </div>
    <div v-if="showDeatil" class="mask" @click="showDeatil = false"></div>
    <div v-if="showDeatil" class="detailEcharts">
      <p>
        <!-- <span @click="showDeatil = false">X</span> -->
        <span class="el-icon-close" @click="showDeatil = false"></span>
      </p>
      <div id="detailLine"></div>
    </div>
  </div>
</template>

<script>
import {
  getCaseByArea,
  getStatisticsIndex,
  getInsureByArea,
  getPolicyAnalyse,
  getReportAccident,
  getCheckInfo,
} from '@/api/staistics'
import corner from './components/corner.vue'
import { dictItem } from '@/api/policyManagement'
import LeftTop from '../components/leftTop.vue'
import LeftCenter from './components/leftCenter.vue'

import RightTop from './components/rightTop.vue'
import leftBottom2 from './components/leftBottom.vue'
import RightBottom from './components/rightBottom.vue'
import CenterMap from './components/centerMap2.vue'

import { getNextArea } from '@/api/Areas'
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
import MiddleBottom from './components/middleBottom.vue'
echarts.use([BarChart])
export default {
  name: 'StatisticAnalysis',
  components: {
    LeftTop,
    LeftCenter,
    leftBottom2,
    RightTop,
    RightBottom,
    CenterMap,
    corner,
    MiddleBottom,
    // Map,
  },
  mixins: [resize],
  data() {
    return {
      cityData: {},
      industryCode: '', // 行业类型
      myDetail: null,
      requstData: null,
      requestCode: '',
      nowTime: '',
      typeData: [],
      showDeatil: false,
      options: ['2022'],
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() < Date.now() - 8.64e7
        // },
      },

      year: '2022',
    }
  },
  computed: {
    sysName() {
      if (sysConfig.project_name) {
        return sysConfig.project_name
      }
    },
  },
  created() {
    this.getServiceType()
    let data = {
      startDate: this.year + '-01-01 00:00:00',
      endDate: this.year + '-12-31 23:59:59',
    }
    this.requstData = data
    const roles = window.sessionStorage.getItem('roles')
    const yingjijuVO = JSON.parse(window.sessionStorage.getItem('yingjijuVO'))

    let rolesArr = []
    if (roles != undefined && roles != undefined) {
      if (roles.indexOf(',') != -1) {
        rolesArr = roles.split(',')
      } else {
        rolesArr = [roles]
      }

      if (
        rolesArr.includes('RL1453259052330127361') &&
        yingjijuVO &&
        yingjijuVO.cityCode
      ) {
        // this.requestCode = sysConfig.province_code

        this.requestCode = yingjijuVO.cityCode.substring(0, 6)
        // this.init(data, this.requestCode)
        this.refreshMap(this.requestCode, '')
        this.$nextTick(() => {
          this.$refs['Center-Map'].paramsAreaCode = this.requestCode
        })
      } else {
        this.requestCode = sysConfig.province_code
        this.init(data, sysConfig.province_code)
      }
    }
  },
  mounted() {
    this.nowTimes()
  },
  beforeDestroy() {
    this.clear()
  },
  methods: {
    getManaArr(arr, arr2) {
      let arrCopy = []
      arr.map((item) => {
        let it = arr2.find((i) => {
          return item.itemValue == i.accidentTypeCode
        })

        if (it) {
          arrCopy.push(it)
        } else {
          arrCopy.push({
            accidentTypeCode: item.itemValue,
            accidentTypeName: item.itemText,
          })
        }
      })

      return arrCopy
    },
    async getServiceType() {
      let res = await dictItem(true, 20004)
      if (res.code == '0000') {
        this.typeData = res.data
      }
    },
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear()
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? '0' + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1
      let date =
        new Date(timeStamp).getDate() < 10
          ? '0' + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate()
      let hh =
        new Date(timeStamp).getHours() < 10
          ? '0' + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours()
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? '0' + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes()
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? '0' + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds()
      let week = new Date(timeStamp).getDay()
      let weeks = ['日', '一', '二', '三', '四', '五', '六']
      this.week = '星期' + weeks[week]
      this.nowTime =
        year + '.' + month + '.' + date + '.' + ' ' + hh + ':' + mm + ':' + ss
    }, // 实时刷新当前时间，格式化
    nowTimes() {
      this.timeFormate(new Date())
      setInterval(this.nowTimes, 1000)
      this.clear()
    },
    clear() {
      clearInterval(this.nowTimes)
      this.nowTimes = null
    },
    refreshMap(code, val) {
      console.log(code, val, 'refreshMap')
      let data = {}
      if (code) {
        data = {
          startDate: this.year + '-01-01 00:00:00',
          endDate: this.year + '-12-31 23:59:59',
          cityCode: code + '000000',
          level: 2,
          industryCodes: val,
        }
        this.requestCode = code
      } else {
        data = {
          startDate: this.year + '-01-01 00:00:00',
          endDate: this.year + '-12-31 23:59:59',
          industryCodes: val,
        }
        code = sysConfig.province_code
        this.requestCode = sysConfig.province_code
      }
      this.requstData = data

      this.init(data, code)
    },
    async setMap(data, code) {
      if (code == sysConfig.province_code) {
        this.$nextTick(() => {
          this.$refs['Center-Map'].getData(data)
        })
      }
      let resTotal = await getStatisticsIndex(data)
      if (resTotal.code === '0000') {
        this.cityData = resTotal.data
        if (code != sysConfig.province_code) {
          this.$refs['Center-Map'].cityData = resTotal.data
          const roles = window.sessionStorage.getItem('roles')
          const yingjijuVO = JSON.parse(
            window.sessionStorage.getItem('yingjijuVO')
          )
          let rolesArr = []
          if (roles != undefined && roles != undefined) {
            if (roles.indexOf(',') != -1) {
              rolesArr = roles.split(',')
            } else {
              rolesArr = [roles]
            }

            if (
              rolesArr.includes('RL1453259052330127361') &&
              yingjijuVO &&
              yingjijuVO.cityCode
            ) {
              this.$nextTick(() => {
                this.$refs['Center-Map'].getGeoJson(sysConfig.province_code)
              })
            } else {
              this.$nextTick(() => {
                this.$refs['Center-Map'].getGeoJson(code)
              })
            }
          }
        }
      }
    },
    async init(data, code) {
      this.setMap(data, code)
      let areaData = []
      let res = await getNextArea(code + '000000', '0')
      if (res.code == '0000') {
        areaData = res.data
      }
      let reslc = await getCaseByArea(data)
      if ((reslc.code = '0000')) {
        let arr = await this.getArr(areaData, reslc.list)

        this.$refs.middleBottom.init(arr)
      }
      let resTwo = await getCheckInfo(data)
      if (resTwo.code === '0000') {
        let arr = await this.getArr(areaData, resTwo.data.checkDangerResps)
        this.$refs.RightTop.init(resTwo.data, arr)
      }
      let resrb = await getReportAccident(data)
      if ((resrb.code = '0000')) {
        let arr = await this.getArr(areaData, resrb.list)
        this.$refs.RightBottom.init(arr)
      }
      let resrt = await getPolicyAnalyse(data)

      if ((resrt.code = '0000')) {
        let arr = await this.getArr(areaData, resrt.list)

        this.$refs.leftBottom2.init(arr)
      }
      let obj = {}
      if (!data.cityCode) {
        obj = data
        obj.provinceCode = sysConfig.street_code
      } else {
        obj = data
      }
      let reslt = await getInsureByArea(obj)
      if ((reslt.code = '0000')) {
        let arr = await this.getArr(areaData, reslt.list)
        // this.$refs.LeftTop.init(arr)
        this.$refs.LeftCenter.init(arr)
      }
    },
    close() {
      this.showDeatil = false
    },
    getArr(arr, arr2) {
      let arrCopy = []

      arr.map((item) => {
        let it = arr2.find((i) => {
          return item.value == i.areaCode
        })

        if (it) {
          arrCopy.push(it)
        } else {
          arrCopy.push({
            areaCode: item.value,
            areaName: item.label,
          })
        }
      })

      return arrCopy
    },
    choseYear(val) {
      this.requstData.startDate = this.year + '-01-01 00:00:00'
      this.requstData.endDate = this.year + '-12-31 23:59:59'
      this.init(this.requstData, this.requestCode)
    },
    getMsg(val) {
      this.showDeatil = true
      setTimeout(() => {
        this.getDetail(val)
      }, 300)
    },
    getDetail(val) {
      val = this.getManaArr(this.typeData, val)
      let xAxisData = val.map((item) => {
        return item.accidentTypeName || ''
      })
      let brokerNum = val.map((item) => {
        return item.accidentNum || 0
      })

      this.myDetail = echarts.init(document.getElementById('detailLine'))
      this.myDetail.setOption({
        color: ['#FF4747', '#5796FF'],
        title: {
          text: '投保企业情况',
          show: false,
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
          data: ['服务企业数量', '无经纪公司参与'],
          textStyle: {
            //图例文字的样式
            color: '#fff',
            fontSize: 12,
          },
          right: ' 5%',
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
          bottom: '20%',
          left: '20%',
          right: '10%',
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
            minInterval: 1,
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
            data: xAxisData,
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 10,
              },
            },
          },
        ],
        series: [
          {
            name: '服务企业数量',
            type: 'bar',
            barGap: 0,
            data: brokerNum,
            itemStyle: {
              normal: {
                color: '#ff4747',
              },
            },

            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' },
              ],
            },
            barWidth: 18, //柱图宽度
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

<style lang="scss">
#policyEcharts2 {
  height: 100vh;
  padding: 0 10px 10px;
  box-sizing: border-box;
  margin-bottom: 20px;
  background-image: url('~@/assets/echartsImg/bg01.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .header {
    height: 4.5rem;
    background-image: url('~@/assets/echartsImg/a1.png');
    background-size: 100% 110%;
    background-repeat: no-repeat;
    text-align: center;
    line-height: 2rem;
    overflow: hidden;
    .timeNow {
      position: absolute;
      left: 40px;
      top: 30px;
      height: 40px;
      margin: 0;
      line-height: 20px;
      color: #fff;
    }
    h1 {
      font-size: 1.6rem;

      background-image: linear-gradient(
        to right,
        #fff,
        #c5f2fa,
        #c1d5fe,
        #e5deff
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    // color: #fff;

    font-weight: 700;
    .choseYear {
      width: 100px;
      position: absolute;
      right: 40px;
      top: 30px;
      .el-input__inner {
        background-color: rgba(0, 0, 0, 0.1);
        border: 1px solid #fff;
        color: #fff !important;
      }
    }
  }
  .containers {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    height: calc(100% - 4.5rem);
    .left-warp {
      width: 29%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .warpLT {
        height: 30%;
        position: relative;
        border: 1px solid #2e4481;
        .four-wrap {
          height: calc(100% - 32px);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          .border-four {
            width: 40%;
            height: 40%;
            border: 1px solid;
            display: flex;

            justify-content: center;
            flex-direction: column;
            align-items: center;
            background-image: url('~@/assets/echartsImg/a6.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;

            p:first-child {
              color: #20fdfa;
              font-size: 1.6rem;
              margin: 5px 0 5px;
            }
            p:last-child {
              color: #fff;
              font-weight: bold;
              margin: 5px 0 5px;
            }
          }
          .border-four:nth-child(2n + 1) {
            margin-right: 10px;
          }
        }
      }
      .warp-two {
        height: calc(35% - 10px);
        position: relative;
        border: 1px solid #2e4481;
      }
    }
    .center-warp {
      width: calc(42% - 10px);
      height: 100%;
      .topMap {
        height: 70%;
      }
      .middleBottom {
        height: 30%;
        border: 1px solid #2e4481;
        position: relative;
      }
    }
    .right-warp {
      width: 29%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .warp-right {
        height: calc(70% - 10px);
      }
    }
    .warp {
      height: 30%;
      position: relative;
      box-sizing: border-box;
      border: 1px solid #2e4481;
    }
  }
}
.mask {
  width: 100%;
  height: 100%;
  background-color: #000;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.6;
  z-index: 99;
}
.detailEcharts {
  position: fixed;
  width: 60vw;
  padding-bottom: 20px;
  box-sizing: border-box;
  top: calc(50% - 20vh);
  left: calc(50% - 30vw);
  height: 60vh;
  z-index: 999;
  background-image: url(../../../assets/echarts_png/tcbg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  #detailLine {
    width: 100%;
    height: calc(100% - 20px);
  }
  p {
    height: 20px;
  }
  p span {
    float: right;
    color: #fff;
    font-weight: 700;
    margin-right: 15px;
    cursor: pointer;
  }
}
.stitle {
  color: #58c0f7;
  font-weight: 600;
  font-size: 14px;
  margin: 10px 0 0 20px;
}
</style>
