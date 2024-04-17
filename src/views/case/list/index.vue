<template>
  <div id="caseList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">企业名称：</span>

            <el-input
              v-model="ruleForm.insuredName"
              size="small"
              maxlength="50"
              clearable
              class="w300"
              placeholder="请输入企业名称"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">出险地区：</span>
            <el-cascader
              v-model="areaCascaser"
              placeholder="请选择 "
              class="w300"
              :options="areaList"
              :props="{ checkStrictly: true }"
              clearable
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">报案号：</span>
            <el-input
              v-model="ruleForm.reportNo"
              size="small"
              maxlength="50"
              clearable
              class="w300"
              placeholder="请输入报案号"
            />
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">出险类型：</span>
            <el-select
              v-model="ruleForm.accidentTypeCode"
              class="w300"
              filterable
              clearable
              placeholder="请选择事故类型"
            >
              <el-option
                v-for="(item, key) in acdType"
                :key="key"
                :label="item.itemText"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">出险时间：</span>
            <el-date-picker
              v-model="dateArray"
              class="w300"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">所属行业：</span>
            <el-cascader
              v-model="ruleForm.companyIndystryIds"
              filterable
              placeholder="请选择所属行业"
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
            <span class="item3">保单号：</span>
            <el-input
              v-model="ruleForm.policyNo"
              size="small"
              maxlength="30"
              class="w300"
              clearable
              placeholder="请输入保单号"
            />
          </div>
        </el-col>

        <el-col v-if="showCompany" :span="8">
          <div style="display: flex">
            <span class="item3">保险机构：</span>

            <el-select
              v-model="ruleForm.issuingCompanyName"
              filterable
              placeholder="请选择保险机构"
              class="w300"
              clearable
            >
              <el-option
                v-for="item in companyList"
                :key="item.orgCode"
                :value="item.orgName"
                :label="item.orgName"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div class="ml20 mt10 text-center">
        <el-button class="ml20" type="primary" shape="round" @click="search">
          查询
        </el-button>
        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
        <el-button
          v-if="$hasBtn('case-add')"
          type="primary"
          shape="round"
          @click="add"
        >
          添加
        </el-button>

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
    <div class="ml20 statusBlank">
      <span class="type">状态：</span>

      <p class="option">
        <span
          v-for="(item, index) in caseStatusOptions"
          :key="index"
          :class="active == index ? 'actived' : ''"
          @click="change(index, item.value)"
        >
          {{ item.label }}
        </span>
      </p>
    </div>
    <div class="teble-list">
      <el-row>
        <el-col :span="20">
          <span class="searchList">查询列表</span>
          <span class="totNum ml15">共{{ total }}条记录</span>
        </el-col>
        <el-col :span="4">
          <div style="text-align: right">
            <el-button round @click="uploadUser" v-if="$hasBtn('casefile')">
              批量导入
            </el-button>
          </div>
        </el-col>
      </el-row>
      <div class="mt10">
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
            align="center"
          ></el-table-column>
          <el-table-column label="企业名称" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="fb" style="color: #096dd9">
                <TipsText
                  v-if="scope.row.insuredName"
                  :text="scope.row.insuredName"
                  :length="20"
                />
              </div>
              <div>
                所属行业：
                <TipsText
                  v-if="scope.row.economyFieldName"
                  :text="scope.row.economyFieldName"
                  :length="15"
                />
              </div>
              <div>
                保单号：
                <TipsText
                  v-if="scope.row.policyNo"
                  :text="scope.row.policyNo"
                  :length="15"
                />
              </div>
              <div>
                保险机构：
                <TipsText
                  v-if="scope.row.issuingCompanyName"
                  :text="scope.row.issuingCompanyName"
                  :length="15"
                />
              </div>
            </template>
          </el-table-column>

          <el-table-column label="出险时间 / 地区" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <span>报案号：</span>
                <span>{{ scope.row.reportNo }}</span>
              </div>

              <div>
                <span>出险时间：</span>
                {{ scope.row.riskTime }}
              </div>
              <div>
                <span>出险地区：</span>
                <span>{{ scope.row.accidentProvinceName }}/</span>
                <span>{{ scope.row.accidentCityName }}/</span>
                <span>{{ scope.row.accidentCountyName }}</span>
                <span v-if="scope.row.accidentAreaName">
                  ,{{ scope.row.accidentAreaName }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="出险类型"
            width="120"
            align="center"
            prop="accidentTypeName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="伤亡情况"
            width="160"
            align="left"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div>受伤：{{ scope.row.injuryNum }}人</div>
              <div>死亡：{{ scope.row.deathNum }}人</div>
            </template>
          </el-table-column>
          <el-table-column
            label="估损金额"
            width="120"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="color-red">
                <!-- 千分位展示金额 -->
                ￥{{ fmoney(scope.row.lossAmount, 2) }}
                <!-- {{ scope.row.lossAmount ? scope.row.lossAmount : '0.00' }} -->
              </span>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="状态"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.caseStatus == '3'" class="color-blue">
                  {{ scope.row.caseStatusName }}
                </span>
                <span v-else class="color-green">
                  {{ scope.row.caseStatusName }}
                </span>
              </div>
              <div
                @click="commentDetail(scope.row)"
                v-if="scope.row.evaluateId"
                class="commentBtn pointer"
              >
                已评价
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作时间"
            width="160"
            align="left"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.updateByName }}</span>
              </div>
              <div>
                <span>{{ scope.row.updateTime }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            fixed="right"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                v-if="$hasBtn('case-detail')"
                class="mr10 detailBtn"
                type="text"
                @click="toDetail(scope.row)"
              >
                查看
              </el-button>

              <el-dropdown v-if="!scope.row.evaluateId" trigger="click">
                <el-button type="text" class="moreBtn">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="
                      scope.row.caseStatus != '3' &&
                      scope.row.evaluateId == null &&
                      $hasBtn('case-comment')
                    "
                    class="detailBtn"
                    @click.native="comment(scope.row)"
                  >
                    评价
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.caseStatus == '3' && $hasBtn('end-case')"
                    class="moreBtn"
                    @click.native="endCase(scope.row)"
                  >
                    销案
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.caseStatus == '3'"
                    class="moreBtn"
                    @click.native="toDeal(scope.row)"
                  >
                    修改
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.caseStatus == '3' && $hasBtn('case-delete')"
                    class="moreBtn"
                    @click.native="deleteCase(scope.row.id)"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <CorrelatePolicy ref="CorrelatePolicy" />
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <EndCase @getMsg="getCaseList" ref="endCase"></EndCase>
    <CommentCase @getMsg="getCaseList" ref="Comment"></CommentCase>
    <el-dialog
      class="commentCase"
      title="评价信息"
      :visible.sync="dialogVisible3"
      width="600px"
    >
      <el-form label-position="left" label-width="100px">
        <el-form-item label="投保满意度：">
          <el-rate
            class="mt5"
            v-model="row.evaluateStar"
            :texts="texts"
            disabled
            :text-color="'#f7ba2a'"
            show-text
          ></el-rate>
        </el-form-item>
        <el-form-item prop="evalTime" label="评价时间：">
          {{ row.evaluateTime }}
        </el-form-item>
        <el-form-item prop="message" label="备注说明：">
          <div class="w300">
            {{ row.evaluateMessage }}
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <CaseTabs ref="caseTabs"></CaseTabs>
    <RegFileUploadDialog ref="fileRef"></RegFileUploadDialog>
  </div>
</template>

<script>
import {
  getCaseList,
  applyEnd,
  delCase,
  getMechanismList,
} from '@/api/caseManagement'
import { fmoney } from '@/utils/index'
import { dictItem } from '@/api/policyManagement'
import Label1 from '@/components/label/index'
import { delBranch, getBranchList } from '@/api/userDataManagement'
import { getStrEnum } from '@/api/caseManagement'
import CommentCase from './components/commentCase' // 理赔满意度
import EndCase from './components/EndCase' // 关联保单
import CorrelatePolicy from './components/correlatePolicy' // 关联保单
import { mapGetters } from 'vuex'
import { getAreaInfo, getAreaDetail } from '@/api/Areas'
import TipsText from '@/components/TipsText'
import RegFileUploadDialog from '../components/RegFileUploadDialog.vue'
import CaseTabs from '../caseDetail/CaseTabs.vue'
export default {
  name: 'caseList',
  components: {
    CorrelatePolicy,
    EndCase,
    TipsText,
    Label1,
    CommentCase,
    CaseTabs,
    RegFileUploadDialog,
  },
  data() {
    return {
      row: {},
      ruleForm: {
        pn: 1,
        ps: 10,
        desc: false,
        orderby: '',
        insuredName: '', // 企业名称
        reportNo: '', // 报案号
        companyIndystryIds: [],
        accidentTypeCode: '',
        accidentProvinceCode: '', // 省
        accidentCityCode: '', // 市
        accidentCountyCode: '', //县
        accidentAreaCode: '', // 街道
        caseStatus: '', // 案件状态
        caseStartTime: '', // 出险时间 开始
        caseEndTime: '', // 出险时间 结束
      },
      active: 0,
      spread: false,
      showCompany: true,
      industryData: [],
      companyList: [],
      acdType: [],
      // 时间数组
      allArea: [], //区域下拉框
      dateArray: [],
      tableList: [],
      total: 0,
      commentValue: null,
      dialogVisible3: false,
      enumDetails: {},
      texts: ['很差', '差', '一般', '好', '很好'],
      caseStatusOptions: [], //案件状态
      areaCascaser: [],
    }
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
      areaList: 'areas/areaList',
    }),
  },
  created() {
    this.initData()
  },

  methods: {
    fmoney(unm, it) {
      return fmoney(unm, it)
    },
    uploadUser() {
      this.$refs.fileRef.fileImportShow = true
    },
    commentDetail(row) {
      this.dialogVisible3 = true

      this.row = row
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
      let res = await getMechanismList()
      if (res.code == '0000') {
        this.companyList = res.list
      }
    },
    async getIndustryData() {
      // 获取行业领域数据
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
      }
      let res1 = await dictItem(true, '20001')

      if (res1.code == '0000') {
        this.acdType = res1.data
      }
    },
    commentToText(e) {
      if (e == '5') {
        return '很好'
      }
      if (e == '4') {
        return '好'
      }
      if (e == '3') {
        return '一般'
      }
      if (e == '2') {
        return '差'
      }
      if (e == '1') {
        return '很差'
      }
    },
    comment(row) {
      this.$refs.Comment.FormData.tableId = row.id
      this.$refs.Comment.FormData.tableNo = row.reportNo
      this.$refs.Comment.dialogFormVisible = true
    },
    endCase(row) {
      //结案申请
      console.log(row)

      this.$refs.endCase.caseTime = row.caseTime
      this.$refs.endCase.FormData.id = row.id
      this.$refs.endCase.FormData.reportNo = row.reportNo
      this.$refs.endCase.dialogVisible = true
    },
    deleteCase(id) {
      //删除案件
      this.$confirm('永久删除该案件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await delCase(id)
          console.log(res.data)
          if (res.data) {
            this.search()
            this.$baseMessage(' 删除成功', 'success')
          } else {
            this.$baseMessage(' 删除失败', 'error')
          }
        })
        .catch(() => {
          this.$baseMessage(' 已取消删除', 'info')
        })
    },
    async initData() {
      // this.search()

      this.getIndustryData()
      this.getCompany()
      await this.getEnum()
      // this.getCaseList()
    },
    change(index, code) {
      this.active = index
      this.ruleForm.caseStatus = code
      this.search()
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
        caseStatusOptions.unshift({
          label: '全部',
          value: '',
        })
        this.caseStatusOptions = caseStatusOptions
      }
    },
    async getCaseList() {
      this.ruleForm.economyFieldOne = this.ruleForm.companyIndystryIds[0] || ''
      this.ruleForm.economyFieldTwo = this.ruleForm.companyIndystryIds[1] || ''
      let res = await getCaseList(this.ruleForm)
      if (res.code === '0000') {
        this.tableList = res.list.map((item) => {
          item.caseStatusName = item.caseStatus
            ? this.enumDetails.CaseStatusEnum.find((i) => {
              return item.caseStatus == i.code
            }).label
            : '无'

          return item
        })

        this.tableList = res.list
        this.total = res.total
      }
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
      this.ruleForm.caseStartTime =
        this.dateArray && this.dateArray[0] ? this.dateArray[0] : ''
      this.ruleForm.caseEndTime =
        this.dateArray && this.dateArray[1] ? this.dateArray[1] : ''

      this.ruleForm.accidentProvinceCode = this.areaCascaser[0] || ''
      this.ruleForm.accidentCityCode = this.areaCascaser[1] || ''
      this.ruleForm.accidentCountyCode = this.areaCascaser[2] || ''

      this.getCaseList()
    },
    detail(row) {
      this.$router.push({
        path: '/business/CaseDetails',
        query: {
          id: row.caseId,
        },
      })
    },
    update(row) {
      this.$refs.addOrAlterRef.dialogVisible = true
      this.$refs.addOrAlterRef.initData(row.code)
    },
    async delet(row) {
      let data = {
        code: row.code,
      }
      let res = await delBranch(row.id, data)
      if (res.code === '0000') {
        this.$baseMessage('删除成功', 'success')
        this.getCaseList()
      }
    },
    add() {
      this.$router.push({
        path: 'caseAdd',
      })
    },

    async toDeal(row) {
      await this.$store.dispatch('tabsBar/delVisitedRoute', {
        path: '/case/caseUpdate',
      })
      this.$router.push({
        path: 'caseUpdate',
        query: {
          id: row.id,
        },
      })
    },
    correlate(id) {
      //关联保单
      this.$refs.CorrelatePolicy.dialogFormVisible = true
      this.$refs.CorrelatePolicy.form.id = id
    },
    toDetail(row) {
      //查看详情
      this.$refs.caseTabs.id = row.id
      this.$refs.caseTabs.dialogVisible = true
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
        insuredName: '', // 企业名称
        reportNo: '', // 报案号
        companyIndystryIds: [],
        accidentTypeCode: '',
        accidentTypeCode: '',
        economyFieldOne: '',
        economyFieldTwo: '',
        accidentAreaCode: '', // 区县
        caseStatus: '', // 案件状态
        // issuingCompanyCode: '', // 出单公司
        caseStartTime: '', // 出险时间 开始
        caseEndTime: '', // 出险时间 结束
      }
      this.areaCascaser = []
      this.getCaseList()
    },
  },
}
</script>

<style lang="scss" scoped>
#caseList {
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
    margin: 8px 20px 20px 20px;
  }
}
</style>
<style lang='scss'>
html body .el-table .headName .cell {
  font-weight: bold;
}
html body .el-range-editor--small.el-input__inner {
  margin-top: 4px;
}
html body .el-cascader--small {
  line-height: 40px;
}
#caseList .commentCase .el-dialog__body {
  padding-left: 60px;
  .el-form-item__label {
    color: #919191;
  }
}
</style>
