<template>
  <div id="Renew">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :header-cell-style="getRowClass"
      border
      >
      <el-table-column label="选择" align="center" width="65">
        <template slot-scope="scope">
						<el-checkbox-group
              v-model="scope.row.checkBox"
              @change="choosePro(scope.row, scope.$index)"
              >           
              <el-checkbox :label="true">&nbsp;</el-checkbox
              >          
            </el-checkbox-group>
					</template>
      </el-table-column>
      <el-table-column
        label="保单信息">
        <template slot-scope="scope">
          <el-row>
              <el-col :span="8">
                <span>
                  投保人名称：<span class="color-blue">{{ scope.row.holderName }}</span>
                </span>
              </el-col>
              <el-col :span="8">
                <span>
                  被保人名称：<span class="color-blue">{{ scope.row.insuredName }}</span>
                </span>
              </el-col>
              <el-col :span="8">
                 <span>保费：<span class="color-red">￥{{ scope.row.afterPrem }}</span></span>
              </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
               <span class="ml20">
                产品名称：{{ scope.row.productName }}
              </span>
            </el-col>
            <el-col :span="8">
              <span>保单号：{{ scope.row.policyNo }}</span>
            </el-col>
            <el-col :span="8">
              <span>保障期间：{{ scope.row.polStartDate|format("YYYY-MM-DD") }} 至 {{scope.row.polEndDate|format("YYYY-MM-DD")}} </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span>出单公司：{{ scope.row.issueCompanyName }}</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 20px;">
      <el-button round @click="cancel">取消</el-button>
      <el-button round type="primary" @click="submitA">确认提交</el-button>
    </div>
  </div>
</template>
<script>
import PolicyentryService from '@/service/PolicyentryService'
export default {
  props:{
    renewalData:{
      default:{},
      type:Object,
      required:true
    },
  },
  data(){
    return{
      PolicyentryService:new PolicyentryService(),
      tableData: [],
      checkData:{},
      total:0,  
    } 
  },
  created(){
    // this.renewal();
  },
  methods:{
    async renewal() {
      console.log(this.renewalData)
      this.tableData = [];
      if(this.renewalData.threeInOneCode  && this.renewalData.insuredName  && this.renewalData.projectCode ) {  //立即投保请求续保数据
        let res = await this.PolicyentryService.getPolicyList(this.renewalData); //查询续保数据
        console.log(res)
        if (res.data.list != null && res.data.code == "0000" && res.data.msg != "无查询数据") {
          this.total = res.data.total
          for(var i = 0; i<res.data.list.length;i++){
            let item = res.data.list[i];
            let typeil = true;
            typeil = this.$stringHelper.renewalIndustry(item) // 验证保单是否符合续保行业
            item["typeil"]=typeil;
            item["checkBox"] = false;
            this.tableData.push(item)
          }
        }else{
          
        }
      }
    },
    choosePro(val){
      this.checkData = val;
    },
    cancel(){
      this.$emit('handlerCancel')
    },
    submitA(){
      var num =0;
      for(var i =0;i<this.tableData.length;i++){
        let item = this.tableData[i];
        if(item.checkBox){
          num++
        }
      }
      if(num > 1){
        this.$message.warning("只能选择一张续保保单");
        return false;
      }
      console.log(this.total,num)
      if(this.total>0 && num == 0){
        this.$message.warning("至少选择一张续保保单");
        return false;
      }
      this.$emit('handlerSubmit',this.checkData)
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:center;'
      } else {
        return ''
      }
    },
  }
}
</script>
<style lang="less">

</style>