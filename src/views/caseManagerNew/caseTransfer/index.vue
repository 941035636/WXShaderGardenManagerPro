<template>
	<div class="caseList" id="caseList1">
		<div class="elesearch">
			<el-row class="mb20">
				<el-col :span="8">
					<span class="text-left">服务人员:</span>
                    <el-select v-model="formInline.serverName" size="medium" clearable placeholder="请选择" filterable>
                        <el-option
                            v-for="item in serversNameList"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
					<!-- <el-cascader size="medium" v-model="serviceCode" clearable :options="branchList" :props="props" @change="handleChange"></el-cascader> -->
				</el-col>
				<el-col :span="8">
					<span class="text-left">报案号:</span>
					<el-input v-model="formInline.reportNo" placeholder="请输入报案号" size="medium"></el-input>
				</el-col>
				<el-col :span="8">
					<div class="item3 fr">
						<el-button type="warning" round size="small" @click="searchview">查询</el-button>
						<el-button type="info" round size="small" @click="empty" class="mr10">重置</el-button>
						<el-button type="text" class="mr40 col-org" v-if="showFlag" @click="showFlag = !showFlag">展开 <i class="el-icon-arrow-up"></i></el-button>
						<el-button type="text" class="mr40 col-org" v-if="!showFlag" @click="showFlag = !showFlag">收起 <i class="el-icon-arrow-down"></i></el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="content-table">
			<div class="content1">
				<p class="content1-p">共查询到 <span style="color: #FA8C16">{{total}}</span>  条记录</p>
				<div class="contoent1-btn">
					<el-button class="contoent1-btn-left"  type="primary" size="small" @click="chooseTra">选中转移</el-button>
					<el-button class="contoent1-btn-right"  type="warning" size="small" @click="dialogVisibleAll = true;">全部转移</el-button>
				</div>
			</div>
			<el-table ref="multipleTable" :data="dataCaseList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="reportNo" label="报案号"></el-table-column>
				<el-table-column label="报案人">
					<template slot-scope="scope" v-if="scope.row.reportName">{{scope.row.reportName}}（{{scope.row.reportUserPhone}}）</template>
				</el-table-column>
				<el-table-column prop="reportTime" label="报案时间"></el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
                        <span style="color:#fa8c16">{{scope.row.caseProgressName}}</span>
                        <span v-if="scope.row.caseStatus == '1'" style="color:#f5222d">  (中止)</span>
                    </template>
				</el-table-column>
				<el-table-column prop="serverOrganizationName" label="所属分支机构"></el-table-column>
				<el-table-column prop="serverName"  label="服务人员"></el-table-column>
			</el-table>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<el-dialog title="转移服务人员" :visible.sync="dialogVisible" width="50%" :before-close="resetData">
			<div class="bor-bot mb20">
				<p class="f14 font-blod">原服务人员</p>
				<el-row class="mb20 mt20 f14">
					<el-col :span="8">
						<span class="text-left">服务人员:</span>
						<span>{{showData.serverName}}</span>
					</el-col>
					<el-col :span="8">
						<span class="text-left">电话号码:</span>
						<span>{{showData.serverPhone}}</span>
					</el-col>
					<el-col :span="8">
						<span class="text-left">所属分公司:</span>
						<span>{{showData.serverOrganizationName}}</span>
					</el-col>
				</el-row>
				<el-row class="mb20">
					<el-col :span="8">
						<span class="text-left">转移数量:</span>
						<span class="col-blue">{{multipleSelection.length}}条记录</span>
					</el-col>
				</el-row>
			</div>
			<div>
				<p class="f14 font-blod">新服务人员</p>
				<el-row class="mb20 mt20 f14">
					<el-col :span="8">
						<span class="text-left">所在机构:</span>
						<el-select v-model="someParams.mediateBranchCode" size="small" clearable placeholder="请选择" @change="branchChange(1)">
							<el-option
								v-for="item in branchList"
								:key="item.jtBranchCode"
								:label="item.jtBranchName"
								:value="item.jtBranchCode">
							</el-option>
						</el-select>
					</el-col>
				</el-row>
				<el-row class="mb20">
					<el-table ref="proInfo" :data="serverList" border style="width: 100%" :header-cell-style="getRowClass1">
						<el-table-column label="选择" width="50" center>
							<template slot-scope="scope">
							<el-radio-group  v-model="scope.row.choosePeo" @change="choosePro(scope.row,scope.$index)">
			                    <el-radio :label="true">&nbsp;</el-radio>
			                  </el-radio-group>
							</template>
						</el-table-column>
						<el-table-column property="name" label="服务人员姓名"></el-table-column>
						<el-table-column property="phone" label="电话"></el-table-column>
						<el-table-column property="email" label="邮箱"></el-table-column>
						<el-table-column property="remarks" label="备注"></el-table-column>
					</el-table>
				</el-row>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="info" round size="medium" class="mr10" @click="resetData">取  消</el-button>
				<el-button type="warning" round size="medium" @click="submitForm">确认提交</el-button>
			</span>
		</el-dialog>
		<el-dialog title="转移服务人员（全部）" :visible.sync="dialogVisibleAll" width="50%" :before-close="resetData">
			<div class="bor-bot mb20">
				<p class="f14 font-blod">原服务人员</p>
				<el-row class="mb20 mt20 f14">
					<el-col :span="8">
						<span class="text-left">所在机构:</span>
						<el-select v-model="someParams.servicerCodeOld" size="small" clearable placeholder="请选择" @change="branchChange(2)">
							<el-option
								v-for="item in branchList"
								:key="item.jtBranchCode"
								:label="item.jtBranchName"
								:value="item.jtBranchCode">
							</el-option>
						</el-select>
					</el-col>
				</el-row>
				<el-row class="mb20">
					<el-table ref="proInfo" :data="serverList1" border style="width: 100%" :header-cell-style="getRowClass1">
						<el-table-column label="选择" width="50" center>
							<template slot-scope="scope">
							<el-radio-group  v-model="scope.row.choosePeo" @change="choosePro(scope.row,scope.$index,true)">
			                    <el-radio :label="true">&nbsp;</el-radio>
			                  </el-radio-group>
							</template>
						</el-table-column>
						<el-table-column property="name" label="服务人员姓名"></el-table-column>
						<el-table-column property="phone" label="电话"></el-table-column>
						<el-table-column property="email" label="邮箱"></el-table-column>
						<el-table-column property="remarks" label="备注"></el-table-column>
					</el-table>
				</el-row>
				<el-row class="mb20">
					<el-col :span="8">
						<span class="text-left">转移数量:</span>
						<span class="col-blue">{{totalNum}}条记录</span>
					</el-col>
				</el-row>
			</div>
			<div>
				<p class="f14 font-blod">新服务人员</p>
				<el-row class="mb20 mt20 f14">
					<el-col :span="8">
						<span class="text-left">所在机构:</span>
						<el-select v-model="someParams.mediateBranchCode" size="small" clearable placeholder="请选择" @change="branchChange(1)">
							<el-option
								v-for="item in branchList"
								:key="item.jtBranchCode"
								:label="item.jtBranchName"
								:value="item.jtBranchCode">
							</el-option>
						</el-select>
					</el-col>
				</el-row>
				<el-row class="mb20">
					<el-table ref="proInfo" :data="serverList" border style="width: 100%" :header-cell-style="getRowClass1">
						<el-table-column label="选择" width="50" center>
							<template slot-scope="scope">
							<el-radio-group  v-model="scope.row.choosePeo" @change="choosePro(scope.row,scope.$index)">
			                    <el-radio :label="true">&nbsp;</el-radio>
			                  </el-radio-group>
							</template>
						</el-table-column>
						<el-table-column property="name" label="服务人员姓名"></el-table-column>
						<el-table-column property="phone" label="电话"></el-table-column>
						<el-table-column property="email" label="邮箱"></el-table-column>
						<el-table-column property="remarks" label="备注"></el-table-column>
					</el-table>
				</el-row>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="info" round size="medium" class="mr10" @click="resetData">取  消</el-button>
				<el-button type="warning" round size="medium" @click="submitAll">确认提交</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import CaseService from '@/service/CaseService.js';
