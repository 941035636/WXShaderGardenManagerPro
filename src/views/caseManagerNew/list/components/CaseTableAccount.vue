<template>
	<div class="CaseTableAccount" id="CaseTableAccount">
        
        <div class="content-table">
            <div class="content-up">
                <div>
                    <span style="font-size:16px;font-weight:600;color:#000">查询列表</span>
                    <span style="margin-left:10px;color:#000">
                        共{{total}}条记录
                    </span>
                </div>
                <el-button v-if="dataJurisdiction.find(item => item.key == '40004')" class="content-up-btn" type="primary" @click="exports" round>导出</el-button>
               
            </div>
            <el-table :data="tableData" border :header-cell-style="getRowClass">
                <el-table-column label="报案信息" min-width="200">
                <template slot-scope="scope">
                     <div>
                        <span>报案号：</span>
                        <span>
                            {{scope.row.reportNo}}
                        </span> 
                        <!-- <el-button type="text"  @click="details(scope.row)">
                            查看详情
                        </el-button> -->
                    </div>
                     <div>
                        <span>报案人：</span>
                        <span>
                            {{scope.row.reportName}}
                        </span> 
                        <span class="ml10">报案时间：</span>
                        <span>
                            {{scope.row.reportTime}}
                        </span> 
                    </div>
                     <div>
                        <p style="font-weight:600;color:#000">
                            转报案信息
                        </p> 
                        <p>
                            <span>保司报案号：</span>
                            <span>
                                {{scope.row.inscompReportNo}}
                            </span>
                        </p> 
                        <p>
                            <span>坐席：</span>
                            <span>
                                {{scope.row.siteCode}}
                            </span> 
                            <span class="ml10">转报案时间：</span>
                            <span>
                                {{scope.row.transferringTheCaseTime}}
                            </span> 
                        </p> 
                    </div>
                     <div>
                        <p style="font-weight:600;color:#000">
                            录入人员
                        </p> 
                        <p>
                            <span>录入：</span>
                            <span>
                                {{scope.row.enteredUser}}
                            </span> 
                            <span class="ml10">录入时间：</span>
                            <span>
                                {{scope.row.enteredTime}}
                            </span> 
                        </p> 
                    </div>
                </template>
                </el-table-column>
                <el-table-column label="出险/索赔信息" min-width="200">
                    <template slot-scope="scope">
                        <div>
                            <span>出险时间：</span>
                            <span>{{scope.row.riskTime}}</span>
                        </div>
                        <div>
                            <span>出险地点：</span>
                            <span>{{scope.row.riskProvinceName}}/{{scope.row.riskCityName}}/{{scope.row.riskAreaName}}</span>
                        </div>
                        <div>
                            <span>备注：</span>
                            <span class="color-F5222D">{{scope.row.remark}}</span>
                        </div>
                        <div>
                            <p style="font-weight:600;color:#000">
                                索赔信息
                            </p> 
                            <p>
                                <span>估算金额：</span>
                                <span class="color-F5222D">
                                ￥ {{scope.row.estimatedAmount || '--'}}
                                </span> 
                                <span class="ml10">索赔金额：</span>
                                <span class="color-F5222D">
                                    ￥ {{scope.row.claimAmount || '--'}}
                                </span> 
                            </p> 
                        </div>
                    <div>
                        <span class="riskTypeBox" v-if="scope.row.insuranceType">{{scope.row.insuranceType}}/{{scope.row.productCategory}}</span>
                        <span class="caseTypeBox" v-if="scope.row.accidentType">{{scope.row.accidentType.join('、') }}</span>
                    </div>
                    </template>
                </el-table-column>
                <el-table-column label="结案信息" min-width="180">
                    <template slot-scope="scope">
                        <div>
                            <p>
                                <span>案件进度：</span>
                                <span style="color:#1890FF">
                                    {{scope.row.caseProgressName}}
                                </span> 
                                <span v-if="scope.row.caseStatus == '1'" style="color:#f5222d">(中止)</span> 
                            </p> 
                        </div>
                        <div>
                            <p>
                                <span>赔付金额：</span>
                                <span>
                                    ￥{{scope.row.totalPayAmount || '--'}}
                                </span> 
                            </p> 
                        </div>
                        <div v-if="scope.row.injuredCnt">
                            <p>
                                <span>受伤：</span>
                                <span >
                                    {{scope.row.injuredCnt.injured}}
                                    人
                                </span> 
                                <span class="ml10">死亡：</span>
                                <span >
                                    {{scope.row.injuredCnt.death}}
                                    人
                                </span> 
                            </p> 
                        </div>
                        <div>
                            <p style="font-weight:600;color:#000">
                                案件处理信息
                            </p> 
                            <p>
                                <span>受理人：</span>
                                <span>
                                 {{scope.row.serverName || '--'}}
                                </span> 
                                /
                                <span>
                                    {{scope.row.serverBranch || '--'}}
                                </span> 
                            </p> 
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="伤亡情况">
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
                </el-table-column> -->
                <el-table-column label="保单信息" min-width="200">
                <template slot-scope="scope">
                    <div v-if="scope.row.policyNo">
                        <p style="font-weight:600;color:#096DD9">{{scope.row.productName}}</p>
                        <p>
                            <span>投/被保人：</span>
                            <span>{{scope.row.holderName}}</span>
                        </p>
                        <p>
                            <span>保单号：</span>
                            <span>{{scope.row.policyNo}}</span>
                        </p>
                        <p>
                            <span>保险机构：</span>
                            <span>{{scope.row.issueCompanyName}}</span>
                        </p>
                        <p>
                            <span>保险期间：</span>
                            <span>{{scope.row.polStartDate?scope.row.polStartDate.split(' ')[0] : ''}}</span>
                            <span>至</span>
                            <span>{{scope.row.polEndDate?scope.row.polEndDate.split(' ')[0] : ''}}</span>
                        </p>
                        <p>
                            <span>保费金额：</span>
                            <span class="color-F5222D">￥{{scope.row.premium}}</span>
                        </p>
                    </div>
                    <div v-if="!scope.row.policyNo">
                        --
                    </div>
                </template>
                </el-table-column>
                <!-- <el-table-column label="录入人/时间" width="180">
                <template slot-scope="scope">
                    <p>{{scope.row.enteredUser}}	</p> 
                    <p>{{scope.row.enteredTime}}	</p> 
                </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <div >
                            <el-button type="text"  @click="details(scope.row)">
                                <p class="btn-link con-p" style="color:#FA8C16">查看</p>
                            </el-button>
                        </div>
                    </template>
                </el-table-column> -->
            </el-table>
            <div class="content-total">
                <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
            </div>
        </div>
	</div>
</template>

<script>
export default {
  components:{
  },
	data() {
		return {
            dataJurisdiction:[],
			tableData:[],
            total:0,
            pagesize:10,
            currentPage:1,
		}
	},
    computed:{},
	created(){
        this.policyStatu()
    },
	methods: {
        policyStatu(){ //根据权限获取配置文件
			this.dataJurisdiction = JSON.parse(window.sessionStorage.getItem('list'));
		},
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
            this.$router.push({
                path:'/400/sequip/v2/caseDetail',
                query:{
                    reportNo:row.reportNo
                }
            })
        },
        exports(){
            this.$emit('exports')
        },
	},
}
</script>

<style lang="less">
#CaseTableAccount {
    margin-top: 20px;

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
    .color-F5222D {
        color: #F5222D;
    }
    
}
</style>
