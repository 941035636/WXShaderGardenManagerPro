<template>
  <el-dialog
    :title="organizationName + '机构基本信息'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    @open="getInit"
  >
    <div id="insuranceAdd">
      <el-form
        ref="ruleForm"
        label-position="right"
        :model="ruleForm"
        :rules="rules"
        label-width="210px"
      >
        <el-form-item label="机构类型：" prop="orgType">
          <el-select
            v-model="ruleForm.orgType"
            class="w280"
            size="small"
            @change="loge"
            placeholder="请选择企业类型"
          >
            <el-option
              v-for="item in typeData"
              :key="item.code"
              :label="item.label"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构名称：" prop="orgName">
          <el-input
            v-model="ruleForm.orgName"
            class="w280"
            size="small"
            placeholder="请输入机构名称"
          ></el-input>
         <span v-if="getOrgName" class="content-tips"><i class="el-icon-warning" style="margin-right:8px;"></i> {{ getOrgName }}</span>
        </el-form-item>
        <el-form-item label="机构编码：" prop="orgCode">
          <el-input
            v-model="ruleForm.orgCode"
            class="w280" size="small"
            placeholder="请输入机构编码"
          ></el-input>
            <span v-if="getOrgName" class="content-tips"><i class="el-icon-warning" style="margin-right:8px;"></i> {{ getOrgCode }}</span>
        </el-form-item>
       
        <el-form-item label="社会信用代码：" prop="businessCode">
          <el-input
            v-model="ruleForm.businessCode"
            class="w280" size="small"
            placeholder="请输入社会信用代码"
          ></el-input>
           <span v-if="getOrgName" class="content-tips"><i class="el-icon-warning" style="margin-right:8px;"></i> {{ getBusinessCode }}</span>
        </el-form-item>
    
        <el-form-item
          v-if="totalCom"
          label="绑定总公司："
          prop="headquartersName"
        >
          <el-input
            v-model="ruleForm.headquartersName"
            class="w280" size="small"
            placeholder="请输入总公司"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="安责险业务责任人姓名:" prop="safetyCharger">
          <el-input
            v-model="ruleForm.safetyCharger"
            class="w280" size="small"
            placeholder="请输入联系人名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="安责险业务责任人联系电话:"
          prop="safetyChargerPhone"
        >
          <el-input
            v-model="ruleForm.safetyChargerPhone"
            class="w280" size="small"
            placeholder="请输入企业联系人电话"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="实际经营地址" prop="selectedOptions">
          <el-cascader
            v-if="showArea"
            class="w280" size="small"
            v-model="ruleForm.selectedOptions"
            :options="areaOption"
            placeholder="请选择地区"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="detailAddr">
          <el-input
            v-model="ruleForm.detailAddr"
            class="w280" size="small"
            type="textarea"
            placeholder="请输入详细地址"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="$route.name == 'jtjg'"
          label="江泰分支机构"
          prop="jtOrgCode"
        >
          <el-select
            v-model="ruleForm.jtOrgCode"
            class="w280" size="small"
            @change="changeOrg"
            :disabled="ruleForm.id ? true : false"
            placeholder="请选择江泰分支机构"
          >
            <el-option
              v-for="(item, index) in branchList"
              :key="index"
              :label="item.jtBranchName"
              :value="item.jtBranchCode"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div style="text-align: right; margin: 30px 0">
        <el-button type="info" round @click="dialogVisible = false">返 回</el-button>
        <el-button type="warning" round @click="register">提 交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Title from "@/components/Title";
import userManage from "@/service/userManage.js";
import userManageService from "@/service/userManageService";
import policyentryService from "@/service/PolicyentryService";
import buttonSelection from "../../../policyentry/js/buttonSelection";
import getCascaderObj from "../../../policyentry/js/selectedOptions";

