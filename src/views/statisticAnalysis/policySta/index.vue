<template>
  <div id="policySta">
    <div class="header">
      <h1 class="nameTitle">企业参保情况分析</h1>
      <p class="timeNow">{{ nowTime }}</p>
      <div class="select">
        <el-select
          v-model="areaCode"
          class="choseYear mr20 w180"
          placeholder="请选择"
          size="mini"
          @change="choseArea"
        >
          <el-option
            v-for="item in areaArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          type="year"
          class="choseYear w100"
          v-model="year"
          size="mini"
          @change="choseYear"
          value-format="yyyy"
          :clearable="false"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
    </div>
    <div class="threeCard">
      <div class="card">
        <p>企业情况</p>
        <ul class="twoBox">
          <li>
            <span>应保企业（家）</span>
            {{ topData.shouldInsureCorpNum | ThousandSeparator }}
          </li>
          <li>
            <span>保单数（份）</span>
            {{ topData.shouldInsureCorpJoinNum | ThousandSeparator }}
          </li>
        </ul>
      </div>
      <div class="card">
        <p>保障情况</p>
        <ul class="twoBox">
          <li>
            <span>保额（亿元）</span>
            <div :class="{ adaptaon: String(topData.amount).length > 8 }">
              {{ topData.amount | ThousandSeparator }}
            </div>
          </li>
          <li class="verticalLine"></li>
          <li>
            <span>保费（万元）</span>
            <div :class="{ adaptaon: String(topData.prem).length > 8 }">
              {{ topData.prem | ThousandSeparator }}
            </div>
          </li>
        </ul>
      </div>
      <div class="card">
        <p>案件情况</p>
        <ul class="twoBox">
          <li>
            <span>报案数（起）</span>
            {{ topData.caseNum | ThousandSeparator }}
          </li>
          <li>
            <span>赔付金额（万元）</span>
            {{ (topData.payMoney / 10000).toFixed(2) | ThousandSeparator }}
          </li>
        </ul>
      </div>
    </div>
    <div class="bodyBox">
      <div class="left"><Left ref="left" /></div>
      <div class="right">
        <div class="rightItem"><RightTop ref="rightTop" /></div>
        <div class="rightItem"><RightCenter ref="rightCenter" /></div>
        <div class="rightItem"><RightBottom ref="rightBottom" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNextArea } from '@/api/Areas'
import { getDictData } from '@/api/userManagement'
import Left from './components/left.vue'
import RightTop from './components/rightTop.vue'
import RightCenter from './components/rightCenter.vue'
import RightBottom from './components/rightBottom.vue'
import {
  getInsuredRate,
  getInsuredIndustry,
  getInsuranceTrendOfMonth,
  getInsuranceView,
  getPolicyAnalyse,
} from '@/api/staistics'
export default {
  components: {
    Left,
    RightTop,
    RightCenter,
    RightBottom,
  },
  data() {
    return {
      topData: {},
      areaArr: [],
      nowTime: '',
      industryData: [],
      areaCode: '',
      year: '2022',
      pickerOptions: {
        disabledDate(time) {
          return (
            new Date(time).getFullYear() < sysConfig.startYear ||
            new Date(time).getFullYear() > sysConfig.endYear
          )
        },
      },
    }
  },
  created() {
    this.getArea()
    this.getManaData()
  },
  mounted() {
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
        this.choseArea(yingjijuVO.cityCode)
      } else {
        let data = {
          startDate: this.year + '-01-01 00:00:00',
          endDate: this.year + '-12-31 23:59:59',
          // provinceCode: sysConfig.street_code,
        }
        this.init(data)
      }
    }
    this.nowTimes()
  },

  beforeDestroy() {
    this.clear()
  },
  methods: {
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
    async init(data, code) {
      let areaData = []
      if (!code) {
        code = sysConfig.street_code
      }
      let res = await getNextArea(code, '0')
      if (res.code === '0000') {
        areaData = res.data
      }
      let resTop = await getInsuranceView(data)
      let resRc = await getInsuranceTrendOfMonth(data)
      let resRt = await getInsuredIndustry(data)
      let resl = await getInsuredRate(data)
      let resRb = await getPolicyAnalyse(data)
      if (resTop.code === '0000') {
        this.topData = resTop.data
      }
      if (resl.code === '0000') {
        let arr = await this.getArr(areaData, resl.list)

        this.$refs.left.init(arr)
      }
      if (resRt.code === '0000') {
        let arr = await this.getManaArr(this.industryData, resRt.list)
        this.$refs.rightTop.init(arr)
      }
      if (resRc.code === '0000') {
        this.$refs.rightCenter.init(resRc.list)
      }
      if (resRb.code === '0000') {
        let arr = await this.getArr(areaData, resRb.list)
        this.$refs.rightBottom.init(arr)
      }
    },
    async getArea() {
      let res = await getNextArea(sysConfig.street_code, '1')
      if (res.code === '0000') {
        this.areaArr = res.data
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
            this.areaArr = res.data.filter((item) => {
              return item.value == yingjijuVO.cityCode
            })
            this.areaCode = yingjijuVO.cityCode
          }
        }
      }
    },
    async getManaData() {
      let res = await getDictData(true, '20003')
      if (res.code == '0000') {
        this.industryData = res.data
      }
    },
    getManaArr(arr, arr2) {
      let arrCopy = []
      arr.map((item) => {
        let it = arr2.find((i) => {
          return item.itemValue == i.industryCode
        })

        if (it) {
          arrCopy.push(it)
        } else {
          arrCopy.push({
            industryCode: item.itemValue,
            industryName: item.itemText,
          })
        }
      })

      return arrCopy
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
    choseArea(e) {
      let data = {
        startDate: this.year + '-01-01 00:00:00',
        endDate: this.year + '-12-31 23:59:59',
      }
      if (e) {
        data = {
          startDate: this.year + '-01-01 00:00:00',
          endDate: this.year + '-12-31 23:59:59',
          cityCode: e,
          level: 2,
        }
      }
      this.init(data, e)
    },
    choseYear() {
      this.$baseMessage('仅限选择本年度之前的年份', 'waring')
      this.year = '2022'
    },
  },
}
</script>

