<template>
  <!-- 关联保单 -->
	<div class="updataCaseAppearDetails" id="updataCaseAppearDetails">
		 <el-dialog title="出险信息变更" :visible.sync="dialogVisible" width="800px" destroy-on-close :close-on-click-modal='false'>
            <el-form :model="caseInfoForm" ref="caseInfoForm" label-width="130px" :rules="rules">
                <h5 class="ml20" style="width: 150px; vertical-align: middle; font-size: 14px; color: #096DD9; font-weight: 600;  padding-left: 12px; box-sizing: border-box; font-weight: 700; border-left: 4px #096DD9 solid;">出险信息</h5>
                <div class="display-flex">
                    <el-form-item label="出险时间:" prop="riskTime">
                        <el-input type="text" v-model="caseInfoForm.riskTime" disabled size="mini"></el-input>
                    </el-form-item>
                </div>
                <div class="display-flex">
                    <el-form-item label="出险地点:" prop="area">
                        <el-cascader :options="areaOptions" placeholder="请选择" @change="areaChange"  clearable v-model="caseInfoForm.area" size="mini"></el-cascader>
                    </el-form-item>
                    <el-form-item label-width="0" class="ml20" prop="riskAddr">
                        <el-input v-model="caseInfoForm.riskAddr" size="mini"></el-input>
                    </el-form-item>
                </div>
                <div class="display-flex">
                    <el-form-item label="案件类型:" prop="accidentType" >
                        <el-select v-model="caseInfoForm.accidentType" size="mini" multiple>
                           <el-option v-for="item in accidentType" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="事故原因:" prop="accidentReasonArea" >
                        <el-cascader 
                            size="small"
                            class="w240" 
                            :options="accidentReason" 
                            placeholder="请选择" 
                            clearable 
                            v-model="caseInfoForm.accidentReasonArea" 
                            filterable 
                            :props="{
                                label: 'field',
                                value: 'field',
                                children: 'child',
                            }"
                        ></el-cascader>
                    </el-form-item>
                </div>
                <div class="display-flex" v-if="policyInfoVo.productCategoryCode && policyInfoVo.productCategoryCode === 'DT'">
                    <el-form-item label="事故场所:" prop="accidentSite" >
                        <el-select v-model="caseInfoForm.accidentSite" size="mini">
                            <el-option v-for="item in faultSite" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="故障类型:" prop="faultType" >
                        <el-select v-model="caseInfoForm.faultType" size="mini">
                            <el-option v-for="item in faultReason" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <h5 class="ml20" style="width: 150px; vertical-align: middle; font-size: 14px; color: #096DD9; font-weight: 600;  padding-left: 12px; box-sizing: border-box; font-weight: 700; border-left: 4px #096DD9 solid;">报案信息</h5>
                <div class="display-flex">
                    <el-form-item label="报案人" prop="reportName" >
                        <el-input v-model="caseInfoForm.reportName" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话:" prop="reportPhone">
                        <el-input v-model="caseInfoForm.reportPhone" size="mini"></el-input>
                    </el-form-item>
                </div>
                <div class="display-flex">
                    <el-form-item label="联系人姓名">
                         <el-input v-model="caseInfoForm.linkmanName" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" >
                       <el-input v-model="caseInfoForm.linkmanPhone" size="mini"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div class="btn">
                <span class="btn-left" @click="dialogVisible = false">取消</span>
                <span class="btn-right" @click="onSubmit('caseInfoForm')">确认提交</span>
            </div>
        </el-dialog>
	</div>
</template>

