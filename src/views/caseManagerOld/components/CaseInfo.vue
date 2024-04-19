<template>
    <div id="caseBaseInfo">
        <div class="edit-top">
            <span class="content-title col-orange">案件信息</span>
        </div>
        <div class="border-style" v-if="baseInfo.settlementList && baseInfo.settlementList.length != 0">
            <span class="content-title">结案信息</span>
            <el-form   :label-position="labelPosition" class="over-case bor-btm" label-width="160px">
                <el-row v-for="(item,index) in baseInfo.settlementList" :key="'c' + index">
                    <el-col :span="8">
                        <el-form-item label="结案类型：">
                            {{item.settleType == '01' ?'结案' :'销案'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="结案申请时间：">
                                <span class="col-black">{{item.status}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="结案说明：">
                                <span class="col-black">{{item.settlementContent}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="审核结果：">
                            {{item.auditOpinion == '01'? '通过':'驳回'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="结案审核时间：">
                                <span class="col-black">{{item.createTime}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="驳回原因：">
                                <span class="col-black">{{item.reviewComments}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="border-style">
            <span class="content-title">案件进度</span>
            <el-form  :model="formInline"   :label-position="labelPosition" class="bor-btm">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="报案号：">
                                <span class="col-black">{{baseInfo.baseInfo.reportNo}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="案件状态：">
                                <span class="col-black">{{reportStatusName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        
        <div class="border-style">
            <span class="content-title">转报案信息</span>
            <el-form  :model="formInline"   :label-position="labelPosition" class="bor-btm">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="是否转报案：">
                                <span class="col-black font-style">{{(caseOverInfo.isTransferringTheCase == '1')?'是':'否'}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="转报案时间：">
                                <span class="col-black">{{caseOverInfo.reportInsuredCompanyTime?caseOverInfo.reportInsuredCompanyTime:'-'}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保险公司报案号：">
                                <span class="col-black">{{caseOverInfo.insuredCompanyReportNo ?caseOverInfo.insuredCompanyReportNo:'-'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="border-style">
            <span class="content-title">案件受理</span>
            <el-form    :label-position="labelPosition">
                <el-button type="warning" plain v-if="baseInfo.acceptionList.length == 0" @click="addAcc" :disabled="reportStatus != '03'">去添加</el-button>
                <div v-if="baseInfo.acceptionList.length != 0" >
                    <el-row v-for="(item, index) in baseInfo.acceptionList" :key="'a' + index">
                        <el-col :span="8">
                            <el-form-item label="受理结果：">
                                    <span class="col-black font-style">{{item.isAccept == true || item.isAccept == 'true'? '受理':'驳回'}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="受理时间：" v-if="item.isAccept == true || item.isAccept == 'true'">
                                    <span class="col-black">{{item.acceptTime}}</span>
                            </el-form-item>
                            <el-form-item label="驳回时间：" v-if="item.isAccept == false || item.isAccept == 'false'">
                                    <span class="col-black">{{item.acceptTime}}</span>
                            </el-form-item>
                        </el-col>
                        <br/>
                        <el-col :span="24">
                            <el-form-item label="受理原因：" v-if="item.isAccept == true || item.isAccept == 'true'">
                                    <span class="col-black">{{item.reason}}</span>
                            </el-form-item>
                            <el-form-item label="驳回原因：" v-if="item.isAccept == false || item.isAccept == 'false'">
                                    <span class="col-black">{{item.reason}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
        <el-dialog title="案件受理确认" :visible.sync="dialogVisible"  width="50%" :before-close="handleClose">
			<el-form :model="formCase" ref="formCase" label-width="120px" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="受理状态" prop="isAccept">
                            <el-radio v-model="formCase.isAccept" label="true">受理</el-radio>
                            <el-radio v-model="formCase.isAccept" label="false">驳回</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="受理时间" prop="acceptTime" v-if="formCase.isAccept == 'true'">
                            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formCase.acceptTime"  type="datetime" placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="驳回时间" prop="acceptTime" v-else>
                            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formCase.acceptTime"  type="datetime" placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="formCase.isAccept == 'true'">
                    <el-col :span="24">
                        <el-form-item label="受理建议">
                            <el-input v-model="formCase.reason" type="textarea" :rows="3" placeholder="受理建议"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="formCase.isAccept == 'false'">
                    <el-col :span="24">
                        <el-form-item label="驳回建议" prop="reason">
                            <el-input v-model="formCase.reason" type="textarea" :rows="3" placeholder="驳回建议"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="submit('formCase')">确 认</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import CaseService from '../../../service/CaseService.js';
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import store from '../../../store/index'
export default {
    data() {
		return {
            labelPosition: 'left',
            caseService: new CaseService(),
			tableData:[],
			tableData1:[],
			occupation:'',
			idNumber:'',
            fileList2:[],
            showAcc:true,
			dialogVisible:false,
			processNull:false,
			formInline: {
				no: '532414432455',
				status: '已结案'
            },
            formCase: {
                isAccept:'true',
                reason:'',
                acceptTime:'',
                caseNo: this.$route.query.caseNo,
                reportNo: this.$route.query.reportNo
            },
            typeOptions:[],
            rules:{
                isAccept:[
                    {required: true, message: '请选择受理状态', trigger: 'change'}
                ],
                acceptTime:[
                    {required: true, message: '请选择受理时间', trigger: 'change'}
                ],
                reason:[
                    {required: true, message: '请填写驳回建议', trigger: 'blur'}
                ],
            },
            caseStatus: [],
            reportStatusName:''
		}
    },
    computed:{
        ...mapGetters([
            "baseInfo",
            "caseOverInfo",
            "csaeDictionaries",
            "reportStatus"
        ]),
    },
    store,
    created() {
        this.getCaseDetail();
    },
    methods: {
        getCaseDetail() {
            this.reportStatusName = '-';
            for(let j = 0; j < this.csaeDictionaries.reportStatus.length; j++) {
                if(this.reportStatus == this.csaeDictionaries.reportStatus[j].value) {
                    this.reportStatusName = this.csaeDictionaries.reportStatus[j].label;
                }
            }
        },
        addAcc() {
            this.dialogVisible = true;
        },
        handleClose() {
            this.$refs['formCase'].resetFields();
            this.dialogVisible = false;
        },
        submit(formCase) {
            this.$refs[formCase].validate((valid) => {
                if(valid) {
                    this.postAcception();
                }else{
                    return false;
                }
            });
        },
        async postAcception(){
            if(this.formCase.isAccept == 'false'){
                if(!this.formCase.reason){
                    this.$message({
                        type: 'warning',
                        message: '请填写驳回建议'
                    });
                    return;
                }
            }
            if(this.formCase.isAccept == 'true' && !this.caseOverInfo.hasPolicy){
                this.$message({
                    type: 'warning',
                    message: '请先关联保单'
                });
                return;
            }
            let res = await this.caseService.postAcception(this.formCase);
            if(res.code == '0000') {
                this.showAcc = false;
                this.baseInfo.acceptionList.push(this.formCase);
                this.submits(this.formCase.isAccept);
                this.$store.commit('updateBaseInfo',this.baseInfo);
                this.dialogVisible = false;
            }
        },
        async submits(isAccept){
            let res = await this.caseService.casesl(this.$route.query.caseNo);
            if(res.code == '0000'){
                if(isAccept == 'true'){
                     this.$message({
                        type: 'success',
                        message: '已受理'
                    });
                    this.$store.commit('updataReportStatus',"04");
                }else{
                    this.$message({
					    type: 'success',
					    message: '已驳回'
                    });
                   this.$store.commit('updataReportStatus',"07");
                };
                this.getCaseDetail();
            }
        },
    }
}
</script>
<style lang="less" scoped>
    #caseBaseInfo {
        background-color:#fff;
        .border-style {
            .bor-btm {
                border-bottom: 1px dashed #ccc;
            }
            border: 0;
            .over-case {
                border-bottom: 1px dashed #ccc;
            }
        }
        .font-style {
            color: #FF0000;
            border: 1px solid #FD9494;
            border-radius: 4px;
            padding: 2px 4px;
            background-color: #ffefef;
        }
    }

</style>