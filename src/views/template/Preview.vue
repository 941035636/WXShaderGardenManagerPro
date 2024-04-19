<template>
  <div class="temp-preview" id="temp-preview">
    <div class="temp-title">
      {{ $route.query.name }}
      <span @click="submit" class="query-button">保存预览</span>
    </div>
    <div class="temp-content">
      <p>入参示例:</p>
      <div>
        <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 100 }" placeholder="请输入内容" v-model="textarea2"></el-input>
      </div>
    </div>
  </div>
</template>

<script>
import templateService from "@/service/template.js";
export default {
  data: function () {
    return {
      template: new templateService(),
      textarea2: "",
    };
  },
  methods: {
    async submit() {
      let data = JSON.parse(this.textarea2);
      /* let data = {"managerType":"123123","appCode":"123131","holderName":"投保人名称","holderPhone":"123465987","holderAddress":"投保人地址啊啊啊啊啊啊","insureName":"被保人名称","insurePhone":"987654321","insureAddress":"1","one":"2","two":"3","three":"5","businessScope":"12313131","threeInOneCode":"99999999999999","licenseNo":"nihaoaaaa","totalEmployees":"321","managementLevel":"2","totalLimit":"200","eachLimit":"3","perPersonLimit":"30","prem":"3600.00","premCap":"拾万叁仟陆佰伍","trem":"12","startTime":1597213518071,"endTime":1597213518071,"dangerLevel":"2","createName":"张乐","createBy":"12"}
      	let data = {
      	"holderName":"张三",
      	"year":"2022",
      	"policyNo":"BD20220307",
      	"endDate":"2022/03/08",
      	"startDate":"2021/03/08",
      	"prem":"5000",
      	"issueCompanyName":"平安",
      	"mainRiskName":"主线",
      	"addRiskNames":[],
      	"amount":"600",
      	"accidentAmount":"500",
      	"perAmount":"0",
      	"now":"2022-03",
      	"caseNum":"10",
      	"closeCaseNum":"5",
      	"payMoney":"300",
      	"notCloseCaseNum":"5",
      	"estimatedLossAmount":"600",
      	"lossRatio":"37",
      	"deathNum":"6",
      	"injuredNum":"4",
      	"lossAmount":"100",
      	"cases":[],
      	"customerLevel":""
      } */
      if (!data) {
        this.$message.error("请填写示例内容");
        return;
      }
      // {"managerType":"123123","appCode":"123131","holderName":"投保人名称","holderPhone":"123465987","holderAddress":"投保人地址啊啊啊啊啊啊","insureName":"被保人名称","insurePhone":"987654321","insureAddress":"1","one":"2","two":"3","three":"5","businessScope":"12313131","threeInOneCode":"99999999999999","licenseNo":"nihaoaaaa","totalEmployees":"321","managementLevel":"2","totalLimit":"200","eachLimit":"3","perPersonLimit":"30","prem":"3600.00","premCap":"拾万叁仟陆佰伍","trem":"12","startTime":1597213518071,"endTime":1597213518071,"dangerLevel":"2"}
      let res = await this.template.templatePreview(data, this.$route.query.id);
    },
  },
};
</script>

<style scoped lang="less">
.temp-preview {
  .temp-title {
    margin: 10px 0;
    height: 60px;
    line-height: 60px;
    font-size: 20px;
    background-color: #fff;
    padding-left: 12px;
    .query-button {
      top: -4px;
      display: inline-block;
      width: 80px;
      height: 24px;
      background-color: #1890ff;
      text-align: center;
      line-height: 24px;
      margin-left: 20px;
      color: #ffffff;
      cursor: pointer;
      border-radius: 2px;
      font-size: 14px;
    }
  }
  .temp-content {
    background-color: #fff;
    padding: 20px 12px;
  }
}
</style>
