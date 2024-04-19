<template>
  <div>
    <el-dialog
      :title="userCode ? '修改特种设备单位' : '添加特种设备单位'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="45%"
      @close="close"
      @open="getInit"
      append-to-body
      id="companyAdd"
    >
      <el-form
        :model="ruleForm"
        class="demo-ruleForm"
        label-position="right"
        label-width="180px"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="单位名称：" prop="custFullName">
          <el-input
            size="small"
            placeholder="请输入单位名称"
            v-model.trim="ruleForm.custFullName"
            class="item4"
            clearable
          ></el-input>
          <el-button
            size="small"
            type="primary"
            @click="search"
            class="search-icon"
            >查询</el-button
          >
          <el-button
            size="small"
            type="info"
            @click="setForm"
            class="search-icon"
            >重置</el-button
          >
          <span class="content-tips"
            ><i class="el-icon-warning" style="margin-right: 8px"></i
            >输入完整企业名称，点击“查询”读取企业信息
          </span>
        </el-form-item>
        <el-form-item label="社会信用代码：" prop="blCode">
          <el-input
            size="small"
            placeholder="请输入社会信用代码"
            v-model.trim="ruleForm.blCode"
            class="item4"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="实际经营地址：" prop="areaId">
          <el-cascader
            v-if="showArea"
            class="item4"
            size="small"
            :options="areaOption"
            @change="handleChange"
            v-model="ruleForm.areaId"
            placeholder="请选择地区"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细经营地址:" prop="detailAddress">
          <el-input
            size="small"
            type="textarea"
            placeholder="请输入详细地址"
            v-model.trim="ruleForm.detailAddress"
            class="item4"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="contactName" label="企业联系人">
          <el-input
            v-model="ruleForm.contactName"
            clearable
            class="item4"
            size="small"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item prop="contactPhone" label="企业联系方式">
          <el-input
            v-model="ruleForm.contactPhone"
            clearable
            class="item4"
            size="small"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align: right; margin-left: -60px">
          <el-button type="info" @click="dialogVisible=false" round
            >取消</el-button
          >
          <el-button type="warning" @click="register" round
            >确认提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import userManage from "@/service/userManage.js";
import { address } from "@/util/addressAnalysis";
import policyentryService from "@/service/PolicyentryService";
import {
  validateBlCode,
  validateDWName,
  validateName,
  validateAddress,
  validatePhone,
  checkPhone,
} from "@/util/validateForm";

