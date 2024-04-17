<template>
  <div id="serviceSummaryType7">
    <Title title="服务总结"></Title>
    <div class="mb10 mt10 display-flex">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="200px"
      >
        <el-form-item label="服务形式" prop="serviceType">
          <el-radio-group v-model="ruleForm.serviceType">
            <el-radio :label="2">线下</el-radio>
            <el-radio :label="1">线上</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="服务情况说明" prop="preContent">
          <el-input
            v-model="ruleForm.preContent"
            class="w600"
            type="textarea"
            placeholder="请输入"
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
import { baseURL } from '@/config'

import store from '@/store'
import { addAssessmenSummary } from '@/api/accidentManagement'
import {
  validateTelephone,
  validateName,
  validatePhone,
  validateRemark,
} from '@/utils/validateFrom'
import { mapGetters } from 'vuex'
import { validateNumMinOrMax } from '@/utils/validateFrom'
export default {
  name: 'serviceSummaryType7',
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
      upLoadData: {},
      fileList: [],
      ruleForm: {
        id: '', // 计划id
        preContent: '', // 备注
        serviceType: 0,
        planStatus: '',
      },
      rules: {
        serviceType: [{ required: true, message: '请选择', trigger: 'blur' }],
        preContent: [
          { required: true, message: '请输入服务情况说明', trigger: 'blur' },
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
      getEnumAll: 'getEnumAll',
    }),
  },
  mounted() {},
  methods: {
    handleEditChange(file, fileList) {
      this.hideUploadBtn = fileList.length >= 9
    },
    async configRegister() {
      let data = {}
      data.fileIds = this.fileList.map((item) => {
        return item.id
      })
      data.preContent = this.ruleForm.preContent
      data.planStatus = this.ruleForm.planStatus
      data.serviceType = this.ruleForm.serviceType
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
  },
}
</script>

<style scoped lang="scss">
#serviceSummaryType7 {
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
#serviceSummaryType7 {
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
