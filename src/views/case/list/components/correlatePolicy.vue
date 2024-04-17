<template>
  <div id="CorrelatePolicy">
    <el-dialog :visible.sync="dialogFormVisible" width="40%">
      <el-form :rules="rules">
        <el-form-item class="flex" prop="policyNo" label="保单号：">
          <el-input
            v-model="form.policyNo"
            class="w250"
            size="small"
            placeholder="请输入保单号"
            clearable
            @keyup.enter.native="search"
          ></el-input>
          <el-button type="primary" class="btn" shape="round" @click="search">
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :disabled="disabled" type="primary" @click="confirm">
          确认提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { isRenewal } from '@/api/policyManagement'
  import { relatePolicy } from '@/api/caseManagement'
  export default {
    name: 'CorrelatePolicy', //关联保单
    data() {
      return {
        dialogFormVisible: false,
        disabled: true,
        form: {
          policyNo: '', //保单号
          id: '', //案件的id
        },

        rules: {
          policyNo: [
            {
              required: true,
              message: '请输入保单号',
              trigger: 'blur',
            },
          ],
        },
      }
    },
    methods: {
      async search() {
        let res = await isRenewal(this.form.policyNo)
        if (res.data) {
          this.disabled = false
          return true
        } else {
          this.$baseMessage(' 未查询到该保单信息', 'error')
          this.disabled = true
          return false
        }
      },
      async confirm() {
        // this.$parent.search()
        if (await this.search()) {
          let res = await relatePolicy(this.form)
          if (res.code == '0000') {
            this.dialogFormVisible = false
            this.disabled = true
            this.$parent.search()
          }
        }
      },
    },
  }
</script>

<style scoped>
  #CorrelatePolicy {
    padding: 20px;
  }
  #CorrelatePolicy .search {
    /* width: 300px; */
    margin-right: 15px;
  }
  .btn {
    float: right;
    margin-right: 130px;
  }
</style>
