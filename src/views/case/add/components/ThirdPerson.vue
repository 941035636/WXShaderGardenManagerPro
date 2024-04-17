<template>
  <div id="ThirdPerson">
    <el-dialog
      :title="flag ? '添加第三方损失信息' : '修改第三方损失信息'"
      @close="close"
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
        <el-form-item label="第三者名称" prop="thirdPartyName">
          <el-input
            placeholder="请输入"
            class="w300"
            size="mini"
            v-model="form.thirdPartyName"
          ></el-input>
        </el-form-item>

        <el-form-item label="第三者财产名称" prop="thirdPartyProperty">
          <el-input
            placeholder="请输入"
            class="w300"
            size="mini"
            v-model="form.thirdPartyProperty"
          ></el-input>
        </el-form-item>
        <el-form-item label="财产损失金额" prop="thirdPartyLoss">
          <Money-input
            v-model="form.thirdPartyLoss"
            template="append"
            class="w300"
            placeholder="请输入金额，小数保留两位"
          ></Money-input>
        </el-form-item>

        <p class="ml30 fb">付款凭证（可选）</p>
        <el-form-item label-width="30px">
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
            <el-table-column prop="fileName" label="文件名">
              <template slot-scope="scope">
                <p class="fileName">
                  <span class="name mr10">
                    <TipsText :length="15" :text="scope.row.fileName" />
                  </span>

                  <el-button
                    @click="sort('1', scope.$index)"
                    v-if="scope.$index != 0"
                    type="text"
                  >
                    升序
                  </el-button>
                  <el-button
                    @click="sort('2', scope.$index)"
                    v-if="scope.$index != form.fileRecord.length - 1"
                    type="text"
                  >
                    降序
                  </el-button>
                </p>
              </template>
            </el-table-column>

            <el-table-column
              prop="uploadTime"
              label="上传时间"
              width="120"
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
  name: 'ThirdPerson',
  components: { MoneyInput },
  data() {
    return {
      dialogFormVisible: false,
      index: '',
      flag: true,
      baseURL: baseURL,
      upLoadData2: {},

      fileList2: [], // 图片回显地址
      headers: {
        authorization: store.getters['user/accessToken'],
      },
      rules: {
        thirdPartyName: [
          {
            required: true,
            message: '请填写',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 50,
            message: '字符1-50位',
          },
        ],
        thirdPartyProperty: [
          {
            required: true,
            message: '请填写',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 50,
            message: '字符1-50位',
          },
        ],

        thirdPartyLoss: [
          {
            required: true,
            validator: validateMoney2,
            trigger: 'blur',
          },
        ],
      },

      form: {
        thirdPartyName: '',
        thirdPartyProperty: '',
        thirdPartyLoss: '',
        fileRecordIds: [],
        fileRecord: [],
      },
    }
  },
  methods: {
    sort(flag, index) {
      let arr = JSON.parse(JSON.stringify(this.form.fileRecord))
      if (flag == '1') {
        //升序,当前项与前一项互换
        let item = JSON.parse(JSON.stringify(arr[index - 1]))
        arr[index - 1] = arr[index]
        arr[index] = item
      } else {
        //降序
        let item = JSON.parse(JSON.stringify(arr[index + 1]))
        arr[index + 1] = arr[index]
        arr[index] = item
      }
      this.form.fileRecord = JSON.parse(JSON.stringify(arr))
    },
    close() {
      this.form = {
        thirdPartyName: '',
        thirdPartyProperty: '',
        thirdPartyLoss: '',
        fileRecordIds: [],
        fileRecord: [],
      }
      this.flag = true
      this.index = ''
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },
    handleAvatarSuccess(res) {
      //上传成功调用
      console.log(res, '743284832')
      if (res.code == '0000') {
        let obj = {
          fileId: res.data.id,
          fileName: res.data.name,
          uploadTime: res.data.createTime,
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
          this.$emit('lossCb', this.form, this.index, this.flag)
          this.dialogFormVisible = false
        }
      })
    },
  },
}
</script>

<style lang="scss">
#ThirdPerson {
  .el-dialog_body {
    padding-left: 30px;
  }
}
</style>
<style lang="scss" scoped>
#ThirdPerson {
  .upload-demo {
    width: 300px;
  }
}
</style>
