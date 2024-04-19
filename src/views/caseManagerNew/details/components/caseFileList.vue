<template>
  <!-- 索赔文件列表 -->
	<div class="caseFileList" id="caseFileList">
		 <el-dialog title="" :visible.sync="dialogVisible" width="800px" destroy-on-close :close-on-click-modal='false' append-to-body>
            <slot name="button"></slot>
            <el-table ref="proInfo" :data="tableData" border style="width: 100%" :header-cell-style="getRowClass1">
                <el-table-column
                    type="index"
                    label="序号"
                    width="50"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="fileType"
                    label="文件类型"
                >
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="fileName"
                    label="文件名"
                ></el-table-column>
                <el-table-column prop="uploadTime" label="上传时间"></el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                    <el-button type="text" @click="downloadFile(scope.row)">
                        下载
                    </el-button>
                    <el-button v-if="isDelButton && isShowRenewFileButton" type="text" @click="deletFile(scope.row)">
                        删除
                    </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
	</div>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    props:{
        // 是否展示删除按钮
        isDelButton:{
            type:Boolean,
            default:()=>{
                return false
            }
        }
    },
    computed:{
        ...mapGetters({
            caseInfo:'caseInfo',
            fileList:'fileList',
            isHandleButton:'isHandleButton',
        }),
        isShowRenewFileButton(){
            let caseProgressList = [
                {code:'401',name:'赔付结案',flieType:'结案文件'},
                {code:'404',name:'拒赔',flieType:'拒赔文件'},
                {code:'403',name:'销案',flieType:'销案文件'},
                {code:'405',name:'零结',flieType:'零结文件'},
            ]
            let caseProgressFlag = caseProgressList.some(item=>item.code === this.caseInfo.caseProgress)
            if(caseProgressFlag && window.sessionStorage.getItem('branchCode') == 'JT0000'){
                return true;
            }else{
                return false;
            }
        }
    },
    
	data() {
		return {
            dialogVisible:false,
            fileSecType:[],
            tableData:[],
        }
	},
    
    watch:{
        fileList:{
            handler(newVal){
                this.setTableData()
            }
        }
    },
   
	created(){},
	methods: {
        ...mapActions(['deleteFileInfo','downloadCaseFile']),
        // 初始化数据
        openInit(val) {
            this.dialogVisible = true;
            this.fileSecType = val
            this.setTableData()
        },
        setTableData(){
            this.tableData = this.fileList.filter(item=> this.fileSecType.find(v1=>v1 === item.fileType))
        },
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
        async deletFile(row){
           let code = await this.deleteFileInfo(row.id)
        //    if(code === '0000') {
        //        this.tableData = this.tableData.filter(item=>item.id !== row.id)
        //    }
        },
        // 取消
        close(){
           this.dataBiaoDi = []
        },
        
	},
}
</script>

<style lang="less">
#caseFileList {
    .el-form-item {
        margin-bottom: 10px;
    }
    .display-flex {
        display: flex;
    }
    .btn{
        text-align: right;
        width: 100%;
        margin-top: 20px;
        .btn-left{
            display: inline-block;
            padding: 5px 20px;
            border: 1px solid #ccc;
            color: #000;
            background-color: #F5F5F5;
            border-radius: 20px;
            cursor: pointer;
            margin-right: 20px;
        }
        .btn-right{
            display: inline-block;
            padding: 5px 20px;
            color: #FFF;
            background-color: #FA8C16;
            border-radius: 20px;
            cursor: pointer;
        }
    }
    .w280 {
        width: 280px;
    }

}
</style>
