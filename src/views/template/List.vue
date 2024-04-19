<template>
  <div id="batchList">
    <div class="elesearch" ref="elesearch">
      <el-row type="flex" class="row-bg" style="margin-bottom: 0">
        <el-col :span="7">
          <div style="display: flex">
            <span class="item3">模板名称</span>
            <el-input placeholder="请输入模板名称" v-model.trim="ruleForm.customName" class="item2" clearable></el-input>
          </div>
        </el-col>
        <el-col :span="7">
          <div style="display: flex">
            <span class="item3">模板编号</span>
            <el-input placeholder="请输入模板编号" v-model.trim="ruleForm.customCode" class="item2" clearable></el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="display: flex">
            <span class="item3">状态</span>
            <el-select v-model="ruleForm.status" placeholder="请选择" class="item2" clearable>
              <el-option v-for="item in insuredCompanList" :key="item.valueField" :label="item.label" :value="item.valueField"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="elesearch-btn">
            <span @click="empty" class="empty">清空条件</span>
            <span @click="search" class="query-button">查询</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content" style="background: #fff">
      <el-row>
        <el-col :span="10">
          <span>&nbsp;</span>
        </el-col>
        <el-col :span="14" style="text-align: right">
          <el-button type="primary" class="ml20" @click="add" round>添加模板</el-button>
        </el-col>
      </el-row>
      <el-table class="mt20" :data="batchList" :header-cell-style="getRowClass" border style="width: 100%">
        <el-table-column label="模板名称">
          <template slot-scope="scope">
            <span>{{ scope.row.customName }}</span>
            <!-- <span class="col-org cur-op" @click="clickPreview(scope.row)">预览</span> -->
          </template>
        </el-table-column>
        <el-table-column label="类型" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.customType == 1 ? "文件类型" : "代码类型" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customCode" label="模板编号"> </el-table-column>
        <el-table-column prop="address" width="150" align="center" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="changeStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column width="180" prop="updateTime" label="更新时间">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div style="padding: 15px 10px; box-sizing: border-box">
              <span class="col-org cur-op" @click="updateTemp(scope.row)">修改</span>
              <span class="col-org cur-op ml10 mr10" @click="tipsTemplate(scope.row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <BasePagenations :tolnum="total" :currentPage="ruleForm.pn" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" v-if="pageFlag" class="pr20"></BasePagenations>
    </div>
    <AddDialog ref="AddDialog" @successCb="getData" />
  </div>
</template>

