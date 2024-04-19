<template>
	<div class="policy-content mt20">
        <div class="elesearch">
			<el-row type="flex" class="row-bg">
                 <el-col :span="8">
					<div>
						<span class="item3">证件号：</span>
						<el-input size="medium" v-model.trim="data.licenceNo" placeholder="请输入内容" class="item2" clearable ></el-input>
					</div>
				</el-col>
                 <el-col :span="8">
					<div>
						<span class="item3">人员姓名：</span>
						<el-input size="medium" v-model.trim="data.name" placeholder="请输入内容" class="item2" clearable ></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<el-select v-model="data.typeCode" placeholder="请选择" class="item1" @change="changeType">
							<el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-input size="medium" placeholder="请输入" v-model.trim="data.policyNo" class="item2" clearable v-if="data.typeCode == '1'"></el-input>
						<el-input size="medium" placeholder="请输入" v-model.trim="data.endorNo" class="item2" clearable v-else-if="data.typeCode == '2'"></el-input>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<el-select v-model="data.types" placeholder="请选择" class="item1" @change="changeTypes">
							<el-option v-for="(item,index) in options8" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-date-picker size="medium" v-if="data.types == '1'" v-model="data.startDateFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
						<el-date-picker size="medium" v-else v-model="data.endDateFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>

						<el-date-picker size="medium" v-if="data.types == '1'" v-model="data.startDateTo" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
						<el-date-picker size="medium" v-else v-model="data.endDateTo" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
					</div>
				</el-col>
                <el-col :span="8">
					<div>
						<span class="item3">投保人：</span>
						<el-autocomplete size="medium" v-model.trim="data.policyHolder" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect" class="item2" clearable ></el-autocomplete>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="fr mr50">
						<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查 询</el-button>
						<el-button @click="empty" class="empty-button" type="text">清空条件</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
        <div class="fg-line"></div>
        <div class="pd-style">
            <el-row type="flex" class="row-bg">
                <el-col :span="24">
					<div style="display:flex;justify-content:space-between">
						<div>
							<span>数据筛选：<el-button :class="[data.dataScope == '' ? 'choose-style btn-style' : 'btn-style']" round @click="search('')">全部</el-button><el-button :class="[data.dataScope == '1' ? 'choose-style btn-style' : 'btn-style']" round @click="search('1')">最终在保</el-button></span>
                    	</div>
						<div>
							 <el-button type="primary" round @click="exports">导出</el-button>
						</div>
					</div>
					<el-table :data="data1" style="width: 100%;margin-top:20px;" highlight-current-row show-header border fit :header-cell-style="getRowClass1">
						<el-table-column label="姓名" min-width="50">
                            <template slot-scope="scope">
                                <p>{{scope.row.name}}</p>
                            </template>
                        </el-table-column>
						<el-table-column prop="licenceNo" label="证件信息">
                            <template slot-scope="scope">
                                <p>{{scope.row.licenceNo}}<span class="see-style" @click="showPersonDetail(scope.row)">查看</span></p>
                            </template>
                        </el-table-column>
						<el-table-column label="保障期间" min-width="110">
                            <template slot-scope="scope">
                                <p>{{scope.row.startDate}} 至 {{scope.row.endDate}}</p>
								<p class="col-blue1" v-if="scope.row.lostEndorNo">批改记录：{{scope.row.lostEndorNo}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="投保人" prop="policyHolder"></el-table-column>
                        <el-table-column label="类型" align="center" min-width="50">
                            <template slot-scope="scope">
                                <p>
									<span class="col-blue" v-if="scope.row.type == 0">保单</span>
									<span class="col-org" v-if="scope.row.type == 1">批增</span>
									<span class="col-org" v-if="scope.row.type == 2">批减</span>
									<span class="col-org" v-if="scope.row.type == 3">替换</span>
									<span class="col-org" v-if="scope.row.type == 4">批退</span>
									<span class="col-org" v-if="scope.row.type == 5">一般性批改</span>
								</p>
                            </template>
                        </el-table-column>
                        
                        <el-table-column label="保单号/批单号">
                            <template slot-scope="scope">
							    <p v-if="scope.row.endorNo"><span >{{scope.row.endorNo}}</span></p>
							    <p :class="[scope.row.endorNo && scope.row.policyNo ? 'col-grey' : '']">
									<span v-if="scope.row.endorNo && scope.row.policyNo">主保单：</span>
									<span v-if="scope.row.policyNo">{{scope.row.policyNo}}</span>
									<!-- <span @click="$emit('goToDetail',scope.row)" class="see-style">查看</span> -->
								</p>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="mt20" style="text-align: right;">
                        <el-pagination background  @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"> </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
		<el-dialog title="人员信息" :visible.sync="dialogVisible1" width="30%" :before-close="handleClose" class="dialog-p">
			<div class="f14">
				<p class="font-black">姓名：{{row.name}}</p>
				<p>
					<span v-if="row.licenceType == 1">中国居民身份证</span>
					<span v-if="row.licenceType == 2">护照</span>
					<span v-if="row.licenceType == 3">澳门身份证</span>
					<span v-if="row.licenceType == 4">军官证</span>
				</p>
				<p>证件号码：{{row.licenceNo}}</p>
				<p v-if="row.post">岗位：{{row.post}}</p>
			</div>
		</el-dialog>
    </div>
</template>

<script>
import {elevator} from '../../../server/accidenServer.js';
import UserService from '../../../service/UserService';
import ResourcesService from '../../../service/ResourcesService';
export default {
	name:'PolicyDetailPerson',
	data() {
		return {
			data1:[],
            Elevator:new elevator(),
            UserService: new UserService(),
            ResourcesService: new ResourcesService(),
            currentPage: 1,
            pageSize: 10,
            total: 0,
            options: [
                {
					'value':'1',
					'label':'保单号'
				},
				{
					'value':'2',
					'label':'批单号'
				}
            ],
            options8:[
				{
					'value':'1',
					'label':'保险起期'
				},
				{
					'value':'2',
					'label':'保险止期'
				}
			],
            data: {
				pageNum:1,// (integer, optional),
   				pageSize: 10,// (integer, optional),
				licenceNo: '',
				name: '',
				policyNo: '',
				endorNo: '',
				startDateFrom: '',
				endDateFrom: '',
				startDateTo: '',
				endDateTo: '',
				policyHolder: '',
                typeCode: '1',
                types: '1',
				dataScope: '',
				userCode:window.sessionStorage.getItem('userCode')
            },
			dialogVisible1:false,
			row: {}
		};
	},
	computed: {
		
	},
	created() {
        
	},
	methods: {
		search(flag) {
			this.data.dataScope = flag;
			this.searchview();
		},
		showPersonDetail(row) {
			this.row = row;
			this.dialogVisible1 = true;
		},
		handleClose() {
			this.row = {};
			this.dialogVisible1 = false;
		},
        searchview() {
			this.data.pageNum = 1;
			this.currentPage = 1;
			if(!this.data.licenceNo && !this.data.name && !this.data.policyNo && !this.data.endorNo && !this.data.startDateFrom && !this.data.endDateFrom && !this.data.startDateTo && !this.data.endDateTo && !this.data.policyHolder) {
				this.$message({
					message: '请输入至少一个查询条件',
					type: 'warning'
				});
				return 
			}
            this.policylistGZ()
        },
        empty() {
			this.data = {
				licenceNo: '',
				name: '',
				policyNo: '',
				endorNo: '',
				startDateFrom: '',
				endDateFrom: '',
				startDateTo: '',
				endDateTo: '',
				policyHolder: '',
                typeCode: '1',
                types: '1',
				pageNum: 1,
				pageSize: 10,
				dataScope: '',
				userCode:window.sessionStorage.getItem('userCode')
            };
			this.total = 0;
			this.data1 = [];
        },
        async policylistGZ(){ // 获取投保单列表
			this.data.pageNum = this.currentPage;
			let res  = await this.Elevator.postEmployeeList(this.data);
			if(res.code == '0000' && res.list.length != 0) {
				this.total = res.total;
				this.data1 = res.list;
			} else {
				this.total = 0;
				this.data1 = [];
			}
		},
        initData() {
            // if(this.data1.length == 0) {
            //     this.policylistGZ()
            // }
        },
		getRowClass1({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#101010;font-weight: 600;background-color:#e8e8e8;";
			} else {
				return "";
			}
		},
        handleCurrentChange: function(pageNum){
			this.currentPage = pageNum;
			this.policylistGZ();
		},
        async querySearchAsync(queryString, cb) {
			if(!queryString){
				 cb([]);	
			}else{
				let form = {
					"channelCode":'sequip',
					"pageSize":'20',
					"pageNum":'1',
					"orgName":queryString,
					"branchCode":'',
				}
				let res = await this.UserService.getSerachName(form)
				if(res.code=='0000'){
					let list = res.list.map(item=>{
						let obj = {
							value:item.erpName
						}
						return obj
					})
					cb(list);
				}else{
					cb([{value:'失败'}]);	
				}

			}
		},
        handleSelect(item) {
			console.log(item);
		},
		changeType() {
			this.data.policyNo = '';
			this.data.endorNo = '';
		},
		changeTypes() {
			this.data.startDateFrom = '';
			this.data.endDateFrom = '';
			this.data.startDateTo = '';
			this.data.endDateTo = '';
		},
		async exports(){
			if(!this.data.licenceNo && !this.data.name && !this.data.policyNo && !this.data.endorNo && !this.data.startDateFrom && !this.data.endDateFrom && !this.data.startDateTo && !this.data.endDateTo && !this.data.policyHolder) {
				this.$message({
					message: '请输入至少一个查询条件',
					type: 'warning'
				});
				return 
			}
			let data = {
				...this.data
			}
			delete data.pageNum
			delete data.pageSize
			this.ResourcesService.exportsViewFile(this.$apiUrl.EMPLOYEEEXPORT,data)
		},
	}
};
</script>

<style lang="less">
.policy-content {
	.el-dialog__title {
		color: #000000;
    	font-weight: bold;
		font-size: 16px;
	}
	.dialog-p {
		p {
			margin-bottom: 10px;
		}
		.font-black {
			color: #000000;
    		font-weight: bold;
		}
	}
	.choose-style {
		color: #e6a23c;
		background-color: #ffe7ba;
	}
	.btn-style {
		border-color: #ffa940;
		border-width: 1px;
		border-style: solid;
		color: #fa8c16;
	}
	.pd-style {
		.el-button:hover {
			color: #e6a23c;
			border-color: #ffa940;
			background-color: #ffe7ba;
		}
	}
}
</style>
