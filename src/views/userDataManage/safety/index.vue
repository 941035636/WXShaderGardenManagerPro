<template>
  <el-dialog
    @open="open"
    @close="clear"
    title="添加安全专家"
    width="65%"
    :visible.sync="dialogVisible"
  >
    <div id="safetyAdd">
   
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-position="right"
        :rules="rules"
        label-width="180px"
        :inline="true"
      >
         <p class="safetytitle">机构：{{orgName}}</p>
        <el-form-item label="姓名：" prop="safetyTechniciansName">
          <el-input
            v-model="ruleForm.safetyTechniciansName"
            class="w250"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="safetyTechniciansPhone">
          <el-input
            v-model="ruleForm.safetyTechniciansPhone"
            class="w250"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="证件类型："
          prop="safetyTechniciansCertificateType"
        >
          <el-select
            v-model="ruleForm.safetyTechniciansCertificateType"
            class="w250"
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
        <el-form-item label="证件号码：" prop="safetyTechniciansCertificate">
          <el-input
            v-model="ruleForm.safetyTechniciansCertificate"
            class="w250"
            placeholder="请输入证件号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="职务/职称：" prop="safetyTechniciansPost">
          <el-select
            v-model="ruleForm.safetyTechniciansPost"
            class="w250"
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
            class="w250"
            placeholder="请输入最高学历"
          ></el-input>
        </el-form-item>
        <el-form-item label="专业：" prop="safetyTechniciansMajor">
          <el-input
            v-model="ruleForm.safetyTechniciansMajor"
            class="w250"
            placeholder="请输入专业"
          ></el-input>
        </el-form-item>
        <el-form-item label="所在单位:" prop="safetyTechniciansCompany">
          <el-input
            v-model="ruleForm.safetyTechniciansCompany"
            class="w250"
            placeholder="请输入所在单位"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="从事安全生产工作年限：	"
          prop="safetyTechniciansSeniority"
        >
          <el-input
            v-model="ruleForm.safetyTechniciansSeniority"
            class="w250"
            placeholder="请输入生产工作年限"
          > <template  slot="append">年</template></el-input>
        </el-form-item>
        <el-form-item label="主要服务项目：" prop="serviceAccidentType">
          <el-select
            v-model="ruleForm.serviceAccidentType"
            class="w250"
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
          label="其他有关事故预防工作：	"
          prop="otherType"
        >
          <el-input
            v-model="ruleForm.otherType"
            class="w250"
            placeholder="请输入其他有关事故预防工作"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="主要服务行业领域：" prop="industryParam">
          <el-select
            v-model="ruleForm.industryParam"
            class="w250"
            multiple
            placeholder="请选择职行业领域"
          >
            <el-option
              v-for="item in industryData"
              :key="item.itemValue"
              :label="item.itemText"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" style="text-align: center; margin: 30px 0">
        <el-button @click="cancle">取 消</el-button>
        <el-button @click="submitExpert" type="primary">提 交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  validateBlCode,
  validateIdCard,
  validatePositiveNum,
  validateMoney,
  validateDWName,
  validateName,
  validateOrg,
  validateAddress,
  validatePhone,
  validateYears,
} from "@/util/validateForm";
export default {
  // props: {
  //   id: 0,
  //   expertMsg: {},
  //   expertsMsg: {},
  // },
  data() {
    return {
      dialogVisible: false,
      other: false,
      serviceItems: [], // 服务项目
      safetyPostEnum: [], // 职务
      industryData: [], // 行业
      orgName:'',//机构名称
      certificateType: [], // 证件类型
      ruleForm2: [],
      ruleForm: {
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
      },

      rules: {
        safetyTechniciansName: [{ required: true,validator:validateName, trigger: "blur" }],
        safetyTechniciansPhone: [{ required: true,validator:validatePhone, trigger: "blur" }],

        safetyTechniciansCertificateType: [
          { required: true, message: "请选择证件类型", trigger: "change" },
        ],
        safetyTechniciansCertificate: [{ required: true,validator:validateIdCard, trigger: "blur" }],
        safetyTechniciansPost: [
          { required: true, message: "请选择职务", trigger: "change" },
        ],
        safetyTechniciansEducation1: [
          { required: true, message: "请填写最高学历", trigger: "blur" },
          {
            min: 2,
            max: 30,
            message: "最高学历只支持2到30位",
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
            validator:validateYears,
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
        ],
      },
    };
  },

  methods: {
    open() {
      if (this.id) {
        this.ruleForm = JSON.parse(JSON.stringify(this.expertMsg));
        this.ruleForm2 = JSON.parse(JSON.stringify(this.expertsMsg));
      }
    },
    changeService(e) {
      
      if (e.lastIndexOf("07") != "-1") {
        this.other = true;
      }
    },
    removeTag(e) {
      if (e == "07") {
        this.other = false;
        this.ruleForm.otherType = "";
      }
    },
    sendMsg() {
      this.$emit("getExpert", this.ruleForm2);
      this.clear();
      this.dialogVisible = false;
    },
    submitExpert() {
      if (this.id) {
        if (
          this.ruleForm.safetyTechniciansCertificate ==
          this.expertMsg.safetyTechniciansCertificate
        ) {
          let index = this.id - 1;
          this.ruleForm2[index] = this.ruleForm;
          this.sendMsg();
        } else {
          let result = this.ruleForm2.some(
            (item) =>
              item.safetyTechniciansCertificate ===
              this.ruleForm.safetyTechniciansCertificate
          );
          if (result) {
            this.$message.error("专家重复,请修改！");
          } else {
            let index = this.id - 1;
            this.ruleForm2[index] = this.ruleForm;
            this.sendMsg();
          }
        }
      } else {
        let result = this.ruleForm2.some(
          (item) =>
            item.safetyTechniciansCertificate ===
            this.ruleForm.safetyTechniciansCertificate
        );
        if (result) {
          this.$message.error("专家重复,请修改！");
        } else {
          this.ruleForm2.push(this.ruleForm);
          this.sendMsg();
        }
      }
    },
    cancle() {
      this.clear();
      this.dialogVisible = false;
    },
    clear() {
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
</style>