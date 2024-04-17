<template>
  <div id="serviceSummaryType1">
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
         
        <el-form-item prop="enterpriseParams" label="服务企业清单">
               
          <el-button
            size="mini"
            v-if="ruleForm.isEnterprises"
            @click="uploadfile"
            plain
          >
            上传清单
          </el-button>
             
          <span
            class="ml10"
            v-if="ruleForm.enterpriseParams && ruleForm.enterpriseParams.length"
          >
                共{{ ruleForm.enterpriseParams.length }}家企业，
            <el-button @click="openEnterPrise" type="text" class="ckBtn">
              点击查看
            </el-button>
                   
          </span>
               
        </el-form-item>
             
        <el-form-item label="参加人员数量">
                 
          <el-input
            maxlength="9"
            v-model.number="ruleForm.personNum"
            class="w300"
            size="small"
          >
                     
            <template slot="append">人</template>
                   
          </el-input>
               
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
    <import-company @getMsg="getMsg" ref="importCompany" />
  </div>
</template>

<script>
import Title from '@/components/Title'
import { baseURL } from '@/config'

import store from '@/store'
import { addAssessmenSummary } from '@/api/accidentManagement'
import {
  validatePersonNum,
  validateName,
  validatePhone,
  validateRemark,
} from '@/utils/validateFrom'
import { mapGetters } from 'vuex'
import { validateNumMinOrMax } from '@/utils/validateFrom'
import ImportCompany from '../../components/importCompany.vue'
export default {
  name: 'serviceSummaryType1',
  components: {
    Title,
    ImportCompany,
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
        enterpriseParams: [],
        serviceType: null,
        personNum: '',
        files: [],
      },
      rules: {
        serviceType: [
          {
            required: true,
            message: '请选择服务形式',
            trigger: 'blur',
          },
        ],
        enterpriseParams: [
          {
            required: true,
            message: '请上传文件',
            trigger: 'blur',
          },
        ],
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
    openEnterPrise() {
      this.$refs.importCompany.dialogVisible = true
      this.$refs.importCompany.activeName = '1'
      this.$refs.importCompany.isEnterprises = this.ruleForm.isEnterprises
      let enterpriseParamss = JSON.parse(
        JSON.stringify(this.ruleForm.enterpriseParams)
      )
      this.$refs.importCompany.tableData = enterpriseParamss
    },
    getMsg(data) {
      this.$set(this.ruleForm, 'enterpriseParams', data)
      // this.ruleForm.enterpriseParams = data
    },
    uploadfile() {
      this.$refs.importCompany.dialogVisible = true
    },
    async configRegister() {
      let data = {}
      data.fileIds = this.fileList.map((item) => {
        return item.id
      })
      data.enterpriseParams = JSON.stringify(this.ruleForm.enterpriseParams)
      data.planStatus = this.ruleForm.planStatus
      data.serviceType = this.ruleForm.serviceType
      data.personNum = this.ruleForm.personNum
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
#serviceSummaryType1 {
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
#serviceSummaryType1 {
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
