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
            <div v-if="!showOther">
                <el-checkbox v-model="sameRuleForm.checkedSame" class="ml70 mt10 mb20">同投保人信息一致</el-checkbox>
                <Insureds :ruleForms="sameRuleForm" v-if="!sameRuleForm.checkedSame" ref="Insureds"></Insureds>
            </div>
            <div v-else>
                <InsuredsOther :ruleForms="sameRuleForm" ref="Insureds"></InsuredsOther>
            </div>
            
            <!-- 投保方案 广东-->
            <FangAnInfoOther ref="FangAnInfoOther" :compRisk="compRisk" v-if="showOther && (compRisk.productCode == '19PR627806')"></FangAnInfoOther>

            <!-- 投保方案 河北-->
            <FangAnInfoHB ref="FangAnInfoOther" :compRisk="compRisk" v-if="showOther && (compRisk.productCode == '19PR103408')"></FangAnInfoHB>
             
             <!-- 投保人员信息 -->
            <PersonInfo ref="PersonInfo" :showOther="showOther"></PersonInfo>
             
            <!-- 投保方案 -->
            <FangAnInfo ref="FangAnInfo" :compRisk="compRisk" v-if="!showOther"></FangAnInfo>
             
            <!-- 保单信息 -->
            <PolicyInfo ref="PolicyInfo" :ruleForms="policyInfo"></PolicyInfo>
             
             <!-- 保费计算 -->
            <Premium ref="Premium" :productDetali="productDetali" v-if="showOther"></Premium> 

            <Title title="保费计算" v-if="!showOther"></Title>
            <div class="ml70" v-if="!showOther">
                <ul>
                    <li class="f14 pb10 lh40 mb10"><el-button class="ts-ele-btn" type="warning" size="medium" @click="calMoney">立即计算</el-button></li>
                    <li class="f14 pb10" v-if="showMoney">计算公式：</li>
                    <li class="f14 pb10 lh40 ml40" v-if="showMoney">总保险费 = {{this.calpremiums.singlePremiums[0].premiumDesignDesc}}</li>
                </ul>
                <ul class="ts-bg-flex">
                    <li class="ts-bg-column">险种/方案</li>
                    <li class="ts-bg-column">人员数量</li>
                    <li class="ts-bg-column">基本保险费总值（元）</li>
                    <li class="ts-bg-column">附加保险费总值（元）</li>
                    <li class="ts-bg-column">总保险费（元）</li>
                    <li class="ts-bg-column">保费详情</li>
                </ul>
                <ul class="ts-bg-flex mb20 bgfff" v-if="showMoney">
                    <li class="ts-bg-column">{{this.calpremiums.singlePremiums[0].riskPremiums[0].riskName}}</li>
                    <li class="ts-bg-column">{{this.calpremiums.singlePremiums[0].factorResps[0].factorRate}}</li>
                    <li class="ts-bg-column">{{this.calpremiums.singlePremiums[0].riskPremiums[0].riskPremiuml.toFixed(2)}}</li>
                    <li class="ts-bg-column">0.00</li>
                    <li class="ts-bg-column">{{this.calpremiums.totalPremium.toFixed(2)}}</li>
                    <li class="ts-bg-column"><span class="freeDetail" @click="showFreeDetail(calpremiums)">保费详情</span></li>
                </ul>
                <ul class="no-info mb20" v-if="!showMoney">
                    <div class="no-info-style">请在填写完投保信息后点击【保费计算】</div>
                </ul>
            </div>
        
              <!-- 投保声明 -->
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
        <el-dialog title="保费详情" :visible.sync="dialogVisible" width="80%">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="licenceType"
                    label="证件类型"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="证件号码">
                </el-table-column>
                <el-table-column
                    prop="post"
                    label="人员岗位">
                </el-table-column>
                <el-table-column
                    prop="risk"
                    label="险种/方案">
                </el-table-column>
                <el-table-column
                    prop="mainMoney"
                    label="基本保险费(元)">
                </el-table-column>
                <el-table-column
                    prop="subMoney"
                    label="附加保险费(元)">
                </el-table-column>
                <el-table-column
                    prop="allMoney"
                    label="总保险费(元)">
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
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
// import UserService from '@/service/UserService';
import productService from '@/service/ProductService';
import moment from 'moment'
import PolicyHolder from './components/EmployerComponent/PolicyHolder'
import Insureds from './components/EmployerComponent/Insureds'
import InsuredsOther from './components/EmployerComponent/InsuredsOther'
import PersonInfo from './components/EmployerComponent/PersonInfo'
import FangAnInfo from './components/EmployerComponent/FangAnInfo'
import FangAnInfoOther from './components/EmployerComponent/FangAnInfoOther'
import FangAnInfoHB from './components/EmployerComponent/FangAnInfoHB'
import PolicyInfo from './components/EmployerComponent/PolicyInfo'
import Premium from './components/EmployerComponent/Premium'



