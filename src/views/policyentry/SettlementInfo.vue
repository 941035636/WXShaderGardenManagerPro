<template>
  <div id="SettlementInfo">
    <Title :titles="title"></Title>
    <el-form :model="settForm" label-width="130px" label-position="left" style="margin-left:30px">
      <el-form-item label="保费支付方式" required>
        <span :class="settForm.isPayType == '1'? 'btnA' : 'btnB'" @click="getBtn('1')">
          直接支付
        </span>
        <!-- <span :class="settForm.isPayType == '2'? 'btnA' : 'btnB'" @click="getBtn('2')">
          江泰转付
        </span> -->
      </el-form-item>
    </el-form>
    <SettlementAdd  v-if="!viewFlag" ref="settlementAdd" @handleList="handleList"/>
    <SettlementScale v-else ref="settlementScale" :settForm="settForm" @handleList="handleList" :cost="cost" />
  </div>
</template>
<script>
import Title from './components/Title'
import SettlementAdd from './components/SettlementAdd'
import SettlementScale from './components/SettlementScale'
export default{
  components:{
		Title,SettlementAdd,SettlementScale
	},
  data() {
		return {
      title:'结算信息',
      settForm:{
        isPayType:"1",
        settlementBranch:"", //结算机构
        settlementBranchName:"", // 结算机构名称
        settlementDepartment:"", //结算部门
        settlementDepartmentName:"", //结算部门名称
        commissionTotal:0, // 计算出来的结算总金额
        transfer:"1", // 是否转付
        transferCompanyCode:"", // 不分别转付时转付公司
        transferCompanyName:"", // 不分别转付时转付公司(名称)
      },
      viewFlag:false,
      cost:this.$store.getters.policyInfo.premium//this.$store.getters.policyentry.policyInfo.amount
		};
	}, 
  created(){
    this.getAgain();
  },  
  methods:{
    reset(){ // 重置结算页面数据
      this.$store.commit("updateCompanyForm",null);
      this.handleList(false)
    },
    handleList(val){
      this.viewFlag = val;
      setTimeout(()=>{
        if(val){
          // 有缓存调用缓存回显数据
          if(this.$store.getters.companyForm && this.$store.getters.companyForm.settlementBranch){
            this.$refs.settlementScale.viewData();
          }else{
            this.$refs.settlementScale.getCompanyRatio('3');
            this.$refs.settlementScale.getBranch()
            this.$refs.settlementScale.getDepart()
          }
        }else{
          this.$refs.settlementAdd.getVuexTableList();
        }
      },100)
    },  
    getAgain(){ // 回显数据
      if(this.$route.query.flag == 'again'){
        this.viewFlag = true;
        this.handleList(true)
        this.settForm = this.$store.getters.companyForm
        setTimeout(()=>{
          this.$refs.settlementScale.viewData();
        },100)
      }
    },
    getBtn(val) {
      if(!this.viewFlag){
        this.settForm.isPayType = val
      }
    },
  },
  // 离开当前组件会出发改钩子函数
  beforeRouteLeave (to, from, next) {
    if(to.path != '/PolicyPreviewDetail' && to.path != '/order/offline/add'){
      this.$store.commit("updateCompanyForm", {});
      this.$store.commit("updateCompanyRatio", {});
			sessionStorage.removeItem('vuex')
			sessionStorage.removeItem('inusureCompanys')
      sessionStorage.removeItem('inusureCompanysData')
		} 
		next();
  },
}
</script>
<style lang="less">
  #SettlementInfo{
    background-color: #ffffff;
    font-size: 14px;
    color: #333333;
    padding-bottom: 30px;
    box-sizing: border-box;
    padding: 20px;
    .btnA {
      display: inline-block;
      width: 100px;
      border: 1px solid #1890ff;
      text-align: center;
      background: #1890ff;
      color: #fff;
      line-height: 30px;
      margin: 0 10px;
      border-radius: 5px;
      cursor:pointer
    }
    .btnB {
      line-height: 30px;
      display: inline-block;
      width: 100px;
      border: 1px solid #1684fc;
      text-align: center;
      color: #1684fc;
      margin: 0 10px;
      border-radius: 5px;
      cursor:pointer
    }
  }
</style>