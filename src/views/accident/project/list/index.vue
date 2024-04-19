<template>
  <div id="projectList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">项目名称：</span>
            <el-input
              v-model.trim="ruleForm.projectName"
              placeholder="请输入项目名称"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">服务机构：</span>
            <el-select
              v-model="ruleForm.serviceAgencyCode"
              class="w450"
              filterable
              clearable
              placeholder="请选择服务机构"
            >
              <el-option
                v-for="(item, key) in branchList"
                :key="key"
                :label="item.orgName"
                :value="item.businessCode"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">发起机构：</span>
            <el-select
              v-model="ruleForm.insuranceCorporationCode"
              class="w524"
              filterable
              clearable
              placeholder="请选择发起机构"
            >
              <el-option
                v-for="(item, key) in insuranceList"
                :key="key"
                :label="item.jtOrgName"
                :value="item.jtOrgCode"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">申请人：</span>
            <el-input
              v-model.trim="ruleForm.createBy"
              placeholder="请输入申请人"
            />
          </div>
        </el-col>
        <el-col :span="16">
          <div style="text-align: right">
            <el-button @click="reset" size="medium" round class="empty-button"
              >重置</el-button
            ><el-button
              type="warning"
              @click="seach"
              round
              size="medium"
              class="query-button mr20"
              >查 询</el-button
            >
          </div>
        </el-col>
      </el-row>
      <!-- <div class="ml20 text-center">
        <el-button type="primary" shape="round" @click="seach">查询</el-button>
        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
      </div> -->
    </div>
    <div class="table-split"></div>
    <el-tabs type="border-card" v-model="ruleForm.statusAndAuditStatus" @tab-click="searchFun" class="state-style">
      <el-tab-pane :label="item.label" :name="item.value" v-for="(item,index) in auditStatusSelectData" :key="index"></el-tab-pane>
    </el-tabs>
    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span>&nbsp;</span>
        </el-col>
        <el-col :span="14" style="text-align: right">
          <el-button v-if="isAuth('120002')" type="primary" class="ml20" @click="add" round>新增项目</el-button>
        </el-col>
      </el-row>
      <div class="mt20">
        <el-table :data="tableList" border :header-cell-style="getRowClass">
          <el-table-column label="项目信息">
            <template slot-scope="scope">
              <div class="color-blue">
                <span>{{ scope.row.projectName }}</span>
              </div>
              <div>
                <span>项目时间：</span>
                <span>{{ scope.row.startTime | format }}</span>
                <span>至</span>
                <span>{{ scope.row.endTime | format }}</span>
              </div>
              <div>
                <span>项目合同编号:</span>
                <span>{{ scope.row.contractNo }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="发起单位 / 服务机构" width="350">
            <template slot-scope="scope">
              <div class="display-flex">
                <!-- <div style="align-items: center" class="display-flex">
                  <i
                    style="transform: rotate(85deg)"
                    class="el-icon-sort color-FF9228"
                  ></i>
                </div> -->
                <div>
                  <div>{{ scope.row.orgName }}</div>
                  <div>{{ scope.row.serviceAgencyName }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="accidentPreFund"
            label="支出金额(元)"
            width="150"
          >
            <template slot-scope="scope">
              <span class="color-blue">
                ￥{{ scope.row.accidentPreFund.toFixed(2) || '' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="申请日期 / 人员" width="180">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.createTime }}</span>
              </div>
              <div>
                <span>申请人：</span>
                <span>{{ scope.row.createPerson }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="150" align="center">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.approveStatus === 1" class="color-FF9228">
                  待审核
                </span>
                <span v-if="scope.row.approveStatus === 2" class="color-FF9228">
                  审核中
                </span>
                <span v-if="scope.row.approveStatus === 4" class="color-red">
                  不通过
                  <i class="el-icon-question col-grey f20 pointer" @click="getProjectDetails(scope.row.id)"></i>
                </span>
                <span v-if="scope.row.approveStatus === 5" class="color-blue">
                  待制定计划
                </span>
                <span v-if="scope.row.approveStatus === 6" class="color-green">
                  进行中({{ scope.row.finish }}/{{ scope.row.all }})
                </span>
                <span v-if="scope.row.approveStatus === 7" class="color-blue">
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
              <div>
                <el-button type="text" @click="detailHistory(scope.row)" v-if="scope.row.approveStatus === 1 || scope.row.approveStatus === 2 || scope.row.approveStatus === 4">查看审核进度</el-button>
              </div>
              <div>
                <el-button v-if="scope.row.approveStatus === 5 || scope.row.approveStatus === 6 || scope.row.approveStatus === 7" type="text" @click="detail(scope.row)">查看</el-button>
                <span class="color-blue"  v-if="isAuth('120003') && (scope.row.approveStatus === 4 || scope.row.approveStatus === 5)">|</span>
                <el-button
                  v-if="isAuth('120003') && (scope.row.approveStatus === 4 || scope.row.approveStatus === 5)"
                  type="text"
                  @click="update(scope.row)"
                >
                  修改
                </el-button>
                <span class="color-blue"  v-if="isAuth('120004') && (scope.row.approveStatus === 4 || scope.row.approveStatus === 5)">|</span>
                <el-button
                  v-if="isAuth('120004') && (scope.row.approveStatus === 4 || scope.row.approveStatus === 5)"
                  type="text"
                  @click="delet(scope.row)"
                >
                  删除
                </el-button>
              </div>
              
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="text-center mt10">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <addProject ref="addProject" @succeckCellBack="getList"></addProject>
    <DialogExamineDetails ref="DialogExamineDetails" @succeckCellBack="getList"></DialogExamineDetails>
  </div>
</template>

<script>
  import { getProjectList,getProjectDetails,deleteProject } from '@/service/accidentManagement'
  import userManage from "@/service/userManage.js";
  import { valueLength } from "@/util/validate.js";
  import addProject from "../components/addProject";
  import DialogExamineDetails from "@/views/accident/examine/components/DialogExamineDetails";
  export default {
    name: 'ProjectList',
    components: {
      addProject,
      DialogExamineDetails,
    },
    data() {
      return {
        userManage: new userManage(),
        ruleForm: {
          pn: 1,
          ps: 10,
          projectName: '',
          createBy: '',
          approveStatus: '',
          serviceAgencyCode: '',
          insuranceCorporationCode: '',
          statusAndAuditStatus:'all',
          desc: false,
        },
        // 时间数组
        dateArray: [],
        tableList: [],
        branchList: [],
        insuranceList: [],
        auditStatusSelectData: [
				{ label: "全部", value: "all",status:"",auditStatus:""},
				// { label: "待审核", value: "1",status:"1",auditStatus:""},
				// { label: "审核中", value: "2",status:"2",auditStatus:""},
				// { label: "审核不通过", value: "4",status:"4",auditStatus:""},
				{ label: "待制定计划", value: "5",status:"5",auditStatus:""},
				{ label: "进行中", value: "6",status:"6",auditStatus:""},
				{ label: "已完成", value: "7",status:"7",auditStatus:""}
			],
        total: 0,
      }
    },
    created() {
      this.$store.dispatch("setEnumInfo");
      this.initData()
    },
    methods: {
      async initData() {
        this.getList()
        this.getBranchList('insuranceBrokerSvc')
        // this.getBranchList('insuranceCompanySvc')
        this.getBranchList('safetyOrganizationSvc')
      },
      async getList() {
        if(this.ruleForm.projectName && !valueLength(this.ruleForm.projectName)) {
          this.$message.error('项目名称为3-30位')
        } else if(this.ruleForm.createBy && !valueLength(this.ruleForm.createBy,/^.{2,10}$/i)) {
          this.$message.error('申请人名称为2-10位')
        } else {
          let res = await getProjectList(this.ruleForm)
          if (res.code === '0000') {
            this.tableList = res.list
            this.total = res.total
          }
        }
        
      },
      async getBranchList(servicename) {
        let from = {
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
          jtFlag:servicename=='insuranceBrokerSvc'?'1':'', // "是否江泰机构列表 1-江泰机构列表 0-非江泰机构列表"
        }
        let res = await this.userManage.organizationList(servicename,from)
        if (res.code === '0000') {
          // servicename = insuranceBrokerSvc 保险经纪机构,insuranceCompanySvc 保险机构,safetyOrganizationSvc 安全服务机构
          if (servicename == 'safetyOrganizationSvc') {
            this.branchList = [...res.list]
          } else {
            this.insuranceList = [...this.insuranceList, ...res.list]
          }
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
          path: '/prev/project/detail',
          query: {
            id: row.id,
          },
        })
      },
      update(row) {
        this.$refs.addProject.initData(row.id)
      },
      async delet(row) {
        this.$confirm('是否确认删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            let res = await deleteProject(row.id)
            if (res.code === '0000') {
              this.$message.success('删除成功')
              this.getList()
            }
          })
          .catch(() => {
            this.$message.info('已取消删除')
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
      searchFun(){
        this.ruleForm.pn = 1
        let {status} = this.auditStatusSelectData.find(item=>item.value==this.ruleForm.statusAndAuditStatus) || {}
        this.ruleForm.approveStatus = status
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
          statusAndAuditStatus:'all',
          desc: false,
        }
        this.getList()
      },
      detailHistory(row){
        this.$refs.DialogExamineDetails.openInit(row.id)
      },
      async getProjectDetails(id) {
        let res = await getProjectDetails(id)
        if(res.code==='0000') {
          this.$message.warning(res.data.failureReason)
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  #projectList {
    background-color: #fff;
    margin: 0 20px;
    .elsearch {
      margin:0 20px 20px;
      padding-top: 20px;
    }
    .row-bg {
      margin-bottom: 20px;
      line-height: 40px;
    }
    .table-split {
      height: 20px;
      background-color: #EAEAEA;
    }
    .teble-list {
      margin: 20px;
    }
  }
</style>
<style lang="less">
#projectList {
  .state-style {
    background-color: #ffffff;
    font-size: 16px;
    .is-active {
      background: #E6A23C;
        color: #fbfbfb !important;
      font-size: 16px;
      border-right-color: #E6A23C;
      border-left-color: #E6A23C;
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
	
