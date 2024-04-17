<template>
  <div id="dialog">
    <el-dialog title="销案" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="ruleForm" label-position="left" :model="form" class="form">
        <p><span>立案号：3123213321</span></p>
        <el-form-item label="销案说明：">
          <el-input
            v-model="form.cancelCaseExplain"
            class="w280"
            type="textarea"
            :rows="3"
            placeholder="多行输入"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" style="text-align: center" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { closeCase } from '@/api/caseManagement'
  export default {
    name: 'CloseCase',
    data() {
      return {
        dialogFormVisible: false,
        form: {
          id: '', //id
          cancelCaseExplain: '', //销案说明
          caseNo: '', //立案号
        },
        formLabelWidth: '150px',
      }
    },
    methods: {
      async confirm() {
        let res = await closeCase(this.form)
        console.log(res)
        if (res.data) {
          this.$baseMessage(' 销案成功', 'success')
          this.$router.push({
            path: 'caseList',
          })
        } else {
          this.$baseMessage(' 销案失败', 'error')
        }

        this.form = {}

        this.dialogFormVisible = false
      },
      cancle() {
        this.form = {}

        this.dialogFormVisible = false
      },
    },
  }
</script>

<style scoped lang="scss">
  .form {
    padding-left: 30px;
  }
</style>
