<template>
  	<div class="recordDetailDialog">
		<el-dialog title="营销记录详情" :visible.sync="dialogVisible" :close-on-click-modal=false destroy-on-close custom-class="configDialog_dialog" @close="closeDialog">
			<div>
				<el-form :model="form" :inline="true" label-width="70px" label-position="left" class="border-bottom top-content">
					<p class="con-title">机构信息</p>
					<el-row class="mt10">
						<el-col :span="10">
							<el-form-item label="单位：">
								<span>{{form.orgName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="14">
							<el-form-item label="营销员：">
								<p>
									<span v-for="(item,index) in form.visitors" :key="index">{{item.name}}<span v-if="index+1 != form.visitors.length">、</span></span>
								</p>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<el-form :model="form" :inline="true" size="medium" label-position="left" class="border-bottom mt10">
					<p class="con-title">企业信息</p>
					<el-row class="mt10">
						<el-col :span="24">
							<el-form-item label="企业名称：">
								<span>{{form.companyName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="企业地址：">
								<span>{{form.provinceName}}/{{form.cityName}}/{{form.areaName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="联系人：">
								<span>{{form.visitName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="联系电话：">
								<span>{{form.visitPhone}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="职务：">
								<span>{{form.visitPost}}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<el-form :model="form" ref="form" :inline="true" size="medium" label-position="left" class="mt10">
					<p class="con-title">营销信息</p>
					<el-row class="mt10">
						<el-col :span="12">
							<el-form-item label="服务时间：">
								<span>{{form.visitDate}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="服务时长：">
								<span>{{form.visitDuration}}小时</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="服务阶段/内容：">
								<span v-for="(item,t) in form.periodParams" :key="t">{{item.visitPeriodName}}/{{item.visitCauseName}}<span v-if="form.periodParams.length != t + 1">、</span></span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="服务方式：">
								<span>{{form.visitModeName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="跟进结果描述：">
								<p>{{form.visitSituation}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="上传附件(选填)：">
								<p v-for="(item,index) in fileList" :key="index">
									<i class="el-icon-document mr10"></i><span @click="downLoad(item.url)" class="cur-op">{{item.name}}</span>
								</p>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-dialog>
  	</div>
</template>

<script>
import {elevator} from '../../../server/accidenServer.js'
import UserService from '../../../service/UserService'
import PolicyentryService from '../../../service/PolicyentryService'
import ResourcesService from '../../../service/ResourcesService'
export default {
	components:{
	},
  	name: "recordDetailDialog",
	props: {
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
			userList: [],
			restaurants: [],
			fileList: [],
			chooseVisitor:[],
			optionsVisitor:[],
		}
	},
	created() {
		
	},
	methods: {
		closeDialog() {
			this.dialogVisible = false;
		},
		async getDetailById(id) {
			let res = await this.UserService.getRecordDetail({id:id});
			if(res.code == '0000') {
				this.form = {
					id:res.data.id,
					orgCode:window.sessionStorage.getItem('branchCode'),
					orgName:window.sessionStorage.getItem('branchName'),
					areaCode:res.data.areaCode,// (string, optional): 区县编码 ,
					areaName:res.data.areaName,// (string, optional): 区县名称 ,
					cityCode:res.data.cityCode,// (string): 市编码 ,
					cityName:res.data.cityName,// (string): 市名称 ,
					provinceCode:res.data.provinceCode,// (string): 省份编码 ,
					provinceName:res.data.provinceName,// (string): 省份名称 ,
					type: 1,// (integer): 拜访类型(1企业拜访 2行管拜访 3 个人拜访) ,
					periodParams:res.data.visitPeriods,
					companyName: res.data.companyName,
					companyCode:res.data.companyCode,
					location: [res.data.provinceCode,res.data.cityCode,res.data.areaCode],
					visitName: res.data.visitName,
					visitPhone: res.data.visitPhone,
					visitPost: res.data.visitPost,
					visitDate: res.data.visitDate,
					visitDuration: res.data.visitDuration,
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
					this.form.visitors.push(obj);
				})
				res.data.fileRels.forEach(e => {
					e.name = e.fileName
					e.url = this.$apiUrl.COM_INDENT1+e.url
					this.fileList.push(e)
				})
			}
		},
		initData(data) {
			this.fileList = [];
			this.getDetailById(data);
			this.dialogVisible = true;
		},
		async downLoad(url) {
			let res = await this.ResourcesService.downloadOrViewFile(url,true);
		}
	},
}
</script>

<style lang='less'>
.recordDetailDialog {
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
	.cur-op {
		cursor: pointer;
	}
}
</style>
