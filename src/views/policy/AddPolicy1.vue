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
            <Title title="投保人信息"></Title>
            <Applicant :flag="flag"></Applicant>
            <div class="ts-insure-scheme pl20">
                <el-form :label-position="labelPosition" label-width="100px"  :inline="true" :rules="rules" :model="ruleForm" class="demo-form-inline" ref="ruleForm">
                    <el-form-item label="投保人类型">
                        <el-input v-model="ruleForm.userType" placeholder="投保人类型" disabled></el-input>
                    </el-form-item>
                    <span class="pl160" ></span>
                    <el-form-item label="投保人性质">
                        <el-input v-model="ruleForm.applicantType" placeholder="投保人性质" disabled></el-input>
                    </el-form-item>
                    <el-form-item v-if="ruleForm.userTypeCode=='sequip_A'" label="姓名" >
                        <el-input v-model="ruleForm.orgFullName" placeholder="姓名" disabled></el-input>
                    </el-form-item>
                    <el-form-item v-if="ruleForm.userTypeCode=='sequip_B' || ruleForm.userTypeCode=='sequip_C'" label="企业名称" >
                        <el-input v-model="ruleForm.orgFullName" placeholder="企业名称" disabled></el-input>
                    </el-form-item>
                   
                    <span class="pl160" ></span>
                    <el-form-item v-if="ruleForm.userTypeCode=='sequip_A'" label="身份证">
                        <el-input v-model="ruleForm.idCard" placeholder="身份证" disabled></el-input>
                    </el-form-item>
                    <el-form-item v-if="ruleForm.userTypeCode=='sequip_B'" label="营业执照号">
                        <el-input v-model="ruleForm.idCard" placeholder="营业执照号" disabled></el-input>
                    </el-form-item>
                    <el-form-item v-if="ruleForm.userTypeCode=='sequip_C'" label="组织机构代码">
                        <el-input v-model="ruleForm.idCard" placeholder="组织机构代码" disabled></el-input>
                    </el-form-item>
                    
                    <el-form-item label="联系人"  prop="linkManName">
                        <el-input v-model="ruleForm.linkManName" placeholder="联系人"></el-input>
                    </el-form-item>
                    <span class="pl160" ></span>
                    <el-form-item label="联系人电话"  prop="linkManPhone">
                        <el-input v-model="ruleForm.linkManPhone" placeholder="联系人电话"></el-input>
                    </el-form-item>
                   
                    <span class="pl160" ></span>
                    <el-form-item label="电子邮箱"  prop="linkManEmil">
                        <el-input v-model="ruleForm.linkManEmil" placeholder="电子邮箱"></el-input>
                    </el-form-item>
                        <br>
                    <el-form-item label="地址" label-width="100px" prop="province" >
                        <el-select v-model="ruleForm.province" @change="proChange" placeholder="请选择省">
                                <el-option :label="item.label" :value="key" v-for="(item,key) in province" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                    <el-form-item label="" label-width="20px" prop="city" >
                        <el-select v-model="ruleForm.city" placeholder="请选择市" @change="citChange">
                            <el-option :label="item.label" :value="key" v-for="(item,key) in city" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="" label-width="20px" prop="county">
                        <el-select v-model="ruleForm.county" placeholder="请选择区" @change="countyChange">
                                <el-option :label="item.label" :value="key" v-for="(item,key) in  district" :key="key"></el-option>
                            </el-select>
                    </el-form-item>
                     <el-form-item label="详细地址"  prop="orgAddress">
                            <el-input v-model="ruleForm.orgAddress" style="width:680px"></el-input>
                    </el-form-item>
                </el-form>
            </div>
             <!-- 被保人信息 -->
            <Title title="被保人信息"></Title>
                 <p class="f18 pt20 pb40 pl20">投保电梯设备的电梯所有人，使用人，管理人，电梯维修保养方，均作为本保险合同的被保险人。<el-link class="f16" type="primary">约定被保人 <img src="../../assets/images/slider/xjt-01.png" alt=""></el-link></p>
            <div class="ts-insure-scheme pl20">
                <!-- <el-form :label-position="labelPosition" label-width="100px"  :inline="true" :model="form" class="demo-form-inline">
                    <el-form-item label="被保人姓名">
                        <el-input v-model="form.serialNumber" placeholder="审批人" style="width:240px"></el-input>
                        <img src="../../assets/images/slider/jh-02.png" alt="" style="margin:0 20px">
                        <img src="../../assets/images/slider/jh-01.png" alt="">
                    </el-form-item>
                </el-form> -->
            </div>
             <!-- 投保人设备信息 -->
            <Title title="投保人设备信息" ></Title>
            <div class="pb20 pl20">
                <ul>
                    <li class="f18 pb20">您可以通过以下几种方式添加电梯：</li>
                    <li class="f16 pb10">1、从【我的设备】选择要投保电梯 <el-button class="ts-ele-btn" type="warning" size="mini" @click="getElevator()">去添加</el-button></li>
                    <li class="f16 pb10">2、录入电梯信息 <el-button class="ts-ele-btn" type="warning" size="mini" @click="addElevator()">去录入</el-button></li>
                    <li class="f16 pb10 ts-bt-flex">3、选择下载模版，批量导入 
                            <el-upload
                                class="upload-demo "
                                :action="url"
                                :on-success='handleSuccess'
                                :show-file-list='false'
                                accept=".xlsx , .xls"
                            >
                            <el-button class="ts-ele-btn mr10" size="small" type="primary"> 点击上传</el-button>
                            </el-upload>
                        <el-button class="ts-ele-btn" type="warning" size="mini"  @click="download()" >设备导入模版下载</el-button>
                    </li>

                   
                </ul>
                 <div class="ts-ele-scheme pl10" v-if="form.elevatorMessage.length >0">
                     您已成功添加  <span class="ts-ele-length">{{form.elevatorMessage.length}}部</span> 设备至您的投保单
                     <el-link :underline="false"  type="primary" @click="importElevator()">查看 | 修改</el-link>
                     <el-link :underline="false"  type="primary" @click="clear()">清空</el-link>
                 </div>
                              
            </div>
              <!-- 投保方案 -->
             <Title title="投保方案"></Title>
            <div class="ts-insure-scheme pl20">
                <el-form :label-position="labelPosition" label-width="80px" :model="form" :rules="rules" ref="form">
                    <el-form-item label="选择日期" prop="startDate">
                         <el-date-picker
                            v-model="form.startDate"
                            @change="setTimer()"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">  
                    </el-date-picker> 00: 00: 00 起 
                    <span style="padding-left:30px"></span>
                    <el-date-picker
                        v-model="form.endDate"
                        disabled
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker> 23: 59: 59 止
                    <span  style="padding-left:30px"></span>
                        共<i style="color: #ff545c; font-weight: 700;">1</i>年
                    <div>
                        <img src="../../assets/images/slider/i-01.png" alt="">
                        <span style="color:#c88b5f">投保但实际支付日期等于或晚于您选择的保险起期时，我们将按照 按实际支付日期 + 1 作为您的保险起期</span>
                    </div>
                    </el-form-item>
                </el-form>
                <el-form :label-position="labelPosition" label-width="80px" :model="projectForm" :rules="rules" ref="projectForm">
                    <el-form-item label="基本险" prop="valueM">
                            <el-select v-model="projectForm.valueM" placeholder="请选择" @change="onMainRisk(projectForm.valueM)">
                                <el-option
                                v-for="(item,key) in mainRisk"
                                :key="key"
                                :label="item.premium+'元/部'"
                                :value="item.code">
                                </el-option>
                            </el-select>
                             <div class="ts-scheme" v-if="liabilityListM.length !=0">
                              <ul v-for="(item,key) in liabilityListM.liabilityList" :key="key">
                                <li class="f12 pl20" v-for="(val,keys) in item.limitList" :key="keys">
                                    ●<span class="pl10"></span>
                                    {{val.name}}： 
                                    <span v-if="val.value.length<20 && val.value /10000 >0">{{val.value / 10000}}万元</span> 
                                    <span v-else-if="val.value.length<20 && val.value /10000 <0">{{val.value }}元</span>
                                     <span v-else >{{val.value}}</span>
                                </li>
                              </ul>
                           </div>
                           
                    </el-form-item>
                    <el-form-item label="附加险">
                           <!-- <el-button plain v-for="(item,key) in subRisk " :key='key'>附加险附加险附加险</el-button> -->
                            <el-checkbox-group v-model="checkListA">
                                
                            <el-checkbox  
                                v-for="(item,key) in subRisk " 
                                :key='key' 
                                :label="item.code">
                                {{item.name}}
                            </el-checkbox>
                            </el-checkbox-group>
                            <div class="ts-scheme" v-if="liabilityListA.length !='0'" v-for="(item,key) in liabilityListA" :key="key">
                                    <ul v-for="(items,keys) in item.liabilityList" :key="keys" >
                                        <li class="w770">{{item.name}}</li>
                                        <li class="f12 pl20" v-for="(val,keys) in items.limitList" :key="keys">
                                            ●<span class="pl10"></span> 
                                            {{val.name}} : 
                                            <span v-if="val.value.length<20 && val.value /10000 >0">{{val.value / 10000}}万元</span>
                                            <span v-else-if="val.value.length<20 && val.value /10000<0">{{val.value }}元</span>
                                            <span v-else>{{val.value}}</span>
                                        </li>
                                    </ul>
                                </div>
                           
                    </el-form-item>
                </el-form>
            </div>
             <!-- 保单信息 -->
            <Title title="保单信息"></Title>
            <div class="pl20">
                <ul>
                    <li class="f18 pb20">温馨提示：</li>
                    <li class="f16 pb10">1、电子保单具有相同的法律效力。出单成功后您你可至您的邮箱或个人中心/我的保单自行下载、打印</li>
                    <el-form :label-position="labelPosition" label-width="100px"  :inline="true" :rules="rules" :model="policyType" class="demo-form-inline" ref="policyForm">
                    
                        <el-form-item label="保单类型" >
                            <el-select v-model="policyType.type" placeholder="请选择">
                                <el-option
                                    v-for="(item,key) in options"
                                    :key="key"
                                    :label="item.value"
                                    :value="item.type">
                            </el-option>
                            </el-select>
                        </el-form-item>
                        <span class="pl160" ></span>
                        <el-form-item label="接受邮箱" prop="email">
                            <el-input v-model="policyType.email" placeholder="电子邮箱"></el-input>
                        </el-form-item>
                        
                        <el-form-item label="邮寄地址" v-if='policyType.type==2'  prop="site">
                                <el-input v-model="policyType.site" style="width:680px"></el-input>
                        </el-form-item>
                    </el-form>
                </ul>
            </div>
            <!-- 发票信息 -->
            <Title title="发票信息"></Title>
            <div class="pt10 pb20 pl20">
                <p class="f18">您可在支付完成后前往 <strong class="f20">个人中心-我的保单</strong> 申请开发票</p>
            </div>
             <!-- 保费计算 -->
            <Title title="保费计算"></Title>
                <div class="pl20">
                    <ul>
                        <li class="f18 pb20">计算公式：</li>
                        <li class="f16 pb10 lh40">总保险费=（基础保费 × 电梯类型调整因子 × 使用场所调整因子 × 使用年限调整因子 × 投保规模调整因子）× 电梯数量 + 雇员伤害责任附加险基础保费 × 电梯数量 + 放弃代位追偿权附加险基础保费 × 电梯数量
                            <el-button class="ts-ele-btn ml10" type="warning" size="mini" @click="premium">
                                立即计算
                            </el-button></li>
                    </ul>
                    <ul class="ts-bg-flex">
                        <li class="ts-bg-column">险种/方案</li>
                        <li class="ts-bg-column">投保电梯数量</li>
                        <li class="ts-bg-column">保险期间</li>
                        <li class="ts-bg-column">总保费</li>
                        <li class="ts-bg-column">保费详情</li>
                    </ul>
                    <ul class="ts-bt-flex" v-if="form.premiumDetails.length >0">
                        <li class=" ts-bt-column">
                            <p> 
                                <span v-for="(item,key) in program " :key="key">
                                    <i v-if="key!=0"> / </i>
                                    {{item.liabilityList[0].riskName}}
                                </span>
                            </p> 
                        </li>
                        <li class=" ts-bt-column">{{form.elevatorMessage.length}}部</li>
                        <li class=" ts-bt-column">1年</li>
                        <li class=" ts-bt-column">{{form.total.toFixed(2)}}</li>
                        <li class=" ts-bt-column"><el-link class="f16" type="primary" @click="premiumDetails">查看</el-link></li>
                        
                    </ul>
                    <ul v-else>
                        <li id="ts-bg-li">暂无数据，请点击 保费计算</li>
                    </ul>
                   
                </div>
            
              <!-- 保费计算 -->
            <Title title="投保声明"></Title>
            <div>
                <ul class="mb10">
                    <li class="f18 pb20">为了维护您的合法权益，根据《中华人民共和国保险法》、《中华人民共和国民法通则》等法律法规要求，请您知晓以下事项：</li>
                    <li class="ts-blue" v-for="(item,key) in  detalis.attrClauseList" v-if="item.order !=5 " :key="key" >《{{item.name}}》</li>
                    
                   
                </ul>
                 <el-checkbox v-model="form.radio" class="f18">我已认真阅读以上内容并同意</el-checkbox>
            </div>
        </div>
        <div  class="ts-wrapper mpt20 container">
            <p class="fl f18">应付保费: <span class="f20 ts-red">{{form.total.toFixed(2)}} 元</span></p>
            <p class="fr"> <el-button class="ts-yellow"  type="warning" @click="verifyPerson('ruleForm')">提交订单</el-button></p>
        </div>

        <AddElevator ref="myChildEle"></AddElevator>
        <ElevatorList ref="myChildEleList" @close="close"></ElevatorList>
        <!-- <ImportEleList ref="myChildImportEle"></ImportEleList> -->
        <PresentElevatorList ref="myChildPresentEle"  @close="close"></PresentElevatorList>
        <PremiumTable ref="myChildPremium"></PremiumTable>
        <Footer></Footer> 
    </div>
