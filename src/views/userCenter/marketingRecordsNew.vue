<template>
	<div id="marketingRecordsNew">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">客户名称</span>
						<el-input size="medium" v-model="data.customerName" placeholder="请输入客户名称" class="item2"
							clearable></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">服务时间</span>
						<el-date-picker size="medium" v-model="data.visitStartDate" type="date" class="item5"
							placeholder="开始日期" value-format="yyyy-MM-dd  00:00:00"></el-date-picker>
						<el-date-picker size="medium" v-model="data.visitEndDate" type="date" class="item5"
							placeholder="结束日期" value-format="yyyy-MM-dd  23:59:59"></el-date-picker>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">客户地区</span>
						<el-cascader size="medium" :options="areaOptins" placeholder="请选择" change-on-select
							v-model="regionCoding" class="item2" clearable></el-cascader>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">服务内容</span>
						<el-select size="medium" v-model="data.visitPeriod" placeholder="请选择" @change="changeServiceCon"
							class="item5" clearable>
							<el-option v-for="item in visitStageOptions" :key="item.code" :label="item.msg"
								:value="item.code"></el-option>
						</el-select>
						<el-select size="medium" v-model="data.visitCause" placeholder="请选择" class="item5" clearable>
							<el-option v-for="item in visitCauseOptions" :key="item.code" :label="item.msg"
								:value="item.code"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">服务方式</span>
						<el-select size="medium" v-model="data.visitMode" placeholder="请选择服务方式" class="item2" clearable>
							<el-option v-for="item in visitModeOptions" :key="item.code" :label="item.msg"
								:value="item.code"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">运营类型</span>
						<el-select size="medium" v-model="data.operationType" placeholder="请选择" class="item2" clearable>
							<el-option v-for="item in customerTypeOptins" :key="item.value" :label="item.label"
								:value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div>
						<span class="item3">客户星级</span>
						<el-select size="medium" v-model="data.level" placeholder="请选择" class="item2" clearable>
							<el-option v-for="item in levelOptins" :key="item.value" :label="item.label"
								:value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div>
						<span class="item3">拜访次数</span>
						<el-select size="medium" v-model="data.visitTimes" placeholder="请选择" class="item2" clearable>
							<el-option v-for="item in visitTimesOptins" :key="item.value" :label="item.label"
								:value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8" v-if="showBranch">
					<div>
						<span class="item3">业务员</span>
						<el-input size="medium" v-model="data.bizOperatorName" placeholder="请输入内容" class="item2"
							clearable></el-input>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">

				<el-col :span="8">
					<div v-if="showBranch">
						<span class="item3">分支机构</span>
						<el-select size="medium" v-model="data.branches" filterable placeholder="请选择" class="item2"
							clearable>
							<el-option v-for="(item, index) in branchOptins" :key="index" :label="item.jtBranchName"
								:value="item.jtBranchCode"></el-option>
						</el-select>
					</div>
				</el-col>

				<el-col :span="16">
					<div>
						<!-- <el-button type="text" class="mr60 fr" v-if="showFlag" @click="showFlag = !showFlag">收起 <i class="el-icon-arrow-up"></i></el-button>
						<el-button type="text" class="mr60 fr" v-if="!showFlag" @click="showFlag = !showFlag">展开 <i class="el-icon-arrow-down"></i></el-button> -->
						<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查
							询</el-button>
						<el-button @click="empty" class="empty-button" round size="medium" type="info">清空条件</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="content">
			<!-- <div class="content1">
				<el-button type="primary" v-if="datas.find(item => item.key == '70012')" @click="addRecords" round size="medium" class="w100 fr mr20 mt20 mb20">新增</el-button>
			</div> -->

			<div class="content-table">
				<div class="table-top">
					<div class="table-top-l">
						<span>客户类型:</span>
						<!-- form.customerType -->
						<div>
							<span v-for="(item, key) in companyTypeOptins" :key="key"
								:class="{ 'state-active': item.value == data.customerType }"
								@click="setCustomerType(item.value)">{{ item.label }}</span>
						</div>
					</div>
					<div class="set-sccount-manager">
						<!-- <span style="color:#FA8C16;" @click="addRecords">保险推介书及建议书模板下载</span> -->
					</div>
				</div>
				<el-table :data="tableData" style="width: 100%" highlight-current-row show-header border fit
					:header-cell-style="getRowClass">
					<el-table-column label="服务日期" align="left" min-width="100">
						<template slot-scope="scope">
							<p>{{ scope.row.visitDate }}</p>
							<p><span class="time-style">{{ scope.row.visitDuration }}小时</span></p>
						</template>
					</el-table-column>
					<el-table-column label="客户信息" align="left" min-width="300">
						<template slot-scope="scope">
							<p style="font-weight:600;color:#000;">{{ scope.row.companyName }}<span
									v-if="scope.row.levelName">（{{ scope.row.levelName }}）</span></p>
							<p>{{ scope.row.provinceName }}/{{ scope.row.cityName }}/{{ scope.row.areaName }}</p>
							<div>
								<span class="cellLeftBox" v-if="scope.row.customerTypeName">{{ scope.row.customerTypeName
								}}</span>
								<span class="cellRightBox" v-if="scope.row.operationTypeName">{{ scope.row.operationTypeName
								}}</span>
								<span class="cellRightBox" v-if="scope.row.visitTimesDesc">{{ scope.row.visitTimesDesc
								}}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="联系人" align="left" min-width="150">
						<template slot-scope="scope">
							<p>{{ scope.row.visitName }}<span v-if="scope.row.visitPost">/{{ scope.row.visitPost }}</span>
							</p>
						</template>
					</el-table-column>
					<el-table-column prop="areaCode" label="服务阶段/服务内容" align="left" min-width="300">
						<template slot-scope="scope">
							<span class="col-blue">{{ scope.row.periodNames }}</span>
						</template>
					</el-table-column>
					<el-table-column label="服务方式" align="left" min-width="130">
						<template slot-scope="scope">
							<span>{{ scope.row.visitModeName }}</span>
						</template>
					</el-table-column>
					<!-- <el-table-column label="录入时间" prop="createTime" align="center" min-width="100"></el-table-column> -->
					<el-table-column label="录入时间/业务员" align="left" min-width="200">
						<template slot-scope="scope">
							<p>{{ scope.row.createTime }}</p>
							<p>{{ scope.row.name[0] }}<span class="ml10 col-blue cur-op" @click="showPerson(scope.row.name)"
									v-if="scope.row.name.length > 1">共{{ scope.row.name.length }}人</span>/<span>{{
										scope.row.orgName }}<span></span></span>
							</p>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" align="center" min-width="130">
						<template slot-scope="scope" type="flex">
							<el-button type="text" v-if="datas.find(item => item.key == '70016')"
								@click="editRecord(scope.row)">修改</el-button>
							<el-button type="text" v-if="datas.find(item => item.key == '70017')"
								@click="seeRecord(scope.row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="content-total">
			<span class="ml20 f14 mr10">查询结果：<span style="color:#333333;margin-right:5px">{{ total }}</span>条记录</span>
			<span style="margin:0 10px;">|</span>
			<span style="color: #1890ff; cursor: pointer" @click="downloadUser()"><i
					class="el-icon-download"></i>批量导出</span>
			<el-pagination v-if="showPage" background @current-change="handleCurrentChange" :current-page="currentPage"
				:page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<el-dialog title="业务员清单" :visible.sync="dialogFormVisible" width="30%">
			<el-table :data="personList" border>
				<el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
				<el-table-column property="perName" align="center" label="业务员姓名"></el-table-column>
			</el-table>
		</el-dialog>
		<addRecordNew ref="addRecordNew" :area="areaOptins" :serviceMode="visitModeOptions"
			:visitFilesOptins="visitFilesOptins" :serviceContent="visitStageOptions" @successCallback="searchview">
		</addRecordNew>
		<recordDetailNew ref="recordDetailNew"></recordDetailNew>
	</div>
