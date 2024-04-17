<template>
  <div id="CompensationInfo">
    <Title title="赔付信息"></Title>
    <div class="conBox">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">赔付时间：</span>
          <span>{{ casePaymentIndemnityParam.paymentTime }}</span>
        </el-col>
      </el-row>

      <div class="row" v-if="casePaymentIndemnityParam.casePersonIndemnitys">
        <el-row type="flex" class="row-bg">
          <el-col :span="8">
            <span class="title">人员伤亡赔付金额：</span>
            <span class="color-red">
              ￥{{ casePaymentIndemnityParam.personInjuryPayment }}元
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table
              :data="casePaymentIndemnityParam.casePersonIndemnitys"
              border
              header-row-class-name="headName"
              :header-cell-style="getRowClass"
              :cell-style="{ 'text-align': 'left' }"
            >
              <el-table-column
                prop="personType"
                label="人员类型"
              ></el-table-column>
              <el-table-column
                prop="personName"
                label="人员姓名"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="certificateType"
                label="人员证件类型"
                width="120"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.certificateType == '01'">
                    居民身份证
                  </span>
                  <span v-if="scope.row.certificateType == '02'">士官证</span>
                  <span v-if="scope.row.certificateType == '03'">护照</span>
                  <span v-if="scope.row.certificateType == '04'">其他</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="certificateNo"
                label="人员证件号码"
                width="120"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="personInjuryType"
                label="人员伤亡情况"
                width="150"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="150"
                label="人员伤亡证明文件"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-button type="text" @click="checkFile(scope.row)">
                    文件证明
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div v-if="thirdPartyLoss" class="row">
        <el-row type="flex" class="row-bg">
          <el-col :span="8">
            <span class="title">第三者财产损失金额：</span>
            <span class="color-red">￥{{ thirdPartyLoss }}元</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table
              :data="casePaymentIndemnityParam.caseThirdPartyIndemnitys"
              border
              header-row-class-name="headName"
              :header-cell-style="getRowClass"
              :cell-style="{ 'text-align': 'left' }"
            >
              <el-table-column
                prop="thirdPartyName"
                label="第三者名称"
              ></el-table-column>
              <el-table-column
                prop="thirdPartyProperty"
                label="第三者财产名称"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="thirdPartyPropertyLoss"
                label="第三者财产损失金额"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.thirdPartyPropertyLoss }}元
                </template>
              </el-table-column>
              <el-table-column
                label="第三者损失财产证明文件"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-button type="text" @click="checkPerson(scope.row)">
                    文件证明
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">事故抢险救援费用赔付金额：</span>
          <span class="color-red">
            ￥{{ casePaymentIndemnityParam.accidentRescueAmount }}元
          </span>
        </el-col>
        <el-col :span="8">
          <span class="title">医疗救护费用赔付金额：</span>
          <span class="color-red">
            ￥{{ casePaymentIndemnityParam.medicalAmount }}元
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">事故鉴定费用赔付金额：</span>
          <span class="color-red">
            ￥{{ casePaymentIndemnityParam.accidentSurveyAmount }}元
          </span>
        </el-col>
        <el-col :span="8">
          <span class="title">法律诉讼费用赔付金额：</span>
          <span class="color-red">
            ￥{{ casePaymentIndemnityParam.legalProceedAmount }}元
          </span>
        </el-col>
      </el-row>
      <el-row v-if="$route.query.id" class="mb20">
        <!-- <el-col v-if="casePaymentIndemnityParam.policyInsuredInfos" :span="8">
          <span class="title">共保体赔付金额：</span>
          <span class="color-red">
            ￥{{ casePaymentIndemnityParam.paymentLossAmount }}元
          </span>
        </el-col> -->
        <el-col :span="8">
          <span class="title">其他费用赔付金额：</span>
          <span class="color-red">
            ￥{{ casePaymentIndemnityParam.otherAmount }}元
          </span>
        </el-col>
        <el-col :span="8">
          <span class="title">赔付总金额：</span>
          <span class="color-red">
            ￥{{ casePaymentIndemnityParam.paymentLossAmount }}元
          </span>
        </el-col>
      </el-row>
      <el-row v-if="!$route.query.id" class="mb20">
        <!-- <el-col v-if="casePaymentIndemnityParam.policyInsuredInfos" :span="8">
          <span class="title">共保体赔付金额：</span>
          <span class="color-red">￥{{ payTotal }}元</span>
        </el-col> -->
        <!-- 请不要删除被注释的代码，以防哪天有改回来 -->
        <el-col :span="8">
          <span class="title">其他费用赔付金额：</span>
          <span class="color-red">
            ￥{{ casePaymentIndemnityParam.otherAmount }}元
          </span>
        </el-col>
        <el-col v-if="!casePaymentIndemnityParam.policyInsuredInfos" :span="8">
          <span class="title">赔付总金额：</span>
          <span class="color-red">￥{{ payTotal }}元</span>
        </el-col>
      </el-row>
      <!-- <el-row v-if="casePaymentIndemnityParam.policyInsuredInfos">
        <el-col :span="24">
          <el-table
            style="width: 100%"
            class="sum"
            :header-cell-style="getRowClass"
            :cell-style="{ 'text-align': 'left' }"
            :data="casePaymentIndemnityParam.policyInsuredInfos"
            border
          >
            <el-table-column
              prop="issuingCompanyName"
              label="保险机构"
              width="150"
            ></el-table-column>
            <el-table-column prop="premiumRate" label="赔付比例" width="150">
              <template slot-scope="scope">
                {{ scope.row.premiumRate * 100 }}
              </template>
            </el-table-column>
            <el-table-column
              width="150"
              prop="underwriteType"
              label="保险机构类型"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.underwriteType == '01'">主承</span>
                <span v-if="scope.row.underwriteType == '02'">跟单</span>
                <span v-if="scope.row.underwriteType == '03'">独立承保</span>
              </template>
            </el-table-column>
            <el-table-column min-width="150" label="赔付金额">
              <template slot-scope="scope">
                <span v-if="!$route.query.id">
                  {{ (scope.row.premiumRate * payTotal).toFixed(2) }}
                </span>

                <span v-if="$route.query.id">
                  {{
                    (
                      scope.row.premiumRate *
                      casePaymentIndemnityParam.paymentLossAmount
                    ).toFixed(2)
                  }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row> -->
      <div>
        <el-row type="flex" class="mb20">
          <el-col :span="24">
            <span class="title">付款凭证：</span>
          </el-col>
        </el-row>
        <div style="padding-left: 100px">
          <span
            v-for="item in casePaymentIndemnityParam.files"
            :key="item.id"
            class="mr20 con"
            @click="() => downFile(item.id)"
          >
            {{ item.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFile } from '@/api/resources.js'
import Title from '@/components/NewTitle'
export default {
  name: 'CompensationInfo',
  components: {
    Title,
  },
  props: {
    casePaymentIndemnityParam: {
      type: Object,
      require: true,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {}
  },
  computed: {
    thirdPartyLoss() {
      let count = 0

      if (this.casePaymentIndemnityParam.caseThirdPartyIndemnitys) {
        let arr = this.casePaymentIndemnityParam.caseThirdPartyIndemnitys.map(
          (item) => {
            return item.thirdPartyPropertyLoss
          }
        )
        count = arr.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return prev + value
          } else {
            return prev
          }
        }, 0)
      }
      return count
    },

    payTotal() {
      let {
        personInjuryPayment,
        accidentRescueAmount,
        accidentSurveyAmount,
        medicalAmount,
        legalProceedAmount,
        otherAmount,
      } = this.casePaymentIndemnityParam

      let lossPersonTotal = this.thirdPartyLoss

      const objNum = [
        personInjuryPayment || 0,
        accidentRescueAmount || 0,
        accidentSurveyAmount || 0,
        medicalAmount || 0,
        legalProceedAmount || 0,
        otherAmount || 0,
        lossPersonTotal || 0,
      ]
      console.log(objNum)
      let count = 0
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
    checkFile(row) {
      let id = row.personFileIds[0]
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let res = getFile('/files/downloadfile/' + id)
          // if (res.code != '9999') {
          //   this.$baseMessage('下载成功', 'success')
          // } else {
          //   this.$baseMessage('下载失败', 'error')
          // }
        })
        .catch((_) => {})
    },

    checkPerson(row) {
      let id = row.thirdFileIds[0]
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let res = getFile('/files/downloadfile/' + id)
          // if (res.code != '9999') {
          //   this.$baseMessage('下载成功', 'success')
          // } else {
          //   this.$baseMessage('下载失败', 'error')
          // }
        })
        .catch((_) => {})
    },
    downFile(e) {
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let res = getFile('/files/downloadfile/' + e)
          // if (res.code != '9999') {
          //   this.$baseMessage('下载成功', 'success')
          // } else {
          //   this.$baseMessage('下载失败', 'error')
          // }
        })
        .catch((_) => {})
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#ff9959;text-align:left'
      } else {
        return ''
      }
    },
  },
}
</script>

<style scoped lang="scss" scopedSlots>
#CompensationInfo {
  padding: 0 20px 20px 0;
  margin: 10px 0;
  background-color: #fff;
  .conBox {
    padding: 0 30px;
  }
  .title {
    display: inline-block;
    width: 210px;
    text-align: right;
  }
  .row {
    padding: 20px 30px;
    margin-bottom: 30px;
    border-radius: 5px;
    background-color: #e9e9e9;
  }
  .row-bg {
    margin-bottom: 20px;
  }
  .con {
    padding: 10px 15px;
    border-radius: 3px;
    cursor: pointer;
    display: inline-block;
    margin-bottom: 10px;
    background-color: #e9e9e9;
  }
}
</style>
<style>
html body #CompensationInfo .el-table .headName .cell {
  font-weight: bold;
  color: #fff;
}
</style>
