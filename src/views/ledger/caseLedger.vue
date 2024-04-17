<template>
  <div id="caseLedger">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">被保人名称：</span>
            <el-input
              v-model="ruleForm.insuredName"
              size="small"
              clearable
              class="w300"
              placeholder="请输入被保险人名称"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">报案号：</span>
            <el-input
              v-model="ruleForm.caseNo"
              size="small"
              clearable
              class="w300"
              placeholder="请输入报案号"
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
              clearable
              placeholder="请输入保单编码"
            />
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">出险时间：</span>
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
            <span class="item3">出险地区：</span>
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
      <el-row v-if="spread" class="row-bg">
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
            <span class="item3">案件进度：</span>
            <el-select
              v-model="ruleForm.caseStatus"
              class="w300"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, key) in caseStatusOptions"
                :key="key"
                :label="item.label"
                :value="item.value"
              ></el-option>
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
          <el-table-column
            label="序号"
            type="index"
            width="50"
          ></el-table-column>
          <el-table-column label="案件信息" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="mt8 mb8">
                <span>立案号：</span>
                <span class="color-blue">{{ scope.row.caseNo }}</span>
              </div>
              <div class="mt8 mb8">
                <span>出险地区：</span>
                <span>{{ scope.row.accidentProvinceName }}/</span>
                <span>{{ scope.row.accidentCityName }}/</span>
                <span>{{ scope.row.accidentCountyName }}</span>
              </div>
              <div class="mt8 mb8">
                <span>赔付机构：</span>
                <span v-if="!scope.row.issuingCompanyName">-</span>
                <TipsText
                  v-if="scope.row.issuingCompanyName"
                  :text="scope.row.issuingCompanyName"
                  :length="17"
                />
              </div>

              <div class="mt8">
                <span>
                  <span>案件进度：</span>
                  {{ scope.row.caseStatusName }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="伤亡情况" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="mt8 mb8">
                受伤人数：{{
                  scope.row.injuryNum ? scope.row.injuryNum : '0'
                }}人
              </div>
              <div class="mt8 mb8">
                死亡人数：{{ scope.row.deathNum ? scope.row.deathNum : '0' }}人
              </div>
              <div class="mt8 mb8">
                事故原因：
                <TipsText :text="scope.row.lossProcess" :length="15" />
              </div>
              <div class="mt8 mb8">
                事故类型：
                <span v-if="!scope.row.accidentTypeName">-</span>
                {{ scope.row.accidentTypeName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="时间"
            align="left"
            width="200"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="mt8 mb8">出险时间：{{ scope.row.lossTime }}</div>
              <div class="mt8 mb8">
                报案时间：{{
                  scope.row.reportTime ? scope.row.reportTime : '-'
                }}
              </div>
              <div class="mt8 mb8">
                决案时间：{{
                  scope.row.paymentTime ? scope.row.paymentTime : '-'
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="保单信息" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="mt8 mb8">
                保单号：
                <TipsText
                  v-if="scope.row.policyNo"
                  :text="scope.row.policyNo"
                  :length="17"
                />
                <span
                  v-if="scope.row.associationStatus"
                  class="ml5"
                  style="color: #fa8c16"
                >
                  ({{ scope.row.associationStatus }})
                </span>
              </div>
              <div class="mt8 mb8">
                被保人：
                <span v-if="!scope.row.insuredName">-</span>
                <TipsText
                  v-if="scope.row.insuredName"
                  :text="scope.row.insuredName"
                  :length="18"
                />
              </div>
              <div class="mt8 mb8">
                所在区域：
                <span v-if="!scope.row.provinceName">-</span>
                <TipsText
                  v-if="scope.row.areaName && scope.row.provinceName"
                  :text="
                    scope.row.provinceName +
                    '/' +
                    scope.row.cityName +
                    '/' +
                    scope.row.countyName +
                    '/' +
                    scope.row.areaName
                  "
                  :length="18"
                />
                <TipsText
                  v-if="!scope.row.areaName && scope.row.provinceName"
                  :text="
                    scope.row.provinceName +
                    '/' +
                    scope.row.cityName +
                    '/' +
                    scope.row.countyName
                  "
                  :length="18"
                />
              </div>
              <div class="mt8 mb8">
                所属行业：{{
                  scope.row.firstIndustryName
                    ? scope.row.firstIndustryName
                    : '-'
                }}
                <span v-if="scope.row.secondIndustryName">
                  / {{ scope.row.secondIndustryName }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="200" label="费用信息">
            <template slot-scope="scope">
              <div class="mt8 mb8">
                估损金额：￥{{
                  scope.row.totalLossAmount ? scope.row.totalLossAmount : 0
                }}元
              </div>
              <div class="mt8">
                实际赔付金额：￥{{
                  scope.row.paymentLossAmount ? scope.row.paymentLossAmount : 0
                }}元
              </div>
            </template>
          </el-table-column>
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
import { getBranchList } from '@/api/userDataManagement'
import { getStrEnum } from '@/api/caseManagement'
import { dictItem } from '@/api/policyManagement'
import TipsText from '@/components/TipsText'
import { getSysDate } from '@/api/userManagement'
import { getCaseLeagerList, downloadCaseLeagerList } from '@/api/Leager'
import { mapGetters } from 'vuex'
import { getAreaInfo, getAreaDetail } from '@/api/Areas'
export default {
  name: 'CaseLedger',
  components: {
    TipsText,
  },
  data() {
    return {
      ruleForm: {
        pn: 1,
        ps: 10,
        desc: false,
        orderby: '',
        insuredName: '',
        caseNo: '', // 报案号
        policyNo: '',
        firstIndustryCode: '',
        secondIndustryCode: '',
        accidentProvinceCode: '', // 省
        accidentCityCode: '', // 市
        accidentCountyCode: '', //县
        accidentAreaCode: '', // 街道
        caseStatus: '', // 案件状态
        issuingCompanyCode: '',
        lossTimeStart: '', // 出险时间 开始
        lossTimeEnd: '', // 出险时间 结束
      },
      // 时间数组
      allArea: [], //区域下拉框
      dateArray: [],
      tableList: [],
      total: 0,
      companyList: [],
      industryData: [], //行业分类
      spread: false, //控制展开收起
      enumDetails: {},
      caseStatusOptions: [], //案件状态
      areaCascaser: [],
      nationalEconomyClassificationId: [],
    }
  },
  computed: {
    ...mapGetters({
      areaList: 'areas/areaList',
    }),
  },
  created() {
    this.initData()
  },

  methods: {
    async initData() {
      this.getCompany() //获取保险机构
      this.getIndustryData() //获取行业分类
      this.getEnum()
      this.search()
    },

    async getIndustryData() {
      // 获取行业领域数据
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
      }
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
      }
    },
    // 获取案件枚举类
    async getEnum(name) {
      let res = await getStrEnum({ name })

      if (res.code === '0000') {
        this.enumDetails = res.data
        let caseStatusOptions = []
        Object.keys(res.data.CaseStatusEnum).forEach((key) => {
          let obj = {
            label: res.data.CaseStatusEnum[key].label,
            value: res.data.CaseStatusEnum[key].code,
          }
          caseStatusOptions.push(obj)
        })
        this.caseStatusOptions = caseStatusOptions
      }
    },
    async getCaseList() {
      let res = await getCaseLeagerList(this.ruleForm)
      if (res.code === '0000') {
        this.total = res.total
        this.tableList = res.list
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

      this.ruleForm.ps = this.total
      let res = await downloadCaseLeagerList(this.ruleForm)
      let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })

      const fileName = `案件台账数据${date}.xls`

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
    search() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.ruleForm.lossTimeStart =
        this.dateArray && this.dateArray[0]
          ? this.dateArray[0] + ' 00:00:00'
          : ''
      this.ruleForm.lossTimeEnd =
        this.dateArray && this.dateArray[1]
          ? this.dateArray[1] + ' 23:59:59'
          : ''
      this.ruleForm.firstIndustryCode =
        this.nationalEconomyClassificationId[0] || ''
      this.ruleForm.secondIndustryCode =
        this.nationalEconomyClassificationId[1] || ''
      this.ruleForm.accidentProvinceCode = this.areaCascaser[0] || ''
      this.ruleForm.accidentCityCode = this.areaCascaser[1] || ''
      this.ruleForm.accidentCountyCode = this.areaCascaser[2] || ''
      this.ruleForm.accidentAreaCode = this.areaCascaser[3] || ''
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
        insuredName: '',
        caseNo: '', // 报案号
        policyNo: '',
        firstIndustryCode: '',
        secondIndustryCode: '',
        accidentProvinceCode: '', // 省
        accidentCityCode: '', // 市
        accidentCountyCode: '', //县
        accidentAreaCode: '', // 街道
        caseStatus: '', // 案件状态
        issuingCompanyCode: '',
        lossTimeStart: '', // 出险时间 开始
        lossTimeEnd: '', // 出险时间 结束
      }
      this.areaCascaser = []
      this.nationalEconomyClassificationId = []
      this.getCaseList()
    },
  },
}
</script>

<style lang="scss" scoped>
#caseLedger {
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
