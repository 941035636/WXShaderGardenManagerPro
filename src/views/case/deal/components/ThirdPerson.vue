<template>
  <div id="ThirdPerson">
    <el-dialog :visible.sync="dialogFormVisible" width="40%">
      <el-form
        ref="ruleForm"
        label-position="left"
        label-width="150px"
        :inline="true"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="personType" label="人员类型：">
          <el-select
            v-model="form.personType"
            placeholder="请选择人员类型"
            class="w200"
          >
            <el-option
              v-for="(item, index) in personSelect"
              :key="index"
              :value="item.element"
              :label="item.element"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="personName" label="人员姓名：">
          <el-input
            v-model="form.personName"
            placeholder="请输入人员姓名"
            autocomplete="off"
            class="w200"
          ></el-input>
        </el-form-item>
        <el-form-item label="人员证件类型：" prop="certificateType">
          <el-select
            v-model="form.certificateType"
            placeholder="请选择人员证件类型"
            class="w200"
          >
            <el-option
              v-for="(item, index) in cardType"
              :key="index"
              :value="item.value"
              :label="item.element"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="certificateNo" label="人员证件号码：">
          <el-input
            v-model="form.certificateNo"
            placeholder="请输入人员证件号码"
            autocomplete="off"
            class="w200"
          ></el-input>
        </el-form-item>
        <el-form-item prop="personInjuryType" label="人员伤亡情况：">
          <el-input
            v-model="form.personInjuryType"
            type="textarea"
            placeholder="请输入人员伤亡情况"
            autocomplete="off"
            class="w200"
          ></el-input>
        </el-form-item>
        <el-form-item prop="personFileIds" label="人员伤亡证明文件：">
          <el-upload
            :http-request="changeImg"
            class="upload-demo"
            action="#"
            :file-list="form.personFiles"
            :before-upload="beforeAvatarUpload"
            :before-remove="beforeRemove"
            :on-remove="
              (file, fileList) => {
                handleRemove(file, fileList)
              }
            "
            :on-success="handleSuccess"
            accept=".jpg, .png, PNG,.word,.docx,.doc,.pdf,.xlsx,.xls"
            multiple
            :limit="10"
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
  import { uploadFile } from '@/api/policyManagement'
  import {
    validateTelephone,
    validateName,
    validateDWName,
    validatePersonCard,
    validateNum,
  } from '@/utils/validateFrom'
  export default {
    name: 'ThirdPerson',
    data() {
      return {
        dialogFormVisible: false,
        rules: {
          personType: [
            {
              required: true,
              message: '请填写人员类型',
              trigger: 'blur',
            },
          ],
          personName: [
            {
              required: true,
              validator: validateName,
              trigger: 'blur',
            },
          ],
          certificateNo: [
            {
              required: true,
              validator: validatePersonCard,
              trigger: 'blur',
            },
          ],
          certificateType: [
            {
              required: true,
              message: '请选择证件类型',
              trigger: 'blur',
            },
          ],
          personInjuryType: [
            {
              required: true,
              validator: validateDWName,
              trigger: 'blur',
            },
          ],
          personFileIds: [
            {
              required: true,
              message: '请上传人员证明文件',
              trigger: 'blur',
            },
          ],
        },
        personSelect: [{ element: '从业人员' }, { element: '第三者' }],

        cardType: [
          { value: '01', element: '居民身份证' },
          { value: '02', element: '士官证' },
          { value: '03', element: '护照' },
          { value: '04', element: '其他' },
        ],
        fileWall: [], //文件
        form: {
          index: false, //标识符
          personType: '', //人员类型
          personName: '', //人员姓名
          certificateNo: '', //人员证件号码
          certificateType: '', //人员证件类型
          personInjuryType: '', //人员伤亡情况
          personFileIds: [], //人员伤亡证明文件
          personFiles: [],
          //文件墙,
        },
        photoList: [], //方便删除用
        formLabelWidth: '150px',
      }
    },
    methods: {
      initFile() {
        if (this.form.personFiles.length) {
          this.form.personFileIds = this.form.personFiles.map((item) => {
            return item.id
          })
        }
      },
      async changeImg(file) {
        let data = new FormData()
        data.append('file', file.file)
        const res = await uploadFile(data)
        if (res.code == '0000') {
          if (this.form.personFileIds == null) {
            this.$set(this.form, 'personFileIds', [])
          }
          this.form.personFileIds.push(res.data.id)
          this.photoList.push({ uid: file.file.uid, id: res.data.id })
          //添加uid方便删除时获取下标
          if (this.form.personFiles == null) {
            this.$set(this.form, 'personFiles', [])
          }

          this.form.personFiles.push(file.file)
        }
      },
      handlePreview() {},
      handleRemove(file, fileList) {
        //删除文件
        console.log(this.form.personFiles, 'remove')
        if (file.id) {
          //有id
          this.form.personFileIds.splice(
            this.form.personFileIds.findIndex((item) => item === file.id),
            1
          )
          this.form.personFiles.splice(
            this.form.personFiles.findIndex((item) => item.id === file.id),
            1
          )
        } else {
          if (this.photoList.length) {
            let delItem = this.photoList.filter((item) => {
              return item.uid == file.uid
            })

            this.photoList.splice(
              this.photoList.findIndex((item) => item.id === file.uid),
              1
            )
            this.form.personFileIds.splice(
              this.form.personFileIds.findIndex((item) => item === delItem.id),
              1
            )
            this.form.personFiles.splice(
              this.form.personFiles.findIndex(
                (item) => item.uid === delItem.uid
              ),
              1
            )
          }
        }
      },
      beforeAvatarUpload() {},
      beforeRemove(file) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      handleSuccess(file) {},
      confirm() {
        let flag = false
        this.$refs['ruleForm'].validate(async (valid) => {
          if (valid) {
            await this.$parent.$parent.savePerson()
            this.dialogFormVisible = false
            this.form = {}
            this.photoList = []
            flag = true
          }
        })
        return flag
      },
    },
  }
</script>

<style lang="scss" scoped>
  #ThirdPerson {
    .inp {
      margin-bottom: 20px;
    }
  }
</style>
