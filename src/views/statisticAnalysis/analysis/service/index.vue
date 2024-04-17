<template>
  <div id="ServiceOrganization">
    <div class="ServiceOrganization-bg">
      <div class="top-header">
        <h1 class="mn">服务机构分析</h1>
      </div>
      <div class="screening-conditions">
        <p-and-i-base-condition></p-and-i-base-condition>
      </div>
      <div class="bbb"></div>
      <div class="content-wrapper" style="height: 100%">
        <div class="item-box-w" style="height: 10rem">
          <div class="item-i flex1">
            <div class="item-i-bg item-i-bg-border">
              <div class="item-content" style="height: 100%">
                <div class="item-c-i">
                  <div class="shadowCircle">
                    <i class="el-icon-office-building"></i>
                  </div>

                  <p>
                    <span class="text">保险机构（家）</span>
                    <span class="num">
                      {{ orgData.insuranceCompanyNum }}
                    </span>
                  </p>
                </div>
                <div class="item-c-i">
                  <div class="shadowCircle">
                    <i class="el-icon-office-building"></i>
                  </div>
                  <p>
                    <span class="text">经纪机构（家）</span>
                    <span class="num">
                      {{ orgData.insuranceBrokerNum }}
                    </span>
                  </p>
                </div>
                <div class="item-c-i">
                  <div class="shadowCircle">
                    <i class="el-icon-office-building"></i>
                  </div>
                  <p>
                    <span class="text">服务机构（家）</span>
                    <span class="num">
                      {{ orgData.serviceOrgNum }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item-box-w" style="height: 30rem">
          <div class="item-i flex1">
            <div class="item-i-bg">
              <div class="title">承保数据统计</div>
              <div class="item-content act">
                <base-bar2
                  ref="underwritingStatisticsOptions"
                  @satisfactionClick="satisfactionClick"
                ></base-bar2>
              </div>
            </div>
          </div>
        </div>
        <div class="item-box-w" style="height: 30rem">
          <div class="item-i flex1">
            <div class="item-i-bg">
              <div class="title">安全服务机构</div>
              <div class="item-content act">
                <base-bar ref="safetyOrganizationOptions"></base-bar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="title"
      width="70rem"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <div class="dialog-body">
        <div class="list-wrapper">
          <!-- <div class="list-title"><span>示范项目</span></div> -->
          <ul>
            <li>
              <span>应保企业（家）</span>
              <span>
                {{
                  exampleProjectData
                    ? exampleProjectData.shouldInsureCorpNum
                    : '0' | ThousandSeparator
                }}
              </span>
            </li>
            <li>
              <span>已保企业（家）</span>
              <span>
                {{
                  exampleProjectData
                    ? exampleProjectData.shouldInsureCorpJoinNum
                    : '0' | ThousandSeparator
                }}
              </span>
            </li>
            <li>
              <span>保额（亿元）</span>
              <span>
                {{
                  exampleProjectData
                    ? exampleProjectData.amount
                    : '0' | ThousandSeparator
                }}
              </span>
            </li>
            <li>
              <span>保费（万元）</span>
              <span>
                {{
                  exampleProjectData
                    ? exampleProjectData.prem
                    : '0' | ThousandSeparator
                }}
              </span>
            </li>
            <li>
              <span>报案数（起）</span>
              <span>
                {{
                  exampleProjectData
                    ? exampleProjectData.caseNum
                    : '0' | ThousandSeparator
                }}
              </span>
            </li>
            <li>
              <span>赔付金额（万元）</span>
              <span>
                {{
                  exampleProjectData
                    ? exampleProjectData.payMoney
                    : '0' | ThousandSeparator
                }}
              </span>
            </li>
          </ul>

          <div class="e-box">
            <base-line ref="baseLine2"></base-line>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSreviceOrg,
  getSreviceInsuredCompany,
  getSreviceUnderwriting,
  getSreviceTimes,
} from '@/api/staistics'
import pAndIBaseCondition from '../components/pAndIBaseCondition.vue'
import baseLine from '../components/echarts/baseLine.vue'
import baseBar from '../components/echarts/baseBar.vue'
import baseBar2 from '../components/echarts/baseBar2.vue'
// importcoinsurance
export default {
  name: 'ServiceOrganization',
  components: {
    pAndIBaseCondition,
    baseLine,
    baseBar,
    baseBar2,
  },
  data() {
    return {
      resizeHandler: null,
      dialogVisible: false,
      orgData: {},
      title: '示范共保体',
      exampleProjectData: {}, //示范项目
      unExampleProjectData: {}, //非示范
      underwritingStatisticsOptions: {
        // 承保数据统计
        name: '累计保费',
        color: ['#FFC350', '#0acba0'],
        dataList: [],
        dataList2: [],
        xAxisTitles: [],
      },
      underwritingData: [],
      commentData: {
        // 承保数据统计
        name: '参保满意度',
        color: ['#FFC350'],
        colorArr: [
          { offset: 0, color: 'rgba(255, 195, 80, 1)' },
          { offset: 0.5, color: 'rgba(255, 195, 80, .8)' },
          { offset: 1, color: 'rgba(255, 195, 80, .2)' },
        ],
        dataList: [],
        xAxisTitles: [],
      },

      safetyOrganizationOptions: {
        // 安全服务机构
        name: '服务次数',
        color: ['#00C4F5'],
        dataList: [],
        xAxisTitles: [],
      },
    }
  },
  mounted() {
    let data = {
      startDate: '2022-01-01 00:00:00',
      endDate: '2022-12-31 23:59:59',
    }
    this.init(data)
  },

  methods: {
    async init(data) {
      let res0 = await getSreviceOrg()
      if (res0.code === '0000') {
        this.orgData = res0.data
      }
      let res1 = await getSreviceUnderwriting(data)
      if (res1.code === '0000' && res1.total) {
        let obj = {}
        res1.list.forEach((item, index) => {
          if (item.projectType === '省级示范共保体') {
            obj = item
            res1.list.splice(index, 1)
            return
          }
        })

        res1.list.unshift(obj)
        this.underwritingData = res1.list

        this.underwritingStatisticsOptions.dataList = res1.list.map((item) => {
          return item.actualPrem
        })
        this.underwritingStatisticsOptions.dataList2 = res1.list.map((item) => {
          return item.satisfaction
        })
        this.commentData.dataList = res1.list.map((item) => {
          return item.satisfaction
        })
        this.commentData.xAxisTitles =
          this.underwritingStatisticsOptions.xAxisTitles = res1.list.map(
            (item) => {
              return item.projectType
            }
          )

        this.$nextTick(
          this.$refs.underwritingStatisticsOptions.underwritingSafety(
            this.underwritingStatisticsOptions
          )
        )
        // this.$nextTick(this.$refs.baseLine1.satisfaction(this.commentData))
      }
      let res2 = await getSreviceTimes(data)
      if (res2.code === '0000' && res2.total) {
        this.safetyOrganizationOptions.dataList = res2.list.map((item) => {
          return item.planNum
        })
        this.safetyOrganizationOptions.xAxisTitles = res2.list.map((item) => {
          return item.serviceAgencyName
        })
        this.$refs.safetyOrganizationOptions.underwritingSafety(
          this.safetyOrganizationOptions
        )
      }
    },
    // 点击
    async satisfactionClick(e) {
      if (e) {
        this.title = e
      }
      let code = null
      console.log(this.underwritingData, '======')
      this.underwritingData.map((item) => {
        if (item.issuingCompanyName == e) {
          code = item.issuingCompanyCode
        }
      })

      let data = {
        startDate: '2022-01-01 00:00:00',
        endDate: '2022-12-31 23:59:59',
        projectType: e,
      }
      let commentData = {
        // 承保数据统计
        name: '保单数',
        color: ['#01AFFF'],
        colorArr: [
          { offset: 0, color: 'rgba(1, 175, 255, 1)' },
          { offset: 0.5, color: 'rgba(1, 175, 255, 0.6)' },
          { offset: 1, color: 'rgba(1, 175, 255, 0.2)' },
        ],
        dataList: [],
        xAxisTitles: [],
      }
      this.dialogVisible = true
      let res = await getSreviceInsuredCompany(data)
      if (res.code === '0000') {
        console.log(res.data, '++++======')
        this.exampleProjectData = res.data.projectData
        // this.unExampleProjectData = res.data.unExampleProjectData
        commentData.dataList = res.data.insuranceTrendResps.map((item) => {
          return item.policyNum
        })
        commentData.xAxisTitles = res.data.insuranceTrendResps.map((item) => {
          return item.month + '月'
        })

        this.$nextTick(this.$refs.baseLine2.satisfaction(commentData))
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
  },
}
</script>

<style lang="scss">
#ServiceOrganization {
  width: 100%;
  min-height: 100vh;
  margin-bottom: 2rem;
  background: #000928;
  .bbb {
    position: absolute;
    top: 100vh;
    left: 0;
    width: 100%;
    height: 100rem;
    background: #000928;
    z-index: 0;
  }
  .ServiceOrganization-bg {
    min-height: 100vh;
    background: url(../../../../assets/echarts_png/bg.png);
    background-size: 100% auto;
    background-repeat: no-repeat;
  }
  .top-header {
    height: 5.3rem;
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
    padding-top: 2rem;
  }

  .content-wrapper {
    box-sizing: border-box;
    padding: 0 1.5rem;
    height: 100%;
    .item-box-w {
      position: relative;
      display: flex;
      height: 20%;
      margin-top: 1rem;
      .item-i {
        box-sizing: border-box;
        .item-i-bg {
          position: relative;
          width: 100%;
          height: 100%;
          background-image: url(../../../../assets/echarts_png/dk.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        .item-i-bg-border {
          background-image: url(../../../../assets/echarts_png/border.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .title {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 15.78%;
      padding-left: 3%;
      padding-top: 4px;
      font-size: 1rem;
      color: #fff;
    }
    .item-content {
      height: calc(100% - 15.78%);
      display: flex;
      align-items: center;
      justify-content: space-around;
      color: #fff;
      .item-c-i {
        box-sizing: border-box;
        display: flex;
        justify-items: center;
        border: 0.1rem solid #0e6de9;
        padding: 0.6rem 2rem;
        border-radius: 0.4rem;
        background: rgba(14, 109, 233, 0.2);
        .shadowCircle {
          margin-top: 10px;
          width: 70px;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 35px;
          background-color: #000928;
          margin-right: 20px;
          box-shadow: 0 0 10px #0072ff;
          /* x偏移 y偏移 模糊量 颜色 */

          i {
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 2rem;
            color: #0e6de9;
          }
        }

        p {
          display: flex;
          flex-direction: column;
          align-items: left;
          .text {
            font-size: 1.05rem;
            color: #fff;
            letter-spacing: 5px;
          }
          .num {
            font-size: 2rem;
            margin-top: 0.2rem;
            color: #20fdfa;
            letter-spacing: 2px;
          }
        }
      }
    }
    .item-content.act {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .item-content.expert {
      flex-direction: column;
      align-items: none;
      justify-content: center;
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
        font-size: 2rem;
      }
    }
  }
  .el-dialog__body {
    box-sizing: border-box;
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
    font-size: 1.5rem;
  }

  .el-dialog__headerbtn {
    top: 0.9rem;
  }

  .el-dialog__header {
    position: relative;
    top: 0.48rem;
    text-align: center;
    color: #fff;
    height: 3rem;
    padding: 0;
    background-image: url(../../../../assets/echarts_png/jx.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-dialog__title {
      font-size: 1.5rem;
      color: #fff;
    }
  }

  .dialog-body {
    box-sizing: border-box;
    padding: 0px 2rem;
  }

  .list-wrapper {
    height: 100%;
    ul,
    li {
      list-style: none;
    }
    .list-title {
      font-size: 1.4rem;
      font-weight: bold;

      span {
        background-image: linear-gradient(
          92deg,
          #00eaff 0%,
          #01aaff 50%,
          #0072ff 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    ul {
      display: flex;
      justify-content: space-between;
      color: #fff;
      padding-left: 0;
      margin-bottom: 2rem;
      li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 9rem;
        padding: 0.8rem 0;
        border-radius: 0.3rem;
        border: 0.1rem solid rgba(14, 109, 233, 1);
        background: rgba(14, 109, 233, 0.2);
      }
      li span:nth-child(1) {
        font-size: 1rem;
        line-height: 1rem;
        margin-bottom: 0.7rem;
        color: #fff;
      }
      li span:nth-child(2) {
        font-size: 1.6rem;
        line-height: 1.3rem;
        color: #20fdfa;
      }
    }
    .e-box {
      height: 15rem;
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

<style>
#ServiceOrganization .el-dialog {
  /* height: 40rem; */
  background: none;
  background-image: url(../../../../assets/echarts_png/tcbg.png);
  background-size: 100% 100%;
}
</style>
