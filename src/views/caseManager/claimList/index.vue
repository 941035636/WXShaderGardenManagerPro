<template>
    <div id="ClaimList">
        <ClaimScreen :queryForm="form" @queryFrom="queryFrom" @empty="empty" @jtBranchsList="jtBranchsList"></ClaimScreen>
        <div class="claim-container">
            <ClaimState :stateStatus="form.referenceStatus" @stateChange="stateChange"></ClaimState>
            <ClaimTable ref="claimTable" :queryForm="form" @openDialog="openDialog"></ClaimTable>
            <Distribution ref="Distribution" :params="distributionParams" @successCb="queryFrom"></Distribution>
            <ClaimDialog v-model="dialogVisibleB" :title="'保司案件信息'" :width="'80%'">
                <template slot="body">
                    <div style="margin-top: 20px">
                        <BaseTable :list="lists"></BaseTable>
                        <div class="close-btn">
                            <el-button round @click="dialogVisibleB = false">关闭</el-button>
                        </div>
                    </div>
                </template>
            </ClaimDialog>
        </div>
    </div>
</template>

<script>
import ClaimTable from './components/ClaimTable'
import ClaimState from './components/ClaimState'
import ClaimScreen from './components/ClaimScreen'
import Distribution from './components/Distribution'
import ClaimDialog from './components/ClaimDialog'
import BaseTable from './components/BaseTable.vue'
import Claim from '../../../service/claim'

export default {
    name: "ClaimList",
    components: {
        ClaimTable,
        ClaimState,
        ClaimScreen,
        Distribution,
        ClaimDialog,
        BaseTable,
    },
    data() {
        return { 
            claim: new Claim(), 
            value: '',
            input: '',
            dialogVisibleB: false,
            distributionParams: {},
            form: {
                insuredCompanyCaseNo: '',
                fromSys: '',
                holderName: '',
                dataCompetences: '000000',
                referenceStatus: '1',
                sortingStatus: '2',
                pn: 1,
                ps: 10,
                sortingChannel: "sequip",
                desc:true,
            },
            lists: [{
                title: '单位名称',
                key: 'sortingBranchName',
                value: '',
            },{
                title: '投保人/客户名称',
                key: 'holderName',
                value: '',
            },{
                title: '出险单位',
                key: 'riskUnit',
                value: '',
            },{
                title: '出险人',
                key: 'riskName',
                value: '',
            },{
                title: '出险标的',
                key: 'target',
                value: '',
            },{
                title: '报案人',
                key: 'reportName',
                value: '',
            },{
                title: '保险公司处理人',
                key: 'servicerName',
                value: '',
            },{
                title: '保险公司报案号',
                key: 'insuredCompanyReportNo',
                value: '',
            },{
                title: '保险公司案件号',
                key: 'insuredCompanyCaseNo',
                value: '',
            },{
                title: '保单号',
                key: 'policyNo',
                value: '',
            },{
                title: '案件创建时间',
                key: 'createTime',
                value: '',
            },{
                title: '案件出险时间',
                key: 'riskTime',
                value: '',
            },{
                title: '报案时间',
                key: 'reportTime',
                value: '',
            },{
                title: '境内/境外',
                key: 'riskLocation',
                value: '',
            },{
                title: '出险地区',
                key: 'riskProvinceName',
                value: '',
            },{
                title: '事故预防类型',
                key: 'accidentRiskName/accidentRiskSubName',
                value: '',
            },{
                title: '事故经过',
                key: 'accidentsAndLosses',
                value: '',
            },{
                title: '估损金额',
                key: 'estimatedLossAmount',
                value: '',
            },{
                title: '是否结案',
                key: 'isCloseCase',
                value: '',
            },{
                title: '结案类型',
                key: 'settleTypeName',
                value: '',
            },{
                title: '赔付金额',
                key: 'totalMoney',
                value: '',
            },{
                title: '币种名称',
                key: 'currencyName',
                value: '',
            },{
                title: '赔付/销案/拒赔/零赔时间',
                key: 'casePayTime',
                value: '',
            },{
                title: '保险公司',
                key: 'fromSys',
                value: '',
            },],
        }
    },
    methods: {
        openDialog(value) {
            this.distributionParams = value.data
            value.dialogTitle == 'detail' && this.baosiDetail();
            value.dialogTitle == 'detail' && this.baosiDetail();
            if(value.dialogTitle == 'distribution'){
                this.$refs.Distribution.openInit(value.data)
            } else if (value.dialogTitle == 'detail') {
                this.dialogVisibleB = true
                this.baosiDetail()
            }

        },
        queryFrom(value) {
            // 如果没有传值，就采用默认值
            if(value) {
                this.form = value
            }
            this.$refs.claimTable.selectDockingClaimList()
        },
        stateChange(value) {
            this.form.referenceStatus = value == '0' ? null : value;
            this.$refs.claimTable.selectDockingClaimList()
        },
        empty(value) {
            this.form = value;
            this.$refs.claimTable.selectDockingClaimList()
        },
        jtBranchsList(value) {
            this.form.dataCompetences = value.join(',')
        },
        baosiDetail() {
            for (const key in this.distributionParams) {
                this.lists.forEach(item => {
                    let accidentRiskName = '', accidentRiskSubName = ''
                    if(item.key.indexOf('/') != -1) {
                        let splitArr = item.key.split('/')
                          accidentRiskName = this.distributionParams[splitArr[0]]
                          accidentRiskSubName = this.distributionParams[splitArr[1]]
                    }
                    if(item.key == 'accidentRiskName/accidentRiskSubName') {
                        item.value = `${accidentRiskName}/${accidentRiskSubName}`
                    }
                    if(key == item.key) {
                        if(key == 'isCloseCase'){
                            item.value = this.distributionParams[key] == '0' ? '结案' : '未结案'
                        } else if(key == 'riskLocation') {
                            item.value = this.distributionParams[key] == '0' ? '境内' : '境外'
                        } else if(key == 'riskProvinceName') {
                            
                            item.value = `${this.distributionParams[key]}/${this.distributionParams['riskCityName']}/${this.distributionParams['riskAreaName']}`
                        } else if(key == 'estimatedLossAmount') {
                            item.value = `￥${this.distributionParams[key] || 0}`
                        } else if(key == 'totalMoney') {
                            item.value = `￥${this.distributionParams[key] || 0}`
                        } else {
                            item.value = this.distributionParams[key];
                        }
                    }
                })
            }
        },
        async queryCaseDockingByCaseNo(params) {
            let res = await this.claim.queryCaseDockingByCaseNo(params);
        }
    },
}
</script>

