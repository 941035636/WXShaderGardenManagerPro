<template>
  <div id="addPay">
    <el-dialog
      :title="flag ? '添加垫付预付快付记录' : '修改垫付预付快付记录'"
      @close="close"
      @open="initData"
      :visible.sync="dialogFormVisible"
      width="900px"
    >
      <el-form
        ref="ruleForm"
        label-position="right"
        label-width="130px"
        :inline="false"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="付款时间" prop="paymentTime">
          <el-date-picker
            :picker-options="timeRange"
            v-model="form.paymentTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            class="w300"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="付款类型" prop="paymentType">
          <el-select v-model="form.paymentType" size="small" class="w300">
            <el-option
              v-for="(item, key) in optionsData"
              :key="key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款金额" prop="paymentAmount">
          <Money-input
            v-model="form.paymentAmount"
            template="append"
            class="w300"
            placeholder="请输入金额，小数保留两位"
          ></Money-input>
        </el-form-item>

        <p class="ml30 fb">付款凭证（可选）</p>
        <el-form-item label-width="50px">
          <div style="display: flex">
            <el-upload
              class="w100 ml30 mb20"
              :action="this.baseURL + `/files/v1/upload/file`"
              :data="upLoadData2"
              :file-list="form.fileRecord"
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
            :data="form.fileRecord"
            border
            class="ml30 w700"
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
              prop="name"
              label="文件名"
            ></el-table-column>

            <el-table-column
              prop="createTime"
              label="上传时间"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" width="150" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="dowmLoad(scope.row.id)">
                  下载
                </el-button>
                <el-button type="text" @click="del(scope.row.id, scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import MoneyInput from '@/components/MoneyInput'
import { getImgFile, getFile } from '@/api/resources'
import { validateMoney2 } from '@/utils/validateFrom'
import { loginRSA, tokenName, baseURL } from '@/config'
import { uploadFile } from '@/api/policyManagement'
import store from '@/store'
export default {
  name: 'addPay',
  components: { MoneyInput },
  data() {
    return {
      dialogFormVisible: false,
      index: '',
      flag: true,
      limitTime: '',
      baseURL: baseURL,
      upLoadData2: {},
      optionsData: [
        {
          label: '预付',
          value: '1',
        },
        {
          label: '垫付',
          value: '2',
        },
        {
          label: '快付',
          value: '3',
        },
      ],
      fileList2: [], // 图片回显地址
      headers: {
        authorization: store.getters['user/accessToken'],
      },
      timeRange: {
        disabledDate: (time) => {
          if (this.limitTime) {
            return time.getTime() < new Date(this.limitTime).getTime()
          }
        },
      },
      rules: {
        paymentTime: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'blur',
          },
        ],
        paymentType: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur',
          },
        ],

        paymentAmount: [
          {
            required: true,
            validator: validateMoney2,
            trigger: 'blur',
          },
        ],
      },

      form: {
        paymentTime: '',
        paymentType: '',
        paymentAmount: 0,
        fileRecordIds: [],
        fileRecord: [],
      },
    }
  },
  methods: {
    initData() {
      console.log(this.form, '++++')
    },
    close() {
      this.form = {
        paymentTime: '',
        paymentType: '',
        paymentAmount: 0,
        fileRecordIds: [],
        fileRecord: [],
      }
      this.flag = true
      this.limitTime = ''
      this.index = ''
      console.log(this.form, 'form')
      this.$nextTick(() => {
        this.form = {} //清空过一次，但是有bug，因此再清一次
        this.$refs.ruleForm.resetFields()
      })
    },
    handleAvatarSuccess(res) {
      //上传成功调用
      console.log(res, '743284832')
      if (res.code == '0000') {
        let obj = {
          id: res.data.id,
          name: res.data.name,
          createTime: res.data.createTime,
        }
        this.form.fileRecord.push(obj)
        this.form.fileRecordIds.push(res.data.id)
      } else if (res.code == '9999') {
        this.$baseMessage(res.msg, 'error')
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
      this.form.fileRecord.splice(index, 1)
      this.form.fileRecordIds.splice(index, 1)
    },
    handleExceed() {
      this.$baseMessage('最多支持上传9个文件', 'error')
    },
    beforeAvatarUpload2(file) {
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      /* const isPNG = file.type === 'image/png'; */
      const isLt4M = file.size / 1024 / 1024 < 20
      // if (!isJPGorPNG) {
      //   this.$baseMessage('只支持DOC/DOCX/PDF/ZIP/RAR格式', 'error')
      // }

      if (!isLt4M) {
        this.$baseMessage('上传文件大小不能超过 20MB!', 'error')
      }
      // return isJPGorPNG && isLt4M
      return isLt4M
    },
    async confirm() {
      //确认后将对话框信息提交

      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$emit('payCb', this.form, this.index, this.flag)
          this.dialogFormVisible = false
        }
      })
    },
  },
}
</script>

<style lang="scss">
#addPay {
  .el-dialog_body {
    padding-left: 30px;
  }
}
</style>
<style lang="scss" scoped>
#addPay {
  .upload-demo {
    width: 300px;
  }
}
</style>
