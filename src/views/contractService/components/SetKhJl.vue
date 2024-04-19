<template>
  <div id="SetKhjL">
    <div class="set-box">
      <span class="set-num">设置数量：</span
      ><span style="color: #287fdd">{{this.params.ids.length}}条数量</span>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="客户经理" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择" size="small" value-key="userCode" @change="jlChange">
          <el-option v-for="item in list" :key="item.userCode" :label="item.linkmanName" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="submit-box">
      <el-button type="primary" size="small" round class="cancel" @click="onCancel">取消</el-button>
      <el-button type="success" size="small" round class="submit" @click="onSubmit('ruleForm')">确认提交</el-button>
    </div>
  </div>
</template>

<script>
import RenewalService from "@/service/renewalService";
export default {
  props: {
    list: {
      type: Array,
      default: [],
      required: true,
    },
    parameter: {
      type: Object,
      default: function () {
        return {};
      },
    },
    show: {
      type: Boolean,
    },
  },
  data() {
    return {
      renewalService: new RenewalService(),
      ruleForm: {
        region: "",
      },
      rules: {
        region: [
          {
            required: true,
            message: "请选择客户经理",
            trigger: "change",
          },
        ],
      },
      params: {},
    };
  },
  watch: {
    parameter: {
      handler(newValue) {
        this.params = newValue;
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
      this.ruleForm.region = "";
      this.$emit("onCancel");
    },
    jlChange(value) {
      this.params.managerName = value.linkmanName;
      this.params.managerCode = value.userCode;
    },
    onSubmit(formName) {
      if(this.params.ids.length == 0) {
        this.$message.error("请选择");
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.renewalManager();
          this.ruleForm.region = "";
        } else {
          return false;
        }
      });
    },
    // 保单追踪修改业务经理信息
    async renewalManager() {
      this.params.ids = Array.from(new Set(this.params.ids));
      console.log('contractRelationManager设置客户经理',this.params);
      let {
        data: { code },
      } = await this.renewalService.contractRelationManager(this.params);
      if (code == "0000") {
        this.$message.success("设置成功");
        this.$emit("onSubmit");
      } else {
        this.$message.error("设置失败");
      }
    },
  },
};
</script>

<style lang="less">
#SetKhjL {
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
}
</style>