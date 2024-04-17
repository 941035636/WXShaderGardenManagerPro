<template>
  <!-- 定损信息 -->
  <div id="FeeInformation">
    <Title title="定损信息"></Title>
    <div class="row">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">第三者人身伤亡定损金额：</span>
          <span class="color-red-F5222D">
            ￥{{ caseLossAssessment.thirdInjuryLossAmount }}元
          </span>
        </el-col>
        <el-col :span="8">
          <span class="title">从业人员人身伤亡定损金额：</span>
          <span class="color-red-F5222D">
            ￥{{ caseLossAssessment.employInjuryLossAmount }}元
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">第三者财产损失定损金额：</span>
          <span class="color-red-F5222D">
            ￥{{ caseLossAssessment.thirdPropertyLossAmount }}元
          </span>
        </el-col>
        <el-col :span="8">
          <span class="title">事故抢险救援费用金额：</span>
          <span class="color-red-F5222D">
            ￥{{ caseLossAssessment.accidentRescueAmount }}元
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">医疗救护费用金额：</span>
          <span class="color-red-F5222D">
            ￥{{ caseLossAssessment.medicalAmount }}元
          </span>
        </el-col>
        <el-col :span="8">
          <span class="title">事故鉴定费用金额：</span>
          <span class="color-red-F5222D">
            ￥{{ caseLossAssessment.accidentSurveyAmount }}元
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">法律诉讼费用金额：</span>
          <span class="color-red-F5222D">
            ￥{{ caseLossAssessment.legalProceedAmount }}元
          </span>
        </el-col>
        <el-col :span="8">
          <span class="title">其他费用金额：</span>
          <span class="color-red-F5222D">
            ￥{{ caseLossAssessment.otherAmount }}元
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">定损总金额：</span>
          <span v-if="$route.query.id" class="color-red-F5222D">
            ￥{{ caseLossAssessment.totalLossAmount }}元
          </span>
          <span v-if="$route.query.code" class="color-red-F5222D">
            ￥{{ totalAmount }}元
          </span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Title from '@/components/NewTitle'
export default {
  name: 'FeeInformation',
  components: {
    Title,
  },
  props: {
    caseLossAssessment: {
      type: Object,
      require: false,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      data: {},
    }
  },
  computed: {
    totalAmount() {
      let {
        employInjuryLossAmount,
        accidentRescueAmount,
        thirdInjuryLossAmount,
        thirdPropertyLossAmount,
        accidentSurveyAmount,
        medicalAmount,
        legalProceedAmount,
        otherAmount,
      } = this.caseLossAssessment
      const objNum = [
        employInjuryLossAmount || 0,
        accidentRescueAmount || 0,
        thirdInjuryLossAmount || 0,
        thirdPropertyLossAmount || 0,
        accidentSurveyAmount || 0,
        medicalAmount || 0,
        legalProceedAmount || 0,
        otherAmount || 0,
      ]
      let count = null

      if (
        objNum.find((item) => {
          typeof item == 'string'
        })
      ) {
      } else {
      }
      count = objNum.reduce((prev, curr) => {
        const value = Number(curr)
        if (!isNaN(value)) {
          return prev + value
        } else {
          return prev
        }
      }, 0)

      return count
    },
  },
  methods: {},
}
</script>

<style scoped lang="scss" scoped>
#FeeInformation {
  padding: 0;
  margin: 10px 0;
  background-color: #fff;
  .title {
    display: inline-block;
    width: 210px;
    text-align: right;
  }
  .row {
    margin-left: 30px;
    padding: 10px 0;
    .row-bg {
      margin-bottom: 20px;
    }
  }
}
</style>
