<template>
  <div id="userList">
    <div class="elesearch1">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">姓名：</span>
            <el-input
              maxlength="10"
              show-word-limit
              clearable
              v-model="ruleForm.safetyTechniciansName"
              class="item2"
              placeholder="请输入姓名"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">所在单位：</span>
            <el-input
            maxlength="30"
              show-word-limit
              v-model="ruleForm.safetyTechniciansCompany"
              class="item2"
              clearable
              placeholder="请输入所在单位"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">状态：</span>
            <el-select
              v-model="ruleForm.expertStatus"
              class="item2"
              clearable
              placeholder="请选择"
            >
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div class="row-bg" style="text-align: right">
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
        <p>
          查询列表 <span class="color-red">共计{{ total }}条记录</span>
        </p>
      </div>
      <div class="content-table mt10">
        <el-table
          :data="tableList"
          fit
          header-row-class-name="headName"
          :header-cell-style="getRowClass"
          :cell-style="{ 'text-align': 'left' }"
        >
          <el-table-column
            prop="safetyTechniciansName"
            label="姓名"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="safetyTechniciansPhone"
            label="联系电话"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p v-if="scope.row.safetyTechniciansPhone">
                {{
                  scope.row.safetyTechniciansPhone.substr(0, 3) +
                  "****" +
                  scope.row.safetyTechniciansPhone.substr(7)
                }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="safetyTechniciansCompany"
            label="所在单位"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="updateByName"
            label="操作人"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="updateTime"
            label="操作时间"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column width="70" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.expertStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                @change="changStatus(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="isAuth('120028')"
                type="text"
                @click="detail(scope.row)"
              >
                查看
              </el-button>
              <span class="color-blue" v-if="isAuth('120029')">|</span>
              <el-dropdown class="drdown" trigger="click">
                <span
                  v-if="isAuth('120029')"
                  style="font-size: 14px"
                  class="el-dropdown-link"
                >
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="isAuth('120029')"
                    @click.native="update(scope.row)"
                  >
                    修改
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="isAuth('120030')"
                    style="color: #f00"
                    @click.native="delet(scope.row)"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-total">
          <BasePagenations
            :tolnum="total"
            @handleCurrentChange="handleCurrentChange"
            :currentPage="ruleForm.pn"
            class="pr20"
          ></BasePagenations>
        </div>
      </div>
    </div>

    <relationExpert @getMsg="refresh" ref="relation" />
  </div>
</template>

<script>
import userManage from "@/service/userManage.js";
import policyentryService from "@/service/PolicyentryService";
import buttonSelection from "../../../policyentry/js/buttonSelection";
import getCascaderObj from "../../../policyentry/js/selectedOptions";
import relationExpert from "../../service/components/expertAdd.vue";
import { mapGetters } from "vuex";
export default {
  name: "SafetyList",
  components: { relationExpert },
  data() {
    return {
      userManage: new userManage(),
      policyentryService: new policyentryService(),
      ButtonSelection: new buttonSelection(),
      select: new getCascaderObj(),
      ruleForm: {
        pn: 1,
        ps: 10,
        expertType: "",
        name: "",
        expertStatus: "",
        orderby: "",
        provinceCode: "",
        cityCode: "",
        countryCode: "",

        desc: false,
      },
      areaCascaser: [],
      allArea: [],
      tableList: [],
      typeData: [],
      total: 0,
    };
  },

  computed: {
    ...mapGetters({
      getEnumAll: "getEnumAll",
    }),
  },
  created() {
    this.$store.dispatch("setEnumInfo");
    this.initData();
  },
  methods: {
    async initData() {
      this.getArea();
      this.getList();
    },
    async getArea() {
      const res = await this.policyentryService.getArea();
      this.allArea = this.ButtonSelection.Accessarea(
        res.data,
        // window.sessionStorage.getItem("branchCode")
        "JT0000"
      );
    },
    refresh() {
      this.getList();
    },
    async getList() {
      // 初始化列表查询
      let res = await this.userManage.expertList(this.ruleForm);
      // this.typeData = this.getEnumAll.ExpertTypeEnum;
      console.log(this.typeData, "======");
      if (res.code === "0000") {
        this.tableList = res.list.map((item) => {
          if (item.serviceAccidentTypes) {
            //拼接主要服务项目
            item.serviceAccidentName = item.serviceAccidentTypes
              .map((obj) => {
                return obj.serviceAccidentTypeName;
              })
              .join(",");
          }
          if (item.expertType && item.expertType != "4") {
            //专家类型 1-保险机构 2-保险经纪机构 3-服务机构 4|空 - 个人 ,
            // item.expertTypeName = this.typeData.find(
            //   (it) => it.code == item.expertType
            // ).label;
          } else {
            item.expertTypeName = "个人";
          }
          return item;
        });
        this.total = res.total;
      }
      console.log(this.tableList, "///////");
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "color:#333;text-align: left;";
      } else {
        return "";
      }
    },
    seach() {
      this.ruleForm.pn = 1;
      this.ruleForm.ps = 10;
      this.ruleForm.provinceCode = this.areaCascaser[0] || "";
      this.ruleForm.cityCode = this.areaCascaser[1] || "";
      this.ruleForm.countyCode = this.areaCascaser[2] || "";
      if (this.ruleForm.safetyTechniciansName) {
        if (2 > this.ruleForm.safetyTechniciansName.length) {
          this.$message.error("请输入2-10位姓名");
        } else {
          this.getList();
        }
      } else {
        this.getList();
      }
    },
    async delet(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.userManage.deleteExpert(row.id);
          if (res.code === "0000") {
            this.$message.success("删除成功");
            this.getList();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn;
      this.getList();
    },
    // 重置
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        expertType: "",
        name: "",
        expertStatus: "",
        orderby: "",
        provinceCode: "",
        cityCode: "",
        countryCode: "",
        desc: false,
      };
      this.areaCascaser = [];
      this.getList();
    },
    detail(row) {
      this.$router.push({
        path: "expert/detail",
        query: {
          code: row.id,
        },
      });
    },
    update(row) {
      this.$refs.relation.code = row.id;
      this.$refs.relation.orgName = row.orgName;
      this.$refs.relation.dialogVisible = true;
    },
    async changStatus(row) {
      //改变状态

      let data = {
        id: row.id,
        dataStatus: row.expertStatus,
      };
      let res = await this.userManage.expertStatus(data);
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
}

#userList {
  padding-bottom: 80px;
  box-sizing: border-box;
  margin: 0 20px;
  .drdown {
    color: #409eff;
    cursor: pointer;
    line-height: 1;
  }
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
    // width: calc(100% - 40px);
    // margin: 20px;
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
html body .el-table .headName .cell {
  font-weight: bold;
}
</style>
