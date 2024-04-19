<template>
    <div id="litigation">
        <div class="border-style">
            <span class="content-title">诉讼</span>
            <span class="fr mt16 edit-icon" v-if="!processNull"><i class="el-icon-edit"></i> 修改</span>
            <el-form   :label-position="labelPosition">
                <el-button type="warning" plain v-if="processNull">去添加</el-button>
                <div v-if="!processNull">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="诉讼结果：">
                                <span class="col-black">{{formInline.no}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="诉讼金额：">
                                <span class="col-black">{{formInline.status}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="备注：">
                                <span class="col-black">{{formInline.no}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
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
}
</script>
<style lang="less" scoped>
    #litigation {

    }

</style>