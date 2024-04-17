<template>
  <el-dialog id="ServiceDetails" title="服务机构详情" :visible.sync="dialogVisible" :close-on-click-modal="false" width="80%"
    append-to-body @open="initData">
    <div id="highRiskDetails">
      <el-form label-position="left" label-width="142px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="机构名称：">
              <span>{{ data.orgName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="社会信用代码：">
              {{ data.businessCode }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="营业执照：">
              <span v-if="data.businessLicenseFileId" @click="checkBsp" class="downloadfile">
                查看附件
              </span>
              <span v-else>--</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="经营地址：">
              {{ data.provinceName }}/{{ data.cityName }}/{{ data.countyName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址：">
              <moreCon :data="data.detailAddr" :length="15" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主要服务项目：">
              <moreCon :data="data.serviceAccidentName" :length="15" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="主要服务行业领域：">
              <moreCon :data="data.serviceIndustry" :length="15" />
            </el-form-item>
          </el-col>
        </el-row>
        <p class="stitle">法人代表</p>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名：">
              {{ data.legalPersonName || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：">
              {{ data.legalPersonPhone || '--' }}
            </el-form-item>
          </el-col>
        </el-row>
        <p class="stitle">业务负责人</p>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名：">
              {{ data.safetyCharger || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：">
              {{ data.safetyChargerPhone || '--' }}
            </el-form-item>
          </el-col>
        </el-row>
        <p class="stitle">技术人员信息</p>
        <el-table class="elTable" :data="tableExpertList" border header-row-class-name="headName" :header-cell-style="getRowClass">
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="orgName" label="人员类型" width="120px" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                {{ scope.row.employTypeName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="基本信息" width="270px">
            <template slot-scope="scope">
              <div>
                <p>{{ scope.row.safetyTechniciansName || '--' }}/{{ scope.row.safetyTechniciansPhoneStr || '--' }}</p>
                <p>居民身份证：{{ scope.row.safetyTechniciansCertificateStr || '--' }}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="safetyTechniciansEducation1" label="学历专业" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{ scope.row.safetyTechniciansEducation1 || '--' }}/{{ scope.row.safetyTechniciansMajor || '--' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="年限/职称" width="130" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.safetyTechniciansSeniority || '--' }}</div>
              <div>{{ scope.row.safetyTechnicians || '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="serviceAccidentName" label="主要服务项目" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <p v-for="item in scope.row.serviceAccidentName" :key="item">{{ item }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="serviceIndustryName" label="主要服务行业领域">
            <template slot-scope="scope">
              <div>
                <p v-for="item in scope.row.serviceIndustryName" :key="item">{{ item }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="expertStatus" label="状态" align="center" width="100px">
            <template slot-scope="scope">
              <div :style="{ 'color': scope.row.expertStatus == '1' ? '#389E0D' : '#F5222D' }">
                {{ scope.row.expertStatus == '1' ? '有效' : '无效' }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import Title from '@/components/NewTitle'
import { getAreaName } from '@/api/Areas'
import { getFile } from '@/api/resources'
import {
  getBranchDetails,
  getOrgExpertDetail,
} from '@/api/userDataManagement'
import moreCon from '@/components/moreCon'
import { mapGetters } from 'vuex'
export default {
  name: 'ServicrDetails',
  components: {
    Title, moreCon
  },
  data() {
    return {
      dialogVisible: false,
      expertForm: {
        ps: 10,
        pn: 1,
      },
      data: {},
      tableExpertList: [],
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
  methods: {
    getInit() { },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5'
      } else {
        return ''
      }
    },
    async initData() {
      // 初始化加载
      let data = {
        servicename: 'safetyOrganizationSvc',
        code: this.code,
      }
      let res = await getBranchDetails(data)
      if (res.code === '0000') {
        // 服务项目编码转中文

        // res.data.serviceAccidentName = this.getStrEnumAll.ServiceItemsEnum.find(
        //   (item) => item.strCode == res.data.serviceAccidentType
        // ).label
        if (res.data.serviceAccidentTypes) {
          //拼接主要服务项目
          res.data.serviceAccidentName = res.data.serviceAccidentTypes
            .map((obj) => {
              return obj.serviceAccidentTypeName
            })
            .join('')

        }
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
    checkBsp() {
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let id = this.data.businessLicenseFileId
          console.log(id);
          let res = await getFile('/files/downloadfile/' + id)
          console.log(res, 'res')
        })
        .catch((_) => { })
    },
    async getOrgExpertDetail() {
      // 获取专家详细列表
      let res = await getOrgExpertDetail(
        this.expertForm,
        'safetyOrganizationSvc',
        this.code
      )
      if (res.code == '0000') {
        res.list.map((item) => {
          if (item.serviceAccidentTypes) {
            //拼接主要服务项目
            item.serviceAccidentName = item.serviceAccidentTypes
              .map((obj) => {
                return obj.serviceAccidentTypeName
              })
          }
          if(item.serviceIndustry) {
            item.serviceIndustryName = item.serviceIndustry.split(',')
          }
          // 转换 自有/外聘
          if (item.employType) {
            item.employTypeName = this.getStrEnumAll.ExpertEmployTypeEnum.find(item1 => item1.strCode == item.employType).label
          }
          if (item.expertType && item.expertType != '4') {
            //专家类型 1-保险机构 2-保险经纪机构 3-服务机构 4|空 - 个人 ,
            item.expertTypeName = this.getStrEnumAll.ExpertTypeEnum.find(
              (it) => it.code == item.expertType
            ).label
          } else {
            item.expertTypeName = '个人'
          }
          if (item.safetyTechniciansCertificateType) {
            item.safetyTechniciansCertificateName =
              this.getStrEnumAll.CertificateTypeEnum.find(
                (it) => it.code == item.safetyTechniciansCertificateType
              ).label
          }

          if (item.safetyTechniciansPost) {
            item.safetyTechnicians =
              this.getStrEnumAll.SafetyTechniciansPostEnum.find(
                (it) => it.code == item.safetyTechniciansPost
              ).label
          }
          if (item.safetyTechniciansPhone) {
            item.safetyTechniciansPhoneStr = this.maskCodeFn(item.safetyTechniciansPhone, 3, 8)
          }
          if (item.safetyTechniciansCertificate) {
            item.safetyTechniciansCertificateStr = this.maskCodeFn(item.safetyTechniciansCertificate, 4, item.safetyTechniciansCertificate.length - 3)
          }
        })
        this.tableExpertList = res.list
      }
    },
    maskCodeFn(str, start, end) {
      const arr = str.split('')
      for (let i = start; i < end; i += 1) {
        arr[i] = '*'
      }
      return arr.join('')
    }
  },
}
</script>

<style lang="scss" scoped>
#highRiskDetails {
  background-color: #fff;
  width: 90%;
  margin: 0 auto;

  .stitle {
    font-weight: bold;
    color: #000;
  }
  
  .elTable {
    p {
      margin: 0
    }
  }

  .downloadfile {
    color: #fa8c16;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
<style >
#highRiskDetails .el-form-item__label {
  color: #919191;
}

#highRiskDetails .el-form-item {
  margin-bottom: 5px;
}

html body .el-table .headName .cell {
  font-weight: bold;
}
</style>
