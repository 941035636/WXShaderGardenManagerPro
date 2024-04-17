<template>
  <el-dialog
    id="addRiskRecord"
    :title="ruleForm.id ? '修改风险记录' : '添加风险记录'"
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
      <el-form-item label="辨识日期" prop="checkDate">
        <el-date-picker
          v-model="ruleForm.checkDate"
          class="w280"
          size="small"
          :picker-options="timeRange"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择辨识日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="风险源" prop="remark">
        <el-input
          v-model.trim="ruleForm.remark"
          class="w280"
          size="small"
          type="input"
          placeholder="请输入风险源"
        ></el-input>
      </el-form-item>
      <el-form-item label="风险等级" prop="level">
        <el-radio-group v-model="ruleForm.level">
          <el-radio
            v-for="item in typeData"
            :key="item.code"
            :label="item.code"
            :value="item.code"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="依据" prop="foundation">
        <el-input
          v-model.trim="ruleForm.foundation"
          class="w500"
          size="small"
          type="textarea"
          placeholder="请输入依据"
        ></el-input>
      </el-form-item>
      <el-form-item label="防范措施" prop="advice">
        <el-input
          v-model.trim="ruleForm.advice"
          class="w500"
          size="small"
          type="textarea"
          placeholder="请输入防范措施"
        ></el-input>
      </el-form-item>
      <el-form-item label="现场照片">
        <el-upload
          list-type="picture-card"
          :file-list="fileList"
          :action="this.baseURL + `/files/v1/upload/file`"
          name="file"
          :headers="headers"
          :limit="9"
          :data="upLoadData"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-remove="fileRemove"
          accept=".jpg, .jpeg, .png, PNG"
          :on-exceed="onExceed"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="clear2">取 消</el-button>
      <el-button type="primary" @click="register">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addDanger } from '@/api/accidentManagement'
import { updateDanger } from '@/api/accidentManagement'
import { baseURL } from '@/config'
import store from '@/store'
import { getImgFile } from '@/api/resources'
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
      headers: {
        authorization: store.getters['user/accessToken'],
      },
      baseURL: baseURL,
      upLoadData: {},
      ruleForm: {
        accidentPreProjectId: '', // 合同id
        accidentPrePlanId: '', // 计划id
        level: null, // 风险等级
        checkDate: '', // 检查日期
        remark: '', // 风险源
        foundation: '', // 判断
        advice: '', // 建议
        files: '', // 文件
        danger: false, // 风险记录False，隐患排查为true
      },
      imageUrl: '',
      rules: {
        level: [
          { required: true, message: '请选择风险等级', trigger: 'change' },
        ],
        checkDate: [
          { required: true, message: '请选择辨识日期', trigger: 'change' },
        ],
        remark: [
          { required: true, message: '请输入风险源', trigger: 'blur' },
          {
            min: 2,
            max: 200,
            message: '字符2-200位',
          },
        ],
        foundation: [
          { required: false, message: '请输入依据', trigger: 'blur' },
          {
            min: 2,
            max: 200,
            message: '字符2-200位',
          },
        ],
        advice: [
          { required: false, message: '请输入防范措施', trigger: 'blur' },
          {
            min: 2,
            max: 200,
            message: '字符2-200位',
          },
        ],
        files: [{ required: true, message: '请上传照片', trigger: 'blur' }],
      },
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
    }
  },
  computed: {
    ...mapGetters({
      enumObj: 'enums/getStrEnumAll',
    }),
  },
  mounted() {},
  methods: {
    clear2() {
      this.$emit('successCb')
      this.clear()
      this.dialogVisible = false
    },
    async initData(val, dangerDetails) {
      console.log(val, dangerDetails)
      this.startTime = val.startTime || ''
      this.endTime = val.endTime || ''

      this.typeData = this.currentEnum()
      if (dangerDetails) {
        for (let key in this.ruleForm) {
          if (key === 'level') {
            this.ruleForm[key] = dangerDetails[key]
          } else if (key === 'checkDate') {
            this.ruleForm[key] = dangerDetails[key]
              ? dangerDetails[key].split(' ')[0]
              : ''
          } else {
            this.ruleForm[key] = dangerDetails[key]
          }
        }
        if (dangerDetails.url && dangerDetails.url.length) {
          await this.getImgFile(dangerDetails.url).then((r) => {
            this.fileList = r
          })
        }
        this.ruleForm.id = dangerDetails.id
      } else {
        this.ruleForm.accidentPrePlanId = val.id
        this.ruleForm.accidentPreProjectId = val.accidentPreProjectId
      }

      this.dialogVisible = true
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5'
      } else {
        return ''
      }
    },
    clear() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
        this.ruleForm.id = ''
        this.fileList = []
        this.ruleForm = {
          accidentPreProjectId: '', // 合同id
          accidentPrePlanId: '', // 计划id
          level: null, // 风险等级
          checkDate: '', // 检查日期
          remark: '', // 风险源
          foundation: '', // 判断
          advice: '', // 建议
          files: '', // 文件
          danger: false, // 风险记录False，隐患排查为true
        }
      })
    },
    close() {
      this.clear()
    },
    async configRegister() {
      let data = this.ruleForm
      data.checkDate = `${data.checkDate} 00:00:00`
      data.danger = false // 风险记录False，隐患排查为true
      data.fileIds = this.fileList.map((item) => {
        return item.id
      })
      let res = {}
      if (data.id) {
        res = await updateDanger(data, data.id)
      } else {
        res = await addDanger(data)
      }
      if (res.code === '0000') {
        this.$message.success('添加成功')
        this.$emit('successCb')
        this.clear()
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
    handleAvatarSuccess(res, file) {
      if (res.code == '0000') {
        this.fileList.push({
          uid: file.uid,
          url: URL.createObjectURL(file.raw),
          id: res.data.id,
        })
      }
    },

    //检测文件删除
    fileRemove(file, fileList) {
      this.fileList = fileList
      //       this.fileList = this.fileList.filter((item) => {
      //   return item.uid != file.uid
      // })
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
    currentEnum(key) {
      return this.enumObj['SafetyAssessmentEnum'] || []
    },
    async getImgFile(list) {
      for (let key of list) {
        let { data } = await getImgFile(key.url)

        key.url = data
      }

      return list
    },
  },
}
</script>

<style lang="scss">
#addRiskRecord .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
#addRiskRecord .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
#addRiskRecord .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
#addRiskRecord .avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>

<style lang="scss" scoped>
#addRiskRecord {
}
</style>
