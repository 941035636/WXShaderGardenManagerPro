<template>
  <div id="WarrantyParam">
    <el-form
      ref="ruleForm"
      label-position="right"
      label-width="120px"
      :inline="true"
      :model="FormData"
      :rules="rules"
    >
      <div class="policy">
        <div class="mainCon">
          <el-form-item label="投保单号" prop="applicationFormCode">
            <el-input
              v-model.trim="FormData.applicationFormCode"
              size="mini"
              placeholder="请输入投保单号"
              class="w300"
              clearable
            />
          </el-form-item>
          <br />
          <el-form-item label="保单号" prop="policyNo">
            <el-input
              v-model.trim="FormData.policyNo"
              size="mini"
              placeholder="请输入保单号"
              class="w300"
              clearable
            />
          </el-form-item>
          <br />
          <el-form-item label="保单起始日期" prop="startTime">
            <el-date-picker
              v-model="FormData.startTime"
              type="date"
              class="w140"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="开始时间"
              :picker-options="timeStart"
              @change="changeStart"
            ></el-date-picker>
          </el-form-item>
          <span class="middlepart">
            <span class="color-gray-6 mr10">00时起</span>
            至
          </span>

          <el-form-item class="ml10" prop="endTime">
            <el-date-picker
              v-model="FormData.endTime"
              :picker-options="timeEnd"
              class="w140"
              type="date"
              value-format="yyyy-MM-dd 23:59:59"
              placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>
          <span class="color-gray-6">24时止</span>
          <br />
          <el-form-item label="实收保费" prop="actualPrem">
            <Money-input
              v-model.trim="FormData.actualPrem"
              template="append"
              class="w300"
              placeholder="请输入实收保费"
            ></Money-input>
          </el-form-item>
          <br />
          <el-form-item label="累计责任限额" prop="limitValue">
            <Money-input
              v-model.trim="FormData.limitValue"
              template="append"
              class="w300"
              :billion="true"
              placeholder="请输入累计限额"
            ></Money-input>
          </el-form-item>
          <br />
          <el-form-item prop="photoCopy" label="保单影印件">
            <el-upload
              class="upload-demo"
              action="#"
              accept=".jpg, .png, PNG,.pdf"
              multiple
              :file-list="fileListWall"
              :on-exceed="exceed"
              :before-remove="beforeRemove"
              :on-remove="
                (file, fileList) => {
                  handleRemove(file, fileList)
                }
              "
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :http-request="changeimg"
              :limit="5"
            >
              <el-button size="mini">
                <i class="el-icon-upload2"></i>
                上传文件
              </el-button>
              <span class="tailTip ml10" @click.stop>
                支持拓展名 .pdf .png .jpg
              </span>
            </el-upload>
          </el-form-item>
          <br />
          <el-form-item label="签单日期" prop="signTime">
            <el-date-picker
              v-model="FormData.signTime"
              type="date"
              :picker-options="timeRange"
              class="w300"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="签单日期"
            ></el-date-picker>
          </el-form-item>
          <br />
          <el-form-item label="扩展信息">
            <el-switch @change="changeOther" v-model="hasOther"></el-switch>
            <span class="fb ml10">（可选）</span>
          </el-form-item>
          <div v-if="hasOther" class="otherInfo">
            <ul>
              <li>
                <p>选择内容</p>
                <p>值</p>
              </li>
              <li>
                <p>
                  基础保费
                  <el-tooltip
                    content="基础保费（单位：元，保留小数点后两位）"
                    placement="top"
                    effect="light"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </p>
                <p>
                  <el-form-item label-width="0" prop="prem">
                    <el-input
                      v-model="FormData.prem"
                      size="mini"
                      placeholder="请填写"
                      class="w300"
                      clearable
                    />
                  </el-form-item>
                </p>
              </li>
              <li>
                <p>
                  费率调整因子
                  <el-tooltip
                    content="例：优惠10%"
                    placement="top"
                    effect="light"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </p>
                <p>
                  <el-form-item label-width="0" prop="rateFactor">
                    <el-input
                      v-model="FormData.rateFactor"
                      size="mini"
                      placeholder="请填写"
                      class="w300"
                      clearable
                    />
                  </el-form-item>
                </p>
              </li>
              <li>
                <p>
                  投保方式
                  <el-tooltip
                    content="保费方式：（元/人，元/万吨 例：100/人，100/万吨）"
                    placement="top"
                    effect="light"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </p>
                <p>
                  <el-form-item label-width="0" prop="premTypeRemark">
                    <el-input
                      v-model="FormData.premTypeRemark"
                      size="mini"
                      placeholder="请填写"
                      class="w300"
                      clearable
                    />
                  </el-form-item>
                </p>
              </li>
              <li>
                <p>
                  投保数量
                  <el-tooltip
                    content="投保数量：（例：100人，100吨）"
                    placement="top"
                    effect="light"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </p>
                <p>
                  <el-form-item label-width="0" prop="insureNumRemark">
                    <el-input
                      v-model="FormData.insureNumRemark"
                      size="mini"
                      placeholder="请填写"
                      class="w300"
                      clearable
                    />
                  </el-form-item>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  validateNumber,
  validatePositiveNum2,
  validatePrem,
  validateMoney2,
} from '@/utils/validateFrom'
import {
  uploadFile,
  isRenewal,
  getPremType,
  getIntrilution,
} from '@/api/policyManagement'
import { getBranchList } from '@/api/userDataManagement'
export default {
  name: 'WarrantyParam',
  data() {
    return {
      hasOther: false,
      fileListWall: [],
      FormData: {
        applicationFormCode: '',
        policyNo: '',
        startTime: '',
        endTime: '',
        actualPrem: '',
        limitValue: '',
        signTime: '',
        prem: '',
        insureNumRemark: '',
        premTypeRemark: '',
        rateFactor: '',
        photoCopy: [],
      },
      photoCopyList: [],
      rules: {
        applicationFormCode: [
          {
            required: true,
            message: '请输入投保单号',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 30,
            message: '字符长度1-30位',
            trigger: 'blur',
          },
        ],

        insureNumRemark: [
          { required: false, validator: validatePositiveNum2, trigger: 'blur' },
        ],
        rateFactor: [
          {
            required: false,
            message: '请输入费率因子',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 30,
            message: '字符长度1-30位',
            trigger: 'blur',
          },
        ],
        policyNo: [
          {
            required: true,
            message: '请输入保单号',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 30,
            message: '字符长度1-30位',
            trigger: 'blur',
          },
        ],
        startTime: [
          {
            required: true,
            message: '请选择保单结束时间',
            trigger: 'blur',
          },
        ],
        photoCopy: [
          { required: true, message: '请上传保单影印件', trigger: 'blur' },
        ],
        endTime: [
          {
            required: true,
            message: '请选择保单结束时间',
            trigger: 'blur',
          },
        ],
        limitValue: [
          { required: true, validator: validatePrem, trigger: 'blur' },
        ],
        signTime: [
          { required: true, message: '请选择签单日期', trigger: 'blur' },
        ],
        actualPrem: [
          { required: true, validator: validatePrem, trigger: 'blur' },
        ],
        prem: [{ required: false, validator: validateMoney2, trigger: 'blur' }],
      },
      timeStart: {
        disabledDate: (time) => {
          if (this.FormData.endTime) {
            return time.getTime() > new Date(this.FormData.endTime).getTime()
          }
          if (this.FormData.signTime) {
            return time.getTime() < new Date(this.FormData.signTime).getTime()
          }
        },
      },
      timeEnd: {
        disabledDate: (time) => {
          if (this.FormData.startTime) {
            return time.getTime() < new Date(this.FormData.startTime).getTime()
          }
          if (this.FormData.signTime) {
            return time.getTime() < new Date(this.FormData.signTime).getTime()
          }
        },
      },
      timeRange: {
        disabledDate: (time) => {
          if (this.FormData.startTime || this.FormData.endTime) {
            return (
              time.getTime() > new Date(this.FormData.startTime).getTime() ||
              time.getTime() > new Date(this.FormData.endTime).getTime()
            )
          }
        },
      },
    }
  },
  created() {},
  methods: {
    initData() {},
    exceed() {
      this.$baseMessage('文件最多上传5个！', 'error')
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(file, fileList) {
      //删除文件
      if (file.id) {
        this.FormData.photoCopy.splice(
          this.FormData.photoCopy.findIndex((item) => item === file.id),
          1
        )
      } else {
        let delItem = this.photoCopyList.filter((item) => {
          return item.uid == file.uid
        })
        this.FormData.photoCopy.splice(
          this.FormData.photoCopy.findIndex((item) => item === delItem.id),
          1
        )
        this.photoCopyList.splice(
          this.photoCopyList.findIndex((item) => item === file.uid),
          1
        )
      }

      this.$baseMessage('删除成功', 'success')
    },
    async changeimg(file) {
      //上传文件
      let data = new FormData()
      data.append('file', file.file)
      const res = await uploadFile(data)
      if (res.code == '0000') {
        if (!this.FormData.photoCopy) {
          this.$set(this.FormData, 'photoCopy', [])
        }
        this.FormData.photoCopy.push(res.data.id)
        this.photoCopyList.push({ uid: file.file.uid, id: res.data.id })
      }
    },
    handleRemove(file, fileList) {},
    beforeAvatarUpload: function (file) {
      const isLt2M = file.size / 1024 / 1024 <= 50 //限制图片大小

      if (!isLt2M) {
        this.$baseMessage('上传头像图片大小不能超过 50MB!', 'error')
      }
      return isLt2M
    },
    handleAvatarSuccess() {
      this.$refs.ruleForm.clearValidate('photoCopy')
    },
    changeStart(e) {
      let d1 = new Date(e)
      let seperator1 = '-'
      let year = d1.getFullYear() + 1
      let month = d1.getMonth() + 1
      let strDate = d1.getDate() - 1
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }

      this.FormData.endTime =
        year + seperator1 + month + seperator1 + strDate + ' 23:59:59'
    },
    changeOther(e) {
      if (!e) {
        this.$confirm('将会清除扩展信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.FormData.prem = ''
            this.FormData.rateFactor = ''
            this.FormData.premTypeRemark = ''
            this.FormData.insureNumRemark = ''
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.hasOther = true
          })
      }
    },
    save() {
      let flag = false
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.$store.commit('policyInfo/warrantyParam', this.FormData)
          flag = true
        }
      })
      return flag
    },
  },
}
</script>

