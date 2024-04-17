<template>
  <el-dialog id="regUser" :title="title" :visible.sync="regUserShow" :before-close="handleClose"
    :show-close="!isButLoading" :close-on-click-modal="!isButLoading" :close-on-press-escape="!isButLoading"
    width="550px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
      <el-form-item label="企业名称" prop="orgName">
        <el-input size="small" v-model.trim="ruleForm.orgName" placeholder="请输入企业名称" class="item4"></el-input>
      </el-form-item>
      <el-form-item label="社会信用代码" prop="blCode">
        <el-input size="small" v-model.trim="ruleForm.blCode" placeholder="请输入统一社会信用代码" class="item4"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" round @click="handleCancel" :disabled="isButLoading" class="close">取消</el-button>
      <el-button type="warning" round @click="confirm('ruleForm')" :loading="isButLoading" style="background: #FFA940">
        确定提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addBatchadd, updateBatchadd } from '@/api/enterpriseRegister'
import { validateBlCodeGZ } from '@/utils/validateFrom'
export default {
  data() {
    return {
      isButLoading: false,
      regUserShow: false,
      title: "添加企业", //标题
      ruleForm: {
        id: '',
        orgName: '',
        blCode: ''
      },
      rules: {
        orgName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          { pattern: /^[A-Za-z\u4e00-\u9fa5-()（）]{1,50}$/, message: '企业名称支持1-50位汉字、字母', trigger: 'blur' }
        ],
        blCode: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
          { validator: validateBlCodeGZ, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCancel() {
      this.regUserShow = false;
      this.closeHandleContent();
    },
    closeHandleContent() {
      // 关闭弹框清空表单数据
      this.ruleForm = {
        id: '',
        blCode: '',
        orgName: '',
      }
    },
    handleClose(done) {
      this.closeHandleContent();
      done();
    },
    // 提交注册
    async submit() {
      if (this.ruleForm.id != '') {
        let { code, data } = await updateBatchadd(this.ruleForm)
        if (code == '0000') {
          this.isButLoading = false
          this.$message.success(data)
          this.regUserShow = false;
          this.$emit("handleQuery")
          this.closeHandleContent()
        }
        return
      }
      let { code, data } = await addBatchadd(this.ruleForm)
      if (code == '0000') {
        this.isButLoading = false
        this.$message.success(data)
        this.regUserShow = false;
        this.$emit("handleQuery")
        this.closeHandleContent()
      }
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isButLoading = true;
          this.submit()
        } else {
          return false;
        }
      });
    },
    async search() { // 企查猫查询企业
      if (this.ruleForm.orgName) {
        const res = await this.policyentryService.getAccessinformation(this.ruleForm.orgName);
        if (res.code == '0000') {
          this.ruleForm.bl = res.data.creditCode;
          this.$message({
            message: "查询成功",
            type: "success"
          });
        }
      } else {
        this.$message({
          message: "请输入企业名称",
          type: "warning"
        });
      }
    },
  }
}
</script>

<style lang="scss" scoped>
#regUser {
  .item4 {
    width: 280px;
  }

  .search-icon {
    margin-left: 10px;
  }

  .item1 {
    width: 200px;
    margin-right: 20px;
  }

  .item2 {
    width: 250px;
  }

  .item5 {
    width: 300px;
  }

  .content-tips {
    display: inline-block;
    height: 34px;
    line-height: 34px;
    background-color: #DBF9EF;
    color: #34C697;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .dialog-footer {
    button {
      padding: 10px 20px;
      border: none;
    }
  }

  .close {
    color: #5A5A5A;
    background: #E9E9E9;

  }
}
</style>