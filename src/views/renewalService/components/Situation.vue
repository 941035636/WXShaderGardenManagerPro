<template>
  <div id="Situation">
    <div class="set-box">
      <span class="set-num">企业名称：</span
      ><span style="color: #287fdd">{{ params.branchName }}</span>
    </div>

    <el-form label-width="110px" class="demo-ruleForm">
      <el-form-item label="未续类型：">
        <el-button
          :type="ruleForm.renewalStatus == item.code ? 'warning' : ''"
          size="medium"
          round
          v-for="(item, index) in renewalStatusEnum"
          :key="index"
          class="mr10 w80"
          @click="setRenewalStatus(item)"
          >{{ item.label }}</el-button
        >
      </el-form-item>
    </el-form>

    <el-form v-show="ruleForm.renewalStatus == '200'" label-width="110px">
      <el-form-item label="续保保单号：">
        <span>
          <el-input
            v-model.trim="contractExtension.no"
            placeholder="请输入续保保单号"
            style="width: 400px; margin-right: 24px"
          >
          </el-input>
        </span>
        <span>
          <el-button type="primary" @click="inquireCloick"> 查询</el-button>
        </span>
      </el-form-item>
      <el-form-item label="客户名称：">
        <el-input
          placeholder="请选择"
          v-model="contractExtension.customerName"
          :disabled="true"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="保险期间：">
        <div style="display: flex">
          <div style="width: 310px; margin-right: 10px">
            <el-input
              placeholder="请选择"
              v-model="contractExtension.renewalStartDate"
              :disabled="true"
            >
            </el-input>
          </div>
          <p>-</p>
          <div style="width: 310px; margin-left: 10px">
            <el-input
              placeholder="请选择"
              v-model="contractExtension.renewalEndDate"
              :disabled="true"
            >
            </el-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="保费(元)：">
        <el-input placeholder="请输入保费" v-model="premium" :disabled="true" > </el-input>
      </el-form-item>
    </el-form>
    <el-form
      v-show="ruleForm.renewalStatus != '200'"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- <el-form-item label="未续类型" prop="renewalStatus" class="form-div-button">
                <el-button :type="ruleForm.renewalStatus == item.code ? 'warning' : ''" size="medium" round v-for="(item,index) in renewalStatusEnum" :key="index" class="mr10 w80" @click="setRenewalStatus(item)">{{item.label}}</el-button>
            </el-form-item> -->
      <el-form-item label="选择原因" prop="reasonWxEnumArary">
        <el-cascader
          v-model="ruleForm.reasonWxEnumArary"
          :options="currentReasonWxEnum"
          :props="{
            label: 'name',
            value: 'code',
            children: 'children',
          }"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="跟踪情况" prop="trackInfo">
        <el-input
          type="textarea"
          v-model="ruleForm.trackInfo"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="submit-box">
      <el-button
        type="primary"
        size="small"
        round
        class="cancel"
        @click="onCancel"
        >取消</el-button
      >
      <el-button
        type="success"
        size="small"
        round
        class="submit"
        @click="onSubmit('ruleForm')"
        >确认提交</el-button
      >
    </div>
  </div>
</template>

