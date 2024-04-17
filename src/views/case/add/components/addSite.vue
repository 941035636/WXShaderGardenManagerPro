<template>
  <div id="addSite">
    <el-dialog
      :title="flag ? '添加查勘记录' : '修改查勘记录'"
      :visible.sync="dialogFormVisible"
      width="1000px"
      @close="close"
    >
      <el-form
        ref="ruleForm"
        label-position="right"
        label-width="130px"
        :inline="true"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="查勘时间" prop="time">
          <el-date-picker
            v-model="form.time"
            :picker-options="timeRange"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            class="w300"
          ></el-date-picker>
        </el-form-item>
        <br />
        <el-form-item label="查勘描述" prop="remark">
          <el-input
            type="textarea"
            rows="2"
            v-model="form.remark"
            size="mini"
            class="w524"
          ></el-input>
        </el-form-item>
        <p class="ml30 fb">查勘人员信息（可选）</p>
        <el-form-item label="姓名" prop="name">
          <el-input
            size="mini"
            class="w250"
            v-model="form.name"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input
            size="mini"
            class="w250"
            v-model="form.phone"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <p class="ml30 fb">查勘报告附件（可选）</p>
        <el-form-item>
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
import { validateTelephone2 } from '@/utils/validateFrom'
import { loginRSA, tokenName, baseURL } from '@/config'
import { uploadFile } from '@/api/policyManagement'
import { getImgFile, getFile } from '@/api/resources'
import store from '@/store'
export default {
  name: 'addSite',
  data() {
    return {
      dialogFormVisible: false,
      index: '',
      limitTime: '',
      flag: true,
      baseURL: baseURL,
      upLoadData2: {},
      fileList2: [], // 图片回显地址
      headers: {
        authorization: store.getters['user/accessToken'],
      },
      rules: {
        time: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'blur',
          },
        ],
        remark: [
          {
            required: true,
            message: '请填写查勘描述',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 300,
            message: '字符长度1-300位',
          },
        ],
        name: [
          {
            required: false,
            message: '请输入姓名',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 10,
            message: '字符长度2-10位',
          },
        ],
        phone: [
          {
            required: false,
            validator: validateTelephone2,
            trigger: 'blur',
          },
        ],
      },
      timeRange: {
        disabledDate: (time) => {
          if (this.limitTime) {
            return time.getTime() < new Date(this.limitTime).getTime()
          }
        },
      },
      form: {
        time: '',
        remark: '',
        name: '',
        phone: '',
        fileRecordIds: [],
        fileRecord: [],
      },
      photoList: [],
    }
  },
  methods: {
    close() {
      this.form = {
        time: '',
        remark: '',
        name: '',
        phone: '',
        fileRecordIds: [],
        fileRecord: [],
      }
      this.limitTime = ''
      this.flag = true
      this.index = ''
      this.$nextTick(() => {
        this.form = {}

        this.$refs.ruleForm.resetFields()
      })
    },
    handleAvatarSuccess(res) {
      //上传成功调用

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
          this.$emit('siteCb', this.form, this.index, this.flag)
          this.dialogFormVisible = false
        }
      })
    },
  },
}
</script>

<style lang="scss">
#addSite {
  .el-dialog_body {
    padding-left: 30px;
  }
}
</style>
<style lang="scss" scoped>
#addSite {
  .upload-demo {
    width: 300px;
  }
}
</style>
