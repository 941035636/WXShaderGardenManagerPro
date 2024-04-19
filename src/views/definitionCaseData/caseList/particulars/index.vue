<template>
    <div>
        <!-- 详情页面 -->
        <div class="titleClass">
            <div>{{ productItem.projectName + '（' + productItem.code + '）' + '/' + inusureCompanyItem.name }}</div>
            <div>操作人：{{ userName + ' 于 ' + currentTime }}</div>
        </div>
        <div class="onlineClass" v-if="inuseTemplate">
            <div class="onlineHeader">
                <div class="demonstrateClass">
                    <div class="fragment"></div>
                    <div>线上版本</div>
                </div>
                <el-button type="text" @click="examineJournal(inuseTemplate)">审核日志</el-button>
            </div>
            <div class="hintClass">
                <div class="iconClass"><i class="el-icon-warning-outline"></i></div>
                <div>请为“主承公司”配置案件资料信息</div>
            </div>
            <div class="mainBody">
                <Fold :inuseTemplate="inuseTemplate" />
            </div>
        </div>
        <div class="freshClass" v-if="newTemplate">
            <div class="freshHed">
                <div class="fragment"></div>
                <div class="versionText">新版本</div>
                <div class="versionClass">
                    v{{ newTemplate.version ? versionProcessing(newTemplate.version) : '1.00' }}
                </div>
                <div class="dateClass">
                    更新时间：{{ newTemplate.updateTime }}
                </div>
                <el-popover placement="bottom" title="描述信息" width="200" trigger="click"
                    :content="newTemplate.remark || '--'">
                    <div slot="reference" class="describeClass">
                        更新描述：{{ newTemplate.remark || '--' }}
                    </div>
                </el-popover>
                <div class="operationClass">
                    操作人：{{ newTemplate.creator }} / {{ newTemplate.branch }}
                </div>
                <div class="numberOfTimes">
                    使用次数：<span style="color: #F5222D;">{{ newTemplate.useCount }}次</span>
                </div>
                <div class="stateClass" v-if="newTemplate.status == '200'">
                    状态：审核中
                </div>
                <div class="stateClass1" v-else-if="newTemplate.status == '100'">
                    状态：待发布
                </div>
                <div class="stateClass2" v-else-if="newTemplate.status == '210'">
                    <el-popover v-if="newTemplate.status == '210'" placement="bottom" width="200" trigger="click"
                        :content="newTemplate.examineReason || '--'">
                        <div slot="reference">
                            状态：不通过
                            <i class="el-icon-warning"></i>
                        </div>
                    </el-popover>
                </div>
            </div>
            <div class="freshBut">
                <!-- <el-button type="text" style="color: #F5222D;" @click="deleteData(newTemplate)">删除</el-button> -->
                <div class="shenhen" v-if="newTemplate.status == '200'" @click="checkClick(newTemplate)">立即审核</div>
                <div class="xiugai"  v-if="newTemplate.status == '210'" @click="publish(newTemplate)">修改</div>
                <el-button type="text" @click="examineClick('查看新版本', newTemplate)">查看详情</el-button>
            </div>
        </div>
        <div class="historyClass" v-if="history && history.length > 0">
            <div class="historyHeader">
                <div class="fragment"></div>
                <div class="versionText">历史版本</div>
            </div>
            <div class="mainBody" v-for="item in history" :key="item.id">
                <div class="freshHed">
                    <div class="versionClass">
                        v{{ item.version ? versionProcessing(item.version) : '1.0.0' }}
                    </div>
                    <div class="dateClass">
                        更新时间：{{ item.updateTime }}
                    </div>
                    <el-popover placement="bottom" title="描述信息" width="200" trigger="click"
                        :content="item.remark">
                        <div slot="reference" class="describeClass">
                            更新描述：{{ item.remark }}
                        </div>
                    </el-popover>
                    <div class="operationClass">
                        操作人：{{ item.creator }} / {{ item.branch }}
                    </div>
                    <div class="numberOfTimes">
                        使用次数：<span style="color: #F5222D;">{{item.useCount}}次</span>
                    </div>
                </div>
                <el-button type="text" @click="examineClick('查看历史版本',item)">查看详情</el-button>
            </div>
        </div>
        <Journal ref="journal" />
        <ExamineVersions ref="examineVersions" />
        <AuditPage ref="auditPage" @auditing="auditingClick"/>
    </div>
</template>
<script>
import dateService from "@/service/dateService.js";
import CaseService from '@/service/CaseService.js';
import Journal from "../../components/journal.vue";
import ExamineVersions from "../../components/examineVersions.vue";
import Fold from "../../components/fold.vue";
import AuditPage from '../../components/auditPage.vue';


