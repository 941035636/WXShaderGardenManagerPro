<template>
	<div id="LedMarTable">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="6">
					<div>
						<span class="item2">代理人：</span>
						<el-select v-model="form.userNo" placeholder="请选择" size="medium" class="item1" clearable filterable>
							<el-option v-for="item in agents" :key="item.employeeNum" :label="item.showName" :value="item.employeeNum">
							</el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="6">
					<div>
						<span class="item2">发放月份：</span>
						 <el-date-picker v-model="form.issueMonth" value-format="yyyy-MM" type="month" placeholder="请选择年月" clearable  class="item1"></el-date-picker>
					</div>
				</el-col>
				<el-col :span="6">
					<div>
						<span class="item2">
							<el-select v-model="policyOrE" placeholder="请选择"  size="medium" @change="entryData">
								<el-option label="保单号" :value="1"></el-option>
								<el-option label="批单号" :value="2"></el-option>
							</el-select>
						</span>
						<el-input v-if="policyOrE == 1" placeholder="请输入保单号" v-model="form.policyNo" size="medium" class="item1" clearable></el-input>
						<el-input v-if="policyOrE == 2" placeholder="请输入批单号" v-model="form.endorseNo" size="medium" class="item1" clearable></el-input>
					</div>
				</el-col>
				<el-col :span="6" v-if="!showFlag">
					<div>
						<el-button type="text" class="mr60 fr" v-if="showFlag" @click="showFlag = !showFlag">收起 <i class="el-icon-arrow-up"></i></el-button>
						<el-button type="text" class="mr60 fr" v-if="!showFlag" @click="showFlag = !showFlag">展开 <i class="el-icon-arrow-down"></i></el-button>
						<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查 询</el-button>
						<el-button @click="empty" class="empty-button" type="text">清空条件</el-button>
					</div>
				</el-col>
				<el-col :span="6" v-if="showFlag">
					<div>
						<span class="item2">客户名称：</span>
						<el-input placeholder="请输入客户名称" v-model="form.policyHolder" size="medium" class="item1" clearable></el-input>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg" v-if="showFlag">
				<el-col :span="6">
					<div>
						<span class="item2">险种：</span>
						<el-select v-model="form.riskName" placeholder="请选择" class="item1" size="medium" filterable clearable>
							<el-option v-for="(item,index) in options" :key="index" :label="item" :value="item"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="6">
					<div>
						<span class="item2">营销标记：</span>
						<el-select v-model="form.isValid" placeholder="请选择" class="item1" size="medium" filterable clearable>
							<el-option v-for="(item,index) in options1" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="6">
					<div>
						<span class="item2">分支机构：</span>
						<el-select v-model="form.policyOrgCode" placeholder="请选择分支机构" class="item1" size="medium" filterable clearable>
							<el-option v-for="item in options2" :key="item.jtBranchCode" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="6">
					<div>
						<el-button type="text" class="mr60 fr" v-if="showFlag" @click="showFlag = !showFlag">收起 <i class="el-icon-arrow-up"></i></el-button>
						<el-button type="text" class="mr60 fr" v-if="!showFlag" @click="showFlag = !showFlag">展开 <i class="el-icon-arrow-down"></i></el-button>
						<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查 询</el-button>
						<el-button @click="empty" class="empty-button" type="text">清空条件</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="content-table">
			<p class="tip-p mb20">
				<el-button type="primary" round size="medium" class="fr ml10" @click="addRecord" v-if="datas.find(item => item.key == '110002')">添加佣金记录</el-button>
				<el-button type="warning" round size="medium" class="fr" icon="el-icon-refresh" @click="refreshRecord" v-if="datas.find(item => item.key == '110001')">刷新</el-button>
			</p>
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header :border="true" fit :header-cell-style="getRowClass" @selection-change="handleSelectionChange">
				<el-table-column
					type="selection"
					width="55">
				</el-table-column>
				<el-table-column label="发放月份" align="center" width="110" :resizable="false">
                    <template slot-scope="scope">
						<p>{{scope.row.policyOrgName}}</p>
                        <p><span>{{scope.row.issueMonth}} </span></p>
					</template>
                </el-table-column>
				<el-table-column label="保单/批单信息" align="left" min-width="250" :resizable="false">
					<template slot-scope="scope">
                        <p class="mt5 col-1010"> <span v-if="scope.row.policyHolder">{{scope.row.policyHolder}}  <span v-if="scope.row.businessSource">({{scope.row.businessSource}})</span></span><span v-else>--</span></p>
						<p class="mt5 col-1010">
                            <span v-if="scope.row.incomeDetailNo">收入明细表：{{scope.row.incomeDetailNo.split(',')[0]}} <span @click="seeNOList(scope.row)" class="cz-apply cur-op ml10" v-if="scope.row.incomeDetailNo.split(',').length != 1">{{scope.row.incomeDetailNo.split(',').length}}</span></span>
                        </p>
                        <p class="mt5 col-1010"><span :class="[scope.row.policyNo ? 'round-style policy-blue' : 'round-style pd-grey']">{{scope.row.policyNo ? '保单' : '批单'}}</span> <span v-if="scope.row.policyNo">{{scope.row.policyNo}}</span><span v-if="scope.row.endorseNo">{{scope.row.endorseNo}}</span><span v-if="scope.row.isValid != 3"  @click="seeDetail(scope.row)" class="cz-apply cur-op ml10">查看</span></p>
						<p class="mt5 col-1010">险种：<span v-if="scope.row.riskName">{{scope.row.riskName}}</span><span v-else>--</span></p>
                    </template>
				</el-table-column>
				<el-table-column label="代理人" align="center" min-width="120" :resizable="false">
					<template slot-scope="scope">
                        <p class="mt5 col-1010">
							<span v-if="scope.row.isValid == 1" class="col-gre">全面营销</span>
							<span class="col-red" v-else-if="scope.row.isValid == 0">非全面营销<i class="el-icon-question f16 cur-op" @click="showTip"></i></span>
							<span class="col-red" v-else-if="scope.row.isValid == 2">代理人有误<i class="el-icon-question f16 cur-op" @click="editAgent(scope.row)"></i></span>
							<span class="col-grey" v-else-if="scope.row.isValid == 3">待处理</span>
						</p>
                        <p class="mt5 col-1010">{{scope.row.userName}} {{scope.row.userNo}}</p>
						<p class="mt5"><span class="cz-apply cur-op" @click="checkData(scope.row)">冲正</span>  <span class="cz-apply cur-op ml10" v-if="scope.row.isValid == 2" @click="editAgent(scope.row)">修改</span></p>
                    </template>
				</el-table-column>
				<el-table-column label="实收保费（1）" align="right" :resizable="false">
                    <template slot-scope="scope">
                        <span v-if="scope.row.premium">￥{{scope.row.premium}}</span>
						<span v-else>-</span>
                    </template>
                </el-table-column>
				<el-table-column label="公司佣金率（2）" align="right" :resizable="false">
                    <template slot-scope="scope">
						<span v-if="scope.row.ratio">{{(scope.row.ratio*100).toFixed(2)}} %</span>
						<span v-else>0</span>
					</template>
                </el-table-column>
				<el-table-column label="业务收入（3）=（1）*（2）/1.06" :resizable="false" align="right">
					<template slot-scope="scope">
						<span v-if="scope.row.performance">{{ scope.row.performance}}</span>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column label="业务佣金比例（4）" align="right" :resizable="false">
                    <template slot-scope="scope">
						<span v-if="scope.row.bonusRatio">{{(scope.row.bonusRatio*100).toFixed(2)}} %</span>
						<span v-else>0</span>
					</template>
                </el-table-column>
				<el-table-column label="业务佣金（5）=（1）*（4）" align="right" :resizable="false">
                    <template slot-scope="scope">
                        <span v-if="scope.row.bonusCommission">￥{{scope.row.bonusCommission}}</span>
						<span v-else>-</span>
                    </template>
                </el-table-column>
				<el-table-column label="业务相关费用（6）" align="right" :resizable="false">
                    <template slot-scope="scope">
                        <span v-if="scope.row.businessFee">￥{{scope.row.businessFee}}</span>
						<span v-else>-</span>
                    </template>
                </el-table-column>
				<el-table-column label="应发佣金（7）=（5）-（6）" align="right" :resizable="false">
                    <template slot-scope="scope">
                        <span v-if="scope.row.payCommission">￥{{scope.row.payCommission}}</span>
						<span v-else>-</span>
                    </template>
                </el-table-column>
				<el-table-column label="操作" fixed="right" align="center" min-width="90" :resizable="false">
                    <template slot-scope="scope">
						<p>
                        	<!-- <el-button size="medium" type="text" class="col-blue" v-if="datas.find(item => item.key == '110001')" @click="shareEdit(scope.row)">手动刷新</el-button> -->
						</p>
						<p>
							<el-button size="medium" type="text" v-if="datas.find(item => item.key == '110003') && scope.row.isValid != 3" class="col-blue" @click="editRow(scope.row)">修改</el-button>
						</p>
						<p>
							<el-button size="medium" v-if="(!scope.row.issueMonth || scope.row.isDel) && datas.find(item => item.key == '110004')" type="text" class="col-blue" @click="delRowCom(scope.row)">删除</el-button>
						</p>
                    </template>
                </el-table-column>
			 </el-table>
		</div>
		<div class="content-total">
			<span class="content1-num">实收保费：<span class="col-red" v-if="totalPrem.premiumSum">￥{{totalPrem.premiumSum}}元</span><span v-else>-</span></span> | 
			<span class="content1-num">业务收入：<span class="col-red" v-if="totalPrem.performanceSum">￥{{totalPrem.performanceSum}}元</span><span v-else>-</span></span> | 
			<span class="content1-num">业务佣金：<span class="col-red" v-if="totalPrem.bonusCommissionSum">￥{{totalPrem.bonusCommissionSum}}元</span><span v-else>-</span></span> | 
			<span class="content1-num">应发佣金：<span class="col-red" v-if="totalPrem.payCommissionSum">￥{{totalPrem.payCommissionSum}}元</span><span v-else>-</span></span>  
			<span class="content1-exports"  @click="exports" v-if="total != 0 && datas.find(item => item.key == '110001')"> <i class="el-icon-download"></i>批量导出</span>
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"> </el-pagination>
		</div>
		<el-dialog title="收入明细表编号" :visible.sync="dialogVisible1" width="30%" :before-close="handleClose">
			<div class="f16">
				<el-table border :data="incomeDetailNoList" :header-cell-style="getRowClass2" class="mt5">
					<el-table-column type="index" width="60" align="center"  label="序号"></el-table-column>
					<el-table-column label="收入明细表编号" align="center" prop="no"></el-table-column>
				</el-table>
			</div>
		</el-dialog>
		<el-dialog title="详细信息" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
			<div class="f16">
				<p class="col-1010 font-blod">客户名称：{{detailInfo.policyHolder}}</p>
				<p class="mt10 col-1010">保单/批单号：<span v-if="detailInfo.policyNo">{{detailInfo.policyNo}}</span><span v-if="detailInfo.endorseNo">{{detailInfo.endorseNo}}</span><span class="ml10">类型：<span>{{detailInfo.policyNo ? '保单' : '批单'}}</span><span v-if="detailInfo.businessSource">({{detailInfo.businessSource}})</span></span></p>
				<p class="mt10 col-1010">分支机构：<span v-if="detailInfo.policyOrgName">{{detailInfo.policyOrgName}}</span><span class="ml20" v-if="detailInfo.riskName">险种：{{detailInfo.riskName}}</span></p>
				<el-table border :data="detailInfo.tableData" :header-cell-style="getRowClass1" class="mt10" :row-class-name="tableRowClassName">
					<el-table-column label="代理人" align="center" prop="userName"></el-table-column>
					<el-table-column label="所属机构" align="center" prop="branchName"></el-table-column>
					<el-table-column label="渠道" align="center" prop="channelName"></el-table-column>
				</el-table>
			</div>
		</el-dialog>
		<editDialog ref="editDialog" @successCallback="getAchDetail"></editDialog>
		<addDialog ref="addDialog" :agents="agents" @successCallback="searchview"></addDialog>
		<editAgent ref="editAgent" :agents="agents" @successCallback="getAchDetail" @sucCallback="shareEdit1"></editAgent>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import UserService from '../../service/UserService.js';
