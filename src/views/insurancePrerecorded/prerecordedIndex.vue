<template>
	<div id="prerecordedIndex" class="prerecorded-index">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">暂存单号：</span>
						<el-input v-model.trim="form.applyCode" placeholder="请输入暂存单号" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">投保单号：</span>
						<el-input v-model.trim="form.applicationFormCode" placeholder="请输入投保单号" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">状态：</span>
						<el-select v-model="form.state" placeholder="请选择状态"  size="small" clearable>
							<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">投保人：</span>
						<el-input v-model.trim="form.policyHolderName" placeholder="请输入投保人" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">产品名称：</span>
						<el-cascader v-model="form.productCode" :options="options" @change="handleChange1" placeholder="请选择" size="small" clearable></el-cascader>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">分支机构：</span>
						<el-select v-model="form.branchCode" placeholder="请选择" size="small" clearable>
							<el-option v-for="(item,index) in options5" :key="index" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<div class="elesearch-btn">
				<span @click="searchview" class="query-button">查询</span>
				<span @click="empty" class="empty-button">清空筛选条件</span>
			</div>
		</div>
		<div class="content-table">
			<div class="content">
				<div style="height:50px">
					<el-button type="primary" style="float:right;margin-top:10px;margin-right:20px;letter-spacing:2px;" round size="medium" @click="nextto" v-if="datas.find(item => item.key == '10035')">预录</el-button>
				</div>
				<div class="content-title">
					<el-row type="flex" class="row-bg">
						<el-col :span="8">
							<div style="padding-left:10px;box-sizing: border-box;">
								预录信息
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding-left:10px;box-sizing: border-box;">
								投保信息
							</div>
						</el-col>
						<el-col :span="6">
							<div style="padding-left:10px;box-sizing: border-box;">
								业务归属
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding-left:10px;box-sizing: border-box;">
								状态
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding-left:10px;box-sizing: border-box;">
								操作
							</div>
						</el-col>
					</el-row>
				</div>
				<div v-if="tableData.length == 0" class="no-data">
					暂无数据
				</div>
				<div class="content-item" v-for="(item,index) in tableData" :key="index" v-else>
					<el-row type="flex" class="row-bg">
						<el-col :span="8">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p><span class="col-blue mr20">{{item.policyHolderName}}</span></p>
								<p><span>暂存单号：{{item.applyCode}}</span></p>
								<p><span class="mr20">预录日期：{{item.createTime}}</span></span></p>
								<p><span>预算保费：<span class="col-red cur-op">￥{{item.premium}}元</span></span></p>
							</div>
						</el-col>
						<el-col :span="4">
							<div style="padding:15px 10px;box-sizing: border-box;">
								
								<p><span>{{item.productName}}</span></p>
								<p>
									<span>投保单号：<span class="col-blue cur-op" v-if="item.applicationFormCode">{{item.applicationFormCode}}</span> <span v-if="!item.applicationFormCode">未完成</span></span>
								</p>
							</div>
						</el-col>
						<el-col :span="6">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p>
									<span class="mr20" v-if="item.branchName">{{item.branchName}}</span>
									<span v-if="item.managerName">({{item.managerName}})</span>
								</p>
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p>
									<span v-if="item.state == '1'" style="color:#FA8C16">待提交</span>
									<span v-if="item.state == '2'" style="color:#52C41A">已提交</span>
									<span v-if="item.state == '3'" style="color:#52C41A">支付成功</span>
									<span v-if="item.state == '4'" style="color:#ff4949">支付失败</span>
								</p>
								<p class="col-grey cur-op" @click="openDialog(item)" v-if="item.state == '1' && (item.productCode == '19PR344296' ||item.productCode == '20PR164925' || item.productCode == '20PR604204' || item.productCode == '20PR503531' || item.productCode == '20PR415913' || item.productCode === '20PR517662'|| item.productCode === '22PR990877')">分享预录单</p>
							</div>
						</el-col>
						<el-col :span="3">
							<div style="padding:15px 10px;box-sizing: border-box;">
								<p>
									<span class="col-blue cur-op" v-if="item.state == '1'"  @click="updata(item)">修改</span>
									<span class="col-blue cur-op ml15" v-if="item.state == '1'"  @click="deletes(item)">删除</span> 
								</p>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<el-dialog title="提示" :visible.sync="dialogVisibles" width="30%">
			<span>是否删除预录单</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibles = false">取消</el-button>
				<el-button type="primary" @click="confirmdeletion">确定</el-button>
			</span>
		</el-dialog>
		<!-- 选择投保人弹出层 -->
		<el-dialog title="选择预录基本信息" width="800px" :visible.sync="dialogTableVisible"  @close="cancelLog" destroy-on-close :close-on-click-modal="false">
			<!-- 投保人列表 -->
			<div>
				<el-form ref="dialogForm" :model="dialogForm" label-width="110px">
					<el-form-item label="投保人类型：">
						<div class="holder-type">
							<span :class="{'check-span':dialogForm.isAttestation=='1'}" @click="setIsAttestation('1')">企业</span>
							<span :class="{'check-span':dialogForm.isAttestation=='2'}" @click="setIsAttestation('2')">个人</span>
						</div>
					</el-form-item>
					<el-form-item label="企业名称：">
						<SearchHolder ref="searchHolder"
							:erpInfoList='userList'
							:bindVal="'userCode'"
							@remoteMethod='getsearch'
							@changeVal='changeHolder'
							style="width:100%">
						</SearchHolder>
						<p class="mt10 area-style" v-if="dialogForm.holderCode">
							<span><i class="el-icon-info"></i>  当前企业区域：{{dialogForm.areaName}}</span>
						</p>
					</el-form-item>
					<el-form-item label="产品选择：">
						<el-radio-group v-model="radio" @change="dialogForm.productCode = ''">
							<el-button plain size="small"><el-radio label="dt">电梯责任险</el-radio></el-button>
							<el-button plain size="small"><el-radio label="gz">雇主责任险</el-radio></el-button>
							<el-button plain size="small"><el-radio label="wy">物业责任险</el-radio></el-button>
							<el-button plain size="small"><el-radio label="jz">家政责任险</el-radio></el-button>
							<el-button plain size="small" style="margin-left:0;"><el-radio label="sd">索道责任险</el-radio></el-button>
							<el-button plain size="small"><el-radio label="qzjx">起重机机械</el-radio></el-button>
						</el-radio-group>
						<br>
						<el-select v-model="dialogForm.productCode" @change="chooseProduct" placeholder="请选择" size="small" clearable class="mt10" filterable>
							<el-option v-for="(item,index) in productList" :key="index" v-if="radio == item.attrInfoDTOList.find(subItem => subItem.attrCode == 'productSort').attrDTOList[0].valueMark" :label="item.name" :value="item.code"></el-option>
						</el-select>
						<br>
						<p v-if="dialogForm.productCode" class="mt10 area-style"><span><i class="el-icon-info"></i>  销售区域：{{productList.find(proItem => proItem.code == dialogForm.productCode).attrInfoDTOList.find(subItem => subItem.attrCode == 'insuranceCoverage').attrDTOList[0].value}}</span></p>
					</el-form-item>
					<el-form-item label="业务归属：" v-if="showBranch">
						<el-select v-model="dialogForm.branchCode" placeholder="请选择" size="small" clearable filterable>
							<el-option v-for="(item,index) in options5" :key="index" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
						</el-select>
						<p class="mt10 branch-style" v-if="dialogForm.productCode == PRODUCT_GZ_JZ || dialogForm.productCode == PRODUCT_GZ_WY || dialogForm.productCode == PRODUCT_WY_WY">当前产品销售区域为全国，请选择业务归属</p>
					</el-form-item>
					<el-form-item label="保险公司：" v-if="dialogForm.productCode == PRODUCT_DT_SHANDONG">
						<el-select v-model="dialogForm.companyCode" placeholder="请选择" size="small" clearable>
							<el-option v-for="(item,index) in companyList" :key="index" :label="item.name" :value="item.code" :disabled="item.code != '0001300041.00213'"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button round size="medium" type="info" @click="cancelLog">取 消</el-button>
				<el-button type="warning" size="medium" round @click="submitInsurance">确认提交</el-button>
			</span>
        </el-dialog>
		<el-dialog title="提示" :visible.sync="dialogVisible1" width="30%" :before-close="handleCloseOver">
			<div class="ml30" style="display:flex">
				<i class="el-icon-warning" style="color:#FA8C16;font-size:20px"></i>
				<div class="ml20" style="width:80%">
					<p class="col-blue" style="font-size:16px">请前往新打开的页面完成“预录信息”修改</p>
					<p class="mt10" style="font-size:16px">修改完成后，当前页面不会自动刷新，请点击“已完成”刷新页面数据。</p>
				</div>
			</div>
			<div class="btn mt20">
                <span class="btn-left" @click="dialogVisible1 = false">取消</span>
                <span class="btn-right" @click="refreshList()">已完成</span>
            </div>
		</el-dialog>
		<el-dialog title="分享预录单" :visible.sync="dialogVisible2" width="40%" :before-close="handleCloseOver">
			<div class="ml20">
				<p  style="font-size:16px;color:#389E0D"> <i class="el-icon-link mr10" style="color:#919191 ;font-size:20px"></i>请确认预录单信息，并复制链接给客户</p>
			</div>
			<div class="ml20">
				<p class="mt10 share-box" style="font-size:16px">{{shareUrl}}</p>
			</div>
			<div class="ml20 share-btn" @click="shareCopy()">复制链接</div>
		</el-dialog>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import ProductService from '../../service/ProductService.js';
