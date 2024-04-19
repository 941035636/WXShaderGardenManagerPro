<template>
    <div id="policyHolder">
        <!-- 投保人信息 -->
        <Title title="投保人信息"></Title>
        <div class="ts-insure-scheme">
            <el-form :label-position="labelPosition" label-width="110px" ref="ruleForm"  :inline="true" :model="ruleForm" class="demo-form-inline" :rules="formRules">
                <el-form-item label="投保企业名称" prop="orgFullName">
                    <el-input v-model="ruleForm.orgFullName" disabled></el-input>
                </el-form-item>
                <span class="pl110"></span>
                <el-form-item label="证件号码" prop="codeNum">
                    <el-input v-model="ruleForm.codeNum" disabled></el-input>
                </el-form-item>

                <el-form-item label="经营范围" prop="businessScope">
                    <el-input clearable v-model="ruleForm.businessScope" disabled placeholder="经营范围"></el-input>
                </el-form-item>
                <span class="pl110"></span>
                <el-form-item label="联系人" prop="linkManName">
                    <el-input clearable v-model="ruleForm.linkManName" placeholder="联系人"></el-input>
                </el-form-item>
                
                <el-form-item label="联系电话" prop="linkManPhone">
                    <el-input clearable v-model="ruleForm.linkManPhone" placeholder="联系人电话"></el-input>
                </el-form-item>
                <span class="pl110"></span>
                <el-form-item label="电子邮箱" prop="linkManEmil">
                    <el-input clearable v-model="ruleForm.linkManEmil" placeholder="电子邮箱"></el-input>
                </el-form-item>
                    <br>
                <el-form-item label="联系地址" label-width="110px" prop="province" >
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
                    <el-select v-model="ruleForm.county" placeholder="请选择区">
                        <!-- <el-option :label="item.label" :value="key" v-for="(item,key) in  province[proIndex].children[cityIndex].children" :key="key"></el-option> -->
                        <el-option :label="item.label" :value="key" v-for="(item,key) in  district" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="orgAddress" class="ml110">
                    <el-input clearable v-model="ruleForm.orgAddress" style="width:934px"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import Title from '../Title';
import areaList from '@/assets/js/area.js';
import UserService from '@/service/UserService';
import productService from '@/service/ProductService'
export default {
    props: {
        ruleForms:{
            type: Object,
            required:true
        }
    },
    components: {
        Title
    },
    mounted() {
        this.ruleForm = this.ruleForms ? this.ruleForms:{};
        console.log(this.ruleForm);
    },
    data() {
        var validatePhone= (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!/^(1[3-8][0-9]{9})$/i.test(value)) {
                callback(new Error('请输入正确的手机号格式!'));
            } else {
                callback();
            }
        };
        return {
            UserService: new UserService(),
            productService: new productService(),
            labelPosition: 'left',
            ruleForm:{      // 投保人信息
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
                businessScope: ''
            },
            formRules:{
                codeNum: [
                    { required: true, message: '请输入证件号码', trigger: 'blur' }
                ],
                orgFullName: [
                    {  required: true, message: '请输入投保人名称', trigger: 'blur' }
                ],
                linkManName: [
                    {  required: true, message: '请输入联系人', trigger: 'blur' }
                ],
                linkManPhone: [
                    {  validator: validatePhone,required: true, trigger: 'blur' }
                ],
                linkManEmil: [
                    { type:'email', required: true, message: '请输入电子邮箱', trigger: 'blur' }
                ],
                province: [
                    { required: true, message: '请选择省', trigger: 'change' }
                ],
                city: [
                    { required: true, message: '请选择市', trigger: 'change' }
                ],
                county: [
                    { required: true, message: '请选择区', trigger: 'change' }
                ],
                orgAddress: [
                    { required: true, message: '请选择地址', trigger: 'blur' }
                ],
                businessScope: [
                    { required: true, message: '请填写经营范围', trigger: 'blur' }
                ] 
            },
            province: [],
            city: [],
            district: [],
        }
    },
    created(){
        this.getArea(); 
    },
    methods: {
        async getArea(){
            var response = await this.UserService.getArea();
            this.province = response.data;
        },
        goToUserCenter() {
            this.$router.push('/userCenter/profile');
        },
        proChange(e) {
            this.city = this.province[e].children;
            this.ruleForm.province= this.province[e].label
            this.ruleForm.provinceCode= this.province[e].value
        },
        citChange(e) {
            this.district = this.city[e].children;
            this.ruleForm.city= this.city[e].label 
            this.ruleForm.cityCode= this.city[e].value
        },
        countyChange(e) {
            this.ruleForm.county= this.district[e].label 
            this.ruleForm.countyCode= this.district[e].value
        },
        getPolicyHolder() {
            let returnObj = {};
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    returnObj = this.ruleForm;
                } else {
                    this.$message({
                        message: '投保人信息填写不完整！！',
                        type: 'warning'
                    });
                    return false;
                }
            });
            return returnObj;
        },
        getPolicyHolderNoVal() {
            return this.ruleForm;
        }
    }
}
</script>
<style lang="less" scoped>
    #policyHolder {
        .ts-insure-scheme{
            padding-left: 70px;
            padding-right: 70px;
            .el-form-item {
                .el-input {
                    width: 350px;
                }
            }
            .pl110 {
                padding-left: 110px;
            }
            .el-select {
                width: 302px;
            }
            .ml110 {
                margin-left: 110px;
            }
        }
        .tip-text {
            margin: 0 100px 20px;
            span {
                color: #0198ef;
                font-weight: 700;
                cursor: pointer;
            }
        }
    }
</style>


