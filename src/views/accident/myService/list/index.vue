<template>
  <div id="userList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">服务名称：</span>
            <el-input
              size="small"
              class="w300"
              v-model="ruleForm.planName"
              placeholder="请输入"
              maxlength="100"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">项目类型：</span>
            <el-select
              v-model="ruleForm.preType"
              filterable
              class="w300"
              clearable
              placeholder="请选择类型"
            >
              <el-option
                v-for="(item, key) in typeData"
                :key="key"
                :label="item.itemText"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </div>
        </el-col>
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
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">服务专家：</span>
            <el-input
              v-model="ruleForm.expertName"
              class="w300"
              placeholder="请输入专家"
              size="small"
            ></el-input>
          </div>
        </el-col>
      </el-row>
      <div class="ml20 text-center">
        <el-button type="primary" shape="round" @click="seach">查询</el-button>
        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="teble-list">
      <div class="ml20 statusBlank">
        <span class="type">状态：</span>

        <p class="option">
          <span
            v-for="(item, index) in auditStatusSelectData"
            :key="index"
            :class="active == index ? 'actived' : ''"
            @click="change(index, item.code)"
          >
            {{ item.label }}
          </span>
        </p>
      </div>
      <div class="mt20">
        <el-table :data="tableList" border :header-cell-style="getRowClass">
          <el-table-column
            type="index"
            label="序号"
            width="50"
          ></el-table-column>
          <el-table-column prop="expertTypeName" label="服务计划">
            <template slot-scope="scope">
              <!-- <div class="color-blue">{{ scope.row.corporationName }}</div> -->
              <div class="fb" style="color: #096dd9">
                <TipsText
                  v-if="scope.row.corporationName"
                  :text="scope.row.corporationName"
                  :length="20"
                />
                <TipsText
                  v-if="scope.row.planName"
                  :text="scope.row.planName"
                  :length="20"
                />
              </div>
              <div>
                <span class="title">服务时间：</span>
                <span>{{ scope.row.startTime | setTime }}</span>
                <span>至</span>
                <span>{{ scope.row.endTime | setTime }}</span>
              </div>
              <div>
                <span class="title">服务专家：</span>
                <span
                  v-for="(item, key) in scope.row.accidentPreExpertEntityList"
                  :key="key"
                >
                  {{ key !== 0 ? '、' : '' }}
                  {{ item.name }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="preFirstTypeName"
            label="服务类型"
          ></el-table-column>
          <el-table-column prop="contactPhone" label="完成情况">
            <template slot-scope="scope">
              <div
                v-if="scope.row.planStatus == 1"
                class="color-FF9228 pointer"
                @click="updatepalnstatus(scope.row, true)"
              >
                <i class="el-icon-edit"></i>
                <span>处理计划</span>
              </div>
              <div
                v-if="scope.row.planStatus == 2"
                class="color-FF9228 pointer"
                @click="planHandle(scope.row, true)"
              >
                <i class="el-icon-edit"></i>
                <span>处理计划</span>
              </div>
              <div v-if="scope.row.planStatus == 3">
                <div
                  v-if="
                    scope.row.preFirstType == '01' ||
                    scope.row.preFirstType == '07'
                  "
                >
                  服务形式：
                  <span>
                    {{ scope.row.serviceType == '1' ? '线上' : '线下' }}
                  </span>
                </div>
                <div v-if="scope.row.preFirstType == '06'">
                  服务方式：
                  <span v-if="scope.row.serviceType == 0">
                    组织安全技术交流研讨会
                  </span>
                  <span v-if="scope.row.serviceType == 1">
                    推介安全生产科技成功和先进技术装备
                  </span>
                </div>
                <div v-if="scope.row.preFirstType == '05'">
                  服务方式：
                  <span v-if="scope.row.serviceType == 1">应急预案编制</span>
                  <span v-if="scope.row.serviceType == 2">应急救援演练</span>
                </div>
                <div v-if="scope.row.preFirstType == '04'">
                  安全评分：{{ scope.row.safetyScore }}分 / 安全等级：  
                  <span v-if="scope.row.safetyLevel == '1'">一级</span>
                  <span v-if="scope.row.safetyLevel == '2'">二级</span>
                  <span v-if="scope.row.safetyLevel == '3'">三级级</span>
                </div>
                <div v-if="scope.row.preFirstType !== '03'">
                  <div v-if="scope.row.preFirstType == '01'">
                    <span>服务企业：</span>
                    <span>{{ scope.row.corporationNum }}家</span>
                    <span class="ml15">/ 参加人数：</span>
                    <span>{{ scope.row.personNum }}人</span>
                  </div>

                  <div v-if="scope.row.preFirstType != '01'">
                    <span>服务情况说明：</span>
                    <span>{{ scope.row.preContent }}</span>
                  </div>
                </div>
                <div v-if="scope.row.preFirstType == '03'">
                  <div>
                    <span>
                      共检查{{
                        scope.row.unAccordNum +
                        scope.row.accordNum +
                        scope.row.unRelate
                      }}项：
                    </span>
                    <span>符合{{ scope.row.unAccordNum }}项、</span>
                    <span>不符合{{ scope.row.accordNum }}项、</span>
                    <span>不涉及{{ scope.row.unRelate }}项</span>
                  </div>
                  <div class="inspect-border">
                    <div
                      class="
                        display-flex
                        text-center
                        bg-FFF7E6
                        color-D46B08
                        border-bottom
                      "
                    >
                      <span class="w33p">一般/整改</span>
                      <span class="w33p border-left border-right">
                        重大/整改
                      </span>
                      <span class="w33p">整改率</span>
                    </div>
                    <div class="display-flex text-center">
                      <span class="w33p color-blue">
                        {{ scope.row.normal }} / {{ scope.row.noramlCheck }}
                      </span>
                      <span class="w33p border-left border-right color-red">
                        {{ scope.row.major }} / {{ scope.row.majorCheck }}
                      </span>
                      <span class="w33p">
                        {{ scope.row | recheckRate }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="支出金额(元)"
            show-overflow-tooltip
            width="160"
            align="center"
          >
            <template slot-scope="scope">
              <!-- 千分位展示金额 -->
              <div class="color-red">
                ￥{{ fmoney(scope.row.expendFund, 2) }}
                <!-- ￥{{
                  scope.row.expendFund
                    ? scope.row.expendFund.toFixed(2)
                    : '0.00'
                }} -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="服务状态" width="150" align="center">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.planStatus == 1" class="color-FF9228">
                  待进行
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
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                class="detailBtn mr10"
                type="text"
                @click="palnDetail(scope.row, false)"
              >
                查看
              </el-button>
              <el-dropdown
                v-if="scope.row.planStatus == 1 || scope.row.planStatus == 2"
                trigger="click"
              >
                <el-button type="text" class="moreBtn">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="scope.row.planStatus == 1"
                    class="updateBtn"
                    @click.native="updatepalnstatus(scope.row, true)"
                  >
                    处理计划
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.planStatus == 2"
                    class="updateBtn"
                    @click.native="planHandle(scope.row, true)"
                  >
                    处理计划
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="
                      scope.row.planStatus == 1 || scope.row.planStatus == 2
                    "
                    class="deleteBtn"
                    @click.native="deletesPlans(scope.row)"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
    <detail-plan ref="detailPlan" />
  </div>
</template>

<script>
import {
  getPlansList,
  updatePlan,
  updatepalnstatus,
  deletesPlan,
} from '@/api/accidentManagement'
import LabelSelect from '@/components/labelSelect'
import { mapGetters } from 'vuex'
import detailPlan from '../../plan/detailPlan/index.vue'
import { validateRate } from '@/utils/validateFrom'
import { dictItem } from '@/api/policyManagement'
import { fmoney } from '@/utils/index'
export default {
  name: 'MyService',
  components: { LabelSelect, detailPlan },
  filters: {
    recheckRate(row) {
      let sum = Number(row.normal) + Number(row.major)
      let check = Number(row.noramlCheck) + Number(row.majorCheck)
      let percentage = (check / sum) * 100 || 0
      return percentage.toFixed(0) + '%'
    },
    recheckRisk(row) {
      let sum = Number(row.controlled) + Number(row.unControlled)
      let check = Number(row.unControlled)
      let percentage = (check / sum) * 100
      return percentage.toFixed(0) + '%'
    },
  },
  data() {
    return {
      ruleForm: {
        pn: 1,
        ps: 10,
        planName: '',
        beforeStartDate: '',
        afterStartDate: '',
        beforeEndDate: '',
        afterEndDate: '',
        expertName: '',
        preType: '',
        processStatus: '',
        orderby: '',
        desc: false,
      },
      dialogFormVisible: false,
      texts: ['1分', '2分', '3分', '4分', '5分'],
      showBtn: true,
      form: {
        id: '',
        agreeLevel: null,
        degreeOfCooperation: null,
      },
      // 时间数组
      dateArray: [],
      preTypeList: [],
      dateArray2: [],
      timeType: '1',
      auditStatusSelectData: [],
      active: '0',
      assessTypeEnum: [
        {
          label: '服务起期',
          value: '1',
        },
        {
          label: '服务止期',
          value: '2',
        },
      ],
      tableList: [],
      typeData: [],
      total: 0,
      rules: {
        degreeOfCooperation: [
          { required: true, validator: validateRate, trigger: 'change' },
        ],
        agreeLevel: [
          { required: true, validator: validateRate, trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      enmuList: 'enums/getStrEnumAll',
    }),
  },
  watch: {
    $route() {
      this.initData()
    },
  },
  created() {
    this.getProductType()
    this.initData()
    this.auditStatusSelectData = this.enmuList.PlanStatusEnum.unshift({
      label: '全部',
      code: '',
    })
    this.auditStatusSelectData = this.enmuList.PlanStatusEnum
  },
  methods: {
    fmoney(unm, it) {
      return fmoney(unm, it)
    },
    async initData() {
      this.getList()
    },
    change(index, code) {
      this.active = index
      this.ruleForm.processStatus = code
      this.getList()
    },
    async getList() {
      let res = await getPlansList(this.ruleForm)
      if (res.code === '0000') {
        this.tableList = res.list
        this.total = res.total
      }
    },
    async getProductType() {
      let res = await dictItem(true, 20004)
      if (res.code == '0000') {
        this.typeData = res.data
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5'
      } else {
        return ''
      }
    },
    seach() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
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
      this.getList()
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getList()
    },
    // 重置
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        planName: '',
        beforeStartDate: '',
        afterStartDate: '',
        beforeEndDate: '',
        afterEndDate: '',
        expertName: '',
        preType: '',
        processStatus: '',
        orderby: '',
        desc: false,
      }
      this.dateArray = []
      this.dateArray2 = []
      this.getList()
    },
    getPreTypeName(row) {
      let value = this.enmuList.AccidentTypeEnum.find((item) => {
        return item.code == row
      })
      return (value && value.label) || '无'
    },
    // 删除计划
    deletesPlans(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await deletesPlan(row.id)
          if (res.code === '0000') {
            this.$message.success('删除成功')
            this.getList()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    async updatepalnstatus(row) {
      let res = await updatepalnstatus(row.id)
      if (res.code === '0000') {
        this.planHandle(row, true)
      }
    },
    planHandle(row, flag) {
      this.$router.push({
        path: '/accidents/planHandle',
        query: {
          id: row.id,
          isHandle: flag + '',
          preType: row.preFirstType,
        },
      })
    },
    setType(e) {
      this.timeType = e
    },
    palnDetail(row, flag) {
      this.$refs.detailPlan.id = row.id
      this.$refs.detailPlan.type = row.preFirstType
      this.$refs.detailPlan.dialogVisible = true
    },
  },
}
</script>

<style lang="scss" scoped>
#userList {
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
  .teble-list {
    margin: 20px;
  }
  .inspect-border {
    border: 1px solid #ccc;
  }
  .border-bottom {
    border-bottom: 1px solid #ccc;
  }
  .border-left {
    border-left: 1px solid #ccc;
  }
  .border-right {
    border-right: 1px solid #ccc;
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
</style>
