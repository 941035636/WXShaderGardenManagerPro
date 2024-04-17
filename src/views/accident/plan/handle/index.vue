<template>
  <div id="projectHandle">
    <div class="headTitle">
      <el-button size="mini" @click="back" class="mr20">返回上一级</el-button>
      <span class="color-blue mr30">
        服务机构：{{ data.serviceAgencyName }}
      </span>
      <span v-if="data.accidentPrePlanEntity" class="mr20">
        录入时间：{{ data.accidentPrePlanEntity.createTime }}
      </span>
      <span v-if="data.accidentPrePlanEntity">
        录入人员：{{ data.accidentPrePlanEntity.createByName }}
      </span>
    </div>
    <div class="split"></div>
    <plan-detail
      :plan-detail="data.accidentPrePlanEntity"
      :organization-resp="data.organizationResp || {}"
      :service-list="data.accidentPreExpertEntityList"
    ></plan-detail>
    <div class="split"></div>
    <danger-record
      v-if="$route.query.preType === '03'"
      :danger-list="data.accidentPreDangerEntities || []"
      :plan-detail="data.accidentPrePlanEntity"
      @successCb="initData"
    ></danger-record>

    <!-- 风险记录 -->
    <RiskRecord
      v-if="$route.query.preType === '02'"
      :danger-list="data.accidentPreDangerEntities || []"
      :plan-detail="data.accidentPrePlanEntity"
      @successCb="initData"
    ></RiskRecord>
    <div class="split"></div>

    <!-- 生产标准化建设类 -->
    <Production
      v-if="$route.query.preType === '04'"
      :danger-list="data.recordResps"
      :plan-detail="data.accidentPrePlanEntity"
      @successCb="initData"
    ></Production>
    <!-- 留白 -->
    <div class="split"></div>

    <EarlyWarning
      v-if="$route.query.preType === '05'"
      :danger-list="data.recordResps"
      :plan-detail="data.accidentPrePlanEntity"
      @successCb="initData"
    ></EarlyWarning>
    <!-- 留白 -->
    <div class="split"></div>

    <component
      :is="summaryComponent"
      :plan-detail="data.accidentPrePlanEntity"
      :organization-resp="data.organizationResp"
      ref="summary"
      @getMsg="getMsg"
    ></component>

    <service-file
      :plan-files="data.planFiles || []"
      :plan-status="planStatus"
      @successCb="initData"
    />
    <div class="split"></div>
    <div class="text-center pd20" style="background: #f6f8f9">
      <el-button @click="submit('2')" plain type="primary" class="w120">
        保存服务计划
      </el-button>
      <el-button @click="submit('3')" type="primary" class="w120 ml10">
        提交服务计划
      </el-button>
    </div>
  </div>
</template>

<script>
import PlanDetail from '../components/planDetail'
import Step from '../components/step'
import DangerRecord from '../components/dangerRecord'
import ServiceReport from '../components/serviceReport'
import RiskRecord from '../components/riskRecord'
import { getPlanDetails, addAssessmenSummary } from '@/api/accidentManagement'
import { mapGetters } from 'vuex'
import { getImgFile } from '@/api/resources'
import ServiceFile from './components/serviceFile.vue'

import Production from '../components/production' //生产标准建设 - 问题详情

