<template>
  <el-dialog
    title="服务机构基本信息"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="45%"
    @close="close"
    @open="getInit"
  >
    <div id="serviceAdd">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-position="right"
        :rules="rules"
        label-width="210px"
       
      >
        <el-form-item label="服务机构名称：" prop="orgName">
          <el-input
            v-model="ruleForm.orgName"
            class="w280" size="small"
            placeholder="请输入企业名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="社会信用代码：" prop="businessCode">
          <el-input
            v-model="ruleForm.businessCode"
            class="w280" size="small"
            placeholder="请输入社会信用代码"
          ></el-input>
        </el-form-item>
        <el-form-item label="法人代表姓名：" prop="legalPersonName">
          <el-input
            v-model="ruleForm.legalPersonName"
            class="w280" size="small"
            placeholder="请输入法人代表姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="法人代表联系电话：" prop="legalPersonPhone">
          <el-input
            v-model="ruleForm.legalPersonPhone"
            class="w280" size="small"
            placeholder="请输入法人代表联系电话"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="安责险业务责任人姓名：" prop="safetyCharger">
          <el-input
            v-model="ruleForm.safetyCharger"
            class="w280" size="small"
            placeholder="请输入安责险业务责任人姓名"
          ></el-input>
        </el-form-item> -->
        <!-- <el-form-item
          label="安责险业务责任人联系电话："
          prop="safetyChargerPhone"
        >
          <el-input
            v-model="ruleForm.safetyChargerPhone"
            class="w280" size="small"
            placeholder="请输入安责险业务责任人联系电话"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="地址信息：" prop="selectedOptions">
          <el-cascader
            v-if="showArea"
            class="w280" size="small"
            :options="areaOption"
            v-model="ruleForm.selectedOptions"
            placeholder="请选择地区"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="detailAddr">
          <el-input
          type="textarea"
            v-model="ruleForm.detailAddr"
            class="w280" size="small"
            placeholder="请输入详细地址"
          ></el-input>
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
import policyentryService from "@/service/PolicyentryService";
import buttonSelection from "../../../policyentry/js/buttonSelection";
import getCascaderObj from "../../../policyentry/js/selectedOptions";
import {
  validateName,
  validateOrg,
  validateAddress,
  checkPhone,
} from "@/util/validateForm";
export default {
  name: "serviceAdd",
  components: {
    Title,
  },
  data() {
    return {
      userManage: new userManage(),
      policyentryService: new policyentryService(),
      ButtonSelection: new buttonSelection(),
      select: new getCascaderObj(),
      showArea: false,
      queryCode: "", //修改用
      dialogVisible: false,
      ruleForm: {
        orgName: "", // 机构名称
        businessCode: "", //社会信用代码
        orgCode: "", // 是01：总部，依据《保险行业机构代码编 码规范（JR/T 0035-2007）》填写；如是02-04， 依据本单位内部编', ,
        legalPersonName: "", // 法人
        legalPersonPhone: "", // 法人电话
        safetyCharger: "", //负责人姓名
        safetyChargerPhone: "", // 负责人电话
        detailAddr: "", // 经营地址
        selectedOptions: [], // 区域
        provinceCode: "",
        provinceName: "",
        cityCode: "",
        cityName: "",
        countryCode: "",
        countyName: "",
        id: "",
        agencyNature: "", // 企业性质
        servicename: "safetyOrganizationSvc",
        orgType: 1,
        dataStatus: "1", // 状态
      },
      areaOption:[],
      rules: {
        orgName: [{ required: true, validator: validateOrg, trigger: "blur" }],
        businessCode: [
          { required: true, validator: validateOrg, trigger: "blur" },
        ],
        selectedOptions: [
          { required: true, message: "请选择区域", trigger: "change" },
        ],
        detailAddr: [
          { required: true, validator: validateAddress, trigger: "blur" },
        ],
        legalPersonName: [
          { required: true, validator: validateName, trigger: "blur" },
        ],
        legalPersonPhone: [
          { required: true, validator: checkPhone, trigger: "blur" },
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
  computed: {},
  mounted() {
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
    getInit() {
      this.showArea = true;
      if (this.queryCode) {
        //编辑，获取初始化数据
        this.initData(this.queryCode);
      }
    },
    close() {
      this.ruleForm = {
        orgName: "", // 机构名称
        businessCode: "", //社会信用代码
        orgCode: "", // 是01：总部，依据《保险行业机构代码编 码规范（JR/T 0035-2007）》填写；如是02-04， 依据本单位内部编', ,
        legalPersonName: "", // 法人
        legalPersonPhone: "", // 法人电话
        safetyCharger: "", //负责人姓名
        safetyChargerPhone: "", // 负责人电话
        detailAddr: "", // 经营地址
        selectedOptions: [], // 区域
        provinceCode: "",
        provinceName: "",
        cityCode: "",
        cityName: "",
        countryCode: "",
        countyName: "",
        id: "",
        agencyNature: "", // 企业性质
        servicename: "safetyOrganizationSvc",
        orgType: 1,
        dataStatus: "1", // 状态
      };
      this.showArea = false;
      this.queryCode = "";
      this.$refs.ruleForm.resetFields();
    },
    async initData(code) {
      // 初始化加载
      let data = {
        servicename: "safetyOrganizationSvc",
        code: code,
      };
      let res = await this.userManage.detailOrganization(data);
      if (res.code === "0000") {
        this.ruleForm = res.data;
        this.ruleForm.selectedOptions = [
          res.data.provinceCode,
          res.data.cityCode,
          res.data.countryCode,
        ];
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
    async configRegister() {
      // 修改和新增提交
      let res = "";
      await this.handleChangeArea(this.ruleForm.selectedOptions)
      if (this.ruleForm.id) {
        (this.ruleForm.servicename = "safetyOrganizationSvc"),
          (res = await this.userManage.updateOrganization(this.ruleForm));
      } else {
        res = await this.userManage.addOrganization(this.ruleForm);
      }
      if (res.code === "0000") {
        this.$message.success(this.ruleForm.id ? "修改成功" : "添加成功");
        this.$emit("getMsg", "刷新列表");
       this.dialogVisible  =false
      }
    },

    register() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let text = "确定要新增服务机构基本信息？";
          if (this.ruleForm["id"]) {
            text = "确定要修改服务机构基本信息？";
          }
          this.$confirm(text, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.configRegister();
            })
            .catch(() => {});
        } else {
          this.$message.error("请完整填写信息");
          return false;
        }
      });
    },
    // 处理选中省市区方法
    async handleChangeArea(value) {
      if (value) {
        (this.ruleForm.provinceCode = value[0] || ""),
          (this.ruleForm.cityCode = value[1] || ""),
          (this.ruleForm.countryCode = value[2] || "");
          // (this.ruleForm.streetCode = value[3] || "");
        let res = await this.userManage.getAreaName(value[value.length - 1]);
        if (res.code == "0000") {
          (this.ruleForm.provinceName = res.data[0].regionName || ""),
            (this.ruleForm.cityName = res.data[1].regionName || ""),
            (this.ruleForm.countryName = res.data[2].regionName || "");
            // (this.ruleForm.streetName = res.data[3].regionName || "");
        }
      }
    },
  
  },
};
</script>

<style scoped lang="less">
#serviceAdd {
  background-color: #fff;
  margin: 0 20px;
  padding: 20px 30px;
  .tips {
    margin-left: 30px;
    color: #de1e29;
  }
  .addExperts {
    margin: 20px 0;
  }
}
</style>
<style>
.el-dialog__header .el-dialog__title{
  margin-left: 50px;
  display: block;
  
  color: #000;
}
</style>
