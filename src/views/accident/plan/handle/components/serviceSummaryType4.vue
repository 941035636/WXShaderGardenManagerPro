<template>
  <div id="serviceSummaryType4">
    <Title title="总结" class="mb10"></Title>

    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
    >
      <el-form-item label="安全评分" prop="safetyScore">
        <el-input
          v-model.number="ruleForm.safetyScore"
          class="w280"
          size="small"
          type="input"
          placeholder="请输入"
          :maxlength="9"
        ></el-input>
      </el-form-item>

      <el-form-item label="安全等级" prop="safetyLevel">
        <el-radio-group v-model="ruleForm.safetyLevel">
          <el-radio
            v-for="item in getStrEnumAll.AccidentSafetyLevelEnum"
            :key="item.strCode"
            :label="item.strCode"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="服务情况说明" prop="preContent">
        <el-input
          type="textarea"
          v-model.trim="ruleForm.preContent"
          class="w480"
          size="small"
          resize="none"
          placeholder="请输入"
        ></el-input>
      </el-form-item>

      <el-form-item label="服务照片">
        <el-upload
          list-type="picture-card"
          :file-list="fileList"
          :multiple="false"
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
</template>

<script>
import { addAssessmenSummary } from '@/api/accidentManagement'
import Title from '@/components/Title'

import { mapGetters } from 'vuex'

import store from '@/store'
import { baseURL } from '@/config'
export default {
  name: 'serviceSummaryType4',
  components: {
    Title,
  },
  data() {
    // 数字校验
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入内容'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数值'))
        } else if (!/(^[1-9]\d*$)/.test(value)) {
          callback(new Error('请输入正整数'))
        } else {
          callback()
        }
      }, 100)
    }
    return {
      hideUploadBtn: false,
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 },
      ],
      activeName: 'first',
      tableList: [{}],

      //附件
      fileList: [],
      headers: {
        authorization: store.getters['user/accessToken'],
      },
      baseURL: baseURL,
      upLoadData: {},

      ruleForm: {
        id: '', //计划id
        planStatus: '', //  计划状态 1,待进行 2 ，未完成 3，已完成
        preContent: '', //总结服务情况描述
        safetyScore: '', //   安全评分
        safetyLevel: '', // 安全等级
        fileIds: '', //  文件ID集合
      },
      rules: {
        safetyScore: [{ validator: checkAge, trigger: 'blur', required: true }],
        safetyLevel: [
          { required: true, message: '请选择安全等级', trigger: 'change' },
        ],

        preContent: [
          { required: true, message: '请输入服务情况', trigger: 'blur' },
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
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
  },
  created() {
    console.log(this.ruleForm, 'created')
  },
  mounted() {},
  methods: {
    handleEditChange(file, fileList) {
      this.hideUploadBtn = fileList.length >= 9
    },
    // 提交
    async configRegister(e) {
      // let data = {}

      //  id: '', //计划id
      // planStatus: '', //  计划状态 1,待进行 2 ，未完成 3，已完成
      // preContent: '', //总结服务情况描述
      // safetyScore: '', //   安全评分
      // safetyLevel: '', // 安全等级
      // fileIds: '', //  文件ID集合
      let data = {}
      data.preContent = this.ruleForm.preContent
      data.safetyScore = this.ruleForm.safetyScore
      data.safetyLevel = this.ruleForm.safetyLevel

      data.id = this.$route.query.id
      data.planStatus = e
      data.fileIds = this.fileList.map((item) => {
        return item.id
      })

      let res = await addAssessmenSummary(data, this.$route.query.id)
      if (res.code === '0000') {
        this.$emit('getMsg', '')
      }
    },

    register(e) {
      console.log(this.$refs['ruleForm'].validate())

      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.configRegister(e)
        } else {
          return false
        }
      })
    },

    // 提交照片
    handleAvatarSuccess(res, file, fileList) {
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
#serviceSummaryType4 {
  margin: 0px 20px 20px;
  .w480 {
    width: 480px !important;
  }
  // element-ui

  // 上传图片样式
  .avatar-uploader-icon {
    width: 140px;
    height: 140px;
    line-height: 140px;
  }
  .project-type {
    display: inline-block;
    padding: 2px 10px;
    background-color: #e6f7ff;
    color: #096dd9;
    border-radius: 20px;
  }

  // Element-ui 样式修改

  // 单选框

  .el-radio__input .is-checked .el-radio__inner {
    border-color: #1989fa !important;
    background-color: #1989fa !important;
  }

  //图片上传样式
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
