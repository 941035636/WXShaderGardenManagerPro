<template>
  <!-- 关联保单 -->
	<div class="caseRelationPolicy" id="caseRelationPolicy">
		<el-dialog title="选择保单" :visible.sync="exhibition" width="1000px" :close-on-click-modal='false' >
            <div class="mb10">
                <div class="display-flex mt10">
                    <div>
                        <span>保单号：</span>
                        <el-input v-model.trim="form.policyNo" @input="clearData" maxlength="30" placeholder="请输入保单号" size="small" class="w200 ml10"></el-input>
                    </div>
                    <div class="ml10">
                        <span>投保人名称：</span>
                        <el-input v-model.trim="form.policyHolder"  @input="clearData" maxlength="50" placeholder="请输入投保人名称" size="small" class="w200 ml10"></el-input>
                    </div>
                    <el-button class="ml10" type="text" @click="clearInput('top')">清空条件</el-button>
                    <el-button  @click="setPolicyDetails" type="primary" size="small"  class="ml10">查询</el-button>
                </div>
                <div class="display-flex mt10">
                    <el-select v-model="form.searchType" @change="clearData" placeholder="请选择" size="small" class="w120">
                        <el-option
                            v-for="item in optionsSearchType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input @input="clearData" v-model.trim="form.searchValue" placeholder="请输入内容" size="small" class="w200 ml10"></el-input>
                    <el-button  class="ml10" type="text" @click="clearInput('bottom')">清空条件</el-button>
                    <el-button @click="setBiaoDiPolicyDetails" type="primary" size="small"  class="ml10">查询</el-button>
                </div>
            </div>
            <div v-if="getPolicyTable">
                <el-table :data="data" border :header-cell-style="getRowClass1">
                    <el-table-column label="选择" width="50">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checkBox" @change="choosePolicy(scope.row,scope.$index)"></el-checkbox>
                    </template>
                    </el-table-column>
                    <el-table-column  label="保单信息">
                    <template slot-scope="scope">
                        <el-row class="con-row">
                            <el-col :span="8" class="con-col">
                                <span class="col-span-l">
                                    投保人：
                                </span>
                                <span class="col-span-r">
                                    {{scope.row.holderName}}
                                </span>
                            </el-col>
                            <el-col :span="8" class="con-col">
                                <span class="col-span-l">
                                    被保人：
                                </span>
                                <span class="col-span-r">
                                {{scope.row.insuredName ? scope.row.insuredName : '--'}}
                                </span>
                            </el-col>
                            <el-col :span="8" class="con-col">
                                <span class="col-span-l">
                                    出单公司：
                                </span>
                                <span class="col-span-r">
                                    {{scope.row.issueCompanyName}} 
                                </span>
                            </el-col>
                        </el-row>
                        <el-row class="con-row">
                            <el-col :span="8" class="con-col">
                                <span class="col-span-l">
                                    保障期间：
                                </span>
                                <span class="col-span-r">
                                    {{scope.row.startDate}} 至 {{scope.row.endDate}}
                                </span>
                            </el-col>
                            <el-col :span="8" class="con-col">
                                <span class="col-span-l">
                                    保单号：
                                </span>
                                <span class="col-span-r">
                                {{scope.row.policyNo}}
                                </span>
                            </el-col>
                            <el-col :span="8" class="con-col">
                                <span class="col-span-l">
                                    投保产品：
                                </span>
                                <span class="col-span-r">
                                {{scope.row.productName}}
                                </span>
                            </el-col>
                        </el-row>
                        <el-row class="con-row">
                            <el-col :span="8" class="con-col">
                                <span class="col-span-l">
                                    保费金额：
                                </span>
                                <span class="col-span-r" style="color:#F5222D">
                                    ￥{{scope.row.premium}} 
                                </span>
                            </el-col>
                            <el-col :span="12" class="con-col">
                                <span class="col-span-l">
                                    行业/险种：
                                </span>
                                <span class="col-span-r">
                                    {{scope.row.industryTypeName}} / {{scope.row.productCategoryName}}
                                </span>
                            </el-col>
                        </el-row>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-if="getBiaoDiTable">
                <el-table :data="data" border :header-cell-style="getRowClass1">
                    <el-table-column label="选择" width="50">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checkBox" @change="choosePolicy(scope.row,scope.$index)"></el-checkbox>
                    </template>
                    </el-table-column>
                    <el-table-column  label="标的信息">
                    <template slot-scope="scope">
                        <el-row class="con-row">
                            <el-col :span="24" class="con-col">
                                <span class="col-span-l">
                                    保障期间：
                                </span>
                                <span class="col-span-r" style="color:#FA8C16">
                                    {{scope.row.startDate}} 至 {{scope.row.endDate}}
                                </span>
                            </el-col>
                        </el-row>
                        <div v-if="form.searchType === 'eleNo'">
                            <el-row class="con-row">
                                <el-col :span="24" class="con-col">
                                    <span class="col-span-l">
                                        使用单位：
                                    </span>
                                    <span class="col-span-r">
                                        {{scope.row.useUnit}}
                                    </span>
                                </el-col>
                            </el-row>
                            <el-row class="con-row">
                                <el-col :span="24" class="con-col">
                                    <span class="col-span-l">
                                        坐落地址：
                                    </span>
                                    <span class="col-span-r">
                                        {{scope.row.provinceName}}
                                        {{scope.row.cityName}}
                                        {{scope.row.countryName}}
                                        {{scope.row.address}}
                                    </span>
                                </el-col>
                            </el-row>
                            <el-row class="con-row">
                                <el-col :span="24" class="con-col">
                                    <span class="col-span-l">
                                        设备代码：
                                    </span>
                                    <span class="col-span-r">
                                        {{scope.row.equipmentsCode}}
                                       ({{scope.row.eleType}})
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-else-if="form.searchType === 'idNo'">
                            <el-row class="con-row">
                                <el-col :span="24" class="con-col">
                                    <span class="col-span-l">
                                        姓名：
                                    </span>
                                    <span class="col-span-r">
                                        {{scope.row.name}}
                                    </span>
                                </el-col>
                            </el-row>
                            <el-row class="con-row">
                                <el-col :span="24" class="con-col">
                                    <span class="col-span-l">
                                        证件号：
                                    </span>
                                    <span class="col-span-r">
                                        {{scope.row.licenceNo}}
                                    </span>
                                </el-col>
                            </el-row>
                            <el-row class="con-row">
                                <el-col :span="24" class="con-col">
                                    <span class="col-span-l">
                                        岗位：
                                    </span>
                                    <span class="col-span-r">
                                        {{scope.row.post}}
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-else-if="form.searchType === 'ropewayName'">
                            <el-row class="con-row">
                                <el-col :span="24" class="con-col">
                                    <span class="col-span-l">
                                        索道名称：
                                    </span>
                                    <span class="col-span-r">
                                       {{scope.row.equipmentsName}}
                                    </span>
                                </el-col>
                            </el-row>
                           <el-row class="con-row">
                                <el-col :span="24" class="con-col">
                                    <span class="col-span-l">
                                        设备代码：
                                    </span>
                                    <span class="col-span-r">
                                        {{scope.row.equipmentsCode}}
                                       ({{scope.row.equipmentsTypeName}})
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-else-if="form.searchType === 'propertyName'">
                            <el-row class="con-row">
                                <el-col :span="24" class="con-col">
                                    <span class="col-span-l">
                                        物业项目：
                                    </span>
                                    <span class="col-span-r">
                                        {{scope.row.name}}
                                    </span>
                                </el-col>
                            </el-row>
                            <el-row class="con-row">
                                <el-col :span="24" class="con-col">
                                    <span class="col-span-l">
                                        具体地址：
                                    </span>
                                    <span class="col-span-r">
                                        {{scope.row.provinceName}}
                                        {{scope.row.cityName}}
                                        {{scope.row.countryName}}
                                        {{scope.row.address}}
                                    </span>
                                </el-col>
                            </el-row>
                            <el-row class="con-row">
                                <el-col :span="24" class="con-col">
                                    <span class="col-span-l">
                                        建筑面积：
                                    </span>
                                    <span class="col-span-r">
                                        {{scope.row.area}}（平米）
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column  label="保单信息">
                    <template slot-scope="scope">
                        <el-row class="con-row">
                            <el-col :span="24" class="con-col">
                                <span class="col-span-l">
                                    投保人：
                                </span>
                                <span class="col-span-r">
                                    {{scope.row.policyInfo.holderName}}
                                </span>
                            </el-col>
                        </el-row>
                        <el-row class="con-row">
                            <el-col :span="24" class="con-col">
                                <span class="col-span-l">
                                    保险机构：
                                </span>
                                <span class="col-span-r">
                                    {{scope.row.policyInfo.issueCompanyName}} 
                                </span>
                            </el-col>
                        </el-row>
                        <el-row class="con-row">
                            <el-col :span="24" class="con-col">
                                <span class="col-span-l">
                                    保单号：
                                </span>
                                <span class="col-span-r">
                                {{scope.row.policyInfo.policyNo}}
                                </span>
                            </el-col>
                        </el-row>

                        <el-row class="con-row">
                            <el-col :span="24" class="con-col" v-if="scope.row.insuranceCompanyName">
                                <span class="col-span-l">
                                    行业/险种：
                                </span>
                                <span class="col-span-r">
                                    {{scope.row.policyInfo.industryTypeName}} /
                                    {{scope.row.policyInfo.productCategoryName}} 
                                </span>
                            </el-col>
                            
                        </el-row>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            
			<div class="btn mt20">
                <span class="btn-left" @click="close">取消</span>
                <span class="btn-right" @click="relationpolicyNo('insurance')">确认提交</span>
            </div>
		</el-dialog>
	</div>