export default {
    components: {
        Journal,
        ExamineVersions,
        Fold,
        AuditPage
    },
    data() {
        return {
            dateSer: new dateService(),
            caseService: new CaseService(),
            productItem: { projectName: '', code: '', },
            inusureCompanyItem: { name: '' },
            userName: '',
            currentTime: '',
            history: [],
            newTemplate: {},
            inuseTemplate: {},
        }
    },
    computed: {

    },
    mounted() {
        this.productItem.projectName = JSON.parse(this.$route.query.paramsata).productName;
        this.productItem.code = JSON.parse(this.$route.query.paramsata).productCode;
        this.inusureCompanyItem.name = JSON.parse(this.$route.query.paramsata).insuranceName;
        this.currentTime = JSON.parse(this.$route.query.paramsata).updateTime;
        this.userName = JSON.parse(this.$route.query.paramsata).creator;
        this.getTemplateDetail();
    },
    methods: {
        publish(e){
            let row = {
                productItem: {
                    name:e.productName,
                    code:e.productCode
                },
                inusureCompanyItem: {
                    name:e.insuranceName
                },
                basicData:{
                    updateTime:e.updateTime,
                    creator:e.creator,
                    branch:e.branch,
                    statusName:e.statusName,
                    status:e.status,
                    useCount:e.useCount,
                    version:e.version
                }
            };
            let paramsata = JSON.stringify(row);
            this.$router.push({
                path: '/case/newly/datum',
                query: { paramsata: paramsata },
            })
        },
        auditingClick(){
            this.getTemplateDetail();
        },
        checkClick(e){
            this.$refs.auditPage.openClick(e)
        },
        versionProcessing(e) {
            let version = e.slice(0, (e.length - 2)) + '.' + e.slice(1, (e.length - 1)) + '.' + e.slice(-1);
            return version
        },
        async getTemplateDetail() {
            let data = JSON.parse(this.$route.query.paramsata);
            let res = await this.caseService.getTemplateDetail(data.insuranceName, data.productCode);
            if (res.code === '0000') {
                this.history = res.data.history;//历史版本
                this.newTemplate = res.data.newTemplate;//新版本
                this.inuseTemplate = res.data.inuseTemplate;//线上版本
            };
        },
        // async getNewData() {
        //     let { data } = await this.dateSer.getDate();
        //     if (data.code == '0000') {
        //         this.currentTime = data.data;
        //     }
        // },
        // 查看审核日志接口
        examineJournal(e) {
            this.$refs.journal.open(e.id,e.version);
        },
        // 删除新版本事件
        deleteData(e) {
            this.$confirm('请确认是否删除：案件资料设置信息？', '确认删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.deleteTemplate(e);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        async deleteTemplate(e) {
            let data = JSON.parse(this.$route.query.paramsata);
            let res = await this.caseService.deleteTemplate(data.insuranceName,data.productCode,e.version);
            if (res.code === '0000') {
                this.getTemplateDetail();
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }
        },
        // 查看触发的事件
        examineClick(e, item) {
            this.$refs.examineVersions.open(e, item.items, item.version,item.id);
        }
    }
}
</script>
<style lang="less" scoped>
.titleClass {
    font-size: 16px;
    background-color: #fff;
    padding: 0 58px 0 58px;
    height: 77px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.onlineClass {
    background-color: #fff;
    margin-top: 20px;
    padding: 0 58px 20px 58px;

    .onlineHeader {
        height: 80px;
        border-bottom: 1px solid #E9E9E9;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .demonstrateClass {
            display: flex;
            align-items: center;
            color: #409EFF;
            font-size: 16px;
            font-weight: 500;

            .fragment {
                height: 27px;
                width: 6px;
                background: #096DD9;
                margin-right: 10px;
            }
        }
    }

    .hintClass {
        background-color: #FEFFE6;
        height: 67px;
        display: flex;
        align-items: center;
        margin-top: 20px;
        padding-left: 58px;
        color: #FA8C16;
        font-size: 18px;
        font-weight: bold;

        .iconClass {
            font-size: 30px;
            margin-right: 26px;
        }
    }

    .mainBody {
        border: 1px dashed #E9E9E9;
        border-radius: 5px;
        margin-top: 20px;
        padding: 0 20px 20px 20px;
    }
}

.freshClass {
    height: 70px;
    background-color: #fff;
    margin-top: 20px;
    padding: 0 58px 0 58px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .freshHed {
        display: flex;
        align-items: center;
        width: calc(100% - 116px - 110px - 30px);

        .versionText{
            font-size: 16px;
            font-weight: 500;
            color: #409EFF;
        }
        .fragment {
            height: 27px;
            width: 6px;
            background: #096DD9;
            margin-right: 10px;
        }

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
            margin-right: 30px;
            margin-left: 30px;
        }

        .dateClass {
            font-weight: 600;
            margin-right: 30px;
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

        .stateClass {
            font-weight: 600;
            color: #FA8C16;
        }

        .stateClass1 {
            font-weight: 600;
            color: #101010;
        }
        .stateClass2{
            font-weight: 600;
            color: red;
        }
    }

    .freshBut {
        width: 180px;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .shenhen{
            cursor: pointer;
            background-color: #FFA940;
            color: #fff;
            width: 98px;
            height: 30px;
            font-size: 14px;
            border-radius: 4px;
            font-weight: 500;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .xiugai{
            cursor: pointer;
            color: #fff;
            width: 98px;
            height: 30px;
            font-size: 14px;
            border-radius: 4px;
            font-weight: 500;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #1890FF;
        }
    }
}

.historyClass {
    background-color: #fff;
    margin-top: 20px;
    padding: 0 58px 20px 58px;

    .historyHeader {
        display: flex;
        align-items: center;
        height: 80px;
        border-bottom: 1px solid #E9E9E9;

        .fragment {
            height: 27px;
            width: 6px;
            background: #096DD9;
            margin-right: 10px;
        }
        .versionText{
            font-size: 16px;
            font-weight: 500;
            color: #409EFF;
        }
    }

    .mainBody {
        padding: 0 20px 0 20px;
        height: 80px;
        border: 1px dashed #E9E9E9;
        border-radius: 5px;
        margin-top: 20px;
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
                background-color: #1890FF;
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 30px;
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
    }
}
</style>