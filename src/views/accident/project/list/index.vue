<template>
  <div id="userList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">项目名称：</span>
            <el-input
              class="w300"
              maxlength="100"
              v-model="ruleForm.projectName"
              placeholder="请输入项目名称"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">服务机构：</span>
            <el-select
              v-model="ruleForm.serviceAgencyCode"
              filterable
              clearable
              class="w300"
              placeholder="请选择服务机构"
            >
              <el-option
                v-for="(item, key) in branchList"
                :key="key"
                :label="item.orgName"
                :value="item.orgCode"
              ></el-option>
              <el-pagination
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :current-page.sync="currentPage"
                :page-size="pagesize"
                layout="total, prev, pager, next"
                :total="totalnum"
              ></el-pagination>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">发起单位：</span>
            <el-select
              v-model="ruleForm.insuranceCorporationCode"
              filterable
              clearable
              class="w300"
              placeholder="请选择类型"
            >
              <el-option
                v-for="(item, key) in insuranceList"
                :key="key"
                :label="item.orgName"
                :value="item.orgCode"
              ></el-option>
              <el-pagination
                @size-change="handleSizeChange3"
                @current-change="handleCurrentChange3"
                :current-page.sync="currentPage2"
                :page-size="pagesize2"
                layout="total, prev, pager, next"
                :total="totalnum2"
              ></el-pagination>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">录入人员：</span>
            <el-input
              class="w300"
              v-model="ruleForm.createBy"
              placeholder="请输入录入人员"
            />
          </div>
        </el-col>
      </el-row>
      <div class="mt10 mb10" style="text-align: center">
        <el-button class="ml20" type="primary" shape="round" @click="seach">
          查询
        </el-button>
        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
        <el-button
          v-if="$hasBtn('project-list-add')"
          type="primary"
          class="ml20"
          @click="add"
        >
          新增
        </el-button>
      </div>
    </div>

    <div class="ml20 statusBlank">
      <span class="type">状态：</span>

      <p class="option">
        <span
          v-for="(item, index) in auditStatusSelectData"
          :key="index"
          :class="active == index ? 'actived' : ''"
          @click="change(index, item.value)"
        >
          {{ item.label }}
        </span>
      </p>
    </div>
    <div class="teble-list">
      <!-- <el-row>
        <el-col :span="10">
          <span>&nbsp;</span>
        </el-col>
        <el-col :span="14" style="text-align: right">
          
        </el-col>
      </el-row> -->
      <div class="mt20">
        <el-table :data="tableList" border :header-cell-style="getRowClass">
          <el-table-column align="left" label="项目信息">
            <template slot-scope="scope">
              <div class="fb" style="color: #096dd9">
                <TipsText
                  v-if="scope.row.projectName"
                  :text="scope.row.projectName"
                  :length="20"
                />
              </div>
              <div>
                <span>项目期间：</span>
                <span>{{ scope.row.startTime | setTime }}</span>
                <span>至</span>
                <span>{{ scope.row.endTime | setTime }}</span>
              </div>
              <div>
                <span>合同编号：</span>
                <span>{{ scope.row.contractNo }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" label="发起单位 / 服务机构">
            <template slot-scope="scope">
              <div>{{ scope.row.insuranceCorporationName }}</div>
              <div>{{ scope.row.serviceAgencyName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="accidentPreFund"
            label="支出金额(元)"
            width="150"
            show-overflow-tooltip
            align="right"
          >
            <template slot-scope="scope">
              <div class="color-red pr20">
                <!-- 千分位展示金额 -->
                ￥{{ fmoney(scope.row.accidentPreFund, 2) || '' }}
                <!-- ￥{{ scope.row.accidentPreFund.toFixed(2) || '' }} -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" width="200">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.createByName }}</span>
              </div>
              <div>
                <span>{{ scope.row.updateTime }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="150" align="center">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.processStatus === 1" class="color-FF9228">
                  待制定计划
                </span>
                <span v-if="scope.row.processStatus === 2" class="color-green">
                  进行中({{ scope.row.finish }}/{{ scope.row.all }})次
                </span>
                <span v-if="scope.row.processStatus === 3" class="color-blue">
                  已完成
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                v-if="$hasBtn('project-list-detail')"
                type="text"
                class="detailBtn mr10"
                @click="detail(scope.row)"
              >
                查看
              </el-button>
              <el-dropdown v-if="scope.row.processStatus !== 3" trigger="click">
                <el-button type="text" class="moreBtn">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="
                      $hasBtn('project-list-update') &&
                      scope.row.processStatus !== 3
                    "
                    class="updateBtn"
                    type="text"
                    @click.native="update(scope.row)"
                  >
                    修改
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="
                      $hasBtn('project-list-delete') &&
                      scope.row.processStatus === 1
                    "
                    class="deleteBtn"
                    type="text"
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
      <div class="text-center mt10">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="ruleForm.pn"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>

    <addProject ref="addProject" @successCb="getList"></addProject>
  </div>
</template>

<script>
import { getProjectList } from '@/api/accidentManagement'
import { deleteProject } from '@/api/accidentManagement'
import { updateExpertStatus } from '@/api/userDataManagement'
import { getBranchLists } from '@/api/userDataManagement'
import addProject from '../components/addProject'
import { fmoney } from '@/utils/index'
export default {
  name: 'projectList',
  components: {
    addProject,
  },
  data() {
    return {
      ruleForm: {
        pn: 1,
        ps: 10,
        projectName: '',
        createBy: '',
        processStatus: '',
        serviceAgencyCode: '',
        insuranceCorporationCode: '',
        desc: false,
        statusAndAuditStatus: '',
      },
      // 时间数组
      dateArray: [],
      tableList: [],
      branchList: [],
      insuranceList: [],
      active: 0,
      total: 0,
      pagesize: 10,
      totalnum: 0,
      currentPage: 1,
      pagesize2: 10,
      totalnum2: 0,
      currentPage2: 1,
      auditStatusSelectData: [
        { label: '全部', value: '', status: '', auditStatus: '' },
        { label: '待制定计划', value: '1', status: '1', auditStatus: '' },
        { label: '进行中', value: '2', status: '2', auditStatus: '' },
        { label: '已完成', value: '3', status: '3', auditStatus: '' },
      ],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    fmoney(unm, it) {
      return fmoney(unm, it)
    },
    async initData() {
      this.getList()
      this.getBranchLists('insuranceBrokerSvc')

      this.getBranchLists('safetyOrganizationSvc')
    },
    handleSizeChange2(val) {
      //console.log(`每页 ${val} 条`);
      this.pagesize = val
      this.getBranchLists('safetyOrganizationSvc')
    },
    handleCurrentChange2(val) {
      //console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getBranchLists('safetyOrganizationSvc')
    },
    handleSizeChange3(val) {
      //console.log(`每页 ${val} 条`);
      this.pagesize2 = val
      this.getBranchLists('insuranceBrokerSvc')
    },
    handleCurrentChange3(val) {
      //console.log(`当前页: ${val}`);
      this.currentPage2 = val
      this.getBranchLists('insuranceBrokerSvc')
    },
    async getList() {
      let res = await getProjectList(this.ruleForm)
      if (res.code === '0000') {
        this.tableList = res.list
        this.total = res.total
      }
    },
    async getBranchLists(servicename) {
      let from = {
        pn:
          servicename == 'safetyOrganizationSvc'
            ? this.currentPage
            : this.currentPage2,
        ps:
          servicename == 'safetyOrganizationSvc'
            ? this.pagesize
            : this.pagesize2,

        servicename,
      }
      let res = await getBranchLists(from)
      if (res.code === '0000') {
        // servicename = insuranceBrokerSvc 保险经纪机构,insuranceCompanySvc 保险机构,safetyOrganizationSvc 安全服务机构
        if (servicename == 'safetyOrganizationSvc') {
          this.branchList = res.list
          this.totalnum = res.total
        } else {
          console.log(res.list, '++++++=')
          this.insuranceList = res.list
          this.totalnum2 = res.total
        }
      }
    },
    change(index, code) {
      this.active = index
      this.ruleForm.processStatus = code
      this.getList()
    },
    searchFun() {
      this.ruleForm.pn = 1
      let { status } =
        this.auditStatusSelectData.find(
          (item) => item.value == this.ruleForm.statusAndAuditStatus
        ) || {}
      console.log(this.ruleForm.statusAndAuditStatus, status, '112111')
      this.ruleForm.processStatus = status
      this.getList()
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;'
      } else {
        return ''
      }
    },
    seach() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.ruleForm.beginCreateTime =
        this.dateArray && this.dateArray[0]
          ? this.dateArray[0] + ' 00:00:00'
          : ''
      this.ruleForm.endCreateTime =
        this.dateArray && this.dateArray[1]
          ? this.dateArray[1] + ' 23:59:59'
          : ''
      this.getList()
    },
    detail(row) {
      this.$router.push({
        path: 'projectDetails',
        query: {
          id: row.id,
        },
      })
    },
    update(row) {
      this.$refs.addProject.initData(row.id)
    },
    async delet(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await deleteProject(row.id)
          if (res.code === '0000') {
            this.$baseMessage('删除成功', 'success')
            this.getList()
          }
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    add() {
      this.$refs.addProject.initData()
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
        beginCreateTime: '',
        endCreateTime: '',
        expertType: '',
        name: '',
        status: '',
        specialty: '',
        orderby: '',
        desc: false,
      }
      this.getList()
    },
    async changStatus(row) {
      let res = await updateExpertStatus(row.id, row.status)
      if (res.code === '0000') {
        this.$baseMessage('成功', 'success')
      }
    },
    formulatePlan(row) {
      this.$refs.addPlan.initData(row)
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
  .teble-list {
    margin: 20px;
  }
  .table-split {
    height: 20px;
    background-color: #f0f2f5;
  }
}
</style>
<style lang="scss">
html body .el-table .headName .cell {
  font-weight: bold;
}
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
  .state-style {
    background-color: #ffffff;
    font-size: 16px;
    .is-active {
      background: #e6a23c;
      color: #fbfbfb !important;
      font-size: 16px;
      border-right-color: #e6a23c;
      border-left-color: #e6a23c;
    }
    .el-tabs__header {
      background-color: #ffffff;
      border-bottom: 2px solid #ffa940;
      margin: 0;
    }
    .el-tabs__content {
      display: none;
    }
    .el-tabs__item {
      padding: 0 35px;
      height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 16px;
      font-weight: 500;
      color: #101010;
      position: relative;
    }
  }
}
</style>
