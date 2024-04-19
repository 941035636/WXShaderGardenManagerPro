<template>
    <div id="accountConfirm">
        <div class="border-style">
            <span class="content-title">到账确认</span>
            <span class="fr mt16 edit-icon" v-if="!processNull"><i class="el-icon-edit"></i> 修改</span>
            <el-form   :label-position="labelPosition">
                <el-button type="warning" plain v-if="processNull">去添加</el-button>
                <div v-if="!processNull">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="打款时间：">
                                <span class="col-black">{{formInline.no}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="到账时间：">
                                <span class="col-black">{{formInline.status}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-table  :data="tableData1"  style="width: 80%;margin-top:20px;" :header-cell-style="getRowClass">
                        <el-table-column prop="index" label="序号" align="center"></el-table-column>
                        <el-table-column prop="name" label="文件名" align="center"></el-table-column>
                        <el-table-column prop="idNumber" label="资料类型" align="center"></el-table-column>
                        <el-table-column prop="occupation" label="资料描述" align="center"></el-table-column>
                        <el-table-column prop="phone" label="上传时间" align="center"></el-table-column>
                    </el-table>

                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
		return {
			tableData:[],
			tableData1:[],
			occupation:'',
			idNumber:'',
			fileList2:[],
			dialogVisible:false,
			processNull:false,
			labelPosition: 'left',
			rightPosition: 'right',
			formInline: {
				no: '532414432455',
				status: '已结案'
			},
			typeOptions:[]
		}
    },
    methods: {
		toEditPass() {
			this.dialogVisible = true;

		},
		handleClose() {
			this.dialogVisible = false;
		},
		//修改表头样式
        getRowClass({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            if (rowIndex == 0) {
                return 'background: #fefbf1;border-bottom:1px solid #f0dfbf;color:#cda160;font-size:16px;';
            } else {
                return 'background: #fff';
            }
		},
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePreview(file) {
			console.log(file);
		},
		goTo(name) {
			let anchor = this.$refs[name];
			console.log(this.$refs[name].scrollTop);
            this.$nextTick(() => {
				 this.$refs[name].scrollTop = anchor.offsetTop
				 console.log(this.$refs[name].scrollTop);
            });
		}

		
	},
}
</script>
<style lang="less" scoped>
    #accountConfirm {
        
    }

</style>