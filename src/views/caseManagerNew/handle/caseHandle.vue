<template>
	<div id="caseHandle">
		<v-head class="v-head"></v-head>
		<div class="caseHandleBox">
            <!-- 案件头部 -->
            <caseHeader @caseEnd="setCaseApply"></caseHeader>
            <!-- 案件基本信息 -->
            <caseInfo></caseInfo>
            <!-- 认领案件 -->
            <PushInsuranceDetails></PushInsuranceDetails>
            <!-- 案件中止 -->
            <caseStop v-if="caseInfo.caseStatus == '1'"></caseStop>
            <!-- 案件tabs -->
            <caseTabs ref="caseTabs" @tabsChange="tabsChange"></caseTabs>
            <!-- 案件tabs -->
            <caseReportDetails></caseReportDetails>
            <div v-if="tabsFalg == '1'">
                <!-- 案件出险信息 -->
                <caseAppearDetails></caseAppearDetails>
                <!-- 案件标的信息 -->
                <caseBiaoDiDetails v-if="isBiaoDiComponent"></caseBiaoDiDetails>
                <!-- 案件从业人员第三者信息 -->
                <caseThreePerson v-if="isPersonComponent" dangerOrClose="danger"></caseThreePerson>
            </div>
            <div v-if="tabsFalg == '2'">
                <!-- 案件索赔信息 -->
                <caseClaim ref="caseClaim"></caseClaim>
                <!-- 案件索赔资料信息 -->
                <caseClaimFile ref="caseClaimFile"></caseClaimFile>
            </div>
            <div v-if="tabsFalg == '3'">
                <!-- 案件赔付信息 -->
                <casePeiFu ref="casePeiFu"></casePeiFu>
                <!-- 案件从业人员第三者信息 -->
                <caseThreePerson dangerOrClose="close" v-if="isPersonComponent"></caseThreePerson>
            </div>
            <div class="btn-submit">
                <el-button v-if="tabsFalg == '2' || tabsFalg == '3'" plain style="border: 1px solid #096DD9;color:#096DD9;" @click="saveSubmit()" :disabled="isPendingStatus || isCasePause">保存并返回列表</el-button>
                <!-- <el-button v-if="isPendingStatus" :disabled="isCasePause" @click="addAcceptance()" type="primary">案件受理</el-button> -->
                <el-button v-if="tabsFalg == '2'" type="primary" :disabled="isPendingStatus || isCasePause" @click="submitClaimInfo('next')">下一步，结案</el-button>
                <el-button v-if="tabsFalg == '3'" type="primary" :disabled="isPendingStatus || isCasePause" @click="submitEndCaseInfoSave('submit')">确认提交结案申请</el-button>
                <div v-if="isPendingStatus">
                    <img src="../../../assets/images/jiandanpei.jpg" alt="" style="width:100px;height:100px;vertical-align: middle;">
                    <span style="margin-left:10px;color:#F9963F;width:140px; display: inline-block; vertical-align: middle;text-align: left;"> 请登录“简单赔”小程序完成受理</span>
                </div>
            </div>
        </div>
        <!-- 新增案件受理 -->
        <caseAddAcceptance ref="caseAddAcceptance"></caseAddAcceptance>
        <!-- 新增结案申请 -->
        <caseApplyDialog ref="caseApplyDialog"></caseApplyDialog>
	</div>
</template>

