<template>
  <div id="FeeInformationAdd">
    <Title :title="title"></Title>
    <div class="content_item ml30 lh30">
      <el-form
        ref="ruleForm"
        label-position="left"
        label-width="210px"
        :inline="true"
        :model="form"
        :rules="rules"
      >
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="第三者人身伤亡定损金："
              prop="thirdInjuryLossAmount"
            >
              <Money-input
                v-model="form.thirdInjuryLossAmount"
                template="append"
                class="w250"
                placeholder="请输入金额，小数保留两位"
              ></Money-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item
              label="从业人员人身伤亡定损金额："
              prop="employInjuryLossAmount"
            >
              <Money-input
                v-model="form.employInjuryLossAmount"
                template="append"
                class="w250"
                placeholder="请输入金额，小数保留两位"
              ></Money-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="事故抢险救援费用金额："
              prop="accidentRescueAmount"
            >
              <Money-input
                v-model="form.accidentRescueAmount"
                template="append"
                class="w250"
                placeholder="请输入金额，小数保留两位"
              ></Money-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item
              label="第三者财产损失定损金额："
              prop="thirdPropertyLossAmount"
            >
              <Money-input
                v-model="form.thirdPropertyLossAmount"
                template="append"
                class="w250"
                placeholder="请输入金额，小数保留两位"
              ></Money-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="事故鉴定费用金额："
              prop="accidentSurveyAmount"
            >
              <Money-input
                v-model="form.accidentSurveyAmount"
                template="append"
                class="w250"
                placeholder="请输入金额，小数保留两位"
              ></Money-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="医疗救护费用金额：" prop="medicalAmount">
              <Money-input
                v-model="form.medicalAmount"
                template="append"
                class="w250"
                placeholder="请输入金额，小数保留两位"
              ></Money-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="其他费用金额：" prop="otherAmount">
              <Money-input
                v-model="form.otherAmount"
                template="append"
                class="w250"
                placeholder="请输入金额，小数保留两位"
              ></Money-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="法律诉讼费用金额：" prop="legalProceedAmount">
              <Money-input
                v-model="form.legalProceedAmount"
                template="append"
                class="w250"
                placeholder="请输入金额，小数保留两位"
              ></Money-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <span class="title_item">定损总金额：</span>
            <span class="color-red">{{ totalAmount }}元</span>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  import Title from '@/components/NewTitle'
  import { validateNum, validateMoney } from '@/utils/validateFrom'
  import MoneyInput from '@/components/MoneyInput'
  export default {
    name: 'FeeInformationAdd',
    components: { Title, MoneyInput },

    props: {},
    data() {
      return {
        title: '定损信息',
        form: {
          id: '', //标识id
          employInjuryLossAmount: null, //从业人员人身伤亡定损金额
          accidentRescueAmount: null, //事故抢险救援费用金额
          thirdInjuryLossAmount: null, //第三者人身伤亡定损金额
          thirdPropertyLossAmount: null, //第三者财产损失定损金额
          accidentSurveyAmount: null, //事故鉴定费用金额
          medicalAmount: null, //医疗救护费用金额
          // totalLossAmount: '', //定损总金额
          legalProceedAmount: null, //法律诉讼费用金额
          otherAmount: null, //其他费用金额
        },

        rules: {
          thirdInjuryLossAmount: [
            {
              required: true,
              validator: validateMoney,
              trigger: 'blur',
            },
          ],
          employInjuryLossAmount: [
            {
              required: true,
              validator: validateMoney,
              trigger: 'blur',
            },
          ],
          accidentRescueAmount: [
            {
              required: true,
              validator: validateMoney,
              trigger: 'blur',
            },
          ],
          thirdPropertyLossAmount: [
            {
              required: true,
              validator: validateMoney,
              trigger: 'blur',
            },
          ],
          accidentSurveyAmount: [
            {
              required: true,
              validator: validateMoney,
              trigger: 'blur',
            },
          ],
          medicalAmount: [
            {
              required: true,
              validator: validateMoney,
              trigger: 'blur',
            },
          ],
          legalProceedAmount: [
            {
              required: true,
              validator: validateMoney,
              trigger: 'blur',
            },
          ],
          otherAmount: [
            {
              required: true,
              validator: validateMoney,
              trigger: 'blur',
            },
          ],
        },
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
        } = this.form
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

    methods: {
      save() {
        let flag = false
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$store.commit('formDatas/caseLossAssessment', this.form)
            flag = true
          }
        })
        return flag
      },
    },
  }
</script>
<style lang="scss" scoped>
  #FeeInformationAdd {
    padding: 0 0 20px 0;
    margin: 10px 0;
    background-color: #fff;

    .title_item {
      display: inline-block;
      width: 210px;
    }
  }
  .red {
    color: #f00;
  }
</style>
