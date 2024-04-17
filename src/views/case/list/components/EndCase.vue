<template>
  <div id="EndCase">
    <el-dialog
      left
      title="销案"
      :before-close="handleClose"
      :visible.sync="dialogVisible"
      @close="close"
      width="40%"
    >
      <el-form
        ref="ruleForm"
        label-position="right"
        label-width="150px"
        :model="FormData"
        :rules="rules"
      >
        <el-form-item>
          <div class="text">
            <i class="f16 el-icon-warning"></i>
            请确认是否 “销案”，确认后将无法修改
          </div>
        </el-form-item>
        <el-form-item prop="decisionTime" label="销案时间">
          <el-date-picker
            v-model="FormData.decisionTime"
            type="datetime"
            class="w280"
            :picker-options="endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="warning" @click="dialogVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="confirm">确认提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { closeCase } from '@/api/caseManagement'

export default {
  name: 'EndCase', //结案申请
  data() {
    return {
      dialogVisible: false,
      id: '',
      caseTime: '',
      FormData: {
        decisionTime: '',
        id: '',
        reportNo: '',
      },
      endTime: {
        disabledDate: (time) => {
          if (this.caseTime) {
            return (
              time.getTime() < new Date(this.caseTime).getTime() // 加- 8.64e7则表示包当天
            )
          }
        },
      },
      rules: {
        decisionTime: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    close() {
      this.FormData = {
        decisionTime: '',
        id: '',
        reportNo: '',
      }
      this.caseTime = ''
      this.$nextTick(() => {
        this.FormData = {}
        this.$refs.ruleForm.resetFields()
      })
    },
    confirm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res = await closeCase(this.FormData)
          if (res.code === '0000') {
            this.$baseMessage('销案成功！', 'success')
            this.$emit('getMsg', '刷新')
            this.dialogVisible = false
          }
        }
      })
    },
  },
}
</script>

<style scoped>
.text {
  color: #ffa940;
  font-weight: 600;
}
</style>
