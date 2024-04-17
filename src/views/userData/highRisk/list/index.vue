<template>
  <div id="userList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="6">
          <div style="display: flex">
            <span class="item3">企业名称：</span>
            <el-input
              v-model="ruleForm.custFullName"
              size="small"
              class="w300"
              maxlength="50"
              clearable
              placeholder="请输入企业名称"
            />
          </div>
        </el-col>
        <el-col :span="6">
          <div style="display: flex">
            <span class="item3">社会信用代码：</span>

            <el-input
              v-model="ruleForm.blCode"
              size="small"
              class="w300"
              clearable
              placeholder="请输入统一社会信用代码"
            />
          </div>
        </el-col>
        <el-col :span="6">
          <div style="display: flex">
            <span class="item3">经营状态：</span>
            <el-select
              v-model="ruleForm.orgStatus"
              class="w280"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in getStrEnumAll.BusinesStatus"
                :key="index"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="display: flex">
            <span class="item3">经营地址：</span>
            <el-cascader
              v-model="areaCascaser"
              filterable
              class="w280"
              :options="roleType == '02' ? supAreaList : areaList"
              :props="{ checkStrictly: true }"
              clearable
              placeholder="请选择地区"
            ></el-cascader>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="6">
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
        <el-col :span="6">
          <div style="display: flex">
            <span class="item3">状态：</span>
            <el-select
              v-model="ruleForm.dataStatus"
              class="w300"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in stetaList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="display: flex">
            <span class="item3">类型：</span>
            <el-select
              v-model="ruleForm.businessType"
              class="w300"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in getStrEnumAll.BusinessTypeEnum"
                :key="index"
                :label="item.label"
                :value="item.strCode"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <!-- <el-col :span="6">
          <div style="display: flex">
            <span class="item3">所属年份：</span>
            <el-date-picker
              class="w300"
              @change="handChangeyear"
              v-model="ruleForm.belongToYear"
              type="year"
              value-format="yyyy"
              placeholder="请选择"
            ></el-date-picker>
          </div>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="text-align: center" class="mt20">
            <el-button class="ml20" type="primary" shape="round" @click="seach">
              查询
            </el-button>
            <el-button class="ml20" shape="round" @click="reset">
              重置
            </el-button>
            <el-button
              v-if="$hasBtn('highRisk-add')"
              type="primary"
              shape="round"
              @click="add"
            >
              新增
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span class="searchList">查询列表</span>
          <span class="totNum ml15">共{{ total }}条记录</span>
        </el-col>
        <el-col :span="14" style="text-align: right">
          <!-- <el-button
            v-if="$hasBtn('highRisk-add')"
            type="primary"
            shape="round"
            @click="add"
          >
            新增
          </el-button> -->
          <span style="color: #fa364b; margin-right: 10px">
            单次导入最多3000条，请合理安排数据
          </span>
          <el-button
            round
            type="primary"
            @click="uploadUser"
            v-if="$hasBtn('organizationfile')"
          >
            批量导入
          </el-button>
          <el-button round type="primary" @click="business">企业管理</el-button>
        </el-col>
      </el-row>
      <div class="mt8">
        <el-table
          :data="tableList"
          border
          header-row-class-name="headName"
          :header-cell-style="{ background: '#f5f5f5', 'text-align': 'center' }"
        >
          <el-table-column
            prop="custFullName"
            label="企业信息"
            align="left"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p class="fb">{{ scope.row.custFullName }}</p>
              <p>社会信用代码：{{ scope.row.blCode }}</p>

              <p v-if="scope.row.provinceName">
                经营地址： {{ scope.row.provinceName }} /
                {{ scope.row.cityName }} /
                {{ scope.row.countyName }}
              </p>
              <p v-else>经营地址：--</p>
              <!-- project   @click="dialogTableVisible = true"-->
              <!-- <p v-if="scope.row.industryOne == '15'">
                项目信息：
              
                <span
                  @click="project(scope.row)"
                  style="color: #fa843b; cursor: pointer"
                >
                  <span>查看项目</span>
                  <span>（{{ scope.row.projectSum }}）</span>
                </span>
              </p> -->
            </template>
          </el-table-column>

          <el-table-column
            prop="companyIndustryName"
            label="所属行业"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.industryNameTwo">
                {{ scope.row.industryNameTwo }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="lawMan"
            align="center"
            label="法人代表人"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.lawMan || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="orgStatus"
            align="center"
            label="经营状态"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                :class="
                  scope.row.orgStatus == '存续' ? 'color-green' : 'color-blue'
                "
              >
                {{ scope.row.orgStatus || '--' }}
              </span>
              <br />
              <p v-if="scope.row.businessType">
                <span style="color: #fa843b">
                  {{ scope.row.businessType == '01' ? '应保企业' : '鼓励企业' }}
                </span>
                <i
                  class="el-icon-edit cursor"
                  @click="editBusinessType(scope.row)"
                ></i>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="120">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.businessStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeStatus(scope.row.id)"
              ></el-switch>
              &nbsp;&nbsp;
              <div>
                <!-- <span v-for="(item, index) in scope.row.belong" :key="index">
                  {{ item }}
                </span> -->
                {{ scope.row.belongToYear }}
              </div>
              <div class="color-red mt8" v-if="scope.row.isComplete == false">
                信息不完整
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            width="200"
            align="left"
            label="操作时间"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- <p v-if="scope.row.belongToOrgType == '03'">
                保司-{{ scope.row.belongToOrgName }}
              </p>
              <p v-if="scope.row.belongToOrgType == '02'">
                政府机构-{{ scope.row.governmentType }}
              </p>
              <p
                v-if="
                  scope.row.belongToOrgType != '02' &&
                  scope.row.belongToOrgType != '03'
                "
              >
                {{ scope.row.updateByName }}
              </p> -->
              <p>
                机构类型：{{
                  getStrEnumAll.UserTypeEnum.find(
                    (item) => item.strCode == scope.row.belongToOrgType
                  )
                    ? getStrEnumAll.UserTypeEnum.find(
                        (item) => item.strCode == scope.row.belongToOrgType
                      ).label
                    : ''
                }}
                <span v-if="scope.row.belongToOrgType == '02'">
                  /{{ scope.row.governmentType }}
                </span>
              </p>
              <p>{{ scope.row.updateTime }}</p>
            </template>
          </el-table-column>

          <el-table-column width="140" align="center" label="操作">
            <template slot-scope="scope">
              <p class="m0">
                <el-button
                  v-if="$hasBtn('highRisk-detail')"
                  type="text"
                  class="detailBtn"
                  @click="detail(scope.row)"
                >
                  查看
                </el-button>
              </p>
              <el-dropdown
                v-if="$hasBtn('highRisk-update') || $hasBtn('highRisk-delete')"
                trigger="click"
              >
                <el-button type="text" class="moreBtn">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="$hasBtn('highRisk-update')"
                    class="updateBtn"
                    @click.native="update(scope.row)"
                  >
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$hasBtn('highRisk-delete')"
                    class="deleteBtn"
                    @click.native="delet(scope.row)"
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
        layout="prev, pager, next"
        :total="total"
        :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <add :industryData="industryData" @sucessCb="seach" ref="addUser" />
    <detail ref="detail" />
    <RegFileUploadDialog ref="fileRef"></RegFileUploadDialog>
    <el-dialog
      title="修改类型"
      :visible.sync="dialogBusiness"
      @close="closeBusinessDialog"
      width="600px"
    >
      <el-form :model="businessForm">
        <el-form-item label="类型：">
          <!-- <el-select
            v-model="businessForm.enterpriseType"
            class="w300"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in getStrEnumAll.BusinessTypeEnum.filter(
                (it) => it.strCode != ''
              )"
              :key="index"
              :label="item.label"
              :value="item.strCode"
            ></el-option>
          </el-select> -->

          <el-radio-group v-model="businessForm.enterpriseType">
            <el-radio
              v-for="(item, index) in getStrEnumAll.BusinessTypeEnum.filter(
                (it) => it.strCode != ''
              )"
              :key="index"
              :label="item.strCode"
              :value="item.strCode"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button shape="round" @click="closeBusinessDialog">取消</el-button>
        <el-button type="primary" shape="round" @click="subBusiness">
          确认提交
        </el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog       查看项目信息于11.6日 因为需求变更不在需要
      title="项目信息"
      :visible.sync="dialogTableVisible"
      @close="closeDialog"
    >
      <el-row class="row-bg">
        <el-col :span="12">
          <div style="display: flex">
            <span class="item3">状态：</span>
            <el-select
              v-model="dataStatus"
              class="w300"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in stetaListdialog"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="2">
          <el-button
            class="ml20"
            type="primary"
            shape="round"
            @click="seachDialog()"
          >
            查询
          </el-button>
        </el-col>
      </el-row>
      <el-col :span="24">
        <span style="display: flex; flex-direction: row-reverse">
          共计{{ total1 }}个
        </span>
      </el-col>
      <el-table
        :data="tableData"
        border
        :header-cell-style="{ background: '#f5f5f5' }"
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          property="projectName"
          label="项目名称"
          width="250"
        ></el-table-column>
        <el-table-column label="项目地址">
          <template slot-scope="scope">
            {{ scope.row.provinceName }}/{{ scope.row.cityName }}/{{
              scope.row.countyName
            }}/{{ scope.row.detailAddress }}
          </template>
        </el-table-column>
        <el-table-column label="年份" width="100">
          <template slot-scope="scope">
            {{ scope.row.belongToYear }}
          </template>
        </el-table-column>
        <el-table-column property="dataStatus" label="状态" width="100">
          <template slot-scope="scope">
            <el-switch
              disabled
              v-model="scope.row.dataStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="handleCurrent"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total,prev,pager,next"
        :total="gridData && gridData.length > 0 ? gridData.length : 0"
      ></el-pagination>
    </el-dialog> -->
  </div>
