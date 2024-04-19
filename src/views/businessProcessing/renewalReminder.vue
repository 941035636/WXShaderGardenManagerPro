<template>
	<div class="policy-sequip">
		<el-tabs type="border-card" v-model="tabState"  class="state-style">
			<el-tab-pane :label="item.label" :name="item.value" v-for="(item,index) in options1" :key="index"></el-tab-pane>
		</el-tabs>
		<div class="fg-line"></div>
		<div v-show="tabState == '1'">
			<div class="content" v-if="stepNum == 1">
				<div class="elesearch">
					<el-row type="flex" class="row-bg">
						<el-col :span="8">
							<div>
								<span class="item3">保单号：</span>
								<el-input size="medium" placeholder="请输入保单号" v-model.trim="data.policyNo" class="item2" clearable></el-input>
							</div>
						</el-col>
						<el-col :span="8">
							<div>
								<el-select v-model="data.typeCode" placeholder="请选择" class="item1" @change="changeType">
									<el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
								</el-select>
								<el-autocomplete size="medium" v-model.trim="data.policyHolder" :fetch-suggestions="querySearchAsync" v-if="data.typeCode == '1'" placeholder="请输入投保人" @select="handleSelect" class="item2" clearable ></el-autocomplete>
								<el-input size="medium" v-model.trim="data.useUnit" placeholder="请输入使用单位" class="item2" clearable v-else-if="data.typeCode == '2'" ></el-input>
							</div>
						</el-col>
						<el-col :span="8">
							<div>
								<span class="item3">设备/出厂编号：</span>
								<el-input size="medium" v-model.trim="data.eleCode" placeholder="请输入" class="item2" clearable ></el-input>
							</div>
						</el-col>
						
					</el-row>
					<el-row type="flex" class="row-bg">
						<el-col :span="8">
							<div>
								<span class="item3">保险止期：</span>
								<el-date-picker size="medium"  v-model="data.endDateFrom" type="date" class="item5" placeholder="开始日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
								<el-date-picker size="medium"  v-model="data.endDateTo" type="date" class="item5" placeholder="结束日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
							</div>
						</el-col>
						<el-col :span="8">
							<div>
								<span class="item3">坐落地址：</span>
								<el-cascader size="medium" :options="options2" placeholder="请选择" change-on-select v-model="regionCoding" class="item2" clearable></el-cascader>
							</div>
						</el-col>
						<el-col :span="8" v-if="showFlag && showBranch">
							<div>
								<span class="item3">分支机构：</span>
								<el-select size="medium" v-model="branchCode" filterable placeholder="请选择" class="item2" clearable>
									<el-option v-for="(item,index) in branchList" :key="index" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
								</el-select>
							</div>
						</el-col>
						<el-col :span="8" v-if="!showFlag">
							<div class="fr mr50">
								<el-button type="text" class="mr60 fr" v-if="showFlag" @click="showFlag = !showFlag">收起 <i class="el-icon-arrow-up"></i></el-button>
								<el-button type="text" class="mr60 fr" v-if="!showFlag" @click="showFlag = !showFlag">展开 <i class="el-icon-arrow-down"></i></el-button>
								<el-button type="warning" @click="searchview" round size="medium" class="query-button mr20">查 询</el-button>
								<el-button @click="empty" class="empty-button" type="text">清空条件</el-button>
							</div>
						</el-col>
					</el-row>
					<el-row type="flex" class="row-bg" v-if="showFlag">
						<el-col :span="24">
							<div class="fr mr50">
								<el-button type="text" class="mr60 fr" v-if="showFlag" @click="showFlag = !showFlag">收起 <i class="el-icon-arrow-up"></i></el-button>
								<el-button type="text" class="mr60 fr" v-if="!showFlag" @click="showFlag = !showFlag">展开 <i class="el-icon-arrow-down"></i></el-button>
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
							<el-button type="primary"  @click="sendEmail" round size="medium" class='query-button mr20 mb20'>发送邮件</el-button>
							<el-table :data="data1" style="width: 100%;margin-top:20px;" highlight-current-row show-header border fit :header-cell-style="getRowClass1">
								<el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
								<div slot="empty" class="empty-bg">
									<p class="tip-title">请输入查询条件</p>
									<p class="col-org">1、默认不加载数据。</p>
									<p class="col-org">2、可查询90天内到期的设备信息。</p>
								</div>
								<el-table-column label="投保人/保单号">
									<template slot-scope="scope">
										<p>{{scope.row.policyHolder}}</p>
										<p>{{scope.row.policyNo}}</p>
									</template>
								</el-table-column>
								<el-table-column label="保障期间" min-width="110">
									<template slot-scope="scope">
										<p>{{scope.row.startDate}} 至 {{scope.row.endDate}}</p>
									</template>
								</el-table-column>
								<el-table-column label="使用单位" min-width="100">
									<template slot-scope="scope">
										<p>{{scope.row.useUnit}}</p>
									</template>
								</el-table-column>
								<el-table-column label="设备出厂编号">
									<template slot-scope="scope">
										<p v-if="scope.row.equipmentsCode">{{scope.row.equipmentsCode}}</p>
										<p v-else>{{scope.row.factoryNumber}}</p>
									</template>
								</el-table-column>
								<el-table-column label="坐落地址">
									<template slot-scope="scope">
										<p>{{scope.row.provinceName}}<span v-if="scope.row.cityName">/{{scope.row.cityName}}</span><span v-if="scope.row.countryName">/{{scope.row.countryName}}</span><span v-if="scope.row.address">{{scope.row.address}}</span></p>
									</template>
								</el-table-column>
							</el-table>
							<div class="mt20 mb40" style="text-align: right;">
								<el-pagination background  @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"> </el-pagination>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
			<div class="content" v-if="stepNum == 2">
				<div id="searchBar" :class="searchBarFixed == true ? 'isFixed' :''">
					<div class="fg-line"></div>
					<div class='title-text common-style'>
						<span class="item1">续保清单发送</span>
						<div class="fr">
							<el-button  round size="medium" @click="returnOne">取 消</el-button>
							<el-button type="warning" @click="submitSend" round size="medium">提交发送</el-button>
						</div>
					</div>
					<div class="fg-line"></div>
				</div>
				<div class="step-line common-style">
					<el-steps :active="stepNum" align-center>
						<el-step title="筛选清单"></el-step>
						<el-step title="确认信息"></el-step>
						<el-step title="发送完成"></el-step>
					</el-steps>
					<span class="option-person mt10">操作人：{{userName}}/{{branchName}}</span>
				</div>
				<div class="fg-line"></div>
				<div class="mt20">
					<el-form :model="receiver" ref="receiver" :inline="true" label-width="100px" class="demo-ruleForm">
						<el-row v-for="(item,index) in receiver.receiverList" :key="index">
							<el-col :span="5">
								<el-form-item :label="'接收人' +(index+1 > 9 ? (index+1) : '0' + (index+1))" :rules="[
									{ required: true, message: '姓名不能为空', trigger: 'blur' },
									{ min: 2, max: 20, message: '长度在2-20个字符', trigger: 'blur' }
									]" :prop="'receiverList.' + index + '.name'">
									<el-input placeholder="请输入姓名" v-model="item.name" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item :rules="[
									{ required: true,message: '邮箱不能为空', trigger: 'blur'},
									{type: 'email',message: '邮箱格式不正确', trigger: ['blur', 'change']},
									{ min: 5,max: 30, message: '邮箱长度5-30个字符', trigger: 'blur'}
									]" :prop="'receiverList.' + index + '.email'">
									<el-input placeholder="请输入邮箱地址" v-model="item.email" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item>
									<span v-if="index==0" class="add-person" @click="addPerson"><i class="el-icon-circle-plus mr10 f18"></i>添加多个</span>
									<span v-else class="del-person" @click="delPerson(index)"><i class="el-icon-remove mr10 f18"></i></span>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<div class="fg-line"></div>
				<div class="pd-style">
					<el-row type="flex" class="row-bg">
						<el-col :span="24">
							<el-table :data="data1" style="width: 100%;margin-top:20px;" highlight-current-row show-header border fit :header-cell-style="getRowClass1">
								<el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
								<el-table-column label="投保人/保单号">
									<template slot-scope="scope">
										<p>{{scope.row.policyHolder}}</p>
										<p>{{scope.row.policyNo}}</p>
									</template>
								</el-table-column>
								<el-table-column label="保障期间" min-width="110">
									<template slot-scope="scope">
										<p>{{scope.row.startDate}} 至 {{scope.row.endDate}}</p>
									</template>
								</el-table-column>
								<el-table-column label="使用单位" min-width="100">
									<template slot-scope="scope">
										<p>{{scope.row.useUnit}}</p>
									</template>
								</el-table-column>
								<el-table-column label="设备出厂编号">
									<template slot-scope="scope">
										<p v-if="scope.row.equipmentsCode">{{scope.row.equipmentsCode}}</p>
										<p v-else>{{scope.row.factoryNumber}}</p>
									</template>
								</el-table-column>
								<el-table-column label="坐落地址">
									<template slot-scope="scope">
										<p>{{scope.row.provinceName}}<span v-if="scope.row.cityName">/{{scope.row.cityName}}</span><span v-if="scope.row.countryName">/{{scope.row.countryName}}</span><span v-if="scope.row.address">{{scope.row.address}}</span></p>
									</template>
								</el-table-column>
							</el-table>
							<div class="mt20 mb40" style="text-align: right;">
								<el-pagination background  @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"> </el-pagination>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
			<div class="content" v-if="stepNum == 3">
				<div class="fg-line"></div>
				<div class="title-text common-style">
					<span class="item1">发送成功</span>
				</div>
				<div class="fg-line"></div>
				<div class="step-line common-style">
					<el-steps :active="stepNum" align-center>
						<el-step title="筛选清单"></el-step>
						<el-step title="确认信息"></el-step>
						<el-step title="发送完成"></el-step>
					</el-steps>
					<span class="option-person mt10">操作人：{{userName}}/{{branchName}}</span>
				</div>
				<div class="fg-line"></div>
				<div class="mt20" style="min-height:500px;">
					<el-col :span="10">
						<div style="text-align: right;margin-right:10px;">
							<i class="el-icon-success" style="color:#E6A23C;font-size:80px;display: block;"></i>
						</div>
					</el-col>
					<el-col :span="6">
						<div style="text-align: left;line-height: 40px;margin-left:10px;">
							<span style="font-size:20px;font-weight: 600;">您已成功发送，请查看发送清单</span><br/>
							<span>发送邮箱：<span v-for="(item,index) in receiver.receiverList" :key="index">{{item.email}}<span v-if="index != receiver.receiverList.length -1">, </span></span></span>
						</div>
					</el-col>
					<el-col :span="22" style="text-align:center;">
						<el-button type="info" @click="returnOne" round class="item1 mt20">返回列表</el-button>
					</el-col>
				</div>
			</div>
		</div>

		<div v-show="tabState == '2'">
			<PushLog></PushLog>
		</div>
		
    </div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import UserService from '../../service/UserService';
