<template>
  <el-dialog
    title="特种设备单位"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="45%"
    
    @open="getInit"
  >
    <div id="companyDetail">
      <el-form label-position="left">
      
          <p class="company_title">{{data.custFullName}}</p>
    
        <el-form-item label="社会信用代码：">
          <span>{{data.blCode}}</span>
        </el-form-item>
        <!-- <el-form-item label="行业分类：">
          <span>{{industryName}}</span>
        </el-form-item>
        <el-form-item label="管理分类：">
          <span>{{manageName}}</span>
        </el-form-item> -->
        <el-form-item label="实际经营地址：">
       
          <span>{{address}}</span>
        </el-form-item>
        <el-form-item label="联系人：">
          <span>{{data.contactName}}</span>
        </el-form-item>
      </el-form>
      <div style="text-align: right; margin: 30px 0">
        <el-button type="warning" round @click="dialogVisible = false"
          >确 认</el-button
        >
      
      </div>
    </div>
  </el-dialog>
</template>

<script>
import userManage from "@/service/userManage.js";
export default {
  name: "HighRiskDetails",

  data() {
    return {
      userManage: new userManage(),
      data: {},
      dialogVisible:false,
      userCode:'',
    };
  },
  computed: {
    address() {
      let result = "";
      result =
        this.data.provinceName +
        " / " +
        this.data.cityName +
        " / " +
        this.data.countyName +
        " / " +
        this.data.streetName +
        " / " +
        this.data.detailAddress;
      return result;
    },

    industryName() {
      let name = [];
      let result = "";
      if (this.data.sysDictItemEntitys) {
        this.data.sysDictItemEntitys.forEach((item) => {
          name.unshift(item.itemText);
        });
        result = name.join(",");
      }
      return result;
    },
    manageName() {
      let name = [];
      let result = "";
      if (this.data.administrations) {
        this.data.administrations.forEach((item) => {
          name.unshift(item.itemText);
        });
        result = name.join(",");
      }
      return result;
    },
  },

  methods: {
    async getInit() {
      this.getOrgList();
    },
    async getOrgList() {
   
      let res = await this.userManage.enterpriseDetail(this.userCode);
      if (res.code === "0000") {
        this.data = res.data;
      }
    },

  },
};
</script>

<style scoped lang="less">
</style>
<style>

#companyDetail{
  padding-left: 40px;
}
#companyDetail .company_title{
font-size: 18px;
margin-bottom: 10px;
}

#companyDetail .el-form-item{
  margin: 0;
  color: #000;
}
</style>


