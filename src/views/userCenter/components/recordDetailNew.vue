<template>
  	<div class="recordDetailNew">
		<el-dialog title="拜访记录详情" :visible.sync="dialogVisible" :close-on-click-modal="false" destroy-on-close custom-class="configDialog_dialog" @close="closeDialog">
			<div>
				<el-form :model="form" :inline="true" label-width="70px" label-position="left" class=" top-content">
					<p class="con-title">机构信息</p>
					<el-row class="mt10">
						<el-col :span="10">
							<el-form-item label="单位：">
								<span>{{form.orgName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="14">
							<el-form-item label="业务员：">
								<p>
									<span v-for="(item,index) in form.visitorInfoList" :key="index">{{item.visitorName}}<span v-if="index+1 != form.visitorInfoList.length">、</span></span>
								</p>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<el-form :model="form" :inline="true" size="medium" label-position="left" class="mt10">
					<p class="con-title">客户信息</p>
                    <el-row class="con-row" v-if="!getIsPersonType">
                        <el-col :span="12" class="con-col">
                            <span class="col-span-l">客户名称：</span>
                            <div class="col-span-r">
                                <el-tooltip effect="dark" :content="form.companyName" placement="top">
                                    <span>{{form.companyName }}</span>
                                </el-tooltip>
                            </div>
                        </el-col>
                        <el-col :span="12" class="con-col">
                            <span class="col-span-l">客户星级：</span>
                            <div class="col-span-r">
                                <el-tooltip effect="dark" :content="form.levelName" placement="top">
                                    <span>{{form.levelName }}</span>
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="con-row" v-if="!getIsPersonType">
                        <el-col :span="12" class="con-col">
                            <span class="col-span-l">证件号码：</span>
                            <div class="col-span-r">
                                <el-tooltip effect="dark" :content="form.companyCode" placement="top">
                                    <span>{{form.companyCode }}</span>
                                </el-tooltip>
                            </div>
                        </el-col>
                        <el-col :span="12" class="con-col">
                            <span class="col-span-l">客户地址：</span>
                            <div class="col-span-r">
                                <el-tooltip effect="dark" :content="getAreaName" placement="top">
                                    <span>{{getAreaName }}</span>
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="con-row" v-if="!getIsPersonType">
                        <el-col :span="12" class="con-col">
                            <span class="col-span-l">客户类型：</span>
                            <div class="col-span-r">
                                <el-tooltip effect="dark" :content="form.customerTypeName" placement="top">
                                    <span>{{form.customerTypeName }}</span>
                                </el-tooltip>
                            </div>
                        </el-col>
                        <el-col :span="12" class="con-col">
                            <span class="col-span-l">运营类型：</span>
                            <div class="col-span-r">
                                <el-tooltip effect="dark" :content="form.operationTypeName" placement="top">
                                    <span>{{form.operationTypeName }}</span>
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="con-row">
                        <el-col :span="24" class="con-col">
                            <span class="col-span">联系人：</span>
                            <span>{{form.visitName}}（职务：{{form.visitPost}}）</span>
                            <span class="col-span ml10">性别：</span>
                            <span>{{form.contactorSex}}</span>
                            <span class="col-span ml20">联系电话：</span>
                            <span>{{form.visitPhone}}</span>
                        </el-col>
                    </el-row>
                    <el-row class="con-row" v-if="getIsPersonType">
                        <el-col :span="24" class="con-col">
                            <span class="col-span-l">联系地址：</span>
                            <div class="col-span-r">
                                <el-tooltip effect="dark" :content="getAreaName" placement="top">
                                    <span>{{getAreaName }}</span>
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
				</el-form>
				<el-form :model="form" ref="form" :inline="true" size="medium" label-position="left" class="mt10">
					<p class="con-title">服务信息</p>
                     <el-row class="con-row">
                        <el-col :span="8" class="con-col">
                            <span class="col-span-l">服务时间：</span>
                            <div class="col-span-r">
                                <el-tooltip effect="dark" :content="form.visitDate" placement="top">
                                    <span>{{form.visitDate }}</span>
                                </el-tooltip>
                            </div>
                        </el-col>
                        <el-col :span="8" class="con-col">
                            <span class="col-span-l">服务时长：</span>
                            <div class="col-span-r">
                                <!-- <el-tooltip effect="dark" :content="form.visitDuration" placement="top"> -->
                                    <span>{{form.visitDuration }}</span>
                                <!-- </el-tooltip> -->
                            </div>
                        </el-col>
                        <el-col :span="8" class="con-col">
                            <span class="col-span-l">服务方式：</span>
                            <div class="col-span-r">
                                <el-tooltip effect="dark" :content="form.visitModeName" placement="top">
                                    <span>{{form.visitModeName }}</span>
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
                     <el-row class="con-row">
                        <el-col :span="8" class="con-col">
                            <span class="col-span-l">拜访次数：</span>
                            <div class="col-span-r">
                                <span class="cellRightBox">{{form.visitTimesDesc}}</span>
                            </div>
                        </el-col>
                        <el-col :span="16" class="con-col">
                            <span class="col-span-l">拜访资料：</span>
                            <div class="col-span-r">
                                <el-tooltip effect="dark" :content="getVisitFileDesc" placement="top">
                                    <span>{{getVisitFileDesc }}</span>
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
                     <el-row class="con-row">
                        <el-col :span="24" class="con-col">
                            <span class="col-span-l-2" >服务阶段/内容：</span>
                            <div class="col-span-r-2">
                                <el-tooltip effect="dark" :content="getPeriodParamList" placement="top">
                                    <span>{{getPeriodParamList}}</span>
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
                     <el-row class="con-row">
                        <el-col :span="8" class="con-col">
                            <span class="col-span-l">服务情况：</span>
                            <div class="col-span-r">
                                <el-tooltip effect="dark" :content="form.visitSituation" placement="top">
                                    <span>{{form.visitSituation}}</span>
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
                    <p class="con-title">上传附件(选填)</p>
					<el-row class="mt10">
						<el-col :span="24">
                            <p v-for="(item,index) in fileList" :key="index">
                                <i class="el-icon-document mr10"></i><span @click="downLoad(item.url)" class="cur-op">{{item.name}}</span>
                            </p>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-dialog>
  	</div>
</template>

<script>
import userManageService from '@/service/userManageService'
import ResourcesService from '@/service/ResourcesService'
export default {
	components:{},
  	name: "recordDetailNew",
    computed:{
        getAreaName(){
            return `${this.form.provinceName}/${this.form.cityName}/${this.form.areaName} ${this.form.address}`
        },
        getDepartment(){
            let str = `${this.form.businessorName}(${this.form.bizBranchCode || '--'})/${this.form.departmentName|| '--'}`
            return str
        },
        getPeriodParamList(){
            let list = this.form.periodParamList.map(item=>`${item.visitPeriodName}/${item.visitCauseName}`).join('、')
            return list
        },
        getVisitFileDesc(){
            let list = this.form.visitFileDesc?this.form.visitFileDesc.join('、'):''
            return list
        },
        getIsPersonType(){
            if(this.form.customerType == 0) {
                return true // 个人拜访
            } else {
                return false // 非个人拜访
            }
            
        },
    },
	data() {
		return {
			form: {
				orgCode:'',
				orgName:'',
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
                "visitorInfoList": []
            },
			userManageService: new userManageService(),
			ResourcesService: new ResourcesService(),
			dialogVisible: false,
			fileList: [],
		}
	},
	created() {},
	methods: {
		closeDialog() {
			this.dialogVisible = false;
		},
		async getDetailById(id) {
			let {code,data} = await this.userManageService.postCustomerVisitDetails(id);
			if(code == '0000') {
				this.form = {...data,location:[data.provinceCode,data.cityCode,data.areaCode],fileInfoList:data.fileInfoList?[...data.fileInfoList]:[]}
				if(data.fileInfoList && data.fileInfoList.length != 0) {
					data.fileInfoList.forEach(e => {
						e.name = e.name
						e.url = `${this.$apiUrl.COM_INDENT1}/res/v3/download?applicationName=sequip-svc&businessTypeCode=visit&businessDataTag=3604719494087575284&free=0&fileId=${e.url}`
						this.fileList.push(e)
					})
				}
			}
		},
		initData(data) {
			this.fileList = [];
			this.getDetailById(data);
			this.dialogVisible = true;
		},
		async downLoad(url,repeat) {
			let res = await this.ResourcesService.downloadOrViewFile(url,true);
            if(res.code == '9999' && !repeat){
                this.downLoad(url.replace('sequip-svc','safety-svc'),true)
            }
		}
	},
}
</script>

<style lang='less'>
.recordDetailNew {
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
    .con-row{
        color: #000;
        height: 40px;
        line-height: 40px;
        .con-col {
            height: 40px;
            line-height: 40px;
        }
        .col-span-l {
            width: 80px;
            height: 40px;
            line-height: 40px;
            display: inline-block;
            color: #919191;
            overflow:hidden;
        }
        .col-span-l-2 {
            width: 107px;
            height: 40px;
            line-height: 40px;
            display: inline-block;
            color: #919191;
            overflow:hidden;
        }
        .col-span {
            height: 40px;
            line-height: 40px;
            display: inline-block;
            color: #919191;
        }
        .see-button {
            padding: 0;
        }
        .color-0050B3 {
            color: #0050B3;
        }
        .color-FA8C16 {
            color: #FA8C16;
        }
        .col-span-r {
            height: 40px;
            line-height: 40px;
            display: inline-block;
            width: calc(100% - 100px);
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow:ellipsis;
        }
        .col-span-r-2 {
            height: 40px;
            line-height: 40px;
            display: inline-block;
            width: calc(100% - 140px);
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow:ellipsis;
        }
        .see-button {
            padding: 0;
        }
        .cellRightBox {
            display: inline-block;
            background-color: #1890FF;
            padding: 0px 10px;
            border-radius: 4px;
            margin-top:10px;
            height:30px;
            line-height:30px;
            color: #fff;
        }
    }
}
</style>
