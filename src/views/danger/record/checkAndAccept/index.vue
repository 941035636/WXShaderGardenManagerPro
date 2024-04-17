<template>
  <div>
    <div class="elsearch">
      <el-row class="row-bg" style="margin-bottom: 20px">
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">排查人：</span>
            <el-input
              v-model="ruleForm.createName"
              size="small"
              maxlength="50"
              placeholder="请输入排查人姓名"
              class="w300"
              clearable
            />
          </div>
        </el-col>

        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">排查日期：</span>
            <el-date-picker
              v-model="dateArray"
              class="w350"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-col>
      </el-row>

      <div class="ml20 text-center">
        <el-button class="ml20" type="primary" shape="round" @click="seach">
          查询
        </el-button>

        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="mt8" style="padding: 30px">
      <div class="numberOfBranches">
        <div>共{{ total }}条记录</div>
        <div class="buttonClass" style="cursor: pointer" @click="addPolicy">导出</div>
      </div>
      <el-table
        :data="tableList"
        border
        header-row-class-name="headName"
        :header-cell-style="getRowClass"
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column label="排查标准" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.checkStandard ? scope.row.checkStandard : "-" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="排查日期" min-width="50" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.updateTime ? scope.row.updateTime : "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="排查人" min-width="50" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.updateName ? scope.row.updateName : "" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否合格" min-width="50" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.isPass == 1" style="color: #3a9e1e">合格</div>
            <div v-else style="color: #f12530">不合格</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getSysDate } from "@/api/userManagement";
import {
  excepTroubleshootingRecordsDetail,
  troubleshootingRecordsDetail, //获取排查记录详情
  dictTrue, //获取清单
} from "@/api/listManage";

export default {
  data() {
    return {
      ruleForm: {
        createTimeBe: "", //排查日期开始
        createTimeLa: "", //排查日期结束
        createName: "", //排查人
        pn: 1,
        ps: 10,
        desc: false, //是否倒叙
      },
      // 时间数组
      dateArray: [],

      tableList: [],
      total: 0,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    examineClick(e) {
      console.log(e, "000000");
      this.$router.push({
        name: "particulars",
      });
    },
    changeIns() {
      // console.log(this.ruleForm.companyIndystryIds)
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#f5f5f5;text-align:center;";
      } else {
        return "";
      }
    },
    tapClick(e) {
      this.tapPitchOn = e.key;
    },

    // 初始化
    async initData() {
      // 部门集合
      this.departmentList = [];
      // 岗位集合
      this.position = [];
      await this.getDictTrue();
      await this.getList();
    },
    async getDictTrue() {
      let res = await dictTrue("50003");
      if (res.code == "0000") {
        res.data.forEach((obj) => {
          obj.name = obj.itemText; // 添加新属性名
          obj.code = obj.itemValue; // 添加新属性名
          delete obj.itemText; // 删除旧属性名
          delete obj.itemValue; // 删除旧属性名
        });
        this.checkList = JSON.parse(JSON.stringify(res.data));
      }
    },

    // 查询
    seach() {
      this.ruleForm.pn = 1;
      this.ruleForm.ps = 10;
      this.getList();
    },
    // 重置
    reset() {
      this.ruleForm = {
        createTimeBe: "", //排查日期开始
        createTimeLa: "", //排查日期结束
        createName: "", //排查人
        pn: 1,
        ps: 10,
        desc: false, //是否倒叙
      };
      // 时间数组
      this.dateArray = [];
      this.getList();
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn;
      this.getList();
    },

    async getList() {
      let form = { ...this.ruleForm };
      form.standardId = this.$route.query.standardId;
      if (this.dateArray) {
        form.createTimeBe =
          this.dateArray && this.dateArray[0] ? this.dateArray[0] + " 00:00:00" : "";
        form.createTimeLa =
          this.dateArray && this.dateArray[1] ? this.dateArray[1] + " 23:59:59" : "";
      }
      let res = await troubleshootingRecordsDetail(form);
      if (res.code === "0000") {
        if (res.data) {
          res.data.records.forEach((item, index) => {
            item.frequencyName = this.checkList.find(
              (item1) => item1.code == item.frequency
            )
              ? this.checkList.find((item1) => item1.code == item.frequency).name
              : item.frequency;
          });

          this.tableList = res.data.records;
          this.total = res.data.total;
        } else {
          this.tableList = [];
          this.total = res.data.total || 0;
        }
      }
    },

    async addPolicy() {
      //导出
      let resT = await getSysDate();
      let date = null;
      if (resT.code === "0000") {
        date = resT.data;
      } else {
        this.$baseMessage("获取服务器时间失败，已改为获取系统时间", "error");
        let newDate = new Date();
        date = newDate.toLocaleString();
      }

      let form = { ...this.ruleForm };
      form.standardId = this.$route.query.standardId;
      if (this.dateArray) {
        form.createTimeBe =
          this.dateArray && this.dateArray[0] ? this.dateArray[0] + " 00:00:00" : "";
        form.createTimeLa =
          this.dateArray && this.dateArray[1] ? this.dateArray[1] + " 23:59:59" : "";
      }
      form.ps = this.total;
      let res = await excepTroubleshootingRecordsDetail(form);
      let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
      // const fileName = `排查记录数据${date}.xls`;
      const fileName = getFileName(res.headers["content-disposition"]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      // link.href = res.data
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);

      function getFileName(str) {
        // 获取等于下标
        let fileName = str.substr(str.indexOf("=") + 1, str.length);
        return decodeURIComponent(fileName); //从第一个字符开始截取
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.numberOfBranches {
  display: flex;
  align-items: center;
  height: 60px;
}
.examineClass {
  color: #1990ff;
}

.buttonClass {
  background-color: #ffa940;
  width: 85px;
  height: 35px;
  border-radius: 19px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  color: #fff;
  font-weight: 500;
}
</style>
