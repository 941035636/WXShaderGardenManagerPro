<template>
  	<div class="addRecordNew">
		<el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal=false destroy-on-close custom-class="configDialog_dialog" @close="closeDialog">
			<div>
				<el-form :model="form" :inline="true" ref="form" label-position="left" class="border-bottom top-content">
					<p class="con-title">机构信息</p>
					<el-row class="mt10">
						<el-col :span="10">
							<el-form-item label="单位：">
								<span>{{form.orgName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="14">
							<el-form-item label="业务员：">
								<p v-if="!showVisitor">
									<span v-for="(item,index) in form.visitorInfoList" :key="index">{{item.visitorName}}<span v-if="index+1 != form.visitorInfoList.length">、</span></span>
									<span @click="changeVistor" class="ml10 edit-user">变更</span>
								</p>
								<p v-if="showVisitor">
									<el-select v-model="chooseVisitor" filterable size="medium" @change="visitorChange" multiple placeholder="请选择业务员">
										<el-option
											v-for="item in optionsVisitor"
											:key="item.userCode"
											:label="item.userName + '/' + item.employeeNum"
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
				<el-form :model="form" ref="form" :rules="rules" :inline="true" label-width="130px" size="mini" label-position="right" class="mt10">
					<p class="con-title">客户信息</p>
					<el-row class="mt10" v-if="!getIsPersonType">
						<el-col :span="24">
                        
							<el-form-item label="企业名称" prop="companyName">
								<el-select v-model.trim="form.companyName" filterable remote reserve-keyword placeholder="请输入企业名称（模糊查询）" clearable :remote-method="dataFilter" class="item4" @change="choice">
									<el-option v-for="(item,index) in restaurants" :key="index" :label="item.customerName" :value="item.customerName"></el-option>
								</el-select>
								<!-- <span class="search-icon">
									<el-button type="text" @click="AddPolicyholder"  icon="el-icon-circle-plus">添加企业</el-button>
								</span> -->
							</el-form-item>
						</el-col>
                    </el-row>
                    <div class="display-flex">
                        <el-form-item :label="getIsPersonType ? '联系地址：' :'企业地址：'" prop="location">
                            <el-cascader :options="area" placeholder="请选择" v-model="form.location" class="item1" @change="handleChange"></el-cascader>
                        </el-form-item>
                        <el-form-item prop="address" label-width="0px">
                            <el-input placeholder="请输入详细地址" v-model.trim="form.address" class="item2" clearable></el-input>
                        </el-form-item>
                    </div>
                    <div class="person-details" v-if="form.companyName && !getIsPersonType">
                        <el-row>
                            <el-col :span="12" >
                                <span>证件号码：</span>
                                <span>{{form.companyCode }}</span>
                                
                            </el-col>
                            <el-col :span="12">
                                <span>客户星级：</span>
                                <span>{{form.levelName }}</span>
                            </el-col>
                        </el-row>
                        <el-row class="mt10">
                            <el-col :span="12" >
                                <span>客户类型：</span>
                                <span>{{form.customerTypeName }}</span>
                                
                            </el-col>
                            <el-col :span="12">
                                <span>运营类型：</span>
                                <span>{{form.operationTypeName }}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="display-flex">
                        <el-form-item label="联系人" prop="visitName">
                            <el-input style="width:150px" v-model="form.visitName" placeholder="请输入联系人"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="contactorSex" label-width="80px">
                           <el-select style="width:100px" v-model="form.contactorSex" filterable size="medium"  placeholder="请选择">
                                <el-option
                                    label="男"
                                    value="男">
                                </el-option>
                                <el-option
                                    label="女"
                                    value="女">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="职务" prop="visitPost" label-width="100px">
                            <el-input style="width:150px" v-model="form.visitPost" placeholder="请输入职务"></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="联系电话" prop="visitPhone">
                        <el-input v-model="form.visitPhone" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
					<p class="con-title border-top">服务信息</p>
                    <div class="display-flex mt10">
                        <el-form-item label="服务时间" prop="visitDate">
                            <el-date-picker style="width:150px" :picker-options="dealDateStartOptions" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择服务时间" v-model="form.visitDate"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="服务时长" prop="visitDuration" label-width="80px">
                            <el-input-number style="width:100px" :step="0.5" v-model="form.visitDuration" :min="0.5" :max="12"></el-input-number>  小时
                        </el-form-item>
                        <el-form-item label="服务方式" prop="visitMode" label-width="100px">
                            <el-select style="width:150px" v-model="form.visitMode" @change="changevisitMode" placeholder="请选择服务方式" class="item2" clearable>
                                <el-option v-for="item in serviceMode" :key="item.code" :label="item.msg" :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <el-form-item label="服务阶段/内容" prop="content" style="width:100%">
                        <el-cascader style="width:600px" placeholder="请选择服务阶段/内容" :options="getServiceContent" @change="changeContent"  v-model="form.content" :props="{ multiple: true, value: 'code', label: 'msg', children: 'group' }" clearable></el-cascader>
                    </el-form-item>
                    <el-form-item label="跟进结果描述" prop="visitSituation" style="width:100%">
                        <el-input style="width:600px" type="textarea" :rows="3" placeholder="多行输入" v-model.trim="form.visitSituation"></el-input>
                    </el-form-item>
                    <el-form-item label="拜访资料(选填)"  style="width:100%">
                        <el-select style="width:600px" allow-create v-model="form.visitFileDesc" filterable  multiple placeholder="请选择">
                            <el-option
                                v-for="item in visitFilesOptins"
                                :key="item.value"
                                :label="item.label"
                                :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上传附件(选填)">
                        <el-upload action="#" :limit="9" :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" :http-request="Upload" :file-list="fileList" accept=".pdf , .jpg , .png ,.PDF , .JPG , .PNG ">
                            <el-button type="primary">选择附件</el-button>
                            <div slot="tip" class="el-upload__tip files-tip">只支持PDF/PNG/JPG，大小不超过10M（最多可上传9件）</div>
                        </el-upload>
                    </el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog" type="info" size="medium" round>取 消</el-button>
				<el-button @click="saveFn" type="warning" round size="medium">确认提交</el-button>
			</span>
		</el-dialog>
  	</div>
</template>

<script>
import UserService from '@/service/UserService'
import userManageService from '@/service/userManageService';
import ResourcesService from '@/service/ResourcesService'
export default {
	components:{},
  	name: "addRecordNew",
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
		},
		visitFilesOptins: {
			type: Array,
			default: []
		}
	},
	computed:{
        getIsPersonType(){
            if(this.form.customerType === 0) {
                return true // 个人拜访
            } else {
                return false // 非个人拜访
            }
            
        },
		// 行业
        getServiceContent(){
            let list = [
                {
                   customerType:'100',
                   visitStage:[1,2,3]
                },
                {
                   customerType:'0',
                   visitStage:[6]
                },
                {
                   customerType:'200',
                   visitStage:[7]
                },
                {
                   customerType:'300',
                   visitStage:[9]
                },
                {
                   customerType:'400',
                   visitStage:[8]
                },
            ]
            let {visitStage} = list.find(item=>item.customerType == this.form.customerType) ||{visitStage:[]}
            let serviceContent = []
             visitStage.filter(item=>{
                let obj = this.serviceContent.find(v1=>v1.code===item)
                if(obj) {
                    serviceContent.push(obj)
                }
            }) 
            return serviceContent
        },
    },
	data() {
		return {
			form: {
				orgCode:window.sessionStorage.getItem('branchCode'),
				orgName:window.sessionStorage.getItem('branchName'),
				areaCode:'',// (string, optional): 区县编码 ,
				areaName:'',// (string, optional): 区县名称 ,
				cityCode:'',// (string): 市编码 ,
				cityName:'',// (string): 市名称 ,
				provinceCode:'',// (string): 省份编码 ,
				provinceName:'',// (string): 省份名称 ,
				address:'',// 详细地址 ,
                companyName: '',    // 企业名称
				companyCode:'', // 企业编码
				contactorSex:'', // 男,女
                "periodParamList":[],   // 服务阶段及事由
				location: [],
				visitName: '',
				visitPhone: '',
				visitPost: '',
				visitDate: '',
				visitDuration: 0.5,
				content: '',
				visitMode: '',  // 拜访方式（1 上门拜访 2电话拜访,3 其他,4 邮寄,5 微信/QQ,6 电子邮件）
				visitModeName:'',
				visitSituation: '',
				fileInfoList:[],
                "id": '',
                "channel": "sequip",
                "createBy": "",// 创建人
                "createTime": "", 
                "updateBy": "",
                "updateTime": "",
                "customerType": "",  // 客户类型 0 个人客户 100 企业客户,200 行管客户 300 协会客户 400 保险公司
                "customerTypeName": "", // // 客户类型 0 个人客户 100 企业客户,200 行管客户 300 协会客户 400 保险公司
                "industry": '',
                "industryName": "",
                "level": '',
                "levelName": "",
                "operationType": "",
                "operationTypeName": "",
                "deptCode": '',
                "deptName": "",
                "visitDeptCode": "",    // 拜访对象所在部门
                "visitFileDesc": [], // 拜访资料
                "visitorInfoList": [
                    {
                        visitorCode: window.sessionStorage.getItem('userCode'),// (string, optional): 拜访人编码 ,
                        visitorName: window.sessionStorage.getItem('userName'),// (string, optional): 拜访人名称 ,
                        orgCode: window.sessionStorage.getItem('branchCode'),// (string, optional): 拜访人机构编码
                    }
                ]
            },
			UserService: new UserService(),
			userManageService: new userManageService(),
			ResourcesService: new ResourcesService(),
			dialogVisible: false,
			rules: {
				companyName:[
					{required: true, message: '请输入企业名称', trigger: 'blur'}
				],
				location:[ 
					{required: true, message: '请选择企业地址', trigger: 'change'}
				],
				
				address:[ 
                    { min:4,max: 500, message: '详细地址长度为4到500位', trigger: 'blur'},
				],
				visitName:[
					{required: true, message: '请输入联系人', trigger: 'blur'},
                    { min:1,max: 50, message: '长度为1到50位', trigger: 'blur'},
				],
                contactorSex:[ 
                    {required: true, message: '请选择', trigger: 'change'}
				],
                visitPost:[
                    {required: true, message: '请输入职务', trigger: 'blur'},
                    { min:1,max: 50, message: '长度为1到50位', trigger: 'blur'},
                ],
                visitPhone:[
                    {required: true, message: '请输入电话', trigger: 'blur'},
                    { min:1,max: 50, message: '长度为1到50位', trigger: 'blur'},
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
					{ min: 4, max: 3000, message: '长度在4到3000位', trigger: 'blur' }
				],
                
			},
			userList: [],
			restaurants: [],
			fileList: [],
			isAdd:true,
			title:'添加拜访记录',
			chooseVisitor:[],
			optionsVisitor:[],
			showVisitor:false,
			dealDateStartOptions:this.beginDate(),
		}
	},
	created() {},
	watch: {
	},
	methods: {
        initData(data) {
			this.fileList = [];
			if(data) {
				this.title = '修改拜访记录'
				this.isAdd = false;
				this.getDetailById(data);
			} else {
				this.chooseVisitor = [];
				this.title = '添加拜访记录'
				this.isAdd = true;
                this.getBusinessorData(window.sessionStorage.getItem('branchCode'))
			}
			this.dialogVisible = true;
		},
        async getDetailById(id) {
			let {code,data} = await this.userManageService.postCustomerVisitDetails(id);
			if(code == '0000') {
				this.chooseVisitor = data.visitorInfoList.map(item=>item.visitorCode);
				this.form = {...data,location:[data.provinceCode,data.cityCode,data.areaCode],fileInfoList:data.fileInfoList?[...data.fileInfoList]:[], "oldCustomerType":data.customerType,
                "oldCustomerTypeName":data.customerTypeName,}
				this.form.content = data.periodParamList.map(i => {
					let obj = [i.visitPeriod, i.visitCause];
                    return obj
				})
				this.getBusinessorData(data.orgCode)
				this.changeContent()
				if(data.fileInfoList && data.fileInfoList.length != 0) {
					data.fileInfoList.forEach(e => {
						e.name = e.name
						e.url = `${this.$apiUrl.COM_INDENT1}/res/v3/download?applicationName=sequip-svc&businessTypeCode=visit&businessDataTag=3604719494087575284&free=0&fileId=${e.url}`
						this.fileList.push(e)
					})
				}
			}
		},
        /**
         * 获取当前分支机构的人员
         */ 
        async getBusinessorData(jtBranchCode){
                // 获取全面营销人员
                let data = {
                    jtBranchCode: jtBranchCode,
                    hrPersonCategory: '',
                    pageSize: 10000,
                    pageNum: 1,
                }
                let res = await this.userManageService.getUserByNo(data)
                if(res.code == '0000') {
                    this.optionsVisitor = res.list.map(item=>{
                        let obj = {
                            ...item,
                            personDetails:`${item.userName}/${item.departmentName || ''}(${item.departmentCode||'--'})`
                        }
                        delete obj.systemAndRoleVOList
                        return obj
                    })
                } else {
                    this.optionsVisitor = [];
                }
        },
		beginDate(){
            let self = this
            return {
                disabledDate(time){
                    // let startDate = new Date();
                    return time.getTime() >  new Date()
                }
            }
        },
		async Upload(file){ // 图片上传
			const formData = new FormData();
			let data = [file.file]
			const res = await this.ResourcesService.uploadFile('sequip-svc','visit','0',data);
			if(res.code == '0000'){
				this.form.fileInfoList.push(
					{
						fileName:res.list[0].fileName,// (string, optional): 文件名称 ,
						name:res.list[0].fileName,// (string, optional): 文件名称 ,
						fileResId: res.list[0].fileId,// (integer, optional): 文件id
						resFileId: res.list[0].fileId,// (integer, optional): 文件id
                        size:'',
                        fileName:res.list[0].fileName,// (string, optional): 文件名称 ,
						resFileId: res.list[0].fileId,// (integer, optional): 文件id
					}
				);
				this.caseLogInserlog(res.list[0])
			}
		},
		// 记录图片上传日志
		async caseLogInserlog(data){
			let formObj = {"actionCode":'BFLB005',"remark":"上传拜访图片成功："+data.fileId,"operateResult":"success","channel":"sequip"}
			let res = await this.userManageService.caseLogInserlog(formObj);
		},
		beforeAvatarUpload(file) {
			let isLt10M = file.size / 1024 / 1024 < 10;
			if (!isLt10M) {
				this.$message.error('上传附件大小不能超过 10MB!');
			}
			return isLt10M;
		},
		beforeRemove(file, fileList) {
            console.log(file,'-*-*-*');
			if(file && file.status==="success"){
				if(this.$confirm(`确定移除 ${ file.name }？`)) {
					this.form.fileInfoList.splice(this.form.fileInfoList.findIndex(item => item.id== file.id),1)
				}
				return this.$confirm(`	 ${ file.name }？`);
			}
		},
		
		async choice(value){
            let list = [
                "customerType",
                "customerTypeName",
                "industry",
                "industryName",
                "level",
                "levelName",
                "operationType",
                "operationTypeName",
                "areaCode",
                "areaName",
                "cityCode",
                "cityName",
                "provinceCode",
                "provinceName",
                "address"
                ]
                let obj = this.restaurants.find(item =>item.customerName == value) || {}
                list.forEach(item=>{
                    this.form[item] = obj[item] || ''
                })
                this.form.companyCode = obj.customerId || '' 
                if(value && Object.keys(obj).length !== 0){
                    this.form.location = [obj.provinceCode,obj.cityCode,obj.areaCode]
                } else {
                    this.form.location = []
                }
		},
		saveFn() {
			this.$refs['form'].validate((valida) => {
				if (valida) {
                    this.addRecord();
				} else {
					return false;
				}
			})
		},
		async addRecord() {
            let formObj = {...this.form}
            if (formObj.id) {
                formObj.updateBy = window.sessionStorage.getItem('userName')
				formObj.customerType = formObj.oldCustomerType
                formObj.customerTypeName = formObj.oldCustomerTypeName
            } else {
                formObj.createBy = window.sessionStorage.getItem('userName')
            }
			if(formObj.customerType == 0) {
                formObj.companyName = formObj.visitName
                formObj.companyCode = formObj.visitPhone
            }
			let res = await this.userManageService.postCustomerVisitCreate(formObj);
			if(res.code == '0000') {
				this.$message({
					type: 'success',
					message: '成功!'
				});
				this.$emit('successCallback');
				this.closeDialog()
			}
		},
		closeDialog() {
			this.form = {
				orgCode:window.sessionStorage.getItem('branchCode'),
				orgName:window.sessionStorage.getItem('branchName'),
				areaCode:'',// (string, optional): 区县编码 ,
				areaName:'',// (string, optional): 区县名称 ,
				cityCode:'',// (string): 市编码 ,
				cityName:'',// (string): 市名称 ,
				provinceCode:'',// (string): 省份编码 ,
				provinceName:'',// (string): 省份名称 ,
				address:'',// 详细地址 ,
                companyName: '',    // 企业名称
				companyCode:'', // 企业编码
				contactorSex:'', // 男,女
                "periodParamList":[],   // 服务阶段及事由
				location: [],
				visitName: '',
				visitPhone: '',
				visitPost: '',
				visitDate: '',
				visitDuration: 0.5,
				content: '',
				visitMode: '',  // 拜访方式（1 上门拜访 2电话拜访,3 其他,4 邮寄,5 微信/QQ,6 电子邮件）
				visitModeName:'',
				visitSituation: '',
				fileInfoList:[],
                "id": '',
                "channel": "sequip",
                "createBy": "",// 创建人
                "createTime": "", 
                "updateBy": "",
                "updateTime": "",
                "customerType": "",  // 客户类型 0 个人客户 100 企业客户,200 行管客户 300 协会客户 400 保险公司
                "customerTypeName": "", // // 客户类型 0 个人客户 100 企业客户,200 行管客户 300 协会客户 400 保险公司
                "industry": '',
                "industryName": "",
                "level": '',
                "levelName": "",
                "operationType": "",
                "operationTypeName": "",
                "deptCode": '',
                "deptName": "",
                "visitDeptCode": "",    // 拜访对象所在部门
                "visitFileDesc": [], // 拜访资料
                "visitorInfoList": [
                    {
                        visitorCode: window.sessionStorage.getItem('userCode'),// (string, optional): 拜访人编码 ,
                        visitorName: window.sessionStorage.getItem('userName'),// (string, optional): 拜访人名称 ,
                        orgCode: window.sessionStorage.getItem('branchCode'),// (string, optional): 拜访人机构编码
                    }
                ]
            }
			this.dialogVisible = false;
			this.showVisitor = false;
		},
        // 查询用户
		async dataFilter(val){
			if(val){
				let data = {
					'customerName':val,
					'page':1,
					'pageSize':10,
					"customerType": this.form.customerType,    // 行管类型
                    "channel": "sequip",    // 安保或者特设（不用传，会根据sysCode取安保或特设）
				};
				let {code,data:{records,total}} = await this.userManageService.getCustomerManagementList(data)
				if(code == '0000'){
					this.restaurants = records;
				}
			}
		},
		
		// 处理服务阶段
		changeContent() {
			this.form.periodParamList = this.form.content.map(i => {
				let obj = {
					visitCause:"",// (integer): 服务事由 ,visitCause
					visitCauseName:"",// (string): 服务事由名称 ,visitCauseName
					visitPeriod:"",// (integer): 服务阶段 ,visitPeriod
					visitPeriodName:"",// (string): 服务阶段名称visitPeriodName
				}
				let {code,msg,group=[]} = this.serviceContent.find(item => item.code == i[0]) || '';
                let {msg: groupMsg, code: groupCode} = group.find(t => t.code == i[1]) || ''
                obj.visitPeriod = code;
                obj.visitPeriodName = msg;
                obj.visitCause = groupCode;
                obj.visitCauseName = groupMsg;
                return obj
			})
		},
		changevisitMode() {
			this.form.visitModeName = this.serviceMode.find(i => i.code == this.form.visitMode).msg;
		},
		
		changeVistor() {
			this.showVisitor = true;
		},
		visitorChange(e) {
			if(e.length > 3) {
				// 最多支持3人
				this.$message({
					type: 'error',
					message: '最多支持3人!'
				})
				this.chooseVisitor.splice(3)
			}
		},
		cancelVisitor() {
			this.chooseVisitor.length != 0 ? this.chooseVisitor = this.chooseVisitor : this.chooseVisitor = [];
			this.showVisitor = false;
		},
		confirmVisitor() {
			// this.form.visitorInfoList = [{
			// 	visitorCode: window.sessionStorage.getItem('userCode'),// (string, optional): 拜访人编码 ,
			// 	visitorName: window.sessionStorage.getItem('userName'),// (string, optional): 拜访人名称 ,
			// 	orgCode: window.sessionStorage.getItem('branchCode'),// (string, optional): 拜访人机构编码
			// }];
			this.form.visitorInfoList = this.chooseVisitor.map(i => {
                let {userCode,userName,branchCode,branchName,employeeNum,departmentCode,departmentName} = this.optionsVisitor.find(t => t.userCode == i) || {userCode:'',userName:'',branchCode:''}
				let obj = {
					visitorCode: userCode,
					visitorName: userName,
					orgCode: branchCode,
					orgName: branchName,
					jobNumber:employeeNum, //工号
					departCode:departmentCode, //部门编码
					departName:departmentName, //部门code
				};
				return obj
			})
			this.showVisitor = false;
		},
        handleChange(value){ // 选择省市区
			if(value !=''){
				var vals = this.getlable(this.form.location, this.area);
				this.form.provinceName = vals[0].label;
				this.form.cityName = vals[1].label;
				this.form.areaName = vals[2].label;
				this.form.provinceCode = vals[0].value;
				this.form.cityCode = vals[1].value;
				this.form.areaCode = vals[2].value;
			} else {
                this.form.provinceName = '';
				this.form.cityName = '';
				this.form.areaName = '';
				this.form.provinceCode = '';
				this.form.cityCode = '';
				this.form.areaCode = '';
            }
		},
        // 获取省市区
        getlable(val, opt){
            let list = val.map(function (value, index, array) {
                let obj = opt.find(item=>item.value == value)
                if(obj){
                    opt = obj.children;
                    return obj;
                } else {
                    return null;
                }
                
            });
            return list
        },
	},
}
</script>

<style lang='less'>
.addRecordNew {
    .item1{
        width: 210px;
        margin-right: 20px;
    }
    .item2{
        width: 250px;
    }
	.configDialog_dialog {
		min-width: 900px;
		// .el-textarea,.el-cascader {
		// 	width: 650px;
		// }
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
    .person-details {
        margin-left: 130px;
        width: 614px;
        border-radius: 5px;
        background-color: #FFF7E6;
        border: 1px solid #FFA940;
        box-sizing:box-sizing;
        padding:10px;
        margin-bottom:10px;
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
