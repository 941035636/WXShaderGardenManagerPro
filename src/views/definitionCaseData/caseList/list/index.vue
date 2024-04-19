<template>
    <div style="padding: 0 20px 0 20px;">
        <div class="headerClass">
            <el-row>
                <el-col :span="8">
                    <div class="sonClass">
                        <div class="textClass">产品名称：</div>
                        <div class="frameClass">
                            <el-input v-model="filtrateData.productName" clearable placeholder="模糊查询"></el-input>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="sonClass">
                        <div class="textClass">产品编码：</div>
                        <div class="frameClass">
                            <el-input v-model="filtrateData.productCode" clearable placeholder="精准查询"></el-input>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="sonClass">
                        <div class="textClass">保险公司：</div>
                        <div class="frameClass">
                            <el-select v-model="filtrateData.insuranceCompany" filterable placeholder="请选择" clearable
                                style="width: 100%;">
                                <el-option v-for="item in insuranceCompanyList" clearable :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <div class="sonClass">
                        <div class="textClass">状态：</div>
                        <div class="frameClass">
                            <el-select v-model="filtrateData.state" placeholder="请选择" clearable style="width: 100%;">
                                <el-option v-for="item in stateList" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="sonClass">
                        <div class="searchClass" @click="init">查询</div>
                        <div class="emptyClass" @click="empty">清空筛选条件</div>
                    </div>
                </el-col>
                <el-col :span="8"></el-col>
            </el-row>
        </div>
        <div class="gridClass">
            <div class="newlyClass">
                <div></div>
                <div class="butClass" @click="productOption">添加案件资料</div>
            </div>
            <el-table :data="tableData" border style="width: 100%" :header-cell-style="{
                background: '#E9E9E9', color: '#000000'
            }">
                <el-table-column type="index" label="序" width="50" align="center">
                </el-table-column>
                <el-table-column label="产品信息">
                    <template slot-scope="scope">
                        <div>{{ scope.row.productName + '（' + scope.row.productCode + '）' }}</div>
                        <div style="color: #309AFE;">{{ scope.row.insuranceName }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="当前版本号" width="200" align="center">
                    <template slot-scope="scope">
                        <div style="color: #389E0D; font-size: 14px; font-weight: 500;">
                            {{ scope.row.version ? 'v' + versionProcessing(scope.row.version) : '' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="200" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.statusName == '最新版本'" style="color: #389E0D;">最新版本</div>
                        <div v-if="scope.row.statusName == '有更新'" style="color: #FA8C16;">有更新</div>
                        <div v-if="scope.row.statusName == '审核不通过'" style="color: #F5222D;">
                            审核不通过
                            <el-popover placement="top-start" width="200" trigger="click"
                                :content="scope.row.examineReason || '--'">
                                <i class="el-icon-question" slot="reference"></i>
                            </el-popover>
                        </div>
                        <div v-if="scope.row.statusName == '待发布'">待发布</div>
                    </template>
                </el-table-column>
                <el-table-column prop="useCount" label="使用次数" width="200" align="center">
                </el-table-column>
                <el-table-column label="更新日期" width="220">
                    <template slot-scope="scope">
                        <div>{{ scope.row.updateTime }}</div>
                        <div>{{ scope.row.creator + '/' + scope.row.branch }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="particulars(scope.row)">查看</el-button>
                        <el-button type="text" v-if="scope.row.statusName == '最新版本'" @click="publish(scope.row)">发布</el-button>
                        <el-button type="text" v-if="scope.row.statusName == '待发布'" @click="publish(scope.row)">发布</el-button>
                        <el-button type="text" v-if="scope.row.statusName == '审核不通过'" @click="publish(scope.row)">修改</el-button>
                        <el-button type="text" v-if="scope.row.statusName == '有更新'" @click="checkClick(scope.row)">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagingClass">
                <el-pagination background @current-change="handleCurrentChange" :current-page="pn" :page-size="ps"
                    layout="prev, pager, next, jumper , total" :total="total">
                </el-pagination>
            </div>
        </div>
        <ProductOption ref="productOptionRef" />
        <AuditPage ref="auditPage" @auditing="auditingClick"/>
    </div>
</template>
<script>
import CaseService from '@/service/CaseService.js';
import '../../components/unify.less';
import ProductOption from '../../components/productOption.vue';
import AuditPage from '../../components/auditPage.vue';

export default {
    components: {
        ProductOption, AuditPage
    },
    data() {
        return {
            caseService: new CaseService(),
            filtrateData: {
                productName: '',//产品名称
                productCode: '',//产品编码
                insuranceCompany: '',//保险公司
                state: '',//状态
            },
            insuranceCompanyList: [],//保险公司筛选列表数据
            stateList: [
                { value: '300', label: '最新版本' },
                { value: '200', label: '有更新' },
                { value: '210', label: '审核不通过' },
                { value: '100', label: '待发布' },
            ],//状态列表数据
            tableData: [],
            total: 20,//列表总条数
            ps: 10,//每页多少条
            pn: 1,//当前页数
        }
    },
    computed: {},
    mounted() {
        this.getInsuranceCompanyName();
    },
    methods: {
        auditingClick(){
            this.init();
        },
        versionProcessing(e) {
            let version = e.slice(0, (e.length - 2)) + '.' + e.slice(1, (e.length - 1)) + '.' + e.slice(-1);
            return version
        },
        //获取保司列表
        async getInsuranceCompanyName() {
            let res = await this.caseService.getInsuranceCompanyName();
            if (res.code == '0000') {
                res.data.forEach(_item => {
                    this.insuranceCompanyList.push({
                        value: _item,
                        label: _item
                    })
                })
            };
        },
        //页面刚进入调用的列表接口
        async init() {
            let params = {
                // creator:'',//创建人
                // creatorCode:'',//创建人编码
                insuranceCompany: this.filtrateData.insuranceCompany,//保险公司
                page: this.pn,
                pageSize: this.ps,
                productCode: this.filtrateData.productCode,//产品编码
                productName: this.filtrateData.productName,//产品名称
                status: this.filtrateData.state,//状态 状态 100 草稿，200 审核中， 210 驳回 300 使用中 900 停用
            };
            let res = await this.caseService.productConfigPages(params)
            if (res.code === '0000') {
                this.tableData = res.data.list;
                this.total = res.data.total;
            };
        },
        //清空按钮触发的事件
        empty() {
            this.filtrateData.productName = '';
            this.filtrateData.productCode = '';
            this.filtrateData.insuranceCompany = '';
            this.filtrateData.state = '';
            this.init();
        },
        handleCurrentChange(e) {
            this.pn = e;
            this.init();
        },
        //打开选择产品弹窗
        productOption() {
            this.$refs.productOptionRef.openClick()
        },
        //打开审核弹窗
        checkClick(e) {
            this.$refs.auditPage.openClick(e)
        },
        //发不事件
        publish(e) {
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
        // 查看详情事件
        particulars(e) {
            let paramsata = JSON.stringify({
                insuranceName: e.insuranceName,
                productCode: e.productCode,
                productName: e.productName,
                creator: e.creator,
                updateTime: e.updateTime
            });
            this.$router.push({
                path: '/case/particulars',
                query: { paramsata: paramsata },
            })
        }
    }
}
</script>

<style lang="less" scoped>
.headerClass {
    background-color: #fff;
    margin-bottom: 23px;
}

.gridClass {
    background-color: #fff;
    width: 100%;

    .newlyClass {
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 32px;

        .butClass {
            font-size: 14px;
            padding: 7px 30px 7px 30px;
            background-color: #1890FF;
            color: #fff;
            border-radius: 30px;
            font-weight: bold;
            margin-right: 20px;
            cursor: pointer;
        }
    }

    .pagingClass {
        text-align: right;
        padding: 20px 32px 20px 32px;
    }
}
</style>