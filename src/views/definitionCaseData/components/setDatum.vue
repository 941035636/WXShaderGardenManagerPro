<template>
    <div>
        <el-dialog title="设置案件资料" :visible.sync="setDatumShow" @close="close">
            <el-table :data="jsonData" border style="width: 100%" :header-cell-style="{
                background: '#E9E9E9', color: '#000000'
            }" :span-method="objectSpanMethod">
                <el-table-column label="选中" width="80" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.selected" active-color="#13ce66" inactive-color="#f5f5f5">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="outermostTypeName" label="案件类型" width="220" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.outermostTypeVal == '0'">
                            {{ scope.row.outermostTypeName + '（制式资料）' }}
                        </div>
                        <div v-else>
                            {{ scope.row.outermostTypeName + '（案件资料）' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="childLevelTypeName" label="文件名称" width="180" align="center">
                </el-table-column>
                <el-table-column label="是否必填" width="80" align="center">
                    <template slot-scope="scope">
                        <el-checkbox v-if="scope.row.mustShow" v-model="scope.row.must"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="childLevelTypeDesc" label="说明" align="center">
                </el-table-column>
            </el-table>
            <div class="unifyBut">
                <div></div>
                <div class="butBoxClass">
                    <div class="unifyButCancel" @click="() => setDatumShow = false">取消</div>
                    <div class="unifyButAffirm" @click="notarize">确认提交</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import '../components/unify.less';
import CaseService from '@/service/CaseService.js';
import formatDat from '../caseList/newlyIncreased/formatDat';

export default {
    data() {
        return {
            caseService: new CaseService(),
            setDatumShow: false,
            jsonData: [],
            pos: 0,// 索引
            spanArr: [],
            id: '',
            lawsuitName: '',
        }
    },
    computed: {

    },
    created() { },
    mounted() {

    },
    methods: {
        //合并单元格处理事件
        merge() {
            for (let i = 0; i < this.jsonData.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0
                } else {
                    if (this.jsonData[i].outermostTypeCode === this.jsonData[i - 1].outermostTypeCode) {
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            };
        },
        //单元格合并事件
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 1) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        },
        //获取列表事件
        async initialization() {
            let data = {};
            let res = await this.caseService.getLxConfig(data);
            if (res.code === '0000') {
                this.jsonData = formatDat.flatData(res.data);
                console.log(this.jsonData,'看看处理后的值');
                this.merge();
            }
        },
        //新增事件
        exhibition(id, lawsuitName) {
            this.jsonData = [];
            this.pos = 0;
            this.spanArr = [];
            this.initialization();
            this.id = id;
            this.lawsuitName = lawsuitName;
            this.setDatumShow = true;
        },
        //弹窗关闭清空值
        close() {
            this.jsonData = [];
            this.pos = 0;
            this.spanArr = [];
            this.id = '';
            this.lawsuitName = '';
        },
        notarize() {
            let key = false;
            this.jsonData.forEach(_item => {
                if (_item.selected) {
                    key = true
                }
            })
            if (key) {
                this.$emit('transmit', formatDat.processingData(this.jsonData), this.id, this.lawsuitName);
                this.$message({
                    message: '保存成功',
                    type: 'success'
                });
                this.setDatumShow = false;
            } else {
                this.$message.error('请至少选择一种案件资料');
            }
        },
        //修改的回显事件
        async amendClick(jsonData, id, lawsuitName) {
            this.id = id;
            this.lawsuitName = lawsuitName;
            let data = {};
            let res = await this.caseService.getLxConfig(data);
            if (res.code === '0000') {
                let arrList = formatDat.flatData(res.data);
                this.jsonData = formatDat.amendClick(jsonData,arrList);
                this.merge();
                this.setDatumShow = true;
            }
        },
    }
}
</script>
<style lang="less" scoped></style>