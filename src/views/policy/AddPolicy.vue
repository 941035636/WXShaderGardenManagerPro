<template>
    <div >
        <div class="ts-wrapper mt30">
            <Step></Step>
            <div class="ts-warning">
                <img src="../../assets/images/slider/gth-01.png" alt="">
                <span>为了保障您的权益，请填写真实有效的信息。您填写的内容仅供投保使用，对于您的信息我们会严格保密</span>
            </div>
             <!-- 投保人信息 -->
            <Title title="投保人信息"></Title>
            <Applicant 
                :flag="flag"
                :RYXX="true"
                :productCode="form.productCode"
                ref="myApplicant" 
            ></Applicant>
            
             <!-- 被保人信息 -->
            <Title title="被保人信息"></Title>
                 <p class="f18 pt20 pb40 pl20">投保电梯设备的电梯所有人，使用人，管理人，电梯维修保养方，均作为本保险合同的被保险人。<span class="f16" type="primary" @click="isBBMan" v-if="form.productCode == $globalProductCode.PRODUCT_CODE_GZ ||form.productCode == $globalProductCode.PRODUCT_CODE_KM ">约定被保人 <img src="../../assets/images/slider/xjt-01.png" alt=""></span></p>

            <div class="ts-insure-scheme pl20" v-if="form.isMan">
                <el-form v-for="(item,key) in form.appointBBR" :key="key" :label-position="labelPosition" label-width="100px"  :inline="true" :model="item" class="demo-form-inline">
                    <el-form-item label="被保人姓名">
                        <el-input v-model="item.man" placeholder="审批人" style="width:240px"></el-input>
                        <img src="../../assets/images/slider/jh-02.png" alt="" style="margin:0 20px" @click="deleteMan(key)">
                        <img src="../../assets/images/slider/jh-01.png" alt="" @click="addMan">
                    </el-form-item>
                </el-form>
            </div>
             <!-- 投保方案 -->
             <Title title="投保方案"    v-if="form.productCode == $globalProductCode.PRODUCT_CODE_NJ"></Title>
             <ProjectEle
                v-if="form.productCode == $globalProductCode.PRODUCT_CODE_NJ"
                ref="myProject"
                :mainRisk="mainRisk"
                :subRisk="subRisk"
                :detalis="detalis"
                :productCode='form.productCode'
                :flag="flag"
                @eleButtonNJ="eleButtonNJ"
            >
            </ProjectEle>
             <!-- 投保人设备信息 -->
            <Title title="投保人设备信息" ></Title>
            <PlevatorXx
            ref="myEle"
            :productCode="form.productCode" 
            :flag="flag"
            :eleNJ='eleNJ'
            ></PlevatorXx>
              <!-- 投保方案 -->
             <Title title="投保方案"    v-if="form.productCode != $globalProductCode.PRODUCT_CODE_NJ"></Title>
             <ProjectEle
                v-if="form.productCode != $globalProductCode.PRODUCT_CODE_NJ"
                ref="myProject"
                :mainRisk="mainRisk"
                :subRisk="subRisk"
                :detalis="detalis"
                :productCode='form.productCode'
                :flag="flag"
            >
            </ProjectEle>
             <!-- 保单信息 -->
            <Title title="保单信息"></Title>
             <Applicant 
                :flag="flag"
                :productCode="form.productCode"
                :BDXX="true"
                 ref="myBD" 
            ></Applicant>
          
            <!-- 发票信息 -->
            <Title title="发票信息"></Title>
            <div class="pt10 pb20 pl20">
                <p class="f18">您可在支付完成后前往 <strong class="f20">个人中心-我的保单</strong> 申请开发票</p>
            </div>
             <!-- 保费计算 -->
            <Title title="保费计算"></Title>
                <div class="pl20 pb20">
                    <ul>
                        <li class="f18 pb20">计算公式：</li>
                        <li class="f16 pb10 lh40">
                          <span v-if="form.premiumDetails.length >0">{{form.premiumDetails[0].premiumDesignDesc}}</span>
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
                    <li class="ts-blue" v-for="(item,key) in  detalis.attrClauseList" v-if="item.order !=5 " :key="key" @click="needing(item.value)" >《{{item.name}}》</li>
                </ul>
                 <!-- <el-checkbox v-model="form.radio" class="f18">我已认真阅读以上内容并同意</el-checkbox> -->
            </div>
        </div>
        <div  class="ts-wrapper mpt20 container" >
            <p class="fl f18">应付保费: <span class="f20 ts-red">{{form.total.toFixed(2)}} 元</span></p>
            <p class="fr"> <el-button class="ts-yellow"  type="warning" @click="verifyPerson('ruleForm')">提交订单</el-button></p>
        </div>

        <PremiumTable ref="myChildPremium"></PremiumTable>
        <p class="ts-bc" @click="submitss()" v-if="isScrollTop">保存</p>

    </div>
