<template>
  <div id="batchSettInfo">
    <el-dialog title="业务结算信息" :visible.sync="dialogBatchSett" width="1200px" :append-to-body="false">
      <SettInfo :policyDetail="settlementData"></SettInfo>
      <div class="text-center">
        <el-button @click="dialogBatchSett=false"> 取 消 </el-button>
        <el-button type="primary" @click="submitBatch()"> 提 交 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SettInfo from "./settInfo";
export default{
  props:{
    settlementData:{}
  },  
  components:{
    SettInfo,
  },
  data(){
    return{
      dialogBatchSett:false,
    }
  },
  methods:{
    submitBatch(){
      console.log(this.$parent,'this.$parent')
      this.$parent.$parent.searchviewsFun();
    },
  }
}
</script>
<style lang="less">
  #batchSettInfo{
    .el-dialog__body {
      padding:0 20px 30px 20px;
    }
  }
</style>