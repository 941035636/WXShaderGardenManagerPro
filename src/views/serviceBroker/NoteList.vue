<template>
  <div id="NoteList">
    <div class="content">
      <el-row>
        <el-col :span="14">
          <p>
            您有{{
              total
            }}条预约咨询，请尽快联系用户！若您已处理，请关闭处理状态
          </p>
        </el-col>
        <el-col :span="10" style="text-align: right">
          <el-button
            type="primary"
            round
            size="medium"
            :class="{'btn1':ruleForm.appointmentStatus == '00','btn':ruleForm.appointmentStatus == '01'}"
            @click="puyState('00')"
            >待处理</el-button
          >
          <el-button
            type="primary"
            round
            size="medium"
            :class="{'btn1':ruleForm.appointmentStatus == '01','btn':ruleForm.appointmentStatus == '00'}"
            @click="puyState('01')"
            >已处理</el-button
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
          <el-table-column
            label="预约电话"
            prop="agentPhone"
            min-width="70"
          ></el-table-column>
          <el-table-column
            label="预约内容"
            prop="appointmentContent"
            min-width="140"
          >
            <template slot-scope="scope">
              <el-tooltip
                class="tooltip"
                :content="scope.row.appointmentContent"
                placement="top"
              >
                <p class="row-factor cursor">
                  {{ scope.row.appointmentContent }}
                </p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="预约时间"
            prop="appointmentTime"
          ></el-table-column>
          <el-table-column label="产品区域" prop="updateTime">
            <template slot-scope="scope">
              <p v-for="(item, index) in scope.row.areaName" :key="index">
                {{ item }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="分支机构"
            prop="jtBranchName"
          ></el-table-column>
          <el-table-column label="预约经纪信息">
            <template slot-scope="scope">
              <p>{{ scope.row.agentName }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="状态（打开待处理，关闭已处理）"
            min-width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.statusFlag"
                :disabled="!scope.row.statusFlag"
                active-color="#5677fc"
                @change="changeStatus(scope.row)"
                inactive-color="#a7a5a6"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div style="text-align:right">
          <el-button type="primary" round size="medium" class="btn1" @click="noDialog">稍后查看</el-button>
        </div> -->
        <el-pagination
          class="fr mt20"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="ruleForm.pn"
          :page-sizes="[5, 10, 20, 30, 40]"
          :page-size="ruleForm.ps"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- <button type="submit" @click="buttonClick">测试一下</button> -->
  </div>
</template>
<script>
import BrokerServer from "@/service/brokerServer";
import CorrectionManagement from "@/service/CorrectionManagement.js";
import policyService from "@/service/policyService.js";
import MiddleUtil from "../../util/MiddleUtil.js"
export default {
  data() {
    return {
      brokerServer: new BrokerServer(),
      correctionManagement: new CorrectionManagement(),
      policyService: new policyService(),
      brokerList: [],
      branchList: [],
      mapArea: {},
      ruleForm: {
        ps: 5,
        pn: 1,
        appointmentStatus: "00",
        agentUserCode:sessionStorage.getItem("userCode"),
      },
      total: 0,
    };
  },
  created() {
    this.loadBranch();
    this.getArea();
    this.getInit();
  },
  methods: {
    //测试没啥用。
    // buttonClick(){
    //     MiddleUtil.$emit('demo','msg');
    // },
    async loadBranch() {
      let res = await this.correctionManagement.getBranchInfo();
      if (res.code == "0000") {
        // let branchCode = sessionStorage.getItem("branchCode");
          this.branchList = res.list;
        // if (branchCode != "JT0000") {
        //   this.branchList = res.list.filter(
        //     (item) => item.jtBranchCode == branchCode
        //   );
        // } else {
        //   this.branchList = res.list;
        // }
      }
    },
    async getArea() {
      //获取地区
      let res = await this.policyService.getAreaMap();
      if (res.code == "0000") {
        this.mapArea = res.data;
      }
      if (!this.rolShow) {
        let area = window.sessionStorage.getItem("authDataArea");
        let areaArr = area.split(",");
        this.areaList = areaArr.map((item) => {
          return {
            label: this.mapArea[item],
            value: item,
          };
        });
        console.log(this.areaList);
      } else {
        let parmes = await this.Elevator.getAreas();
        if (parmes.code == "0000") {
          this.areaList = parmes.data;
        }
      }
    },
    // changeStatus(row) {
    //   row.statusFlag = row.agentStatus == '01' ? true : false; // 状态转换
    //   this.$confirm('是否修改状态？', '确认信息', {
    // 		distinguishCancelAndClose: true,
    // 		confirmButtonText: '确定',
    // 		cancelButtonText: '取消'
    // 		})
    // 		.then(() => {
    // 			this.putStatus(row)
    // 		})
    // 		.catch(() => {
    // 			this.$message.info('已取消删除！')
    // 	});
    // },
    puyState(num) {
      this.ruleForm.appointmentStatus = num;
      this.getInit();
    },
    async changeStatus(row) {
      let res = await this.brokerServer.stateRecord(row.id);
      console.log(res);
      if (res.data.code == "0000") {
        this.$message.warning("更新成功");
        MiddleUtil.$emit('demo','msg');
        this.getInit();
      } else {
        this.$message.error(res.data.msg);
      }
    },
    async getInit() {
      let areaMap = JSON.parse(sessionStorage.getItem("commonArea2"));
      let res = await this.brokerServer.appointList(this.ruleForm);
      if (res.data.code == "0000") {
        console.log(res.data.list, "111111111");
        res.data.list.forEach(async (item) => {
          item["areaName"] = [];
          item.statusFlag = item.appointmentStatus == "01" ? false : true;
          item['jtBranchName']= this.branchList.find(it=> it.jtBranchCode == item.branchCode) ? this.branchList.find(it=> it.jtBranchCode == item.branchCode).jtBranchName : "";
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
        this.total = res.data.total;
      }
      // if (this.ruleForm.appointmentStatus == "00") {
      //   this.total = res.data.total;
      // }
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
    noDialog() {
      console.log(this.$parent.dialogVisible);
      this.$parent.dialogVisible = false;
    },
    handleSizeChange(val) {
      this.ruleForm.ps = val;
      this.getInit();
    },
    handleCurrentChange(val) {
      this.ruleForm.pn = val;
      this.getInit();
    },
    getRowClass1({ row, column, rowIndex, columnIndex }) {
      //修改表头样式
      if (rowIndex == 0) {
        return "background: #f7f7f7;color:#101010;font-size:14px;font-weight:600;";
      } else {
        return "background: #fff";
      }
    },
  },
};
</script>
<style lang="less">
#NoteList {
  .content {
    width: 100%;
    // margin: 20px 0;
    background-color: #fff;
    box-sizing: border-box;
    .content-table {
      width: 100%;
      // padding: 0 20px 76px;
      margin-bottom: 40px;
      box-sizing: border-box;
      .table {
        width: 100%;
        border: 1px solid #f5f5f5;
        box-sizing: border-box;
        .table-data {
          width: 100%;
          min-height: 180px;
          display: flex;
          .data-item {
            padding: 16px 20px;
            box-sizing: border-box;
            border-right: 1px solid #f1eee9;
            box-sizing: border-box;
          }
          .data-item:last-child {
            border-right: 0;
          }
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
    .btn {
      background: #efefef;
      border: 1px solid #efefef;
      color: #e99d42;
    }
    .btn1 {
      background: #fa8c16;
      color: #ffff;
      border: 1px solid #fa8c16;
    }
  }
}
</style>