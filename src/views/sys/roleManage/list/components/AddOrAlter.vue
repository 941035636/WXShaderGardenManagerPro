<template>
  <el-dialog
    :title="ruleForm['id'] ? '修改角色' : '新增角色'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
  >
    <el-form ref="form" :model="ruleForm" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="ruleForm.roleName"
          placeholder="请输入角色名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input
          v-model="ruleForm.roleCode"
          placeholder="请输入角色编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input
          v-model="ruleForm.roleDesc"
          placeholder="请输入角色描述"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addRole">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { doSave } from '@/api/roleManagement'
  export default {
    name: 'AddOrAlter',
    props: {
      roleData: {
        type: Object,
        requires: true,
        default: () => {
          return null
        },
      },
    },
    data() {
      return {
        dialogVisible: false,
        ruleForm: {
          id: '',
          roleName: '',
          roleCode: '',
          roleDesc: '',
        },
        rules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
          ],
        },
      }
    },
    watch: {
      roleData: {
        handler(curVal, oldVal) {
          if (curVal) {
            console.log(curVal)
            this.ruleForm.id = curVal.id
            this.ruleForm.roleName = curVal.roleName
            this.ruleForm.roleCode = curVal.roleCode
            this.ruleForm.roleDesc = curVal.roleDesc
          }
        },
        deep: true,
      },
    },
    methods: {
      addRole() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveOrUpdate()
          } else {
            return false
          }
        })
      },
      async saveOrUpdate() {
        let res = await doSave(this.ruleForm)
        if (res.code === '0000') {
          this.$baseMessage(
            this.ruleForm.id ? '修改成功' : '添加成功',
            'success'
          )
          this.$parent.init()
          this.dialogVisible = false
        }
      },
      close() {
        this.ruleForm = {
          id: '',
          roleName: '',
          roleCode: '',
          roleDesc: '',
        }
        this.$refs['form'].resetFields()
      },
    },
  }
</script>

<style></style>
