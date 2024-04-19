<template>
  <div id="insuranceList">
    <div class="elesearch1">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">{{ organizationName }}机构名称</span>
            <el-input
              v-model="ruleForm.orgName"
              class="item2"
              clearable
              maxlength="30"
              show-word-limit
              placeholder="请输入保险机构名称"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">社会信用代码</span>
            <el-input
              maxlength="30"
              show-word-limit
              clearable
              v-model="ruleForm.businessCode"
              class="item2"
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
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">地区</span>
            <el-cascader
              class="item2"
              :props="props"
              clearable
              placeholder="请选择地区"
              v-model="areaCascaser"
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="16">
          <div style="text-align: right">
            <el-button @click="reset" size="medium" round class="empty-button"
              >重 置</el-button
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

    <div class="content">
      <div class="flexBetween">
        <p>
          查询列表 <span class="color-red">共计{{ total }}条记录</span>
        </p>
        <p>
          <el-button class="add-btn" v-if="isAuth('120031')" type="primary" @click="add" size="medium" round>添 加</el-button>
        </p>
      </div>
      <div class="content-table">
        <el-table
          :data="tableList"
          fit
          header-row-class-name="headName"
          :header-cell-style="getRowClass"
        >
    
          <el-table-column
            prop="orgName"
            label="机构基础信息"
            show-overflow-tooltip
            min-width="440"
            align="left"
          >
            <template slot-scope="scope">
              <div>
                <el-tooltip
                v-if="scope.row.orgName.length>25"
                  class="item"
                  effect="dark"
                  :content="scope.row.orgName"
                  placement="top"
                >
                <p>机构名称：{{ scope.row.orgName.slice(0,25) }}...</p>
                </el-tooltip>
                <p v-if="scope.row.orgName.length<25">机构名称：{{ scope.row.orgName }}</p>

                <p>
                  机构类型： <span v-if="scope.row.orgType == '1'">总部</span>
                  <span v-if="scope.row.orgType == '2'">分公司</span>
                  <span v-if="scope.row.orgType == '3'">支公司</span>
                  <span v-if="scope.row.orgType == '4'">支公司以下机构</span>
                </p>
                <p>社会信用代码：{{ scope.row.businessCode }}</p>
                <p>
                  地区： {{ scope.row.provinceName }}
                  {{ scope.row.cityName }}
                  {{ scope.row.countryName }}
                  {{ scope.row.streetName }}
                  {{ scope.row.detailAddress }}
                </p>
                <!-- <p>安责险业务负责人姓名：{{ scope.row.safetyCharger }}</p> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="$route.name == 'jtjg'"
            prop="jtOrgName"
            label="江泰分支机构"
            width="120"
            align="left"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="updateByName"
            label="操作信息"
            align="left"
            min-width="230"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>操作人：{{ scope.row.updateByName }}</p>
              <p>操作时间：{{ scope.row.updateTime }}</p>
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
          <el-table-column
            width="150"
            align="left"
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <p>
                <el-button style="padding:5px 0;" v-if="isAuth('120032')" type="text" @click="relateMember(scope.row)">
                  关联事故预防专员
                </el-button>
              </p>
              <p>
                <el-button style="padding:5px 0;" v-if="isAuth('120033')" type="text" @click="relation(scope.row)">
                  关联产品
                </el-button>
              </p>
              <p>
                <el-button style="padding:5px 0;" v-if="isAuth('120034')" type="text" @click="update(scope.row)">
                  编辑
                </el-button>
              </p>
              <p>
                <el-button style="padding:5px 0;" v-if="isAuth('120035')" type="text" @click="detail(scope.row)">
                  详情
                </el-button>
              </p>

              <!-- <el-button
                type="text"
                style="color: #f00"
                @click="delet(scope.row)"
              >
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

    
    <jtInsuranceAdd @getMsg="refreshList" ref="jtInsuranceAdd" />
    <relateMember ref="relateMem" />
    <relation ref="relation" />
  </div>
</template>

<script>
import userManage from "@/service/userManage.js";
import policyentryService from "@/service/PolicyentryService";
import buttonSelection from "../../../policyentry/js/buttonSelection";
import relation from "../components/relation.vue";

import jtInsuranceAdd from "../add/index.vue";
import relateMember from "../components/relateMember.vue";
import getCascaderObj from "../../../policyentry/js/selectedOptions";

