<template>
  <el-dialog
    title="关联事故预防专员"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    @open="initData"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-position="left"
      label-width="100px"
    >
      <p class="mb20">
        保险<span v-if="type == '04'">经纪</span>机构名称：{{ orgName }}
      </p>
      <el-row>
        <el-col :span="9">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="ruleForm.userName"
              clearable
               maxlength="10"
              show-word-limit
              class="w280"
              placeholder="请输入用户名"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="9">
          <el-form-item label="登录账号：" prop="userAccount">
            <el-input
              v-model="ruleForm.userLoginId"
              clearable
               maxlength="30"
              show-word-limit
              class="w280"
              placeholder="请输入用户名"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getAgentList">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="tableList"
      border
      header-row-class-name="headName"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="getRowClass"
    >
      <el-table-column
        prop="userName"
        label="姓名"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="branchName"
        label="所在分支机构"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column
        prop="sysRole"
        label="注册系统/角色"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="userLoginId"
        label="登录账号"
        show-overflow-tooltip
      ></el-table-column>
     
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            class="color-orange"
            type="text"
            @click="relate(scope.row)"
          >
            确认关联
          </el-button>
        </template>
      </el-table-column>
    </el-table>
     <BasePagenations
        :tolnum="total"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :currentPage="pn"
        class="pr20"
      ></BasePagenations>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
      <el-button type="warning" round @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import userManage from "@/service/userManage.js";
import correctionManagement from "@/service/CorrectionManagement";
export default {
  name: "relateMember",
  data() {
    return {
      userManage: new userManage(),
      correctionManagement: new correctionManagement(),
      dialogVisible: false,
      type: "",
      orgName: "",
      ruleForm: {
        userName: "", // 用户姓名
        userLoginId: "", //登录账号
      },
      pn: 1,
      ps:10,
      total:0,
      servicename: "",
      id: "",
      tableList: [],
      userCode: "",
    };
  },
  computed: {},
  created() {},
  methods: {
    initData() {
        this.total= 0;
        this.tableList = [];
      // this.getAgentList()
    },
        getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#b8d9fd;text-align:center;color:#0050b3";
      } else {
        return "";
      }
    },
    async getAgentList() {
      if(this.ruleForm.userName){
        if(this.ruleForm.userName.length<2){
          this.$message.error('请输入2-10位姓名！')
          return
        }
      }
      let obj = {
        jtBranchCode: "",
        hrPersonCategory: "",
        pageSize: this.ps,
        pageNum: this.pn,
        roleCode:'22RL2843999250306828555',
        sysCode: "sys_sequip_man",
        channelCode: "",
        userName: this.ruleForm.userName,
        userLoginId: this.ruleForm.userLoginId,
      };
      let res = await this.correctionManagement.getUserByNo(obj);
      if (res.code == "0000") {
        res.list.map((item) => {
          item.sysRole = item.systemAndRoleVOList.map((it) => {
            return (
              it.sysName +
              "/" +
              it.roleList.map((i) => {
                return i.roleName;
              })
            );
          });
        });
        this.total= res.total
        this.tableList = res.list;
      }
    },
    async relate(row) {
      let data = {
        orgName: this.orgName,
        type: this.type,
        userCode: row.userCode,
        userLoginAccount: row.userLoginId,
        userName: row.userName,
      };
      let res = await this.userManage.linkAccount(
        this.servicename,
        this.id,
        data
      );
      if (res.code == "0000") {
        this.$message.success("关联成功");
      }
    },
        // 分页变更
    handleCurrentChange(pn) {
      this.pn = pn;
      this.getAgentList();
    },
    handleSizeChange(val) {
      this.ps = val;
      this.getAgentList();
    },
    clear() {
      this.ruleForm.userName = "";
      this.ruleForm.userLoginId = "";
    },
    close() {
      this.clear();
    },
  },
};
</script>

<style lang="less">
.w280 {
  width: 280px;
}
</style>
