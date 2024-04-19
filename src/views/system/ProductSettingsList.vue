<template>
	<div id="prerecordedIndex" class="prerecorded-index">
		<div class="elesearch">
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">产品名称：</span>
						<el-input v-model.trim="form.productName" placeholder="产品名称" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">产品编码：</span>
						<el-input v-model.trim="form.productCode" placeholder="请输入投保单号" size="small" clearable class="item2"></el-input>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">业务类型：</span>
						<el-select v-model="form.internet" placeholder="请选择" @clear="form.internet=null"  size="small" clearable style="width:30%">
							<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-select v-model="form.businessType" placeholder="请选择"  size="small" clearable style="width:30%;margin-left:10px;">
							<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">状态：</span>
						<el-select v-model="form.state" placeholder="请选择状态"  size="small" clearable>
							<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">行业分类：</span>
						<el-cascader
							v-model="form.hyfl"
							:options="selectData.hYCategory"
							:props="{ checkStrictly: true }"
							@change="changeHyfl"
							clearable>
						</el-cascader>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">产品分类：</span>
						<el-select v-model="form.productTypeCode" placeholder="请选择" size="small" clearable>
							<el-option v-for="(item,index) in optionsProdType" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">分支机构：</span>
						<el-select v-model="form.branchCode" placeholder="请选择" size="small" clearable>
							<el-option v-for="(item,index) in optionsBanch" :key="index" :label="item.jtBranchName" :value="item.jtBranchCode"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8">
					<div style="display:flex;">
						<span class="item3">出单公司：</span>
						<el-select v-model="form.issueCompany" placeholder="请选择" size="small" clearable>
							<el-option v-for="(item,index) in selectData.companyList" :key="index" :label="item.label" :value="item.value"></el-option>
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
					<el-button type="primary" style="float:right;margin-top:10px;margin-right:20px;letter-spacing:2px;" round size="medium" @click="add">添加产品</el-button>
				</div>
				<div class="content-title">
					<el-table :data="tableData" border :header-cell-style="getRowClass">
						<el-table-column prop="name" label="产品信息" show-overflow-tooltip>
							<template slot-scope="scope">
								<div class="product-details">
									<p class="details-left">{{ scope.row.productName }}（{{ scope.row.productCode }}）</p>
									<p class="details-right">{{ scope.row.branchName }}：{{ scope.row.provinceName }} {{ scope.row.cityName }} {{ scope.row.countryName }}</p>
								</div>
								<div class="product-details">
									<p class="details-left1">
										<span><i class="el-icon-data-board" v-if="scope.row.show1"></i><i class="el-icon-mobile-phone" v-if="scope.row.show2"></i><i class="el-icon-edit-outline" v-if="scope.row.show3"></i></span>
										<span v-if="scope.row.internetName">{{ scope.row.internetName }}</span> / <span v-if="scope.row.businessTypeName">{{ scope.row.businessTypeName }}</span> / <span v-if="scope.row.settlementType">{{ scope.row.settlementType }}</span>
									</p>
									<p class="details-right details-right1">{{ scope.row.companyName }}</p>
								</div>
								<div class="tags-box">
									<img src="../../assets/images/label.png">
									<span v-if="scope.row.tags" style="color:#096DD9">{{scope.row.tags.join('、')}}</span>
									<span v-else-if="!scope.row.tags">--</span>
								</div>
							</template>
					</el-table-column>
					<el-table-column label="配置" show-overflow-tooltip width="230">
						<template slot-scope="scope">
							<div v-if="!scope.row.tbFlag" class="cur-op config-style" @click="setAttribute(scope.row,'TB','ADD')">
								<span>投保</span>
								<span class="fr">
									<i class="el-icon-warning col-grey ml20"></i>
									<span class="col-blue">设置</span>
								</span>
							</div>
							<div v-else class="cur-op config-style">
								<span>投保</span>
								<span class="fr">
									<i @click="romoveAttribute(scope.row,'TB')" class="el-icon-remove col-red"></i>
									<i class="el-icon-success col-gre"></i>
									<span @click="setAttribute(scope.row,'TB','UPDATE')"  class="col-blue">变更</span>
								</span>
							</div>
							<div v-if="!scope.row.jxFlag" class="cur-op config-style mt5" @click="setAchievements(scope.row,'JX','ADD')">
								<span>绩效</span>
								<span class="fr">
									<i class="el-icon-warning col-grey ml20"></i>
									<span class="col-blue">设置</span>
								</span>
								
							</div>
							<div v-else  class="cur-op config-style">
								<span>绩效</span>
								<span class="fr">
									<i @click="romoveAttribute(scope.row,'JX')" class="el-icon-remove col-red"></i>
									<i class="el-icon-success col-gre"></i>
									<span @click="setAchievements(scope.row,'JX','UPDATE')" class="col-blue">变更</span>
								</span>
							</div>
							<div v-if="!scope.row.tsFlag" class="cur-op config-style mt5" @click="setTips(scope.row,'TS','ADD')">
								<span>提示</span>
								<span class="fr">
									<i class="el-icon-warning col-grey ml20"></i>
									<span class="col-blue">设置</span>
								</span>
								
							</div>
							<div v-else  class="cur-op config-style">
								<span>提示</span>
								<span class="fr">
									<i @click="romoveAttribute(scope.row,'TS')" class="el-icon-remove col-red"></i>
									<i class="el-icon-success col-gre"></i>
									<span @click="setTips(scope.row,'TS','UPDATE')" class="col-blue">变更</span>
								</span>
							</div>
					</template>
				</el-table-column>
				<el-table-column label="业务类型" show-overflow-tooltip width="100">
						<template slot-scope="scope">
								<p class="col-gre" v-if="scope.row.businessType === 1">线上出单</p>
								<p class="col-grey" v-if="scope.row.businessType === 2">线下出单</p>
								<p class="col-grey" v-if="scope.row.businessType === 3">线下传统业务</p>
								<p v-if="scope.row.internet == 1">互联网</p>
								<p v-if="scope.row.internet == 0">非互联网</p>
						</template>
				</el-table-column>
				<el-table-column prop="address" label="状态" show-overflow-tooltip width="100">
						<template slot-scope="scope">
								<p class="col-gre" v-if="scope.row.state === 1">上架</p>
								<p class="col-grey" v-if="scope.row.state === 0">下架</p>
								<p v-if="scope.row.weight">权重={{scope.row.weight}}</p>
						</template>
				</el-table-column>
				<el-table-column
						prop="updateTime"
						width="170"
						label="更新时间"
						show-overflow-tooltip
				></el-table-column>
				<el-table-column label="操作" align="center" width="150">
						<template slot-scope="scope">
						<el-button type="text" @click="update(scope.row)">修改</el-button>
						<span class="col-blue">|</span>
						<el-button type="text" v-if="scope.row.configFlag" @click="detail(scope.row)">查看</el-button>
						</template>
				</el-table-column>
		</el-table>
				</div>
                <div class="content-total">
                    <el-pagination background @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pagesize" :total="total"> </el-pagination>
                </div>
			</div>
		</div>
        <AddProduct
            ref="AddProduct"
            :branchList="optionsBanch"
            :areaList="areaList"
            :productList="productList"
			@successCallback="getList"
        ></AddProduct>
        <InsureAttribute
            ref="InsureAttribute"
            :branchList="optionsBanch"
            :areaList="areaList"
            :productList="productList"
			@successCallback="getList"
        ></InsureAttribute>
		<Achievements ref="Achievements" @successCallback="getList"></Achievements>
		<Tips ref="Tips" @successCallback="getList"></Tips>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import ProductService from '../../service/ProductService.js';