</template>

<script>
import Header from '../../components/front/Header';
import Footer from '../../components/front/FooterS';
import Step from './components/Step';
import Title from './components/Title';
import AddElevator from './elevator/AddElevator';
import ImportEleList from './components/ImportEleList';
import PremiumTable from './components/PremiumTable';
import ElevatorList from './ElevatorList';
import PresentElevatorList from './PresentElevatorList';
import areaList from '@/assets/js/area.js';
import UserService from '@/service/UserService';
import productService from '@/service/ProductService'
import PremiumTrial from './js/PremiumTrial.js'
import moment from 'moment'
import Applicant from './components/policyElevator/Applicant';

export default {
 components: {
      Header,Footer,Step,Title,AddElevator,ElevatorList,ImportEleList,PresentElevatorList,PremiumTable,
      Applicant
    },
    data(){
        var validatePhone= (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!/^(1[3-8][0-9]{9})$/i.test(value)) {
                callback(new Error('请输入正确的手机号格式!'));
            } else {
                callback();
            }
        };
        return{
            productService: new productService(),
            url:'',
            flag:true,
            labelPosition: 'right',
            areaList:areaList,
            productDetali:{}, // 产品因子详情
            detalis:{}, // 产品详情
			mainRisk:[],    //主险
            subRisk:[],     //附加险
            liabilityListM:[],  // 主险下面的责任
            liabilityListA:[],  // 主险下面的责任
            checkListA:[],   // 选中的附加附加险
            program:[],     // 主线附加险合并
            value:'',
            projectForm:{
                valueM:'',  // 主线索引
            },
             form:{
                serialNumber:"",  // 流水号，预录单才会有
                programList:[],  //保险方案
                productName:'', //产品名称
                productCode:'', //产品编码
                productClassifyList:[], // 选中的险种分类
                elevatorMessage:[],    // 电梯数量
                startDate:'',  // 起
                endDate:"",    // 使
                applicant:'', // 投保人信息
                recognizee:'投保电梯设备的电梯所有人，使用人，管理人电梯维修保养方，均作为本保险合同的被保险人。',
                total:0, // 保费试算总计
                premiumDetails:'',
                policyType:'',  // 保单类型
                radio:false,    // 是否同意条款

            },
            ruleForm:{      // 投保人信息
                orgFullName:"",     // 投保人名称
                userType:'',        // 用户类型
                userTypeCode:'',        // 用户类型code
                applicantType:'',       // 投保人性质
                applicantCode:'',       // 投保人性质code
                linkManName:'',     // 联系人姓名
                linkManPhone:'',        // 联系人电话
                linkManEmil:'',     // 联系人Emil
                idCard:'',      // 证件号码
                idCardURL:'',      // 证件号码url
                orgAddress:'',      // 详细地址
                province:'',        // 省
                city:'',        // 市
                county:'',      // 区
                provinceCode:'',        // 省
                cityCode:'',        // 市
                countyCode:'',      // 区
            },
            policyType: {
                type: '1',   // 投保单类型
                email: '',  // 电子邮箱
                site: '',   // 地址
            },
            options:[
                {
                    type:'1',
                    value:'电子保单',
                },
                {
                    type:'2',
                    value:'纸质保单',
                },
            ],
            eleFlag:false,
            province: [],
            city: [],
            district: [],
            rules:{
                    linkManName: [
                        { required: true, message: '请填写联系名称', trigger: 'blur' },
                    ],
                    linkManPhone: [
                        { required: true, validator: validatePhone,  trigger: 'blur' },
                    ],
                    linkManEmil: [
                        {  type: 'email', message: '请输入正确的邮箱地址', required: true,  trigger: ['blur', 'change']  },
                    ],
                    province: [
                        {  required: true,  message: '请选择地址', trigger: 'change' }
                    ],
                    orgAddress: [
                        { required: true, message: '请输入详细地址', trigger: 'blur' },
                    ],
                    startDate: [
                        { required: true, message: '请选择起止日期', trigger: 'blur' }
                    ],
                    valueM: [
                        {required: true, message: '请选择主线方案', trigger: 'change' }
                    ],
                    email: [
                        {  type: 'email', message: '请输入正确的邮箱地址', required: true,  trigger: ['blur', 'change']  },
                    ],
                    site: [
                        { required: true, message: '请填写详细地址',  trigger: 'blur' },
                    ],
                    elevatorYear: [
                        { min: 0, max: 2, required: true, message: '请输入正确数据（0~99）', trigger: 'change' }
                    ]
            },
        }
    },
    created(){
        this.getArea();
        this.getStorageData();      // 获取缓存数据
  
        this.url = process.env.ROOT_TESHE+ '/api/v1/templateImport/addElevatorEquipmentExcel?productCode='+this.$route.params.productCode
        
    },
    beforeDestroy(){
       
    },
    beforeRouteLeave (to, from, next) {
          if(to.path=='/policyList'){
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
    watch:{
        checkListA:function(val,oldVal){
            
            this.liabilityListA=[]
            val.forEach(item =>{
              var subRisk =   this.subRisk[this.subRisk.map(pro => pro.code).indexOf(item)];
                this.liabilityListA.push(subRisk);
                
            });
            
        },
         deep: true
    },
    methods: {
        // 获取地区
        async getArea(){
            var userService = new UserService();
            var response = await userService.getArea();
            this.province = response.data
           
        },
          // 获取本地数据
        getStorageData(){
            if(this.$route.params.productCode ){
                this.form.productCode=this.$route.params.productCode;
                this.productDisplay( this.form.productCode);
                this.productDetalis( this.form.productCode);
                this.queryAuthentication();
                 
            } else if (this.$route.params.policyCode){
                
                this.getPolicyDetail(this.$route.params.policyCode);
            } else{
                const data =JSON.parse(sessionStorage.getItem('policyData'));
                this.form=data;
                this.productDisplay( this.form.productCode);
                this.productDetalis( this.form.productCode);
                this.ruleForm=this.form.applicant;
                this.policyType=this.form.policyType
                this.program=this.form.productClassifyList;
            }
        },
        // 产品详情
       async productDetalis(productCode){
                this.form.productCode=productCode;
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

                    this.form.productClassifyList.forEach(item=>{   // 缓存中数据
                        if(item.riskFlag=="A"){
                            this.checkListA.push(item.code);
                        }else if(item.riskFlag=="M"){
                            this.liabilityListM = item;
                            this.projectForm.valueM=item.code;
                        }
                    });
                   
                    this.form.programList=data.programList	
                    this.form.productName=data.name
				}
            
        },
        // 获取产品元素
       async productDisplay(productCode){
				const params = await this.productService.productDisplay(productCode)
				let {code,data} = params
				if(code=='0000'){
                this.productDetali=data	
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
                    let applicantType = information[information.map(item => item.elementCode ).indexOf("applicantType")]  //获取"投保人性质"
                    let userType = information[information.map(item => item.elementCode ).indexOf("userType")]  //获取"用户类型"
                    let linkManName = information[information.map(item => item.elementCode ).indexOf("linkManName")]  //""联系人姓名""
                    let linkManPhone = information[information.map(item => item.elementCode ).indexOf("linkManPhone")]  //"联系人电话"
                    let linkManEmil = information[information.map(item => item.elementCode ).indexOf("linkManEmil")]  //"联系人Emil"

                    this.ruleForm.applicantType=applicantType.elementValues;
                    this.ruleForm.applicantCode=applicantType.valuesCode;
                    this.ruleForm.userType=userType.elementValues;  
                    this.ruleForm.userTypeCode=userType.valuesCode;  
                    this.ruleForm.orgFullName=data.orgFullName;
                    this.ruleForm.linkManName=linkManName.elementValues;
                    this.ruleForm.linkManPhone=linkManPhone.elementValues;
                    this.ruleForm.linkManEmil=linkManEmil.elementValues;
                    this.ruleForm.idCard=data.paperworkInfoList[0].value;
                    this.ruleForm.idCardURL=data.paperworkInfoList[0].url;
                    this.ruleForm.orgAddress=data.orgAddress;

                    this.policyType.email=linkManEmil.elementValues;

                    let provinceCode = data.provinceCode.slice(0,2)+'0000';
                    let cityCode = data.provinceCode.slice(0,4)+'00';
                    let countyCode = data.provinceCode;
                    this.ruleForm.provinceCode= provinceCode;
                    this.ruleForm.cityCode= cityCode;
                    this.ruleForm.countyCode= countyCode;
                    this.province.forEach(item => {
                        if(item.value==provinceCode){
                           this.ruleForm.province= item.label
                           item.children.forEach(ele=>{
                               if(ele.value==cityCode){
                                   this.ruleForm.city=ele.label;
                                   ele.children.forEach(val=>{
                                       if(val.value==countyCode){
                                           this.ruleForm.county=val.label;
                                            return
                                        }
                                   })
                               }
                           })
                        }
                        
                    })
                    console.log(this.ruleForm);
                    
                    this.policyType.site=this.ruleForm.province +' '+ this.ruleForm.city+' '+ this.ruleForm.county+' '+this.ruleForm.orgAddress;
                }
        },
        // 下载电梯模版
        async download(){
            let productCode = this.form.productCode;
            const params = await this.productService.download(productCode,'1');
            let {code,msg} = params;
            if(code=='0000'){
                window.location.href=msg
            }
        },
        handleSuccess(file, fileList) {
           let {code} =file
           if(code=='0000'){
                this.$message.success('添加成功');
                this.form.elevatorMessage = this.form.elevatorMessage.concat(file.list)
             
           }else{
                this.$alert(file.msg, '错误信息', {
                    dangerouslyUseHTMLString: true
                });
           }
        },
        // 主线方案
        onMainRisk(e){
            
          this.liabilityListM =  this.mainRisk[this.mainRisk.map(item=>item.code).indexOf(e)]
        },
        // 选中省市区
        proChange(e) {
            this.ruleForm.city= '';
            this.ruleForm.county= '';
            this.city = this.province[e].children;
            this.ruleForm.province= this.province[e].label
            this.ruleForm.provinceCode= this.province[e].value

        },
        // 选中省市区
        citChange(e) {
            this.district = this.city[e].children;
            this.ruleForm.city= this.city[e].label 
            this.ruleForm.cityCode= this.city[e].value
        },
        // 选中省市区
        countyChange(e) {
            this.ruleForm.county= this.district[e].label 
            this.ruleForm.countyCode= this.district[e].value
        },
        // 获取缓存信息
        close(){
           this.form = JSON.parse(window.sessionStorage.getItem('policyData'));
           
        },
        // 添加电梯 
        addElevator(){
            window.sessionStorage.setItem('policyData',JSON.stringify(this.form))
            let productCode =this.form.productCode
            this.$refs.myChildEle.flagTrue(productCode)
            this.eleFlag = true;
        },  
        // 获取电梯列表 
        getElevator(){
            window.sessionStorage.setItem('policyData',JSON.stringify(this.form))
            let productCode =this.form.productCode
            this.$refs.myChildEleList.flagTrue(productCode)
        },  
        // 获取插入电梯列表 
        importElevator(){
          
            this.$refs.myChildPresentEle.flagTrue()
        }, 
        clear(){    // 清空电梯数据 
            this.form.elevatorMessage=[]
        }, 
        // 获取当前时间
        setTimer(){
            let start = new Date(this.form.startDate);
            let yearFull = start.getFullYear() + 1;
            let mouthFull = start.getMonth() + 1;
            let dayFull = start.getDate();
            this.form.endDate = moment(new Date(yearFull + '-' + mouthFull + '-' + dayFull) - 24*60*60).format('YYYY-MM-DD 23:59:59'); 
            this.form.startDate =	moment(this.form.startDate).format('YYYY-MM-DD 00:00:00');
           
        },
        // 获取保费,保费计算(组装数据)
       async premium(){
            if(this.form.elevatorMessage.length == 0){
                this.form.total=0;
                this.$message.error('请添加电梯');
                return
            }else if(this.liabilityListM.length ==0){
                    this.form.total=0;
                    this.$message.error('请添加基本险');
                return
            }
            
            var Premiums = new PremiumTrial()     // 保费试算获取因子方法
            var data =  [{
                "channelNo": "sequip",
                "productCode": this.form.productCode,    // 产品编码    需要从上个页面带过来
                "insuranceVOS": [], //保险方案
                "factorInfos": [],  // 电梯方案
                "renewalStatus": "1"
            }]
            
            
            let factorVOList = this.productDetali.list //获取电梯因子

            let elevatorType = factorVOList[factorVOList.map(item => item.sign ).indexOf('theElevatorType')]  //获取电梯类型因子
            let elevatorSite = factorVOList[factorVOList.map(item => item.sign ).indexOf('theElevatorSpace')]  //获取电梯使用场所因子
            let elevatorAge = factorVOList[factorVOList.map(item => item.sign ).indexOf('theElevatorLife')]  //"电梯使用年限调整因子"
            let elevatorScale = factorVOList[factorVOList.map(item => item.sign ).indexOf('coverSize')]  //获取电梯投保规模调整因子
            let elevatorNum = factorVOList[factorVOList.map(item => item.sign ).indexOf('theElevatorNumber')]  //获取电梯数量调整因子
            let elevatorGather = factorVOList[factorVOList.map(item => item.sign ).indexOf('elevatorSetPassParameter')]  //获取电梯因子集合传参
            
            
           
            let program = [this.liabilityListM]  // 主线方案因子
            this.liabilityListA.forEach(item=>{
                program.push(item)
            })
            this.program=program;   // 选中的所有方案
            let elevatorList = this.form.elevatorMessage      // 新增电梯因子
            // 方案因子
            program.forEach(item => {
                 var a = {
                        "count": 1,
                        "programCode": item.code,  // 保险主的编码  
                        "riskBeans": [{
                            "riskCode": item.liabilityList[0].riskCode
                        }]
                    }
                data[0].insuranceVOS.push(a)
            })    
        
         
            // 电梯因子操作
            data[0].factorInfos.unshift({
                "factorCode": elevatorNum.code,        
                "stringFactor": elevatorList.length 
            })
            // 电梯的数量，第一个因子，电梯高度或电梯重量
            elevatorList.forEach((item,index) =>{
                    var c ={
                    "factorCode": elevatorGather.code,            // 第一部电梯编码
                    "no":index+1,
                    "factorInfos": [
                    {
                        "factorCode": elevatorAge.code,       // 电梯使用年限  
                        "stringFactor": item.elevatorYear
                    },
                    {
                        "factorCode": elevatorScale.code,   // 投保规模因子
                        "stringFactor": elevatorList.length
                    },
                    {
                        "factorCode": elevatorSite.code,      // 电梯的使用场所
                        "stringFactor":item.elevatorSiteCode
                    }]
                }
                
                var type =  Premiums.type(this.form.productCode,item.elevatorType,item.height,item.weight)
                if(type !='9999'){
                    c.factorInfos.push({
                            "factorCode": elevatorType.code,      // 电梯重量高度    
                            "stringFactor":type
                        })
                }                    
                
                data[0].factorInfos.push(c)
            })
            this.perSum(data)
        },
        async perSum(val){
            const params =val
            let res = await this.productService.premium(params)
            let {code,data} =res
            if(code=='0000'){
                this.form.total=data.totalPremium
                this.form.premiumDetails=data.singlePremiums
            }    
             
        },
        premiumDetails(){   // 保费详情
            window.sessionStorage.setItem('policyData',JSON.stringify(this.form))
            this.$refs.myChildPremium.flagTrue()
        },
        
        verifyPerson(formName){ // 校验投保人信息
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.verifyData('form')
                } else {
                    this.$message.error('请将投保人信息填写完整');
                    return false;
                }
            });

        },
        verifyData(formName){ // 校验时间
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.verifyScheme('projectForm')
                } else {
                    this.$message.error('请将时间信息填写完整');
                    return false;
                }
            });
        },
        verifyScheme(formName){ // 校验方案信息
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.verifyBD('policyForm')
                } else {
                    this.$message.error('请将方案填写完整');
                    return false;
                }
            });
        },
        verifyBD(formName){ // 校验保单信息
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.verifyClause();
                } else {
                    this.$message.error('请将保单信息填写完整');
                    return false;
                }
            });
        },
        verifyClause(){     // 校验条款
            if(this.form.total==0){
                this.$message.error('请点击保费试算')
          
            }else if(this.form.radio==false){
                this.$message.error('请阅读并同意条款')
            }else {

                let liabilityList =[this.liabilityListM]
                this.form.productClassifyList=liabilityList.concat(this.liabilityListA)
                this.form.applicant=this.ruleForm
                this.form.policyType=this.policyType
                window.sessionStorage.setItem('policyData',JSON.stringify(this.form))
                this.$router.push({
                    path:'/policyList',
                })
            }
        },
        async saveOrder(){
            let params = {
                userCode:window.localStorage.getItem('userCode'),
                content:this.form,
                displayContent:{
                   productCode: this.form.productCode,
                   productName: this.form.productName,
                }
            }
            let res = await this.productService.saveOrder(params);
        }
        
    },
}
</script>

