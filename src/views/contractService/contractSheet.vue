<template>
  <div id="recordSheet">
    <vHeader></vHeader>
    <Tags></Tags>
    <div class="content">
      <div class="top-title">
        <div class="title-name">
          <span
            >合同止期为 {{ project.year }}-{{
              project.startMonth.toString().padStart(2, 0)
            }}-01 至 {{ project.year }}-12-31</span
          >
          <span class="close" @click="closeTab">关闭当前页</span>
        </div>
        <div class="title-c">
          业务归属：<span>{{ project.branchName }}</span>
        </div>
      </div>
      <div class="screen-wrapper">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="inp-box">
              <span class="label-text">客户名称</span>
              <el-input
                class="www"
                v-model="condition.customerName"
                clearable
                placeholder="请输入客户名称"
              ></el-input>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="inp-box">
              <span class="label-text">合同编号</span>
              <el-input
                class="www"
                v-model="condition.contractNo"
                clearable
                placeholder="请输入合同编号"
              ></el-input>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="inp-box">
              <span class="label-text">客户经理</span>
              <el-select
                class="www"
                v-model="condition.managerCode"
                clearable
                placeholder="请选择客户经理"
              >
                <el-option
                  v-for="item in batchPersonList"
                  :key="item.userCode"
                  :label="item.linkmanName"
                  :value="item.userCode"
                ></el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="inp-box">
              <span class="label-text">合同止期</span>
              <el-date-picker
                v-model="condition.contractEndDateStart"
                type="date"
                class="w200"
                placeholder="开始日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
              <span style="margin: 0 8px"> 至 </span>
              <el-date-picker
                v-model="condition.contractEndDateEnd"
                type="date"
                class="w200"
                placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>

              <!-- <el-date-picker class="www" v-model="dateValue" type="daterange" clearable @change="dateChange" format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker> -->
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mt20">
          <el-col style="text-align: right; padding-right: 10px">
            <el-button
              class="clear"
              type="primary"
              round
              @click="clearCondition"
              >清空条件</el-button
            >
            <el-button class="submit" type="success" round @click="onSubmit"
              >查询</el-button
            >
          </el-col>
        </el-row>
      </div>
      <div class="screen-tab">
        <ul class="screen-tab-list">
          <li
            v-for="item in RenewalStatusEnum"
            :key="item.code"
            :class="{ active: condition.renewalStatus == item.code }"
            @click="onStatus(item.code)"
          >
            {{ item.msg }}
          </li>
        </ul>
      </div>
      <div class="table-wrapper">
        <div class="set-sccount-manager">
          <div @click="setManager('')">设置客户经理</div>
        </div>
        <el-table
          :data="tableData"
          border
          header-row-class-name="table-header"
          @selection-change="handleSelectionChange"
          :header-cell-style="getRowClass"
          style="width: 100%"
        >
          <!-- 保险期限/行业 -->
          <el-table-column type="selection" width="55"></el-table-column>

          <!-- 客户信息 -->
          <el-table-column
            align="left"
            prop="customerName"
            label="客户名称/委托合同信息"
          >
            <template slot-scope="scope">
              <div class="table-box">
                <div style="color: #096dd9; font-weight: 600">
                  {{ scope.row.customerName }}
                </div>
                <div>合同编号： {{ scope.row.contractNo }}</div>

                <div>
                  合同期间： {{ scope.row.contractStartDate }} 至
                  {{ scope.row.contractEndDate }}
                  <span
                    v-if="scope.row.renewalStatus == '2'"
                    style="
                      color: rgba(56, 158, 13, 1);
                      font-size: 14px;
                      font-weight: bold;
                      margin-left: 5px;
                    "
                  >
                    ( 已续约 )
                  </span>
                  <span
                    v-else
                    style="
                      color: rgba(255, 77, 79, 1);
                      font-size: 14px;
                      font-weight: bold;
                    "
                    >({{ estimate(scope.row.contractEndDate) }})</span
                  >
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 客户经理 -->
          <el-table-column
            width="200px"
            align="center"
            prop="managerName"
            label="客户经理"
          >
            <template slot-scope="scope">
              <div class="table-box">
                <div
                  v-if="
                    scope.row.managerName != '' && scope.row.managerName != null
                  "
                >
                  {{ scope.row.managerName }}
                  <br />
                  <span
                    style="
                      color: #fa8c16;
                      padding: 0 10px;
                      text-decoration: underline;
                      cursor: pointer;
                    "
                    @click="setManager(scope.row.id)"
                    >修改</span
                  >
                </div>
                <div
                  v-else
                  style="
                    color: #fa8c16;
                    text-decoration: underline;
                    cursor: pointer;
                  "
                  @click="setManager(scope.row.id)"
                >
                  设置
                </div>
                <div></div>
              </div>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            width="120px"
            align="center"
            prop="renewalStatus"
            label="状态"
          >
            <template slot-scope="scope">
              <div class="table-box">
                <div
                  :class="{
                    c000: scope.row.renewalStatus == '1',
                    c389E0D: scope.row.renewalStatus == '2',
                    cFF4D4F:
                      scope.row.renewalStatus == '3' ||
                      scope.row.renewalStatus == '4',
                  }"
                >
                  {{ scope.row.renewalStatusName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 合同跟踪情况-->

          <el-table-column align="left" prop="renewalPrem" label="合同跟踪情况">
            <template slot-scope="scope">
              <div v-if="scope.row.renewalStatus == 2">
                <div
                  style="
                    color: #101010;
                    font-size: 14px;
                    font-weight: bold;
                    line-height: 30px;
                  "
                >
                  客户名称：{{ scope.row.renewalCustomerName }}
                </div>
                <div
                  style="
                    color: #101010;
                    font-size: 14px;
                    font-weight: bold;
                    line-height: 30px;
                  "
                >
                  <!-- 合同期间：{{ scope.row.contractStartDate }}至{{
                    scope.row.contractEndDate
                  }} -->

                  合同期间：{{ scope.row.renewalContractStartDate }}至{{
                    scope.row.renewalContractEndDate
                  }}
                </div>
                <div
                  style="
                    color: #101010;
                    font-size: 14px;
                    font-weight: bold;
                    line-height: 30px;
                  "
                >
                  <!-- 合同编号：{{ scope.row.contractNo }} -->
                  合同编号：{{ scope.row.renewalContractNo }}
                </div>

                <!-- -------------- -->
                <!-- <div
                  style="
                    color: rgba(250, 140, 22, 1);
                    font-size: 14px;
                    font-weight: bold;
                    width: 28px;

                    border-bottom: 1px solid #fa8c16;
                  "
                  @click="editReason(scope.row)"
                >
                  修改
                </div> -->
              </div>
              <div
                v-else-if="scope.row.renewalStatus == 1"
                @click="
                  follow(
                    scope.row.customerName,
                    scope.row.id,
                    scope.row.managerCode,
                    scope.row.managerName
                  )
                "
                style="
                  border: 1px solid rgba(250, 140, 22, 1);
                  width: 92px;
                  height: 26px;
                  border-radius: 18px;
                  color: rgba(250, 140, 22, 1);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                跟进续约
              </div>
              <div v-else>
                <div
                  style="
                    color: #f5222d;
                    font-size: 14px;
                    font-weight: bold;
                    line-height: 30px;
                  "
                >
                  原因：{{ scope.row.firstReasonName }}
                  <span v-if="scope.row.secondReasonName">/</span>
                  {{ scope.row.secondReasonName }}
                </div>
                <div
                  style="
                    color: #101010;
                    font-size: 14px;
                    font-weight: bold;
                    line-height: 30px;
                  "
                >
                  跟踪情况：{{ scope.row.trackInfo }}
                </div>
                <div
                  style="
                    color: rgba(250, 140, 22, 1);
                    font-size: 14px;
                    font-weight: bold;
                    width: 28px;

                    border-bottom: 1px solid #fa8c16;
                  "
                  @click="editReason(scope.row)"
                >
                  修改
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column width="100px" align="center" label="操作">
            <template slot-scope="scope">
              <div class="table-box">
                <div
                  style="color: #ffa940; cursor: pointer"
                  @click="checkDetail(scope.row.id)"
                >
                  查看
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="fixed-BasePagenations">
      <div>
        查询结果：共 {{ tolnum }} 条记录

        <span style="margin: 0 8px" v-if="tolnum != 0">|</span>
        <span
          style="color: #1890ff; cursor: pointer"
          @click="onExport"
          v-if="tolnum != 0"
          ><i class="el-icon-download"></i>批量导出</span
        >
      </div>
      <BasePagenations
        :tolnum="tolnum"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></BasePagenations>
    </div>
    <el-dialog
      :class="{ 'dialog-active': tag == 'detail' }"
      :title="dislogTitle"
      :visible.sync="dialogVisible"
      width="805px"
      :before-close="handleClose"
    >
      <div>
        <!-- 跟进续保情况 -->
        <!-- @onCancel="dialogVisible=false" -->
        <Situation
          v-if="tag == 'follow'"
          :reasonWxEnum="reasonWxEnum"
          @sitCancel="sitCancel"
          :show="dialogVisible"
          :params="followObj"
          :typeList="RenewalStatusEnum"
          @onSubmit="fFn"
        />
        <!-- 详情页 -->
        <Detail v-if="tag == 'detail'" :detail="detail" />
        <!-- 设置客户经理 -->
        <SetKhJl
          v-if="tag == 'set'"
          :list="this.batchPersonList"
          :parameter="parameter"
          :show="dialogVisible"
          @onCancel="dialogVisible = false"
          @onSubmit="onSetKhJl"
        ></SetKhJl>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vHeader from "@/components/common/Header";
import Tags from "@/components/common/TagsNew";
import PolicyentryService from "@/service/PolicyentryService";
import BasePagenations from "@/components/common/Base/BasePagenations.vue";
import SetKhJl from "./components/SetKhJl.vue";
import Detail from "./components/Detail.vue";
import Situation from "./components/Situation.vue";
import MarketManage from "@/service/marketManage.js";
import RenewalService from "@/service/renewalService.js";
import UserManage from "@/service/userManage.js";
import templateBaoWen from "@/util/customTemplate.js";
import correctionManagement from "@/service/CorrectionManagement";
import templateService from "@/service/template.js";
import statisticalStatement from "@/service/StatisticService.js";
export default {
  components: {
    vHeader,
    Tags,
    BasePagenations,
    SetKhJl,
    Detail,
    Situation,
  },
  data() {
    return {
      templateService: new templateService(),
      StaticData: new statisticalStatement(),
      CorrectionManagement: new correctionManagement(),
      policyentryService: new PolicyentryService(),
      renewalService: new RenewalService(),
      marketManage: new MarketManage(),
      userManage: new UserManage(),
      dislogTitle: "设置",
      dialogVisible: false,
      dialogVisible_xb: false, //跟进续保情况
      tag: "",
      locationValue: "",
      dateValue: "", // 保险止期控件
      industryValue: "", // 行业
      areaList: [], // 地区列表
      tableData: [],
      tolnum: 0,
      selection: [],
      branchCode: "", // 分支机构编码
      batchPersonList: [], // 分支机构人员
      batchPersonLists: [],
      projectCode: "", // 项目编码
      condition: {
        // 列表查询条件
        orderby: "",
        pn: 1,
        ps: 10,
        branchCode: "", //分支机构编码
        branchName: "", //分支机构名称

        contractEndDateStart: "", //合同止期开始时间
        contractEndDateEnd: "", //合同止期结束时间

        contractNo: "", //客户合同编号
        customerName: "", //客户名称
        desc: "", //是否为倒序
        managerCode: "", //客户经理编码
        renewalStatus: "", //续约状态 1-待跟进、2-已续约、3-流失、4-未续
      },
      renewalTrackId: "",
      detail: {},
      parameter: {
        branchCode: "",
        ids: [],
        managerCode: "",
        managerName: "",
      },
      ids: [], // 产品id 集合
      bId: "",
      companyAreaList: [], // 公司归属地
      RenewalStatusEnum: [],
      IndustryTypeEnum: [],
      reasonWxEnum: [], // 未续原因枚举
      followObj: {
        id: "",
        customerName: "", //客户名称
      }, // 跟进续保 主键
      areaLists: [],
      height: null,
      currentYear: "",
      getdatetime: [], //服务器时间
    };
  },
  created() {
    this.initialization();
  },
  mounted() {
    let innerHeight = window.innerHeight;
    let headerHeight = document.querySelector(".header").offsetHeight;
    let tagsHeight = document.querySelector(".tags").offsetHeight;
    let topHeight = document.querySelector(".top-title").offsetHeight;
    let screenHeight = document.querySelector(".screen-wrapper").offsetHeight;
    let managerHeight = document.querySelector(
      ".set-sccount-manager"
    ).offsetHeight;
    this.height =
      innerHeight -
      (headerHeight + tagsHeight + topHeight + screenHeight + managerHeight) -
      120;
  },
  watch: {
    ids(newValue) {
      this.parameter.ids = [...newValue];
    },
    dialogVisible(newValue) {
      if (!newValue) {
        if (this.parameter.ids.length != 0 && this.bId != "") {
          let _idx = this.parameter.ids.findIndex((item) => item == this.bId);
          _idx != -1 ? this.parameter.ids.splice(_idx, 1) : this.parameter.ids;
        }
      }
    },
  },
  methods: {
    sitCancel() {
      this.dialogVisible = false;
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#E6F7FF;color: #000;";
      } else {
        return "";
      }
    },
    // 初始化
    initialization() {
      this.project = JSON.parse(
        window.sessionStorage.getItem("projectItem_xy") || "{}"
      );

      this.condition.contractEndDateStart =
        this.project.year + "-01-01 00:00:00";
      this.condition.contractEndDateEnd = this.project.year + "-12-31 23:59:59";

      this.renewalCondition(); //tab列表
      this.branchCode = this.project.branchCode;
      this.condition.branchName = this.project.branchName;
      this.condition.branchCode = this.project.branchCode;
      this.RenewalStatusEnum.unshift({
        code: "",
        msg: "全部",
      });
      this.batchPerson();

      this.renewalTracks();
      this.getLsWxReason();
    },
    // 查看详情
    checkDetail(val) {
      this.renewalTrackId = val;
      this.tag = "detail";
      this.dislogTitle = "续约详情";
      this.dialogVisible = true;
      this.renewalTrack();
    },
    onStatus(code) {
      this.condition.renewalStatus = code;
      this.renewalTracks();
    },
    // 设置客户经理
    onSetKhJl() {
      this.dialogVisible = false;
      this.renewalTracks();

      // this.renewalConditionPro(
      //   this.project.projectCode,
      //   this.project.year,
      //   this.project.branchCode
      // ); 获取已设置客户经理
    },
    // 跟进续保
    follow(customerName, id, managerCode, managerName) {
      this.tag = "follow";
      this.followObj.id = id;
      this.followObj.customerName = customerName;
      this.followObj.managerCode = managerCode;
      this.followObj.managerName = managerName;
      this.dialogVisible = true;
      this.followObj.renewalStatus = "";
      this.followObj.reasonWxEnumArary = [];
      this.followObj.trackInfo = "";
    },
    // 设置客户经理
    setManager(id) {
      if (id != "") {
        this.bId = id;
        if (this.ids.length != 0) {
        } else {
          this.parameter.ids = [id];
        }
      }else{
        if (this.parameter.ids.length==0) {
          this.$message.error("请选择客户列表");
          return
        }
      }

      this.tag = "set";
      this.dialogVisible = true;
    },
    // 修改客户跟踪情况 TODO
    editReason(val) {
      this.tag = "follow";
      this.followObj.id = val.id;
      this.followObj.customerName = val.customerName;
      this.followObj.managerCode = val.managerCode;
      this.followObj.managerName = val.managerName;
      this.dialogVisible = true;
      if (val.renewalStatus == "3") {
        this.followObj.renewalStatus = val.renewalStatus;
        this.followObj.reasonWxEnumArary = [
          val.firstReasonCode,
          val.secondReasonCode,
        ];
        this.followObj.trackInfo = val.trackInfo;
      }

      if (val.renewalStatus == "4") {
        this.followObj.renewalStatus = val.renewalStatus;
        this.followObj.reasonWxEnumArary = [val.firstReasonCode];
        this.followObj.trackInfo = val.trackInfo;
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    fFn() {
      this.dialogVisible = false;
      this.renewalTracks();
    },
    // 清空条件数据
    clearCondition() {
      this.condition = {
        orderby: "",
        pn: 1,
        ps: 10,

        branchCode: "", //分支机构编码
        branchName: "", //分支机构名称
        contractEndDateStart: "", //合同止期开始时间
        contractEndDateEnd: "", //合同止期结束时间
        contractNo: "", //客户合同编号
        customerName: "", //客户名称
        desc: "", //是否为倒序
        managerCode: "", //客户经理编码
        renewalStatus: "", //续约状态 1-待跟进、2-已续约、3-流失、4-未续
      };
      this.locationValue = "";
      this.dateValue = "";
      this.condition.branchCode = this.project.branchCode;
      this.condition.branchName = this.project.branchName;
      this.condition.contractEndDateStart =
        this.project.year + "-01-01 00:00:00";
      this.condition.contractEndDateEnd = this.project.year + "-12-31 23:59:59";
      this.renewalTracks();
    },
    // 根据条件查询
    onSubmit() {
      this.renewalTracks();
    },
    // 地区节点发生变化
    locationCascaderChange(value) {
      this.condition.provinceCode = value[0];
      this.condition.cityCode = value[1];
      value[2] != undefined
        ? (this.condition.areaCode = value[2])
        : (this.condition.areaCode = "");
    },
    // 日期节点发生变化
    dateChange(date) {
      if (date != null) {
        this.condition.polEndDateStart = this.formatTime(date[0], "s");
        this.condition.polEndDateEnd = this.formatTime(date[1], "e");
      } else {
        this.condition.polEndDateStart = "";
        this.condition.polEndDateEnd = "";
      }
    },
    // 选中数据
    handleSelectionChange(list) {
      this.ids = [];
      list.forEach((item) => this.ids.push(item.id));
    },
    // 分页切换函数
    handleCurrentChange(value) {
      this.condition.pn = value;
      this.renewalTracks();
    },
    // 切换每页多少条函数
    handleSizeChange(value) {
      this.condition.ps = value;
      this.renewalTracks();
    },
    // 关闭当前页面
    closeTab() {
      window.close();
    },
    async getLsWxReason() {
      let res = await this.renewalService.getLsWxReason();
      if (res.data.code == "0000") {
        this.reasonWxEnum = res.data.data.children;
      }
    },
    // 保单追踪查询条件
    async renewalCondition() {
      let {
        data: {
          code,
          data: { renewalBranches, years, renewalStatusEnums },
        },
      } = await this.renewalService.findContractTrackCondition();
      if (code == "0000") {
        this.RenewalStatusEnum = renewalStatusEnums;
        this.RenewalStatusEnum.unshift({
          code: "",
          msg: "全部",
        });
      }
    },
    // 获取地区列表
    async getArea() {
      let { code, data } = await this.policyentryService.getArea(1);
      if (code == "0000") {
        this.areaLists = data;
        let list = JSON.parse(JSON.stringify(data));
        let newArr = [];
        this.companyAreaList.forEach((item) => {
          let newList = list.filter((items) => items.value == item);
          newArr.push(...newList);
        });
        this.areaList = newArr;
      }
    },
    // 查询分支机构人员
    async batchPerson() {
      let obj = { jtBranchCode: this.branchCode, pageSize: 100, pageNum: 1 };
      let {
        data: { code, list },
      } = await this.marketManage.batchPerson(obj);
      if (code == "0000") {
        this.batchPersonList = list;
      }
    },
    // 查询保单追踪列表
    async renewalTracks() {
      let {
        data: { code, list, total },
      } = await this.renewalService.renewalContractList(this.condition);
      if (code == "0000") {
        this.getdatetimeFu();
        this.tableData = list;
        this.tolnum = total;

        // let areaList = Object.entries(JSON.parse(window.sessionStorage.getItem("commonArea2")));
        let newArr = this.tableData.map((item) => {
          return {
            ...item,
            polEndDate: item.polEndDate.split(" ")[0],
            sum:
              item.renewalStatus == 200
                ? (item.renewalPrem - item.afterPrem).toFixed(2) + ""
                : "",
          };
        });
        this.tableData = newArr.map((item) => {
          return {
            ...item,
          };
        });
      }
    },
    // 获取地区名称
    getAreaName(areaList, code) {
      return areaList.filter((item) => item[0] == code)[0];
    },
    // 查询保单追踪向信息
    async renewalTrack() {
      let {
        data: { code, data },
      } = await this.renewalService.renewalContractDetails(this.renewalTrackId);
      if (code == "0000") {
        this.detail = data;
      }
    },
    // 产品地区查询条件
    async productCondition() {
      let {
        data: { code, data },
      } = await this.renewalService.productCondition(
        this.condition.projectCode,
        this.condition.branchCode
      );
      if (code == "0000") {
        this.companyAreaList = data;
      }
    },
    // 获取枚举类
    async getEnum() {
      let { code, data } = await this.userManage.getEnum();
      if (code == "0000") {
        this.RenewalStatusEnum = data.RenewalStatusEnum;
        this.RenewalStatusEnum.unshift({
          code: "",
          label: "全部",
          strCode: "",
        });
      }
    },
    // 导出保单追踪列表
    async onExport() {
      let c = JSON.parse(JSON.stringify(this.condition));
      c.ps = this.tolnum;

      if (
        c.contractEndDateStart == "" ||
        c.contractEndDateStart == null ||
        c.contractEndDateStart == undefined
      ) {
        this.$message.error("请选择开始时间");
        return;
      }
      let { data } = await this.renewalService.download(c);
      let blob = new Blob([data], { type: "application/vnd.ms-excel" });
      const fileName = `${new Date().valueOf()}.xls`;
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    },
    // 格式化时间
    formatTime(d, type) {
      let date = new Date(d);
      let time =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        date.getDate().toString().padStart(2, "0");
      return type == "s"
        ? (time += " 00:00:00")
        : type == "e"
        ? (time += " 23:59:59")
        : "";
    },
    async downloadCheck(row) {
      let renewalCaseDetails = await this.renewalCaseDetails(row);
      let standingBook = await this.getLedger(row);
      let policyDetails = await this.getPolicyDetail(row);
      let templateBaoWen1 = new templateBaoWen();
      let obj = templateBaoWen1.renewalRecommendation(
        standingBook,
        policyDetails,
        renewalCaseDetails
      );
      let res = await this.templateService.templatePreview(
        obj,
        "MB-1646637704463",
        `${obj.holderName}公司${obj.year}年度安全生产责任保险续保建议书`
      );
    },
    // 获取保单详情
    async getPolicyDetail(row) {
      let data = { policyNo: row.policyNo };
      const res = await this.CorrectionManagement.policydetails(data);
      if (res.code === "0000") {
        let { riskName } =
          res.data.riskList.find((item) => item.riskFlag2 == "M") || {};
        let addRiskNames = res.data.riskList
          .filter((item) => item.riskFlag2 == "A")
          .map((item) => {
            return { addRiskName: item.riskName };
          });
        let obj = {
          holderName: row.holderName,
          mainRiskName: riskName,
          addRiskNames: addRiskNames,
          customerLevel: this.getUserStart(row.afterPrem),
        };
        return obj;
      }
    },
    // 获取台账的保单信息
    async getLedger(row) {
      var params = {
        policyNo: row.policyNo,
        pn: 1, // 页数
        ps: 10, // 每页显示大小
      };
      let res = await this.StaticData.getLedger(params);
      if (res.data.code === "0000") {
        return res.data.list[0];
      }
    },
    // 续保建议书获取案件信息
    async renewalCaseDetails(row) {
      var params = {
        policyNo: row.policyNo,
        pn: 1, // 页数
        ps: 10, // 每页显示大小
      };
      let res = await this.renewalService.renewalCaseDetails(params);
      if (res.data.code === "0000") {
        return res.data.data;
      }
    },
    // 获取用户星级
    getUserStart(prem) {
      let start;
      if (prem >= 300000) {
        start = 5;
      } else if (prem >= 70000 && prem < 300000) {
        start = 4;
      } else if (prem >= 20000 && prem < 70000) {
        start = 3;
      } else if (prem >= 5000 && prem < 20000) {
        start = 2;
      } else if (prem < 5000) {
        start = 1;
      }
      return start;
    },

    estimate(overDate) {
      // var date = new Date();
      // var year = date.getFullYear(); //获取完整的年份(4位)
      // var month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)

      var date = this.getdatetime; //服务器时间
      var year = date.year;
      var month = date.mouth;
      var day = date.day;

      var year1 = overDate.split("-")[0];
      var month1 = overDate.split("-")[1];
      var month2 = overDate.split("-")[2];
      var data = month1 - month;

      // 服务器时间>剩余时间  超期未续
      if (year1 < year) {
        return " 超期未续 "; //超期未续
      } else if (year == year1 && data < 0) {
        return " 超期未续 "; //超期未续
      } else if (year == year1 && data == 0 && day > month2) {
        return " 超期未续 "; //当月到期
      } else if (year == year1 && data == 0) {
        return " 当月到期 "; //当月到期
      } else if (year == year1 && data > 0 && data < 3) {
        return " 还有" + (month1 - month) + "月 ";
      } else {
        return " 三个月以上 ";
      }
    },
    //获取服务器时间
    async getdatetimeFu() {
      const res = await this.StaticData.getdatetime();
      if (res.code == "0000") {
        this.getdatetime = res.data;
      }
    },
  },
};
</script>

<style lang="less">
#recordSheet {
  max-height: 100%;
  overflow: scroll;
  .dialog-active .el-dialog__body {
    padding-top: 0;
  }
  .content {
    padding: 0 23px;
    .top-title {
      box-sizing: border-box;
      width: 100%;
      padding: 16px 0;
      padding-left: 35px;
      background: #fff;
      .title-name {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 600;
      }
      .close {
        font-size: 14px;
        color: #1890ff;
        margin-left: 20px;
        font-weight: normal;
        cursor: pointer;
        text-decoration: underline;
      }
      .title-c {
        margin-top: 10px;
      }
    }
    .screen-wrapper {
      padding: 16px 35px;
      margin-top: 12px;
      background: #fff;
    }
  }
  .screen-tab {
    width: 100%;
    height: 48px;
    line-height: 50px;
    margin-top: 12px;
    background: #fff;
    border-bottom: 2px solid #bfbfbf;
    .screen-tab-list {
      display: flex;
      align-items: center;
      li {
        position: relative;
        padding: 0 30px;
        font-size: 16px;
        cursor: pointer;
      }
      li.active {
        color: #fa8c16;
      }
      li.active:before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: #fa8c16;
      }
    }
  }
  .table-wrapper {
    margin-top: 12px;
    padding: 0 11px;
    padding-bottom: 120px;
    background: #fff;
  }
  .set-sccount-manager {
    box-sizing: border-box;
    display: flex;
    flex-direction: row-reverse;
    padding: 17px 16px;
    cursor: pointer;
    div {
      padding: 8px 25px;
      color: #fff;
      border-radius: 19px;
      background: #1890ff;
    }
  }
  .table-header {
    th.el-table__cell {
      color: #0050b3;
      font-weight: normal;
      background: #e6f7ff;
    }
  }
  .fixed-BasePagenations {
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0px 26px;
    background: #e6f7ff;
    z-index: 99;
    .pagination {
      margin: 13px 0;
    }
  }
  .clear {
    color: #000;
    border-color: #e9e9e9;
    background-color: #e9e9e9;
  }
  .table-tag {
    font-size: 12px;
    padding: 2px 14px;
    border-radius: 13px;
    background: #ffe7ba;
  }
  .submit {
    color: #fff;
    border-color: #ffa940;
    background-color: #ffa940;
  }
  .label-text {
    box-sizing: border-box;
    width: 100px;
    text-align: right;
    padding-right: 20px;
  }
  .inp-box {
    display: flex;
    align-items: center;
  }
  .www {
    width: 340px;
  }

  .c389E0D {
    color: #389e0d;
  }

  .cFF4D4F {
    color: #f5222d;
    font-weight: bold;
  }
  .c000 {
    color: #000;
  }
  .cFFA940 {
    color: #ffa940;
  }
}
</style>