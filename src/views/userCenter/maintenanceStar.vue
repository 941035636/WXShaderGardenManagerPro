<template>
	<div class="elevator" id="elevator">
		<div class="elesearchs">
			<el-button size="small" @click="takeBack">{{title}}<i :class="icon"></i></el-button>
		</div>
		<transition name="mybox">
			<div class="elesearch" v-show="show">
				<div class="elesearch1">
					<el-row type="flex" class="row-bg">
						<el-col :span="6">
							<div>
								<span class="item2">企业名称</span>
								<el-input placeholder="请输入企业名称" v-model="value1" class="item1" size="small" clearable></el-input>
							</div>
						</el-col>
						<el-col :span="6">
							<div>
								<span class="item2">会员类型</span>
								<el-select v-model="value2" placeholder="请选择" class="item1" size="small" clearable>
									<el-option v-for="item in options2" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
								</el-select>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="item3">
								<el-button type="success" size="small" @click="searchview">查询</el-button>
								<el-button type="info" size="small" @click="empty">清空</el-button>
							</div>
						</el-col>
						<el-col :span="6">
							<div>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</transition>
		<div class="content1" v-if="datas.find(item => item.key == '70007')">
			<el-button type="primary" size="small" @click="newlyAdded">新增</el-button>
		</div>
		<div class="content-table">
			<el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit size='mini'>
				<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="custFullName" label="企业名称" align="center" min-width="300"></el-table-column>
				<el-table-column prop="vipTypeValues" label="会员类型" align="center" min-width="200"></el-table-column>
				<el-table-column prop="vipValueValues" label="会员等级" align="center" min-width="200"></el-table-column>
				<el-table-column prop="modifyPerson" label="更新人员" align="center" min-width="200"></el-table-column>
				<el-table-column prop="modifyTime" label="更新时间" align="center" min-width="200"></el-table-column>
				<el-table-column fixed="right" label="操作" align="center" min-width="120">
					<template slot-scope="scope" type="flex">
						<el-button @click="modify(scope.row)" type="text" size="mini" class="item4" v-if="datas.find(item => item.key == '70008')">修改</el-button>
						<el-button @click="relation(scope.row)" type="text" size="mini" class="item4" v-if="datas.find(item => item.key == '70009')">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="content-total">
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
		</div>
		<el-dialog title="删除会员信息" :visible.sync="dialogVisible" width="30%">
			<span>此会员删除将影响对应产品的保费计算，确认要删除么?</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="deletes">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog :title="titles" :visible.sync="dialogFormVisible">
			<el-form :model="form" :rules="rules" ref="form">
				<el-form-item label="企业名称" :label-width="formLabelWidth" prop="custFullName">
					<el-select v-model.trim="form.custFullName" filterable remote reserve-keyword placeholder="请输入企业名称" clearable :remote-method="dataFilter" :label-width="formLabelWidth" class="item5" :disabled="disabled" @change="enterChoose">
						<el-option v-for="item in options3" :key="item.value" :label="item.custFullName" :value="item.userCode"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="会员类型" :label-width="formLabelWidth" prop="Membership">
					<el-select v-model="form.Membership" class="item5" @change="changes">
						<el-option v-for="item in options2" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="会员等级" :label-width="formLabelWidth" prop="vipType" v-if="form.Membership !='sequip_vip03'">
					<el-select v-model="form.vipType" class="item5">
						<el-option v-for="item in options4" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="企业星级" :label-width="formLabelWidth" prop="vipType" v-else>
					<el-select v-model="form.vipType" class="item5">
						<el-option v-for="item in options4" :key="item.value" :label="item.elementValues" :value="item.valuesCode"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="determinemodifications('form')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js'
