<template>
  <div id="summary">
    <div class="title">
      <span></span>
      <span class="color-blue f16 ml10 mr20">项目总结</span>
      <el-switch v-model="hasSummary" @change="changeSummary"></el-switch>
      （可选）
    </div>
    <div v-if="hasSummary">
      <div v-if="!projectDetails.summary" class="emptyCon">
        <el-button
          v-if="projectDetails.processStatus !== 3"
          type="primary"
          class="w120"
          @click="dialogVisibleClick('add')"
        >
          添加总结
        </el-button>
      </div>
      <div class="row">
        <el-row type="flex" class="row-bg">
          <el-col v-if="projectDetails.summary" :span="24">
            <div class="mb10">{{ projectDetails.summary }}</div>
            <div class="text-center">
              <el-button
                v-if="projectDetails.processStatus !== 3"
                @click="dialogVisibleClick('eidt')"
              >
                编辑
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
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
import { smalltoBIG } from '@/utils/validate'
import { updateProject } from '@/api/accidentManagement'
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
      hasSummary: false,
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
    changeSummary(e) {
      let flag = true
      if (!this.hasSummary) {
        if (this.projectDetails.summary) {
          this.$baseMessage('请先清除总结信息', 'warning')
          this.hasSummary = true
          flag = false
        }
      }
      return flag
    },
    changeSummarys(e) {
      console.log(this.hasSummary, this.projectDetails.summary)
      let flag = true
      if (this.hasSummary) {
        if (this.projectDetails.summary == null) {
          this.$baseMessage('请先添加总结信息', 'warning')
          // this.hasSummary = true
          flag = false
        }
      }
      if (!this.hasSummary) {
        flag = true
      }
      if (!this.changeSummary()) {
        flag = false
      }
      return flag
    },
    async configRegister() {
      let res = await updateProject(this.ruleForm, this.$route.query.id)
      if (res.code === '0000') {
        this.$baseMessage('成功', 'success')
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

<style scoped lang="scss" scoped>
#summary {
  padding: 20px;
  background-color: #fff;
  .emptyCon {
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    display: flex;
    height: 40px;
    width: 100%;
    margin: 0 auto;
    align-items: center;

    font-size: 12px;
    border-bottom: 1px solid #e9e9e9;
  }

  .title > span:nth-child(1) {
    display: inline-block;
    width: 5px;
    height: 16px;
    background-color: #096dd9;
  }
  .row {
    margin-left: 30px;
    margin-top: 20px;
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
