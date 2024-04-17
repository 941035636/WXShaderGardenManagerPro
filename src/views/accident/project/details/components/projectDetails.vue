<template>
  <div id="details">
    <div class="mainTitle">
      <span class="fb f16">项目详情</span>
      <el-button
        type="primary"
        v-if="projectDetails.processStatus != '3'"
        round
        @click="register"
      >
        项目完成
      </el-button>
    </div>
    <div class="row">
      <el-form label-position="left" label-width="112px">
        <el-row>
          <el-col :span="7">
            <el-form-item label="项目名称：">
              <moreCon
                class="color-blue"
                :data="projectDetails.projectName"
                :length="13"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="服务合同编号：">
              <moreCon :data="projectDetails.contractNo" :length="20" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="项目进度：">
              <span
                v-if="projectDetails.processStatus == '1'"
                class="project-status"
              >
                待制定计划
              </span>
              <span
                v-if="projectDetails.processStatus == '2'"
                class="project-status"
              >
                进行中
              </span>
              <span
                v-if="projectDetails.processStatus == '3'"
                class="project-status"
              >
                已完成
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="项目期间：">
              <span>{{ projectDetails.startTime | setTime }}</span>
              <span>至</span>
              <span>{{ projectDetails.endTime | setTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="服务机构：">
              <moreCon :data="projectDetails.serviceAgencyName" :length="13" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="发起单位：">
              <moreCon
                :data="projectDetails.insuranceCorporationName"
                :length="13"
              />
              <!-- <span>{{ projectDetails.insuranceCorporationName }}</span> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="支出金额：">
              <span class="color-red">
                ￥{{
                  projectDetails.accidentPreFund
                    ? projectDetails.accidentPreFund.toFixed(2)
                    : '0.00'
                }}
                元
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="项目服务说明：">
              <moreCon :data="projectDetails.remark" :length="18" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import { smalltoBIG } from '@/utils/validate'
import { finishProject } from '@/api/accidentManagement'
import { baseMixin } from '@/mixins/baseMixins'
import { mapGetters } from 'vuex'
import moreCon from '@/components/moreCon'
export default {
  name: 'ServiceAdd',
  components: {
    Title,
    moreCon,
  },
  mixins: [baseMixin],
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
      data: {},
    }
  },
  computed: {
    ...mapGetters({
      visitedRoutes: 'tabsBar/visitedRoutes',
    }),
    bigMoney() {
      return smalltoBIG(this.projectDetails.accidentPreFund) || '零'
    },
  },
  mounted() {},
  methods: {
    async register() {
      if (!this.$parent.$refs.planList.changeFiles()) {
        return false
      }
      if (!this.$parent.$refs.projectSummary.changeSummarys()) {
        return false
      }
      let text = '确认项目完成'
      this.$baseConfirm(
        text,
        '',
        () => {
          // alert('1111')
          this.configRegister()
        },
        () => {
          this.$baseMessage('已取消', 'info')
        }
      )
    },
    async configRegister() {
      let res = await finishProject(this.$route.query.id)
      if (res.code === '0000') {
        this.$baseMessage('成功', 'success')
        this.toThisTag('projectList')
      }
    },
  },
}
</script>

<style scoped lang="scss" scoped>
#details {
  padding: 20px 30px;
  background: #fff;
  .mainTitle {
    display: flex;
    justify-content: space-between;
  }
  .row {
    margin-top: 20px;

    margin-bottom: 20px;
    .project-status {
      color: #ffa940;
    }
  }
}
</style>
<style lang='scss'>
#details .el-form-item__label {
  color: #919191;
}
#details .el-form-item--small.el-form-item {
  margin: 0;

  .el-form-item__label,
  .el-form-item__content {
    line-height: 45px;
  }
}
</style>
