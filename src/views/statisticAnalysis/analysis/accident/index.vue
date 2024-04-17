<template>
  <div id="Accident">
    <div class="top-header">
      <h1 class="mn">事故预防统计分析</h1>
    </div>
    <div class="screening-conditions">
      <p-and-i-base-condition
        :is-region="true"
        ref="baseCondition"
        :region="regionList"
        @onRegion="onRegion"
        @onYear="onYear"
      ></p-and-i-base-condition>
    </div>
    <div class="wrap-content">
      <div class="left">
        <div class="level1">
          <div class="s-title">事故预防费用情况</div>
          <div class="item-content">
            <div class="border_corner border_corner_left_bottom"></div>
            <div class="border_corner border_corner_right_bottom"></div>
            <div class="main"></div>
            <div class="item-con">
              <span class="text">预估事故预防总费（万元）</span>
              <span class="num">
                {{ costList.preAccidentCost | ThousandSeparator }}
              </span>
            </div>
            <div class="item-con">
              <span class="text">已使用（万元）</span>
              <span class="num">
                {{ costList.useAccidentCost | ThousandSeparator }}
              </span>
            </div>
            <div class="item-con">
              <span class="text">剩余（万元）</span>
              <span class="num">
                {{ costList.unUseAccidentCost | ThousandSeparator }}
              </span>
            </div>
          </div>
        </div>
        <div class="level2">
          <div class="data-left">
            <div class="border_corner border_corner_left_bottom"></div>
            <div class="border_corner border_corner_right_bottom"></div>
            <div class="main"></div>
            <div class="s-title">年度事故预防服务情况</div>
            <div class="two-box">
              <div class="box-two">
                <div class="text-num">
                  <p class="text">服务次数</p>
                  <p class="num">{{ situation.serviceNum || 0 }}</p>
                </div>
                <div class="text-num">
                  <p class="text">服务企业数</p>
                  <p class="num">{{ situation.serviceEnterpriseNum || 0 }}</p>
                </div>
              </div>
              <div class="box-two">
                <div class="text-num">
                  <p class="text">隐患数</p>
                  <p class="num">{{ situation.dangerNum || 0 }}</p>
                </div>
                <div class="text-num">
                  <p class="text">参与人数</p>
                  <p class="num">{{ situation.participantsNum || 0 }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="data-right">
            <div class="s-title">年度事故预防企业覆盖率</div>
            <div class="item-content">
              <echarts-pie ref="accidentCoverage"></echarts-pie>
              <div class="border_corner border_corner_left_bottom"></div>
              <div class="border_corner border_corner_right_bottom"></div>
              <div class="main"></div>
            </div>
          </div>
        </div>
        <div class="level3">
          <div class="s-title">年度事故预防类型情况</div>
          <div class="item-content">
            <echarts-bar ref="accidentCost"></echarts-bar>
            <div class="border_corner border_corner_left_bottom"></div>
            <div class="border_corner border_corner_right_bottom"></div>
            <div class="main"></div>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="three-echart">
          <div class="s-title">服务专家统计</div>
          <div class="item-content expert">
            <i class="el-icon-user"></i>
            <span class="text">专家总数（位）</span>
            <span class="num">{{ expertNum }}</span>
            <div class="border_corner border_corner_left_bottom"></div>
            <div class="border_corner border_corner_right_bottom"></div>
            <div class="main"></div>
          </div>
        </div>
        <div class="three-echart">
          <div class="s-title">专家职称统计</div>
          <div class="item-content">
            <base-pie ref="expertWork"></base-pie>
            <div class="border_corner border_corner_left_bottom"></div>
            <div class="border_corner border_corner_right_bottom"></div>
            <div class="main"></div>
          </div>
        </div>
        <div class="three-echart">
          <div class="s-title">擅长行业领域</div>
          <div class="item-content">
            <base-pie2
              :color="jobContentOptions.color"
              ref="expertAdept"
            ></base-pie2>
            <div class="border_corner border_corner_left_bottom"></div>
            <div class="border_corner border_corner_right_bottom"></div>
            <div class="main"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pAndIBaseCondition from '../components/pAndIBaseCondition.vue'
import { mapGetters } from 'vuex'
import echartsPie from '../components/echarts/echartsPie.vue'
import echartsBar from '../components/echarts/echartsBar.vue'
import basePie from '../components/echarts/basePie.vue'
import basePie2 from '../components/echarts/basePie2.vue'
import { getNextArea } from '@/api/Areas'
import { dictItem } from '@/api/policyManagement'
import {
  getExpertNum,
  getAccidentCoverage,
  getAccidentCost,
  getAccidentSituation,
} from '@/api/staistics'
export default {
  name: 'Accident',
  components: {
    pAndIBaseCondition,
    echartsPie,
    echartsBar,
    basePie,
    basePie2,
  },
  data() {
    return {
      jobContentOptions: {
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
      },
      typeData: [],
      costList: {
        preAccidentCost: 0,
        unUseAccidentCost: 0,
        useAccidentCost: 0,
      },
      expertNum: 0,
      situation: {},
      year: '2022',
      regionList: [], // 地区列表
    }
  },
  computed: {
    ...mapGetters({
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.getServiceType()
  },
  mounted() {},
  methods: {
    async getServiceType() {
      let res = await dictItem(true, 20004)
      if (res.code == '0000') {
        this.typeData = res.data
      }
      this.init()
    },
    init() {
      let data = {
        startDate: this.year + '-01-01 00:00:00',
        endDate: this.year + '-12-31 23:59:59',
      }
      this.getData(data)
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
          this.onRegion(yingjijuVO.cityCode)
        } else {
          this.getData1(data)
        }
      }

      this.getRegion()
    },

    async getData(data) {
      let res = await getExpertNum()
      if (res.code == '0000') {
        this.expertNum = res.data.expertNum
        let arr = JSON.parse(
          JSON.stringify(this.getStrEnumAll.SafetyTechniciansPostEnum)
        )
        arr.map((item) => {
          item.num = 0
          item.name = item.label
        })
        arr.map((item) => {
          res.data.techniciansData.map((i) => {
            if (item.strCode == i.code) {
              item.num = i.num
            }
          })
        })
        this.$refs.expertAdept.expertStatistics(res.data.accidentTypeData)

        this.$refs.expertWork.expertStatistics(arr)
      }

      let res2 = await getAccidentCost(data)
      if (res2.code == '0000') {
        this.costList = res2.data
      }
    },
    async getData1(data) {
      let res1 = await getAccidentCoverage(data)
      if (res1.code == '0000') {
        this.$refs.accidentCoverage.pieInit(res1.data)
      }

      let res3 = await getAccidentSituation(data)
      if (res3.code == '0000') {
        this.situation = res3.data
        let arr = this.getManaArr(
          this.typeData,
          res3.data.analyseAccidentByTypes
        )

        this.$refs.accidentCost.barInit(arr)
      }
    },
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
    onRegion(value) {
      let data = {
        startDate: this.year + '-01-01 00:00:00',
        endDate: this.year + '-12-31 23:59:59',
        // provinceCode: sysConfig.street_code,
      }
      if (value) {
        data = {
          startDate: this.year + '-01-01 00:00:00',
          endDate: this.year + '-12-31 23:59:59',
          cityCode: value,
          level: 2,
        }
      }
      this.getData1(data)
    },
    onYear(value) {},
    async getRegion() {
      let { code, data } = await getNextArea(sysConfig.street_code, '1')
      if (code == '0000') {
        this.regionList = data
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
            this.regionList = data.filter((item) => {
              return item.value == yingjijuVO.cityCode
            })
            this.$refs.baseCondition.location = yingjijuVO.cityCode
          }
        }
      }
    },
  },
}
</script>

