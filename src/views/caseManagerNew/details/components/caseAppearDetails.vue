<template>
    <div id="caseAppearDetails">
        <div class="danger-box">
            <el-row class="con-row border-bt">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">出险时间：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="riskInfo.riskTime" placement="top">
                            <span class="col-black">{{riskInfo.riskTime}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">出险地点：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="getAreaName" placement="top">
                            <span class="col-black">{{getAreaName}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">详细地址：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="riskInfo.riskAddr" placement="top">
                            <span class="col-black">{{riskInfo.riskAddr}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
            <el-row class="con-row border-bt">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">案件类型：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="getAccidentType" placement="top">
                            <span class="col-black">{{getAccidentType}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">事故原因：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="riskInfo.accidentReason" placement="top">
                            <span class="col-black">{{riskInfo.accidentReason}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">事故场所：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="riskInfo.accidentSite" placement="top">
                            <span class="col-black">{{riskInfo.accidentSite}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
            <el-row class="con-row border-bt">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">故障类型： </span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="riskInfo.faultType" placement="top">
                            <span class="col-black">{{riskInfo.faultType}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
            <el-row class="con-row border-bt">
                <el-col :span="23" class="con-col">
                    <span class="col-span-l">备注： </span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="riskInfo.remark" placement="top">
                            <span class="col-black">{{riskInfo.remark}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="danger-box">
            <el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">报案方式：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="caseInfo.reportType" placement="top">
                            <span class="col-black">{{caseInfo.reportType}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">报案人(电话)：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="getReportPersonDetais" placement="top">
                            <span class="col-black">{{getReportPersonDetais}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">联系人(电话)：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="getLinkPersonDetais" placement="top">
                            <span class="col-black">{{getLinkPersonDetais}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    components:{
    },
    data() {
		return {
            
		}
    },
    computed:{
        ...mapGetters(['riskInfo','caseInfo']),
        getAreaName(){
            return `${this.riskInfo.riskProvinceName}${this.riskInfo.riskCityName}${this.riskInfo.riskAreaName}`
        },
        getAccidentType(){
            return this.riskInfo.accidentType?this.riskInfo.accidentType.join('、'):''
        },
        getReportPersonDetais(){
            return `${this.riskInfo.reportName}(${this.riskInfo.reportPhone})`
        },
        getLinkPersonDetais(){
            return `${this.riskInfo.linkmanName}(${this.riskInfo.linkmanPhone})`
        },
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
    #caseAppearDetails {
        background-color:#fff;
        .danger-box{
            .danger-box-title {
                font-size: 14px;
                font-weight: 700;
                color: #000;
            }
        }
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
                display: inline-block;
                color: #919191;
                overflow:hidden;
            }
            .see-button {
                padding: 0;
            }
            .color-0050B3 {
                color: #0050B3;
            }
            .col-span-r {
                height: 40px;
                line-height: 40px;
                display: inline-block;
                width: calc(100% - 40%);
                overflow:hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow:ellipsis;
            }
        }
        .border-bt {
            border-bottom: 1px solid #e9e9e9;
        }
        
    }

</style>