<template>
    <div id="fangAn" v-cloak>
        <Title title="投保产品"></Title>
        <div class="ts-insure-scheme">
            <el-form :label-position="labelPosition" label-width="80px" ref="form" :model="form" :rules="rules">
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
                <el-form-item label="产品方案">
                    <div class="mb10">
                        <span class="mr170">电梯安装工、改造工、维护工等（含高空作业人员）</span>
                        <span>办公室内勤人员</span>    
                    </div>
                    <div>
                        <el-select v-model="form.value" placeholder="请选择方案" @change="changeMain(form.value)" class="mr185">
                            <el-option
                                v-for="(item,index) in normal"
                                :key="index"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                        <el-select v-model="form.value1" placeholder="请选择方案" @change="changeMain1(form.value1)">
                            <el-option
                                v-for="(item,index) in offic"
                                :key="index"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="ts-scheme">
                        <ul v-for="(item,index) in form.mainInfo.liabilityList" :key="index">
                            <li v-for="(subItem,subIndex) in item.limitList" :key="subIndex">
                                <span class="first-span">{{subItem.name}}</span><span>{{(subItem.value/10000 ? subItem.value/10000 + '万元' : subItem.value)}}</span> 
                            </li>
                        </ul>
                    </div>
                    <div class="ts-scheme" v-if="form.mainInfo1.liabilityList.length != 0">
                        <ul v-for="(item,index) in form.mainInfo1.liabilityList" :key="index">
                            <li v-for="(subItem,subIndex) in item.limitList" :key="subIndex">
                                <span class="first-span">{{subItem.name}}</span><span>{{(subItem.value/10000 ? subItem.value/10000 + '万元' : subItem.value)}}</span> 
                            </li>
                        </ul>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-checkbox label="24小时意外险特别扩展条款" disabled v-model="checked2"></el-checkbox>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import Title from '../Title';
import moment from 'moment'
import UserService from '@/service/UserService';
import productService from '@/service/ProductService'
export default {
    props: {
        compRisk:{
            type: Object,
            required:true
        }
    },
    components: {
        Title
    },
    data() {
        return {
            labelPosition: 'left',
            mainRisk:[],    //主险
            subRisk:[],     //附加险
            form: {
                productCode:'',
                detalis: {},
                value:'',
                value1:'',
                startDate: '',
                endDate: '',
                mainInfo: {
                    liabilityList:[]
                },
                mainInfo1: {
                    liabilityList:[]
                },
                productDetali:{}
            },
            UserService: new UserService(),
            productService: new productService(),
            rules: {
                value: [
                    { required: true, message: '请选择方案', trigger: 'change' },
                ],
                value1: [
                    { required: true, message: '请选择方案', trigger: 'change' },
                ],
                startDate: [
                    { type: 'string', required: true, message: '请选择开始时间', trigger: 'change' }
                ],
            },
            startDatePicker:this.beginDate(),
            checked2:true,
            searchRule:[],
            searchRiskCode:'',
            normal:[],
            offic:[],
            unifiedCode:''
        }
    },
    created() {
        this.$nextTick(function () {
            if(JSON.stringify(this.compRisk) != '{}') {
                this.form.productCode = this.compRisk.productCode;
            } else {
                this.form.productCode = window.sessionStorage.getItem('Gucode');
            }
            this.productDetalis(this.form.productCode);
            this.productDisplay(this.form.productCode)
        }) 
    },
    methods: {
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
        changeMain1(val) {
            this.form.mainInfo1 =  this.mainRisk[this.mainRisk.map(item=>item.code).indexOf(val)];
        },
        // 获取产品元素
        async productDisplay(productCode){
            const params = await this.productService.productDisplay(productCode)
            let {code,data} = params
            if(code=='0000'){
                this.productCode = data.productCode
                this.productDetali = data
                for(let i = 0; i < data.list.length; i ++) {
                    if(data.list[i].prodType == 'rule') {
                        this.searchRule = data.list[i].list;
                        this.searchRiskCode = data.list[i].riskCode;
                        this.unifiedCode = data.list[i].unifiedCode;
                    } 
                }
                this.orgData();
            } 
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
            }
        },
        orgData() {
            for(let i = 0; i < this.searchRule.length; i ++) {
                let parsms = {
                    "list": [
                        {
                        "list": [
                            {
                                "code": this.unifiedCode,
                                "ruleType": "01",
                                "value": this.searchRule[i].value
                                }
                            ],
                            "riskCode": this.searchRiskCode
                        }
                    ],
                    "productCode": this.form.productCode
                }
                if(this.searchRule[i].code == '5$officCrowd$') {
                    this.searchRiskData(parsms,"offic")
                } else if(this.searchRule[i].code == '5$normalCrowd$') {
                    this.searchRiskData(parsms,"normal")
                }
            }
        },
        async searchRiskData(parsms,dataName) {
            let res = await this.productService.getProgram(parsms); 
            if(res.code == '0000') {
                let data = [];
                for(let i = 0; i < res.list[0].list.length; i ++) {
                    let obj = res.list[0].list[i];
                    data[obj.sort - 1] = obj;
                }
                this[dataName] = data;
            }
        },
        getRisk() {
            let returnObj = {};
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if(this.form.value || this.form.value1) {
                        returnObj = this.form;
                    } else {
                        this.$message({
                            message: '请选择投保方案！！',
                            type: 'warning'
                        });
                    }
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
                    return time.getTime() < Date.now() 
                }
            }
        },
        getRiskNoVal() {
            return this.form;
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
            width: 485px;
            background-color: #f6fbfe;
            display: inline-block;
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
        .first-span {
            display: inline-block;
            width: 40%;
        }
        .el-select,.el-date-editor {
            width: 301px;
        }
        .pl78 {
            margin-top: 5px;
            padding-left: 78px;
        }
        .mr170 {
            margin-right: 170px;
        }
        .mr185 {
            margin-right: 185px;
        }

    }
    [v-cloak] {
        display: none;
    }
</style>


