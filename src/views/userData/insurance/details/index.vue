<template>
  <div id="insuranceDetail">
    <Title title="保险机构信息"></Title>
    <div class="row">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">保险机构名称：</span>
          <span>{{ data.orgName }}</span>
        </el-col>
        <el-col v-if="data.headquartersName" :span="8">
          <span class="title">保险经纪机构名称：</span>
          <span>{{ data.headquartersName }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">社会信用代码：</span>
          <span>{{ data.businessCode }}</span>
        </el-col>
        <el-col :span="8">
          <span class="title">机构代码：</span>
          <span>{{ data.orgCode }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="16">
          <span class="title">实际经营地址：</span>
          <span>{{ data.provinceName }}</span>
          <span>{{ data.cityName }}</span>
          <span>{{ data.countyName }}</span>
          <span>{{ data.streetName }}</span>
          <span>{{ data.detailAddr }}</span>
        </el-col>
      </el-row>

      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">安责险业务服务人姓名：</span>
          <span>{{ data.safetyCharger }}</span>
        </el-col>
        <el-col :span="8">
          <span class="title">安责险业务负责人联系电话：</span>
          <span>{{ data.safetyChargerPhone }}</span>
        </el-col>
      </el-row>
      <!-- <el-row type="flex" class="row-bg">
        <el-col :span="24">
          <span class="title">主要负责项目：</span>
          <span>{{ data.serviceAccidentName }}</span>
        </el-col>
      </el-row> -->
      <!-- <el-row type="flex" class="row-bg">
        <el-col :span="24">
          <span class="title">主要服务行业领域：</span>
          <span>{{ data.serviceIndustry }}</span>
        </el-col>
      </el-row> -->
    </div>
    <Title title="安全生产专业技术人员信息"></Title>
    <el-table
      :data="tableExpertList"
      border
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="getRowClass"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column
        prop="safetyTechniciansName"
        label="姓名"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="safetyTechniciansPhone"
        label="联系电话"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="expertTypeName"
        label="类型"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="safetyTechniciansCompany"
        label="工作单位"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="safetyTechniciansCertificateName"
        label="证件类型"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="safetyTechniciansCertificate"
        label="证件号码"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="safetyTechnicians"
        label="职务/职称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="safetyTechniciansEducation1"
        label="最高学历"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="safetyTechniciansMajor"
        label="专业"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="safetyTechniciansSeniority"
        label="从事安全生产工作年限"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="serviceAccidentName"
        label="主要服务项目"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="serviceIndustry"
        label="主要服务行业领域"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import Title from '@/components/NewTitle'
  import {
    getBranchDetails,
    getOrgExpertDetail,
  } from '@/api/userDataManagement'
  import { mapGetters } from 'vuex'
  import { getAreaName } from '@/api/Areas'
  export default {
    name: 'InsuranceDetail',
    components: {
      Title,
    },
    data() {
      return {
        data: {},
        tableExpertList: [],
        expertForm: {
          ps: 10,
          pn: 1,
        },
      }
    },
    computed: {
      ...mapGetters({
        areaList: 'areas/areaList',
        areaListAll: 'areas/areaListAll',
        areaMap: 'areas/areaMap',
        getStrEnumAll: 'enums/getStrEnumAll',
      }),
    },
    mounted() {
      this.initData()
    },
    methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5;text-align:center'
        } else {
          return ''
        }
      },
      async initData() {
        let data = {
          servicename: 'insuranceCompanySvc',
          code: this.$route.query.code,
        }
        let res = await getBranchDetails(data)
        if (res.code === '0000') {
          // 服务项目编码转中文
          // res.data.serviceAccidentName = this.getStrEnumAll.ServiceItemsEnum.find(
          //   (item) => item.strCode == res.data.serviceAccidentType
          // ).label
          res.data.provinceName = this.areaMap[res.data.provinceCode]
          res.data.cityName = this.areaMap[res.data.cityCode]
          res.data.countyName = this.areaMap[res.data.countryCode]
          if (res.data.streetCode) {
            let res1 = await getAreaName(res.data.streetCode)
            res.data.streetName = res1.data[0].regionName
          }

          this.data = res.data
        }
        this.getOrgExpertDetail()
      },
      async getOrgExpertDetail() {
        // 获取专家详细列表
        let res = await getOrgExpertDetail(
          this.expertForm,
          'insuranceCompanySvc',
          this.$route.query.code
        )
        if (res.code == '0000') {
          res.list.map((item) => {
            if (item.serviceAccidentTypes) {
              //拼接主要服务项目
              item.serviceAccidentName = item.serviceAccidentTypes
                .map((obj) => {
                  return obj.serviceAccidentTypeName
                })
                .join(',')
            }
            if (item.expertType && item.expertType != '4') {
              //专家类型 1-保险机构 2-保险经纪机构 3-服务机构 4|空 - 个人 ,
              item.expertTypeName = this.getStrEnumAll.ExpertTypeEnum.find(
                (it) => it.code == item.expertType
              ).label
            } else {
              item.expertTypeName = '个人'
            }
            item.safetyTechniciansCertificateName =
              this.getStrEnumAll.CertificateTypeEnum.find(
                (it) => it.code == item.safetyTechniciansCertificateType
              ).label
            item.safetyTechnicians =
              this.getStrEnumAll.SafetyTechniciansPostEnum.find(
                (it) => it.code == item.safetyTechniciansPost
              ).label
          })
          console.log(res.list)
          this.tableExpertList = res.list
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  #insuranceDetail {
    margin: 10px;
    .row {
      margin-left: 30px;
      .row-bg {
        margin-bottom: 20px;
      }
    }
  }
</style>
