<template>
  <div id="PushInsuranceDetails" v-if="pushInsuranceFlag">
      <!-- {{pushInsuranceData}} -->
      <div class="title">
          <div class="title-l">
              <img src="../../../assets/images/database.jpg" alt="" srcset="">
                <div class="ml20">
                <p>保险公司：{{pushInsuranceDetails.fromSys}}</p>
                <p>
                    <span>案件状态：</span>
                    <span class="color-FF9228">{{pushInsuranceDetailsCaseStatus}}</span>
                    <span>(更新时间：{{pushInsuranceDetails.updateTime}})</span>
                </p>
            </div>
          </div>
          <div class="title-r">
               <span style="color:#1890FF">说明：保险公司“已结案”，请点击按钮查看详情。</span> 
                <el-button type="primary" round @click="openDetails">保司案件信息</el-button>
          </div>
      </div>
      <div>
          <el-table
            :data="pushInsuranceTable"
            border
            :header-cell-style="getRowClass"
            style="width: 100%">
            <el-table-column
                prop="settleTypeName"
                label="结案类型"
                width="180">
                <template slot-scope="sopced">
                    <span style="color:#1890FF">
                        {{sopced.row.settleTypeName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="casePayTime"
                label="赔付/销案/拒赔/零赔时间"
            >
            </el-table-column>
            <el-table-column
                prop="settleTypeName"
                label="事故预防类型"
                width="180">
                <template slot-scope="sopced">
                    {{sopced.row.accidentRiskName}}-{{sopced.row.accidentRiskSubName}}
                </template>
            </el-table-column>
            <el-table-column
                prop="settleTypeName"
                label="事故预防类型"
                width="180">
                <template slot-scope="sopced">
                    {{sopced.row.accidentRiskName}}-{{sopced.row.accidentRiskSubName}}
                </template>
            </el-table-column>
            <el-table-column
                prop="estimatedLossAmount"
                label="估损金额"
                width="180">
                <template slot-scope="sopced">
                    <span class="color-red-F5222D" v-if="sopced.row.estimatedLossAmount">￥{{sopced.row.estimatedLossAmount}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="totalMoney"
                label="赔付金额"
                width="180">
                <template slot-scope="sopced">
                    <span class="color-red-F5222D" v-if="sopced.row.totalMoney">￥{{sopced.row.totalMoney}}</span>
                </template>
            </el-table-column>
           
            </el-table>
            <el-dialog :visible.sync="dialogVisibleB" :title="'保司案件信息'" :width="'80%'">
                <div style="margin-top: 20px">
                    <BaseTable :list="lists"></BaseTable>
                    <div class="close-btn">
                        <el-button round @click="dialogVisibleB = false">关闭</el-button>
                    </div>
                </div>
            </el-dialog>
      </div>
      
  </div>
</template>

<script>
import ClaimDialog from '@/views/caseManager/claimList/components/ClaimDialog'
import BaseTable from '@/views/caseManager/claimList/components/BaseTable.vue'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    name: "PushInsuranceDetails",
    components:{
        ClaimDialog,
        BaseTable
    },
    data() {
        return {
            dialogVisibleB:false,
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
        };
    },
    computed: {
        ...mapGetters(['pushInsuranceData']),
        pushInsuranceDetails(){
            return this.pushInsuranceData.pushInsuranceDetails
        },
        pushInsuranceDetailsCaseStatus(){
            return this.pushInsuranceData.pushInsuranceDetails.isCloseCase == 1? '未结' :'已结案'
        },
        pushInsuranceTable(){
            return [this.pushInsuranceData.pushInsuranceDetails]
        },
        pushInsuranceFlag(){
            return this.pushInsuranceData.isPushInsuranceFlag
        },
    },
    mounted() {
        
    },
    methods: {
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
            return 'background:#FFF7E6; color: #000'
            } else {
            return ''
            }
        },

        openDetails(){
            this.dialogVisibleB = true
            for (const key in this.pushInsuranceData.pushInsuranceDetails) {
                this.lists.forEach(item => {
                    let accidentRiskName = '', accidentRiskSubName = ''
                    if(item.key.indexOf('/') != -1) {
                        let splitArr = item.key.split('/')
                          accidentRiskName = this.pushInsuranceData.pushInsuranceDetails[splitArr[0]]
                          accidentRiskSubName = this.pushInsuranceData.pushInsuranceDetails[splitArr[1]]
                    }
                    if(item.key == 'accidentRiskName/accidentRiskSubName') {
                        item.value = `${accidentRiskName}/${accidentRiskSubName}`
                    }
                    if(key == item.key) {
                        if(key == 'isCloseCase'){
                            item.value = this.pushInsuranceData.pushInsuranceDetails[key] == '0' ? '结案' : '未结案'
                        } else if(key == 'riskLocation') {
                            item.value = this.pushInsuranceData.pushInsuranceDetails[key] == '0' ? '境内' : '境外'
                        } else if(key == 'riskProvinceName') {
                            
                            item.value = `${this.pushInsuranceData.pushInsuranceDetails[key]}/${this.pushInsuranceData.pushInsuranceDetails['riskCityName']}/${this.pushInsuranceData.pushInsuranceDetails['riskAreaName']}`
                        } else if(key == 'estimatedLossAmount') {
                            item.value = `￥${this.pushInsuranceData.pushInsuranceDetails[key] || 0}`
                        } else if(key == 'totalMoney') {
                            item.value = `￥${this.pushInsuranceData.pushInsuranceDetails[key] || 0}`
                        } else {
                            item.value = this.pushInsuranceData.pushInsuranceDetails[key];
                        }
                    }
                })
            }
        }, 
    },
};
</script>

<style lang="less">
#PushInsuranceDetails {
    background-color: #E6F7FF;
    padding: 20px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    .title {
        display: flex;
        align-items: center;
        height: 60px;
        color: #000;
        .title-l{
            display: flex;
            width: 50%;
        }
        .title-r{
            display: flex;
            width: 50%;
            justify-content: right;
            align-items: center;
        }
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
}

</style>