import CaseServiceNew from '@/service/CaseServiceNew'
import CorrectionManagement from '@/service/CorrectionManagement.js';
import ResourcesService from '@/service/ResourcesService.js';
import buttonSelection from '../../businessProcessing/js/buttonSelection.js';
import divisor from '@/global/divisor.json';
import ProductService from '@/service/ProductService.js';
import store from '@/store/index'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import moment from 'moment'
export default {
	data() {
		let _self = this
		return {
			props: {
				value: 'userCode',
				label: 'name',
				lazy: true,
				lazyLoad(node, resolve) {
					const level = node.level
					if (level === 1) {
						const id = node.value
						let data = {
							branchCode: node.value,
							roleCode: process.env.ROOT_ROLECODE,
						}
						_self.caseService.getCustomerByJt(data).then(res => {
							const { code, msg,list } = res
							if (code === '0000') {
								const nodes = list
								nodes.forEach(item => {
									item.leaf = level >= 1
								})
								resolve(nodes)
							} else {
								this.$message.error(msg)
							}
						})
					}
				}
			},
			totalNum:0,
			showData:{},
			dialogVisible: false,
			dialogVisibleAll: false,
			multipleSelection:[],
			serviceCode:[],
			showFlag: true,
			caseService: new CaseService(),
			CaseServiceNew: new CaseServiceNew(),
			ButtonSelection:new buttonSelection(),
			ResourcesService:new ResourcesService(),
			CorrectionManagement:new CorrectionManagement(),
			productService: new ProductService(),
			formInline:{
				orderBy:'reportTime',
				desc:true,
				reportNo:null,
				serverName:null,
				page:1,
				pageSize:10,
			},
			labelPosition:'right',
			data1:[],
			dataCaseList:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			datas:[],
			reportStatus: [],
			branchList:[],
			riskType:"", // 产品分类
			someParams: {
				mediateBranchCode:'',
				mediateBranchName:'',
				mediateCode:'',
				mediateName:'',
                departmentCode:'',
				departmentName:'',
				reportNos:'',
				mediatePhone:'',
				servicerRemarks:'',
				mediateEmail:'',
				servicerCode:'',
				servicerCodeOld:''
			},
			serverList:[],
			serverList1:[],
			serversNameList:[], // 服务人员list
		}
	},
	store,
	computed:{
        ...mapGetters({
            accidentType:'accidentType',
            industry:'industry',
        }),
    },
	created(){
		this.loadBranch();
		this.initOptins();
	},
	methods: {
        ...mapActions([
            'getCaseEnumV2',
            'getEbaoIndustry',
        ]),
        // 初始
        initOptins(){
            this.getCaseEnumV2()
            this.getEbaoIndustry()
            this.getCaseQueryConditionList()
        },
        // 获取列表反向加载数据
        async getCaseQueryConditionList(){
            let from = {
                type:'list'
            }
            let {code,data} = await this.CaseServiceNew.getCaseQueryConditionList(from)
            if(code === '0000') {
                let {branchList,insuranceCompanyList,products,riskAreas,servers} = data
                // this.branchList = branchList
                // this.insuranceCompanyList = insuranceCompanyList
                // this.products = products
                // this.riskAreas = riskAreas
                this.serversNameList = servers
            }
        },
		async branchChange(flag) {
			let data = {
				branchCode: flag == 1 ? this.someParams.mediateBranchCode : this.someParams.servicerCodeOld,
				roleCode: process.env.ROOT_ROLECODE,
			}
			if(flag != 2) {
				this.someParams.mediateBranchName = this.branchList.find(item => item.jtBranchCode == this.someParams.mediateBranchCode).jtBranchName;
			}
			let res = await this.caseService.getCustomerByJt(data);
			if(res.code == '0000' && res.list.length) {
				res.list.map(item => {
					item.choosePeo = false;
				})
				if(flag != 2) {
					this.serverList = res.list;
					this.setSome();
				} else {
					this.totalNum = 0;
					this.serverList1 = res.list;
				}
			} else {
				this.serverList = [];
				this.serverList1 = [];
				this.totalNum = 0;
			}
		},
		setSome() {
			this.someParams.mediateName = '';
			this.someParams.mediatePhone = '';
			this.someParams.mediateCode = '';
			this.someParams.servicerRemarks = '';
			this.someParams.mediateEmail = '';
			this.someParams.departmentCode = '';
			this.someParams.departmentName = '';
		},
		async handleChange(value) {
			
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		// 获取所有的分支机构
		async loadBranch(){
			let res = await this.CorrectionManagement.getBranchInfo();
			if(res.code == '0000'){
				if(!res.list.find(item => item.jtBranchCode == 'JT0000')) {
					res.list.push({
						"jtBranchCode":"JT0000","jtBranchName":"江泰保险经纪股份有限公司本部"
					})
				}
				this.branchList = res.list.map(item => {
					item.userCode = item.jtBranchCode;
					item.name = item.jtBranchName;
                    return item
				})
            }
        },
		
		// 获取案件列表
		async caseList(flag){ 
			if(!flag) {
				if(!this.formInline.serverName && !this.formInline.reportNo) {
					this.$message.error('请选择查询内容');
					return
				}
			} else {
				if(!this.formInline.serverName  && !this.formInline.reportNo) {
					return
				}
			}
			this.formInline.page = this.pageNum;
            let form = {
                ...this.formInline,
                caseProgress:['101','201','301','401','402','403','404','405'],
                type :'list'
            }
			let res = await this.CaseServiceNew.getCaseList(form);
			if(res.code == '0000'){
				this.dataCaseList = res.data.list
				this.total = res.data.total;
			}
		},
		searchview(){ //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.caseList();
		},
		empty(){ //清空
			this.formInline = {
				orderBy:"reportTime",
				desc:true,
				reportNo:null,
				serverName:null,
				page:1,
				pageSize:10,
			};
			this.serviceCode = [];
			this.dataCaseList = [];
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			this.multipleSelection = [];
			this.caseList();
		},
		chooseTra() {
			if(this.multipleSelection.length == 0) {
				this.$message.error('请勾选案件记录');
				return
			}
			this.showData = this.multipleSelection[0];
			this.dialogVisible = true;
		},
		async choosePro(row,index,flag) {
			if(!flag) {
				this.serverList.map((item,subIndex) => {
					if(subIndex != index) {
					item.choosePeo = false;
					}
				})
				this.someParams.mediateName = row.name;
				this.someParams.mediatePhone = row.phone;
				this.someParams.mediateCode = row.userCode;
				this.someParams.servicerRemarks = row.remarks;
				this.someParams.mediateEmail = row.email;
				this.someParams.departmentCode = row.departmentCode;
				this.someParams.departmentName = row.departmentName;
			} else {
				this.serverList1.map((item,subIndex) => {
					if(subIndex != index) {
					    item.choosePeo = false;
					}
				})
				this.someParams.servicerCode = row.userCode;
                let form = {
                    serverName:row.name,
                    page:1,
				    pageSize:10,
                    caseProgress:['101','201','301','401','402','403','404','405'],
                    type :'list'
                }
				let res = await this.CaseServiceNew.getCaseList(form);
				if(res.code == '0000'){
					if(res.data.total) {
						this.totalNum = res.data.total;
					} else {
                        this.totalNum = 0;
						this.$message.error('未查询到案件记录');
					}
				}
			}
		},
		getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
			if (rowIndex == 0) {
				return 'background: #e8e8e8;color:#101010;font-size:14px;font-weight:600;';
			} else {
				return 'background: #fff';
			}
		},
		async submitForm() {
			if(!this.someParams.mediateBranchCode) {
				this.$message.error('请选择新服务人员所在机构');
				return
			}
			if(!this.someParams.mediateCode) {
				this.$message.error('请勾选新服务人员');
				return
			}
			let reportNos = [];
			this.multipleSelection.map(item => {
				reportNos.push(item.reportNo);
			})
			this.someParams.reportNos = reportNos.join(',');
            let formObj = {
                "toUserCode": this.someParams.mediateCode,
                "toUserName": this.someParams.mediateName,
                "toUserBranchCode": this.someParams.mediateBranchCode,
                "toUserBranchName": this.someParams.mediateBranchName,
                "toUserPhone": this.someParams.mediatePhone,
                "toUserDepartmentCode": this.someParams.departmentCode,
                "toUserDepartmentName": this.someParams.departmentName,
                "caseProgress": [],
                "reportNos": this.multipleSelection.map(item=>item.reportNo),
                "oldServerCode": ""
            }
			let res = await this.CaseServiceNew.transforServicor(formObj);
			if(res.code == '0000') {
				this.$message.success('转移成功');
				this.caseList(true);
				this.resetData();
			}
		},
		async submitAll() {
            console.log(this.someParams);
			if(!this.someParams.servicerCode) {
				this.$message.error('请勾选原服务人员');
				return
			}
			if(!this.totalNum) {
				this.$message.error('当前服务人员未查询到案件。');
				return
			}
			if(!this.someParams.mediateBranchCode) {
				this.$message.error('请选择新服务人员所在机构');
				return
			}
			if(!this.someParams.mediateCode) {
				this.$message.error('请勾选新服务人员');
				return
			}
            let formObj = {
                "toUserCode": this.someParams.mediateCode,
                "toUserName": this.someParams.mediateName,
                "toUserBranchCode": this.someParams.mediateBranchCode,
                "toUserBranchName": this.someParams.mediateBranchName,
                "toUserPhone": this.someParams.mediatePhone,
                "toUserDepartmentCode": this.someParams.departmentCode,
                "toUserDepartmentName": this.someParams.departmentName,
                "caseProgress": [],
                "reportNos": [],
                "oldServerCode": this.someParams.servicerCode
            }
			let res = await this.CaseServiceNew.transforServicor(formObj);
			if(res.code == '0000') {
				this.$message.success('全部转移成功');
				this.caseList(true);
				this.resetData();
			}
		},
		resetData() {
			this.someParams = {
				mediateBranchCode:'',
				mediateBranchName:'',
				mediateCode:'',
				mediateName:'',
                departmentCode:'',
				departmentName:'',
				reportNos:'',
				mediatePhone:'',
				servicerRemarks:'',
				mediateEmail:'',
				servicerCode:'',
				servicerCodeOld:''
			};
			this.serverList = [];
			this.serverList1 = [];
			this.totalNum = 0;
			this.dialogVisible = false;
			this.dialogVisibleAll = false;
		}
	},
}
</script>

