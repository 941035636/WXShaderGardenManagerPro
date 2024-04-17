<template>
  <div id="serviceSummaryType2">
    <Title title="服务总结"></Title>
    <div class="mb10 mt10 display-flex">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="200px"
      >
        <el-form-item label="服务情况说明" prop="preContent">
          <el-input
            v-model.trim="ruleForm.preContent"
            class="w280"
            size="small"
            type="textarea"
            placeholder="请输入服务情况说明"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务照片">
          <el-upload
            list-type="picture-card"
            :file-list="fileList"
            :action="this.baseURL + `/files/v1/upload/file`"
            name="file"
            :headers="headers"
            :limit="9"
            :on-change="handleEditChange"
            :class="{ hide: hideUploadBtn }"
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
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import { addAssessmenSummary } from '@/api/accidentManagement'
import { mapGetters } from 'vuex'
import { baseURL } from '@/config'
import { uploadFile } from '@/api/policyManagement'
import store from '@/store'
export default {
  name: 'serviceSummaryType2',
  components: {
    Title,
  },
  filters: {},
  props: {},
  data() {
    return {
      hideUploadBtn: false,
      data: {},
      headers: {
        authorization: store.getters['user/accessToken'],
      },
      baseURL: baseURL,
      activeName: 'first',
      btnLoading: false,
      dealDateStartOptions: this.beginDate(),
      tableList: [{}],
      upLoadData: {},
      fileList: [],
      ruleForm: {
        id: '', // 计划id
        planStatus: '',
        preContent: '', // 备注
        fileIds: [], // 文件
      },
      imageUrl: '',
      rules: {
        preContent: [
          { required: true, message: '请输入服务情况说明', trigger: 'blur' },
          {
            min: 2,
            max: 200,
            message: '字符2-200位',
          },
        ],

        fileIds: [{ required: true, message: '请上传照片', trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapGetters({
      getEnumAll: 'getEnumAll',
    }),
    getTitle() {
      let objName = this.getEnumAll.AccidentTypeEnum[this.$route.query.preType]
      let name = `服务总结（${objName}）`
      return name
    },
  },
  mounted() {},
  methods: {
    handleEditChange(file, fileList) {
      this.hideUploadBtn = fileList.length >= 9
    },
    async initData(val) {
      this.dialogVisible = true
      // this.ruleForm.accidentPreProjectId = val.id
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
      let data = {}
      data.fileIds = this.fileList.map((item) => {
        return item.id
      })
      data.preContent = this.ruleForm.preContent
      data.planStatus = this.ruleForm.planStatus
      data.id = this.$route.query.id
      let res = await addAssessmenSummary(data, this.$route.query.id)
      if (res.code === '0000') {
        this.$emit('getMsg', '')
      }
    },
    register(e) {
      this.ruleForm.planStatus = e
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

    handleAvatarSuccess(res, file) {
      if (res.code == '0000') {
        this.fileList.push({
          uid: file.uid,
          url: URL.createObjectURL(file.raw),
          id: res.data.id,
        })
      }
    },

    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 20
      if (!isLt10M) {
        this.$message.error('单文件上限20MB!')
      }
      return isLt10M
    },
    onExceed() {},

    //检测文件删除
    fileRemove(file, fileList) {
      console.log(file)
      this.fileList = this.fileList.filter((item) => {
        return item.uid != file.uid
      })
      console.log(this.fileList, 'afterDelete')
      this.fileList = fileList
      this.hideUploadBtn = fileList.length >= 9
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

<style scoped lang="scss">
#serviceSummaryType2 {
  margin: 0px 20px;
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
<style lang="scss">
#serviceSummaryType2 {
  .avatar-uploader-icon {
    width: 140px;
    height: 140px;
    line-height: 140px;
  }
}
// 隐藏上传组件
.hide {
  .el-upload--picture-card {
    display: none !important;
  }
}
</style>
