<template>
    <div>
        <Header></Header>
        <div class="ts-wrapper mt30">
            <Step></Step>
            <div class="ts-warning">
                <img src="../../assets/images/slider/gth-01.png" alt="">
                <span>为了保障您的权益，请填写真是有效的信息。您填写的内容仅供投保使用，对于您的信息我们会严格保密</span>
            </div>
            <!-- 投保人信息 -->
            <PolicyHolder :ruleForms="ruleForm" ref="PolicyHolder"></PolicyHolder>

             <!-- 被保人信息 -->
            <Title title="被保人信息"></Title>
            <el-checkbox v-model="sameRuleForm.checkedSame" class="ml70 mt10 mb20">同投保人信息一致</el-checkbox>
            <Insureds :ruleForms="sameRuleForm" v-if="!sameRuleForm.checkedSame" ref="Insureds"></Insureds>
             
             <!-- 投保人员信息 -->
            <!-- <PersonInfo ref="PersonInfo"></PersonInfo> -->
             
            <!-- 投保方案 -->
            <FangAnInfo ref="FangAnInfo" :compRisk="compRisk"></FangAnInfo>
             
            <!-- 保单信息 -->
            <PolicyInfo ref="PolicyInfo" :ruleForms="policyInfo"></PolicyInfo>
             
             <!-- 保费计算 -->
            <Title title="保费计算"></Title>
            <div class="ml70">
                <ul>
                    <li class="f14 pb10 lh40 mb10"><el-button class="ts-ele-btn" type="warning" size="medium" @click="calMoney">立即计算</el-button></li>
                    <li class="f14 pb10" v-if="showMoney">计算公式：</li>
                    <li class="f14 pb10 lh40 ml40" v-if="showMoney">总保险费 = {{this.calpremiums.singlePremiums[0].premiumDesignDesc}}</li>
                </ul>
                <el-table :data="tableData" border style="width: 1090px" class="mb30" :header-cell-style="getRowClass">
                    <el-table-column prop="type" label="索道类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="safeNo" label="特种设备安全检验合格证号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="regNo" label="特种设备注册证书号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="baseMoney" label="基本险保费(元)" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="addMoney" label="附加险保费(元)" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="total" label="保险费(元)" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="bili" label="调整比例" width="80px" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="tureMoney" label="优惠后实缴保费(元)" show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
        
              <!-- 保费计算 -->
            <Title title="投保声明"></Title>
            <div class="ml70">
                <ul class="mb10">
                    <li class="f14 pb10 ml8">为了维护您的合法权益，根据《中华人民共和国保险法》、《中华人民共和国民法通则》等法律法规要求，请您知晓以下事项：</li>
                    <li class="ts-blue" v-for="(item,key) in  detalis.attrClauseList" v-if="item.order !=5 " :key="key" >《{{item.name}}》</li>
                </ul>
                 <el-checkbox v-model="checked" class="f14 ml8">我已认真阅读以上内容并同意</el-checkbox>
            </div>
        </div>
        <div  class="ts-wrapper mpt20 container">
            <p class="fl f14">应付保费: <span class="f20 ts-red">{{money}} 元</span></p>
            <p class="fr"> <el-button class="ts-yellow"  type="warning" @click="submitOrder">提交订单</el-button></p>
        </div>
        <Footer></Footer> 
    </div>
</template>

<script>
import store from "@/store/index"
import Header from '../../components/front/Header';
import Footer from '../../components/front/FooterS';
import Step from './components/Step';
import Title from './components/Title';
import AddPerson from './components/AddPerson';
import ImportManList from './components/ImportManList';
import areaList from '@/assets/js/area.js';
import UserService from '@/service/UserService';
import productService from '@/service/ProductService'
import moment from 'moment'
import PolicyHolder from './components/cablewayComponent/PolicyHolder'
import Insureds from './components/cablewayComponent/Insureds'
import PersonInfo from './components/cablewayComponent/PersonInfo'
import FangAnInfo from './components/cablewayComponent/FangAnInfo'
import PolicyInfo from './components/cablewayComponent/PolicyInfo'



