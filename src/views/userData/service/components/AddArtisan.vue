<template>
    <el-dialog class="serviceDialog" :title="'添加技术人员'" :append-to-body="true" :visible.sync="dialogVisible"
        :close-on-click-modal="false"  :before-close="handleClose" width="50%" @open="initData">
        <!-- @open="initData" @close="close" -->
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="210px">
            <el-form-item label="机构名称：" class="jigou-name">
                {{ orgName }}
            </el-form-item>
            <el-form-item label="自有/外聘：" prop="employType">
                <el-radio-group v-model="ruleForm.employType">
                    <el-radio v-for="item in expertEmployTypeEnum" :key="item.strCode" :label="item.strCode">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="姓名：" prop="safetyTechniciansName">
                <el-input v-model="ruleForm.safetyTechniciansName" class="w250" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="证件类型：" prop="safetyTechniciansCertificateType">
                <el-select v-model="ruleForm.safetyTechniciansCertificateType" class="w250" placeholder="请选择证件类型">
                    <el-option v-for="item in certificateType" :key="item.code" :label="item.label" :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="证件号码：" prop="safetyTechniciansCertificate">
                <el-input v-model="ruleForm.safetyTechniciansCertificate" class="w250" placeholder="请输入证件号码"></el-input>
            </el-form-item>
            <el-form-item label="主要服务项目：" prop="serviceAccidentType">
                <el-select v-model="ruleForm.serviceAccidentType" class="w250" multiple placeholder="请选择主要服务项目"
                    @change="changeService" @remove-tag="removeTag">
                    <el-option v-for="item in serviceItems" :key="item.strCode" :label="item.label"
                        :value="item.strCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="other" label="其他有关事故预防工作：	" prop="otherType">
                <el-input v-model="ruleForm.otherType" class="w250" placeholder="请输入其他有关事故预防工作"></el-input>
            </el-form-item>
            <el-form-item label="主要服务行业领域：" prop="industryParams">
                <el-select v-model="ruleForm.industryParams" class="w250" multiple placeholder="请选择职行业领域">
                    <el-option v-for="item in industryData" :key="item.itemValue" :label="item.itemText"
                        :value="item.itemValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="其他信息：" >
                <div style="display: flex; align-items: center;">
                    <el-switch v-model="switchValue" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
                <span>（可选）</span>
                </div>
            </el-form-item>
            <el-form-item v-if="switchValue">
                <div class="content">
                    <div class="content-title">
                        <div>选择内容</div>
                        <div>值</div>
                    </div>
                    <div class="content-box">
                        <div class="content-box-item">
                            <div class="items">联系电话</div>
                            <div class="item">
                                <el-input v-model="ruleForm.safetyTechniciansPhone" clearable class="w250" placeholder="请输入内容"
                                    size="mini"></el-input>
                            </div>
                        </div>
                        <div class="content-box-item">
                            <div class="items">职务/职称</div>
                            <div class="item">
                                <el-select v-model="ruleForm.safetyTechniciansPost" class="w250" size="mini"
                                    placeholder="请选择职务/职称">
                                    <el-option v-for="item in safetyPostEnum" :key="item.strCode" :label="item.label"
                                        :value="item.strCode"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="content-box-item">
                            <div class="items">最高学历</div>
                            <div class="item">
                                <el-input v-model="ruleForm.safetyTechniciansEducation1" size="mini" class="w250"
                                    placeholder="请输入最高学历"></el-input>
                            </div>
                        </div>
                        <div class="content-box-item">
                            <div class="items">专业</div>
                            <div class="item">
                                <el-input v-model="ruleForm.safetyTechniciansMajor" size="mini" class="w250"
                                    placeholder="请输入专业">
                                </el-input>
                            </div>
                        </div>
                        <div class="content-box-item">
                            <div class="items">从事安全生产工作年限：</div>
                            <div class="item">
                                <el-input v-model="ruleForm.safetyTechniciansSeniority" size="mini" class="w250"
                                    placeholder="请输入生产工作年限"></el-input>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="register">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { getIndustrys, getEnumslist } from '@/utils/index'
