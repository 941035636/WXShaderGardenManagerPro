<template>
    <div id="caseBaseInfo">
        <!-- <div class="edit-top">
            <span class="col-orange"><span class="col-orange-bor"></span> 案件信息</span>
        </div> -->
        <div class="border-style border-style-padding">
            <!-- <span class="con-title">案件进度</span> -->
            <el-row class="con-row">
                <el-col :span="8">
                    <span>报案号：</span>
                    <span class="col-black">{{baseInfo.baseInfo.reportNo}}</span>
                </el-col>
                <el-col :span="8">
                    <span>报案时间：</span>
                    <span class="col-black">{{caseOverInfo.reportTime}}</span>
                </el-col>
                <el-col :span="8">
                    <span>案件进度：</span>
                    <span class="col-black col-status">{{reportStatusName}}</span>
                </el-col>
            </el-row>
            <el-row class="con-row">
                <el-col :span="8">
                    <span>服务人员：</span>
                    <span class="col-black">{{baseInfo.baseInfo.servicerName}}</span>
                    <span class="col-black">({{baseInfo.baseInfo.jtBranchName}})</span>
                </el-col>
                <el-col :span="8">
                    <span>服务人员电话：</span>
                    <span class="col-black">{{baseInfo.baseInfo.servicerPhone}}</span>
                </el-col>
            </el-row>
        </div>
        <div class="box-split"></div>
        <div class="border-style border-style-padding">
            <span class="con-title">关联保单信息</span>
            <el-row class="con-row">
                <el-col :span="8">
                    <span>保单号：</span>
                    <span class="col-black" >{{caseOverInfo.policyNo}}</span>
                    <span v-if="(reportStatus == '04' || reportStatus == '03' ) && !disabledBtn" @click="setPolicy" style="cursor:pointer;text-decoration: underline; color: #096DD9;margin-left:10px">修改关联</span>
                </el-col>
                <el-col :span="8">
                    <span>出单公司：</span>
                    <span class="col-black">{{caseOverInfo.issueCompanyName}}</span>
                </el-col>
                <el-col :span="8">
                    <span>投保产品：</span>
                    <span class="col-black">{{caseOverInfo.productName}}</span>
                </el-col>
            </el-row>
            <el-row class="con-row">
                <el-col :span="8">
                    <span>投/被保人名称：</span>
                    <span class="col-black">{{caseOverInfo.holderName}}</span>
                </el-col>
                <el-col :span="8">
                    <span>保障期间：</span>
                    <span class="col-black">{{caseOverInfo.polStartDate}}至{{caseOverInfo.polEndDate}}时</span>
                </el-col>
            </el-row>
        </div>
        <div class="box-split"></div>
        <div class="border-style pt10">
            <span class="con-title">案件受理</span>
                <!-- <el-button type="warning" plain v-if="baseInfo.acceptionList.length == 0" @click="addAcc" :disabled="reportStatus != '03'">去添加</el-button> -->
                <div v-if="baseInfo.acceptionList.length == 0 && reportStatus == '03' && !disabledBtn" @click="addAcc">
                    <el-row class="con-row">
                        <el-col :span="8">
                            <div>
                                <span>是否属于保险案件：</span>
                                <span style="display: inline-block; background-color: #FFA940; color: #fff; padding: 8px 20px; border-radius: 20px; cursor: pointer; margin:5px 0;" v-if="baseInfo.acceptionList.length == 0 && reportStatus == '03' && !disabledBtn" @click="addAcc">受理确认</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div v-if="baseInfo.acceptionList.length != 0" >
                    <el-row class="con-row" v-for="(item, index) in baseInfo.acceptionList" :key="'a' + index">
                        <el-col :span="8">
                            <div>
                                <span>是否属于保险案件：</span>
                                <span class="col-black" style="color: #FA8C16;">{{item.isAccept == true || item.isAccept == 'true'? '是，保险案件':'是，不属于保险案件'}}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div v-if="item.isAccept == true || item.isAccept == 'true'">
                                <span>受理时间：</span>
                                <span class="col-black">{{item.acceptTime}}</span>
                            </div>
                            <div v-if="item.isAccept == false || item.isAccept == 'false'">
                                <span>驳回时间：</span>
                                <span class="col-black">{{item.acceptTime}}</span>
                            </div>
                        </el-col>
                        <br/>
                        <el-row class="mt10">
                            <el-col :span="24">
                                <div v-if="item.isAccept == true || item.isAccept == 'true'">
                                    <span>备注信息：</span>
                                    <i class="iconfont iconxinxi" style="color:#FA8C16;font-size:20px;vertical-align: middle;" ></i>
                                    <span class="col-black" style="color:#096DD9; display: inline-block;width: 80%;vertical-align: top;" > {{item.reason}}</span>
                                </div>
                                <div  v-if="item.isAccept == false || item.isAccept == 'false'">
                                    <span>备注信息：</span>
                                    <i class="iconfont iconxinxi" style="color:#FA8C16;font-size:20px;vertical-align: middle;" ></i>
                                    <span class="col-black" style="color:#096DD9;display: inline-block;width: 80%;vertical-align: top;">{{item.reason}}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </el-row>
                </div>
        </div>
        <div class="border-style">
            <span class="con-title">转报案信息</span>
            <el-row class="con-row">
                <el-col :span="8">
                    <span>是否转报案：</span>
                    <span class="col-black " style="color: #FA8C16;">{{(caseOverInfo.isTransferringTheCase == '1')?'是，已转报案':'否，未转报案'}}</span>
                </el-col>
                <el-col :span="8">
                    <span>转报案时间：</span>
                    <span class="col-black">{{caseOverInfo.reportInsuredCompanyTime?caseOverInfo.reportInsuredCompanyTime:'-'}}</span>
                </el-col>
                <el-col :span="8">
                    <span>保险公司报案号：</span>
                    <span class="col-black">{{caseOverInfo.insuredCompanyReportNo ?caseOverInfo.insuredCompanyReportNo:'-'}}</span>
                </el-col>
            </el-row>
        </div>
        <div class="box-split-dashed"></div>
        <div class="border-style pb20">
            <span class="con-title">结案审核</span>
            <el-row class="con-row" v-if="tableData.length !== 0">
                <el-col :span="22">
                    <el-table :data="tableData" :header-cell-style="getRowClass">
                        <el-table-column label="操作日期 / 人员">
                            <template slot-scope="scope">
                                <div>{{scope.row.time}}</div>
                                <div>
                                <span>{{scope.row.name}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="申请/审核状态">
                            <template slot-scope="scope">
                                <div v-if="!scope.row.isReview">
                                    <span :class="{
                                        'col-black pefu-over':scope.row.settleType == '01',
                                        'xiaoan-over':scope.row.settleType == '02',
                                        'jupei-over':scope.row.settleType == '03',
                                        'wuxiao-over':scope.row.settleType == '05',
                                    }">
                                        {{scope.row.settleName}}
                                    </span>
                                </div>
                                <div v-else-if="scope.row.isReview">
                                    <span v-if="scope.row.auditOpinion=='01'" class="color-gre">通过审核</span>
                                    <span v-else-if="scope.row.auditOpinion=='02'" class="color-red">驳回审核</span>
                                    <span v-else class="color-gray-4 ">待审核</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注说明" prop="content"></el-table-column>
                    </el-table>
            </el-col>
            </el-row>
            <el-row class="con-row" v-if="tableData.length === 0">
                <el-col :span="8">
                    <span>结案类型：未提交结案信息</span>
                </el-col>
            </el-row>
        </div>
        <el-dialog title="案件受理确认" :visible.sync="dialogVisible"  width="30%" :before-close="handleClose" :close-on-click-modal='false'>
			<el-form :model="formCase" ref="formCase" label-width="100px" :rules="rules">
                <el-form-item label="受理状态" prop="isAccept">
                    <el-radio v-model="formCase.isAccept" label="true">受理</el-radio>
                    <!-- <el-radio v-model="formCase.isAccept" label="false">驳回</el-radio> -->
                </el-form-item>
                <el-form-item label="受理时间" prop="acceptTime" v-if="formCase.isAccept == 'true'">
                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formCase.acceptTime"  type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="驳回时间" prop="acceptTime" v-else>
                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formCase.acceptTime"  type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-row v-if="formCase.isAccept == 'true'">
                    <el-col :span="24">
                        <el-form-item label="受理建议" prop="reason">
                            <el-input v-model="formCase.reason" type="textarea" :rows="3" placeholder="受理建议"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="formCase.isAccept == 'false'" prop="reason">
                    <el-col :span="24">
                        <el-form-item label="驳回建议" prop="reason">
                            <el-input v-model="formCase.reason" type="textarea" :rows="3" placeholder="驳回建议"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label=" ">
                            <span class="col-org"><i class="el-icon-warning f16 mr5"></i>原“驳回”功能，需要通过“结案申请”完成。</span>
                        </el-form-item>
                    </el-col>
                </el-row>
			</el-form>
            <div class="btn mt20">
                <span class="btn-left" @click="dialogVisible = false">取消</span>
                <span class="btn-right" @click="submit('formCase')">确认提交</span>
            </div>
		</el-dialog>
    </div>