import elevatorType from '../../../static/data/elevatorType.json';
import safetyEvaluation from '../../../static/data/safetyEvaluation.json';
import publicConfiguration from '../../global/publicConfiguration.js';
export default {
	data() {
		return {
			Elevator:new elevator(),
			publicConfiguration:new publicConfiguration(),
			show: true,
			title: '收回',
			icon: 'el-icon-arrow-up',
			value1: '' ,
			value2: '',
			options: [],
			options2: [],
			options3: [],
			options4: [],
			data1: [],
			datas:[],
			total: 0,
			pageNum:1,
			pagesize: 10,
			currentPage: 1,
			dialogFormVisible: false,
			dialogVisible:false,
			form: {
				custFullName: '',
				Membership:'',
				vipType: '',
				userCode:'',
				name:'',
			},
			rules:{
				custFullName:[{required: true, message: '请输入企业名称', trigger: 'blur'}],
				Membership:[{required: true, message: '请选择会员类型', trigger: 'blur'}],
				vipType:[{required: true, message: '请选择会员等级', trigger: 'blur'}],
			},
			formLabelWidth: '120px',
			disabled:false,
			titles:'新增会员信息',
		}
	},
	created() {
		this.membershiptype();
		this.getqiyestars();
		if(window.localStorage.getItem('index') == '10'){
			this.gettingCache();
		}else{
			window.localStorage.removeItem('data');
			this.getUserlisy();
		}
		this.datas = JSON.parse(window.sessionStorage.getItem('list'));
	},
	methods: {
		async membershiptype(){ //获取会员类型
			let parmes = await this.Elevator.membershiptype();
			if(parmes.code == '0000'){
				this.options2 = parmes.list;
			};
		},
		async getqiyestars() {
			let res = await this.Elevator.getqiyestars();
			if (res.code == '0000') {
				this.options = res.list;
			}
		},
		takeBack(){ // 搜索条件的展开与收回
			let data  = this.publicConfiguration.switchs(this.show);
			this.show = data.show;
			this.title = data.title;
			this.icon = data.icon;
		},
		newlyAdded(){ //新增
			this.titles = "新增会员信息";
			this.form.userCode = '';
			this.form.Membership = '';
			this.form.vipType = '';
			this.form.custFullName = '';
			this.disabled = false;
			this.dialogFormVisible = true;
		},
		async dataFilter(val){ //查询用户
			var areaCode = '';
			let loginIdOrUserName = val;
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				
			}else{
				areaCode = window.sessionStorage.getItem('provinceCode')
			}
			let data = {
				'areaCode':areaCode,
				'loginIdOrUserName':loginIdOrUserName,
				'pageNum':1,
				'pageSize':10
			};
			let res = await this.Elevator.getuserlist(data);
			if(res.code == '0000'){
				this.options3 = res.list;
			}
		},
		enterChoose(value){
			this.options3.find(item => {
				if(item.userCode == value){
					if(item.userType == '个人'){
						this.$message({
							message: '此功能仅限企事业单位配置',
							type: 'warning'
						});
						this.form.custFullName = '';
						return;
					}
					if(item.auditStatus == '0'){
						this.$message({
							message: '请先去补充认证用户信息',
							type: 'warning'
						});
						this.form.custFullName = '';
						return;
					}
					this.form.name = item.custFullName;
				}
			})
		},
		modify(row) { //修改会员信息
			this.titles = "修改会员信息";
			this.disabled = true;
			this.dialogFormVisible = true;
			this.form.userCode = row.userCode;
			this.form.Membership = row.vipType;
			this.form.custFullName = row.custFullName;
			this.form.vipType = row.vipValue;
			this.setVipOptions(row.vipType)

		},
		changes(value){ // 会员类型
			this.form.vipType = '';
			this.form.Membership = value;
			this.setVipOptions(value)
			
		},
		// 设置会员等级options数据
		setVipOptions(value) {
			
			let options4Rule = [
				{
					vipKey:'sequip_vip01',
					vipFlag:'00'
				},
				{
					vipKey:'sequip_vip02',
					vipFlag:'22'
				},
				{
					vipKey:'sequip_vip03',
					vipFlag:'25'
				},
				{
					vipKey:'sequip_vip04',
					vipFlag:'25'
				},
				{
					vipKey:'sequip_vip05',
					vipFlag:'25'
				},
				{
					vipKey:'sequip_vip06',
					vipFlag:'25'
				},
				{
					vipKey:'sequip_vip07',
					vipFlag:'SX_STAFF_VIP'
				}
			]
			let {vipFlag} = options4Rule.find(item=>item.vipKey===value) || ''
			this.options4 = this.options.filter(item=>item.valuesCode.indexOf(vipFlag) != -1)
		},
		determinemodifications(form){ // 特设渠道修改会员类型
			this.$refs[form].validate((valid) => {
          		if (valid) {
					  this.determinemodificationss();
          		} else {
            		return false;
          		}
        	});
		},
		async determinemodificationss(){
			let data = {
				"modifyPersonCode": window.sessionStorage.getItem('userCode'),
				"modifyPsersonName": window.sessionStorage.getItem('userName'),
				"userCode": this.form.userCode?this.form.userCode:this.form.custFullName,
				"vipType": this.form.Membership,
				"vipValue": this.form.vipType,
			};
			let res = await this.Elevator.revisingStars(data);
			if (res.code == '0000') {
				this.dialogFormVisible = false;
				this.dialogVisible = false;
				if(this.form.userCode){
					if(this.form.Membership){
						this.$logger.info('A1003',this.form,data);
						this.$message({
							message: '修改成功',
							type: 'success'
						});
					}else{
						this.$logger.info('A1004',this.form,data);
						this.$message({
							message: '删除成功',
							type: 'success'
						});
					}
				}else{
					this.$logger.info('A1002',this.form,data);
					this.$message({
						message: '添加成功',
						type: 'success'
					});
				}
				this.getUserlisy();
			}
		},
		
		async getUserlisy() { // 查询列表
			var value = '';
			if(window.sessionStorage.getItem('branchCode') == 'JT0000'){
				
			}else{
				value = window.sessionStorage.getItem('authDataArea') ? window.sessionStorage.getItem('authDataArea') : window.sessionStorage.getItem('provinceCode')
			}
			let form = {
				'pageNum': this.pageNum,
				'pageSize': this.pagesize,
				'custFullName': this.value1,
				'vipType': this.value2,
				'areaCode': value
			}
			let index = '10';
			window.localStorage.setItem('data',JSON.stringify(form));
			window.localStorage.setItem('index',index);
			let res = await this.Elevator.getEnterpriseStar(form);
			if (res.code == '0000'){
				for(var i=0;i<res.list.length;i++){
					for(var j=0;j<this.options2.length;j++){
						if(res.list[i].vipType == this.options2[j].valuesCode){
							res.list[i].vipTypeValues = this.options2[j].elementValues;
						}
					}
					for(var k=0;k<this.options.length;k++){
						if(res.list[i].vipValue == this.options[k].valuesCode){
							res.list[i].vipValueValues = this.options[k].elementValues;
						}
					}
				}
				this.data1 = res.list
				this.total = res.total;
			}
		},
		gettingCache(){ // 搜索历史记录
			let data = JSON.parse(window.localStorage.getItem('data'));
			this.value1 = data.custFullName;
			this.value2 = data.vipType;
			this.pageNum = data.pageNum;
			this.currentPage = data.pageNum;
			this.getUserlisy();
		},
		searchview() {
			this.pageNum = 1;
			this.currentPage = 1;
			this.getUserlisy();
		},
		empty() {
			this.value1 = '';
			this.value2 = "";
			this.pageNum = 1;
			this.currentPage = 1;
			this.getUserlisy();
		},
		handleCurrentChange: function(pageNum) {
			this.pageNum = pageNum;
			this.getUserlisy();
		},
		relation(row) { //删除
			this.dialogVisible = true;
			this.form.userCode = row.userCode;
			this.form.Membership = "";
			this.form.custFullName = row.custFullName;
			this.form.vipType = "";	
		},
		deletes(){
			this.determinemodificationss();
		},
	},
}
</script>