</template>

<script>
import ResourcesService from '@/service/ResourcesService';
import userManageService from '@/service/userManageService';
import moment from 'moment';
import addRecordNew from './components/addRecordNew.vue'
import recordDetailNew from './components/recordDetailNew.vue'
export default {
	components: {
		addRecordNew, recordDetailNew
	},
	data() {
		return {
			userManageService: new userManageService(),
			ResourcesService: new ResourcesService(),
			showPage: true,
			data: {
				userCode: '',
				provinceCode: '',//省编码
				cityCode: '',//市编码
				areaCode: '',//区编码
				customerName: '',//企业名称(模糊搜索)
				visitStartDate: '',//拜访开始时间
				visitEndDate: '',//拜访结束时间
				name: '',//拜访人模糊搜索
				branches: '',//分支机构编码
				visitMode: '',//拜访方式 1-上门拜访 ,2-电话拜访,3-其他 ,4-邮寄 ,5-微信/QQ, 6-电子邮件
				visitPeriod: '',//拜访阶段 1-客户营销 2-指导自助投保 3-期内服务
				visitCause: '',//拜访事由 1-拜访、2-保险推介书、3-历史保单分析、4-产品对比 5-续保、6-事故预防、7-协助索赔
				type: '1',//拜访类型 1-企业拜访 2-行管拜访 3-个人拜访
				"bizOperatorCode": "", // 拜访人员
				"branches": "",
				"customerType": "",  // 客户类型
				"level": '',
				"operationType": "",	// MBKH ; 目标客户,XYXB;续约续保,QYTB;签约投保
				"page": 1,
				"pageSize": 10,
				"channel": "sequip",    // 安保或者特设（不用传，会根据sysCode取安保或特设）
				"visitTimes": "",
				"bizOperatorName": "",
				"orderBy": "visit_date desc,create_time",
			},
			regionCoding: [],//选择的地区
			tableData: [],
			total: 0,
			pageNum: 1,
			pagesize: 10,
			currentPage: 1,
			showFlag: false,
			showBranch: false,
			dialogFormVisible: false,
			personList: [],
			datas: [],  // 权限模块
			visitModeOptions: [],
			visitStageOptions: [],
			customerStatusOptins: [],
			companyTypeOptins: [], // 客户类型
			areaOptins: [],
			branchOptins: [],
			levelOptins: [],
			visitTimesOptins: [], // 拜访次数
			customerTypeOptins: [],    // 目标客户
			industryTypeOptins: [],    // 行业客户
			visitFilesOptins: [],    // 拜访资料
			visitCauseOptions: [],    // 拜访资料

		}
	},
	created() {
		this.initialization();
	},
	methods: {
		//导出    
		async downloadUser() {
			if (this.total <= 0) {
				this.$message({
					message: "导出数量为0,暂时无法导出！",
					type: 'warning'
				});
				return
			}
			if (this.total > 5000) {
				this.$message({
					message: "数据量过大,超过5000条,请缩小查询范围！",
					type: 'warning'
				});
				return
			}
			let formData = {...this.data}
			formData.pageSize = this.total||0
		
			let res = await this.userManageService.postVisitExport(formData)
			if (res.headers['content-type'].includes('application/vnd.ms-excel')) {
				let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
				const fileName = `${new Date().valueOf()}.xlsx`;
				const link = document.createElement("a");
				link.href = window.URL.createObjectURL(blob);
				link.download = fileName;
				link.click();
				window.URL.revokeObjectURL(link.href);
			} else if (res.headers['content-type'].includes('application/json')) {
				let enc = new TextDecoder('utf-8')
				this.$message.error(JSON.parse(enc.decode(new Uint8Array(res.data))).msg)
			}
		},

		// 初始化
		initialization() {
			this.datas = JSON.parse(window.sessionStorage.getItem('list'));
			this.getIsHeadOffice()
			this.getCustomerVisitEnum()
			this.getCustomerManagementEnum()
			this.getBranchInfo()
			this.getArea()
			this.getVisitList()
		},
		// 是否为总公司
		getIsHeadOffice() {
			if (window.sessionStorage.getItem('branchCode') == 'JT0000') {
				this.showBranch = true;
			} else {
				this.showBranch = false;
			}
		},
		// 获取拜访的枚举
		async getCustomerVisitEnum() {
			let { code, data } = await this.userManageService.getCustomerVisitEnum()
			if (code === '0000') {
				this.visitModeOptions = data.visitMode
				this.visitFilesOptins = this.getObjectChangeArray(data.visitFiles)
				this.visitStageOptions = data.visitStage.map(item => {
					item.value = item.code;
					item.label = item.msg;
					item.children = item.group.map(t => {
						t.value = t.code;
						t.label = t.msg;
						return t
					})
					return item
				})
			}
		},
		// 获取用户管理的枚举
		async getCustomerManagementEnum() {
			let { code, data } = await this.userManageService.getCustomerManagementEnum()
			if (code === '0000') {
				this.levelOptins = this.getObjectChangeArray(data.level)
				this.customerTypeOptins = this.getObjectChangeArray(data.customerType)
				this.industryTypeOptins = this.getObjectChangeArray(data.sequipIndustry)
				this.visitTimesOptins = this.getObjectChangeArray(data.visitTimes)
				this.customerStatusOptins = [
					{
						label: '全部',
						value: '',
					},
					...this.getObjectChangeArray(data.customerStatus)
				]
				this.companyTypeOptins = [
					{
						label: '全部',
						value: '',
					},
					...this.getObjectChangeArray(data.companyType),
					{
						label: '个人客户',
						value: '0',
					}
				]

			}
		},
		// object转成array
		getObjectChangeArray(obj) {
			let list = Object.keys(obj).map(item => {
				return {
					label: obj[item],
					value: item,
				}
			})
			return list
		},
		// 设置表头样式
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return 'background: #e6f7ff;color: #0050b3;'
			} else {
				return ''
			}
		},
		// 获取地区
		async getArea() {
			let { code, data } = await this.userManageService.getAreas()
			if (code === '0000') {
				this.areaOptins = data
			}
		},
		// 获取所有的分支机构
		async getBranchInfo() {
			let { data: { code, list } } = await this.userManageService.getBranchInfo()
			if (code === '0000') {
				this.branchOptins = list
			}
		},
		async getVisitList() { // 获取投保单列表
			this.data.page = this.pageNum;
			if (this.regionCoding.length == 1) {
				this.data.provinceCode = this.regionCoding[0];
				this.data.cityCode = '';
				this.data.areaCode = '';
			} else if (this.regionCoding.length == 2) {
				this.data.provinceCode = this.regionCoding[0];
				this.data.cityCode = this.regionCoding[1];
				this.data.areaCode = '';
			} else if (this.regionCoding.length == 3) {
				this.data.provinceCode = this.regionCoding[0];
				this.data.cityCode = this.regionCoding[1];
				this.data.areaCode = this.regionCoding[2];
			} else {
				this.data.provinceCode = '';
				this.data.cityCode = '';
				this.data.areaCode = '';
			};
			let { code, data: { records = [], total } } = await this.userManageService.getCustomerVisitList(this.data);
			if (code == '0000') {
				this.tableData = records.map(item => {
					return {
						...item,
						periodNames: item.periodParamList.map(v1 => {
							return `${v1.visitPeriodName}/${v1.visitCauseName}`
						}).join(',')
					}
				});
				this.total = total;
				if (!total) {
					this.$message({
						message: "暂无数据！",
						type: 'warning'
					});
				}
			}
			this.showPage = true
		},
		searchview() { //查询
			this.pageNum = 1;
			this.currentPage = 1;
			this.showPage = false
			this.getVisitList();
		},
		async exports() { // 导出
			if (this.total <= 5000) {
				let href = this.$apiUrl.EXPORTSS_VISIT +
					'?customerName=' + this.data.customerName +
					'&name=' + this.data.name +
					'&visitStartDate=' + this.data.visitStartDate +
					'&visitEndDate=' + this.data.visitEndDate +
					'&visitMode=' + this.data.visitMode +
					'&visitPeriod=' + this.data.visitPeriod +
					'&provinceCode=' + this.data.provinceCode +
					'&cityCode=' + this.data.cityCode +
					'&areaCode=' + this.data.areaCode +
					'&visitCause=' + this.data.visitCause +
					'&type=1' +
					'&branches=' + this.data.branches +
					'&userCode=' + this.data.userCode;
				this.ResourcesService.exportsViewFile(href)
				this.trackEvent('统计', '导出拜访列表');
			} else {
				this.$message({
					message: "数据量过大,超过500页,请缩小查询范围！",
					type: 'warning'
				});
			}
		},
		empty() { //清空
			this.data = {
				userCode: '',
				provinceCode: '',//省编码
				cityCode: '',//市编码
				areaCode: '',//区编码
				customerName: '',//企业名称(模糊搜索)
				visitStartDate: '',//拜访开始时间
				visitEndDate: '',//拜访结束时间
				name: '',//拜访人模糊搜索
				branches: '',//分支机构编码
				visitMode: '',//拜访方式 1-上门拜访 ,2-电话拜访,3-其他 ,4-邮寄 ,5-微信/QQ, 6-电子邮件
				visitPeriod: '',//拜访阶段 1-客户营销 2-指导自助投保 3-期内服务
				visitCause: '',//拜访事由 1-拜访、2-保险推介书、3-历史保单分析、4-产品对比 5-续保、6-事故预防、7-协助索赔
				type: '1',//拜访类型 1-企业拜访 2-行管拜访 3-个人拜访
				"bizOperatorCode": "", // 拜访人员
				"branches": "",
				"customerType": "",  // 客户类型
				"level": '',
				"operationType": "",	// MBKH ; 目标客户,XYXB;续约续保,QYTB;签约投保
				"page": 1,
				"pageSize": 10,
				"channel": "sequip",    // 安保或者特设（不用传，会根据sysCode取安保或特设）
				"visitTimes": "",
				"bizOperatorName": "",
				"orderBy": "visit_date desc,create_time",
			};
			this.regionCoding = [];
			this.pageNum = 1;
			this.currentPage = 1;
			this.tableData = [];
			this.total = 0;
			this.getVisitList();
		},
		addRecords() {
			this.$refs.addRecordNew.initData();
		},
		editRecord(row) {
			this.$refs.addRecordNew.initData(row.id);
		},
		seeRecord(row) {
			this.$refs.recordDetailNew.initData(row.id);
		},
		handleCurrentChange: function (pageNum) {
			this.pageNum = pageNum;
			this.getVisitList();
		},
		handleSelect(item) {
			console.log(item);
		},
		showPerson(data) {
			console.log(data)
			this.personList = [];
			data.forEach(i => {
				let obj = {
					perName: i
				}
				this.personList.push(obj)
			})
			this.dialogFormVisible = true;
		},
		// 切换客户类型
		setCustomerType(val) {
			this.data.customerType = val
			this.getVisitList();
		},
		changeServiceCon() {
			this.visitCauseOptions = [];
			this.data.visitCause = '';
			this.data.visitPeriod && this.visitStageOptions.find(i => i.code == this.data.visitPeriod) ? this.visitCauseOptions = this.visitStageOptions.find(i => i.code == this.data.visitPeriod).group : [];
		},
	},
}
</script>

