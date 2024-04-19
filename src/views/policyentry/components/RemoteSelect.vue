<template>
  <div>
    <el-select
      :value="value"
      @input="$emit('input', $event)"
      filterable
      :size="echoSize"
      remote
      :placeholder="echoPlaceholder"
      :remote-method="getCloesCompany"
      :style="echoStyle"
      @change="changeValue"
    >
      <el-option
        v-for="(item,index) in closeList"
        :key="index"
        :label="item.name"
        :value="item.name"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
import userManageService from '@/service/userManageService'

export default {
  props: {
    value: [Number, String],
    echoSize: {
      type: String,
      default: "",
    },
    echoUnderwritingCompany: {
      type: String,
      default: "",
    },
    echoUnderwritingCompanyCode:{
       type: String,
      default: "",
    },
    echoStyle: {
      type: String,
      default: "",
    },
    echoPlaceholder: {
      type: String,
      default: "",
    },
    settRow:{
      type: Object,
      default: "",
    }
  },
  data() {
    return {
      userManageService: new userManageService(),
      closeList: [],
    };
  },
  methods: {
    changeValue(val){
      this.settRow.code = this.closeList.find(item => item.name == val).code
    },
    //结算公司查询添加
    async getCloesCompany(query) {
      try {
        if (query !== "") {
          // let res = await this.userManageService.getSameHeadCompany({
          //   underCompany: this.echoUnderwritingCompany,
          //   underCompanyCode: this.echoUnderwritingCompanyCode,
          //   settleCompany: query,
          // });
          let num = this.echoUnderwritingCompanyCode.split(".")[0]
          let data = {"conditions":{code:num},"paging":{"pn":1,"ps":1000}}
          let res = await this.userManageService.getInscompany(data);
          if (res.data.code == "0000") {
            this.closeList = res.data.list;
          }
        } else {
          this.closeList = [];
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style lang="less" scoped>
</style>