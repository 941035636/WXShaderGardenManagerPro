<template>
  <div id="summary">
    <Title title="项目总结" class="ml20 mr20"></Title>
    <div class="row">
      <el-row type="flex" class="row-bg">
        <el-col v-if="!projectDetails.summary" :span="24">
          <span class="title mr20">暂无项目总结</span>
          <el-button
            v-if="isAuth('120006') && projectDetails.approveStatus !== 7"
            type="text"
            @click="dialogVisibleClick('add')"
          >
            添加总结
          </el-button>
        </el-col>
        <el-col v-if="projectDetails.summary" :span="24">
          <div class="title">{{ projectDetails.summary }}</div>
          <el-button
            v-if="isAuth('120006') && projectDetails.approveStatus !== 7"
            type="text"
            @click="dialogVisibleClick('eidt')"
          >
            编辑
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="50%"
      @close="close"
    >
      <el-input
        v-model="ruleForm.summary"
        :rows="8"
        type="textarea"
        placeholder="请输入内容"
        maxlength="2000"
        show-word-limit
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="configRegister">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import { updateProject } from '@/service/accidentManagement'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ServiceAdd',
    components: {
      Title,
    },
    props: {
      projectDetails: {
        type: Object,
        required: true,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        dialogVisible: false,
        title: '',
        ruleForm: {
          summary: '',
        },
      }
    },
    computed: {
      ...mapGetters({
        visitedRoutes: 'tabsBar/visitedRoutes',
      }),
    },
    mounted() {},
    methods: {
      async configRegister() {
        let res = await updateProject(this.ruleForm, this.$route.query.id)
        if (res.code === '0000') {
          this.$message.success('成功')
          this.close()
          this.$emit('successCb')
        }
      },
      close() {
        this.ruleForm.textarea = ''
        this.dialogVisible = false
      },
      dialogVisibleClick(v) {
        if (v === 'add') {
          this.title = '新增项目总结'
        } else {
          this.title = '编辑项目总结'
          this.ruleForm.summary = this.projectDetails.summary
        }
        this.dialogVisible = true
      },
    },
  }
</script>

<style scoped lang="less">
  #summary {
    .row {
      margin-left: 30px;
      margin-top: 20px;
      padding-bottom: 5px;
      .row-bg {
        margin-bottom: 20px;
        .project-status {
          display: inline-block;
          padding: 4px 6px;
          background-color: #ffa940;
          color: #fff;
          border-radius: 20px;
        }
      }
    }
  }
</style>
