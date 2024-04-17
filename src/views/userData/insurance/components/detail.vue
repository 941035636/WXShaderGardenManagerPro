<template>
    <div id="InsuranceDetails">
        <el-dialog id="companyAdd" title="保险机构详情" :visible.sync="dialogVisible" :close-on-click-modal="false"
            width="80%" append-to-body @open="initData">

            <el-form label-position="left" label-width="142px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="机构名称：">
                            <moreCon :data="data.orgName" :length="15" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="机构类型：">
                            {{ data.orgTypeName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="机构代码：">
                            {{ data.orgCode }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="社会信用代码：">
                            {{ data.businessCode }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="经营地址：">
                            <span>{{ data.provinceName }}/{{ data.cityName }}/{{ data.countyName }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="详细地址：">
                            <moreCon :data="data.detailAddr" :length="15" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="data.orgType != 1">
                    <el-col :span="8">
                        <el-form-item label="总部名称：">
                            <moreCon :data="data.headquartersName" :length="15" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="总部编码：">
                            {{ data.headquartersCode }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <p class="stitle">法人代表/主要负责人</p>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名：">
                            {{ data.safetyCharger || '--' }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系电话：">
                            {{ data.safetyChargerPhone || '--' }}
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
import {
    getBranchDetails,
    getOrgExpertDetail,
} from '@/api/userDataManagement'
import { mapGetters } from 'vuex'
import { getAreaName } from '@/api/Areas'
import moreCon from '@/components/moreCon'
export default {
    name: 'InsuranceDetails',
    components: {
        Title,
        moreCon,
    },
    data() {
        return {
            data: {},
            tableExpertList: [],
            expertForm: {
                ps: 10,
                pn: 1,
            },
            dialogVisible: false,
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
        getInit() { },
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return 'background:#f5f5f5;text-align:center'
            } else {
                return ''
            }
        },
        async initData() {
            let data = {
                servicename: 'insuranceCompanySvc',
                code: this.code,
            }
            let res = await getBranchDetails(data)
            if (res.code === '0000') {
                // 服务项目编码转中文
                // res.data.serviceAccidentName = this.getStrEnumAll.ServiceItemsEnum.find(
                //   (item) => item.strCode == res.data.serviceAccidentType
                // ).label
                res.data.provinceName = this.areaMap[res.data.provinceCode]
                res.data.cityName = this.areaMap[res.data.cityCode]
                res.data.countyName = this.areaMap[res.data.countryCode]
                res.data.orgTypeName = this.getStrEnumAll.OrganizationTypeEnum.filter(item => item.code == res.data.orgType)[0].label
                if (res.data.streetCode) {
                    let res1 = await getAreaName(res.data.streetCode)
                    res.data.streetName = res1.data[0].regionName
                }

                this.data = res.data
            }
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