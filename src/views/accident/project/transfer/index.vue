<template>
  <div id="projectList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">申请人：</span>

            <el-cascader
              class="w280"
              
              :props="props"
              clearable
              v-model="ruleForm.selectedOptions"
              placeholder=""
            ></el-cascader>
          </div>
        </el-col>

        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">项目名称：</span>
            <el-input
                maxlength="100"
              show-word-limit
              clearable
              v-model.trim="ruleForm.projectName"
              placeholder="请输入项目名称"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">项目编码：</span>
            <el-input
                maxlength="50"
              show-word-limit
              clearable
              v-model.trim="ruleForm.contractNo"
              placeholder="请输入项目编码"
            />
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="24">
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
    </div>
    <div class="table-split"></div>

    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span>&nbsp;</span>
        </el-col>
        <el-col :span="14" style="text-align: right">
          <el-button
            v-if="isAuth('120020')"
            type="primary"
            class="ml20"
            @click="add"
            round
            >选中转移</el-button
          >
        </el-col>
      </el-row>
      <div class="mt20">
        <el-table :data="tableList" :header-cell-style="getRowClass">
          <el-table-column show-overflow-tooltip width="300" label="项目名称">
            <template slot-scope="scope">
              <div>
                <el-checkbox
                  @change="
                    (checked) => handleCheckAllChange(checked, scope.row)
                  "
                  style="margin-right: 10px"
                  v-model="scope.row.checked"
                ></el-checkbox>
                <span>{{ scope.row.projectName }}</span>
                <span>({{ scope.row.contractNo }})</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="项目时间" >
            <template slot-scope="scope">
              <span>{{ scope.row.startTime | format }}</span>
              <span>至</span>
              <span>{{ scope.row.endTime | format }}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="200"
            prop="createPerson"
            label="申请人"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="200"
            prop="createTime"
            label="申请时间"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            label="状态"
            width="150"
            align="center"
          >
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
                  <i
                    class="el-icon-question col-grey f20 pointer"
                    @click="getProjectDetails(scope.row.id)"
                  ></i>
                </span>
                <span v-if="scope.row.approveStatus === 5" class="color-blue">
                  待制定计划
                </span>
                <span v-if="scope.row.approveStatus === 6" class="color-green">
                  进行中
                  <!-- ({{ scope.row.finish }}/{{ scope.row.all }}) -->
                </span>
                <span v-if="scope.row.approveStatus === 7" class="color-blue">
                  已完成
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="所属分支机构"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.orgName }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="text-center mt10">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          :page-size="ruleForm.ps"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <transfer
    @getMsg = 'getList'
      :transferList="transferDetail"
      :transferNum="chooseBox"
      ref="transfer"
    />
  </div>
</template>

