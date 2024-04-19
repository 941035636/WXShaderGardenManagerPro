<template>
  <div id="highRiskList">
    <div class="elesearch1">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">单位名称</span>
            <el-input
              placeholder="请输入企业名称"
              v-model.trim="data.custFullName"
              class="item2"
               maxlength="30"
              show-word-limit
              clearable
            ></el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">社会信用代码</span>

            <el-input
              placeholder="请输入社会信用代码"
              v-model.trim="data.blCode"
              class="item2"
               maxlength="30"
              show-word-limit
              clearable
            ></el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">状态</span>
            <el-select
              v-model="data.businessStatus"
              class="item2"
              clearable
              placeholder="请选择性质"
            >
              <el-option label="有效" value="true"></el-option>
              <el-option label="无效" value="false"></el-option>
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
            <el-button @click="empty" size="medium" round class="empty-button"
              >重 置</el-button
            >
            <el-button
              type="warning"
              @click="searchview"
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
          <el-button
            class="add-btn"
            size="medium"
            v-if="isAuth('120021')"
            type="primary"
            @click="add"
            round
            >添 加</el-button
          >
        </p>
      </div>
      <div class="content-table">
        <el-table
          :data="tableList"
          fit
          header-row-class-name="headName"
          :header-cell-style="{ 'text-align': 'left', color: '#333' }"
        >
          <el-table-column
            prop="custFullName"
            label="单位基础信息"
            min-width="460"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>单位名称：{{ scope.row.custFullName }}</p>
              <p>社会信用代码：{{ scope.row.blCode }}</p>
              <p>
                地区： {{ scope.row.provinceName }}
                {{ scope.row.cityName }}
                {{ scope.row.countyName }}
                {{ scope.row.streetName }}
              </p>
            </template>
          </el-table-column>

          <el-table-column
            prop="contactName"
            label="联系人信息"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="updateTime"
            label="操作信息"
            min-width="250"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>操作人：{{ scope.row.updatePerson }}</p>
              <p>操作时间：{{ scope.row.updateTime }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" min-width="70">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.businessStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeStatus(scope.row.id)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="left" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                v-if="isAuth('120022')"
                type="text"
                @click="detail(scope.row)"
              >
                详情
              </el-button>
              <el-button
                v-if="isAuth('120023')"
                type="text"
                @click="update(scope.row)"
              >
                修改
              </el-button>
              <!-- <el-button
                class="color-red"
                type="text"
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
            :currentPage="data.pn"
            class="pr20"
          ></BasePagenations>
        </div>
      </div>
    </div>
    <Detail ref="companyDeatil" />
    <Add @getMsg="getList" ref="companyAdd" />
  </div>
</template>

<script>
import userManage from "@/service/userManage.js";
import Detail from "../details/index.vue";
import Add from "../add/index.vue";
export default {
  components: { Detail ,Add},
  data() {
    return {
      userManage: new userManage(),
      data: {
        pn: 1,
        ps: 10,
        businessType: "01",
        provinceCode: "",
        cityCode: "",
        countyCode: "",
        streetCode: "",
        custFullName: "",
        businessStatus: null,
        blCode: "",
        lawManBlCode: "",
      },
      areaCascaser: [],
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
                  leaf: node.level > 2,
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
      total: 0,
      tableList: [],

      productDate: [],
      branchList: [],
    };
  },
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    // 列表查询
    async getList() {
      let res = await this.userManage.enterpriseList(this.data);
      if (res.code === "0000") {
        this.tableList = res.list.map((item) => {
          
          return item;
        });
        this.total = res.total;
      }
    },
    provinceFn(id) {
      // 此处是一个promise 直接返回
      return this.userManage.getArea(id, "0");
    },
    add(row) {
      this.$refs.companyAdd.dialogVisible = true
    },
    update(row) {
      this.$refs.companyAdd.userCode = row.id;
       this.$refs.companyAdd.dialogVisible = true
    },
    //修改状态
    async changeStatus(id) {
      let res = this.userManage.enterpriseStatus(id);
    },
    //查询
    searchview() {
      this.data.pn = 1;
      this.data.ps = 10;

      this.data.provinceCode = this.areaCascaser[0] || "";
      this.data.cityCode = this.areaCascaser[1] || "";
      this.data.countyCode = this.areaCascaser[2] || "";
      this.data.streetCode = this.areaCascaser[3] || "";
      this.getList();
    },
    //删除
    async delet(row) {
      this.$confirm("请确认是否删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
          let res = await this.userManage.enterpriseDelete(row.id);
          if ((res.code = "0000")) {
            this.searchview();
            this.$message.success("删除成功");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //清空
    empty() {
      this.data = {
        pn: 1,
        ps: 10,
        provinceCode: "",
        cityCode: "",
        countyCode: "",
        streetCode: "",
        blCode: "",
        custFullName: "",
        businessStatus: "",
      };

      this.pn = 1;
      this.currentPage = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.data.ps = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.data.pn = val;
      this.getList();
    },
    detail(e) {
      this.$refs.companyDeatil.userCode = e.id;
      this.$refs.companyDeatil.dialogVisible = true;
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

#highRiskList {
  padding-bottom: 80px;
  box-sizing: border-box;
  margin: 0px 20px;
  .elesearch1 {
    width: calc(100% - 40px);
    
    padding: 20px 20px 10px;
    background-color: #fff;
    .row-bg {
      margin-bottom: 20px;
      .item1 {
        width: 25%;
        margin-right: 10px;
        margin-left: 0%;
  
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


