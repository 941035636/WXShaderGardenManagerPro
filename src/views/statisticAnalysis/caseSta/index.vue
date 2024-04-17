<template>
  <div id="caseSta">
    <div class="header">
      <p class="nameTitle">案件情况分析</p>
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
      <p class="cardTitle">案件情况</p>
      <ul>
        <li>
          <el-progress
            :width="100"
            type="circle"
            :stroke-width="10"
            style="font-size: 16px"
            color="#0e6de9"
            :percentage="
              parseInt(topData.closeCaseRate ? topData.closeCaseRate : 0)
            "
          ></el-progress>
          <p class="name">结案率</p>
        </li>
        <li class="twoBox">
          <p class="number">{{ topData.caseNum | ThousandSeparator }}</p>
          <p class="name">报案总数（起）</p>
        </li>
        <li class="twoBox">
          <p class="number">{{ topData.caseCloseNum | ThousandSeparator }}</p>
          <p class="name">已结案（起）</p>
        </li>
        <li class="twoBox">
          <p class="number">{{ topData.handlerNum | ThousandSeparator }}</p>
          <p class="name">处理中（起）</p>
        </li>
        <li class="verticalLine"></li>
        <li class="twoBox">
          <p class="number color-fr">
            {{ (topData.payMoney / 10000).toFixed(2) | ThousandSeparator }}
          </p>
          <p class="name">赔付总金额（万元）</p>
        </li>
        <li class="twoBox">
          <p v-if="topData.averagePayMoney" class="number color-fr">
            {{ topData.averagePayMoney.toFixed(2) | ThousandSeparator }}
          </p>
          <p class="name">案均赔付金额（元）</p>
        </li>
      </ul>
    </div>
    <div class="twoFloor"><CaseTendency ref="CaseTendency" /></div>
    <div class="twoFloor"><AccidentType ref="AccidentType" /></div>
    <div class="twoPies">
      <div class="pies">
        <LeftPies ref="LeftPies" />
      </div>
      <div class="pies"><RightPies ref="RightPies" /></div>
    </div>
  </div>
</template>

