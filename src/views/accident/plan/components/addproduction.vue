<template>
  <el-dialog
    id="addproduction"
    :title="title"
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
      <el-form-item label="问题描述" prop="problemDesc">
        <el-input
          v-model.trim="ruleForm.problemDesc"
          class="w300"
          size="small"
          type="input"
          placeholder="请输入"
        ></el-input>
      </el-form-item>

      <el-form-item label="问题扣分" prop="deductPoints">
        <el-input
          v-model.number="ruleForm.deductPoints"
          class="w300"
          size="small"
          placeholder="请输入"
          :maxlength="9"
        ></el-input>
      </el-form-item>

      <el-form-item label="附件">
        <!-- 
          list-type="picture-card"  //显示为图片  
         
         -->
        <el-upload
          :multiple="false"
          :file-list="fileList"
          :action="this.baseURL + `/files/v1/upload/file`"
          name="file"
          :headers="headers"
          :limit="9"
          :data="upLoadData"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-remove="fileRemove"
          accept=".pdf, .PDF, .zip, .ZIP, .rar, .RAR, .png, .jpg"
          :on-exceed="onExceed"
        >
          <!-- <i class="el-icon-plus avatar-uploader-icon"></i> -->

          <el-button size="small" type="primary">上传附件</el-button>

          <span class="upload_age el-upload__tip" slot="tip">
            支持扩展名：.pdf .PDF .zip .ZIP .rar .RAR .png, .jpg
          </span>
        </el-upload>
      </el-form-item>
    </el-form>
    <a href=""></a>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="register">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addRecord, putRecord } from '@/api/accidentManagement.js' //添加 or 更新

import store from '@/store'
import { baseURL } from '@/config'
export default {
  name: 'addproduction',
  props: {},
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
      dialogVisible: false, //控制显隐
      title: '添加记录', //弹出框名字

      //附件
      addfileList: [],
      fileList: [],
      headers: {
        authorization: store.getters['user/accessToken'],
      },
      baseURL: baseURL,
      upLoadData: {},

      ruleForm: {
        recordType: '', //04 记集类型安全生产标准化建设 05：生产安全犷故应急预案编制和演练”
        accidentPreProjectId: '', //事故预防项目 id
        accidentPrePlanId: '', //事故预防计划id
        problemDesc: '', //问题描述
        deductPoints: '', //问题扣分
        scene: '', //针对场景”
      },
      imageUrl: '',
      rules: {
        problemDesc: [
          { required: true, message: '请输入问题描述', trigger: 'blur' },
          {
            min: 2,
            max: 200,
            message: '字符2-200位',
          },
        ],
        deductPoints: [
          { validator: checkAge, trigger: 'blur', required: true },
        ],
      },
    }
  },
  computed: {},
  mounted() {},
  methods: {
    async initData(val, row) {
      if (row) {
        this.title = '修改记录'
        this.dialogVisible = true
        let { accidentPreRecordEntity, fileRecordEntities } = row

        for (let key in this.ruleForm) {
          if (
            key == 'accidentPreProjectId' ||
            key == 'accidentPrePlanId' ||
            key == 'problemDesc'
          ) {
            this.ruleForm[key] = accidentPreRecordEntity[key].toString()
          } else if (key === 'deductPoints') {
            this.ruleForm[key] = Number(accidentPreRecordEntity[key])
          } else if (key === 'scene') {
            this.ruleForm[key] = ''
          }
        }
        this.ruleForm.id = accidentPreRecordEntity.id

        this.fileList = fileRecordEntities ? fileRecordEntities : []
      } else {
        this.title = '添加记录'
        this.dialogVisible = true
        this.ruleForm.recordType = this.$route.query.preType //04 记集类型安全生产标准化建设 05：生产安全犷故应急预案编制和演练”
        this.ruleForm.accidentPreProjectId = val.accidentPreProjectId
          ? val.accidentPreProjectId
          : '' //事故预防项目 id
        this.ruleForm.accidentPrePlanId = val.id ? val.id : '' //事故预防计划id

        this.ruleForm.problemDesc = '' //问题描述
        this.ruleForm.deductPoints = '' //问题扣分
        this.fileList = [] //附件信息
      }
    },

    clear() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
        this.fileList = [] //附件信息
      })
      for (let key in this.ruleForm) {
        this.ruleForm[key] = ''
      }
      this.ruleForm.id = ''
    },
    close() {
      this.clear()
    },

    // 添加接口
    async configRegister() {
      let data = JSON.parse(JSON.stringify(this.ruleForm))
      if (this.fileList) {
        data.fileIds = this.fileList.map((item) => {
          return item.id
        })
      } else {
        data.fileIds = []
      }

      console.log('传递参数')
      let res = null
      // 添加
      if (this.title == '修改记录') {
        res = await putRecord(data, data.id)
      } else {
        res = await addRecord(data)
      }

      console.log(res)

      if (res.code === '0000') {
        this.$baseMessage('成功', 'success')
        this.$emit('successCb')
        this.fileList = []
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

    // 上传 方法
    // 照片
    handleAvatarSuccess(res, file) {
      if (res.code == '0000') {
        console.log(res)

        console.log(typeof this.fileList)

        this.fileList.push({
          name: file.name,
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
      this.fileList = this.fileList.filter((item) => {
        return item.uid != file.uid
      })
    },

    // 去掉重复数据
    removeDuplicates(arr) {
      const result = []
      const duplicatesIndices = []
      // Loop through each item in the original array
      arr.forEach((current, index) => {
        if (duplicatesIndices.includes(index)) return
        result.push(current)
        // Loop through each other item on array after the current one
        for (
          let comparisonIndex = index + 1;
          comparisonIndex < arr.length;
          comparisonIndex++
        ) {
          const comparison = arr[comparisonIndex]
          const currentKeys = Object.keys(current)
          const comparisonKeys = Object.keys(comparison)
          // Check number of keys in objects
          if (currentKeys.length !== comparisonKeys.length) continue
          // Check key names
          const currentKeysString = currentKeys.sort().join('').toLowerCase()
          const comparisonKeysString = comparisonKeys
            .sort()
            .join('')
            .toLowerCase()
          if (currentKeysString !== comparisonKeysString) continue
          // Check values
          let valuesEqual = true
          for (let i = 0; i < currentKeys.length; i++) {
            const key = currentKeys[i]
            if (current[key] !== comparison[key]) {
              valuesEqual = false
              break
            }
          }
          if (valuesEqual) duplicatesIndices.push(comparisonIndex)
        } // end for loop
      }) // end arr.forEach()
      return result
    },
  },
}
</script>

<style lang="scss">
#addproduction .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
#addproduction .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
#addproduction .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
#addproduction .avatar {
  width: 148px;
  height: 148px;
  display: block;
}

// 附件提示文字
.upload_age {
  color: rgba(0, 0, 0, 0.45);
  margin-left: 20px;
}
</style>

<style lang="scss" scoped>
#addproduction {
}
</style>
