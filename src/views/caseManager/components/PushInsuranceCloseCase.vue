<template>
  <div id="PushInsuranceCloseCase" v-if="pushInsuranceFlag">
      <p class="case-title" style="color:#ffa940">
          <i class="el-icon-s-claim"></i>
          检测到保司结案数据
      </p>
       <BaseTable :list="lists"></BaseTable>
  </div>
</template>

<script>
import BaseTable from './BaseTable3.vue'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    name: "PushInsuranceCloseCase",
    components:{
        BaseTable
    },
    data() {
        return {
            lists: [
            {
                title: '结案类型',
                key: 'settleTypeName',
                value: '',
                color: '#1890FF',
            },{
            
                title: '赔付/销案/拒赔/零赔时间',
                key: 'casePayTime',
                value: '',
                color: '#000000',
            },{
                title: '事故预防类型',
                key: 'accidentRiskName/accidentRiskSubName',
                value: '',
                color: '#000000',
            },{
                title: '估损金额',
                key: 'estimatedLossAmount',
                value: '',
                color: '#F5222D',
            },{
                title: '赔付金额',
                key: 'totalMoney',
                value: '',
                color: '#F5222D',
            },{
                title: '',
                key: '',
                value: '',
                color: '',
            },],
        };
    },
    computed: {
        ...mapGetters(['pushInsuranceData']),
        pushInsuranceFlag(){
            return this.pushInsuranceData.isPushInsuranceFlag
        },
    },
    mounted() {
        this.openDetails()
    },
    methods: {
        openDetails(){
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
#PushInsuranceCloseCase {
    margin-bottom: 10px;
    .case-title {
        background-color: #fffaea;
        padding: 0 20px;
        // .el-icon-video-pause {
            color: #ffa940;
            font-size: 14px;
            line-height: 30px;
            // margin-right: 20px;
        // }
    }
    
}


</style>
