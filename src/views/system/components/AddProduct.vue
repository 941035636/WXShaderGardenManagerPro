<template>
    <el-dialog title="添加产品" width="50%" :visible.sync="dialogTableVisible"  @close="close" destroy-on-close :close-on-click-modal="false">
        <div>
            <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="150px">
                <span class="title-style mb10">产品信息：</span>
                <el-form-item label="产品状态：" prop="state">
                    <el-switch
                        v-model="dialogForm.state"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="1"
                        :inactive-value="0"
                        active-text="上架"
                        inactive-text="下架">
                    </el-switch>
                </el-form-item>
                <el-form-item label="产品选择：" prop="productCode">
                    <el-select v-model="dialogForm.productTypeCode" @change="(e)=>changeSetData(e,'productTypeName')" placeholder="请选择" size="small" clearable class="w280" filterable :disabled="disablePro">
                        <el-option v-for="(item,index) in productCategory" :key="index" :label="item.value" :value="item.label"></el-option>
                    </el-select>
                    <!-- <el-radio-group v-model="dialogForm.productTypeCode" @change="(e)=>changeSetData(e,'productTypeName')" :disabled="disablePro">
                        <el-radio v-for="(item, key) in productCategory" :key="key" border :label="item.label" class="el_radio">{{item.value}}</el-radio>
                    </el-radio-group>
                    <br> -->
                    <el-select v-model="dialogForm.productCode" @change="(e)=>changeSetData(e,'productName')" placeholder="请选择" size="small" clearable class="w280" filterable :disabled="disablePro">
                        <el-option v-for="(item,index) in currentProdList" :key="index" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                    <!-- <p v-if="disablePro">{{dialogForm.productTypeName}} / {{dialogForm.productName}}</p> -->
                    <!-- <br> -->
                    <p class="col-blue" v-if="dialogForm.productCode">
                        <i class="el-icon-warning"></i>
                        <span>产品编码：{{dialogForm.productCode}}</span>
                    </p>
                </el-form-item>
                 <el-form-item label="产品类型：" prop="productType">
                    <el-select v-model="dialogForm.productType" placeholder="请选择"  size="small" clearable @change="changeProType">
                        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上架时间：" prop="addTime">
                    <el-date-picker
                        v-model="dialogForm.addTime"
                        size="small"
                        type="datetime"
                        class="w280"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>

                <span class="title-style mb10">销售信息：（行业分类、出单公司：为保险超市列表筛选条件）</span>
                <el-row>
                    <el-col :span="9">
                        <el-form-item label="行业分类：" prop="tradeCategory1">
                            <el-select v-model="dialogForm.tradeCategory1" @change="chooseFirstCate" placeholder="请选择"  size="small" clearable >
                                <el-option v-for="item in hYCategory" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="tradeCategory2" label-width="0px" style="margin-left:10px;">
                            <el-select v-model="dialogForm.tradeCategory2" placeholder="请选择"  size="small" clearable>
                                <el-option v-for="item in hYCategory2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="9">
                        <el-form-item label="出单公司（总）：" prop="issueCompany">
                            <el-select v-model="dialogForm.issueCompany" placeholder="请选择"  size="small" clearable>
                                <el-option v-for="item in companyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="权重值：" prop="weight">
                            <el-input v-model.trim="dialogForm.weight" style="width:70%" type="number" placeholder="请输入权重值（从高到底排序）" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="标的类型：" prop="insSubjectType">
                    <el-select v-model="dialogForm.insSubjectType" placeholder="请选择"  size="small" clearable>
                        <el-option v-for="item in insSubjectArr" :key="item.label" :label="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <span class="title-style mb10">业务信息：</span>

                <el-row>
                    <el-col :span="9">
                        <el-form-item label="业务类型：" prop="internet" >
                            <el-select v-model="dialogForm.internet" placeholder="请选择"  size="small" clearable >
                                <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item  prop="businessType" label-width="0px" style="margin-left:10px;">
                            <el-select v-model="dialogForm.businessType" placeholder="请选择"  size="small" clearable @change="checkFlag">
                                <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="业务归属：" prop="branchCode">
                            <el-select class="w280" v-model="dialogForm.branchCode" @change="(e)=>changeSetData(e,'branchName')" placeholder="请选择" size="small" clearable filterable>
                                <el-option v-for="(item,index) in branchList" :key="index" :label="item.jtBranchName+'(' + item.jtBranchCode +')'" :value="item.jtBranchCode"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="业务地区：" prop="selectedOptions">
                            <span v-if="dialogForm.productType == 1">全国</span>
                            <el-cascader v-else
                                v-model="dialogForm.selectedOptions"
                                class="w280"
                                size="small"
                                :options="areaList"
                                placeholder="请选择区域"
                                :props="{ checkStrictly: true }"
                                @change="(e)=>changeSetData(e,'area')"
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                     <el-col :span="24">
                        <el-form-item label="业务终端：" prop="bizEndpoint">
                            <el-checkbox-group v-model="dialogForm.bizEndpoint" @change="checkFlag">
                                <el-checkbox label="PC端" name="1"></el-checkbox>
                                <el-checkbox label="电梯智保" name="2"></el-checkbox>
                                <el-checkbox label="管理后台" name="3"></el-checkbox>
                            </el-checkbox-group>
                            <p class="col-red" v-if="showTip"><i class="el-icon-warning mr10"></i>为“线下传统业务”时，勾选“PC端、电梯智保”需设置线下营销提示信息。</p>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <span class="title-style mb10">其他：</span>
                <el-form-item label="结算类型：" prop="settlementType">
                    <el-radio-group v-model="dialogForm.settlementType">
                        <el-radio label="总部统一结算"></el-radio>
                        <el-radio label="按服务机构进行结算"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="标签：">
                    <el-input v-model.trim="labelValue" maxlength="8" style="width:50%" placeholder="产品标签，回车添加标签" size="small" clearable  @keyup.enter.native="addLabel"></el-input>
                    <div class="add-label-box">
                        <span class="add-label-btn" @click="addLabel">添加</span>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="label-box">
                        <p class="label-box-item" v-for="(item,index) in dialogForm.tags" :key="index+item">
                            <span>{{item}}</span>
                            <i class="el-icon-circle-close" style="cursor: pointer;margin-left:6px" @click="removeLabel(index)"></i>
                        </p>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button round size="medium" type="info" @click="close">取 消</el-button>
            <el-button type="warning" size="medium" round @click="submit">确认提交</el-button>
        </span>
    </el-dialog>
