<template>
  <div id="commentCase">
    <el-dialog
      class="selOrg"
      title="填写评价信息"
      :visible.sync="dialogFormVisible"
      width="600px"
      @open="openComment"
      @close="close"
    >
      <el-form
        ref="ruleForm"
        label-position="right"
        label-width="150px"
        :model="FormData"
        :rules="rules"
      >
        <el-form-item label="投保满意度" prop="star">
          <el-rate
            class="mt5"
            v-model="FormData.star"
            :texts="texts"
            :text-color="'#f7ba2a'"
            show-text
          ></el-rate>
        </el-form-item>
        <el-form-item prop="evalTime" label="评价时间">
          <el-date-picker
            v-model="FormData.evalTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="message" label="备注说明">
          <el-input
            class="w300"
            v-model="FormData.message"
            type="textarea"
            rows="2"
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
import { commentPolicy } from '@/api/policyManagement'
export default {
  name: 'InsuranceFactor',
  data() {
    return {
      dialogFormVisible: false,
      texts: ['很差', '差', '一般', '好', '很好'],
      FormData: {
        star: 5,
        message: '',
        evalTime: '',
        tableName: 't_case_info',
        tableNo: '',
        tableId: '',
      },
      rules: {
        message: [
          {
            required: true,
            message: '请填写',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 300,
            message: '字符1-300位',
          },
        ],
        star: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur',
          },
        ],
        evalTime: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    close() {
      this.FormData = {
        star: 5,
        message: '',
        evalTime: '',
        tableName: 't_case_info',
        tableNo: '',
        tableId: '',
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },
    openComment() {
      this.FormData.evalTime = new Date()
    },
    confirm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res = await commentPolicy(this.FormData)
          if (res.code === '0000') {
            this.$baseMessage('评价成功！', 'success')
            this.$emit('getMsg', '刷新')
            this.dialogFormVisible = false
          }
        }
      })
    },
    cancle() {
      this.form = {}

      this.dialogFormVisible = false
    },
  },
}
</script>

<style lang='scss' >
</style>