<style lang='scss' scoped>
#WarrantyParam .title {
  display: flex;
  height: 40px;
  width: 96%;
  margin: 0 auto;
  align-items: center;
  padding: 0 20px;
  font-size: 12px;
  border-bottom: 1px solid #ccc;
  span:nth-child(1) {
    display: inline-block;
    width: 5px;
    height: 16px;
    background-color: #096dd9;
  }
}
#WarrantyParam {
  background-color: #f5f6f8;
  .otherInfo {
    margin-left: 120px;
    width: 700px;
    li:first-child {
      background-color: #ccc;
      height: 40px;
      line-height: 40px;
      border: none;
    }
    li {
      list-style: none;
      display: flex;
      height: 60px;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      line-height: 60px;

      p:first-child {
        border-right: 1px solid #ccc;
        i {
          color: #48b591;
          background-color: #fff;
          font-size: 16px;
          vertical-align: middle;
        }
      }
      p {
        flex: 1;
        margin: 0;

        padding-left: 10px;
      }
    }
  }
  .mainCon {
    padding: 30px;
  }
  .company {
    background-color: #fff;
    .companyTable {
      padding-left: 120px;
    }
  }
  .policy {
    background-color: #fff;
    margin-top: 10px;
    .middlepart {
      line-height: 32px;
    }
  }
}
</style>
<style >
.otherInfo .el-form-item {
  margin: 0;
}
.otherInfo .el-input {
  margin-top: 15px;
}
</style>