<script>
import { getNextArea } from '@/api/Areas'
import { getDictData } from '@/api/userManagement'
import CaseTendency from './components/caseTendency.vue'
import AccidentType from './components/accidentType.vue'
import LeftPies from './components/leftPies.vue'
import RightPies from './components/rightPies.vue'
import { fmoney } from '@/utils/index'
import { dictItem } from '@/api/policyManagement'
import {
  getCaseByArea,
  getCaseTrendOfMonth,
  getCaseTrendByAccidentType,
  getCaseWithRateByArea,
  getCaseWithRateByIndstry,
} from '@/api/staistics'
export default {
  name: 'CaseSta',
  components: { CaseTendency, AccidentType, LeftPies, RightPies },

  data() {
    return {
      topData: {},
      areaArr: [],
      industryData: [],
      acdType: [],

      areaCode: '',
      nowTime: '',
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
    this.getAcdType()
  },
  mounted() {
    let data = {
      startDate: this.year + '-01-01 00:00:00',
      endDate: this.year + '-12-31 23:59:59',
    }
    let data2 = {
      startDate: this.year + '-01-01 00:00:00',
      endDate: this.year + '-12-31 23:59:59',

      level: 3,
    }
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
        data = {
          startDate: this.year + '-01-01 00:00:00',
          endDate: this.year + '-12-31 23:59:59',
          cityCode: yingjijuVO.cityCode,
          level: 2,
        }
        data2 = {
          startDate: this.year + '-01-01 00:00:00',
          endDate: this.year + '-12-31 23:59:59',
          cityCode: yingjijuVO.cityCode,
          level: 3,
        }
        console.log('+++++++')
        this.init(data, data2, yingjijuVO.cityCode)
      } else {
        console.log('---------')
        this.init(data, data2)
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
    fmoney(i) {
      return fmoney(i)
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
    async getAcdType() {
      let res = await dictItem(true, '20001')

      if (res.code == '0000') {
        this.acdType = res.data
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
    getManaArr2(arr, arr2) {
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
    async init(data, data2, code) {
      let areaData = []
      if (!code) {
        code = sysConfig.street_code
      }
      let res = await getNextArea(code, '0')
      if (res.code === '0000') {
        areaData = res.data
      }
      let resTop = await getCaseByArea(data2)
      let res1 = await getCaseTrendOfMonth(data)
      let res2 = await getCaseTrendByAccidentType(data)
      let res3 = await getCaseWithRateByArea(data)
      let res4 = await getCaseWithRateByIndstry(data)

      if (resTop.code === '0000' && resTop.total) {
        this.topData = resTop.list[0]
      }
      if (res1.code === '0000') {
        this.$refs.CaseTendency.init(res1.list)
      }
      if (res2.code === '0000') {
        let arr = await this.getManaArr2(this.acdType, res2.list)
        this.$refs.AccidentType.init(arr)
      }
      if (res3.code === '0000') {
        let arr = await this.getArr(areaData, res3.list)
        this.$refs.LeftPies.init(arr)
      }
      if (res4.code === '0000') {
        let arr = await this.getManaArr(this.industryData, res4.list)
        this.$refs.RightPies.init(arr)
      }
    },
    choseArea(e) {
      let data = {
        startDate: this.year + '-01-01 00:00:00',
        endDate: this.year + '-12-31 23:59:59',
      }
      let data2 = {
        startDate: this.year + '-01-01 00:00:00',
        endDate: this.year + '-12-31 23:59:59',
        level: 3,
      }
      if (e) {
        data = {
          startDate: this.year + '-01-01 00:00:00',
          endDate: this.year + '-12-31 23:59:59',
          cityCode: e,
          level: 2,
        }
        data2 = {
          startDate: this.year + '-01-01 00:00:00',
          endDate: this.year + '-12-31 23:59:59',
          cityCode: e,
          level: 3,
        }
      }
      this.init(data, data2, e)
    },
    choseYear() {
      this.$baseMessage('仅限选择本年度之前的年份', 'waring')
      this.year = '2022'
    },
  },
}
</script>

<style lang="scss">
#caseSta {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  background-color: #071e6e;

  .header {
    height: 80px;
    background-image: url(../../../assets/echarts_png/title.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    text-align: center;
    .timeNow {
      position: absolute;
      right: 40px;
      top: 10px;
      height: 40px;
      margin: 0;
      font-weight: bold;
      line-height: 20px;
      color: #fff;
    }
    .nameTitle {
      color: #fff;
      background-image: linear-gradient(
        to right,
        #fff,
        #c5f2fa,
        #c1d5fe,
        #e5deff
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      padding-top: 0.85%;
      font-size: 2rem;
      letter-spacing: 8px;
      font-weight: 700;

      margin: 0;
    }
    .select {
      position: absolute;
      right: 20px;
      top: 70px;
      .el-input__inner {
        background-color: #05227a !important;
        border: 1px solid #fff;
        color: #fff;
      }
    }
  }
  .threeCard {
    margin-top: 40px;

    box-sizing: border-box;
    font-weight: bold;
    color: #fff;
    overflow: hidden;
    border-radius: 6px;
    padding-top: 0px;
    background-image: url(../../../assets/echarts_png/z389.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .cardTitle {
      background-image: url(../../../assets/echarts_png/jx.png);
      background-repeat: no-repeat;
      background-size: 100% 34px;
      padding-left: 40px;
      background-position: -10px 0;
      height: 34px;
      margin-left: 0;
      margin: 0;
      line-height: 34px;
    }
    p {
      margin: 0;
      font-size: 18px;
      margin-top: 0.6rem;
      margin-left: 2rem;
    }
    ul {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0;
      height: 18vh;
      .verticalLine {
        height: 35%;
        width: 1px;
        background-color: #fff;
      }
      li {
        display: flex;
        width: 15%;

        align-items: center;
        justify-content: center;

        flex-direction: column;

        .number {
          font-size: 1.6rem;
          margin: 0;
          font-weight: 500;
          text-align: center;
        }
        .color-fr {
          color: #ff6950 !important;
        }
        .name {
          margin: 0;
          font-size: 1rem;
          line-height: 2.2rem;
          text-align: center;
          text-indent: 5px;
          letter-spacing: 1px;
        }
      }
      .twoBox {
      }
    }
  }
  .twoFloor {
    height: 40vh;
    background-image: url(../../../assets/echarts_png/z379.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 6px;
    margin-top: 20px;
  }
  .twoPies {
    // height: 90vh;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .pies {
      background-image: url(../../../assets/echarts_png/border.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 49.5%;
    }
  }
}
</style>
<style>
#caseSta .el-progress__text {
  color: #fff;
  font-size: 16px !important;
}
</style>
