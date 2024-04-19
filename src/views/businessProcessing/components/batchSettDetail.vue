<template>
  <div id="batchSettDetail">
    <p class="settDetail-title">结算信息</p>
    <SettInfo :policyDetail="settlementData"></SettInfo>
  </div>
</template>
<script>
import SettInfo from "./settInfo";
 export default{
  props:{
    settlementData:{}
  },  
  components:{
    SettInfo
  },
  data(){
    return{
      
    }
  },

 }
</script>
<style scoped lang="less">
 #batchSettDetail{
  width: 100%;
	height: 100%;
	border: 1px solid #DEE1E8;
	box-sizing: border-box;
  .settDetail-title{
    width: 100%;
    padding-left: 20px;
    line-height: 60px;
    color: #53A5FF;
    font-size: 16px;
  }
 }
</style>