<template>
<div>
     <div class="ts-insure-scheme pl20"  v-if="RYXX">
                <el-form v-if="ruleForm.userType" :label-position="labelPosition" label-width="150px"  :inline="true" :rules="rules" :model="ruleForm" class="demo-form-inline" ref="ruleForm">
                    <el-form-item label="投保人类型">
                        <el-input v-model="ruleForm.userType" placeholder="投保人类型" disabled class="name-input"></el-input>
                    </el-form-item>
                    <span class="pl160" ></span>
                    <el-form-item label="投保人性质">
                        <el-input v-model="ruleForm.applicantType" placeholder="投保人性质" disabled class="name-input"></el-input>
                    </el-form-item>
                    <el-form-item v-if="ruleForm.userTypeCode=='sequip_A'" label="姓名" >
                        <el-input v-model="ruleForm.orgFullName" placeholder="姓名" disabled class="name-input"></el-input>
                    </el-form-item>
                    <el-form-item v-else-if="ruleForm.userTypeCode=='sequip_B' || ruleForm.userTypeCode=='sequip_C'" label="企业名称" >
                        <el-input v-model="ruleForm.orgFullName" placeholder="企业名称" disabled class="name-input"></el-input>
                    </el-form-item>
                   
                    <span class="pl160"></span>
                    <el-form-item v-if="ruleForm.userTypeCode=='sequip_A'" label="身份证">
                        <el-input v-model="ruleForm.idCard" placeholder="身份证" disabled class="name-input"></el-input>
                    </el-form-item>
                    <el-form-item v-if="ruleForm.userTypeCode=='sequip_B'" label="营业执照号">
                        <el-input v-model="ruleForm.idCard" placeholder="营业执照号" disabled class="name-input"></el-input>
                    </el-form-item>
                    <el-form-item v-if="ruleForm.userTypeCode=='sequip_C'" label="组织机构代码">
                        <el-input v-model="ruleForm.idCard" placeholder="组织机构代码" disabled class="name-input"></el-input>
                    </el-form-item>
                    
                    <el-form-item  v-if="productCode==$globalProductCode.PRODUCT_CODE_NJ" label="上一年度星级评定"   prop="orgStars" >
                        <el-select v-model="ruleForm.orgStarsCode" class="name-input" placeholder="未认证星级评定" disabled>
                            <el-option v-for="item in options4" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <span class="pl160" v-if="productCode==$globalProductCode.PRODUCT_CODE_NJ"></span>
                    <el-form-item label="联系人"  prop="linkManName">
                        <el-input v-model="ruleForm.linkManName" placeholder="联系人" class="name-input"></el-input>
                    </el-form-item>
                    <span class="pl160" v-if="productCode!=$globalProductCode.PRODUCT_CODE_NJ" ></span>
                    <el-form-item label="联系人电话"  prop="linkManPhone">
                        <el-input v-model="ruleForm.linkManPhone" placeholder="联系人电话" class="name-input"></el-input>
                    </el-form-item>
                    <span class="pl160" v-if="productCode==$globalProductCode.PRODUCT_CODE_NJ" ></span>
                    <el-form-item label="电子邮箱"  prop="linkManEmil">
                        <el-input v-model="ruleForm.linkManEmil" placeholder="电子邮箱" class="name-input"></el-input>
                    </el-form-item>
                      <span class="pl160" ></span>
                    <el-form-item  v-if="productCode==$globalProductCode.PRODUCT_CODE_XA" label="会员等级"   prop="vipGradeCode" >
                        <el-select v-model="ruleForm.vipGradeCode"  placeholder="请选择会员等级" class="name-input" disabled>
                                <el-option v-for="item in options4" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  v-if="productCode==$globalProductCode.PRODUCT_CODE_CQ" label="会员企业"   prop="MemberEnterprises" >
                        <el-select v-model="ruleForm.MemberEnterprises"  placeholder="请选择会员企业" disabled class="name-input">
                                <el-option v-for="item in options4" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <br/>
                    <el-form-item label="地址" label-width="150px" prop="province" >
                        <el-select v-model="ruleForm.province" @change="proChange" placeholder="请选择省" class="name-input">
                                <el-option :label="item.label" :value="key" v-for="(item,key) in province" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                    <el-form-item label="" label-width="20px" prop="city" >
                        <el-select v-model="ruleForm.city" placeholder="请选择市" @change="citChange" class="name-input">
                            <el-option :label="item.label" :value="key" v-for="(item,key) in city" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="" label-width="20px" prop="county">
                        <el-select v-model="ruleForm.county" placeholder="请选择区" @change="countyChange" class="name-input">
                                <el-option :label="item.label" :value="key" v-for="(item,key) in  district" :key="key"></el-option>
                            </el-select>
                    </el-form-item>
                     <el-form-item label="详细地址"  prop="orgAddress">
                            <el-input v-model="ruleForm.orgAddress" style="width:730px"></el-input>
                    </el-form-item>
                </el-form>
            </div>

             <div class="pl20" v-if="BDXX">
                <ul>
                    <li class="f18 pb20">温馨提示：</li>
                    <li class="f16 pb10">电子保单具有相同的法律效力。出单成功后您可至您的邮箱或个人中心/我的保单自行下载、打印</li>
                    <el-form v-if="policyType" :label-position="labelPosition" label-width="100px"  :inline="true" :rules="rules" :model="policyType" class="demo-form-inline" ref="policyForm">
                    
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
                        <el-form-item label="接收邮箱" prop="email" v-if='policyType.type==1'>
                            <el-input v-model="policyType.email" placeholder="电子邮箱"></el-input>
                        </el-form-item>
                        
                        <el-form-item label="邮寄地址" v-if='policyType.type==2'  prop="site">
                                <el-input v-model="policyType.site" style="width:680px"></el-input>
                        </el-form-item>
                    </el-form>
                </ul>
            </div>
        </div>