export default {
    name:'AddPolicyCableway',
    components: {
        Header,Footer,Step,Title,AddPerson,ImportManList,
        PolicyHolder,Insureds,PersonInfo,FangAnInfo,PolicyInfo
    },
    data(){
        return{
            upLoadUrl: process.env.ROOT_TESHE + '/api/v1/templateImport/addUserExcel?productCode=TSUSER',
            money:'0.00',
            compRisk: {},
            personList:[],
            checkedSame:true,
            showMoney: false,
            checkList:[],
            productService: new productService(),
            labelPosition: 'right',
            areaList:areaList,
            productDetali:{}, // 产品因子详情
            detalis:{}, // 产品详情
			mainRisk:[],    //主险
            subRisk:[],     //附加险
            duties: {},
            value1:'',
            value:'',
            mainInfo:{
                liabilityList:[]
            },
            form:{
                serialNumber:"",  // 流水号，预录单才会有
                programList:[],  //保险方案
                productName:'', //产品名称
                productCode:'', //产品编码
                productClassify:'请选择', // 险种分类
                productClassifyList:[], // 选中的险种分类
                elevatorMessage:[],    // 电梯数量
                timer:'请选择', // 投保时间
                startDate:'',  // 起
                endDate:"",    // 使
                applicant:'广东省大雪纷飞物业管理公司', // 投保人信息
                recognizee:'投保电梯设备的所有人，使用人，管理人电梯维修保养方，均作为本保险合同的被保险人。',
                total:0, // 保费试算总计
                email:"",   // 投保人邮箱
            },
            ruleForm:{      // 投保人信息
                address: '',
                codeType: '',
                codeNum: '',
                orgFullName:'', 
                linkManName:'',
                linkManPhone:'',
                linkManEmil:'',
                orgAddress:'',
                province:'',
                city:'',
                county:'',
                provinceCode:'',
                cityCode:'',
                countyCode:'',
            },
            sameRuleForm:{
                address: '',
                codeType: '',
                codeNum: '',
                orgFullName:'', 
                linkManName:'',
                linkManPhone:'',
                linkManEmil:'',
                orgAddress:'',
                province:'',
                city:'',
                county:'',
                provinceCode:'',
                cityCode:'',
                countyCode:'',
                checkedSame: true
            },
            formLabelAlign: {
                name: '',
                region: '',
                type: ''
            },
            policyInfo: {
                linkManEmil: '',
                orgAddress:'',
                value1: ''
            },
            eleFlag:false,
            checked:false, // 发票
            province: [],
            city: [],
            district: [],
            calpremiums: {
                singlePremiums:[{premiumDesignDesc:''}]
            },
            tableData:[{
                type: '拖挂抱索器式',
                safeNo: '9021-370900-199604-6065',
                regNo: '9021-370900-199604-6065',
                baseMoney: '15000.00',
                addMoney: '9000.00',
                total: '24000.00',
                bili: '0.9',
                tureMoney: '21600.00'
            },
            {
                type: '拖挂抱索器式',
                safeNo: '9021-370900-199604-6065',
                regNo: '9021-370900-199604-6065',
                baseMoney: '15000.00',
                addMoney: '9000.00',
                total: '24000.00',
                bili: '0.9',
                tureMoney: '21600.00'
            },
            {
                type: '拖挂抱索器式',
                safeNo: '9021-370900-199604-6065',
                regNo: '9021-370900-199604-6065',
                baseMoney: '15000.00',
                addMoney: '9000.00',
                total: '24000.00',
                bili: '0.9',
                tureMoney: '21600.00'
            }]
        }
    },
    store,
    created(){
        if(this.$route.query.flag) {
            this.getData();
        } else {
            this.queryAuthentication()
        }
        this.getArea()

        // this.productDisplay('19PR308027')
        // this.productDetalis('19PR308027') 
        
        // this.productDisplay('19PR515224')
        // this.productDetalis('19PR515224')

        // this.productDisplay('19PR485792')
        // this.productDetalis('19PR485792')
        
        // this.productDisplay('19PR616019')
        // this.productDetalis('19PR616019') 
        

        // this.productDisplay('19PR662503')
        // this.productDetalis('19PR662503') 

        // this.productDisplay('19PR804156')
        // this.productDetalis('19PR804156') 
        
        this.productDisplay('19PR218852')
        this.productDetalis('19PR218852')
    },
    methods: {
        getData() {
            this.ruleForm = this.$store.getters.policyHolder;
            this.sameRuleForm = this.$store.getters.insureds;
            this.compRisk = this.$store.getters.compRisk;
            this.policyInfo = this.$store.getters.policyInfo;
        },
        async getArea(){
            var userService = new UserService();
            var response = await userService.getArea();
            this.province = response.data
        },
        //计算保费
        async calMoney() {
            let riskInfo = this.$refs.FangAnInfo.getRisk();
            let personInfo = this.$refs.PersonInfo.getPersonInfo();
            if(!personInfo || personInfo.length == 0) {
                this.$message({
                    message: '请添加投保人员',
                    type: 'warning'
                });
            } else if(JSON.stringify(riskInfo) == '{}') {
                this.$message({
                    message: '请选择基本险',
                    type: 'warning'
                });
            } else {
                let factorVOList = this.productDetali.list //获取保费计算因子
                let factorType = factorVOList[factorVOList.map(item => item.sign ).indexOf('employeeNum')]  //保费计算因子
                let params = [{
                    "productCode": "19PR804156",	
                    "insuranceVOS": [				
                        {
                            "count": 1,				
                            "programCode": riskInfo.value,	
                            "riskBeans": [					
                                {
                                    "riskCode": riskInfo.mainInfo.liabilityList[0].riskCode	
                                }
                            ]
                        }
                    ],
                    "factorInfos": [	
                        {
                            "factorCode": factorType.code,	
                            "stringFactor": personInfo.length						
                        }
                    ],
                    "renewalStatus": "1",								
                    "channelNo": "sequip"								
                }];
                let res = await this.productService.premium(params);
                if(res.code == '0000') {
                    this.money = res.data.totalPremium.toFixed(2);
                    this.calpremiums = res.data;
                    this.showMoney = true;
                }
            }
        },
        // 产品详情
        async productDetalis(productCode){
            let user = new UserService()
            const params = await user.productDetalis(productCode)
            let {code,data} = params
            
            if(code=='0000'){
                this.detalis=data
                for(var i = 0; i < data.programList.length; i ++) {
                    let obj = data.programList[i];
                    obj.name = obj.liabilityList[0].riskName;
                    if(obj.riskFlag == 'M') {
                        this.mainRisk.push(obj);
                    } else if(obj.riskFlag == 'A') {
                        this.subRisk.push(obj);
                    }
                }
                this.form.programList = data.programList	
                this.form.productName = data.name
            }
        },
        // 获取产品元素
        async productDisplay(productCode){
            const params = await this.productService.productDisplay(productCode)
            let {code,data} = params
            if(code=='0000'){
                this.productCode = data.productCode
                this.productDetali = data	
                // this.premium()
            } 
        },
        // 获取投保人信息
		async queryAuthentication(){
            let userCode = window.localStorage.getItem('userCode')
            let user = new UserService()
            const params = await user.queryAuthentication({'userCode': userCode, 'channelNo': 'sequip'})
            let {code,data} = params
            if(code=='0000'){
                let information = data.custOrganizationElementList
                let linkManName = information[information.map(item => item.elementCode ).indexOf("linkManName")]  //""联系人姓名""
                let linkManPhone = information[information.map(item => item.elementCode ).indexOf("linkManPhone")]  //"联系人电话"
                let linkManEmil = information[information.map(item => item.elementCode ).indexOf("linkManEmil")]  //"联系人Emil"
                let businessScope = information[information.map(item => item.elementCode ).indexOf("businessScope")]  //"联系人Emil"
            
                this.ruleForm.linkManName=linkManName.elementValues
                this.ruleForm.linkManPhone=linkManPhone.elementValues
                this.ruleForm.linkManEmil=linkManEmil.elementValues
                this.ruleForm.orgAddress=data.orgAddress
                this.ruleForm.businessScope = businessScope.elementValues
                

                this.ruleForm.orgFullName=data.orgFullName
                this.ruleForm.codeType=data.paperworkInfoList[0].name
                this.ruleForm.codeNum=data.paperworkInfoList[0].value

                this.sameRuleForm.linkManName=linkManName.elementValues
                this.sameRuleForm.linkManPhone=linkManPhone.elementValues
                this.sameRuleForm.linkManEmil=linkManEmil.elementValues
                this.sameRuleForm.businessScope = businessScope.elementValues
                this.sameRuleForm.orgAddress=data.orgAddress
                this.policyInfo.linkManEmil=linkManEmil.elementValues

                this.sameRuleForm.orgFullName=data.orgFullName
                this.sameRuleForm.codeType=data.paperworkInfoList[0].name
                this.sameRuleForm.codeNum=data.paperworkInfoList[0].value

                let provinceCode = data.provinceCode.slice(0,2)+'0000'
                let cityCode = data.provinceCode.slice(0,4)+'00'
                let countyCode = data.provinceCode

                this.sameRuleForm.provinceCode = provinceCode
                this.sameRuleForm.cityCode = cityCode
                this.sameRuleForm.countyCode = countyCode

                this.ruleForm.provinceCode = provinceCode
                this.ruleForm.cityCode = cityCode
                this.ruleForm.countyCode = countyCode



                this.province.forEach(item => {
                    if(item.value==provinceCode){
                        this.ruleForm.province= item.label
                        this.sameRuleForm.province= item.label
                        item.children.forEach(ele=>{
                            if(ele.value==cityCode){
                                this.ruleForm.city=ele.label;
                                this.sameRuleForm.city=ele.label;
                                let flag = true;
                                ele.children.forEach(val=>{
                                    if(val.value == countyCode){
                                        flag = false;
                                        this.ruleForm.county=val.label;
                                        this.sameRuleForm.county=val.label;
                                        return
                                    }
                                });
                                if (flag) {
                                    this.ruleForm.countyCode = '';
                                    this.sameRuleForm.countyCode = '';
                                    this.ruleForm.county = '';
                                    this.sameRuleForm.county = '';
                                }
                            }
                        })
                    }
                })
                this.ruleForm.address = this.ruleForm.province + this.ruleForm.city + this.ruleForm.county + data.orgAddress
                this.sameRuleForm.address = this.sameRuleForm.province + this.sameRuleForm.city + this.sameRuleForm.county + data.orgAddress
                this.policyInfo.orgAddress = this.sameRuleForm.province + this.sameRuleForm.city + this.sameRuleForm.county + data.orgAddress
            }
        },
        computedPerson() {
            this.personList = JSON.parse(window.sessionStorage.getItem('personList'));
        },
        submitOrder() {
            // let policyHolder = this.$refs.PolicyHolder.getPolicyHolder();
            // if(JSON.stringify(policyHolder) == '{}') {
            //     return false;
            // }
            // let insureds;
            // if(this.sameRuleForm.checkedSame) {
            //     insureds = policyHolder;
            // } else {
            //     insureds = this.$refs.Insureds.getInsureds();
            // }
            // if(JSON.stringify(insureds) == '{}') {
            //     return false;
            // }
            // if(JSON.parse(window.sessionStorage.getItem('personList')).length == 0) {
            //     this.$message({
            //         message: '请添加投保人员',
            //         type: 'warning'
            //     });
            //     return false;
            // }
            // let fangan = this.$refs.FangAnInfo.getRisk();
            // if(JSON.stringify(fangan) == '{}') {
            //     return false;
            // }
            // let policyInfo = this.$refs.PolicyInfo.getPolicyInfo();
            // if(JSON.stringify(policyInfo) == '{}') {
            //     return false;
            // }
            // if(!this.checked) {
            //     this.$message({
            //         message: '请阅读并同意相关条款！',
            //         type: 'warning'
            //     });
            //     return false;
            // }
            
            // this.$store.commit('updatePolicyHolder',policyHolder);
            // this.$store.commit('updateInsureds',insureds);
            // this.$store.commit('updateCompRisk',fangan);
            // this.$store.commit('updatePolicyInfo',policyInfo);
            // this.$router.push('/policyReview');
            let params = {
                "entryType":"00",//录入方式：单笔录入(00) / 批量导入(01)-显示-非必填
                "applicationforms":[
                    {
                        "applicationType":"00",//投保单类型：自助投保（00）/代投保（01）-显示-必填
                        "endDate":"2020-05-31 23:59:59",//保险止期：yyyy-MM-dd HH:mm:ss-显示-必填
                        "cityCode":"",//城市编码-显示-非必填
                        "risk险种列表-显示-必填":[
                            {
                                "riskFlag2":"M",//主附标识：主险(M) / 附加险(A)-显示-必填
                                "duties":[//险种责任集合-显示-必填
                                    {
                                        "dutyLimits":[//责任限额集合-显示-必填
                                                {
                                                    "code":"19XE846365",
                                                    "name":"每次事故及累计赔偿限额",
                                                    "mark":"0",
                                                    "valueCode":"19XEZ937096",
                                                    "value":"20000000",
                                                    "valueList":[

                                                    ],
                                                    "premium":0,
                                                    "isFloat":"0",
                                                    "rateList":[

                                                    ]
                                                },
                                                {
                                                    "code":"19XE108764",
                                                    "name":"每人医疗费用赔偿限额",
                                                    "mark":"0",
                                                    "valueCode":"19XEZ527969",
                                                    "value":"120000",
                                                    "valueList":[

                                                    ],
                                                    "premium":0,
                                                    "isFloat":"0",
                                                    "rateList":[

                                                    ]
                                                },
                                                {
                                                    "code":"19XE370814",
                                                    "name":"法律费用每次及累计赔偿限额",
                                                    "mark":"0",
                                                    "valueCode":"19XEZ295083",
                                                    "value":"300000",
                                                    "valueList":[

                                                    ],
                                                    "premium":0,
                                                    "isFloat":"0",
                                                    "rateList":[

                                                    ]
                                                },
                                                {
                                                    "code":"19XE520496",
                                                    "name":"救援费用每次及累计赔偿限额",
                                                    "mark":"0",
                                                    "valueCode":"19XEZ472097",
                                                    "value":"2000000",
                                                    "valueList":[

                                                    ],
                                                    "premium":0,
                                                    "isFloat":"0",
                                                    "rateList":[

                                                    ]
                                                },
                                                {
                                                    "code":"19XE878598",
                                                    "name":"乘客滞留 累计赔偿限额",
                                                    "mark":"0",
                                                    "valueCode":"19XEZ280435",
                                                    "value":"500000",
                                                    "valueList":[

                                                    ],
                                                    "premium":0,
                                                    "isFloat":"0",
                                                    "rateList":[

                                                    ]
                                                },
                                                {
                                                    "code":"19XE832907",
                                                    "name":"每人人身伤亡赔偿限额",
                                                    "mark":"0",
                                                    "valueCode":"19XEZ797801",
                                                    "value":"600000",
                                                    "valueList":[

                                                    ],
                                                    "premium":0,
                                                    "isFloat":"0",
                                                    "rateList":[

                                                    ]
                                                }
                                            ],
                                            "dutyCode":"19ZR898782",//"责任编码-显示-必填",
                                            "dutyDesc":"",//责任描述-显示-非必填",
                                            "dutyName":"基本险赔偿责任"//"责任名称-显示-必填"
                                    }
                                ],
                                "programCode":"19FA447690",//"方案编码：产品中心取值-显示-必填",
                                "mainRiskCode":"19XZ842018",//"主险编码：产品中心取值-显示-必填",
                                "riskCode":"19XZ842018"//"险种代码：产品详情取值-显示-必填"
                            }
                        ],
                        "tempSerialNo":"",//暂存流水号-显示-非必填
                        "productName":this.form.productName,//产品名称：产品详情取值-显示-必填
                        "policyKind":this.policyInfo.value1,//保单类型：电子保单(00) / 纸质保单(01)-显示-必填
                        "policyMailAddress":this.policyInfo.linkManEmil,//电子保单邮箱地址-显示-必填
                        "cityName":product.areaValue,//城市名称-显示-非必填
                        "projectCode":this.form.detalis.projectCode,//项目编码：产品详情取值-显示-必填
                        "cablewayInsurance":"",//索道责任保险-显示-必填
                        "countyName":product.areaValue,//区县名称-显示-非必填
                        "provinceCode":product.province,//省编码-显示-非必填
                        "branchName":product.branchName,//机构名称：用户未关联业务员必填-显示-非必填
                        "mailAddress":this.policyInfo.orgAddress,//邮寄地址-显示-必填
                         "factors":[ //保费计算因子-显示-必填
                            {
                                "code":"19YZ1631963396385804297",
                                "related1":"1",
                                "name":"客运索道服务质量等级调整因子",
                                "value":"2301"
                            },
                            {
                                "code":"19YZ1631995333762617344",
                                "related1":"1",
                                "name":"续保保费调整因子 （首年没有）",
                                "value":"3103"
                            }
                        ],
                        "branchCode":product.branchCode,//机构编码：用户未关联业务员必填-显示-非必填
                        "mailType":"02",//邮寄地址类型-显示-必填
                        "countyCode":product.area,//区县编码-显示-非必填
                        "productCode":this.form.productCode,//产品编码：产品详情取值-显示-必填
                        "originalStatus":"", //投保单初始状态 -显示-非必填
                        "policyHolder":{//投保人-显示-必填
                            "zipCode":"",//邮编(企)-显示-必填
                            "provinceCode":this.ruleForm.provinceCode,//省编码(共)-显示-必填
                            "cityCode":this.ruleForm.cityCode,//城市编码(共)-显示-非必填
                            "businessScope":"谁知道啊",//经营范围(企)-显示-必填
                            "type":"00",//投保人类型(共)：企业(00) / 自然人(01) / 虚拟(02)-显示-必填
                            "linkTel":this.ruleForm.linkManPhone,//联系人电话(企)-显示-必填
                            "attachments":this.ruleForm.attachments,//附件列表(共)-显示-必填
                            "threeInOneCode":this.ruleForm.threeInOneCode,//三证合一代码(企)-显示-非必填
                            "countyCode":this.ruleForm.countyCode,//区县编码(共)-显示-非必填
                            "organizationCode":this.ruleForm.organizationCode,//组织机构编码(企)-显示-非必填
                            "name":this.ruleForm.orgFullName,//投保人名称(共)-显示-必填
                            "location":this.ruleForm.orgAddress,//详细地址(共)-显示-必填
                            "fax":this.ruleForm.fax,//传真(企)-显示-非必填
                            "linkPerson":this.ruleForm.linkManName,//联系人名称(企)-显示-必填
                            "linkEmail":this.ruleForm.linkManEmil//联系人邮箱(企)-显示-必填
                        },
                        "provinceName":product.provinceValue,//省名称-显示-非必填
                        "projectName":this.form.detalis.projectName,//项目名称：产品详情取值-显示-必填
                        "insureds":[ //被保人列表-显示-必填
                            {
                                "linkPhone":this.ruleForm1.linkManPhone,//"被保人联系人手机(企)-显示-必填",
                                "isHolder":this.ruleForm1.checkedSame == 'true' ? 'Y' : 'N',//"被保人是否同投保人(共)-显示-必填"
                                "provinceCode": this.ruleForm1.provinceCode,//"省编码(共)-显示-必填",
                                "cityCode":this.ruleForm1.cityCode,//"城市编码(共)-显示-非必填",
                                "businessScope":"你猜猜",
                                "insuranceObjects被保险人标的列表(共)-显示-必填":[
                                    {
                                        "no":"1",//"标的序号-显示-必填",
                                        "code":"",//"标的唯一标识-显示-必填",
                                        "threeYearAcc":"",//"三年出险情况（索道）-显示-必填",
                                        "cablewayType":"",//"索道类型-显示-必填",
                                        "threeYearTotalAnnual":"",//"大前年年度赔偿总额（索道）-显示-必填",
                                        "type":"21",//"标的类型：学生(00) / 教师(01) / 医生(10) / 电梯(20) / 索道(21) / 客运汽车(30) / 货运汽车(31)-显示-必填",
                                        "serviceLevel":"",//"服务质量评价信息-显示-必填",
                                        "lastYearTotalAnnual":"",//"去年年度赔偿总额（索道）-显示-必填",
                                        "preYearTotalAnnual":"",//"前年年度赔偿总额（索道）-显示-必填",
                                        "sequipRegistNum":"",//"客运索道设备代码-显示-必填",
                                        "safetyCertificateStartDate":"",//"安全检验合格证起期-显示-必填",
                                        "safetyCertificateEndDate":"",//"安全检验合格证止期-显示-必填",
                                        "cablewayName":"",//"索道名称-显示-必填",
                                        "safetyCertificate":"",//"安全检验合格证-显示-必填",
                                        "transportedLastYearNum":"",//"上年度运送乘客数-显示-必填",
                                        "attachments标的附件-显示-必填":[
                                            {
                                                "id":"标的附件id-显示-非必填",
                                                "type":"标的附件类型-显示-非必填"
                                            }
                                        ]
                                    }
                                ],
                                "type":"00",//"被保人类型(共)：企业(00) / 自然人(01) / 虚拟(02)-显示-必填",
                                "threeInOneCode":this.ruleForm1.threeInOneCode,//"三证合一代码(企)-显示-非必填",
                                "countyCode":this.ruleForm1.countyCode,//"区县编码(共)-显示-非必填",
                                "organizationCode":this.ruleForm1.organizationCode,//"组织机构编码(企)-显示-非必填",
                                "name":this.ruleForm1.orgFullName,//"被保人名称(共)-显示-必填",
                                "location":this.ruleForm1.orgAddress,//"详细地址(共)-显示-必填",
                                "linkEmail":this.ruleForm1.linkManEmil//"联系人邮箱(企)-显示-必填"
                            }
                        ],
                        "startDate":"2019-06-03 00:00:00",
                        "applicationDate":"2019-06-01 20:00:00"//"投保日期：yyyy-MM-dd HH:mm:ss-显示-必填"
                    }
                ],
                "source":"00",//订单来源：pc端(00) / 移动端(01) / 合作方(02)-显示-非必填
                "operator":"" //操作人员编码-显示-非必填
            }
        },
        async saveOrder() {
            let policyHolder = this.$refs.PolicyHolder.getPolicyHolderNoVal();
            let insureds;
            if(this.sameRuleForm.checkedSame) {
                insureds = policyHolder;                
            } else {
                insureds = this.$refs.Insureds.getInsuredsNoVal();
            }
            let fangan = this.$refs.FangAnInfo.getRiskNoVal();
            let policyInfo = this.$refs.PolicyInfo.getPolicyInfoNoVal();
            let personInfo = this.$refs.PersonInfo.getPersonInfoNoVal();
            let params = {
                userCode:window.localStorage.getItem('userCode'),
                content: {
                    policyHolder: policyHolder,
                    insureds: insureds,
                    fangan: fangan,
                    policyInfo: policyInfo,
                    personInfo: personInfo
                },
                displayContent:{
                   productCode: fangan.productCode,
                   productName: fangan.productName,
                   applyType: "2"
                }
            }
            let res = await this.productService.saveOrder(params);
        },
        //更改表头颜色
        getRowClass({
        row,
        column,
        rowIndex,
        columnIndex
        }) {
        if (rowIndex == 0) {
            return 'background-color: #fefbf1;color:#c9984a;';
        } else {
            return '';
        }
        },
    },
    beforeRouteLeave (to, from, next) {
        if(to.path=='/policyReview'){
                next();
          }else{
            this.$confirm('是否将将您录入的信息缓存', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
                }).then(() => {
                    this.saveOrder();
                    next();
                }).catch(() => {
                    next();       
            });
        }
    },
    
}
</script>

