<template>
  <div id="SiteSurvyAdd">
    <Title :title="title" class="mb30"></Title>

    <div class="content_item ml30 lh30">
      <el-form
        ref="ruleForm"
        label-position="left"
        label-width="150px"
        :inline="true"
        :model="form"
        :rules="rules"
      >
        <el-row>
          <el-col :span="9">
            <el-form-item label="查勘人员姓名：" prop="name">
              <el-input
                v-model="form.name"
                size="small"
                placeholder="请输入查勘人员姓名"
                class="w250"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="查勘人员联系电话：" prop="phone">
              <el-input
                v-model="form.phone"
                size="small"
                placeholder="请输入查勘人员联系电话"
                class="w250"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="查勘时间：" prop="time">
              <el-date-picker
                v-model="form.time"
                value-format="yyyy-MM-dd 00:00:00"
                size="small"
                placeholder="请输入查勘时间"
                class="wd250"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="查勘描述：" prop="remark">
              <el-input
                v-model="form.remark"
                size="small"
                type="textarea"
                placeholder="请输入查勘描述"
                class="w250"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="查勘报告：" prop="fileRecordIds">
              <el-upload
                :http-request="changeImg"
                action="#"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :before-remove="beforeRemove"
                :on-remove="
                  (file, fileList) => {
                    handleRemove(file, fileList)
                  }
                "
                class="upload-demo"
                :file-list="fileList"
                accept=".jpg, .png, PNG,.word,.docx,.doc,.pdf,.xlsx,.xls"
                multiple
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
  import {
    validateTelephone,
    validatePhone,
    validateCon,
    validateName,
  } from '@/utils/validateFrom'
  import { uploadFile } from '@/api/policyManagement'
  export default {
    name: 'SiteSurvyAdd',
    components: { Title },

    props: {},
    data() {
      return {
        title: '现场查勘',
        rules: {
          name: [
            {
              required: true,
              validator: validateName,
              trigger: 'blur',
            },
          ],
          phone: [
            {
              required: true,
              validator: validatePhone,
              trigger: 'blur',
            },
          ],
          time: [
            {
              required: true,
              message: '请选择查勘时间',
              trigger: 'blur',
            },
          ],
          remark: [
            {
              required: true,
              validator: validateCon,
              trigger: 'blur',
            },
          ],
          fileRecordIds: [
            {
              required: true,
              message: '请上传查勘报告文件',
              trigger: 'blur',
            },
          ],
        },
        fileList: [], //文件墙
        photoList: [],
        form: {
          id: '', //标识id
          name: '', //查勘人员姓名
          phone: '', //查勘人员联系电话
          time: '', //查勘时间
          remark: '', //查勘描述
          fileRecordIds: [], //查勘报告文件ID
        },
      }
    },
    mounted() {
      setTimeout(() => {
        console.log(this.form.fileRecordIds, 'fileRecordIds')
      }, 1000)
    },
    methods: {
      handleAvatarSuccess() {
        this.$refs.ruleForm.validateField('fileRecordIds')
      },
      async changeImg(file, fileList) {
        //上传文件
        let data = new FormData()
        data.append('file', file.file)
        const res = await uploadFile(data)
        if (res.code == '0000') {
          if (!this.form.fileRecordIds || this.form.fileRecordIds.length == 0) {
            this.$set(this.form, 'fileRecordIds', [])
          }
          this.form.fileRecordIds.push(res.data.id)

          this.photoList.push({ uid: file.file.uid, id: res.data.id })
        } //添加uid方便删除时获取下标
      },
      beforeAvatarUpload: function (file) {
        const isLt2M = file.size / 1024 / 1024 < 10 //限制图片大小

        if (!isLt2M) {
          this.$baseMessage('上传头像图片大小不能超过 10MB!', 'error')
        }
        return isLt2M
      },
      beforeRemove(file) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      handleRemove(file, fileList) {
        //删除文件
        console.log(file.id, 'fileId')
        if (file.id) {
          //有id
          this.form.fileRecordIds.splice(
            this.form.fileRecordIds.findIndex((item) => item === file.id),
            1
          )
        } else {
          if (this.photoList.length) {
            let delItem = this.photoList.filter((item) => {
              return item.uid == file.uid
            })
            this.photoList.splice(
              this.photoList.findIndex((item) => item.id === file.id),
              1
            )
            this.form.fileRecordIds.splice(
              this.form.fileRecordIds.findIndex((item) => item === delItem.id),
              1
            )
          }
        }
      },
      exceed() {
        //上传超过限制时的操作
        callback(new Error('请勿多上传!'))
      },
      save() {
        //保存时校验
        let flag = false
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$store.commit('formDatas/caseSiteSurveyParam', this.form)
            flag = true
          }
        })
        return flag
      },
    },
  }
</script>
<style lang="scss" scoped>
  #SiteSurvyAdd {
    padding: 0 0 10px 0;
    margin: 10px 0;
    background-color: #fff;
  }
  .wd250 {
    width: 250px !important;
  }
  .red {
    color: #f00;
  }
</style>
