<template>
    <div id="caseBaseInfo">
        <div class="edit-top">
            <span class="content-title col-orange">案件基本信息</span>
            <span class="fr mt16 edit-icon" @click="fileupload" v-if="reportStatus == '04' || reportStatus == '03'"><i class="el-icon-edit"></i> 编辑</span>
        </div>
        <div class="border-style">
            <el-form :label-position="labelPosition" class="bor-btm">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="报案人：">{{caseOverInfo.reportName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="险种：">
                            <span class="col-black" v-if="caseOverInfo.hasPolicy">{{caseOverInfo.productName}}</span>
                            <span class="col-black" v-if="!caseOverInfo.hasPolicy && $route.query.productCategory1 == 'dt'">电梯责任险</span>
                            <span class="col-black" v-if="!caseOverInfo.hasPolicy && $route.query.productCategory1 == 'gz'">雇主责任险</span>
                            <span class="col-black" v-if="!caseOverInfo.hasPolicy && $route.query.productCategory1 == 'ty'">团体意外险</span>
                            <span class="col-black" v-if="!caseOverInfo.hasPolicy && $route.query.productCategory1 == 'sd'">索道责任险</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报案时间：">
                                <span class="col-black">{{caseOverInfo.reportTime}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="border-style">
            <span class="content-title">出险信息</span>
            <el-form :model="caseOverInfo" :label-position="labelPosition" class="bor-btm">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="出险设备：" v-if="caseOverInfo.riskType == 'dt' || caseOverInfo.riskType == 'sd'">
                            <span class="col-black" v-if="caseOverInfo.riskType == 'dt'">电梯</span>
                            <span class="col-black" v-if="caseOverInfo.riskType == 'sd'">索道</span>
                        </el-form-item>
                        <el-form-item label="出险人员：" v-if="caseOverInfo.riskType == 'gz' || caseOverInfo.riskType == 'ty'">
                            人员
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="案件类型：">
                                <span class="col-black">{{caseOverInfo.caseTypeName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="有/无人员伤亡：">
                                <span class="col-black font-style" v-if="caseOverInfo.personDeath">有</span>
                                <span class="col-black font-style" v-else>无</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="设备编号：" v-if="caseOverInfo.riskType == 'dt'">
                            {{caseOverInfo.emergencyEquipmentCode}}
                        </el-form-item>
                        <el-form-item label="索道名称"  v-if="caseOverInfo.riskType == 'sd'">
                            {{caseOverInfo.ropewayName}}
                        </el-form-item>
                        <el-form-item label="人员姓名"  v-if="caseOverInfo.riskType == 'gz' || caseOverInfo.riskType == 'ty'">
                            {{caseOverInfo.insuredName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="使用单位：" v-if="caseInfo.riskType == 'dt'">
                                <span class="col-black">{{caseOverInfo.useUnit}}</span>
                        </el-form-item>
                        <el-form-item label="出险时间：" v-if="caseInfo.riskType != 'dt'">
                            {{caseOverInfo.riskTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="维保单位：" v-if="caseInfo.riskType == 'dt'">
                                <span class="col-black">{{caseOverInfo.maintenanceUnit}}</span>
                        </el-form-item>
                        <el-form-item label="出险地点：" v-if="caseInfo.riskType != 'dt'">
                                <span class="col-black">{{caseOverInfo.riskProvinceName}}{{caseOverInfo.riskCityName}}{{caseOverInfo.riskAreaName}}{{caseOverInfo.riskAddr}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="caseInfo.riskType == 'dt'">
                    <el-col :span="8">
                        <el-form-item label="出险时间：">
                            {{caseOverInfo.riskTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出险地点：">
                                <span class="col-black">{{caseOverInfo.riskProvinceName}}{{caseOverInfo.riskCityName}}{{caseOverInfo.riskAreaName}}{{caseOverInfo.riskAddr}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="事故描述：">
                            {{caseOverInfo.accidentsAndLosses}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        
        <div class="border-style">
            <span class="content-title">联系人信息</span>
            <el-form :model="caseOverInfo" :label-position="labelPosition" class="bor-btm">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="报案人：">
                                <span class="col-black">{{caseOverInfo.reportName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报案人电话：">
                                <span class="col-black">{{caseOverInfo.reportPhone}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报案人邮箱：">
                                <span class="col-black">{{caseOverInfo.reportEmail}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="联系人：">
                                <span class="col-black">{{caseOverInfo.linkPerson}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人电话：">
                                <span class="col-black">{{caseOverInfo.linkmanPhone}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人邮箱：">
                                <span class="col-black">{{caseOverInfo.linkmanEmail}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="border-style">
            <span class="content-title">保单信息</span>
            <el-form :model="caseOverInfo" :label-position="labelPosition">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="保单号：">
                                <span class="col-black">{{caseOverInfo.policyNo}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="出单公司：">
                                <span class="col-black">{{caseOverInfo.issueCompanyName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="14">
                        <el-form-item label="保障期间：">
                                <span class="col-black">{{caseOverInfo.polStartDate}}至{{caseOverInfo.polEndDate}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-dialog title="报案信息修改" :visible.sync="dialogVisible" width="70%" destroy-on-close>
                <el-form :model="caseInfo" ref="caseInfo" label-width="150px" class="demo-ruleForm">
                    <h5 class="fc">出险信息:</h5>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="出险人员:" v-if="caseInfo.riskType == 'gz' || caseInfo.riskType == 'ty'">
                                   <el-select v-model="caseInfo.riskType" disabled>
                                        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                            </el-form-item>
                            <el-form-item label="出险设备:" v-else>
                                   <el-select v-model="caseInfo.riskType" disabled>
                                        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="人员姓名:" v-if="caseInfo.riskType == 'gz' || caseInfo.riskType == 'ty'">
                                <el-input v-model="caseInfo.insuredName" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="设备编号:" v-if="caseInfo.riskType == 'dt'">
                                <el-input v-model="caseInfo.emergencyEquipmentCode" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="索道名称:" v-if="caseInfo.riskType == 'sd'">
                                <el-input v-model="caseInfo.ropewayName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="出险时间:">
                                <el-date-picker v-model="caseInfo.reportTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" disabled></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="有/无人员伤亡:">
                                <el-radio-group v-model="caseInfo.personDeath" @change="changes">
                                    <el-radio :label="true">有</el-radio>
                                    <el-radio :label="false" v-if="caseInfo.riskType == 'dt' || caseInfo.riskType == 'sd'">无</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="案件类型:">
                                <el-select v-model="caseInfo.caseType" @change="setInfoNames(caseInfo.caseType,options,'caseTypeName')">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="出险地点:">
                        <el-col :span="7">
                            <el-form-item>
                                <el-select v-model="caseInfo.riskProvinceCode" @change="proChange" disabled>
                                    <el-option v-for="item in province" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1"><span>&nbsp;</span></el-col>
                        <el-col :span="7">
                            <el-form-item>
                                <el-select v-model="caseInfo.riskCityCode" @change="citChange" disabled>
                                    <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1"><span>&nbsp;</span></el-col>
                        <el-col :span="7">
                            <el-form-item>
                                <el-select v-model="caseInfo.riskAreaCode" @change="countyChange" disabled>
                                    <el-option v-for="item in district" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="caseInfo.riskAddr" disabled></el-input>
                    </el-form-item>
                    <el-row v-if="caseInfo.riskType == 'dt'">
                        <el-col :span="7">
                            <el-form-item label="使用单位:">
                                <el-input v-model="caseInfo.useUnit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="维保单位:">
                               <el-input v-model="caseInfo.maintenanceUnit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="事故描述:">
                        <el-input v-model="caseInfo.accidentsAndLosses" type="textarea" :autosize="{ minRows: 3}"></el-input>
                    </el-form-item>
                    <h5 class="fc" style="margin-left:14px;">报案人信息:</h5>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="姓名:">
                                <el-input v-model="caseInfo.reportName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="电话:">
                                <el-input v-model="caseInfo.reportPhone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="邮箱:">
                                <el-input v-model="caseInfo.reportEmail"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <h5 class="fc" style="margin-left:14px;">联系人信息:</h5>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="姓名:">
                                <el-input v-model="caseInfo.linkPerson"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="电话:">
                                <el-input v-model="caseInfo.linkmanPhone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="邮箱:">
                                <el-input v-model="caseInfo.linkmanEmail"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submit">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import CaseService from '../../../service/CaseService.js';
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import store from '../../../store/index'
export default {
    store,
    data() {
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
                }
            ],
            caseInfo:{},
            province: [],
            city: [],
            district: [],
            options:[],
		}
    },
    computed:{
        ...mapGetters([
            "caseOverInfo",
            "csaeDictionaries",
            "reportStatus"
        ]),
    },
    created() {
        this.caseInfo.riskType = this.$route.query.productCategory1;
    },
    methods: {
        fileupload(){
            this.caseInfo = JSON.parse(JSON.stringify(this.caseOverInfo));
            this.options = [];
            if(this.caseInfo.personDeath == true){
                if(this.caseInfo.riskType == 'dt'){
                    this.csaeDictionaries.elevator.caseType.forEach(item => {
                        if(item.value == '01' || item.value == '02' || item.value == '03' || item.value == '06'){
                            this.options.push(item);
                        }
                    })
                };
                if(this.caseInfo.riskType == 'sd'){
                    this.csaeDictionaries.repoway.caseType.forEach(item => {
                        if(item.value == '01' || item.value == '02' || item.value == '03' || item.value == '06'){
                            this.options.push(item);
                        }
                    })
                };
                if(this.caseInfo.riskType == 'gz' || this.caseInfo.riskType == 'ty'){
                    this.options = this.csaeDictionaries.employer.caseType;
                };
            }else{
               if(this.caseInfo.riskType == 'dt'){
                    this.csaeDictionaries.elevator.caseType.forEach(item => {
                        if(item.value == '04' || item.value == '05' || item.value == '06'){
                            this.options.push(item);
                        }
                    })
                };
                if(this.caseInfo.riskType == 'sd'){
                    this.csaeDictionaries.repoway.caseType.forEach(item => {
                        if(item.value == '04' || item.value == '05' || item.value == '06'){
                            this.options.push(item);
                        }
                    })
                };
                if(this.caseInfo.riskType == 'gz' || this.caseInfo.riskType == 'ty'){
                    this.options = this.csaeDictionaries.employer.caseType;
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
                if(this.caseInfo.riskType == 'dt'){
                    this.csaeDictionaries.elevator.caseType.forEach(item => {
                        if(item.value == '01' || item.value == '02' || item.value == '03' || item.value == '06'){
                            this.options.push(item);
                        }
                    })
                };
                if(this.caseInfo.riskType == 'sd'){
                    this.csaeDictionaries.repoway.caseType.forEach(item => {
                        if(item.value == '01' || item.value == '02' || item.value == '03' || item.value == '06'){
                            this.options.push(item);
                        }
                    })
                };
                if(this.caseInfo.riskType == 'gz' || this.caseInfo.riskType == 'ty'){
                    this.options = this.csaeDictionaries.employer.caseType;
                };
            }else{
               if(this.caseInfo.riskType == 'dt'){
                    this.csaeDictionaries.elevator.caseType.forEach(item => {
                        if(item.value == '04' || item.value == '05' || item.value == '06'){
                            this.options.push(item);
                        }
                    })
                };
                if(this.caseInfo.riskType == 'sd'){
                    this.csaeDictionaries.repoway.caseType.forEach(item => {
                        if(item.value == '04' || item.value == '05' || item.value == '06'){
                            this.options.push(item);
                        }
                    })
                };
                if(this.caseInfo.riskType == 'gz' || this.caseInfo.riskType == 'ty'){
                    this.options = this.csaeDictionaries.employer.caseType;
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
        proChange(e) { // 选中省
            this.caseInfo.riskCityCode= '';
			this.caseInfo.riskAreaCode= '';
			this.caseInfo.riskCityName= '';
			this.caseInfo.riskAreaName= '';
			this.province.find(item => {
				if(item.value == e){
					this.city = item.children;
					this.caseInfo.riskProvinceName= item.label;
					this.caseInfo.riskProvinceCode= item.value;
				}
			})
        },
        citChange(e) {// 选中市
			this.caseInfo.riskAreaCode= '';
			this.caseInfo.riskAreaName= '';
			this.city.find(item => {
				if(item.value == e){
					this.district = item.children;
					this.caseInfo.riskCityName= item.label;
					this.caseInfo.riskCityCode= item.value;
				}
			})
        },
		countyChange(e) {// 选中区
			this.district.find(item => {
				if(item.value == e){
					this.caseInfo.riskAreaName= item.label;
					this.caseInfo.riskAreaCode= item.value;
				}
			})
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
                "policyId":this.caseInfo.policyId
            }
           const res = await this.caseService.cateModifyinfo(data); 
           if(res.code == '0000'){
               this.$store.commit('updataCaseOverInfo',this.caseInfo);
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
            .bor-btm {
                border-bottom: 1px dashed #ccc;
            }
            border: 0;
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
            }
            .font-style {
                color: #FF0000;
                border: 1px solid #FD9494;
                border-radius: 4px;
                padding: 2px 4px;
                background-color: #ffefef;
            }
        }
    }

</style>