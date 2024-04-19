<template>
<!-- 赔付文件详情 -->
    <div id="caseThreePersonDetails">
        <div style="font-size: 14px;font-weight: 700;color: #096DD9; margin-top:10px">
            从业人员/第三者人身伤亡情况
        </div>
        <el-table :data="injuredList" border :header-cell-style="getRowClass" class="mt20">
            <el-table-column prop="riskPersonType" label="人员类型"></el-table-column>
            <el-table-column prop="riskPersonName" label="姓名"></el-table-column>
            <el-table-column prop="identityCardNumber" label="身份证号" ></el-table-column>
            <el-table-column prop="riskPersonPhone" label="手机号"></el-table-column>
            <el-table-column prop="casualties" label="伤亡情况"></el-table-column>
        </el-table>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
		return {
            dataList:[],
		}
    },
    computed:{
        ...mapGetters({
            injuredList:'injuredList'
        })
    },
    created() {
    },
    methods: {
        getRowClass({ row, column, rowIndex, columnIndex }) {
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
    #caseThreePersonDetails {
        background-color:#fff;
    }
</style>