import RidesService from '../../service/RidesService';
import buttonSelection from './js/buttonSelection.js';
import PushLog from './pushLogs.vue'
import moment from 'moment';
export default {
	name:'RenewalReminder',
	components:{
		PushLog
	},
	data() {
		return {
			receiver:{
				operator: window.sessionStorage.getItem('userName'),//(string, optional): 操作人 ,
				operatorBranchName: window.sessionStorage.getItem('branchName'),// (string, optional): 操作人分支机构名称 ,
				receiverList:[
					{
						name:'',
						email:''
					}
				]
			},
			userName: window.sessionStorage.getItem('userName'),
			branchName: window.sessionStorage.getItem('branchName'),
			stepNum:1,
			options2: [],
			data1:[],
            Elevator:new elevator(),
            UserService: new UserService(),
			RidesService: new RidesService(),
			ButtonSelection:new buttonSelection(),
            currentPage: 1,
            pageSize: 10,
            total: 0,
            options: [
                {
					'value':'1',
					'label':'投保人'
				},
				{
					'value':'2',
					'label':'使用单位'
				}
            ],
            data: {
				pageNum:1,// (integer, optional),
   				pageSize: 10,// (integer, optional),
				eleCode: '',
				useUnit: '',
				policyNo: '',
				endDateFrom: moment(new Date()).format('YYYY-MM-DD 00:00:00'),
				endDateTo: moment(new Date(new Date().getTime()+90*24*60*60*1000)).format('YYYY-MM-DD 23:59:59'),
				policyHolder: '',
                typeCode: '1',
				dataScope: '',
				provinceName:'',
				cityName: "",// (string, optional): 市名称 ,
				countryName: "",// (string, optional): 区/县名称 ,
				branchCodeList: window.sessionStorage.getItem('branchCode') == 'JT0000' ? [] : window.sessionStorage.getItem('authDataInfo').split(',')
            },
			dialogVisible1:false,
			row: {},
			regionCoding:[],
			branchList1:[],
			branchList:[],
			rules:{
				name: [
					{ required: true, message: '姓名不能为空', trigger: 'blur' },
					{ min: 2, max: 20, message: '长度在2-20个字符', trigger: 'blur' }
				],
				email:[
					{ required: true,message: '邮箱不能为空', trigger: 'blur'},
					{type: 'email',message: '邮箱格式不正确', trigger: ['blur', 'change']},
					{ min: 5,max: 30, message: '邮箱长度5-30个字符', trigger: 'blur'}
				],
			},
			showFlag: false,
			showBranch:false,
			searchBarFixed:false,
			branchCode:'',
			options1:[
				{
					label:'电梯续保',
					value:'1',	
				},
				{
					label:'推送日志',
					value:'2',	
				}
			],
			tabState:'1',
		};
	},
	computed: {
		
	},
	created() {
		sessionStorage.getItem('branchCode') == 'JT0000' ? this.showBranch = true : this.showBranch = false
		this.getRides()
	},
	destroyed() {//组件销毁时解除监听
		window.removeEventListener("scroll", this.handleScroll);
	},
	methods: {
		handleScroll () {
			let offsetTop = this.$el.querySelector('#searchBar') ? this.$el.querySelector('#searchBar').getBoundingClientRect().top : 60;
        	this.searchBarFixed = offsetTop - 60 < 0 ? true : false;
		},
		async getRides() { //获取缓存数据
			let branchRid = await this.RidesService.getRides('sequipListData','sequip','1');
			if(branchRid.code == '0000' && branchRid.data) {
				this.branchList1 = JSON.parse(branchRid.data).branchList;
				this.setBranch();
				this.options22 = JSON.parse(branchRid.data).options2;
				this.setArea();
			} else {
				Promise.all([this.getArea(),this.loadBranch()]).then((res)=> {
					this.setRides();
				}) 
			}
		},
		async setRides() {//设置缓存数据
			let obj = {
				branchList: this.branchList1,
				options2: this.options22,
			};
			let dataPar = {
                "time": 10,  // 具体值
                "type": 2,  // 1分钟 2小时"
                "value": JSON.stringify(obj)
            }
			let resSave = await this.RidesService.setRides(dataPar,'sequipListData','sequip','1');
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
				this.branchList = this.branchList1;
			}else{
				authArr.forEach(authBranch => {
					if(authBranch == 'JT0144000') {
						this.branchList.push({"jtBranchCode":"JT0144001","jtBranchName":"广东分公司本部"})
					}
					this.branchList1.forEach(item =>{
						if(item.jtBranchCode == authBranch){
							this.branchList.push(item)
						}
					})
				})
			}
		},
		async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.options22 = parmes.data;
				this.setArea();
			};
		},
		//处理地区
		setArea() {
			this.options2 = this.options22;
			// if(window.sessionStorage.getItem('provinceCode') == '000000') {
			// 	this.options2 = this.options22;
			// } else {
			// 	this.options2 = this.ButtonSelection.Accessarea(this.options22, window.sessionStorage.getItem('provinceCode'));
			// }
		},
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
			this.data1 = [];
			if(this.regionCoding.length == 1){
				this.data.provinceName = this.options2.find(i => i.value == this.regionCoding[0]) ? this.options2.find(i => i.value == this.regionCoding[0]).label : '';
				this.data.cityName = '';
				this.data.countryName = '';
			}else if(this.regionCoding.length == 2){
				let proData = this.options2.find(i => i.value == this.regionCoding[0]);
				this.data.provinceName = proData ? proData.label : '';
				this.data.cityName = proData.children.find(t => t.value == this.regionCoding[1]) ? proData.children.find(t => t.value == this.regionCoding[1]).label : '';
				this.data.countryName = '';
			}else if(this.regionCoding.length == 3){
				let proData = this.options2.find(i => i.value == this.regionCoding[0]);
				let cityData = proData.children.find(t => t.value == this.regionCoding[1]);
				this.data.provinceName = proData ? proData.label : '';
				this.data.cityName = cityData ? cityData.label : '';
				this.data.countryName = cityData.children.find(t => t.value == this.regionCoding[2]) ? cityData.children.find(t => t.value == this.regionCoding[2]).label : '';
			}else{
				this.data.provinceName = '';
				this.data.cityName = '';
				this.data.countryName = '';
			};
			this.data.pageNum = 1;
			this.currentPage = 1;
			if(this.data.endDateFrom  && this.data.endDateTo && this.data.endDateFrom  > this.data.endDateTo) {
				this.$message({
					message: '保险止期开始日期大于保险止期结束日期，请重新选择。',
					type: 'warning'
				});
				return
			}
			if(this.data.endDateFrom  && this.data.endDateTo && new Date(this.data.endDateTo).getTime() - new Date(this.data.endDateFrom).getTime() > (90*24*60*60*1000 + 23*60*60*1000 + 59*60*1000 + 59*1000)) {
				this.$message({
					message: '仅支持查询90天范围内的数据，请重新选择。',
					type: 'warning'
				});
				return
			}
			if(!this.regionCoding.length && !this.data.eleCode && !this.data.useUnit && !this.data.policyNo && !this.data.endDateFrom  && !this.data.endDateTo && !this.data.policyHolder && !this.data.branchCodeList.length) {
				this.$message({
					message: '请输入至少一个查询条件',
					type: 'warning'
				});
				return 
			}
			this.data.endDateFrom = this.data.endDateFrom ? this.data.endDateFrom : moment(new Date()).format('YYYY-MM-DD 00:00:00');
			this.data.endDateTo = this.data.endDateTo ? this.data.endDateTo : moment(new Date(new Date().getTime()+90*24*60*60*1000)).format('YYYY-MM-DD 23:59:59');
            this.policylistDT()
        },
        empty() {
			this.data = {
				eleCode: '',
				useUnit: '',
				policyNo: '',
				endDateFrom: moment(new Date()).format('YYYY-MM-DD 00:00:00'),
				endDateTo: moment(new Date(new Date().getTime()+90*24*60*60*1000)).format('YYYY-MM-DD 23:59:59'),
				policyHolder: '',
                typeCode: '1',
				pageNum: 1,
				pageSize: 10,
				dataScope: '',
				provinceName:'',
				cityName: "",// (string, optional): 市名称 ,
				countryName: "",// (string, optional): 区/县名称 ,
				branchCodeList: window.sessionStorage.getItem('branchCode') == 'JT0000' ? [] : window.sessionStorage.getItem('authDataInfo').split(',')
            };
			this.branchCode = '';
			this.total = 0;
			this.data1 = [];
			this.regionCoding = [];
        },
        async policylistDT(){ // 获取投保单列表
			this.data.pageNum = this.currentPage;
			this.data.branchCodeList = window.sessionStorage.getItem('branchCode') == 'JT0000' ? this.branchCode ? [this.branchCode] : [] : window.sessionStorage.getItem('authDataInfo').split(',');
			let res  = await this.Elevator.postSequipList(this.data);
			if(res.code == '0000' && res.list.length != 0) {
				this.total = res.total;
				this.data1 = res.list;
			} else {
				this.total = 0;
				this.data1 = [];
			}
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
			this.policylistDT();
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
			this.data.policyHolder = '';
			this.data.useUnit = '';
		},
		addPerson() {
			if(this.receiver.receiverList.length == 5) {
				this.$message({
					message: '最多支持5个接收人！',
					type: 'warning'
				});
				return
			}
			let obj = {
				name:'',
				email:''
			}
			this.receiver.receiverList.push(obj);
		},
		delPerson(index) {
			this.$confirm('是否删除该接收人?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.receiver.receiverList.splice(index,1)
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
			});
		},
		sendEmail() {
			this.currentPage = 1;
			if(this.data1.length == 0) {
				this.$message({
					type: 'error',
					message: '请选择查询条件查询后发送邮件！'
				}); 
				return;
			}
			this.stepNum = 2;
			this.policylistDT();
			window.addEventListener('scroll', this.handleScroll,true)
		},
		submitSend() {
			this.$refs['receiver'].validate((valid) => {
				if (valid) {
					this.submitFun()
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		async submitFun() {
			if(this.receiver.receiverList.find(item => !item.email && !item.name)) {
				this.$message({
					type: 'error',
					message: '请补全接收人信息后提交发送！'
				}); 
				return;
			}
			let hash = {};
			let arr = this.receiver.receiverList.reduce(function(item, next) {
				hash[next.email] ? '' : hash[next.email] = true && item.push(next);
				return item
			}, [])
			if(arr.length != this.receiver.receiverList.length) {
				this.$message({
					type: 'error',
					message: '接收人邮箱重复，请修改后重新提交发送！'
				}); 
				return;
			}
			this.receiver.endDateFrom = this.data.endDateFrom ? this.data.endDateFrom : moment(new Date()).format('YYYY-MM-DD 00:00:00');
			this.receiver.endDateTo = this.data.endDateTo ? this.data.endDateTo : moment(new Date(new Date().getTime()+90*24*60*60*1000)).format('YYYY-MM-DD 23:59:59');
			this.receiver.provinceName = this.data.provinceName;
			this.receiver.cityName = this.data.cityName;
			this.receiver.countryName = this.data.countryName;
			this.receiver.useUnit = this.data.useUnit;
			this.receiver.policyHolder = this.data.policyHolder;
			this.receiver.policyNo = this.data.policyNo;
			this.receiver.branchCodeList = this.data.branchCodeList;
			this.receiver.eleCode = this.data.eleCode;
			let res = await this.Elevator.postSendEmail(this.receiver);
			if(res.code == '0000') {
				this.stepNum = 3;
				window.removeEventListener("scroll", this.handleScroll);
			}
		},
		returnOne() {
			this.receiver.receiverList = [
				{
					name:'',
					email:''
				}
			];
			this.stepNum = 1;
			window.removeEventListener("scroll", this.handleScroll);
		},
	}
};
</script>

<style lang="less">
.policy-sequip {
	.fg-line {
		height: 5px;
		background-color: #e8e8e8;
	}
	.state-style {
		background-color: #ffffff;
		width: calc(100% - 40px);
		margin: 0px 20px 0 20px;
		height: 40px;
		font-size: 16px;
		.is-active {
			background: #1890ff!important;
			color: #fbfbfb !important;
			font-size: 16px!important;
			border-right-color: #1890ff!important;
			border-left-color: #1890ff!important;
		}
		.el-tabs__header {
			background-color: #ffffff;
			border-bottom: 2px solid #1890ff;
			margin: 0;
		}
		.el-tabs__content {
			display: none;
		}
		.el-tabs__item {
			padding: 0 50px;
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
		// .el-button:hover {
		// 	color: #e6a23c;
		// 	border-color: #ffa940;
		// 	background-color: #ffe7ba;
		// }
		.empty-bg {
			max-width: 300px;
			text-align: left;
			line-height: 30px;
			margin: 30px auto;
			.tip-title {
				font-size: 18px;
				font-weight: 700;
				color: #101010;
			}
			.col-org {
				font-weight: 400;
				font-size: 16px;
				color: #fa8c16;
			}
		}
	}
	.elesearch{
		width: calc(100% - 40px);
		min-height: 160px;
		padding: 20px 20px 10px;
		margin: 0px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;
		.row-bg{
			margin-bottom: 20px;
			.item1{
				width: 25%;
				margin-right: 10px;
				margin-left: 0%;
				input {
					border: none;
					font-size: 16px;
					min-width:110px;
				}
				.el-select__caret {
					color: #000000;
					font-weight: 700;
				}
			}
			.item2{
				width: 60%;
			}
			.item3{
				display: inline-block;
				width: 25%;
				text-align: right;
				font-size: 16px;
				color: #666666;
				margin-right: 10px;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				vertical-align: text-bottom;
			}
			.item4{
				width: 18%;
				margin-right: 10px;
			}
			.item5{
				width: 30%;
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
	.content{
		width: calc(100% - 40px);
		margin: 0px 20px 0 20px;
		background-color: #ffffff;
		.fg-line {
			height: 5px;
			background-color: #e8e8e8!important;
		}
		.pd-style {
			padding: 20px;
		}
		.state-style {
			background-color: #ffffff;
			height: 40px;
			font-size: 16px;
			.is-active {
				background: #1890ff;
    			color: #fbfbfb !important;
				font-size: 16px;
				border-right-color: #1890ff;
				border-left-color: #1890ff;
			}
			.el-tabs__header {
				background-color: #ffffff;
				border-bottom: 2px solid #1890ff;
				margin: 0;
			}
			.el-tabs__content {
				display: none;
			}
			.el-tabs__item {
				padding: 0 50px;
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
		.w80 {
			width: 80px;
			border: 1px solid #E6A23C;
			color:#E6A23C;
		}
		.is-round {
			padding: 8px 22px;
		}
		.content-table{
			width: 100%;
			padding: 0 20px 30px;
			margin-bottom: 40px;
			box-sizing: border-box;
		}
		.option-person {
			background-color: #e6f7ff;
			color: #096dd7;
			border-radius: 5px;
			font-size: 14px;
			padding: 4px 20px;
			display: inline-block;
			margin-left: 50%;
			transform: translateX(-50%);
			min-width: 286px;
		}
		.add-person {
			font-size: 16px;
			color: #096dd9;
			cursor: pointer;
		}
		.del-person {
			font-size: 16px;
			color: #919191;
			cursor: pointer;
		}
		.common-style {
			margin: 10px;
			background-color: #ffffff;
			border-radius: 5px;
		}
		.title-text {
			height: 50px;
			line-height: 50px;
			font-size: 20px;
			color: #101010;
			padding: 5px 10px;
		}
		.step-line {
			padding: 25px;
			.el-step.is-horizontal .el-step__line {
				top: 20px;
			}
			.el-step__icon {
				width: 40px;
				height: 40px;
			}
			.el-step__title.is-process {
				font-weight: 500;
				color: #C0C4CC;
			}
			.is-finish .el-step__icon.is-text {
				border-width: 1px;
				background-color: #e6f7ff;
			}
			.is-wait .el-step__icon.is-text,.is-process .el-step__icon.is-text {
				border-width: 1px;
				background-color: #f7f7f7;
			}
			.el-step__head.is-process {
				color: #C0C4CC;
				border-color: #C0C4CC;
			}
			.el-step__head.is-finish {
				color: #096dd9;
				border-color:#096dd9;
			}
			.el-step__title.is-finish {
				color:#101010;
			}
		}
	}
	.mr60 {
		margin-right: 60px;
	}
	.mr50 {
		margin-right: 50px;
	}
	.col-blue {
		color: #1E90FF;
	}
	.col-blue1 {
		color: #40a9ff;
	}
	.col-grey {
		color: #919191;
	}
	.text-under {
		text-decoration: underline;
	}
	.col-red {
		color: #f5222d;
	}
	.col-org {
		color: #DB9728;
	}
	.query-button {
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
	.see-style {
		margin-left: 5px;
		text-decoration: underline;
		color: #096dd9;
		cursor: pointer;
	}
	.isFixed{
		position:fixed;
		top:60px;
		z-index:999;
		width: 85.2%;
		background-color: #fff;
	}
}
</style>
