<template>
  <!-- 索赔文件列表 -->
	<div class="caseCloseDetails" id="caseCloseDetails">
        <el-table ref="proInfo" :data="getTableData" border style="width: 100%" :header-cell-style="getRowClass1">
            <el-table-column
                label="操作时间/办理人"
            >
                <template slot-scope="scope">
                    <p>{{scope.row.date}}</p>
                    <p>{{scope.row.name}}</p>
                </template>
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                label="申请类型/审核状态"
            >
            <template slot-scope="scope">
                <span>{{scope.row.typeName}}</span>
                <span class="color-355E92">{{scope.row.typeValue}}</span>
                <el-button v-if="caseInfo.caseProgress =='301' && scope.row.closeButton === true && isClose" type="text" style="color:#FA8C16;text-decoration:underline;" @click="goClose">立即结案审核</el-button>
            </template>
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="remarks"
                label="备注"
            ></el-table-column>
        </el-table>
	</div>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    props:{
        isClose:{
            type:Boolean
        },
    },
    computed:{
        ...mapGetters({
            caseInfo:'caseInfo',
            endCaseInfo:'endCaseInfo',
            caseSettleType:'caseSettleType',
        }),
        getTableData(){
            let {name:closeType} = this.caseSettleType.find(item=>item.code === this.endCaseInfo.closeType) || {name:''}
            let caseExamine = ''
            if(this.caseInfo.caseProgress === '301'){
                caseExamine = '待审核'
            } else if(this.endCaseInfo.pass === true) {
                caseExamine = '通过'
            } else if(this.endCaseInfo.pass === false){
                 caseExamine = '驳回'
            }
            let list = [
                {
                    date:this.endCaseInfo.applyTime,
                    name:`申请人：${this.caseInfo.serverName}`,
                    typeName:'申请类型：',
                    typeValue:closeType,
                    remarks:this.endCaseInfo.settlementContent,
                    closeButton:false,
                },
                {
                    date:this.endCaseInfo.examTime,
                    name:`审核人：${this.endCaseInfo.closeAuditorName}`,
                    typeName:'状态：',
                    typeValue:caseExamine,
                    remarks:this.endCaseInfo.denyReason,
                    closeButton:true,
                },
            ]
            
            return list
        },
    },
    
	data() {
		return {
            fileSecType:[],
            tableData:[],
        }
	},
	created(){},
	methods: {
        ...mapActions(['deleteFileInfo','downloadCaseFile']),
        getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #e8e8e8;color:#101010;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
        downloadFile(row){
            this.downloadCaseFile({...row,isDownload:true})
        },
        goClose(){
            this.$emit('goClose')
        },
	},
}
</script>

<style lang="less">
#caseCloseDetails {
    .el-form-item {
        margin-bottom: 10px;
    }
    .display-flex {
        display: flex;
    }
    .w280 {
        width: 280px;
    }

}
</style>
