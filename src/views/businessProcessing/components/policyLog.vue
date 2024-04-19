<template>
	<div class="policy-content">
        <div class="policy-title">
            <span>操作日志</span>
        </div>
        <el-row type="flex" class="row-bg">
            <el-col :span="24">
                <el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit :header-cell-style="getRowClass1">
                    <el-table-column label="时间">
                        <template slot-scope="scope">
                            <p><span>{{scope.row.opTime}}</span></p>
							<p><span>IP：{{scope.row.userIp}}</span></p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人/数据编码">
                        <template slot-scope="scope">
                            <p>
                                <span class="col-blue">{{scope.row.opUser}}</span>
                                <span>({{scope.row.userCode}})</span>
                            </p>
                            <p>
                                <span>数据编码：</span>
                                <span>{{scope.row.btypeCode}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="taxpayerName" label="操作类型">
                        <template slot-scope="scope">
                            <p class="col-blue">
                                <span>{{scope.row.btype}}</span>
                                <span>/</span>
                                <span>{{scope.row.opType}}</span>
                            </p>
                            <p>
                                <span>{{scope.row.client}}</span> <span>({{scope.row.clientCode}})</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作详情">
                        <template slot-scope="scope">
                           <p><span>{{scope.row.opContent}}</span></p>
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
import {Operation} from '../../../server/accidenServer.js';
import logInfoNew from '../../../../static/data/log-info-new.json';
export default {
	name:'PolicyLog',
	props:{
		'data':Object,
	},
	data() {
		return {
			data1:[],
            Operation:new Operation(),
            currentPage: 1,
            pageSize: 10,
            total: 0,
            options:[]
		};
	},
	computed: {
		
	},
	created() {
        this.options = logInfoNew.data.map((item)=>{
			let obj = {
				value:item.operationTypeCode,
				lable:item.actionType,
			}
			return obj
		})
	},
	methods: {
        initData() {
            if(this.data1.length == 0) {
                this.getInsurance()
            }
        },
		getRowClass1({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#101010;font-weight: 600;background-color:#e8e8e8;";
			} else {
				return "";
			}
		},
        async getInsurance(){
			let data = {
				pn:this.currentPage,
				ps:this.pageSize,
				userCode:'',	// 操作用户编码
				userName:'',	// 操作用户名称
				channelCodes:"sequip",	// 渠道编码
				opsTime:'',	// 操作时间起期
				opeTime:'',	// 操作时间止期
				opTypeCode: '',	// 操作类型编码
				bTypeCode:this.$route.query.appCode,	// 业务类型编码/数据编码
				sort:'1',	// 操作时间排序(0-正序 1-倒序)
			};
			let params = await this.Operation.getRecord(data);
			if(params.code == '0000') {
				this.total = params.data.total;
				this.data1 = params.data.list
			} else {
				this.total = 0;
				this.data1 = []
			}
		},
        handleCurrentChange: function(pageNum){
			this.currentPage = pageNum;
			this.getInsurance();
		},
	}
};
</script>

<style lang="less">

</style>
