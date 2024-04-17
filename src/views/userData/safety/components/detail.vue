<template>
    <div id="SafetyDetails">
        <el-dialog id="companyAdd" title="安全专家详情" :visible.sync="dialogVisible" :close-on-click-modal="false"
            width="80%" append-to-body @open="initData">
            <el-form label-position="left" label-width="142px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名：">
                            <moreCon :data="data.safetyTechniciansName" :length="15" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="证件类型：">
                            {{ data.safetyTechniciansCertificateName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="证件号码：">
                            {{ data.safetyTechniciansCertificate }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="主要服务项目：">
                            {{ data.serviceAccidentName }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="主要服务行业领域：">
                            <moreCon :data="data.serviceIndustry" :length="15" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <p class="stitle">其他信息</p>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="联系电话：">
                            {{ data.safetyTechniciansPhone || '--' }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="职务/职称：">
                            {{ data.safetyTechnicians || '--' }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="最高学历：">
                            {{ data.safetyTechniciansEducation1 || '--' }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="专业：">
                            {{ data.safetyTechniciansMajor || '--' }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="从事工作年限：">
                            {{ data.safetyTechniciansSeniority || '--' }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<!-- <moreCon :data="data.custFullName" :length="15" /> -->

<script>
import Title from '@/components/NewTitle'
import { getExpertDetail } from '@/api/userDataManagement'
import { mapGetters } from 'vuex'
import moreCon from '@/components/moreCon'
export default {
    name: 'SafetyDetails',
    components: {
        Title,
        moreCon
    },
    data() {
        return {
            dialogVisible: false,
            data: {},
            tableExpertList: [],
            code: '',
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
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return 'background:#f5f5f5'
            } else {
                return ''
            }
        },
        async initData() {
            // 初始化数据
            let res = await getExpertDetail(this.code)
            if (res.code === '0000') {
                // 服务机构编码转中文

                res.data.serviceAccidentName = res.data.serviceAccidentTypes
                    .map((obj) => {
                        return obj.serviceAccidentTypeName
                    })
                    .join(',')
                if (res.data.safetyTechniciansCertificateType) {
                    res.data.safetyTechniciansCertificateName =
                    this.getStrEnumAll.CertificateTypeEnum.find(
                        (it) => it.code == res.data.safetyTechniciansCertificateType
                    ).label
                }

                if (res.data.safetyTechniciansPost) {
                    res.data.safetyTechnicians =
                        this.getStrEnumAll.SafetyTechniciansPostEnum.find(
                            (it) => it.code == res.data.safetyTechniciansPost
                        ).label
                }

                if (res.data.expertType && res.data.expertType != '4') {
                    //专家类型 1-保险机构 2-保险经纪机构 3-服务机构 4|空 - 个人 ,
                    res.data.expertTypeName = this.getStrEnumAll.ExpertTypeEnum.find(
                        (it) => it.code == res.data.expertType
                    ).label
                } else {
                    res.data.expertTypeName = '个人'
                }
                // this.getStrEnumAll.ServiceItemsEnum.find(
                //   (item) => item.strCode == res.data.serviceAccidentType
                // ).label
                res.data.provinceName = this.areaMap[res.data.provinceCode]
                res.data.cityName = this.areaMap[res.data.cityCode]
                res.data.countyName = this.areaMap[res.data.countryCode]
                this.data = res.data
            }
        },
        goBack() {
            this.$router.go(-1)
        },
    },
}
</script>

<style lang="scss" scoped>
.stitle {
    font-weight: bold;
    color: #000;
}
</style>