</template>

<script>
import { mapMutations,mapGetters, mapActions } from 'vuex';
import CaseServiceNew from '@/service/CaseServiceNew'
export default {
    computed:{
        ...mapGetters({
            reportDate:'riskInfo',
            sequipCaseInfo:'sequipCaseInfo',
        }),
        getBiaoDiTable(){
            if(this.data.length != 0 && !this.form.policyNo && !this.form.policyHolder && this.form.searchType && this.form.searchValue) {
                return true
            } else {
                return false
            }
        },
        getPolicyTable(){
            if(this.data.length != 0 && (this.form.policyNo || this.form.policyHolder) && !this.form.searchType && !this.form.searchValue) {
                return true
            } else {
                return false
            }
        },
    },
	data() {
		return {
            sequipServiceNew:new CaseServiceNew(),
            exhibition:false,
            data:[],
            form:{
                searchType:'',
                policyNo:'',
                policyHolder:'',
                searchValue:'',
                activeName2:'',
            },
            optionsData: [{
                value: 'sequip',
                label: '特设保'
                }, {
                value: 'EBao',
                label: 'E保'
            }],
            optionsSearchType: [{
                value: 'idNo',
                label: '人员证件号'
                }, {
                value: 'ropewayName',
                label: '索道名称'
                }, {
                value: 'eleNo',
                label: '设备代码'
                }, {
                value: 'propertyName',
                label: '物业项目名称'
            }],
        }
	},
	created(){},
	methods: {
        // ...mapMutations([
        //     'sequipUpdatePolicy',
        //     "sequipUpdateBiaoDi",
        //     "sequipSetCasePerson",
        // ]),
        ...mapActions(['policyInfoSave','saveInsuredInfo','targetInfoSave']),
        // 初始化数据
        openInit(val) {
            this.exhibition = true;
        },
        // 修改表头样式
        getRowClass1({row,column,rowIndex,columnIndex}) {
            if (rowIndex == 0) {
                return 'background: #e8e8e8;color:#101010;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
        // 查询保单详情
        async setPolicyDetails(){
            if(this.form.policyNo && this.form.policyHolder) {
                this.$message.warning('只能有一个查询条件')
            } else if(!this.form.policyNo && !this.form.policyHolder){
                this.$message.warning('请输入查选条件')
            } else {
                this.data = []
                this.clearInput('bottom')
                let form = {
                    "insuredCompany": this.form.policyHolder,
                    "policyNo": this.form.policyNo,
                    riskTime:this.reportDate.riskTime,
                    }
                let {code,data} = await this.sequipServiceNew.getPolicyInfo(form)
                if(code === '0000') {
                    this.data = data.map(item=>{
                        item.checkBox = false
                        item.dataFlag = 'policy'
                        item.startDate = item.polStartDate.split(' ')[0]
                        item.endDate = item.polEndDate.split(' ')[0]
                        return item
                    })
                }
            }
        },
        // 通过标的查保单
        async setBiaoDiPolicyDetails(){
            if(!this.form.searchType && !this.form.searchValue){
                this.$message.warning('请输入查选条件')
            } else if(this.form.searchType === 'idNo'){ // 证件号
                this.clearInput('top')
                this.data = []
                let form = {
                    licenceNo: this.form.searchValue,
                    pageNum: 1,
                    pageSize: 100,
                    dataScope: '1',
                    riskDate:this.reportDate.riskTime,
                    userCode: sessionStorage.getItem("userCode"),
                }
                let {code,list} = await this.sequipServiceNew.getEmployeeList(form)
                if(code === '0000' && list.length !== 0) {
                    this.data = list.map(item=>{
                        item.checkBox = false
                        item.dataFlag = 'biaoDi'
                        item.startDate = item.policyInfo.polStartDate.split(' ')[0]
                        item.endDate = item.policyInfo.polEndDate.split(' ')[0]
                        return item
                    })
                } else if(code === '0000' && list.length == 0) {
                    this.data = []
                    this.$message.warning('暂无数据')
                }
            } else if(this.form.searchType === 'ropewayName') { // 索道名称
                this.data = []
                let form = {
                    equipmentsName : this.form.searchValue,
                    pageNum: 1,
                    pageSize: 100,
                    dataScope: '1',
                    riskDate:this.reportDate.riskTime,
                    userCode: sessionStorage.getItem("userCode"),
                }
                let {code,list} = await this.sequipServiceNew.getCablewayList(form)
                if(code === '0000') {
                    this.data = list.map(item=>{
                        item.checkBox = false
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
                }
            } else if(this.form.searchType === 'eleNo') {  // 电梯编号
                let length = this.form.searchValue.length 
                if(length<1 || length>30){
                    this.$message.error('设备代码长度为1到30位（含）')
                    return
                }
                this.data = []
                this.clearInput('top')
                let form = {
                    eleCode: this.form.searchValue,
                    pageNum: 1,
                    pageSize: 100,
                    dataScope: '1',
                    riskDate:this.reportDate.riskTime,
                    userCode: sessionStorage.getItem("userCode"),
                }
                let {code,list} = await this.sequipServiceNew.getElevatorList(form)
                if(code === '0000' && list.length !== 0) {
                    this.data = list.map(item=>{
                        item.checkBox = false
                        item.dataFlag = 'biaoDi'
                        item.startDate = item.policyInfo.polStartDate.split(' ')[0]
                        item.endDate = item.policyInfo.polEndDate.split(' ')[0]
                        return item
                    })
                } else if(code === '0000' && list.length == 0) {
                    this.data = []
                    this.$message.warning('暂无数据')
                }
            } else if(this.form.searchType === 'propertyName') { // 物业名称
                let length = this.form.searchValue.length 
                if(length<1 || length>50){
                    this.$message.error('物业项目名称长度为1到50位（含）')
                    return
                }
                this.data = []
                this.clearInput('top')
                let form = {
                    name: this.form.searchValue,
                    pageNum: 1,
                    pageSize: 100,
                    dataScope: '1',
                    riskDate:this.reportDate.riskTime,
                    userCode: sessionStorage.getItem("userCode"),
                }
                let {code,list} = await this.sequipServiceNew.getPropertyList(form)
                if(code === '0000' && list.length !== 0) {
                    this.data = list.map(item=>{
                        item.checkBox = false
                        item.dataFlag = 'biaoDi'
                        item.startDate = item.policyInfo.polStartDate.split(' ')[0]
                        item.endDate = item.policyInfo.polEndDate.split(' ')[0]
                        return item
                    })
                } else if(code === '0000' && list.length == 0) {
                    this.data = []
                    this.$message.warning('暂无数据')
                }

            }
        },
        // 清空input里面内容
        clearInput(clearFlag){
            if(clearFlag == 'top') {
                this.form.policyNo = ''
                this.form.policyHolder = ''
            } else if(clearFlag == 'bottom') {
                this.form.searchType = ''
                this.form.searchValue = ''
            }
        },
        // 选择保单
        choosePolicy(row,index) {
            this.data.map((item,subIndex) => {
                if(item.policyNo == row.policyNo) {
                    item.checkBox = true;
                } else {
                    item.checkBox = false;
                }
            })
        },
        // 获取input的value
        getSerachValue(value){
            if(this.form.searchType === value) {
                return this.form.searchValue
            } else {
                return ''
            }
        },
        clearData(){
            this.data = []
        },
        // 取消
        close(){
            this.form = {
                searchType:'',
                policyNo:'',
                policyHolder:'',
                searchValue:'',
                activeName2:'',
            }
            this.data = []
            this.exhibition = false
        },
        // 确认关联
        relationpolicyNo(){
            let formData = this.data.find(item=>item.checkBox === true)
            if(formData){
                if(formData.dataFlag === 'policy') {
                    this.setPolicyInfo(formData)
                    this.close()
                } else if(formData.dataFlag === 'biaoDi') {
                    this.setPolicyInfo(formData.policyInfo)
                    if(
                        formData.policyInfo.productCategory === 'DT' ||
                        formData.policyInfo.productCategory === 'SD' ||
                        formData.policyInfo.productCategory === 'WY' ||
                        formData.policyInfo.productCategory === 'YJSP'
                    ){
                        this.setBiaoDiInfo(formData)
                    } else {
                        this.setPersonInfo(formData)
                    }
                    this.close()
                }
            } else {
                this.$message.error('请选择保单')
            }
        },
        setPolicyInfo(formData){
            let form = {
                "appCode":formData.appCode , // 投保单号
                "policyNo":formData.policyNo, // 保单号
                "holderName":formData.holderName, // 投保人
                "holderCode":formData.holderCode, // 投保人code
                "insuredCompanyId":formData.insuredCompanyId, // 被保险企业id(出险企业)
                "insuredCompany":formData.insuredCompany, // 被保险企业(出险企业)
                "issueCompanyCode":formData.issueCompanyCode, // 出单公司编码
                "issueCompanyName":formData.issueCompanyName, // 出单公司名称
                "productCode":formData.productCode, // 产品编码
                "productName":formData.productName, // 产品名称
                "industryType":formData.industryType, // 行业编码
                "industryTypeName":formData.industryTypeName, // 行业名称
                "productCategory":formData.productCategory, // 险类
                "productCategoryName":formData.productCategoryName, // 险种名称
                "polStartDate":formData.polStartDate, // 保险起期
                "polEndDate":formData.polEndDate, // 保险止期
                "premium":formData.premium, // 保费
                "cumulativeLimit":formData.insuranceAmount, // 累计责任限额
                "insuranceAmount":formData.insuranceAmount, // 累计责任限额
                "fromSys":formData.fromSys, // 数据来源,特社保,江泰e保
                "contactPerson":formData.contactPerson || '', // 联系人
                "contactPhone":formData.contactPhone || '', // 联系电话
                "areaCode": formData.areaCode, // 区
                "areaName": formData.areaName, // 区
                "cityCode": formData.cityCode, // 市
                "cityName": formData.cityName, // 市
                "provinceCode":formData.provinceCode, // 省
                "provinceName":formData.provinceName, // 省
                "branchCode":formData.branchCode, // 省
                "branchCode":formData.branchCode, // 省
                "branchName":formData.branchName, // 省
            }
            this.policyInfoSave(form)
        },
        setBiaoDiInfo(formData){
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
            }
            this.targetInfoSave(obj)
        },
        setPersonInfo(formData){
            if(formData.licenceType == '1'){
                let obj = {
                    riskPersonType:'从业人员',
                    riskPersonName:formData.name,
                    identityCardNumber:formData.licenceNo,
                }
                this.saveInsuredInfo(obj)
            } else {
                this.$message.warning('该标的信息的证件号不是身份证，请手动补全出险人信息')
            }
        },
	},
}
</script>

<style lang="less">
#caseRelationPolicy {
    .display-flex {
        display: flex;
    }
    .w120 {
        width: 120px;
    }
    .w200 {
        width: 200px;
    }
    .btn{
		text-align: right;
		width: 100%;
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
    .con-row{
        color: #000;
        height: 40px;
        line-height: 40px;
        padding: 0 5px;
        .con-col {
            height: 40px;
            line-height: 40px;
        }
        .col-span-l {
            height: 40px;
            line-height: 40px;
            display: inline-block;
            color: #919191;
            overflow:hidden;
        }
        .see-button {
            padding: 0;
        }
        .color-0050B3 {
            color: #0050B3;
        }
        .col-span-r {
            height: 40px;
            line-height: 40px;
            display: inline-block;
            width: calc(100% - 100px);
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow:ellipsis;
        }
    }
}
</style>