import {
    validatePhone,
    validateCharger,
    validatePersonCard,
    validateYears,
} from '@/utils/validateFrom'
import { getDictData } from '@/api/userManagement'
import { addExpert, putExpertinfos } from '@/api/userDataManagement'
import { flat } from '../../../../../mock/controller/menuManagement'
export default {
    name: 'ServiceAdd',
    data() {
        return {
            other: false,
            dialogVisible: false,
            ruleForm: {
                id: '',
                employType: '01',
                safetyTechniciansCertificate: '', // 证件号码 ,
                safetyTechniciansCertificateType: '', // 证件类型 ,
                safetyTechniciansCompany: '', // 所在单位 ,
                safetyTechniciansEducation1: '', // 最高学历 ,
                safetyTechniciansName: '', // 姓名 ,
                safetyTechniciansPhone: '', // 电话 ,
                safetyTechniciansPost: '', // 职务 ,
                safetyTechniciansMajor: '', // 专业
                safetyTechniciansSeniority: '', //  工作年限 ,
                serviceAccidentType: [], // 服务类型 ,
                otherType: '', //其他有关事故预防
                serviceAccidentTypes: [], // 服务类型集合 ,
                dataStatus: 1, // 状态
                industryParams: [], // 服务行业
                serviceIndustrys: [], // 接口入参行业集合
                orgId: '',
            },
            rules: {
                safetyTechniciansName: [
                    { required: true, validator: validateCharger, trigger: 'blur' },
                ],
                employType: [{ required: true, message: '请选择自有/外聘',trigger: 'blur' },],
                safetyTechniciansPhone: [
                    { required: true, validator: validatePhone, trigger: 'blur' },
                ],

                safetyTechniciansCertificateType: [
                    { required: true, message: '请选择证件类型', trigger: 'change' },
                ],
                safetyTechniciansCertificate: [
                    { required: true, validator: validatePersonCard, trigger: 'blur' },
                ],
                safetyTechniciansPost: [
                    { required: true, message: '请选择职务', trigger: 'change' },
                ],
                safetyTechniciansEducation1: [
                    { required: true, message: '请填写最高学历', trigger: 'blur' },
                    {
                        min: 1,
                        max: 30,
                        message: '最高学历只支持1到30位',
                        trigger: 'blur',
                    },
                ],
                safetyTechniciansMajor: [
                    { required: true, message: '请填写专业', trigger: 'blur' },
                    { min: 1, max: 30, message: '专业只支持1到30位', trigger: 'blur' },
                ],
                safetyTechniciansCompany: [
                    { required: true, message: '请填写所在单位', trigger: 'blur' },
                    {
                        min: 1,
                        max: 30,
                        message: '所在单位只支持1到30位',
                        trigger: 'blur',
                    },
                ],
                safetyTechniciansSeniority: [
                    {
                        required: true,
                        validator: validateYears,
                        trigger: 'blur',
                    },
                ],
                serviceAccidentType: [
                    { required: true, message: '请选择服务项目', trigger: 'change' },
                ],
                industryParams: [
                    { required: true, message: '请选择服务行业', trigger: 'change' },
                ],
                otherType: [
                    { required: true, message: '请填写其他服务行业', trigger: 'blur' },
                ],
            },
            switchValue: false,
            certificateType: [],
            safetyPostEnum: [],
            serviceItems: [],
            industryData: [],
            expertEmployTypeEnum: [],
            orgName: '',
        }
    },
    computed: {
        ...mapGetters({
            areaList: 'areas/areaList',
            areaListAll: 'areas/areaListAll',
            areaMap: 'areas/areaMap',
            getStrEnumAll: 'enums/getStrEnumAll',
        }),
    },
    methods: {
        initData() {
            // 获取字段表和枚举类
            this.getDict()
            this.safetyPostEnum = this.getStrEnumAll.SafetyTechniciansPostEnum
            this.certificateType = this.getStrEnumAll.CertificateTypeEnum
            this.serviceItems = this.getStrEnumAll.ServiceItemsEnum
            this.expertEmployTypeEnum = this.getStrEnumAll.ExpertEmployTypeEnum
        },
        async getDict() {
            let { code, data } = await getDictData(true, '20003')
            if (code == '0000') this.industryData = data
        },
        changeService(e) {
            if (e.lastIndexOf('07') != '-1') this.other = true
        },
        removeTag(e) {
            if (e == '07') {
                this.other = false
                this.ruleForm.otherType = ''
            }
        },
        async configRegister() {
            // 提交和修改方法
            let res = ''
            this.ruleForm.serviceIndustrys = getIndustrys(this.industryData, this.ruleForm.industryParams)
            this.ruleForm.serviceAccidentTypes = getEnumslist(
                this.serviceItems,
                this.ruleForm.serviceAccidentType,
                this.ruleForm.otherType
            )
            if (this.ruleForm.id) {
                res = await putExpertinfos(this.ruleForm)
            } else {
                res = await addExpert(this.ruleForm)
            }
            if (res.code === '0000') {
                this.$baseMessage(this.ruleForm.id ? '修改成功' : '添加成功', 'success')
                // this.toThisTag()
                this.handleClose()
                this.$parent.$parent.getOrgExpertDetail()
            }
        },

        register() {
            let text = '确定要新增技术人员？'
            if (this.ruleForm['id']) text = '确定要修改技术人员？'
            this.$baseConfirm(text, '', () => {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        this.configRegister()
                    } else {
                        return false
                    }
                })
            },() => {})
            return
        },
        handleClose() {
                this.dialogVisible = false
                this.$refs.ruleForm.resetFields()
                this.switchValue = false
                this.ruleForm.safetyTechniciansPhone = ''
                this.ruleForm.safetyTechniciansPost = ''
                this.ruleForm.safetyTechniciansEducation1 = ''
                this.ruleForm.safetyTechniciansSeniority = ''
                this.ruleForm.safetyTechniciansMajor = ''
        },
        // 设置路由
        async toThisTag() {
            const view = this.visitedRoutes.filter((item, index) => {
                if (item.path !== this.$route.fullPath) {
                    return item
                }
            })
            await this.$store.dispatch('tabsBar/delOthersRoutes', view)
            this.$router.push({
                path: 'safety',
            })
            return view
        },
    }
}
</script>

