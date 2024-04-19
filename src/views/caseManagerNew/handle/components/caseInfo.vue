<template>
<!-- 保单详情 -->
    <div id="caseInfo">
        <div style="width: 100%; display:flex; text-align: center;height: 100px; align-items: center; justify-content: center;" v-if="!policyInfoVo">
            <div>
                <el-button type="primary" @click="insurancePolicy" :disabled="isCasePause">关联保单</el-button>
            </div>
            <div style="text-align: left;">
                <p class="ml20">投保人名称：<span class="color-red-F5222D">{{caseInfo.holderName}}</span></p>
                <p class="ml20">无保单报案原因：<span class="color-red-F5222D">{{caseInfo.noPolicyReason}}</span></p>
            </div>
            
        </div>
        <div v-if="policyInfoVo">
            <el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">投/被保人名称：</span>
                     <div class="col-span-r">
                        <el-tooltip effect="dark" :content="getName" placement="top">
                            <span class="col-black">{{getName}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">保单号：</span>
                     <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.policyNo" placement="top">
                            <span class="col-black">{{policyInfoVo.policyNo}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">所属行业：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.industryProduct" placement="top">
                            <span class="col-black">{{policyInfoVo.industryProduct}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
            <el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">保险期间：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="getPolDate" placement="top">
                            <span class="col-black">{{getPolDate}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">保险机构：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.issueCompanyName" placement="top">
                            <span class="col-black">{{policyInfoVo.issueCompanyName}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">投保产品：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.productName" placement="top">
                            <span class="col-black">{{policyInfoVo.productName}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
            <el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">保费金额：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.premium + ''" placement="top">
                            <span class="col-black color-red-F5222D">￥{{policyInfoVo.premium}}元</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">累计责任限额：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="getCumulativeLimit" placement="top">
                            <span class="col-black">{{getCumulativeLimit}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">数据来源：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.fromSys" placement="top">
                            <span class="col-black">{{policyInfoVo.fromSys}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
            <el-row class="con-row">
                <!-- <el-col :span="8" class="con-col">
                    <span class="col-span-l">联系人：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.contactPerson" placement="top">
                            <span class="col-black">{{policyInfoVo.contactPerson}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">联系电话：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.contactPhone" placement="top">
                            <span class="col-black">{{policyInfoVo.contactPhone}}</span>
                        </el-tooltip>
                    </div>
                </el-col> -->
                <el-col :span="8" class="con-col">
                    <span class="content-r-button" v-if="!isCasePause"  @click="insurancePolicy()">重新关联保单</span>
                </el-col>
            </el-row>
        </div>
        <!-- 关联保单组件 -->
        <caseRelationPolicy ref="caseRelationPolicy"></caseRelationPolicy>
    </div>
</template>
<script>
import caseRelationPolicy from './caseRelationPolicyDialog'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    components:{
        caseRelationPolicy
    },
    data() {
		return {
            
		}
    },
    computed:{
        ...mapGetters(['caseInfo','policyInfoVo','isCasePause']),
        getPolDate(){
            // let s = this.policyInfoVo.polStartDate.split(' ')[0] || ''
            // let e = this.policyInfoVo.polEndDate.split(' ')[0] || ''
            let s = this.policyInfoVo.polStartDate?this.policyInfoVo.polStartDate.split(' ')[0] : ''
            let e = this.policyInfoVo.polEndDate?this.policyInfoVo.polEndDate.split(' ')[0] : ''
          return `${s} 至 ${e}`
        },
        getName(){
          let s = this.policyInfoVo.holderName
          let e = this.policyInfoVo.insuredCompanyName || '--'
          return `${s} / ${e}`
        },
        getCumulativeLimit(){
            let prem = 0
            if(this.policyInfoVo.cumulativeLimit) {
                prem = this.policyInfoVo.cumulativeLimit / 10000  
            }
            
            return `${prem}万元`
        }
    },
    props:{
       
    },
    created() {
    },
    methods: {
        // 关联保单
        insurancePolicy(){
            this.$refs.caseRelationPolicy.openInit()
        }
    }
}
</script>
<style lang="less" scoped>
    #caseInfo {
        background-color:#fff;
        margin-top: 10px;
        padding: 10px 20px 10px;
         .con-row{
            color: #000;
            height: 40px;
            line-height: 40px;
            .con-col {
                height: 40px;
                line-height: 40px;
            }
            .col-span-l {
                height: 40px;
                line-height: 40px;
                width: 140px;
                display: inline-block;
                color: #919191;
                overflow:hidden;
            }
            .col-span-r {
                height: 40px;
                line-height: 40px;
                display: inline-block;
                width: calc(100% - 150px);
                overflow:hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow:ellipsis;
            }
            .see-button {
                padding: 0;
            }
            .content-r-button {
                margin: 3px 0;
                margin-right: 5px;
                display: inline-block;
                padding: 3px 20px;
                color: #096DD9;
                border: 1px solid #096DD9;
                border-radius: 4px;
                line-height: 25px;
                cursor: pointer;
            }
        }
        
    }

</style>