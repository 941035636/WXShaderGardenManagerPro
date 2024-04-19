<template>
    <div id="policyInfo">
        <!-- 保单信息 -->
        <Title title="保单信息"></Title>
        <div class="ml70 pb20 pt20">
            <ul>
                <li class="f14 pb20 f700">温馨提示：</li>
                <li class="f14 pb10 mb20">电子保单具有相同法律效力。出单成功后您可至您的邮箱或个人中心/我的保单自行下载、打印</li>
                <el-form :label-position="labelPosition" label-width="100px"  :inline="true" ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-form-inline">
                    <el-form-item label="保单类型" prop="value1">
                        <el-select v-model="ruleForm.value1" placeholder="请选择保单类型">
                            <el-option
                                v-for="(item,key) in options"
                                :key="key"
                                :label="item.value"
                                :value="item.type">
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <span class="pl120"></span>
                    <el-form-item label="接收邮箱" prop="linkManEmil">
                        <el-input v-model="ruleForm.linkManEmil" placeholder="请输入接收邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="邮寄地址" prop="orgAddress" v-if="ruleForm.value1 == '01'">
                        <el-input clearable v-model="ruleForm.orgAddress" style="width:885px"></el-input>
                    </el-form-item>
                </el-form>
            </ul>
        </div>
        <!-- 发票信息 -->
        <Title title="发票信息"></Title>
        <div class="pt10 pb30">
            <p class="ml70">您可在支付完成后前往 <span class="col-black" @click="goToMyPolicy">个人中心-我的订单/我的保单</span> 申请开发票</p>
        </div>
    </div>
</template>
<script>
import Title from '../Title';
import UserService from '@/service/UserService';
import productService from '@/service/ProductService'
import areaList from '@/assets/js/area.js';
export default {
    components: {
        Title
    },
    props: {
        ruleForms:{
            type: Object,
            required:true
        }
    },
    data() {
        return {
            labelPosition: 'right',
            areaList:areaList,
            ruleForm: {
                orgAddress: '', 
                linkManEmil: '',
                value1: '',
            },
            formLabelAlign: {
                name: '',
                region: '',
                type: ''
            },
            options:[
                {
                    type:'00',
                    value:'电子保单',
                },
                {
                    type:'01',
                    value:'纸质保单',
                },
            ],
            province: [],
            city: [],
            district: [],
            UserService: new UserService(),
            productService: new productService(),
            rules:{
                value1: [
                    { required: true, message: '请选择保单类型', trigger: 'change' },
                ],
                linkManEmil: [
                    { type: 'email', required: true, message: '请输入接收邮箱', trigger: 'blur' }
                ],
                orgAddress: [
                    { required: true, message: '请输入邮寄地址', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.ruleForm = this.ruleForms;
    },
    methods: {
        goToMyPolicy() {
            this.$router.push('/usercenter/myinsurancepolicy');
        },
        getPolicyInfo() {
            let returnObj = {};
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    returnObj = this.ruleForm;
                } else {
                    this.$message({
                        message: '保单信息填写不完整！！',
                        type: 'warning'
                    });
                    return false;
                }
            });
            return returnObj;
        },
        getPolicyInfoNoVal() {
            return this.ruleForm;
        }
    }
}
</script>
<style lang="less" scoped>
    #policyInfo {
        .ml70 {
            margin-left: 70px;
            .col-black {
                color: #101010;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
            }
        }
        .f700 {
            font-weight: 700;
        }
        .pl160{
            padding-left: 160px;
        }
        .pl120 {
            padding-left: 120px;
        }
        .el-select {
            width: 301px;
        }
        .el-input {
            width: 350px;
        }
    }
</style>


