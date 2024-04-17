<template>
  <div id="FeeInformationAdd">
    <Title
      :button-right="buttonRight"
      :title="title"
      @cancle="cancleBtn"
    ></Title>
    <div class="content_item ml30 lh30">
      <el-form
        v-if="showFeeInfo"
        ref="ruleForm"
        label-position="right"
        label-width="210px"
        :inline="true"
        :model="form"
        :rules="rules"
      >
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="从业人员人身伤亡定损金额："
              prop="employInjuryLossAmount"
            >
              <el-input-number
                v-model="form.employInjuryLossAmount"
                :min="0"
                :max="99999999.99"
                class="w220"
                :precision="2"
                size="medium"
              ></el-input-number>
              <span class="ml10">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item
              label="第三者人身伤亡定损金额："
              prop="thirdInjuryLossAmount"
            >
              <el-input-number
                v-model="form.thirdInjuryLossAmount"
                :min="0"
                :max="99999999.99"
                class="w220"
                :precision="2"
                size="medium"
              ></el-input-number>
              <span class="ml10">元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="第三者财产损失定损金额："
              prop="thirdPropertyLossAmount"
            >
              <el-input-number
                v-model="form.thirdPropertyLossAmount"
                :min="0"
                :max="99999999.99"
                class="w220"
                :precision="2"
                size="medium"
              ></el-input-number>
              <span class="ml10">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item
              label="事故抢险救援费用金额："
              prop="accidentRescueAmount"
            >
              <el-input-number
                v-model="form.accidentRescueAmount"
                :min="0"
                :max="99999999.99"
                class="w220"
                :precision="2"
                size="medium"
              ></el-input-number>
              <span class="ml10">元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="医疗救护费用金额：" prop="medicalAmount">
              <el-input-number
                v-model="form.medicalAmount"
                :min="0"
                :max="99999999.99"
                class="w220"
                :precision="2"
                size="medium"
              ></el-input-number>
              <span class="ml10">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item
              label="事故鉴定费用金额："
              prop="accidentSurveyAmount"
            >
              <el-input-number
                v-model="form.accidentSurveyAmount"
                :min="0"
                :max="99999999.99"
                class="w220"
                :precision="2"
                size="medium"
              ></el-input-number>
              <span class="ml10">元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="法律诉讼费用金额：" prop="legalProceedAmount">
              <el-input-number
                v-model="form.legalProceedAmount"
                :min="0"
                :max="99999999.99"
                class="w220"
                :precision="2"
                size="medium"
              ></el-input-number>
              <span class="ml10">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="其他费用金额：" prop="otherAmount">
              <el-input-number
                v-model="form.otherAmount"
                :min="0"
                :max="99999999.99"
                class="w220"
                :precision="2"
                size="medium"
              ></el-input-number>
              <span class="ml10">元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="定损总金额：">
              <span class="color-red">{{ totalAmount }}元</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="!showFeeInfo" class="emptyBox">
        <span @click="showFeeInfo = true">添加</span>
      </div>
    </div>
  </div>
</template>
<script>
  import Title from '@/components/NewTitle'
  import { validateNum, validateMoney } from '@/utils/validateFrom'

  export default {
    name: 'FeeInformationAdd',
    components: { Title },

    props: {},
    data() {
      return {
        title: '定损信息',
        buttonRight: {
          flag: true,
          type: 'info',
          emit: 'cancle',
          text: '取 消',
        },
        showCancle: false,
        showFeeInfo: false,
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
      cancleBtn() {
        this.showFeeInfo = false
      },
      save() {
        let flag = false
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            // this.$store.commit('formDatas/caseLossAssessment', this.form)
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
    padding: 0 20px 20px 0;
    margin: 10px 0;
    background-color: #fff;
    .emptyBox {
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 36px;
      color: #000;
      span {
        cursor: pointer;
      }
      // font-weight: 600;
    }
    .title_item {
      display: inline-block;
      width: 210px;
    }
  }
  .red {
    color: #f00;
  }
</style>