</template>

<script>
import productService from '@/service/ProductService';
import {elevator} from '../../../../server/accidenServer.js'
export default {
    props:{
        labelPosition:{
            type:String,
            default:'right'
        },
        productCode:{
            type:String,
        },
        flag:{
            type:Boolean,
        },
        RYXX:{
            type:Boolean,
            default:false
        },
        BDXX:{
            type:Boolean,
            default:false
        }
    },
    data(){
        var validatePhone= (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号格式!'));
            } else {
                callback();
            }
        };
        return{
            Elevator:new elevator(),
            productService: new productService(),
            options4:[],
            province: [],
            city: [],
            district: [],
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
                orgStars:'',      // 安全等级
                orgStarsCode:'',      // 安全等级的code
                vipGradeCode:'',    // 西安的vipcode
                MemberEnterprises:'',
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
                    vipGradeCode: [
                        {required: true, message: '请选择会员等级', trigger: 'change' }
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
     mounted(){
        this.getArea();
        this.productDetalis();  
    },
 
    methods:{
        async productDetalis(){
			let res = await this.Elevator.getqiyestars();
			if (res.code == '0000') {
				this.options4 = res.list;
			}
		},
          // 获取地区
        async getArea(){
            var response = await this.productService.getArea();
            this.province = response.data;
            if(this.flag){
                this.getSession();
            }else{
                this.queryAuthentication();
            }    
           
        },
          // 获取投保人信息
		async queryAuthentication(){
				let userCode = window.localStorage.getItem('userCode')
				const params = await this.productService.queryAuthentication({'userCode': userCode, 'channelNo': 'sequip'})
                let {code,data} = params;
                
				if(code=='0000'){
                    let information = data.custOrganizationElementList
                   let applicantType = information[information.map(item => item.elementCode ).indexOf("applicantType")]  //获取"投保人性质"
                    let userType = information[information.map(item => item.elementCode ).indexOf("userType")]  //获取"用户类型"
                    let linkManName = information[information.map(item => item.elementCode ).indexOf("linkManName")]  //""联系人姓名""
                    let linkManPhone = information[information.map(item => item.elementCode ).indexOf("linkManPhone")]  //"联系人电话"
                    let linkManEmil = information[information.map(item => item.elementCode ).indexOf("linkManEmil")]  //"联系人Emil"
                    let orgStars = information[information.map(item => item.elementCode ).indexOf("orgStars")]  //"星级单位（南京）"//"会员企业（重庆）"
                    let linkManAreaCode = information[information.map(item => item.elementCode ).indexOf("linkManAreaCode")]  //"联系人地址编码"
                    let linkManDetailAddress = information[information.map(item => item.elementCode ).indexOf("linkManDetailAddress")]  // "详细联系地址"

                    this.ruleForm.applicantType=applicantType.elementValues;
                    this.ruleForm.applicantCode=applicantType.valuesCode;
                    this.ruleForm.userType=userType.elementValues;  
                    this.ruleForm.userTypeCode=userType.valuesCode;  
                    this.ruleForm.orgFullName=data.orgFullName;
                    this.ruleForm.linkManName=linkManName.elementValues;
                    this.ruleForm.linkManPhone=linkManPhone.elementValues;
                    this.ruleForm.linkManEmil=linkManEmil.elementValues;
                    if(this.productCode==this.$globalProductCode.PRODUCT_CODE_NJ){
                        if(orgStars && orgStars.valuesCode.indexOf('25') != -1){
						    this.ruleForm.orgStars=orgStars.elementValues;
                            this.ruleForm.orgStarsCode=orgStars.valuesCode;
					    }else{
                            this.ruleForm.orgStarsCode='2504';
                        }
                    }
                    if(this.productCode==this.$globalProductCode.PRODUCT_CODE_XA){
                        if(orgStars && orgStars.valuesCode.indexOf('22') != -1){
						    this.ruleForm.orgStars=orgStars.elementValues;
                            this.ruleForm.vipGradeCode=orgStars.valuesCode;
					    }else{
                            this.ruleForm.vipGradeCode='2204';
                        }
                    }
                    if(this.productCode==this.$globalProductCode.PRODUCT_CODE_CQ){
                        if(orgStars && orgStars.valuesCode.indexOf('00') != -1){
                            this.ruleForm.orgStars=orgStars.elementValues;
                            this.ruleForm.MemberEnterprises=orgStars.valuesCode;
					    }else{
                            this.ruleForm.MemberEnterprises='0002';
                        }
                    }
                    this.ruleForm.idCard=data.paperworkInfoList[0].value;
                    this.ruleForm.idCardURL=data.paperworkInfoList[0].url;
                    this.ruleForm.orgAddress=linkManDetailAddress.elementValues;

                    this.policyType.email=linkManEmil.elementValues;
                
                    let provinceCode = linkManAreaCode.elementValues.slice(0,2)+'0000';
                    let cityCode = linkManAreaCode.elementValues.slice(0,4)+'00';
                    let countyCode = linkManAreaCode.elementValues;
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
                    
                    
                    this.policyType.site=this.ruleForm.province +' '+ this.ruleForm.city+' '+ this.ruleForm.county+' '+this.ruleForm.orgAddress;
                }
                 return  this.ruleForm.applicantCode
        },
        userType(){
          return  this.ruleForm.applicantType
        },
        getSession(){
            
            const applicant =JSON.parse(window.sessionStorage.getItem('applicant'));
            const policyType =JSON.parse(window.sessionStorage.getItem('policyType'));
            this.ruleForm=applicant;
            this.province.forEach(item => {
                if(item.value==applicant.provinceCode){
                    this.ruleForm.province= item.label
                    item.children.forEach(ele=>{
                        if(ele.value==applicant.cityCode){
                            this.ruleForm.city=ele.label;
                            ele.children.forEach(val=>{
                                if(val.value==applicant.countyCode){
                                    this.ruleForm.county=val.label;
                                    return
                                }
                            })
                        }
                    })
                }       
            })
            this.policyType=policyType;
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
       
        verifyPerson(){
            let status ='9999'
             this.$refs['ruleForm'].validate(async (valid) => {
                if (valid) {
                  status=  '0000'
                } else {
                    this.$message.error('请将投保人信息填写完整');
                    return false;
                }
            });
            return status
        },
        verifyBD(){ // 校验保单信息
            let status ='9999'
            this.$refs['policyForm'].validate(async (valid) => {
                if (valid) {
                   status = '0000'
                } else {
                    this.$message.error('请将保单信息填写完整');
                    return false;
                }
            });
            return status
        },
        mergeRY(){
            window.sessionStorage.setItem('applicant',JSON.stringify(this.ruleForm))
            return this.ruleForm
        },
        mergeBD(){
           
            window.sessionStorage.setItem('policyType',JSON.stringify(this.policyType))
            return this.policyType
        },
       
    }
}
</script>

<style>
.ts-pl150{
    /* width:160px;s */
    margin-right: 131px; 
}
.ts-width{
    width: 255px;
    color: #C0C4CC;
    letter-spacing:1px;
    line-height: 1.2;

}
.ts-tle-span{
    color: #0198ef;
    font-weight: 700;
    cursor: pointer;
}
.el-tooltip__popper.is-light {

    border-color: #ccc;
}
.name-input{
    width: 200px;
}
</style>