<style>
.ts-wrapper{
    width: 1200px;
    margin: 0 auto;
    background-color: #fff;
}
.mt30{
    margin-top: 20px;
    padding: 50px;
    padding-top:30px;
}
.mpt20{
    margin-top: 30px;
    padding: 30px 50px;
}
.ts-warning{
    padding: 0 15px;
    background-color: #fffaf6;
    color: #ff545c;
    height: 50px;
    line-height: 50px;
}
.ts-insure-scheme{
    padding-left: 120px;
    padding-right: 120px; 
}
.w770{
    width: 770px !important; 
}
.ts-scheme{
    margin: 10px 0;
    width: 770px;
    background-color: #f6fbfe;
}
.ts-scheme ul {
    padding: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.ts-scheme ul >li {
    width: 45%;
    height: 40px;
    /* overflow: hidden; */
}
.pl160{
    padding-left: 160px;
}
.ts-ele-btn{
    background-color: #cd9d51;
    height: 25px !important;
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
    font-size: 18px;
    background-color: #fefbf1;
    border: 1px solid  #f0dfbf;

}
.ts-bt-column{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0px;
    font-size: 16px;
    border: 1px solid  #f0dfbf;
}
.ts-bt-flex li:nth-child(1)>p{
    padding:0 35px; 
    line-height: 25px;
}
.ts-bg-flex li:nth-child(1),
.ts-bt-flex li:nth-child(1){
    width: 300px;
}
.ts-bg-flex li:nth-child(2),
.ts-bt-flex li:nth-child(2){
    width: 300px;
}
.ts-bg-flex li:nth-child(3),
.ts-bt-flex li:nth-child(3){
    width: 150px;
}
.ts-bg-flex li:nth-child(4),
.ts-bt-flex li:nth-child(4){
    width: 210px;
}
.ts-bg-flex li:nth-child(5),
.ts-bt-flex li:nth-child(5){
    width: 232px;
}
#ts-bg-li{
    width: 1178px !important;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border: 1px solid #f0dfbf;
    border-top: 0px;
}
.ts-blue{
    color: #0198ef;
    padding: 8px 0;
    font-size: 16px;
    cursor: pointer;
}
.ts-red{
    color: #ff4600;
    font-weight: 700;
}
.ts-yellow{
    background-color: #c9984a;
    font-size: 18px;
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
</style>

