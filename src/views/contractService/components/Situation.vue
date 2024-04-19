<template>
  <div id="Situation">
    <div class="set-box">
      <span class="set-num">企业名称：</span
      ><span style="color: #287fdd">{{ params.customerName }}</span>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="续约状态："
        prop="renewalStatus"
        class="form-div-button"
      >
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

      <div v-if="ruleForm.renewalStatus == 2">
        <div>
          <el-form-item label="续约合同编号：">
            <el-col :span="14">
              <el-input
                type="text"
                v-model.trim="contractNO"
                placeholder="请输入"
              ></el-input>
            </el-col>
            <el-button
              type="primary"
              style="margin-left: 12px"
              @click="inquireCloick"
              >查询</el-button
            >
          </el-form-item>

          <el-form-item label="客户名称：">
            <el-input
              placeholder="请输入客户名称"
              v-model="customerName"
              :disabled="true"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="合同期间：">
            <div style="display: flex">
              <div style="width: 310px; margin-right: 10px">
                <el-input
                  placeholder="合同起期"
                  v-model="beginDate"
                  :disabled="true"
                >
                </el-input>
              </div>
              <p>-</p>
              <div style="width: 310px; margin-left: 10px">
                <el-input
                  placeholder="合同止期"
                  v-model="finishName"
                  :disabled="true"
                >
                </el-input>
              </div>
            </div>
          </el-form-item>
        </div>
      </div>

      <div v-else>
        <el-form-item label="选择原因：" prop="reasonWxEnumArary">
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
        <el-form-item label="跟踪情况：" prop="trackInfo">
          <el-input
            type="textarea"
            v-model="ruleForm.trackInfo"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </div>
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
      currentReasonWxEnum: [],

      contractNO: "",
      newCustonne: "", //查到的合同编号
      customerName: "",
      beginDate: "",
      finishName: "",

      ruleForm: {
        ids: [],
        renewalStatus: "2",
        trackInfo: "",
        reasonWxEnumArary: [],

        contractEndDate: "", //续约合同止期
        contractNo: "", //续约客户合同编号
        contractStartDate: "", //续约合同起期
        customerName: "", // 续约客户名称
        firstReasonCode: "", //  未续原因一级
        firstReasonName: "", //   未续原因一级
        managerCode: "", //关联客户经理编码
        managerName: "", //关联客户经理名称
        renewalStatus: "", //续约跟进类型
        secondReasonCode: "", //未续原因二级
        secondReasonName: "", //未续原因二级
        trackInfo: "", // 未续原因描述,
      },

      contractNoinput: "", //续约合同编号
      rules: {
        renewalStatus: [
          {
            required: true,
            message: "请选择未续类型",
            trigger: "change",
          },
        ],

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
          code: 2,
          label: "已续约",
          value: "YXY",
        },

        {
          code: 3,
          label: "流失",
          value: "LS",
        },
        {
          code: 4,
          label: "未续",
          value: "WX",
        },
      ],
    };
  },
  watch: {
    params: {
      handler(newValue, oldValue) {
        console.log('handler',newValue);
        this.ruleForm.ids = [newValue.id];
        this.ruleForm.managerCode = newValue.managerCode;
        this.ruleForm.managerName = newValue.managerName;
        if (newValue.renewalStatus == 3 || newValue.renewalStatus == 4) {
          this.ruleForm.trackInfo = newValue.trackInfo;
          this.ruleForm.reasonWxEnumArary = newValue.reasonWxEnumArary;

          // 流失与未续 状态回显
          this.setRenewalStatus({
            code: newValue.renewalStatus,
            value:
              newValue.renewalStatus == 3
                ? "LS"
                : newValue.renewalStatus == 4
                ? "WX"
                : "",
          });
        } else {
          this.ruleForm.renewalStatus = 2;
          this.ruleForm.trackInfo = "";
          this.ruleForm.reasonWxEnumArary = [];

          this.contractNO=""
          this.customerName = "";
          this.beginDate = "";
          this.finishName = "";
          this.newCustonne = "";

        }
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
  methods: {
    onCancel() {
      this.$emit("sitCancel");
    },

    async inquireCloick() {
      if (this.contractNO == "") {
        this.$message.error("请输入合同编号");
        return;
      }

      let res = await this.renewalService.renewDetail(this.contractNO);
      if (res.data.code == "0000") {
        if (res.data.data) {
          this.customerName = res.data.data.customerName;
          this.beginDate = res.data.data.startDate;
          this.finishName = res.data.data.endDate;
          this.newCustonne = res.data.data.no;
        } else {
          this.$message.error("请先提交OA完成续约合同的流程，再查询关联。");
          this.customerName = "";
          this.beginDate = "";
          this.finishName = "";
          this.newCustonne = "";
        }
      }
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
      };
      let renewalReason = this.currentReasonWxEnum.find(
        (item) => item.code === form.reasonWxEnumArary[0]
      );
      if (this.ruleForm.renewalStatus == 2) {

        if (!this.newCustonne) {
          this.$message.error("请先提交OA完成续约合同的流程，再查询关联。");
          return
        }

       
        form = {
          contractNo: this.newCustonne, //后台返回的合同编号
          customerName: this.customerName,
          contractStartDate: this.beginDate,
          contractEndDate: this.finishName,
          ids: this.ruleForm.ids,
          renewalStatus: this.ruleForm.renewalStatus,
          managerCode: this.ruleForm.managerCode,
          managerName: this.ruleForm.managerName,

          firstReasonCode: "",
          firstReasonName: "",
          secondReasonCode: "",
          secondReasonName: "",
          trackInfo: "",
        };
      } else {
        if (renewalReason) {
          form.firstReasonCode = form.reasonWxEnumArary[0];
          form.firstReasonName = renewalReason.name;
          if (form.reasonWxEnumArary[1]) {
            let secondReasonCode = renewalReason.children.find(
              (item) => item.code === form.reasonWxEnumArary[1]
            );
            form.secondReasonCode = form.reasonWxEnumArary[1];
            form.secondReasonName = renewalReason.name;
          } else {
            form.secondReasonCode = "";
            form.secondReasonName = "";
          }
        } else {
          this.$message.error("请补全原因");
          return;
        }
        delete form.reasonWxEnumArary;
      }
      let {
        data: { code },
      } = await this.renewalService.followUpContract(form);
      if (code == "0000") {
        this.$message.success("设置成功");
        this.$emit("onSubmit");
      }
    },
    onSubmit(formName) {
      this.ruleForm.ids = [this.params.id];
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.renewalInfo();
        } else {
          return false;
        }
      });
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
      width: 104px;
      text-align: right;
      margin-right: 4px;
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
  .el-form-item__label {
    width: 115px !important;
  }
  .el-form-item__content {
    margin-left: 115px !important;
  }
}
</style>