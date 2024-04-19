<template>
    <div id="casePeiFuDetails">
        <div class="danger-box">
            <el-row class="con-row border-bt">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">估损金额：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="claimInfo.estimatedAmount+''" placement="top">
                            <span class="col-black">{{claimInfo.estimatedAmount }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">索赔金额：</span> 
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="claimInfo.claimAmount+''" placement="top">
                            <span class="col-black">{{claimInfo.claimAmount}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">赔付方式：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="caseInfo.subTypeName" placement="top">
                            <span class="col-black">{{caseInfo.subTypeName}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
            <el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">材料准备齐全时间：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="claimInfo.clientOfferFullMaterialsTime" placement="top">
                            <span class="col-black">{{claimInfo.clientOfferFullMaterialsTime }}</span>
                        </el-tooltip>
                    </div>
                    
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">提交保险公司时间：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="claimInfo.materialsSendInsuranceCompanyTime" placement="top">
                            <span class="col-black">{{claimInfo.materialsSendInsuranceCompanyTime}}</span>
                        </el-tooltip>
                    </div>
                   
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">快递单图片：</span>
                    <span class="col-span-r col-black">
                        <el-button v-if="getFileData" type="text" @click="setCaseFileList">查看附件</el-button>
                    </span>
                </el-col>
            </el-row>
        </div>
        <caseFileList ref="caseFileList"></caseFileList>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import caseFileList from './caseFileList'
export default {
    components:{
        caseFileList
    },
    data() {
		return {
            fileTypeList:['快递单图片']
		}
    },
    computed:{
        ...mapGetters({
            caseInfo:'caseInfo',
            claimInfo:'claimInfo',
            fileList:'fileList',
        }),
        getFileData(){
            let tableData = this.fileList.filter(item=> this.fileTypeList.find(v1=>v1 === item.fileType))
            return tableData.length
        },
    },
    props:{
       
    },
    created() {
    },
    methods: {
        setCaseFileList(){
            this.$refs.caseFileList.openInit(this.fileTypeList)
        },
    }
}
</script>
<style lang="less" scoped>
    #casePeiFuDetails {
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
        }
        .border-bt {
            border-bottom: 1px solid #e9e9e9;
        }
        
    }

</style>