<template>
  <div id="serviceList">
    <div class="elesearch1">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">服务机构名称</span>
            <el-input
              v-model="ruleForm.orgName"
              class="item2"
              maxlength="30"
              show-word-limit
              placeholder="请输入服务机构名称"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">社会信用代码</span>
            <el-input
              v-model="ruleForm.businessCode"
              class="item2"
               maxlength="30"
              show-word-limit
              placeholder="请输入社会信用代码"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">状态</span>
            <el-select
              v-model="ruleForm.status"
              class="item2"
              clearable
              placeholder="请选择状态"
            >
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>

      <div class="row-bg" style="text-align: right;">
            <el-button @click="reset" size="medium" round class="empty-button"
          >重 置</el-button
        >
        <el-button
          type="warning"
              @click="seach"
              round
              size="medium"
              class="query-button mr20"
          >查 询</el-button
        >
    
      </div>
    </div>

    <div class="content">
      <div class="flexBetween">
        <p>查询列表 <span class="color-red">共计{{total}}条记录</span></p>
        <p>
          <el-button v-if="isAuth('120024')" size="medium" type="primary" class="add-btn" @click="add" round>添 加</el-button
          >
        </p>
      </div>
      <div class="content-table">
        <el-table
          :data="tableList"
          
          header-row-class-name="headName"
          :header-cell-style="getRowClass"
          fit
        >
      
          <el-table-column
            prop="orgName"
            label="机构基础信息"
            min-width="230"
            show-overflow-tooltip
          >
          <template slot-scope="scope">
            <p>机构名称：{{scope.row.orgName}}</p>
            <p>社会信用代码：{{scope.row.businessCode}}</p>
            <p>地区：{{ scope.row.provinceName }}
              {{ scope.row.cityName }}
              {{ scope.row.countryName }}
              {{ scope.row.streetName }}
              {{ scope.row.detailAddress }}</p>
          </template>
          </el-table-column>
          <!-- <el-table-column
            prop="safetyCharger"
            label="安责险业务责任人姓名"
            show-overflow-tooltip
            min-width="170"
            align="left"
          ></el-table-column> -->

          <el-table-column
            prop="updateByName"
            label="操作信息"
            min-width="230"
            show-overflow-tooltip
          >
          <template slot-scope="scope">
            <p>操作人：{{scope.row.updateByName}}</p>
            <p>操作时间：{{scope.row.updateTime}}</p>
          </template>
          </el-table-column>
          <el-table-column min-width="80" label="状态" align="left">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
                @change="changStatus(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column width="100" label="操作" align="left" fixed="right">
            <template slot-scope="scope">
              <p><el-button style="padding:5px 0;" v-if="isAuth('120025')"  type="text" @click="detail(scope.row)">
                详情
              </el-button></p>
              <p>  <el-button style="padding:5px 0;" v-if="isAuth('120026')"  type="text" @click="update(scope.row)"> 编辑 </el-button></p>
            <p>
              <el-button style="padding:5px 0;" v-if="isAuth('120027')"  type="text" @click="relation(scope.row)"> 添加专家 </el-button>
            </p>
              
              <!-- <el-button type="text" style="color: #f00;" @click.native="delet(scope.row)">
                删除
              </el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="content-total">
      <BasePagenations
        :tolnum="total"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :currentPage="ruleForm.pn"
        class="pr20"
      ></BasePagenations>
    </div>
      </div>
      
    </div>

    
    <relationExpert ref="relation" />
    <serviceAdd @getMsg="refreshList" ref="serviceAdd" />
  </div>
</template>

