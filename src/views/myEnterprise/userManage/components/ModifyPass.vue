<template>
  <el-dialog
    :title="'修改密码'"
    :visible.sync="dialogModifyPass"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="50%"
    @close="close"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
    >
      <el-form-item label="当前密码：" prop="oldPwd">
        <el-input
          v-model="ruleForm.oldPwd"
          class="w280"
          show-password
          placeholder="请输入当前密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPwd">
        <el-input
          v-model="ruleForm.newPwd"
          class="w280"
          show-password
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="secondPwd">
        <el-input
          v-model="ruleForm.secondPwd"
          class="w280"
          show-password
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogModifyPass = false">取 消</el-button>
      <el-button type="primary" @click="register('ruleForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { modifyPass } from '@/api/userManagement'
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
    var validatePassConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogModifyPass: false,
      ruleForm: {
        newPwd: '',
        oldPwd: '',
        secondPwd: '',
        userCode: '',
        loginAccount: '',
      },
      rules: {
        oldPwd: { required: true, message: '请输入密码', trigger: 'blur' },
        newPwd: [{ required: true, validator: validatePass, trigger: 'blur' }],
        secondPwd: [
          { required: true, validator: validatePassConfirm, trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    clear() {
      this.userCode = ''
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
      this.ruleForm.userCode = ''
      this.ruleForm.loginAccount = ''
    },
    close() {
      this.clear()
    },
    async register(ruleForm) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ModifyPass()
        } else {
          return false
        }
      })
    },
    async ModifyPass() {
      if (this.ruleForm.oldPwd != this.ruleForm.newPwd) {
        let res = await modifyPass(this.ruleForm)
        if (res.code == '0000') {
          this.$baseMessage('修改成功', 'success')
          this.dialogModifyPass = false
        }
      } else {
        this.$message.error('新密码不能与旧密码重复')
      }
    },
  },
}
</script>
<style lang="scss"></style>