</template>

<script>
import ProductConfig from '@/service/ProductConfig'
import selectData from '../../../../static/data/channel.json'
export default {
    name: "AddProduct",
    props: {
        productList: {
            type: Array,
            required: true,
            default: () => {
                return []
            } 
        },
        branchList: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        },
        areaList: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        },
    },
    data() {
        var validAmount=(rule,value,callback)=>{
            let reg = /^[1-9]+\d*(\.\d{0,2})?$|^0?\.\d{0,2}$/;
            if(value<1000 && value>0) {
                callback(); 
            } else {
                callback(new Error('权重为1--1000以内的数字'))
            }
            
        };
        return {
            productConfig: new ProductConfig(),
            dialogTableVisible: false,
            productCategory:[
                {
                    label: 'dt',
                    value: '电梯责任险',
                },
                {
                    label: 'gz',
                    value: '雇主责任险',
                },
                {
                    label: 'ty',
                    value: '团体意外险',
                },
                {
                    label: 'sd',
                    value: '索道责任险',
                },
                {
                    label: 'wy',
                    value: '物业责任险',
                },
                {
                    label: 'jz',
                    value: '家政责任险',
                },
                {
                    label: 'ab',
                    value: '保安责任险',
                },
                {
                    label: 'yjsp',
                    value: '商铺责任险',
                },
                {
                    label: 'qzjx',
                    value: '起重机械综合保险',
                },
                {
                    label: 'zy',
                    value: '职业责任险',
                },
                {
                    label: 'tzsbzrx',
                    value: '特种设备责任险',
                },
                {
                    label: 'jc',
                    value: '家财险',
                },
                {
                    label: 'qp',
                    value: '气瓶险',
                },
            ],
            insSubjectArr:[
                {
                    label: '1',
                    value: '电梯',
                },
                {
                    label: '2',
                    value: '人员',
                },
                {
                    label: '3',
                    value: '索道',
                },
                {
                    label: '4',
                    value: '物业',
                },
                {
                    label: '5',
                    value: '商铺',
                },
                {
                    label: '6',
                    value: '项目',
                },
                {
                    label: '99',
                    value: '无',
                },
            ],
            hYCategory:selectData.hYCategory,
            companyList:selectData.companyList,
            hYCategory2:[],
            currentProdList:[],
            radio:'',
            dialogForm: {
                "branchCode": "", // 分支机构编码
                "branchName": "", // 支机构名称
                "businessType": "",   // 业务类型：1.线上出单 2.线下业务
                "cityCode": "",   // 市编码
                "cityName": "",   // 市名称
                "countryCode": "",    // 区编码
                "countryName": "",    // 区名称
                "createrCode": "",    // 创建人编码
                "createrName": "",    // 创建人名称
                "id": "", // 
                "productCode": "",    // 产品编码 
                "productName": "",    // 产品名称
                "productTypeCode": "",    // 产品大类编码：dt sd gz ty wy jz 
                "productTypeName": "",    // 产品大类名称：电梯 索道 雇主 团意 物业 家政
                "provinceCode": "",   // 省编码
                "provinceName": "",   // 省名称
                "state": "",  // 状态：1.正常 0.无效 
                "updaterCode": "",    //  更新人编码
                "updaterName": "", // 更新人名称
                "selectedOptions":[],
                "internet":"",
                "productType":"",
                "addTime": "",
                "tradeCategory1": "",
                "tradeCategory2": "",
                "issueCompany": "",
                "weight": "",
                "tags": [],
                "insSubjectType":"",
                "bizEndpoint":[],
                "settlementType":"",
            }, //dialog表单
            labelValue:'',
            rules:{
                productCode:[{required: true, message: '请选择产品', trigger: 'change'}],
                branchCode:[{required: true, message: '请选择分支机构', trigger: 'change'}],
                selectedOptions:[{required: true, message: '请选择业务地区', trigger: 'change'}],
                businessType:[{required: true, message: '请选择业务类型', trigger: 'change'}],
                status:[{required: true, message: '请选择产品状态', trigger: 'change'}],
                internet:[{required: true, message: '请选择业务类型', trigger: 'change'}],
                productType:[{required: true, message: '请选择产品类型', trigger: 'change'}],
                tradeCategory2:[{required: true, message: '请选择行业', trigger: 'change'}],
                tradeCategory1:[{required: true, message: '请选择行业', trigger: 'change'}],
                issueCompany:[{required: true, message: '请选择出单公司', trigger: 'change'}],
                weight:[{required: true, message: '请输入权重值', trigger: 'blur'},
                {validator:validAmount,}],
                addTime:[{required: true, message: '请选择上架时间', trigger: 'change'}],
                insSubjectType:[{required: true, message: '请选择标的类型', trigger: 'change'}],
                bizEndpoint:[{required: true, message: '请选择业务终端', trigger: 'change'}],
                settlementType:[{required: true, message: '请选择结算类型', trigger: 'change'}],
            },
            options1:[
				{
					value:1,
					label:'线上出单'
				},
				{
					value:2,
					label:'线下出单'
				},
				{
					value:3,
					label:'线下传统业务'
				},
			],
            options2:[
				{
					value:1,
					label:'全国产品'
				},
				{
					value:2,
					label:'地方示范项目'
				},
				{
					value:3,
					label:'地方特色方案'
				},
			],
			options3:[
				{
					value:"1",
					label:'互联网'
				},
				{
					value:"0",
					label:'非互联网'
				},
			],
            disablePro: false,
            showTip:false
        };
    },
    computed: {
        
    },
    mounted() {
        // this.initRole()
    },
    methods: {
        initData(id) {
            this.$nextTick(() => {
                this.getDataById(id)
            });
        },
        async getDataById(id) {
            let res = await this.productConfig.getProductDetails(id);
            if (res.code === "0000") {
                this.dialogForm = res.data
                this.dialogForm.selectedOptions = [res.data.provinceCode]
                if (res.data.cityCode && res.data.countryCode) {
                    let list = [res.data.cityCode, res.data.countryCode]
                    this.dialogForm.selectedOptions.concat(list)
                } else  if (res.data.cityCode) {
                    this.dialogForm.selectedOptions.push(res.data.cityCode)
                }
                if(res.data.tags){
                        this.dialogForm.tags = res.data.tags
                } else {
                    this.dialogForm.tags = []
                }
                this.currentProdList = this.productList.filter(item=>item.productSort === this.dialogForm.productTypeCode)
                this.hYCategory2 = this.dialogForm.tradeCategory1 ? this.hYCategory.find(i => i.value == this.dialogForm.tradeCategory1) ? this.hYCategory.find(i => i.value == this.dialogForm.tradeCategory1).children : [] : [];
            }
            this.disablePro = true;
            this.checkFlag();
            this.dialogTableVisible = true
        },
        openAdd() {
            this.disablePro = false;
            this.dialogTableVisible = true
        },
        /**
         * 选中数据后的统一处理
         */
        changeSetData(e,name) {
            if(name === 'productTypeName') {
                this.dialogForm.productTypeName = this.productCategory.find(item => item.label === e).value
                this.currentProdList = this.productList.filter(item=>item.productSort === e)
                this.dialogForm.productCode = ''
                this.dialogForm.productName = ''
            } else if (name === 'productName') {
                this.dialogForm.productName = this.currentProdList.find(item => item.code === e).name
            } else if (name === 'branchName') {
                this.dialogForm.branchName = this.branchList.find(item => item.jtBranchCode === e).jtBranchName
            } else if (name === 'area') {
                this.dialogForm.provinceCode = e[0];
                this.dialogForm.cityCode = e[1];
                this.dialogForm.countryCode = e[2];
                let provinceName = this.areaList.find(item=>item.value === e[0])
                let cityName = provinceName ? provinceName.children.find(item=>item.value === e[1]) : ''
                let countryName = cityName ? cityName.children.find(item=>item.value === e[2]) : ''
                this.dialogForm.provinceName = provinceName ? provinceName.label : "";
                this.dialogForm.cityName = cityName ? cityName.label : "";
                this.dialogForm.countryName = countryName ? countryName.label : "";
            }
        },
        chooseProduct() {},
        clear() {
            this.$refs["dialogForm"].resetFields();
             let dialogForm = {
                "branchCode": "", // 分支机构编码
                "branchName": "", // 支机构名称
                "businessType": "",   // 业务类型：1.线上出单 2.线下业务
                "cityCode": "",   // 市编码
                "cityName": "",   // 市名称
                "countryCode": "",    // 区编码
                "countryName": "",    // 区名称
                "createrCode": "",    // 创建人编码
                "createrName": "",    // 创建人名称
                "id": "", // 
                "productCode": "",    // 产品编码 
                "productName": "",    // 产品名称
                "productTypeCode": "",    // 产品大类编码：dt sd gz ty wy jz 
                "productTypeName": "",    // 产品大类名称：电梯 索道 雇主 团意 物业 家政
                "provinceCode": "",   // 省编码
                "provinceName": "",   // 省名称
                "state": "",  // 状态：1.正常 0.无效 
                "updaterCode": "",    //  更新人编码
                "updaterName": "", // 更新人名称
                "selectedOptions":[],
                "internet":"",
                "productType":"",
                "addTime": "",
                "tradeCategory1": "",
                "tradeCategory2": "",
                "issueCompany": "",
                "weight": "",
                "tags": [],
                "insSubjectType":"",
                "bizEndpoint":[],
                "settlementType":"",
            }
            for (const key in dialogForm) {
                this.$set(this.dialogForm,key,dialogForm[key])
            }
            this.dialogTableVisible = false
        },
        close() {
            this.clear();
        },
        async submit() {
            this.$refs.dialogForm.validate(async (value)=>{
                if(value) {
                    let data = JSON.parse(JSON.stringify(this.dialogForm));
                    if (data.id) {
                        data.updaterCode = window.sessionStorage.getItem('userCode')
                        data.updaterName = window.sessionStorage.getItem('userName')
                    } else {
                        data.createrCode = window.sessionStorage.getItem('userCode')
                        data.createrName = window.sessionStorage.getItem('userName')
                    }
                    let res = await this.productConfig.addOrUpdata(data)
                    if(res.code === '0000') {
                        this.clear();
                        this.$emit('successCallback')
                    }
                }
            })
            this.dialogVisible = false;
        },
        // 处理选中省市区方法
        handleChangeArea(e) {
            this.ruleForm.provinceCode = e[0];
            this.ruleForm.provinceName = this.areaMap[e[0]] || "";
            this.ruleForm.cityCode = e[1];
            this.ruleForm.cityName = this.areaMap[e[1]] || "";
            this.ruleForm.countyCode = e[2];
            this.ruleForm.countyName = this.areaMap[e[2]] || "";
        },
        chooseFirstCate() {
            this.hYCategory2 = this.dialogForm.tradeCategory1 ? this.hYCategory.find(i => i.value == this.dialogForm.tradeCategory1) ? this.hYCategory.find(i => i.value == this.dialogForm.tradeCategory1).children : [] : [];
        },
        changeProType() {
            if(this.dialogForm.productType == 1) {
                this.dialogForm.provinceCode = '000000';
                this.dialogForm.cityCode = '';
                this.dialogForm.countryCode = '';
                this.dialogForm.provinceName = "全国";
                this.dialogForm.cityName = "";
                this.dialogForm.countryName = "";
                this.dialogForm.selectedOptions.push('000000')
            }
        },
        // 新增标签
        addLabel(){
            if(this.labelValue) {
                if(this.dialogForm.tags.length >= 10) {
                    this.$message.error('标签最多支持10个')
                } else {
                    this.dialogForm.tags.push(this.labelValue)
                    this.labelValue = ''
                }
            }
        },
        // 删除单个标签
        removeLabel(index){
            this.dialogForm.tags.splice(index,1)
        },
        checkFlag() {
            if(this.dialogForm.businessType == '3') {
                if(this.dialogForm.bizEndpoint.includes('PC端') || this.dialogForm.bizEndpoint.includes('电梯智保')) {
                    this.showTip = true;
                } else {
                    this.showTip = false;
                }
            } else {
                this.showTip = false;
            }
        }
    },
};
</script>

<style lang="less">
.w280 {
    width: 280px;
}
.el_radio {
    margin-top: 10px;
    margin-left: 0 !important;
    margin-right: 10px !important;
}
.col-blue {
    color: #096dd9;
}
.col-red {
    color: #f5222d;
}
.title-style {
    display: block;
    font-weight: 700;
    color: #101010;
}
.add-label-box {
    display: inline-block;
    height: 40px;
    .add-label-btn {
        height: 30px;
        line-height: 30px;
        vertical-align: middle;
        display: inline-block;
        border: 1px solid #FA8C16;
        color: #FA8C16;
        width: 50px;
        text-align: center;
        cursor: pointer;
        box-sizing: border-box;
    }
}
.label-box {
    width: 70%;
    .label-box-item {
        height: 30px;
        line-height: 30px;
        display: inline-block;
        margin-right: 10px;
        border: 1px solid #FA8C16;
        color: #FA8C16;
        padding: 0 10px;
    }
}

</style>