<style lang="less" scoped>
.ts-wrapper{
    width: 1200px;
    margin: 0 auto;
    background-color: #fff;
}
.mt30{
    margin-top: 30px;
    padding: 50px;
}
.ml40 {
    margin-left: 40px;
}
.mpt20{
    margin-top: 30px;
    padding: 30px 50px;
}
.no-info {
    border: 1px dotted #cd9d51;
    width: 1090px;
    .no-info-style {
        text-align: center;
        margin: 40px auto;
    }
}
.ts-warning{
    padding: 0 15px;
    color: #ff545c;
    height: 50px;
    line-height: 50px;
    img {
        height: 20px;
        vertical-align: middle;
    }
}
.ts-insure-scheme{
    padding-left: 120px;
    padding-right: 120px; 
}
.ts-scheme{
    margin: 10px 0;
    width: 770px;
    background-color: #f6fbfe;
}
.ts-scheme ul {
    padding: 10px;
}
.ts-scheme ul >li {
    width: 100%;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
}
.ts-scheme ul li {
    span {
        display: inline-block;
        width: 40%;
    }
}
.pl160{
    padding-left: 160px;
}
.tip-text {
    margin: 0 100px 20px;
    span {
        color: #0198ef;
        font-weight: 700;
        cursor: pointer;
    }
}
.ts-ele-btn{
    background-color: #cd9d51;
    height: 34px;
}
.ts-bg-flex,
.ts-bt-flex{
    display: flex;
    flex-direction: row;
}
.ts-bg-column{
    height: 45px;
    line-height: 45px;
    text-align: center;
    color: #c9984a;
    font-size: 14px;
    background-color: #fefbf1;
    border: 1px solid  #f0dfbf;
}
.bgfff {
   .ts-bg-column{
        height: 45px;
        line-height: 45px;
        text-align: center;
        color: #c9984a;
        font-size: 14px;
        background-color: #fff;
        border: 1px solid  #f0dfbf;
    } 
}
.ts-bt-column{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0px;
    font-size: 14px;
    border: 1px solid  #f0dfbf;
}
.ts-bt-flex li:nth-child(1)>p{
    padding:0 35px; 
    line-height: 25px;
}
.ts-bg-flex li,
.ts-bt-flex li{
    width: 180px;
}
.ts-blue{
    color: #0198ef;
    padding: 8px 0;
    font-size: 14px;
    cursor: pointer;
}
.ts-red{
    color: #ff4600;
    font-weight: 700;
}
.ts-yellow{
    background-color: #c9984a;
    font-size: 14px;
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
.ml70 {
    margin-left: 70px;
    .col-black {
        color: #101010;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
    }
}
.upload-demo  {
    display: inline;
}
.ml10 {
    margin-left: 40px;
    color: #0198ef;
    cursor: pointer;
}
.ml8 {
    margin-left: 8px;
}
</style>

