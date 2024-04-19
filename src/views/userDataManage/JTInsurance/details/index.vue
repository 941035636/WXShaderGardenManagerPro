<template>
  <div id="insuranceDetail">
    <div class="detailClass">{{organizationName}}机构详情<p class="backBtn">
        <span @click="back" style="color: #FA8C16;margin-left: 40px;cursor: pointer;"><i class="iconfont icon-fanhui"></i>返回列表页</span>
      </p></div>
    <Title  :title="data.orgName"> <p slot="content" v-if="data.jtOrgName" class="jtOrgName"> {{ data.jtOrgName }}</p></Title>
  
    <div class="row">
      
      <el-row type="flex" class="row-bg">  
        <el-col v-if="data.headquartersName" :span="12">
          <span class="title">总公司名称：</span>
          <span>{{ data.headquartersName }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
     
        <el-col :span="12">
          <span class="title">机构编码：</span>
          <span>{{ data.orgCode }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <span class="title">社会信用代码：</span>
          <span>{{ data.businessCode }}</span>
        </el-col>
      
      </el-row>
       <!-- <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <span class="title">安责险业务负责人姓名：</span>
          <span>{{ data.safetyCharger }}</span>
        </el-col>
 
      </el-row>
       <el-row type="flex" class="row-bg">
     
        <el-col :span="12">
          <span class="title">安责险业务负责人服务电话：</span>
          <span>{{ data.safetyChargerPhone }}</span>
        </el-col>
      </el-row> -->
      <el-row type="flex" class="row-bg">
        <el-col :span="16">
          <span class="title">实际经营地址：</span>
          <span>{{ data.provinceName }}</span>
          <span>{{ data.cityName }}</span>
          <span>{{ data.countyName }}</span>
          <span>{{ data.streetName }}</span>
          <span>{{ data.detailAddr }}</span>
        </el-col>
      </el-row>

     
      <el-row type="flex" class="row-bg">
        <el-col :span="2">
          <span class="title">关联产品：</span>
        </el-col>
        <el-col :span="12">
          <el-table
            class="mt20"
            :data="data.accidentProductList"
            border
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="getRowClass"
          >
            <el-table-column
              prop="accidentProductCode"
              label="产品编码"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="accidentProductName"
              label="产品名称"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
      <Title class="mt10" title="账号信息"></Title>
    <div class="row">
<p class="color-orange-dark" style="text-align:right;width:70%">解绑账号后该账号发起的事故预防工作将查询不到，请知悉！</p>
    <el-table
      class="mt20"
      :data="userList"
      border
      style="width: 70%"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="getRowClass"
    >
      <el-table-column
        prop="userLoginAccount"
        label="登录账号"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="userName"
        label="姓名"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="userCode"
        label="用户编码"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button class="color-blue" @click="cancleRelate(scope.row,scope.$index)" type="text"
            >解绑账号</el-button
          >
          <el-button class="color-blue" @click="reset(scope.row)" type="text"
            >重置密码</el-button
          >
        
        </template>
      </el-table-column>
    </el-table>
    </div>
  
 
    <ResetPassword ref="ResetPassword" />
  </div>
</template>

<script>
import Title from "@/components/Title";
import userManage from "@/service/userManage.js";
import ResetPassword from "@/views/userCenter/components/ResetPassword.vue"; // 重置密码
export default {
  name: "InsuranceDetail",
  components: {
    Title,
    ResetPassword
  },
  data() {
    return {
      userManage: new userManage(),
      data: {},

      userList: [],
      prodList: [],
      expertForm: {
        ps: 10,
        pn: 1,
      },
    };
  },
  computed: {
    servicename() {
      if (this.$route.query.type == "jtjg") {
        return "insuranceBrokerSvc";
      } else if (this.$route.query.type == "bxjg") {
        return "insuranceCompanySvc";
      } else if (this.$route.query.type == "jingjijg") {
        return "insuranceBrokerSvc";
      }
    },
    organizationName() {
      if (this.$route.query.type == "jtjg") {
        return "江泰";
      } else if (this.$route.query.type == "bxjg") {
        return "保险";
      } else if (this.$route.query.type == "jingjijg") {
        return "经纪";
      }
    },
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#b8d9fd;text-align:center;color:#0050b3";
      } else {
        return "";
      }
    },
    reset(val) {
      console.log(val);
      let obj = {...val,custFullName:val.userName,userloginId:val.userLoginAccount}
      this.$refs['ResetPassword'].open(obj)
    },
    cancleRelate(row,index){
      console.log(row);
    let  text = '即将解绑账号'+row.userName+', 是否继续?'
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let data = {
            commissionerCode:row.userCode,
            orgId:this.$route.query.code
          }
          let res = await this.userManage.unlinkAccount(this.servicename,data)
          if(res.code=='0000'){
this.$message.success('解绑成功')
this.userList.splice(index,1)
          }
          // this.$message.warning("该功能暂未开发");
        })
        .catch(() => {
          this.$message.info("已取消操作");
        });
    },
 
    // },
    back() {
      this.$router.go(-1);
    },
    async getAccountList(id) {
      let res = await this.userManage.linkAccountList(this.servicename, id);
      if (res.code == "0000") {
        //请求专员列表信息
        this.userList = res.list;
      }
    },
    async initData() {
      let data = {
        servicename: this.servicename,
        code: this.$route.query.code,
      };
      let res = await this.userManage.detailOrganization(data);
      if (res.code === "0000") {
        this.data = res.data;
        this.getAccountList(res.data.id);
      }
    },
  },
};
</script>

<style scoped lang="less" scoped>
#insuranceDetail {
  // margin: 20px;
  position: relative;
  padding: 0px 10px 0;
 
  .detailClass{
    background-color: #fff;
    height: 50px;
    padding-left: 20px;
    line-height: 50px;
    margin-bottom: 10px;
    font-size: 18px;
     .backBtn {
      float: right;
     
      margin-right: 30px;
    }
    
  }
  .jtOrgName{
   margin-top: 20px;
    height: 30px;
    background-color:#ffa940 ;
    border-radius: 15px;
    line-height: 30px;
    color: #fff;
    padding: 0 15px;
    margin-left: 30px;
  }
  .row {
    padding:20px 30px;
    background-color: #fff;
    .row-bg {
      margin-bottom: 20px;
    }
  }
}
</style>
