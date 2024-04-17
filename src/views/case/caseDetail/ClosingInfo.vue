<template>
  <div id="ClosingInfo">
    <div v-if="showInfo">
      <el-form label-position="left" label-width="142px" style="padding: 0">
        <el-row class="border-bottom">
          <el-col :span="8">
            <el-form-item label="从业人员人身伤亡：">
              <div class="text cF5222D">
                ￥{{
                  casePaymentIndemnityResp.personInjuryPayment
                    ? casePaymentIndemnityResp.personInjuryPayment.toFixed(2)
                    : '0.00'
                }}
                元
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="第三者人身伤亡：">
              <div class="text">
                ￥{{
                  casePaymentIndemnityResp.thirdPersonInjuryPayment
                    ? casePaymentIndemnityResp.thirdPersonInjuryPayment.toFixed(
                        2
                      )
                    : '0.00'
                }}
                元
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="第三者财产损失：">
              <div class="text">
                ￥{{
                  casePaymentIndemnityResp.thirdPartyLoss
                    ? casePaymentIndemnityResp.thirdPartyLoss.toFixed(2)
                    : '0.00'
                }}
                元
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="border-bottom">
          <el-col :span="8">
            <el-form-item label="事故抢险救援费用：">
              <div class="text">
                ￥{{
                  casePaymentIndemnityResp.accidentRescueAmount
                    ? casePaymentIndemnityResp.accidentRescueAmount.toFixed(2)
                    : '0.00'
                }}
                元
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="医疗救护费用：">
              <div class="text">
                ￥{{
                  casePaymentIndemnityResp.medicalAmount
                    ? casePaymentIndemnityResp.medicalAmount.toFixed(2)
                    : '0.00'
                }}
                元
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事故鉴定费用：">
              <div class="text">
                ￥{{
                  casePaymentIndemnityResp.accidentSurveyAmount
                    ? casePaymentIndemnityResp.accidentSurveyAmount.toFixed(2)
                    : '0.00'
                }}
                元
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="法律诉讼费用：">
              <div class="text">
                ￥{{
                  casePaymentIndemnityResp.legalProceedAmount
                    ? casePaymentIndemnityResp.legalProceedAmount.toFixed(2)
                    : '0.00'
                }}
                元
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="其他费用：">
              <div class="text">
                ￥{{
                  casePaymentIndemnityResp.otherAmount
                    ? casePaymentIndemnityResp.otherAmount.toFixed(2)
                    : '0.00'
                }}
                元
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="付款凭证：">
              <div
                v-if="
                  casePaymentIndemnityResp.files &&
                  casePaymentIndemnityResp.files.length
                "
                class="text check cursor-pointer"
                @click="checkEnclosure(casePaymentIndemnityResp.files)"
              >
                查看附件
              </div>
              <div class="text" v-else>--</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <h3 class="c000">从业人员人身伤亡情况</h3>
        <el-table
          class="table-header-blod"
          :data="casePersonIndemnityResps"
          border
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="人员类型">
            <template slot-scope>从业</template>
          </el-table-column>
          <el-table-column label="姓名/性别">
            <template slot-scope="scope">
              {{ scope.row.personName }} （{{
                getSex(scope.row.certificateNo)
              }}）
            </template>
          </el-table-column>

          <el-table-column
            prop="certificateNo"
            label="身份证号"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="人员伤亡情况" show-overflow-tooltip>
            <template slot-scope="scoped">
              <span v-if="scoped.row.personInjuryType == '01'">轻伤</span>
              <span v-if="scoped.row.personInjuryType == '02'">重伤</span>
              <span v-if="scoped.row.personInjuryType == '03'">死亡</span>
            </template>
          </el-table-column>
          <el-table-column label="凭证/证明文件" show-overflow-tooltip>
            <template slot-scope="scoped">
              <span v-if="scoped.row.files">
                共{{ scoped.row.files.length }}个附件，
                <el-button
                  type="text"
                  @click="checkProveB(scoped.row)"
                  class="ckBtn"
                >
                  点击查看
                </el-button>
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <h3 class="c000">第三者人身伤亡情况</h3>
        <el-table
          class="table-header-blod"
          :data="caseThirdPersonIndemnityResps"
          border
          :header-cell-style="{ background: '#f5f5f5' }"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="人员类型">
            <template slot-scope>第三者</template>
          </el-table-column>
          <el-table-column label="姓名/性别">
            <template slot-scope="scope">
              {{ scope.row.personName }} （{{
                getSex(scope.row.certificateNo)
              }}）
            </template>
          </el-table-column>

          <el-table-column
            prop="certificateNo"
            label="身份证号"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="人员伤亡情况" show-overflow-tooltip>
            <template slot-scope="scoped">
              <span v-if="scoped.row.personInjuryType == '01'">轻伤</span>
              <span v-if="scoped.row.personInjuryType == '02'">重伤</span>
              <span v-if="scoped.row.personInjuryType == '03'">死亡</span>
            </template>
          </el-table-column>
          <el-table-column label="凭证/证明文件" show-overflow-tooltip>
            <template slot-scope="scoped">
              <span v-if="scoped.row.files">
                共{{ scoped.row.files.length }}个附件，
                <el-button
                  type="text"
                  @click="checkProveB(scoped.row)"
                  class="ckBtn"
                >
                  点击查看
                </el-button>
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <h3 class="c000">第三方损失信息</h3>
        <el-table
          class="table-header-blod"
          :data="caseThirdPartyIndemnityResps"
          border
          :header-cell-style="{ background: '#f5f5f5' }"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="70px"
          ></el-table-column>
          <el-table-column
            prop="thirdPartyName"
            label="第三者名称"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="thirdPartyProperty"
            label="第三者财产名称"
          ></el-table-column>
          <el-table-column label="第三者财产损失金额" show-overflow-tooltip>
            <template slot-scope="scoped">
              ￥{{
                scoped.row.thirdPartyLoss
                  ? scoped.row.thirdPartyLoss.toFixed(2)
                  : '0.00'
              }}
            </template>
          </el-table-column>

          <el-table-column prop="files" label="证明文件">
            <template slot-scope="scope">
              <div v-if="scope.row.files">
                共{{ scope.row.files.length }}个附件，
                <el-button
                  type="text"
                  class="ckBtn"
                  @click="checkProveB(scope.row)"
                >
                  点击查看
                </el-button>
              </div>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="emptyBox" v-else>暂无数据</div>
    <VoucherList ref="voucherList"></VoucherList>
  </div>
