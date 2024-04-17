<template>
  <el-dialog
    :title="id ? '修改投诉' : '新增投诉'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="260px"
    >
      <el-form-item label="投诉人名称" prop="name">
        <el-input
          v-model="form.name"
          class="w217"
          placeholder="请输入投诉人名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="投诉人社会信用代码" prop="blCode">
        <el-input
          v-model="form.blCode"
          class="w217"
          placeholder="请输入投诉人社会信用代码"
        ></el-input>
      </el-form-item>
      <el-form-item label="投诉时间" prop="complainTime">
        <el-date-picker
          v-model="form.complainTime"
          type="date"
          placeholder="请输入投诉时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="被投诉人" prop="respondentName">
        <el-input
          v-model="form.respondentName"
          class="w217"
          placeholder="请输入被投诉人名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="被投诉人类型" prop="respondentType">
        <el-select
          v-model="form.respondentType"
          class="w217"
          placeholder="请选择"
        >
          <el-option
            v-for="item in coverComplaintTypeOptions"
            :key="item.strCode"
            :label="item.label"
            :value="item.strCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投诉内容及述求" prop="remark">
        <el-input
          v-model="form.remark"
          class="w315"
          type="textarea"
          placeholder="多行输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="投诉办理单位" prop="complaintHandlingUnit">
        <el-input
          v-model="form.complaintHandlingUnit"
          class="w217"
          placeholder="请输入投诉办理单位"
        ></el-input>
      </el-form-item>
      <el-form-item label="投诉人确认" prop="complaintHandlingConfirm">
        <el-select
          v-model="form.complaintHandlingConfirm"
          class="w217"
          placeholder="解决"
        >
          <el-option
            v-for="item in complaintcConfirmOptions"
            :key="item.strCode"
            :label="item.label"
            :value="item.strCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投诉办理结果" prop="complaintHandlingResult">
        <el-input
          v-model="form.complaintHandlingResult"
          class="w217"
          placeholder="请输入投诉办理结果"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" size="medium" @click="submitForm('ruleForm')">
        提交
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {
    addComplaint,
    updateComplaint,
    findComplaintById,
  } from '@/api/supervise.js'
  import { mapGetters } from 'vuex'
  export default {
    name: 'AddOrAlter',
    props: {},
    data() {
      return {
        dialogVisible: false,
        // 被投诉类型
        coverComplaintTypeOptions: [],
        // 投诉确认
        complaintcConfirmOptions: [],
        // 验证规则
        rules: {
          name: [
            { required: true, message: '请输入投诉人名称', trigger: 'blur' },
            { min: 2, max: 100, message: '投诉人名称2-100位', trigger: 'blur' },
          ],
          blCode: [
            {
              required: true,
              message: '请输入投诉人社会信用代码',
              trigger: 'blur',
            },
            {
              min: 4,
              max: 30,
              message: '投诉人社会信用代码4-30位',
              trigger: 'blur',
            },
          ],
          complainTime: [
            { required: true, message: '请输入投诉时间', trigger: 'blur' },
          ],
          respondentName: [
            { required: true, message: '请输入被投诉人名称', trigger: 'blur' },
            { min: 2, max: 100, message: '被投诉人2-100位', trigger: 'blur' },
          ],
          respondentType: [
            { required: true, message: '请选择被投诉人类型', trigger: 'blur' },
          ],
          remark: [
            {
              required: true,
              message: '请输入投诉内容及述求',
              trigger: 'blur',
            },
            {
              min: 1,
              max: 300,
              message: '投诉内容及述求1-300位',
              trigger: 'blur',
            },
          ],
          complaintHandlingUnit: [
            { required: true, message: '请输入投诉办理单位', trigger: 'blur' },
            {
              min: 2,
              max: 100,
              message: '投诉办理单位2-100位',
              trigger: 'blur',
            },
          ],
          complaintHandlingConfirm: [
            { required: true, message: '请选择投诉人确认', trigger: 'blur' },
          ],
          complaintHandlingResult: [
            { required: true, message: '请输入投诉办理结果', trigger: 'blur' },
            {
              min: 2,
              max: 100,
              message: '投诉办理结果2-100位',
              trigger: 'blur',
            },
          ],
        },
        form: {
          blCode: '', //投诉人社会信用代码（证件类型 及号码）
          complainTime: '', //投诉时间
          complaintHandlingConfirm: '', // 投诉人确认
          complaintHandlingResult: '', // 投诉办理结果
          complaintHandlingUnit: '', // 投诉办理单位
          name: '', // 投诉人名称
          respondentName: '', // 被投诉人名称
          remark: '', // 投诉内容及述求
          respondentType: '', // 投诉人类型
        },
        id: '',
      }
    },
    computed: {
      ...mapGetters({
        enumData: 'enums/getStrEnumAll',
      }),
    },
    mounted() {},
    methods: {
      async initData(val) {
        this.dialogVisible = true
        this.coverComplaintTypeOptions = this.enumData.RespondentEnum || []
        this.complaintcConfirmOptions = this.enumData.SolveStatusEnums || []
        if (val) {
          this.findComplaintById(val.id)
        } else {
          // this.$refs.form.resetFields();
          this.form = {
            blCode: '',
            complainTime: '',
            complaintHandlingConfirm: '',
            complaintHandlingResult: '',
            complaintHandlingUnit: '',
            name: '',
            respondentName: '',
            remark: '',
            respondentType: '',
          }
        }
      },
      // 根据id查询投诉
      async findComplaintById(id) {
        this.id = id
        let { code, data } = await findComplaintById(id)
        if (code === '0000') {
          this.form = data
        }
      },
      // 新增投诉
      async addComplaint(data) {
        let { code } = await addComplaint(data)
        if (code === '0000') {
          this.$baseMessage('添加成功', 'success')
          this.$emit('successCb')
          this.close()
        }
      },
      // 更新投诉
      async updateComplaint() {
        let { code } = await updateComplaint(this.id, this.form)
        if (code === '0000') {
          this.$baseMessage('修改成功', 'success')
          this.$emit('successCb')
          this.close()
        }
      },
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.id) {
              this.updateComplaint()
            } else {
              this.addComplaint(this.form)
            }
          } else {
            return false
          }
        })
      },
      clear() {
        this.$nextTick(() => {
          this.$refs['ruleForm'].resetFields()
        })
        this.id = ''
      },
      close() {
        this.dialogVisible = false
        this.clear()
      },
    },
  }
</script>

<style lang="scss"></style>
