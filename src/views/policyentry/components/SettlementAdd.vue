<template>
  <div id="SettlementAdd">
    <el-table :data="tableList" border style="width: 100%;" :header-cell-style="getRowClass">
      <el-table-column align="center" prop width="50" type="index" label="序号"></el-table-column>
      <el-table-column  label="承保公司" align="center"> 
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.name"
            filterable
            remote
            default-first-option
            reserve-keyword
            placeholder="请输入承保公司"
            :remote-method="remoteMethod"
            @change="dealCompany(scope.row, scope.$index)"
            class="w300"
            @focus="dealChange"
          >
            <el-option
              v-for="(item, index) in companyList"
              :key="index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column  label="承保比例（%）" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.ratio" class="w300" @change="changeRatio"></el-input>
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="120" align="center">
        <template slot-scope="scope">
          <span @click="addTable" class="pointer color-blue">添加</span>
          <span @click="delTable(scope.$index)" class="pointer color-blue">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:20px;">
      <el-button size="medium" @click="back">上一步</el-button>
      <el-button size="medium" @click="reset">重置</el-button>
      <el-button type="primary" size="medium" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>

import userManageService from "@/service/userManageService";
export default{
  components:{
		
	},
  data() {
		return {
      userManageService: new userManageService(),
      companyList:[],
      newCompanyList:[], // 保险公司集合，（防止新增不同保险公司时显示编码的问题）
      tableList:[
        {
          code:"", // 转付公司编码
          name:"", // 转付公司名称
          ratio:"", // 转付比例
          amount:"", // 转付金额
          plicyNo:this.$store.getters.policyInfo.policyNo
        }
      ],
		};
	},
  created(){
    if(this.$store.getters.companyRatio && this.$store.getters.companyRatio.length>0){
      this.getVuexTableList();
    }
  },  
  methods:{
    changeRatio(){ // 当vuex中有值时，修改了比例，结算页面重置
      if(this.$store.getters.companyRatio && this.$store.getters.companyRatio.length>0){
        this.$parent.reset();
      }
    },
    async remoteMethod(query) {
      if (query !== "") {
        let data = {"conditions":{"name":query},"paging":{"pn":1,"ps":1000}}
        let res = await this.userManageService.getInscompany(data);
        if (res.data.code == "0000") {
          if (res.data.list.length == 0) {
            this.$message.error("查询不到保险公司！");
          }
          this.companyList = this.$stringHelper.mergeArray(
            this.newCompanyList,
            res.data.list
          );
        }
      } else {
        this.companyList = [];
      }
    },
    //处理承保公司
    dealChange() {
      this.companyList = this.$stringHelper.basicUnique(
        this.newCompanyList,
        "code"
      );
    },
    //保险公司名称
    dealCompany(val, index) {
      val.code = this.companyList.find( item => item.name == val.name).code
      this.newCompanyList.push(
        this.companyList.find((item) => item.name === val.name)
      );
      if(this.$store.getters.companyRatio && this.$store.getters.companyRatio.length>0){ // 当vuex中有值时，修改了保险公司，结算页面重置
        this.$parent.reset();
      }
    },
    
    checkCompany() {
      var isRepeat = this.$stringHelper.isRepeat(
        this.tableList,
        "code"
      );
      if (isRepeat) {
        return "保险公司不可重复";
      }
      let rateList = [];
      let codeSet = new Set(); // 创建一个Set对象用于去重
      for (let i = 0; i < this.tableList.length; i++) {
        let item =this.tableList[i]
        if (item.code) {
          rateList.push(item.ratio);
        } else {
          return "请填写承保公司";
        }
        let code = item.code.split('.')[0]; // 获取code前面的值
        if(codeSet.has(code)){ // 如果Set中已包含该值，说明有重复
          return "承保公司的总公司不能是同一家机构，请修改"
        }else {
          codeSet.add(code); // 将值添加到Set中
        }
        let reg = /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/;  
        let valReg = reg.test(item.ratio)
        if(!valReg){
          return "承保比例为大于0小于100，小数保留两位";
        }
      }
      if (this.$stringHelper.addNumber(...rateList) != 100) {
        return "承保比例累计应为100%,请修改";
      }
    },
    getVuexTableList(){
      this.tableList = this.$store.getters.companyRatio;
      // this.companyList = this.tableList.map(item => {
      //   return {
      //     companyId:item.code,
      //     companyName:item.name
      //   }
      // })
      // this.newCompanyList = this.tableList.map(item => {
      //   return {
      //     companyId:item.code,
      //     companyName:item.name
      //   }
      // })
    },  
    submit(){
      if (this.checkCompany()) {
        return this.$message.error(this.checkCompany());
      }
      this.$store.commit("updateCompanyRatio", this.tableList);
      this.$emit('handleList',true)
    }, 
    back(){
      this.$router.push({
        path: "/order/offline/add",
        query: {
            flag: "again",
        },
      });
    },
    reset(){
      this.tableList = [
        {
          code:"",
          name:"",
          ratio:"",
          plicyNo:this.$store.getters.policyInfo.policyNo
        }
      ]
      this.$store.commit("updateCompanyRatio",null);
      this.$store.commit("updateCompanyForm", null);
    },
    addTable(){
      this.tableList.push(
        {
          code:"",
          name:"",
          ratio:"",
          plicyNo:this.$store.getters.policyInfo.policyNo
        }
      )
    },
    delTable(index){
      this.tableList.splice(index, 1)　
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "text-align:center";
			} else {
				return "";
			}
		},
  }
}
</script>
<style lang="less">
  #SettlementAdd{
    background-color: #ffffff;
    font-size: 14px;
    color: #333333;
    padding-bottom: 30px;
    box-sizing: border-box;
    margin:0 40px;
    .w300{
      width:300px;
    }
  }
</style>