export default {
  name: "InsuranceList",
  components: {
    relation,
    relateMember,
    jtInsuranceAdd,
  },
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
        provinceCode: "",
        cityCode: "",
        countryCode: "",
        streetCode: "",
        type: "02",
      },
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad: (node, resolve) => {
          // node 节点数据 node.value => 当前节点的值
          // level: 层级 => 1,2,3,4
          const { level, value } = node;
          // 动态节点

          const nodes = [];
          // 为1代表第一次请求

          let type = level == 0 ? "000000000000" : node.value;
          this.provinceFn(type)
            .then((res) => {
              if (res.code == -1) {
                this.msgFn("error", res.message);
                return;
              }
              // 节点数组
              res.list.map((item) => {
                // obj里的键值是官方要求的
                let obj = {
                  value: item.value,
                  label: item.label,
                  leaf: node.level > 1,
                };
                nodes.push(obj);
              });
              // resolve 节点返回
              resolve(nodes);
            })
            .catch((error) => {
              console.log(error);
            });
        },
      },

      allArea: [],
      areaCascaser: [],
      tableList: [],
      total: 0,
    };
  },
  computed: {
    servicename() {
      if (this.$route.name == "jtjg") {
        return "insuranceBrokerSvc";
      } else if (this.$route.name == "bxjg") {
        return "insuranceCompanySvc";
      } else if (this.$route.name == "jingjijg") {
        return "insuranceBrokerSvc";
      }
    },
    organizationName() {
      if (this.$route.name == "jtjg") {
        return "江泰";
      } else if (this.$route.name == "bxjg") {
        return "保险";
      } else if (this.$route.name == "jingjijg") {
        return "经纪";
      }
    },
    relateMemType() {
      if (this.$route.name == "jtjg") {
        return "03";
      } else if (this.$route.name == "bxjg") {
        return "03";
      } else if (this.$route.name == "jingjijg") {
        return "04";
      }
    },
    route() {
      if (this.$route.name == "jtjg") {
        return "jt/detail";
      } else if (this.$route.name == "bxjg") {
        return "insurers/detail";
      } else if (this.$route.name == "jingjijg") {
        return "broker/detail";
      }
    },
  },
  created() {
 
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      this.getList();
    },
    provinceFn(id) {
      // 此处是一个promise 直接返回
      return this.userManage.getArea(id, "0");
    },
    refreshList() {
      this.getList();
    },
    async getList() {
      // 获取列表数据
      console.log(this.$route.name, "0000000");
      if (this.$route.name == "jtjg") {
        this.ruleForm.jtFlag = 1;
      }
      if (this.$route.name == "jingjijg") {
        this.ruleForm.jtFlag = 0;
      }
      let res = await this.userManage.organizationList(
        this.servicename,
        this.ruleForm
      );
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

    relateMember(row) {
      //关联专员
      this.$refs.relateMem.dialogVisible = true;
      this.$refs.relateMem.type = this.relateMemType;
      this.$refs.relateMem.orgName = row.orgName;
      this.$refs.relateMem.servicename = this.servicename;
      this.$refs.relateMem.id = row.id;
    },
    relation(row) {
      //关联产品
      this.$refs.relation.servicename = this.servicename;
      this.$refs.relation.id = row.id;
      this.$refs.relation.dialogVisible = true;
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "text-align:left;color:#333";
      } else {
        return "";
      }
    },
    seach() {
      //搜索
      this.ruleForm.pn = 1;
      this.ruleForm.ps = 10;
      this.ruleForm.provinceCode = this.areaCascaser[0] || "";
      this.ruleForm.cityCode = this.areaCascaser[1] || "";
      this.ruleForm.countyCode = this.areaCascaser[2] || "";
      this.ruleForm.streetCode = this.areaCascaser[3] || "";
      this.getList();
    },
    detail(row) {
      this.$router.push({
        path: this.route,
        query: {
          code: row.id,
          type: this.$route.name,
        },
      });
    },
    update(row) {
      this.$refs.jtInsuranceAdd.queryCode = row.id;
      this.$refs.jtInsuranceAdd.dialogVisible = true;
    },
    async delet(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.userManage.delOrganization(
            "insuranceCompanySvc",
            row.id
          );
          if (res.code === "0000") {
            this.$message.success("删除成功");
            this.getList();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    add() {
      this.$refs.jtInsuranceAdd.dialogVisible = true;
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
      this.ruleForm = {
        pn: 1,
        ps: 10,
        status: "",
        orgName: "",
        provinceCode: "",
        cityCode: "",
        countyCode: "",
        streetCode: "",
        businessCode: "",
        desc: false,
        orderby: "",
        type: "02",
      };
      this.areaCascaser = [];
      this.getList();
    },

    async changStatus(row) {
      // 修改状态请求
      let data = {
        servicename: this.servicename,
        id: row.id,
        dataStatus: row.status,
        orgType: row.orgType,
      };
      let res = await this.userManage.updateOrganization(data);
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
  p {
    line-height: 40px;
  }
}

#insuranceList {
  width: calc(100% - 40px);
  margin: 0 20px;
  padding-bottom: 80px;
  box-sizing: border-box;
  .elesearch1 {
    width: calc(100% - 40px);
    padding: 20px 20px 10px;
    // margin: 20px 20px 0 20px;
    // box-sizing: border-box;
    background-color: #fff;
    .row-bg {
      margin-bottom: 20px;
      .item1 {
        width: 25%;
        margin-right: 10px;
        margin-left: 0%;
        input {
          border: none;
          font-size: 16px;
          min-width: 110px;
        }
      }
      .affex {
        width: 30%;
        margin-right: 10px;
        border: none;
        .el-input__inner {
          border: none;
        }
      }
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
.affex .el-input .el-input__inner {
  border: none;
  text-align: right;
}
</style>

