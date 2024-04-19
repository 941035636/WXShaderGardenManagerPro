<template>
    <div id="Distribution">
        <el-dialog title="手动分配服务人员" :visible.sync="dialogVisible" width="700px">
            <div class="distribution" style="color: #000">
                <div class="distribution-item">
                    <div class="distribution-item-title">
                        <span>案件信息</span>
                    </div>
                    <div class="distribution-item-title">
                        <el-row type="flex" style="margin: 10px 0;">
                            <el-col :span="16">
                                <p>出险单位: {{ paramsData.riskUnit }}</p>
                            </el-col>
                            <el-col :span="16">
                                <p>所属机构: {{ paramsData.sortingBranchName }}</p>
                            </el-col>
                        </el-row>
                        <el-row type="flex" style="margin: 10px 0;">
                            <el-col :span="16">
                                <p>保单号: {{ paramsData.policyNo }}</p>
                            </el-col>
                            <el-col :span="16">
                                <p>报案号: {{ paramsData.insuredCompanyReportNo }}</p>
                            </el-col>
                        </el-row>
                        <el-row type="flex" style="margin: 10px 0;">
                            <el-col :span="16">
                                <p>报案人姓名: {{ paramsData.reportName }}</p>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
                    <div style="width:640px; background-color: #FFF7E6;padding: 0 10px;height: 90px;line-height: 30px;color: #FA8C16;border-radius: 8px;margin-top: 6px;">
                        <p>1、此处“投保人 / 被保人名称”请正确填写；案件处理/关联保单，校验一致性。</p>
                        <p>2、电梯、雇主、团意、索道：填写投保人名称 </p>
                        <p>3、物业、家政：填写被保人名称</p>
                    </div>
                    <el-form-item label="投/被保人名称" class="form-item" prop="holderName">
                    <el-input v-model.trim="ruleForm.holderName" size="small" class="W240" placeholder="请输入"></el-input>
                    </el-form-item>
                        <el-form-item label="出险地点"  class="form-item" prop="areaSelectList">
                            <!-- <p style="margin-right: 20px">{{ paramsData.riskProvinceName }}/{{ paramsData.riskCityName }}/{{ paramsData.riskAreaName }}</p> -->
                            <el-cascader :options="optionsArea" placeholder="请选择"  v-model="ruleForm.areaSelectList" size="small" clearable @change="setArea"></el-cascader>
                                <el-form-item  prop="riskAddr">
                                <el-input v-model="ruleForm.riskAddr" class="W320" size="small" placeholder="请输入详细地址"></el-input>
                            </el-form-item>
                        </el-form-item>
                    <el-form-item label="报案人电话" class="form-item" prop="reportPhone">
                        <el-input v-model="ruleForm.reportPhone" class="W240" size="small" placeholder="请输入电话"></el-input>
                    </el-form-item>
                    <div class="distribution-item-title" style="margin-bottom: 10px">
                        <span>分配服务人员</span>
                    </div>
                    <el-form-item label="所在机构" class="form-item" prop="jtBranchCode">
                        <el-select class="W240" v-model="ruleForm.jtBranchCode" @change="branchChange" size="small" placeholder="请选择">
                            <el-option v-for="item in branchList" :key="item.value" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-table id="distribution-table" :data="branchPersonList" border :header-cell-style="distributionTableHeader" style="width: 100%; margin-top: 20px">
                        <el-table-column label="选择" width="50" align="center">
                            <template slot-scope="scope">
                                <div>
                                    <el-radio v-model="scope.row.choosePeo" :label="true" @change.native="getCurrentRow(scope.row)"></el-radio>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="服务人员姓名" width="180"></el-table-column>
                        <el-table-column prop="name" label="电话"></el-table-column>
                        <el-table-column prop="date" label="备注"></el-table-column>
                    </el-table>
                    <el-form-item style="margin-top: 30px;margin-bottom: 0px;text-align: right;">
                        <el-button round class="close" @click="close">取消</el-button>
                        <el-button round class="submit" @click="submitForm('ruleForm')">确认提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Claim from '@/service/claim'
