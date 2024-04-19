<template>
    <div id="accidentCasualty">
        <div class="edit-top">
            <span class="col-orange"><span class="col-orange-bor"></span>事故经过及伤者信息</span>
            <span class='fr mt20 edit-icon' style= "color:#Fa8c16;" v-if="((!processNull && reportStatus == '04') || (!processNull && reportStatus == '03')) && !disabledBtn" @click="toEditPass"><i class="el-icon-edit"></i> 编辑内容</span>
            <span class='fr mt20 edit-icon' style="background-color: #Fa8c16;color: #FFFF;padding: 5px 20px;border-radius: 20px;"  v-if="processNull && !disabledBtn" @click="toEditPass">立即处理</span>
        </div>
        <div class="border-style pb20 ml35 mr35">
            <span style="color: #e6a23c; padding: 20px 0px 5px; font-size:15px; display: inline-block; font-weight: 700;">事故经过</span>
                <div v-if="!processNull" >
                    <el-row class="con-row-two">
                        <el-col :span="8">
                            <span>案件类型：</span>
                            <span class="col-black">{{caseProcess.caseMoldName}}</span>
                        </el-col>
                        <el-col :span="8">
                            <span>事故原因：</span>
                            <span class="col-black">{{caseProcess.accidentReasonName}}</span>
                        </el-col>
                        <el-col :span="8">
                            <span>受伤人类型：</span>
                            <span class="col-black">{{caseProcess.injuredPersonName}}</span>
                        </el-col>
                    </el-row>
                    <el-row class="con-row-two"  >
                        <el-col :span="8" v-if="accType == 'dt'">
                            <span>事故场所：</span>
                            <span class="col-black">{{caseProcess.accidentSiteName}}</span>
                        </el-col>
                        <!-- <el-col :span="8">
                            <span>出险地点：</span>
                            <span class="col-black">{{caseProcess.riskProvinceName +"/"+ caseProcess.riskCityName +"/"+ caseProcess.riskAreaName +"/"+ caseProcess.riskAddrDetail}}</span>
                        </el-col> -->
                        <el-col :span="8">
                            <span>伤害形式：</span>
                            <span class="col-black">{{caseProcess.hurtFormName}}</span>
                        </el-col>
                    </el-row>
                    </div>
                    <div v-if="!processNull"  class="bor-btm pb30">
                        <span  v-if="accType == 'sd' || accType == 'dt' " style="font-size:15px;color: #e6a23c; padding: 20px 0px 5px; display: inline-block; font-weight: 700;">设备信息</span>
                        <el-row class="con-row-two"  v-if="accType == 'sd'">
                            <el-col :span="8">
                                <span>索道类型：</span>
                                <span class="col-black">{{caseProcess.ropewayName}}</span>
                            </el-col>
                            
                        </el-row>
                        <el-row class="con-row-two" v-if="accType == 'dt'">
                            <el-col :span="8">
                                <span>电梯类型：</span>
                                <span class="col-black" style="color:#096DD9">{{caseProcess.elevatorName}}</span>
                            </el-col>
                            <el-col :span="8">
                                <span>电梯品牌：</span>
                                <span class="col-black">{{caseProcess.elevatorBrandName}}</span>
                            </el-col>
                            <el-col :span="8"  v-if="accType == 'dt'">
                                <span>故障类型：</span>
                                <span class="col-black">{{caseProcess.faultName}}</span>
                            </el-col>
                        </el-row>
                </div>
        </div>
        <div class="border-style pb30 pt10" v-if="!processNull">
                <p class="con-row"><i class="iconfont iconrenyuan" style="color:#FA8C16;font-size:20px;vertical-align: middle;" ></i> 人员伤亡情况</p>
                <div v-for="(item,index) in caseProcess.insuredInfoList" :key="index">
                    <el-row>
                        <el-col :span="8">
                            <span style="color: #000; padding: 20px 35px 5px; display: inline-block; font-weight: 700;">人员信息</span>
                        </el-col>
                        <el-col :span="8">
                            <span style="color: #000; padding: 20px 35px 5px; display: inline-block; font-weight: 700;">人员类型</span>
                        </el-col>
                        <el-col :span="8">
                            <span v-if="caseProcess.hurtFormName" style="color: #000; padding: 20px 35px 5px; display: inline-block; font-weight: 700;">伤害类型</span>
                        </el-col>
                    </el-row>
                    <el-row class="con-row">
                        <el-col :span="8">
                            <span v-if="item.riskPersonName" style="color:#096DD9" class="col-black">{{item.riskPersonName}}</span>
                            <span v-if="item.riskPersonPhone" style="color:#096DD9">（{{item.riskPersonPhone}}）</span>
                            <span v-if="item.identityNumber" style="color:#096DD9">身份证号码：{{item.identityNumber}}</span>
                        </el-col>
                        <el-col :span="8">
                            <span class="col-black" style="padding-left: 20px;">{{caseProcess.injuredPersonName}}</span>
                        </el-col>
                        <el-col :span="8">
                            <span class="col-black" style="padding-left: 50px;">{{caseProcess.hurtFormName}}</span>
                        </el-col>
                    </el-row>
                </div>
        </div>
        <el-dialog title="事故经过及伤者信息（电梯）" :visible.sync="dialogVisibledt"  width="55%" :before-close="handleClose" :close-on-click-modal="false">
            <p style="color: #000; padding: 20px 20px 5px;   font-weight: 700;">事故经过</p>
            <el-form :model="submitData" :rules="rules" ref="submitData" :inline="true"  class="demo-form-inline" label-width="135px">
                <el-form-item label="案件类型：" prop="caseMoldName">
                    <el-radio-group v-model="submitData.caseMoldName" v-for="(item,index) in csaeDictionaries.elevator.caseType" :key="index" @change="setInfoName(submitData.caseMoldName,csaeDictionaries.elevator.caseType,'caseMold')">
                        <el-radio :label="item.label" class="item1"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="事故类型：" prop="accidentReason">
                            <el-select  size="mini" v-model="submitData.accidentReason" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.accidentReason,csaeDictionaries.elevator.accidentReason,'accidentReasonName')">
                                <el-option v-for="item in csaeDictionaries.elevator.accidentReason" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="事故场所：" prop="accidentSite">
                            <el-select size="mini" v-model="submitData.accidentSite" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.accidentSite,csaeDictionaries.elevator.accidentSite,'accidentSiteName')">
                                <el-option v-for="item in csaeDictionaries.elevator.accidentSite" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                    <el-col :span="8">
                        <el-form-item label="事故地点："  required>
                            <el-cascader class="item2" :options="province" placeholder="请选择"    clearable v-model="submitData.currentRegionList" size="mini" @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-input v-model="submitData.riskAddrDetail"  size="mini" ></el-input>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="人员伤亡情况："  required>
                        </el-form-item>
                        <span v-if="!submitData.insuredInfoList[0].riskPersonName || !submitData.insuredInfoList[0].riskPersonPhone || !submitData.insuredInfoList[0].identityNumber" style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer;" @click="dialogVisibledtRy=true">新增</span>
                    </el-col>
                </el-row>
                <el-row v-if="submitData.insuredInfoList[0].riskPersonName && submitData.insuredInfoList[0].riskPersonPhone && submitData.insuredInfoList[0].identityNumber">
                    <el-col :span="2">
                        <span>&nbsp;</span>
                    </el-col>
                    <el-col :span="14">
                        <span style="display: inline-block;line-height: 30px;color: #096DD9;">{{submitData.insuredInfoList[0].riskPersonName}}</span>
                        <span v-if="submitData.insuredInfoList[0].riskPersonPhone" style="display: inline-block;line-height: 30px;color: #096DD9;">（{{submitData.insuredInfoList[0].riskPersonPhone}}）</span>
                        <span v-if="submitData.insuredInfoList[0].identityNumber" style="display: inline-block;line-height: 30px;color: #096DD9;">{{submitData.insuredInfoList[0].identityNumber}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span  style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer; margin-right: 20px;" @click="updataPre('dialogVisibledtRy')">修改</span>
                        <span  style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer;" @click="deletePre()">删除</span>
                    </el-col>
                </el-row>
                <el-row  v-if="submitData.injuredPersonName && submitData.hurtFormName" >
                    <el-col :span="2">
                        <span>&nbsp;</span>
                    </el-col>
                    <el-col :span="14">
                        <span style="display: inline-block;line-height: 30px;color: #000;">人员类型:{{submitData.injuredPersonName}}</span>
                        <span style="display: inline-block;line-height: 30px;color: #000; margin-left:20px">伤亡类型:{{submitData.hurtFormName}}</span>
                    </el-col>
                </el-row>
                <el-row>
                </el-row>
                <p style="color: #000; padding: 20px 20px 5px;   font-weight: 700;">设备信息（选填）:</p>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="电梯类型：" prop="elevatorName">
                            <el-select size="mini" v-model="submitData.elevatorName"  @change="setInfoName(submitData.elevatorName,csaeDictionaries.elevator.elevatorType,'elevatorType')">
                                <el-option :label="item.label" :value="item.label" class="item1" v-for="(item,index) in csaeDictionaries.elevator.elevatorType" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="电梯品牌：">
                            <el-select size="mini" v-model="submitData.elevatorBrand" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.elevatorBrand,csaeDictionaries.elevator.elevatorBrand,'elevatorBrandName')">
                                <el-option v-for="item in csaeDictionaries.elevator.elevatorBrand" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="故障类型：">
                            <el-select size="mini" v-model="submitData.faultType" clearable placeholder="请选择"  @change="setInfoNames(submitData.faultType,csaeDictionaries.elevator.faultType,'faultName')">
                                <el-option  class="item1" v-for="item in csaeDictionaries.elevator.faultType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <p class="item4">出险人员</p> -->
                <el-dialog
                    width="30%"
                    title="添加人员"
                    :visible.sync="dialogVisibledtRy"
                    :before-close="handlePreClose"
                    :close-on-click-modal="false"
                    append-to-body>
                    <el-form :model="preForm" :rules="rules" ref="preForm" label-width="135px" class="demo-form-inline">
                        <el-form-item prop="riskPersonName" label="姓名：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.riskPersonName" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="identityNumber" label="身份证号码：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.identityNumber" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="riskPersonPhone" label="手机号：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.riskPersonPhone" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="受伤人员类型：" prop="injuredPersonName">
                            <el-radio-group v-model="preForm.injuredPersonName" v-for="(item,index) in csaeDictionaries.elevator.injuredPersonType" :key="index" @change="setInfoNamePre(preForm.injuredPersonName,csaeDictionaries.elevator.injuredPersonType,'injuredPersonType')">
                                <el-radio :label="item.label"  class="item1" style=" margin-right: 15px;"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="伤害形式：" prop="hurtForm">
                            <el-select size="mini" v-model="preForm.hurtForm" clearable placeholder="请选择" class="item2" @change="setInfoNamesPre(preForm.hurtForm,csaeDictionaries.elevator.damageForm,'hurtFormName')">
                                <el-option v-for="(item,index) in csaeDictionaries.elevator.damageForm" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div style=" text-align: right; width: 100%;">
                            <span style="display: inline-block;padding: 5px 20px;border: 1px solid #ccc;color: #000;background-color: #F5F5F5;border-radius: 20px;cursor: pointer;margin-right: 20px;"   @click="dialogVisibledtRy = false">取消</span>
                            <span style="display: inline-block;padding: 5px 20px;color: #FFF;background-color: #FA8C16;border-radius: 20px;cursor: pointer;" @click="submitPre('preForm')">确认提交</span>
                        </div>
                </el-dialog>
			</el-form>
            <div class="btn mt20">
                <span class="btn-left" @click="dialogVisibledt = false">取消</span>
                <span class="btn-right" @click="saveInfo()">确认提交</span>
            </div>
		</el-dialog>
        <el-dialog title="事故经过及伤者信息（雇主）" :visible.sync="dialogVisiblegz"  width="55%" :before-close="handleClose" :close-on-click-modal="false">
            <p style="color: #000; padding: 20px 20px 5px;   font-weight: 700;">事故信息</p>
			<el-form :model="submitData" :rules="rules" ref="submitData" :inline="true"  class="demo-form-inline" label-width="125px" size="small">
                <el-form-item label="案件类型：" prop="caseMoldName">
                    <el-radio-group v-model="submitData.caseMoldName" v-for="(item,index) in csaeDictionaries.employer.caseType" :key="index" @change="setInfoName(submitData.caseMoldName,csaeDictionaries.employer.caseType,'caseMold')">
                        <el-radio :label="item.label" class="item1"></el-radio>
                    </el-radio-group>
                </el-form-item> <br/>
                <el-form-item label="事故原因：" prop="accidentReason">
                    <el-select v-model="submitData.accidentReason" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.accidentReason,csaeDictionaries.employer.accidentReason,'accidentReasonName')">
                        <el-option v-for="item in csaeDictionaries.employer.accidentReason" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-row>
                    <el-col :span="8">
                        <el-form-item label="事故地点:"  required>
                            <el-cascader class="item2" :options="province" placeholder="请选择"    clearable v-model="submitData.currentRegionList" size="mini" @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-input v-model="submitData.riskAddrDetail"  size="mini" ></el-input>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="人员伤亡情况:"  required>
                        </el-form-item>
                        <span v-if="!submitData.insuredInfoList[0].riskPersonName || !submitData.insuredInfoList[0].riskPersonPhone || !submitData.insuredInfoList[0].identityNumber" style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer;" @click="dialogVisibledtGZRy=true">新增</span>
                    </el-col>
                </el-row>
                <el-row v-if="submitData.insuredInfoList[0].riskPersonName && submitData.insuredInfoList[0].riskPersonPhone && submitData.insuredInfoList[0].identityNumber">
                    <el-col :span="2">
                        <span>&nbsp;</span>
                    </el-col>
                    <el-col :span="14">
                        <span style="display: inline-block;line-height: 30px;color: #096DD9;">{{submitData.insuredInfoList[0].riskPersonName}}</span>
                        <span v-if="submitData.insuredInfoList[0].riskPersonPhone" style="display: inline-block;line-height: 30px;color: #096DD9;">（{{submitData.insuredInfoList[0].riskPersonPhone}}）</span>
                        <span v-if="submitData.insuredInfoList[0].identityNumber" style="display: inline-block;line-height: 30px;color: #096DD9;padding-left:20px">身份证号: {{submitData.insuredInfoList[0].identityNumber}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span  style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer; margin-right: 20px;" @click="updataPre('dialogVisibledtGZRy')">修改</span>
                        <span  style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer;" @click="deletePre()">删除</span>
                    </el-col>
                </el-row>
                <el-row  v-if="submitData.injuredPersonName" >
                    <el-col :span="2">
                        <span>&nbsp;</span>
                    </el-col>
                    <el-col :span="14">
                        <span style="display: inline-block;line-height: 30px;color: #000;">人员类型:{{submitData.injuredPersonName}}</span>
                    </el-col>
                </el-row>
                <el-dialog
                    width="30%"
                    title="添加人员"
                    :visible.sync="dialogVisibledtGZRy"
                    :before-close="handlePreClose"
                    :close-on-click-modal="false"
                    append-to-body>
                    <el-form :model="preForm" :rules="rules" ref="preForm" label-width="135px" class="demo-form-inline">
                        <el-form-item prop="riskPersonName" label="姓名：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.riskPersonName" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="identityNumber" label="身份证号码：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.identityNumber" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="riskPersonPhone" label="手机号：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.riskPersonPhone" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="人员类型：" prop="injuredPersonName">
                            <el-radio-group v-model="preForm.injuredPersonName" v-for="(item,index) in csaeDictionaries.employer.injuredPersonType" :key="index" @change="setInfoNamePre(preForm.injuredPersonName,csaeDictionaries.employer.injuredPersonType,'injuredPersonType')">
                                <el-radio :label="item.label"  class="item1" style=" margin-right: 15px;"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <div style=" text-align: right; width: 100%;">
                            <span style="display: inline-block;padding: 5px 20px;border: 1px solid #ccc;color: #000;background-color: #F5F5F5;border-radius: 20px;cursor: pointer;margin-right: 20px;"   @click="dialogVisibledtGZRy = false">取消</span>
                            <span style="display: inline-block;padding: 5px 20px;color: #FFF;background-color: #FA8C16;border-radius: 20px;cursor: pointer;" @click="submitPre('preForm')">确认提交</span>
                        </div>
                </el-dialog>
			</el-form>
            <div class="btn mt20">
                <span class="btn-left" @click="dialogVisiblegz = false">取消</span>
                <span class="btn-right" @click="saveInfo()">确认提交</span>
            </div>
		</el-dialog>
        <el-dialog title="事故经过及伤者信息（家政）" :visible.sync="dialogVisiblejz"  width="55%" :before-close="handleClose" :close-on-click-modal="false">
            <p style="color: #000; padding: 20px 20px 5px;   font-weight: 700;">事故信息</p>
			<el-form :model="submitData" :rules="rules" ref="submitData" :inline="true"  class="demo-form-inline" label-width="125px" size="small">
                <el-form-item label="案件类型：" prop="caseMoldName">
                    <el-radio-group v-model="submitData.caseMoldName" v-for="(item,index) in csaeDictionaries.housekeeping.caseType" :key="index" @change="setInfoName(submitData.caseMoldName,csaeDictionaries.housekeeping.caseType,'caseMold')">
                        <el-radio :label="item.label" class="item1"></el-radio>
                    </el-radio-group>
                </el-form-item> <br/>
                <el-form-item label="事故原因：" prop="accidentReason">
                    <el-select v-model="submitData.accidentReason" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.accidentReason,csaeDictionaries.housekeeping.accidentReason,'accidentReasonName')">
                        <el-option v-for="item in csaeDictionaries.housekeeping.accidentReason" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-row>
                    <el-col :span="8">
                        <el-form-item label="事故地点:"  required>
                            <el-cascader class="item2" :options="province" placeholder="请选择"    clearable v-model="submitData.currentRegionList" size="mini" @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-input v-model="submitData.riskAddrDetail"  size="mini" ></el-input>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="人员伤亡情况:"  required>
                        </el-form-item>
                        <span v-if="!submitData.insuredInfoList[0].riskPersonName && !submitData.insuredInfoList[0].riskPersonPhone && !submitData.insuredInfoList[0].identityNumber" style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer;" @click="dialogVisibledtJZRy=true">新增</span>
                    </el-col>
                </el-row>
                <el-row v-if="submitData.insuredInfoList[0].riskPersonName || submitData.insuredInfoList[0].riskPersonPhone || submitData.insuredInfoList[0].identityNumber">
                    <el-col :span="2">
                        <span>&nbsp;</span>
                    </el-col>
                    <el-col :span="14">
                        <span style="display: inline-block;line-height: 30px;color: #096DD9;">{{submitData.insuredInfoList[0].riskPersonName}}</span>
                        <span v-if="submitData.insuredInfoList[0].riskPersonPhone" style="display: inline-block;line-height: 30px;color: #096DD9;">（{{submitData.insuredInfoList[0].riskPersonPhone}}）</span>
                        <span v-if="submitData.insuredInfoList[0].identityNumber" style="display: inline-block;line-height: 30px;color: #096DD9;padding-left:20px">身份证号: {{submitData.insuredInfoList[0].identityNumber}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span  style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer; margin-right: 20px;" @click="updataPre('dialogVisibledtJZRy')">修改</span>
                        <span  style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer;" @click="deletePre()">删除</span>
                    </el-col>
                </el-row>
                <el-row  v-if="submitData.injuredPersonName" >
                    <el-col :span="2">
                        <span>&nbsp;</span>
                    </el-col>
                    <el-col :span="14">
                        <span style="display: inline-block;line-height: 30px;color: #000;">人员类型:{{submitData.injuredPersonName}}</span>
                    </el-col>
                </el-row>
                <el-dialog
                    width="30%"
                    title="添加人员"
                    :visible.sync="dialogVisibledtJZRy"
                    :before-close="handlePreClose"
                    :close-on-click-modal="false"
                    append-to-body>
                    <el-form :model="preForm" :rules="rules" ref="preForm" label-width="135px" class="demo-form-inline">
                        <el-form-item prop="riskPersonName" label="姓名：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.riskPersonName" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="identityNumber" label="身份证号码：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.identityNumber" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="riskPersonPhone" label="手机号：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.riskPersonPhone" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="人员类型：" prop="injuredPersonName">
                            <el-radio-group v-model="preForm.injuredPersonName" v-for="(item,index) in csaeDictionaries.housekeeping.injuredPersonType" :key="index" @change="setInfoNamePre(preForm.injuredPersonName,csaeDictionaries.housekeeping.injuredPersonType,'injuredPersonType')">
                                <el-radio  :label="item.label"  class="item1" style=" margin-right: 15px;"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <div style=" text-align: right; width: 100%;">
                            <span style="display: inline-block;padding: 5px 20px;border: 1px solid #ccc;color: #000;background-color: #F5F5F5;border-radius: 20px;cursor: pointer;margin-right: 20px;"   @click="dialogVisibledtJZRy = false">取消</span>
                            <span style="display: inline-block;padding: 5px 20px;color: #FFF;background-color: #FA8C16;border-radius: 20px;cursor: pointer;" @click="submitPre('preForm')">确认提交</span>
                        </div>
                </el-dialog>
			</el-form>
            <div class="btn mt20">
                <span class="btn-left" @click="dialogVisiblejz = false">取消</span>
                <span class="btn-right" @click="saveInfo()">确认提交</span>
            </div>
		</el-dialog>
        <el-dialog title="事故经过及伤者信息（物业）" :visible.sync="dialogVisiblewy"  width="55%" :before-close="handleClose" :close-on-click-modal="false">
            <p style="color: #000; padding: 20px 20px 5px;   font-weight: 700;">事故信息</p>
			<el-form :model="submitData" :rules="rules" ref="submitData" :inline="true"  class="demo-form-inline" label-width="125px" size="small">
                <el-form-item label="案件类型：" prop="caseMoldName">
                    <el-radio-group v-model="submitData.caseMoldName" v-for="(item,index) in csaeDictionaries.property.caseType" :key="index" @change="setInfoName(submitData.caseMoldName,csaeDictionaries.property.caseType,'caseMold')">
                        <el-radio :label="item.label" class="item1"></el-radio>
                    </el-radio-group>
                </el-form-item> <br/>
                <el-form-item label="事故原因：" prop="accidentReason">
                    <el-select v-model="submitData.accidentReason" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.accidentReason,csaeDictionaries.property.accidentReason,'accidentReasonName')">
                        <el-option v-for="item in csaeDictionaries.property.accidentReason" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-row>
                    <el-col :span="8">
                        <el-form-item label="事故地点:"  required>
                            <el-cascader class="item2" :options="province" placeholder="请选择"  clearable v-model="submitData.currentRegionList" size="mini" @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-input v-model="submitData.riskAddrDetail"  size="mini" ></el-input>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="人员伤亡情况:"  required>
                        </el-form-item>
                        <span v-if="!submitData.insuredInfoList[0].riskPersonName && !submitData.insuredInfoList[0].riskPersonPhone && !submitData.insuredInfoList[0].identityNumber" style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer;" @click="dialogVisibledtWYRy=true">新增</span>
                    </el-col>
                </el-row>
                <el-row v-if="submitData.insuredInfoList[0].riskPersonName || submitData.insuredInfoList[0].riskPersonPhone || submitData.insuredInfoList[0].identityNumber">
                    <el-col :span="2">
                        <span>&nbsp;</span>
                    </el-col>
                    <el-col :span="14">
                        <span style="display: inline-block;line-height: 30px;color: #096DD9;">{{submitData.insuredInfoList[0].riskPersonName}}</span>
                        <span v-if="submitData.insuredInfoList[0].riskPersonPhone" style="display: inline-block;line-height: 30px;color: #096DD9;">（{{submitData.insuredInfoList[0].riskPersonPhone}}）</span>
                        <span v-if="submitData.insuredInfoList[0].identityNumber" style="display: inline-block;line-height: 30px;color: #096DD9;padding-left:20px">身份证号: {{submitData.insuredInfoList[0].identityNumber}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span  style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer; margin-right: 20px;" @click="updataPre('dialogVisibledtWYRy')">修改</span>
                        <span  style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer;" @click="deletePre()">删除</span>
                    </el-col>
                </el-row>
                <el-row  v-if="submitData.injuredPersonName" >
                    <el-col :span="2">
                        <span>&nbsp;</span>
                    </el-col>
                    <el-col :span="14">
                        <span style="display: inline-block;line-height: 30px;color: #000;">人员类型:{{submitData.injuredPersonName}}</span>
                    </el-col>
                </el-row>
                <el-dialog
                    width="30%"
                    title="添加人员"
                    :visible.sync="dialogVisibledtWYRy"
                    :before-close="handlePreClose"
                    :close-on-click-modal="false"
                    append-to-body>
                    <el-form :model="preForm" :rules="rules" ref="preForm" label-width="135px" class="demo-form-inline">
                        <el-form-item prop="riskPersonName" label="姓名：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.riskPersonName" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="identityNumber" label="身份证号码：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.identityNumber" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="riskPersonPhone" label="手机号：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.riskPersonPhone" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="人员类型：" prop="injuredPersonName">
                            <el-radio-group v-model="preForm.injuredPersonName" v-for="(item,index) in csaeDictionaries.property.injuredPersonType" :key="index" @change="setInfoNamePre(preForm.injuredPersonName,csaeDictionaries.property.injuredPersonType,'injuredPersonType')">
                                <el-radio  :label="item.label"  class="item1" style=" margin-right: 15px;"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <div style=" text-align: right; width: 100%;">
                            <span style="display: inline-block;padding: 5px 20px;border: 1px solid #ccc;color: #000;background-color: #F5F5F5;border-radius: 20px;cursor: pointer;margin-right: 20px;"   @click="dialogVisibledtWYRy = false">取消</span>
                            <span style="display: inline-block;padding: 5px 20px;color: #FFF;background-color: #FA8C16;border-radius: 20px;cursor: pointer;" @click="submitPre('preForm')">确认提交</span>
                        </div>
                </el-dialog>
			</el-form>
            <div class="btn mt20">
                <span class="btn-left" @click="dialogVisiblewy = false">取消</span>
                <span class="btn-right" @click="saveInfo()">确认提交</span>
            </div>
		</el-dialog>
        <el-dialog title="事故经过及伤者信息（团意）" :visible.sync="dialogVisiblety"  width="55%" :before-close="handleClose" :close-on-click-modal="false">
            <p style="color: #000; padding: 20px 20px 5px;   font-weight: 700;">事故信息</p>
			<el-form :model="submitData" :rules="rules" ref="submitData" :inline="true"  class="demo-form-inline" label-width="125px" size="small">
                <el-form-item label="案件类型：" prop="caseMoldName">
                    <el-radio-group v-model="submitData.caseMoldName" v-for="(item,index) in csaeDictionaries.employer.caseType" :key="index" @change="setInfoName(submitData.caseMoldName,csaeDictionaries.employer.caseType,'caseMold')">
                        <el-radio :label="item.label" class="item1"></el-radio>
                    </el-radio-group>
                </el-form-item> <br/>
                <el-form-item label="事故原因：" prop="accidentReason">
                    <el-select v-model="submitData.accidentReason" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.accidentReason,csaeDictionaries.employer.accidentReason,'accidentReasonName')">
                        <el-option v-for="item in csaeDictionaries.employer.accidentReason" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-row>
                    <el-col :span="8">
                        <el-form-item label="事故地点:"  required>
                            <el-cascader class="item2" :options="province" placeholder="请选择"    clearable v-model="submitData.currentRegionList" size="mini" @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-input v-model="submitData.riskAddrDetail"  size="mini" ></el-input>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="人员伤亡情况:"  required>
                        </el-form-item>
                        <span v-if="!submitData.insuredInfoList[0].riskPersonName || !submitData.insuredInfoList[0].riskPersonPhone || !submitData.insuredInfoList[0].identityNumber" style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer;" @click="dialogVisibledtTYRy=true">新增</span>
                    </el-col>
                </el-row>
                <el-row v-if="submitData.insuredInfoList[0].riskPersonName && submitData.insuredInfoList[0].riskPersonPhone && submitData.insuredInfoList[0].identityNumber">
                    <el-col :span="2">
                        <span>&nbsp;</span>
                    </el-col>
                    <el-col :span="14">
                        <span style="display: inline-block;line-height: 30px;color: #096DD9;">{{submitData.insuredInfoList[0].riskPersonName}}</span>
                        <span v-if="submitData.insuredInfoList[0].riskPersonPhone" style="display: inline-block;line-height: 30px;color: #096DD9;">（{{submitData.insuredInfoList[0].riskPersonPhone}}）</span>
                        <span v-if="submitData.insuredInfoList[0].identityNumber" style="display: inline-block;line-height: 30px;color: #096DD9;padding-left:20px">身份证号: {{submitData.insuredInfoList[0].identityNumber}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span  style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer; margin-right: 20px;" @click="updataPre('dialogVisibledtTYRy')">修改</span>
                        <span  style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer;" @click="deletePre()">删除</span>
                    </el-col>
                </el-row>
                <el-row  v-if="submitData.injuredPersonName" >
                    <el-col :span="2">
                        <span>&nbsp;</span>
                    </el-col>
                    <el-col :span="14">
                        <span style="display: inline-block;line-height: 30px;color: #000;">人员类型:{{submitData.injuredPersonName}}</span>
                    </el-col>
                </el-row>
                <el-dialog
                    width="30%"
                    title="添加人员"
                    :visible.sync="dialogVisibledtTYRy"
                    :before-close="handlePreClose"
                    :close-on-click-modal="false"
                    append-to-body>
                    <el-form :model="preForm" :rules="rules" ref="preForm" label-width="135px" class="demo-form-inline">
                        <el-form-item prop="riskPersonName" label="姓名：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.riskPersonName" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="identityNumber" label="身份证号码：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.identityNumber" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="riskPersonPhone" label="手机号：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.riskPersonPhone" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="人员类型：" prop="injuredPersonName">
                            <el-radio-group v-model="preForm.injuredPersonName" v-for="(item,index) in csaeDictionaries.employer.injuredPersonType" :key="index" @change="setInfoNamePre(preForm.injuredPersonName,csaeDictionaries.employer.injuredPersonType,'injuredPersonType')">
                                <el-radio :label="item.label"  class="item1" style=" margin-right: 15px;"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <div style=" text-align: right; width: 100%;">
                            <span style="display: inline-block;padding: 5px 20px;border: 1px solid #ccc;color: #000;background-color: #F5F5F5;border-radius: 20px;cursor: pointer;margin-right: 20px;"   @click="dialogVisibledtTYRy = false">取消</span>
                            <span style="display: inline-block;padding: 5px 20px;color: #FFF;background-color: #FA8C16;border-radius: 20px;cursor: pointer;" @click="submitPre('preForm')">确认提交</span>
                        </div>
                </el-dialog>
			</el-form>
            <div class="btn mt20">
                <span class="btn-left" @click="dialogVisiblety = false">取消</span>
                <span class="btn-right" @click="saveInfo()">确认提交</span>
            </div>
		</el-dialog>
        <el-dialog title="事故经过及伤者信息（索道）" :visible.sync="dialogVisiblesd"  width="60%" :before-close="handleClose" :close-on-click-modal="false">
            <p style="color: #000; padding: 20px 20px 5px;   font-weight: 700;">事故信息</p>
			<el-form :model="submitData" :rules="rules" ref="submitData" :inline="true"  class="demo-form-inline" label-width="125px" size="small">
                <el-form-item label="案件类型：" prop="caseMoldName">
                    <el-radio-group v-model="submitData.caseMoldName" v-for="(item,index) in csaeDictionaries.repoway.caseType" :key="index" @change="setInfoName(submitData.caseMoldName,csaeDictionaries.repoway.caseType,'caseMold')">
                        <el-radio :label="item.label" class="item1"></el-radio>
                    </el-radio-group>
                </el-form-item><br/>
                <el-form-item label="事故类型：" prop="accidentReason">
                    <el-select v-model="submitData.accidentReason" clearable placeholder="请选择" class="item2" @change="setInfoNames(submitData.accidentReason,csaeDictionaries.repoway.accidentReason,'accidentReasonName')">
                        <el-option v-for="item in csaeDictionaries.repoway.accidentReason" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-row>
                    <el-col :span="8">
                        <el-form-item label="事故地点:"  required>
                            <el-cascader class="item2" :options="province" placeholder="请选择"    clearable v-model="submitData.currentRegionList" size="mini" @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-input v-model="submitData.riskAddrDetail"  size="mini" ></el-input>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="人员伤亡情况:"  required>
                        </el-form-item>
                        <span v-if="!submitData.insuredInfoList[0].riskPersonName || !submitData.insuredInfoList[0].riskPersonPhone || !submitData.insuredInfoList[0].identityNumber" style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer;" @click="dialogVisibledtSDRy=true">新增</span>
                    </el-col>
                </el-row>
                <el-row v-if="submitData.insuredInfoList[0].riskPersonName && submitData.insuredInfoList[0].riskPersonPhone && submitData.insuredInfoList[0].identityNumber">
                    <el-col :span="2">
                        <span>&nbsp;</span>
                    </el-col>
                    <el-col :span="14">
                        <span style="display: inline-block;line-height: 30px;color: #096DD9;">{{submitData.insuredInfoList[0].riskPersonName}}</span>
                        <span v-if="submitData.insuredInfoList[0].riskPersonPhone" style="display: inline-block;line-height: 30px;color: #096DD9;">（{{submitData.insuredInfoList[0].riskPersonPhone}}）</span>
                        <span v-if="submitData.insuredInfoList[0].identityNumber" style="display: inline-block;line-height: 30px;color: #096DD9;">{{submitData.insuredInfoList[0].identityNumber}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span  style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer; margin-right: 20px;" @click="updataPre('dialogVisibledtSDRy')">修改</span>
                        <span  style="display: inline-block;line-height: 30px;color: #096DD9;cursor: pointer;" @click="deletePre()">删除</span>
                    </el-col>
                </el-row>
                <el-row  v-if="submitData.injuredPersonName" >
                    <el-col :span="2">
                        <span>&nbsp;</span>
                    </el-col>
                    <el-col :span="14">
                        <span style="display: inline-block;line-height: 30px;color: #000;">人员类型:{{submitData.injuredPersonName}}</span>
                    </el-col>
                </el-row>
                <!-- <el-form-item label="索道类型：" prop="ropewayName">
                    <el-radio-group v-model="submitData.ropewayName" v-for="(item,index) in csaeDictionaries.repoway.repowayType" :key="index" @change="setInfoName(submitData.ropewayName,csaeDictionaries.repoway.repowayType,'repowayType')">
                        <el-radio-button :label="item.label" class="item1"></el-radio-button>
                    </el-radio-group>
                </el-form-item> -->
                <el-dialog
                    width="30%"
                    title="添加人员"
                    :visible.sync="dialogVisibledtSDRy"
                    :before-close="handlePreClose"
                    :close-on-click-modal="false"
                    append-to-body>
                    <el-form :model="preForm" :rules="rules" ref="preForm" label-width="135px" class="demo-form-inline">
                        <el-form-item prop="riskPersonName" label="姓名：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.riskPersonName" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="identityNumber" label="身份证号码：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.identityNumber" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item prop="riskPersonPhone" label="手机号：">
                            <el-col :span="20">
                                <el-input size="mini"  v-model="preForm.riskPersonPhone" placeholder="请输入"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="人员类型：" prop="injuredPersonName">
                            <el-radio-group v-model="preForm.injuredPersonName" v-for="(item,index) in csaeDictionaries.repoway.injuredPersonType" :key="index" @change="setInfoNamePre(preForm.injuredPersonName,csaeDictionaries.repoway.injuredPersonType,'injuredPersonType')">
                                <el-radio :label="item.label"  class="item1" style=" margin-right: 15px;"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <div style=" text-align: right; width: 100%;">
                            <span style="display: inline-block;padding: 5px 20px;border: 1px solid #ccc;color: #000;background-color: #F5F5F5;border-radius: 20px;cursor: pointer;margin-right: 20px;"   @click="dialogVisibledtSDRy = false">取消</span>
                            <span style="display: inline-block;padding: 5px 20px;color: #FFF;background-color: #FA8C16;border-radius: 20px;cursor: pointer;" @click="submitPre('preForm')">确认提交</span>
                        </div>
                </el-dialog>
                <p style="color: #000; padding: 20px 20px 5px;   font-weight: 700;">设备信息（选填）:</p>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="索道类型：" prop="ropewayName">
                            <el-select size="mini" v-model="submitData.ropewayName" @change="setInfoName(submitData.ropewayName,csaeDictionaries.repoway.repowayType,'ropewayType')">
                                <el-option :label="item.label" :value="item.label" class="item1" v-for="(item,index) in csaeDictionaries.repoway.repowayType" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
			</el-form>
			<!-- <span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="saveInfo">保 存</el-button>
			</span> -->
            <div class="btn mt20">
                <span class="btn-left" @click="dialogVisiblesd = false">取消</span>
                <span class="btn-right" @click="saveInfo()">确认提交</span>
            </div>
		</el-dialog>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import CaseService from '../../../service/CaseService.js';
import {elevator} from '../../../server/accidenServer.js';
import store from '../../../store/index'
export default {
    props:{
        disabledBtn:{
            type:Boolean,
            default: false
        }
    },
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
            dialogVisiblety:false,
            dialogVisiblejz:false,
            dialogVisiblewy:false,
            dialogVisibledtRy:false,
            dialogVisibledtGZRy:false,
            dialogVisibledtTYRy:false,
            dialogVisibledtSDRy:false,
            dialogVisibledtJZRy:false,
            dialogVisibledtWYRy:false,
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
            preForm:{
                "identityNumber": "",
                "reportNo": this.$route.query.reportNo,
                "riskPersonName": "",
                "riskPersonPhone": "",
                "injuredPersonName":"",
                "injuredPersonType":"",
                "hurtForm":"",
                "hurtFormName":"",
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
                riskPersonName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                riskPersonPhone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                ],
                identityNumber: [
                    { required: true, message: '请输入证件号码', trigger: 'blur' },
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
            "caseOverInfo",
            "caseProcess",
            "csaeDictionaries",
            "reportStatus",
            "caseStopInfo"
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
            this.submitData.currentRegionList = [this.submitData.riskProvinceCode,this.submitData.riskCityCode,this.submitData.riskAreaCode]
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
        /**
         * val  选中的对应的值
         * arr  需要获取value名字数组
         * code 属性对应的名字
         */
        setInfoNamePre(val,arr,code){
            var obj = {};
            obj = arr.find(function(item){
                return item.label === val 
            });
            if(JSON.stringify(obj) != '{}') {
                this.preForm[code] = obj.value;
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
        setInfoNamesPre(val,arr,name){
            var obj = {};
            obj = arr.find(function(item){
                return item.value === val 
            });
            if(JSON.stringify(obj) != '{}') {
                this.preForm[name] = obj.label;
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
            if(this.caseStopInfo && this.caseStopInfo.flag) {
                this.$message.error('请解除中止后继续操作');
                return false
            }
            this.getData();
            this.getArea();
            this['dialogVisible' + this.accType] = true;
        },
		handleClose() {
			this.dialogVisibledt=false;
            this.dialogVisiblegz=false;
            this.dialogVisiblesd=false; 
            this.dialogVisiblety=false; 
            this.dialogVisiblejz=false; 
            this.dialogVisiblewy=false; 
        },
        handlePreClose(){
            this.preForm = {
                "identityNumber": "",
                "reportNo": this.$route.query.reportNo,
                "riskPersonName": "",
                "riskPersonPhone": "",
                "injuredPersonName":"",
                "hurtForm":"",
                "hurtFormName":""
            };
            this.dialogVisibledtRy = false
            this.dialogVisibledtGZRy = false
            this.dialogVisibledtTYRy = false
            this.dialogVisibledtSDRy = false
            this.dialogVisibledtJZRy = false
            this.dialogVisibledtWYRy = false
        },
        async saveInfo(submitData) {
            this.$refs.submitData.validate((valid) => {
                if (valid) {
                    console.log(this.submitData);
                    if((this.submitData.caseMold == '05' || this.submitData.caseMold =='06') && (this.accType == 'wy' || this.accType == 'jz')){
                        console.log(123);
                    } else {
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
                    }
                    this.saveInfos();
                } else {

                    return false;
                }
            });
        },
        submitPre(){
            this.$refs.preForm.validate((valid) => {
                if (valid) {
                    this.submitData.insuredInfoList[0].riskPersonName = this.preForm.riskPersonName
                    this.submitData.insuredInfoList[0].identityNumber = this.preForm.identityNumber
                    this.submitData.insuredInfoList[0].riskPersonPhone = this.preForm.riskPersonPhone

                    this.submitData.injuredPersonName = this.preForm.injuredPersonName
                    this.submitData.injuredPersonType = this.preForm.injuredPersonType
                    this.submitData.hurtForm = this.preForm.hurtForm
                    this.submitData.hurtFormName = this.preForm.hurtFormName
                    this.handlePreClose()

                } else {
                    return false;
                }
            })
        },
        async saveInfos(){
            let res = await this.caseService.saveAccInfo(this.submitData);
            if(res.code == '0000') {
                this.$message({
                    message:'保存成功',
                    type:'success'
                });
                this.searchAccInfo();
                await this.$emit('getCaseDetail');
                this.$emit('changeBtn');   
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
        // 删除出险人员
        deletePre(){
            this.submitData.insuredInfoList[0].riskPersonName = ''; 
            this.submitData.insuredInfoList[0].identityNumber = ''; 
            this.submitData.insuredInfoList[0].riskPersonPhone = ''; 
            this.submitData.injuredPersonName = '';
            this.submitData.injuredPersonType = '';
            this.submitData.hurtForm = '';
            this.submitData.hurtFormName = '';
            this.preForm = {
                "identityNumber": "",
                "reportNo": this.$route.query.reportNo,
                "riskPersonName": "",
                "riskPersonPhone": "",
                "injuredPersonName":"",
                "hurtForm":"",
                "hurtFormName":""
            };
        },
        // 更改出险人员信息
        updataPre(dialog=''){
            this.preForm.riskPersonName = this.submitData.insuredInfoList[0].riskPersonName 
            this.preForm.identityNumber = this.submitData.insuredInfoList[0].identityNumber 
            this.preForm.riskPersonPhone = this.submitData.insuredInfoList[0].riskPersonPhone 
            this.preForm.injuredPersonName = this.submitData.injuredPersonName 
            this.preForm.injuredPersonType = this.submitData.injuredPersonType 
            this.preForm.hurtForm = this.submitData.hurtForm 
            this.preForm.hurtFormName = this.submitData.hurtFormName 
            this[dialog] = true
        },
        // 设置省市区
        handleChange(e){
            let province = this.province.find(v1=>v1.value == e[0])
            let city = province.children.find(v1=>v1.value == e[1])
            let area = city.children.find(v1=>v1.value == e[2])
            this.submitData.riskProvinceName= province.label;
            this.submitData.riskProvinceCode= province.value;
            this.submitData.riskCityName= city.label;
            this.submitData.riskCityCode= city.value;
            this.submitData.riskAreaName = area.label;
            this.submitData.riskAreaCode = area.value;
        }

    }
}
</script>
<style lang="less">
#accidentCasualty {
    .border-style {
        .con-row{
            margin:0 35px;
            margin-top: 10px;
            color: #000;
        }
        .con-row-two {
            margin-top: 10px;
            color: #000;
        }
    }
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
            color: #000;
            padding: 15px 0px;
            margin-left: 15px;
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
            
            }
        }      
    }
}
</style>