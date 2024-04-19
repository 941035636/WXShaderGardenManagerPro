<template>
  <div id="projectDetails">
    <plan-detail
      :plan-detail="data.accidentPrePlanEntity"
      :organization-resp="data.organizationResp"
      :service-list="data.accidentPreExpertEntityList"
    ></plan-detail>
    <div class="split"></div>
    <step
      v-if="data.accidentPrePlanEntity"
      :active-num="planStatus"
      :create-time="createTime | format"
    ></step>
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
    <!-- <div class="split"></div> -->
    <service-report
      :plan-files="data.planFiles"
      :plan-status="planStatus"
      @successCb="initData"
    ></service-report>
    <div class="split"></div>
    <component
      v-if="planStatus === 3"
      :plan-detail="data.accidentPrePlanEntity"
      :summary-file="data.summaryFileRecordEntities"
      :trainee-list="data.traineeList"
      :is="summaryComponent"
    ></component>
  </div>
</template>

<script>
  import PlanDetail from '../components/planDetail'
  import Step from '../components/step'
  import DangerRecord from '../components/dangerRecord'
  import ServiceReport from '../components/serviceReport'
  import RiskRecord from '../components/riskRecord'
  import ServiceSummaryDetails from './components/serviceSummaryDetails'
  import ServiceInvestigateSummaryDetails from './components/serviceInvestigateSummaryDetails'
  import { getPlanDetails } from '@/service/accidentManagement'
  import ResourcesService from '@/service/ResourcesService'
  import { mapGetters } from 'vuex'
  export default {
    name: 'PlanDetails',
    components: {
      PlanDetail,
      Step,
      DangerRecord,
      ServiceReport,
      ServiceSummaryDetails,
      ServiceInvestigateSummaryDetails,
      RiskRecord,
    },
    data() {
      return {
        ResourcesService: new ResourcesService(),
        data: {},
        createTime: '',
        planStatus: 0,
        summaryComponList:[
          {
            type:'01',
            name:"安全生产宣传教育培训",
            components:'serviceSummaryType2'
          },
          {
            type:'02',
            name:"安全风险辨识、评估和安全评价",
            components:'serviceSummaryType3'
          },
          {
            type:'03',
            name:"生产安全事故隐患排查",
            components:'serviceInvestigateSummaryDetails'
          },
          {
            type:'04',
            name:"安全生产标准化建设",
            components:'serviceSummaryDetails'
          },
          {
            type:'05',
            name:"生产安全事故应急预案编制和演练",
            components:'serviceSummaryDetails'
          },
          {
            type:'06',
            name:"安全生产科技推广应用",
            components:'serviceSummaryDetails'
          },
          {
            type:'07',
            name:"其他有关事故预防工作",
            components:'serviceSummaryDetails'
          },
        ],
      }
    },
    computed: {
      ...mapGetters({
      }),
    },
    mounted() {},
    created() {
      this.initData()
      this.summaryComponList.forEach((item)=>{
        if(item.type===this.$route.query.preType) {
          this.summaryComponent = () =>import(`./components/${item.components}.vue`);
        }
      })
    },
    methods: {
      async initData() {
        let res = await getPlanDetails(this.$route.query.id)
        if (res.code === '0000') {
          if (res.data.summaryFileRecordEntities) {
            await this.getImgFile(res.data.summaryFileRecordEntities).then(
              (r) => {
                res.data.summaryFileRecordEntities = r
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
                res.data.accidentPreDangerEntities = obj
                this.data = res.data
              }
            )
          } else {
            let obj = []
            try {
              obj = res.data.accidentPreDangerEntities.map((item) => {
                let newObj = item.accidentPreDangerEntity
                newObj.url = item.url
                return newObj
              })
            } catch (err) {}
            res.data.accidentPreDangerEntities = obj
            this.data = res.data
          }
          this.planStatus = res.data.accidentPrePlanEntity.planStatus
          console.log(res.data.organizationResp,'-',res.data.organizationResp || {});
          this.data.organizationResp =  res.data.organizationResp || {}
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
      async getImgFile(list) {
        for (let key of list) {
          let { url } = await this.ResourcesService.downloadOrViewFile(key.downLoadUrl)
          key.imgUrl = url
        }
        return list
      },
    },
  }
</script>

<style scoped lang="less">
  #projectDetails {
    background-color: #fff;
    margin: 0 20px;
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
