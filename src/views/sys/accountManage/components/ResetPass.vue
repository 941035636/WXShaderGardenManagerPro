<template>
  <el-dialog
    :title="'重置密码'"
    :visible.sync="dialogResetPass"
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
      <el-form-item label="登录用户名：" prop="loginAccount">
        <span>{{ ruleForm.loginAccount }}</span>
      </el-form-item>
      <el-form-item label="设置新密码：" prop="newPwd">
        <el-input
          v-model="ruleForm.newPwd"
          class="w280"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogResetPass = false">取 消</el-button>
      <el-button type="primary" @click="register('ruleForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import { resetPass } from '@/api/userManagement'
  import { passwordLevel } from '@/utils/validate'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (
          value.length > 16 ||
          value.length < 8 ||
          passwordLevel(value) != 3
        ) {
          callback(new Error('密码必须为8-16位大小写字母和数字和符号组合哦！'))
        } else {
          if (this.ruleForm.newPwd !== '') {
            this.$refs.ruleForm.validateField('confirmPassword')
          }
          callback()
        }
      }
      return {
        dialogResetPass: false,
        ruleForm: {
          newPwd: '',
          loginAccount: '',
          userCode: '',
        },
        rules: {
          newPwd: { required: true, validator: validatePass, trigger: 'blur' },
        },
      }
    },
    methods: {
      clear() {
        this.ruleForm.newPwd = ''
        this.ruleForm.userCode = ''
        this.ruleForm.loginAccount = ''
      },
      close() {
        this.clear()
      },
      register(ruleForm) {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.resetPass()
          } else {
            return false
          }
        })
      },
      async resetPass() {
        let res = await resetPass(this.ruleForm)
        console.log(res)
        if (res.code == '0000') {
          this.$baseMessage('重置成功', 'success')
          this.dialogResetPass = false
        }
      },
    },
  }
</script>
<style lang="scss"></style>
