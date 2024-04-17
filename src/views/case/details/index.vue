<template>
  <div id="caseDetails">
    <div class="detail-item">
      <div class="box">
        <el-button class="mr20" shape="round" @click="back">返回列表</el-button>
      </div>
    </div>
    <!-- <Policy :policy-relation-resp="data.policyRelationResp"></Policy> -->
    <!-- <div class="split"></div> -->
    <AccidentInformationDetails
      :case-info-entity="data.caseInfoEntityResp"
    ></AccidentInformationDetails>

    <SiteSurvey
      v-if="data.caseSiteSurveyResp"
      ref="siteSurvey"
      :case-site-survey-resp="data.caseSiteSurveyResp"
    ></SiteSurvey>

    <FeeInformation
      v-if="data.caseLossAssessment"
      :case-loss-assessment="data.caseLossAssessment"
    ></FeeInformation>

    <CompensationInfo
      v-if="data.casePaymentIndemnityParam"
      :case-payment-indemnity-param="data.casePaymentIndemnityParam"
    ></CompensationInfo>

    <CaseComment ref="Comment"></CaseComment>
    <CloseCase ref="close" />

    <!-- <div v-if="!$route.query.id" class="detail-item">
      <div style="text-align: center; margin-top: 20px; margin-bottom: 20px">
        <el-button class="mr20" shape="round" @click="deal">取 消</el-button>
        <el-button
          type="primary"
          :loading="loadingbut"
          shape="round"
          @click="submit"
        >
          {{ loadingbuttext }}
        </el-button>
      </div>
    </div> -->
  </div>
