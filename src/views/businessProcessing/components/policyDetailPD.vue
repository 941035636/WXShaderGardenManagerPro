<template>
	<div class="policy-content">
        <div class="policy-title">
            <span>关联的批单记录</span>
        </div>
        <el-row type="flex" class="row-bg">
            <el-col :span="24">
                <el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit :header-cell-style="getRowClass1">
                    <el-table-column label="申请日期/操作人">
                        <template slot-scope="scope">
                            <p>{{scope.row.applyDate}}</p>
                            <p>操作人：<span v-if="scope.row.operateName">{{scope.row.operateName}}</span><span v-else>--</span></p>
                        </template>
                    </el-table-column>
                    <el-table-column label="批单信息">
                        <template slot-scope="scope">
                            <p class="col-blue">{{ scope.row.holderName }}</p>
                            <p>批单申请号：{{ scope.row.applyNo }}</p>
                            <p>批单期间：{{ scope.row.startDate }} - {{ scope.row.endDate }}</p>
                            <p v-if="scope.row.issueDate">签单日期：{{ scope.row.issueDate }} <span class="ml10" v-if="scope.row.endorsementsNo">批单号：{{ scope.row.endorsementsNo }}</span></p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="taxpayerName" label="申请方式/批单类型" width="200">
                        <template slot-scope="scope">
                            <p>
                                <span v-if="scope.row.endorsementsMode=='01'">在线批单</span>
                                <span v-else-if="scope.row.endorsementsMode=='02'">线下批单</span>
                                <span v-else-if="scope.row.endorsementsMode=='03'">半线上批单</span>
                                /
                                <span class="col-org" v-if="scope.row.endorsementsType=='01'">一般性批改</span>
                                <span class="col-org" v-else-if="scope.row.endorsementsType=='03'">批增</span>
                                <span class="col-org" v-else-if="scope.row.endorsementsType=='02'">批减</span>
                                <span class="col-org" v-else-if="scope.row.endorsementsType=='04'">批退</span>
                                <span class="col-org" v-else-if="scope.row.endorsementsType=='10'">替换人员</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="批单金额/状态" width="300">
                        <template slot-scope="scope">
                            <p>
                                <span :class="[scope.row.status=='04' || scope.row.status=='06' || scope.row.status=='99' ?'col-grey':'col-gre']">{{scope.row.batchStatus}}</span> / 
                                <span class="col-grey" v-if="scope.row.payStatus == '01'">未支付</span>
                                <span class="col-gre" v-if="scope.row.payStatus == '02'">已支付</span>
                                <span class="col-grey" v-if="scope.row.payStatus == '03'">支付失败</span>
                                <span class="col-grey" v-if="scope.row.payStatus == '04'">线下支付</span>
                            </p>
                            <p v-if="scope.row.batchPremium"><span class="col-red">￥{{scope.row.batchPremium}}</span></p>
                            <p v-else><span class="col-grey">￥{{scope.row.batchPremium}}</span></p>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="mt20" style="text-align: right;">
                    <el-pagination background  @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"> </el-pagination>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {elevator} from '../../../server/accidenServer.js';
import batchStatus from '../../../../static/data/batchStatus.json';
export default {
	name:'PolicyAgent',
	props:{
		'data':Object,
	},
	data() {
		return {
			data1:[],
            Elevator:new elevator(),
            currentPage: 1,
            pageSize: 10,
            total: 0,
		};
	},
	computed: {
		
	},
	created() {
        
	},
	methods: {
        initData() {
            if(this.data1.length == 0 && this.data.policyNo) {
                this.prerecordlist()
            }
        },
		getRowClass1({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#101010;font-weight: 600;background-color:#e8e8e8;";
			} else {
				return "";
			}
		},
        async prerecordlist(){
			var data = {};
			data = {
				'channelCode':'sequip',
				'pn': this.currentPage,
				'ps': this.pageSize,
				'queryConditions':this.data.policyNo,
				'branchScope':window.sessionStorage.getItem('authDataInfo') ? window.sessionStorage.getItem('authDataInfo') == 'JT0000' ? '000000' : window.sessionStorage.getItem('authDataInfo') : window.sessionStorage.getItem('branchCode'),
			}
			let res = await this.Elevator.getapprovaldatalist(data);
			if(res.code == '0000'){
				this.data1 = res.list;
				for(var i=0;i<this.data1.length;i++){
					for(var t=0;t<batchStatus.data.length;t++){
						if(this.data1[i].status == batchStatus.data[t].value){
							this.data1[i].batchStatus = batchStatus.data[t].label;
						}
					}
				}
                this.total = res.total;
			}
		},
        handleCurrentChange: function(pageNum){
			this.currentPage = pageNum;
			this.prerecordlist();
		},
	}
};
</script>

<style lang="less">

</style>
