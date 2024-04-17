<template>
  <div id="serviceLedger">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="被服务企业：" />
            <el-input
              v-model="ruleForm.enterpriseName"
              size="small"
              clearable
              class="w300"
              placeholder="请输入被服务企业"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="服务项目类型：" />
            <el-cascader
              v-model="preTypeList"
              class="w300"
              size="small"
              clearable
              placeholder="请选择服务项目类型"
              :options="typeData"
              :props="{
                checkStrictly: true,
                value: 'itemValue',
                label: 'itemText',
                children: 'sysDictItemEntitys',
              }"
              filterable
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">发起机构：</span>
            <el-select
              v-model="ruleForm.createOrg"
              filterable
              class="w300"
              clearable
              placeholder="请选择类型"
            >
              <el-option
                v-for="(item, key) in insuranceList"
                :key="key"
                :label="item.orgName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">服务起期：</span>
            <el-date-picker
              v-model="dateArray"
              class="w300"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">服务机构：</span>
            <el-select
              v-model="ruleForm.serviceAgencyCode"
              filterable
              class="w300"
              clearable
              placeholder="请选择服务机构"
            >
              <el-option
                v-for="(item, key) in branchList"
                :key="key"
                :label="item.orgName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">所属行业：</span>
            <el-cascader
              v-model="manageId"
              filterable
              placeholder="请选择管理分类"
              clearable
              class="w300"
              :options="manageData"
              :props="{
                checkStrictly: true,
                label: 'itemText',
                value: 'itemValue',
                children: 'sysDictItemEntitys',
              }"
            ></el-cascader>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="spread" class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">所在区域：</span>
            <el-cascader
              v-model="areaCascaser"
              class="w300"
              :options="areaList"
              :props="{ checkStrictly: true }"
              clearable
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">服务状态：</span>
            <el-select
              v-model="ruleForm.planStatus"
              filterable
              class="w300"
              clearable
              placeholder="请选择状态"
            >
              <el-option label="待制定计划" value="1"></el-option>
              <el-option label="进行中" value="2"></el-option>
              <el-option label="已完成" value="3"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div class="ml20 text-center">
        <el-button class="ml20" type="primary" shape="round" @click="search">
          查询
        </el-button>
        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
        <el-button type="primary" @click="addPolicy">导出</el-button>
        <el-button
          v-if="!spread"
          class="btn"
          type="text"
          @click="spread = true"
        >
          展开
          <i class="el-icon-arrow-up" />
        </el-button>
        <el-button
          v-if="spread"
          class="btn"
          type="text"
          @click="spread = false"
        >
          收起
          <i class="el-icon-arrow-down" />
        </el-button>
      </div>
    </div>
    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span class="searchList">查询列表</span>
          <span class="totNum ml15">共{{ total }}条记录</span>
        </el-col>
      </el-row>
      <div class="mt8">
        <el-table
          :data="tableList"
          border
          header-row-class-name="headName"
          :header-cell-style="getRowClass"
        >
          <el-table-column label="被服务企业" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                {{ scope.row.enterpriseName ? scope.row.enterpriseName : '—' }}
              </div>
              <div class="mt8 mb8">
                <span>
                  所属行业：{{
                    scope.row.firstIndustryName
                      ? scope.row.firstIndustryName
                      : '—'
                  }}
                </span>
                <span v-if="scope.row.secondIndustryName">
                  /{{ scope.row.secondIndustryName }}
                </span>
              </div>
              <div class="mt8 mb8">
                <span>
                  所在区域：{{ scope.row.provinceName }}/{{
                    scope.row.cityName
                  }}/{{ scope.row.countyName }}
                </span>
                <span v-if="scope.row.sreetName">
                  /{{ scope.row.sreetName }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="服务类型" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.preFirstTypeName }}
              <span v-if="scope.row.preSecondTypeName">
                /{{ scope.row.preSecondTypeName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="服务计划" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="mt8 mb8">
                <span>
                  服务期间：{{ scope.row.startTime }}-{{ scope.row.endTime }}
                </span>
              </div>
              <div class="mt8 mb8">
                <span>安全服务机构：{{ scope.row.serviceAgencyName }}</span>
              </div>
              <div class="mt8 mb8">
                <span>服务专家：</span>
                {{ scope.row.expertNames }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="服务状态" width="170" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.planStatus == 1" class="color-FF9228">
                  待制定计划
                </span>
                <span v-if="scope.row.planStatus == 2" class="color-green">
                  进行中
                </span>
                <span v-if="scope.row.planStatus == 3" class="color-blue">
                  已完成
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="170"
            label="发起机构"
            prop="insuranceCorporationName"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Label1 from '@/components/label/index'
import { getBranchList } from '@/api/userDataManagement'
import { mapGetters } from 'vuex'
import { dictItem, getIntrilute } from '@/api/policyManagement'
import { getServedEnterprise, downloadServedEnterprise } from '@/api/Leager'
import { getSysDate } from '@/api/userManagement'
import { getAreaDetail } from '@/api/Areas'
export default {
  name: 'ServiceLedger',
  components: {
    Label1,
  },
  data() {
    return {
      ruleForm: {
        pn: 1,
        ps: 10,
        desc: false,
        orderby: '',
        firstIndustryCode: '', //一级行业分类
        secondIndustryCode: '', //二级行业分类
        enterpriseName: '', // 企业名称
        preFirstType: '', //服务项目类型
        preSecondType: '', //服务项目类型
        createOrg: '', //发起机构
        serviceAgencyCode: '', //服务机构
        insuranceCorporationType: '',
        // nationalEconomyClassificationId: [], // 行业编码
        planStatus: '', //状态
        provinceCode: '', // 省
        cityCode: '', // 市
        countyCode: '', //县
        streetCode: '', // 街道
        serviceTimeStart: '', // 出险时间 开始
        serviceTimeEnd: '', // 出险时间 结束
      },
      typeData: [],
      manageId: [],
      preTypeList: [],
      // 时间数组
      allArea: [], //区域下拉框
      manageData: [], //管理数据
      insuranceList: [],
      industryData: [], //行业分类
      branchList: [],
      dateArray: [],
      tableList: [],
      total: 0,

      spread: false, //控制展开收起
      enumDetails: {},

      areaCascaser: [],
    }
  },
  computed: {
    ...mapGetters({
      areaList: 'areas/areaList',
      enmuList: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.initData()
  },

  methods: {
    async initData() {
      let res = await dictItem(true, 20004)
      if (res.code == '0000') {
        this.typeData = res.data
      }
     
      this.getManageData()
      this.getInsititu()
      this.getBranchList('safetyOrganizationSvc')
      this.search()
    },
    async getManageData() {
      // 获取行业领域数据
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.manageData = res.data
      }
    },

    async getBranchList(servicename) {
      let from = {
        pn: 1,
        ps: 100,
        name: '',
        agencyNature: '',
        bl: '',
        status: '1',
        code: '',
        desc: false,
        orderby: '',
        type: '',
        servicename,
      }
      let res = await getBranchList(from)
      if (res.code === '0000') {
        // servicename = insuranceBrokerSvc 保险经纪机构,insuranceCompanySvc 保险机构,safetyOrganizationSvc 安全服务机构
        if (servicename == 'safetyOrganizationSvc') {
          this.branchList = res.list
        }
      }
    },
    async getInsititu() {
      let res = await getIntrilute()
      if (res.code === '0000') {
        this.insuranceList = res.list
      }
    },
    async getCaseList() {
      let res = await getServedEnterprise(this.ruleForm)
      if (res.code === '0000') {
        this.total = res.total
        this.tableList = res.list
      }
    },
    getRuleForm() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.ruleForm.serviceTimeStart =
        this.dateArray && this.dateArray[0]
          ? this.dateArray[0] + ' 00:00:00'
          : ''
      this.ruleForm.serviceTimeEnd =
        this.dateArray && this.dateArray[1]
          ? this.dateArray[1] + ' 23:59:59'
          : ''
      if (this.ruleForm.createOrg) {
        this.ruleForm.insuranceCorporationType = this.insuranceList.find(
          (item) => {
            return item.id == this.ruleForm.createOrg
          }
        ).orgType
      }
      this.ruleForm.preFirstType = this.preTypeList[0] || ''
      this.ruleForm.preSecondType = this.preTypeList[1] || ''
      this.ruleForm.firstIndustryCode = this.manageId[0] || ''
      this.ruleForm.secondIndustryCode = this.manageId[1] || ''

      this.ruleForm.provinceCode = this.areaCascaser[0] || ''
      this.ruleForm.cityCode = this.areaCascaser[1] || ''
      this.ruleForm.countyCode = this.areaCascaser[2] || ''
      this.ruleForm.streetCode = this.areaCascaser[3] || ''
    },
    async addPolicy() {
      let resT = await getSysDate()
      let date = null
      if (resT.code === '0000') {
        date = resT.data
      } else {
        this.$baseMessage('获取服务器时间失败，已改为获取系统时间', 'error')
        let newDate = new Date()
        date = newDate.toLocaleString()
      }
      await this.getRuleForm()

      this.ruleForm.ps = this.total
      let res = await downloadServedEnterprise(this.ruleForm)
      let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
      const fileName = `被服务企业台账数据${date}.xls`
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      // link.href = res.data
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(link.href)

      this.ruleForm.ps = 10
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;'
      } else {
        return ''
      }
    },
    async search() {
      await this.getRuleForm()
      this.getCaseList()
    },

    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getCaseList()
    },
    // 重置
    reset() {
      this.dateArray = []
      this.ruleForm = {
        pn: 1,
        ps: 10,
        desc: false,
        orderby: '',
        firstIndustryCode: '', //一级行业分类
        secondIndustryCode: '', //二级行业分类
        enterpriseName: '', // 企业名称
        preFirstType: '', //服务项目类型
        preSecondType: '', //服务项目类型
        createOrg: '', //发起机构
        serviceAgencyCode: '', //服务机构
        insuranceCorporationType: '',
        // nationalEconomyClassificationId: [], // 行业编码
        planStatus: '', //状态
        provinceCode: '', // 省
        cityCode: '', // 市
        countyCode: '', //县
        streetCode: '', // 街道
        serviceTimeStart: '', // 出险时间 开始
        serviceTimeEnd: '', // 出险时间 结束
      }
      this.manageId = []
      this.areaCascaser = []
      this.preTypeList = []

      this.getCaseList()
    },
  },
}
</script>

<style lang="scss" scoped>
#serviceLedger {
  .row-bg {
    margin-bottom: 8px;
    line-height: 40px;
  }
  .teble-list {
    margin: 8px 20px 20px 20px;
  }
}
</style>
<style>
html body .el-table .headName .cell {
  font-weight: bold;
}
html body .el-range-editor--small.el-input__inner {
  margin-top: 4px;
}
html body .el-cascader--small {
  line-height: 40px;
}
</style>
