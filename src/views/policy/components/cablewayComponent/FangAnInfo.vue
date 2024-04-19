<template>
    <div id="fangAn">
        <Title title="产品方案"></Title>
        <div class="ts-insure-scheme">
            <el-form :label-position="labelPosition" label-width="80px" ref="form" :model="form" :rules="rules">
                <el-form-item label="基本险" prop="value">
                    {{form.productName}}
                </el-form-item>
                <el-form-item label="选择日期" prop="startDate">
                        <el-date-picker
                        v-model="form.startDate"
                        @change="setTimer()"
                        type="date"
                        :picker-options="startDatePicker"
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
                </el-form-item>
                 <div class="pl78 mb20">
                    <img src="../../../../assets/images/slider/i-01.png" alt="">
                    <span style="color:#c88b5f">投保单实际支付日期等于或晚于您选择的保险起期时，我们将按照 按实际支付日期 + 1 作为您的保险起期</span>
                </div>
            </el-form>
            <el-button type="warning" size="medium" @click="chooseEquip" class="mb20">选择投保设备</el-button>
            <CablewayInfo ref="CablewayInfo"></CablewayInfo>
            <div class="equip-info mb20 mt10">
                <el-form ref="form" :model="cablewayForm" label-width="110px">
                    <el-form-item label="索道名称">
                        {{cablewayForm.name}}
                    </el-form-item>
                    <el-form-item label="索道类型">
                        <el-radio v-model="radio" label="1">往复式</el-radio>
                        <el-radio v-model="radio" label="2">固定抱索式</el-radio>
                        <el-radio v-model="radio" label="3">脱挂式</el-radio>
                        <el-radio v-model="radio" label="4">其他</el-radio>
                    </el-form-item>
                    <el-form-item label="上年度运送乘客人次（万）">
                        <el-radio v-model="radio" label="1">10万以下</el-radio>
                        <el-radio v-model="radio" label="2">10万(含)-50万</el-radio>
                        <el-radio v-model="radio" label="3">50万(含)-100万</el-radio>
                        <el-radio v-model="radio" label="4">100万及以上</el-radio>
                    </el-form-item>
                    <el-form-item label="5S评级信息">
                        <el-select v-model="cablewayForm.start" placeholder="请选择5S评级信息">
                            <el-option label="五级" value="1"></el-option>
                            <el-option label="四级" value="2"></el-option>
                            <el-option label="三级" value="3"></el-option>
                            <el-option label="二级" value="4"></el-option>
                            <el-option label="一级" value="5"></el-option>
                            <el-option label="为参与评级" value="6"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="最近三年出现情况（元）">
                        <el-checkbox v-model="checked1">无</el-checkbox>
                        <el-checkbox v-model="checked2">有</el-checkbox>
                        <div class="ts-scheme">
                            <ul>
                                <li>
                                    <span>2018年度赔偿总额</span><span class="mr30">0.00</span> 
                                </li>
                                <li>
                                    <span>2017年度赔偿总额</span><span class="mr30">100000000.00</span> 
                                </li>
                                <li> 
                                    <span>2016年度赔偿总额</span><span class="mr30">3000000.00</span> 
                                </li>
                            </ul>
                        </div>
                    </el-form-item>
                    <el-form-item label="客运索道安全检验合格证编号或监督检验报告编号">
                        <el-input type="input" v-model="cablewayForm.safeNum"></el-input>
                    </el-form-item>
                    <el-form-item label="客运索道安全检验合格证或监督检验报告有效期限">
                        <el-date-picker v-model="value6" type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="特种设备使用标志影印件">
                        <span class="mr30">查看</span>
                        <el-upload
                            class="upload-demo "
                            action="#"
                            :http-request="uploadFile"
                            :show-file-list='false'
                            accept=".doc , .docx , .ppt , .pptx , .pdf , .rar , .zip , .xlsx , .xls , .jpg , .jpeg , .png , .gif , .svg">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="客运索道设备代码">
                        <el-input type="input" v-model="cablewayForm.regNum"></el-input>
                    </el-form-item>
                    <el-form-item label="设备使用登记证影印件">
                        <span class="mr30">查看</span>
                        <el-upload
                            class="upload-demo "
                            action="#"
                            :http-request="uploadFile"
                            :show-file-list='false'
                            accept=".doc , .docx , .ppt , .pptx , .pdf , .rar , .zip , .xlsx , .xls , .jpg , .jpeg , .png , .gif , .svg">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="基本险" prop="value">
                        <el-select v-model="form.value" placeholder="请选择基本险" @change="changeMain(form.value)">
                            <el-option
                                v-for="(item,index) in mainRisk"
                                :key="index"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                        <div class="ts-scheme" v-if="form.mainInfo.liabilityList.length != 0">
                            <ul v-for="(item,index) in form.mainInfo.liabilityList" :key="index">
                                <li v-for="(subItem,subIndex) in item.limitList" :key="subIndex">
                                    <span>{{subItem.name}}</span><span class="mr30">{{subItem.value/10000}}万元</span> 
                                </li>
                            </ul>
                        </div>
                    </el-form-item>
                    <el-form-item label="附加险">
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
        </div>  
    </div>