<script>
import vHead from '@/components/common/Header';
import caseHeader from './components/caseHeader';
import caseInfo from './components/caseInfo';
import caseTabs from './components/caseTabs';
import caseReportDetails from './components/caseReportDetails';
import caseAppearDetails from './components/caseAppearDetails';
import caseBiaoDiDetails from './components/caseBiaoDiDetails';
import caseThreePerson from './components/caseThreePerson';
import caseClaim from './components/caseClaim';
import caseClaimFile from './components/caseClaimFile';
import casePeiFu from './components/casePeiFu';
import caseStop from './components/caseStop';
import caseAddAcceptance from './components/caseAddAcceptanceDialog';
import PushInsuranceDetails from './components/PushInsuranceDetails';
import caseApplyDialog from './components/caseApplyDialog';
import {mapState,mapGetters,mapActions,mapMutations} from 'vuex'; //先要引入
import CaseServiceNew from '@/service/CaseServiceNew'
import moment from 'moment';
export default {
	components:{
        vHead,caseHeader,caseInfo,caseTabs,caseReportDetails,caseAppearDetails,caseBiaoDiDetails,caseThreePerson,caseClaim,caseClaimFile,casePeiFu,caseAddAcceptance,caseStop,caseApplyDialog,PushInsuranceDetails
	},
	data() {
		return {
            CaseServiceNew: new CaseServiceNew(),
            tabsFalg:'1'
		}
	},
	computed:{
        ...mapGetters(['caseInfo','isPendingStatus','riskInfo','policyInfoVo','targetInfo','injuredList','fileList','getFilesDataComponets','isCasePause','endCaseInfo','claimInfo']),
        isBiaoDiComponent(){
            let flag;
            switch (this.policyInfoVo.productCategoryCode) {
                case "DT":
                case "SD":
                case "WY":
                case "YJSP":
                    flag = true
                    break;
                default:
                    flag = false
                    break;
            }
            return flag
        },
        isPersonComponent(){
            let accidentType = this.riskInfo.accidentType || []
            return accidentType.some(item=>item === '一般人伤' || item === '滞留')
        },
    },
	created(){
        this.getCaseInfoDetails()
	},
	mounted() {
        
    },
    beforeRouteLeave(to, from, next){
        this.setCaseInfoDetails({})
        this.setPushInsurance({})
        next()
    },
	methods: {
        ...mapMutations(['setCaseInfoDetails','setPushInsurance']),
        ...mapActions(['getCaseInfo','getArea','saveClaimInfo','endCaseInfoSave','getTime']),
        // 获取案件详情
        async getCaseInfoDetails(){
            this.getArea()
            this.getTime()
            this.getCaseInfo(this.$route.query.reportNo)
        },
        tabsChange(val){
            // 离开索赔信息
            if(this.tabsFalg == '2' && (val == '1' || val == '3')){
                this.submitClaimInfo('tabsChangeSubmit')
                 this.tabsFalg = val
            } else if (this.tabsFalg == '3' && (val == '1' || val == '2')){ // 离开赔付信息
                this.submitEndCaseInfoSave('tabsChangeSubmit')
                this.tabsFalg = val
            } else {
                this.tabsFalg = val
            }
            
        },
        // 新增案件受理
        addAcceptance(){
            if(!this.policyInfoVo.policyNo){
                this.$message.error('请补全保单信息')
            } else if (
                this.policyInfoVo.policyNo &&
                (
                    this.policyInfoVo.productCategoryCode == 'DT' ||
                    this.policyInfoVo.productCategoryCode == 'SD' ||
                    this.policyInfoVo.productCategoryCode == 'WY' ||
                    this.policyInfoVo.productCategoryCode == 'YJSP'
                ) &&
                Object.keys(this.targetInfo).length === 0
                
            ) {
                this.$message.error('请补全标的信息')
            } else if (this.riskInfo.accidentType.find(item=> item == '一般人伤' || item == '滞留') && this.injuredList.length === 0) {
                this.$message.error('请补出险人员信息')
            } else {
                this.$refs.caseAddAcceptance.openInit()
            }
        },
        // 保存返回列表接口
        saveSubmit(){
            if(this.tabsFalg == 2){
                this.submitClaimInfo('Back')
            } else if(this.tabsFalg == 3) {
                this.submitEndCaseInfoSave('Back')
            }
        },
        // 索赔信息新增
        async submitClaimInfo(flag){
            let caseClaim = this.$refs.caseClaim.submit()
            let caseClaimFile = this.$refs.caseClaimFile.submit()
            if(!caseClaim){
                if(flag !== 'tabsChangeSubmit'){
                    this.$message.warning("补全信息")
                }
            } else {
                let code = await this.saveClaimInfo({
                    ...caseClaim,
                    ...caseClaimFile,
                    action:flag === 'next'?'log':'',
                })
                if(code === '0000') {
                    if(flag === 'Back') {
                        this.$router.go(-1)
                    } else if(flag === 'next') {
                        this.getCaseInfo(this.caseInfo.reportNo)
                        this.$refs.caseTabs.checkoutTab('3')
                    }
                }
            }
        },
        // 赔付信息提交
        async submitEndCaseInfoSave(flag){
            let casePeiFu = this.$refs.casePeiFu.submit()
            if(casePeiFu){
                let obj = {
                    ...casePeiFu,
                    action:flag === 'submit'?'log':'',
                }
                let code = await this.endCaseInfoSave(obj)
                if(code==='0000'){
                    if(flag === 'Back') {
                        this.$router.go(-1)
                    } else if(flag === 'submit') {
                        // this.$refs.caseTabs.checkoutTab('3')
                        // 案件申请
                        this.setCaseApply()
                    }
                }
            }
        },
        setCaseApply(){
            let personInfoFlag = this.getPersonInfo()
            let getRulesFile = this.getRulesFile()
            let getClaimVerification = this.getClaimVerification()  // 索赔规则校验
            let getTargetInfo = this.getTargetInfo()
            if(this.endCaseInfo.closeType === '401'){
                let endCaseFileFlag = this.getEndCaseFile('结案文件')
                if(!endCaseFileFlag) {
                    this.$message.error('结案文件未上传，请上传后申请结案')
                } else if(!getTargetInfo) {
                    this.$message.error('标的缺少信息，请填写后申请结案')
                } else if(!personInfoFlag) {
                    this.$message.error('出险人员缺少信息，请填写后申请结案')
                } else if(!getRulesFile) {
                    this.$message.error('索赔文件未上传，请上传后申请结案')
                } else if(!getClaimVerification) {
                    this.$message.error('请在客户补充单处上传被保险人营业执照及法人身份证复印件')
                } else if(!this.endCaseInfo.totalPayAmount || this.endCaseInfo.totalPayAmount === 0) {
                    this.$message.error('赔付总金额不能为0元')
                } else {
                    this.$refs.caseApplyDialog.openInit()
                }
                    
            } else if(this.endCaseInfo.closeType === '402'){
                this.$refs.caseApplyDialog.openInit()
            } else if(this.endCaseInfo.closeType === '403'){
                let endCaseFileFlag = this.getEndCaseFile('销案文件')
                if(!endCaseFileFlag) {
                    this.$message.error('销案文件未上传，请上传后申请结案')
                } else {
                    this.$refs.caseApplyDialog.openInit()
                }
            } else if(this.endCaseInfo.closeType === '404'){
                let endCaseFileFlag = this.getEndCaseFile('拒赔文件')
                if(!endCaseFileFlag) {
                    this.$message.error('拒赔文件未上传，请上传后申请结案')
                } else {
                    this.$refs.caseApplyDialog.openInit()
                }
            } else if(this.endCaseInfo.closeType === '405'){
                let endCaseFileFlag = this.getEndCaseFile('零结文件')
                if(!endCaseFileFlag) {
                    this.$message.error('零结文件未上传，请上传后申请结案')
                } else {
                    this.$refs.caseApplyDialog.openInit()
                }
            } else {
                 this.$message.error('请在结案信息里面，选择结案类型')
            }
            
        },
         // 获取一级类型fileType
        getFileType(){
            let fileType = ''
            if(this.caseInfo.litigation){
                fileType = '诉讼文件'
            } else if(!this.caseInfo.litigation && this.caseInfo.subType == '200'){
                fileType = '非诉讼文件-小额快赔'
            } else if(!this.caseInfo.litigation && this.caseInfo.subType == '100'){
                fileType = '非诉讼文件'
            }
            return fileType
        },
        // 检验赔付文件
        getEndCaseFile(fileType){
            let list = this.fileList.filter((item)=>{
                if(item.fileType === fileType){
                    return item
                }
            })
            if(list.length === 0) {
                return false
            } else {
                return true
            }
        },
        // 校验出险人员是否填写
        getPersonInfo(){
            let accidentType = this.riskInfo.accidentType || []
            if(accidentType.some(item=>item === '一般人伤' || item === '滞留')){
                let injuredList = this.injuredList
                if(injuredList.length == 0 || injuredList.some(item=>item.casualties === '')){
                    return false
                } else {
                    return true
                }
                
            } else {
                return true
            }
        },
        // 校验文件必填
        getRulesFile(){
            let list = []
            let completeList = []
            let fileType = this.getFileType()
            this.getFilesDataComponets.forEach(v1=>{
                v1.child.forEach(v2=>{
                    if(v2.isRequired) {
                        let isUpload = this.fileList.some(item=>item.fileType == fileType && item.fileSecType == v1.oneType && item.fileLabel == v2.twoType)
                        list.push(v2.isRequired)
                        if(isUpload){
                            completeList.push(isUpload)
                        }
                    }
                })
            })
            if(list.length === completeList.length){
                return true
            } else {
                return false
            }
        },
        // 提交赔付结案时验证索赔金额大于一万元,需要校验
        getClaimVerification(){
            let fileType = this.getFileType()
            let isUpload = this.fileList.some(item=>item.fileType == fileType && item.fileSecType == '制式性材料' && item.fileLabel == '客户信息补充单')
            let accidentType = this.riskInfo.accidentType || []
            let accidentTypeFlag = accidentType.some(item=>item === '一般人伤' || item === '第三者财产' || item === '滞留')
            if(this.claimInfo && this.claimInfo.claimAmount >= 10000){
                if(
                    this.caseInfo.litigation === true && !isUpload
                ){
                    return false
                } else if (this.caseInfo.litigation === false && this.caseInfo.subType == 100 && accidentTypeFlag && !isUpload) {
                    return false
                } else {
                    return true
                }
            } else {
                return true
            }
            
        },
        // 校验标的
        getTargetInfo(){
            if(this.policyInfoVo.policyNo &&
                (
                    this.policyInfoVo.productCategoryCode == 'DT' ||
                    this.policyInfoVo.productCategoryCode == 'SD' ||
                    this.policyInfoVo.productCategoryCode == 'WY' ||
                    this.policyInfoVo.productCategoryCode == 'YJSP'
                ) &&
                Object.keys(this.targetInfo).length === 0){
                return false
            } else {
                return true
            }
        },
    },
    
}

</script>

<style lang="less">
#caseHandle {
	width: 100%;
	background-color:#f7f7f7;
	padding-bottom: 80px;
	max-height: 100%;
    min-width: 1200px;
	overflow: scroll;
	.v-head {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
	}
    .caseHandleBox {
        margin-top: 60px;
        padding: 0 50px;
        .btn-submit {
            margin: 20px 0;
            text-align: center;
        }
    }

}
</style>
