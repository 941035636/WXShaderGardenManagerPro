<template>
<!-- 保单详情 -->
    <div id="casePolicyInfo">
        <div>
            <el-row class="con-row">
                <el-col class="con-col" :span="8">
                    <span class="col-span-l">投/被保人名称：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="getName" placement="top">
                            <span class="col-black">{{getName}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col class="con-col" :span="8">
                    <span class="col-span-l">保单号：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.policyNo" placement="top">
                            <span class="col-black">{{policyInfoVo.policyNo}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col class="con-col" :span="8">
                    <span class="col-span-l">行业/险种：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.industryProduct" placement="top">
                            <span class="col-black">{{policyInfoVo.industryProduct}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
            <el-row class="con-row">
                <el-col class="con-col" :span="8">
                    <span class="col-span-l">保险期间：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.polStartDate+ '至' + policyInfoVo.polEndDate" placement="top">
                            <span class="col-black">{{policyInfoVo.polStartDate}}至{{policyInfoVo.polEndDate}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col class="con-col" :span="8">
                    <span class="col-span-l">出单公司：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.issueCompanyName" placement="top">
                            <span class="col-black">{{policyInfoVo.issueCompanyName}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col class="con-col" :span="8">
                    <span class="col-span-l">投保产品：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.productName" placement="top">
                            <span class="col-black">{{policyInfoVo.productName}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
            <el-row class="con-row">
                <el-col class="con-col" :span="8">
                    <span class="col-span-l">保费金额：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.premium+''" placement="top">
                            <span class="color-red-F5222D">￥{{policyInfoVo.premium}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col class="con-col" :span="8">
                    <span class="col-span-l">数据来源：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.fromSys" placement="top">
                            <span class="col-black">{{policyInfoVo.fromSys}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col class="con-col" :span="8">
                    <!-- <span class="col-span-l">联系人：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.contactPerson" placement="top">
                            <span class="col-black">{{policyInfoVo.contactPerson}}</span>
                        </el-tooltip>
                    </div> -->
                </el-col>
            </el-row>
            <!-- <el-row class="con-row">
                <el-col class="con-col" :span="8">
                    <span class="col-span-l">联系电话：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="policyInfoVo.contactPhone" placement="top">
                            <span class="color-0050B3">{{policyInfoVo.contactPhone}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row> -->
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    data() {
		return {
            
		}
    },
    computed: {
        ...mapGetters([
            'policyInfoVo',
        ]),
        getName(){
          let s = this.policyInfoVo.holderName || '--'
          let e = this.policyInfoVo.insuredCompanyName || '--'
          return `${s} / ${e}`
        },
    },
    created() {
    },
    methods: {}
}
</script>
<style lang="less" scoped>
    #casePolicyInfo {
        background-color:#fff;
         .con-row{
            color: #000;
            height: 40px;
            line-height: 40px;
            .con-col {
                height: 40px;
                line-height: 40px;
                .col-span-l {
                    display: inline-block;
                    width: 110px;
                    color: #919191;
                    overflow:hidden;
                    height: 40px;
                    line-height: 40px;
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
            }
            .see-button {
                padding: 0;
            }
            
        }
        
    }
</style>