<script>
import userManage from "@/service/userManage.js";
import policyentryService from "@/service/PolicyentryService";
import buttonSelection from "../../../policyentry/js/buttonSelection";
import getCascaderObj from "../../../policyentry/js/selectedOptions";
import relationExpert from "../components/expertAdd.vue";
import serviceAdd from "../add/index.vue";
export default {
  name: "serviceList",
  components: {relationExpert,serviceAdd},
  data() {
    return {
      userManage: new userManage(),
      policyentryService: new policyentryService(),
      ButtonSelection: new buttonSelection(),
      select: new getCascaderObj(),
      ruleForm: {
        pn: 1,
        ps: 10,
        status: "",
        orgName: "",
        businessCode: "", // 社会信用代码
        desc: false,
        orderby: "",
        type: "02",
      },
      servicename: "safetyOrganizationSvc",
      tableList: [],
      total: 0,
    };
  },
  created() {
    this.initData()
  },
  mounted() {},
  methods: {
    async initData() {
      this.getBranchList();
    },
    refreshList(){
      this.getBranchList()
    },
    relation(row){
      this.$refs.relation.id = row.id
      this.$refs.relation.orgName = row.orgName
this.$refs.relation.dialogVisible = true
    },
    async getBranchList() {
      // 获取列表数据
   let res = await this.userManage.organizationList(this.servicename,this.ruleForm);
     
      if (res.code === "0000") {
        this.tableList = res.list.map((item) => {
          if (item.status) {
            item.status = item.status.toString();
          }
          return item;
        });
        this.total = res.total;
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "color:#333;text-align:left";
      } else {
        return "";
      }
    },
    seach() {
      this.ruleForm.pn = 1;
      this.ruleForm.ps = 10;
      this.getBranchList();
    },
    detail(row) {
      this.$router.push({
        path: "agency/detail",
        query: {
          code: row.id,
        },
      });
    },
    update(row) {
    this.$refs.serviceAdd.queryCode = row.id
    this.$refs.serviceAdd.dialogVisible = true
    },
    async delet(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
        let res = await this.userManage.delOrganization("safetyOrganizationSvc", row.id);
          if (res.code === "0000") {
            this.$message.success("删除成功");
            this.getBranchList();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    add() {
      this.$refs.serviceAdd.dialogVisible = true
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn;
      this.getBranchList();
    },
    handleSizeChange(val) {
      this.ruleForm.ps = val;
      this.getBranchList();
    },
    // 重置
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        status: "",
        orgName: "",
        businessCode: "",
        desc: false,
        orderby: "",
        type: "02",
     
      };
      this.getBranchList();
    },
    
    async changStatus(row) {
      // 修改状态请求
      let data = {
        servicename: "safetyOrganizationSvc",
        id: row.id,
        dataStatus: row.status,
        orgType: row.orgType,
      };
      let  res = await this.userManage.updateOrganization(data)
      if (res.code === "0000") {
        this.$message.success("成功");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.flexBetween {
  display: flex;
  padding: 0 20px;
  box-sizing: border-box;
  justify-content: space-between;
  p{
    line-height: 40px;
  }
}

#serviceList {
  padding-bottom: 80px;
  box-sizing: border-box;
  margin: 0 20px;
  .elesearch1 {
    width: calc(100% - 40px);
    padding: 20px 20px 10px;
    background-color: #fff;
    .row-bg {
      margin-bottom: 20px;

 
      .item2 {
        width: 73%;
      }

      .item-3 {
        display: inline-block;
        width: 25%;
        text-align: right;
        font-size: 16px;
        color: #666666;
        margin-right: 10px;
        line-height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: text-bottom;
      }

     
    }
  }
 
  .content {
    margin-top: 20px;
    padding-top: 20px;
    background-color: #ffffff;

    .content-table {
      width: 100%;
      padding: 20px 20px 30px;
      margin-bottom: 40px;
      box-sizing: border-box;
    }
  }
  .content-total {
    // width: 85.2%;
    margin: 30px 30px 0 20px;
    bottom: 0;
    text-align: right;
  }
}
</style>
<style>
.affex .el-input .el-input__inner {
  border: none;
  text-align: right;
}
</style>

