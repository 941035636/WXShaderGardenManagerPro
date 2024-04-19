<template>
  <el-dialog
    id="addRiskRecord"
    :title="ruleForm.id?'修改风险记录':'添加风险记录'"
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
        <el-select
          v-model="ruleForm.level"
          class="w280"
          placeholder="请选择风险等级"
        >
          <el-option
            v-for="item in typeData"
            :key="item.code"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="辨识日期" prop="checkDate">
        <el-date-picker
          v-model="ruleForm.checkDate"
          class="w280"
          size="small"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择辨识日期"
        ></el-date-picker>
      </el-form-item>
      
      <el-form-item label="具体描述" prop="foundation">
        <el-input
          v-model.trim="ruleForm.foundation"
          class="w500"
          size="small"
          type="textarea"
          placeholder="请输入具体描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="管控措施建议" prop="advice">
        <el-input
          v-model.trim="ruleForm.advice"
          class="w500"
          size="small"
          type="textarea"
          placeholder="请输入管控措施建议"
        ></el-input>
      </el-form-item>
      <el-form-item label="风险照片">
        <el-upload
          class="avatar-uploader"
          action="#"
          :http-request="Upload"
          :on-success="handleAvatarSuccess"
          multiple
          :show-file-list="false"
          :limit="9"
          :before-upload="beforeAvatarUpload"
          accept=".jpg, .jpeg, .png, PNG"
          :on-exceed="onExceed"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
  import { addDanger } from '@/service/accidentManagement'
  import { updateDanger } from '@/service/accidentManagement'
  import ResourcesService from '@/service/ResourcesService'
  // import { getImgFile } from '@/api/resources'
  import { mapGetters } from 'vuex'
  export default {
    name: 'AddOrAlter',
    props: {},
    data() {
      return {
        ResourcesService: new ResourcesService(),
        dialogVisible: false,
        dealDateStartOptions: this.beginDate(),
        typeData: [],
        ruleForm: {
          accidentPreProjectId: '', // 合同id
          accidentPrePlanId: '', // 计划id
          level: '', // 风险等级
          checkDate: '', // 检查日期
          remark: '', // 风险源
          foundation: '', // 判断
          advice: '', // 建议
          files: '', // 文件
          danger:false, // 风险记录False，隐患排查为true
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
          ],
          foundation: [
            { required: true, message: '请输入判断依据', trigger: 'blur' },
          ],
          advice: [
            { required: true, message: '请输入管控措施建议', trigger: 'blur' },
          ],
          files: [
            { required: true, message: '请上传风险照片', trigger: 'blur' },
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
      async initData(val, dangerDetails) {
        this.typeData = this.currentEnum()
        if (dangerDetails) {
          for (let key in this.ruleForm) {
            if (key === 'level') {
              this.ruleForm[key] = dangerDetails[key]
            } else if (key === 'files') {
              this.ruleForm[key] = {}
            } else if (key === 'checkDate') {
              this.ruleForm[key] = dangerDetails[key]
                ? dangerDetails[key].split(' ')[0]
                : ''
            } else {
              this.ruleForm[key] = dangerDetails[key]
            }
          }
          try {
            for (let key of dangerDetails.url) {
              let {url} = await this.ResourcesService.downloadOrViewFile(key)
              this.imageUrl = url
            }
          } catch (error) {
            console.log(error)
          }
          this.ruleForm.id = dangerDetails.id
          console.log(this.ruleForm)
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
        })
        for (let key in this.ruleForm) {
          this.ruleForm[key] = ''
        }
        this.ruleForm.id = ''
        this.imageUrl = ''
      },
      close() {
        this.clear()
      },
      async configRegister() {
        let data = JSON.parse(JSON.stringify(this.ruleForm))
        data.checkDate = `${data.checkDate} 00:00:00`
        data.danger = false // 风险记录False，隐患排查为true
        let formData = new FormData()
        for (let key in data) {
          if (key === 'files' && this.ruleForm[key]) {
            formData.append(key, this.ruleForm[key]['file'])
          } else {
            formData.append(key, data[key])
          }
        }
        let res = {}
        if (data.id) {
          res = await updateDanger(formData, data.id)
        } else {
          res = await addDanger(formData)
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
      handleAvatarSuccess(res, file) {
        console.log(file)
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      // 图片上传
      async Upload(file) {
        console.log(file)
        this.ruleForm.files = file
        const formData = new FormData()
        formData.append('files', file.file)
        // formData.append('type', file.file.type)
        // formData.append("channelcode", "sequip")
        // formData.append("resCode", "I001")
        // let data = formData
        // let data = [file.file]
        // const res = await this.ResourcesService.uploadFile(
        //   'sequip-svc',
        //   'payInfo',
        //   '0',
        //   data
        // )
        // if (res.code == '0000') {
        //   this.id = res.list[0].fileId
        //   this.name = res.list[0].fileName
        // }
        console.log(formData)
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
        console.log(this.enumObj);
        return this.enumObj['SafetyAssessmentEnum'] || []
      },
      async getImgFile(url) {
        let res = await getImgFile(url)
        return res
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
#addRiskRecord {
  .el-upload--text {
    width: 180px;
  }
}
</style>
