<template>
  <!-- 关联保单 -->
	<div class="caseBiaoDiDialog" id="caseBiaoDiDialog">
		 <el-dialog title="选择标的" :visible.sync="dialogVisible" width="800px" destroy-on-close :close-on-click-modal='false'>
            <el-form :model="form" ref="form" label-width="100px" :rules="rules" size="small">
                <el-form-item label="标的来源"  prop="riskType">
                    <el-switch
                      v-model="form.biaoDiSwitch"                
                      active-text="输入标的"
                      inactive-text="选择标的"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <!-- 电梯 -->
                <div v-if="policyInfo.productCategoryCode == 'DT'">
                    <div v-if="!form.biaoDiSwitch">
                        <div class="display-flex">
                            <el-form-item label="使用单位名称">
                                <el-input v-model="form.useUnit" maxlength="50" size="mini"></el-input>
                            </el-form-item>
                            <el-form-item label-width="100px" maxlength="30" label="设备代码">
                                <el-input v-model="form.licenceNo" size="mini"></el-input>
                            </el-form-item>
                            <el-form-item label-width="0px" size="mini" >
                                <el-button type="primary" @click="serchDianTi" class="ml10">查询</el-button>
                            </el-form-item>
                        </div>
                        <div>
                            <el-table  ref="proInfo" :data="dataBiaoDi" border style="width: 100%" :header-cell-style="getRowClass1" @row-click="chooseProDianTi">
                                <!-- <el-table-column label="序号" type="index" width="50" center></el-table-column> -->
                                <el-table-column label="选择" width="50" center>
                                    <template slot-scope="scope">
                                    <el-radio v-model="scope.row.choosePro" :label="true">{{""}}</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="useUnit" label="使用单位"></el-table-column>
                                <el-table-column prop="siteAddress" label="坐落地址">
                                    <template slot-scope="scope">
                                        <span>
                                            {{scope.row.provinceName}}
                                            {{scope.row.cityName}}
                                            {{scope.row.countryName}}
                                            {{scope.row.address}}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="eleType" label="类型"></el-table-column>
                                <el-table-column prop="eleNo" label="设备代码/出厂编号"></el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <!-- 手动录入 -->
                    <div v-else-if="form.biaoDiSwitch">
                         <el-form-item label="电梯类型" prop="elevatorType" >
                            <el-select v-model="form.elevatorType" size="mini" class="w280">
                                <el-option v-for="item in elevatorTypes" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="设备代码" prop="elevatorId">
                            <el-input v-model="form.elevatorId" class="w280"></el-input>
                        </el-form-item>
                        <el-form-item label="坐落地址" prop="elevatorMunicipalDistrict">
                            <el-cascader
                                :options="province"
                                placeholder="请选择"
                                clearable
                                :props="{
                                    label: 'label',
                                    value: 'label',
                                    children: 'children',
                                }"
                                v-model="form.elevatorMunicipalDistrict"
                                size="mini"
                                class="w280"
                            ></el-cascader>
                        </el-form-item>
                        <el-form-item prop="elevatorAddr">
                            <el-input v-model="form.elevatorAddr" class="w280"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <!-- 索道 -->
                <div v-else-if="policyInfo.productCategoryCode == 'SD'">
                    <div  v-if="!form.biaoDiSwitch">
                        <div class="display-flex">
                            <el-form-item label-width="70px" label="索道名称"  maxlength="50" prop="caseType" >
                                <el-input v-model="form.equipmentsName" size="mini"></el-input>
                            </el-form-item>
                            <el-form-item label-width="100px" label="设备代码"  maxlength="30" prop="caseType">
                                <el-input v-model="form.equipmentsCode" size="mini"></el-input>
                            </el-form-item>
                            <el-form-item label-width="0px" size="mini" >
                                <el-button type="primary" class="ml10" @click="serchYanSuoDao">查询</el-button>
                            </el-form-item>
                        </div>
                        <div>
                            <el-table ref="proInfo" :data="dataBiaoDi" border style="width: 100%" :header-cell-style="getRowClass1" @row-click="chooseProSuDao">
                                <el-table-column label="序号" type="index" width="50" center></el-table-column>
                                <el-table-column label="选择" width="50" center>
                                    <template slot-scope="scope">
                                    <el-radio v-model="scope.row.choosePro" :label="true">{{""}}</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="equipmentsName" label="索道姓名"></el-table-column>
                                <el-table-column prop="equipmentsCode" label="设备代码"></el-table-column>
                                <el-table-column prop="equipmentsTypeName" label="索道类型"></el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <!-- 手动录入 -->
                    <div v-else-if="form.biaoDiSwitch">
                         <el-form-item label="设备代码" prop="cablewayId">
                            <el-input v-model="form.cablewayId" class="w280"></el-input>
                        </el-form-item>
                        <el-form-item label="索道名称" prop="cablewayName">
                            <el-input v-model="form.cablewayName" class="w280"></el-input>
                        </el-form-item>
                        <el-form-item label="索道类型" prop="cablewayType" >
                            <el-select v-model="form.cablewayType" size="mini" class="w280">
                                <el-option v-for="item in cablewayType" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <!-- 物业项目地址 -->
                <div v-else-if="policyInfo.productCategoryCode == 'WY'">
                    <div v-if="!form.biaoDiSwitch">
                        <div class="display-flex">
                            <el-form-item label-width="100px" maxlength="50" label="物业项目名称" prop="caseType" >
                                <el-input v-model="form.name" size="mini"></el-input>
                            </el-form-item>
                            <el-form-item label-width="100px" label="具体地址" prop="caseType">
                                <el-cascader :options="province" :props="{
                                    label: 'label',
                                    value: 'label',
                                    children: 'children',
                                }" placeholder="请选择" clearable v-model="form.serachWuYeArea" size="mini"></el-cascader>
                            </el-form-item>
                            <el-form-item label-width="0px" size="mini" >
                                <el-button type="primary" class="ml10" @click="serchWuYe">查询</el-button>
                            </el-form-item>
                        </div>
                        <div>
                            <el-table ref="proInfo" :data="dataBiaoDi" border style="width: 100%" :header-cell-style="getRowClass1" @row-click="chooseProWuYe">
                                <el-table-column label="选择" width="50" center>
                                    <template slot-scope="scope">
                                    <el-radio v-model="scope.row.choosePro" :label="true">{{""}}</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" label="物业项目名称"></el-table-column>
                                <el-table-column prop="address" label="所在地区">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.provinceName}}</span>    
                                        <span>{{scope.row.cityName}}</span>    
                                        <span>{{scope.row.countryName}}</span>    
                                        <span>{{scope.row.address}}</span>    
                                    </template>
                                </el-table-column>
                                <el-table-column prop="style" label="类型"></el-table-column>
                                <el-table-column width="150" label="建筑面积">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.area}}(平米)</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <!-- 手动录入 -->
                    <div v-else-if="form.biaoDiSwitch">
                        <el-form-item label="物业项目名称" prop="propertyName">
                            <el-input v-model="form.propertyName" class="w280"></el-input>
                        </el-form-item>
                        <el-form-item label="物业类型" prop="propertyType" >
                            <el-select v-model="form.propertyType" size="mini" class="w280">
                                <el-option v-for="item in property" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="具体地址" prop="propertyMunicipalDistrict">
                            <el-cascader :options="province" placeholder="请选择" :props="{
                                    label: 'label',
                                    value: 'label',
                                    children: 'children',
                                }" clearable v-model="form.propertyMunicipalDistrict" size="mini" class="w280"></el-cascader>
                        </el-form-item>
                        <el-form-item prop="propertyAddr">
                            <el-input v-model="form.propertyAddr" class="w280"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <!-- 商户 -->
                <div v-else-if="policyInfo.productCategoryCode == 'YJSP'">
                    <div v-if="!form.biaoDiSwitch">
                        <div class="display-flex">
                            <el-form-item label-width="70px" label="商户地址" prop="caseType" >
                               <el-cascader :options="province" :props="{
                                    label: 'label',
                                    value: 'label',
                                    children: 'children',
                                }" placeholder="请选择" clearable v-model="form.serachShopArea" size="mini"></el-cascader>
                            </el-form-item>
                            <el-form-item label-width="0px" size="mini" >
                                <el-button type="primary" class="ml10" @click="serchYanJieShangPu">查询</el-button>
                            </el-form-item>
                        </div>
                        <div>
                            <el-table ref="proInfo" :data="dataBiaoDi" border style="width: 100%" :header-cell-style="getRowClass1" @row-click="chooseProWuYe">
                                <el-table-column label="序号" type="index" width="50" center></el-table-column>
                                <el-table-column label="选择" width="50" center>
                                    <template slot-scope="scope">
                                    <el-radio v-model="scope.row.choosePro" :label="true">{{""}}</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="area" label="商户地址"></el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <!-- 手动录入 -->
                    <div v-else-if="form.biaoDiSwitch">
                        <el-form-item label="商户地址" prop="businessMunicipalDistrict">
                            <el-cascader
                                :options="province"
                                placeholder="请选择"
                                clearable
                                :props="{
                                    label: 'label',
                                    value: 'label',
                                    children: 'children',
                                }"
                                v-model="form.businessMunicipalDistrict"
                                size="mini"
                                class="w280"
                            ></el-cascader>
                        </el-form-item>
                        <el-form-item prop="businessAddr">
                            <el-input v-model="form.businessAddr" class="w280"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <div class="btn">
                <span class="btn-left" @click="close">取消</span>
                <span class="btn-right" @click="onSubmit('form')">确认提交</span>
            </div>
        </el-dialog>
	</div>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from 'vuex'
