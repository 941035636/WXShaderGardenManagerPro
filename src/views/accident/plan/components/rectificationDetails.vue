<template>
  <el-dialog
    :title="ruleForm['id'] ? '修改保险公司基本信息' : '保险公司基本信息'"
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
      <el-form-item label="整改状态" prop="reviewDate">
        <el-date-picker
          v-model="ruleForm.reviewDate"
          class="w280"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="复查描述" prop="remark">
        <el-input
          v-model="ruleForm.remark"
          class="w400"
          type="textarea"
          placeholder="请输入服务计划说明"
        ></el-input>
      </el-form-item>
      <el-form-item label="整改图片" prop="files">
        <el-upload
          class="avatar-uploader"
          action="#"
          :http-request="Upload"
          :on-success="handleAvatarSuccess"
          multiple
          :show-file-list="false"
          :limit="10"
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
  import { getOrgList } from '@/api/userDataManagement'
  import { getBranchDetails } from '@/api/userDataManagement'
  import { getEnum } from '@/api/caseManagement'
  import { addDanger } from '@/service/accidentManagement'
  export default {
    name: 'AddOrAlter',
    props: {},
    data() {
      return {
        dialogVisible: false,
        typeData: [],
        ruleForm: {
          accidentPreProjectId: '1380037001918681088', // 隐患记录id
          accidentPreDangerId: '1380037001918681088', // 隐患记录id
          accidentPrePlanId: '1380100927507271680', // 计划id
          rectificationStatus: '', // 整改状态
          reviewDate: '', // 复查日期
          remark: '', // 复查描述
          reviewResult: '', // 评审结果
          files: '', // 文件
        },
        imageUrl: '',
        rules: {
          rectificationStatus: [
            { required: true, message: '请选择整改状态', trigger: 'change' },
          ],
          reviewDate: [
            { required: true, message: '请选择复查日期', trigger: 'change' },
          ],
          remark: [
            { required: true, message: '请输入复查描述', trigger: 'blur' },
          ],
          foundation: [
            { required: true, message: '请输入判断依据', trigger: 'blur' },
          ],
          files: [
            { required: true, message: '请上传复查照片', trigger: 'blur' },
          ],
        },
      }
    },
    computed: {},
    mounted() {
      // this.initRole()
    },
    methods: {
      async initData(val) {
        console.log(val)
        this.dialogVisible = true
        await this.getEnum()
        // this.ruleForm.accidentPreProjectId = val.id
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5'
        } else {
          return ''
        }
      },
      // 获取枚举类
      async getEnum(name) {
        let res = await getEnum({ name })
        if (res.code === '0000') {
          let typeData = []
          Object.keys(res.data.AccidentTypeEnum).forEach((key) => {
            let obj = {
              code: key,
              label: res.data.AccidentTypeEnum[key],
            }
            typeData.push(obj)
          })
          this.typeData = typeData
        }
      },
      async querySearchOrg(queryString, cb) {
        if (!queryString) {
          cb([])
        } else {
          let form = {
            pn: 1,
            ps: 10,
            beginCreateTime: '',
            endCreateTime: '',
            custFullName: queryString,
            status: '1',
            type: '',
            bl: '',
            userAccount: '',
          }
          let res = await getOrgList(form)
          if (res.code == '0000') {
            let list = res.list.map((item) => {
              let obj = {
                value: item.custFullName,
                blCode: item.blCode,
              }
              return obj
            })
            cb(list)
          } else {
            cb([{ value: '失败' }])
          }
        }
      },
      clear() {
        this.$nextTick(() => {
          this.$refs['ruleForm'].resetFields()
        })
        this.ruleForm.id = ''
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
            formData.append(key, this.ruleForm[key]['file'])
          } else {
            formData.append(key, data[key])
          }
        }
        let res = await addDanger(formData)
        if (res.code === '0000') {
          this.$message.success('添加成功')
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
