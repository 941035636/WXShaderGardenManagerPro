<template>
    <div>
        <!-- 日志记录弹窗组件 -->
        <el-dialog :visible.sync="dialogFormVisible" width="1000px">
            <div slot="title" class="dialog-title">
                <div>查看审核日志</div>
                <div class="versionClass">v{{ version }}</div>
            </div>
            <el-table :data="tableData" height="530" border style="width: 100%" :header-cell-style="{
                background: '#E9E9E9', color: '#000000'
            }">
                <el-table-column prop="updateTime" label="操作时间" width="200" align="center">
                </el-table-column>
                <el-table-column prop="operatorName" label="办理人" width="200" align="center">
                </el-table-column>
                <el-table-column prop="state" label="申请类型/审核状态" width="200" align="center">
                    <template slot-scope="scope">
                        <div v-if="analysis(scope.row.remark).bizType == '通过'" style="font-size: 14px;color:#389E0D;font-weight: 500;">
                            状态：通过
                        </div>
                        <div v-else-if="analysis(scope.row.remark).bizType == '驳回'" style="font-size: 14px;color: #F5222D;font-weight: 500;">
                            状态：不通过
                        </div>
                        <div v-else style="font-size: 14px;color: #096DD9;font-weight: 500;">
                            申请类型:新版发布
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                    <template slot-scope="scope">
                        {{ analysis(scope.row.remark).remark }}
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px;  text-align: right;">
                <el-pagination background layout="prev, pager, next" :total="total" @current-change="currentChangeClick">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import LoggerService from '@/service/LoggerService'

export default {
    data() {
        return {
            loggerService: new LoggerService(),
            dialogFormVisible: false,
            tableData: [],
            total: 0,
            page: 1,
            pageSize: 10,
            version: '',
            id:'',
        }
    },
    methods: {
        open(e, version) {
            this.id = e;
            this.version = version.slice(0, (version.length - 2)) + '.'  + version.slice(1, (version.length - 1)) + '.' + version.slice(-1);
            this.getLog();
            this.dialogFormVisible = true;
        },
        async getLog() {
            let data = {
                operateEndDate: '',
                operateStartDate: '',
                operator: '',
                org: '',
                page: this.page,
                pageSize: this.pageSize,
                platform: '',
                queryData: this.id,
                userName: '',
                userCode: '',
                channel: 'sequip',
            };
            let params = await this.loggerService.getNewLog(data);
            if (params.code == '0000') {
                this.total = params.data.total;
                this.tableData = params.data.list;
            }
        },
        currentChangeClick(e){
            this.page = e;
            this.getLog();
        },
        analysis(e){
            return JSON.parse(e)
            // JSON.parse(JSON.stringify(LoggerInfo.trackLog))
        },
    }
}
</script>
<style lang="less" scoped>
.dialog-title {
    font-size: 18px;
    line-height: 24px;
    color: #303133;
    display: flex;
    align-items: center;

    .versionClass {
        font-weight: 600;
        width: 70px;
        height: 22px;
        border-radius: 11px;
        background-color: #1890FF;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 30px;
    }
}
</style>