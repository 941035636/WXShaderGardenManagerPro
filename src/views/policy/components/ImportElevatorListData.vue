<template>
    <div>
        	<el-table :data="tableData"  border class="table ts-table"  @selection-change="handleSelectionChange" height="300" >
				<el-table-column
			      width="55"
				  label="序号"
					type="index"
			      align="center">
			    </el-table-column>
				<el-table-column  label="设备代码/出厂编号" align="center" width="220">
                    <template slot-scope="scope">
						<span v-if="scope.row.equipmentsCode">{{scope.row.equipmentsCode}}</span>
						<span  v-else-if="scope.row.licenceNo">{{scope.row.licenceNo}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="role_name" label="类型" align="center" width="150">
                    <template slot-scope="scope">
						<span v-if="scope.row.elevatorType ==1">直梯</span>
						<span  v-else-if="scope.row.elevatorType ==2">扶梯</span>
						<span  v-else>货梯</span>
					</template>
				</el-table-column>
				<el-table-column prop="roleDesc" label="重量（kg）/提升高度（m）" align="center"  width="150">
                    <template slot-scope="scope">
						<span v-if="scope.row.weight !=null">{{scope.row.weight}}kg </span>
						<span  v-else-if="scope.row.height !=null ">{{scope.row.height}}m</span>
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
				<el-table-column label="操作" width="150" align="center"  fixed="right" v-if="!operation">
					<template slot-scope="scope">
						<el-button type="text"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
						<el-button type="text"  @click="handleDelete(scope.$index, scope.row)">移除</el-button>
					</template>
				</el-table-column>
			</el-table>
    </div>
</template>

<script>
export default {
    props:{
        tableData:{
            type:Array
		},
		operation:{
			type:Boolean,
			default:false,
		}
    },
    data(){
        return{
			flag:false,
			 dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
           
        }
    },
    methods:{
        handleSelectionChange(val) {
		},
		handleEdit(index){ // 修改
			this.$emit('handleEdit',index)
		},
		handleDelete(index){	// 删除
			this.$confirm('是否将电梯删除?', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
				this.$emit('handleDelete',index)
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
 
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
