<template>
  <div id="dealCase">
    <div class="header">
      <el-steps process-status="finish" :active="1" simple>
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
    <el-form
      ref="ruleForm"
      label-position="right"
      label-width="150px"
      :inline="false"
      :model="ruleForm"
      :rules="rules"
    >
      <div class="conBox">
        <div class="title">
          <span></span>
          <span class="color-blue f16 ml10 mr20">赔付信息</span>
        </div>
        <div class="mainCon">
          <el-form-item label="决案时间" prop="decisionTime">
            <el-date-picker
              :picker-options="endTime"
              v-model="ruleForm.decisionTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              class="wd250"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="赔付金额">
            <div class="table">
              <div class="row">
                <div class="col1">选择</div>
                <div class="col2">保障内容</div>
                <div class="col3">金额</div>
              </div>
              <div class="row">
                <div class="col1">
                  <el-switch @change="changeCY" v-model="hasCY"></el-switch>
                </div>
                <div class="col2">
                  从业人员人身伤亡
                  <span>
                    <i class="el-icon-warning"></i>
                    请补充清单资料
                  </span>
                </div>
                <div class="col3">
                  <el-form-item label-width="0" prop="personInjuryPayment">
                    <Money-input
                      :disabled="!hasCY"
                      v-model="ruleForm.personInjuryPayment"
                      template="append"
                      class="w250 mt10"
                      placeholder="请输入金额，小数保留两位"
                    ></Money-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col1">
                  <el-switch @change="changeDSR" v-model="hasDSR"></el-switch>
                </div>
                <div class="col2">第三者人身伤亡</div>
                <div class="col3">
                  <el-form-item label-width="0" prop="thirdPersonInjuryPayment">
                    <Money-input
                      :disabled="!hasDSR"
                      v-model="ruleForm.thirdPersonInjuryPayment"
                      template="append"
                      class="w250 mt10"
                      placeholder="请输入金额，小数保留两位"
                    ></Money-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col1">
                  <el-switch @change="changeDSC" v-model="hasDSC"></el-switch>
                </div>
                <div class="col2">第三者财产损失</div>
                <div class="col3">
                  <el-form-item label-width="0" prop="thirdPartyLoss">
                    <Money-input
                      :disabled="!hasDSC"
                      v-model="ruleForm.thirdPartyLoss"
                      template="append"
                      class="w250 mt10"
                      placeholder="请输入金额，小数保留两位"
                    ></Money-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col1">
                  <el-switch @change="changeSGQX" v-model="hasSGQX"></el-switch>
                </div>
                <div class="col2">事故抢险救援费用</div>
                <div class="col3">
                  <el-form-item label-width="0" prop="accidentRescueAmount">
                    <Money-input
                      :disabled="!hasSGQX"
                      v-model="ruleForm.accidentRescueAmount"
                      template="append"
                      class="w250 mt10"
                      placeholder="请输入金额，小数保留两位"
                    ></Money-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col1">
                  <el-switch @change="changeYL" v-model="hasYL"></el-switch>
                </div>
                <div class="col2">医疗救护费用</div>
                <div class="col3">
                  <el-form-item label-width="0" prop="medicalAmount">
                    <Money-input
                      :disabled="!hasYL"
                      v-model="ruleForm.medicalAmount"
                      template="append"
                      class="w250 mt10"
                      placeholder="请输入金额，小数保留两位"
                    ></Money-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col1">
                  <el-switch @change="changeSG" v-model="hasSG"></el-switch>
                </div>
                <div class="col2">事故鉴定费用</div>
                <div class="col3">
                  <el-form-item label-width="0" prop="accidentSurveyAmount">
                    <Money-input
                      :disabled="!hasSG"
                      v-model="ruleForm.accidentSurveyAmount"
                      template="append"
                      class="w250 mt10"
                      placeholder="请输入金额，小数保留两位"
                    ></Money-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col1">
                  <el-switch @change="changeLaw" v-model="hasLaw"></el-switch>
                </div>
                <div class="col2">法律诉讼费用</div>
                <div class="col3">
                  <el-form-item label-width="0" prop="legalProceedAmount">
                    <Money-input
                      :disabled="!hasLaw"
                      v-model="ruleForm.legalProceedAmount"
                      template="append"
                      class="w250 mt10"
                      placeholder="请输入金额，小数保留两位"
                    ></Money-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col1">
                  <el-switch
                    @change="changeOther"
                    v-model="hasOther"
                  ></el-switch>
                </div>
                <div class="col2">其他费用</div>
                <div class="col3">
                  <el-form-item label-width="0" prop="otherAmount">
                    <Money-input
                      :disabled="!hasOther"
                      v-model="ruleForm.otherAmount"
                      template="append"
                      class="w250 mt10"
                      placeholder="请输入金额，小数保留两位"
                    ></Money-input>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form-item>
          <div class="tableLine">
            结案总金额：
            <span class="color-red f16">￥{{ totalAmount }}元</span>
          </div>
          <el-form-item prop="files" label="付款凭证">
            <div style="display: flex">
              <el-upload
                class="upload-demo mb20"
                :action="this.baseURL + `/files/v1/upload/file`"
                :data="upLoadData2"
                :file-list="fileList2"
                :headers="headers"
                :on-success="handleAvatarSuccess"
                name="file"
                accept=".pdf,.zip,.rar,.png,.jpg"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload2"
                multiple
                :limit="9"
                :on-exceed="handleExceed"
              >
                <el-button size="mini" class="w100" type="primary">
                  选择附件
                </el-button>
              </el-upload>
              <span class="ml20 color-blue">
                只支持PDF/ZIP/RAR/PNG/JPG，大小不超过20M（最多可上传9件）
              </span>
            </div>
            <el-table
              :data="fileRecord"
              border
              style="width: 80%"
              header-row-class-name="headName"
              :header-cell-style="getRowClass"
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="fileName"
                label="文件名"
              ></el-table-column>

              <el-table-column
                prop="uploadTime"
                label="上传时间"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column align="center" width="150" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="dowmLoad(scope.row.fileId)">
                    下载
                  </el-button>
                  <el-button
                    type="text"
                    @click="del(scope.row.fileId, scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </div>
      </div>
      <div class="conBox" v-if="hasCY">
        <div class="title">
          <span></span>
          <span class="color-blue f16 ml10 mr20">从业人员人身伤亡情况</span>
          <el-button
            @click="addCY(true)"
            size="mini"
            class="ml10 w100"
            type="primary"
          >
            添加记录
          </el-button>
        </div>
        <div class="mainCon">
          <el-table
            :data="cyList"
            border
            class="ml50 mt10"
            style="width: 90%"
            header-row-class-name="headName"
            :header-cell-style="getRowClass"
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
                <span
                  v-if="scoped.row.fileRecord && scoped.row.fileRecord.length"
                >
                  共{{ scoped.row.fileRecord.length }}个附件，
                  <el-button
                    type="text"
                    class="ckBtn"
                    @click="checkProveB(scoped.row)"
                  >
                    点击查看
                  </el-button>
                </span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align="center" width="150" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="editCY(scope.row, scope.$index, true)"
                >
                  修改
                </el-button>
                <el-button type="text" @click="deletCY(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="conBox" v-if="hasDSR">
        <div class="title">
          <span></span>
          <span class="color-blue f16 ml10 mr20">第三者人身伤亡情况</span>
          <el-button
            @click="addCY(false)"
            size="mini"
            class="ml10 w100"
            type="primary"
          >
            添加记录
          </el-button>
        </div>
        <div class="mainCon">
          <el-table
            :data="thirdList"
            border
            class="ml50 mt10"
            style="width: 90%"
            header-row-class-name="headName"
            :header-cell-style="getRowClass"
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
                <span
                  v-if="scoped.row.fileRecord && scoped.row.fileRecord.length"
                >
                  共{{ scoped.row.fileRecord.length }}个附件，
                  <el-button
                    type="text"
                    class="ckBtn"
                    @click="checkProveB(scoped.row)"
                  >
                    点击查看
                  </el-button>
                </span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align="center" width="150" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="editCY(scope.row, scope.$index, false)"
                >
                  修改
                </el-button>
                <el-button type="text" @click="deletThird(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="conBox" v-if="hasDSC">
        <div class="title">
          <span></span>
          <span class="color-blue f16 ml10 mr20">第三方损失信息</span>
          <el-button
            @click="openLoss"
            class="w100 ml10"
            size="mini"
            type="primary"
          >
            添加记录
          </el-button>
        </div>
        <div class="mainCon">
          <el-table
            :data="caseThirdPartyIndemnityParams"
            border
            class="ml50 mt10"
            style="width: 90%"
            header-row-class-name="headName"
            :header-cell-style="getRowClass"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
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
                ￥{{ scoped.row.thirdPartyLoss.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="凭证/证明文件" show-overflow-tooltip>
              <template slot-scope="scoped">
                <span
                  v-if="scoped.row.fileRecord && scoped.row.fileRecord.length"
                >
                  共{{ scoped.row.fileRecord.length }}个附件，
                  <el-button
                    type="text"
                    class="ckBtn"
                    @click="checkProveB(scoped.row)"
                  >
                    点击查看
                  </el-button>
                </span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align="center" width="150" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="editLoss(scope.row, scope.$index)"
                >
                  修改
                </el-button>
                <el-button type="text" @click="deletLoss(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-form>
    <third-party @successCb="successCb(arguments)" ref="thirdParty" />
    <third-person @lossCb="lossCb(arguments)" ref="thirdPerson" />
    <div class="bottom" style="text-align: center; margin-bottom: 20px">
      <el-button class="mr20 w120" @click="back">上一步</el-button>
      <el-button type="primary" class="mr20 w120" @click="submit">
        确认提交结案
      </el-button>
    </div>
    <voucher-list ref="voucherList" />
  </div>
</template>

<script>
import { baseURL } from '@/config'
import store from '@/store'
import { mapGetters } from 'vuex'
import { caseDeal, getCaseDetails } from '@/api/caseManagement'
import { getImgFile, getFile } from '@/api/resources'
import MoneyInput from '@/components/MoneyInput'
import { validateMoney2 } from '@/utils/validateFrom'
import ThirdParty from '../add/components/ThirdParty.vue'
import ThirdPerson from '../add/components/ThirdPerson.vue'
import voucherList from '../caseDetail/VoucherList.vue'
export default {
  name: 'dealCase',
  components: { MoneyInput, ThirdParty, ThirdPerson, voucherList },
  data() {
    return {
      baseURL: baseURL,
      headers: {
        authorization: store.getters['user/accessToken'],
      },
      upLoadData2: {},
      fileList2: [], // 图片回显地址
      hasCY: false,
      hasDSR: false,
      hasDSC: false,
      hasSGQX: false,
      hasYL: false,
      hasSG: false,
      hasLaw: false,
      hasOther: false,
      fileRecord: [],
      cyList: [],
      thirdList: [],
      caseThirdPartyIndemnityParams: [],
      ruleForm: {
        decisionTime: '',
        personInjuryPayment: 0,
        thirdPersonInjuryPayment: 0,
        thirdPartyLoss: 0,
        accidentRescueAmount: 0,
        medicalAmount: 0,
        accidentSurveyAmount: 0,
        legalProceedAmount: 0,
        otherAmount: 0,
        files: [],
      },
      rules: {
        decisionTime: [
          {
            required: true,
            message: '请选择决案时间',
            trigger: 'blur',
          },
        ],
        personInjuryPayment: [
          {
            required: true,
            validator: validateMoney2,
            trigger: 'blur',
          },
        ],
        thirdPersonInjuryPayment: [
          {
            required: true,
            validator: validateMoney2,
            trigger: 'blur',
          },
        ],
        thirdPartyLoss: [
          {
            required: true,
            validator: validateMoney2,
            trigger: 'blur',
          },
        ],
        accidentRescueAmount: [
          {
            required: true,
            validator: validateMoney2,
            trigger: 'blur',
          },
        ],
        medicalAmount: [
          {
            required: true,
            validator: validateMoney2,
            trigger: 'blur',
          },
        ],
        accidentSurveyAmount: [
          {
            required: true,
            validator: validateMoney2,
            trigger: 'blur',
          },
        ],
        legalProceedAmount: [
          {
            required: true,
            validator: validateMoney2,
            trigger: 'blur',
          },
        ],
        otherAmount: [
          {
            required: true,
            validator: validateMoney2,
            trigger: 'blur',
          },
        ],
      },
      endTime: {
        disabledDate: (time) => {
          if (this.caseTime) {
            return (
              time.getTime() < new Date(this.caseTime).getTime() // 加- 8.64e7则表示包当天
            )
          }
        },
      },
    }
  },
  computed: {
    totalAmount() {
      let {
        personInjuryPayment,
        thirdPersonInjuryPayment,
        thirdPartyLoss,
        accidentRescueAmount,
        accidentSurveyAmount,
        medicalAmount,
        legalProceedAmount,
        otherAmount,
      } = this.ruleForm
      const objNum = [
        personInjuryPayment || 0,
        thirdPersonInjuryPayment || 0,
        thirdPartyLoss || 0,
        accidentRescueAmount || 0,
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
    ...mapGetters({
      caseTime: 'formDatas/caseTime',
    }),
  },
  created() {
    this.getInit()
  },
  activated() {
    this.getInit()
  },
  methods: {
    async getInit() {
      let res = await getCaseDetails(this.$route.query.id)
      if (res.code == '0000') {
        if (res.data.caseInfoEntityResp.decisionTime) {
          // 决案时间
          this.ruleForm.decisionTime = res.data.caseInfoEntityResp.decisionTime
        }
        if (res.data.casePaymentIndemnityResp) {
          if (res.data.casePaymentIndemnityResp.personInjuryPayment) {
            //  从业人员人身伤亡
            this.hasCY = true
            this.ruleForm.personInjuryPayment =
              res.data.casePaymentIndemnityResp.personInjuryPayment
          }
          if (res.data.casePaymentIndemnityResp.thirdPersonInjuryPayment) {
            // 第三者人身伤亡
            this.hasDSR = true
            this.ruleForm.thirdPersonInjuryPayment =
              res.data.casePaymentIndemnityResp.thirdPersonInjuryPayment
          }
          if (res.data.casePaymentIndemnityResp.thirdPartyLoss) {
            // 第三者财产损失
            this.hasDSC = true
            this.ruleForm.thirdPartyLoss =
              res.data.casePaymentIndemnityResp.thirdPartyLoss
          }
          if (res.data.casePaymentIndemnityResp.accidentRescueAmount) {
            // 事故抢险救援费用
            this.hasSGQX = true
            this.ruleForm.accidentRescueAmount =
              res.data.casePaymentIndemnityResp.accidentRescueAmount
          }
          if (res.data.casePaymentIndemnityResp.medicalAmount) {
            // 医疗救护费用
            this.hasYL = true
            this.ruleForm.medicalAmount =
              res.data.casePaymentIndemnityResp.medicalAmount
          }
          if (res.data.casePaymentIndemnityResp.accidentSurveyAmount) {
            // 事故鉴定费用
            this.hasSG = true
            this.ruleForm.accidentSurveyAmount =
              res.data.casePaymentIndemnityResp.accidentSurveyAmount
          }
          if (res.data.casePaymentIndemnityResp.legalProceedAmount) {
            // 法律诉讼费用
            this.hasLaw = true
            this.ruleForm.legalProceedAmount =
              res.data.casePaymentIndemnityResp.legalProceedAmount
          }
          if (res.data.casePaymentIndemnityResp.otherAmount) {
            // 其他费用
            this.hasOther = true
            this.ruleForm.otherAmount =
              res.data.casePaymentIndemnityResp.otherAmount
          }
        }
        if (res.data.casePersonIndemnityResps) {
          // 从业人员人身伤亡情况
          this.cyList = res.data.casePersonIndemnityResps
        }
        if (res.data.caseThirdPersonIndemnityResps) {
          // 第三者人身伤亡情况
          this.thirdList = res.data.caseThirdPersonIndemnityResps
        }
        if (res.data.caseThirdPartyIndemnityResps) {
          // 第三方损失信息
          this.caseThirdPartyIndemnityResps =
            res.data.caseThirdPartyIndemnityResps
        }
      }
    },
    async checkProveB(row) {
      console.log(row)
      let data = row.fileRecord.map((item) => {
        return {
          name: item.fileName,
          id: item.fileId,
        }
      })

      this.$refs.voucherList.tableData = data
      this.$refs.voucherList.dialogVisible = true
    },
    async back() {
      this.$router.go(-1)
      await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
    },
    async submit() {
      if (this.hasCY && !this.cyList.length) {
        this.$baseMessage('请填写从业人员人身伤亡情况', 'error')
        return
      }
      if (this.hasDSR && !this.thirdList.length) {
        this.$baseMessage('请填写第三者人员人身伤亡情况', 'error')
        return
      }
      if (this.hasDSC && !this.caseThirdPartyIndemnityParams.length) {
        this.$baseMessage('请填写第三方损失情况', 'error')
        return
      }
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          let data = {
            caseThirdPartyIndemnityParams: this.caseThirdPartyIndemnityParams,
            casePersonIndemnityParams: [...this.cyList, ...this.thirdList],
            casePaymentIndemnityParam: this.ruleForm,
            id: this.$route.query.id,
            reportNo: this.$route.query.reportNo,
          }
          let res = await caseDeal(data)
          if (res.code === '0000') {
            await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
            await this.$store.dispatch('tabsBar/delVisitedRoute', {
              path: '/case/caseAdd',
            })
            this.$baseMessage('结案成功', 'success')
            this.$router.push({
              path: 'finishCase',
            })
          }
        } else {
          this.focusError()
        }
      })
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
    getSex(val) {
      let num = val.charAt(16)

      if (num % 2 == 0) {
        return '女'
      } else {
        return '男'
      }
    },

    addCY(key) {
      this.$refs.thirdParty.dialogFormVisible = true
      this.$refs.thirdParty.isThird = key
      if (key) {
        this.$refs.thirdParty.title = '添加从业人员'
        this.$refs.thirdParty.form.personType = '01'
      } else {
        this.$refs.thirdParty.title = '添加第三者人员'
        this.$refs.thirdParty.form.personType = '02'
      }
    },
    deletCY(index) {
      this.cyList.splice(index, 1)
    },
    deletThird(index) {
      this.thirdList.splice(index, 1)
    },
    editCY(row, index, key) {
      this.$refs.thirdParty.dialogFormVisible = true
      this.$refs.thirdParty.index = index
      this.$refs.thirdParty.flag = false
      this.$refs.thirdParty.form = row
      this.$refs.thirdParty.isThird = key
      if (key) {
        this.$refs.thirdParty.title = '修改从业人员'
        this.$refs.thirdParty.form.personType = '01'
      } else {
        this.$refs.thirdParty.title = '修改第三者人员'
        this.$refs.thirdParty.form.personType = '02'
      }
    },
    editLoss(row, index) {
      this.$refs.thirdPerson.dialogFormVisible = true
      this.$refs.thirdPerson.index = index
      this.$refs.thirdPerson.flag = false
      this.$refs.thirdPerson.form = row
    },
    openLoss() {
      this.$refs.thirdPerson.dialogFormVisible = true
    },
    lossCb(data) {
      if (data[2]) {
        this.caseThirdPartyIndemnityParams.push(data[0])
      } else {
        this.caseThirdPartyIndemnityParams[data[1]] = data[0]
      }
    },
    successCb(data) {
      if (data[3]) {
        if (data[2]) {
          this.cyList.push(data[0])
        } else {
          this.cyList[data[1]] = data[0]
        }
      } else {
        if (data[2]) {
          this.thirdList.push(data[0])
        } else {
          this.thirdList[data[1]] = data[0]
        }
      }
    },
    changeCY(e) {
      if (e) {
      } else {
        this.$confirm('将会清除信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.$set(this.ruleForm, 'personInjuryPayment', 0)
            this.cyList = []
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.hasCY = true
          })
      }
    },
    changeDSR(e) {
      if (e) {
      } else {
        this.$confirm('将会清除信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.$set(this.ruleForm, 'thirdPersonInjuryPayment', 0)
            this.thirdList = []
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.hasDSR = true
          })
      }
    },
    changeDSC(e) {
      if (e) {
      } else {
        this.$confirm('将会清除信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.$set(this.ruleForm, 'thirdPartyLoss', 0)
            this.caseThirdPartyIndemnityParams = []
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.hasDSC = true
          })
      }
    },
    changeSGQX(e) {
      if (e) {
      } else {
        this.$confirm('将会清除信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.$set(this.ruleForm, 'accidentRescueAmount', 0)
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.hasSGQX = true
          })
      }
    },
    changeYL(e) {
      if (e) {
      } else {
        this.$confirm('将会清除信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.$set(this.ruleForm, 'medicalAmount', 0)
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.hasYL = true
          })
      }
    },
    changeSG(e) {
      if (e) {
      } else {
        this.$confirm('将会清除信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.$set(this.ruleForm, 'accidentSurveyAmount', 0)
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.hasSG = true
          })
      }
    },
    changeLaw(e) {
      if (e) {
      } else {
        this.$confirm('将会清除信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.$set(this.ruleForm, 'legalProceedAmount', 0)
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.hasLaw = true
          })
      }
    },
    changeOther(e) {
      if (e) {
      } else {
        this.$confirm('将会清除信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.$set(this.ruleForm, 'otherAmount', 0)
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.hasOther = true
          })
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;color:#0050b3'
      } else {
        return ''
      }
    },
    dowmLoad(id) {
      let res = getFile('/files/downloadfile/' + id)
    },
    del(id, index) {
      this.ruleForm.files.splice(index, 1)
      this.fileRecord.splice(index, 1)
    },
    handleAvatarSuccess(res) {
      //上传成功调用

      if (res.code == '0000') {
        let obj = {
          fileId: res.data.id,
          fileName: res.data.name,
          uploadTime: res.data.createTime,
        }
        this.fileRecord.push(obj)
        this.ruleForm.files.push(res.data.id)
      } else if (res.code == '9999') {
        this.$baseMessage(res.msg, 'error')
      }
    },
    handleExceed() {
      this.$baseMessage('最多支持上传9个文件', 'error')
    },
    beforeAvatarUpload2(file) {
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'

      const isLt4M = file.size / 1024 / 1024 < 20

      if (!isLt4M) {
        this.$baseMessage('上传文件大小不能超过 20MB!', 'error')
      }
      // return isJPGorPNG && isLt4M
      return isLt4M
    },
  },
}
</script>

