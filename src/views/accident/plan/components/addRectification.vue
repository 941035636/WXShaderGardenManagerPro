<template>
  <el-dialog
    id="addRectification"
    title="添加整改记录"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
    >
      <el-form-item label="整改状态" prop="rectificationStatus">
        <el-select
          v-model="ruleForm.rectificationStatus"
          class="w280"
          size="small"
          placeholder="请选择企业类型"
        >
          <el-option
            v-for="item in typeData"
            :key="item.code"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="复查日期" prop="reviewDate">
        <el-date-picker
          v-model="ruleForm.reviewDate"
          class="w280"
          type="date"
          size="small"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="复查描述" prop="reviewResult">
        <el-input
          v-model.trim="ruleForm.reviewResult"
          class="w400"
          size="small"
          type="textarea"
          placeholder="请输入复查描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="整改图片" prop="fileList">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :file-list="ruleForm.fileList"
          multiple
          :limit="9"
          :http-request="Upload"
          :before-upload="beforeAvatarUpload"
          :on-change="fileChange"
          :on-remove="fileRemove"
          accept=".jpg, .jpeg, .png, PNG"
          :on-exceed="onExceed"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="register">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { addRecheck } from '@/service/accidentManagement'
  import { mapGetters } from 'vuex'
  import { validateRemark} from '@/util/validateFrom'
  export default {
    name: 'AddOrAlter',
    props: {},
    data() {
      return {
        dialogVisible: false,
        dealDateStartOptions: this.beginDate(),
        typeData: [],
        ruleForm: {
          accidentPreProjectId: '', // 项目id
          accidentPreDangerId: '', // 隐患记录id
          accidentPrePlanId: '', // 计划id
          rectificationStatus: '', // 整改状态
          reviewDate: '', // 复查日期
          reviewResult: '', // 复查描述
          files: '', // 文件
          level: '',
          fileList:[],
        },
        imageUrl: '',
        rules: {
          rectificationStatus: [
            { required: true, message: '请选择整改状态', trigger: 'change' },
          ],
          reviewDate: [
            { required: true, message: '请选择复查日期', trigger: 'change' },
          ],
          reviewResult: [
            { required: true, validator: validateRemark, trigger: 'blur' },
          ],
          foundation: [
            { required: true, message: '请输入判断依据', trigger: 'blur' },
          ],
          fileList: [
            { required: true, message: '请上传复查照片', trigger: 'blur' },
          ],
        },
      }
    },
    computed: {
      ...mapGetters({
        enumObj: 'getEnumAll',
      }),
    },
    mounted() {
      // this.initRole()
    },
    methods: {
      async initData(val) {
        this.dialogVisible = true
        this.typeData = this.currentEnum()
        this.ruleForm.accidentPreProjectId = val.accidentPreProjectId
        this.ruleForm.accidentPrePlanId = val.accidentPrePlanId
        this.ruleForm.accidentPreDangerId = val.id
        this.ruleForm.level = val.level
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5'
        } else {
          return ''
        }
      },
      currentEnum(key) {
        return this.enumObj['RectificationStatusEnum'] || []
      },
    
      clear() {
        this.$nextTick(() => {
          this.$refs['ruleForm'].resetFields()
        })
        this.ruleForm.id = ''
        this.ruleForm.fileList = []
        this.imageUrl = ''
        console.log(this.ruleForm)
      },
      close() {
        this.clear()
      },
      async configRegister() {
        let data = JSON.parse(JSON.stringify(this.ruleForm))
        data.reviewDate = `${data.reviewDate} 00:00:00`
        let formData = new FormData()
        for (let key in data) {
          if (key === 'files') {
            // formData.append(key, this.ruleForm[key]['file'])
            this.ruleForm.fileList.forEach((item=>{
              formData.append('files', item.raw)
            }))
          } else {
            formData.append(key, data[key])
          }
        }
        let res = await addRecheck(formData)
        if (res.code === '0000') {
          this.$message.success('成功')
          this.$emit('successCb')
          this.dialogVisible = false
        }
      },
      register() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.configRegister()
          } else {
            return false
          }
        })
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      // 图片上传
      async Upload(file) {
        this.ruleForm.files = file
        const formData = new FormData()
        formData.append('files', file.file)
      },
      beforeAvatarUpload(file) {
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isLt10M) {
          this.$message.error('单文件上限10MB!')
        }
        return isLt10M
      },
      onExceed() {
        // this.$message.warning('最多支持10个附件')
      },
      // 点击上传按钮触发数据
      fileChange(file, fileList) {
        this.ruleForm.fileList = fileList;
      },
      //检测文件删除
      fileRemove(file, fileList) {
        this.ruleForm.fileList = fileList;
      },
      beginDate() {
        let self = this
        return {
          disabledDate(time) {
            let startDate = self.serviceData
              ? self.serviceData.split(' ')[0]
              : new Date()
            return time.getTime() < new Date(startDate)
          },
        }
      },
    },
  }
</script>

<style lang="less">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<style lang="less">
#addRectification {
  .avatar-uploader-icon {
    width: 140px;
    height: 140px;
    line-height: 140px;
  }
}
</style>

