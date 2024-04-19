<template>
    <div id="caseThreePerson">
        <div class="title">
            <div class="title-l">
                <span></span>
                <span>
                    从业人员/第三者人身伤亡情况
                </span>
            </div>
            <div class="title-r">
                <el-button :disabled="isCasePause" @click="add" class="ml20 upload-btn" type="primary" size="small">添加记录</el-button>
            </div>
        </div>
        <el-table :data="injuredList" border :header-cell-style="getRowClass" class="mt20">
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="riskPersonType" label="人员类型"></el-table-column>
            <el-table-column prop="riskPersonName" label="姓名"></el-table-column>
            <el-table-column prop="identityCardNumber" label="身份证号" ></el-table-column>
            <el-table-column prop="riskPersonPhone" label="手机号" v-if="dangerOrClose === 'close'">
                <template slot-scope="scope">
                    <p>{{scope.row.riskPersonPhone}}</p>
                    <el-button type="text" v-if="!scope.row.riskPersonPhone" class="col-FFA940">请补全信息</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="casualties" label="伤亡情况" v-if="dangerOrClose === 'close'"></el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="update(scope.row)">
                        修改
                    </el-button>
                    <el-button
                        type="text"
                        @click="delet(scope.row)"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <caseAddThreePerson ref="caseAddThreePerson" :dangerOrClose="dangerOrClose"></caseAddThreePerson>
    </div>
</template>
<script>
import caseAddThreePerson from './caseAddThreePersonDialog'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    components:{
        caseAddThreePerson
    },
    data() {
		return {}
    },
    computed:{
        ...mapGetters(['injuredList','isCasePause'])
    },
    props:{
       dangerOrClose:{
           type:String
       },
    },
    created() {
    },
    methods: {
        ...mapActions(['deleteInsuredInfo']),
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
            return 'background:#f5f5f5'
            } else {
            return ''
            }
        },
        add(){
            this.$refs.caseAddThreePerson.openInit()
        },
        // 修改
        update(row){
            this.$refs.caseAddThreePerson.openInit(row)
        },
        // 删除
        delet(row){
            this.deleteInsuredInfo(row.userId)
        }
    }
}
</script>
<style lang="less" scoped>
    #caseThreePerson {
        background-color:#fff;
        margin-top: 10px;
        padding: 10px 20px 10px;
        .title {
            display: flex;
            height: 50px;
            width: 100%;
            margin: 0 auto;
            align-items: center;
            font-size: 12px;
            border-bottom: 1px solid #e9e9e9;
            .title-l {
                display: flex;
                align-items: center;
                width: calc(100% - 200px);
            }
            .title-r {
                width: 200px;
                text-align: right;
            }
            .title-l > span:nth-child(1) {
                display: inline-block;
                width: 5px;
                height: 16px;
                background-color: #096DD9;
            }
            .title-l > span:nth-child(2) {
                margin-left: 10px;
                font-size: 16px;
                color: #096DD9;

            }
            .title-r {
                width: 200px;
                text-align: right;
            }
        }
        .upload-btn {
            background-color: #355e92;
            border-color: #355e92;
        }
    }

</style>