<script>
import templateService from "@/service/template.js";
import AddDialog from "./AddDialog.vue";
export default {
  name: "BatchList",
  data() {
    return {
      template: new templateService(),
      insuredCompanList: [{
        label: "有效",
        valueField: "0",
      },
      {
        label: "无效",
         valueField: "1",
      },],
      ruleForm: {
        pn: 1,
        ps: 10,
        customCode: "",
        customName: "",
        customType: "",
        status: "",
        channelCode: "sequip",
      },
      batchList: [],
      total: 0,
      pageFlag: false,
    };
  },
  components: {
    AddDialog,
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      //获取用户权限接口
      let form = {
        pn: this.ruleForm.pn, // 页码
        ps: this.ruleForm.ps, // 大小
        orderby: this.ruleForm.orderby, // 排序字段
        desc: "", // 是否为倒序
        customCode: this.ruleForm.customCode, // 模板编码 MB- 开头后面跟时间戳保留14位
        customName: this.ruleForm.customName, // 模板名称
        customType: this.ruleForm.customType, // 模板类型 1-文件类型,2-代码类型
        status: this.ruleForm.status, //    模板状态 0-启用 1-停用
        channelCode: this.ruleForm.channelCode, // 渠道编码
      };
      let res = await this.template.templateList(form);
      if (res.data.code === "0000") {
        this.batchList = res.data.list.map((item) => {
          item.status = item.status === 0 ? true : false;
          return item;
        });
        this.total = res.data.total;
        if (this.batchList.length > 0) this.pageFlag = true;
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return rowIndex == 0 ? "background:#f5f5f5" : "";
    },
    search() {
      this.ruleForm.pn = 1;
      this.getData();
    },
    empty() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        cradUsr: "", // 社会信用代码
        batchType: "", // 批单类型
        branchCode: "", // 分支机构编码
        areas: [], // 地区编码,
        startDateStartTime: "", // 批单保险起期 开始时间
        startDateEndTime: "", // 批单保险起期 结束时间
        endorsementsNo: "", // 批单号
        applyNo: "", // 批单申请号
        channelCode: "sequip", // 渠道编码
      };
      this.getData();
    },
    goDetail(endorsementsNo) {
      // 查看详情
      let routeUrl = this.$router.resolve({
        path: "/BatchDetail",
        query: { endorsementsNo: endorsementsNo },
      });
      window.open(routeUrl.href, "_blank");
    },
    handleSizeChange(value) {
      this.ruleForm.ps = value;
      this.getData();
    },
    handleCurrentChange(value) {
      this.ruleForm.pn = value;
      this.getData();
    },
    // 变更状态事件
    async changeStatus(val) {
      let data = {
        channelCode: "sequip",
        content: val.content, // 相关配置内容
        createBy: val.createBy, // 创建人编码
        customCode: val.customCode, // 模板编码 MB- 开头后面跟时间戳保留14位
        customName: val.customName, // 模板名称 ,
        customType: val.customType, // : 模板类型 1-文件类型,2-代码类型 = ['1'],
        id: val.id, //
        isDelete: false, // 是否删除
        outType: val.outType, // 模板输出类型 ,
        status: val.status === true ? 0 : 1, // 模板状态 0-停用 1-启用 = ['0', '1']integerEnum:0, 1,
        updateBy: window.sessionStorage.getItem("userCode"), //  更新人编码
      };
      let res = await this.template.templateUpdate(data);
      if (res.data.code === "0000") {
        this.$message.success("变更成功");
      } else {
        val.status = !val.status;
      }
    },
    // 删除确认提示
    tipsTemplate(id) {
      this.$confirm("是否要确认删除，此模板", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteTemplate(id);
      }).catch(() => {
        this.$message({ type: "info", message: "已取消删除" });
      });
    },
    // 删除模板
    async deleteTemplate(id) {
      let res = await this.template.templateDelete(id);
      if (res.data.code === "0000") {
        this.$message.success("删除成功");
        this.getData();
      }
    },
    // 预览事件
    clickPreview(val) {
      this.$router.push({
        path: "/template/preview",
        query: {
          name: val.customName,
          id: val.customCode,
        },
      });
    },
    updateTemp(row) {
      this.$refs.AddDialog.openInit(row);
    },
    add() {
      this.$refs.AddDialog.openInit();
    },
  },
};
</script>

<style lang="less">
#batchList {
  padding: 0px 0px 10px;
  margin: 0px 20px 0 20px;
  box-sizing: border-box;
  .elesearch {
    width: 100%;
    margin: 0 0 20px 0;
    background-color: #fff;
    padding: 20px 30px;
    box-sizing: border-box;
    .row-bg {
      margin-bottom: 20px;
      line-height: 40px;
      .item1 {
        display: block;
        width: 10%;
        text-align: center;
      }
      .item2 {
        width: 70%;
      }
      .item3 {
        font-size: 14px;
        color: #666666;
        display: block;
        width: 25%;
        text-align: right;
        padding-right: 10px;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .item5 {
        width: 30%;
      }
    }
  }
  .elesearch-btn {
    width: 100%;
    height: 100%;
    text-align: right;
    color: #ffffff;
    .query-button {
      display: inline-block;
      width: 110px;
      height: 40px;
      background-color: #f3ac56;
      text-align: center;
      line-height: 40px;
      margin-left: 10px;
      color: #ffffff;
      font-weight: 600;
      cursor: pointer;
      border-radius: 60px;
    }
  }
  .no-data {
    width: 100%;
    height: 100%;
    line-height: 70px;
    font-size: 16px;
    color: #999;
    font-weight: 500;
    text-align: center;
  }
  .content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px 20px;
  }
  .empty {
    color: #1890ff;
    text-decoration: underline;
    margin-right: 15px;
    cursor: pointer;
  }
  .empty-button {
    display: inline-block;
    width: 80px;
    height: 40px;
    border: 1px solid #e9e9e9;
    text-align: center;
    line-height: 40px;
    color: #999;
    background-color: #e9e9e9;
    font-weight: 600;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 60px;
  }
  .item4 {
    display: block;
    width: 23%;
    margin-right: 10px;
  }
  .item2 {
    width: 60%;
  }
  .col-red {
    color: #f5222d;
  }
  .col-blue {
    color: #096dd9;
  }
  .col-org {
    color: #fa8c16;
  }
  .col-gre {
    color: #389e0d;
  }
  .col-grey {
    color: #919191;
  }
  .cur-op {
    cursor: pointer;
  }
}
</style>