</template>

<script>
import VoucherList from './VoucherList.vue'
import { getFile } from '@/api/resources'
export default {
  name: 'ClosingInfo',
  components: { VoucherList },
  data() {
    return {
      showInfo: true,
      casePaymentIndemnityResp: {},
      caseThirdPersonIndemnityResps: [],
      casePersonIndemnityResps: [],
      caseThirdPartyIndemnityResps: [],
    }
  },
  methods: {
    // 查看附件
    checkEnclosure(data) {
      this.$refs.voucherList.tableData = data
      this.$refs.voucherList.dialogVisible = true
    },
    async checkProveB(row) {
      console.log(row)
      let data = row.files.map((item) => {
        return {
          name: item.fileName,
          id: item.fileId,
        }
      })

      this.$refs.voucherList.tableData = data
      this.$refs.voucherList.dialogVisible = true
    },
    checkProveC() {},
    getSex(val) {
      let num = val.charAt(16)

      if (num % 2 == 0) {
        return '女'
      } else {
        return '男'
      }
    },
  },
}
</script>

<style lang="scss">
#ClosingInfo {
  .emptyBox {
    height: 150px;
    line-height: 150px;
    text-align: center;
    font: 14px;
    color: #000;
    font-weight: bold;
  }
  h3 {
    font-size: 16px;
  }
}
</style>
