<template>
    <div id="RenewalService">
        <div class="renewalService-left">
            <ul class="company-nav">
                <li v-for="item,index in renewalBranches"  :key="item.branchCode + index"  :class="{'active': item.branchCode == companyActive}"  @click="addActive(item.branchCode)">{{item.branchName}}</li>
            </ul>
        </div>
        <div class="renewalService-right">
            <div class="right-year">
                <span style="margin-right: 20px">年份</span>
                <el-select size="mini" v-model="renewalStatisticObj.year" clearable placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in yearList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </div>
            <div class="table-content">
                <el-table :data="tableData" border header-row-class-name="t-header" :header-cell-style="getRowClass">
                    <el-table-column prop="year" label="年份" align="center" width="100">
                    </el-table-column>
                    <el-table-column prop="projectName" label="项目名称" align="left" width="260">
                        <template slot-scope="scope">
                            <div class="column-slot">
                                <span class="company-name" @click="onCompany(scope.row)">{{ scope.row.projectName }}</span>
                                <span v-if="currentYear == scope.row.year" style="color: #ffa940">-进行中（{{scope.row.startMonth}}-{{scope.row.endMonth}}月份）</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="policyNum" align="right" :label="'同期\n客户数量'"></el-table-column>
                    <el-table-column prop="stopNum" align="right" label="停工停产"></el-table-column>
                    <!-- <el-table-column prop="shortNum" align="right" label="短期"></el-table-column> -->
                    <el-table-column prop="renewalNum" align="right" :label="'实际\n应续保'"></el-table-column>
                    <el-table-column prop="renewaledNum" align="right" label="已续保"></el-table-column>
                    <el-table-column prop="unrenewalNum" align="right" label="未续保"></el-table-column>
                    <el-table-column prop="rate" align="right" label="续保率">
                        <template slot-scope="scope"><span>{{scope.row.rate}}%</span></template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import RenewalService from "@/service/renewalService";
import PolicyentryService from "@/service/PolicyentryService";
export default {
    data() {
        return {
            renewalService: new RenewalService(),
            policyentryService: new PolicyentryService(),
            tableData: [],
            branchCode: '', // 当前分支结构编码
            authDataInfo: [], // 数据权限
            renewalBranches: [], // 分公司列表
            yearList: [], // 年份列表
            companyActive: '',
            renewalStatisticObj: { // 查询保单追踪统计数据 条件
                branchCode: "",
                year: "",
            },
            flagActive: true,
            currentYear:　"",
        };
    },
    created() {
        this.initialization();
    },
    watch: {
        "renewalStatisticObj.year": {
            handler(newName, oldName) {
                this.renewalStatistic();
            },
            deep: true
        }  
    },
    methods: {
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
            return 'background:#E6F7FF;color: #000;'
            } else {
            return ''
            }
        },
        initialization() {
            this.currentYear = new Date().getUTCFullYear();
            this.branchCode = window.sessionStorage.getItem('branchCode') || '';
            this.authDataInfo = window.sessionStorage.getItem('authDataInfo').split(',') || [];
            this.renewalCondition();
        },
        // 保单追踪查询条件
        async renewalCondition() {
            let { data: { code, data: { renewalBranches, years, renewalStatusEnums } } } = await this.renewalService.renewalCondition();
            if(code == '0000') {
                this.flagActive = true;
                this.renewalBranches = renewalBranches.filter(item => item.branchCode != '');
                this.yearList = years;
                window.sessionStorage.setItem("renewalStatusEnums", JSON.stringify(renewalStatusEnums))
                if(this.branchCode == 'JT0000') {
                    this.renewalBranches.unshift({
                        branchName: '全部',
                        branchCode: '',
                    })
                } else { 
                    this.renewalBranches = this.renewalBranches.filter(item =>this.authDataInfo.some(v1=>v1 === item.branchCode));
                    this.companyActive = this.renewalBranches[0].branchCode;
                    // this.flagActive = false;
                    this.renewalStatisticObj.branchCode = this.renewalBranches[0].branchCode;
                }
                this.renewalStatistic();
            }
        },
        // 查询保单追踪统计数据
        async renewalStatistic() {
            let { data: { code, list } } = await this.renewalService.renewalStatistic(this.renewalStatisticObj);
            if(code == '0000') { 
                this.tableData = list.map(item => {
                    return {
                        ...item,
                        rate: (item.rate *100).toFixed(2)
                    }
                });
            }
        },
        // 打开新Tab页
        onCompany(project) {
            window.sessionStorage.setItem("projectItem", JSON.stringify(project))
            let routeData = this.$router.resolve({ name: "recordSheet", });
            window.open(routeData.href, "_blank");
        },
        addActive(branchCode) {
            if(this.flagActive) {
                this.companyActive = branchCode;
                this.renewalStatisticObj.branchCode = branchCode;
                this.renewalStatistic();
            }
        },
    },
};
</script>

<style lang="less">
#RenewalService {
    width: 100%;
    display: flex;
    .t-header {
        th.el-table__cell {
            color: #000;
            background-color: #E6F7FF;
        }
    }
    .renewalService-left {
        width: 230px;
        height: auto;
        margin-right: 10px;
        margin-top: 20px;
        background: #fff;
        padding-bottom: 50px;
    }
    .renewalService-right {
        box-sizing: border-box;
        width: 100%;
        height:auto;
        margin-top: 20px;
        padding-top: 29px;
        padding-left: 15px;
        padding-right: 15px;
        background: #fff;   
        padding-bottom: 50px;
        
    }
    .company-nav {
        box-sizing: border-box;
        padding: 0 20px;
        padding-top: 29px;
        li {
            padding: 5px 10px;
            border: 1px solid #096dd9;
            text-align: center;
            margin-bottom: 16px;
            border-radius: 18px;
            color: #096dd9;
            cursor: pointer;
        }
        li.active {
            color: #fff;
            background: #1890ff;
            border-color: #1890ff;
        }
    }
    .table-content {
        margin-top: 15px;
    }
    .company-name {
        color: #1890ff;
        font-weight: 600;
        cursor: pointer;
    }
}
</style>