<template>
  <div id="projectDetails">
    <project-details
      :project-details="data.accidentPreProjectEntity"
    ></project-details>
    <div class="split"></div>
    <plan-list
      :plan-list="data.projectPlanResps"
      :project-details="data.accidentPreProjectEntity"
      :project-file-contarct="data.fileRecordEntitys"
      :project-file-payorder="data.fileRecordPayEntitys"
      @successCb="initData"
    ></plan-list>
    <div class="split"></div>
    <project-summary
      :plan-list="data.projectPlanResps"
      :project-details="data.accidentPreProjectEntity"
      @successCb="initData"
    ></project-summary>
  </div>
</template>

<script>
  import ProjectDetails from './components/projectDetails'
  import PlanList from './components/planList'
  import ProjectSummary from './components/projectSummary'
  import { getProjectDetails } from '@/service/accidentManagement'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ServiceAdd',
    components: {
      ProjectDetails,
      PlanList,
      ProjectSummary,
    },
    data() {
      return {
        data: {},
      }
    },
    computed: {},
    mounted() {
      this.initData()
    },
    methods: {
      async initData() {
        let res = await getProjectDetails(this.$route.query.id)
        if (res.code === '0000') {
          this.data = res.data
        }
      },
    },
  }
</script>

<style scoped lang="less">
  #projectDetails {
    // margin: 10px;
    background-color: #fff;
    margin: 0 20px;
    // padding-bottom: 20px;
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
