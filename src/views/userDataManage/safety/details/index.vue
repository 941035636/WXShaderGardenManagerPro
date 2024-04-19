<template>
  <div id="safetyDetails">
    <Title title="安全专家详情"></Title>
    <div class="row">
      <el-row type="flex" class="row-bg">
        <el-col :span="11">
          <span class="title">姓名：</span>
          <span>{{ data.safetyTechniciansName }}</span>
        </el-col>
        <el-col :span="11">
          <span class="title">联系电话：</span>
          <span>{{ data.safetyTechniciansPhone }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="11">
          <span class="title">类型：</span>
          <span>{{ data.expertTypeName }}</span>
        </el-col>
        <el-col :span="11">
          <span class="title">工作单位：</span>
          <span>{{ data.safetyTechniciansCompany }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="11">
          <span class="title">证件类型：</span>
          <span>{{ data.safetyTechniciansCertificateName }}</span>
        </el-col>
        <el-col :span="11">
          <span class="title">证件号码：</span>
          <span>{{ data.safetyTechniciansCertificate }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="11">
          <span class="title">职务/职称：</span>
          <span>{{ data.safetyTechnicians }}</span>
        </el-col>
        <el-col :span="11">
          <span class="title">最高学历：</span>
          <span>{{ data.safetyTechniciansEducation1 }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="11">
          <span class="title">专业：</span>
          <span>{{ data.safetyTechniciansMajor }}</span>
        </el-col>
        <el-col :span="11">
          <span class="title">从业安全生产工作年限：</span>
          <span>{{ data.safetyTechniciansSeniority }}年</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="16">
          <span class="title">主要负责项目：</span>
          <span>{{ data.serviceAccidentName }}</span>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="16">
          <span class="title">主要服务行业领域：</span>
          <span>{{ data.serviceIndustry }}</span>
        </el-col>
      </el-row> -->
    </div>
    <div style="text-align: center; margin: 30px 0">
      <el-button type="info" round @click="goBack">返 回</el-button>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/Title';
    import userManage from "@/service/userManage.js";
    import { mapGetters } from "vuex";
  export default {
    name: 'SafetyDetails',
    components: {
      Title,
    },
    data() {
      return {
        userManage:new userManage(),
        data: {},
        tableExpertList: [],
      }
    },
    computed: {
   ...mapGetters({
      getEnumAll: "getEnumAll",
    }),
    },
    created(){
  this.$store.dispatch("setEnumInfo");
    },
    mounted() {
   this.initData()
    },
    methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5'
        } else {
          return ''
        }
      },
      async initData() {
        // 初始化数据
        let res = await this.userManage.getExpertDetail(this.$route.query.code)
        if (res.code === '0000') {
          // 服务机构编码转中文
          res.data.serviceAccidentName = res.data.serviceAccidentTypes
            .map((obj) => {
              return obj.serviceAccidentTypeName
            })
            .join(',')
          let {label:safetyTechniciansCertificateName} =  this.getEnumAll.CertificateTypeEnum.find(
              (it) => it.code == res.data.safetyTechniciansCertificateType
            ) || {} // 1
          res.data.safetyTechniciansCertificateName = safetyTechniciansCertificateName
          let {label : safetyTechnicians} =
            this.getEnumAll.ExpertDutyEnum.find(
              (it) => it.code == res.data.safetyTechniciansPost
            ) || {} // 02
          res.data.safetyTechnicians = safetyTechnicians
          if (res.data.expertType && res.data.expertType != '4') {
            //专家类型 1-保险机构 2-保险经纪机构 3-服务机构 4|空 - 个人 ,
            res.data.expertTypeName = this.getEnumAll.ExpertTypeEnum.find(
              (it) => it.code == res.data.expertType
            ).label
          } else {
            res.data.expertTypeName = '个人'
          }
          // this.getEnumAll.ServiceItemsEnum.find(
          //   (item) => item.strCode == res.data.serviceAccidentType
          // ).label
        
          this.data = res.data
        }
      },
      goBack() {
        this.$router.go(-1)
      },
    },
  }
</script>

<style scoped lang="less">
  #safetyDetails {
    margin: 20px;
    padding:0px 10px 100px;
background-color: #fff;
    .row {
      margin: 30px;
      .row-bg {
        margin-bottom: 20px;
      }
    }
  }
</style>
