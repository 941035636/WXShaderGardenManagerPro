<template>
  <el-dialog
    title="添加隐患记录"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
    >
      <el-form-item label="审核" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">通过</el-radio>
          <el-radio label="3">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核意见" :prop="ruleForm.status=='3'?'comment':''">
        <el-input
          v-model="ruleForm.comment"
          type="textarea"
          class="w400"
          placeholder="请输入内容"
          size="mini"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" round>取 消</el-button>
      <el-button type="warning" @click="register" round>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import Table from './Table'
  import {validateComment} from '@/util/validateFrom'
  import { postRolePorject,getRolePorjectDetail } from '@/service/accidentManagement'
  export default {
    name: 'DialogExamine',
    props: {},
    components:{
      Table,
    },
    data() {
      return {
        dialogVisible: false,
        ruleForm: {
          status: '1',
          comment: '',
          nodeId:'',
        },
        imageUrl: '',
        rules: {
          status: [
            { required: true, message: '请选择审核状态', trigger: 'change' },
          ],
          comment: [
            { required: true, validator: validateComment, trigger: 'blur' },
          ],
        },
      }
    },
    
    mounted() {
      // this.initRole()
    },
    methods: {
      openInit(row){
        this.dialogVisible = true
        // this.ruleForm.nodeId = row.acdpreId
        this.getRolePorjectDetail(row.acdpreId)
      },
      async getRolePorjectDetail(id){
        let res = await getRolePorjectDetail({acdentpreId:id})
        console.log(res,'---');
        if(res.code === '0000') {
          this.ruleForm.nodeId = res.data.nodeId
        }
      },
      clear() {
        this.$nextTick(() => {
          this.$refs['ruleForm'].resetFields()
        })
        this.ruleForm.nodeId = ''
        this.ruleForm.status = '1'
        this.ruleForm.comment = ''
        this.dialogVisible = false
      },
      close() {
        this.clear()
      },
      // 确认按钮
      register(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.configRegister()
          } else {
            return false
          }
        })
      },
      async configRegister() {
        let data = JSON.parse(JSON.stringify(this.ruleForm))
        let res = await postRolePorject(data)
        if (res.code === '0000') {
          // this.toThisTag()
          this.close()
          this.$emit('successCb')
        }
      },
    }
  }
</script>

<style lang="less">
</style>
