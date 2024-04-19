<template>
    <div>
         <el-dialog title="保费计算详情" :visible.sync="dialogFormVisible"  :close-on-click-modal="modul" width="70%">
        	<el-table 
					:data="tableData"  
					border 
					class="table ts-table"  
				  	@selection-change="handleSelectionChange" 
					ref="multipleTable" 
					height="300" >
				<el-table-column
			      type="index"
                  label="序号"
			      width="55"
			      align="center">
			    </el-table-column>
				<el-table-column  label="设备代码/出厂编号" align="center" width="220">
                    <template slot-scope="scope">
						<span v-if="scope.row.equipmentsCode !=''">{{scope.row.equipmentsCode}}</span>
						<span  v-if="scope.row.licenceNo !='' ">{{scope.row.licenceNo}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="role_name" label="类型" align="center" width="150">
                    <template slot-scope="scope">
						<span v-if="scope.row.elevatorType ==1">直梯</span>
						<span  v-else>扶梯</span>
					</template>
				</el-table-column>
				<el-table-column prop="roleDesc" label="重量（kg）/提升高度（m）" align="center"  width="150">
                    <template slot-scope="scope">
						<span v-if="scope.row.weight !=null">{{scope.row.weight}}kg </span>
						<span  v-if="scope.row.height !=null ">{{scope.row.height}}m</span>
					</template>
				</el-table-column>
				<el-table-column prop="riskPremiumlM" label="基本保费（元）" align="center" width="246">
				</el-table-column>
				<el-table-column prop="riskPremiumlA" label="附加险保费（元）" align="center" width="140">
				</el-table-column>
				<el-table-column prop="subjectPreimum" label="总保险费（元）" align="center" >
				</el-table-column>
				<!-- <el-table-column prop="elevatorYear" label="优惠因子（元）" align="center" width="140">
				</el-table-column> -->
			</el-table>
         </el-dialog>  
    </div>
</template>

<script>
export default {
    props:{
       
    },
    data(){
        return{
            modul:false,
			dialogFormVisible:false,
            tableData:[]
        }
	},
    methods:{
        flagTrue(){
            this.dialogFormVisible=true;
            let policyData = JSON.parse(window.sessionStorage.getItem('policyData'))
            const premiumDetails =policyData.premiumDetails[0]
            for(var i = 0; i<policyData.elevatorMessage.length;i++){
                var subjectCalResults= premiumDetails.subjectCalResults[i];    // 总保费
                policyData.elevatorMessage[i].subjectPreimum=subjectCalResults.subjectPreimum;   // 总保费
                policyData.elevatorMessage[i].riskPremiumlM=0;     // 主线费
                policyData.elevatorMessage[i].riskPremiumlA=0;     // 基本险
                for(var j = 0 ; j<subjectCalResults.riskPremiums.length;j++){
                    if(subjectCalResults.riskPremiums[j].riskFlag=="M"){
                        policyData.elevatorMessage[i].riskPremiumlM=subjectCalResults.riskPremiums[j].riskPremiuml;  
                    }else if(subjectCalResults.riskPremiums[j].riskFlag=="A"){
                         policyData.elevatorMessage[i].riskPremiumlA +=subjectCalResults.riskPremiums[j].riskPremiuml;
                    }
                }
               
            }
            
            this.tableData =  policyData.elevatorMessage
        },
        close(){    // 关闭弹窗回调函数
            this.$emit('close')
        },
		handleSelectionChange(val) {	// 选择按钮
			this.checkboxList= val
		},
		
    }
}
</script>

<style >
/* .ts-table{
    border-color: #f0dfbf;
}
.ts-table>
.el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 40px;
    background-color: #fefbf1;
    color: #d1a769;
    border-color: #f0dfbf;
}
.ts-table >
.el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 40px;
    border-color: #f0dfbf;
} */
</style>
