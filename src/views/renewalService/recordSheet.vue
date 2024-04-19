<template>
  <div id="recordSheet">
    <vHeader></vHeader>
    <Tags></Tags>
    <div class="content">
      <div class="top-title">
        <div class="title-name">
          <span>{{ project.year }}年：{{ project.projectName }}</span>
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
              <el-input class="www" v-model="condition.holderName" clearable placeholder="请输入客户名称"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="inp-box">
              <span class="label-text">保单号</span>
              <el-input class="www" v-model="condition.policyNo" clearable placeholder="请输入保单号"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="inp-box">
              <span class="label-text">客户经理</span>
              <el-select class="www" v-model="condition.managerCode" clearable placeholder="请选择客户经理">
                <el-option v-for="item in batchPersonLists" :key="item.managerCode" :label="item.managerName" :value="item.managerCode"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="inp-box">
              <span class="label-text">行业</span>
              <el-select class="www" clearable v-model="condition.industryCode" placeholder="请选择行业">
                <el-option v-for="item in IndustryTypeEnum" :key="item.industrCode" :label="item.industryName" :value="item.industrCode"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mt20">
          <el-col :span="6">
            <div class="inp-box">
              <span class="label-text">保险止期</span>
              <el-date-picker v-model="condition.polEndDateStart" type="date" class="w200" placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
              <span>至</span>
              <el-date-picker v-model="condition.polEndDateEnd" type="date" class="w200" placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
              <!-- <el-date-picker class="www" v-model="dateValue" type="daterange" clearable @change="dateChange" format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker> -->
            </div>
          </el-col>
          <el-col :span="6">
            <div class="inp-box">
              <span class="label-text">客户地区</span>
              <el-cascader class="www" clearable v-model="locationValue" :options="areaList" @change="locationCascaderChange"></el-cascader>
            </div>
          </el-col>
          <!-- <el-col :span="6">
            <div class="inp-box">
              <span class="label-text">客户地区</span>
              <el-select class="www" clearable v-model="condition.industryCode" placeholder="请选择行业">
                <el-option v-for="item in RenewalStatusEnum" :key="item.code" :label="item.msg" :value="item.code"></el-option>
              </el-select>
            </div>
          </el-col> -->
          <el-col :span="12" style="text-align: right; padding-right: 10px">
            <el-button class="clear" type="primary" round @click="clearCondition">清空条件</el-button>
            <el-button class="submit" type="success" round @click="onSubmit">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="screen-tab">
        <ul class="screen-tab-list">
          <li v-for="item in RenewalStatusEnum" :key="item.code" :class="{ active: condition.renewalStatus == item.code }" @click="onStatus(item.code)">{{ item.msg }}</li>
        </ul>
      </div>
      <div class="table-wrapper">
        <div class="set-sccount-manager">
          <div @click="setManager('')">设置客户经理</div>
        </div>
        <el-table :data="tableData" border header-row-class-name="table-header" @selection-change="handleSelectionChange" :header-cell-style="getRowClass" style="width: 100%">
          <!-- 保险期限/行业 -->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column width="130px" align="left" prop="date" label="保险止期/行业">
            <template slot-scope="scope">
              <div class="table-box">
                <div>{{ scope.row.polEndDate }}</div>
                <span class="table-tag" v-if="scope.row.industryName != null  && scope.row.industryName != ''">{{ scope.row.industryName }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 客户信息 -->
          <el-table-column align="left" prop="holderName" label="客户信息">
            <template slot-scope="scope">
              <div class="table-box">
                <div style="color: #096dd9; font-weight: 600">{{ scope.row.holderName }}</div>
                <div>{{ scope.row.provinceName }}<span v-if="scope.row.cityName != ''">/</span>{{ scope.row.cityName }}<span v-if="scope.row.areaName != ''">/</span>{{ scope.row.areaName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 客户经理 -->
          <el-table-column width="200px" align="center" prop="managerName" label="客户经理">
            <template slot-scope="scope">
              <div class="table-box">
                <div v-if="scope.row.managerName != '' && scope.row.managerName != null">{{ scope.row.managerName }}<span style="color: #fa8c16;padding: 0 10px;text-decoration: underline;cursor: pointer;" @click="setManager(scope.row.id)">修改</span></div>
                <div v-else style="color: #fa8c16;text-decoration: underline;cursor: pointer;" @click="setManager(scope.row.id)">设置</div>
                <div></div>
              </div>
            </template>
          </el-table-column>
          <!-- 保单号 -->
          <el-table-column align="left" prop="policyNo" label="保单号">
            <template slot-scope="scope">
              <div class="table-box">
                <div>{{ scope.row.policyNo }}</div>
                <div>联系人：{{ scope.row.contactName }}<span v-if="scope.row.contactNum != ''">/</span>{{ scope.row.contactNum }}</div>
              </div>
            </template>
          </el-table-column>
          <!-- 2021年保费 -->
          <el-table-column width="100px" align="right" prop="afterPrem" :label="project.year-1+'年保费'"></el-table-column>
          <el-table-column width="120px" align="center" prop="renewalStatus" label="状态">
            <template slot-scope="scope">
              <div class="table-box">
                <div :class="{ c389E0D: scope.row.renewalStatus == '200', c000: scope.row.renewalStatus == '100', cFF4D4F: scope.row.renewalStatus == '300'}">{{ scope.row.renewalStatusNewStr }}</div>
              </div>
            </template>
          </el-table-column>
          <!-- 2022年保费/客户跟踪情况 -->
          <el-table-column align="left" prop="renewalPrem" :label="project.year+'年保费/客户跟踪情况'">
            <template slot-scope="scope">
              <div class="table-box" v-if="scope.row.renewalStatus !== 100">
                <div v-if="scope.row.renewalStatus == 200" style="color: #FF4D4F" ><span v-if="scope.row.renewalStatus == 200">￥</span>{{ scope.row.renewalPrem || '0'}}<span v-if="scope.row.renewalStatus == '200'" style="color: #606266">（{{scope.row.sum.indexOf('-') != -1 ? '减少' : '增加'}}：{{scope.row.sum}}）</span></div>
                <div v-if="scope.row.trackInfo != '' && scope.row.trackInfo != null">
                  <div v-if="scope.row.renewalStatus != 200" class="color-red">
                    <span>原因：</span>
                    <span>{{scope.row.renewalReasonName}}</span>
                    <span v-if="scope.row.renewalReason2Name">/{{scope.row.renewalReason2Name}}</span>
                  </div>
                  <div v-if="scope.row.renewalStatus != 200">{{ scope.row.trackInfo }}</div>
                  <span v-if="scope.row.renewalStatus != 200" style="color: #fa8c16;text-decoration: underline;cursor: pointer;" @click="editReason(scope.row)">修改</span>
                </div>
                <div v-if="scope.row.renewalStatus == 200" style="color: #606266" >续保保单号：{{scope.row.policyNoRenewal}}</div>
                
              </div>
              <div class="table-box" v-else>
                <el-button round size="mini" @click="follow(scope.row.branchName,scope.row.id,scope.row.policyNo)" style="border-color: #FA8C16; color: #FA8C16">跟进续保</el-button>
              </div>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column width="100px" align="center" label="操作">
            <template slot-scope="scope">
              <div class="table-box">
                <div style="color: #ffa940; cursor: pointer" @click="checkDetail(scope.row.id)">查看</div>
                <!-- <div style="color: #ffa940; cursor: pointer" @click="downloadCheck(scope.row)">续保建议书</div> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="fixed-BasePagenations">
      <div>查询结果：共 {{ tolnum }} 条记录 
        <!-- |<span style="color: #1890ff; cursor: pointer" @click="onExport"><i class="el-icon-download"></i>批量导出</span> -->
      </div>
      <BasePagenations :tolnum="tolnum" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></BasePagenations>
    </div>
    <el-dialog :class="{ 'dialog-active': tag == 'detail' }" :title="dislogTitle" :visible.sync="dialogVisible" width="805px" :before-close="handleClose">
      <div>
        <!-- 跟进续保情况 -->
        <Situation :key="timer"  v-if="tag == 'follow'" :reasonWxEnum="reasonWxEnum"  @sitCancel="sitCancel" :show="dialogVisible" :params="followObj" :typeList="RenewalStatusEnum" @onSubmit="fFn"/>
        <!-- 详情页 -->
        <Detail v-if="tag == 'detail'" :detail="detail" /> 
        <!-- 设置客户经理 -->
        <SetKhJl v-if="tag == 'set'" :list="this.batchPersonList" :parameter="parameter" :show="dialogVisible" @onCancel="dialogVisible = false" @onSubmit="onSetKhJl"></SetKhJl>
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
      condition: { // 列表查询条件
        orderby: "",
        pn: 1,
        ps: 10,
        trackYear: "", // 年份
        provinceCode: "", // 客户地区 省
        areaCode: "", // 客户地区 区
        cityCode: "", // 客户地区 市
        holderName: "", // 客户名称
        industryCode: "", // 行业
        managerCode: "", // 业务员
        polEndDateStart: "", // 保险止期
        polEndDateEnd: "", // 保险止期
        policyNo: "", // 保单号
        projectCode: "", // 项目编码
        renewalStatus: "", // 状态  续约状态 100-待跟进、200-已续约、300-流失、400-未续
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
        branchName: "",
        policyNo:'',
        renewalStatus:''
      }, // 跟进续保 主键
      areaLists: [],
      height: null,
      currentYear: "",
      timer:null,
    };
  },
  created() {
    this.initialization();
  },
  mounted () {
    let innerHeight = window.innerHeight;
    let headerHeight = document.querySelector(".header").offsetHeight;
    let tagsHeight = document.querySelector(".tags").offsetHeight;
    let topHeight = document.querySelector(".top-title").offsetHeight;
    let screenHeight = document.querySelector(".screen-wrapper").offsetHeight;
    let managerHeight = document.querySelector(".set-sccount-manager").offsetHeight;
    this.height = (innerHeight - (headerHeight + tagsHeight + topHeight + screenHeight + managerHeight)) - 120;
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
            return 'background:#E6F7FF;color: #000;'
            } else {
            return ''
            }
        },
    // 初始化
    initialization() { 
      this.project = JSON.parse(window.sessionStorage.getItem("projectItem") || "{}");
      this.renewalCondition();
      this.renewalConditionPro(this.project.projectCode, this.project.year, this.project.branchCode);
      this.condition.projectCode = this.project.projectCode;
      this.branchCode = this.project.branchCode;
      this.condition.trackYear = this.project.year;
      this.condition.branchCode = this.project.branchCode;
      this.RenewalStatusEnum.unshift({
        code: '',
        msg: '全部',
      })
      this.productCondition();
      this.getArea();
      this.batchPerson();
      this.renewalTracks();
      this.getLsWxReason();
    },
    // 查看详情
    checkDetail(val) {
      this.renewalTrackId = val;
      this.tag = "detail";
      this.dislogTitle = "续保详情";
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
      this.renewalConditionPro(this.project.projectCode, this.project.year,this.project.branchCode);
    },
    // 跟进续保
    follow(branchName,id,policyNo) {
      this.timer = new Date().getTime();
      this.tag = 'follow';
      this.followObj.id = id;
      this.followObj.branchName = branchName;
      this.followObj.policyNo = policyNo;
      this.dialogVisible = true;
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
      this.timer = new Date().getTime();
      this.tag = 'follow';
      this.followObj.id = val.id;
      this.followObj.branchName = val.branchName;
      this.followObj.policyNo = val.policyNo;
      this.followObj.renewalStatus = val.renewalStatus
      this.dialogVisible = true;
    if (val.renewalStatus == "300") {
        this.followObj.renewalReason=val.renewalReason
        this.followObj.renewalReasonName = val.renewalReasonName;
        this.followObj.renewalReason2Code=val.renewalReason2Code
        this.followObj.renewalReason2Name = val.renewalReason2Name;
        this.followObj.trackInfo = val.trackInfo
      }

      if (val.renewalStatus == "400") {
        this.followObj.renewalReason=val.renewalReason
        this.followObj.renewalReasonName = val.renewalReasonName;
        this.followObj.trackInfo= val.trackInfo
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
        trackYear: "", // 年份
        provinceCode: "", // 客户地区 省
        areaCode: "", // 客户地区 区
        cityCode: "", // 客户地区 市
        holderName: "", // 客户名称
        industryCode: "", // 行业
        managerCode: "", // 业务员
        polEndDateStart: "", // 保险止期
        polEndDateEnd: "", // 保险止期
        policyNo: "", // 保单号
        projectCode: "", // 项目编码
        renewalStatus: "", // 状态
        branchCode: "", // 状态
      };
      this.locationValue = "";
      this.dateValue = "";
      this.condition.projectCode = this.project.projectCode;
      this.condition.trackYear = this.project.year
      this.condition.branchCode = this.project.branchCode
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
      value[2] != undefined ? this.condition.areaCode = value[2] : this.condition.areaCode = ""; 
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
      list.forEach(item => this.ids.push(item.id));
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
      if(res.data.code == '0000') {
        this.reasonWxEnum = res.data.data.children
      } 
    },
    async renewalConditionPro(projectCode, year,branchCode) {
      let res = await this.renewalService.renewalConditionPro(projectCode, year,branchCode);
      if(res.data.code == '0000') {
        this.batchPersonLists = res.data.data.managerMap.filter(item => item != null && item.managerName != '')
        this.IndustryTypeEnum = res.data.data.industryMap.filter(item => item.industryName != "" && item.industryName != undefined);
      } 
    },
    // 保单追踪查询条件
      async renewalCondition() {
            let { data: { code, data: { renewalBranches, years, renewalStatusEnums } } } = await this.renewalService.renewalCondition();
            if(code == '0000') {
              this.RenewalStatusEnum = renewalStatusEnums
              this.RenewalStatusEnum.unshift({
                code: '',
                msg: '全部'
              })
            }
        },
    // 获取地区列表
    async getArea() {
      let { code, data } = await this.policyentryService.getArea(1);
      if (code == "0000") {
        this.areaLists = data;
        let list = JSON.parse(JSON.stringify(data));
        let newArr = [];
        this.companyAreaList.forEach(item => {
            let newList = list.filter(items => items.value == item)
            newArr.push(...newList)
        })
        this.areaList = newArr
      }
    },
    // 查询分支机构人员
    async batchPerson() {
      let obj = { jtBranchCode: this.branchCode, pageSize:100,pageNum:1};
      let { data: { code, list }, } = await this.marketManage.batchPerson(obj);
      if (code == "0000") { this.batchPersonList = list }
    },
    // 查询保单追踪列表
    async renewalTracks() {
      let { data: { code, list, total }, } = await this.renewalService.renewalTracks(this.condition);
      if (code == "0000") {
        this.tableData = list;
        this.tolnum = total;
        // let areaList = Object.entries(JSON.parse(window.sessionStorage.getItem("commonArea2")));
        let newArr = this.tableData.map(item => {
          return {
            ...item,
            polEndDate: item.polEndDate.split(" ")[0],
            sum: item.renewalStatus == 200 ? (item.renewalPrem - item.afterPrem).toFixed(2) + "" : "0",
          }
        })
        this.tableData = newArr.map(item => {
          return {
            ...item,
          }
        });
      }
    },
    // 获取地区名称
    getAreaName(areaList, code) {
      return areaList.filter(item => item[0] == code)[0]
    },
    // 查询保单追踪向信息
    async renewalTrack() {
      let { data: { code, data }, } = await this.renewalService.renewalTrack(this.renewalTrackId);
      if (code == "0000") { this.detail = data }
    },
    // 产品地区查询条件
    async productCondition() {
      let { data: { code, data } } = await this.renewalService.productCondition(this.condition.projectCode,this.condition.branchCode);
      if(code == '0000') {
        this.companyAreaList = data;
      }
    },
    // 获取枚举类
    async getEnum() {
      let { code, data } = await this.userManage.getEnum();
      if(code == '0000') {
        this.RenewalStatusEnum = data.RenewalStatusEnum;
        this.RenewalStatusEnum.unshift({  
          code: "",
          label: "全部",
          strCode: "",
        })
      }
    },
    // 导出保单追踪列表
    async onExport() {
      let c = JSON.parse(JSON.stringify(this.condition))
      c.ps = this.tolnum;  
      let { data } = await this.renewalService.renewalReport(c);
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
      let time = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
      return type == "s" ? (time += " 00:00:00") : type == "e" ? (time += " 23:59:59") : "";
    },
    async downloadCheck(row){
      let renewalCaseDetails = await this.renewalCaseDetails(row)
      let standingBook = await this.getLedger(row)
      let policyDetails = await this.getPolicyDetail(row)
      let templateBaoWen1 = new templateBaoWen();
      let obj = templateBaoWen1.renewalRecommendation(standingBook,policyDetails,renewalCaseDetails)
      let res = await this.templateService.templatePreview(obj,'MB-1646637704463',`${obj.holderName}公司${obj.year}年度安全生产责任保险续保建议书`)
    },
    // 获取保单详情
    async getPolicyDetail(row) {
      let data = {policyNo: row.policyNo,};
      const res = await this.CorrectionManagement.policydetails(data);
      if(res.code === '0000') {
        let {riskName} = res.data.riskList.find(item=>item.riskFlag2 == 'M') || {}
        let addRiskNames = res.data.riskList.filter(item=>item.riskFlag2 == 'A').map(item=>{
          return {addRiskName:item.riskName}
        })
        let obj = {
          holderName:row.holderName,
          mainRiskName:riskName,
          addRiskNames:addRiskNames,
          customerLevel:this.getUserStart(row.afterPrem)
        }
        return obj
      }
    },
    // 获取台账的保单信息
    async getLedger(row) {
      var params = {
        policyNo:row.policyNo,
        pn: 1, // 页数
        ps: 10, // 每页显示大小
      };
      let res = await this.StaticData.getLedger(params);
      if(res.data.code === '0000') {
        return res.data.list[0]
      }
    },
    // 续保建议书获取案件信息
    async renewalCaseDetails(row) {
      var params = {
        policyNo:row.policyNo,
        pn: 1, // 页数
        ps: 10, // 每页显示大小
      };
      let res = await this.renewalService.renewalCaseDetails(params);
      if(res.data.code === '0000') {
        return res.data.data
      }
    },
    // 获取用户星级
    getUserStart(prem) {
      let start;
      if(prem>=300000) {
        start = 5
      } else if(prem >= 70000 && prem < 300000) {
        start = 4
      } else if(prem >= 20000 && prem < 70000) {
        start = 3
      } else if(prem >= 5000 && prem < 20000) {
        start = 2
      } else if(prem<5000) {
        start = 1
      }
      return start
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
    color: #ff4d4f;
  }
  .c000 {
    color: #000;
  }
}
</style>