<style lang="scss" >
#Accident {
  width: 100%;

  background: url(../../../../assets/echarts_png/bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin-bottom: 20px;
  .top-header {
    height: 9.1%;
    text-align: center;
    color: #fff;
    h1 {
      padding-top: 0.85%;
      font-size: 2rem;
      letter-spacing: 8px;
    }
  }
  .screening-conditions {
    position: relative;
    padding-top: 4rem;
    top: 10px;
  }
  .wrap-content {
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;

    justify-content: space-between;
    .s-title {
      height: 32px;
      padding-left: 30px;
      font-size: 14px;
      line-height: 32px;
      color: #fff;
      background: url('../../../../assets/echarts_png/jx.png') no-repeat;
      background-position: -10px 0;
      background-size: cover;
    }
    .item-content {
      height: calc(100% - 32px);
      position: relative;
      border: 1px solid rgba(6, 7, 107, 1);
      border-top: none;
      box-sizing: border-box;

      .border_corner {
        z-index: 10;
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(0, 0, 0, 0);
        border: 1px solid #00a2ff;
      }

      .border_corner_left_bottom {
        bottom: 0px;
        left: 0px;
        border-right: none;
        border-top: none;
        border-bottom-left-radius: 1px;
      }
      .border_corner_right_bottom {
        bottom: 0px;
        right: 0px;
        border-left: none;
        border-top: none;
        border-bottom-right-radius: 1px;
      }
    }
    .item-content.expert {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      i {
        font-size: 4rem;
      }
      span,
      i {
        padding-bottom: 1rem;
      }
      .text {
        font-size: 1rem;
      }
      .num {
        color: #20fdfa;
        font-size: 2rem;
      }
    }
    .left {
      width: 70%;

      .level1 {
        height: 10rem;

        .item-content {
          height: calc(100% - 32px);
          display: flex;
          align-items: center;
          justify-content: space-around;
          color: #fff;
          .item-con {
            width: 33%;
          }
          div {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            .text {
              font-size: 1rem;
            }
            .num {
              font-size: 2.2rem;
              margin-top: 1rem;
              color: #20fdfa;
            }
          }
        }
      }
      .level2 {
        height: 20rem;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        .data-left {
          width: calc(50% - 7px);
          height: 100%;
          position: relative;
          box-sizing: border-box;
          .main {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            position: absolute;
            left: 0;
            top: 0;
            border: 1px solid rgba(6, 7, 107, 1);
            border-top: none;
            border-radius: 4px;
          }
          .border_corner {
            z-index: 10;
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(0, 0, 0, 0);
            border: 1px solid #00a2ff;
          }

          .border_corner_left_bottom {
            bottom: 0px;
            left: 0px;
            border-right: none;
            border-top: none;
            border-bottom-left-radius: 1px;
          }
          .border_corner_right_bottom {
            bottom: 0px;
            right: 0px;
            border-left: none;
            border-top: none;
            border-bottom-right-radius: 1px;
          }
          .two-box {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: calc(100% - 32px);
            box-sizing: border-box;
            padding: 20px 30px;
          }
          .box-two {
            display: flex;

            box-sizing: border-box;
            justify-content: center;
          }
          .text-num {
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            .text {
              font-size: 1rem;
              color: #fff;
            }
            .num {
              font-size: 2.2rem;
              margin-top: 10px;
              margin-bottom: 0;
              color: #20fdfa;
            }
          }
        }
        .data-right {
          height: 100%;
          width: calc(50% - 7px);
        }
      }
      .level3 {
        height: 24rem;
        margin-top: 20px;
      }
    }
    .right {
      width: calc(30% - 20px);

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .three-echart {
        height: calc(33% - 10px);
      }
    }
  }
  .flex1 {
    flex: 1;
  }
  .mn {
    margin: 0;
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
  }
  .pr {
    padding-right: 0.75rem;
  }
  .pl {
    padding-left: 0.75rem;
  }
}
</style>
