<template>
  <div id="verifyList">
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
        </el-col>
      </el-row>
      <div class="ml20 text-center"></div>
    </div>
    <div class="ml20 statusBlank">
      <span class="type">状态：</span>

      <p class="option">
        <span
          v-for="(item, index) in stateList"
          :key="index"
          :class="active == index ? 'actived' : ''"
          @click="change(index, item.code)"
        >
          {{ item.label }}
        </span>
      </p>
    </div>
    <div class="elsearch_new">
      <div class="mt8">
        <el-table
          :data="dataList"
          border
          header-row-class-name="headName"
          :header-cell-style="getRowClass"
        >
          <el-table-column label="保单信息" min-width="280">
            <template slot-scope="scope">
              <el-row class="mt8 mb8">
                <el-col v-if="scope.row.custFullName" :span="18">
                  <span class="color-blue">
                    <TipsText :text="scope.row.custFullName" :length="14" />
                  </span>
                </el-col>
              </el-row>
              <el-row class="mt8 mb8">
                <el-col :span="13">
                  <span class="color-gray-3">保险期间：</span>
                  <span>
                    {{ scope.row.startTime | setTime }} 0时 至
                    {{ scope.row.endTime | setTime }} 24时
                  </span>
                </el-col>
                <el-col :span="11">
                  <span class="color-gray-3">保单号：</span>
                  <span>{{ scope.row.policyNo }}</span>
                </el-col>
              </el-row>

              <el-row class="mt8 mb8">
                <el-col :span="13">
                  <span class="color-gray-3">实际经营地址：</span>
                  <span>
                    {{ scope.row.provinceName }}/ {{ scope.row.cityName }} /{{
                      scope.row.countyName
                    }}
                  </span>
                </el-col>
                <el-col v-if="scope.row.issuingCompanyName" :span="11">
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
              <span>{{ scope.row.updateTime }}</span>
              <div class="mt8">
                <span v-if="scope.row.approveStatus == '1'" class="color-blue">
                  待审核
                </span>
                <span v-if="scope.row.approveStatus == '2'" class="color-green">
                  通过审核
                </span>
                <span v-if="scope.row.approveStatus == '3'" class="color-red">
                  不通过
                  <el-tooltip
                    :content="scope.row.approveContent"
                    placement="top"
                    effect="light"
                  >
                    <i class="el-icon-question color-FF9228 f16"></i>
                  </el-tooltip>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <div class="operation">
                <el-button
                  class="detailBtn"
                  type="text"
                  v-if="$hasBtn('verify-detail')"
                  @click="goDetail(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.approveStatus == '1' && $hasBtn('approve')"
                  type="text"
                  class="updateBtn"
                  @click="open(scope.row)"
                >
                  审核
                </el-button>
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
    <verify @sucessCb="getInit" ref="verify" />
    <policy-Detail ref="policyDetail" />
  </div>
</template>

<script>
import { getVerifyList } from '@/api/policyManagement'

import { mapGetters } from 'vuex'
import TipsText from '@/components/TipsText'
import Label1 from '@/components/label/index'
import policyDetail from '@/views/policy/detail'

import Verify from './components/verify.vue'

export default {
  name: 'PolicyList',
  components: {
    Label1,
    TipsText,
    Verify,
    policyDetail,
  },
  data() {
    return {
      ruleForm: {
        name: '', //企业名称 ,
        policyNo: '', // 保单号
        approveStatus: '',
        ps: 10, //页面大小
        pn: 1, //请求第几页 ,
        desc: true,
        orderby: 'issue_date',
      },
      timeType: '1',

      total: 0,
      active: 0,
      value: '',
      stateList: [
        {
          code: '',
          name: '全部',
        },
      ],

      dataList: [],
    }
  },
  computed: {
    ...mapGetters({
      areaList: 'areas/areaList',
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
  },
  created() {
    // this.getIndustryData()

    this.getStrEnumAll.PolicyApproveSatusEnum.unshift({
      code: '',
      label: '全部',
    })
    this.stateList = this.getStrEnumAll.PolicyApproveSatusEnum
    // this.getInit()
  },
  activated() {},
  methods: {
    async getInit() {
      // 初始化加载列表
      let res = await getVerifyList(this.ruleForm)
      if (res.code == '0000') {
        this.dataList = res.list
        this.total = res.total
      }
    },

    search() {
      // 查询按钮

      this.getInit()
    },
    change(index, id) {
      this.active = index
      this.ruleForm.approveStatus = id
      this.search()
    },
    reset() {
      // 重置

      this.active = 0
      this.ruleForm.name = '' //企业名称 ,
      this.ruleForm.approveStatus = ''
      this.ruleForm.policyNo = '' // 保单号

      this.ruleForm.ps = 10 //页面大小
      this.ruleForm.pn = 1 //请求第几页 ,

      this.search()
    },
    open(row) {
      this.$refs.verify.dialogFormVisible = true
      this.$refs.verify.FormData.nodeId = row.nodeId
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
      this.$refs.policyDetail.isVerify = true
      return
    },
  },
}
</script>

<style lang="scss" scoped>
#verifyList {
  .statusBlank {
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
        border: 1px solid #fa8c16;
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
