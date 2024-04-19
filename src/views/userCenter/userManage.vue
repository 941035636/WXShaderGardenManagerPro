<template>
  <div id="userManage">
    <div class="content">
      <div class="screen-wrapper">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="inp-box">
              <span class="label-text">客户名称</span>
              <el-input class="www" v-model="form.customerName" clearable placeholder="请输入客户名称"></el-input>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="inp-box">
              <span class="label-text">证件号码</span>
              <el-input class="www" v-model="form.customerId" clearable placeholder="请输入证件号码"></el-input>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="inp-box">
              <span class="label-text">客户地区</span>
              <el-cascader class="www" :props="{ checkStrictly: true }" filterable clearable v-model="locationValue"
                :options="areaOptins"></el-cascader>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mt20">
          <el-col :span="8">
            <div class="inp-box">
              <span class="label-text">运营类型</span>
              <el-select class="www" v-model="form.operation" filterable clearable placeholder="请选择运营类型">
                <el-option v-for="item in customerTypeOptins" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="inp-box">
              <span class="label-text">客户星级</span>
              <el-select class="www" filterable clearable v-model="form.level" placeholder="请选择客户星级">
                <el-option v-for="item in levelOptins" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8" v-if="showBranch">
            <div class="inp-box">
              <span class="label-text">分支机构</span>
              <el-select class="www" filterable clearable v-model="form.orgCode" placeholder="请选择分支机构">
                <el-option v-for="item in branchOptins" :key="item.jtBranchCode" :label="item.jtBranchName"
                  :value="item.jtBranchCode"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mt20">
          <el-col :span="8">
            <div class="inp-box" v-if="showBranch">
              <span class="label-text">业务员</span>
              <el-input class="www" v-model="form.businessorName" clearable placeholder="请输入业务员"></el-input>
            </div>
          </el-col>
          <el-col :span="16" style="text-align: right; padding-right: 10px">
            <el-button class="clear" type="primary" round @click="clearCondition">清空条件</el-button>
            <el-button class="submit" type="success" round @click="getCustomerManagementList('serch')">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="screen-tab">
        <ul class="screen-tab-list">
          <li v-for="item in customerStatusOptins" :key="item.value"
            :class="{ active: form.customerStatus == item.value }" @click="setCustomerStatus(item.value)">{{ item.label }}
          </li>
        </ul>
      </div>
      <div class="table-wrapper">
        <div class="table-top">
          <div class="table-top-l">
            <span>客户类型:</span>
            <div>
              <span v-for="item in companyTypeOptins" :key="item.value"
                :class="{ 'state-active': item.value == form.customerType }" @click="setCustomerType(item.value)">{{
                  item.label }}</span>
            </div>
          </div>
          <div class="set-sccount-manager">
            <el-button round class="ml10" @click="uploadUser()">批量导入</el-button>
            <el-button type="primary" round @click="addUser"
              v-if="datas.find(item => item.key == '130001')">添加客户</el-button>
          </div>
        </div>
        <el-table :data="tableData" border header-row-class-name="table-header" :header-cell-style="getRowClass"
          style="width: 100%">
          <!-- 保险期限/行业 -->
          <el-table-column type="index" width="55" label="序号"></el-table-column>
          <!-- 客户信息 -->
          <el-table-column align="left" prop="holderName" label="客户信息">
            <template slot-scope="scope">
              <div class="table-box">
                <div style="color: #000000; font-weight: 600">{{ scope.row.customerName }}（{{ scope.row.customerId }}）
                </div>
                <div style="color: #6F716F;">{{ scope.row.provinceName }}<span v-if="scope.row.cityName != ''">/</span>{{
                  scope.row.cityName }}<span v-if="scope.row.areaName != ''">/</span>{{ scope.row.areaName }}
                </div>
                <div>
                  <span class="cellLeftBox">{{ scope.row.customerTypeName }}</span>
                  <span class="cellRightBox">{{ scope.row.operationTypeName }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 星级 -->
          <el-table-column width="100px" align="center" prop="levelName" label="星级">
          </el-table-column>
          <!-- 行业领域 -->
          <el-table-column width="100px" align="center" prop="industryName" label="行业领域">
          </el-table-column>
          <!-- 更新时间/分支机构 -->
          <el-table-column width="200px" align="center" prop="renewalStatus" label="更新时间/分支机构">
            <template slot-scope="scope">
              <div class="table-box">
                <div>{{ scope.row.updateTime }}</div>
                <div>{{ scope.row.businessorName }}/{{ scope.row.bizBranchName }}</div>
              </div>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column width="120px" align="center" label="操作">
            <template slot-scope="scope">
              <div class="table-box">
                <el-button type="text" v-if="datas.find(item => item.key == '130003')"
                  @click="checkDetail(scope.row)">查看</el-button>
                <span style="color:#096DD9">|</span>
                <el-dropdown trigger="click">
                  <el-button type="text" class="moreBtn">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="datas.find(item => item.key == '130002')"
                      @click.native="updateUser(scope.row)">
                      修改
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="fixed-BasePagenations">
      <div>查询结果：共 {{ tolnum }} 条记录
        <span style="margin:0 10px;">|</span>
        <span style="color: #1890ff; cursor: pointer" @click="downloadUser()"><i class="el-icon-download"></i>批量导出</span>
      </div>
      <BasePagenations v-if="pageshow" :tolnum="tolnum" :currentPage="form.page"
        @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></BasePagenations>
    </div>
    <CreateCustomerUser :industryTypeOptins="industryTypeOptins" :levelOptins="levelOptins" :branchOptins="branchOptins"
      :customerStatusOptins="customerStatusOptins | changeEmptyList"
      :companyTypeOptins="companyTypeOptins | changeEmptyList" :areaData="areaOptins" ref="CreateCustomerUser"
      @successCallback="getCustomerManagementList('serch')"></CreateCustomerUser>
    <CustomerUserDetails ref="CustomerUserDetails"></CustomerUserDetails>

    <RegFileUploadDialog ref="fileRef" @fevent="update_table"></RegFileUploadDialog>
  </div>
</template>

<script>

import userManageService from "@/service/userManageService";
import userManage from "@/service/userManage";
import BasePagenations from "@/components/common/Base/BasePagenations.vue";
import CreateCustomerUser from "./components/CreateCustomerUser"
import CustomerUserDetails from "./components/CustomerUserDetails"
import RegFileUploadDialog from "./components/RegFileUploadDialog";
export default {
  components: {
    BasePagenations, CreateCustomerUser, CustomerUserDetails, RegFileUploadDialog
  },
  filters: {
    changeEmptyList(list = []) {
      return list.filter(item => item.value)
    },
  },
  data() {
    return {
      userManageService: new userManageService(),
      form: {
        "areaCode": "",   // 区县编码
        "businessorCode": "", // 我负责的 传用户编码
        "businessorName": "", // 业务员名称 模糊搜索
        "channel": "sequip",    // 安保或者特设（不用传，会根据sysCode取安保或特设）
        "cityCode": "",   // 市编码
        "customerId": "", // 客户id
        "customerName": "",   // 客户姓名
        "customerStatus": '',    // 客户状态 关停 存续
        "customerType": '',  // 客户类型 企业客户，行管客户，传编码
        "level": '', // 星级 传遍吗
        "operation": "",  // 运营类型 传编码
        "orgCode": "",    // 所属机构
        "page": 1,
        "pageSize": 10,
        "provinceCode": "",   //省编码
        "sysCode": "sys_sequip_man" // 必传，特设传 sys_sequip_main，安保 传 sys_safety_man
      },
      renewalTrackId: "",
      tableData: [],
      IndustryTypeEnum: [],
      locationValue: [],
      project: {},
      showBranch: false,
      customerStatusOptins: [],
      companyTypeOptins: [], // 客户类型
      areaOptins: [],
      branchOptins: [],
      levelOptins: [],
      customerTypeOptins: [],    // 目标客户
      industryTypeOptins: [],    // 行业客户
      tolnum: 0,
      pageshow: true,
      datas: [],
    };
  },
  created() {
    this.initialization();

  },
  mounted() {

  },
  watch: {

  },
  methods: {
    //导入
    uploadUser() {
      this.$refs.fileRef.openInit({})
      this.$refs.fileRef.channel = "sequip"
    },
    update_table() {
      console.log('弹框关闭后刷新页面');
      this.initialization();
    },

    //导出    
    async downloadUser() {
      if (this.tolnum <= 0) {
        this.$message({
          message: "导出数量为0,暂时无法导出！",
          type: 'warning'
        });
        return
      }
      if (this.tolnum > 5000) {
        this.$message({
          message: "数据量过大,超过5000条,请缩小查询范围！",
          type: 'warning'
        });
        return
      }
      let formObj = { ...this.form }
      // if (!this.showBranch) {
      //   formObj.businessorCode = sessionStorage.getItem('userCode')
      // }
      if (this.locationValue.length !== 0) {
        formObj.provinceCode = this.locationValue[0] || ''
        formObj.cityCode = this.locationValue[1] || ''
        formObj.areaCode = this.locationValue[2] || ''
      } else {
        formObj.provinceCode = ''
        formObj.cityCode = ''
        formObj.areaCode = ''
      }
      formObj.visitInfo = {}
      formObj.visitTimes = ""

      let res = await this.userManageService.postCustomerExcelExport(formObj)
      if (res.headers['content-type'].includes('application/vnd.ms-excel')) {
				let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
				const fileName = `${new Date().valueOf()}.xlsx`;
				const link = document.createElement("a");
				link.href = window.URL.createObjectURL(blob);
				link.download = fileName;
				link.click();
				window.URL.revokeObjectURL(link.href);
			} else if (res.headers['content-type'].includes('application/json')) {
				let enc = new TextDecoder('utf-8')
				this.$message.error(JSON.parse( enc.decode(new Uint8Array(res.data) ) ).msg)
			}
    },

    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color: #000;'
      } else {
        return ''
      }
    },
    // 初始化
    initialization() {
      this.datas = JSON.parse(window.sessionStorage.getItem('list'));
      this.getIsHeadOffice()
      this.getCustomerManagementEnum()
      this.getArea()
    },
    // 是否为总公司
    getIsHeadOffice() {
      if (window.sessionStorage.getItem('branchCode') == 'JT0000') {
        this.showBranch = true;
      } else {
        this.showBranch = false;
      }
      this.getBranchInfo()
      this.getCustomerManagementList()
    },
    // 获取列表数据
    async getCustomerManagementList(flag = '') {
      let formObj = { ...this.form }
      // if (!this.showBranch) {
      //   formObj.businessorCode = sessionStorage.getItem('userCode')
      // }
      if (this.locationValue.length !== 0) {
        formObj.provinceCode = this.locationValue[0] || ''
        formObj.cityCode = this.locationValue[1] || ''
        formObj.areaCode = this.locationValue[2] || ''
      } else {
        formObj.provinceCode = ''
        formObj.cityCode = ''
        formObj.areaCode = ''
      }
      if (flag === 'serch') {
        formObj.page = 1
        this.form.page = 1
      }
      console.log(formObj);
      // return
      let { code, data: { records, total } } = await this.userManageService.getCustomerManagementList(formObj)
      console.log(code, '-*-*-', records);
      if (code === '0000') {
        this.tableData = records
        this.tolnum = total
      }
    },
    // 获取用户管理的枚举
    async getCustomerManagementEnum() {
      let { code, data } = await this.userManageService.getCustomerManagementEnum()
      if (code === '0000') {
        this.levelOptins = this.getObjectChangeArray(data.level)
        this.customerTypeOptins = this.getObjectChangeArray(data.customerType)
        delete data.sequipIndustry[99]
        this.industryTypeOptins = [...this.getObjectChangeArray(data.sequipIndustry),...this.getObjectChangeArray({'99':'其他'})]
        this.customerStatusOptins = [
          {
            label: '全部',
            value: '',
          },
          ...this.getObjectChangeArray(data.customerStatus)
        ]
        this.companyTypeOptins = [
          {
            label: '全部',
            value: '',
          },
          ...this.getObjectChangeArray(data.companyType)
        ]

      }
    },
    // object转成array
    getObjectChangeArray(obj) {
      let list = Object.keys(obj).map(item => {
        return {
          label: obj[item],
          value: item,
        }
      })
      return list
    },
    // 获取地区
    async getArea() {
      let { code, data } = await this.userManageService.getAreas()
      if (code === '0000') {
        this.areaOptins = data
      }
    },
    // 获取分支机构
    async getBranchInfo() {
      let { data: { code, list } } = await this.userManageService.getBranchInfo()
      if (code === '0000') {
        this.branchOptins = list
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },

    // 清空条件数据
    clearCondition() {
      this.form = {
        "areaCode": "",   // 区县编码
        "businessorCode": "", // 我负责的 传用户编码
        "businessorName": "", // 业务员名称 模糊搜索
        "channel": "sequip",    // 安保或者特设（不用传，会根据sysCode取安保或特设）
        "cityCode": "",   // 市编码
        "customerId": "", // 客户id
        "customerName": "",   // 客户姓名
        "customerStatus": '',    // 客户状态 关停 存续
        "customerType": '',  // 客户类型 企业客户，行管客户，传编码
        "level": '', // 星级 传遍吗
        "operation": "",  // 运营类型 传编码
        "orgCode": "",    // 所属机构
        "page": 1,
        "pageSize": 10,
        "provinceCode": "",   //省编码
        "sysCode": "sys_sequip_man" // 必传，特设传 sys_sequip_main，安保 传 sys_safety_man
      }
      this.locationValue = [];
      this.getCustomerManagementList();
    },
    // 分页切换函数
    handleCurrentChange(value) {
      this.form.page = value;
      this.getCustomerManagementList();
    },
    // 切换每页多少条函数
    handleSizeChange(value) {
      this.form.pageSize = value;
      this.getCustomerManagementList();
    },
    addUser() {
      this.$refs.CreateCustomerUser.openDialog()
    },
    // 查看详情
    checkDetail(row) {
      this.$refs.CustomerUserDetails.openDialog(row)
    },
    // 修改详情
    updateUser(row) {
      this.$refs.CreateCustomerUser.openDialog(row)
    },
    // 切换客户状态
    setCustomerStatus(val) {
      this.form.customerStatus = val
      this.getCustomerManagementList();
    },
    // 切换客户类型
    setCustomerType(val) {
      this.form.customerType = val
      this.getCustomerManagementList();
    },


  },
};
</script>

<style lang="less" scoped>
#userManage {

  //   max-height: 100%;
  //   overflow: scroll;
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
    // margin-top: 12px;
    padding: 0 11px;
    padding-bottom: 120px;
    background: #fff;

    .table-top {
      display: flex;
      box-sizing: border-box;
      justify-content: space-between
    }
  }

  .table-top-l {
    display: flex;
    align-items: center;

    div {
      display: flex;

      span {
        padding: 6px 20px;
        border: 1px solid #096DD9;
        border-radius: 50px;
        margin-left: 25px;
        color: #096DD9;
        cursor: pointer;
      }
    }
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 46px);
    padding: 0px 26px;
    margin: 10px 23px;
    margin-bottom: 0;
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

  .state-active {
    background: #E6F7FF;
  }

  .cellLeftBox {
    display: inline-block;
    background-color: #BAE7FF;
    padding: 0px 10px;
    border-radius: 4px;
    color: #096DD9;
  }

  .cellRightBox {
    display: inline-block;
    margin-right: 20px;
    background-color: #1890FF;
    padding: 0px 10px;
    border-radius: 4px;
    color: #fff;
  }
}
</style>