export default {
    name:'AddPolicyEmployer',
    components: {
        Header,Footer,Step,Title,AddPerson,ImportManList,
        PolicyHolder,Insureds,PersonInfo,FangAnInfo,PolicyInfo,
        InsuredsOther,FangAnInfoOther,Premium,FangAnInfoHB
    },
    data(){
        return{
            upLoadUrl: process.env.ROOT_TESHE + '/api/v1/templateImport/addUserExcel?productCode=TSUSER',
            money:'0.00',
            compRisk: {
                productCode: '',
            },
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
                fax:'',
                attachments:[],
                threeInOneCode:'',
                organizationCode:''
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
                checkedSame: true,
                threeInOneCode:'',
                organizationCode:''
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
            checked:false, 
            province: [],
            city: [],
            district: [],
            calpremiums: {
                singlePremiums:[{premiumDesignDesc:''}]
            },
            showOther: false,
            dialogVisible:false,
            tableData:[]
        }
    },
    store,
    created(){
        this.getArea()
        if(this.$route.query.flag) {
            this.getData();
        } else {
            this.queryAuthentication()
        }

        let productCode = this.$route.params.productCode;
        productCode = productCode ? productCode : window.sessionStorage.getItem('Gucode');
        window.sessionStorage.setItem('Gucode',productCode);
        this.compRisk.productCode = productCode;
        if(productCode == '19PR627806' || productCode == '19PR103408') {
            this.showOther = true;
        } else {
            this.showOther = false;
        }
        this.productDisplay(productCode)
        this.productDetalis(productCode) 
    },
    methods: {
        getPremiumInfo() {
            let premium = {
                compRisk: this.$refs.FangAnInfoOther.getRisk(),
                personInfo: this.$refs.PersonInfo.getPersonInfo()
            };
            return premium;
        },
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
            this.queryAuthentication()
            
        },
        //计算保费
        async calMoney() {
            console.log(this.$refs);
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
                    "productCode": this.compRisk.productCode,	
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
                let linkManDetailAddress = information[information.map(item => item.elementCode ).indexOf("linkManDetailAddress")]  //"联系人地址"
                let linkManAreaCode = information[information.map(item => item.elementCode ).indexOf("linkManAreaCode")]  //"联系人地址编码"
                let fax = information[information.map(item => item.elementCode ).indexOf("fax")]  //"联系人传真"
            
                this.ruleForm.linkManName=linkManName.elementValues
                this.ruleForm.linkManPhone=linkManPhone.elementValues
                this.ruleForm.linkManEmil=linkManEmil.elementValues
                this.ruleForm.orgAddress=linkManDetailAddress.elementValues
                this.ruleForm.fax = fax.elementValues
                

                this.ruleForm.orgFullName=data.orgFullName
                for(let i = 0; i < data.paperworkInfoList.length; i ++) {
                    if(data.paperworkInfoList[i].code == 'bl') {
                        this.ruleForm.threeInOneCode = data.paperworkInfoList[i].value
                        data.paperworkInfoList[i].type = 'I001';
                    } else if(data.paperworkInfoList[i].code == 'gai') {
                        data.paperworkInfoList[i].type = 'I001';
                        this.ruleForm.organizationCode = data.paperworkInfoList[i].value
                    }
                    data.paperworkInfoList[i].id = data.paperworkInfoList[i].url;
                }
                this.ruleForm.attachments = data.paperworkInfoList;
                this.ruleForm.codeType = data.paperworkInfoList[0].name
                this.ruleForm.codeNum = data.paperworkInfoList[0].value

                this.sameRuleForm.linkManName=linkManName.elementValues
                this.sameRuleForm.linkManPhone=linkManPhone.elementValues
                this.sameRuleForm.linkManEmil=linkManEmil.elementValues
                this.sameRuleForm.orgAddress=linkManDetailAddress.elementValues
                this.policyInfo.linkManEmil=linkManEmil.elementValues

                this.sameRuleForm.orgFullName=data.orgFullName
                this.sameRuleForm.codeType=data.paperworkInfoList[0].name
                this.sameRuleForm.codeNum=data.paperworkInfoList[0].value

                let provinceCode = linkManAreaCode.elementValues.slice(0,2)+'0000'
                let cityCode = linkManAreaCode.elementValues.slice(0,4)+'00'
                let countyCode = linkManAreaCode.elementValues

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
                this.ruleForm.address = data.orgAddress
                this.sameRuleForm.address = data.orgAddress
                this.policyInfo.orgAddress = this.ruleForm.province + this.ruleForm.city + this.ruleForm.county + this.ruleForm.orgAddress
            }
        },
        computedPerson() {
            this.personList = JSON.parse(window.sessionStorage.getItem('personList'));
        },
        submitOrder() {
            let policyHolder = this.$refs.PolicyHolder.getPolicyHolder();
            if(JSON.stringify(policyHolder) == '{}') {
                return false;
            }
            let insureds;
            if(!this.showOther) {
                if(this.sameRuleForm.checkedSame) {
                    insureds = policyHolder;
                } else {
                    insureds = this.$refs.Insureds.getInsureds();
                }
                if(JSON.stringify(insureds) == '{}') {
                    return false;
                }
            }
            if(JSON.parse(window.sessionStorage.getItem('personList')).length == 0) {
                this.$message({
                    message: '请添加投保人员',
                    type: 'warning'
                });
                return false;
            }
            let fangan;
            if(this.$refs.FangAnInfo) {
                fangan = this.$refs.FangAnInfo.getRisk();
            } else {
                fangan = this.$refs.FangAnInfoOther.getRisk();
            }
             
            if(JSON.stringify(fangan) == '{}') {
                return false;
            }
            let policyInfo = this.$refs.PolicyInfo.getPolicyInfo();
            if(JSON.stringify(policyInfo) == '{}') {
                return false;
            }
            if(!this.checked) {
                this.$message({
                    message: '请阅读并同意相关条款！',
                    type: 'warning'
                });
                return false;
            }
            
            this.$store.commit('updatePolicyHolder',policyHolder);
            this.$store.commit('updateInsureds',insureds);
            this.$store.commit('updateCompRisk',fangan);
            this.$store.commit('updatePolicyInfo',policyInfo);
            this.$router.push('/policyReview');
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
        showFreeDetail(data) {
            let person = JSON.parse(window.sessionStorage.getItem('personList'));
            for(let i = 0 ; i < person.length; i ++) {
                person[i].mainMoney =  (data.singlePremiums[0].riskPremiums[0].riskPremiuml/ person.length).toFixed(2)
                person[i].allMoney =  (data.singlePremiums[0].riskPremiums[0].riskPremiuml/ person.length).toFixed(2)
                person[i].subMoney =  "0.00";
                person[i].risk =  data.singlePremiums[0].riskPremiums[0].riskName;
            }
            this.tableData = person;
            this.dialogVisible = true;
        }
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
    }
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
.freeDetail {
    cursor: pointer;
}
</style>

