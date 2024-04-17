<template>
  <div id="caseAdd">
    <div class="header">
      <el-steps process-status="finish" :active="0" simple>
        <el-step title="填写出险信息">
          <span slot="icon">1</span>
        </el-step>
        <el-step title="填写结案信息">
          <span slot="icon">2</span>
        </el-step>
        <el-step title="提交完成">
          <span slot="icon">3</span>
        </el-step>
      </el-steps>
      <div class="headerTip color-blue">
        请填写真实有效的信息，对于您的信息我们会严格保密
      </div>
    </div>

    <div class="conBox">
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">保单信息</span>
      </div>
      <div v-if="!hasInsured" class="emptyBox">
        <el-button class="w100" @click="openInsured" type="primary">
          选择保单
        </el-button>
      </div>
      <policy-info v-else ref="policyInfo" />
      <div v-if="hasInsured" class="text-center mt20 mb20">
        <el-button @click="openInsured">修改</el-button>
      </div>
    </div>
    <report ref="report" />

    <div class="detail-item">
      <div class="bottom" style="text-align: center; margin-bottom: 20px">
        <el-button type="primary" class="mr20 w120" @click="nextSteb">
          下一步
        </el-button>
        <el-button type="primary" class="mr20 w120" @click="back">
          保存并返回列表
        </el-button>
      </div>
    </div>
    <sel-policy @getMsg="getPolicy" ref="selPolicy" />
  </div>
</template>

<script>
import { caseAdd, getCaseDetails } from '@/api/caseManagement'
import policyInfo from './components/casePolicy.vue'
import { mapGetters } from 'vuex'
import SelPolicy from './components/selPolicy.vue'
import Report from './components/report.vue'

export default {
  name: 'CaseAdd',
  components: {
    policyInfo,
    SelPolicy,
    Report,
  },
  data() {
    return {
      active: 1,
      hasInsured: false,
      policyData: {},
      finalFlag: true,
      showBtn: false,
    }
  },
  computed: {
    ...mapGetters({
      caseInfoEntity: 'formDatas/caseInfoEntity',
    }),
  },

  methods: {
    openInsured() {
      this.$refs.selPolicy.dialogFormVisible = true
    },
    getPolicy(data) {
      if (data) {
        this.hasInsured = true

        this.$nextTick(() => {
          this.policyData = data
          this.$refs.policyInfo.data = data
        })
      }
    },
    async nextSteb() {
      if (!this.hasInsured) {
        this.$baseMessage('请先选择保单', 'error')
        return
      }
      if (this.$refs.report.save()) {
        let res = await this.submit()
        if (res.code === '0000') {
          //处理案件
          await this.$store.commit('formDatas/caseTime', res.data.caseTime)
          this.$router.push({
            path: 'dealCase',
            query: {
              id: res.data.id,
              reportNo: res.data.reportNo,
            },
          })
        }
      } else {
        this.focusError()
      }
    },
    async submit() {
      let policyData = {
        policyId: this.policyData.id,
        policyNo: this.policyData.policyNo,
        insuredName: this.policyData.custFullName,
        issuingCompanyName: this.policyData.issuingCompanyName,
        issuingCompanyCode: this.policyData.issuingCompanyCode,
        economyFieldOne: this.policyData.industryOne,
        economyFieldTwo: this.policyData.industryTwo,
        startTime: this.policyData.startTime,
        endTime: this.policyData.endTime,
        actualPrem: this.policyData.actualPrem,
        limitValue: this.policyData.limitValue,
      }
      let data = {
        ...this.caseInfoEntity,
        ...policyData,
      }
      console.log(this.policyData, '0000000')
      console.log(data, 'data')

      let res = await caseAdd(data)
      return res
    },
    clear() {
      this.$store.commit('formDatas/casePaymentIndemnityParam', {})
      this.$store.commit('formDatas/caseSiteSurveyParam', {})
      this.$store.commit('formDatas/caseLossAssessment', {})
      this.$store.commit('formDatas/caseInfoEntity', {})
    },

    async back() {
      if (!this.hasInsured) {
        this.$baseMessage('请先选择保单', 'error')
        return
      }
      if (this.$refs.report.save()) {
        let res = await this.submit()
        if (res.code === '0000') {
          //处理案件
          await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
          this.$router.push({
            path: 'caseList',
          })
        }
      } else {
        this.focusError()
      }
    },
    focusError() {
      setTimeout(() => {
        this.$message.error({
          title: '提示',
          message: document.getElementsByClassName('el-form-item__error')[0]
            .innerText,
        })
        let isError = document.getElementsByClassName('is-error')
        isError[0].querySelector('input').focus()
      }, 100)
    },
  },
}
</script>

<style lang="scss" >
#caseAdd {
  background-color: #f6f8f9;
  .conBox {
    border-radius: 6px;
    margin-top: 10px;
    overflow: hidden;
    padding-bottom: 10px;
    background-color: #fff;
    .emptyBox {
      height: 160px;
      display: flex;

      justify-content: center;
      align-items: center;
    }
    .title {
      display: flex;
      height: 40px;
      width: 96%;
      margin: 0 auto;
      align-items: center;
      padding: 0 20px;
      font-size: 12px;
      border-bottom: 1px solid #e9e9e9;

      span:nth-child(1) {
        display: inline-block;
        width: 5px;
        height: 16px;
        background-color: #096dd9;
      }

      span:nth-child(4) {
        color: #ffa940;
        cursor: pointer;
        margin-left: 20px;
      }
    }
  }
}
#caseAdd {
  .header {
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    background-color: #fff !important;
    height: 130px;
    .el-step__icon {
      width: 26px;
      height: 26px;
      font-size: 16px;
    }
    .el-steps {
      width: 70%;
    }

    .headerTip {
      width: 100%;
      height: 36px;
      line-height: 36px;
      font-size: 12px;
      background-color: #cce7ff;
      text-align: center;
    }

    .el-steps--simple {
      background-color: #fff;
    }
  }
}
</style>