<style lang="less">
#marketingRecordsNew {
	padding-bottom: 80px;
	box-sizing: border-box;

	.elesearch {
		width: calc(100% - 40px);
		min-height: 160px;
		padding: 20px 20px 10px;
		margin: 0px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;

		.row-bg {
			margin-bottom: 20px;

			.item1 {
				width: 25%;
				margin-right: 10px;
				margin-left: 0%;

				input {
					border: none;
					font-size: 16px;
					min-width: 110px;
				}

				.el-select__caret {
					color: #000000;
					font-weight: 700;
				}
			}

			.item2 {
				width: 60%;
			}

			.item3 {
				display: inline-block;
				width: 25%;
				text-align: right;
				font-size: 16px;
				color: #666666;
				margin-right: 10px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				vertical-align: text-bottom;
			}

			.item4 {
				width: 18%;
				margin-right: 10px;
			}

			.item5 {
				width: 30%;
			}

			.query-button {
				float: right;
				font-weight: 600;
				width: 100px;
				margin-left: 20px;
			}

			.empty-button {
				float: right;
				margin-left: 30px;
				// color: #2491fc;
				font-weight: 500;
				// text-decoration: underline;
			}
		}
	}

	.content {
		width: calc(100% - 40px);
		margin: 20px 20px 0 20px;
		background-color: #ffffff;

		.w100 {
			width: 100px;
		}

		.w80 {
			width: 80px;
			border: 1px solid #E6A23C;
			color: #E6A23C;
		}

		.el-button--warning {
			background-color: #ffe7ba;
		}

		.is-round {
			padding: 8px 22px;
		}

		.state-style {
			background-color: #ffffff;
			font-size: 16px;

			.is-active {
				background: #E6A23C;
				color: #fbfbfb !important;
				font-size: 16px;
				border-right-color: #E6A23C;
				border-left-color: #E6A23C;
			}

			.el-tabs__header {
				background-color: #ffffff;
				border-bottom: 2px solid #ffa940;
				margin: 0;
			}

			.el-tabs__content {
				display: none;
			}

			.el-tabs__item {
				padding: 0 35px;
				height: 40px;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				line-height: 40px;
				display: inline-block;
				list-style: none;
				font-size: 16px;
				font-weight: 500;
				color: #101010;
				position: relative;
			}
		}

		.table-top {
			padding: 20px 0px 20px;
			display: flex;
			box-sizing: border-box;
			justify-content: space-between
		}

		.table-top-l {
			display: flex;
			align-items: center;

			div {
				display: flex;

				span {
					padding: 6px 20px;
					border: 1px solid #096DD9;
					border-radius: 50px;
					margin-left: 25px;
					color: #096DD9;
					cursor: pointer;
				}
			}
		}

		.set-sccount-manager {
			box-sizing: border-box;
			display: flex;
			flex-direction: row-reverse;
			padding: 17px 0px;
			cursor: pointer;

			div {
				padding: 8px 25px;
				color: #fff;
				border-radius: 19px;
				background: #1890ff;
			}
		}

		.content-table {
			width: 100%;
			padding: 0 20px 30px;
			margin-bottom: 40px;
			box-sizing: border-box;

			.time-style {
				background-color: #ffe7ba;
				border-radius: 13px;
				padding: 2px 6px;
			}

			.tip-text {
				display: flex;
				align-content: space-around;
				flex-wrap: wrap;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;

				.search-title {
					font-size: 16px;
					color: #101010;
					font-weight: 600;
				}
			}

			.content-title {
				width: 100%;
				height: 60px;
				line-height: 60px;
				border: 1px solid #F1EEE9;
				box-sizing: border-box;
				color: #666666;
				font-size: 16px;
				font-weight: 600;
				display: flex;

				span {
					display: block;
					text-align: center;
				}

				.title1 {
					width: 30%;
				}

				.title2 {
					width: 20%;
				}

				.title3 {
					width: 12%;
				}

				.title4 {
					width: 13%;
				}

				.title5 {
					width: 15%;
				}

				.title6 {
					width: 10%;
				}
			}

			.table {
				width: 100%;
				border: 1px solid #f5f5f5;
				box-sizing: border-box;

				.table-title {
					width: 100%;
					height: 44px;
					line-height: 44px;
					background-color: #f5f5f5;
					padding-left: 20px;
					box-sizing: border-box;

					.new-insurance {
						display: inline-block;
						box-sizing: border-box;
						color: #f5222d;
						text-align: center;
						line-height: 24px;
					}
				}

				.table-data {
					width: 100%;
					min-height: 180px;
					display: flex;

					.title1 {
						width: 50%;
						min-height: 100%;
						position: relative;
					}

					.title2 {
						width: 20%;
						min-height: 100%;
						position: relative;
					}

					.title3 {
						width: 12%;
						min-height: 100%;
						position: relative;
					}

					.title4 {
						width: 13%;
						min-height: 100%;
						position: relative;
					}

					.title5 {
						width: 15%;
						min-height: 100%;
						position: relative;
					}

					.title6 {
						width: 10%;
						min-height: 100%;
						position: relative;
					}

					.data-item {
						padding: 16px 20px;
						box-sizing: border-box;
						border-right: 1px solid #F1EEE9;
						box-sizing: border-box;

						.font-colo {
							color: #1E90FF;
							text-decoration: underline;
							cursor: pointer;
						}

						.font-colo1 {
							color: #1E90FF;
						}

						.centered-block {
							width: calc(100% - 40px);
							position: absolute;
							top: 50%;
							transform: translate(0, -50%);
						}

						.centered-block1 {
							width: calc(100% - 40px);
							position: absolute;
							top: 50%;
							transform: translate(0, -50%);
						}
					}

					.data-item:last-child {
						border-right: 0;
					}
				}
			}
		}

	}

	.content-total {
		width: calc(100% - 284px);
		// width: 85.2%;
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

		.content1-exports {
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

		.col-red {
			color: #f5222d;
		}

		.col-org {
			color: #DB9728;
		}
	}

	.item11 {
		display: flex;
		height: 40px;
		line-height: 40px;
		margin-bottom: 20px;

		.item12 {
			width: 25%;
			text-align: right;
			padding-right: 15px;
			box-sizing: border-box;
		}

		.item13 {
			width: 65%;
		}
	}

	.mr60 {
		margin-right: 60px;
	}

	.col-blue {
		color: #1E90FF;
	}

	.cur-op {
		cursor: pointer;
	}

	.state-active {
		background: #E6F7FF;
	}

	.cellLeftBox {
		display: inline-block;
		background-color: #BAE7FF;
		padding: 0px 10px;
		border-radius: 4px;
		color: #096DD9;
	}

	.cellRightBox {
		display: inline-block;
		background-color: #1890FF;
		padding: 0px 10px;
		border-radius: 4px;
		color: #fff;
	}
}
</style>