import publicConfiguration from '../../global/publicConfiguration.js';
import productClassification from '../businessProcessing/data/productClassification.json';
import CorrectionManagement from '../../service/CorrectionManagement.js';
import SearchHolder from './components/selectApplication.vue'
import PRODUCT from "../../global/global-product-branch.js"
const {
    PRODUCT_GZ_JZ,
    PRODUCT_GZ_WY,
	PRODUCT_WY_WY,
	PRODUCT_DT_SHANDONG
} = PRODUCT
export default {
	components: {
		SearchHolder
	},
	data() {
		return {
			PRODUCT_GZ_JZ: PRODUCT_GZ_JZ,
			PRODUCT_GZ_WY: PRODUCT_GZ_WY,
			PRODUCT_WY_WY: PRODUCT_WY_WY,
			PRODUCT_DT_SHANDONG:PRODUCT_DT_SHANDONG,
			showBranch: false,
			radio:'',
			ProductService: new ProductService(),
			Elevator:new elevator(),
			publicConfiguration:new publicConfiguration(),
			CorrectionManagement:new CorrectionManagement(),
			form:{
				applyCode: '',
				applicationFormCode: '',
				state: '',
				policyHolderName: '',
				productCode: '',
				branchCode: '',
				companyCode:'',
				value2:[],
			},
			companyList:[],
            searchValue:'',
			tableData:[],
			pageNum: 1,
			pagesize: 10,
			total:0,
			currentPage:1,

			
			userPageNum: 1,
			userPagesize: 5,
			userTotal:0,
			userCurrentPage:1,

			state:0,
			datas:[],
			dialogVisibles:false,
			applyCode:'',
			dialogTableVisible: false,
			dialogVisible1:false,
			dialogVisible2:false,
			dialogForm: {
				isAttestation:'1',
				userInfo:"",
				branchCode:"",
				productCode: "",
				holderCode:"",
				areaName:""
			}, //dialog表单
			userList:[],
			productList:[],
			templateRadioUser:'',
			options:[],
			options1:[
				{
					value:'',
					label:'全部'
				},
				{
					value:'1',
					label:'待提交'
				},
				{
					value:'2',
					label:'已提交'
				},
				{
					value:'3',
					label:'支付成功'
				},
				{
					value:'4',
					label:'支付失败'
				}
			],
			options5:[],
			shareUrl:'',
		}
	},
	created(){
		this.options = productClassification.data1;
		this.getprolist()
		// this.getsearch()
		this.loadBranch();
		this.datas = JSON.parse(window.sessionStorage.getItem('list'));
		if(window.localStorage.getItem('index') == '6'){
			this.gettingCache();
		}else{
			window.localStorage.removeItem('data');
			this.prerecordlist();
		}
	},
	methods: {
		// 关闭弹出窗初始化数据
		cancelLog() {
			this.$refs.searchHolder.resetData();
			this.userList = [];
			this.dialogTableVisible = false;
			this.radio = '';
			this.dialogForm = {
				isAttestation:'1',
				userInfo:"",
				branchCode:"",
				productCode: "",
				holderCode:"",
				areaName:""
			};
		},
		// 获取分支机构
		async loadBranch(){
			let res = await this.CorrectionManagement.getBranchInfo();
			if(res.code == '0000'){
				this.options5 = [];
				let branchCode = window.sessionStorage.getItem('branchCode') == 'JT0144000' ? 'JT0144001' : window.sessionStorage.getItem('branchCode');
				if(branchCode == 'JT0000'){
					this.options5 = res.list;
				}else{
					res.list.forEach(item =>{
						if(item.jtBranchCode == branchCode){
							this.options5.push(item)
						}
					})
					this.dialogForm.branchCode = branchCode
				}
            }
        },
		// 获取预录列表
		async prerecordlist(){ 
			var userCode = '';
			if(window.sessionStorage.getItem('provinceCode') !== '000000'){
				userCode = window.sessionStorage.getItem('userCode')
			}
			this.form.pageNum = this.pageNum;
			this.form.pageSize = 10;
			this.form.productCode = this.value22 ? this.value22:'';
			if (this.form.branchCode) {
				this.form.branchCode = this.form.branchCode
			} else if (window.sessionStorage.getItem('branchCode') == 'JT0000') {
				this.form.branchCode = ''
			} else if (window.sessionStorage.getItem('branchCode') == 'JT0144000') {
				this.form.branchCode = 'JT0144001'
			} else {
				this.form.branchCode = window.sessionStorage.getItem('branchCode')
			}
			let index = '6';
			window.localStorage.setItem('data',JSON.stringify(this.form));
			window.localStorage.setItem('index',index);
			let res = await this.Elevator.prerecordlist(this.form);
			if(res.code == '0000'){
				this.tableData = res.list;
				this.total = res.total;
			}
		},
		//获取产品详情
		async productDetail(code) {
			this.companyList = [];
			let res = await this.ProductService.productDetalis(code); 
			if(res.code == '0000' && res.data) {
				res.data.inusureCompanyList.map(item => {
					if(item.partyRole == '1') {
						this.companyList.push(item)
					}
				})
				
			}
		},
		// 选择产品
		chooseProduct(){
			if(this.dialogForm.productCode == PRODUCT_DT_SHANDONG) {
				this.productDetail(this.dialogForm.productCode);
			}
			if((this.dialogForm.productCode == PRODUCT_GZ_JZ || this.dialogForm.productCode == PRODUCT_GZ_WY || this.dialogForm.productCode == PRODUCT_WY_WY) || (window.sessionStorage.getItem('branchCode') == 'JT0000')) {
				this.showBranch = true;
			} else {
				this.showBranch = false;
			}
		},
		// 获取选择的产品
		handleChange1(value){ 
			if(value){
				this.value21 = value[0];
				this.value22 = value[1];
				this.form.value2 = value
			}else{
				this.form.value2 = [];
				this.value21 = '';
				this.value22 = "";
			}
		},
		gettingCache(){
			let data = JSON.parse(window.localStorage.getItem('data'));
			this.form = data;
			this.prerecordlist();
		},
		// 搜索
		async searchview(){
			this.pageNum = 1;
			this.prerecordlist();
		},
		// 清空搜索的输入框
		empty(){
			this.form = {
				applyCode: '',
				applicationFormCode: '',
				state: '',
				policyHolderName: '',
				productCode: '',
				companyCode:'',
				value2:[],
				branchCode: window.sessionStorage.getItem('branchCode') == 'JT0000' ? '':window.sessionStorage.getItem('branchCode') == 'JT0144000' ? 'JT0144001' : window.sessionStorage.getItem('branchCode'),
			}
			this.pageNum = 1;
			this.currentPage = 1;
			this.value22 = "";
			this.prerecordlist();
		},
		// 点击预录按钮
		nextto(){
			this.dialogTableVisible=true;
		},
		// 分页获取预录动单子数据
		handleCurrentChange(pageNum){
			this.pageNum = pageNum;
			this.prerecordlist();
		},
		// 分页获取用户数数据
		handleCurrentChangeUser(pageNum){
			this.userPageNum = pageNum;
			this.getsearch()
		},
		// 确认是否删除预录数据
		deletes(row){
			this.dialogVisibles = true;
			this.applyCode = row.applyCode;
		},
		// 更改预录数据
		updata(row){
			let path;
			if(row.applyType == "1"){	// 1-电梯；2-雇主；3-索道；4-团体意外；5-物业；6-家政 8-起重机
				path='prerecord/dt/insure'
			}else if(row.applyType == "2"){
				path='prerecord/gz/insure'
			}else if(row.applyType == "5"){
				path='prerecord/wy/insure'
			}else if(row.applyType == "6"){
				path='prerecord/jz/insure'
			}else if(row.applyType == "3"){
				path='prerecord/sd/insure'
			}else if(row.applyType == "8"){
				path='prerecord/qzjx/insure'
			}else {
				this.$message('尚未开发');
				return
			}
			let obj = {};
			obj.userCode = row.policyHolderCode;
			obj.managerUserCode = window.sessionStorage.getItem('userCode');
			obj.managerUserName = window.sessionStorage.getItem('userName');
			obj.productCode = row.productCode;
			obj.TK = window.sessionStorage.getItem('authorization')
			obj.branchName = row.branchName;
			obj.branchCode = row.branchCode;
			obj.applyId = row.id;
			this.$stringHelper.setCookie(obj,this.$apiUrl.DOMAIN_NAME)
			let url = `${this.$apiUrl.ROOT_TESHE_PWEB}${path}?productCode=${row.productCode}&applyCode=${row.applyCode}`
			window.open(url)
			this.dialogVisible1 = true
		},
		// 删除预录数据
		async confirmdeletion(){
			const res = await this.Elevator.deletesrecords(this.applyCode);
			if(res.code == '0000'){
				this.gettingCache();
				this.$message({
					message: '删除成功',
					type: 'success'
				});
				this.dialogVisibles = false;
				this.gettingCache();
			}
		},
		// 获取投保人
		async getsearch(val){
			var value = '';
			if(window.sessionStorage.getItem('provinceCode') !== '000000'){
				value = window.sessionStorage.getItem('provinceCode')
			}
			let form = {
				'areaCode':value,
				'loginIdOrUserName':val,
				'pageNum':this.userPageNum,
				'pageSize':10,
				'papers':'',
				'userType':this.dialogForm.isAttestation == '2'?'sequip_A':'',
			}
			let res = await this.Elevator.getuserlist(form);
			let {code} =res;
			if(code=='0000'){
				this.userTotal=res.total;
				this.userList = res.list;
			}
			
		},
		// 选中用户之后，获取用户的认证地址名称
		async changeHolder(val) {
			this.dialogForm.holderCode = val;
			this.dialogForm.userInfo =  this.userList.find(item => item.userCode == val) ? this.userList.find(item => item.userCode == val) : null;
			console.log(this.dialogForm.userInfo);
			if(this.dialogForm.userInfo && this.dialogForm.userInfo.areaCode) {
				let provinceCode = this.dialogForm.userInfo.areaCode.slice(0,2) + '0000';
				let cityCode = this.dialogForm.userInfo.areaCode.slice(0,4) + '00';
				let areaCode = this.dialogForm.userInfo.areaCode;
				let res = await this.ProductService.getAreaCode(provinceCode,cityCode,areaCode);
				if(res.code == '0000') {
					this.dialogForm.areaName = res.list[0].name +'/'+ res.list[1].name +'/'+ res.list[2].name;
				}
			}
		},
		// 获取产品列表1
		async getprolist(){
			let form = {
				'areaCodeList':[window.sessionStorage.getItem('provinceCode')],
				'classCodeList':['LB1618924476970565632','LB1618925335964024832','LB2218339544548509216','LB2285457513879176128','LB2515400717058181969','LB2844019007156391416'],
				'pn':this.productPageNum,
				'ps':100,
				'upOrDown':"0"
			};
			let res = await this.Elevator.getprolist(form);
			let {code,list} = res;
			if(code=='0000'){
				if(list){
					this.productList = list;
					if(window.sessionStorage.getItem('provinceCode') == '440000'){
						for(var i=0;i<this.productList.length;i++){
							if(this.productList[i].areaBeanList[0].areaCode == '440300'){
								this.productList.splice(i,1)
							}
						}
					}
				}else{
					this.getprolists();
				}
			}
			
		},
		// 获取产品列表2
		async getprolists(){
			let provinceCode = window.sessionStorage.getItem('provinceCode').slice(0,2) + '0000'
			let form = {
				'areaCodeList':[provinceCode],
				'classCodeList':['LB1618924476970565632','LB1618925335964024832','LB2218339544548509216','LB2285457513879176128','LB2515400717058181969'],
				'pn':this.productPageNum,
				'ps':100,
				'upOrDown':"0"
			};
			let res = await this.Elevator.getprolist(form);
			let {code,list} = res;
			if(code=='0000'){
				this.productList = list;
			}
		},
		// 跳转到指定的预录页面
		submitInsurance(){
			if(!this.dialogForm.holderCode){
				this.$message.error('请选择预录的投保人');
				return
			}
			if(!this.dialogForm.productCode){
				this.$message.error('请选择预录产品');
				return		
			} 
			if(this.showBranch) {
				if(!this.dialogForm.branchCode){
					this.$message.error('请选择业务归属');
					return		
				} 
			}
			const productFlag = this.productList.find(proItem => proItem.code == this.dialogForm.productCode).attrInfoDTOList[this.productList.find(proItem => proItem.code == this.dialogForm.productCode).attrInfoDTOList.map(item=>item.attrCode).indexOf('productSort')];
			const valueMark=productFlag?productFlag.attrDTOList[0].valueMark:'';
			let path = null;
			if(valueMark=="dt"){	
				path='prerecord/dt/insure'
			}else if(valueMark=="gz"){
				path='prerecord/gz/insure'
			}else if(valueMark=="wy"){
				path='prerecord/wy/insure'
			}else if(valueMark=="jz"){
				path='prerecord/jz/insure'
			}else if(valueMark=="团意"){
				this.$message('尚未开发');
				return
			}else if(valueMark=="sd"){
				path='prerecord/sd/insure';
			}else if(valueMark=="qzjx"){
				path='prerecord/qzjx/insure';
			}else {
				this.$message('尚未开发');
				return
			}
			if(this.dialogForm.userInfo.auditStatus !=='1'){
				this.$message('用户未认证');
				return
			}
			if((valueMark=="gz" || valueMark=="wy" || valueMark=="sd") && this.dialogForm.userInfo.userType == '个人') {
				this.$message('本产品仅支持企/事业单位投保！');
				return
			}
			let userAreaCode = this.dialogForm.userInfo.areaCode;
			let productAreaCode = this.productList.find(proItem => proItem.code == this.dialogForm.productCode).areaBeanList[0].areaCode;
			if(valueMark=="gz" && userAreaCode.slice(0,2)+'0000' != productAreaCode && userAreaCode.slice(0,4)+'00' != productAreaCode && userAreaCode != productAreaCode) {
				this.$confirm('投保人所在区域与产品销售区域不匹配, 是否继续预录?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.dialogTableVisible=false
						this.setCookies();
						let url = `${this.$apiUrl.ROOT_TESHE_PWEB}${path}?productCode=${this.dialogForm.productCode}`
						window.open(url)
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消预录'
						});          
					});
			} else {
				this.dialogTableVisible=false
				this.setCookies();
				let url = `${this.$apiUrl.ROOT_TESHE_PWEB}${path}?productCode=${this.dialogForm.productCode}`
				window.open(url)
			}
		},
		setCookies() {
			let obj = {};
			obj.userCode = this.dialogForm.holderCode;
			obj.managerUserCode = window.sessionStorage.getItem('userCode');
			obj.managerUserName = window.sessionStorage.getItem('userName');
			obj.productCode = this.dialogForm.productCode;
			obj.isAttestation = this.dialogForm.isAttestation;
			if(this.dialogForm.productCode == PRODUCT_DT_SHANDONG) {
				obj.companyCode = this.dialogForm.companyCode;
				obj.companyName = this.companyList.find(item => item.code == this.dialogForm.companyCode) ? this.companyList.find(item => item.code == this.dialogForm.companyCode).name : '';
			}
			obj.TK = window.sessionStorage.getItem('authorization')
			let name = this.options5.find(item => item.jtBranchCode == this.dialogForm.branchCode);
			obj.branchName = name.jtBranchName;
			obj.branchCode = this.dialogForm.branchCode;
			this.$stringHelper.setCookie(obj,this.$apiUrl.DOMAIN_NAME)
		},
		handleCloseOver() {
			this.dialogVisible1 = false;
			this.dialogVisible2 = false;
		},
		// 关闭弹出，刷新列表页
		refreshList(){
			this.dialogVisible1 = false;
			this.prerecordlist()
		},
		/**
		 * 打开弹窗并且设置url链接
		 * @param {object} val 本次预录单的内容
		 */
		openDialog(val) {
			this.dialogVisible2 = true;
			let path = null;
			if(val.applyType == "1"){	// 1-电梯；2-雇主；3-索道；4-团体意外；5-物业；6-家政; 8-起重机
				path='prerecorded/elevatorIndex?applyCode='
			}else if(val.applyType == "2"){
				path='prerecorded/employerIndex?applyCode='
			}else if(val.applyType == "3"){
				path='prePropertyIndex'
			}else if(val.applyType == "4"){
				path='preHouseKeepIndex'
			} else if (val.applyType == "5") {
				path='prerecorded/propertyIndex?applyCode='
			}else if (val.applyType == "6") {
				path='prerecorded/houseKeepIndex?applyCode='
			}else if (val.applyType == "8") {
				path='prerecorded/mechanicsIndex?applyCode='
			}

			let Base64 = require('js-base64').Base64
			let code = Base64.encode(val.applyCode)
			this.shareUrl =`${this.$apiUrl.ROOT_TESHE_ENT_WEB}${path}${code}` 
		},
		shareCopy() {
			let oInput = document.createElement('input');
			oInput.value = this.shareUrl;
			document.body.appendChild(oInput);
			oInput.select(); // 选择对象;
			document.execCommand("Copy"); // 执行浏览器复制命令
			this.$message({
				message: '复制成功',
				type: 'success'
			});
			oInput.remove()
		},
		setIsAttestation(val) {
			this.dialogForm.isAttestation = val
		}
	},
}