import EarlyWarning from '../components/earlyWarning.vue' //生产标准建设 - 问题详情
export default {
  name: 'planHandle',
  components: {
    PlanDetail,
    Step,
    DangerRecord,
    ServiceReport,
    RiskRecord,
    ServiceFile,
    Production,
    EarlyWarning,
  },
  data() {
    return {
      data: {},
      tableExpertList: [],
      createTime: '',
      planStatus: 0,
      summaryComponent: {},
      summaryComponList: [
        {
          type: '01',
          name: '安全生产宣传教育培训',
          components: 'serviceSummaryType1',
        },
        {
          type: '02',
          name: '安全风险辨识、评估和安全评价',
          components: 'serviceSummaryType2',
        },
        {
          type: '03',
          name: '生产安全事故隐患排查',
          components: 'serviceSummaryType3',
        },
        {
          type: '04',
          name: '安全生产标准化建设',
          components: 'serviceSummaryType4',
        },
        {
          type: '05',
          name: '生产安全事故应急预案编制和演练',
          components: 'serviceSummaryType5',
        },
        {
          type: '06',
          name: '安全生产科技推广应用',
          components: 'serviceSummaryType6',
        },
        {
          type: '07',
          name: '其他有关事故预防工作',
          components: 'serviceSummaryType7',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      areaList: 'areas/areaList',
      areaListAll: 'areas/areaListAll',
      areaMap: 'areas/areaMap',
    }),
  },
  created() {
    this.initData()
    this.summaryComponList.forEach((item) => {
      if (item.type === this.$route.query.preType) {
        this.summaryComponent = () =>
          import(`./components/${item.components}.vue`)
      }
    })
  },
  activated() {},
  methods: {
    async getMsg(data) {
      this.$baseMessage('处理成功', 'success')
      await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
      this.$router.go(-1)
    },
    submit(e) {
      this.$refs.summary.register(e)
    },
    async initData() {
      let res = await getPlanDetails(this.$route.query.id)
      if (res.code === '0000') {
        let obj = []
        try {
          obj = res.data.accidentPreDangerEntities.map((item) => {
            let newObj = item.accidentPreDangerEntity
            newObj.url = item.fileRecordEntities
            return newObj
          })
          // }
        } catch (error) {
          console.log(error)
        }
        this.data = res.data

        //安全等级   重置为空，防止进入校验
        if (res.data.accidentPrePlanEntity.safetyLevel) {
        } else {
          res.data.accidentPrePlanEntity.safetyLevel = ''
        }

        // 服务类型
        if (
          res.data.accidentPrePlanEntity.serviceType ||
          res.data.accidentPrePlanEntity.serviceType == 0
        ) {
        } else {
          res.data.accidentPrePlanEntity.serviceType = ''
        }

        this.$refs.summary.ruleForm = res.data.accidentPrePlanEntity
        if (
          res.data.accidentJoinEnterpriseResp &&
          res.data.accidentJoinEnterpriseResp.length
        ) {
          this.$refs.summary.ruleForm.enterpriseParams =
            res.data.accidentJoinEnterpriseResp
        }
        if (res.data.summaryFileRecordEntities) {
          await this.getImgFile(res.data.summaryFileRecordEntities).then(
            (r) => {
              this.$refs.summary.fileList = r
            }
          )
        }
        this.data.organizationResp = res.data.organizationResp || {}
        this.planStatus = res.data.accidentPrePlanEntity.planStatus
        this.data.accidentPreDangerEntities = obj
        this.createTime = res.data.accidentPrePlanEntity.createTime || ''
        let objKey = [
          'normal',
          'noramlCheck',
          'major',
          'majorCheck',
          'industryOneName',
          'industryTwoName',
          'industryThreeName',
          'industryFourName',
          'provinceCode',
          'cityCode',
          'countryCode',
          'detailAddress',
        ]
        objKey.forEach((item) => {
          if (
            item === 'provinceCode' ||
            item === 'cityCode' ||
            item === 'countryCode'
          ) {
            this.data.accidentPrePlanEntity[item] = this.areaMap[res.data[item]]
          } else {
            this.data.accidentPrePlanEntity[item] = res.data[item]
          }
        })
      }
    },
    async getImgFile(list) {
      for (let key of list) {
        let { data } = await getImgFile(key.url)
        key.url = data
      }
      return list
    },
    back() {
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped lang="scss">
#projectHandle {
  .headTitle {
    display: flex;
    align-items: center;
    height: 50px;
    padding-left: 20px;
  }
  // margin: 10px;
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
  .split {
    height: 10px;
    background-color: #f6f8f9;
  }
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
</style>
