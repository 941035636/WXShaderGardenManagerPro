<template>
  <el-dialog
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
          :picker-options="timeRange"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="复查描述" prop="reviewResult">
        <el-input
          v-model="ruleForm.reviewResult"
          class="w400"
          type="textarea"
          placeholder="请输入复查描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="整改图片" prop="files">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :file-list="fileList"
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
import { getOrgList } from '@/api/userDataManagement'
import { addRecheck } from '@/api/accidentManagement'
import { mapGetters } from 'vuex'
export default {
  name: 'AddOrAlter',
  props: {},
  data() {
    return {
      dialogVisible: false,
      dealDateStartOptions: this.beginDate(),
      typeData: [],
      fileList: [],
      startTime: '',
      endTime: '',
      timeRange: {
        disabledDate: (time) => {
          return (
            time.getTime() >
              new Date(localStorage.getItem('accidentendTime')).getTime() ||
            time.getTime() <
              new Date(localStorage.getItem('accidentstartTime')).getTime()
          )
        },
      },
      ruleForm: {
        accidentPreProjectId: '', // 项目id
        accidentPreDangerId: '', // 隐患记录id
        accidentPrePlanId: '', // 计划id
        rectificationStatus: '', // 整改状态
        reviewDate: '', // 复查日期
        reviewResult: '', // 复查描述
        files: '', // 文件
        level: '',
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
          { required: true, message: '请输入复查描述', trigger: 'blur' },
        ],
        foundation: [
          { required: true, message: '请输入判断依据', trigger: 'blur' },
        ],
        files: [
          { required: false, message: '请上传复查照片', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      enumList: 'enums/getStrEnumAll',
    }),
  },
  mounted() {
    // this.initRole()
  },
  methods: {
    initData(val, val2) {
      this.dialogVisible = true

      this.startTime = val2.startTime || ''
      this.endTime = val2.endTime || ''
      this.getStatusList()
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
    // 获取状态列表
    getStatusList() {
      this.typeData = this.enumList.RectificationStatusEnum
    },

    clear() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
      this.ruleForm.id = ''
      this.imageUrl = ''
      this.fileList = []
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
          this.fileList.forEach((item) => {
            formData.append('files', item.raw)
          })
        } else {
          formData.append(key, data[key])
        }
      }
      let res = await addRecheck(formData)
      if (res.code === '0000') {
        this.$baseMessage('成功', 'success')
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
    handleSelect(item) {
      console.log(item)
      this.ruleForm.corporationCode = item.blCode
    },
    handleSelectionChange(val) {
      this.ruleForm.experts = val.map((item) => {
        let obj = {
          name: item.name,
          specialty: item.specialty,
        }
        return obj
      })
    },
    handleAvatarSuccess(res, file) {},
    fileChange(file, fileList) {
      this.fileList = fileList
    },
    //检测文件删除
    fileRemove(file, fileList) {
      this.fileList = fileList
    },
    // 图片上传
    async Upload(file) {
      this.ruleForm.files = file
      const formData = new FormData()
      formData.append('files', file.file)

      console.log(formData)
    },
    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 20
      if (!isLt10M) {
        this.$message.error('单文件上限20MB!')
      }
      return isLt10M
    },
    onExceed() {
      // this.$message.warning('最多支持10个附件')
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

<style lang="scss">
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
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>