</template>
<script>
import Title from '../Title';
import moment from 'moment'
import UserService from '@/service/UserService';
import CablewayInfo from './CablewayInfo'
export default {
    props: {
        compRisk:{
            type: Object,
            required:true
        }
    },
    components: {
        Title,CablewayInfo
    },
    data() {
        return {
            labelPosition: 'left',
            mainRisk:[],    //主险
            subRisk:[],     //附加险
            form: {
                productCode: '19PR218852',
                detalis: {},
                value:'',
                startDate: '',
                endDate: '',
                mainInfo: {
                    liabilityList:[]
                },
            },
            UserService: new UserService(),
            rules: {
                value: [
                    { required: true, message: '请选择基本险', trigger: 'change' },
                ],
                startDate: [
                    { type: 'string', required: true, message: '请选择开始时间', trigger: 'change' }
                ],
            },
            startDatePicker:this.beginDate(),
            cablewayForm: {
                name: '',
                region: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                region: [
                    { required: true, message: '请选择活动区域', trigger: 'change' }
                ],
                date1: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                date2: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],
                type: [
                    { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                ],
                resource: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请填写活动形式', trigger: 'blur' }
                ]
            },
            radio:'0',
            checked1:false,
            checked2: true,
            value6: '',
            checkListA: [],
            liabilityListA:[]
        }
    },
    created() {
        if(JSON.stringify(this.compRisk) != '{}') {
            this.form = this.compRisk;
        }
        this.productDetalis(this.form.productCode);
    },
    methods: {
        uploadFile() {

        },
        setTimer(){
            let start = new Date(this.form.startDate);
            let yearFull = start.getFullYear() + 1;
            let mouthFull = start.getMonth() + 1;
            let dayFull = start.getDate();
            this.form.endDate = moment(new Date(yearFull + '-' + mouthFull + '-' + dayFull) - 24*60*60).format('YYYY-MM-DD 23:59:59'); 
            this.form.startDate =	moment(this.form.startDate).format('YYYY-MM-DD 00:00:00');
        },
        changeMain(val) {
            this.form.mainInfo =  this.mainRisk[this.mainRisk.map(item=>item.code).indexOf(val)];
        },
        async productDetalis(productCode){
            const params = await this.UserService.productDetalis(productCode)
            let {code,data} = params
            
            if(code=='0000'){
                this.form.detalis = data
                for(var i = 0; i < data.programList.length; i ++) {
                    let obj = data.programList[i];
                    obj.name = obj.liabilityList[0].riskName;
                    if(obj.riskFlag == 'M') {
                        this.mainRisk.push(obj);
                        // this.riskCode = obj.code;
                    } else if(obj.riskFlag == 'A') {
                        this.subRisk.push(obj);
                    }
                }
                this.form.programList = data.programList	
                this.form.productName = data.name
                console.log(this.subRisk);
            }
        },
        getRisk() {
            let returnObj = {};
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    returnObj = this.form;
                } else {
                    this.$message({
                        message: '投保方案填写不完整！！',
                        type: 'warning'
                    });
                    return false;
                }
            });
            return returnObj;
        },
        beginDate(){
            let self = this
            return {
                disabledDate(time){
                    return time.getTime()  < Date.now() + 24*60*60*1000
                }
            }
        },
        getRiskNoVal() {
            return this.form;
        },
        chooseEquip() {
            this.$refs.CablewayInfo.flagTrue();
        }
    }
}
</script>
<style lang="less" scoped>
    #fangAn {
        .ts-insure-scheme{
            padding-left: 70px;
            padding-right: 70px; 
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
        .el-select,.el-date-editor {
            width: 301px;
        }
        .pl78 {
            margin-top: 5px;
            padding-left: 78px;
        }
        .el-button {
            background-color: #d2a55b;
            border-color: #d2a55b;
        }
        .equip-info {
            border: 1px dotted #d2a55b;
            padding: 10px 20px;
        }
        .mr30 {
            margin-right: 30px;
        }
        .upload-demo  {
            display: inline-block;
        }

    }
</style>


