<template>
  <div id="ThirdParty">
    <el-dialog :visible.sync="dialogFormVisible" width="45%">
      <el-form
        ref="ruleForm"
        label-position="left"
        label-width="190px"
        :inline="true"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="第三者名称：" prop="thirdPartyName">
          <el-input
            v-model="form.thirdPartyName"
            placeholder="第三者名称"
            clearable
            autocomplete="off"
            class="w233"
          ></el-input>
        </el-form-item>
        <el-form-item prop="thirdPartyProperty" label="第三者财产名称：">
          <el-input
            v-model="form.thirdPartyProperty"
            placeholder="请输入第三者财产名称"
            autocomplete="off"
            clearable
            class="w233"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="第三者财产损失金额："
          prop="thirdPartyPropertyLoss"
        >
          <el-input
            v-model="form.thirdPartyPropertyLoss"
            clearable
            placeholder="请输入第三者财产损失金额"
            autocomplete="off"
            class="w233"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="第三者损失财产证明文件：" prop="thirdFileIds">
          <el-upload
            :http-request="changeImg"
            action="#"
            :file-list="form.thirdFiles"
            class="upload-demo"
            :before-remove="beforeRemove"
            :on-remove="
              (file, fileList) => {
                handleRemove(file, fileList)
              }
            "
            multiple
            :limit="3"
            accept=".jpg, .png, PNG,.word,.docx,.doc,.pdf,.xlsx,.xls"
          >
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
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
  import { validateThirdParty, validateMoney } from '@/utils/validateFrom'
  import { uploadFile } from '@/api/policyManagement'
  export default {
    name: 'ThirdParty',
    data() {
      return {
        dialogFormVisible: false,
        rules: {
          thirdPartyName: [
            {
              required: true,
              validator: validateThirdParty,
              trigger: 'blur',
            },
          ],
          thirdPartyProperty: [
            {
              required: true,
              validator: validateThirdParty,
              trigger: 'blur',
            },
          ],
          thirdPartyPropertyLoss: [
            {
              required: true,
              validator: validateMoney,
              trigger: 'blur',
            },
          ],
          thirdFileIds: [
            {
              required: true,
              message: '请输入第三者财产损失证明文件',
              trigger: 'blur',
            },
          ],
        },
        fileWall: [],
        form: {
          index: false, //标识符
          thirdPartyPropertyLoss: '', //第三者财产损失金额
          thirdPartyProperty: '', //第三者财产名称
          thirdPartyName: '', //第三者名称
          thirdFileIds: [], //第三者财产损失证明文件
          thirdFiles: [],
        },
        photoList: [],
        formLabelWidth: '200px',
      }
    },
    methods: {
      initFile() {
        if (this.form.thirdFiles.length) {
          this.form.thirdFileIds = this.form.thirdFiles.map((item) => {
            return item.id
          })
        }
      },
      handleRemove(file, fileList) {
        //删除文件

        if (file.id) {
          //有id
          this.form.thirdFileIds.splice(
            this.form.thirdFileIds.findIndex((item) => item === file.id),
            1
          )
          this.form.thirdFiles.splice(
            this.form.thirdFiles.findIndex((item) => item.id === file.id),
            1
          )
        } else {
          if (this.photoList.length) {
            let delItem = this.photoList.filter((item) => {
              return item.uid == file.uid
            })

            this.photoList.splice(
              this.photoList.findIndex((item) => item.uid === file.uid),
              1
            )
            this.form.thirdFileIds.splice(
              this.form.thirdFileIds.findIndex((item) => item === delItem.id),
              1
            )
            this.form.thirdFiles.splice(
              this.form.thirdFiles.findIndex(
                (item) => item.uid === delItem.uid
              ),
              1
            )
          }
        }
      },
      async changeImg(file) {
        let data = new FormData()
        data.append('file', file.file)
        let res = await uploadFile(data)
        if (res.code == '0000') {
          if (this.form.thirdFileIds == null) {
            this.$set(this.form, 'thirdFileIds', [])
          }
          this.form.thirdFileIds.push(res.data.id)
          this.photoList.push({ uid: file.file.uid, id: res.data.id })
          //添加uid方便删除时获取下标
          if (this.form.thirdFiles == null) {
            this.$set(this.form, 'thirdFiles', [])
          }

          this.form.thirdFiles.push(file.file)
        }
      },
      beforeRemove(file) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      async confirm() {
        //确认后将对话框信息提交
        let flag = false
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$parent.$parent.saveParty()
            this.form = {}
            this.photoList = []
            this.fileWall = []
            this.dialogFormVisible = false
            flag = true
          }
        })
        return flag
      },
    },
  }
</script>

<style scoped></style>