</template>

<script>
import add from '../components/add.vue'
import detail from '../components/detail.vue'
import { getAreaDetail } from '@/api/Areas'
import {
  getOrgList,
  changStatus,
  deleteOrg,
  getSupAuthority,
  projectdata,
  putBusinessType,
} from '@/api/userDataManagement'
import { dictItem } from '@/api/policyManagement'
import { mapGetters } from 'vuex'
import { CheckSocialCreditCode } from '@/utils/validate'
import TipsText from '@/components/TipsText'
import { updateOrgStatus } from '@/api/userDataManagement'
import RegFileUploadDialog from '../components/RegFileUploadDialog.vue'
export default {
  name: 'HighRiskList',
  components: { TipsText, add, detail, RegFileUploadDialog },
  data() {
    return {
      // blCodeDia: '',
      // currentPage: 1,  // 当前页码
      // pageSize: 5,  // 每页显示的行数
      // gridData: [],
      // tableData: [],
      // total1: '',
      // dialogTableVisible: false,
      dialogBusiness: false,
      enterpriseID: '', // 企业ID
      businessForm: {
        enterpriseType: '',
      },
      dataStatus: '', //项目信息中状态字段
      ruleForm: {
        pn: 1,
        ps: 10,

        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        countyCode: '',
        countryName: '',
        areaName: '',
        areaCode: '',
        companyIndystryIds: [],
        businessType: '', //类型
        belongToYear: '', //年份
        industryOne: '',
        industryTwo: '',
        custFullName: '',
        businessStatus: null,
        BusinesStatus: '',
        blCode: '',
        lawManBlCode: '',
        dataStatus: '',
      },
      // 时间数组
      allArea: [], //地区下拉框
      dateArray: [],
      tableList: [],
      roleData: [],
      roleType: window.sessionStorage.getItem('type'),
      areaCascaser: [], //地区数组
      manageData: [], //管理分类
      industryData: [], //管理分类
      supAreaList: [], // 政府监管机构地区
      total: 0,
      stetaList: [
        {
          label: '有效',
          value: 'true',
        },
        {
          label: '无效',
          value: 'false',
        },
      ],
      stetaListdialog: [
        {
          label: '有效',
          value: '1',
        },
        {
          label: '无效',
          value: '0',
        },
      ],
      listData: {},
    }
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
      areaList: 'areas/areaList',
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.initData()
  },

  methods: {
    editBusinessType(row) {
      // 打开分类弹窗
      this.dialogBusiness = true
      this.enterpriseID = row.id
      this.businessForm.enterpriseType = row.businessType
    },
    closeBusinessDialog() {
      // 关闭分类弹窗
      this.dialogBusiness = false
      this.businessForm.enterpriseType = ''
    },
    async subBusiness() {
      // 提交修改企业类型
      let res = await putBusinessType(
        this.enterpriseID,
        this.businessForm.enterpriseType
      )
      if (res.code == '0000') {
        this.dialogBusiness = false
        this.getOrgList()
      }
    },
    handChangeyear(e) {
      let strtime = JSON.stringify(e)
      this.ruleForm.belongToYear = strtime.substring(1, 5)
    },
    uploadUser() {
      console.log('we')
      this.$refs.fileRef.fileImportShow = true
    },
    async initData() {
      this.getIndustryData()
      console.log(this.roleType)
      if (this.roleType == '02') {
        this.getSupList()
      } else {
        this.getManageData()
      }
    },

    async getIndustryData() {
      //获取管理分类信息
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
      }
    },
    async getManageData() {
      //获取管理分类
      let res = await dictItem(true, 20006)
      if (res.code == '0000') {
        this.manageData = res.data
      }
    },
    async getSupList() {
      let res = await getSupAuthority()
      console.log(res, '1111')
      if (res.code == '0000') {
        this.supAreaList = res.data.areaVOS
        this.industryData = res.data.sysDictItemEntities
      }
    },
    async getOrgList() {
      let res = await getOrgList(this.ruleForm)
      if (res.code === '0000') {
        this.tableList = res.list.map((item) => {
          // item.belongToYear.split(',')
          // if (item.belongToYear) {
          //   item['belong'] = item.belongToYear.split(',').sort((a, b) => {
          //     return a - b
          //   })
          // }
          if (item.industryTypeItems) {
            let orgNatureName = []
            item.industryTypeItems.map((i) => {
              orgNatureName.unshift(i.itemText)
            })
            item.orgNatureName = orgNatureName.join('-')
          }
          return item
        })
        this.total = res.total
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5,text-align:center'
      } else {
        return ''
      }
    },
    async changeStatus(id) {
      let res = changStatus(id)
    },
    seach() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.ruleForm.provinceCode = this.areaCascaser[0] || ''
      this.ruleForm.cityCode = this.areaCascaser[1] || ''
      this.ruleForm.countyCode = this.areaCascaser[2] || ''
      this.ruleForm.industryOne = this.ruleForm.companyIndystryIds[0] || ''
      this.ruleForm.industryTwo = this.ruleForm.companyIndystryIds[1] || ''
      if (
        this.ruleForm.blCode &&
        !CheckSocialCreditCode(this.ruleForm.blCode)
      ) {
        this.$baseMessage('请输入正确的社会信用代码', 'error')
        return
      }

      this.getOrgList()
    },
    detail(row) {
      this.$refs.detail.userCode = row.id
      this.$refs.detail.dialogVisible = true
    },
    update(row) {
      this.$refs.addUser.userCode = row.id
      this.$refs.addUser.dialogVisible = true
    },
    async delet(row) {
      this.$confirm('请确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
          let res = await deleteOrg(row.id)
          if ((res.code = '0000')) {
            this.seach()
            this.$baseMessage('删除成功', 'success')
          }
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    add(row) {
      this.$refs.addUser.dialogVisible = true
      return
      this.$router.push({
        path: 'highRiskAdd',
      })
    },
    todetail(row) {
      this.$router.push({
        path: 'highRiskDetails',
      })
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getOrgList()
    },
    // 重置
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        countyCode: '',
        countryName: '',
        areaName: '',
        areaCode: '',
        companyIndystryIds: [],
        industryTwo: '',
        industryOne: '',
        custFullName: '',
        businessStatus: '',
      }
      this.getOrgList()
    },
    // async project(row, all) { //查看项目信息于11.6日 因为需求变更不在需要
    //   this.listData = { ...row }
    //   // this.blCodeDia = row.blCode
    //   this.dialogTableVisible = true
    //   let obj = {
    //     dataStatus: all,
    //   }
    //   let res = await projectdata(this.listData.blCode, obj)
    //   this.gridData = res.list
    //   this.total1 = res.total
    //   this.dataDeging()
    // },
    // async seachDialog() { // 查看项目中的查询按钮
    //   let obj = {
    //     dataStatus: this.dataStatus,
    //   }
    //   let res = await projectdata(this.listData.blCode, obj)
    //   this.gridData = res.list
    //   this.total1 = res.total
    //   this.dataDeging()
    // },
    // 页面切换方法
    // handleCurrent(val) {
    //   this.currentPage = val;
    //   this.dataDeging()
    // },
    // dataDeging() {//数据分页
    //   const start = (this.currentPage - 1) * this.pageSize
    //   const end = this.currentPage * this.pageSize
    //   const data = [...this.gridData]
    //   this.tableData = data.slice(start, end)
    // },
    // closeDialog() { //关闭弹窗后，让当前页码等于1
    //   this.currentPage = 1
    // }
    business() {
      this.$router.push({
        path: 'highRiskbusiness',
        query: {
          // id: row.id,
          // isHandle: flag + '',
          // preType: row.preFirstType,
        },
      })
    }
  },
}
</script>

<style lang="scss" scoped>
#userList {
  .row-bg {
    margin-bottom: 8px;
    line-height: 40px;
  }
  .m0 {
    margin: 0;
  }
  .teble-list {
    margin: 8px 20px 20px 20px;
  }
  .cursor {
    cursor: pointer;
  }
}
</style>
<style>
html body .el-table .headName .cell {
  font-weight: bold;
}
html body .el-cascader--small {
  line-height: 40px;
}
</style>
