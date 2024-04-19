<template>
<!-- 保单详情 -->
    <div id="caseBiaoDiDetails">
        <div style="font-size: 14px;font-weight: 700;color: #096DD9; margin-top:10px;margin-buttom:10px" v-if="getBiaoDi.length !== 0">
            标的详情
        </div>
        <el-table v-if="policyInfo.productCategoryCode === 'DT'" ref="proInfo" :data="getBiaoDi" border style="width: 100%" :header-cell-style="getRowClass1">
                <el-table-column prop="elevatorId" label="设备代码" center>
                    <template slot-scope="scope">
                        <span>{{scope.row.elevatorId || scope.row.factoryNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="elevatorType" label="类型"></el-table-column>
                <el-table-column prop="elevatorCompany" label="使用单位"></el-table-column>
                <el-table-column prop="typeName" label="坐落地址">
                    <template slot-scope="scope">
                        {{scope.row.elevatorMunicipalDistrict}}
                        /
                        {{scope.row.elevatorAddr}}
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-else-if="policyInfo.productCategoryCode === 'SD'" ref="proInfo" :data="getBiaoDi" border style="width: 100%" :header-cell-style="getRowClass1">
                <el-table-column prop="cablewayName" label="索道名称" center></el-table-column>
                <el-table-column prop="cablewayId" label="设备代码"></el-table-column>
                <el-table-column prop="cablewayType" label="类型"></el-table-column>
                
            </el-table>
            <el-table v-else-if="policyInfo.productCategoryCode === 'WY'" ref="proInfo" :data="getBiaoDi" border style="width: 100%" :header-cell-style="getRowClass1">
                <el-table-column prop="propertyName" label="物业项目" center></el-table-column>
                <el-table-column prop="propertyType" label="物业类型"></el-table-column>
                <el-table-column prop="typeName" label="具体地址">
                    <template slot-scope="scope">
                        {{scope.row.propertyMunicipalDistrict}}
                        /
                        {{scope.row.propertyAddr}}
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-else-if="policyInfo.productCategoryCode === 'YJSP'" ref="proInfo" :data="getBiaoDi" border style="width: 100%" :header-cell-style="getRowClass1">
                <el-table-column prop="typeName" label="商户地址">
                    <template slot-scope="scope">
                        {{scope.row.businessMunicipalDistrict}}
                        /
                        {{scope.row.businessAddr}}
                    </template>
                </el-table-column>
            </el-table>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    data() {
		return {
            dataList:[],
		}
    },
    computed: {
        ...mapGetters({
            policyInfo:'policyInfoVo',
            targetInfo:'targetInfo',
        }),
        getBiaoDi(){
            if(Object.keys(this.targetInfo).length === 0) {
                return []
            } else {
                return [this.targetInfo]
            }
        },
    },
    
    created() {
    },
    methods: {
        getRowClass1({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
            return 'background:#f5f5f5'
            } else {
            return ''
            }
        },
    }
}
</script>
<style lang="less" scoped>
    #caseBiaoDiDetails {
        background-color:#fff;
    }
</style>