<script>
import { mapGetters,mapActions } from 'vuex';
import CaseServiceNew from '@/service/CaseServiceNew'
export default {
     computed: {
        ...mapGetters([
            'caseInfo',
            'riskInfo',
            'areaOptions',
            'accidentType',
            'accidentReason',
            'faultSite',
            'faultReason',
            'policyInfoVo'
        ])
    },
	data() {
        var checkPhone = (rule, value, callback) =>{
            var patrn1 = /^(1[3-9]\d{9}$)/;
            var patrn = /^(([0-9]{3,4}[-])?[0-9]{7,8}$)/;
            if (value === '') {
                callback(new Error('请输入手机号或座机号'))
            } else if (value && value.indexOf("-") == -1 && !patrn1.test(value)) {
                callback(new Error('请输入正确的手机号或座机号'));
            } else if (value && !patrn.test(value) && value.indexOf("-") > -1) {
                callback(new Error('请输入正确的座机号，例如:0512-67512345'));
            } else {
                callback();
            }
        };
		return {
           dialogVisible:false,
           CaseServiceNew:new CaseServiceNew(),
           caseInfoForm:{
                area:[],
                riskTime:'',
                riskProvinceName: "",
                riskCityName: "",
                riskAreaName: "",
                riskProvince: "",
                riskCity: "",
                riskArea: "",
                riskAddr:'',
                accidentType:[],
                accidentReasonArea:"", // 事故原因
                accidentSite:"", // 事故场所
                faultType:"", // 故障原因
                remark:"",//备注
                reportName:"",
                reportPhone:"",
                linkmanName:"",
                linkmanPhone:"",
            },
            rules: {
               area: [
                    { required: true, message: "请选择出险地区", trigger: "change" }
                ],
                riskAddr: [
                    { required: true, message: "请填写详细地址", trigger: "change" }
                ],
                accidentType: [
                    { required: true, message: "请选择案件类型", trigger: "change" }
                ],
                accidentReasonArea: [
                    { required: true, message: "请选择事故原因", trigger: "change" }
                ],
                accidentSite: [
                    { required: true, message: "请选择事故场所", trigger: "change" }
                ],
                faultType: [
                    { required: true, message: "请选择故障原因", trigger: "change" }
                ],
                linkmanName: [
                    { required: false, message: "请填写联系人姓名", trigger: "change" },
                    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
                ],
                linkmanPhone: [
                    { required: false, validator: checkPhone, trigger: "change" }
                ],
                reportName: [
                    { required: true, message: "请填写报案人姓名", trigger: "blur" },
                    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
                ],
                reportPhone: [
                    { required: true, validator: checkPhone, trigger: "blur" }
                ],
            },
        }
	},
	created(){},
	methods: {
        ...mapActions(['riskInfoSave']),
        // 初始化数据
        openInit(val) {
            this.dialogVisible = true;
            this.caseInfoForm.riskTime = this.riskInfo.riskTime
            this.caseInfoForm.riskProvinceName = this.riskInfo.riskProvinceName
            this.caseInfoForm.riskCityName = this.riskInfo.riskCityName
            this.caseInfoForm.riskAreaName = this.riskInfo.riskAreaName
            this.caseInfoForm.riskProvince = this.riskInfo.riskProvince
            this.caseInfoForm.riskCity = this.riskInfo.riskCity
            this.caseInfoForm.riskArea = this.riskInfo.riskArea
            this.caseInfoForm.riskAddr = this.riskInfo.riskAddr
            this.caseInfoForm.accidentReasonArea = this.riskInfo.accidentReason?this.riskInfo.accidentReason.split('/'):[]
            this.caseInfoForm.accidentSite = this.riskInfo.accidentSite
            this.caseInfoForm.faultType = this.riskInfo.faultType
            this.caseInfoForm.reportName = this.riskInfo.reportName
            this.caseInfoForm.reportPhone = this.riskInfo.reportPhone
            this.caseInfoForm.linkmanName = this.riskInfo.linkmanName
            this.caseInfoForm.linkmanPhone = this.riskInfo.linkmanPhone
            this.caseInfoForm.remark = this.riskInfo.remark
            this.caseInfoForm.area = [
                this.riskInfo.riskProvince,
                this.riskInfo.riskCity,
                this.riskInfo.riskArea,
            ]
            this.$set(this.caseInfoForm,'accidentType',this.riskInfo.accidentType)
        },
        areaChange(val) {
            // 地区处理（编码转中文，省市区编码和名称赋值）
            let area = val ? val : this.caseInfoForm.area;
            this.areaOptions.forEach(item => {
                if (item.value == area[0]) {
                    this.caseInfoForm.riskProvinceName = item.label;
                    this.caseInfoForm.riskProvince = area[0];
                    item.children.forEach(it => {
                        if (it.value == area[1]) {
                            this.caseInfoForm.riskCityName = it.label;
                            this.caseInfoForm.riskCity = area[1];
                            if (it.children != undefined) {
                                it.children.forEach(val => {
                                if (val.value == area[2]) {
                                    this.caseInfoForm.riskAreaName = val.label;
                                    this.caseInfoForm.riskArea = area[2];
                                }
                                });
                            }
                        }
                        
                    });
                }
            })
        },
        // 取消
        close(){
            this.dialogVisible = false,
            this.caseInfoForm = {
                area:[],
                riskTime:'',
                riskProvinceName: "",
                riskCityName: "",
                riskAreaName: "",
                riskProvince: "",
                riskCity: "",
                riskArea: "",
                riskAddr:'',
                accidentType:[],
                accidentReasonArea:"", // 事故原因
                accidentSite:"", // 事故场所
                faultType:"", // 故障原因
                remark:"",//备注
                reportName:"",
                reportPhone:"",
                linkmanName:"",
                linkmanPhone:"",
            }
        },
        // 确认关联
        onSubmit(name){
            this.$refs[name].validate((valid) => {
				if (valid) {
					this.submitOverFun()
				} else {
					return false;
				}
			});
        },
        async submitOverFun(){
            let form = {
                "linkmanName": this.caseInfoForm.linkmanName,
                "linkmanPhone": this.caseInfoForm.linkmanPhone,
                "platform": 'sys_sequip_man',
                "reportName": this.caseInfoForm.reportName,
                "reportNo": this.caseInfo.reportNo,
                "reportUserPhone": this.caseInfoForm.reportPhone,
                "riskInfo": {
                    "accidentReason": this.caseInfoForm.accidentReasonArea.join('/'),
                    "accidentSite": this.caseInfoForm.accidentSite,
                    "accidentType": this.caseInfoForm.accidentType,
                    "faultType": this.caseInfoForm.faultType,
                    
                    "remark": this.caseInfoForm.remark,
                    "riskAddr": this.caseInfoForm.riskAddr,
                    "riskArea": this.caseInfoForm.riskArea,
                    "riskAreaName": this.caseInfoForm.riskAreaName,
                    "riskAreaTotal": "",
                    "riskCity": this.caseInfoForm.riskCity,
                    "riskCityName": this.caseInfoForm.riskCityName,
                    "riskProvince": this.caseInfoForm.riskProvince,
                    "riskProvinceName": this.caseInfoForm.riskProvinceName,
                    "riskTime": this.caseInfoForm.riskTime
                }
            }
            let code = await this.riskInfoSave(form)
            if(code==='0000'){
                this.dialogVisible = false
                this.close()
            }
        },
	},
}
</script>

<style lang="less">
#updataCaseAppearDetails {
    .el-form-item {
        margin-bottom: 10px;
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

}
</style>