import AchievementService from '../../service/AchievementService.js';
import CorrectionManagement from '../../service/CorrectionManagement.js';
import ResourcesService from '../../service/ResourcesService.js';
import RidesService from '../../service/RidesService.js';
import buttonSelection from '../businessProcessing/js/buttonSelection.js';
import channel from '../../../static/data/channel.json'
import editDialog from './components/editDialog.vue'
import addDialog from './components/addDialog.vue'
import editAgent from './components/editAgent.vue'
export default {
	components:{
		editDialog,addDialog,editAgent
	},
	data() {
		return {
			incomeDetailNoList:[],
			detailInfo:{},
			policyOrE:1,
			branchCode:sessionStorage.getItem('branchCode'),
			Elevator:new elevator(),
			ButtonSelection:new buttonSelection(),
            UserService:new UserService(),
			AchievementService: new AchievementService(),
			CorrectionManagement:new CorrectionManagement(),
			ResourcesService: new ResourcesService(),
			RidesService: new RidesService(),
			form:{
				pageNum:1,
				pageSize:10,
				policyNo: '',
				endorseNo:'',
                userNo: '',
                policyOrgCode: '',
				issueMonth:'',
				policyHolder:'',
				isValid:'',
				riskName:'',
			},
			options:[],
			options1:[
				{
					label:'是全面营销',
					value:1,
				},
				{
					label:'非全面营销',
					value:0,
				},
				{
					label:'代理人有误',
					value:2,
				},
				{
					label:'待处理',
					value:3,
				}
			],
			options2:[],
			data1:[],
			total:0,
			pageNum: 1,
			pageSize: 10,
			currentPage:1,
			datas:[],
			exhibition:false,
			row:{},
			dialogVisible:false,
			dialogVisible1:false,
			ruleForm:{
				userLoginId:'',
				password:'',
				checked:true
			},
			showFlag: false,
			totalPrem:{
				premiumSum:0,//实收保费
				performanceSum: 0,//业务佣金合计
				bonusCommissionSum: 0,//奖励佣金合计 
				payCommissionSum: 0 ,//应发佣金合计
			},
			agents:[],
			branchList1:[],
			multipleSelection: [],
		}
	},
	created(){
		this.datas = JSON.parse(window.sessionStorage.getItem('list'));
		this.getRides()
		this.getRiskCodeList();
		this.getAgentList();
		this.getAchDetail();
	},
	methods: {
		entryData() {
			this.form.policyNo = '';
			this.form.endorseNo = '';
		},
		showTip() {
			this.$alert('<p>无标记：代表业管平台是“<span style="color:red">非全面营销业务</span>”，请冲正</p>', '提示信息', {
				dangerouslyUseHTMLString: true
			});
		},
		async getRides() { //获取缓存数据
			let branchRid = await this.RidesService.getRides('sequipListData','sequip','1');
			if(branchRid.code == '0000' && branchRid.data) {
				this.branchList1 = JSON.parse(branchRid.data).branchList;
				this.setBranch();
			} else {
				this.loadBranch()
			}
		},
		editAgent(row) {
			this.$refs.editAgent.initData(row);
		},
		//获取业管险种
		async getRiskCodeList() {
			let res = await this.AchievementService.getRiskCodeList();
			if(res.code == '0000' && res.total) {
				this.options = res.list;
			}
		},
		// 获取所有的分支机构
		async loadBranch(){
			let res = await this.CorrectionManagement.getBranchInfo();
			if(res.code == '0000'){
				this.branchList1 = res.list;
				this.setBranch();
			}
        },
		//设置分支机构
		setBranch() {
			let branchCode = window.sessionStorage.getItem('branchCode');
			let authArr = sessionStorage.getItem('authDataInfo').split(',');
			if(branchCode == 'JT0000'){
				if(!this.branchList1.find(item => item.jtBranchCode == 'JT0000')) {
					this.branchList1.push({
						"jtBranchCode":"JT0000","jtBranchName":"江泰保险经纪股份有限公司本部"
					})
				}
				this.options2 = this.branchList1;
			}else{
				authArr.forEach(authBranch => {
					if(authBranch == 'JT0144000') {
						this.options2.push({"jtBranchCode":"JT0144001","jtBranchName":"广东分公司本部"})
					}
					this.branchList1.forEach(item =>{
						if(item.jtBranchCode == authBranch){
							this.options2.push(item)
						}
					})
				})
				// this.form.policyOrgCode = sessionStorage.getItem('authDataInfo')
			}
		},
		handleCurrentChange: function(pageNum){//页码
			this.pageNum = pageNum;
			this.getAchDetail();
		},
		searchview(){//查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.getAchDetail();
		},
		empty(){//清空
			this.form = {
				pageNum:1,
				pageSize:10,
				policyNo: '',
                userNo: '',
				issueMonth:'',
				policyHolder:'',
				isValid:'',
				riskName:'',
				policyOrgCode:''
			};
			this.pageNum = 1;
			this.currentPage = 1;
			this.getAchDetail();
		},
		async getAchDetail() {
			this.form.pageNum = this.pageNum;
			let params = JSON.parse(JSON.stringify(this.form))
			params.policyOrgCode = this.branchCode == 'JT0000' ? this.form.policyOrgCode ? this.form.policyOrgCode : '' : this.form.policyOrgCode ? this.form.policyOrgCode : sessionStorage.getItem('authDataInfo');
			this.getTotalInfo();
			let res = await this.AchievementService.getAchDetail(params);
			if(res.code == '0000') {
				res.list.forEach(i => {
					i.tableData = [
						{
							userName: i.userName + ' (' + i.userNo + ')',
							branchName: i.branchName,
							channelName: channel.data.find(e => e.code == i.channelCode) ? channel.data.find(e => e.code == i.channelCode).name : '',
							isValid: i.isValid
						}
					]
					let flag = new Date(i.issueMonth).getMonth() == new Date().getMonth() || new Date(i.issueMonth).getMonth() == new Date().getMonth() -1;
					i.isDel = i.isValid != '1' && i.issueMonth && flag
				})
				this.data1 = res.list;
				this.total = res.total;
			}
		},
		//获取佣金统计信息
		async getTotalInfo() {
			let params = JSON.parse(JSON.stringify(this.form))
			params.policyOrgCode = this.branchCode == 'JT0000' ? this.form.policyOrgCode ? this.form.policyOrgCode : '' : this.form.policyOrgCode ? this.form.policyOrgCode : sessionStorage.getItem('authDataInfo');
			let res = await this.AchievementService.getSum(params);
			if(res.code == '0000' && res.data) {
				this.totalPrem = {
					premiumSum: res.data.premiumSum,//实收保费
					performanceSum: res.data.performanceSum,//业务佣金合计
					bonusCommissionSum: res.data.bonusCommissionSum,//奖励佣金合计 
					payCommissionSum: res.data.payCommissionSum,//应发佣金合计
				};
			} else {
				this.totalPrem = {
					premiumSum:0,//实收保费
					performanceSum: 0,//业务佣金合计
					bonusCommissionSum: 0,//奖励佣金合计 
					payCommissionSum: 0 ,//应发佣金合计
				};
			}
		},
		editRow(row) {
			this.$refs.editDialog.initData(row);
		},
		addRecord() {
			this.$refs.addDialog.initData();
		},
		//查询全面营销人员列表
		async getAgentList() {
			let obj = {
				jtBranchCode: this.branchCode == 'JT0000' ? '' : sessionStorage.getItem('authDataInfo'),
				hrPersonCategory: '08',
				pageSize:10000,
				pageNum:1
			}
            let res = await this.UserService.getUserByNo(obj);
			if(res.code == '0000' && res.total != 0) {
				res.list.forEach(item => {
					item.showName = item.userName + '(' + item.employeeNum + ')';
				})
				this.agents = res.list;
			} else {
				this.agents = [];
			}
		},
		getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #e6f7ff;color:#096dd9;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
		getRowClass2({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #f7f7f7;color:#101010;font-size:14px;font-weight:700;';
            } else {
                return 'background: #fff';
            }
		},
		tableRowClassName({row, rowIndex}) {
			if(row.isValid == 0 && rowIndex === 0) {
				return 'col-red';
			}
				return '';
      	},
		getRowClass({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #e6f7ff;color:#101010;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
		async checkData(row) {
			let parData = {
				correctNo:row.policyNo ? row.policyNo : row.endorseNo, // 冲正单号
				pn:1,
				ps:1000
			};
			let res = await this.CorrectionManagement.getPunchList(parData);
			if(res.code == '0000') {
				if(res.list.length == 0) {
					this.$router.push({
						path:'/rectifyApplication',
						query:{
							correctNo: row.policyNo ? row.policyNo : row.endorseNo,
							orderType: row.policyNo ? 1 : 2,
						}
					})
				} else {
					if(res.list.find(item => item.approveStatus != '4' && item.correctStatus != '2')) {
						this.$confirm('存在“进行中”的冲正申请，是否跳转查看?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$router.push({
								path:'/rectifyResult',
								query:{
									id: res.list.find(item => item.approveStatus != '4' && item.correctStatus != '2').id,
									flag: res.list.find(item => item.approveStatus != '4' && item.correctStatus != '2').orderType,
								}
							})
						}).catch(() => {
							         
						});
					} else {
						this.$router.push({
							path:'/rectifyApplication',
							query:{
								correctNo: row.policyNo ? row.policyNo : row.endorseNo,
								orderType: row.policyNo ? 1 : 2,
							}
						})
					}
				}
				console.log(res);
			}
		},
		shareEdit1(row,agentData,flag) {
			row.userCode = agentData.userCode;
			row.userName = agentData.userName;
			row.userNo = agentData.userNo;
			row.branchCode = agentData.branchCode;
			row.branchName = agentData.branchName;
			row.channelCode = agentData.channelCode;
			this.shareEdit(row,true,flag);
		},
		async shareEdit(row,flag,flag1) {
			let arr = [];
			arr.push(row);
			let res = await this.AchievementService.refreshRow(arr);
			if(res.code == '0000') {
				if(!flag) {
					this.$message.success('刷新成功。');
				}
				let no = row.policyNo ? row.policyNo : row.endorseNo;
				let msg = '营销员工号：' + row.userNo + '，保单/批单号：' + no;
				this.$logger.info(
					'M9-003','',
					{
						'recordMsg': msg,
						'total':1,
					}
				);
				// this.searchview();
				if(!flag) {
					this.getAchDetail();
				}
				if(flag1) {
					this.getAchDetail();
				}
			} 
		},
		delRowCom(row) {
			this.$confirm('此操作将删除此数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.delRow(row)
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
		},
		async delRow(row) {
			let res = await this.AchievementService.delRecord(row.id);
			if(res.code == '0000') {
				this.$message.success('删除成功。');
				let no = row.policyNo ? row.policyNo : row.endorseNo;
				let msg = '记录ID:' + row.id + '，营销员工号：' + row.userNo + '，保单/批单号：' + no;
				this.$logger.info(
					'M9-005','',
					{
						'recordMsg': msg,
						'polNoOREnNO':no
					}
				);
				this.getAchDetail()
			} 
		},
		async exports(){ // 投保单导出
			if(this.total <= 5000){
				let polOrgCode = this.branchCode == 'JT0000' ? this.form.policyOrgCode ? this.form.policyOrgCode : '' : this.form.policyOrgCode ? this.form.policyOrgCode : sessionStorage.getItem('authDataInfo');
				let href = this.$apiUrl.JXEXPORTSS +
					'?userNo=' +this.form.userNo + 
					'&issueMonth=' +this.form.issueMonth + 
					'&policyNo=' +this.form.policyNo + 
					'&policyHolder=' +this.form.policyHolder + 
					'&isValid=' +this.form.isValid + 
					'&riskName=' +this.form.riskName + 
					'&policyOrgCode=' +polOrgCode + 
					'&endorseNo=' +this.form.endorseNo + 
					'&pageNum=' +this.form.pageNum + 
					'&pageSize=' +this.form.pageSize;
				this.$logger.info(
					'M9-002','',
					{
						'userName':window.sessionStorage.getItem('userName'),
						'branchName':window.sessionStorage.getItem('branchName'),
						'total':this.total,
					}
				);
				this.ResourcesService.exportsViewFile(href)
				this.trackEvent('统计','导出佣金明细表');
				
			}else{
				this.$message({
					message: "数据量过大,超过500页,请缩小查询范围！",
					type: 'warning'
				});
			}
		},
		//查看详情
		seeDetail(row) {
			this.detailInfo = row;
			this.dialogVisible = true;
		},
		seeNOList(row) {
			this.incomeDetailNoList = [];
			row.incomeDetailNo.split(',').forEach(i => {
				this.incomeDetailNoList.push({
					no:i
				})
			})
			this.dialogVisible1 = true;
		},
		handleClose() {
			this.dialogVisible = false;
			this.dialogVisible1 = false;
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		async refreshRecord() {
			if(this.multipleSelection.length == 0) {
				this.$message({
					message: "请选择要刷新的数据！",
					type: 'warning'
				});
				return
			}
			let res = await this.AchievementService.refreshRow(this.multipleSelection);
			if(res.code == '0000') {
				this.$message.success('刷新成功。');
				let msg = '';
				this.multipleSelection.forEach(i => {
					let no = i.policyNo ? i.policyNo : i.endorseNo;
					msg += '营销员工号：' + i.userNo + '，保单/批单号：' + no + ';';
				})
				this.$logger.info(
					'M9-003','',
					{
						'recordMsg': msg,
						'total':this.multipleSelection.length,
					}
				);
				this.getAchDetail();
			} else {
				this.getAchDetail();
			}
		}
		
	},
}
</script>

<style lang="less">
#LedMarTable{
	padding-bottom: 80px;
	.elesearch{
		width: calc(100% - 40px);
		padding: 20px 20px 10px;
		margin: 20px 20px 20px 20px;
		box-sizing: border-box;
		background-color: #fff;	
		.row-bg{
			margin-bottom: 20px;
			.item1{
				width: 65%;
			}
			.item2{
				display: inline-block;
				width: 30%;
				text-align: right;
				font-size: 16px;
				color: #666666;
				margin-right: 10px;
				// overflow: hidden;
				text-overflow:ellipsis;
                white-space: nowrap;
                line-height: 15px;
			}
			.query-button{
				float: right;
				font-weight: 600;
				width: 100px;
				margin-left: 20px;
			}
			.empty-button{
				float: right;
				margin-left: 30px;
				color: #2491fc;
				font-weight: 500;
				text-decoration: underline;
			}
		}
	}
	.content1{
		width: 100%;
		text-align: right;
		padding: 31px 37px 20px 21px;
		box-sizing: border-box;
	}
	.content-table{
		margin: 0 20px;
		background-color: #ffffff;
		width: calc(100% - 40px);
		padding: 0 20px 30px;
		box-sizing: border-box;
		.tip-p {
			padding: 20px 0;
		}
		.cz-apply {
			color: #096dd9;
		}
		.mt5 {
			margin-top: 5px;
		}
		.round-style {
			background-color: #40a9ff;
			padding: 1px 8px;
    		border-radius: 11px;
			color: #ffffff;
		}
		.policy-blue {
			background-color: #40a9ff;
		}
		.pd-grey {
			background-color: #919191;
		}
	}
	.content-total{
		width: calc(100% - 284px);
		margin: 30px 30px 0 20px;
		height: 60px;
		line-height: 60px;
		position: fixed;
		bottom: 0;
		background-color: #f6f7fc;
		z-index: 1000;
		.el-pagination {
    		margin-top: 15px;
			float: right;
		}
		.content1-exports{
			margin-left: 5px;
			font-size: 14px;
			cursor: pointer;
			color: #1E90FF;
		}
		.content1-num {
			font-size: 14px;
			margin-left: 5px;
			margin-right: 5px;
		}
		.col-blue {
			color: #1E90FF;
		}
		.col-red {
			color: #f5222d;
		}
		.col-org {
			color: #DB9728;
		}
	}
	.generation{
		display: inline-block;
		width: 103px;
		height: 34px;
		border: 1px solid #C9984A;
		border-radius:4px;
		box-sizing: border-box;
		text-align: center;
		line-height: 34px;
		margin-left: 10px;
		font-size: 14px;
		color: #C9984A;
		font-weight: 600;
		background-color: #FFF8EE;
		cursor: pointer;
	}
	.color6{
		color: #666666;
	}
	.color-blue {
		cursor: pointer;
		color: #2d8cf0;
	}
	.register-btn{
		display: inline-block;
		width: 162px;
		height: 44px;
		background:rgba(201,152,74,1);
		border-radius:4px;
		font-family:Adobe Heiti Std;
		color: #ffffff;
		font-size: 18px;
		text-align: center;
		line-height: 44px;
		cursor: pointer;
    }
    .col-red {
		color: #f5222d;
	}
	.col-gre {
		color:#52c41a;
	}
	.cur-op {
		cursor: pointer;
    }
    .col-grey {
        color:#848484;
    }
    .col-blue {
        color: #0432ff;
    }
	.col-1010 {
		color: #101010;
	}
	.font-blod {
		font-weight: 700;
	}
	.el-dialog__body {
		padding: 20px 20px 30px;
	}
}
</style>
