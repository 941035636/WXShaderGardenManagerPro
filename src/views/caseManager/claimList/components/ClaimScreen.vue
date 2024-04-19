<template>
    <div id="ClaimScreen">
        <div class="query-criteria">
            <el-row type="flex" class="row-bg">
                <el-col :span="8">
                    <div style="display: flex">
                        <span class="item2">保险公司</span>
                        <!-- <el-input class="item1" v-model="form.fromSys" placeholder="请输入内容"></el-input> -->
                        <el-select class="item1" v-model="form.fromSys" placeholder="请选择">
                            <el-option v-for="item in caseDockingInsuranceCompany" :key="item.value" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div style="display: flex">
                        <span class="item2">保司报案号</span>
                        <el-input class="item1" v-model="form.insuredCompanyReportNo" clearable placeholder="请输入"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div style="display: flex">
                        <span class="item2">投保人/客户名称</span>
                        <el-input class="item1" v-model="form.holderName" clearable placeholder="请输入"></el-input>
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" style="margin-bottom: 0">
                <el-col :span="8">
                    <div style="display: flex">
                        <span class="item2">分支机构</span>
                        <el-select class="item1" v-model="branchCode" @change="branchCodeChange" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in branchList" :key="key" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div style="display: flex">
                        <div class="query-box">
                            <span class="empty-condition" @click="empty">清空条件</span>
                            <span class="query" @click="query">查询</span>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import UserManageService from '@/service/userManageService'
export default {
    name: "ClaimScreen",
    props: {
        queryForm: {
            type: Object,
            default: function() {
                return {}
            }
        },
    },
    data() {
        return {
            userManageService: new UserManageService(),
            form: {},
            branchCode: '',
            jtBranchsList: [],
            branchList: [],
            caseDockingInsuranceCompany: [{value: "大地财险", label: "大地财险"},
            {value: "平安财险", label: "平安财险"},
            {value: "天安财险", label: "天安财险"},
            {value: "中华财险", label: "中华财险"},
            {value: "太保财险", label: "太保财险"},
            {value: "太平财险", label: "太平财险"},
            {value: "永诚财险", label: "永诚财险"},
            {value: "华泰财险", label: "华泰财险"},
            {value: "中航安盟", label: "中航安盟"},
            {value: "鼎和财险", label: "鼎和财险"},
            {value: "亚太财险", label: "亚太财险"},],
        }
    },
    watch: {
        queryForm: {
            handler(newValue) {
                this.form = newValue;
            },
            deep: true,
            immediate:true,
        },
    },
    created() {
        this.getJtBranchs();
        this.getBranchInfo();
    },
    methods: {
        branchCodeChange(value) {
            this.form.dataCompetences = value;
        },
        query() {
            let oldData = Object.assign({}, this.form)
            this.$emit('queryFrom', oldData)
        },
        empty() {
            this.form = {
                insuredCompanyReportNo: '',
                fromSys: '',
                holderName: '',
                dataCompetences: window.sessionStorage.getItem('jtBranchsList'),
                referenceStatus: '1',
                sortingStatus: '2',
                pn: 1,
                ps: 10,
                sortingChannel: 'sequip',
            }            
            this.branchList.length == 1 ? (this.branchCode = this.branchList[0].jtBranchCode) : (this.branchCode = '')
            this.$emit('empty', this.form)
        },
        getJtBranchs() {
            let jtBranchs = window.sessionStorage.getItem('authDataInfo') || ''
            if(jtBranchs && jtBranchs.indexOf(",") != -1) {
                this.jtBranchsList = jtBranchs.split(",")
            } else {
                jtBranchs == '000000' ? this.jtBranchsList = ['JT0000'] : this.jtBranchsList = [jtBranchs]
            }
            window.sessionStorage.setItem('jtBranchsList', this.jtBranchsList.join(','))
            this.$emit("jtBranchsList", this.jtBranchsList)
        },
        async querySysDictMenu() {
            let res = await this.querySysDictMenu('jteb');
        },
        async getBranchInfo() {
            let { data: { code, list } } = await this.userManageService.getBranchInfo()
            if(code == '0000') {
                if(list.length && this.jtBranchsList.length) {
                    if(this.jtBranchsList.includes('JT0000')){
                        this.branchList = list
                    } else {
                        this.branchList = list.filter(item => this.jtBranchsList.includes(item.jtBranchCode))
                    }
                    if(this.branchList.length == 1) {
                        this.branchCode = this.branchList[0].jtBranchCode
                    }
                } else {
                    list.unshift({
                        jtBranchCode: '000000',
                        jtBranchName: '全部',
                    })
                    this.branchList = list
                }
                window.sessionStorage.setItem('branchLists', JSON.stringify(this.branchList))
            }
        },
    }
}
</script>

<style lang="less" scoped>
#ClaimScreen {
    .query-criteria {
        width: 100%;
        margin: 20px 0;
        background-color: #fff;
        padding: 20px 30px;
        box-sizing: border-box;
    }
    .a {
        width: 30px;
        padding: 10px 0;
        border: 1px solid skyblue;
    }
}
</style>