import {elevator} from '@/server/accidenServer.js';
import CaseService from '@/service/CaseService.js';
import CaseServiceNew from '@/service/CaseServiceNew.js';
export default {
    name: "Distribution",
    props: {
        params: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        var checkPhone = (rule, value, callback) => {
            const phoneReg = /^1[0-9]{10}$/
            if (!value) {
                return callback(new Error('手机号码不能为空'))
            }
            setTimeout(() => {
                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'))
                } else {
                    if (phoneReg.test(value)) {
                        callback()
                    } else {
                    callback(new Error('手机号码格式不正确'))
                    }
                }
            }, 100)
        };
        return {
            Elevator:new elevator(),
            claim: new Claim(),
            CaseService: new CaseService(),
            CaseServiceNew: new CaseServiceNew(),
            dialogVisible:false,
            value: '',
            ruleForm: {},
            rules: {},
            currentRow: 0,
            policyInfo:{},  // 保单详情
            ruleForm: {
                holderName:'',  // 投被保人名称
                jtBranchCode:'',
                jtBranchName:'',
                servicerCode:'',
                servicerPhone:'',
                servicerName:'',
                userCode:'',
                userName:'',
                userTel:'',
                departmentCode:'',  // 部门编码 ,
                departmentName:'',  // 部门名称
                reportPhone:'', // 报案人电话
                // reportName:'', // 报案人电话
                riskAddr:'',    // 出险地具体地址
                riskProvince:'',
                riskProvinceName:'',
                riskCity:'',
                riskCityName:'',
                riskArea:'',
                riskAreaName:'',
                areaSelectList:[],
            },
            paramsData: {},
            branchList: [],
            branchPersonList: [],
            optionsArea:[],
            rules: {
                holderName: [
                    {
                        required: true,
                        message: "请选择服务人员所在机构",
                        trigger: "blur"
                    }
                ],
                jtBranchCode: [
                    {
                        required: true,
                        message: "请选择服务人员所在机构",
                        trigger: "change"
                    }
                ],
                servicerCode: [
                    { required: true, message: "请选择服务人员", trigger: "change" }
                ],
                areaSelectList: [
                    { required: true, message: "出险地址不能为空", trigger: "change" }
                ],
                riskAddr: [
                    { required: true, message: "请输入具体地址", trigger: "blur" },
                    {
                        min: 1,
                        max: 300,
                        message: "长度在 1 到 300 个字符",
                        trigger: "blur",
                    },
                ],
                reportPhone:[{required: true,validator: checkPhone,trigger: 'blur'}],
            }
        }
    },
    watch: {
        params: {
            handler(newValue) {
                // this.paramsData  = newValue
                // this.branchList = JSON.parse(window.sessionStorage.getItem('branchLists'))
                // this.queryPersonByJtBranchCode(this.branchList[0].jtBranchCode)
                // this.openInit(newValue)
            },
            deep: true,
            immediate:true
        },
    },
    created(){
        this.getArea()
    },
    methods: {
        async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.optionsArea = parmes.data;
			};
		},
        openInit(row){
            this.paramsData = row
            this.ruleForm.holderName = row.holderName
            this.ruleForm.riskProvince = row.riskProvince
            this.ruleForm.riskProvinceName = row.riskProvinceName
            this.ruleForm.riskCity = row.riskCity
            this.ruleForm.riskCityName = row.riskCityName
            this.ruleForm.riskArea = row.riskArea
            this.ruleForm.riskAreaName = row.riskAreaName
            this.ruleForm.areaSelectList = [row.riskProvince,row.riskCity,row.riskArea]
            this.branchList = JSON.parse(window.sessionStorage.getItem('branchLists'))
            let jtBranchCode = window.sessionStorage.getItem('branchCode') || this.branchList[0].jtBranchCode
            let jtBranchName = window.sessionStorage.getItem('branchName') 
            this.ruleForm.jtBranchCode = jtBranchCode
            this.ruleForm.jtBranchName = jtBranchName
            this.queryPersonByJtBranchCode(jtBranchCode)
            this.setPolicyDetails(row.policyNo,row.riskTime)
            
        },
        // 查询保单详情
        async setPolicyDetails(policyNo,riskTime){
            let form = {
                "insuredCompany":'',
                "policyNo":policyNo ,
                riskTime:riskTime,
                }
            let {code,data} = await this.CaseServiceNew.getPolicyInfo(form)
            if(code === '0000' && data.length && policyNo && riskTime) {
                this.dialogVisible=true
                this.policyInfo = data.map(item=>{
                    item.checkBox = false
                    item.dataFlag = 'policy'
                    item.startDate = item.polStartDate.split(' ')[0]
                    item.endDate = item.polEndDate.split(' ')[0]
                    return item
                })[0]
            } else {
                this.$message.error('查询不到保单信息，无法完成认领')
            }
        },
        // 选中分支机构做处理
        branchChange(val) {
            this.ruleForm.jtBranchCode = val;
            this.ruleForm.jtBranchName = this.branchList.find(
                item => item.jtBranchCode == val
            ).jtBranchName;
            this.ruleForm.servicerCode = "";
            this.ruleForm.servicerPhone = "";
            this.ruleForm.servicerName = '';
            this.queryPersonByJtBranchCode(val)
        },
        submitForm(data) {
            this.$refs[data].validate((valid) => {
				if (valid) {
					this.submitBy400()
				} else {
					console.log('error submit!!');
					return false;
				}
			});
        },
        close() {
            this.ruleForm.reportPhone = ''
            this.ruleForm.servicerName = '';
            this.ruleForm.servicerPhone = '';
            this.ruleForm.servicerCode = '';
            this.ruleForm.servicerRemarks = '';
            this.ruleForm.userCode = '';
            this.ruleForm.userName = '';
            this.ruleForm.userTel = '';
            this.ruleForm.departmentCode = ''
            this.ruleForm.departmentName = ''
            this.ruleForm.riskAddr = ''
            this.ruleForm.riskAddr = ''
            this.ruleForm.jtBranchCode = ''
            this.ruleForm.jtBranchName = ''
            this.dialogVisible=false
            this.$refs['ruleForm'].resetFields();
        },
        getCurrentRow(row) {
            this.branchPersonList.forEach(item => {
                if(item.userCode != row.userCode) {
                    item.choosePeo = false;
                } else {
                    item.choosePeo = true;
                }
            })
            this.ruleForm.servicerName = row.name;
            this.ruleForm.servicerPhone = row.phone;
            this.ruleForm.servicerCode = row.userCode;
            this.ruleForm.servicerRemarks = row.remarks;
            this.ruleForm.userCode = this.ruleForm.servicerCode;
            this.ruleForm.userName = this.ruleForm.servicerName;
            this.ruleForm.userTel = this.ruleForm.servicerPhone;
            this.ruleForm.departmentCode = row.departmentCode
            this.ruleForm.departmentName = row.departmentName
        },
        distributionTableHeader({ row, column, rowIndex, columnIndex }) {
            return rowIndex == 0 ? 'background: #E8E8E8' : ''
        },
        async queryPersonByJtBranchCode(branchCode) {
            let data = {
				branchCode: branchCode,
				roleCode: process.env.ROOT_ROLECODE,
			}
            let { code, list } = await this.claim.queryPersonByJtBranchCode(data)
            if(code == '0000') {
                this.branchPersonList = list.map(item=>({...item,choosePeo:false}))
            }
        },
        setArea(v){
            if(v && v.length > 0){
                let [v1,v2,v3] = v 
                let province = this.optionsArea.find(item=>item.value == v1)
                let city = province.children.find(item=>item.value == v2)
                let area = city.children.find(item=>item.value == v3)
                this.ruleForm.riskProvince = v1
                this.ruleForm.riskCity = v2
                this.ruleForm.riskArea = v3
                this.ruleForm.riskProvinceName = province.label
                this.ruleForm.riskCityName = city.label
                this.ruleForm.riskAreaName = area.label
            } else {
                this.ruleForm.riskProvince = ''
                this.ruleForm.riskCity = ''
                this.ruleForm.riskArea = ''
                this.ruleForm.riskProvinceName = ''
                this.ruleForm.riskCityName = ''
                this.ruleForm.riskAreaName = ''
            }
            
        },

        async submitBy400(){
            let from = {   
                "platform":"ts",//wx,ts,case
                "reportNo":'',
                "reportTime":this.paramsData.reportTime,//报案时间
                "reportType":'认领',//报案方式
                "reportName":this.paramsData.reportName, // 报案人姓名
                "reportUserPhone":this.ruleForm.reportPhone, // 报案人手机号
                "linkmanName":"", // 联系人姓名
                "linkmanPhone":"", // 联系人电话
                "holderName":'', // 投保人
                "hasPolicyInfo":true,// 是否有保单
                "noPolicyInfoReason":'' ,// 无保单原因
                "enteredUserCode":sessionStorage.getItem("userCode"), // 录入人id
                "enteredUser":sessionStorage.getItem("userName"), // 录入人
                "enteredTime":"", // 录入时间

                "hasTransferCase":true,// 是否已转报案
                "noTransferCodeReason":'' ,//未取得保司报案号原因
                "transferringTheCaseTime":this.paramsData.reportTime, // 转报案时间
                "inscompReportNo":this.paramsData.insuredCompanyReportNo, // 保司报案号
                "sitCode":'对接数据无', // 坐席编号
                "serverCode":this.ruleForm.userCode, // 受理人-案件处理人员编码
                "serverName":this.ruleForm.userName, // 受理人-案件处理人员姓名
                "serverPhone":this.ruleForm.userTel, // 受理人-案件处理人员电话
                "serverOrganization":this.ruleForm.jtBranchCode, // 受理人机构-案件处理人员所在机构(服务人员)
                "serverDepartment":this.ruleForm.departmentCode, // 受理人部门-案件处理人员所在机构(服务人员)
                "serverOrganizationName":this.ruleForm.jtBranchName, // 受理人机构-案件处理人员所在机构(服务人员)
                "serverDepartmentName":this.ruleForm.departmentName, // 受理人部门-案件处理人员所在机构(服务人员)
                "riskInfo":{
                    "riskTime":this.paramsData.riskTime, // 出险时间
                    "riskProvince":this.ruleForm.riskProvince, // 出险地所在省份编码
                    "riskProvinceName":this.ruleForm.riskProvinceName, // 出险地所在省份
                    "riskCity":this.ruleForm.riskCity, // 出险地所在市编码
                    "riskCityName":this.ruleForm.riskCityName, // 出险所在城市
                    "riskArea":this.ruleForm.riskArea, // 出险地所在区县编码
                    "riskAreaName":this.ruleForm.riskAreaName, // 出险所在区县
                    "riskAddr":this.ruleForm.riskAddr, // 出险地具体地址
                    "accidentType":[], // 案件类型 tmp 01:死亡 02:伤残 03:一般人伤 04:滞留 05:第三者财产 06:其他
                    "accidentReason":'', // 事故原因
                    "accidentSite":'', // 事故场所
                    "faultType":'', // 故障原因
                    "insuranceType":"", // 报案险种,责任险,电梯责任险
                    "remark":this.paramsData.accidentsAndLosses,//备注
                    // 出险人信息列表
                    "injuredList":[]
                },
                "targetInfo":{
                    "elevatorType":'',//电梯类型
                    "elevatorId":'',//设备代码
                    "factoryNumber":'',// 出厂编码
                    "elevatorCompany":'',//使用单位
                    "elevatorMunicipalDistrict":'',//市辖区
                    "elevatorAddr":'',//详细地址
                    "cablewayId":'',//设备代码
                    "cablewayName":'',//索道名称
                    "cablewayType":'',//索道类别
                    "propertyName":'',//物业项目名
                    "propertyAddr":'',//市辖区
                    "propertyMunicipalDistrict":'',//详细地址
                    "propertyType":'',//物业类型
                    "businessMunicipalDistrict":'',//商户市辖区
                    "businessAddr":'',//商户详细地址
                },
                "policyInfo":{
                    "appCode":this.policyInfo.appCode , // 投保单号
                    "policyNo":this.policyInfo.policyNo, // 保单号
                    "holderName":this.ruleForm.holderName, // 投保人
                    "holderCode":this.policyInfo.holderCode, // 投保人code
                    "insuredCompanyId":this.policyInfo.insuredCompanyId, // 被保险企业id(出险企业)
                    "insuredCompany":this.policyInfo.insuredCompany, // 被保险企业(出险企业)
                    "issueCompanyCode":this.policyInfo.issueCompanyCode, // 出单公司编码
                    "issueCompanyName":this.policyInfo.issueCompanyName, // 出单公司名称
                    "productCode":this.policyInfo.productCode, // 产品编码
                    "productName":this.policyInfo.productName, // 产品名称
                    "industryType":this.policyInfo.industryType, // 行业编码
                    "industryTypeName":this.policyInfo.industryTypeName, // 行业名称
                    "productCategory":this.policyInfo.productCategory, // 险类
                    "productCategoryName":this.policyInfo.productCategoryName, // 险种名称
                    "polStartDate":this.policyInfo.polStartDate, // 保险起期
                    "polEndDate":this.policyInfo.polEndDate, // 保险止期
                    "premium":this.policyInfo.premium, // 保费
                    "cumulativeLimit":this.policyInfo.insuranceAmount, // 累计责任限额
                    "insuranceAmount":this.policyInfo.insuranceAmount, // 累计责任限额
                    "fromSys":this.policyInfo.fromSys, // 数据来源,特社保,江泰e保
                    "contactPerson":this.policyInfo.contactPerson || '', // 联系人
                    "contactPhone":this.policyInfo.contactPhone || '', // 联系电话
                    "areaCode": this.policyInfo.areaCode, // 区
                    "areaName": this.policyInfo.areaName, // 区
                    "cityCode": this.policyInfo.cityCode, // 市
                    "cityName": this.policyInfo.cityName, // 市
                    "provinceCode":this.policyInfo.provinceCode, // 省
                    "provinceName":this.policyInfo.provinceName, // 省
                    "branchCode":this.policyInfo.branchCode, // 省
                    "branchCode":this.policyInfo.branchCode, // 省
                    "branchName":this.policyInfo.branchName, // 省
                },
            }
             let {code,data} = await this.CaseServiceNew.caseCommit(from)
             if(code == '0000') {
                this.$message.success('录入成功')
                this.close()
                this.insertCaseAssociation(data.caseNo,data.reportNo)
            }
        },
        // 江泰的案件和保险公司的案件做关联
        async insertCaseAssociation(caseNo,reportNo){
            let data = {
                "caseDockingId": this.paramsData.id,  // 关联案件对接表ID
                "caseNo": caseNo, // 案件号
                "insuredCompanyCaseNo": this.paramsData.insuredCompanyCaseNo, // 保险公司案件号
                "insuredCompanyName": this.paramsData.fromSys, // 保险公司名称
                "insuredCompanyReportNo": this.paramsData.insuredCompanyReportNo, // 保险公司报案号
                "referenceStatus": "1",    // 引用类型（1.已认领、2.已认领引用结案、3.已关联引用结案、4.引用结案）
                "relationStatus": "2", // 关联类型（1.已报江泰、2.已认领、3.已关联）
                "reportNo": reportNo    // 报案号
            }
            let res = await this.claim.insertCaseAssociation(data)
            if(res.code === '0000'){
                this.updateCaseStatus()
            }
        },
        // 修改对接案件引用状态
        async updateCaseStatus(){
            let data = {
                id:this.paramsData.id,
                referenceOperator:window.sessionStorage.getItem('userCode'),
                referenceOperatorName:window.sessionStorage.getItem('userName'),
                referenceStatus:'3',
            }
            await this.claim.updateCaseStatus(data)
            this.$emit('successCb')
        },
    }
}
</script>

<style lang="less" scoped>
#Distribution {
    .distribution-item {
        padding-bottom: 10px;
        border-bottom: 1px dashed #bbb;
        font-size: 14px;
    }
    .distribution-item-title {
        margin-bottom: 20px;
        margin-top: 10px;
        span {
            font-size: 15px;
            font-weight: bold;
        }
    }
}
</style>
<style>
#distribution-table  .el-table__header-wrapper .el-table__header thead th {
    padding: 6px 0;
}

#distribution-table  .el-table__header-wrapper .el-table__header thead tr th {
    border-right: 0;
}

#distribution-table  .el-table__body-wrapper .el-table__body tr td {
    padding: 8px 0;
}

#distribution-table  .el-table__body-wrapper .el-table__body tr td .el-radio__label {
    display: none;
}
</style>