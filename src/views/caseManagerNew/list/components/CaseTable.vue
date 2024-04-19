<template>
	<div class="CaseTable" id="CaseTable">
        <div class="content-table">
            <div class="content-up">
                <div>
                    <span style="font-size:16px;font-weight:600;color:#000">查询列表</span>
                    <span style="margin-left:10px;color:#000">
                        共{{total}}条记录
                    </span>
                </div>
                <div class="state-style-right">
                    <i class="el-icon-success" style="color:#52C41A"></i>
                    此标签说明：保险公司结案信息“已推送”请尽快处理
                </div>
            </div>
            <el-table :data="tableData" border :header-cell-style="getRowClass">
                <el-table-column label="报案人/时间" width="180">
                <template slot-scope="scope">
                     <div>
                        <p>{{scope.row.reportName}}</p> 
                    </div>
                    <div>
                        {{scope.row.reportTime}}
                    </div>
                </template>
                </el-table-column>
                <el-table-column label="出险地区/时间" min-width="180">
                    <template slot-scope="scope">
                        <div style="font-weight:600;color:#000">
                            <span>报案号：</span>
                            <span>{{scope.row.reportNo}}</span>
                            <span>({{scope.row.inscompReportNo}})</span>
                        </div>
                        <div>
                            <span>出险地点：</span>
                            <span>{{scope.row.riskArea}}</span>
                        </div>
                        <div>
                            <span>出险时间：</span>
                            <span>{{scope.row.riskTime}}</span>
                        </div>
                        <div>
                            <span class="riskTypeBox" v-if="scope.row.insuranceType">{{scope.row.insuranceType}}/{{scope.row.productCategory}}</span>
                            <span class="caseTypeBox" v-if="scope.row.accidentType">{{scope.row.accidentType.join('、') }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="伤亡情况">
                <template slot-scope="scope">
                     <div v-if="scope.row.injuredToll">
                        <span>受伤：</span>
                        <span>{{scope.row.injuredToll}}人</span>
                    </div>
                     <div v-if="scope.row.deathToll">
                        <span>死亡：</span>
                        <span>{{scope.row.deathToll}}人</span>
                    </div>
                    <div v-if="scope.row.retention">
                        <span>滞留：</span>
                        <span>{{scope.row.retention}}人</span>
                    </div>
                    <div v-if="scope.row.generalInjured">
                        <span>一般人伤：</span>
                        <span>{{scope.row.generalInjured}}人</span>
                    </div>
                </template>
                </el-table-column>
                <el-table-column label="保单信息" min-width="150">
                <template slot-scope="scope">
                    
                    <div v-if="scope.row.policyNo">
                        <p style="font-weight:600;color:#000">{{scope.row.holder}}</p>
                        <p>
                            <span>保单号：</span>
                            <span>{{scope.row.policyNo}}</span>
                        </p>
                        <p>
                            <span>出单公司：</span>
                            <span>{{scope.row.issueCompanyName}}</span>
                        </p>
                        <p>
                            <span>投保产品：</span>
                            <span>{{scope.row.productName}}</span>
                        </p>
                    </div>
                    <div v-if="!scope.row.policyNo">
                        --
                    </div>
                </template>
                </el-table-column>
                <el-table-column label="处理进度" width="180">
                <template slot-scope="scope">
                    <p v-if="
                        scope.row.isPushInsuranceFlag && 
                        (
                            scope.row.caseProgress == '101' ||
                            scope.row.caseProgress == '201' ||
                            scope.row.caseProgress == '301' 
                          
                        )"
                    >
                        <i class="el-icon-success" style="color:#52C41A;font-size:16px"></i>
                    </p>
                    <p style="color:#1890FF">{{scope.row.caseProgressName}}	</p> 
                    <p v-if="scope.row.caseStatus == '1'" style="color:#f5222d"><span >  (中止)</span></p> 
                    <p>{{scope.row.serverName}}({{scope.row.serverOrganizationName}})</p> 
                    <p v-if=" scope.row.caseProgress == '101' && scope.row.caseStatus != '1'" style="color:#F9963F"><span > 请登录“简单赔”小程序完成受理</span></p> 
                </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <div v-if="getdetailsBtton">
                            <el-button type="text"  @click="details(scope.row)">
                                <p class="btn-link con-p" style="color:#FA8C16">查看</p>
                            </el-button>
                            <el-button type="text" v-if="scope.row.productCategoryCode == 'DT' && scope.row.caseProgress == '401'"  @click="caseReport(scope.row)">
                                <p class="btn-link con-p" style="color:#FA8C16">案件报告</p>
                            </el-button>
                            <el-dropdown trigger="click" v-if="gethandleBtton">
                                <el-button type="text" class="moreBtn">更多</el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                        class="color-FA8C16"
                                        @click.native="handle(scope.row)"
                                    >
                                        处理
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                        <div v-if="getexamineBtton">
                            <el-button type="text" v-if="scope.row.caseProgress !== '301'"  @click="details(scope.row)">
                                <p class="btn-link con-p" style="color:#FA8C16">查看</p>
                            </el-button>
                            <el-button type="text" v-else-if="scope.row.caseProgress == '301'" @click="examine(scope.row)">
                                <p class="btn-link con-p" style="color:#FA8C16">审核</p>
                            </el-button>
                        </div>
                        
                    </template>
                </el-table-column>
            </el-table>
            <div class="content-total">
                <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
            </div>
        </div>
        <CaseDetails ref="CaseDetails" @successCb="handleCurrentChange(currentPage)"></CaseDetails>
        <CaseExamine ref="CaseExamine" @successCb="handleCurrentChange(currentPage)"></CaseExamine>
	</div>
</template>

<script>
import CaseDetails from '../../details/index'
import CaseExamine from '../../handle/components/caseExamine'
import CaseServiceNew from '@/service/CaseServiceNew'
export default {
  components:{
    CaseDetails,CaseExamine
  },
	data() {
		return {
			tableData:[],
            total:0,
            pagesize:10,
            currentPage:1,
		}
	},
    computed:{
        getdetailsBtton(){
            let flag;
            switch (this.$route.path) {
                case '/case/new/my/list':
                case '/case/new/list':
                    flag = true
                    break;
                default:
                    flag = false
                    break;
            }
            return flag
        },
        gethandleBtton(){
            let flag;
            switch (this.$route.path) {
                case '/case/new/my/list':
                    flag = true
                    break;
                default:
                    flag = false
                    break;
            }
            return flag
        },
        getexamineBtton(){
            let flag;
            switch (this.$route.path) {
                case '/case/new/my/closed':
                    flag = true
                    break;
                default:
                    flag = false
                    break;
            }
            return flag
        },
    },
	created(){},
	methods: {
        // 设置table样式
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return 'background:#f5f5f5;color:#000'
            } else {
                return ''
            }
        },
        setTable(data,total){
            this.tableData = data
            this.total = total
        },
		clearPage(){
            this.currentPage = 1
		},
		handleCurrentChange(pageNum){
            this.currentPage = pageNum
            this.$emit('setPageNum',pageNum)
		},
        details(row){
            this.$refs.CaseDetails.openInit(row)
        },
        caseReport(row){
            let caseServiceNew = new CaseServiceNew()
            caseServiceNew.downLoadEndCaseeoport(row.reportNo)
        },
        // 处理
        handle(row){
            let pushInsuranceData = {
                pushInsuranceDetails:row.pushInsuranceDetails,	// 认领的详情
                isPushInsuranceFlag:row.isPushInsuranceFlag, // 认领的标识 ture认领 false 未认领
            }
            this.$store.commit('setPushInsurance',pushInsuranceData)
            this.$router.push({
                path:'/case/handle',
                query:{
                    reportNo:row.reportNo,
                }
            })
        },
        examine(row){
            let pushInsuranceData = {
                pushInsuranceDetails:row.pushInsuranceDetails,	// 认领的详情
                isPushInsuranceFlag:row.isPushInsuranceFlag, // 认领的标识 ture认领 false 未认领
            }
            this.$store.commit('setPushInsurance',pushInsuranceData)
            this.$refs.CaseDetails.openInit(row,true)
            // this.$refs.CaseExamine.openInit()
        },
        
	},
}
</script>

<style lang="less">
#CaseTable {
    .content-table {
        padding: 20px 20px;
        background-color: #fff;
        .content-up{
            position: relative;
            width: 100%;
            box-sizing: border-box;
            margin-bottom: 20px;
            margin-top: 10px;
            // background-color: #fff;
            .content-up-btn{
                position: absolute;
                right: 0px;
                top: -10px;
            }
            .state-style-right {
				position: absolute;
				right: 10px;
				top: 0px;
				font-size: 16px;
				color: #101010;
			}
        }
        .riskTypeBox {
            display: inline-block;
            background-color: #40A9FF;
            padding: 0px 20px;
            border-radius: 14px;
            color: #fff;
        }
        .caseTypeBox {
            display: inline-block;
            margin-right: 20px;
            background-color: #FFA940;
            padding: 0px 20px;
            border-radius: 14px;
            color: #fff;
        }
        .btn-link{
            cursor:pointer;
        }
    }
    .content-total {
        margin-top: 10px;
        text-align: right;
    }
    
}
</style>
