<template>
<!-- 转报案信息 -->
    <div id="caseReportDetails">
        <div>
            <el-row class="con-row">
                <el-col :span="8">
                    <span class="col-span-l">案件处理人员：</span>
                    <span class="color-0050B3">{{caseInfo.serviceInfo}}</span>
                </el-col>
                <el-col :span="8">
                    <span class="col-span-l">保司报案号：</span>

                    <span class="color-0050B3" v-if="caseInfo.inscompReportNo">{{caseInfo.inscompReportNo}}</span>
                    <span class="col-black"  v-if="!caseInfo.inscompReportNo && caseInfo.noTransferReason">{{caseInfo.noTransferReason }}</span>
                    <span class="col-black" v-if="caseInfo.siteCode">(坐席编号：{{caseInfo.siteCode}})</span>
                </el-col>
                <el-col :span="8">
                    <span class="col-span-l">转报案时间：</span>
                    <span class="col-black">{{caseInfo.transferringTheCaseTime}}</span>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    data() {
		return {
            
		}
    },
    computed:{
        ...mapGetters(['caseInfo'])
    },
    props:{
       
    },
    created() {
    },
    methods: {
        
    }
}
</script>
<style lang="less" scoped>
    #caseReportDetails {
        background-color:#fff;
        margin-top: 10px;
        padding: 10px 20px 10px;
         .con-row{
            color: #000;
            height: 40px;
            line-height: 40px;
            .col-span-l {
                display: inline-block;
                color: #919191;
            }
            .see-button {
                padding: 0;
            }
            .color-0050B3 {
                color: #0050B3;
            }
        }
        
    }

</style>