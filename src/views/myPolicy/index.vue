<template>
  <div id="policyList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">被保险人：</span>
            <el-input
              v-model="ruleForm.name"
              size="small"
              maxlength="50"
              placeholder="请输入被保险人名称"
              class="w300"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">保单号：</span>
            <el-input
              v-model="ruleForm.policyNo"
              size="small"
              maxlength="30"
              class="w300"
              placeholder="请输入保单号"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">所属行业：</span>
            <el-cascader
              v-model="ruleForm.companyIndystryIds"
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
              @change="changeIns"
            ></el-cascader>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <LabelSelect @setType="setType" :optionsData="assessTypeEnum" />
            <el-date-picker
              v-if="timeType == 1"
              v-model="dateArray"
              class="w300"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <el-date-picker
              v-else
              v-model="dateArray2"
              class="w300"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
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
    <div class="ml20 statusBlank">
      <div>
        <span class="type">状态：</span>
        <p class="option">
          <span
            v-for="(item, index) in stateList"
            :key="index"
            :class="active == index ? 'actived' : ''"
            @click="change(index, item.code)"
          >
            {{ item.name }}
          </span>
        </p>
      </div>

      <div style="margin-left: 60px">
        <span class="type">审核进度：</span>

        <p class="option">
          <span
            v-for="(item, index) in approveStatusList"
            :key="index"
            :class="activeApproveStatus == index ? 'actived' : ''"
            @click="approveStatusChange(index, item.code)"
          >
            {{ item.label }}
          </span>
        </p>
      </div>
    </div>
    <div class="elsearch_new">
      <el-row>
        <el-col
          :span="24"
          style="display: flex; justify-content: space-between"
        >
          <div class="mt8">
            <span class="searchList">查询列表</span>
            <span class="totNum ml15">共{{ total }}条保单记录</span>

            <span class="ml15">
              <img class="mt" src="../../assets/images/baofei.png" />
              保费总计：
            </span>
            <span class="color-red mr40">￥{{ totalPerm }} 元</span>

            <span>
              <img class="mt" src="../../assets/images/baoe.png" />
              保额总计：
            </span>
            <span class="color-blue mr40">{{ totalAmount }} 万元</span>

            <span>
              <img class="mt" src="../../assets/images/baoren.png" />
              人员人数总计：
            </span>
            <span class="color-blue">{{ totalEmployes }} 人</span>
          </div>
          <div class="mt8">
            <el-button
              v-if="isComplete"
              type="primary"
              round
              style="background: #355e92; padding: 7px 20px; margin-left: 30px"
              @click="addPolicy"
            >
              填写保单
            </el-button>
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
          <el-table-column label="保单信息" min-width="480">
            <template slot-scope="scope">
              <el-row class="mt8 mb8">
                <el-col v-if="scope.row.custFullName" :span="18">
                  <span class="color-blue">
                    <TipsText :text="scope.row.custFullName" :length="14" />
                  </span>
                </el-col>
              </el-row>
              <el-row class="mt8 mb8">
                <el-col :span="15">
                  <span class="color-gray-3">保险期间：</span>
                  <span>
                    {{ scope.row.startTime }}时 至 {{ scope.row.endTime }}时
                  </span>
                </el-col>
                <el-col :span="9">
                  <span class="color-gray-3">保单号：</span>
                  <span>{{ scope.row.policyNo }}</span>
                </el-col>
              </el-row>

              <el-row class="mt8 mb8">
                <el-col :span="15">
                  <span class="color-gray-3">实际经营地址：</span>
                  <span>
                    {{ scope.row.provinceName }}/ {{ scope.row.cityName }} /{{
                      scope.row.countyName
                    }}
                  </span>
                </el-col>
                <el-col v-if="scope.row.issuingCompanyName" :span="9">
                  <span class="color-gray-3">保险机构名称：</span>
                  <span>
                    <TipsText
                      :text="scope.row.issuingCompanyName"
                      :length="10"
                    />
                  </span>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="所属行业" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.industryNameOne">
                {{ scope.row.industryNameTwo }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="保费（元）"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="color-f45f5f">
                ￥{{ scope.row.actualPrem.toFixed(2) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="保单状态"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.policyStatus == '00'" class="color-blue">
                  待生效
                </span>
                <span v-if="scope.row.policyStatus == '01'" class="color-green">
                  保障中
                </span>
                <span
                  v-if="scope.row.policyStatus == '02'"
                  class="color-gray-3"
                >
                  已过期
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="mb8">{{ scope.row.updateByName }}</div>
              <div class="mb8">{{ scope.row.updateTime }}</div>
              <div v-if="scope.row.approveStatus == 1" style="color: #096dd9">
                待审核
              </div>
              <div
                v-if="scope.row.approveStatus == 3"
                style="color: #f5222d; display: flex; align-items: center"
              >
                <span>不通过</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.approveContent"
                  placement="top-start"
                >
                  <i
                    class="el-icon-question"
                    style="
                      color: #ffa940;
                      font-size: 18px;
                      margin-top: -3px;
                      margin-left: 4px;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
              </div>
              <div v-if="scope.row.approveStatus == 2" style="color: #389e0d">
                审核通过
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <div class="operation">
                <el-button
                  v-if="$hasBtn('myPolicyDetail')"
                  class="detailBtn"
                  type="text"
                  @click="goDetail(scope.row)"
                  style="margin: 0 5px"
                >
                  查看
                </el-button>
                <el-dropdown
                  v-if="scope.row.approveStatus == 3"
                  trigger="click"
                  style="margin: 0 5px"
                >
                  <el-button type="text" class="moreBtn">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="$hasBtn('myPolicyUpdate')"
                      class="detailBtn"
                      @click.native="open(scope.row)"
                    >
                      修改
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$hasBtn('myPolicyDelete')"
                      class="detailBtn"
                      @click.native="deletePolicy(scope.row)"
                    >
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
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
    <policyDetail ref="policyDetail" />
  </div>
</template>

<script>
import {
  getPolicyList,
  policyTotalPerm,
  dictItem,
  getTotal,
} from '@/api/policyManagement'
import { getBranchList } from '@/api/userDataManagement'
import { mapGetters } from 'vuex'
import TipsText from '@/components/TipsText'
import Label1 from '@/components/label/index'
import { getAreaDetail } from '@/api/Areas'
import { fmoney } from '@/utils/index'
import policyDetail from '../policy/detail/index.vue'
import LabelSelect from '@/components/labelSelect'
import { deletePolicy, getPolicyInfos } from '@/api/myService'
export default {
  name: 'MyPolicyLists',
  components: {
    Label1,
    TipsText,
    LabelSelect,
    policyDetail,
  },
  data() {
    return {
      ruleForm: {
        name: '', //企业名称 ,
        issuingCompanyName: '', //出单公司编码 ,
        policyNo: '', // 保单号
        policyStatus: '', // 保单状态
        ps: 10, //页面大小
        pn: 1, //请求第几页 ,
        afterEndTime: '',
        afterStartTime: '',
        beforeEndTime: '',
        beforeStartTime: '',
        provinceCode: '', // 省编码
        cityCode: '', // 市编码
        countyCode: '', // 区编码
        companyIndystryIds: [], // 行业编码
        highPrem: '', // 保费区间 最高
        lowPrem: '', // 保费区间 最低
        desc: true,
        orderby: 'issue_date',
        approveStatus: '',
        industryOne: '',
        industryTwo: '',
      },
      timeType: '1',
      assessTypeEnum: [
        {
          label: '保险起期',
          value: '1',
        },
        {
          label: '保险止期',
          value: '2',
        },
      ],
      dateArray: [],
      dateArray2: [],
      industryData: [], //管理分类
      spread: false, //控制展开收起
      areaCascaser: [],
      total: 0,
      active: 0,
      activeApproveStatus: 0,
      value: '',
      stateList: [
        {
          code: '',
          name: '全部',
        },
        {
          code: '01',
          name: '保障中',
        },
        {
          code: '00',
          name: '待生效',
        },

        {
          code: '02',
          name: '已过期',
        },
      ],
      // 1.待审核 2.通过审核 3.不通过 ,
      approveStatusList: [],
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
      isComplete: null,
    }
  },
  computed: {
    ...mapGetters({
      areaList: 'areas/areaList',
      enumData: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.enumData.PolicyApproveSatusEnum.unshift({
      label: '全部',
      code: '',
    })
    this.approveStatusList = this.enumData.PolicyApproveSatusEnum
    this.isComplete = JSON.parse(window.sessionStorage.getItem('isComplete'))
    console.log(JSON.parse(window.sessionStorage.getItem('isComplete')))
    console.log(
      '🚀 ~ file: index.vue ~ line 363 ~ created ~ this.isComplete',
      this.isComplete
    )
    this.getCompany() //获取出单公司
    this.getIndustryData()
    this.getInit()
  },
  activated() {
    this.getInit()
  },
  methods: {
    addPolicy() {
      this.$router.push({
        name: 'AddPolicys',
      })
    },
    deletePolicy(row) {
      this.$confirm('请确认是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        let { code } = await deletePolicy(row.id)
        if (code == '0000') {
          this.$baseMessage('删除成功', 'success')
          this.getInit()
        }
      })
    },
    changeIns(value) {
      // console.log(this.ruleForm.companyIndystryIds)
      console.log(value)
      this.ruleForm.industryOne = value[0] || ''
      this.ruleForm.industryTwo = value[1] || ''
    },
    approveStatusChange(index, id) {
      this.activeApproveStatus = index
      this.ruleForm.approveStatus = id
      this.search()
    },
    open(row) {
      this.$router.push({
        name: 'MyPolicyUpdate',
        query: {
          code: row.policyNo,
        },
      })
    },
    setType(e) {
      this.timeType = e
    },
    async getIndustryData() {
      // 获取行业领域数据
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
        console.log(
          '🚀 ~ file: index.vue ~ line 416 ~ getIndustryData ~ this.industryData',
          this.industryData
        )
      }
    },
    async getInit() {
      this.getpolicyTotalPerm()
      // 初始化加载列表
      let res = await getPolicyInfos(this.ruleForm)
      if (res.code == '0000') {
        this.dataList = res.list
        this.total = res.total
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
    async getpolicyTotalPerm() {
      let res = await getTotal(this.ruleForm)

      if (res.code == '0000' && res.data) {
        let totalAmount = res.data.limitValueTotal / 10000
        this.totalAmount = fmoney(totalAmount, 2)
        this.totalEmployes = res.data.employeeNumTotal
        this.totalPerm = fmoney(res.data.actualPremTotal, 2)
      } else {
        this.totalAmount = ''
        this.totalEmployes = ''
        this.totalPerm = ''
      }
    },
    search() {
      // 查询按钮

      this.ruleForm.provinceCode = this.areaCascaser[0] || ''
      this.ruleForm.cityCode = this.areaCascaser[1] || ''
      this.ruleForm.countyCode = this.areaCascaser[2] || ''
      this.ruleForm.areaCode = this.areaCascaser[3] || ''
      this.ruleForm.beforeStartTime = this.dateArray[0]
        ? this.dateArray[0] + ' 00:00:00'
        : ''
      this.ruleForm.afterStartTime = this.dateArray[1]
        ? this.dateArray[1] + ' 23:59:59'
        : ''
      this.ruleForm.beforeEndTime = this.dateArray2[0]
        ? this.dateArray2[0] + ' 00:00:00'
        : ''
      this.ruleForm.afterEndTime = this.dateArray2[1]
        ? this.dateArray2[1] + ' 23:59:59'
        : ''
      this.getInit()
    },
    change(index, id) {
      this.active = index
      this.ruleForm.policyStatus = id
      this.search()
    },
    reset() {
      // 重置
      this.dateArray = []
      this.active = 0
      this.ruleForm.name = '' //企业名称 ,
      this.ruleForm.issuingCompanyName = '' //出单公司编码 ,
      this.ruleForm.policyNo = '' // 保单号
      this.ruleForm.policyStatus = '' // 保单状态
      this.ruleForm.approveStatus = ''
      this.ruleForm.ps = 10 //页面大小
      this.ruleForm.pn = 1 //请求第几页 ,
      this.ruleForm.afterEndTime = '' // 签单起期
      this.ruleForm.afterStartTime = '' // 签单起期
      this.ruleForm.beforeEndTime = '' // 签单起期
      this.ruleForm.beforeStartTime = '' // 签单起期
      // this.ruleForm.provinceCode = '' // 省编码
      // this.ruleForm.cityCode = '' // 市编码
      // this.ruleForm.countyCode = '' // 区编码
      this.ruleForm.companyIndystryIds = [] // 行业编码

      this.ruleForm.highPrem = '' // 保费区间 最高
      this.ruleForm.lowPrem = '' // 保费区间 最低
      this.area = []
      this.activeApproveStatus = 0
      this.ruleForm.industryOne = ''
      this.ruleForm.industryTwo = ''

      this.search()
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:center;'
      } else {
        return ''
      }
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getInit()
    },
    goDetail(row) {
      this.$refs.policyDetail.dialogVisible = true
      this.$refs.policyDetail.userCode = row.policyNo
    },
  },
}
</script>
<style lang="scss" scoped>
#policyList {
  .statusBlank {
    display: flex;

    .type {
      vertical-align: inherit;
    }

    .option {
      display: inline-block;

      span {
        margin-left: 20px;
        text-align: center;
        padding: 0 20px;
        cursor: pointer;
        height: 32px;
        line-height: 32px;
        display: inline-block;
        color: #fa8c16;
        border-radius: 18px;
        border: 1px solid #fa8c16;
        box-sizing: border-box;
      }

      .actived {
        background-color: #ffe7ba;
        border: none;
        font-weight: 600;
      }
    }
  }

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

  .mt {
    vertical-align: sub;
  }

  .btn {
    margin-left: 30px;
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
</style>
