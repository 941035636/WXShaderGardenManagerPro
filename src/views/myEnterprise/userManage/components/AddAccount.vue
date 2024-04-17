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
      <el-form-item label="角色：" prop="roleCodes">
        <el-select
          v-model="ruleForm.roleCodes"
          class="w280"
          multiple
          placeholder="请选择角色"
        >
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.roleCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <div style="margin: 0 0 20px 30px; border: 1px dashed #ccc"></div>
      <el-form-item label="姓名：" prop="name">
        <el-input
          v-model="ruleForm.name"
          class="w280"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone">
        <el-input
          v-model="ruleForm.phone"
          class="w280"
          placeholder="请输入手机号码"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="ruleForm.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="部门" prop="deptNoList">
        <el-cascader
          ref="nationalAddr"
          class="w280"
          :props="{ value: 'deptNo', label: 'deptName', children: 'children' }"
          :options="branchList"
          v-model.trim="ruleForm.deptNoList"
          @change="userTypeChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="岗位" prop="postNo">
        <el-select
          v-model="ruleForm.postNo"
          class="w280"
          filterable
          placeholder="请选择岗位"
          @change="orgChange"
        >
          <el-option
            v-for="item in jobList"
            :key="item.postNo"
            :label="item.postName"
            :value="item.postNo"
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
import { validateUserName, validatePhone } from '@/utils/validateFrom'
import { passwordLevel } from '@/utils/validate'
import { getUserDetail, register } from '@/api/userManagement'
import { getPostByDept } from '@/api/branchManage'
export default {
  name: 'AddOrAlter',
  props: {
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
        deptNoTop: '', // 一级部门
        deptNo: '', // 二级部门
        deptNoList: [], //  选择的部门集合
        userAccount: '', // 登录账号
        userId: '', // 用户ID
        postNo: '', // 岗位
        orgName: '', // 机构名称
        phone: '', // 手机号码
        sex: 1, // 性别
        type: '07',
      },
      ShowOrg: true, //关联机构是否展示
      orgList: [], // 机构集合
      branchList: [], // 部门集合
      jobList: [], // 岗位集合
      roleList: [],
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
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度为1到50位' },
        ],
        deptNoList: [
          { required: true, message: '请选择部门', trigger: 'blur' },
        ],
        postNo: [{ required: true, message: '请选择岗位', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
      },
    }
  },
  created() {},
  methods: {
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
        } else {
          this.getTreeData(data[i].children)
        }
      }

      return data
    },
    userTypeChange(val) {
      // 选中账号类型
      this.ruleForm.deptNoTop = val[0]
      this.ruleForm.deptNo = val[val.length - 1]
      this.ruleForm.postNo = ''
      this.getOrgList(this.ruleForm.deptNo)
    },
    orgChange(val) {
      // 选择机构
      // this.ruleForm.orgName = this.orgList.find(
      //   (item) => item.postNo == val
      // ).name
    },
    async initData() {
      console.log(this.ruleForm, '-----++++++-----')
      if (!this.userCode) {
        return false
      }
      let res = await getUserDetail(this.userCode)
      if (res.code === '0000') {
        this.getOrgList(res.data.deptNo)
        this.ruleForm.name = res.data.name
        this.ruleForm.phone = res.data.userPhone
        this.ruleForm.sex = Number(res.data.sex)
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
        this.ruleForm.postNo = res.data.postNo
        this.ruleForm.deptNoList = [res.data.deptNoTop, res.data.deptNo]
        this.ruleForm.deptNoTop = res.data.deptNoTop
        this.ruleForm.deptNo = res.data.deptNo
      }
      console.log(this.ruleForm, '-------------')
    },
    async getOrgList(code) {
      // 获取岗位列表接口
      if (code) {
        let res = await getPostByDept(code)
        if (res.code == '0000') {
          this.jobList = res.data
        }
      }
    },
    clear() {
      this.type = '07'
      this.userCode = ''
      this.ruleForm.userId = ''
      this.ruleForm.confirmPassword = ''
      this.ruleForm.name = ''
      this.ruleForm.password = ''
      this.ruleForm.roleCodes = []
      this.ruleForm.deptNo = ''
      this.ruleForm.userAccount = ''
      this.ruleForm.userId = ''
      this.ruleForm.postNo = ''
      this.orgList = []
      this.ruleForm.phone = ''
      this.ruleForm.sex = 1
      this.ruleForm.deptNoList = []
      // this.$nextTick(() => {
      //   this.$refs['ruleForm'].resetFields()
      // })
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