<style lang="less">
#ClaimList {
    padding: 0 20px;
    .query-criteria, .claim-container {
        width: 100%;
        margin: 20px 0;
        background-color: #fff;
        padding: 20px 30px;
        box-sizing: border-box;
    }
    .table-list {
        margin-top: 20px;
    }
    .close {
        color: #5A5A5A;
        border-color: #BBBBBB;
        background: #F5F5F5;
    }
    .close-btn {
        text-align: center;
        button {
            padding: 11px 60px;
            margin-top: 30px;
            color: #000;
            border: 1px solid #DCDFE6;
            background: #F5F5F5;
        }
    }
    .submit {
        color: #fff;
        border-color: #FFA940;
        background: #FFA940;
    }
    .close, .submit {
        padding: 10px 30px;
    }
    .query-box {
        box-sizing: border-box;
        width: 100%;
        text-align: right;
        padding-right: 25px;
        span {
            padding: 8px 25px;
            border-radius: 50px;
            cursor: pointer;
        }
        .query {
            color: #fff;
            background: #FFA940;
        }
        .empty-condition {
            margin-right: 15px;
            background: #E9E9E9;
        }
    }
    .row-bg {
      margin-bottom: 20px;
      line-height: 40px;
      .item1 {
        width: 70%;
      }
      .item2 {
        box-sizing: border-box;
        display: block;
        width: 25%;
        padding-right: 25px;
        font-size: 14px;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #666666;
      }
    }
    .state-active {
        background: #E6F7FF;
    }
    .ruleForm {
        margin-top: 18px;
    }
    .form-item {
        margin-bottom: 20px;
        .el-form-item__content {
            display: flex;
            align-items: center;
        }
        .el-form-item__label {
            text-align: left;
            color: #000;
        }
    }
    .el-dialog__header {
        .el-dialog__title {
            font-size: 20px;
        }
    }
    .pointer {
        cursor: pointer;
    }
    .c096DD9 {
        color: #096DD9;
    }
    .cFA8C16 {
        color: #FA8C16;
    }
    .W320 {
        width: 320px;
    }
    .W240 {
        width: 240px;
    }
}
</style>
<style>
    .el-table__header-wrapper .el-table__header thead th .cell {
        color: #000;
    }
</style>