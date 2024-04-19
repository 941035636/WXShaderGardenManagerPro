<template>
    <div>
        <div class="headerClass">
            <div class="freshHed">
                <div class="versionClass">v{{ inuseTemplate.version ? versionProcessing(inuseTemplate.version) : '1.00' }}</div>
                <div class="dateClass">
                    更新时间：{{ inuseTemplate.updateTime }}
                </div>
                <el-popover placement="bottom" title="描述信息" width="200" trigger="click"
                    :content="inuseTemplate.remark || '--'">
                    <div slot="reference" class="describeClass">
                        描述信息：{{ inuseTemplate.remark || '--' }}
                    </div>
                </el-popover>
                <div class="operationClass">
                    操作人：{{ inuseTemplate.creator }} / {{ inuseTemplate.branch }}
                </div>
                <div class="numberOfTimes">
                    使用次数：<span style="color: #F5222D;">{{ inuseTemplate.useCount }}次</span>
                </div>
            </div>
            <div class="butClass">
                <el-button type="text" @click="switchover">{{ contentShow ? '收起' : '展开' }}</el-button>
                <i class="el-icon-arrow-up rotateClass" :class="contentShow ? 'rotateClass1' : 'rotateClass2'"></i>
            </div>
        </div>
        <transition name="fade">
            <div v-show="contentShow" style="height: 500px;">
                <el-table :data="tableData" border style="width: 100%" height="500px" :header-cell-style="{
                    background: '#E9E9E9', color: '#000000'
                }" :span-method="objectSpanMethod">
                    <el-table-column prop="compensateWayName" label="赔付方式" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="lawsuitName" label="诉讼/非诉讼" width="180" align="center">
                    </el-table-column>
                    <el-table-column label="附件资料" align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.jsonData.length > 0" class="contentManagement1">
                                <div style="width: 60%;">
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
            </div>
        </transition>
    </div>
</template>
<script>
import CaseService from '@/service/CaseService.js';
import '../components/unify.less';
import formatDat from '../caseList/newlyIncreased/formatDat';


export default {
    props: {
        inuseTemplate: Object,
    },
    data() {
        return {
            caseService: new CaseService(),
            tableData: [],
            pos: 0,// 索引
            spanArr: [],
            contentShow: true,
            items: [],
            ializationList:'',
        }
    },
    watch: {
        "inuseTemplate": function (newVal, oldVal) {
            this.items = newVal.items;
            // this.initialization();
            this.getTemplateItemListTree(newVal);
        }
    },
    mounted() { },
    methods: {
        //获取树级结构
        async getTemplateItemListTree(e){
            console.log(e,'看看传进来的值');
            let res = await this.caseService.getTemplateItemListTree(e.id);
            if(res.code === '0000'){
                console.log('看看处理的树的结构',formatDat.detailsHandleData1(res.data));
                this.tableData = formatDat.detailsHandleData1(res.data);
                this.merge();
            }
        },
         //获取列表事件
        //  async initialization() {
        //     let data = {};
        //     let res = await this.caseService.getLxConfig(data);
        //     if(res.code === '0000'){
        //         this.ializationList =  res.data;
        //         this.inits();
        //     };
        // },
        versionProcessing(e) {
            let version = e.slice(0, (e.length - 2)) + '.' + e.slice(1, (e.length - 1)) + '.' + e.slice(-1);
            return version
        },

        //获取列表事件
        // async inits() {
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
        switchover() {
            this.contentShow = !this.contentShow;
        }
    }
}
</script>
<style lang="less" scoped>
.headerClass {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .freshHed {
        display: flex;
        align-items: center;

        .versionClass {
            font-weight: 600;
            width: 70px;
            height: 22px;
            border-radius: 11px;
            background-color: #52C41A;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 30px;
            margin-left: 30px;
        }

        .dateClass {
            margin-right: 30px;
            font-weight: 600;
        }

        .describeClass {
            font-weight: 600;
            width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            margin-right: 30px;
        }

        .operationClass {
            font-weight: 600;
            margin-right: 30px;
        }

        .numberOfTimes {
            font-weight: 600;
            margin-right: 30px;
        }
    }

    .butClass {
        .rotateClass {
            transition: all 1s;
        }

        .rotateClass1 {
            transform: rotate(180deg);
        }

        .rotateClass2 {
            transform: rotate(0);
        }

    }
}

.fade-enter-active,
.fade-leave-active {
    // transition: opacity 1s;
    // transition: opacity 0.5s;
    transition: all 1s;
    // 防止折叠时元素溢出
    overflow: hidden;
}

.fade-enter,
.fade-leave-to {
    height: 0px !important;
    opacity: 0;
}

.contentManagement1 {
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
}
</style>