<template>
<!-- 保单详情 -->
    <div id="caseBaseInfos">
        <div>
            <el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">报案号：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="caseInfo.reportNo" placement="top">
                            <span class="col-black">{{caseInfo.reportNo }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">报案时间：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="caseInfo.reportTime" placement="top">
                            <span class="col-black">{{caseInfo.reportTime }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">案件进度：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="caseInfo.caseProgressName" placement="top">
                            <span class="col-FA8C16">{{caseInfo.caseProgressName }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
            <el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">案件处理人员：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="caseInfo.serverName" placement="top">
                            <span class="col-0050B3">{{caseInfo.serverName }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">保司报案号：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="caseInfo.inscompReportNo" placement="top">
                            <span class="col-0050B3">{{caseInfo.inscompReportNo }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">转报案时间：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="caseInfo.transferringTheCaseTime" placement="top">
                            <span class="col-black">{{caseInfo.transferringTheCaseTime }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
            <el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">录入人员：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="caseInfo.enteredUser" placement="top">
                            <span class="col-black">{{caseInfo.enteredUser }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">录入时间：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="caseInfo.enteredTime" placement="top">
                            <span class="col-black">{{caseInfo.enteredTime }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col"></el-col>
            </el-row>
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
            'caseInfo',
        ])
    },
    created() {
    },
    methods: {}
}
</script>
<style lang="less" scoped>
    #caseBaseInfos {
        background-color:#fff;
         .con-row{
            color: #000;
            height: 40px;
            line-height: 40px;
            // .col-span-l {
            //     display: inline-block;
            //     width: 120px;
            //     color: #919191;
            // }
            .con-col {
                height: 40px;
                line-height: 40px;
            }
            .col-span-l {
                width: 140px;
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
                width: calc(100% - 160px);
                overflow:hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow:ellipsis;
            }
            .see-button {
                padding: 0;
            }
        }
        
    }
</style>