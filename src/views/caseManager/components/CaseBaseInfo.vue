<template>
    <div id="caseBaseInfo">
        <div class="edit-top">
            <span class="col-orange"><span class="col-orange-bor"></span> 案件基本信息</span>
            <span class='fr mt20 edit-icon' @click="fileupload" v-if="(reportStatus == '04' || reportStatus == '03') && !disabledBtn"><i class="el-icon-edit"></i> 编辑内容</span>
        </div>
        <div class="border-style">
            <span class="con-title">联系人信息</span>
            <el-row class="con-row">
                <el-col :span="12">
                    <span>报案人（电话）：</span>
                    <span class="col-black">{{caseOverInfo.reportName}}</span>
                    <span>（{{caseOverInfo.reportPhone}}）</span>
                    <!-- <span>{{caseOverInfo.reportEmail}}</span> -->
                </el-col>
                <el-col :span="12">
                    <span>联系人（电话）：</span>
                    <span class="col-black">{{caseOverInfo.linkPerson}}</span>
                    <span v-if="caseOverInfo.linkmanPhone">（{{caseOverInfo.linkmanPhone}}）</span>
                    <!-- <span>{{caseOverInfo.linkmanEmail}}</span> -->
                </el-col>
            </el-row>
        </div>
        <div class="border-style">
            <span class="con-title">出险信息</span>
            <el-row class="con-row">
                <el-col :span="8">
                    <span>案件类型：</span>
                    <span class="col-black">{{caseOverInfo.caseTypeName}}</span>
                </el-col>
                <el-col :span="8">
                    <span>有/无人员伤亡：</span>
                    <span class="col-black font-style" v-if="caseOverInfo.personDeath">有，人员伤亡</span>
                    <span class="col-black font-style" v-else>无，人员伤亡</span>
                </el-col>
                <el-col :span="8">
                    <span>险种：</span>
                    <span style="color:#096DD9" v-if="caseOverInfo.riskType == 'dt'">电梯</span>
                    <span style="color:#096DD9" v-if="caseOverInfo.riskType == 'sd'">索道</span>
                    <span style="color:#096DD9" v-if="caseOverInfo.riskType == 'gz'">雇主</span>
                    <span style="color:#096DD9" v-if="caseOverInfo.riskType == 'ty'">团意</span>
                    <span style="color:#096DD9" v-if="caseOverInfo.riskType == 'jz'">家政</span>
                    <span style="color:#096DD9" v-if="caseOverInfo.riskType == 'wy'">物业责任险</span>
                </el-col>
            </el-row>
            <el-row class="con-row">
                <el-col :span="8">
                    <span>出险时间：</span>
                    <span class="col-black">{{caseOverInfo.riskTime}}</span>
                </el-col>
                <el-col :span="8">
                    <span>出险地点：</span>
                    <span class="col-black">{{caseOverInfo.riskProvinceName}} / {{caseOverInfo.riskCityName}} / {{caseOverInfo.riskAreaName}} / {{caseOverInfo.riskAddr}}</span>
                </el-col>
            </el-row>
            <el-row class="con-row">
                <el-col :span="24">
                    <span>出险经过：</span>
                    <i class="iconfont iconxinxi" style="color:#FA8C16;font-size:20px;vertical-align: middle;" ></i>
                    <span class="col-black" style="color: #096DD9;display: inline-block;width: 80%;vertical-align: top;">{{caseOverInfo.accidentsAndLosses}}</span>
                </el-col>
                
            </el-row>
        </div>
        <div class="border-style pb20">
            <span class="con-title" v-if="caseOverInfo.riskType == 'dt' || caseOverInfo.riskType == 'sd'">设备信息</span>
            <span class="con-title" v-if="caseOverInfo.riskType == 'ty' || caseOverInfo.riskType == 'gz'">人员信息</span>
            <span class="con-title" v-if="caseOverInfo.riskType == 'wy'">出险物业项目</span>
            <el-row class="con-row" v-if="caseOverInfo.riskType == 'dt' || caseOverInfo.riskType == 'sd'">
                <el-col :span="8">
                    <span>出险设备：</span>
                    <span class="col-black" v-if="caseOverInfo.riskType == 'dt' ">电梯</span>
                    <span class="col-black" v-if="caseOverInfo.riskType == 'sd'">索道</span>
                    <span v-if="caseOverInfo.riskType == 'dt'" style="color: #096DD9;">
                        （设备编号： {{caseOverInfo.emergencyEquipmentCode}}）
                    </span>
                    <span v-if="caseOverInfo.riskType == 'sd'">
                        （索道名称： {{caseOverInfo.ropewayName}}）
                    </span>
                </el-col>
                <el-col :span="8"  v-if="caseOverInfo.riskType == 'dt'">
                    <span>维保单位：</span>
                    <span class="col-black">{{caseOverInfo.maintenanceUnit}}</span>
                </el-col>
                <el-col :span="8"  v-if="caseOverInfo.riskType == 'dt'">
                    <span>使用单位：</span>
                    <span class="col-black">{{caseOverInfo.useUnit}}</span>
                </el-col>
            </el-row>
            <el-row class="con-row" v-if="caseOverInfo.riskType == 'ty' || caseOverInfo.riskType == 'gz' || caseOverInfo.riskType == 'jz'">
                <el-col :span="12">
                    <span>出险人员：</span>
                    <span v-if="caseOverInfo.riskType == 'gz' || caseOverInfo.riskType == 'ty' || caseOverInfo.riskType == 'jz'">
                        ( 人员姓名：{{caseOverInfo.insuredName}} 证件号：{{caseOverInfo.identityCardNumber}} )
                    </span>
                </el-col>
            </el-row>
            <el-row class="con-row" v-if="caseOverInfo.riskType == 'wy'">
                <el-col :span="12">
                    <span>物业项目：</span>
                    <span>
                        {{caseOverInfo.propertyName}}
                    </span>
                </el-col>
            </el-row>
        </div>
        <el-dialog title="出险信息变更" :visible.sync="dialogVisible" width="50%" destroy-on-close :close-on-click-modal='false'>
            <el-form :model="caseInfo" ref="caseInfo" label-width="130px" class="demo-ruleForm" :rules="rules">
                <h5 class="fc ml20" style="width: 150px; text-align: left; vertical-align: middle; font-size: 14px; color: #000000; font-weight: 600; line-height: 30px; padding: 0 12px 0 0; box-sizing: border-box; font-weight: 700;">出险信息:</h5>
                <el-form-item label="报案险种:" v-if="caseInfo.riskType == 'gz' || caseInfo.riskType == 'ty'" prop="riskType">
                    <el-select v-model="caseInfo.riskType" disabled size="mini">
                        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报案险种:" v-else prop="riskType">
                    <el-select v-model="caseInfo.riskType" disabled size="mini"> 
                        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                
              
                <el-form-item label="出险时间:" prop="reportTime">
                    <el-date-picker v-model="caseInfo.reportTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" disabled size="mini"></el-date-picker>
                </el-form-item>
                <el-form-item label="出险地点:" prop="currentRegionList">
                    <el-col :span="10">
                        <el-cascader :options="province" placeholder="请选择"   disabled clearable v-model="caseInfo.currentRegionList" size="mini"></el-cascader>
                    </el-col>
                    <el-col :span="13">
                        <el-input v-model="caseInfo.riskAddr" disabled size="mini"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="出险经过:" prop="accidentsAndLosses">
                    <el-input v-model="caseInfo.accidentsAndLosses" type="textarea" :autosize="{ minRows: 2}" ></el-input>
                </el-form-item>
                <el-form-item label="有/无人员伤亡:" prop="personDeath" v-if="caseInfo.riskType == 'dt' || caseInfo.riskType == 'sd' || caseInfo.riskType == 'wy'">
                    <el-radio-group v-model="caseInfo.personDeath" @change="changes">
                        <el-radio :label="true">有</el-radio>
                        <el-radio :label="false">无</el-radio>
                        <!-- <el-radio :label="false" v-if="caseInfo.riskType == 'dt' || caseInfo.riskType == 'sd'">无</el-radio> -->
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="案件类型:" prop="caseType" >
                    <el-select v-model="caseInfo.caseType" @change="setInfoNames(caseInfo.caseType,options,'caseTypeName')" size="mini">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <h5 v-if="caseInfo.riskType == 'dt' || caseInfo.riskType == 'sd'" class="fc ml20" style="width: 150px; text-align: left; vertical-align: middle; font-size: 14px; color: #000000; font-weight: 600; line-height: 30px; padding: 0 12px 0 0; box-sizing: border-box; font-weight: 700;">设备信息:</h5>
                <el-row v-if="caseInfo.riskType == 'sd'">
                    <el-col :span="12">
                        <el-form-item label="索道名称:" size="mini" prop="ropewayName">
                            <el-input v-model="caseInfo.ropewayName" maxlength="75"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="caseInfo.riskType == 'dt'">
                    <el-col :span="12">
                        <el-form-item label="设备编号:" prop="emergencyEquipmentCode" v-if="caseInfo.riskType == 'dt'">
                            <el-input v-model="caseInfo.emergencyEquipmentCode" size="mini" maxlength="75"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row v-if="caseInfo.riskType == 'dt'">
                    <el-col :span="12">
                        <el-form-item label="使用单位:">
                            <el-input v-model="caseInfo.useUnit" size="mini" maxlength="75"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="维保单位:">
                            <el-input v-model="caseInfo.maintenanceUnit" size="mini" maxlength="75"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <h5 v-if="caseInfo.riskType == 'gz' || caseInfo.riskType == 'ty' || caseInfo.riskType == 'jz'" class="fc ml20"  style="width: 150px; text-align: left; vertical-align: middle; font-size: 14px; color: #000000; font-weight: 600; line-height: 30px; padding: 0 12px 0 0; box-sizing: border-box; font-weight: 700;">人员信息:</h5>
                <el-row  v-if="caseInfo.riskType == 'gz' || caseInfo.riskType == 'ty' || caseInfo.riskType == 'jz'">
                    <el-col :span="12">
                        <el-form-item label="出险人员姓名:" prop="insuredName">
                            <el-input v-model="caseInfo.insuredName" size="mini" maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="出险人员证件号:" prop="identityCardNumber">
                            <el-input v-model="caseInfo.identityCardNumber" size="mini" maxlength="30"></el-input>
                        </el-form-item>
                    </el-col>
                    
                </el-row>
                <el-row  v-if="caseInfo.riskType == 'jz'">
                    <el-col :span="12" v-if="caseInfo.riskType == 'jz'">
                        <el-form-item label="服务类型:">
                            <span style="color:#1890FF">{{caseInfo.postName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <h5 v-if="caseInfo.riskType == 'wy'" class="fc ml20"  style="width: 150px; text-align: left; vertical-align: middle; font-size: 14px; color: #000000; font-weight: 600; line-height: 30px; padding: 0 12px 0 0; box-sizing: border-box; font-weight: 700;">项目信息:</h5>
                <el-row  v-if="caseInfo.riskType == 'wy'">
                    <el-col :span="12">
                        <el-form-item label="物业项目:" required>
                            <span style="color:#1890FF">{{caseInfo.propertyName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <h5 class="fc ml20"  style="width: 150px; text-align: left; vertical-align: middle; font-size: 14px; color: #000000; font-weight: 600; line-height: 30px; padding: 0 12px 0 0; box-sizing: border-box; font-weight: 700;">报案人信息:</h5>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名:" prop="reportName">
                            <el-input v-model="caseInfo.reportName" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电话:" prop="reportPhone">
                            <el-input v-model="caseInfo.reportPhone" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <h5 class="fc ml20" style="width: 150px; text-align: left; vertical-align: middle; font-size: 14px; color: #000000; font-weight: 600; line-height: 30px; padding: 0 12px 0 0; box-sizing: border-box; font-weight: 700;">联系人信息（选填）:</h5>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名:">
                            <el-input v-model="caseInfo.linkPerson" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电话:">
                            <el-input v-model="caseInfo.linkmanPhone" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="btn">
                <span class="btn-left" @click="dialogVisible = false">取消</span>
                <span class="btn-right" @click="onSubmit('caseInfo')">确认提交</span>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import CaseService from '../../../service/CaseService.js';
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import store from '../../../store/index'
export default {
    store,
    props:{
        disabledBtn:{
            type:Boolean,
            default: false
        }
    },
    data() {
        var checkPhone = (rule, value, callback) => {
            const phoneReg = /^1[0-9]{10}$/
            if (!value) {
                return callback(new Error('手机号码不能为空'))
            }
            setTimeout(() => {
                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'))
                } else {
                    if (phoneReg.test(value)) {
                        callback()
                    } else {
                    callback(new Error('手机号码格式不正确'))
                    }
                }
            }, 100)
        };
        var validateCardNumber = function(rlue, value, callback) {
            if (value === '') {
                callback(new Error('请输入证件号'))
            } else if (!/^([a-zA-Z0-9]{5,22})$/i.test(value)) {
                callback(new Error('请输入正确的证件号5-22位数字+字母组合!'))
            } else {
                callback()
            }
        }
		return {
            caseService: new CaseService(),
			dialogVisible:false,
            labelPosition: 'left',
            options1:[
                {
                    label:'电梯',
                    value:'dt'
                },
                {
                    label:'雇主',
                    value:'gz'
                },
                {
                    label:'团意',
                    value:'ty'
                },
                {
                    label:'索道',
                    value:'sd'
                },
                {
                    label:'家政',
                    value:'jz'
                },
                {
                    label:'物业',
                    value:'wy'
                }
            ],
            caseInfo:{},
            province: [],
            city: [],
            district: [],
            options:[],
            rules:{
				riskType:[{ required: true, message: '请选择报案险种', trigger: 'blur'}],
				emergencyEquipmentCode:[{ required: true, message: '请输入设备代码/出厂编号', trigger: 'blur'}],
				ropewayName:[{ required: true, message: '请输入索道名称', trigger: 'blur'}],
				reportTime:[{ required: true, message: '请选择出险时间', trigger: 'blur'}],
				currentRegionList:[{ required: true, message: '请选择出险地点', trigger: 'blur'}],
				accidentsAndLosses:[{ required: true, message: '请填写出险经过', trigger: 'blur'}],
				personDeath:[{ required: true, message: '请选择有无人员伤亡', trigger: 'blur'}],
				caseType:[{ required: true, message: '请选择案件类型', trigger: 'blur'}],
				reportName:[{ required: true, message: '联系人姓名不能为空', trigger: 'blur'},
				{ min: 2,max: 20, message: '联系人长度2-20个字符', trigger: 'blur'}],
				insuredName:[{ required: true, message: '出险人员姓名不能为空', trigger: 'blur'},
				{ min: 1,max: 50, message: '出险人员姓名长度2-20个字符', trigger: 'blur'}],
				reportPhone:[{required: true,validator: checkPhone,trigger: 'blur'}],
				identityCardNumber:[{required: true,validator: validateCardNumber,trigger: 'blur'}],
			},
		}
    },
    computed:{
        ...mapGetters([
            "caseOverInfo",
            "csaeDictionaries",
            "reportStatus",
            "caseStopInfo"
            
        ]),
    },
    created() {
        this.caseInfo.riskType = this.$route.query.productCategory1;
    },
    methods: {
        fileupload(){
            if(this.caseStopInfo && this.caseStopInfo.flag) {
                this.$message.error('请解除中止后继续操作');
                return false
            }
            this.caseInfo = JSON.parse(JSON.stringify(this.caseOverInfo));
            this.caseInfo.currentRegionList = [this.caseInfo.riskProvinceCode,this.caseInfo.riskCityCode,this.caseInfo.riskAreaCode]
            this.options = [];
            if (this.caseInfo.personDeath == true) {
                if (this.caseInfo.riskType == 'dt') {
                    this.csaeDictionaries.elevator.caseType.forEach(item => {
                        if (item.value == '01' || item.value == '02' || item.value == '03' || item.value == '06'){
                            this.options.push(item);
                        }
                    })
                } else if (this.caseInfo.riskType == 'sd') {
                    this.csaeDictionaries.repoway.caseType.forEach(item => {
                        if (item.value == '01' || item.value == '02' || item.value == '03' || item.value == '06') {
                            this.options.push(item);
                        }
                    })
                } else if (this.caseInfo.riskType == 'gz' || this.caseInfo.riskType == 'ty') {
                    this.options = this.csaeDictionaries.employer.caseType; 
                } else if (this.caseInfo.riskType == 'jz') {
                    this.options = this.csaeDictionaries.housekeeping.caseType.filter(item => {
                        return  item.value != '05'
                    });
                } else if (this.caseInfo.riskType == 'wy') {
                    this.options = this.csaeDictionaries.property.caseType.filter(item => {
                        return  item.value != '05'
                    });
                };
            }else{
                if (this.caseInfo.riskType == 'dt') {
                    this.csaeDictionaries.elevator.caseType.forEach(item => {
                        if (item.value == '04' || item.value == '05' || item.value == '06') {
                            this.options.push(item);
                        }
                    })
                } else if (this.caseInfo.riskType == 'sd') {
                    this.csaeDictionaries.repoway.caseType.forEach(item => {
                        if (item.value == '04' || item.value == '05' || item.value == '06') {
                            this.options.push(item);
                        }
                    })
                } else if (this.caseInfo.riskType == 'gz' || this.caseInfo.riskType == 'ty') {
                    this.options = this.csaeDictionaries.employer.caseType;
                } else if (this.caseInfo.riskType == 'jz') {
                    this.options = this.csaeDictionaries.housekeeping.caseType.filter(item => {
                        return item.value != '05'
                    });
                } else if (this.caseInfo.riskType == 'wy') {
                    this.options = this.csaeDictionaries.property.caseType.filter(item => {
                        return item.value == '06' || item.value == '05'
                    });
                };  
            }
            this.dialogVisible = true;
            this.getAreas();
        },
        changes(value){
            this.options = [];
            this.caseInfo.caseTypeName = '';
            this.caseInfo.caseType = '';
            if(this.caseInfo.personDeath == true){
                if (this.caseInfo.riskType == 'dt'){
                    this.csaeDictionaries.elevator.caseType.forEach(item => {
                        if (item.value == '01' || item.value == '02' || item.value == '03' || item.value == '06'){
                            this.options.push(item);
                        }
                    })
                } else if (this.caseInfo.riskType == 'sd'){
                    this.csaeDictionaries.repoway.caseType.forEach(item => {
                        if (item.value == '01' || item.value == '02' || item.value == '03' || item.value == '06'){
                            this.options.push(item);
                        }
                    })
                } else if (this.caseInfo.riskType == 'gz' || this.caseInfo.riskType == 'ty'){
                    this.options = this.csaeDictionaries.employer.caseType;
                } else if (this.caseInfo.riskType == 'jz') {
                    this.options = this.csaeDictionaries.housekeeping.caseType.filter(item => {
                        return  item.value != '05'
                    });
                } else if (this.caseInfo.riskType == 'wy'){
                    this.options = this.csaeDictionaries.property.caseType.filter(item => {
                        return  item.value != '05'
                    });
                };
            }else{
                if (this.caseInfo.riskType == 'dt'){
                    this.csaeDictionaries.elevator.caseType.forEach(item => {
                        if(item.value == '04' || item.value == '05' || item.value == '06'){
                            this.options.push(item);
                        }
                    })
                } else if(this.caseInfo.riskType == 'sd'){
                    this.csaeDictionaries.repoway.caseType.forEach(item => {
                        if(item.value == '04' || item.value == '05' || item.value == '06'){
                            this.options.push(item);
                        }
                    })
                } else if(this.caseInfo.riskType == 'gz' || this.caseInfo.riskType == 'ty'){
                    this.options = this.csaeDictionaries.employer.caseType;
                } else if (this.caseInfo.riskType == 'jz') {
                    this.options = this.csaeDictionaries.housekeeping.caseType.filter(item => {
                        return  item.value != '05'
                    });
                } else if(this.caseInfo.riskType == 'wy'){
                    this.options = this.csaeDictionaries.property.caseType.filter(item => {
                        return item.value == '06' || item.value == '05'
                    });
                }; 
            }
        },
        setInfoNames(val,arr,name){
            var obj = {};
            obj = arr.find(function(item){
                return item.value === val 
            });
            if(JSON.stringify(obj) != '{}') {
                this.caseInfo[name] = obj.label;
            }
        },
        async getAreas(){
            const res = await this.caseService.getAreas();
            if(res.code == '0000'){
                this.province = res.data;
                this.city = this.province.find(item => item.value == this.caseInfo.riskProvinceCode).children;
				this.district = this.city.find(item => item.value == this.caseInfo.riskCityCode).children;
            }
        },
        onSubmit(data){
			this.$refs[data].validate((valid) => {
				if (valid) {
					this.submit();
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
        async submit(){
            let data = {
                "accidentsAndLosses": this.caseInfo.accidentsAndLosses,
                "caseType": this.caseInfo.caseType,
                "emergencyEquipmentCode": this.caseInfo.emergencyEquipmentCode,
                "id": this.caseInfo.reportId,
                "insuredName": this.caseInfo.insuredName,
                "isSame": this.caseInfo.isSame,
                "linkPerson": this.caseInfo.linkPerson,
                "linkmanEmail": this.caseInfo.linkmanEmail,
                "linkmanPhone": this.caseInfo.linkmanPhone,
                "personDeath": this.caseInfo.personDeath,
                "reportEmail": this.caseInfo.reportEmail,
                "reportName": this.caseInfo.reportName,
                "reportPhone": this.caseInfo.reportPhone,
                "riskAddr": this.caseInfo.riskAddr,
                "riskAreaCode": this.caseInfo.riskAreaCode,
                "riskAreaName": this.caseInfo.riskAreaName,
                "riskCityCode": this.caseInfo.riskCityCode,
                "riskCityName": this.caseInfo.riskCityName,
                "riskProvinceCode": this.caseInfo.riskProvinceCode,
                "riskProvinceName": this.caseInfo.riskProvinceName,
                "riskTime": this.caseInfo.riskTime,
                "riskType": this.caseInfo.riskType,
                "ropewayName": this.caseInfo.ropewayName,
                "maintenanceUnit":this.caseInfo.maintenanceUnit,
                "useUnit":this.caseInfo.useUnit,
                "policyId":this.caseInfo.policyId,
                "insuredInfo":{
                    "postName":this.caseInfo.postName,
                    "propertyName":this.caseInfo.propertyName,
                }
            }
            const res = await this.caseService.cateModifyinfo(data); 
            if(res.code == '0000'){
                this.$store.commit('updataCaseOverInfo',this.caseInfo);
                await this.$emit('getCaseDetail');
                this.$emit('changeBtn');
                this.dialogVisible = false;
            }
        },
    }
}
</script>
<style lang="less" scoped>
    #caseBaseInfo {
        margin-top: 20px;
        background-color: #fff;
        .border-style {
            margin-top: 15px;
            border: 0;
            .con-title{
                color: #e6a23c;
                font-weight: 700;
                font-size: 15px;
                padding: 10px 60px 6px;
                padding-left: 35px;
                display: inline-block;
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
                
            }
            .bor-btm {
                border-bottom: 1px dashed #ccc;
            }
            .demo-ruleForm{
                margin: 0;
            } 
            .col-orange {
                color: #c9984a;
            }
            .fc{
                width: 150px;
                text-align: right;
                vertical-align: middle;
                font-size: 14px;
                color: #000000;
                font-weight: 600;
                line-height: 40px;
                padding: 0 12px 0 0;
                box-sizing: border-box;
                font-weight: 700;
            }
            .font-style {
                color: #FF0000;
                padding: 2px 4px;
            }
        
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

</style>