</script>

<style lang="less" scoped>
#prerecordedIndex {
	padding-bottom: 80px;
	min-height: 1000px;
	box-sizing: border-box;
	.el-form {
		margin: 10px 3%;
		.el-input {
			width: 60%;
		}
		.el-select {
			width: 60%;
		}
	}
	.elesearch{
		width: calc(100% - 40px);
		min-height: 234px;
		padding: 20px 20px 10px;
		margin: 20px 20px 0 20px;
		box-sizing: border-box;
		background-color: #fff;	
		.row-bg{
			margin-bottom: 20px;
			line-height: 40px;
			.item1{
				display: block;
				width: 8%;
				text-align: center;
			}
			.item2{
				width: 70%;
			}
			.item3{
				font-size: 14px;
				color: #666666;
				display: block;
				width: 25%;
				text-align: right;
				padding-right: 10px;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.item5{
				width: 31%;
			}
		}
		.elesearch-btn{
			width: 100%;
			height: 100%;
			text-align: center;
			color: #ffffff;
			.query-button{
				display: inline-block;
				width: 120px;
				height: 40px;
				background-color: #f3ac56;
				text-align: center;
				line-height: 40px;
				margin-right: 40px;
				color: #ffffff;
				font-weight: 600;
				cursor: pointer;
				border-radius: 60px;
			}
			.empty-button{
				display: inline-block;
				width: 120px;
				height: 40px;
				border: 1px solid #e9e9e9;
				text-align: center;
				line-height: 40px;
				color: #999;
				background-color: #e9e9e9;
				font-weight: 600;
				box-sizing: border-box;
				cursor: pointer;
				border-radius: 60px;
			}
		}
	}
	.content-up{
		width: 100%;
		text-align: right;
		padding: 0 30px 20px;
		box-sizing: border-box;
	}
	.no-data{
		width: 100%;
		height: 100%;
		line-height: 70px;
		font-size: 16px;
		color: #999;
		font-weight: 500;
		text-align: center;
	}
	.content-table{
		width: 100%;
		height: 100%;
		padding:0 20px;
		margin-top: 20px;
		box-sizing: border-box;
		.content{
			width: 100%;
			height: 100%;
			padding:0 20px 20px;
			box-sizing: border-box;
			background-color: #ffffff;
			.content-title{
				width: 100%;
				height: 60px;
				line-height: 60px;
				font-size: 14px;
				color: #333333;
				font-weight: 600;
				border-bottom: 1px solid #F1EEE9;
			}
			.content-item{
				width: 100%;
				border-bottom: 1px solid #F1EEE9;
				box-sizing: border-box;
				p{
					line-height: 30px;
				}
			}
		}
	}
	.content-total{
		width: 100%;
		height: 60px;
		padding: 0 30px 20px;
		box-sizing: border-box;
		line-height: 60px;
		text-align: right;
		margin-top: 30px;
	}
	.col-red {
		color: #f5222d;
	}
	.col-blue {
		color: #096dd9;
	}
	.col-org {
		color: #fa8c16;
	}
	.col-gre {
		color: #389e0d;
	}
	.col-grey {
		color: #919191;
	}
	.cur-op {
		cursor: pointer;
	}
	.area-style {
		span {
			background-color: #dbf9ef;
			color: #34c697;
			padding: 5px 10px 5px 5px;
			border-radius: 2px;
		}
	}
	.branch-style {
		color: #096dd9;
	}
	.btn{
		text-align: right;
		width: 100%;
		.btn-left{
			display: inline-block;
			padding: 5px 20px;
			border: 1px solid #919191;
			color: #ffffff;
			background-color: #919191;
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
	.share-box{
		border:1px solid #FFA940;
		background-color: #FFF7E6;
		line-height: 30px;
		padding: 0 10px;
		font-size: 14px;
		color: #888888;

	}
	.share-btn{
		display: inline-block;
		padding: 5px 20px;
		color: #FFF;
		background-color: #FA8C16;
		border-radius: 20px;
		cursor: pointer;
		margin-top: 20px;
	}
	.holder-type {
		span {
			display: inline-block;
			margin-right: 20px;
			height: 30px;
			line-height: 30px;
			width: 80px;
			background-color: #D9D9D9;
			border-radius: 20px;
			text-align: center;
			color: #000;
			cursor: pointer;
		}
		.check-span {
			background-color: #1890FF;
			color: #fff;
		}
	}
}
</style>
