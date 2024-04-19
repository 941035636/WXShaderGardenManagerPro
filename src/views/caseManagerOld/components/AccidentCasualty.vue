<template>
    <div id="accidentCasualty">
        <div class="edit-top">
            <span class="content-title col-orange">事故经过及伤者信息</span>
            <span class="fr mt16 edit-icon" v-if="!processNull && reportStatus == '04' || !processNull && reportStatus == '03'" @click="toEditPass"><i class="el-icon-edit"></i> 修改</span>
        </div>
        <div class="border-style">
            <span class="content-title">事故经过</span>
            <el-form :label-position="labelPosition" :model="caseProcess" class="bor-btm">
                <el-button type="warning" plain v-if="processNull" @click="toEditPass" :disabled="reportStatus != '04' && reportStatus != '03'">去添加</el-button>
                <div v-if="!processNull">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="案件类型：">
                                <span class="col-black">{{caseProcess.caseMoldName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="受伤人类型：">
                                <span class="col-black">{{caseProcess.injuredPersonName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row  v-if="accType == 'dt'">
                        <el-col :span="8">
                            <el-form-item label="伤害形式：">
                                <span class="col-black">{{caseProcess.hurtFormName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="事故场所：" >
                                <span class="col-black">{{caseProcess.accidentSiteName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="事故原因：">
                                <span class="col-black">{{caseProcess.accidentReasonName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="accType == 'sd'">
                            <el-form-item label="索道类型：">
                                <span class="col-black">{{caseProcess.ropewayName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="故障类型：" v-if="accType == 'dt'">
                                <span class="col-black">{{caseProcess.faultName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="accType == 'dt'">
                        <el-col :span="8">
                            <el-form-item label="电梯类型：">
                                <span class="col-black">{{caseProcess.elevatorName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="电梯品牌：">
                                <span class="col-black">{{caseProcess.elevatorBrandName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="出险地点：">
                                <span class="col-black">{{caseProcess.riskProvinceName + caseProcess.riskCityName + caseProcess.riskAreaName + caseProcess.riskAddrDetail}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
        <div class="border-style pb20" v-if="!processNull">
            <span class="content-title">伤者信息</span>
            <el-form :label-position="labelPosition" style="margin-bottom:20px;">
                <div v-for="(item,index) in caseProcess.insuredInfoList" :key="index">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="姓名：">
                                <span class="col-black">{{item.riskPersonName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="身份证号码：">
                                <span class="col-black">{{item.identityNumber}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系电话：">
                                <span class="col-black">{{item.riskPersonPhone}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
        <el-dialog title="事故经过及伤者信息（电梯）" :visible.sync="dialogVisibledt"  width="70%" :before-close="handleClose">
			<el-form :model="submitData" :rules="rules" ref="submitData" :inline="true"  class="demo-form-inline" label-width="135px">
                <el-form-item label="案件类型：" prop="caseMoldName">
                    <el-radio-group v-model="submitData.caseMoldName" v-for="(item,index) in csaeDictionaries.elevator.caseType" :key="index" @change="setInfoName(submitData.caseMoldName,csaeDictionaries.elevator.caseType,'caseMold')">
                        <el-radio-button :label="item.label" class="item1"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-row>
                <el-col :span="16">
                     <el-form-item label="受伤人员类型：" prop="injuredPersonName">
                        <el-radio-group v-model="submitData.injuredPersonName" v-for="(item,index) in csaeDictionaries.elevator.injuredPersonType" :key="index" @change="setInfoName(submitData.injuredPersonName,csaeDictionaries.elevator.injuredPersonType,'injuredPersonType')">
                            <el-radio-button :label="item.label" class="item1"></el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                    <el-col :span="8">
                        <el-form-item label="伤害形式：" prop="hurtForm">
                            <el-select v-model="submitData.hurtForm" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.hurtForm,csaeDictionaries.elevator.damageForm,'hurtFormName')">
                                <el-option v-for="item in csaeDictionaries.elevator.damageForm" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                <el-col :span="8">
                     <el-form-item label="事故场所：" prop="accidentSite">
                        <el-select v-model="submitData.accidentSite" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.accidentSite,csaeDictionaries.elevator.accidentSite,'accidentSiteName')">
                            <el-option v-for="item in csaeDictionaries.elevator.accidentSite" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                     <el-form-item label="事故原因：" prop="accidentReason">
                        <el-select v-model="submitData.accidentReason" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.accidentReason,csaeDictionaries.elevator.accidentReason,'accidentReasonName')">
                            <el-option v-for="item in csaeDictionaries.elevator.accidentReason" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                     <el-form-item label="故障类型：">
                        <el-select v-model="submitData.faultType" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.faultType,csaeDictionaries.elevator.faultType,'faultName')">
                            <el-option v-for="item in csaeDictionaries.elevator.faultType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-form-item label="事故地点：" required>
                    <el-col :span="8">
                        <el-form-item prop="riskProvinceName">
                            <el-select v-model="submitData.riskProvinceName" clearable placeholder="请选择" class="item2" @change="proChange">
                                <el-option v-for="item in province" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="riskCityName">
                            <el-select v-model="submitData.riskCityName" clearable placeholder="请选择" class="item2" @change="citChange">
                                <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="riskAreaName">
                            <el-select v-model="submitData.riskAreaName" clearable placeholder="请选择" class="item2" @change="countyChange">
                                <el-option v-for="item in district" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item prop="riskAddrDetail" style="margin-left:125px;">
                    <el-input  v-model="submitData.riskAddrDetail" class="item3" placeholder="请输入"></el-input>
                </el-form-item>
                <el-row>
                <el-col :span="16">
                     <el-form-item label="电梯类型：" prop="elevatorName">
                         <el-radio-group v-model="submitData.elevatorName" v-for="(item,index) in csaeDictionaries.elevator.elevatorType" :key="index" @change="setInfoName(submitData.elevatorName,csaeDictionaries.elevator.elevatorType,'elevatorType')">
                            <el-radio-button :label="item.label" class="item1"></el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                    <el-col :span="8">
                        <el-form-item label="电梯品牌：">
                            <el-select v-model="submitData.elevatorBrand" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.elevatorBrand,csaeDictionaries.elevator.elevatorBrand,'elevatorBrandName')">
                                <el-option v-for="item in csaeDictionaries.elevator.elevatorBrand" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <p class="item4">出险人员</p>
                <el-form-item required>
                    <el-col :span="8">
                        <el-form-item prop="insuredInfoList" label="姓名：">
                            <el-input  v-model="submitData.insuredInfoList[0].riskPersonName" class="item5" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="insuredInfoList" label="身份证号码：">
                            <el-input  v-model="submitData.insuredInfoList[0].identityNumber" class="item5" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="insuredInfoList" label="手机号：">
                            <el-input  v-model="submitData.insuredInfoList[0].riskPersonPhone" class="item5" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="saveInfo">保 存</el-button>
			</span>
		</el-dialog>
        <el-dialog title="事故经过及伤者信息（雇主）" :visible.sync="dialogVisiblegz"  width="60%" :before-close="handleClose">
			<el-form :model="submitData" :rules="rules" ref="submitData" :inline="true"  class="demo-form-inline" label-width="125px" size="small">
                <el-form-item label="案件类型：" prop="caseMoldName">
                    <el-radio-group v-model="submitData.caseMoldName" v-for="(item,index) in csaeDictionaries.employer.caseType" :key="index" @change="setInfoName(submitData.caseMoldName,csaeDictionaries.employer.caseType,'caseMold')">
                        <el-radio-button :label="item.label" class="item1"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="受伤人员类型：" prop="injuredPersonName">
                    <el-radio-group v-model="submitData.injuredPersonName" v-for="(item,index) in csaeDictionaries.employer.injuredPersonType" :key="index" @change="setInfoName(submitData.injuredPersonName,csaeDictionaries.employer.injuredPersonType,'injuredPersonType')">
                        <el-radio-button :label="item.label" class="item1"></el-radio-button>
                    </el-radio-group>
                </el-form-item><br/>
                <el-form-item label="事故原因：" prop="accidentReason">
                    <el-select v-model="submitData.accidentReason" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.accidentReason,csaeDictionaries.employer.accidentReason,'accidentReasonName')">
                        <el-option v-for="item in csaeDictionaries.employer.accidentReason" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="事故地点：" required>
                    <el-col :span="8">
                        <el-form-item prop="riskProvinceName">
                            <el-select v-model="submitData.riskProvinceName" clearable placeholder="请选择" class="item2" @change="proChange">
                                <el-option v-for="item in province" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="riskCityName">
                            <el-select v-model="submitData.riskCityName" clearable placeholder="请选择" class="item2" @change="citChange">
                                <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="riskAreaName">
                            <el-select v-model="submitData.riskAreaName" clearable placeholder="请选择" class="item2" @change="countyChange">
                                <el-option v-for="item in district" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item prop="riskAddrDetail" style="margin-left:125px;">
                    <el-input  v-model="submitData.riskAddrDetail" class="item3" placeholder="请输入"></el-input>
                </el-form-item>
                <p class="item4">出险人员</p>
                <el-form-item required>
                    <el-col :span="8">
                        <el-form-item prop="insuredInfoList" label="姓名：">
                            <el-input  v-model="submitData.insuredInfoList[0].riskPersonName" class="item5" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="insuredInfoList" label="身份证号码：">
                            <el-input  v-model="submitData.insuredInfoList[0].identityNumber" class="item5" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="insuredInfoList" label="手机号：">
                            <el-input  v-model="submitData.insuredInfoList[0].riskPersonPhone" class="item5" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="saveInfo">保 存</el-button>
			</span>
		</el-dialog>
        <el-dialog title="事故经过及伤者信息（索道）" :visible.sync="dialogVisiblesd"  width="60%" :before-close="handleClose">
			<el-form :model="submitData" :rules="rules" ref="submitData" :inline="true"  class="demo-form-inline" label-width="125px" size="small">
                <el-form-item label="案件类型：" prop="caseMoldName">
                    <el-radio-group v-model="submitData.caseMoldName" v-for="(item,index) in csaeDictionaries.repoway.caseType" :key="index" @change="setInfoName(submitData.caseMoldName,csaeDictionaries.repoway.caseType,'caseMold')">
                        <el-radio-button :label="item.label" class="item1"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="受伤人员类型：" prop="injuredPersonName">
                    <el-radio-group v-model="submitData.injuredPersonName" v-for="(item,index) in csaeDictionaries.repoway.injuredPersonType" :key="index" @change="setInfoName(submitData.injuredPersonName,csaeDictionaries.repoway.injuredPersonType,'injuredPersonType')">
                        <el-radio-button :label="item.label" class="item1"></el-radio-button>
                    </el-radio-group>
                </el-form-item><br/>
                <el-form-item label="事故原因：" prop="accidentReason">
                    <el-select v-model="submitData.accidentReason" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.accidentReason,csaeDictionaries.repoway.accidentReason,'accidentReasonName')">
                        <el-option v-for="item in csaeDictionaries.repoway.accidentReason" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="事故地点：" required>
                    <el-col :span="8">
                        <el-form-item prop="riskProvinceName">
                            <el-select v-model="submitData.riskProvinceName" clearable placeholder="请选择" class="item2" @change="proChange">
                                <el-option v-for="item in province" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="riskCityName">
                            <el-select v-model="submitData.riskCityName" clearable placeholder="请选择" class="item2" @change="citChange">
                                <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="riskAreaName">
                            <el-select v-model="submitData.riskAreaName" clearable placeholder="请选择" class="item2" @change="countyChange">
                                <el-option v-for="item in district" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item prop="riskAddrDetail" style="margin-left:125px;">
                    <el-input  v-model="submitData.riskAddrDetail" class="item3" placeholder="请输入"></el-input>
                </el-form-item><br/>
                <el-form-item label="索道类型：" prop="ropewayName">
                    <el-radio-group v-model="submitData.ropewayName" v-for="(item,index) in csaeDictionaries.repoway.repowayType" :key="index" @change="setInfoName(submitData.ropewayName,csaeDictionaries.repoway.repowayType,'repowayType')">
                        <el-radio-button :label="item.label" class="item1"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <p class="item4">出险人员</p>
                <el-form-item required>
                    <el-col :span="8">
                        <el-form-item prop="insuredInfoList" label="姓名：">
                            <el-input  v-model="submitData.insuredInfoList[0].riskPersonName" class="item5" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="insuredInfoList" label="身份证号码：">
                            <el-input  v-model="submitData.insuredInfoList[0].identityNumber" class="item5" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="insuredInfoList" label="手机号：">
                            <el-input  v-model="submitData.insuredInfoList[0].riskPersonPhone" class="item5" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="saveInfo">保 存</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import CaseService from '../../../service/CaseService.js';
import {elevator} from '../../../server/accidenServer.js';
import store from '../../../store/index'
export default {
    data() {
        return {
            province: [],
            city: [],
            district: [],
            caseService: new CaseService(),
            Elevator: new elevator(),
            accType:'dt',
            processNull:true,
            dialogVisibledt:false,
            dialogVisiblegz:false,
            dialogVisiblesd:false,
			labelPosition: 'left',
            submitData: {
                "caseMold": "",
                "caseMoldName": "",
                "injuredPersonType": "",
                "injuredPersonName": "",
                "hurtForm": "",
                "hurtFormName": "",
                "accidentSite":"",
                "accidentSiteName":"",
                "accidentReason": "",
                "accidentReasonName": "",
                "faultType":"",
                "faultName":"",
                "riskAreaCode": "",
                "riskAreaName": "",
                "riskCityCode": "",
                "riskCityName": "",
                "riskProvinceCode": "",
                "riskProvinceName": "",
                "riskAddrDetail": "",
                "elevatorName": "",
                "elevatorType": "",
                "elevatorBrand": "",
                "elevatorBrandName": "",
                "insuredInfoList": [
                    {
                    "id": null,
                    "identityNumber": "",
                    "reportNo": this.$route.query.reportNo,
                    "riskPersonName": "",
                    "riskPersonPhone": ""
                    }
                ],
                "ropewayName": "",
                "ropewayType": "",
                "id": this.$route.query.caseId,
                "caseId": this.$route.query.caseId,
                "reportNo": this.$route.query.reportNo,
            },
            rules: {
                caseMoldName: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                injuredPersonName: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                hurtForm: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                accidentSite: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                riskProvinceName: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                riskCityName: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                riskAreaName: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                riskAddrDetail: [
                    { required: true, message: '请输入', trigger: 'blur' },
                    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                ],
                elevatorType: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                insuredInfoList: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                accidentReason: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                ropewayType: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
            }
        }
    },
    store,
    computed:{
        ...mapGetters([
            "caseProcess",
            "csaeDictionaries",
            "reportStatus"
        ]),
    },
    created() {
        this.initData();
    },
    mounted() {
       
    },
    methods: {
        initData() {
            if(!this.caseProcess.insuredInfoList.length) {
                this.processNull = true;
            } else {
                this.processNull = false;
            }
            this.accType = this.$route.query.productCategory1;
        },
        getData(){
            this.submitData = JSON.parse(JSON.stringify(this.caseProcess));
            this.submitData.reportNo = this.$route.query.reportNo;
            if(!this.submitData.accidentReasonName){
                this.submitData.accidentReason = "";
                this.submitData.accidentReasonName = "";
            }
            if(!this.submitData.caseMoldName){
                this.csaeDictionaries.elevator.caseType.forEach(item => {
                    if(item.value == this.submitData.caseMold){
                        this.submitData.caseMoldName = item.label;
                    }
                })
            }
            this.submitData.caseId = this.$route.query.caseId;
            if(!this.caseProcess.insuredInfoList.length){
                let insuredInfoList = {
                    "id": "",
                    "identityNumber": "",
                    "reportNo": this.$route.query.reportNo,
                    "riskPersonName": "",
                    "riskPersonPhone": ""
                };
                this.submitData.insuredInfoList.push(insuredInfoList);
            }
        },
        getRowClass({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #fefbf1;border-bottom:1px solid #f0dfbf;color:#cda160;font-size:16px;';
            } else {
                return 'background: #fff';
            }
        },
        setInfoName(val,arr,code){
            var obj = {};
            obj = arr.find(function(item){
                return item.label === val 
            });
            if(JSON.stringify(obj) != '{}') {
                this.submitData[code] = obj.value;
            }
        },
        setInfoNames(val,arr,name){
            var obj = {};
            obj = arr.find(function(item){
                return item.value === val 
            });
            if(JSON.stringify(obj) != '{}') {
                this.submitData[name] = obj.label;
            }
        },
        async getArea(){
            const res = await this.Elevator.getAreas();
            if(res.code == '0000'){
                this.province = res.data;
                if(this.submitData.riskProvinceCode){
                    this.city = this.province.find(item => item.value == this.submitData.riskProvinceCode)
                };
                if(this.submitData.riskCityCode){
                    this.district = this.province.find(item => item.value == this.submitData.riskCityCode)
                }
            }
        },
        proChange(e){
            this.province.find(item => {
				if(item.value == e){
					this.city = item.children;
					this.submitData.riskProvinceName= item.label;
					this.submitData.riskProvinceCode= item.value;
				}
			})
            this.submitData.riskCityName= '' 
            this.submitData.riskCityCode= ''
            this.submitData.riskAreaName= '' 
            this.submitData.riskAreaCode= ''
        },
        citChange(e) {
            this.city.find(item => {
				if(item.value == e){
					this.district = item.children;
					this.submitData.riskCityName= item.label;
					this.submitData.riskCityCode= item.value;
				}
			})
            this.submitData.riskAreaName= '' 
            this.submitData.riskAreaCode= ''
        },
        countyChange(e) {
            this.district.find(item => {
				if(item.value == e){
					this.submitData.riskAreaName = item.label;
					this.submitData.riskAreaCode = item.value;
				}
            })
        },
        toEditPass(){
            this.getData();
            this.getArea();
            this['dialogVisible' + this.accType] = true;
        },
		handleClose() {
			this.dialogVisibledt=false;
            this.dialogVisiblegz=false;
            this.dialogVisiblesd=false; 
		},
        async saveInfo(submitData) {
            this.$refs.submitData.validate((valid) => {
                if (valid) {
                    if(!this.submitData.insuredInfoList[0].riskPersonName){
                        this.$message.error('请输入出险人员姓名');
                        return;
                    };
                    let numberReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                    if(!this.submitData.insuredInfoList[0].identityNumber){
                        this.$message.error('请输入出险人员身份证号码');
                        return;
                    }else if(!numberReg.test(this.submitData.insuredInfoList[0].identityNumber)){
                        this.$message.error('请输入正确的身份证号码');
                        return;
                    };
                    let phongReg = /^1[0-9]{10}$/
                    if(!this.submitData.insuredInfoList[0].riskPersonPhone){
                        this.$message.error('请输入出险人员电话');
                        return;
                    }else if(!phongReg.test(this.submitData.insuredInfoList[0].riskPersonPhone)){
                        this.$message.error('请输入正确的电话号码');
                        return;
                    }
                    this.saveInfos();
                } else {

                    return false;
                }
            });
        },
        async saveInfos(){
            let res = await this.caseService.saveAccInfo(this.submitData);
            if(res.code == '0000') {
                this.$message({
                    message:'保存成功',
                    type:'success'
                });
                this.searchAccInfo();   
            }
        },
        async searchAccInfo(){
            let res = await this.caseService.searchAccInfo(this.$route.query.reportNo);
            if(res.code == '0000'){
                res.data.caseInfoVO.insuredInfoList = res.data.insuredInfoList
                this.$store.commit('updataCaseProcess',res.data.caseInfoVO);
                this.initData();
                this.handleClose();
            }
        },
    }
}
</script>
<style lang="less">
#accidentCasualty {
    .el-radio-group {
        margin-right: 20px;
    }
    .pb20 {
        padding-bottom: 10px;
    }
    margin-top: 20px;
    background-color: #fff;
    .bor-btm {
        border-bottom: 1px dashed #ccc;
    }
    .edit-top {
        border-bottom: 1px solid #E8E8E8;
        .col-orange {
            color: #c9984a;
            padding: 15px 0px;
            margin-left: 15px;
            border-bottom: 2px solid #c9984a;
        }
        .edit-icon {
            font-size: 18px;
            color: #db9728;
            cursor: pointer;
        }
    }
    .el-dialog {
        .el-dialog__header {
            border-bottom: 1px solid #ccc;
        }
        .el-dialog__body {
            .el-form {
                margin: 0;
                .el-form-item__label {
                    color: #666;
                }
                .el-form-item {
                    margin-bottom: 16px;
                }
                .item1{
                    margin-right: 5px;
                }
                .item2{
                    width: 180px;
                }
                .item3{
                    width: 700px;
                }
                .item4{
                    padding-top: 10px;
                    margin-top: 10px;
                    border-top: 1px solid #ECECEC;
                    color: #DB9728;
                    font-size: 18px;
                    margin-bottom: 20px;
                }
            }
        }      
    }
}
</style>