export default {
  name: "HighRiskAdd",

  data() {
    return {
      policyentryService: new policyentryService(),
      userManage: new userManage(),
      address: new address(),
      data: {},
      showArea: false,
      userCode: "",
      dialogVisible: false,
      areaOption:[], //地区下拉框
      ruleForm: {
        blCode: "", // 统一社会信用代码
        areaId: [], // 区域
        deliveryAreaName: "",
        custFullName: "", // 单位名称
        detailAddress: "", // 详细地址，除省市县外，例如某某路多少号，可为空
        provinceCode: "", // 省代码,依照国家颁发行政代码标准
        provinceName: "", // 省名称，全称
        cityCode: "", // 所在市代码
        cityName: "", // 市名称，全称，可为空
        contactName: "", // 企业联系人名称
        contactPhone: "", // 企业联系人电话
        countyCode: "", // 县代码,依照国家颁发行政代码标准，可为空
        countyName: "", // 县名称，全称，可为空
        streetCode: "", // 区代码,依照国家颁发行政代码标准，可为空
        streetName: "", // 区名称，全称，可为空
      },
      rules: {
        custFullName: [
          { required: true, validator: validateDWName, trigger: "blur" },
        ],

        blCode: [
          { required: true, validator: validateBlCode, trigger: "blur" },
        ],
        areaId: [{ required: true, message: "请选择区域", trigger: "change" }],
        detailAddress: [
          { required: true, validator: validateAddress, trigger: "blur" },
        ],
        contactName: [
          { required: true, validator: validateName, trigger: "blur" },
        ],
        contactPhone: [
          { required: true, validator: checkPhone, trigger: "blur" },
        ],
      },
      value: [], // 多级联动的值 => 会是一个数组
      
    };
  },

  mounted() {
    this.getAreaLeave()
  },

  methods: {
    // 获取地区数据
    async getAreaLeave() {
      let {code,data} = await this.userManage.getAreaLeave({levels:'1,2,3'},0)
      if(code === '0000') {
        this.areaOption = data
      }
    },
    // 监听数据变化
    async handleChange(value) {
      if (value) {
        (this.ruleForm.provinceCode = value[0] || ""),
          (this.ruleForm.cityCode = value[1] || ""),
          (this.ruleForm.countyCode = value[2] || "");
        let res = await this.userManage.getAreaName(value[value.length - 1]);
        if (res.code == "0000") {
          (this.ruleForm.provinceName = res.data[0].regionName || ""),
            (this.ruleForm.cityName = res.data[1].regionName || ""),
            (this.ruleForm.countyName = res.data[2].regionName || "");
        }
      }
    },
    async initData() {
      // this.lawType = this.currentEnum("CertificateTypeEnum");
    },
    async search() {
      if (this.ruleForm.custFullName) {
        let res = await this.policyentryService.getAccessinformation(
          this.ruleForm.custFullName
        );
        if (res.code == "0000") {
    this.$set(this.ruleForm,'blCode', res.data.creditCode)
    if(res.data.phoneNumber){
       this.$set(this.ruleForm,'contactPhone', res.data.phoneNumber)
    }
 
        }
      } else {
        this.$message.warning("请先填写单位名称");
      }
    },
    setForm() {
      this.$refs["ruleForm"].resetFields();
    },
    close() {
      this.userCode = "";
      this.ruleForm = {
        blCode: "", // 统一社会信用代码
        areaId: [], // 区域
        deliveryAreaName: "",
        custFullName: "", // 单位名称
        detailAddress: "", // 详细地址，除省市县外，例如某某路多少号，可为空
        industryId: [], // 行业分类
        provinceCode: "", // 省代码,依照国家颁发行政代码标准
        provinceName: "", // 省名称，全称
        cityCode: "", // 所在市代码
        cityName: "", // 市名称，全称，可为空
        contactName: "", // 企业联系人名称
        contactPhone: "", // 企业联系人电话
        countyCode: "", // 县代码,依照国家颁发行政代码标准，可为空
        countyName: "", // 县名称，全称，可为空
        streetCode: "", // 区代码,依照国家颁发行政代码标准，可为空
        streetName: "", // 区名称，全称，可为空
      };
      this.showArea = false;
      this.$refs.ruleForm.resetFields();
    },
    getInit() {
      this.initData();
      this.showArea = true;
      if (this.userCode) {
        this.getOrgList();
      }
    },
    async getNational() {
      let res = await getNational();
      if (res.code == "0000") {
        this.nationalData = res.data;
        this.nationalObj = this.setDiGuiDataObj(res.data);
      }
    },
    // 重新设置行业数据
    setDiGuiDataObj(list, obj = {}) {
      //递归获取下拉框数据
      for (let i = 0, j = list.length; i < j; i++) {
        if (list[i].sysDictItemEntitys) {
          obj[list[i].id] = list[i].itemText;
          this.setDiGuiDataObj(list[i].sysDictItemEntitys, obj);
        } else {
          obj[list[i].id] = list[i].itemText;
        }
      }
      return obj;
    },
    async getOrgList() {
      let res = await this.userManage.enterpriseDetail(this.userCode);
      if (res.code == "0000") {
        this.ruleForm = res.data;
        if (res.data.sysDictItemEntitys) {
          this.ruleForm.industryId = new Array();
          res.data.sysDictItemEntitys.map((item) => {
            this.ruleForm.industryId.unshift(item.id);
          });
        }
        this.ruleForm.areaId = new Array();
        this.ruleForm.areaId = [
          res.data.provinceCode,
          res.data.cityCode,
          res.data.countyCode,
        ];
        if (res.data.streetCode) {
          this.ruleForm.areaId = [
            res.data.provinceCode,
            res.data.cityCode,
            res.data.countyCode,
            res.data.streetCode,
          ];
        }
      }
    },
    register() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$confirm("即将提交, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async () => {
            this.submit();
          });
        } else {
          this.$message.error("请完整填写信息");
          return false;
        }
      });
    },

    async submit() {
      if (this.userCode) {
        let res = await this.userManage.enterpriseUpdate(
          this.ruleForm,
          this.userCode
        );
        if (res.code == "0000") {
          this.$message.success("修改特种设备单位成功");
        }
      } else {
        let res = await this.userManage.enterpriseAdd(this.ruleForm);
        if (res.code == "0000") {
          this.$message.success("添加特种设备单位成功");
        }
      }
      this.dialogVisible = false;
      this.$emit("getMsg", "刷新");
    },
  },
};
</script>

<style lang="less">
#companyAdd {
  .el-dialog {
    width: 750px;
    .item4 {
      width: 280px;
    }
    .search-icon {
      margin-left: 10px;
    }
    .item1 {
      width: 260px;
      margin-right: 20px;
    }
    .item2 {
      width: 250px;
    }
    .item5 {
      width: 300px;
    }
    .content-tips {
      display: inline-block;
      height: 34px;
      line-height: 34px;
      background-color: #dbf9ef;
      color: #34c697;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
}
</style>


