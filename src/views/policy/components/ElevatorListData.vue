<template>
    <div>
        	<el-table 
					:data="tableData"  
					border 
					class="table ts-table"  
				  	@selection-change="handleSelectionChange" 
					ref="multipleTable" 
					height="300" >
				<el-table-column
			      type="selection"
			      width="55"
			      align="center">
			    </el-table-column>
				<el-table-column  label="设备代码/出厂编号" align="center" width="220">
                    <template slot-scope="scope">
						<span v-if="scope.row.equipmentsCode">{{scope.row.equipmentsCode}}</span>
						<span  v-else-if="scope.row.licenceNo ">{{scope.row.licenceNo}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="role_name" label="类型" align="center" width="150">
                    <template slot-scope="scope">
						<span v-if="scope.row.elevatorType ==1">直梯</span>
						<span  v-else-if="scope.row.elevatorType ==2">扶梯</span>
						<span  v-else-if="scope.row.elevatorType ==3">货梯</span>
					</template>
				</el-table-column>
				<el-table-column prop="roleDesc" label="重量（kg）/提升高度（m）" align="center"  width="150">
                    <template slot-scope="scope">
						<span v-if="scope.row.weight !=null && scope.row.weight !=''">{{scope.row.weight}}kg </span>
						<span  v-else-if="scope.row.height !=null && scope.row.height !='' ">{{scope.row.height}}m</span>
					</template>
				</el-table-column>
				<el-table-column prop="elevatorSite" label="电梯使用场所" align="center" width="246">
				</el-table-column>
				<el-table-column prop="elevatorYear" label="电梯使用年限" align="center" width="140">
				</el-table-column>
				<el-table-column prop="userNumber" label="坐落区域"  align="center" width="230">
                    <template slot-scope="scope">
						<span>{{scope.row.areaValueFirst}} {{scope.row.areaValueSecond}} {{scope.row.areaValueThird}} </span>
					</template>
				</el-table-column>
				<!-- <el-table-column label="操作" width="150" align="center">
					<template slot-scope="scope">
						<el-button type="text"  @click="handleAdd(scope.$index, scope.row)">编辑</el-button>
						<el-button type="text"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					</template>
				</el-table-column> -->
			</el-table>

    </div>
</template>

<script>
export default {
    props:{
        tableData:{
            type:Array
        }
    },
    data(){
        return{
			flag:false,
			checkboxList:[],	// 选中的数据
           
        }
	},
    methods:{
		handleSelectionChange(val) {	// 选择按钮
			this.checkboxList= val
		},
		addPolicy(){	// 将选中的数据放在保单当中
			
			let elevatorMessage =JSON.parse(window.sessionStorage.getItem('elevatorMessage'))
			if(elevatorMessage.length !=0){
				for(var i = 0; i<this.checkboxList.length;i++){
					for(var j = 0; j<elevatorMessage.length;j++){
						if(this.checkboxList[i].id==elevatorMessage[j].id){
							let status = this.checkboxList[i].equipmentsCode?this.checkboxList[i].equipmentsCode:this.checkboxList[i].licenceNo;
							this.$message.error(`此电梯:${status}已在投保单列表`);
							return;
						}
					}
					
					elevatorMessage.push(this.checkboxList[i])
					if(this.checkboxList.length-1  == i){
						window.sessionStorage.setItem('elevatorMessage',JSON.stringify(elevatorMessage))
						this.$message.success(`添加成功`)
					}
				}

			}else{
				if(this.checkboxList.length==0){
					this.$message.error(`请选择当前页的电梯数据`);
				}else{
					
					elevatorMessage = this.checkboxList
					window.sessionStorage.setItem('elevatorMessage',JSON.stringify(elevatorMessage))
					this.$message.success(`添加成功`)
				}
			}	
			

		}
		
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