<style lang='scss' scoped>
#dealCase .header {
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  background-color: #fff !important;
  height: 130px;

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
.conBox {
  border-radius: 6px;
  margin-top: 10px;
  overflow: hidden;

  background-color: #fff;
  .mainCon {
    padding: 20px 30px;
  }
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
#dealCase {
  .ckBtn {
    color: #096dd9;
    text-decoration: underline;
  }
  .tableLine {
    width: 810px;
    border-top: 1px dashed #e9e9e9;
    margin-left: 150px;
    height: 40px;
    line-height: 40px;
    margin-top: 10px;
  }
  .table {
    width: 810px;
    box-sizing: border-box;
    border: 1px solid #e9e9e9;
    .row:first-child {
      height: 40px;
      background: #f7f7f7;
      font-weight: 600;
    }
    .row:last-child {
      border: none;
    }
    .row {
      display: flex;
      overflow: hidden;
      height: 60px;
      box-sizing: border-box;
      border-bottom: 1px solid #e9e9e9;
      align-items: center;

      .col1 {
        height: 100%;
        width: 120px;
        display: flex;
        border-right: 1px solid #e9e9e9;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
      }
      .col2 {
        height: 100%;
        width: 350px;
        display: flex;
        border-right: 1px solid #e9e9e9;
        box-sizing: border-box;
        align-items: center;
        padding-left: 20px;
        span {
          color: #34c697;

          font: 12px;
          i {
            font-size: 16px;
            vertical-align: text-bottom;
            margin-right: 5px;
            margin-left: 20px;
          }
        }
      }
      .col3 {
        height: 100%;
        padding-left: 20px;
        display: flex;

        box-sizing: border-box;
        overflow: hidden;

        align-items: center;
        width: 340px;
      }
    }
  }
}
</style>
<style lang='scss'>
#dealCase .table {
  .el-form-item--small.el-form-item {
    margin-bottom: 10px;
  }
}
#dealCase .el-step__icon {
  width: 26px;
  height: 26px;
  font-size: 16px;
}
</style>