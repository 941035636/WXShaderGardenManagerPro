<template>
  <div id="projectDetails">
    <plan-detail
      :plan-detail="data.accidentPrePlanEntity"
      :organization-resp="data.organizationResp"
      :service-list="data.accidentPreExpertEntityList"
    ></plan-detail>
    <div class="split"></div>
    <step :create-time="createTime | format"></step>
    <div class="split"></div>
    <service-report
      :plan-files="data.planFiles"
      :plan-status="planStatus"
      @successCb="initData"
    ></service-report>
    <div class="split"></div>
    <!-- 隐患排查 -->
    <!-- <danger-record
      v-if="$route.query.preType === '03'"
      :danger-list="data.accidentPreDangerEntities"
      :plan-detail="data.accidentPrePlanEntity"
      @successCb="initData"
    ></danger-record> -->
    <!-- 风险记录 -->
    <!-- <RiskRecord
      v-if="$route.query.preType === '02'"
      :danger-list="data.accidentPreDangerEntities"
      :plan-detail="data.accidentPrePlanEntity"
      @successCb="initData"
    ></RiskRecord> -->
    <div class="split"></div>
    <component :is="summaryComponent" :plan-detail="data.accidentPrePlanEntity"></component>
  </div>
</template>

<script>
  import PlanDetail from '../components/planDetail'
  import Step from '../components/step'
  import DangerRecord from '../components/dangerRecord'
  import RiskRecord from '../components/riskRecord'
  import ServiceReport from '../components/serviceReport'
  import { getPlanDetails } from '@/service/accidentManagement'
  import { mapGetters } from 'vuex'
  export default {
    name: 'PlanHandle',
    components: {
      PlanDetail,
      Step,
      DangerRecord,
      RiskRecord,
      ServiceReport,
    },
    data() {
      return {
        data: {},
        tableExpertList: [],
        createTime: '',
        planStatus: 0,
        summaryComponent:{},
        summaryComponList:[
          {
            type:'01',
            name:"特种设备安全宣传教育培训",
            components:'serviceSummaryType2'
          },
          {
            type:'02',
            name:"特种设备使用安全风险辨识、评估和安全评价",
            components:'serviceSummaryType3'
          },
          {
            type:'03',
            name:"特种设备安全事故隐患排查",
            components:'serviceInvestigateSummary'
          },
          // {
          //   type:'04',
          //   name:"安全生产标准化建设",
          //   components:'serviceSummaryType1'
          // },
          // {
          //   type:'05',
          //   name:"生产安全事故应急预案编制和演练",
          //   components:'serviceSummaryType1'
          // },
          // {
          //   type:'06',
          //   name:"安全生产科技推广应用",
          //   components:'serviceSummaryType1'
          // },
          {
            type:'07',
            name:"其他有关事故预防工作",
            components:'serviceSummaryType1'
          },
        ],
      }
    },
    computed: {
      ...mapGetters({
        areaMap: 'areas/areaMap',
      }),
    },
    created() {
      this.initData()
      this.summaryComponList.forEach((item)=>{
        console.log(item.type===this.$route.query.preType);
        if(item.type===this.$route.query.preType) {
          this.summaryComponent = () =>import(`./components/${item.components}.vue`);
        }
      })
    },
    methods: {
      async initData() {
        let res = await getPlanDetails(this.$route.query.id)
        console.log(res,'---');
        if (res.code === '0000') {
          let obj = []
          try {
            obj = res.data.accidentPreDangerEntities.map((item) => {
              let newObj = item.accidentPreDangerEntity
              newObj.url = item.url
              return newObj
            })
          } catch (error) {
            console.log(error)
          }
          this.data = res.data
          this.data.organizationResp =  res.data.organizationResp || {}
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
              // this.data.accidentPrePlanEntity[item] =
              //   this.areaMap[res.data[item]]
            } else {
              this.data.accidentPrePlanEntity[item] = res.data[item]
            }
          })
        }
      },
    },
  }
</script>

<style scoped lang="less">
  #projectDetails {
    background-color: #fff;
    margin: 0 20px;
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
</style>