import {
  validateBlCode,
  validateName,
  validateOrg,
  validateAddress100,
  validatePhone,
  checkPhone
} from "@/util/validateForm";
export default {
  name: "InsuranceAdd",
  components: {
    Title,
  },
  data() {
    return {
      userManage: new userManage(),
      userManageService: new userManageService(),
      policyentryService: new policyentryService(),
      ButtonSelection: new buttonSelection(),
      select: new getCascaderObj(),
      dialogVisible: false,
      showArea: false, //懒加载地区回显用
      totalCom: false,
      queryCode: "",
      areaOption:[],
      typeData: [
        {
          code: 1,
          label: "总部",
        },
        {
          code: 2,
          label: "分公司",
        },
        {
          code: 3,
          label: "支公司",
        },
        {
          code: 4,
          label: "支公司以下机构",
        },
      ],
      serviceItems: [], // 服务项目
      ruleForm: {
        orgType: "", // 机构类型
        jtOrgCode: "",
        jtOrgName: "",
        orgName: "", // 机构名称
        businessCode: "", //社会信用代码
        orgCode: "", // 是01：总部，依据《保险行业机构编码编 码规范（JR/T 0035-2007）》填写；如是02-04， 依据本单位内部编', ,
        safetyCharger: "", //负责人姓名
        safetyChargerPhone: "", // 负责人电话
        detailAddr: "", // 经营地址
        headquartersCode: "", //总部名称编码 如是02-04，应填写此信息；如是“01：总部”, 可不填 ,
        headquartersName: "", //总部名称 如是02-04，应填写此信息；如是“01：总部”, 可不填 ,=
        selectedOptions: [], // 区域
        provinceCode: "",
        provinceName: "",
        cityCode: "",
        cityName: "",
        countryCode: "",
        countyName: "",
        streetCode: "",
        streetName: "",
        id: "",
        dataStatus: "1", // 状态
        // servicename: "insuranceCompanySvc",
      },
      branchList: [], //分支机构
      industryData: [], // 行业
      userCode: "",
      rules: {
        orgType: [
          { required: true, message: "请选择机构类型", trigger: "change" },
        ],
        jtOrgCode: [
          { required: true, message: "请选择分支机构", trigger: "change" },
        ],
        orgName: [{ required: true, validator: validateOrg, trigger: "blur" }],
        orgCode: [{ required: true, validator: validateOrg, trigger: "blur" }],
        businessCode: [
          { required: true, validator: validateBlCode, trigger: "blur" },
        ],
        headquartersName: [
          { required: true, validator: validateOrg, trigger: "blur" },
        ],
        selectedOptions: [
          { required: true, message: "请选择区域", trigger: "change" },
        ],
        detailAddr: [
          { required: true, validator: validateAddress100, trigger: "blur" },
        ],
        safetyCharger: [
          { required: true, validator: validateName, trigger: "blur" },
        ],
        safetyChargerPhone: [
          { required: true, validator: checkPhone, trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    getOrgName() {
      return this.ruleForm.orgType == 1
        ? "总部机构名称"
        : this.ruleForm.orgType == 2
        ? "分公司机构名称"
        : this.ruleForm.orgType == 3 || this.ruleForm.orgType == 4
        ? "支公司机构名称"
        : "";
    },
    getOrgCode() {
      return this.ruleForm.orgType == 1
        ? "总部机构编码"
        : this.ruleForm.orgType == 2
        ? "分公司机构编码"
        : this.ruleForm.orgType == 3 || this.ruleForm.orgType == 4
        ? "支公司机构编码"
        : "";
    },
    getBusinessCode() {
      return this.ruleForm.orgType == 1
        ? "总部社会信用代码"
        : this.ruleForm.orgType == 2
        ? "分公司社会信用代码"
        : this.ruleForm.orgType == 3 || this.ruleForm.orgType == 4
        ? "支公司社会信用代码"
        : "";
    },
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
  },

  created() {
    this.loadBranch();
    this.getAreaLeave();
  },
  methods: {
    // 获取地区数据
    async getAreaLeave() {
      let {code,data} = await this.userManage.getAreaLeave({levels:'1,2,3'},0)
      if(code === '0000') {
        this.areaOption = data
      }
    },
    // 初始化数据
    getInit() {
      this.showArea = true;
      if (this.queryCode) {
        //编辑，获取初始化数据
        this.initData(this.queryCode);
      }
    },
    // 获取分支机构
    async loadBranch() {
      let res = await this.userManageService.getBranchInfo();
      if (res.data.code == "0000") {
        this.branchList = res.data.list;
      }
    },
    // 清空form表单数据
    close() {
      this.ruleForm = {
        orgType: "", // 机构类型
        orgName: "", // 机构名称
        jtOrgCode: "",
        jtOrgName: "",
        businessCode: "", //社会信用代码
        orgCode: "", // 是01：总部，依据《保险行业机构编码编 码规范（JR/T 0035-2007）》填写；如是02-04， 依据本单位内部编', ,
        safetyCharger: "", //负责人姓名
        safetyChargerPhone: "", // 负责人电话
        detailAddr: "", // 经营地址
        headquartersCode: "", //总部名称编码 如是02-04，应填写此信息；如是“01：总部”, 可不填 ,
        headquartersName: "", //总部名称 如是02-04，应填写此信息；如是“01：总部”, 可不填 ,=
        selectedOptions: [], // 区域
        provinceCode: "",
        provinceName: "",
        cityCode: "",
        cityName: "",
        countryCode: "",
        countyName: "",
        streetCode: "",
        streetName: "",
        id: "",
        dataStatus: "1", // 状态
        // servicename: "insuranceCompanySvc",
      };
      this.showArea = false;
      this.totalCom = false;
      this.queryCode = "";
      this.$refs.ruleForm.resetFields();
    },
    // 选择机构类型
    loge(e) {
      if (e != 1) {
        this.totalCom = true;
      } else {
        this.ruleForm.headquartersName = "";
        this.totalCom = false;
      }
    },
    // 初始化加载
    async initData(code) {
      let data = {
        servicename: this.servicename,
        code: code,
      };
      let res = await this.userManage.detailOrganization(data);
      if (res.code === "0000") {
        this.ruleForm = res.data;
        if (res.data.headquartersName) {
          this.totalCom = true;
        }
        this.ruleForm.selectedOptions = [
          res.data.provinceCode,
          res.data.cityCode,
          res.data.countryCode,
        ];
        console.log(this.ruleForm.selectedOptions);
        if (res.data.streetCode) {
          this.ruleForm.selectedOptions = [
            res.data.provinceCode,
            res.data.cityCode,
            res.data.countryCode,
            res.data.streetCode,
          ];
        }
      }
    },
    // 选择分机构狗
    changeOrg(e) {
      this.ruleForm.jtOrgName = this.branchList.find((item) => {
        return item.jtBranchCode == e;
      }).jtBranchName;
    },
    async configRegister() {
      // 修改和新增提交
      let res = "";
      await this.handleChangeArea(this.ruleForm.selectedOptions);
      this.ruleForm.servicename = this.servicename;
      if (this.ruleForm.id) {
        res = await this.userManage.updateOrganization(this.ruleForm);
      } else {
        res = await this.userManage.addOrganization(this.ruleForm);
      }
      if (res.code === "0000") {
        this.$message.success(this.ruleForm.id ? "修改成功" : "添加成功");
        this.dialogVisible = false;
        this.$emit("getMsg", "刷新列表");
      }
    },
    register() {
      let text = "确定要新增" + this.organizationName + "机构基本信息？";
      if (this.ruleForm["id"]) {
        text = "确定要修改" + this.organizationName + "机构基本信息？";
      }
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(
        () => {
          this.$refs["ruleForm"].validate((valid) => {
            if (valid) {
              this.configRegister();
            } else {
              return false;
            }
          });
        },
        () => {
          // this.$baseMessage('已取消', 'info')
        }
      );
      return;
    },
    // 处理选中省市区方法
    async handleChangeArea(value) {
      if (value) {
        (this.ruleForm.provinceCode = value[0] || ""),
        (this.ruleForm.cityCode = value[1] || ""),
        (this.ruleForm.countryCode = value[2] || "");
        let res = await this.userManage.getAreaName(value[value.length - 1]);
        if (res.code == "0000") {
          (this.ruleForm.provinceName = res.data[0].regionName || ""),
          (this.ruleForm.cityName = res.data[1].regionName || ""),
          (this.ruleForm.countryName = res.data[2].regionName || "");
        }
      }
    },
    goBack() {
      this.dialogVisible = false;
    },
  },
};
</script>
<style>
#insuranceAdd .el-form-item__content{
  line-height: 0px;
}
</style>
<style scoped lang="less" scoped>
#insuranceAdd {
  background-color: #fff;
  margin: 0 20px;
  padding: 20px 30px;
  .tips {
    margin-left: 30px;
    color: #de1e29;
  }
  .tips1 {
    display: inline-block;
    padding: 0 20px;
    background: #dbf9ef;
    color: #34c697;
  }
  	.content-tips{
			display: inline-block;
			height: 20px;
      width: 190px;
			line-height: 20px;
      font-size: 12px;
      background-color: #DBF9EF;
			color: #34C697;
			padding: 0 20px;
			box-sizing: border-box;
		}
  .addExperts {
    margin: 20px 0;
  }
}
</style>
