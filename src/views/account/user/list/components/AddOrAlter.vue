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
      <el-form-item label="系统登录账号：" prop="userAccount">
        <el-input
          v-model="ruleForm.userAccount"
          class="w280"
          placeholder="请输入登录账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input
          v-model="ruleForm.name"
          class="w280"
          placeholder="请输入名称"
        ></el-input>
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
      <el-form-item label="账号类型：" prop="type">
        <el-select
          v-model="ruleForm.type"
          class="w280"
          placeholder="请选择账号类型"
          @change="userTypeChange"
        >
          <el-option
            v-for="item in typeData"
            :key="item.code"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联机构：" prop="branchId">
        <el-select
          v-model="ruleForm.branchId"
          class="w280"
          filterable
          placeholder="请选择机构"
        >
          <el-option
            v-for="item in releData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
  import {
    getUserDetail,
    getYingJiZhanghaoList,
    register,
  } from '@/api/userManagement'
  import {
    getBranchList,
    getOrgList,
    getExpertList,
  } from '@/api/userDataManagement'
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
        } else {
          if (this.ruleForm.confirmPassword !== '') {
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
          branchId: '',
          confirmPassword: '',
          name: '',
          password: '',
          roleCodes: [],
          type: '',
          userAccount: '',
          userId: '',
          userCode: '',
        },
        releData: [], // 根据选择用户类型数据不同
        userCode: '',
        rules: {
          branchId: [
            { required: true, message: '请选择所属机构', trigger: 'change' },
          ],
          confirmPassword: [
            { required: true, validator: validatePassConfirm, trigger: 'blur' },
          ],
          confirmPasswordFalse: [
            {
              required: false,
              trigger: 'blur',
            },
          ],
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' },
          ],
          passwordFalse: [{ required: false, trigger: 'blur' }],
          roleCodes: [
            { required: true, message: '请选择角色', trigger: 'change' },
          ],
          type: [
            { required: true, message: '请选择用户类型', trigger: 'change' },
          ],
          userAccount: [
            { required: true, message: '请输入登录账号', trigger: 'blur' },
          ],
        },
      }
    },
    mounted() {
      // this.initRole()
    },
    methods: {
      async initReleData(val, obj, attr) {
        let res = await val(obj)
        if (res.code === '0000') {
          this.changeDataField(attr, res.list)
        }
      },
      changeDataField(val, list) {
        console.log(val, list)
        switch (val) {
          case '00':
            // 企业用户
            this.releData = list.map((item) => {
              return {
                value: item.id,
                label: item.custFullName,
                userCode: item.userCode,
              }
            })
            break
          case '01':
          // 专家用户
          case '02':
          // 应急局用户
          case '03':
          // 服务机构用户
          case '04':
            // 保险公司用户
            this.releData = list.map((item) => {
              return {
                value: item.id,
                label: item.name,
                userCode: item.userCode,
              }
            })
            break
        }
      },
      userTypeChange(val) {
        let data = {}
        let func = null
        switch (val) {
          case '00':
            // 企业用户
            data = {
              pn: 1,
              ps: 1000,
              status: '1',
            }
            func = getOrgList
            break
          case '01':
            // 专家用户
            data = {
              pn: 1,
              ps: 1000,
              status: '1',
            }
            func = getExpertList
            break
          case '02':
            // 应急局用户
            data = {
              pn: 1,
              ps: 1000,
              status: '1',
            }
            func = getYingJiZhanghaoList
            break
          case '03':
            // 服务机构用户
            data = {
              pn: 1,
              ps: 1000,
              type: '02',
              status: '1',
            }
            func = getBranchList
            break
          case '04':
            // 保险公司用户
            data = {
              pn: 1,
              ps: 1000,
              type: '01,04',
              status: '1',
            }
            func = getBranchList
            break
        }
        this.initReleData(func, data, val)
      },
      async initData() {
        if (!this.userCode) {
          return false
        }
        let res = await getUserDetail(this.userCode)
        if (res.code === '0000') {
          this.ruleForm.branchId = res.data.branchId
          this.ruleForm.name = res.data.name
          this.ruleForm.roleCodes = res.data.roleCodes.split(',')
          this.ruleForm.type = res.data.type
          this.ruleForm.userAccount = res.data.userAccount
          this.ruleForm['userId'] = res.data.id
          this.userTypeChange(res.data.type)
          // this.data = res.data
        }
      },
      clear() {
        this.userCode = ''
        this.$nextTick(() => {
          this.$refs['ruleForm'].resetFields()
        })
        this.ruleForm.userId = ''
        console.log(this.ruleForm)
        // this.ruleForm = {
        //   branchId: 1,
        //   confirmPassword: '',
        //   name: '',
        //   password: '',
        //   roleCodes: [],
        //   type: '',
        //   userAccount: '',
        //   userId: '',
        //   // userId: 0,
        // }
      },
      close() {
        this.clear()
      },
      async configRegister() {
        let data = JSON.parse(JSON.stringify(this.ruleForm))
        data.roleCodes = data.roleCodes.join(',')
        let userCode = this.releData.find((item) => item.id === data.id)
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