<style lang="less">
	#elevator {
		padding-bottom: 80px;
		.mybox-leave-active,
		.mybox-enter-active {
			transition: all .5s linear;
		}

		.mybox-leave-active,
		.mybox-enter {
			height: 0px !important;
		}

		.mybox-leave,
		.mybox-enter-active {
			height: 80px;
		}

		.elesearchs {
			height: 70px;
			text-align: right;
			width: calc(100% - 40px);
			padding: 20px 20px 10px;
			margin: 20px 20px 0;
			box-sizing: border-box;
			background-color: #fff;	
		}

		.elesearch {
			width: calc(100% - 40px);
			min-height: 234px;
			padding: 20px 20px 10px;
			margin: 0px 20px 0 20px;
			box-sizing: border-box;
			background-color: #fff;	
			overflow: hidden;
			.elesearch1 {
				width: 100%;
				.item1 {
					width: 220px;
					margin-top: 5px;
				}
				.item2 {
					display: block;
					width: 200px;
					line-height: 25px;
					padding-left: 1em;
					box-sizing: border-box;
					font-size: 12px;
				}
				.item3 {
					margin-top: 30px;
				}
			}
		}
		.content1{
			width: 96%;
			height: 30px;
			text-align: right;
			margin-left: 2%;
			margin-top: 20px;
		}
		.content-table {
			width: calc(100% - 40px);
			margin: 20px 20px 0;
			background-color: #ffffff;
			.item4 {
				font-size: 12px;
				text-decoration: underline;
				color: #4E80FF;
			}
		}
		.content-total {
			width: 95%;
			height: 60px;
			line-height: 60px;
			text-align: right;
		}
		.item5 {
			width: 350px;
		}
	}
</style>
