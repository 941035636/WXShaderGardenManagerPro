<template>
  <div id="ThirdParty">
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      @close="close"
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
        <el-form-item label="人员类型" prop="personType">
          <el-select
            disabled
            v-model="form.personType"
            size="mini"
            class="w300"
          >
            <el-option
              v-for="(item, key) in optionsData"
              :key="key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="personName">
          <el-input
            size="mini"
            class="w300"
            placeholder="请输入姓名"
            v-model="form.personName"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="certificateNo">
          <el-input
            size="mini"
            class="w300"
            placeholder="请输入"
            v-model="form.certificateNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="伤亡情况" prop="personInjuryType">
          <el-radio-group v-model="form.personInjuryType">
            <el-radio label="01">轻伤</el-radio>
            <el-radio label="02">重伤</el-radio>
            <el-radio label="03">死亡</el-radio>
          </el-radio-group>
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
import { validateIdCard } from '@/utils/validateFrom'
import { loginRSA, tokenName, baseURL } from '@/config'
import { uploadFile } from '@/api/policyManagement'
import store from '@/store'
export default {
  name: 'ThirdParty',
  components: { MoneyInput },
  data() {
    return {
      dialogFormVisible: false,
      index: '',
      flag: true,
      title: '',
      isThird: true,
      baseURL: baseURL,
      upLoadData2: {},
      optionsData: [
        {
          label: '从业人员',
          value: '01',
        },
        {
          label: '第三者',
          value: '02',
        },
        0,
      ],
      fileList2: [], // 图片回显地址
      headers: {
        authorization: store.getters['user/accessToken'],
      },
      rules: {
        personName: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 10,
            message: '字符2-10位',
          },
        ],
        personType: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur',
          },
        ],
        personInjuryType: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur',
          },
        ],

        certificateNo: [
          {
            required: true,
            validator: validateIdCard,
            trigger: 'blur',
          },
        ],
      },

      form: {
        personName: '',
        personType: '01',
        certificateNo: '',
        personInjuryType: '',
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
        personName: '',
        personType: '01',
        certificateNo: '',
        personInjuryType: '',
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
      }else if (res.code == '9999') {
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
      const isLt4M = file.size / 1024 / 1024 < 20

      if (!isLt4M) {
        this.$baseMessage('上传文件大小不能超过 20MB!', 'error')
      }

      return isLt4M
    },
    async confirm() {
      //确认后将对话框信息提交

      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          console.log(this.form, '00-0-')
          this.$emit(
            'successCb',
            this.form,
            this.index,
            this.flag,
            this.isThird
          )
          this.dialogFormVisible = false
        }
      })
    },
  },
}
</script>

<style lang="scss">
#ThirdParty {
  .el-dialog_body {
    padding-left: 30px;
  }
}
</style>
<style lang="scss" scoped>
#ThirdParty {
  .upload-demo {
    width: 300px;
  }
  .fileName {
    .name {
      width: 220px;
      display: inline-block;
    }
  }
}
</style>
