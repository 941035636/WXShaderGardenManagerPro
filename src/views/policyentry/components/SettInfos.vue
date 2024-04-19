<template>
	<div id="SettInfos">
		<Title :titles="title"></Title>
    <div class="content-tabel">
      <el-row>
        <el-col :span="8">
          <p>佣金支付方式：{{ settForm.isPayType=='1'?'直接支付':'江泰转付' }}</p>
        </el-col>
        <el-col :span="8">
          <p>单位名称：{{settForm.settlementBranchName}}</p>
        </el-col>
        <el-col :span="8">
          <p>核算部门：{{settForm.settlementDepartmentName}}</p>
        </el-col>
      </el-row>
      <el-table :data="settForm.tableData" border style="width: 100%;margin-top:20px;" :header-cell-style="getRowClass">
        <el-table-column align="center" prop width="50" type="index" label="序号"></el-table-column>
        <el-table-column  label="承保公司" align="center" min-width="150"> 
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column  label="是否出单" align="center" min-width="80">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.isIssue" disabled v-for="(item,index) in taxList" :key="index">
              <el-radio :label="item.code" class="ml10">{{ item.name }}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column  label="承保比例（%）" align="center" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.ratio }}
          </template>
        </el-table-column>
        <el-table-column  label="保单号" align="center" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.plicyNo }}
          </template>
        </el-table-column>
        <el-table-column  label="保费(元)" width="120" align="center">
          <template slot-scope="scope" v-if="scope.row.amount">
            {{ scope.row.amount }} 
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="settForm.tableList" border style="width: 100%;margin-top:20px;" :header-cell-style="getRowClass">
      <el-table-column align="center" prop width="50" type="index" label="序号"></el-table-column>
      <el-table-column  label="承保公司" align="center" min-width="120"> 
        <template slot-scope="scope">
          {{ scope.row.companyName }}
        </template>
      </el-table-column>
      <el-table-column  label="结算保险公司" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column  label="保费是否含税" align="center" min-width="80">
        <template slot-scope="scope">
          <el-radio-group v-model="scope.row.hasTax" disabled v-for="(item,index) in taxList" :key="index">
            <el-radio :label="item.code" class="ml10">{{ item.name }}</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column  label="佣金率（%）/佣金金额" align="center" min-width="150">
        <template slot-scope="scope">
          <el-radio-group v-model="scope.row.commissionType" disabled v-for="(item,index) in commissionList" :key="index">
            <el-radio :label="item.code" class="ml10">{{ item.name }}</el-radio>
          </el-radio-group>
          <el-input class="w120" v-model="scope.row.commissionValue" disabled placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column  label="结算金额（元）" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.settlementAmount }}
        </template>
      </el-table-column>
    </el-table>

    </div>
   
	</div>
</template>

<script>
import Title from './Title'
export default {
	name:'SettInfos',
	components:{
		Title
	},
  props:{
    settForm:{
      default: ()=>{return []},
      required: true,
      type: Object
    }
  },
	data() {
		return {
			title:'结算信息',
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
		};
	},
	computed: {
		
	},
	created() {
		
	},
	methods: {
    getRowClass({row,column,rowIndex,columnIndex}) {//修改表头样式
      if (rowIndex == 0) {
          return 'background-color: #EFF1F6;color:#6683D5;font-weight: 600;height:40px;';
      } else {
          return 'background: #fff';
      }
		},
	}
};
</script>

<style lang="less">
#SettInfos{
  background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 10px 40px;
	margin-bottom: 0px;
	// margin-top: 20px;
	.content-tabel{
		margin: 20px;
		width: calc(100% - 40px);
		height: 100%;
	}
}
</style>
