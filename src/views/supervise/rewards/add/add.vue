<template>
  <div id="rewardsAdd">
    <div class="mt20">
      <el-dialog
        :title="id ? '修改奖惩' : '添加奖惩'"
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
          <el-form-item label="实施奖惩单位" prop="name">
            <el-input
              v-model="form.name"
              class="w217"
              placeholder="请输入实施奖惩单位"
            ></el-input>
          </el-form-item>
          <el-form-item label="被奖惩机构（人）类型" prop="objectType">
            <el-select
              v-model="form.objectType"
              class="w217"
              placeholder="请选择"
            >
              <el-option
                v-for="item in coverRewardsTypeOptions"
                :key="item.strCode"
                :label="item.label"
                :value="item.strCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="被奖惩机构（人）名称" prop="objectName">
            <el-input
              v-model="form.objectName"
              class="w217"
              placeholder="请输入被奖惩机构（人）名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="被奖惩机构（人）类型社会信用代码"
            prop="objectBlCode"
          >
            <el-input
              v-model="form.objectBlCode"
              class="w217"
              placeholder="被奖惩机构（人）类型社会信用代码"
            ></el-input>
          </el-form-item>
          <el-form-item label="奖惩类型" prop="rwdPhbType">
            <el-select
              v-model="form.rwdPhbType"
              class="w217"
              placeholder="请选择"
            >
              <el-option
                v-for="item in rewardsTypeOptions"
                :key="item.strCode"
                :label="item.label"
                :value="item.strCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="奖惩事项" prop="rwdPhbItems">
            <el-input
              v-model="form.rwdPhbItems"
              class="w315"
              type="textarea"
              placeholder="请输入奖惩事项"
            ></el-input>
          </el-form-item>
          <el-form-item label="奖惩原因" prop="rwdPhbReason">
            <el-input
              v-model="form.rwdPhbReason"
              class="w315"
              type="textarea"
              placeholder="请输入奖惩原因"
            ></el-input>
          </el-form-item>
          <el-form-item label="奖惩时间" prop="rwdPhbTime">
            <el-date-picker
              v-model="form.rwdPhbTime"
              :picker-options="TimeRage"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="submitForm('ruleForm')"
          >
            提交
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    addRewards,
    findRewardsById,
    updateRewards,
  } from '@/api/supervise.js'
  import { mapGetters } from 'vuex'
  import { baseMixin } from '@/mixins/baseMixins'
  export default {
    name: 'AddRewards',
    components: {},
    mixins: [baseMixin],
    data() {
      return {
        // 被奖惩类型
        coverRewardsTypeOptions: [],
        // 奖惩类型
        rewardsTypeOptions: [],
        dialogVisible: false,
        // 验证规则
        rules: {
          name: [
            { required: true, message: '请输入实施奖惩单位', trigger: 'blur' },
            {
              min: 2,
              max: 100,
              message: '实施奖惩单位2-100位',
              trigger: 'blur',
            },
          ],
          objectBlCode: [
            {
              required: true,
              message: '请输入被奖惩机构（人）类型',
              trigger: 'blur',
            },
            {
              min: 4,
              max: 100,
              message: '被奖惩机构（人）类型社会信用代码4-100',
              trigger: 'blur',
            },
          ],
          objectName: [
            {
              required: true,
              message: '请输入被奖惩机构（人）名称',
              trigger: 'blur',
            },
            {
              min: 2,
              max: 100,
              message: '被奖惩机构（人）名称2-100位',
              trigger: 'blur',
            },
          ],
          objectType: [
            {
              required: true,
              message: '请选择被奖惩机构（人员）类型 ',
              trigger: 'blur',
            },
          ],
          rwdPhbReason: [
            { required: true, message: '请输入奖惩原因', trigger: 'blur' },
            { min: 1, max: 300, message: '奖惩原因1-300位', trigger: 'blur' },
          ],
          rwdPhbTime: [
            { required: true, message: '请选择被奖惩时间', trigger: 'blur' },
          ],
          rwdPhbType: [
            { required: true, message: '请选择被奖惩类型', trigger: 'blur' },
          ],
          rwdPhbItems: [
            { required: true, message: '请输入被奖惩事项', trigger: 'blur' },
            { min: 1, max: 300, message: '奖惩事项1-300位', trigger: 'blur' },
          ],
        },
        // 表单信息
        form: {
          name: '',
          objectBlCode: '',
          objectName: '',
          objectType: '',
          rwdPhbReason: '',
          rwdPhbTime: '',
          rwdPhbType: '',
          rwdPhbItems: '',
        },
        id: '',
        TimeRage: {
          disabledDate: (time) => {
            let timestamp = Date.parse(new Date())
            let date = new Date(timestamp)
            //获取年份
            let thieYear = date.getFullYear()

            let startTime = thieYear + '-01-01'

            return (
              time.getTime() < new Date(startTime).getTime() - 8.64e7 ||
              time.getTime() > Date.now() // 加- 8.64e7则表示包当天
            )
          },
        },
      }
    },
    computed: {
      ...mapGetters({
        enumData: 'enums/getStrEnumAll',
      }),
    },
    created() {},
    methods: {
      // 初始化
      async initData(val) {
        this.dialogVisible = true
        this.coverRewardsTypeOptions = this.enumData.RespondentEnum || []
        this.rewardsTypeOptions = this.enumData.PunishmentTypeEnum || []
        if (val) {
          this.findRewardsById(val.id)
        } else {
          // this.$refs.form.resetFields();
          this.form = {
            name: '',
            objectBlCode: '',
            objectName: '',
            objectType: '',
            rwdPhbReason: '',
            rwdPhbTime: '',
            rwdPhbType: '',
            rwdPhbItems: '',
          }
        }
      },
      // 新增奖惩
      async addRewards(data) {
        let { code } = await addRewards(data)
        if (code === '0000') {
          this.$baseMessage('添加成功', 'success')
          this.$emit('successCb')
          this.close()
        }
      },
      // 根据id查询奖惩
      async findRewardsById(id) {
        this.id = id
        let { code, data } = await findRewardsById(id)
        if (code === '0000') {
          this.form = data
        }
      },
      // 更新奖惩
      async updateRewards() {
        let { code } = await updateRewards(this.id, this.form)
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
              this.updateRewards()
            } else {
              this.addRewards(this.form)
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

<style lang="scss" scoped>
  #rewardsAdd {
    margin: 20px;
  }
</style>
