<template>
    <div id="policyReview">
        <Header></Header>
        <div class="ts-wrapper mt30">
            <Step :two="true"></Step>
            <!-- 投保人信息 -->
            <Title title="投保人信息"></Title>
            <div class="ts-insure-scheme">
                <el-form :label-position="labelPosition" label-width="100px" :inline="true" :model="ruleForm" class="demo-form-inline">
                    <el-form-item label="投保人名称：">
                        {{ruleForm.orgFullName}}
                    </el-form-item>
                    <el-form-item label="营业地址：">
                        {{ruleForm.address}}
                    </el-form-item>
                    <el-form-item label="联系人：">
                        {{ruleForm.linkManName}}
                    </el-form-item>
                    <el-form-item label="联系人电话：">
                        {{ruleForm.linkManPhone}}
                    </el-form-item>
                </el-form>
            </div>

            <!-- 被保人信息 -->
            <Title title="被保人信息"></Title>
            <div class="ts-insure-scheme" v-if="!isShow">
                <el-form :label-position="labelPosition" label-width="100px" :inline="true" :model="ruleForm1" class="demo-form-inline">
                    <el-form-item label="被保人名称：">
                        {{ruleForm1.orgFullName}}
                    </el-form-item>
                    <el-form-item label="联系人电话：">
                        {{ruleForm1.linkManPhone}}
                    </el-form-item>
                    <el-form-item label="电子邮箱：">
                        {{ruleForm1.linkManEmil}}
                    </el-form-item>
                    <el-form-item label="被保人地址：" label-width="100px" prop="province" >
                        {{ruleForm1.province + ruleForm.city + ruleForm.county + ruleForm.orgAddress}}
                    </el-form-item>
                </el-form>
            </div>
            <div class="ts-insure-scheme mb20" v-if="isShow">
                职业为电梯修理及维护工人（包括高空作业人员）和电梯安装工人（包括高空作业人员）
            </div>
            <!-- 方案信息 -->
            <Title title="投保方案"></Title>
            <div class="ts-insure-scheme">
                <el-form :label-position="labelPosition" label-width="100px" ref="form" :model="form">
                    <el-form-item label="基本险：" v-if="!isShow">
                        {{form.mainInfo.programName}} 
                        <div class="ts-scheme" v-if="form.mainInfo.liabilityList.length != 0">
                            <ul v-for="(item,index) in form.mainInfo.liabilityList" :key="index">
                                <li v-for="(subItem,subIndex) in item.limitList" :key="subIndex">
                                    <span>{{subItem.name}}</span><span class="mr30">{{(subItem.value/10000 ? subItem.value/10000 + '万元' : subItem.value)}}</span> 
                                </li>
                            </ul>
                        </div>
                    </el-form-item>
                    <el-form-item label="电梯安装工、改造工、维护工等（含高空作业人员）：" v-if="isShow">
                        {{form.mainInfo.programName}} 
                        <div class="ts-scheme" v-if="form.mainInfo.liabilityList.length != 0">
                            <ul v-for="(item,index) in form.mainInfo.liabilityList" :key="index">
                                <li v-for="(subItem,subIndex) in item.limitList" :key="subIndex">
                                    <span>{{subItem.name}}</span><span class="mr30">{{(subItem.value/10000 ? subItem.value/10000 + '万元' : subItem.value)}}</span> 
                                </li>
                            </ul>
                        </div>
                    </el-form-item>
                    <el-form-item label="办公室内勤人员：" v-if="isShow">
                        {{form.mainInfo1.programName}} 
                        <div class="ts-scheme" v-if="form.mainInfo1.liabilityList.length != 0">
                            <ul v-for="(item,index) in form.mainInfo1.liabilityList" :key="index">
                                <li v-for="(subItem,subIndex) in item.limitList" :key="subIndex">
                                    <span>{{subItem.name}}</span><span class="mr30">{{(subItem.value/10000 ? subItem.value/10000 + '万元' : subItem.value)}}</span> 
                                </li>
                            </ul>
                        </div>
                    </el-form-item>
                    <el-form-item label="开始日期：">
                        {{form.startDate}}  起 
                    </el-form-item>
                    <el-form-item label="结束日期：">
                        {{form.endDate}}  止
                    </el-form-item>
                </el-form>
            </div>

            <!-- 保单信息 -->
            <Title title="保单信息"></Title>
            <div class="ts-insure-scheme">
                <el-form :label-position="labelPosition" label-width="100px"  :inline="true" :model="policyInfo"  class="demo-form-inline">
                    <el-form-item label="保单类型：">
                        {{policyInfo.value}}
                    </el-form-item>
                    <el-form-item label="接收邮箱：">
                        {{policyInfo.linkManEmil}}
                    </el-form-item>
                    <el-form-item label="邮寄地址："  v-if="policyInfo.value1 == '01'">
                        {{policyInfo.orgAddress}}
                    </el-form-item>
                </el-form>
            </div>

             <!-- 人员信息 -->
            <Title title="投保人员信息"></Title>
            <div class="ts-ele-scheme pl10">
                <span class="ml10" @click="importPerson()">查看投保人员清单</span>
            </div> 


            <div class="btm-btn mt20 mb20">
                <el-button type="info" @click="returnEdit">返回修改</el-button>
                <el-button type="warning" @click="submit">提交支付</el-button>    
            </div> 
        </div>

        <Footer></Footer>
        <ImportManList ref="ImportManList"></ImportManList>
    </div>
