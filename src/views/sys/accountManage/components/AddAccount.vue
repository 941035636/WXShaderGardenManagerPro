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
            v-for="item in roleData"
            :key="item.id"
            :label="item.roleName"
            :value="item.roleCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <div style="margin: 0 0 20px 30px; border: 1px dashed #ccc"></div>
      <!-- @change="userTypeChange" -->
      <el-form-item label="账号类型：" prop="type">
        <el-select
          v-model="ruleForm.type"
          class="w280"
          placeholder="请选择账号类型"
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
      <el-form-item label="" prop="isAdmin" v-if="ruleForm.type == '07'">
        <span>是否管理员：</span>
        <el-switch
          v-model="ruleForm.isAdmin"
          active-text="是"
          inactive-text="否"
          :active-value="true"
          :inactive-value="false"
          @change="switchChange"
        ></el-switch>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.type != '00'"
        label="关联机构："
        prop="entNo"
      >
        <el-select
          v-model="ruleForm.entNo"
          class="w280"
          filterable
          placeholder="请选择机构"
          @change="orgChange"
        >
          <el-option
            v-for="item in orgList"
            :key="item.entNo"
            :label="item.entName"
            :value="item.entNo"
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
      <div v-if="!ruleForm.isAdmin">
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
            :props="{
              value: 'deptNo',
              label: 'deptName',
              children: 'children',
            }"
            :options="branchList"
            v-model.trim="ruleForm.deptNoList"
            @change="depTypeChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="岗位" prop="postNo">
          <el-select
            v-model="ruleForm.postNo"
            class="w280"
            filterable
            placeholder="请选择岗位"
          >
            <el-option
              v-for="item in jobList"
              :key="item.postNo"
              :label="item.postName"
              :value="item.postNo"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
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
import { getPostByDept, getAllList, getByEntNo } from '@/api/branchManage'
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
        isAdmin: true,
        userAccount: '', // 登录账号
        userId: '', // 用户ID
        entNo: '', // 机构id
        orgName: '', // 机构名称
        deptNoList: [], //  选择的部门集合
        deptNoTop: '', // 一级部门
        deptNo: '', // 二级部门
        postNo: '', // 岗位
        phone: '', // 手机号码
        sex: '1', // 性别
      },
      ShowOrg: true, //关联机构是否展示
      orgList: [], // 机构集合
      branchList: [], // 部门集合
      jobList: [], // 岗位集合
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
        type: [{ required: true, message: '请选择用户类型', trigger: 'blur' }],
        entNo: [{ required: true, message: '请选择所属机构', trigger: 'blur' }],
        deptNoList: [
          { required: true, message: '请选择部门', trigger: 'blur' },
        ],
        postNo: [{ required: true, message: '请选择岗位', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
      },
    }
  },
  methods: {
    userTypeChange(val) {
      console.log(val, 'dfdfdf')
      if (val == '00') {
        // 账户类型为江泰管理员时，清空部门岗位等信息
        this.ruleForm.isAdmin = true
        this.ruleForm.entNo = ''
        this.ruleForm.orgName = ''
        this.switchChange()
      }
    },
    orgChange(val) {
      //选择机构
      this.getDepList(val)
    },
    depTypeChange(val) {
      // 选中的部门
      this.ruleForm.deptNoTop = val[0]
      this.ruleForm.deptNo = val[val.length - 1]
      this.ruleForm.postNo = ''
      this.getOrgList(this.ruleForm.deptNo)
    },
    async getBranchList() {
      // 获取机构信息
      let res = await getAllList()
      if (res.code == '0000') {
        this.orgList = res.data
      }
    },
    async getDepList(code) {
      // 获取部门信息
      let res = await getByEntNo(code)
      if (res.code == '0000') {
        this.branchList = this.getTreeData(res.data)
      }
    },
    async getOrgList(code) {
      // 获取岗位信息
      let res = await getPostByDept(code)
      if (res.code == '0000') {
        this.jobList = res.data
      }
    },
    switchChange() {
      if (this.ruleForm.isAdmin) {
        this.ruleForm.deptNoList = [] //  选择的部门集合
        this.ruleForm.deptNoTop = '' // 一级部门
        this.ruleForm.deptNo = '' // 二级部门
        this.ruleForm.postNo = '' // 岗位
        this.ruleForm.orgName = '' // 机构名称
        this.ruleForm.phone = '' // 手机号码
        this.ruleForm.sex = '1' // 性别
      } else if (this.ruleForm.entNo) {
        this.getDepList(this.ruleForm.entNo)
      }
    },
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
    async initData() {
      this.getBranchList()
      if (this.userCode) {
        let res = await getUserDetail(this.userCode)
        if (res.code === '0000') {
          this.ruleForm.isAdmin = JSON.parse(res.data.isAdmin)
          if (!this.ruleForm.isAdmin) {
            this.getDepList(res.data.entNo) // 获取部门信息
            this.getOrgList(res.data.deptNo) // 获取岗位信息
          }
          this.ruleForm.userId = res.data.id
          this.ruleForm.entNo = res.data.entNo
          this.ruleForm.name = res.data.name
          this.ruleForm.phone = res.data.userPhone
          this.ruleForm.sex = Number(res.data.sex)
          if (res.data.roleCodes) {
            this.ruleForm.roleCodes = res.data.roleCodes.split(',')
          }
          this.ruleForm.type = res.data.type
          this.ruleForm.userAccount = res.data.userAccount
          this.ruleForm.postNo = res.data.postNo
          this.ruleForm.deptNoList = res.data.deptNo
            ? [res.data.deptNoTop, res.data.deptNo]
            : []
          this.ruleForm.deptNoTop = res.data.deptNoTop
          this.ruleForm.deptNo = res.data.deptNo
        }
        console.log(this.ruleForm, '-------------')
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
      this.ruleForm.entNo = ''
      this.ruleForm.orgName = ''
      this.ruleForm.orgList = []
      this.ruleForm.orgName = '' // 机构名称
      this.ruleForm.deptNoList = [] //  选择的部门集合
      this.ruleForm.deptNoTop = '' // 一级部门
      this.ruleForm.deptNo = '' // 二级部门
      this.ruleForm.postNo = '' // 岗位
      this.ruleForm.orgName = '' // 机构名称
      this.ruleForm.phone = '' // 手机号码
      this.ruleForm.sex = '1' // 性别
      this.ruleForm.isAdmin = true
    },
    close() {
      this.clear()
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