<script>
import RenewalService from "@/service/renewalService";
export default {
  props: {
    params: {
      type: Object,
      required: true,
      default: function () {
        return {};
      },
    },
    reasonWxEnum: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
    typeList: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
    show: {
      type: Boolean,
    },
  },
  data() {
    return {
      renewalService: new RenewalService(),
      contractExtension: {
        no: "",
      },
      premium: "",
      currentReasonWxEnum: [],
      ruleForm: {
        id: "",
        renewalStatus: "200",
        trackInfo: "",

        reasonWxEnumArary: [],
        policyNo: "",
      },
      rules: {
        // renewalStatus: [
        //     {
        //         required: true,
        //         message: "请选择未续类型",
        //         trigger: "change",
        //     },
        // ],
        reasonWxEnumArary: [
          {
            required: true,
            message: "请选择原因",
            trigger: "change",
          },
        ],
        trackInfo: [
          {
            required: true,
            message: "请填写跟踪情况",
            trigger: "blur",
          },
        ],
      },
      renewalStatusEnum: [
        {
          code: 200,
          label: "已续保",
          value: "YXY",
        },
        {
          code: 300,
          label: "流失",
          value: "LS",
        },
        {
          code: 400,
          label: "未续",
          value: "WX",
        },
      ],
    };
  },
  watch: {
    params: {
      handler(newValue) {
        console.log("newValue", newValue);
        this.ruleForm.id = newValue.id;
        this.ruleForm.policyNo = newValue.policyNo;
        // this.ruleForm.policyNo = "0121350518000332000002";
        this.ruleForm.renewalStatus = newValue.renewalStatus;

        if (newValue.renewalStatus == "300") {
          this.ruleForm.reasonWxEnumArary = [
            newValue.renewalReason,
            newValue.renewalReason2Code,
          ];
          this.ruleForm.trackInfo = newValue.trackInfo;
        } else if (newValue.renewalStatus == "400") {
          this.ruleForm.reasonWxEnumArary = [newValue.renewalReason];
          this.ruleForm.trackInfo = newValue.trackInfo;
        } else {
          this.ruleForm.reasonWxEnumArary = [];
          this.ruleForm.trackInfo = "";
        }

        this.setRenewalStatus({
            code: newValue.renewalStatus,
            value:
              newValue.renewalStatus == 300
                ? "LS"
                : newValue.renewalStatus == 400
                ? "WX"
                : "",

            label:
              newValue.renewalStatus == 300
                ? "流失"
                : newValue.renewalStatus == 400
                ? "未续"
                : "",
          });

        console.log(this.ruleForm, "this.params WATCH");
      },
      immediate: true,
      deep: true,
    },
    show(newValue) {
      if (newValue) {
        this.$refs["ruleForm"].clearValidate();
      }
    },
  },
  mounted() {
    var renewalStatus = {};
    switch (this.ruleForm.renewalStatus) {
      case 300:
        renewalStatus = {
          code: 300,
          label: "流失",
          value: "LS",
        };
        break;

      case 400:
        renewalStatus = {
          code: 400,
          label: "未续",
          value: "WX",
        };
        break;
    }

    this.setRenewalStatus(renewalStatus);
  },
  methods: {
    async inquireCloick() {
      if (this.contractExtension.no) {
        let res = await this.renewalService.renewDetails(
          this.contractExtension.no,
          "2"
        );
        if (res.data.code == "0000") {
          if (res.data.data) {
            this.contractExtension = res.data.data;
            this.premium = res.data.data.premium
          } else {
            this.$message.error("无效保单号、请在渠道平台或江泰E保录入");
          }
        }
      } else {
        this.$message.error("续保保单号不能为空");
      }
    },
    onCancel() {
      this.$emit("sitCancel");
    },
    setRenewalStatus(item) {
      this.ruleForm.renewalStatus = item.code;
      this.currentReasonWxEnum = this.reasonWxEnum.filter(
        (v1) => v1.pcode == item.value
      );
    },
    async renewalInfo() {
      let form = {
        ...this.ruleForm,
        customerName: this.contractExtension.customerName,
        renewalPolicyNo: this.contractExtension.no,
        afterPremium: this.premium,
        polStartDate: this.contractExtension.renewalStartDate,
        polEndDate: this.contractExtension.renewalEndDate,
      };
      if (this.ruleForm.renewalStatus != "200") {
        let renewalReason = this.currentReasonWxEnum.find(
          (item) => item.code === form.reasonWxEnumArary[0]
        );
        if (renewalReason) {
          form.renewalReason = form.reasonWxEnumArary[0];
          form.renewalReasonName = renewalReason.name;
          if (form.reasonWxEnumArary[1]) {
            let renewalReason2 = renewalReason.children.find(
              (item) => item.code === form.reasonWxEnumArary[1]
            );
            form.renewalReason2 = form.reasonWxEnumArary[1];
            form.renewalReason2Name = renewalReason2.name;
          }

          // 提交前清空已续保内容
          form.customerName="";
          form.renewalPolicyNo="";
          form.afterPremium="";
          form.polStartDate="";
          form.polEndDate="";
          this.contractExtension.customerName="";
          this.contractExtension.no="";
          this.premium="";
          this.contractExtension.renewalStartDate="";
          this.contractExtension.renewalEndDate="";
        } else {
          this.$message.error("补全原因");
          return;
        }
      }
      delete form.reasonWxEnumArary;

      console.log("form", form);

      let {
        data: { code },
      } = await this.renewalService.renewalInfo(form);
      if (code == "0000") {
        this.$message.success("设置成功");
        (this.ruleForm = {
          id: "",
          renewalStatus: "",
          trackInfo: "",
        }),
          this.$emit("onSubmit");
      }
    },
    onSubmit(formName) {
      this.ruleForm.id = this.params.id; // 监听params第二次进入不会触发，重新赋值id
      if (this.ruleForm.renewalStatus == "200") {
        if (
          this.contractExtension.customerName &&
          this.contractExtension.no &&
          this.contractExtension.renewalStartDate &&
          this.contractExtension.renewalEndDate&&
          this.premium > 0
        ) {
          this.renewalInfo();
        } else {
          if(!this.contractExtension.no){
            this.$message.error('请输入保单号');
          }else if(!this.contractExtension.customerName && !this.contractExtension.renewalStartDate && !this.premium){
            this.$message.error('请先查询续保详情');
          }else if(this.premium <= 0){
            this.$message.error('请检查，保费金额必须大于0');
          }
        }
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.renewalInfo();
          } else {
            return false;
          }
        });
      }
    },
  },
};
</script>

<style lang="less">
#Situation {
  .set-box {
    display: flex;
    font-size: 14px;
    margin-bottom: 22px;
    .set-num {
      width: 100px;
      text-align: right;
    }
  }
  .submit-box {
    text-align: right;
  }

  .cancel {
    border-color: #bbbbbb;
    color: #5a5a5a;
    background: #f5f5f5;
  }

  .submit {
    border-color: #ffa940;
    color: #fff;
    background: #ffa940;
  }
  .form-div-button {
    .w80 {
      min-width: 80px;
      border: 1px solid #e6a23c;
      color: #e6a23c;
    }
    .el-button--warning {
      background-color: #ffe7ba;
    }
    .check-button {
      display: inline-block;
      border: 1px solid #e6a23c;
      color: #e6a23c;
      height: 36px;
      line-height: 36px;
      border-radius: 20px;
      padding: 0 20px;
      margin-right: 20px;
      cursor: pointer;
      background-color: #fff;
    }
    .el-button:hover {
      background-color: #ffe7ba;
    }
  }
}
</style>