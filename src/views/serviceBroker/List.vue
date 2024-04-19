<template>
  <div id="brokerList">
    <div class="elesearch">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <div>
            <span class="item3">姓名：</span>
            <el-input
              size="medium"
              v-model.trim="ruleForm.agentName"
              placeholder="请输入"
              class="item2"
              maxlength="30"
              show-word-limit
              clearable
            ></el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span class="item3">产品区域：</span>
            <el-cascader
              v-model="selectedOptions"
              class="item2"
              size="medium"
              :options="areaList"
              placeholder="请选择区域"
              @change="changeSetData"
              :props="{ checkStrictly: true }"
              clearable
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span class="item3">状态：</span>
            <el-select
              size="medium"
              v-model="ruleForm.agentStatus"
              placeholder="请选择"
              class="item2"
              clearable
            >
              <el-option
                v-for="item in options7"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right">
          <div>
            <el-button @click="empty" class="empty-button" type="text"
              >清空条件</el-button
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
      <el-row>
        <el-col :span="20">
          <span style="line-height: 70px; margin-left: 20px; color: #ff2525"
            >添加的经纪人信息会展示在安保网官网请谨慎添加，一个分支机构最少添加四位经纪人。</span
          >
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addBroker()"
            round
            size="medium"
            class="add-video"
            >添加经纪人</el-button
          >
        </el-col>
      </el-row>
      <div class="content-table">
        <el-table
          :data="brokerList"
          style="width: 100%; color: #000000"
          border
          :header-cell-style="getRowClass1"
        >
          <el-table-column label="经纪人信息" width="460">
            <template slot-scope="scope">
              <div style="display: flex">
                <div class="img-width">
                  <img :src="scope.row.imgUrl" alt="" />
                </div>
                <div class="col-black">
                  <p class="title-video">{{ scope.row.agentName }}</p>
                  <p class="mt10">标签：{{ scope.row.agentLabel }}</p>
                  <el-tooltip
                    class="tooltip"
                    :content="scope.row.agentSpeciality"
                    placement="top"
                  >
                    <p class="row-factor cursor">
                      擅长领域：{{ scope.row.agentSpeciality }}
                    </p>
                  </el-tooltip>
                  <p>邮箱：{{ scope.row.agentEmail }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="产品区域">
            <template slot-scope="scope">
              <p v-for="(item, index) in scope.row.areaName" :key="index">
                {{ item }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="创建时间/人员" prop="createByName">
            <template slot-scope="scope">
              <p>{{ scope.row.createTime }}</p>
              <p>{{ scope.row.createByName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="更新时间">
            <template slot-scope="scope">
              <p>{{ scope.row.updateTime }}</p>
              <p>{{ scope.row.updateByName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="66" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.statusFlag"
                active-color="#5677fc"
                @change="changeStatus(scope.row)"
                inactive-color="#a7a5a6"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="166" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                class="col-blue"
                @click="endit(scope.row)"
                >编辑</el-button
              >
              <span class="col-blue">|</span>
              <el-button
                size="mini"
                type="text"
                class="col-blue"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="fr mt20"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="ruleForm.pn"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="ruleForm.ps"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <AddBroker ref="AddBroker" :areaList="areaList"></AddBroker>
  </div>
</template>

<script>
import ResourcesService from "@/service/ResourcesService";
import videoService from "@/service/videoService";
import $apiUrl from "@/api/apiUrl";
import AddBroker from "./components/AddBroker";
import { elevator } from "../../server/accidenServer.js";
import BrokerServer from "@/service/brokerServer";
import PolicyService from "@/service/policyService";
export default {
  components: {
    AddBroker,
  },
  data() {
    return {
      ruleForm: {
        agentName: "",
        agentStatus: "",
        ps: 10,
        pn: 1,
        productArea: "",
        channelCode: "sequip",
      },
      selectedOptions: [],
      showFlag: false,
      areaList: [],
      rolShow: false, // 角色权限
      options7: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "01",
          label: "有效",
        },
        {
          value: "00",
          label: "无效",
        },
      ],
      mapArea: {},
      brokerList: [],
      total: 0,
      ResourcesService: new ResourcesService(),
      videoService: new videoService(),
      brokerServer: new BrokerServer(),
      Elevator: new elevator(),
      policyService: new PolicyService(),
    };
  },
  created() {
    this.roleData();
    this.getArea();
    this.getBrokerList();
  },
  methods: {
    roleData() {
      let branchCode = window.sessionStorage.getItem("branchCode");
      if (branchCode == "JT0000") {
        this.rolShow = true;
      }
    },
    async getArea() {
      //获取地区
      let res = await this.policyService.getAreaMap();
      if (res.code == "0000") {
        res.data["000000"] = "全国";
        this.mapArea = res.data;
      }
      if (!this.rolShow) {
        let area = window.sessionStorage.getItem("authDataArea");
        let areaArr = area.split(",");
        this.areaList = areaArr.map((item) => {
          for (const i in this.mapArea) {
            if (item == i) {
              return {
                label: this.mapArea[item],
                value: item,
              };
            }
          }
        });
      } else {
        let parmes = await this.Elevator.getAreas();
        if (parmes.code == "0000") {
          this.areaList = parmes.data;
          var areaObj = {
            // children:[],
            label: "全国",
            value: "000000",
          };
          this.areaList.unshift(areaObj);
        }
      }
    },
    searchview() {
      if (this.ruleForm.agentName && this.ruleForm.agentName.length > 30) {
        this.$message.error("姓名为1到30位");
        return false;
      }
      this.ruleForm.pn = 1;
      this.getBrokerList();
    },
    empty() {
      // 重置
      this.selectedOptions = [];
      this.ruleForm = {
        agentName: "",
        agentStatus: "",
        ps: 10,
        pn: 1,
        productArea: "",
        channelCode: "sequip",
      };
      this.getBrokerList();
    },
    async changeStatus(row) {
      row.statusFlag = row.agentStatus == "01" ? true : false; // 状态转换
      this.$confirm("是否修改状态？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.putStatus(row);
        })
        .catch(() => {
          this.$message.info("已取消删除！");
        });
    },
    async putStatus(row) {
      let obj = row;
      row.agentStatus == "01"
        ? (obj.agentStatus = "00")
        : row.agentStatus == "00"
        ? (obj.agentStatus = "01")
        : "";
      let res = await this.brokerServer.brokerPut(obj.id, obj);
      if (res.data.code == "0000") {
        this.$message.warning("更新成功");
        this.getBrokerList();
      } else {
        this.$message.error(res.data.msg);
      }
    },
    async getBrokerList() {
      // 获取列表
      let res = await this.brokerServer.brokerList(this.ruleForm);
      if (res.data.code == "0000") {
        res.data.list.forEach(async (item) => {
          item["areaName"] = [];
          item.imgUrl = `${$apiUrl.DOWNLOAD_FILE}?fileId=${item.coverPicture}&free=1`; // 图片回显
          item.statusFlag = item.agentStatus == "01" ? true : false; // 状态转换
          if (item.productArea != "000000") {
            let areaList = item.productArea.split(",");
            areaList.forEach((it) => {
              // 省市区编码转中文
              let areaObj = this.getAllAreaObj(it);
              let areaName1 = "";
              if (areaObj.area) {
                areaName1 = `${this.mapArea[areaObj.area2]},${
                  this.mapArea[areaObj.area1]
                },${this.mapArea[areaObj.area]}`;
              } else if (areaObj.area1) {
                areaName1 = `${this.mapArea[areaObj.area2]},${
                  this.mapArea[areaObj.area1]
                }`;
              } else {
                areaName1 = this.mapArea[areaObj.area2];
              }
              item.areaName.push(areaName1);
            });
          } else {
            item.areaName.push("全国");
          }
        });
        this.brokerList = res.data.list;
      }
      this.total = res.data.total;
    },
    getAllAreaObj(code) {
      let obj = {};
      //area 区编码
      //area1 市编码
      //area2 省编码
      if (code.substring(4, 6) != "00") {
        // 判断区编码
        obj.area2 = code.substring(0, 2) + "0000";
        obj.area1 = code.substring(0, 4) + "00";
        obj.area = code;
      } else if (code.substring(2, 4) != "00") {
        // 判断市编码
        obj.area2 = code.substring(0, 2) + "0000";
        obj.area1 = code.substring(0, 4) + "00";
      } else {
        // 省编码
        obj.area2 = code;
      }
      return obj;
    },
    async endit(row) {
      // 编辑
      let res = await this.brokerServer.getDetail(row.id);
      if (res.data.code == "0000") {
        let areaList = res.data.data.productArea.split(",");
        res.data.data["selectedOptions"] = [];
        areaList.forEach((item) => {
          res.data.data.selectedOptions.push(item);
        });
        this.$refs.AddBroker.dialogForm = res.data.data;
        this.$refs.AddBroker.imageUrl1 = `${$apiUrl.DOWNLOAD_FILE}?fileId=${res.data.data.coverPicture}&free=1`
        this.$refs.AddBroker.dialogForm.status =
          res.data.data.productArea == "000000" ? "00" : "01";
        this.$refs.AddBroker.dialogFormVisible = true;
        res.data.data.productArea == "000000"
          ? (this.$refs.AddBroker.dialogForm.productArea = "000000")
          : this.$refs.AddBroker.dialogForm.productArea;
      }
    },
    changeSetData(e) {
      // 省市区选中获取最后一级
      this.ruleForm.productArea = e[e.length - 1];
    },
    handleSizeChange(val) {
      this.ruleForm.ps = val;
      this.getBrokerList();
    },
    handleCurrentChange(val) {
      this.ruleForm.pn = val;
      this.getBrokerList();
    },
    getRowClass1({ row, column, rowIndex, columnIndex }) {
      //修改表头样式
      if (rowIndex == 0) {
        return "background: #f7f7f7;color:#101010;font-size:14px;font-weight:600;";
      } else {
        return "background: #fff";
      }
    },
    addBroker() {
      // 添加经纪人
      this.$refs.AddBroker.dialogFormVisible = true;
      this.$refs.AddBroker.dialogForm.status = this.rolShow ? "00" : "01";
      this.$refs.AddBroker.dialogForm.productArea = this.rolShow
        ? "000000"
        : "";
    },
    handleDelete(row) {
      this.$confirm("是否删除？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.deleteBroker(row);
        })
        .catch(() => {
          this.$message.info("已取消删除！");
        });
    },
    async deleteBroker(row) {
      let res = await this.brokerServer.brokerDel(row.id);
      if (res.data.code == "0000") {
        this.$message.success("删除成功！");
        this.getBrokerList();
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>

<style lang="less">
#brokerList {
  padding-bottom: 80px;
  box-sizing: border-box;
  margin: 0 20px;
  .elesearch {
    width: 100%;
    min-height: 100px;
    margin: 20px 0;
    background-color: #fff;
    padding: 20px 30px;
    box-sizing: border-box;
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
        .el-select__caret {
          color: #000000;
          font-weight: 700;
        }
      }
      .item2 {
        width: 60%;
      }
      .item3 {
        display: inline-block;
        width: 25%;
        text-align: right;
        font-size: 16px;
        color: #666666;
        margin-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: text-bottom;
      }
      .query-button {
        float: right;
        font-weight: 600;
        width: 100px;
        margin-left: 20px;
      }
      .empty-button {
        float: right;
        margin-left: 30px;
        color: #2491fc;
        font-weight: 500;
        text-decoration: underline;
      }
    }
  }
  .content {
    width: 100%;
    margin: 20px 0;
    background-color: #fff;
    box-sizing: border-box;
    .add-video {
      float: right;
      margin: 20px;
    }
    .el-button--warning {
      background-color: #ffe7ba;
    }
    .content-table {
      width: 100%;
      padding: 0 20px 76px;
      margin-bottom: 40px;
      box-sizing: border-box;
      .img-width {
        width: 282px;
        height: 165px;
        margin-right: 20px;
        img {
          width: 282px;
          height: 165px;
        }
      }
      .title-video {
        color: #000000;
        font-size: 16px;
        font-weight: bold;
      }
      .col-black {
        color: #101010;
      }
      .col-blue {
        color: #096dd9;
      }
      .table {
        width: 100%;
        border: 1px solid #f5f5f5;
        box-sizing: border-box;
      }
    }
  }
  .row-factor {
    width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cursor {
    cursor: pointer;
  }
}
</style>
