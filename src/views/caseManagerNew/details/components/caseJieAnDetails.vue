<template>
    <div id="casePeiFuDetails">
        <div class="danger-box">
            <el-row class="con-row border-bt">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">结案总金额：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="endCaseInfo.totalPayAmount+''" placement="top">
                            <span class="col-black color-red-F5222D">{{endCaseInfo.totalPayAmount}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <!-- <el-col :span="8" class="con-col">
                    <span class="col-span-l">赔付方式：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="caseInfo.subTypeName" placement="top">
                            <span class="col-black">{{caseInfo.subTypeName}}</span>
                        </el-tooltip>
                    </div>
                </el-col> -->
            </el-row>
            <el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">人身伤亡：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="endCaseInfo.casualtiesPayMoney+''" placement="top">
                            <span class="col-black">{{endCaseInfo.casualtiesPayMoney}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">财产损失：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="endCaseInfo.thirdPayMoney+''" placement="top">
                            <span class="col-black">{{endCaseInfo.thirdPayMoney}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">其他费用：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="endCaseInfo.otherPayMoney+''" placement="top">
                            <span class="col-black">{{endCaseInfo.otherPayMoney}}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
            <el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">结案资料：</span>
                    <span class="col-span-r col-black">
                        <span>共{{getFileData}}个附件</span>
                        <el-button v-if="isShowRenewFileButton || getFileData" type="text" @click="setCaseFileList">查看附件</el-button>
                    </span>
                </el-col>
            </el-row>
        </div>
        <caseFileList ref="caseFileList" :isDelButton="true">
            <template slot="button" v-if="isShowRenewFileButton">
                <el-button @click="addFile" size="small" type="primary" class="mb10">重新上传结案资料</el-button>
                <caseAddFileDialog
                    ref="caseAddFileDialog"
                    accept=".pdf , .png, .jpg, .jpeg,.PDF , .PNG, .JPG, .JPEG, .eml, .m4a, .mp3, .EML, .M4A, .MP3"
                    acceptRemarks="只支持PDF/PNG/JPG/JPEG/EML/M4A/MP3，大小不超过20M（最多可上传9件）"
                    :limit="9"
                    :fileTypeData="fileTypeList"
                ></caseAddFileDialog>
            </template>
        </caseFileList>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import caseFileList from './caseFileList'
import caseAddFileDialog from '@/views/caseManagerNew/handle/components/caseAddFileDialog'
export default {
    components:{
        caseFileList,caseAddFileDialog
    },
    data() {
		return {
            fileTypeList:['结案文件','销案文件','拒赔文件','零结文件'],
		}
    },
    computed:{
        ...mapGetters({
            caseInfo:'caseInfo',
            endCaseInfo:'endCaseInfo',
            fileList:'fileList',
            caseSettleType:'caseSettleType',
        }),
        getFileData(){
            let {flieType} = this.caseSettleType.find(item=>item.code == this.endCaseInfo.closeType) || {flieType:''}
            if(flieType){
                let tableData = this.fileList.filter(item=> flieType === item.fileType)
                this.fileTypeList = [flieType]
                return tableData.length
            } else {
                this.fileTypeList = []
                return 0
            }
        },
        isShowRenewFileButton(){
            let caseProgressList = [
                {code:'401',name:'赔付结案',flieType:'结案文件'},
                {code:'404',name:'拒赔',flieType:'拒赔文件'},
                {code:'403',name:'销案',flieType:'销案文件'},
                {code:'405',name:'零结',flieType:'零结文件'},
            ]
            let caseProgressFlag = caseProgressList.some(item=>item.code === this.caseInfo.caseProgress)
            if(caseProgressFlag && window.sessionStorage.getItem('branchCode') == 'JT0000'){
                return true;
            }else{
                return false;
            }
        }
    },
    props:{
       
    },
    created() {
    },
    methods: {
        setCaseFileList(){
            console.log(this.fileTypeList,'-*-*-');
            this.$refs.caseFileList.openInit(this.fileTypeList)
        },
        addFile(){
            this.$refs.caseAddFileDialog.openInit()
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