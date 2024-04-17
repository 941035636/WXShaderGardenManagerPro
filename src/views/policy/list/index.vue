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
        <el-col v-if="showCompany" :span="8">
          <div style="display: flex">
            <Label1 long="保险机构" />
            <el-select
              v-model="ruleForm.issuingCompanyName"
              filterable
              placeholder="请选择保险机构"
              class="w300"
              clearable
            >
              <el-option
                v-for="(item, index) in companyList"
                :key="index"
                :value="item.orgName"
                :label="item.orgName"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">所在地区：</span>
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
      </el-row>
      <el-row v-if="spread" class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="建筑施工项目地址" />
            <!-- <span class="item3">建筑施工项目地址：</span> -->
            <el-cascader
              v-model="projectCascaser"
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
            <Label1 long="建筑施工项目名称" />
            <!-- <span class="item3">建筑施工项目名称：</span> -->
            <el-input
              v-model="ruleForm.projectName"
              size="small"
              maxlength="50"
              placeholder="请输入项目名称"
              class="w300"
              clearable
            />
          </div>
        </el-col>

        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">保费区间：</span>
            <el-input
              v-model.number="ruleForm.lowPrem"
              size="small"
              placeholder="请输入"
              class="w140"
              clearable
              onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"
            />
            <span style="margin: 0 3px">至</span>
            <el-input
              v-model.number="ruleForm.highPrem"
              onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"
              size="small"
              placeholder="请输入"
              class="w140"
              clearable
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
          <el-button
            v-if="$hasBtn('list-add')"
            type="primary"
            @click="addPolicy"
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
          {{ item.name }}
        </span>
      </p>
    </div>
    <div class="elsearch_new">
      <el-row>
        <el-col
          :span="24"
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div class="mt8">
            <span class="searchList">查询列表</span>
            <span class="totNum ml15">共{{ total }}条保单记录</span>

            <span class="ml15">
              <img class="mt" src="../../../assets/images/baofei.png" />
              保费总计：
            </span>
            <span class="color-red mr40">￥{{ totalPerm }} 元</span>

            <span>
              <img class="mt" src="../../../assets/images/baoe.png" />
              保额总计：
            </span>
            <span class="color-blue mr40">{{ totalAmount }} 万元</span>

            <span>
              <img class="mt" src="../../../assets/images/baoren.png" />
              人员人数总计：
            </span>
            <span class="color-blue">{{ totalEmployes }} 人</span>
          </div>
          <div>
            <el-button round @click="uploadUser" v-if="$hasBtn('policyfile')">
              批量导入
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
          <el-table-column label="保单信息" min-width="280">
            <template slot-scope="scope">
              <el-row class="mt8 mb8">
                <el-col v-if="scope.row.custFullName" :span="18">
                  <span class="fb" style="color: #096dd9">
                    <TipsText :text="scope.row.custFullName" :length="14" />
                  </span>
                </el-col>
              </el-row>
              <el-row class="mt8 mb8">
                <el-col :span="13">
                  <span class="color-gray-3">保险期间：</span>
                  <span>
                    {{ scope.row.startTime | setTime }} 00时 至
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
                  <span class="color-gray-3">所在区域：</span>
                  <span>
                    {{ scope.row.provinceName }}/ {{ scope.row.cityName }} /{{
                      scope.row.countyName
                    }}
                  </span>
                </el-col>
                <el-col v-if="scope.row.issuingCompanyName" :span="11">
                  <span class="color-gray-3">保险机构：</span>
                  <span>
                    <TipsText
                      :text="scope.row.issuingCompanyName"
                      :length="10"
                    />
                  </span>
                </el-col>
              </el-row>

              <el-row class="mt8 mb8" v-if="scope.row.industryOne == '15'">
                <el-col v-if="scope.row.projectName" :span="13">
                  <span class="color-gray-3">项目名称：</span>
                  <span>
                    <TipsText :text="scope.row.projectName" :length="10" />
                  </span>
                </el-col>
                <el-col :span="11">
                  <span class="color-gray-3">项目地址：</span>
                  <span>
                    {{ scope.row.projectProvinceName }}/
                    {{ scope.row.projectCityName }} /{{
                      scope.row.projectCountyName
                    }}
                  </span>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="所属行业" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.industryNameTwo">
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
                <!-- ￥{{ scope.row.actualPrem.toFixed(2) }} -->
                <!-- 千分位展示金额 -->
                ￥ {{ fmoney(scope.row.actualPrem, 2) }}
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
              <el-button
                type="text"
                v-if="scope.row.evaluateId"
                class="commentBtn"
                @click="commentDetail(scope.row)"
              >
                已评价
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="mb8">{{ scope.row.updateByName }}</div>
              <span>{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <div class="operation">
                <el-button
                  v-if="$hasBtn('list-detail')"
                  class="detailBtn"
                  type="text"
                  @click="goDetail(scope.row)"
                >
                  查看
                </el-button>
                <br />
                <el-dropdown trigger="click">
                  <el-button type="text" class="moreBtn">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="$hasBtn('coment-policy') && !scope.row.evaluateId"
                      class="moreBtn"
                      @click.native="commnet(scope.row)"
                    >
                      评价
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$hasBtn('list-update')"
                      class="updateBtn"
                      @click.native="open(scope.row)"
                    >
                      修改
                    </el-dropdown-item>
                    <el-dropdown-item
                      class="deleteBtn"
                      v-if="$hasBtn('delete-policy')"
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
    <comment ref="comment" @getMsg="getInit" />
    <el-dialog
      class="commentPolicy"
      title="评价信息"
      :visible.sync="dialogFormVisible"
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
    <RegFileUploadDialog ref="fileRef"></RegFileUploadDialog>
  </div>
</template>

<script>
import {
  getPolicyList,
  deletePolicy,
  dictItem,
  getTotal,
} from '@/api/policyManagement'
import { getBranchList } from '@/api/userDataManagement'
import { mapGetters } from 'vuex'
import TipsText from '@/components/TipsText'
import Label1 from '@/components/label/index'
import { getAreaDetail } from '@/api/Areas'
import { fmoney } from '@/utils/index'
import policyDetail from '../detail/index.vue'
import LabelSelect from '@/components/labelSelect'
import Comment from './comment.vue'
import RegFileUploadDialog from '../components/RegFileUploadDialog.vue'
export default {
  name: 'PolicyList',
  components: {
    Label1,
    TipsText,
    LabelSelect,
    policyDetail,
    Comment,
    RegFileUploadDialog,
  },
  data() {
    return {
      showCompany: true,
      dialogFormVisible: false,
      texts: ['很差', '差', '一般', '好', '很好'],
      row: {},
      ruleForm: {
        projectName: '',//建筑施工名称
        projectProvinceName: '',//建筑施工项目省名称
        projectProvinceCode: '',//建筑施工项目省code
        projectCityName: '',//建筑施工项目市名称
        projectCityCode: '',//建筑施工项目市code
        projectCountyName: '',//建筑施工项目区名称
        projectCountyCode: '',//建筑施工项目区code
        name: '', //企业名称 ,
        issuingCompanyName: '', //出单公司编码 ,
        policyNo: '', // 保单号
        policyStatus: '', // 保单状态
        ps: 10, //页面大小
        pn: 1, //请求第几页 ,
        afterEndDate: '',
        afterStartDate: '',
        beforeEndDate: '',
        beforeStartDate: '',
        provinceCode: '', // 省编码
        cityCode: '', // 市编码
        countyCode: '', // 区编码
        companyIndystryIds: [], // 行业编码
        industryOne: '',
        industryTwo: '',
        highPrem: null, // 保费区间 最高
        lowPrem: null, // 保费区间 最低
        desc: true,
        orderby: 'issue_date',
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
      projectCascaser: [],//建筑施工项目地区合集
      total: 0,
      active: 0,
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
    // this.getIndustryData()

    this.getCompany() //获取出单公司

    this.getIndustryData()
    // this.getInit()
  },
  mounted() {
    const roles = window.sessionStorage.getItem('roles')

    let rolesArr = []
    if (roles != undefined && roles != undefined) {
      if (roles.indexOf(',') != -1) {
        rolesArr = roles.split(',')
      } else {
        rolesArr = [roles]
      }

      if (rolesArr.includes('RL1453259454203170817')) {
        this.showCompany = false
      }
    }
  },
  activated() { },
  methods: {
    //千分位展示
    fmoney(unm, it) {
      return fmoney(unm, it)
    },
    uploadUser() {
      this.$refs.fileRef.fileImportShow = true
    },
    async deletePolicy(row) {
      let res = await deletePolicy(row.id)
      if (res.code === '0000') {
        this.$baseMessage('删除成功', 'success')
        this.getInit()
      }
    },
    commentDetail(row) {
      this.dialogFormVisible = true
      this.row = row
    },
    commnet(row) {
      this.$refs.comment.FormData.tableId = row.id
      this.$refs.comment.FormData.tableNo = row.policyNo
      this.$refs.comment.dialogFormVisible = true
    },
    changeIns() {
      // console.log(this.ruleForm.companyIndystryIds)
    },
    setType(e) {
      this.timeType = e
    },
    async getIndustryData() {
      // 获取行业领域数据
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
      }
    },
    async getInit() {
      this.getpolicyTotalPerm()
      // 初始化加载列表
      let res = await getPolicyList(this.ruleForm)
      if (res.code == '0000') {
        this.dataList = res.list
        this.total = res.total
      }
    },

    async getCompany() {
      let param = {
        pn: 1,
        ps: 1000,
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
      this.ruleForm.projectProvinceCode = this.projectCascaser[0] || ''
      this.ruleForm.projectCityCode = this.projectCascaser[1] || ''
      this.ruleForm.projectCountyCode = this.projectCascaser[2] || ''
      this.ruleForm.industryOne = this.ruleForm.companyIndystryIds[0]
      this.ruleForm.industryTwo = this.ruleForm.companyIndystryIds[1]
      this.ruleForm.provinceCode = this.areaCascaser[0] || ''
      this.ruleForm.cityCode = this.areaCascaser[1] || ''
      this.ruleForm.countyCode = this.areaCascaser[2] || ''
      this.ruleForm.areaCode = this.areaCascaser[3] || ''
      this.ruleForm.beforeStartDate = this.dateArray[0]
        ? this.dateArray[0] + ' 00:00:00'
        : ''
      this.ruleForm.afterStartDate = this.dateArray[1]
        ? this.dateArray[1] + ' 23:59:59'
        : ''
      this.ruleForm.beforeEndDate = this.dateArray2[0]
        ? this.dateArray2[0] + ' 00:00:00'
        : ''
      this.ruleForm.afterEndDate = this.dateArray2[1]
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
      this.ruleForm.projectName = '',//建筑施工名称
        this.ruleForm.projectProvinceName = '',//建筑施工项目省名称
        this.ruleForm.projectProvinceCode = '',//建筑施工项目省code
        this.ruleForm.projectCityName = '',//建筑施工项目市名称
        this.ruleForm.projectCityCode = '',//建筑施工项目市code
        this.ruleForm.projectCountyName = '',//建筑施工项目区名称
        this.ruleForm.projectCountyCode = '',//建筑施工项目区code
        this.dateArray = []
      this.active = 0
      this.ruleForm.name = '' //企业名称 ,
      this.ruleForm.issuingCompanyName = '' //出单公司编码 ,
      this.ruleForm.policyNo = '' // 保单号
      this.ruleForm.policyStatus = '' // 保单状态
      this.ruleForm.ps = 10 //页面大小
      this.ruleForm.pn = 1 //请求第几页 ,
      this.ruleForm.afterEndDate = '' // 签单起期
      this.ruleForm.afterStartDate = '' // 签单起期
      this.ruleForm.beforeEndDate = '' // 签单起期
      this.ruleForm.beforeStartDate = '' // 签单起期
      this.ruleForm.provinceCode = '' // 省编码
      this.ruleForm.cityCode = '' // 市编码
      this.ruleForm.countyCode = '' // 区编码
      this.ruleForm.companyIndystryIds = [] // 行业编码

      this.ruleForm.industryOne = '' // 保费区间 最高
      this.ruleForm.industryTwo = '' // 保费区间 最高
      this.ruleForm.highPrem = null // 保费区间 最高
      this.ruleForm.lowPrem = null // 保费区间 最低
      this.areaCascaser = []
      this.projectCascaser = []
      this.search()
    },
    open(row) {
      this.$router.push({
        path: 'update',
        query: {
          code: row.policyNo,
        },
      })
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
    addPolicy() {
      this.$router.push({
        path: 'addPolicy',
      })
    },
    goDetail(row) {
      this.$refs.policyDetail.dialogVisible = true
      this.$refs.policyDetail.userCode = row.policyNo
      return
      this.$router.push({
        path: 'detail',
        query: {
          code: row.policyNo,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
#policyList {
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
<style lang='scss'>
html body .el-table .headName .cell {
  font-weight: bold;
}
html body .el-tooltip__popper {
  max-width: 500px;
}
.el-range-editor--small.el-input__inner {
  margin-top: 4px;
}
#policyList .commentPolicy .el-dialog__body {
  padding-left: 60px;
  .el-form-item__label {
    color: #919191;
  }
}
</style>
