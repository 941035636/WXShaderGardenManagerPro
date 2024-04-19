<template>
  <el-dialog
    @open="open"
    @close="clear"
    :title="id ? '添加安全专家' : '修改安全专家'"
    width="600px"
    :visible.sync="dialogVisible"
  >
    <div id="safetyAdd">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-position="right"
        :rules="rules"
        label-width="210px"
      >
        <el-form-item label="机构：">
          <span>{{ orgName }}</span>
        </el-form-item>
        <el-form-item label="姓名：" prop="safetyTechniciansName">
          <el-input
            v-model="ruleForm.safetyTechniciansName"
            class="w280"
            size="small"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="safetyTechniciansPhone">
          <el-input
            v-model="ruleForm.safetyTechniciansPhone"
            class="w280"
            size="small"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="证件类型："
        >
          <el-select
            v-model="ruleForm.safetyTechniciansCertificateType"
            class="w280"
            size="small"
            placeholder="请选择证件类型"
          >
            <el-option
              v-for="item in certificateType"
              :key="item.code"
              :label="item.label"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码：">
          <el-input
            v-model="ruleForm.safetyTechniciansCertificate"
            class="w280"
            size="small"
            placeholder="请输入证件号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="职务/职称：" prop="safetyTechniciansPost">
          <el-select
            v-model="ruleForm.safetyTechniciansPost"
            class="w280"
            size="small"
            placeholder="请选择职务/职称"
          >
            <el-option
              v-for="item in safetyPostEnum"
              :key="item.strCode"
              :label="item.label"
              :value="item.strCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最高学历：" prop="safetyTechniciansEducation1">
          <el-input
            v-model="ruleForm.safetyTechniciansEducation1"
            class="w280"
            size="small"
            placeholder="请输入最高学历"
          ></el-input>
        </el-form-item>
        <el-form-item label="专业：" prop="safetyTechniciansMajor">
          <el-input
            v-model="ruleForm.safetyTechniciansMajor"
            class="w280"
            size="small"
            placeholder="请输入专业"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="从事安全生产工作年限："
          prop="safetyTechniciansSeniority"
        >
          <el-input
            v-model="ruleForm.safetyTechniciansSeniority"
            class="w280"
            size="small"
            placeholder="请输入生产工作年限"
          >
            <template slot="append">年</template></el-input
          >
        </el-form-item>

        <!-- <el-form-item label="主要服务行业领域：" prop="industryParam">
          <el-cascader
                v-model="ruleForm.industryParam"
                placeholder="请选择行业领域"
              
                :options="industryData"
                clearable
               class="w280" size="small"
                :props="{
                  label: 'itemText',
                  value: 'itemValue',
                multiple: true ,
                  children: 'sysDictItemEntitys',
                }"
            
              ></el-cascader>
        </el-form-item> -->

        <el-form-item label="主要服务项目：" prop="serviceAccidentType">
          <el-select
            v-model="ruleForm.serviceAccidentType"
            class="w280"
            size="small"
            multiple
            placeholder="请选择主要服务项目"
            @change="changeService"
            @remove-tag="removeTag"
          >
            <el-option
              v-for="item in serviceItems"
              :key="item.strCode"
              :label="item.label"
              :value="item.strCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="other"
          label="其他有关事故预防工作："
          prop="otherType"
        >
          <el-input
            v-model="ruleForm.otherType"
            class="w280"
            size="small"
            placeholder="请输入其他有关事故预防工作"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right; margin: 30px 0">
        <el-button type="info" round @click="cancle">取 消</el-button>
        <el-button round @click="register" type="warning">提 交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  validateBlCode,
  validateIdCard,
  validatePositiveNum,
  validateName,
  validateOrg,
  validateAddress,
  checkPhone,
  validateYears,
} from "@/util/validateForm";
import { getIndustrys, getEnumslist ,getIndustryName} from "@/util/safety.js";
import userManage from "@/service/userManage.js";
import policyentryService from "@/service/PolicyentryService";
import buttonSelection from "../../../policyentry/js/buttonSelection";
import getCascaderObj from "../../../policyentry/js/selectedOptions";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      userManage: new userManage(),
      policyentryService: new policyentryService(),
      ButtonSelection: new buttonSelection(),
      select: new getCascaderObj(),
      dialogVisible: false,
      other: false,
      id: "",
      orgName: "", //机构名称
      code: "",
      serviceItems: [], // 服务项目
      safetyPostEnum: [], // 职务
      industryData: [], // 行业
      newindustryData: [], 
      allArea: [], //地址
      certificateType: [], // 证件类型
      ruleForm: {
        id: "",
        safetyTechniciansCertificate: "", // 证件号码 ,
        safetyTechniciansCertificateType: "", // 证件类型 ,
        safetyTechniciansCompany: "", // 所在单位 ,
        safetyTechniciansEducation1: "", // 最高学历 ,
        safetyTechniciansName: "", // 姓名 ,
        // selectedOptions: [], //所属地区
        safetyTechniciansPhone: "", // 电话 ,
        safetyTechniciansPost: "", // 职务 ,
        safetyTechniciansMajor: "", // 专业
        safetyTechniciansSeniority: "", //  工作年限 ,
        serviceAccidentType: [], // 服务类型 ,
        otherType: "", //其他有关事故预防
        serviceAccidentTypes: [], // 服务类型集合 ,
        dataStatus: 1, // 状态
        industryParam: [], // 服务行业
        serviceIndustrys: [], // 接口入参行业集合
      },

      rules: {
        safetyTechniciansName: [
          { required: true, validator: validateName, trigger: "blur" },
        ],
        safetyTechniciansPhone: [
          { required: true, validator: checkPhone, trigger: "blur" },
        ],

        safetyTechniciansCertificateType: [
          { required: true, message: "请选择证件类型", trigger: "change" },
        ],
        safetyTechniciansCertificate: [
          { required: true, validator: validateIdCard, trigger: "blur" },
        ],
        safetyTechniciansPost: [
          { required: true, message: "请选择职务", trigger: "change" },
        ],
        safetyTechniciansEducation1: [
          { required: true, message: "请填写最高学历", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "最高学历只支持2到10位",
            trigger: "blur",
          },
        ],
        safetyTechniciansMajor: [
          { required: true, message: "请填写专业", trigger: "blur" },
          { min: 1, max: 30, message: "专业只支持1到30位", trigger: "blur" },
        ],
        safetyTechniciansCompany: [
          { required: true, message: "请填写所在单位", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "所在单位只支持1到30位",
            trigger: "blur",
          },
        ],
        safetyTechniciansSeniority: [
          {
            required: true,
            validator: validateYears,
            trigger: "blur",
          },
        ],
        serviceAccidentType: [
          { required: true, message: "请选择服务项目", trigger: "change" },
        ],
        industryParam: [
          { required: true, message: "请选择服务行业", trigger: "change" },
        ],
        otherType: [
          { required: true, message: "请填写其他服务行业", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "其他服务行业只支持2到50位",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      getEnumAll: "getEnumAll",
    }),
  },
    watch: {
      'ruleForm.industryParam':{
            handler: function(newval,oldval) {
               if (newval.length > 10) {
          this.$message({
            message: '最多只支持选择10项',
            duration: 1500,
            type: 'warning'
          })
          this.$nextTick(() => {
            this.ruleForm.industryParam= oldval;
          })

               }
           },
           deep:true
      }
  },
  created() {
    this.$store.dispatch("setEnumInfo");
  },
  methods: {
    open() {
      // this.getArea();
      this.getDict();
      if (this.code) {
        this.getDetail();
      }
    },
    async getDict() {
      // 获取字段表和枚举类
      this.safetyPostEnum = this.getEnumAll.ExpertDutyEnum;
      this.certificateType = this.getEnumAll.CertificateTypeEnum;
      this.serviceItems = this.getEnumAll.ServiceItemsEnum;
      let res = await this.userManage.dictGet(true, "20003");
      let reso = await this.userManage.dictGet(false, "20003");
 
      if (reso.code == "0000") {
        this.newindustryData = reso.data;
      }

      if (res.code == "0000") {
        this.industryData = res.data;
      }
    },
    async getDetail() {
      let res = await this.userManage.getExpertDetail(this.code);
      if (res.code === "0000") {
      //  let arr =res.data.serviceIndustryCode.split(",");
        // res.data.industryParam = getIndustryName(this.newindustryData,arr)
        // res.data.industryParam = res.data.serviceIndustryCode.split(",");
        if (res.data.serviceAccidentTypes) {
          let result = res.data.serviceAccidentTypes.findIndex(
            (it) => it.serviceAccidentType == "07"
          );
          if (result != "-1") {
            this.other = true;
            let obj = res.data.serviceAccidentTypes[result];
            this.$nextTick(() => {
              this.$set(
                this.ruleForm,
                "otherType",
                obj.serviceAccidentTypeName
              );
            });
          }
          res.data.serviceAccidentType = res.data.serviceAccidentTypes.map(
            (item, index) => {
              return item.serviceAccidentType;
            }
          );
        }

        res.data.serviceIndustrys = [];
        res.data.serviceAccidentTypes = [];
        res.data.dataStatus = res.data.expertStatus;
        this.ruleForm = res.data;
      }
    },
    changeService(e) {
      if (e.lastIndexOf("07") != "-1") {
        this.other = true;
      }else{
         this.other = false;
      }
    },
    removeTag(e) {
      console.log(e,'000000');
      if (e == "07") {
        this.other = false;
        this.ruleForm.otherType = "";
      }
    },
    register() {
      console.log(this.ruleForm.industryParam, "----1-");

      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let text = "确定要新增？";
          if (this.ruleForm["id"]) {
            text = "确定要修改？";
          }
          this.$confirm(text, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.submitExpert();
            })
            .catch(() => {});
        } else {
          this.$message.error("请完整填写信息");
          return false;
        }
      });
    },
    async submitExpert() {
      let res = "";
      let text = "";
      this.ruleForm.serviceIndustrys = getIndustrys(
        this.newindustryData,
        []
      );

      this.ruleForm.serviceAccidentTypes = getEnumslist(
        this.serviceItems,
        this.ruleForm.serviceAccidentType,
        this.ruleForm.otherType
      );
      if (this.id) {
        res = await this.userManage.expertAdd(this.id, this.ruleForm); //新增专家
        text = "新增专家";
      } else {
        res = await this.userManage.expertUpdate(this.ruleForm); //修改专家
        text = "修改专家";
      }
      if (res.code == "0000") {
        this.$message.success(text + "成功");
        this.$emit("getMsg", "更新列表");
        this.dialogVisible = false;
      } else {
        this.$message.error(text + "失败");
      }
    },
    cancle() {
      this.clear();
      this.dialogVisible = false;
    },
    clear() {
      this.code = "";
      this.$refs.ruleForm.resetFields();
      this.ruleForm = {
        id: "",
        safetyTechniciansCertificate: "", // 证件号码 ,
        safetyTechniciansCertificateType: "", // 证件类型 ,
        safetyTechniciansCompany: "", // 所在单位 ,
        safetyTechniciansEducation1: "", // 最高学历 ,
        safetyTechniciansName: "", // 姓名 ,
        safetyTechniciansPhone: "", // 电话 ,
        safetyTechniciansPost: "", // 职务 ,
        safetyTechniciansMajor: "", // 专业
        safetyTechniciansSeniority: "", //  工作年限 ,
        serviceAccidentType: [], // 服务类型 ,
        otherType: "", //其他有关事故预防
        serviceAccidentTypes: [], // 服务类型集合 ,
        dataStatus: 1, // 状态
        industryParam: [], // 服务行业
        serviceIndustrys: [], // 接口入参行业集合
      };
    },
  },
};
</script>

<style>
.w280 {
  width: 280px;
}
</style>