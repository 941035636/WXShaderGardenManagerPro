<template>
  <el-dialog
    :title="ruleForm['userId'] ? '创建专员账号' : '修改专员账号'"
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
      <el-form-item label="登录账号：" prop="userAccount">
        <el-input
          v-model="ruleForm.userAccount"
          clearable
          class="w280"
          maxlength="30"
          show-word-limit
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="userAccount">
        <el-input
          v-model="ruleForm.userAccount"
          clearable
          class="w280"
          maxlength="30"
          show-word-limit
          placeholder="请输入姓名"
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
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="register">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
 
  export default {
    name: 'createMember',
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
          } else if (
            !/^(?![a-z]+$)(?![A-Z]+$)(?![0-9]+$)[0-9a-zA-Z\W]\S{7,15}$/i.test(
              value
            )
          ) {
            callback(
              new Error('密码必须为8-16位大小写字母和数字或符号组合哦！')
            )
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
        },
        ShowOrg: true, //关联机构是否展示
        orgList: [], // 机构集合
        userCode: '',
        rules: {
          userAccount: [
            { required: true, trigger: 'blur' },
          ],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' },
          ],
          confirmPassword: [
            { required: true, validator: validatePassConfirm, trigger: 'blur' },
          ],
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
     
        this.getOrgList(val)
      },
    
      async initData() {
        if (!this.userCode) {
          return false
        }
        let res = await getUserDetail(this.userCode)
        if (res.code === '0000') {
          this.getOrgList(res.data.type)
          this.ruleForm.name = res.data.name
          this.ruleForm.roleCodes = res.data.roleCodes.split(',')
          this.ruleForm.type = res.data.type
          if (res.data.type == '00') {
            this.ShowOrg = false
         
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
        
              name: res.data.orgName,
            })
        
          }, 500)
        }
        console.log(this.ruleForm, '-------------')
      },
      async getOrgList(code) {
        // 获取机构列表接口
        let data = {
          pn: 1,
          ps: 10,
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
      
        this.ruleForm.orgName = ''

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

<style lang="less">
.w280{
  width: 280px;
}
</style>
