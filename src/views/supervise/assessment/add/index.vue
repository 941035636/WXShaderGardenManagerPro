<template>
  <div id="assessmentAdd">
    <Title
      :title="JSON.stringify($route.query) !== '{}' ? '修改评估' : '添加评估'"
    ></Title>
    <div class="mt20">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="260px"
      >
        <el-form-item label="评估类型" prop="superviseType">
          <el-select
            v-model="form.superviseType"
            class="w217"
            placeholder="请选择"
          >
            <el-option
              v-for="item in assessTypeEnum"
              :key="item.strCode"
              :label="item.label"
              :value="item.strCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评估项目名称" prop="name">
          <el-input
            v-model="form.name"
            class="w217"
            placeholder="评估项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="评估项目委托单位" prop="superviseCompany">
          <el-input
            v-model="form.superviseCompany"
            class="w217"
            placeholder="评估项目委托单位"
          ></el-input>
        </el-form-item>
        <el-form-item label="评估对象" prop="superviseObject">
          <el-input
            v-model="form.superviseObject"
            class="w217"
            placeholder="评估对象"
          ></el-input>
        </el-form-item>
        <el-form-item label="评估项目实施单位" prop="exploitingWorkUnit">
          <el-input
            v-model="form.exploitingWorkUnit"
            class="w217"
            placeholder="请输入评估项目实施单位"
          ></el-input>
        </el-form-item>
        <el-form-item label="评估时间" prop="superviseTime">
          <el-date-picker
            v-model="form.superviseTime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="评估结果" prop="superviseResult">
          <el-input
            v-model="form.superviseResult"
            class="w217"
            type="textarea"
            placeholder="请输入评估结果"
          ></el-input>
        </el-form-item>
        <el-form-item label="评估报告" prop="fileIds">
          <div class="w250">
            <el-upload
              ref="upload"
              action="#"
              :before-upload="beforeUpload"
              :before-remove="beforeRemove"
              :on-remove="
                (file, fileList) => {
                  handleRemove(file, fileList)
                }
              "
              :http-request="fileChange"
              :file-list="files"
              :show-file-list="true"
              multiple
              :limit="10"
              accept=".zip,xlsx,.xls,.word,.docx,.doc,.pdf,.png,.jpg"
              class="upload-demo"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传zip/xlsx/xls/word/docx/doc/pdf/png/jpg文件，且不超过10MB
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item class="mt50">
          <el-button type="info" size="medium" @click="back">返回</el-button>
          <el-button type="primary" size="medium" @click="submitForm('form')">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import {
    addAssessment,
    findAssessmentById,
    updateAssessment,
  } from '@/api/supervise.js'
  import { uploadFile } from '@/api/policyManagement.js'
  import { mapGetters } from 'vuex'
  import { baseMixin } from '@/mixins/baseMixins'
  export default {
    name: 'AddAssessment',
    components: {
      Title,
    },
    mixins: [baseMixin],
    data() {
      return {
        assessTypeEnum: [], // 评估类型
        form: {
          exploitingWorkUnit: '',
          name: '',
          fileIds: [],
          superviseCompany: '',
          superviseFileId: null,
          superviseObject: '',
          superviseResult: '',
          superviseTime: '',
          superviseType: '',
        },
        files: [],
        photoList: [],
        rules: {
          fileIds: [
            {
              required: true,
              message: '请输上传评估报告',
              trigger: 'blur',
            },
          ],
          exploitingWorkUnit: [
            {
              required: true,
              message: '请选择评估项目实施单位',
              trigger: 'blur',
            },
            {
              min: 1,
              max: 30,
              message: '评估项目实施单位1-30位',
              trigger: 'blur',
            },
          ],
          name: [
            {
              required: true,
              message: '请输入评估项目名称',
              trigger: 'blur',
            },
            { min: 1, max: 30, message: '评估项目名称1-30位', trigger: 'blur' },
          ],
          superviseCompany: [
            {
              required: true,
              message: '请输入评估项目委托单位',
              trigger: 'blur',
            },
            {
              min: 1,
              max: 30,
              message: '评估项目委托单位1-30位',
              trigger: 'blur',
            },
          ],
          superviseFileId: [],
          superviseObject: [
            {
              required: true,
              message: '请输入评估对象',
              trigger: 'blur',
            },
            {
              min: 1,
              max: 30,
              message: '评估对象1-30位',
              trigger: 'blur',
            },
          ],
          superviseResult: [
            {
              required: true,
              message: '请输入评估结果',
              trigger: 'blur',
            },
            {
              min: 1,
              max: 300,
              message: '评估结果1-300',
              trigger: 'blur',
            },
          ],
          superviseTime: [
            {
              required: true,
              message: '请选择评估时间',
              trigger: 'blur',
            },
          ],
          superviseType: [
            {
              required: true,
              message: '请选择评估类型',
              trigger: 'blur',
            },
          ],
        },
      }
    },
    computed: {
      ...mapGetters({
        visitedRoutes: 'tabsBar/visitedRoutes',
        enumData: 'enums/getStrEnumAll',
      }),
    },
    created() {
      this.init()
    },
    activated() {
      this.isQuery()
    },
    methods: {
      // 初始化
      init() {
        this.assessTypeEnum = this.enumData.AssessTypeEnum
        this.isQuery()
      },
      beforeUpload(file) {
        // 文件大小限制 10MB
        let isLtM = file.size / 1024 / 1024 < 10
        if (!isLtM) {
          this.$baseMessage('文件大小不能超出10MB')
          return
        }
      },
      beforeRemove(file) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      handleRemove(file, fileList) {
        //删除文件
        if (file.id) {
          this.form.fileIds.splice(
            this.form.fileIds.findIndex((item) => item === file.id),
            1
          )
        } else {
          let delItem = this.photoList.filter((item) => {
            return item.uid == file.uid
          })
          this.form.fileIds.splice(
            this.form.fileIds.findIndex((item) => item === delItem.id),
            1
          )
          this.photoList.splice(
            this.photoList.findIndex((item) => item === delItem.id),
            1
          )
        }

        this.$baseMessage('删除成功', 'success')
      },
      fileChange(file) {
        var formData = new FormData()
        formData.append('file', file.file)
        this.uploadFile(formData, file)
      },
      // 上传
      async uploadFile(formData, file) {
        let { code, data } = await uploadFile(formData)
        if (code === '0000') {
          this.$baseMessage('上传成功', 'success')
          if (this.form.fileIds == null) {
            this.form.fileIds = new Array()
          }
          this.form.fileIds.push(data.id)
          this.photoList.push({ uid: file.file.uid, id: data.id }) //新上传文件做标识
          console.log(this.photoList)
        }
      },
      // 获取文件后缀名
      getFileType(name) {
        let startIndex = name.lastIndexOf('.')
        if (startIndex !== -1) {
          return name.slice(startIndex + 1).toLowerCase()
        } else {
          return ''
        }
      },
      // 新增评估
      async addAssessment() {
        let { code } = await addAssessment(this.form)
        if (code === '0000') {
          this.$baseMessage('添加成功', 'success')
          this.toThisTag()
        }
      },
      // 根据id查询评估
      async findAssessmentById(id) {
        let { code, data } = await findAssessmentById(id)
        if (code === '0000') {
          this.form = data
          this.$set(this.form, 'fileIds', [])
          this.form.fileIds = data.urls.map((item) => {
            return item.id
          })
          this.files = data.urls
        }
      },
      // 更新评估
      async updateAssessment(id, data) {
        let { code } = await updateAssessment(id, data)
        if (code === '0000') {
          this.$baseMessage('修改成功', 'success')
          this.toThisTag()
        }
      },
      // 是否有传递参数
      isQuery() {
        if (JSON.stringify(this.$route.query) !== '{}') {
          this.findAssessmentById(this.$route.query.id)
        } else {
          this.form = {
            exploitingWorkUnit: '',
            name: '',
            fileIds: [],
            superviseCompany: '',
            superviseFileId: 0,
            superviseObject: '',
            superviseResult: '',
            superviseTime: '',
            superviseType: '',
          }
        }
      },
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (JSON.stringify(this.$route.query) !== '{}') {
              this.updateAssessment(this.$route.query.id, this.form)
            } else {
              this.addAssessment()
            }
          } else {
            return false
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  #assessmentAdd {
    margin: 20px;
  }
</style>
