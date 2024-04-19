<template>
  <div id="serviceInvestigateSummary">
    <Title title="服务总结"></Title>
    <div class="mb10 mt10 display-flex">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="200px"
      >
        <div class="display-flex">
          <el-form-item label="检查结果" prop="unAccordNum">
            <div class="color-green">符合</div>
            <el-input
              v-model.trim="ruleForm.unAccordNum"
              class="w100"
              size="small"
              type="Number"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="10px" prop="accordNum">
            <div class="color-orange">不符合</div>
            <el-input
              v-model.trim="ruleForm.accordNum"
              class="w100"
              size="small"
              type="Number"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="10px" prop="unRelate">
            <div class="color-gray-5">不涉及</div>
            <el-input
              v-model.trim="ruleForm.unRelate"
              class="w100"
              size="small"
              type="Number"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </div>
        <div class="ml200 mb10">
          <span>本次服务共检查：{{ theSum }}项</span>
        </div>
        <el-form-item label="风险管控责任人姓名：" prop="chargePersonName">
          <el-input
            v-model.trim="ruleForm.chargePersonName"
            class="w500"
            size="small"
            placeholder="请输入风险管控责任人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="风险管控责任人联系电话：" prop="chargePersonPhone">
          <el-input
            v-model.trim="ruleForm.chargePersonPhone"
            class="w500"
            size="small"
            placeholder="请输入风险管控责任人联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务情况说明" prop="checkRemark">
          <el-input
            v-model.trim="ruleForm.checkRemark"
            class="w500"
            size="small"
            type="textarea"
            placeholder="请输入"
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
        <div class="text-right mb20">
          <el-button @click="toThisTag" round>取 消</el-button>
          <el-button type="warning" @click="register" round>确认提交</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import { addInvestigateSummary } from '@/service/accidentManagement'
  import { mapGetters } from 'vuex'
  import { validateNumMinOrMax, validateName, validateTelephone, validatePhone,validateRemark} from '@/util/validateFrom'
  export default {
    name: 'ServiceReport',
    components: {
      Title,
    },
    props: {},
    data() {
      return {
        data: {},
        activeName: 'first',
        tableList: [{}],
        fileList: [],
        ruleForm: {
          id: '', // 计划id
          unAccordNum: 0, // 符合
          accordNum: 0, // 不符合
          unRelate: 0, // 不涉及
          checkRemark: '', // 备注
          files: '', // 文件
          chargePersonName:'',
          chargePersonPhone:'',
        },
        imageUrl: '',
        rules: {
          unAccordNum: [
            { required: true, validator: validateNumMinOrMax, trigger: 'blur' },
          ],
          accordNum: [
            { required: true, validator: validateNumMinOrMax, trigger: 'blur' },
          ],
          unRelate: [
            { required: true, validator: validateNumMinOrMax, trigger: 'blur' },
          ],
          checkRemark: [
            { required: true, validator: validateRemark, trigger: 'blur' },
          ],
          files: [{ required: true, message: '请上传照片', trigger: 'blur' }],
          chargePersonName: [
            { required: true, message: '请输入风险管控责任人姓名', trigger: 'blur' },
            { required: true, validator: validateName, trigger: 'blur' },
          ],
          chargePersonPhone: [
            { required: true, message: '请输入风险管控责任人联系人电话', trigger: 'blur' },
            { required: true, validator: validatePhone, trigger: 'blur' },
          ],
        },
      }
    },
    computed: {
      theSum() {
        let sum =
          Number(this.ruleForm.unAccordNum) +
          Number(this.ruleForm.accordNum) +
          Number(this.ruleForm.unRelate)
        return sum
      },
    },
    mounted() {},
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
        let res = await addInvestigateSummary(formData, this.$route.query.id)
        if (res.code === '0000') {
          this.$message.success('成功')
          this.toThisTag()
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
        return
      },
    },
  }
</script>

<style scoped lang="less">
  #serviceInvestigateSummary {
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
#serviceInvestigateSummary {
  .avatar-uploader-icon {
    width: 140px;
    height: 140px;
    line-height: 140px;
  }
}
</style>