</template>
<script>
import CaseService from '../../../service/CaseService.js';
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import store from '../../../store/index'
import caseSettleType from '../../../../static/data/caseSettleType.json'
export default {
    data() {
		return {
            caseSettleType:caseSettleType,
            labelPosition: 'left',
            caseService: new CaseService(),
			// tableData:[],
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
                    {required: true, message: '请填写建议', trigger: 'blur'}
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
            "reportStatus",
            "caseStopInfo"
        ]),
        tableData:function() {
            let list = []
            if(this.baseInfo.auditAndApplyVOList.length !== 0) {
                let obj = this.baseInfo.auditAndApplyVOList[this.baseInfo.auditAndApplyVOList.length-1]
                let {name} = this.caseSettleType.data.find(i => i.code == obj.settleType) || {}
                let a = {
                    time:obj.applyIdCreateTime,
                    content:obj.settlementContent,
                    settleName: name,
                    name: '申请人：'+this.caseOverInfo.servicerName,
                    isReview:false, // 是否为审核 true是 false 不是
                    ...obj,
                }
                let b = {
                    time:obj.applyIdCreateTime,
                    content:obj.reviewComments,
                    settleName: name,
                    name: '审核人：'+this.caseOverInfo.closeAuditorName,
                    isReview:true, // 是否为审核 true是 false 不是
                    ...obj,
                }
                list = [a,b]
            }
            return list
        },
    },
    props:{
        disabledBtn:{
            type:Boolean,
            default: false
        }
    },
    store,
    created() {
        this.getCaseDetail();
    },
    methods: {
        // 设置表头样式
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
            return 'background:#f5f5f5; color: #000'
            } else {
            return ''
            }
        },
        getCaseDetail() {
            this.reportStatusName = '-';
            for(let j = 0; j < this.csaeDictionaries.reportStatus.length; j++) {
                if(this.reportStatus == this.csaeDictionaries.reportStatus[j].value) {
                    this.reportStatusName = this.csaeDictionaries.reportStatus[j].label;
                }
            }
        },
        addAcc() {
            if(this.caseStopInfo && this.caseStopInfo.flag) {
                this.$message.error('请解除中止后继续操作');
                return false
            }
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
                try {
					await this.caseService.caseAsync([this.formStop.reportNo]);
				} catch (error) {
					
				}
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
        setPolicy(){
            this.$emit('insurancePolicy')
        },
        // 关闭关联保单弹出窗
		close(){
			this.exhibition = false;
			this.valueAutoGZ = true;
			this.valueAuto = true
			this.data1 = []
			this.insurance = {
				policyNo:'',
				devicecode:'',
				insuredName:'',
				ropewayName:'',
				premium:'',
				productName:'',
				polEndDate:'',
				polStartDate:'',
				channelCode: "sequip",
				channelName: "特设渠道",
				value: '',
				elevatorSeatAddress: '',
				label2: '',
				value2: '',
				issueCompanyName:'',
				holderName:'',
			};
			this.selecttdata = {
				elevatorSeatAddress:'',
				theElevatorType:'',
				value:'',
				value1:'',
				label1:'',
				value2:'',
				label2:'',
            }
			
		},
    }
}
</script>
<style lang="less" scoped>
    #caseBaseInfo {
        background-color:#fff;
        .border-style {
            border: 0;
            // margin-top: 15px;
            .con-title{
                color: #000;
                font-weight: 700;
                font-size: 15px;
                padding: 10px 30px 6px;
                padding-left: 35px;
                display: inline-block;
            }
            .bor-btm {
                border-bottom: 1px dashed #ccc;
            }
            .over-case {
                border-bottom: 1px dashed #ccc;
            }
            .con-row{
                padding-left: 35px;
                margin-top: 10px;
                color: #000;
                .col-status{
                    display: inline-block;
                    padding: 5px 15px;
                    background-color: #FFE7BA;
                    border-radius: 20px;
                    color: #FA8C16;
                }
                .pefu-over {
                    display: inline-block;
                    padding: 0 10px;
                    background-color: #FA8C16;
                    border-radius: 20px;
                    color: #FFF;
                }
                .wuxiao-over {
                    display: inline-block;
                    padding: 0 10px;
                    background-color: #919191;
                    border-radius: 20px;
                    color: #FFF
                }
                .xiaoan-over {
                    display: inline-block;
                    padding: 0 10px;
                    background-color: #40A9FF;
                    border-radius: 20px;
                    color: #FFF
                }
                .jupei-over {
                    display: inline-block;
                    padding: 0 10px;
                    background-color: #40A9FF;
                    border-radius: 20px;
                    color: #FFF
                }
                
            }
            
        }
        .border-style-padding {
            padding: 10px 0 20px;
        }
        .font-style {
            color: #FF0000;
            border: 1px solid #FD9494;
            border-radius: 4px;
            padding: 2px 4px;
            background-color: #ffefef;
        }
        .btn{
            text-align: right;
            width: 100%;
            .btn-left{
                display: inline-block;
                padding: 5px 20px;
                border: 1px solid #ccc;
                color: #000;
                background-color: #F5F5F5;
                border-radius: 20px;
                cursor: pointer;
                margin-right: 20px;
            }
            .btn-right{
                display: inline-block;
                padding: 5px 20px;
                color: #FFF;
                background-color: #FA8C16;
                border-radius: 20px;
                cursor: pointer;
            }
        }
        .col-org {
            color:#fa8c16;
        }
        .box-split {
            border: 4px solid #f2f1ef;
        }
        .box-split-dashed{
            border: 1px dashed #ccc;
            margin: 30px 30px 20px;
        }
    }

</style>