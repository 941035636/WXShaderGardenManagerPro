<template>
  <div id="AccidentInfo">
    <el-form label-position="left" label-width="142px" style="padding: 0">
      <el-row class="border-bottom">
        <el-col :span="8">
          <el-form-item label="报案号：">
            <div class="text">{{ caseInfoEntityResp.reportNo }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报案时间：">
            <div class="text">{{ caseInfoEntityResp.reportTime }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="border-bottom">
        <el-col :span="8">
          <el-form-item label="立案号：">
            <div class="text">{{ caseInfoEntityResp.caseNo }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="立案时间：">
            <div class="text">{{ caseInfoEntityResp.caseTime }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="border-bottom">
        <el-col :span="8">
          <el-form-item label="出险时间：">
            <div class="text">{{ caseInfoEntityResp.riskTime }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出险地点：">
            <div class="text">
              <more-con :data="accidentArea" :length="13" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="详细地址：">
            <div class="text">
              <moreCon :data="caseInfoEntityResp.riskAddr" :length="13" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="border-bottom">
        <el-col :span="8">
          <el-form-item label="出险经过：">
            <div class="text">
              <more-con :data="caseInfoEntityResp.riskProcess" :length="13" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="事故类型：">
            <div class="text">{{ accidentName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="特殊行业领域：">
            <div class="text">{{ specialName }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="border-bottom">
        <el-col :span="8">
          <el-form-item label="事故原因：">
            <div class="text">{{ caseInfoEntityResp.accidentReasonName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="事故等级：">
            <div class="text">{{ caseInfoEntityResp.accidentLevelName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="事故调查报告：">
            <div
              v-if="caseInfoEntityResp.files && caseInfoEntityResp.files.length"
              class="text check cursor-pointer"
              @click="checkEnclosure(caseInfoEntityResp.files)"
            >
              查看附件
            </div>
            <div class="text" v-else>--</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="估损金额：">
            <div class="text cF5222D" v-if="caseInfoEntityResp.lossAmount">
              ￥{{ caseInfoEntityResp.lossAmount.toFixed(2) }}元
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="估损日期：">
            <div class="text">{{ caseInfoEntityResp.lossTime | setTime }}</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      class="table-header-blod"
      :data="caseSiteSurveyResps"
      border
      :header-cell-style="{ background: '#f5f5f5' }"
      style="width: 100%; margin-top: 30px"
    >
      <el-table-column
        type="index"
        width="50"
        label="序号"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="time" label="查勘时间"></el-table-column>

      <el-table-column label="查勘描述" show-overflow-tooltip>
        <template slot-scope="scoped">
          <moreCon :data="scoped.row.remark" :length="20" />
        </template>
      </el-table-column>
      <el-table-column label="查勘人员姓名" show-overflow-tooltip>
        <template slot-scope="scoped">
          {{ scoped.row.name }}
          <span v-if="scoped.row.phone">（{{ scoped.row.phone }}）</span>
        </template>
      </el-table-column>
      <el-table-column label="查勘报告或图片" show-overflow-tooltip>
        <template slot-scope="scoped">
          <span v-if="scoped.row.files">
            共{{ scoped.row.files.length }}个附件，
            <el-button
              @click="checkProveB(scoped.row)"
              type="text"
              class="ckBtn"
            >
              点击查看
            </el-button>
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      class="table-header-blod"
      :data="casePaymentRecordResps"
      border
      :header-cell-style="{ background: '#f5f5f5' }"
      style="width: 100%; margin-top: 30px"
    >
      <el-table-column
        type="index"
        width="50"
        label="序号"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="paymentTime" label="付款时间"></el-table-column>

      <el-table-column label="付款类型" show-overflow-tooltip>
        <template slot-scope="scoped">
          <span v-if="scoped.row.paymentType == 1">预付</span>
          <span v-if="scoped.row.paymentType == 2">垫付</span>
          <span v-if="scoped.row.paymentType == 3">快付</span>
        </template>
      </el-table-column>
      <el-table-column
        label="付款金额"
        prop="paymentAmount"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="付款凭证" show-overflow-tooltip>
        <template slot-scope="scoped">
          <span v-if="scoped.row.files">
            共{{ scoped.row.files.length }}个附件，
            <el-button
              @click="checkProveB(scoped.row)"
              type="text"
              class="ckBtn"
            >
              点击查看
            </el-button>
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
    <VoucherList ref="voucherList"></VoucherList>
  </div>
</template>

<script>
import moreCon from '@/components/moreCon'
import VoucherList from './VoucherList'
export default {
  name: 'AccidentInfo',
  components: {
    moreCon,
    VoucherList,
  },
  data() {
    return {
      caseInfoEntityResp: {},
      caseSiteSurveyResps: [],
      casePaymentRecordResps: [],
    }
  },
  computed: {
    specialName() {
      let result = '--'
      if (
        this.caseInfoEntityResp.specAccidentItems &&
        this.caseInfoEntityResp.specAccidentItems.length
      ) {
        result = this.caseInfoEntityResp.specAccidentItems
          .map((item) => {
            return item.itemText
          })
          .join('/')
      }
      return result
    },
    accidentName() {
      let result = '--'
      if (
        this.caseInfoEntityResp.accidentTypeItems &&
        this.caseInfoEntityResp.accidentTypeItems.length
      ) {
        result = this.caseInfoEntityResp.accidentTypeItems[0].itemText
      }
      return result
    },
    accidentArea() {
      return (
        this.caseInfoEntityResp.accidentProvinceName +
        '/' +
        this.caseInfoEntityResp.accidentCityName +
        '/' +
        this.caseInfoEntityResp.accidentCountyName
      )
    },
  },
  methods: {
    // 查看事故调查报告
    checkEnclosure(data) {
      this.$refs.voucherList.tableData = data
      this.$refs.voucherList.dialogVisible = true
    },
    async checkProveB(row) {
      console.log(row)

      this.$refs.voucherList.tableData = row.files
      this.$refs.voucherList.dialogVisible = true
    },
    // 查勘报告或图片
    surveyReport() {
      console.log('查勘报告或图片')
    },
  },
}
</script>

