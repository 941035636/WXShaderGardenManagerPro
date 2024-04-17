<template>
  <div id="userList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">企业名称：</span>
            <el-input
              v-model="ruleForm.entName"
              size="small"
              class="w300"
              maxlength="50"
              clearable
              placeholder="请输入企业名称"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">信用代码：</span>

            <el-input
              v-model="ruleForm.companyCode"
              size="small"
              class="w300"
              clearable
              placeholder="请输入统一社会信用代码"
            />
          </div>
        </el-col>
        <el-col :span="8">
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
        <el-col :span="24">
          <div style="display: flex">
            <span class="item3">状态：</span>
            <el-select
              v-model="ruleForm.operateType"
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
              添加
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
          <!-- <el-button round type="primary" @click="business">企业管理</el-button> -->
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
            prop="entName"
            label="企业信息"
            align="left"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>
                <span class="fb">{{ scope.row.entName }}</span>
                （{{ scope.row.companyCode }}）
              </p>
              <!-- <p>社会信用代码：{{ scope.row.companyCode }}</p> -->
            </template>
          </el-table-column>

          <el-table-column
            prop="companyIndustryName"
            label="经营地址"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p v-if="scope.row.provinceName">
                {{ scope.row.provinceName }} / {{ scope.row.cityName }} /
                {{ scope.row.areaName }}
              </p>
              <p v-else>经营地址：--</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="operateType"
            align="center"
            label="企业人数"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>共 {{ scope.row.peopleNum || '--' }} 人</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="120">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.operateType"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="0"
                inactive-value="1"
                @change="changeStatus(scope.row)"
              ></el-switch>
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
              <p>操作人：{{ scope.row.updateName }}</p>
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
  </div>
</template>

<script>
import add from '../components/add.vue'
import detail from '../components/detail.vue'
import { getAreaDetail } from '@/api/Areas'
import {
  getOrgList,
  changStatus,
  getSupAuthority,
  projectdata,
  putBusinessType,
} from '@/api/userDataManagement'
import { dictItem } from '@/api/policyManagement'
import { getSysEntList, deleteOrg } from '@/api/user'
import { mapGetters } from 'vuex'
import { CheckSocialCreditCode } from '@/utils/validate'
import TipsText from '@/components/TipsText'
import { alterSave } from '@/api/user'
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
      stetaList: [
        {
          label: '有效',
          value: '0',
        },
        {
          label: '无效',
          value: '1',
        },
      ],
      ruleForm: {
        pn: 1,
        ps: 10,

        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        areaCode: '',
        countryName: '',
        areaName: '',
        companyIndystryIds: [],
        businessType: '', //类型
        belongToYear: '', //年份
        industryTypeOne: '',
        industryTypeTwo: '',
        entName: '',
        businessStatus: null,
        BusinesStatus: '',
        companyCode: '',
        lawManBlCode: '',
        operateType: '',
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
      let res = await getSysEntList(this.ruleForm)
      console.log(res, 'dssdd')
      if (res.code === '0000') {
        this.tableList = res.data.records.map((item) => {
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
    async changeStatus(row) {
      let userCode = row.entNo
      let data = row
      console.log(data.operateType, '５５５５５５５５５５')
      let res = await alterSave(data, userCode)
      if (res.code == '0000') {
        this.$message.success('修改成功')
      }
    },
    seach() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.ruleForm.provinceCode = this.areaCascaser[0] || ''
      this.ruleForm.cityCode = this.areaCascaser[1] || ''
      this.ruleForm.areaCode = this.areaCascaser[2] || ''
      this.ruleForm.industryTypeOne = this.ruleForm.companyIndystryIds[0] || ''
      this.ruleForm.industryTypeTwo = this.ruleForm.companyIndystryIds[1] || ''
      if (
        this.ruleForm.companyCode &&
        !CheckSocialCreditCode(this.ruleForm.companyCode)
      ) {
        this.$baseMessage('请输入正确的社会信用代码', 'error')
        return
      }

      this.getOrgList()
    },
    detail(row) {
      this.$refs.detail.userCode = row.entNo
      this.$refs.detail.dialogVisible = true
    },
    update(row) {
      this.$refs.addUser.userCode = row.entNo
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
        areaCode: '',
        countryName: '',
        areaName: '',
        companyIndystryIds: [],
        industryTypeTwo: '',
        industryTypeOne: '',
        entName: '',
        businessStatus: '',
      }
      this.getOrgList()
    },
    // async project(row, all) { //查看项目信息于11.6日 因为需求变更不在需要
    //   this.listData = { ...row }
    //   // this.blCodeDia = row.companyCode
    //   this.dialogTableVisible = true
    //   let obj = {
    //     dataStatus: all,
    //   }
    //   let res = await projectdata(this.listData.companyCode, obj)
    //   this.gridData = res.list
    //   this.total1 = res.total
    //   this.dataDeging()
    // },
    // async seachDialog() { // 查看项目中的查询按钮
    //   let obj = {
    //     dataStatus: this.dataStatus,
    //   }
    //   let res = await projectdata(this.listData.companyCode, obj)
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
    },
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