<script>
import transfer from "./components/index.vue";
import {
  getTransferList,
  getProjectDetails,
  getTransfer
} from "@/service/accidentManagement";
import userManage from "@/service/userManage.js";
// import { organizationList, detailOrganization, linkAccountList} from "@/service/userManage.js";
export default {
  name: "ProjectList",
  components: { transfer },
  data() {
    return {
      userManage: new userManage(),
      tableList: [],
      transferDetail:{},
      branchList: [
        {
          value: 1,
          label: "江泰机构",
        },
        {
          value: 2,
          label: "保险机构",
        },
        {
          value: 3,
          label: "经纪机构",
        },
      ],
      chooseBox: [],
      serName: "",
      ruleForm: {
        pn: 1,
        ps: 10,
        projectName: "",
        applicantCode: "",
        selectedOptions: [],
        createBy: "",
        contractNo: "",

        statusAndAuditStatus: "all",
        desc: false,
      },
      props: {
        lazy: true,

        lazyLoad: (node, resolve) => {
          // node 节点数据 node.value => 当前节点的值
          // level: 层级 => 1,2,3

          const { level } = node;
          // 动态节点
          const nodes = [];
          let type = node.value;
          // 为1代表第一次请求

          if (level == 0) {
            this.branchList.map((item) => {
              let obj = {
                value: item.value,
                label: item.label,
                leaf: false,
              };
              nodes.push(obj);
            });
            resolve(nodes);
          } else if (level == 1) {
            this.getOrg(type)
              .then((res) => {
                // 节点数组
                res.list.map((item) => {
                  // obj里的键值是官方要求的
                  let obj = {
                    value: item.id,
                    label: item.orgName,
                    leaf: false,
                  };
                  nodes.push(obj);
                });
                // resolve 节点返回
                resolve(nodes);
              })
              .catch((error) => {
                console.log(error);
              });
          } else if (level == 2) {
            this.getMember(type)
              .then((res) => {
                // 节点数组
                res.list.map((item) => {
                  // obj里的键值是官方要求的
                  let obj = {
                    value: item.userCode,
                    label: item.userName,
                    leaf: true,
                  };
                  nodes.push(obj);
                });
                // resolve 节点返回
                resolve(nodes);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        },
      },
      newForm: {
        pn: 1,
        ps: 999,
        desc: false,
        type: "02",
      },
      auditStatusSelectData: [
        { label: "全部", value: "all", status: "", auditStatus: "" },
        { label: "待审核", value: "1", status: "1", auditStatus: "" },
        { label: "审核中", value: "2", status: "2", auditStatus: "" },
        { label: "审核不通过", value: "4", status: "4", auditStatus: "" },
        { label: "待制定计划", value: "5", status: "5", auditStatus: "" },
        { label: "进行中", value: "6", status: "6", auditStatus: "" },
        { label: "已完成", value: "7", status: "7", auditStatus: "" },
      ],
      total: 0,
    };
  },

  created() {
    this.getList();
  },
  
  methods: {
    handleCheckAllChange(e, row) {
      
      if (e) {
        //添加
        if (this.chooseBox.length >= 10) {
          this.$message.error("最多选择10个!");
        } else {
          this.chooseBox.push(row);
        }
      } else {
         this.chooseBox =  this.chooseBox.filter((item)=>{
          return item!=row
         })
        //删除
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "";
      } else {
        return "";
      }
    },
    servicename(type) {
      if (type == "1") {
        this.serName = "insuranceBrokerSvc";
        return "insuranceBrokerSvc";
      } else if (type == "2") {
        this.serName = "insuranceCompanySvc";
        return "insuranceCompanySvc";
      } else if (type == "3") {
        this.serName = "insuranceBrokerSvc";
        return "insuranceBrokerSvc";
      }
    },
    async getMember(val) {
      return this.userManage.linkAccountList(this.serName, val);
    },
    async getOrg(type) {
      // 获取列表数据
      let servicename = this.servicename(type);
      if (type == "1") {
        this.newForm.jtFlag = 1;
      }
      if (type == "3") {
        this.newForm.jtFlag = 0;
      }

      return this.userManage.organizationList(servicename, this.newForm);
    },
    seach() {
      this.ruleForm.pn = 1;
      this.ruleForm.ps = 10;
      if (this.ruleForm.selectedOptions.length) {
        this.ruleForm.applicantCode = this.ruleForm.selectedOptions[2];
      } else {
        this.ruleForm.applicantCode = "";
      }
      this.getList();
    },
    async getList() {
      let res = await getTransferList(this.ruleForm);
      if (res.code === "0000") {
        res.list.map((item) => {
          item.checked = false;
        });
        this.total = res.total;
        this.tableList = res.list;

        this.chooseBox = [];
      }
    },
    async getProjectDetails(id) {
      let res = await getProjectDetails(id);
      if (res.code === "0000") {
        this.$message.warning(res.data.failureReason);
      }
    },
  async  add() {
      if (this.chooseBox.length) {
      

        let res = await getTransfer(this.chooseBox);
        if (res.code == "0000") {
          this.transferDetail = res.data
          this.$refs.transfer.dialogVisible = true;
        }
      } else {
        this.$message.error("请先选择要转移的项目！");
      }
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn;
      this.getList();
    },
    handleSizeChange(val) {
      this.ruleForm.ps = val;
      this.getList();
    },
    // 重置
    reset() {
      this.chooseBox = [];
      this.ruleForm = {
        pn: 1,
        ps: 10,
        expertType: "",
        projectName: "",
        applicantCode: "",
        selectedOptions: [],
        contractNo: "",
        orderby: "",
        statusAndAuditStatus: "all",
        desc: false,
      };
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
#projectList {
  margin: 0 20px;
  background-color: #fff;
  .elsearch {
    margin: 20px;
    padding-top: 20px;
  }
  .row-bg {
    margin-bottom: 20px;
    line-height: 40px;
  }
  .table-split {
    height: 20px;
    background-color: #EAEAEAs;
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
	