import publicConfiguration from '../../global/publicConfiguration.js';
import CorrectionManagement from '../../service/CorrectionManagement.js';
import ProductConfig from '../../service/ProductConfig.js';
import AddProduct from './components/AddProduct.vue'
import InsureAttribute from './components/InsureAttribute.vue'
import Achievements from './components/Achievements.vue'
import Tips from './components/Tips.vue'
import selectData from '../../../static/data/channel.json'

export default {
    components:{
        AddProduct,
		InsureAttribute,
		Achievements,
		Tips
    },
	data() {
		return {
			selectData:selectData,
			ProductService: new ProductService(),
			Elevator:new elevator(),
			publicConfiguration:new publicConfiguration(),
			CorrectionManagement:new CorrectionManagement(),
			ProductConfig:new ProductConfig(),
			form:{
				"branchName": "",
				"businessType": "",
				"pageNum": 1,
				"pageSize": 10,
				"productCode": "",
				"productName": "",
				"productTypeCode": "",
				"state": null,
				"updaterCode": "",
				"updaterName": "",
				"internet":null,
				tradeCategory1:'',
				tradeCategory2:'',
				issueCompany:'',
				hyfl:[]
			},
			tableData:[],
			pageNum: 1,
			currentPage:1,
			pagesize: 10,
			total:0,
			productList:[],
			options1:[
				{
					value:1,
					label:'线上出单'
				},
				{
					value:2,
					label:'线下出单'
				},
				{
					value:3,
					label:'线下传统业务'
				},
			],
			options2:[
				{
					value:1,
					label:'上架'
				},
				{
					value:0,
					label:'下架'
				},
			],
			options3:[
				{
					value:1,
					label:'互联网'
				},
				{
					value:0,
					label:'非互联网'
				},
			],
			optionsProdType:[
				{
					value:'dt',
					label:'电梯'
				},
				{
					value:'sd',
					label:'索道'
				},
				{
					value:'gz',
					label:'雇主'
				},
				{
					value:'ty',
					label:'团意'
				},
				{
					value:'jz',
					label:'家政'
				},
				{
					value:'wy',
					label:'物业'
				},
				{
					value:'ab',
					label:'保安'
				},
				{
					value:'yjsp',
					label:'沿街商铺'
				},
				{
					value:'qzjx',
					label:'起重机械'
				}
			],
			optionsBanch:[],
            areaList: [],
		}
	},
	created(){
		this.getprolist()   
		this.loadBranch();
        this.getList();
        this.getArea()
	},
	methods: {
        async getArea(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.areaList = parmes.data
			};
		},
		// 获取分支机构
		async loadBranch(){
			let res = await this.CorrectionManagement.getBranchInfo();
			if(res.code == '0000'){
				if(!res.list.find(item => item.jtBranchCode == 'JT0000')) {
					res.list.unshift({
						"jtBranchCode":"JT0000","jtBranchName":"江泰保险经纪股份有限公司本部"
					})
				}
                this.optionsBanch = res.list;
            }
        },
		// 获取产品配置列表
		async getList(){ 
			this.form.pageNum = this.pageNum;
			this.form.pageSize = 10;
			let res = await this.ProductConfig.getList(this.form);
			if(res.code == '0000'){
				this.tableData = res.list.map(item=>{
					item.businessTypeName = this.options1.find(i=> i.value == item.businessType) ? this.options1.find(i=> i.value == item.businessType).label : '';
					item.internetName = this.options3.find(i=> i.value == item.internet) ? this.options3.find(i=> i.value == item.internet).label : '';
					item.companyName = selectData.companyList.find(i=> i.value == item.issueCompany) ? selectData.companyList.find(i=> i.value == item.issueCompany).label : ''
					item.updateTime = item.updateTime || item.createTime
					item.show1 = item.bizEndpoint && item.bizEndpoint.find(i => i == 'PC端') ? true : false 
					item.show2 = item.bizEndpoint && item.bizEndpoint.find(i => i == '电梯智保') ? true : false 
					item.show3 = item.bizEndpoint && item.bizEndpoint.find(i => i == '管理后台') ? true : false
					if(!item.configFlag) {
						item.tbFlag = false
						item.jxFlag = false
						item.tsFlag = false
					} else {
						let flag = JSON.parse(item.configFlag)
						item.tbFlag = flag.TB && flag.TB == 1 ? true : false
						item.jxFlag = flag.JX && flag.JX == 1 ? true : false
						item.tsFlag = flag.TS && flag.TS == 1 ? true : false
					}
					return item
				});
				this.total = res.total;
			}
		},
		// 选择产品
		chooseProduct(){
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
			this.getList();
		},
		// 搜索
		async searchview(){
			this.pageNum = 1;
			this.getList();
		},
		// 清空搜索的输入框
		empty(){
			this.form = {
				applyCode: '',
				applicationFormCode: '',
				state: null,
				policyHolderName: '',
				productCode: '',
				companyCode:'',
				value2:[],
				hyfl:[],
				internet:null,
				tradeCategory1:'',
				tradeCategory2:'',
				issueCompany:'',
				branchCode: window.sessionStorage.getItem('branchCode') == 'JT0000' ? '':window.sessionStorage.getItem('branchCode') == 'JT0144000' ? 'JT0144001' : window.sessionStorage.getItem('branchCode'),
			}
			this.pageNum = 1;
			this.currentPage = 1;
			this.value22 = "";
			this.getList();
		},
		changeHyfl() {
			if(this.form.hyfl.length) {
				if(this.form.hyfl.length == 1) {
					this.form.tradeCategory1 = this.form.hyfl[0]
				} else if(this.form.hyfl.length == 2) {
					this.form.tradeCategory1 = this.form.hyfl[0]
					this.form.tradeCategory2 = this.form.hyfl[1]
				} else {
					this.form.tradeCategory1 = ''
					this.form.tradeCategory2 = ''
				}
			}
		},
		// 新增产品
		add(){
			this.$refs.AddProduct.openAdd()
		},
		update(row) {
			this.$refs.AddProduct.initData(row.id)
		},
		setAttribute(row,configType,flag) {
            this.$refs.InsureAttribute.initData(row,configType,flag)
		},
		setAchievements(row,configType,flag) {
			this.$refs.Achievements.initData(row,configType,flag)
		},
		setTips(row,configType,flag) {
			this.$refs.Tips.initData(row,configType,flag)
		},
		// 设置分页
		handleCurrentChange(pageNum){
			this.pageNum = pageNum;
			this.getList();
		},
		// 获取产品列表1
		async getprolist(){
			let provinceCode = '';
				if(sessionStorage.getItem('branchCode') == 'JT0000'){
					provinceCode = ['000000']
				}else{
					provinceCode = sessionStorage.getItem('authDataArea').split(',')
				}
			let form = {
				'pn':this.productPageNum,
				'ps':1000,
				'upOrDown':"0",
				'areaCodeList':provinceCode,
				'channel':'sequip',
				isStatusDown:1
			};
			let res = await this.ProductService.getProductListV3(form);
			let {code,list} = res;
			if(code=='0000'){
				if(list){
					try {
						this.productList = list.map(item=>{
							let productSort = item.attrInfoDTOList ? item.attrInfoDTOList.find(v1=>v1.attrCode === "productSort") : null
							item.productSort = productSort ? productSort.attrDTOList[0]['valueMark'] :''
							return item
						});
					} catch (error) {
						console.error(error,'error')
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
				'pn':this.productPageNum,
				'ps':1000,
				'upOrDown':"0",
				'areaCodeList':provinceCode,
				'channel':'sequip',
				isStatusDown:1
			};
			let res = await this.ProductService.getProductListV3(form);
			let {code,list} = res;
			if(code=='0000'){
				if(list){
					try {
						this.productList = list.map(item=>{
							let productSort = item.attrInfoDTOList ? item.attrInfoDTOList.find(v1=>v1.attrCode === "productSort") : null
							item.productSort = productSort ? productSort.attrDTOList[0]['valueMark'] :''
							return item
						});
					} catch (error) {
						console.error(error,'error')
					}
				}
			}
		},
		// 设置表头样式
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
            return 'background:#f5f5f5;color:#000'
            } else {
            return ''
            }
        },
		detail(row) {
			this.$router.push({
				path:'/product/details',
				query:{
					prodType:row.productTypeCode,
					productCode:row.productCode,
					productName:row.productName,
					id:row.id,
				},
			})
		},
		// 移除属性
		romoveAttribute(row,configType) {
			console.log(row);
			let data = {
				"configType": configType,
				"content": "",
				"createTime": "",
				"createrCode": "",
				"createrName": "",
				"id": "",
				"productId": row.id,
			}
			let content = `<div>${row.productName}(${row.productCode})</div><div class='col-red'></div>`
			const h = this.$createElement;
			this.$msgbox({
				title: '提示',
				message: h('div', null, [
					h('div', null, `${row.productName}(${row.productCode})`),
					h('div', { style: 'color: red' }, `请确认是否清空：${configType === 'TB'?'投保属性':configType === 'JX'?'绩效属性':configType === 'TS' ?'提示属性' : '投保属性'}`)
				]),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				beforeClose: async (action, instance, done) => {
					if (action === 'confirm') {
						let res = await this.ProductConfig.deletsEmpty(data)
						if(res.code === '0000') {
							done();
							this.getList();
						}
					} else {
						done();
					}
				}
			}).then(action => {
				// this.$message({
				// 	type: 'info',
				// 	message: 'action: ' + action
				// });
			});
			// this.$confirm(content, '提示', {
			// 	confirmButtonText: '确定',
			// 	cancelButtonText: '取消',
			// 	type: 'warning'
			// }).then(() => {
			// 	this.$message({
			// 		type: 'success',
			// 		message: '删除成功!'
			// 	});
			// }).catch(() => {
			// 	this.$message({
			// 		type: 'info',
			// 		message: '已取消删除'
			// 	});          
			// });
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
		margin: 10px 7%;
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
				font-size: 14px;
				color: #333333;
				font-weight: 600;
				border-bottom: 1px solid #F1EEE9;
                .product-details {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: space-between;
                    .details-right {
                        padding: 5px 10px;
                        background-color: #FFF7E6;
                        color: #FA8C16;
                        border-radius: 20px;
                    }
					.details-right1 {
						margin-top: 5px;
						padding: 5px 14px;
                        background-color: #e6f7ff;
                        color: #1890ff;
                    }
					.details-left1 {
						color: #919191;
						i {
							margin-right: 8px;
							font-size: 20px;
						}
						.el-icon-data-board {
							color: #1890FF;
						}
						.el-icon-mobile-phone {
							color: #389e0d;
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
		}
	}
	
	.col-red {
		color: #f5222d;
	}
	.col-blue {
		color: #1890FF;
	}
	.col-org {
		color: #fa8c16;
	}
	.col-gre {
		color: #389e0d;
	}
	.col-grey {
		color: #BFBFBF;
	}
	.cur-op {
		cursor: pointer;
	}
	.config-style {
		background-color: #f5f5f5;
		border-radius: 4px;
		padding: 4px 10px;
	}
	.tags-box {
		img{
			width: 20px;
			height: 20px;
			vertical-align: middle;
		}
		span {
			vertical-align: middle;
		}
	}
	
	
	
	
	
}
</style>
