<template>
  	<div class="addRecordDialog">
		<el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal=false destroy-on-close custom-class="configDialog_dialog" @close="closeDialog">
			<div>
				<el-form :model="form" :inline="true" ref="form"   label-position="left" class="border-bottom top-content">
					<p class="con-title">机构信息</p>
					<el-row class="mt10">
						<el-col :span="10">
							<el-form-item label="单位：">
								<span>{{form.orgName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="14">
							<el-form-item label="营销员：">
								<p v-if="!showVisitor">
									<span v-for="(item,index) in form.visitors" :key="index">{{item.name}}<span v-if="index+1 != form.visitors.length">、</span></span>
									<span @click="changeVistor" class="ml10 edit-user">变更</span>
								</p>
								<p v-if="showVisitor">
									<el-select v-model="chooseVisitor" filterable size="medium" @change="visitorChange" multiple placeholder="请选择营销员">
										<el-option
											v-for="item in optionsVisitor"
											:key="item.userCode"
											:label="item.linkmanName"
											:value="item.userCode">
										</el-option>
									</el-select>
									<el-button type="info" class="ml5" @click="confirmVisitor" size="medium">确认</el-button>
									<el-button type="info" size="medium" @click="cancelVisitor">取消</el-button>
								</p>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<el-form :model="form" ref="form" :rules="rules" :inline="true" label-width="130px" size="medium" label-position="right" class="mt10">
					<p class="con-title">企业信息</p>
					<el-row class="mt10">
						<el-col :span="24">
							<el-form-item label="企业名称" prop="companyName">
								<el-select v-model.trim="form.companyName" filterable remote reserve-keyword placeholder="请输入企业名称（模糊查询）" clearable :remote-method="dataFilter" class="item4" @change="choice">
									<el-option v-for="(item,index) in restaurants" :key="index" :label="item.custFullName" :value="item.custFullName"></el-option>
								</el-select>
								<span class="search-icon">
									<el-button type="text" @click="AddPolicyholder"  icon="el-icon-circle-plus">添加企业</el-button>
								</span>
								<p v-if="form.userLoginId" class="user-id"><i class="el-icon-info"></i> 当前企业账号为“<span>{{form.userLoginId}}</span>”</p>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="企业地址" prop="location">
								<el-cascader size="medium" :options="area" placeholder="请选择企业地址" change-on-select v-model="form.location" clearable></el-cascader>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="联系人" prop="visitName">
								<el-input v-model="form.visitName" placeholder="请输入联系人"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="联系电话">
								<el-input v-model="form.visitPhone" placeholder="请输入联系电话"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="职务">
								<el-input v-model="form.visitPost" placeholder="请输入职务"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<p class="con-title border-top">营销信息</p>
					<el-row class="mt10">
						<el-col :span="12">
							<el-form-item label="服务时间" prop="visitDate">
								<el-date-picker :picker-options="dealDateStartOptions" value-format="yyyy-MM-dd" type="date" placeholder="请选择服务时间" v-model="form.visitDate"></el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="服务时长" prop="visitDuration">
								<el-input-number :step="0.5" v-model="form.visitDuration" :min="0.5" :max="12"></el-input-number>  小时
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="服务阶段/内容" prop="content" style="width:100%">
								<el-cascader placeholder="请选择服务阶段/内容" :options="serviceContent" @change="changeContent"  v-model="form.content" :props="{ multiple: true, value: 'code', label: 'msg', children: 'group' }" clearable></el-cascader>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="服务方式" prop="visitMode">
								<el-select size="medium" v-model="form.visitMode" @change="changevisitMode" placeholder="请选择服务方式" class="item2" clearable>
									<el-option v-for="item in serviceMode" :key="item.code" :label="item.msg" :value="item.code"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="跟进结果描述" prop="visitSituation" style="width:100%">
								<el-input type="textarea" :rows="3" placeholder="多行输入" v-model.trim="form.visitSituation"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="上传附件(选填)">
								<el-upload action="#" :limit="9" :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" :http-request="Upload" :file-list="fileList" accept=".pdf , .jpg , .png ,.PDF , .JPG , .PNG ">
									<el-button size="small" type="primary">选择附件</el-button>
									<div slot="tip" class="el-upload__tip files-tip">只支持PDF/PNG/JPG，大小不超过10M（最多可上传9件）</div>
								</el-upload>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog" type="info" size="medium" round>取 消</el-button>
				<el-button @click="saveFn" type="warning" round size="medium">确认提交</el-button>
			</span>
		</el-dialog>
		<AddPolicyholderInfo ref="myChildEleList" :options3="options3" :options2="options2" :areaData="area" @func="getMsgFormSon"></AddPolicyholderInfo>
  	</div>
</template>

<script>
import {elevator} from '../../../server/accidenServer.js'
import UserService from '../../../service/UserService'
import PolicyentryService from '../../../service/PolicyentryService'
import ResourcesService from '../../../service/ResourcesService'
import AddPolicyholderInfo from '../../policyentry/components/AddPolicyholderInfo.vue'
export default {
	components:{
		AddPolicyholderInfo
	},
  	name: "addRecordDialog",
	props: {
		area: {
			type: Array,
			default: []
		},
		serviceMode: {
			type: Array,
			default: []
		},
		serviceContent: {
			type: Array,
			default: []
		}
	},
	data() {
		return {
			options2: [],
			options3: [],
			form: {
				orgCode:window.sessionStorage.getItem('branchCode'),
				orgName:window.sessionStorage.getItem('branchName'),
				areaCode:'',// (string, optional): 区县编码 ,
				areaName:'',// (string, optional): 区县名称 ,
				cityCode:'',// (string): 市编码 ,
				cityName:'',// (string): 市名称 ,
				provinceCode:'',// (string): 省份编码 ,
				provinceName:'',// (string): 省份名称 ,
				type:1,// (integer): 拜访类型(1企业拜访 2行管拜访 3 个人拜访) ,
				periodParams:[],
				companyName: '',
				companyCode:'',
				location: [],
				visitName: '',
				visitPhone: '',
				visitPost: '',
				visitDate: '',
				visitDuration: 0.5,
				content: '',
				visitMode: '',
				visitModeName:'',
				visitSituation: '',
				fileInfoDTOS:[],
				visitors:[{
					code: window.sessionStorage.getItem('userCode'),// (string, optional): 拜访人编码 ,
					name: window.sessionStorage.getItem('userName'),// (string, optional): 拜访人名称 ,
					orgCode: window.sessionStorage.getItem('branchCode'),// (string, optional): 拜访人机构编码
				}]
			},
			Elevator: new elevator(),
			UserService: new UserService(),
			PolicyentryService: new PolicyentryService(),
			ResourcesService: new ResourcesService(),
			dialogVisible: false,
			rules: {
				companyName:[
					{required: true, message: '请输入企业名称', trigger: 'blur'}
				],
				location:[ 
					{required: true, message: '请选择企业地址', trigger: 'change'}
				],
				visitName:[
					{required: true, message: '请输入联系人', trigger: 'blur'}
				],
				visitDate:[
					{type: 'string', required: true, message: '请选择日期', trigger: 'change'}
				],
				visitDuration:[
					{required: true, message: '请输入服务时长', trigger: 'blur'}
				],
				content:[
					{required: true, message: '请选择服务阶段/内容', trigger: 'change'}
				],
				visitMode:[
					{required: true, message: '请选择服务方式', trigger: 'change'}
				],
				visitSituation:[
					{ required: true, message: '请输入跟进结果描述', trigger: 'blur' },
					{ min: 2, max: 100, message: '长度在2到100位', trigger: 'blur' }
				],
			},
			userList: [],
			restaurants: [],
			fileList: [],
			isAdd:true,
			title:'添加营销记录',
			chooseVisitor:[],
			optionsVisitor:[],
			showVisitor:false,
			isJT0000: false,
			dealDateStartOptions:this.beginDate(),
		}
	},
	created() {
		this.elementRelaConf();
		this.enterprisestypes();
		this.getBranchPerson();
	},
	watch: {
		dialogVisible(newValue, oldValue) {
			console.log(newValue);
		}	
	},
	methods: {
		beginDate(){
            let self = this
            return {
                disabledDate(time){
                    let startDate = self.serviceData?self.serviceData.split(" ")[0]: new Date();
                    return time.getTime() >  new Date(startDate)
                }
            }
        },
		async Upload(file){ // 图片上传
			const formData = new FormData();
			let data = [file.file]
			const res = await this.ResourcesService.uploadFile('sequip-svc','visit','0',data);
			if(res.code == '0000'){
				this.form.fileInfoDTOS.push(
					{
						fileName:res.list[0].fileName,// (string, optional): 文件名称 ,
						resFileId: res.list[0].fileId,// (integer, optional): 文件id
					}
				);
			}
		},
		beforeAvatarUpload(file) {
			let isLt10M = file.size / 1024 / 1024 < 10;
			if (!isLt10M) {
				this.$message.error('上传附件大小不能超过 10MB!');
			}
			return isLt10M;
		},
		beforeRemove(file, fileList) {
			if(file && file.status==="success"){
				if(this.$confirm(`确定移除 ${ file.name }？`)) {
					this.form.fileInfoDTOS.splice(this.form.fileInfoDTOS.findIndex(item => item.fileName == file.name),1)
					if(file.id) {
						this.form.fileRecordIds.push(file.id)
					}
				}
				return this.$confirm(`	 ${ file.name }？`);
			}
		},
		
		async choice(value){
			if(value){
				let isAttestation = '0';
				this.restaurants.find(item =>{
					if(item.custFullName == value){
						this.form.userCode = item.userCode;
						this.form.companyName = item.custFullName;
						this.form.location = item.provinceCode?[item.provinceCode.substring(0, 2) + '0000',item.provinceCode.substring(0, 4) + '00',item.provinceCode]:[];
						this.form.userLoginId = item.userloginId;
						isAttestation = item.isAttestation
					}
				})
				if(isAttestation != '0'){
					const res = await this.PolicyentryService.getauthsafety(this.form.userCode,'sequip');
					if(res.code == '0000'){
						this.form.location = [res.data.provinceCode.substring(0, 2) + '0000',res.data.provinceCode.substring(0, 4) + '00',res.data.provinceCode];
						this.form.visitName = res.data.custOrganizationElementList.find(item => item.elementCode == 'linkManName') ? res.data.custOrganizationElementList.find(item => item.elementCode == 'linkManName').elementValues : '';
						this.form.visitPhone = res.data.custOrganizationElementList.find(item => item.elementCode == 'linkManPhone') ? res.data.custOrganizationElementList.find(item => item.elementCode == 'linkManPhone').elementValues : '';
          			}
				}
			}else{
				this.form.userLoginId = "";
			}
		},
		saveFn() {
			this.$refs['form'].validate((valida) => {
				if (valida) {
					console.log(this.form.location);
					if(this.form.location.length == 3){
						this.form.provinceCode = this.form.location[0];
						this.form.cityCode = this.form.location[1];
						this.form.areaCode = this.form.location[2];
						let { label, children } = this.area.find(i => i.value == this.form.location[0]) || '';
						let { label: cityLabel,children: cityChildren  } = children.find(t => t.value == this.form.location[1]) || '';
						let { label: areaLabel } = cityChildren.find(b => b.value == this.form.location[2]) || '';
						this.form.provinceName = label;
						this.form.cityName = cityLabel;
						this.form.areaName = areaLabel == undefined ? '' : areaLabel;
					}
					if (this.isAdd) {
						this.addRecord();
					} else {
						this.editRecord();
					}
				} else {
					return false;
				}
			})
		},
		async addRecord() {
			let res = await this.UserService.postAddRecord(this.form);
			if(res.code == '0000') {
				this.$message({
					type: 'success',
					message: '添加成功!'
				});
				this.$parent.searchFun();
				this.dialogVisible = false;
			}
		},
		async editRecord() {
			let res = await this.UserService.postEditRecord(this.form);
			if(res.code == '0000') {
				this.$message({
					type: 'success',
					message: '编辑成功!'
				});
				this.$parent.searchFun();
				this.dialogVisible = false;
			}
		},
		closeDialog() {
			this.dialogVisible = false;
		},
		AddPolicyholder(){
			this.$refs.myChildEleList.Opendialog();
		},
		async elementRelaConf() {		
			let data = await this.UserService.elementRelaConf();
			let {code,list} = data;
			if(code == "0000"){
				for(var i=0;i<data.list.length;i++){
					if(data.list[i].valuesCode == 'sequip_A'){
						data.list.splice(i,1)
					}
					if(data.list[i].valuesCode == 'sequip_B'){
						data.list.splice(i,1)
					}
				}
				this.options2 = data.list
			}
		},
		async enterprisestypes() {		
			let data = await this.UserService.enterprisestypes();
			let {code, list} = data;
			if(code == "0000"){
				this.options3 = data.list
			}
		},
		getMsgFormSon(data){
			this.form.companyCode = data.userCode
			this.form.companyName = data.holderName
			this.form.visitName = data.person1
			this.form.visitPhone = data.phone1
			this.form.provinceCode = data.location[0]
			this.form.cityCode = data.location[1]
			this.form.areaCode = data.location[2]
			this.form.provinceName = data.provinceName
			this.form.cityName = data.cityName
			this.form.areaName = data.countyName
			this.form.location = data.location;
			this.$message({
				type: 'success',
				message: '添加企业成功!'
			});
		},
		async dataFilter(val){
			if(val){
				let data = {
					'loginIdOrUserName':val,
					'pageNum':1,
					'pageSize':10,
					'channelNo':'sequip',
					'userType':'',
					'beginRegisterDate':'',
					'endRegisterDate':'',
					'status':'',
					'provinceCode':'',
					'auditStatus':'',
				};
				let res = await this.PolicyentryService.getUserList(data);
				if(res.code == '0000'){
					this.restaurants = res.list;
				}
			}
		},
		async getDetailById(id) {
			let res = await this.UserService.getRecordDetail({id:id});
			if(res.code == '0000') {
				this.chooseVisitor = [];
				this.form = {
					id:res.data.id,
					orgCode:res.data.orgCode,
					orgName: res.data.orgName,
					areaCode:res.data.areaCode,// (string, optional): 区县编码 ,
					areaName:res.data.areaName,// (string, optional): 区县名称 ,
					cityCode:res.data.cityCode,// (string): 市编码 ,
					cityName:res.data.cityName,// (string): 市名称 ,
					provinceCode:res.data.provinceCode,// (string): 省份编码 ,
					provinceName:res.data.provinceName,// (string): 省份名称 ,
					type: 1,// (integer): 拜访类型(1企业拜访 2行管拜访 3 个人拜访) ,
					periodParams:[],
					companyName: res.data.companyName,
					companyCode:res.data.companyCode,
					location: [res.data.provinceCode,res.data.cityCode,res.data.areaCode],
					visitName: res.data.visitName,
					visitPhone: res.data.visitPhone,
					visitPost: res.data.visitPost,
					visitDate: res.data.visitDate,
					visitDuration: res.data.visitDuration,
					content: [],
					visitMode: res.data.visitMode,
					visitModeName:res.data.visitModeName,
					visitSituation: res.data.visitSituation,
					fileInfoDTOS:[],
					visitors:[],
					fileRecordIds:[],// (Array[integer], optional): 被删除文件的关联id ,
				};
				res.data.visitors.forEach(t => {
					let obj = {
						code: t.visitorCode,// (string, optional): 拜访人编码 ,
						name: t.visitorName,// (string, optional): 拜访人名称 ,
						orgCode: t.orgCode,// (string, optional): 拜访人机构编码
					}
					if(t.visitorCode != window.sessionStorage.getItem('userCode')) {
						this.chooseVisitor.push(t.visitorCode)
					}
					this.form.visitors.push(obj);
				})
				res.data.visitPeriods.forEach(i => {
					let obj = [i.visitPeriod, i.visitCause];
					this.form.content.push(obj);
				})
				this.form.content.forEach(i => {
					let obj = {
						visitCause:"",// (integer): 服务事由 ,
						visitCauseName:"",// (string): 服务事由名称 ,
						visitPeriod:"",// (integer): 服务阶段 ,
						visitPeriodName:"",// (string): 服务阶段名称
					}
					
					let { code,msg,group = [] } = this.serviceContent.find(item => item.code == i[0]) || '';
					let { msg: groupMsg, code: groupCode } = group.find(t => t.code == i[1]) || ''
					obj.visitPeriod = code;
					obj.visitPeriodName = msg;
					obj.visitCause = groupCode;
					obj.visitCauseName = groupMsg;
					this.form.periodParams.push(obj);
				})
				if(res.data.fileRels && res.data.fileRels.length != 0) {
					res.data.fileRels.forEach(e => {
						e.name = e.fileName
						e.url = this.$apiUrl.COM_INDENT1+e.url
						this.fileList.push(e)
					})
				}
			}
		},
		initData(data) {
			this.fileList = [];
			if(data) {
				this.title = '修改营销记录'
				this.isAdd = false;
				// this.form.periodParams = [];
				if(window.sessionStorage.getItem('branchCode') == 'JT0000') {
					this.isJT0000 = true;
				} else {
					this.isJT0000 = false;
				}
				this.getDetailById(data);
				// console.log(this.form.periodParams, '11111111111111111111111111111111');
			} else {
				this.chooseVisitor = [];
				this.title = '添加营销记录'
				this.isJT0000 = false;
				this.isAdd = true;
				this.form = {
					orgCode:window.sessionStorage.getItem('branchCode'),
					orgName:window.sessionStorage.getItem('branchName'),
					areaCode:'',// (string, optional): 区县编码 ,
					areaName:'',// (string, optional): 区县名称 ,
					cityCode:'',// (string): 市编码 ,
					cityName:'',// (string): 市名称 ,
					provinceCode:'',// (string): 省份编码 ,
					provinceName:'',// (string): 省份名称 ,
					type: 1,// (integer): 拜访类型(1企业拜访 2行管拜访 3 个人拜访) ,
					periodParams:[],
					companyName: '',
					companyCode:'',
					location: '',
					visitName: '',
					visitPhone: '',
					visitPost: '',
					visitDate: '',
					visitDuration: 0.5,
					content: '',
					visitMode: '',
					visitModeName:'',
					visitSituation: '',
					fileInfoDTOS:[],
					visitors:[{
						code: window.sessionStorage.getItem('userCode'),// (string, optional): 拜访人编码 ,
						name: window.sessionStorage.getItem('userName'),// (string, optional): 拜访人名称 ,
						orgCode: window.sessionStorage.getItem('branchCode'),// (string, optional): 拜访人机构编码
					}]
				};
			}
			this.dialogVisible = true;
			if(this.isAdd) {
				this.$refs.form.resetFields();
			}
		},
		changeContent() {
			console.log(111112312312312312);
			this.form.periodParams = [];
			this.form.content.forEach(i => {
				let obj = {
					visitCause:"",// (integer): 服务事由 ,
					visitCauseName:"",// (string): 服务事由名称 ,
					visitPeriod:"",// (integer): 服务阶段 ,
					visitPeriodName:"",// (string): 服务阶段名称
				}
				let {code,msg,group=[]} = this.serviceContent.find(item => item.code == i[0]) || '';
					let {msg: groupMsg, code: groupCode} = group.find(t => t.code == i[1]) || ''
					obj.visitPeriod = code;
					obj.visitPeriodName = msg;
					obj.visitCause = groupCode;
					obj.visitCauseName = groupMsg;
				// let visitPeriod = this.serviceContent.find(item => item.code == i[0])
				// let visitPeriodName = this.serviceContent.find(item => item.code == i[0])
				// let visitCause = this.serviceContent.find(item => item.code == i[0]).group.find(t => t.code == i[1])
				// let visitCauseName = this.serviceContent.find(item => item.code == i[0]).group.find(t => t.code == i[1])
				// if(visitPeriod != undefined) { obj.visitPeriod = visitPeriod.code }
				// if(visitPeriodName != undefined) { obj.visitPeriodName = visitPeriodName.msg }
				// if(visitCause != undefined) { obj.visitCause = visitCause.code }
				// if(visitCauseName != undefined) { obj.visitCauseName = visitCauseName.msg }
				this.form.periodParams.push(obj);
				console.log(this.form.periodParams, '12312312312312312');
			})
		},
		changevisitMode() {
			this.form.visitModeName = this.serviceMode.find(i => i.code == this.form.visitMode).msg;
		},
		async getBranchPerson() {
			let params = {
				roleCode:window.sessionStorage.getItem('branchCode') == 'JT0000' ? '19RL1651169407801753601' : '19RL1648900050161766400',
				channelCode: '',
				jtBranchCode:'',
				pageNum:1,
				pageSize:10000
			};
			let res = await this.UserService.getBranchPerson(params);
			if(res.code == '0000' && res.total != 0) {
				console.log(res);
				res.list.splice(res.list.findIndex(i => i.userCode == window.sessionStorage.getItem('userCode')),1)
				this.optionsVisitor = res.list
			} else {
				this.optionsVisitor = [];
			}
		},
		changeVistor() {
			this.showVisitor = true;
		},
		visitorChange(e) {
			if(e.length > 2) {
				// 最多支持3人
				this.$message({
					type: 'error',
					message: '最多支持3人!'
				})
				this.chooseVisitor.splice(2)
			}
		},
		cancelVisitor() {
			this.chooseVisitor.length != 0 ? this.chooseVisitor = this.chooseVisitor : this.chooseVisitor = [];
			this.showVisitor = false;
		},
		confirmVisitor() {
			this.form.visitors = [{
				code: window.sessionStorage.getItem('userCode'),// (string, optional): 拜访人编码 ,
				name: window.sessionStorage.getItem('userName'),// (string, optional): 拜访人名称 ,
				orgCode: window.sessionStorage.getItem('branchCode'),// (string, optional): 拜访人机构编码
			}];
			this.chooseVisitor.forEach(i => {
				let obj = {
					code: this.optionsVisitor.find(t => t.userCode == i).userCode,
					name: this.optionsVisitor.find(t => t.userCode == i).linkmanName,
					orgCode: this.optionsVisitor.find(t => t.userCode == i).jtBranchCode,
				};
				if(!this.form.visitors.find(i => i.code == obj.code)) {
					this.form.visitors.push(obj);
				}
			})
			console.log(this.chooseVisitor);
			this.showVisitor = false;
		}
	},
}
</script>

<style lang='less'>
.addRecordDialog {
	.configDialog_dialog {
		min-width: 900px;
		.el-textarea,.el-cascader {
			width: 650px;
		}
	}
	.top-content {
		.el-form-item {
			margin-bottom: 10px;
		}
	}
	.border-bottom {
		border-bottom: 1px dashed #ccc;
	}
	.border-top {
		border-top: 1px dashed #ccc;
		padding-top: 10px;
	}
	.con-title {
		font-weight: 700;
		font-size: 16px;
		color: #000000;
		line-height: 24px;
	}
	.edit-user {
		color: #1890ff;
		line-height: 20px;
		text-decoration: underline;
		cursor: pointer;
	}
	.search-icon{
		margin-left: 20px;
	}
	.user-id {
		margin-top: 10px;
		min-width: 440px;
		max-width: 840px;
		color: #34c697;
		padding: 1px 10px;
		border-radius: 4px;
		background-color: #dbf9ef;
		font-weight: 600;
	}
	.files-tip {
		display: inline-block;
		color: #096dd9;
		margin-left: 20px;
	}
	.el-dialog__body {
		padding: 30px;
	}
}
</style>
