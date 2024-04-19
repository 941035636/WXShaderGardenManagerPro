<template>
    <div id="caseBiaoDiDetails">
        <div class="title">
            <div class="title-l">
                <span></span>
                <span>
                    标的信息
                </span>
            </div>
        </div>
        <div style="width: 100%;    text-align: center;height: 100px;line-height: 100px;"  v-if="!getTargetInfo">
            <el-button type="primary" @click="setBiaodi">选择标的</el-button>
        </div>
        <div class="danger-box" v-else-if="getTargetInfo">
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
                <el-table-column prop="value" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="setBiaodi(scope.row)">
                            修改
                        </el-button>
                        <!-- <el-button
                            type="text"
                            @click="delet"
                        >
                            删除
                        </el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-else-if="policyInfo.productCategoryCode === 'SD'" ref="proInfo" :data="getBiaoDi" border style="width: 100%" :header-cell-style="getRowClass1">
                <el-table-column prop="cablewayName" label="索道名称" center></el-table-column>
                <el-table-column prop="cablewayId" label="设备代码"></el-table-column>
                <el-table-column prop="cablewayType" label="类型"></el-table-column>
                
                <el-table-column prop="value" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="setBiaodi(scope.row)">
                            修改
                        </el-button>
                        <!-- <el-button
                            type="text"
                            @click="delet"
                        >
                            删除
                        </el-button> -->
                    </template>
                </el-table-column>
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
                <el-table-column prop="value" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="setBiaodi(scope.row)">
                            修改
                        </el-button>
                        <!-- <el-button
                            type="text"
                            @click="delet"
                        >
                            删除
                        </el-button> -->
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
                <el-table-column prop="value" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="setBiaodi(scope.row)">
                            修改
                        </el-button>
                        <!-- <el-button
                            type="text"
                            @click="delet"
                        >
                            删除
                        </el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <caseBiaoDi ref="caseBiaoDi"></caseBiaoDi>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import caseBiaoDi from './caseBiaoDiDialog'
export default {
    components:{
        caseBiaoDi
    },
    data() {
		return {
            
		}
    },
    computed:{
        ...mapGetters({
            targetInfo:'targetInfo',
            policyInfo:'policyInfoVo',
        }),
        getTargetInfo(){
            if(Object.keys(this.targetInfo).length === 0) {
                return false
            } else {
                return true
            }
        },
        getBiaoDi(){
            let biaoDiData = this.targetInfo ?  [this.targetInfo] :[]  
            return biaoDiData
        },

    },
    props:{
       
    },
    created() {
    },
    methods: {
        // 修改表头样式
        getRowClass1({row,column,rowIndex,columnIndex}) {
            if (rowIndex == 0) {
                return 'background: #e8e8e8;color:#101010;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
        setBiaodi(){
            this.$refs.caseBiaoDi.openInit()
        },
        delet(){
           this.sequipUpdateBiaoDi({})
        },
    }
}
</script>
<style lang="less" scoped>
    #caseBiaoDiDetails {
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
        }
        .danger-box{
            margin: 10px 10px;
            .danger-box-title {
                font-size: 14px;
                font-weight: 700;
                color: #000;
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
                width: calc(100% - 40%);
                overflow:hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow:ellipsis;
            }
        }
        .border-bt {
            border-bottom: 1px solid #e9e9e9;
        }
        
    }

</style>