<style lang="scss">
.serviceDialog {
    .title {
        display: flex;
        height: 40px;
        width: 96%;
        margin: 0 auto;
        align-items: center;
        padding: 0 20px;
        font-size: 12px;
        border-bottom: 1px solid #e9e9e9;
        margin-bottom: 20px;

        span:nth-child(1) {
            display: inline-block;
            width: 5px;
            height: 16px;
            background-color: #096dd9;
        }

        span:nth-child(2) {
            line-height: 14px;
        }
    }

    .jigou-name {

        .el-form-item__label,
        .el-form-item__content {
            color: #096dd9;
            font-size: 16px;
        }
    }

    .content {
        width: 600px;
        margin: 0 !important;
        border: 1px solid #dcdfe6;
        border-radius: 0;

        .content-title {
            height: 40px;
            background: #F7F7F7;
            display: flex;
            align-items: center;

            div {
                box-sizing: border-box;
                width: 50%;
                height: 100%;
                line-height: 40px;
                padding-left: 20px;
                font-weight: bold;
            }

            div:nth-child(1) {
                border-right: 1px solid #dcdfe6;
            }
        }

        .content-box-item {
            display: flex;
            align-items: center;
            height: 45px;
            border-top: 1px solid #dcdfe6;

            .items {
                box-sizing: border-box;
                width: 50%;
                height: 100%;
                line-height: 45px;
                padding-left: 20px;
                border-right: 1px solid #dcdfe6;
            }

            .item {
                width: 50%;
                box-sizing: border-box;
                padding-left: 20px;
            }


        }
    }
}
</style>

<style >
html body .el-table .headName .cell {
    font-weight: bold;
}
</style>

