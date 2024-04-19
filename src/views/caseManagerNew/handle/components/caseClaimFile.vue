<template>
<!-- 索赔信息组件 -->
    <div id="caseClaimFile">
        <div class="title">
            <div class="title-l">
                <span></span>
                <span>
                    索赔资料
                </span>
            </div>
        </div>
        <div class="file-box">
            <div class="tip">
                请根据“出险信息/案件类型”上传理赔资料：
                <span style="color:#FAA341">
                    {{getAccidentType}}
                </span>
                损失,
                目前总进度：
                <span style="color:#FAA341">{{getNum}}%</span>
            </div>
            <div class="mt20">
                <span>
                    <span class="color-red">*</span>
                    诉讼案件
                </span>
                <el-radio-group :disabled="isCasePause" v-model="litigation" @change="setLitigation">
                    <el-radio :label="false">非诉讼案件</el-radio>
                    <el-radio :label="true">诉讼案件</el-radio>
                </el-radio-group>
                <br/>
                <el-radio-group class="mt20 ml71" :disabled="isCasePause" v-model="subType" @change="setLitigation" v-if="this.policyInfoVo.productCategoryCode == 'DT' && litigation == false">
                    <el-radio label="100">常规赔付</el-radio>
                    <el-radio label="200">小额快赔</el-radio>
                </el-radio-group>
            </div>
            <caseClaimFileCom ref="caseClaimFileCom" :litigation="litigation" :subType="subType" :filesDataComponets="filesDataComponets"></caseClaimFileCom>
        </div>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions,mapMutations} from 'vuex'; //先要引入
import caseClaimFileCom from './caseClaimFileCom'
import claimFile from '../dataJson/claimFile'
export default {
    components:{
        caseClaimFileCom
    },
    data() {
		return {
            litigationPF:false,
            litigation:false,
            subType:100,   // 赔付方式
            filesDataComponets:[],
		}
    },
    computed:{
        ...mapGetters(['policyInfoVo','caseInfo','riskInfo','claimInfo','riskInfo','getFilesDataComponets','fileList','isCasePause']),
        getAccidentType(){
            return this.riskInfo.accidentType.join('、')
        },
        getNum(){
            let fileType = ''
            if(this.litigation){
                fileType = '诉讼文件'
            } else if(!this.litigation && this.subType == '200'){
                fileType = '非诉讼文件-小额快赔'
            } else if(!this.litigation && this.subType == '100'){
                fileType = '非诉讼文件'
            }
            let list = []
            let completeList = []
            this.getFilesDataComponets.forEach(v1=>{
                v1.child.forEach(v2=>{
                    if(v2.isRequired) {
                        let isUpload = this.fileList.some(item=>item.fileType === fileType && item.fileSecType == v1.oneType && item.fileLabel == v2.twoType)
                        list.push(v2.isRequired)
                        if(isUpload){
                            completeList.push(isUpload)
                        }
                    }
                })
            })
            if(completeList.length == 0 &&  list.length === 0) {
                return 100
            } else {
                return ((completeList.length / list.length).toFixed(2) * 100).toFixed(2)
            }
        },
    },
    watch:{
        caseInfo: {
            // 每个属性值发生变化就会调用这个函数
            handler(newVal, oldVal) {
                this.setForm()
            },
            // 立即处理 进入页面就触发
            immediate: true,
            // 深度监听 属性的变化
            deep: true
        },
    },
    props:{
       
    },
    created() {
    },
    mounted(){
        this.getFileComponents()
    },
    methods: {
        ...mapMutations(['setFilesDataComponets']),
        ...mapActions(['saveClaimInfo']),
        setForm(){
            this.litigation = this.caseInfo.litigation
            let subType = this.caseInfo.subType == '0' ? '100' : this.caseInfo.subType
            this.subType = subType
        },
        // 获取fils组件拼装数据
        getFileComponents(){
            // 诉讼案件
            this.filesDataComponets = []
            claimFile.forEach(item=>{
                let litigationConfig = item.litigationConfig.some(v1=>v1.value == 'All' || v1.value == this.litigation) // 是否诉讼案件
                let paymentConfig = item.paymentConfig.some(v1=>v1.value == 'All' || v1.value == this.subType)  // 是否小额快赔
                let riskTypeConfig = item.riskTypeConfig.some(v1=>v1.value == 'All' || v1.value == this.policyInfoVo.productCategoryCode) // 是否符合险种
                let excludeRiskTypeConfig = item.excludeRiskTypeConfig.some(v1=>v1.value == 'All' || v1.value == this.policyInfoVo.productCategoryCode) // 排除的险种
                let accidentTypeConfig = item.accidentTypeConfig.some(v1=>{
                   let accidentType = this.riskInfo.accidentType.some(v2=>v1.value == v2)
                    if(v1.value == 'All' || accidentType) {
                        return true
                    } else {
                        return false
                    }
                })
                if(litigationConfig && paymentConfig && accidentTypeConfig && riskTypeConfig && !excludeRiskTypeConfig) {
                    this.filesDataComponets.push(item)
                }
            })
            this.setFilesDataComponets(this.filesDataComponets)
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return 'background:#f5f5f5'
            } else {
                return ''
            }
        },
        addFile(){
            this.$refs.caseAddFile.openInit()
        },
        async setLitigation(){
            this.getFileComponents()
            let obj = {
                litigation:this.litigation,
                clientOfferFullMaterialsTime:this.claimInfo.clientOfferFullMaterialsTime,
                materialsSendInsuranceCompanyTime:this.claimInfo.materialsSendInsuranceCompanyTime,
                claimAmount:this.claimInfo.claimAmount,
                estimatedAmount:this.claimInfo.estimatedAmount,
                subType:this.getSubType()
            }
            this.saveClaimInfo(obj)
        },
        submit(){
            return {
                litigation:this.litigation,
                subType:this.getSubType()
            }
        },
        getSubType(){
            let subType = '0'
            if(!this.litigation && this.policyInfoVo.productCategoryCode == 'DT'){
                subType = this.subType
                console.log(subType,this.subType);
            } else if (!this.litigation && this.policyInfoVo.productCategoryCode != 'DT') {
                subType = '100'
            }
            return subType
        },
    }
}
</script>
<style lang="less" scoped>
    #caseClaimFile {
        background-color:#fff;
        margin-top: 10px;
        padding: 10px 20px 10px;
        .title {
            display: flex;
            height: 50px;
            width: 100%;
            margin: 0 auto;
            align-items: center;
            font-size: 12px;
            border-bottom: 1px solid #e9e9e9;
            .title-l {
                display: flex;
                align-items: center;
                width: calc(100% - 200px);
            }
            .title-r {
                width: 200px;
                text-align: right;
            }
            .title-l > span:nth-child(1) {
                display: inline-block;
                width: 5px;
                height: 16px;
                background-color: #096DD9;
            }
            .title-l > span:nth-child(2) {
                margin-left: 10px;
                font-size: 16px;
                color: #096DD9;

            }
        }
        .file-box {
            padding: 20px 60px;
            .tip {
                height: 40px;
                line-height: 40px;
                padding: 0 20px;
                width: 800px;
                background-color: #FEFFE6;
            }
            .file-table {
                padding: 0 10px;
            }
            .upload-btn {
                background-color: #355e92;
                border-color: #355e92;
            }
            .ml71 {
                margin-left: 71px;
            }
        }
        .fileTip {
            color: #096DD9;
            margin-left: 20px;
        }

        
    }

</style>