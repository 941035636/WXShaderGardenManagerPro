<template>
  <div id="policyLedger">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">被保人名称：</span>
            <el-input
              v-model="ruleForm.insuredName"
              size="small"
              placeholder="请输入被保人名称"
              class="w300"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">保单编码：</span>
            <el-input
              v-model="ruleForm.policyNo"
              size="small"
              class="w300"
              placeholder="请输入保单号"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">所属行业：</span>
            <el-cascader
              v-model="nationalEconomyClassificationId"
              filterable
              placeholder="请选择行业分类"
              class="w300"
              clearable
              :options="industryData"
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
      <el-row class="row-bg">
        <!-- <el-col :span="8">
          <div style="display: flex">
            <span class="item3">签单日期：</span>
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
        </el-col> -->
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">保险机构：</span>
            <el-select
              v-model="ruleForm.issuingCompanyCode"
              filterable
              placeholder="请选择保险机构"
              class="w300"
              clearable
            >
              <el-option
                v-for="(item, index) in companyList"
                :key="index"
                :value="item.orgCode"
                :label="item.orgName"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">所在区域：</span>
            <el-cascader
              v-model="areaCascaser"
              filterable
              class="w300"
              :options="areaList"
              :props="{ checkStrictly: true }"
              clearable
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">业务机构：</span>
            <el-select
              v-model="ruleForm.businessOrgId"
              placeholder="请选择"
              class="w300"
              filterable
              clearable
            >
              <el-option
                v-for="(item, index) in instiList"
                :key="index"
                :value="item.id"
                :label="item.orgName"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="spread" class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">项目类型：</span>
            <el-select
              v-model="ruleForm.projectType"
              placeholder="请选择"
              class="w300"
              clearable
            >
              <el-option
                v-for="(item, index) in projectTypes"
                :key="index"
                :value="item.code"
                :label="item.name"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="24" style="text-align: center">
          <el-button
            class="ml20"
            type="primary"
            shape="round"
            @click="search()"
          >
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
        </el-col>
      </el-row>
      <div class="ml20 text-center"></div>
    </div>

    <div class="elsearch_new">
      <el-row>
        <el-col :span="22">
          <div class="mt8">
            <span class="searchList">查询列表</span>
            <span class="totNum ml15">共{{ total }}条记录</span>
          </div>
        </el-col>
      </el-row>
      <div class="mt8">
        <el-table
          :data="dataList"
          border
          header-row-class-name="headName"
          :header-cell-style="getRowClass"
        >
          <el-table-column
            label="序号"
            align="left"
            width="50"
            type="index"
          ></el-table-column>
          <el-table-column label="保险信息" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- <p>
                保单号：{{ scope.row.policyNo }}
                <span v-if="scope.row.renewal == 'N'" class="new_p ml20">
                  新保
                </span>
                <span v-if="scope.row.renewal == 'Y'" class="old_p ml20">
                  续保
                </span>
              </p> -->
              <p>
                保险期间： {{ scope.row.startTime }} - {{ scope.row.endTime }}
              </p>
              <!-- <p>
                签单日期：{{
                  scope.row.signTime ? scope.row.signTime : '—' | setTime
                }}
              </p> -->
              <p>
                <span>从业人数：{{ scope.row.employeeNum }}人</span>
                <span class="ml20">
                  累计责任限额：{{
                    (scope.row.limitValue / 10000).toFixed(2)
                  }}万元
                </span>
              </p>
              <p>保险机构：{{ scope.row.issuingCompanyName }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="投保人/被保人"
            align="left"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>
                投保人：
                <TipsText :text="scope.row.holderName" :length="16" />
              </p>
              <p>
                被保人：
                <TipsText :text="scope.row.insuredName" :length="16" />
              </p>

              <p>
                所属行业：
                <span v-if="!scope.row.firstIndustryName">-</span>
                {{ scope.row.firstIndustryName }}
                <span v-if="scope.row.secondIndustryName">
                  ,{{ scope.row.secondIndustryName }}
                </span>
                <span
                  v-if="scope.row.firstIndustryName == '建筑施工'"
                  @click="project(scope.row)"
                  style="color: #fa843b; cursor: pointer"
                >
                  查看项目
                </span>
              </p>
              <p>
                所在区域：
                <span v-if="scope.row.provinceName">
                  {{ scope.row.provinceName }}/ {{ scope.row.cityName }} /{{
                    scope.row.countyName
                  }}
                  <!-- <span v-if="scope.row.areaName">
                    /{{ scope.row.areaName }}
                  </span> -->
                </span>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            width="230"
            label="费用信息"
            align="left"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>
                保单保费：
                <span v-if="scope.row.actualPrem">
                  ￥ {{ scope.row.actualPrem.toFixed(2) }}
                </span>
                <span v-else>—</span>
              </p>
              <p>
                事故预防费比例：
                <span v-if="scope.row.accidentRate">
                  {{ (scope.row.accidentRate * 100).toFixed(2) }}%
                </span>
                <span v-else>—</span>
              </p>
              <p>
                事故预防费用：{{
                  scope.row.accidentCost
                    ? '￥' + scope.row.accidentCost.toFixed(2)
                    : '—'
                }}
              </p>
            </template>
          </el-table-column>
          <el-table-column width="150" label="业务归属" align="center">
            <template slot-scope="scope">
              <TipsText
                v-if="scope.row.businessOrgName"
                :text="scope.row.businessOrgName"
                :length="8"
              />

              <span v-if="scope.row.projectType">
                — {{ scope.row.projectType }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="满意度" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.comment">{{ scope.row.comment }}分</span>
              <span v-if="!scope.row.comment">——</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog title="项目信息" :visible.sync="dialogTableVisible">
      <el-table
        :data="gridData"
        border
        :header-cell-style="{ background: '#f5f5f5' }"
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
          center
        ></el-table-column>
        <el-table-column
          property="projectName"
          label="项目名称"
          width="200"
        ></el-table-column>
        <el-table-column label="项目地址">
          <template slot-scope="scope">
            {{ scope.row.projectProvinceName }}/{{
              scope.row.projectCityName
            }}/{{ scope.row.projectCountyName }}/{{
              scope.row.projectDetailAddress
            }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getAreaDetail } from '@/api/Areas'
import { dictItem, getIntrilute } from '@/api/policyManagement'
import { getBranchList } from '@/api/userDataManagement'
import { getSysDate } from '@/api/userManagement'
import { getPolicyLeagerList, downloadPolicyLeagerList } from '@/api/Leager'
import { mapGetters } from 'vuex'
import TipsText from '@/components/TipsText'
export default {
  name: 'PolicyLedger',
  components: {
    TipsText,
  },
  data() {
    return {
      gridData: [],
      total1: '',
      dialogTableVisible: false,
      ruleForm: {
        areaCode: '',
        cityCode: '',
        countyCode: '',
        provinceCode: '',
        businessOrgId: '',
        businessOrgType: '',
        desc: false,
        firstIndustryCode: '',
        secondIndustryCode: '',
        insuredName: '',
        issuingCompanyCode: '',
        orderby: '',
        pn: 1,
        ps: 10,
        policyNo: '',
        projectType: null,
        signTimeEnd: '',
        signTimeStart: '',
      },
      nationalEconomyClassificationId: [],
      dateArray: [],
      industryData: [], //行业分类
      spread: false, //控制展开收起
      areaCascaser: [],
      instiList: [],
      total: 0,
      value: '',
      projectTypes: [
        {
          code: 1,
          name: '示范项目',
        },
        {
          code: 0,
          name: '非示范项目',
        },
      ],
      renewaledList: [
        {
          code: 'N',
          name: '新保',
        },
        {
          code: 'Y',
          name: '续保',
        },
      ],
      companyList: [],
      allArea: [], //地区下拉框
      dataList: [],
      totalAmount: 0,
      totalEmployes: 0,
      totalPerm: 0,
    }
  },
  computed: {
    ...mapGetters({
      areaList: 'areas/areaList',
    }),
  },
  created() {
    this.init()
  },
  methods: {
    init() {

      this.getCompany() //获取保险机构
      this.getIndustryData() //获取行业分类
      this.getInsititu()
      this.search()
    },

    async getInsititu() {
      let res = await getIntrilute()
      if (res.code === '0000') {
        this.instiList = res.list
      }
    },
    async project(row) {//查看建筑施工
      console.log(row, 'scope.row.');
      this.dialogTableVisible = true
      this.gridData = [row]
      console.log(this.gridData, 'gridData');
    },
    async getCompany() {
      let param = {
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
        servicename: 'insuranceCompanySvc',
      }
      let res = await getBranchList(param)
      if (res.code == '0000') {
        this.companyList = res.list

        let arr = this.companyList.map((item) => {
          return item.orgCode
        })
      }
    },
    async getIndustryData() {
      // 获取行业领域数据
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
      }
    },
    async search() {
      // 查询按钮

      await this.getRuleForm()
      this.getList()
    },
    getRuleForm() {
      this.ruleForm.provinceCode = this.areaCascaser[0] || ''
      this.ruleForm.cityCode = this.areaCascaser[1] || ''
      this.ruleForm.countyCode = this.areaCascaser[2] || ''
      this.ruleForm.areaCode = this.areaCascaser[3] || ''
      this.ruleForm.firstIndustryCode =
        this.nationalEconomyClassificationId[0] || ''
      this.ruleForm.secondIndustryCode =
        this.nationalEconomyClassificationId[1] || ''
      this.ruleForm.signTimeStart = this.dateArray[0] || ''
      this.ruleForm.signTimeEnd = this.dateArray[1] || ''
      if (this.ruleForm.businessOrgId) {
        let obj = this.instiList.find((item) => {
          return item.id == this.ruleForm.businessOrgId
        })
        this.ruleForm.businessOrgType = obj.orgType || ''
      }
    },
    async getList() {
      let res = await getPolicyLeagerList(this.ruleForm)
      if (res.code === '0000') {
        this.total = res.total
        this.dataList = res.list
      }
    },
    reset() {
      // 重置
      this.ruleForm = {
        areaCode: '',
        cityCode: '',
        countyCode: '',
        provinceCode: '',
        businessOrgId: '',
        businessOrgType: '',
        desc: false,
        firstIndustryCode: '',
        secondIndustryCode: '',
        insuredName: '',
        issuingCompanyCode: '',
        orderby: '',
        pn: 1,
        ps: 10,
        policyNo: '',
        projectType: null,
        signTimeEnd: '',
        signTimeStart: '',
      }
      this.dateArray = []
      this.areaCascaser = []
      this.nationalEconomyClassificationId = []
      this.getList()
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:center;'
      } else {
        return ''
      }
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
      let res = await downloadPolicyLeagerList(this.ruleForm)
      let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
      const fileName = `保单台账数据${date}.xls`
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      // link.href = res.data
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(link.href)

      this.ruleForm.ps = 10
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getList()
    },
  },
}
</script>

<style lang="scss" scoped>
#policyLedger {
  .row-bg {
    margin-bottom: 8px;
    line-height: 40px;
  }
  .new_p {
    display: inline-block;
    padding: 0 7px;
    border: 1px solid #2ebc89;
    border-radius: 4px;
    background: #ebfdee;
    color: #2ebc89;
  }
  .old_p {
    display: inline-block;
    padding: 0 7px;
    border: 1px solid #00d1eb;
    border-radius: 4px;
    background: #ebfdfd;
    color: #00d1eb;
  }
}
</style>
<style>
html body .el-table .headName .cell {
  font-weight: bold;
}
html body .el-tooltip__popper {
  max-width: 500px;
}
html body .el-range-editor--small.el-input__inner {
  margin-top: 4px;
}
html body .el-cascader--small {
  line-height: 40px;
}
</style>
