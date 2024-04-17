<template>
  <el-dialog
    title="添加隐患记录"
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
      <el-form-item label="检查日期" prop="checkDate">
        <el-date-picker
          :picker-options="timeRange"
          v-model="ruleForm.checkDate"
          class="w280"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="判断依据" prop="foundation">
        <el-input
          v-model="ruleForm.foundation"
          class="w500"
          type="textarea"
          placeholder="请输入判断依据"
        ></el-input>
      </el-form-item>
      <el-form-item label="隐患描述" prop="remark">
        <el-input
          v-model="ruleForm.remark"
          class="w500"
          type="textarea"
          placeholder="请输入隐患描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="隐患等级" prop="level">
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

      <el-form-item label="整改建议" prop="advice">
        <el-input
          v-model="ruleForm.advice"
          class="w500"
          type="textarea"
          placeholder="请输入整改建议"
        ></el-input>
      </el-form-item>
      <el-form-item label="隐患照片">
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
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="register">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addDanger } from '@/api/accidentManagement'
import { updateDanger } from '@/api/accidentManagement'
import { getImgFile } from '@/api/resources'
import { baseURL } from '@/config'
import store from '@/store'
import { mapGetters } from 'vuex'
export default {
  name: 'AddOrAlter',
  props: {},
  data() {
    return {
      dialogVisible: false,
      dealDateStartOptions: this.beginDate(),
      typeData: [],
      startTime: '',
      endTime: '',

      headers: {
        authorization: store.getters['user/accessToken'],
      },
      fileList: [],
      baseURL: baseURL,
      upLoadData: {},
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
        accidentPreProjectId: '', // 合同id
        accidentPrePlanId: '', // 计划id
        level: null, // 等级
        checkDate: '', // 检查日期
        remark: '', // 备注
        foundation: '', // 判断
        advice: '', // 建议
        files: '', // 文件
        fileIds: '',
      },
      imageUrl: '',
      rules: {
        level: [
          { required: true, message: '请选择隐患等级', trigger: 'change' },
        ],
        checkDate: [
          { required: true, message: '请选择检查日期', trigger: 'change' },
        ],
        remark: [
          { required: true, message: '请输入隐患描述', trigger: 'blur' },
          {
            min: 2,
            max: 200,
            message: '字符2-200位',
          },
        ],
        foundation: [
          { required: true, message: '请输入判断依据', trigger: 'blur' },
          {
            min: 2,
            max: 200,
            message: '字符2-200位',
          },
        ],
        advice: [
          { required: true, message: '请输入整改建议', trigger: 'blur' },
          {
            min: 2,
            max: 200,
            message: '字符2-200位',
          },
        ],
        files: [{ required: true, message: '请上传隐患照片', trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapGetters({
      enumList: 'enums/getStrEnumAll',
    }),
  },
  mounted() {},
  methods: {
    async initData(val, dangerDetails) {
      this.startTime = val.startTime || ''
      this.endTime = val.endTime || ''
      this.typeData = this.currentEnum()
      if (dangerDetails) {
        for (let key in this.ruleForm) {
          if (key === 'checkDate') {
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
    async getImgFile(list) {
      for (let key of list) {
        let { data } = await getImgFile(key.url)

        key.url = data
      }

      return list
    },
    clear() {
      this.ruleForm.id = ''
      this.fileList = []
      this.$nextTick(() => {
        this.ruleForm = {
          accidentPreProjectId: '', // 合同id
          accidentPrePlanId: '', // 计划id
          level: null, // 等级
          checkDate: '', // 检查日期
          remark: '', // 备注
          foundation: '', // 判断
          advice: '', // 建议
          files: '', // 文件
          fileIds: '',
        }
        this.$refs['ruleForm'].resetFields()
        console.log(this.ruleForm, '__+++_+__')
      })
    },
    close() {
      this.clear()
    },
    async configRegister() {
      let data = this.ruleForm
      data.checkDate = `${data.checkDate} 00:00:00`
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
        this.$baseMessage('添加成功', 'success')
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
    async handleAvatarSuccess(res, file) {
      if (res.code == '0000') {
        await this.fileList.push({
          uid: file.uid,
          url: URL.createObjectURL(file.raw),
          id: res.data.id,
        })
      }
    },
    fileRemove(file, fileList) {
      this.fileList = fileList
      //       this.fileList = this.fileList.filter((item) => {
      //   return item.uid != file.uid
      // })
    },
    // 图片上传

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
      return this.enumList['DangerLevelEnum'] || []
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