</template>
<script>
import CaseComment from './components/CaseComment' // 理赔满意度
// import Policy from '../components/Policy' // 保单信息
import SiteSurvey from './components/SiteSurvey' // 现场查勘
import FeeInformation from './components/FeeInformation' // 定损信息
import CompensationInfo from '../components/CompensationInfo' // 赔付信息
import AccidentInformationDetails from '../components/AccidentInformationDetails' // 出险信息
import CloseCase from './components/CloseCase' // 销案
import {
  getCaseDetails,
  caseDeal,
  closeCase,
  getCaseList,
  CaseEnd,
  caseAdd,
} from '@/api/caseManagement'
import { mapGetters } from 'vuex'
export default {
  name: 'CaseDetails',
  components: {
    // Policy,
    CloseCase,
    CaseComment,
    CompensationInfo,
    SiteSurvey,
    FeeInformation,
    AccidentInformationDetails,
  },
  data() {
    return {
      loadingbut: false, //审核提交加载中
      loadingbuttext: '提交',
      data: {
        policyRelationResp: {}, //保单信息
        caseInfoEntityResp: {}, //出险信息
        caseSiteSurveyResp: {}, //现场查勘
        caseLossAssessment: {}, //定损信息
        casePaymentIndemnityParam: {}, //赔付信息
      },
    }
  },
  // watch: {
  //   '$route': 'initData'    // getTabelValueReset 是路由改变后触发的函数名称
  // },

  computed: {
    ...mapGetters({
      caseInfoEntity: 'formDatas/caseInfoEntity',
      caseLossAssessment: 'formDatas/caseLossAssessment',
      caseSiteSurveyParam: 'formDatas/caseSiteSurveyParam',
      casePaymentIndemnityParam: 'formDatas/casePaymentIndemnityParam',
    }),
  },
  created() {
    this.initData()
  },
  activated() {
    this.initData()
  },
  methods: {
    async deal() {
      await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
      this.$router.go(-1)
    },
    async closeCase() {
      this.$refs.close.dialogFormVisible = true
      this.$refs.close.form.id = this.$route.query.id
      this.$refs.close.form.caseNo = this.data.caseInfoEntityResp.caseNo
    },
    async back() {
      await this.$store.dispatch('tabsBar/delVisitedRoute', {
        path: '/case/caseDeal',
      })
      await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
      this.$router.push({
        path: 'caseList',
      })
    },
    async submit() {
      //提交数据
      this.loadingbut = true
      this.loadingbuttext = '提交中...'
      if (this.$route.query.code) {
        //详情进入
        let data = {
          casePaymentIndemnityParam:
            JSON.stringify(this.casePaymentIndemnityParam) !== '{}'
              ? this.casePaymentIndemnityParam
              : null,
          caseSiteSurveyParam:
            JSON.stringify(this.caseSiteSurveyParam) !== '{}'
              ? this.caseSiteSurveyParam
              : null,
          caseLossAssessment:
            JSON.stringify(this.caseLossAssessment) !== '{}'
              ? this.caseLossAssessment
              : null,
        }
        let res = await caseDeal(data, this.$route.query.code)
        if (res.code == '0000') {
          if (this.$route.query.finalFlag) {
            let res4 = await CaseEnd(this.$route.query.code)
            if (res4.code === '0000') {
              this.loadingbut = false
              this.loadingbuttext = '提交'
              this.$baseMessage(' 结案成功!', 'success')
              await this.$store.dispatch('tabsBar/delVisitedRoute', {
                path: '/case/caseDeal',
              })
              await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
              this.$router.push({
                path: 'caseList',
              })
            }
          } else {
            this.loadingbut = false
            this.loadingbuttext = '提交'
            this.$baseMessage(' 处理案件成功!', 'success')
            await this.$store.dispatch('tabsBar/delVisitedRoute', {
              path: '/case/caseDeal',
            })
            await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
            this.$router.push({
              path: 'caseList',
            })
          }
        } else {
          this.$baseMessage(' 处理案件失败!', 'error')
          this.loadingbut = false
          this.loadingbuttext = '提交'
        }
      } else {
        let data = this.data.caseInfoEntityResp
        let res0 = await caseAdd(data)

        if (res0.code === '0000') {
          if (
            JSON.stringify(this.data.caseSiteSurveyResp) == '{}' &&
            JSON.stringify(this.data.caseLossAssessment) == '{}' &&
            JSON.stringify(this.data.casePaymentIndemnityParam) == '{}'
          ) {
            this.clear()
            this.$baseMessage('添加案件成功', 'success')
            await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
            this.$router.push({
              path: 'caseList',
            })
          } else {
            let data0 = {
              pn: 1,
              ps: 10,
              caseNo: this.data.caseInfoEntityResp.caseNo,
            }
            let res00 = await getCaseList(data0)
            if (res00.code === '0000' && res00.total) {
              let caseId = res00.list[0].id
              let data3 = {
                casePaymentIndemnityParam: this.data.casePaymentIndemnityParam,
                caseSiteSurveyParam: this.data.caseSiteSurveyResp,
                caseLossAssessment: this.data.caseLossAssessment,
              }
              let res3 = await caseDeal(data3, caseId)
              if (res3.code === '0000') {
                if (this.$route.query.finalFlag) {
                  //结案
                  let res4 = await CaseEnd(caseId)
                  if (res4.code === '0000') {
                    this.$baseMessage('结案成功!', 'success')
                  }
                } else {
                  this.$baseMessage(' 处理成功!', 'success')
                }
                this.clear()
                await this.$store.dispatch('tabsBar/delVisitedRoute', {
                  path: '/case/caseDeal',
                })
                await this.$store.dispatch(
                  'tabsBar/delVisitedRoute',
                  this.$route
                )
                this.$router.push({
                  path: 'caseList',
                })
              } else {
                this.$baseMessage('处理案件失败!', 'error')
                this.loadingbut = false
                this.loadingbuttext = '提交'
              }
            } else {
              this.$baseMessage('获取案件id失败!', 'error')
              this.loadingbut = false
              this.loadingbuttext = '提交'
            }
          }
        }
      }
      this.loadingbut = false
      this.loadingbuttext = '提交'
    },
    clear() {
      this.$store.commit('formDatas/casePaymentIndemnityParam', {})
      this.$store.commit('formDatas/caseSiteSurveyParam', {})
      this.$store.commit('formDatas/caseLossAssessment', {})
      this.$store.commit('formDatas/caseInfoEntity', {})
    },
    async initData() {
      if (this.$route.query.id) {
        await this.getCaseDetails()
      } else if (this.$route.query.code) {
        await this.getDetailVuex() //从vuex里取数据
      } else {
        this.getVuexData()
      }
    },
    async getDetailVuex() {
      let res = await getCaseDetails(this.$route.query.code)
      if (res.code === '0000') {
        this.data.policyRelationResp = res.data.policyRelationResp
        this.data.caseInfoEntityResp = res.data.caseInfoEntityResp
      }
      this.data.casePaymentIndemnityParam = this.casePaymentIndemnityParam
      this.data.caseSiteSurveyResp = this.caseSiteSurveyParam
      this.data.caseLossAssessment = this.caseLossAssessment
    },
    async getVuexData() {
      this.data.caseInfoEntityResp = this.caseInfoEntity
      console.log(this.data.caseInfoEntityResp, '========')
      this.data.casePaymentIndemnityParam = this.casePaymentIndemnityParam || {}
      this.data.caseSiteSurveyResp = this.caseSiteSurveyParam || {}
      this.data.caseLossAssessment = this.caseLossAssessment || {}
      console.log(this.data.caseLossAssessment, 'this.data.caseLossAssessment')
    },
    async getCaseDetails() {
      let res = await getCaseDetails(this.$route.query.id)
      if (res.code === '0000') {
        this.data = res.data
        if (res.data.caseSiteSurveyResp) {
          this.data.caseSiteSurveyResp = res.data.caseSiteSurveyResp

          this.data.caseSiteSurveyResp.fileRecordIds = []
          let arr = []
          if (res.data.caseSiteSurveyResp.siteFiles) {
            arr = res.data.caseSiteSurveyResp.siteFiles.map((item) => {
              return item.id
            })
          }

          this.data.caseSiteSurveyResp.fileRecordIds = arr
        }

        this.$refs.Comment.commentData = parseInt(
          res.data.caseInfoEntityResp.comment
        )
      }
    },
  },
}
</script>

<style scoped lang="scss">
#caseDetails {
  padding-bottom: 10px;
  background-color: #f6f8f9;
  .row {
    margin-left: 30px;
    padding: 20px 0;
    .row-bg {
      margin-bottom: 20px;
    }
  }
  .split {
    height: 10px;
    background-color: #f6f8f9;
  }
  .box {
    display: flex;
    justify-content: flex-end;
    padding: 0 50px;
  }
}
</style>