import CaseServiceNew from '@/service/CaseServiceNew'
export default {
    computed:{
        ...mapGetters({
            province:'areaOptions',
            policyInfo:'policyInfoVo',
            elevatorTypes:'elevatorTypes',
            property:'property',
            cablewayType:'cablewayType',
        }),
    },
    
	data() {
		return {
            CaseServiceNew: new CaseServiceNew(),
            dialogVisible:false,
            dataBiaoDi:[],
            tableData:[],
            form:{
                biaoDiSwitch:false,
                useUnit:'',// 使用单位
                equipmentsName:'',// 索道名称
                equipmentsCode:'',// 索道编码
                licenceNo:'',// 设备编码
                name:'',    // 物业名称
                serachWuYeArea:[],  // 物业地址
                serachShopArea:[],  // 商铺地址
                "elevatorType":"",//电梯类型
                "elevatorId":"",//设备代码
                "elevatorCompany":"",//使用单位
                "elevatorMunicipalDistrict":[],//市辖区
                "elevatorAddr":"",//详细地址
                "cablewayId":"",//设备代码
                "cablewayName":"",//索道名称
                "cablewayType":"",//索道类别
                "propertyName":"",//物业项目名
                "propertyAddr":"",//市辖区
                "propertyMunicipalDistrict":[],//详细地址
                "propertyType":"",//物业类型
                "businessMunicipalDistrict":[],//商户市辖区
                "businessAddr":"",//商户详细地址
           },
           rules:{
                elevatorType: [
                    { required: true, message: "请选择电梯类型", trigger: "change" }
                ],
                elevatorId: [
                    { required: true, message: "请填写设备代码", trigger: "blur" },
                    {
                        min: 1,
                        max: 30,
                        message: "长度在 1 到 30 个字符",
                        trigger: "blur"
                    }
                ],
                elevatorMunicipalDistrict: [
                    { required: true, message: "请选择", trigger: "change" }
                ],
                elevatorAddr: [
                    { required: true, message: "请输入", trigger: "blur" },
                    {
                        min: 1,
                        max: 50,
                        message: "长度在 1 到 50 个字符",
                        trigger: "blur"
                    }
                ],

                cablewayId: [
                    { required: true, message: "请填写设备代码", trigger: "blur" },
                    {
                        min: 1,
                        max: 30,
                        message: "长度在 1 到 30 个字符",
                        trigger: "blur"
                    }
                ],
                cablewayType: [
                    { required: true, message: "请选择", trigger: "change" }
                ],
                cablewayName: [
                    { required: true, message: "请选择", trigger: "change" },
                    {
                        min: 1,
                        max: 50,
                        message: "长度在 1 到 50 个字符",
                        trigger: "blur"
                    }
                ],
                propertyName: [
                    { required: true, message: "请输入", trigger: "blur" },
                    {
                        min: 1,
                        max: 50,
                        message: "长度在 1 到 50 个字符",
                        trigger: "blur"
                    }
                ],
                propertyType: [
                    { required: true, message: "请选择", trigger: "change" }
                ],
                propertyMunicipalDistrict: [
                    { required: true, message: "请选择", trigger: "change" }
                ],
                propertyAddr: [
                    { required: true, message: "请输入", trigger: "blur" },
                    {
                        min: 1,
                        max: 50,
                        message: "长度在 1 到 50 个字符",
                        trigger: "blur"
                    }
                ],
                businessMunicipalDistrict: [
                    { required: true, message: "请选择", trigger: "change" }
                ],
                businessAddr: [
                    { required: true, message: "请输入", trigger: "blur" },
                    {
                        min: 1,
                        max: 50,
                        message: "长度在 1 到 50 个字符",
                        trigger: "blur"
                    }
                ],
           }
        }
	},
	created(){},
	methods: {
        ...mapActions(['targetInfoSave']),
        // 初始化数据
        openInit(val) {
            this.dialogVisible = true;
        },
        getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #e8e8e8;color:#101010;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
        // 电梯搜索条件查询
        async serchDianTi(){
            let form = {
                useUnit: this.form.useUnit,
                eleCode: this.form.licenceNo,
                policyNo: this.policyInfo.policyNo,
                pageNum: 1,
                pageSize: 100,
                dataScope: '1',
                userCode: sessionStorage.getItem("userCode"),
            }
            let {code,list} = await this.CaseServiceNew.getElevatorList(form)
            if(code === '0000' && list.length !== 0) {
                this.dataBiaoDi = list.map(item=>{
                    item.choosePro = false
                    item.eleNo = item.equipmentsCode || item.factoryNumber
                    return item
                })
            } else if(code === '0000' && list.length == 0) {
                this.dataBiaoDi = []
                this.$message.warning('暂无数据')
            }
        },
        // 索道搜索条件查询
        async serchYanSuoDao(){
            let form = {
                equipmentsName : this.form.equipmentsName,
                equipmentsCode : this.form.equipmentsCode,
                policyNo: this.policyInfo.policyNo,
                pageNum: 1,
                pageSize: 100,
                dataScope: '1',
                userCode: sessionStorage.getItem("userCode"),
            }
            let {code,list} = await this.CaseServiceNew.getCablewayList(form)
            if(code === '0000' && list.length !== 0) {
                this.dataBiaoDi = list.map(item=>{
                    item.choosePro = false
                    item.dataFlag = 'biaoDi'
                    item.startDate = item.policyInfo.polStartDate.split(' ')[0]
                    item.endDate = item.policyInfo.polEndDate.split(' ')[0]
                    if(item.equipmentsType == 1){
                        item.equipmentsTypeName = '往复式'
                    } else if (item.equipmentsType == 2){
                        item.equipmentsTypeName = '固定抱索器式'
                    } else if (item.equipmentsType == 3){
                        item.equipmentsTypeName = '挂抱索器式'
                    } else if (item.equipmentsType == 4){
                        item.equipmentsTypeName = '其他'
                    }
                    return item
                })
            } else if(code === '0000' && list.length == 0) {
                this.dataBiaoDi = []
                this.$message.warning('暂无数据')
            }
        },
        // 物业搜索条件查询
        async serchWuYe(){
            let form = {
                name: this.form.name,
                policyNo: this.policyInfo.policyNo,
                provinceName: this.form.serachWuYeArea[0] || "",
                cityName: this.form.serachWuYeArea[1] || "",
                countryName: this.form.serachWuYeArea[2] || "",
                pageNum: 1,
                pageSize: 100,
                dataScope: '1',
                userCode: sessionStorage.getItem("userCode"),
            }
            let {code,list} = await this.CaseServiceNew.getPropertyList(form)
            if(code === '0000' && list.length !== 0) {
                this.dataBiaoDi = list.map(item=>{
                    item.choosePro = false
                    return item
                })
            } else if(code === '0000' && list.length == 0) {
                this.dataBiaoDi = []
                this.$message.warning('暂无数据')
            }
        },
        // 沿街商铺搜索条件查询
        async serchYanJieShangPu(){
            let form = {
                policyNo: this.policyInfo.policyNo,
                provinceName: this.form.serachShopArea[0] || "",
                cityName: this.form.serachShopArea[1] || "",
                countryName: this.form.serachShopArea[2] || "",
                pageNum: 1,
                pageSize: 100,
                dataScope: '1',
                userCode: sessionStorage.getItem("userCode"),
            }
            let {code,list} = await this.CaseServiceNew.getShopList(form)
            if(code === '0000' && list.length !== 0) {
                this.dataBiaoDi = list.map(item=>{
                    item.choosePro = false
                    item.area = `${item.provinceName}${item.cityName}${item.countryName}${item.address}`
                    return item
                })
            } else if(code === '0000' && list.length == 0) {
                this.dataBiaoDi = []
                this.$message.warning('暂无数据')
            }
        },
        // 选择电梯标的
        chooseProDianTi(row,index,event) {
            this.dataBiaoDi.forEach((item,subIndex) => {
                if(item.eleNo != row.eleNo) {
                    item.choosePro = false;
                } else {
                    item.choosePro = true;
                }
            });
        },
        // 选择电梯标的
        choosePro(row,index) {
            this.dataBiaoDi.map((item,subIndex) => {
                if(row.value != item.value) {
                    item.choosePro = false;
                } else {
                    item.choosePro = true;
                }
            });
            this.form.emergencyEquipmentCode = row.value;
        },
        // 选择索道标的
        chooseProSuDao(row,index) {
            this.dataBiaoDi.map((item,subIndex) => {
                if(item.equipmentsCode != row.equipmentsCode) {
                    item.choosePro = false;
                } else {
                    item.choosePro = true;
                }
            });
        },
        // 选择物业标的沿街商铺
        chooseProWuYe(row,index) {
            this.dataBiaoDi.map((item,subIndex) => {
                if(row.id != item.id) {
                item.choosePro = false;
                } else {
                item.choosePro = true;
                }
            });
        },
        // 取消
        close(){
            this.form = {
                biaoDiSwitch:false,
                useUnit:'',// 使用单位
                equipmentsName:'',// 索道名称
                equipmentsCode:'',// 索道编码
                licenceNo:'',// 设备编码
                name:'',    // 物业名称
                serachWuYeArea:[],  // 物业地址
                serachShopArea:[],  // 商铺地址
                "elevatorType":"",//电梯类型
                "elevatorId":"",//设备代码
                "factoryNumber":"",//出厂编码
                "elevatorCompany":"",//使用单位
                "elevatorMunicipalDistrict":[],//市辖区
                "elevatorAddr":"",//详细地址
                "cablewayId":"",//设备代码
                "cablewayName":"",//索道名称
                "cablewayType":"",//索道类别
                "propertyName":"",//物业项目名
                "propertyAddr":"",//市辖区
                "propertyMunicipalDistrict":[],//详细地址
                "propertyType":"",//物业类型
                "businessMunicipalDistrict":[],//商户市辖区
                "businessAddr":"",//商户详细地址
           }
           this.dialogVisible = false
           this.dataBiaoDi = []
        },
        // 确认关联
        onSubmit(){
            if(!this.form.biaoDiSwitch) {
                let formData = this.dataBiaoDi.find(item=>item.choosePro === true)
                if(formData){
                    let obj = {
                        "elevatorType":"",//电梯类型
                        "elevatorId":"",//设备代码
                        "factoryNumber":"",//出厂代码
                        "elevatorCompany":"",//使用单位
                        "elevatorMunicipalDistrict":'',//市辖区
                        "elevatorAddr":"",//详细地址

                        "cablewayId":"",//设备代码
                        "cablewayName":"",//索道名称
                        "cablewayType":"",//索道类别

                        "propertyName":"",//物业项目名
                        "propertyMunicipalDistrict":'',//市辖区
                        "propertyAddr":"",//详细地址
                        "propertyType":"",//物业类型

                        "businessMunicipalDistrict":'',//商户市辖区
                        "businessAddr":'',//商户详细地址
                        saveFlag:true
                    }
                    if(formData.policyInfo.productCategory === 'DT') {
                        obj.elevatorMunicipalDistrict = [formData.provinceName,formData.cityName,formData.countryName].filter(item=>item).join('/')
                        obj.elevatorAddr = formData.address
                        obj.elevatorType = formData.eleType //电梯类型
                        obj.elevatorId = formData.equipmentsCode //设备代码
                        obj.factoryNumber = formData.factoryNumber //设备代码
                        obj.elevatorCompany = formData.useUnit //使用单位
                    } else if(formData.policyInfo.productCategory === 'WY') {
                        obj.propertyMunicipalDistrict = [formData.provinceName,formData.cityName,formData.countryName].filter(item=>item).join('/')
                        obj.propertyAddr = formData.address
                        obj.propertyName = formData.name
                        obj.propertyType = formData.style
                    } else if(formData.policyInfo.productCategory === 'SD'){
                        obj.cablewayId = formData.equipmentsCode
                        obj.cablewayName = formData.equipmentsName
                        obj.cablewayType = formData.equipmentsTypeName
                    } else if(formData.policyInfo.productCategory === 'YJSP'){
                        obj.businessMunicipalDistrict = [formData.provinceName,formData.cityName,formData.countryName].filter(item=>item).join('/')
                        obj.businessAddr = formData.address
                    }
                    this.targetInfoSave(obj)
                    this.close()
                } else {
                    this.$message.warning('请选择标的信息')
                }
            } else {
                let form = {
                    ...this.form,
                    elevatorMunicipalDistrict: this.form.elevatorMunicipalDistrict.join('/'),
                    propertyMunicipalDistrict: this.form.propertyMunicipalDistrict.join('/'),
                    businessMunicipalDistrict: this.form.businessMunicipalDistrict.join('/'),
                }
                this.targetInfoSave(form)
            }
            this.close()
        }
	},
}
</script>

<style lang="less">
#caseBiaoDiDialog {
    .el-form-item {
        margin-bottom: 17px;
    }
    .display-flex {
        display: flex;
    }
    .btn{
        text-align: right;
        width: 100%;
        margin-top: 20px;
        .btn-left{
            display: inline-block;
            padding: 5px 20px;
            border: 1px solid #ccc;
            color: #000;
            background-color: #F5F5F5;
            border-radius: 20px;
            cursor: pointer;
            margin-right: 20px;
        }
        .btn-right{
            display: inline-block;
            padding: 5px 20px;
            color: #FFF;
            background-color: #FA8C16;
            border-radius: 20px;
            cursor: pointer;
        }
    }
    .w280 {
        width: 280px;
    }

}
</style>
