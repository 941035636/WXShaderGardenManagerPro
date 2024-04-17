<template>
  <div id="policyEcharts">
    <div class="header">
      <h1>{{ sysName }}</h1>
      <p class="timeNow">{{ nowTime }}</p>
      <div class="operateBox">
        <el-tooltip content="返回上一级" placement="bottom" effect="light">
          <img
            @click="backToLast"
            src="../../assets/echarts_png/back.png"
            alt=""
          />
        </el-tooltip>

        <VabFullScreenBar class="VabFullScreenBar" />
      </div>
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
        <div class="warp">
          <LeftTop ref="LeftTop" />
          <corner />
        </div>
        <div class="warp">
          <LeftCenter ref="LeftCenter" />
          <corner />
        </div>
        <div class="warp">
          <LeftBottom ref="LeftBottom" />
          <corner />
        </div>
      </div>
      <div class="center-warp">
        <CenterMap
          ref="CenterMap"
          @refreshMap="refreshMap"
          :cityData="cityData"
        />
        <!-- <Map /> -->
      </div>
      <div class="right-warp">
        <div class="warp">
          <RightTop ref="RightTop" />
          <corner />
        </div>
        <div class="warp">
          <RightCenter ref="RightCenter" />
          <corner />
        </div>
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
  getAccidentcoverage,
  getInsureByArea,
  getStatisticsIndex,
  getPolicyAnalyse,
  getReportAccident,
} from '@/api/staistics'
import { dictItem } from '@/api/policyManagement'
import LeftTop from './components/leftTop.vue'
import LeftCenter from './components/leftCenter.vue'
import LeftBottom from './components/leftBottom.vue'
import RightTop from './components/rightTop.vue'
import RightCenter from './components/rightCenter.vue'
import RightBottom from './components/rightBottom.vue'
import CenterMap from './components/centerMap.vue'
import corner from './statisticAnaly/components/corner.vue'
import { getNextArea } from '@/api/Areas'
import * as echarts from 'echarts/lib/echarts'
import VabFullScreenBar from '@/layouts/components/VabFullScreenBar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import { GridComponent } from 'echarts/components'
echarts.use([GridComponent])
import { BarChart } from 'echarts/charts'
import resize from '../../mixins/resize'
echarts.use([BarChart])
export default {
  name: 'StatisticAnalysis',
  components: {
    LeftTop,
    LeftCenter,
    LeftBottom,
    RightTop,
    RightCenter,
    RightBottom,
    CenterMap,
    corner,
    VabFullScreenBar,
  },
  mixins: [resize],
  data() {
    return {
      industryCode: '', // 行业类型
      myDetail: null,
      nowTime: '',
      cityData:{},
      typeData: [],
      showDeatil: false,
      options: ['2022'],
      requstData: {},
      cityData: {},
      requestCode: '',
      pickerOptions: {
        disabledDate(time) {
          return (
            new Date(time).getFullYear() < sysConfig.startYear ||
            new Date(time).getFullYear() > sysConfig.endYear
          )
        },
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
    this.requestCode = sysConfig.province_code
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
        let requestCode = yingjijuVO.cityCode.substring(0, 6)

        this.refreshMap(requestCode, '')
        this.$nextTick(() => {
          this.$refs.CenterMap.paramsAreaCode = requestCode
        })
      } else {
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
      let data = {}
      if (code) {
        data = {
          startDate: this.year + '-01-01 00:00:00',
          endDate: this.year + '-12-31 23:59:59',
          cityCode: code + '000000',
          level: 2,
          industryCodes: val,
        }
      } else {
        data = {
          startDate: this.year + '-01-01 00:00:00',
          endDate: this.year + '-12-31 23:59:59',
          industryCodes: val,
        }
        code = sysConfig.province_code
      }
      this.requstData = data
      this.requestCode = code
      this.init(data, code)
    },
    backToLast() {
      this.$router.back()
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
        this.$refs.LeftCenter.init(arr)
        this.$refs.LeftBottom.init(arr)
      }
      let resrb = await getReportAccident(data)
      if ((resrb.code = '0000')) {
        let arr = await this.getArr(areaData, resrb.list)
        this.$refs.RightBottom.init(arr)
      }
      let resrt = await getPolicyAnalyse(data)

      if ((resrt.code = '0000')) {
        let arr = await this.getArr(areaData, resrt.list)
        this.$refs.RightTop.init(arr)
        this.$refs.RightCenter.init(arr)
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
        this.$refs.LeftTop.init(arr)
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
    async setMap(data, code) {
      if (code == sysConfig.province_code) {
        this.$nextTick(() => {
          this.$refs['CenterMap'].getData(data)
        })
      }
      let resTotal = await getStatisticsIndex(data)
      if (resTotal.code === '0000') {
        this.cityData = resTotal.data
        if (code != sysConfig.province_code) {
          this.$refs['CenterMap'].cityData = resTotal.data
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
                this.$refs['CenterMap'].getGeoJson(sysConfig.province_code)
              })
            } else {
              this.$nextTick(() => {
                this.$refs['CenterMap'].getGeoJson(code)
              })
            }
          }
        }
      }
    },
    choseYear(val) {
      this.requstData.startDate = val + '-01-01 00:00:00'
      this.requstData.endDate = val + '-12-31 23:59:59'

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
#policyEcharts {
  height: 100vh;
  background-image: url(../../assets/echarts_png/bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: hidden;
  .header {
    height: 4.5rem;
    text-align: center;
    line-height: 2rem;
    overflow: hidden;
    .operateBox {
      z-index: 20;
      position: absolute;
      top: 5px;
      display: flex;
      align-items: center;
      color: #fff;
      right: 20px;
      .VabFullScreenBar {
        cursor: pointer;
        margin-right: 10px;
      }
      img {
        width: 20px;
        cursor: pointer;
        margin-right: 10px;
      }
      i {
        font-weight: bold;
        font-size: 16px;
        cursor: pointer;
      }
    }
    .timeNow {
      position: absolute;
      left: 40px;
      top: 10px;
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
      right: 2rem;
      top: 5%;
      .el-input__inner {
        background-color: #05227a;
        border: 1px solid #fff;
        color: #fff !important;
      }
    }
  }
  .containers {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: calc(100% - 4.5rem);
    .left-warp {
      width: 30%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .center-warp {
      width: 39%;
      height: 100%;
    }
    .right-warp {
      width: 29%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .warp {
      height: calc(97% / 3);
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
  background-image: url(../../assets/echarts_png/tcbg.png);
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
</style>
