<template>
  <el-dialog
    :title="ruleForm['userId'] ? '修改用户' : '新增用户'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    @open="initData"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
    >
      <el-form-item
        v-if="!ruleForm['userId']"
        label="登录用户名："
        prop="userAccount"
      >
        <el-input
          v-model="ruleForm.userAccount"
          clearable
          class="w280"
          maxlength="30"
          show-word-limit
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm['userId']" label="登录用户名：">
        <span>{{ ruleForm.userAccount }}</span>
      </el-form-item>

      <el-form-item
        v-if="!ruleForm['userId']"
        label="登录密码："
        :prop="ruleForm['userId'] ? '' : 'password'"
      >
        <el-input
          v-model="ruleForm.password"
          class="w280"
          show-password
          placeholder="请输入登录密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="!ruleForm['userId']"
        label="确认密码："
        :prop="ruleForm['userId'] ? '' : 'confirmPassword'"
      >
        <el-input
          v-model="ruleForm.confirmPassword"
          class="w280"
          show-password
          placeholder="请输入确认密码"
        ></el-input>
      </el-form-item>
      <!-- <div style="margin: 0 0 20px 30px; border: 1px dashed #ccc"></div> -->
      <el-form-item label="姓别：" prop="name">
        <el-input
          v-model="ruleForm.name"
          class="w280"
          placeholder="请输入姓别"
        ></el-input>
      </el-form-item>
      <!-- @change="userTypeChange" -->
      <el-form-item label="部门：" prop="type">
        <el-select
          v-model="ruleForm.type"
          class="w280"
          placeholder="请选择部门"
          @change="userTypeChange"
        >
          <el-option
            v-for="item in typeData"
            :key="item.strCode"
            :label="item.label"
            :value="item.strCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ShowOrg" label="岗位：" prop="orgId">
        <el-select
          v-model="ruleForm.orgId"
          class="w280"
          filterable
          placeholder="请选择岗位"
          @change="orgChange"
        >
          <el-option
            v-for="item in orgList"
            :key="item.orgId"
            :label="item.name"
            :value="item.orgId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色：" prop="roleCodes">
        <el-select
          v-model="ruleForm.roleCodes"
          class="w280"
          multiple
          placeholder="请选择角色"
        >
          <el-option
            v-for="item in roleData"
            :key="item.id"
            :label="item.roleName"
            :value="item.roleCode"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="register">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validateUserName } from '@/utils/validateFrom'
import { passwordLevel } from '@/utils/validate'
import { getUserDetail, getOrgList, register } from '@/api/userManagement'
export default {
  name: 'AddOrAlter',
  props: {
    typeData: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
    roleData: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
  },
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
        if (this.ruleForm.password !== '') {
          this.$refs.ruleForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    var validatePassConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      ruleForm: {
        confirmPassword: '', // 确认密码
        name: '', // 用户姓名
        password: '', // 密码
        roleCodes: [], // 角色编码集合，逗号拼接
        type: '', // 账号类型 01-生产经营单位 02-政府监管 03-保险机构 04-保险经纪机构 05-三方服务机构 06-安全专家
        userAccount: '', // 登录账号
        userId: '', // 用户ID
        orgId: '', // 机构id
        orgName: '', // 机构名称
      },
      ShowOrg: true, //关联机构是否展示
      orgList: [], // 机构集合
      userCode: '',
      rules: {
        userAccount: [
          { required: true, validator: validateUserName, trigger: 'blur' },
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, validator: validatePassConfirm, trigger: 'blur' },
        ],
        roleCodes: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择用户类型', trigger: 'blur' }],
        orgId: [{ required: true, message: '请选择所属机构', trigger: 'blur' }],
      },
    }
  },
  methods: {
    userTypeChange(val) {
      // 选中账号类型
      if (val == '00') {
        this.ShowOrg = false
      } else {
        this.ShowOrg = true
      }
      this.ruleForm.orgId = ''
      this.getOrgList(val)
    },
    orgChange(val) {
      // 选择机构
      this.ruleForm.orgName = this.orgList.find(
        (item) => item.orgId == val
      ).name
    },
    async initData() {
      console.log(this.ruleForm, '-----++++++-----')
      if (!this.userCode) {
        return false
      }
      let res = await getUserDetail(this.userCode)
      if (res.code === '0000') {
        this.getOrgList(res.data.type)
        this.ruleForm.name = res.data.name
        if (res.data.roleCodes) {
          this.ruleForm.roleCodes = res.data.roleCodes.split(',')
        }
        this.ruleForm.type = res.data.type
        if (res.data.type == '00') {
          this.ShowOrg = false
          this.ruleForm.orgId = ''
        } else {
          this.ShowOrg = true
        }
        this.ruleForm.userAccount = res.data.userAccount
        this.ruleForm.userId = res.data.id
        setTimeout(() => {
          if (!this.orgList) {
            this.orgList = new Array()
          }
          this.orgList.push({
            orgId: res.data.orgId,
            name: res.data.orgName,
          })
          this.ruleForm.orgId = res.data.orgId
        }, 500)
      }
      console.log(this.ruleForm, '-------------')
    },
    async getOrgList(code) {
      // 获取机构列表接口
      let data = {
        pn: 1,
        ps: 999,
        name: '',
        accountType: code,
      }
      let res = await getOrgList(data)
      if (res.code == '0000') {
        this.orgList = res.list
      }
    },
    clear() {
      this.userCode = ''
      this.ruleForm.userId = ''
      this.ruleForm.confirmPassword = ''
      this.ruleForm.name = ''
      this.ruleForm.password = ''
      this.ruleForm.roleCodes = []
      this.ruleForm.type = ''
      this.ruleForm.userAccount = ''
      this.ruleForm.userId = ''
      this.ruleForm.orgId = ''
      this.ruleForm.orgName = ''
      this.orgList = []
    },
    close() {
      console.log(this.ruleForm, '==中控前====')
      this.clear()
      console.log(this.ruleForm, '========')
    },
    async configRegister() {
      let data = JSON.parse(JSON.stringify(this.ruleForm))
      data.roleCodes = data.roleCodes.join(',') // 角色可添加多个
      let res = await register(data)
      if (res.code === '0000') {
        this.$baseMessage(
          this.ruleForm.userId ? '修改成功' : '添加成功',
          'success'
        )
        this.$parent.getUserList()
        this.dialogVisible = false
      }
    },
    register() {
      let text = '确定要新增用户？'
      if (this.ruleForm['userId']) {
        text = '确定要修改用户？'
      }
      this.$baseConfirm(
        text,
        '',
        () => {
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              this.configRegister()
            } else {
              return false
            }
          })
        },
        () => {
          // this.$baseMessage('已取消', 'info')
        }
      )
      return
    },
  },
}
</script>

<style lang="scss"></style>
