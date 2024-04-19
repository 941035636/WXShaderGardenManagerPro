<template>
  <div id="settInfo">
    <div class="sett-information">
      <p class="mb20">保费支付方式：直接支付</p>
      <p v-if="!policyDetail.name">保单保费：{{policyDetail.afterPrem}}</p>
      <p v-else>{{ policyDetail.name }}：{{ policyDetail.afterPrem }}</p>
      <el-table :data="policyDetail.insuranceCompanyVOS" border style="width: 100%;margin-top:20px;" :header-cell-style="getRowClass">
        <el-table-column align="center" prop width="50" type="index" label="序号"></el-table-column>
        <el-table-column  label="承保公司" align="center" min-width="150"> 
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column  label="是否出单" align="center" min-width="80">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.role1" disabled v-for="(item,index) in roleList" :key="index">
              <el-radio :label="item.code" class="ml10">{{ item.name }}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column  label="承保比例（%）" align="center" min-width="80">
          <template slot-scope="scope">
            {{ (scope.row.shareRate*100).toFixed(2) }}
          </template>
        </el-table-column>
        <!-- <el-table-column  label="保单号" align="center" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.plicyNo }}
          </template>
        </el-table-column> -->
        <el-table-column  label="保费(元)" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.sharePremium }} 
          </template>
        </el-table-column>
      </el-table>
      <div class="mt20 mb20">
        <span>佣金支付方式：保险公司</span>
      </div>
      <el-table :data="settList" border style="width: 100%;margin-top:20px;" :header-cell-style="getRowClass">
      <el-table-column align="center" prop width="50" type="index" label="序号"></el-table-column>
      <!-- <el-table-column  label="承保公司" align="center" min-width="120"> 
        <template slot-scope="scope">
          {{ scope.row.insuranceCompanyName }}
        </template>
      </el-table-column> -->
      <el-table-column  label="结算保险公司" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column  label="保费是否含税" align="center" min-width="80">
        <template slot-scope="scope">
          <div>
            <el-radio-group v-model="scope.row.hasTax" disabled v-for="(item,index) in taxList" :key="index">
              <el-radio :label="item.code" class="ml10">{{ item.name }}</el-radio>
            </el-radio-group>
          </div>
          <!-- <div v-else>
            <span>--</span>
          </div> -->
        </template>
      </el-table-column>
      <!-- /佣金金额   7月24因批单从新计算的问题（特设和安责都无固定的情况所以隐藏） min-width="150" -->
      <el-table-column  label="佣金率（%）" align="center" min-width="100">
        <template slot-scope="scope">
          <!-- <el-row>
            <el-col :span="14" class="text-center">
              <el-radio-group v-model="scope.row.commissionType" disabled v-for="(item,index) in commissionList" :key="index">
                <el-radio :label="item.code" class="ml10">{{ item.name }}</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="10" class="text-center"> -->
              <span class="ml35">
                {{ scope.row.commissionType == '00'?(scope.row.commissionValue *100).toFixed(2)+'%' :scope.row.commissionValue+'元' }}
              </span>
            <!-- </el-col>
          </el-row> -->
          <!-- <div v-else>
            <span>--</span>
          </div> -->
        </template>
      </el-table-column>
      <el-table-column  label="结算金额（元）" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.settlementAmount }}
        </template>
      </el-table-column>
      <el-table-column  label="结算比例（%）" width="120" align="center">
        <template slot-scope="scope">
          {{ (scope.row.settlementRatio *100).toFixed(2)}} 
        </template>
      </el-table-column>
      <el-table-column  label="结算保费（元）" width="120" align="center">
        <template slot-scope="scope">
          {{ Number(scope.row.settlementRatioAmount).toFixed(2) }}
        </template>
      </el-table-column>
    </el-table>
      <el-row class="mt20 mb20">
        <el-col :span="8">
          <p>单位名称：{{ branchName }}</p>
        </el-col>
        <el-col :span="8">
          <p>核算部门：{{ departmentName }}</p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
	
<script>
export default {
  name:'settInfo',
  props:{
    policyDetail:{}
  },
	data() {
		return{
      roleList:[
        {
          name:"是",
          code:"01",
        },
        {
          name:"否",
          code:"02",
        },
      ],
      taxList:[
        {
          name:"是",
          code:"01",
        },
        {
          name:"否",
          code:"00",
        },
      ],
      commissionList:[
        {
          name:"比例",
          code:"00"
        },
        {
          name:"固定",
          code:"01"
        },
      ],
      settList:[],
      branchName:"",
      departmentName:"",
    }
	},
  mounted(){
    console.log(this.policyDetail,'policyDetail')
    this.settData();
  },
	methods: {
    settData(){
      console.log(this.policyDetail.settlementDepartmentVOs,"sdfdsfdsf")
      this.settList = this.getSettList(this.policyDetail.insuranceCompanyVOS,this.policyDetail.settlementDepartmentVOs[0].settlementCompanyVOS)
      this.branchName = this.policyDetail.settlementDepartmentVOs[0].branchName
      this.departmentName = this.policyDetail.settlementDepartmentVOs[0].departmentName
    },
    getSettList(arr,arr1){
      const result = [];
      for (let i = 0; i < arr1.length; i++) {
        const codePrefix = arr1[i].code.split(".")[0];
        const insuranceCompany = arr.find(company => company.code.split(".")[0] === codePrefix);
        if (insuranceCompany) {
          const newItem = Object.assign({}, arr1[i]);
          newItem.insuranceCompanyName = insuranceCompany.name;
          result.push(newItem);
        } else {
          result.push(arr1[i]);
        }
      }
      return result;
    },
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return 'background-color: #EFF1F6;color:#6683D5;font-weight: 600;height:40px;';
			} else {
				return "";
			}
		},
	},
}

</script>

<style scoped lang="less">
#settInfo{
  margin-top:20px;
  .sett-information{
    width: 100%;
    height: 100%;
    padding: 20px;
    // border: 1px solid #DEE1E8;
    box-sizing: border-box;
    background: #fff;
  }
}

</style>
