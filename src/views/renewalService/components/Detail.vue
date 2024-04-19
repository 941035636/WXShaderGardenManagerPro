<template>
    <div id="Detail" v-if="JSON.stringify(detailObj) != '{}'">
        <div class="brInfo">
            <el-row class="mb20 mt10">
                <el-col :span="12">
                    <span>单位：</span>
                    <span class="text-color">{{ detailObj.branchName }}</span>
                </el-col>
                <el-col :span="12">
                    <span>客户经理：</span>
                    <p style="display: inline">
                        <span class="text-color" style="margin: 0 10px">{{ detailObj.managerName }}</span>
                    </p>
                </el-col>
            </el-row>
        </div>
        <div class="brInfo mt20">
            <h3 class="title">客户信息</h3>
            <el-row class="mt10">
                <el-col :span="12">
                    <span>客户名称：</span>
                    <span class="text-color">{{detailObj.holderName}}</span>
                </el-col>
                <el-col :span="12">
                    <span>行业：</span>
                    <span class="text-color">{{detailObj.industryName}}</span>
                </el-col>
                <el-col :span="12">
                    <span>客户地址：</span>
                    <span class="text-color">{{detailObj.provinceName}}<i class="n" v-if="detailObj.provinceName != ''">/</i>{{detailObj.cityName}}<i class="n" v-if="detailObj.cityName != ''">/</i>{{detailObj.areaName}}</span>
                </el-col>
                <el-col :span="12">
                    <span>联系人：</span>
                    <span class="text-color">{{detailObj.contactName}}</span>
                </el-col>
            </el-row>
        </div>
        <div class="brInfo mt20">
            <h3 class="title">保单信息</h3>
            <el-row class="mt10">
                <el-col :span="12">
                    <span>产品名称：</span>
                    <span class="text-color">{{detailObj.projectName}}</span>
                </el-col>
                <el-col :span="12">
                    <span>签单日期：</span>
                    <span class="text-color">{{detailObj.issueDate.split(" ")[0]}}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <span>保单号：</span>
                    <span class="text-color">{{detailObj.policyNo}}</span>
                </el-col>
                <el-col :span="12">
                    <span>保险止期：</span>
                    <span class="text-color">{{detailObj.polEndDate.split(" ")[0]}}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <span>保费：</span>
                    <span class="text-color">{{detailObj.afterPrem}}</span>
                </el-col>
            </el-row>
        </div>
        <div class="brInfo mt20">
            <h3 class="title">续保信息</h3>
            <el-row class="mt10" v-if="detailObj.renewalStatus == 100">
                <el-col :span="8">
                    <span>续保状态：</span>
                    <span class="text-color">{{detailObj.renewalStatusNewStr}}</span>
                </el-col>
            </el-row>
            <el-row class="mt10" v-if="detailObj.renewalStatus == 200">
                <el-col :span="8">
                    <span>续保状态：</span>
                    <span class="text-color">{{detailObj.renewalStatusNewStr}}</span>
                </el-col>
                <el-col :span="8">
                    <span>保费：</span>
                    <span class="text-color">{{detailObj.renewalPrem}}</span>
                </el-col>
                <el-col :span="8">
                    <span>{{detailObj.sum.indexOf("-") != -1 ? '减少' : '增加'}}：</span>
                    <span class="text-color">{{Math.abs(detailObj.sum)}}</span>
                </el-col>
                <el-col :span="12">
                    <span>续保单号：</span>
                    <span class="text-color">{{detailObj.policyNoRenewal}}</span>
                </el-col>
            </el-row>
            <el-row class="mt10" v-if="detailObj.renewalStatus != 100 &&　detailObj.renewalStatus　!= 200">
                <el-col :span="10" style="line-height: 30px">
                    <span>续保状态：</span>
                    <span class="text-color">{{detailObj.renewalStatusNewStr}}</span>
                </el-col>
                <el-col :span="12" style="line-height: 30px" v-if="detailObj.renewalStatus == 300 || detailObj.renewalStatus == 400">
                    <span>原因：</span>
                    <span class="text-color">{{detailObj.renewalReasonName}}{{detailObj.renewalReason2Name?'/'+detailObj.renewalReason2Name:''}}</span>
                </el-col>
                <el-col :span="24"  style="line-height: 30px">
                    <span>客户跟进具体情况：</span>
                    <span class="text-color">{{detailObj.trackInfo}}</span>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        detail: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data () {
        return {
            detailObj: {},
        }
    },
    watch: {
        detail: {
            handler(newValue) { 
                this.detailObj = newValue; 
                this.detailObj['sum'] = (newValue.renewalPrem - newValue.afterPrem).toFixed(2) + ""
            },
            deep: true
        }
    }
};
</script>

<style lang="less">
#Detail {
    color: #000;
    .brInfo {
        line-height: 50px;
    }
    .borbtm {
        border-bottom: 1px dashed #ccc;
    }
    .title {
        font-weight: 600;
    }
    .text-color {
        color: #000;
    }
    .files {
        span {
            display: block;
            line-height: 30px;
            cursor: pointer;
        }
        span:hover {
            color: blue;
        }
    }
    .ser-text {
        margin: 0 5px;
    }
    .n {
        font-style: normal;
    }
}
</style>