<template>
    <div>
        <el-dialog :visible.sync="dialogFormVisible" width="1000px">
            <div slot="title" class="dialog-title">
                <div>{{ title }}</div>
                <div class="versionClass">v{{ version }}</div>
            </div>
            <el-table :data="tableData" border style="width: 100%" :header-cell-style="{
                background: '#E9E9E9', color: '#000000'
            }" :span-method="objectSpanMethod">
                <el-table-column prop="compensateWayName" label="赔付方式" width="180" align="center">
                </el-table-column>
                <el-table-column prop="lawsuitName" label="诉讼/非诉讼" width="180" align="center">
                </el-table-column>
                <el-table-column label="附件资料">
                    <template slot-scope="scope">
                        <div v-if="scope.row.jsonData.length > 0" class="contentManagement2">
                            <div style="width: 80%;">
                                <div v-for="eqa in scope.row.jsonData" :key="eqa.outermostTypeCode">
                                    <div class="titNameClass" v-if="eqa.caseType == '0'">{{ eqa.type + '（制式资料）' }}</div>
                                    <div class="titNameClass" v-else>{{ eqa.type + '（案件资料）'}}</div>
                                    <div style="display: flex;flex-wrap: wrap;">
                                        <div v-for="(qcy, qcyIndex) in eqa.children">
                                            <div class="mainNameClass">
                                                <div>{{ qcyIndex + 1 }}、</div>
                                                <div>{{ qcy.type }}</div>
                                                <div v-if="qcy.required == '0'" style="color: red;">* </div>
                                                <div v-if="qcy.filDesc">（{{ qcy.filDesc }}）</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import CaseService from '@/service/CaseService.js';
import formatDat from '../caseList/newlyIncreased/formatDat';


export default {
    data() {
        return {
            caseService: new CaseService(),
            title: "",
            dialogFormVisible: false,
            tableData: [],
            pos: 0,// 索引
            spanArr: [],
            items: [],
            version: '',
            ializationList:[],
        }
    },
    methods: {
        open(e, items, version,id) {
            this.title = e;
            this.version = version.slice(0, (version.length - 2)) + '.' + version.slice(1, (version.length - 1)) + '.' + version.slice(-1);
            // this.initialization(e, items, version,id);
            this.getTemplateItemListTree(id);
            this.dialogFormVisible = true;
        },
         //获取树级结构
         async getTemplateItemListTree(id){
            let res = await this.caseService.getTemplateItemListTree(id);
            if(res.code === '0000'){
                this.tableData = formatDat.detailsHandleData1(res.data);
                this.merge();
            }
        },
         //获取列表事件
        //  async initialization(e, items, version,id) {
        //     let data = {};
        //     let res = await this.caseService.getLxConfig(data);
        //     if(res.code === '0000'){
        //         this.ializationList =  res.data;
        //         if(e == '查看历史版本'){
        //             this.getTemplateItemList(id);
        //         }else{
        //             this.items = items;
        //             this.getList();
        //         }
        //     };
        // },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        },
        async getTemplateItemList(id){
            let res = await this.caseService.getTemplateItemList(id);
            if(res.code === '0000'){
                this.items = res.data;
                this.getList();
            }
        },
        // async getList() {
        //     let data = {
        //         page: 1,
        //         pageSize: 1000
        //     };
        //     let res = await this.caseService.getPFConfig(data);
        //     if (res.code === '0000') {
        //         this.tableData = formatDat.detailsHandleData(formatDat.mannerDate(res.data.list), this.items,this.ializationList);
        //         this.merge();
        //     }
        // },
        //合并单元格事件
        merge() {
            this.pos = 0;
            this.spanArr = [];
            for (let i = 0; i < this.tableData.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0
                } else {
                    if (this.tableData[i].compensateWayName === this.tableData[i - 1].compensateWayName) {
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            };
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

.contentManagement2 {
    display: flex;
    justify-content: center;
    align-items: center;
}

.titNameClass {
    color: #096DD9;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.mainNameClass {
    display: flex;
    font-size: 14px;
    font-weight: bold;
    align-items: center;
    margin-right: 10px;
}</style>