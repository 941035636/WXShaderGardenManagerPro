<template>
  <div id="CompensationAdd">
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
        <el-row class="mb20">
          <el-col :span="9">
            <span class="title_item">人员伤亡情况：</span>
            <span class="mr10">有无人员伤亡</span>
            <span>
              <el-switch
                v-model="injuryPerson"
                @change="changeInjury"
              ></el-switch>
            </span>
          </el-col>
        </el-row>
        <el-row v-if="injuryPerson">
          <el-col :span="9">
            <el-form-item label="人身伤亡赔付金额：" prop="personInjuryPayment">
              <Money-input
                v-model="form.personInjuryPayment"
                template="append"
                class="w300"
                placeholder="请输入金额，小数保留两位"
              ></Money-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="injuryPerson">
          <el-col :span="9">
            <div style="display: flex">
              <el-button type="primary" class="mb10" @click="addMember">
                添加人员
              </el-button>
            </div>
          </el-col>
        </el-row>
        <ThirdPerson ref="ThirdPerson" />
        <el-row v-if="injuryPerson">
          <el-col class="tb" :span="24">
            <el-form-item style="width: 100%" prop="casePersonIndemnitys">
              <el-table
                style="width: 100%"
                :data="form.casePersonIndemnitys"
                border
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
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="personInjuryType"
                  label="人员伤亡情况"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="人员伤亡证明文件" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button type="text" @click="updatePerson(scope.row)">
                      文件证明
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      class="mr5 deleteBtn"
                      @click="deletePerson(scope.$index)"
                    >
                      删除
                    </el-button>
                    <el-button
                      type="text"
                      class="ml5 updateBtn"
                      @click="editPerson(scope.$index, scope.row)"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mb20">
          <el-col :span="9">
            <span class="title_item">第三者财产损失情况：</span>
            <span class="mr10">有无财产损失</span>
            <span>
              <el-switch v-model="partyLoss" @change="changeLoss"></el-switch>
            </span>
          </el-col>
        </el-row>
        <el-row v-if="partyLoss">
          <el-col :span="9">
            <div style="display: flex">
              <el-button class="mb10" type="primary" @click="addPerson">
                添加第三者
              </el-button>
            </div>
          </el-col>
        </el-row>
        <ThirdParty ref="ThirdParty" />
        <el-row v-if="partyLoss">
          <el-col class="tb" :span="24">
            <el-form-item style="width: 100%" prop="caseThirdPartyIndemnitys">
              <el-table
                :summary-method="getSummaries"
                :header-cell-style="getRowClass"
                show-summary
                style="width: 100%"
                :cell-style="{ 'text-align': 'left' }"
                :data="form.caseThirdPartyIndemnitys"
                border
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
                  prop="thirdFileIds"
                >
                  <template slot-scope="scope">
                    <el-button type="text" @click="updateParty(scope.row)">
                      文件证明
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      class="ml30 deleteBtn"
                      @click="deleteParty(scope.$index)"
                    >
                      删除
                    </el-button>
                    <el-button
                      type="text"
                      class="ml10 updateBtn"
                      @click="editParty(scope.$index, scope.row)"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item
              label="事故抢险救援费用赔付金额："
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
            <el-form-item label="医疗救护费用赔付金额：" prop="medicalAmount">
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
            <el-form-item
              label="事故鉴定费用赔付金额："
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
            <el-form-item
              label="法律诉讼费用赔付金额："
              prop="legalProceedAmount"
            >
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
            <el-form-item label="其他费用赔付金额：" prop="otherAmount">
              <Money-input
                v-model="form.otherAmount"
                template="append"
                class="w250"
                placeholder="请输入金额，小数保留两位"
              ></Money-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="赔付时间：" prop="paymentTime">
              <el-date-picker
                v-model="form.paymentTime"
                value-format="yyyy-MM-dd 00:00:00"
                class="wd250"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="mb20">
          <el-col :span="9">
            <span class="title_item">赔付总金额：</span>
            <span class="color-red">￥{{ payTotal }}元</span>
          </el-col>
          <el-col v-if="form.policyInsuredInfos" :span="9">
            <span class="title_item">共保体赔付金额：</span>
            <span class="color-red">￥{{ payTotal }}元</span>
          </el-col>
        </el-row>
        <el-row v-if="form.policyInsuredInfos" class="mb20">
          <el-col :span="24">
            <el-table
              style="width: 100%"
              class="sum"
              :header-cell-style="getRowClass"
              :cell-style="{ 'text-align': 'left' }"
              :data="form.policyInsuredInfos"
              border
            >
              <el-table-column
                prop="issuingCompanyName"
                label="保险机构"
              ></el-table-column>
              <el-table-column prop="premiumRate" label="赔付比例">
                <template slot-scope="scope">
                  {{ scope.row.premiumRate * 100 }}
                </template>
              </el-table-column>
              <el-table-column prop="underwriteType" label="保险机构类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.underwriteType == '01'">主承</span>
                  <span v-if="scope.row.underwriteType == '02'">跟单</span>
                  <span v-if="scope.row.underwriteType == '03'">独立承保</span>
                </template>
              </el-table-column>
              <el-table-column min- label="赔付金额">
                <template slot-scope="scope">
                  {{ (scope.row.premiumRate * payTotal).toFixed(2) }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="付款凭证：" prop="proofFiles">
              <el-upload
                :http-request="changeFile"
                class="upload-demo"
                :on-success="handleAvatarSuccess"
                action="#"
                :file-list="fileWall"
                :before-remove="beforeRemove"
                :on-remove="
                  (file, fileList) => {
                    handleRemove(file, fileList)
                  }
                "
                accept=".jpg, .png, PNG,.word,.docx,.doc,.pdf,.xlsx,.xls"
                multiple
                :before-upload="beforeAvatarUpload"
                :on-exceed="exceed"
                :limit="10"
              >
                <el-button size="small" type="primary">上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import Title from '@/components/NewTitle'
import { validateMoney } from '@/utils/validateFrom'
import MoneyInput from '@/components/MoneyInput'
import ThirdPerson from './ThirdPerson'
import ThirdParty from './ThirdParty'
import { getFile } from '@/api/resources.js'
import { downloadFile, uploadFile } from '@/api/policyManagement'

export default {
  name: 'CompensationAdd',
  components: {
    ThirdPerson,
    ThirdParty,
    Title,
    MoneyInput,
  },

  props: {},
  data() {
    return {
      title: '赔付信息',
      rules: {
        personInjuryPayment: [
          {
            required: true,
            validator: validateMoney,
            trigger: 'blur',
          },
        ],
        casePersonIndemnitys: [
          {
            required: true,
            message: '请填写人员信息表',
            trigger: 'blur',
          },
        ],
        caseThirdPartyIndemnitys: [
          {
            required: true,
            message: '请填写第三者信息表',
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
        medicalAmount: [
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
        paymentTime: [
          {
            required: true,
            message: '请输入选择赔付时间',
            trigger: 'blur',
          },
        ],

        proofFiles: [
          {
            required: true,
            message: '请上传查勘报告文件',
            trigger: 'blur',
          },
        ],
      },
      photoList: [], //暂存文件
      injuryPerson: false, //有无人员伤亡
      partyLoss: false, //有无财产损失

      form: {
        id: '', //标识id

        personInjuryPayment: 0, //人身伤亡赔付金额
        casePersonIndemnitys: [], //人员伤亡信息
        thirdPartyTotalLoss: 0, //第三者财产损失金额
        caseThirdPartyIndemnitys: [], //第三者赔付信息
        accidentRescueAmount: 0, //事故抢险救援费用赔付金额
        medicalAmount: 0, //医疗救护费用赔付金额
        accidentSurveyAmount: 0, //事故鉴定赔付金额
        legalProceedAmount: 0, //法律诉讼费用赔付金额
        policyInsuredInfos: [], //保险机构
        otherAmount: 0, //其他费用赔付金额
        paymentTime: '', //赔付时间
        // coInsurancePayDetails: 0, //共保体赔付金额
        proofFiles: [], //付款凭据
        files: [], //回显
        paymentFileName: [], //付款凭据
      },
      fileWall: [], //付款凭证
    }
  },
  computed: {
    payTotal() {
      let {
        //解构赋值获取金额
        personInjuryPayment,
        accidentRescueAmount,
        accidentSurveyAmount,
        medicalAmount,
        legalProceedAmount,
        otherAmount,
        thirdPartyTotalLoss,
      } = this.form

      const objNum = [
        personInjuryPayment || 0,
        accidentRescueAmount || 0,
        accidentSurveyAmount || 0,
        medicalAmount || 0,
        legalProceedAmount || 0,
        otherAmount || 0,
        thirdPartyTotalLoss || 0,
      ]
      console.log(objNum, 'obj')
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

  watch: {
    form() {
      if (this.form.casePersonIndemnitys) {
        this.injuryPerson = true
      }
      if (this.form.caseThirdPartyIndemnitys) {
        this.partyLoss = true
      }
    },
    deep: true,
  },
  methods: {
    getSummaries(param) {
      //表格求合计金额
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '第三者财产损失金额(单位元)'
        } else if (index == 2) {
          const values = data.map((item) => Number(item[column.property]))
          if (column.property == 'thirdPartyPropertyLoss') {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = 'N/A'
          }
        } else {
          sums[index] = ''
        }
      })
      this.$set(this.form, 'thirdPartyTotalLoss', sums[2])

      return sums
    },
    changeInjury(e) {
      //有无人员伤亡
      if (e) {
        this.injuryPerson = true
      } else {
        this.$confirm('将清除人员伤亡信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.form.personInjuryPayment = null
            this.form.casePersonIndemnitys = []
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.injuryPerson = true
          })
      }
    },
    changeLoss(e) {
      //有无财产损失
      if (e) {
        this.partyLoss = true
      } else {
        this.$confirm('将清除第三者信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.form.caseThirdPartyIndemnitys = []
            this.form.thirdPartyTotalLoss = 0
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.partyLoss = true
          })
      }
    },
    updatePerson(row) {
      //查看文件
      let id = row.personFileIds[0]
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let res = await getFile('/files/downloadfile/' + id)
          // if (res.code != '9999') {
          //   this.$baseMessage('下载成功', 'success')
          // } else {
          //   this.$baseMessage('下载失败', 'error')
          // }
        })
        .catch((_) => {})
    },
    updateParty(row) {
      //查看文件
      console.log(row.thirdFileIds, 'ooo')
      let id = row.thirdFileIds[0]
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let res = await getFile('/files/downloadfile/' + id)
          // if (res.code != '9999') {
          //   this.$baseMessage('下载成功', 'success')
          // } else {
          //   this.$baseMessage('下载失败', 'error')
          // }
        })
        .catch((_) => {})
    },
    deletePerson(index) {
      //移除第三方人员
      this.$confirm('永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
          this.form.casePersonIndemnitys.splice(index, 1)
          this.$baseMessage('删除成功', 'success')
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    editPerson(index, row) {
      //编辑第三方人员信息
      this.$refs.ThirdPerson.form = this.form.casePersonIndemnitys[index]
      this.$refs.ThirdPerson.form.index = true
      this.$refs.ThirdPerson.dialogFormVisible = true
      this.$refs.ThirdPerson.initFile()
    },
    editParty(index, row) {
      //编辑第三方财产赔付信息
      this.$refs.ThirdParty.form = this.form.caseThirdPartyIndemnitys[index]
      this.$refs.ThirdParty.form.index = true
      this.$refs.ThirdParty.dialogFormVisible = true
      this.$refs.ThirdParty.initFile()
    },
    deleteParty(index) {
      //移除第三方财产赔付
      this.$confirm('永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
          this.form.caseThirdPartyIndemnitys.splice(index, 1)
          this.$baseMessage('删除成功', 'success')
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    beforeAvatarUpload: function (file) {
      const isLt2M = file.size / 1024 / 1024 < 10 //限制图片大小

      if (!isLt2M) {
        this.$baseMessage('上传头像图片大小不能超过 10MB!', 'error')
      }
      return isLt2M
    },
    exceed() {
      callback(new Error('请勿多上传!'))
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(file, fileList) {
      //删除文件
      if (file.id) {
        this.form.proofFiles.splice(
          this.form.proofFiles.findIndex((item) => item === file.id),
          1
        )
        this.form.files.splice(
          this.form.files.findIndex((item) => item.id === file.id),
          1
        )
      } else {
        if (this.photoList.length) {
          let delItem = this.photoList.filter((item) => {
            return item.uid == file.uid
          })
          this.form.proofFiles.splice(
            this.form.proofFiles.findIndex((item) => item === delItem.id),
            1
          )
          this.form.files.splice(
            this.form.files.findIndex((item) => item.id === delItem.id),
            1
          )
        }
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:left'
      } else {
        return ''
      }
    },
    handleAvatarSuccess() {
      this.$refs.ruleForm.validateField('proofFiles')
    },
    async changeFile(file) {
      //上传文件
      let data = new FormData()
      data.append('file', file.file)
      const res = await uploadFile(data)
      if (res.code == '0000') {
        if (this.form.proofFiles == null) {
          this.$set(this.form, 'proofFiles', [])
        }
        if (this.form.files == null) {
          this.$set(this.form, 'files', [])
        }
        this.form.proofFiles.push(res.data.id)
        this.form.files.push(res.data)
        this.photoList.push({ uid: file.file.uid, id: res.data.id })

        this.$baseMessage('上传成功', 'success')
      }
    },
    savePerson() {
      if (this.$refs.ThirdPerson.form.index) {
      } else {
        if (this.form.casePersonIndemnitys == null) {
          this.form.casePersonIndemnitys = new Array()
        }
        this.form.casePersonIndemnitys.push(this.$refs.ThirdPerson.form)
      }
    }, //获取添加项到当前表格
    saveParty() {
      if (this.$refs.ThirdParty.form.index) {
      } else {
        if (this.form.caseThirdPartyIndemnitys == null) {
          this.form.caseThirdPartyIndemnitys = new Array()
        }
        this.form.caseThirdPartyIndemnitys.push(this.$refs.ThirdParty.form)
      }
    }, //获取添加项到当前表格
    addMember() {
      this.$refs.ThirdPerson.dialogFormVisible = true
    },
    addPerson() {
      this.$refs.ThirdParty.dialogFormVisible = true
    },
    save() {
      let flag = false
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('formDatas/casePaymentIndemnityParam', this.form)
          flag = true
        }
      })
      return flag
    },
  },
}
</script>
<style lang="scss" scoped>
#CompensationAdd {
  padding: 0 20px 20px 0;
  margin: 10px 0;
  background-color: #fff;

  .title_item {
    display: inline-block;
    width: 210px;
  }
}
.wd250 {
  width: 250px !important;
}
.red {
  color: #f00;
}
::v-deep .el-table__footer-wrapper tr td {
  text-align: center;
}
</style>
<style>
#CompensationAdd .tb .el-form-item__content {
  width: 100%;
}
</style>
