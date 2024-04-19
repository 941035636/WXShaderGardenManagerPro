<template>
  <div id="serviceSummaryType2">
    <Title title="服务总结"></Title>
    <div class="mb10 mt10">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="150px"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="线上/线下" prop="offline">
              <div class="custom-button">
                <p :class="{'active-p':ruleForm.offline === false}" @click="ruleForm.offline=false">线上</p>
                <p :class="{'active-p':ruleForm.offline === true,'ml15':true}" @click="ruleForm.offline=true">线下</p>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="服务实施日期" prop="implementationTime">
              <el-date-picker
                v-model="ruleForm.implementationTime"
                class="w280"
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
                :picker-options="dealDateStartOptions"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="服务企业数量" prop="corpNum">
              <el-input
                v-model.trim="ruleForm.corpNum"
                class="w280"
                size="small"
                placeholder="请输入参加企业数量"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <div class="display-flex">
              <el-form-item label="参加人数" prop="personNum">
                <el-input
                v-model.trim="ruleForm.personNum"
                class="w280"
                size="small"
                placeholder="请输入参加人数"
              ></el-input>
            </el-form-item>
            <el-form-item label-width="6px">
              <el-button size="small" @click="downloadFile">下载模板</el-button>
            </el-form-item>
            <el-form-item prop="traineeFile" label-width="0">
              <el-upload
                class="person-upload"
                action="#"
                :auto-upload="false"
                multiple
                :on-change="filePersonChange"
                :on-remove="filePersonRemove"
                :limit="1"
                accept=".xls,.xlsx"
                :file-list="ruleForm.traineeFile"
                >
                <el-button size="small">点击上传</el-button>
              </el-upload>
            </el-form-item>
            </div>
            
          </el-col>
        </el-row>
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
  import { addTrainSummary,downloadFile } from '@/service/accidentManagement'
  import ResourcesService from '@/service/ResourcesService'
  import { dateTest } from '@/util/validate'
  import { validateBigNum } from '@/util/validateFrom'
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  export default {
    name: 'ServiceReport',
    components: {
      Title,
    },
    filters: {},
    props: {
      planDetail:{
        type:Object,
        required:true,
        default:()=>{
          return {}
        }
      },
    },
    data() {
      return {
        data: {},
        activeName: 'first',
        dealDateStartOptions: this.beginDate(),
        ResourcesService: new ResourcesService(),
        tableList: [{}],
        fileList: [],
        ruleForm: {
          id: '', // 计划id
          implementationTime: '', // 检查日期
          checkRemark: '', // 备注
          personNum: '', // 培训人员数量
          corpNum: '', // 培训公司数量
          files: '', // 文件
          offline:false,
          traineeFile:[],
        },
        rules: {
          implementationTime: [
            { required: true, message: '请选择检查日期', trigger: 'change' },
          ],
          checkRemark: [
            { required: true, message: '服务情况说明', trigger: 'blur' },
          ],
          corpNum: [
            { required: true, message: '请输入参加企业数量', trigger: 'blur' },
            { required: true, validator: validateBigNum, trigger: 'blur' },
            {
              pattern: /^[+]{0,1}(\d+)$/,
              message: '请输入正确的企业数量',
            },
          ],
          personNum: [
            { required: true, message: '请输入参加培训人数', trigger: 'blur' },
            { required: true, validator: validateBigNum, trigger: 'blur' },
            {
              pattern: /^[+]{0,1}(\d+)$/,
              message: '请输入正确的培训人数',
            },
          ],
          foundation: [
            { required: true, message: '请输入判断依据', trigger: 'blur' },
          ],
          advice: [
            { required: true, message: '请输入整改建议', trigger: 'blur' },
          ],
          files: [
            { required: true, message: '请上传隐患照片', trigger: 'blur' },
          ],
          traineeFile: [
            { required: true, message: '请上传人员清单', trigger: 'blur' },
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
        if (dateTest(this.ruleForm.implementationTime, this.planDetail.endTime)) {
          this.$message.error('服务实施日期不在服务时间内')
          return
        }
        data.implementationTime = `${data.implementationTime} 00:00:00`
        let formData = new FormData()
        for (let key in data) {
          if (key === 'files') {
            this.fileList.forEach((item=>{
              formData.append('files', item.raw)
            }))
          }else if (key === 'traineeFile') {
            console.log(this.ruleForm.traineeFile);
            this.ruleForm.traineeFile.forEach((item=>{
              formData.append('traineeFile', item.raw)
            }))
          } else {
            formData.append(key, data[key])
          }
        }
        let res = await addTrainSummary(formData, this.$route.query.id)
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
      // 图片上传
      async Upload(file) {
        this.ruleForm.files = file
        const formData = new FormData()
        formData.append('files', file.file)
        console.log(formData)
      },
      beforeAvatarUpload(file) {
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isLt10M) {
          this.$message.error('单文件上限10MB!')
        }
        return isLt10M
      },
      // 文件列表点击上传按钮触发数据
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
      //文件列表检测文件删除
      fileRemove(file, fileList) {
        this.fileList = fileList;
      },
      // 人员清单点击上传按钮触发数据
      filePersonChange(file, fileList) {
        this.ruleForm.traineeFile = fileList;
        console.log(this.ruleForm.traineeFile,fileList);
      },
      // 人员清单检测文件删除
      filePersonRemove(file, fileList) {
        this.ruleForm.traineeFile = fileList;
      },
      onExceed() {
        // this.$message.warning('最多支持10个附件')
      },
      // 设置路由
      async toThisTag() {
        this.$router.go(-1)
      },
      beginDate() {
        let self = this
        return {
          disabledDate(time) {
            let startDate = self.planDetail.startTime
              ? moment(self.planDetail.startTime).subtract(1,'d').format('YYYY-MM-DD')
              : new Date()
            return time.getTime() < new Date(startDate)
          },
        }
      },
      async downloadFile(){
        let form = {
          type:'8',
          name:'培训人员清单模板.xlsx',
        }
        let {code,data} = await downloadFile(form)
        if(code === '0000') {
          this.ResourcesService.downloadOrViewFile(data,true)

        }

      },
    },
  }
</script>

<style scoped lang="less">
  #serviceSummaryType2 {
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
    .custom-button {
      display: flex;
      p {
        margin-top: 5px;
        width: 50px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #A4ADB3;
        border-radius: 4px;
        color: #fff;
        background-color: #A4ADB3;
        cursor: pointer;
      }
      .active-p {
        background-color: #FFA940;
        border: 1px solid #FFA940;
      }
    }
  }
</style>
<style lang="less">
#serviceSummaryType2 {
  .avatar-uploader-icon {
    width: 140px;
    height: 140px;
    line-height: 140px;
  }
  .person-upload {
    .el-upload--text {
      width: 90px;
      border: none;
      height: 40px;
      overflow: none;
    }
  }
}
</style>
