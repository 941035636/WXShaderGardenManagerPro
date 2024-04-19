<template>
  <div id="serviceSummaryType3">
    <Title title="服务总结"></Title>
    <div class="mb10 mt10 display-flex">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="200px"
      >
        <el-form-item label="风险管控责任人姓名：" prop="chargePersonName">
          <el-input
            v-model.trim="ruleForm.chargePersonName"
            class="w280"
            size="small"
            placeholder="请输入风险管控责任人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="风险管控责任人联系电话：" prop="chargePersonPhone">
          <el-input
            v-model.trim="ruleForm.chargePersonPhone"
            class="w280"
            size="small"
            placeholder="请输入风险管控责任人联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务情况说明" prop="checkRemark">
          <el-input
            v-model.trim="ruleForm.checkRemark"
            class="w280"
            size="small"
            type="textarea"
            placeholder="请输入服务计划说明"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务照片">
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
        <div class="text-center mb20">
          <el-button @click="toThisTag" round>取 消</el-button>
          <el-button type="warning" @click="register" round>确认提交</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import { addAssessmenSummary } from '@/service/accidentManagement'
  import { validateTelephone,validateName,validatePhone,validateRemark } from '@/util/validateFrom'
  import { mapGetters } from 'vuex'
  export default {
    name: 'serviceSummaryType3',
    components: {
      Title,
    },
    filters: {},
    props: {},
    data() {
      return {
        data: {},
        activeName: 'first',
        dealDateStartOptions: this.beginDate(),
        tableList: [{}],
        fileList: [],
        ruleForm: {
          id: '', // 计划id
          checkRemark: '', // 备注
          files: '', // 文件
          chargePersonName:'',
          chargePersonPhone:'',
        },
        imageUrl: '',
        rules: {
          checkRemark: [
            { required: true, validator: validateRemark, trigger: 'blur' },
          ],
          chargePersonName: [
            { required: true, message: '请输入安全风险管控责任人姓名', trigger: 'blur' },
            { required: true, validator: validateName, trigger: 'blur' },
          ],
          chargePersonPhone: [
            { required: true, message: '请输入安全风险管控责任人联系人电话', trigger: 'blur' },
            { required: true, validator: validatePhone, trigger: 'blur' },
          ],
          files: [
            { required: true, message: '请上传隐患照片', trigger: 'blur' },
          ],
        },
      }
    },
    computed: {
      ...mapGetters({
        getEnumAll: 'getEnumAll',
      }),
      getTitle() {
        let objName =
          this.getEnumAll.AccidentTypeEnum[this.$route.query.preType]
        let name = `服务总结（${objName}）`
        return name
      },
    },
    mounted() {},
    methods: {
      async initData(val) {
        this.dialogVisible = true
        // this.ruleForm.accidentPreProjectId = val.id
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5'
        } else {
          return ''
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
        let formData = new FormData()
        for (let key in data) {
          if (key === 'files') {
            this.fileList.forEach((item=>{
              formData.append('files', item.raw)
            }))
          } else {
            formData.append(key, data[key])
          }
        }
        let res = await addAssessmenSummary(formData, this.$route.query.id)
        if (res.code === '0000') {
          this.$message.success('成功')
          this.toThisTag()
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
      // 点击上传按钮触发数据
      fileChange(file, fileList) {
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isLt10M) {
          this.fileList = fileList.filter(f=>f.name !== file.name);
          this.$message({ message: "单文件上限10MB!", type: "error" });
          return false;
        } else {
          this.fileList = fileList;
        }
      },
      //检测文件删除
      fileRemove(file, fileList) {
        this.fileList = fileList;
      },
      // 设置路由
      async toThisTag() {
        this.$router.go(-1)
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

<style scoped lang="less">
  #serviceSummaryType3 {
    margin: 0px 20px 20px;
    .upload-demo {
      .upload-btn {
        width: 100px;
      }
    }
    .project-type {
      display: inline-block;
      padding: 2px 10px;
      background-color: #e6f7ff;
      color: #096dd9;
      border-radius: 20px;
    }
  }
</style>
<style lang="less">
#serviceSummaryType3 {
  .avatar-uploader-icon {
    width: 140px;
    height: 140px;
    line-height: 140px;
  }
}
</style>