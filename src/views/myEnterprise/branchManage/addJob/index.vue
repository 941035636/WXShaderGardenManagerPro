<template>
  <div id="branchJob">
    <el-dialog
      :title="branchForm.id ? '修改岗位' : '添加岗位'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="600px"
      @close="close"
      @open="initData"
    >
      <el-form
        ref="ruleForm"
        :model="branchForm"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item label="岗位名称" prop="postName">
          <el-input class="w280" v-model="branchForm.postName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="岗位编码" prop="postNo">
          <el-input class="w280" v-model="branchForm.postNo"></el-input>
        </el-form-item> -->
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="branchForm.status"
            active-text="正常"
            inactive-text="关闭"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" shape="round" @click="submit">
          确认提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { sysPostSave } from '@/api/branchManage'
export default {
  data() {
    return {
      dialogVisible: false,
      branchForm: {
        postName: '',
        postNo: '',
        status: '1',
        deptNo: '',
      },
      rules: {
        postName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 100, message: '长度2到100位' },
        ],
        postNo: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
      },
    }
  },
  methods: {
    close() {
      this.branchForm = {
        postName: '',
        postNo: '',
        status: '1',
        deptNo: '',
      }
    },
    async submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.save()
        }
      })
    },
    async save() {
      let res = await sysPostSave(this.branchForm)
      if (res.code == '0000') {
        this.dialogVisible = false
        this.$message.success('提交成功')
        this.$parent.goJob(this.branchForm.deptNo)
      } else {
      }
    },
    initData() {},
    cancel() {
      this.dialogVisible = false
    },
  },
}
</script>
<style lang="scss" scoped>
#branchJob {
}
</style>