<style lang="less">
#caseList1 {
	padding-bottom: 80px;
	min-height: 1000px;
	box-sizing: border-box;
	.el-form-item {
		margin-bottom: 10px;
	}
	.elesearch{
		box-sizing: border-box;
		background-color: #f2f1ef;
		overflow: hidden;
		padding: 20px 0;
		margin: 20px 20px 0 20px;
		background-color: #fff;	
		.item5{
			width: 30%;
		}
		.text-left{
			display: inline-block;
			width: 30%;
			text-align: right;
			font-size: 16px;
			line-height: 16px;
			color: #666666;
			margin-right: 10px;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
		.search-style {
			margin-top:20px;
			.el-form-item {
				margin-bottom: 16px;
			}
		}
		.el-date-editor--daterange.el-input__inner,.el-cascader--medium,.el-input--medium {
			width: 260px;
		}
		.el-button--small.is-round {
			padding: 10px 30px;
			font-size: 16px;
		}
		.mr40 {
			margin-right:40px;
		}
		.elesearch2{
			width: 100%;
			.item3{
				width: 100%;
				text-align: center;
				box-sizing: border-box;
			}
		}
	}
	.content-table{
		background-color: #fff;
		margin: 20px 20px 0;
		padding: 0 20px;
		.content1{
			position: relative;
			height: 60px;
			background-color: #fff;
			width: calc(100% - 40px);
			margin: 20px 20px 0;
			.content1-p{
				line-height: 60px;
			}
			.contoent1-btn{
				position: absolute;
				right: 20px;
				top: 20px;
				display: flex;
				.contoent1-btn-left,.contoent1-btn-right{
					width: 100px;
					border-radius: 30px;
				}
			}
		}
		.btn-link{
			cursor:pointer;
		}
		.content-table-title{
			height: 60px;
			line-height: 60px;
			border-bottom: 1px solid #E9E9E9;
			font-weight: 700;
		}
		.content-table-con{
			padding: 15px 0;
			border-bottom: 1px solid #E9E9E9;
			.con-p{
				height: 26px;
				line-height: 26px;
			}
		}
	}
	.content-total{
		width: 95%;
		height: 60px;
		line-height: 60px;
		text-align: right;
		margin-top: 30px;
	}
	.btn{
		text-align: right;
		width: 100%;
		.btn-left{
			display: inline-block;
			padding: 5px 20px;
			border: 1px solid #ccc;
			color: #000;
			background-color: #F5F5F5;
			border-radius: 20px;
			cursor: pointer;
			margin-right: 20px;
		}
		.btn-right{
			display: inline-block;
			padding: 5px 20px;
			color: #FFF;
			background-color: #FA8C16;
			border-radius: 20px;
			cursor: pointer;
		}
	}
	.col-org {
		color: #fa8c16;
	}
	.col-blue {
		color: #096dd9;
	}
	.font-blod {
		font-weight: 700;
		color:#101010;
	}
	.bor-bot {
		border-bottom: 1px dotted #ccc;
	}
}
</style>
