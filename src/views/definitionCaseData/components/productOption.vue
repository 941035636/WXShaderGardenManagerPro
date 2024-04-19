<template>
    <div>
        <!-- 选择产品组件 -->
        <el-dialog title="选择产品" :visible.sync="productOptionShow" width="600px">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="产品选择：" prop="product">
                    <el-select v-model="ruleForm.product" filterable remote :loading="loading" @change="change"
                        :remote-method="remoteMethod" placeholder="请选择产品">
                        <el-option v-for="item in productList" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="保险公司：" prop="company" v-if="!flexibleShow">
                    <el-select v-model="ruleForm.company" filterable placeholder="请选择保险公司" no-data-text="请先选择保险公司">
                        <el-option v-for="(item, index) in inusureCompanyList" :key="index" :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="保险公司：" prop="company" v-if="flexibleShow">
                    <el-select v-model="ruleForm.company" filterable remote :remote-method="getInusureCompanyList" placeholder="请选择保险公司" no-data-text="请先选择保险公司">
                        <el-option v-for="(item, index) in inusureCompanyList" :key="index" :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="unifyBut">
                <div></div>
                <div class="butBoxClass">
                    <div class="unifyButCancel" @click="() => productOptionShow = false">取消</div>
                    <div class="unifyButAffirm" @click="notarize">确认提交</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import policyentryService from "@/service/PolicyentryService";
import ProductService from '@/service/ProductService.js';
import UserService from '@/service/UserService';
import CaseService from '@/service/CaseService.js';

export default {
    data() {
        return {
            policyentryService: new policyentryService(),
            ProductService: new ProductService(),
            UserService: new UserService(),
            caseService: new CaseService(),
            productOptionShow: false,//控制产品选择弹窗的显示隐藏
            ruleForm: {
                product: '',
                company: '',
            },
            rules: {
                product: [
                    { required: true, message: '请选择产品', trigger: 'change' }
                ],
                company: [
                    { required: true, message: '请选择保险公司', trigger: 'change' }
                ]
            },
            productList: [],
            loading: false,
            inusureCompanyList: [],
            flexibleShow:false,
        }
    },
    methods: {
        getInusureCompanyList(e){
            this.getCompanyList(e);
        },
        //查询所有保险公司
        async getCompanyList(e){
            if (e !== "") {
                let data = {
                    conditions:{
                        name:e
                    },
                    paging:{
                        pn:1,
                        ps:1000
                    }
                }
                let res = await this.policyentryService.getCompanyList(data);
                if (res.code == "0000") {
                    if (res.list.length == 0) {
                        this.$message.error("查询不到保险公司！");
                    }else{
                        this.inusureCompanyList = res.list;
                    }
                }
            }else{
                this.inusureCompanyList = [];
            }
        },
        remoteMethod(query) {
            this.loading = true;
            if (query) {
                this.getProductList(query);
            }
        },
        async getProductList(query) { // 获取产品列表
            let data = {
                // 'areaCodeList':provinceCode,
                'channel': 'sequip',
                'pn': 1,
                'ps': 1000,
                'upOrDown': "0",
                'productName': query
            };
            let res = await this.ProductService.getProductListV3(data);
            if (res.code == '0000' && res.list) {
                this.productList = res.list;
                this.loading = false;
            }
        },
        openClick() {
            this.productOptionShow = true;
        },
        notarize() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.submit()
                }
            })
        },
        async submit() {
            let productItem = {};
            let inusureCompanyItem = {};
            this.productList.forEach(_item => {
                if (_item.code == this.ruleForm.product) {
                    productItem = {
                        name: _item.name,
                        code: _item.code
                    }
                }
            });
            this.inusureCompanyList.forEach(_i => {
                if (_i.code == this.ruleForm.company) {
                    inusureCompanyItem = {
                        name: _i.name,
                        code: _i.code
                    }
                }
            });
            let res = await this.caseService.existConfig(inusureCompanyItem.name, productItem.code);//（保险产品编号+保险公司编号）保险产品编号+保险公司编号
            if (res.code === '0000') {
                if (res.data) {
                    this.$message.error('当前产品已存在');
                } else {
                    let row = {
                        productItem: productItem,
                        inusureCompanyItem: inusureCompanyItem
                    };
                    let paramsata = JSON.stringify(row);
                    this.productOptionShow = false;
                    this.$router.push({
                        path: '/case/newly/datum',
                        query: { paramsata: paramsata },
                    })
                }
            }


        },
        change(e) {
            this.inusureCompanyList = [];
            this.ruleForm.company = '';
            if(e == '23PR797905' || e == '23PR873651'){
                console.log('灵活版的时候走这里');
                this.flexibleShow = true;
            }else{
                this.flexibleShow = false;
                this.productDetalis(e);
            }
        },
        async productDetalis(productCode) {
            const res = await this.UserService.productDetalis(productCode);
            if (res.code === '0000') {
                res.data.inusureCompanyList.forEach(_item => {
                    if (_item.partyRole == '2' && _item.insuringType == 'Y') {
                        this.inusureCompanyList.push(_item);
                    }
                })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.el-select {
    width: 300px;
}
</style>