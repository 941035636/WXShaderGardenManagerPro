<template>
  <div id="rewardsAdd">
    <Title
      :title="JSON.stringify($route.query) !== '{}' ? '修改奖惩' : '添加奖惩'"
    ></Title>
    <div class="mt20">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="left"
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
        <el-form-item class="mt50">
          <el-button type="info" size="medium" @click="back">返回</el-button>
          <el-button type="primary" size="medium" @click="submitForm('form')">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import {
    addRewards,
    findRewardsById,
    updateRewards,
  } from '@/api/supervise.js'
  import { mapGetters } from 'vuex'
  import { baseMixin } from '@/mixins/baseMixins'
  export default {
    name: 'AddRewards',
    components: {
      Title,
    },
    mixins: [baseMixin],
    data() {
      return {
        // 被奖惩类型
        coverRewardsTypeOptions: [],
        // 奖惩类型
        rewardsTypeOptions: [],
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
        visitedRoutes: 'tabsBar/visitedRoutes',
        enumData: 'enums/getStrEnumAll',
      }),
    },
    created() {
      this.init()
    },
    // beforeRouteEnter (to, from, next) {
    //   // if(JSON.stringify(this.$route.query) !== '{}') {
    //   //   to.meta.title = '修改奖惩'
    //   // }
    //   next()
    // },
    activated() {
      this.isQuery()
    },
    methods: {
      // 初始化
      init() {
        this.coverRewardsTypeOptions = this.enumData.RespondentEnum
        this.rewardsTypeOptions = this.enumData.PunishmentTypeEnum
        this.isQuery()
      },
      // 新增奖惩
      async addRewards(data) {
        let { code } = await addRewards(data)
        if (code === '0000') {
          this.$baseMessage('添加成功', 'success')
          this.toThisTag()
        }
      },
      // 根据id查询奖惩
      async findRewardsById(id) {
        let { code, data } = await findRewardsById(id)
        if (code === '0000') {
          this.form = data
        }
      },
      // 是否有传递参数
      isQuery() {
        if (JSON.stringify(this.$route.query) !== '{}') {
          this.findRewardsById(this.$route.query.id)
        } else {
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
      // 更新奖惩
      async updateRewards() {
        let { code } = await updateRewards(this.$route.query.id, this.form)
        if (code === '0000') {
          this.$baseMessage('修改成功', 'success')
          this.toThisTag()
        }
      },
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (JSON.stringify(this.$route.query) !== '{}') {
              this.updateRewards()
            } else {
              this.addRewards(this.form)
            }
          } else {
            return false
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  #rewardsAdd {
    margin: 20px;
  }
</style>