</template>

<script>
import Step from './components/Step';
import Title from './components/Title';
import ImportEleList from './components/ImportEleList';
import PremiumTable from './components/PremiumTable';
import productService from '@/service/ProductService'
import PremiumTrial from './js/PremiumTrial.js'
import Applicant from './components/policyElevator/Applicant';
import PlevatorXx from './components/policyElevator/PlevatorXx';
import ProjectEle from './components/policyElevator/ProjectEle';

export default {
 components: {
      Step,Title,ImportEleList,PremiumTable,
      Applicant,PlevatorXx,ProjectEle,
    },
    data(){
        return{
            productService: new productService(),
            url:'',
            flag:false,
            labelPosition: 'right',
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
                id:'', // 唯一标识
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
                radio:false,    // 是否同意条款,
                appointBBR:[{       // 追加被保人
                    man:"",
                }],
                 isMan:false,  // 昆明，贵州，显示被保人
            },
           
            eleFlag:false,
            eleNJ:true,
            province: [],
            city: [],
            district: [],
           isScrollTop:true,
           
        }
    },
    created(){
        this.getStorageData();      // 获取缓存数据
        this.url = process.env.ROOT_TESHE+ '/api/v1/templateImport/addElevatorEquipmentExcel?productCode='+this.$route.params.productCode
    },
    beforeDestroy(){
       
    },
    beforeRouteEnter (to, from, next) {
        
        if(from.path !='/login' && from.path !='/'){
            next()
        }else{
             next(vm=>{
                 vm.$router.push({
                    path:'/prerecord',
                })
                 
             })
        }
    
    },
   
    
    methods: {
        
          // 获取本地数据
        getStorageData(){
            if(this.$route.params.productCode ){
                this.form.productCode=this.$route.params.productCode;
                this.productDisplay( this.form.productCode);
                this.productDetalis( this.form.productCode);
                 
            } else if (this.$route.params.policyCode){
                    this.flag=true;
                    this.form.serialNumber=this.$route.params.policyCode;
                    this.getSaveOrder(this.$route.params.policyCode);
               
            } else{
                const data =JSON.parse(sessionStorage.getItem('policyData'));
                this.form=data;
                this.flag=true;
                this.program=this.form.productClassifyList;
                this.productDisplay( this.form.productCode);
                this.productDetalis( this.form.productCode);
            }
        },
        async getSaveOrder(serialNo){
            const res = await this.productService.preRecordIds(serialNo);
            const {code,data} =res;
            if(code=='0000'){
                this.flag=true;
                this.form= JSON.parse(data.content);
                this.form.id=data.id
                this.productDisplay( this.form.productCode);
                this.productDetalis( this.form.productCode);
                // this.form.serialNumber=data.serialNo;
                this.program=this.form.productClassifyList;
                window.sessionStorage.setItem('policyData',JSON.stringify(this.form));
                window.sessionStorage.setItem('elevatorMessage',JSON.stringify(this.form.elevatorMessage));
                window.sessionStorage.setItem('applicant',JSON.stringify(this.form.applicant));
                window.sessionStorage.setItem('productClassifyList',JSON.stringify({'productClassifyList':this.form.productClassifyList,'timer':{'endDate':this.form.endDate,'startDate':this.form.startDate}}));
                window.sessionStorage.setItem('policyType',JSON.stringify(this.form.policyType));
                this.$refs['myApplicant'].getSession();
                this.$refs['myBD'].getSession();
            }
            
        },
        // 产品详情
        async productDetalis(productCode){
                this.form.productCode=productCode;
                const params = await this.productService.productDetalis(productCode);
                let {code,data} = params;
				if(code=='0000'){
                    this.detalis=data;
                    if(this.$globalProductCode.PRODUCT_CODE_GD ==this.form.productCode){
                        const applicant= await this.$refs.myApplicant.queryAuthentication();    // 获取投保人性质code
                        
                        var programList = data.programList;
                            var list1 = []; // 方案一
                            var list2 = []; // 方案二
                            var list3 = []; // 方案三
                            for(var  i = 0 ; i<programList.length;i++){ // 获取所有主险
                                if(programList[i].code=="19FA764874"){      //广东的方案配置
                                    programList[i].name = programList[i].liabilityList[0].riskName;
                                    list1.push(programList[i])
                                }else if(programList[i].code=="19FA277782" || programList[i].code=="19FA155408"){
                                    programList[i].name = programList[i].liabilityList[0].riskName;
                                    list2.push(programList[i])
                                }

                                if(programList[i].code=="19FA291869" || programList[i].code=="19FA155408" || programList[i].code=="19FA329201" ){
                                   programList[i].name = programList[i].liabilityList[0].riskName;
                                   list3.push(programList[i])
                                }
                            }

                            if(applicant=='sequip_01' || applicant=='sequip_02'){
                                    this.mainRisk=list1;
                                   this.$refs.myProject.proudctGD(this.mainRisk)
                            }else if(applicant=='sequip_03' ){
                                    for(var i = 0; i<list2.length;i++){
                                        if(list2[i].riskFlag == 'M') {
                                            this.mainRisk.push(list2[i]);
                                            } else if(list2[i].riskFlag == 'A') {
                                                this.subRisk.push(list2[i]);
                                        }
                                    }
                                    this.$refs.myProject.proudctGD(this.mainRisk)
                            }else if(applicant=='sequip_04'){
                                    for(var i = 0; i<list3.length;i++){
                                      if(list3[i].riskFlag == 'M') {
                                            this.mainRisk.push(list3[i]);
                                        } else if(list3[i].riskFlag == 'A') {
                                            this.subRisk.push(list3[i]);
                                        }
                                   }
                                   this.$refs.myProject.proudctGD(this.mainRisk)
                            }else if(applicant=='sequip_05'){
                                    this.$message.error('没有权限投保')
                            }else{
                                    this.$message.error('没有权限投保')
                            }

                    }else{

                        for(var i = 0; i < data.programList.length; i ++) {
                            let obj = data.programList[i];
                            obj.name = obj.liabilityList[0].riskName;
                            if(obj.riskFlag == 'M') {
                                this.mainRisk.push(obj);
                            } else if(obj.riskFlag == 'A') {
                                this.subRisk.push(obj);
                            }
                        }
                    } 
                   
                    this.form.programList=data.programList	
                    this.form.productName=data.name
                }
                if(this.flag==true){
                    this.$refs.myProject.getSession();
                    this.$refs.myEle.getSession();
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

        // 主线方案
        onMainRisk(e){
        //   this.liabilityListM =  this.mainRisk[this.mainRisk.map(item=>item.code).indexOf(e)]
        },
        // 获取缓存信息
        close(){
           this.form = JSON.parse(window.sessionStorage.getItem('policyData'));
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
            let ruleForm = this.$refs.myApplicant.mergeRY(); // 投保人的信息
            const  {productClassifyList} = this.$refs.myProject.precept();
            this.form.elevatorMessage =JSON.parse( window.sessionStorage.getItem('elevatorMessage'));
            
            if( this.form.elevatorMessage ==null || this.form.elevatorMessage.length == 0 ){
                this.form.total=0;
                this.$message.error('请添加电梯');
                return
            }else if(productClassifyList =='9999'){
                this.form.total=0;
                this.$message.error('请添加基本险');
                return
            }else if(this.form.productCode==this.$globalProductCode.PRODUCT_CODE_NJ && !ruleForm.orgStarsCode){  // 判断是否安全等级，只为南京处理
                this.$message.error('请您去个人中心认证星级单位');
                return
            }else if(this.form.productCode==this.$globalProductCode.PRODUCT_CODE_XA && !ruleForm.vipGradeCode){
                 this.$message.error('请选择会员等级');
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
            let elevatorSafety = factorVOList[factorVOList.map(item => item.sign ).indexOf('theElevatorSafety')]  //获取电梯因子集合传参
            let elevatorStar = factorVOList[factorVOList.map(item => item.sign ).indexOf('maintenanceStar')]  //获取(南京)维保单位星级
            let elevatorVip = factorVOList[factorVOList.map(item => item.sign ).indexOf('vipGrade')]  //获取(南京)维保单位星级
            let MemberEnterprises = factorVOList[factorVOList.map(item => item.sign ).indexOf('elevatorVip')]  //重庆企业单位
           
           
            let program =productClassifyList // 主线方案因子
           
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
                "stringFactor": 'invalidation' 
            })
            // 电梯的数量，第一个因子，电梯高度或电梯重量
            elevatorList.forEach((item,index) =>{
                    let c ={
                    "factorCode": elevatorGather.code,            // 第一部电梯编码
                    "no":index+1,
                    "factorInfos": []
                }
                
                let type =  Premiums.type(this.form.productCode,item.elevatorType,item.height,item.weight);
                let safety =  Premiums.safety(this.form.productCode);
                  if(elevatorAge){
                    c.factorInfos.push({
                        "factorCode": elevatorAge.code,       // 电梯使用年限  
                        "stringFactor":item.productCode==this.$globalProductCode.PRODUCT_CODE_GD?!item.elevatorYear?'invalidation':item.elevatorYear:item.elevatorYear,
                    })
                }
                if(elevatorSite){
                    c.factorInfos.push({
                        "factorCode": elevatorSite.code,      // 电梯的使用场所
                        "stringFactor":item.productCode==this.$globalProductCode.PRODUCT_CODE_GD?!item.elevatorSiteCode?'invalidation':item.elevatorSiteCode:item.elevatorSiteCode,
                    })
                }
                if(type !='9999'){
                    c.factorInfos.push({
                            "factorCode": elevatorType.code,      // 电梯重量高度    
                            "stringFactor":type,
                        })
                }

                if(safety=='0000'){
                    c.factorInfos.push({
                        "factorCode": elevatorSafety.code,      // 电梯安全等级    
                        "stringFactor":item.elevatorLevelCode,
                                        
                    })
                }                    
                if(elevatorScale){
                    c.factorInfos.push({
                        "factorCode" : elevatorScale.code,   // 投保规模因子
                        "stringFactor": item.productCode==this.$globalProductCode.PRODUCT_CODE_CQ? (ruleForm.MemberEnterprises =='0002'?"invalidation":elevatorList.length):elevatorList.length,                                     
                    })
                }                    
                if(elevatorStar){
                    // c.factorInfos.push({
                    //     "factorCode" : elevatorStar.code,   // 南京星级,以后可能放开
                    //     "stringFactor": ruleForm.orgStarsCode,                                       
                    // })
                    if (this.$route.query.appFormCode && this.$route.query.flag == 'again') {
                        c.factorInfos.push({
                            "factorCode" : elevatorStar.code,   // 南京星级
                            "stringFactor": ruleForm.orgStarsCode ? ruleForm.orgStarsCode : '2504',                                       
                        })
                    } else {
                        c.factorInfos.push({
                            "factorCode" : elevatorStar.code,   // 南京星级
                            "stringFactor": 'invalidation',                                       
                        })
                    }
                }                    
                if(elevatorVip){
                    c.factorInfos.push({
                        "factorCode" : elevatorVip.code,   // 西安会员
                        "stringFactor": ruleForm.vipGradeCode,                                       
                    })
                } 
                if(MemberEnterprises){
                    c.factorInfos.push({
                        "factorCode" : MemberEnterprises.code,   // 重庆会员
                        "stringFactor": ruleForm.MemberEnterprises,                                       
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
        
        verifyPerson(){ // 校验投保人方案电梯
          
            let statusRY = this.$refs.myApplicant.verifyPerson();
            let statusBD = this.$refs.myBD.verifyBD();
            let statusSJ = this.$refs.myProject.verifyData();
            let statusFA = this.$refs.myProject.verifyScheme();
           if(statusRY=="0000" && statusBD=="0000" && statusSJ=="0000" && statusFA=="0000"){
               this.verifyClause()
           }
            
        },
        verifyClause(){     // 校验条款
            if(this.form.total==0){
                this.$message.error('请点击保费试算')
            }else {
                let ruleForm = this.$refs.myApplicant.mergeRY(); // 投保人的信息
                let policyType = this.$refs.myBD.mergeBD(); // 投保人的信息
                const  {productClassifyList,timer} = this.$refs.myProject.precept();    // 险种方案信息
                this.form.elevatorMessage =JSON.parse( window.sessionStorage.getItem('elevatorMessage'));   // 电梯信息
                this.form.productClassifyList=productClassifyList
                this.form.startDate=timer.startDate
                this.form.endDate=timer.endDate
                this.form.applicant=ruleForm
                this.form.policyType=policyType
                window.sessionStorage.setItem('policyData',JSON.stringify(this.form))
                this.$router.push({
                    path:'/policyList',
                    
                })
            }
        },
         async submitss(){
            let ruleForm = this.$refs.myApplicant.mergeRY(); // 投保人的信息
            let policyType = this.$refs.myBD.mergeBD(); // 投保人的信息
            const  {productClassifyList,timer} = this.$refs.myProject.precept();    // 险种方案信息
            this.form.elevatorMessage =JSON.parse( window.sessionStorage.getItem('elevatorMessage'))?JSON.parse( window.sessionStorage.getItem('elevatorMessage')):[];   // 电梯信息
            this.form.productClassifyList=productClassifyList=='9999'?[]:productClassifyList;
            this.form.startDate=timer?timer.startDate:'';
            this.form.endDate=timer?timer.endDate:'';
            this.form.applicant=ruleForm;
            this.form.policyType=policyType;
            let form = this.form;
            if(form.serialNumber !=''){
               let params = {
				'managerCode':window.sessionStorage.getItem('userCode'),
				'applyCode':form.serialNumber,
				'policyHolderCode':window.localStorage.getItem('userCode'),
				'policyHolderName':form.applicant.orgFullName,
				'state':0,
				'content':JSON.stringify(form),
				'startDate':form.startDate,
				'endDate':form.endDate,
				'productCode': form.productCode,
				'productName':form.productName,
				'premium':form.total,
				'applyType':1,
                }
                let data = await this.productService.updataRecord(this.$route.params.id,params);
                let {code} = data;
                if(code == '0000'){
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.$router.push({
                        path:'/prerecord'
                    });
                }
            }else{
                this.saveOrder()
            }

			
		
        },
        async saveOrder(){
            // let ruleForm = this.$refs.myApplicant.mergeRY(); // 投保人的信息
            // let policyType = this.$refs.myBD.mergeBD(); // 投保人的信息
            // const  {productClassifyList,timer} = this.$refs.myProject.precept();    // 险种方案信息
            // this.form.elevatorMessage =JSON.parse( window.sessionStorage.getItem('elevatorMessage'));   // 电梯信息
            // this.form.productClassifyList=productClassifyList=='9999'?[]:productClassifyList;
            
            // this.form.startDate=timer?timer.startDate:'';
            // this.form.endDate=timer?timer.endDate:'';
            // this.form.applicant=ruleForm;
            // this.form.policyType=policyType;
            let params = {
                userCode:window.localStorage.getItem('userCode'),
                content:this.form,
                displayContent:{
                   productCode: this.form.productCode,
                   productName: this.form.productName,
                   applyType:"1",      // 电梯（1），雇主，团体（2），索道（3）,团体（4）
                }
            }
            let res = await this.productService.saveTempForm(params.userCode,params.content,params.displayContent);
            const {code,data} =res;
            if(code==='0000'){
                this.form.serialNumber = data.serialNo;
                this.submitsss();
            }
        },
        async submitsss(){
            let ruleForm = this.$refs.myApplicant.mergeRY(); // 投保人的信息
            let policyType = this.$refs.myBD.mergeBD(); // 投保人的信息
            const  {productClassifyList,timer} = this.$refs.myProject.precept();    // 险种方案信息
            this.form.elevatorMessage =JSON.parse( window.sessionStorage.getItem('elevatorMessage'))?JSON.parse( window.sessionStorage.getItem('elevatorMessage')):[];   // 电梯信息
            this.form.productClassifyList=productClassifyList=='9999'?[]:productClassifyList;
            this.form.startDate=timer?timer.startDate:'';
            this.form.endDate=timer?timer.endDate:'';
            this.form.applicant=ruleForm;
            this.form.policyType=policyType;
            let form = this.form;
            if(form.serialNumber !=''){
               let params = {
				'managerCode':window.sessionStorage.getItem('userCode'),
				'applyCode':form.serialNumber,
				'policyHolderCode':window.localStorage.getItem('userCode'),
				'policyHolderName':form.applicant.orgFullName,
				'state':0,
				'content':JSON.stringify(form),
				'startDate':form.startDate,
				'endDate':form.endDate,
				'productCode': form.productCode,
				'productName':form.productName,
				'premium':form.total,
				'applyType':1,
                }
                let data = await this.productService.preRecord(params);
                let {code} = data;
                if(code == '0000'){
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.$router.push({
                        path:'/prerecord'
                    });
                }
            }
        },
        addMan(){   // 增加一条被保人
            this.form.appointBBR.push({
                man:'',
            })
        },
        deleteMan(index){   // 删除一条被保人
            this.form.appointBBR.splice(index,1); 
        },
        isBBMan(){  // 显示被保人
            this.form.isMan=!this.form.isMan
        },
        eleButtonNJ(val){  // 南京产品
            this.eleNJ=val
        },
        scroll(){
           let scrollTop = document.body.scrollTop;
            let clientHeight = document.body.clientHeight;
            // console.log(clientHeight);
            console.log(scrollTop);
            
        },
        needing(url){
        //    const data =  this.userService.downLoad(url)；
           window.location.href =this.$apiUrl.COM_INDENT+url
        },
    },
}
</script>

<style >
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
    height: 100px;
    
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
    line-height: 30px;
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
/* .ts-BBR-input{
    width: 250px;
    height: 50px;
    background-color: red;
    border: 1px solid #ccc;
} */
.ts-bc{
    position: fixed;
    right: 20px;
    bottom: 300px;
    cursor: pointer;
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    color: #fff;
    border-radius: 2px; 
    background-color: #c9984a;
    
}
</style>

