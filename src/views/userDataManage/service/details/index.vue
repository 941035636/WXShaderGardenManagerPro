<template>
  <div id="servicrDetails">
    <div class="detailClass">
      服务机构详情
      <p class="backBtn">
        <span @click="back" style="color: #FA8C16;margin-left: 40px;cursor: pointer;"><i class="iconfont icon-fanhui"></i>返回列表页</span>
      </p>
       
    </div>
    <Title :title="data.orgName"></Title>
    <div class="row">
      <el-row type="flex" class="row-bg">
        <el-col :span="11">
          <span class="title">社会信用代码：</span>
          <span>{{ data.businessCode }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="11">
          <span class="title">法定代表人姓名：</span>
          <span>{{ data.legalPersonName }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="11">
          <span class="title">法定代表人联系电话：</span>
          <span>{{ data.legalPersonPhone }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="11">
          <span class="title">安责险业务服务责任姓名：</span>
          <span>{{ data.safetyCharger }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="11">
          <span class="title">安责险业务负责人联系电话：</span>
          <span>{{ data.safetyChargerPhone }}</span>
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
    </div>
    <Title class="mt20" title="专家信息"></Title>
    <div class="row">
      <el-table
    
        :data="tableExpertList"
        border
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="getRowClass"
      >
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
        >
          <template slot-scope="scope">
            <span>{{ scope.row.safetyTechniciansSeniority }}年</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="serviceAccidentName"
          label="主要服务项目"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column
          prop="serviceIndustry"
          label="主要服务行业领域"
          show-overflow-tooltip
        ></el-table-column> -->
        <el-table-column label="操作"  v-if="isAuth('10063')">
          <template slot-scope="scope">
            <el-button type="text" @click="addExpert(scope.row, scope.$index)">
              编辑
            </el-button>
            <el-button
              style="color: #f00"
              type="text"
              @click="del(scope.row, scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <safetyAdd @getMsg="getList" ref="AddSafty" />
  </div>
</template>

<script>
import Title from "@/components/Title";
import userManage from "@/service/userManage.js";
import policyentryService from "@/service/PolicyentryService";
import buttonSelection from "../../../policyentry/js/buttonSelection";
import getCascaderObj from "../../../policyentry/js/selectedOptions";
import safetyAdd from "../components/expertAdd.vue";
import { mapGetters } from "vuex";
export default {
  name: "ServicrDetails",
  components: {
    Title,
    safetyAdd,
  },
  data() {
    return {
      userManage: new userManage(),
      policyentryService: new policyentryService(),
      ButtonSelection: new buttonSelection(),
      select: new getCascaderObj(),
      expertForm: {
        ps: 999,
        pn: 1,
      },
      data: {},
      tableExpertList: [],
    };
  },
  computed: {
    ...mapGetters({
      getEnumAll: "getEnumAll",
    }),
  },
  created() {
    // this.$store.dispatch("setEnumInfo");
    this.initData();
  },
  mounted() {},
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#b8d9fd;text-align:center;color:#0050b3";
      } else {
        return "";
      }
    },
    getList() {
      this.getOrgExpertDetail();
    },
    back() {
      this.$router.go(-1);
    },
    async initData() {
      // 初始化加载
      let data = {
        servicename: "safetyOrganizationSvc",
        code: this.$route.query.code,
      };
      let res = await this.userManage.detailOrganization(data);
      if (res.code === "0000") {
        this.data = res.data;
      }
      this.getOrgExpertDetail();
    },
    async getOrgExpertDetail() {
      // 获取专家详细列表
      let res = await this.userManage.getOrgExpert(
        this.expertForm,
        "safetyOrganizationSvc",
        this.$route.query.code
      );
      if (res.code == "0000") {
        this.tableExpertList = res.list.map((item) => {
          if (item.serviceAccidentTypes) {
            //拼接主要服务项目
            item.serviceAccidentName = item.serviceAccidentTypes
              .map((obj) => {
                return obj.serviceAccidentTypeName;
              })
              .join(",");
          }
          if (item.expertType && item.expertType != "4") {
            //专家类型 1-保险机构 2-保险经纪机构 3-服务机构 4|空 - 个人 ,
            item.expertTypeName = this.getEnumAll.ExpertTypeEnum.find(
              (it) => it.code == item.expertType
            ).label;
          } else {
            item.expertTypeName = "个人";
          }
          let safetyTechniciansCertificateName =
            this.getEnumAll.CertificateTypeEnum.find(
              (it) => it.strCode == item.safetyTechniciansCertificateType
            )
          let safetyTechnicians = this.getEnumAll.ExpertDutyEnum.find(
            (it) => it.strCode == item.safetyTechniciansPost
          )
          item.safetyTechnicians = safetyTechnicians ? safetyTechnicians.label : ''
          item.safetyTechniciansCertificateName = safetyTechniciansCertificateName ? safetyTechniciansCertificateName.label : ''
          return item
        });
        console.log(this.tableExpertList);
      }
    },
    del(val, index) {
      //删除当前行数据
      this.$confirm("永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
          let res = await this.userManage.deleteExpert(val.id);
          if (res.code == "0000") {
            this.tableExpertList.splice(index, 1);
            this.$message.success("删除成功");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    addExpert(row, index) {
      this.$refs.AddSafty.code = row.id;
      this.$refs.AddSafty.orgName = this.data.orgName;
      this.$refs.AddSafty.dialogVisible = true;
    },
  },
};
</script>

<style scoped lang="less" scoped>
#servicrDetails {
  padding: 0px 10px 0;
  .detailClass {
    background-color: #fff;
    height: 50px;
    padding-left: 20px;
    line-height: 50px;
    margin-bottom: 20px;
    font-size: 18px;
    .backBtn {
      float: right;
     
      margin-right: 30px;
    }
  }
  .row {
    background-color: #fff;
    padding: 30px;
    .row-bg {
      margin-bottom: 20px;
    }
  }
}
</style>
