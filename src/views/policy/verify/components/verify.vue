<template>
  <div id="verify">
    <el-dialog
      class="selOrg"
      title="审核处理"
      :visible.sync="dialogFormVisible"
      width="800px"
      @close="close"
    >
      <el-form
        ref="ruleForm"
        label-position="right"
        label-width="150px"
        :model="FormData"
        :rules="rules"
      >
        <el-form-item prop="status" label="审核结果">
          <el-radio-group @change="changeType" v-model="FormData.status">
            <el-radio :label="1">审核通过</el-radio>
            <el-radio :label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :prop="FormData.status == '1' ? 'empty' : 'comment'"
          label="备注说明"
        >
          <el-input
            type="textarea"
            :rows="3"
            class="w450"
            placeholder="请输入备注说明"
            v-model="FormData.comment"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { verifyPolicy } from '@/api/policyManagement'
export default {
  name: 'verify',
  data() {
    return {
      dialogFormVisible: false,
      FormData: {
        status: '',
        comment: '',
        nodeId: '',
      },
      rules: {
        status: [
          {
            required: true,
            message: '请选择审核结果',
            trigger: ['blur'],
          },
        ],
        comment: [
          {
            required: true,
            message: '请输入备注说明',
            trigger: ['blur'],
          },
          {
            min: 1,
            max: 100,
            message: '字符1-100位',
          },
        ],
      },
    }
  },
  methods: {
    changeType(e) {
      if (e == '1') {
        this.$refs.ruleForm.clearValidate()
      }
    },
    close() {
      this.FormData = {
        status: '',
        comment: '',
        nodeId: '',
      }
      this.form = {}
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },
    async confirm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res = await verifyPolicy(this.FormData)
          if (res.code === '0000') {
            this.$baseMessage('审核成功！', 'success')
            this.$emit('sucessCb', '')
            this.dialogFormVisible = false
          }
        }
      })
    },
    cancle() {
      this.dialogFormVisible = false
    },
  },
}
</script>

<style lang='scss' >
.my-autocomplete li .item-sel {
  padding: 5px 10px 10px 10px;
  border-bottom: 1px solid #ccc;

  p {
    margin: 0;
    height: 26px;
    line-height: 26px;
    font-size: 13px;
  }
}
.orgTip {
  background-color: #dbf9ef;
  color: #34c697;
  width: 450px;
  box-sizing: border-box;
  padding-left: 10px;
  i {
    font-size: 16px;
    margin-right: 5px;
  }
}
</style>