</template>
<script>
import Header from '../../components/front/Header';
import Footer from '../../components/front/FooterS';
import ImportManList from './components/ImportManList';
import Step from './components/Step';
import Title from './components/Title';
import divisors from '../../global/divisor.json'
import productService from '@/service/ProductService'
import moment from 'moment'
export default {
    name: 'PolicyReview',
    components: {
        Header,  Footer, Step, Title, ImportManList
    },
    data() {
        return {
            productService: new productService(),
            divisors:divisors,
            labelPosition: 'right',
            ruleForm: {},
            ruleForm1: {},
            form: {
                mainInfo: {
                    liabilityList:[]
                },
                mainInfo1: {
                    liabilityList:[]
                }
            },
            personList:[],
            policyInfo: {},
            idType: [{
                value: 'cardType_0',
                label: '中国居民身份证'
            },
            {
                value: 'cardType_12',
                label: '澳门身份证'
            },
            {
                value: 'cardType_1',
                label: '护照'
            },
            {
                value: 'cardType_2',
                label: '军官证'
            }],
            officPerson:[],
            normalPerson:[],
            applicationForms1: {},
            applicationForms2: {},
            isShow: false,
            normalHour:{},
            officHour:{}

        }
    },
    created() {
        this.ruleForm = this.$store.getters.policyHolder;
        this.ruleForm1 = this.$store.getters.insureds;
        this.form = this.$store.getters.compRisk;
        this.policyInfo = this.$store.getters.policyInfo;
        if(this.form.productCode == "19PR627806" || this.form.productCode == "19PR103408") {
            this.isShow = true;
        } else {
            this.isShow = false;
        }
        if(this.policyInfo.value1 == '00') {
            this.policyInfo.value = '电子保单';
        } else {
            this.policyInfo.value = '纸质保单';
        }
        this.personList = JSON.parse(window.sessionStorage.getItem('personList'));
        this.checkPerson();
        if(this.form.productCode == "19PR103408") {
            this.checkHours();
        }
    },
    mounted() {
        this.ruleForm = this.$store.getters.policyHolder;
        this.ruleForm1 = this.$store.getters.insureds;
        this.form = this.$store.getters.compRisk;
    },
    methods: {
        checkHours() {
            let normalName = this.form.valueType == '1' ? this.form.mainInfo.programName + '住院':this.form.mainInfo.programName + '误工';
            let officName = this.form.valueType1 == '1' ? this.form.mainInfo1.programName + '住院':this.form.mainInfo1.programName + '误工';
            this.normalHour = this.form.programList[this.form.programList.map(item => item.programName).indexOf(normalName)];
            this.officHour = this.form.programList[this.form.programList.map(item => item.programName).indexOf(officName)];
        },
        checkPerson() {
            for(let i = 0; i < this.personList.length; i ++) {
                if(this.personList[i].post == '内勤人员') {
                    this.officPerson.push(this.personList[i]);
                } else {
                    this.normalPerson.push(this.personList[i]);
                }
            }
            this.addPersonInfo(this.normalPerson)
            this.addPersonInfo(this.officPerson)
        },
        addPersonInfo(name) {
            for(let i = 0; i < name.length; i ++) {
                let obj = name[i];
                obj.no = (i + 1).toString();
                obj.code = this.personList[i].id;
                obj.type = '22';
                for(let j = 0; j < this.idType.length; j ++) {
                    if(this.idType[j].label == obj.licenceType) {
                        obj.licenceTypeNo = this.idType[j].value;
                    }
                }
            }
        },
        checkYear() {
            let data = new Date();
            let year = data.getFullYear();
            let day = "365";
            if( year %4 == 0 && year % 100 != 0 || year % 400 == 0) {
                day = "366";
            } else {
                day = "365";
            }
            return day;
        },
        importPerson() {
            let session = JSON.parse(window.sessionStorage.getItem('personList'));
            this.$refs.ImportManList.flagTrue(session,"1")  
        },
        computedPerson() {

        },
        submit() {
            if(this.form.productCode == "19PR103408" || this.form.productCode == "19PR627806") {
                this.submitOrder();
            } else {
                this.submitOrder1();
            }
        },
        async submitOrder() {
            const divisor = this.divisors.data;  
            const product = divisor[divisor.map(item => item.productCode).indexOf(this.form.productCode)];
            let factorVOList = this.form.detalis.factorVOList; //获取保费计算因子
            let factor1 = [];
            for(let i = 0; i < factorVOList.length; i ++) {
                let obj = {};
                if(factorVOList[i].factorCode == '19YZ1649781446170382336') {
                    if(this.form.checked1) {
                        obj = {
                            "code": factorVOList[i].factorCode,
                            "name": factorVOList[i].factorName,
                            "value": (this.normalPerson.length).toString()
                        }
                    } else {
                        obj = {
                            "code": factorVOList[i].factorCode,
                            "name": factorVOList[i].factorName,
                            "value": "0"
                        }
                    }
                } else {
                    obj = {
                        "code": factorVOList[i].factorCode,
                        "name": factorVOList[i].factorName,
                        "value": (this.normalPerson.length).toString()
                    }
                }
                factor1.push(obj);
            }
            let factor2 = [];
            for(let i = 0; i < factorVOList.length; i ++) {
                let obj = {};
                if(factorVOList[i].factorCode == '19YZ1649781446170382336') {
                    if(this.form.checked2) {
                        obj = {
                            "code": factorVOList[i].factorCode,
                            "name": factorVOList[i].factorName,
                            "value": (this.officPerson.length).toString()
                        }
                    } else {
                        obj = {
                            "code": factorVOList[i].factorCode,
                            "name": factorVOList[i].factorName,
                            "value": "0"
                        }
                    }
                } else {
                    obj = {
                        "code": factorVOList[i].factorCode,
                        "name": factorVOList[i].factorName,
                        "value": (this.officPerson.length).toString()
                    }
                }
                factor2.push(obj);
            }
            let params =  {
                "applicationForms":[],
                "entryType":"00",
                "source":"00",
                "operator":"",
            };
            if(this.officPerson.length == 0) {
                this.applicationForms1 = {
                    "insuredEmployeesNum": (this.normalPerson.length).toString(),
                    "accInsuranceNum":"0",
                    "applicationType": "00", //投保单类型：自助投保（00）/代投保（01）-显示-必填
                    "endDate": this.form.endDate, //保险止期
                    "cityCode": product.city,
                    "risk":[
                        {
                            "riskFlag2": this.form.mainInfo.riskFlag,
                            "duties":[
                                {
                                    "dutyLimits": this.form.mainInfo.liabilityList[0].limitList,
                                    "dutyCode": this.form.mainInfo.liabilityList[0].code,
                                    "dutyDesc":"",
                                    "dutyName": this.form.mainInfo.liabilityList[0].name
                                }
                            ],
                            "programCode": this.form.mainInfo.code,
                            "mainRiskCode": this.form.detalis.riskList[0].code,
                            "riskCode": this.form.detalis.riskList[0].code
                        },
                        {
                            "riskFlag2": this.normalHour.riskFlag,
                            "duties":[
                                {
                                    "dutyLimits": this.normalHour.liabilityList[0].limitList,
                                    "dutyCode": this.normalHour.liabilityList[0].code,
                                    "dutyDesc":"",
                                    "dutyName": this.normalHour.liabilityList[0].name
                                }
                            ],
                            "programCode": this.normalHour.code,
                            "mainRiskCode": this.form.detalis.riskList[0].code,
                            "riskCode": this.form.detalis.riskList[0].code
                        }
                    ],
                    "tempSerialNo":"",//暂存流水号-显示-非必填
                    "productName": this.form.productName,
                    "policyMailAddress":this.policyInfo.linkManEmil, // 电子投保单邮寄邮箱
                    "cityName": product.areaValue,
                    "projectCode": this.form.detalis.projectCode,
                    "term": this.checkYear(),
                    "countyName": product.areaValue,
                    "provinceCode": product.province,
                    "channalCode": "sequip",
                    "branchName": product.branchName,
                    "mailAddress": this.policyInfo.orgAddress, // 邮寄地址
                    "factors": factor1,
                    // "plan": { //方案-显示-必填
                    //     "code": this.form.mainInfo.code,//"方案编码：产品中心取值-显示-必填",
                    //     "quantity": "1",//"方案份数-显示-必填",
                    //     "reducePrem": "0",//"方案优惠保费-显示-非必填",
                    //     "name": this.form.mainInfo.programName,//"方案名称：产品中心取值-显示-必填",
                    //     "prem": this.form.mainInfo.premium,//"方案保费-显示-非必填"
                    // },
                    "branchCode": product.branchCode,
                    "mailType": '02', // 邮寄地址类型
                    "countyCode": product.area,
                    "productCode": this.form.productCode,
                    "originalStatus": "",//投保单初始状态 -显示-非必填
                    "policyHolder":{
                        "address": this.ruleForm.address,//投保企业地址(企)-显示-必填
                        "provinceCode": this.ruleForm.provinceCode,
                        "cityCode": this.ruleForm.cityCode,
                        "holderCode": window.localStorage.getItem('userCode'),
                        "type":"00",
                        "linkTel": this.ruleForm.linkManPhone,
                        "threeInOneCode": this.ruleForm.threeInOneCode,//三证合一代码
                        "attachments":this.ruleForm.attachments,
                        "countyCode": this.ruleForm.countyCode,
                        "organizationCode": this.ruleForm.organizationCode,//组织机构代码
                        "name": this.ruleForm.orgFullName,
                        "location": this.ruleForm.orgAddress,
                        "fax": this.ruleForm.fax,
                        "linkPerson": this.ruleForm.linkManName,
                        "linkEmail": this.ruleForm.linkManEmil,  
                    },
                    "provinceName": product.provinceValue,
                    "projectName": this.form.detalis.projectName,
                    "insureds":[
                        {
                            "entityInfo": "职业为电梯修理及维护工人（包括高空作业人员）和电梯安装工人（包括高空作业人员）",
                            "insuranceObjects": this.normalPerson,
                            "type":"02",
                        }
                    ],
                    "startDate": this.form.startDate, //保险起期
                    "applicationDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    "policyKind": this.policyInfo.value1, // 保单类型 00电子01 纸质
                };
                if(this.form.checked1) {
                    let hourRisk = {
                        "riskFlag2": this.normalHour.riskFlag,
                        "duties":[
                            {
                                "dutyLimits": this.normalHour.liabilityList[0].limitList,
                                "dutyCode": this.normalHour.liabilityList[0].code,
                                "dutyDesc":"",
                                "dutyName": this.normalHour.liabilityList[0].name
                            }
                        ],
                        "programCode": this.normalHour.code,
                        "mainRiskCode": this.form.detalis.riskList[0].code,
                        "riskCode": this.form.detalis.riskList[0].code
                    }
                    this.applicationForms1.accInsuranceNum = (this.normalPerson.length).toString();
                    this.applicationForms1.risk.push(hourRisk);
                }
                params.applicationForms.push(this.applicationForms1);
            } else if(this.normalPerson.length == 0) {
                this.applicationForms2 = {
                    "insuredEmployeesNum": (this.officPerson.length).toString(),
                    "accInsuranceNum":"0",
                    "applicationType": "00", //投保单类型：自助投保（00）/代投保（01）-显示-必填
                    "endDate": this.form.endDate, //保险止期
                    "cityCode": product.city,
                    "risk":[
                        {
                            "riskFlag2": this.form.mainInfo1.riskFlag,
                            "duties":[
                                {
                                    "dutyLimits": this.form.mainInfo1.liabilityList[0].limitList,
                                    "dutyCode": this.form.mainInfo1.liabilityList[0].code,
                                    "dutyDesc":"",
                                    "dutyName": this.form.mainInfo1.liabilityList[0].name
                                }
                            ],
                            "programCode": this.form.mainInfo1.code,
                            "mainRiskCode": this.form.detalis.riskList[0].code,
                            "riskCode": this.form.detalis.riskList[0].code
                        },
                        {
                            "riskFlag2": this.officHour.riskFlag,
                            "duties":[
                                {
                                    "dutyLimits": this.officHour.liabilityList[0].limitList,
                                    "dutyCode": this.officHour.liabilityList[0].code,
                                    "dutyDesc":"",
                                    "dutyName": this.officHour.liabilityList[0].name
                                }
                            ],
                            "programCode": this.officHour.code,
                            "mainRiskCode": this.form.detalis.riskList[0].code,
                            "riskCode": this.form.detalis.riskList[0].code
                        }
                    ],
                    "tempSerialNo":"",//暂存流水号-显示-非必填
                    "productName": this.form.productName,
                    "policyMailAddress":this.policyInfo.linkManEmil, // 电子投保单邮寄邮箱
                    "cityName": product.areaValue,
                    "projectCode": this.form.detalis.projectCode,
                    "term": this.checkYear(),
                    "countyName": product.areaValue,
                    "provinceCode": product.province,
                    "channalCode": "sequip",
                    "branchName": product.branchName,
                    "mailAddress": this.policyInfo.orgAddress, // 邮寄地址
                    "factors": factor2,
                    // "plan": { //方案-显示-必填
                    //     "code": this.form.mainInfo1.code,//"方案编码：产品中心取值-显示-必填",
                    //     "quantity": "1",//"方案份数-显示-必填",
                    //     "reducePrem": "0",//"方案优惠保费-显示-非必填",
                    //     "name": this.form.mainInfo1.programName,//"方案名称：产品中心取值-显示-必填",
                    //     "prem": this.form.mainInfo1.premium,//"方案保费-显示-非必填"
                    // },
                    "branchCode": product.branchCode,
                    "mailType": '02', // 邮寄地址类型
                    "countyCode": product.area,
                    "productCode": this.form.productCode,
                    "originalStatus": "",//投保单初始状态 -显示-非必填
                    "policyHolder":{
                        "address": this.ruleForm.address,//投保企业地址(企)-显示-必填
                        "provinceCode": this.ruleForm.provinceCode,
                        "cityCode": this.ruleForm.cityCode,
                        "holderCode": window.localStorage.getItem('userCode'),
                        "type":"00",
                        "linkTel": this.ruleForm.linkManPhone,
                        "threeInOneCode": this.ruleForm.threeInOneCode,//三证合一代码
                        "attachments":this.ruleForm.attachments,
                        "countyCode": this.ruleForm.countyCode,
                        "organizationCode": this.ruleForm.organizationCode,//组织机构代码
                        "name": this.ruleForm.orgFullName,
                        "location": this.ruleForm.orgAddress,
                        "fax": this.ruleForm.fax,
                        "linkPerson": this.ruleForm.linkManName,
                        "linkEmail": this.ruleForm.linkManEmil,  
                    },
                    "provinceName": product.provinceValue,
                    "projectName": this.form.detalis.projectName,
                    "insureds":[
                        {
                            "entityInfo": "职业为电梯修理及维护工人（包括高空作业人员）和电梯安装工人（包括高空作业人员）",
                            "insuranceObjects": this.officPerson,
                            "type":"02",
                        }
                    ],
                    "startDate": this.form.startDate, //保险起期
                    "applicationDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    "policyKind": this.policyInfo.value1, // 保单类型 00电子01 纸质
                };
                if(this.form.checked2) {
                    let hourRisk = {
                        "riskFlag2": this.officHour.riskFlag,
                        "duties":[
                            {
                                "dutyLimits": this.officHour.liabilityList[0].limitList,
                                "dutyCode": this.officHour.liabilityList[0].code,
                                "dutyDesc":"",
                                "dutyName": this.officHour.liabilityList[0].name
                            }
                        ],
                        "programCode": this.officHour.code,
                        "mainRiskCode": this.form.detalis.riskList[0].code,
                        "riskCode": this.form.detalis.riskList[0].code
                    }
                    this.applicationForms2.accInsuranceNum = (this.officPerson.length).toString();
                    this.applicationForms2.risk.push(hourRisk);
                }
                params.applicationForms.push(this.applicationForms2);
            } else {
                this.applicationForms1 = {
                    "insuredEmployeesNum": (this.normalPerson.length).toString(),
                    "accInsuranceNum":"0",
                    "applicationType": "00", //投保单类型：自助投保（00）/代投保（01）-显示-必填
                    "endDate": this.form.endDate, //保险止期
                    "cityCode": product.city,
                    "risk":[
                        {
                            "riskFlag2": this.form.mainInfo.riskFlag,
                            "duties":[
                                {
                                    "dutyLimits": this.form.mainInfo.liabilityList[0].limitList,
                                    "dutyCode": this.form.mainInfo.liabilityList[0].code,
                                    "dutyDesc":"",
                                    "dutyName": this.form.mainInfo.liabilityList[0].name
                                }
                            ],
                            "programCode": this.form.mainInfo.code,
                            "mainRiskCode": this.form.detalis.riskList[0].code,
                            "riskCode": this.form.detalis.riskList[0].code
                        },
                        {
                            "riskFlag2": this.normalHour.riskFlag,
                            "duties":[
                                {
                                    "dutyLimits": this.normalHour.liabilityList[0].limitList,
                                    "dutyCode": this.normalHour.liabilityList[0].code,
                                    "dutyDesc":"",
                                    "dutyName": this.normalHour.liabilityList[0].name
                                }
                            ],
                            "programCode": this.normalHour.code,
                            "mainRiskCode": this.form.detalis.riskList[0].code,
                            "riskCode": this.form.detalis.riskList[0].code
                        }
                    ],
                    "tempSerialNo":"",//暂存流水号-显示-非必填
                    "productName": this.form.productName,
                    "policyMailAddress":this.policyInfo.linkManEmil, // 电子投保单邮寄邮箱
                    "cityName": product.areaValue,
                    "projectCode": this.form.detalis.projectCode,
                    "term": this.checkYear(),
                    "countyName": product.areaValue,
                    "provinceCode": product.province,
                    "channalCode": "sequip",
                    "branchName": product.branchName,
                    "mailAddress": this.policyInfo.orgAddress, // 邮寄地址
                    "factors": factor1,
                    // "plan": { //方案-显示-必填
                    //     "code": this.form.mainInfo.code,//"方案编码：产品中心取值-显示-必填",
                    //     "quantity": "1",//"方案份数-显示-必填",
                    //     "reducePrem": "0",//"方案优惠保费-显示-非必填",
                    //     "name": this.form.mainInfo.programName,//"方案名称：产品中心取值-显示-必填",
                    //     "prem": this.form.mainInfo.premium,//"方案保费-显示-非必填"
                    // },
                    "branchCode": product.branchCode,
                    "mailType": '02', // 邮寄地址类型
                    "countyCode": product.area,
                    "productCode": this.form.productCode,
                    "originalStatus": "",//投保单初始状态 -显示-非必填
                    "policyHolder":{
                        "address": this.ruleForm.address,//投保企业地址(企)-显示-必填
                        "provinceCode": this.ruleForm.provinceCode,
                        "cityCode": this.ruleForm.cityCode,
                        "holderCode": window.localStorage.getItem('userCode'),
                        "type":"00",
                        "linkTel": this.ruleForm.linkManPhone,
                        "threeInOneCode": this.ruleForm.threeInOneCode,//三证合一代码
                        "attachments":this.ruleForm.attachments,
                        "countyCode": this.ruleForm.countyCode,
                        "organizationCode": this.ruleForm.organizationCode,//组织机构代码
                        "name": this.ruleForm.orgFullName,
                        "location": this.ruleForm.orgAddress,
                        "fax": this.ruleForm.fax,
                        "linkPerson": this.ruleForm.linkManName,
                        "linkEmail": this.ruleForm.linkManEmil,  
                    },
                    "provinceName": product.provinceValue,
                    "projectName": this.form.detalis.projectName,
                    "insureds":[
                        {
                            "entityInfo": "职业为电梯修理及维护工人（包括高空作业人员）和电梯安装工人（包括高空作业人员）",
                            "insuranceObjects": this.normalPerson,
                            "type":"02",
                        }
                    ],
                    "startDate": this.form.startDate, //保险起期
                    "applicationDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    "policyKind": this.policyInfo.value1, // 保单类型 00电子01 纸质
                };
                this.applicationForms2 = {
                    "insuredEmployeesNum": (this.officPerson.length).toString(),
                    "accInsuranceNum":"0",
                    "applicationType": "00", //投保单类型：自助投保（00）/代投保（01）-显示-必填
                    "endDate": this.form.endDate, //保险止期
                    "cityCode": product.city,
                    "risk":[
                        {
                            "riskFlag2": this.form.mainInfo1.riskFlag,
                            "duties":[
                                {
                                    "dutyLimits": this.form.mainInfo1.liabilityList[0].limitList,
                                    "dutyCode": this.form.mainInfo1.liabilityList[0].code,
                                    "dutyDesc":"",
                                    "dutyName": this.form.mainInfo1.liabilityList[0].name
                                }
                            ],
                            "programCode": this.form.mainInfo1.code,
                            "mainRiskCode": this.form.detalis.riskList[0].code,
                            "riskCode": this.form.detalis.riskList[0].code
                        },
                        {
                            "riskFlag2": this.officHour.riskFlag,
                            "duties":[
                                {
                                    "dutyLimits": this.officHour.liabilityList[0].limitList,
                                    "dutyCode": this.officHour.liabilityList[0].code,
                                    "dutyDesc":"",
                                    "dutyName": this.officHour.liabilityList[0].name
                                }
                            ],
                            "programCode": this.officHour.code,
                            "mainRiskCode": this.form.detalis.riskList[0].code,
                            "riskCode": this.form.detalis.riskList[0].code
                        }
                    ],
                    "tempSerialNo":"",//暂存流水号-显示-非必填
                    "productName": this.form.productName,
                    "policyMailAddress":this.policyInfo.linkManEmil, // 电子投保单邮寄邮箱
                    "cityName": product.areaValue,
                    "projectCode": this.form.detalis.projectCode,
                    "term": this.checkYear(),
                    "countyName": product.areaValue,
                    "provinceCode": product.province,
                    "channalCode": "sequip",
                    "branchName": product.branchName,
                    "mailAddress": this.policyInfo.orgAddress, // 邮寄地址
                    "factors": factor2,
                    // "plan": { //方案-显示-必填
                    //     "code": this.form.mainInfo1.code,//"方案编码：产品中心取值-显示-必填",
                    //     "quantity": "1",//"方案份数-显示-必填",
                    //     "reducePrem": "0",//"方案优惠保费-显示-非必填",
                    //     "name": this.form.mainInfo1.programName,//"方案名称：产品中心取值-显示-必填",
                    //     "prem": this.form.mainInfo1.premium,//"方案保费-显示-非必填"
                    // },
                    "branchCode": product.branchCode,
                    "mailType": '02', // 邮寄地址类型
                    "countyCode": product.area,
                    "productCode": this.form.productCode,
                    "originalStatus": "",//投保单初始状态 -显示-非必填
                    "policyHolder":{
                        "address": this.ruleForm.address,//投保企业地址(企)-显示-必填
                        "provinceCode": this.ruleForm.provinceCode,
                        "cityCode": this.ruleForm.cityCode,
                        "holderCode": window.localStorage.getItem('userCode'),
                        "type":"00",
                        "linkTel": this.ruleForm.linkManPhone,
                        "threeInOneCode": this.ruleForm.threeInOneCode,//三证合一代码
                        "attachments":this.ruleForm.attachments,
                        "countyCode": this.ruleForm.countyCode,
                        "organizationCode": this.ruleForm.organizationCode,//组织机构代码
                        "name": this.ruleForm.orgFullName,
                        "location": this.ruleForm.orgAddress,
                        "fax": this.ruleForm.fax,
                        "linkPerson": this.ruleForm.linkManName,
                        "linkEmail": this.ruleForm.linkManEmil,  
                    },
                    "provinceName": product.provinceValue,
                    "projectName": this.form.detalis.projectName,
                    "insureds":[
                        {
                            "entityInfo": "职业为电梯修理及维护工人（包括高空作业人员）和电梯安装工人（包括高空作业人员）",
                            "insuranceObjects": this.officPerson,
                            "type":"02",
                        }
                    ],
                    "startDate": this.form.startDate, //保险起期
                    "applicationDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    "policyKind": this.policyInfo.value1, // 保单类型 00电子01 纸质
                };
                if(this.form.checked1) {
                    let hourRisk = {
                        "riskFlag2": this.normalHour.riskFlag,
                        "duties":[
                            {
                                "dutyLimits": this.normalHour.liabilityList[0].limitList,
                                "dutyCode": this.normalHour.liabilityList[0].code,
                                "dutyDesc":"",
                                "dutyName": this.normalHour.liabilityList[0].name
                            }
                        ],
                        "programCode": this.normalHour.code,
                        "mainRiskCode": this.form.detalis.riskList[0].code,
                        "riskCode": this.form.detalis.riskList[0].code
                    }
                    this.applicationForms1.accInsuranceNum = (this.normalPerson.length).toString();
                    this.applicationForms1.risk.push(hourRisk);
                }
                if(this.form.checked2) {
                    let hourRisk = {
                        "riskFlag2": this.officHour.riskFlag,
                        "duties":[
                            {
                                "dutyLimits": this.officHour.liabilityList[0].limitList,
                                "dutyCode": this.officHour.liabilityList[0].code,
                                "dutyDesc":"",
                                "dutyName": this.officHour.liabilityList[0].name
                            }
                        ],
                        "programCode": this.officHour.code,
                        "mainRiskCode": this.form.detalis.riskList[0].code,
                        "riskCode": this.form.detalis.riskList[0].code
                    }
                    this.applicationForms2.accInsuranceNum = (this.officPerson.length).toString();
                    this.applicationForms2.risk.push(hourRisk);
                }
                params.applicationForms.push(this.applicationForms1);
                params.applicationForms.push(this.applicationForms2);
            }
            let res = await this.productService.submitOrder(params);
            if(res.code =='0000') {
                this.$store.commit('updateOrder',res.data);
                this.$router.push('/payOrder');
            }
        },
        async submitOrder1() {
            const divisor = this.divisors.data;  
            const product = divisor[divisor.map(item => item.productCode).indexOf(this.form.productCode)];
            let factorVOList = this.form.detalis.factorVOList; //获取保费计算因子
            let factor = [];
            for(let i = 0; i < factorVOList.length; i ++) {
                let obj = {
                    "code": factorVOList[i].factorCode,
                    "name": factorVOList[i].factorName,
                    "value": (this.personList.length).toString()
                }
                factor.push(obj);
            }
            let params =  {
                "applicationForms":[
                    {
                        "insuredEmployeesNum": (this.personList.length).toString(),
                        "applicationType": "00", //投保单类型：自助投保（00）/代投保（01）-显示-必填
                        "endDate": this.form.endDate, //保险止期
                        "cityCode": product.city,
                        "risk":[
                            {
                                "riskFlag2": this.form.mainInfo.riskFlag,
                                "duties":[
                                    {
                                        "dutyLimits": this.form.mainInfo.liabilityList[0].limitList,
                                        "dutyCode": this.form.mainInfo.liabilityList[0].code,
                                        "dutyDesc":"",
                                        "dutyName": this.form.mainInfo.liabilityList[0].name
                                    }
                                ],
                                "programCode": this.form.mainInfo.code,
                                "mainRiskCode": this.form.detalis.riskList[0].code,
                                "riskCode": this.form.detalis.riskList[0].code
                            }
                        ],
                        "tempSerialNo":"",//暂存流水号-显示-非必填
                        "productName": this.form.productName,
                        "policyMailAddress":this.policyInfo.linkManEmil, // 电子投保单邮寄邮箱
                        "cityName": product.areaValue,
                        "projectCode": this.form.detalis.projectCode,
                        "term": this.checkYear(),
                        "countyName": product.areaValue,
                        "provinceCode": product.province,
                        "channalCode": "sequip",
                        "branchName": product.branchName,
                        "mailAddress": this.policyInfo.orgAddress, // 邮寄地址
                        "factors": factor,
                        "branchCode": product.branchCode,
                        "mailType": '02', // 邮寄地址类型
                        "countyCode": product.area,
                        "productCode": this.form.productCode,
                        "originalStatus": "",//投保单初始状态 -显示-非必填
                        "policyHolder":{
                            "address": this.ruleForm.address,//投保企业地址(企)-显示-必填
                            "provinceCode": this.ruleForm.provinceCode,
                            "cityCode": this.ruleForm.cityCode,
                            "holderCode": window.localStorage.getItem('userCode'),
                            "type":"00",
                            "linkTel": this.ruleForm.linkManPhone,
                            "threeInOneCode": this.ruleForm.threeInOneCode,//三证合一代码
                            "attachments":this.ruleForm.attachments,
                            "countyCode": this.ruleForm.countyCode,
                            "organizationCode": this.ruleForm.organizationCode,//组织机构代码
                            "name": this.ruleForm.orgFullName,
                            "location": this.ruleForm.orgAddress,
                            "fax": this.ruleForm.fax,
                            "linkPerson": this.ruleForm.linkManName,
                            "linkEmail": this.ruleForm.linkManEmil,  
                        },
                        "provinceName": product.provinceValue,
                        "projectName": this.form.detalis.projectName,
                        "insureds":[
                            {
                                "countyCode": this.ruleForm1.countyCode,
                                "address": this.ruleForm1.address,//被保企业地址(企)-显示-必填
                                "isHolder": this.ruleForm1.checkedSame == 'true' ? 'Y' : 'N',
                                "organizationCode": this.ruleForm1.organizationCode,//组织机构代码
                                "provinceCode": this.ruleForm1.provinceCode,
                                "cityCode": this.ruleForm1.cityCode,
                                "name": this.ruleForm1.orgFullName,
                                "insuranceObjects": this.personList,
                                "location": this.ruleForm1.orgAddress,
                                "threeInOneCode": this.ruleForm1.threeInOneCode,//三证合一代码
                                "type":"00",
                            }
                        ],
                        "startDate": this.form.startDate, //保险起期
                        "applicationDate": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        "policyKind": this.policyInfo.value1, // 保单类型 00电子01 纸质
                    }
                ],
                "entryType":"00",
                "source":"00",
                "operator":"",
            };
            console.log(params);
            let res = await this.productService.submitOrder(params);
            if(res.code =='0000') {
                this.$store.commit('updateOrder',res.data);
                this.$router.push('/payOrder');
            }
        },
        returnEdit() {
            this.$router.push({
                name: 'AddPolicyEmployer',
                query: {
                    flag: '1'
                }
            })
        },

    }
    
}
</script>
<style lang="less" scoped>
    #policyReview {
        .ts-insure-scheme{
            padding-left: 120px;
            padding-right: 120px; 
        }
        .pl160{
            padding-left: 160px;
        }
        .ts-wrapper{
            width: 1200px;
            margin: 0 auto;
            background-color: #fff;
        }
        .mt30{
            margin-top: 30px;
            padding: 50px;
        }
        .el-form-item {
            width: 47%;
        }
        .ts-ele-scheme{
            background-color: #f6fbfe;
            line-height: 50px;
            height: 50px;
        }
        .ts-ele-scheme .ts-ele-length{
            font-weight: 700;
            color: #f74f50;
        }
        .ml10 {
            margin-left: 40px;
            color: #0198ef;
            cursor: pointer;
        }
        .btm-btn {
            text-align: center;
            .el-button {
                padding: 15px 65px;
            }
            .el-button+.el-button {
                margin-left: 30px;
            }
        }

    }
</style>