<style lang="scss">
.adaptaon {
  font-size: 1.6rem;
}
#policySta {
  width: 100%;
  padding: 0 20px 0 20px;
  box-sizing: border-box;
  height: 135vh;
  background-color: #fff;
  background: #051366;
  // background-image: url(../../../assets/echarts_png/bg.png);
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
  // overflow: hidden;
  .header {
    text-align: center;
    height: 80px;
    background-image: url(../../../assets/echarts_png/title.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .timeNow {
      position: absolute;
      right: 40px;
      font-weight: bold;
      top: 10px;
      height: 40px;
      margin: 0;
      line-height: 20px;
      color: #fff;
    }
    .nameTitle {
      padding-top: 0.85%;
      font-size: 2rem;
      letter-spacing: 8px;
      background-image: linear-gradient(
        to right,
        #fff,
        #c5f2fa,
        #c1d5fe,
        #e5deff
      );
      font-weight: 700;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 2rem;

      margin: 0;
    }
    .select {
      position: absolute;
      right: 20px;
      top: 70px;
      overflow: hidden;
      .choseYear {
        .el-input__inner {
          background-color: #05227a !important;
          border: 1px solid #fff;
          color: #fff;
        }
      }
    }
  }
  .threeCard {
    display: flex;
    margin-top: 32px;
    justify-content: space-between;
    .card {
      width: 32%;
      background-image: url(../../../assets/echarts_png/border.png);
      background-repeat: no-repeat;
      background-size: 100% 97.8%;
      // background-image: url(../../../assets/echarts_png/dk.png);
      // background-repeat: no-repeat;
      // background-size: 100% 100%;

      color: #fff;

      box-sizing: border-box;
      border-radius: 6px;
      font-weight: bold;
      p {
        background-image: url(../../../assets/echarts_png/jx.png);
        background-repeat: no-repeat;
        background-size: 100% 97.8%;
        line-height: 36px;
        font-size: 18px;
        padding-left: 20px;
        height: 36px;
        margin: 0;
      }
    }
    .twoBox {
      display: flex;
      justify-content: space-around;
      border-radius: 6px;

      padding: 15px 0px;
      box-sizing: border-box;
      li {
        box-sizing: border-box;
        list-style: none;
        color: #20fdfa;
        font-size: 2.4rem;
        font-weight: normal;
        line-height: 2rem;
        text-align: center;
        span {
          font-size: 1rem;
          display: block;
          margin-bottom: 10px;
          color: #fefefe;
        }
      }
      .verticalLine {
        width: 1px;
        background-color: #fff;
      }
    }
  }
  .bodyBox {
    margin-top: 20px;
    height: 71%;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    .left {
      background-image: url(../../../assets/echarts_png/jx.png);
      background-repeat: no-repeat;
      background-size: 100% 36px;
      background-position: 0 6px;
      width: 49%;
    }
    .right {
      width: 49%;
      padding-bottom: 20px;
      flex-direction: column;
      display: flex;
      overflow: hidden;
      justify-content: space-between;
      .rightItem {
        background-image: url(../../../assets/echarts_png/dk.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 32%;
      }
    }
  }
}
</style>
