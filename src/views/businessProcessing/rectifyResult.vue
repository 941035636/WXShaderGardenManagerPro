<template>
	<div class="rectifyResult" id="rectifyResult">
        <div class="fr mt20 mr40" v-if="$route.query.flag == '1' && data.status == '3'">
            <el-button type="primary" round size="medium" @click="editData">修  改</el-button>
        </div>
		<div class="content mt40">
			<div class="bg-org">
				<div v-if="data.antDatedReason" class="kua-qi">
					<p><span class="bold-title">跨期业务</span><span class="ml20">佐证原因：{{data.antDatedReason}}</span></p>
				</div>
			</div>
			<div class="policy-content">
				<div class="policy-title">基本信息</div>
				<div class="policy-con">
					<el-row type="flex" class="row-bg">
						<el-col :span="12">
                            <div style="display: flex;">
                                <span>投保人：</span>
                                <span class="text-right" >{{data.application}}</span>
                            </div>
                        </el-col>
					</el-row>
					<el-row type="flex" class="row-bg">
						<el-col :span="12"><div style="display: flex;">
							<span>冲正单类型：</span>
							<span class="text-right" v-if="data.type == '1'">保单</span>
							<span class="text-right" v-else>批单</span>
						</div></el-col>
						<el-col :span="12"><div style="display: flex;">
							<span>冲正单号：</span>
							<span class="text-right">{{data.applicationFormCode}}</span>
						</div></el-col>
					</el-row>
					<el-row type="flex" class="row-bg">
						<el-col :span="12">
                            <div style="display: flex;">
                                <span>申请人：</span>
                                <span class="text-right">{{data.applicationMan}} <span v-if="data.branchName">&nbsp;({{data.branchName}})</span></span>
						    </div>
                        </el-col>
						<el-col :span="12">
                            <div style="display: flex;">
                                <span>申请时间：</span>
                                <span class="text-right">{{data.applicationDate}}</span>
                            </div>
                        </el-col>
					</el-row>
					<el-row type="flex" class="row-bg">
						<el-col :span="12">
                            <div style="display: flex;">
                                <span>审核状态：</span>
                                <span class="text-right" v-if="data.status == '1'">待审核</span>
                                <span class="text-right" v-if="data.status == '3'">审核失败</span>
                                <span class="text-right" v-if="data.status == '4'">审核通过</span>
                            </div>
                        </el-col>
					</el-row>
                    <el-row type="flex" class="row-bg" v-if="data.status != '1'">
						<el-col :span="12">
                            <div style="display: flex;">
                                <span>审核人：</span>
                                <span class="text-right">{{data.reviewed}}</span>
                            </div>
                        </el-col>
                        <div style="display: flex;">
                                <span>审核时间：</span>
                                <span class="text-right">{{data.auditTime}}</span>
                            </div>
					</el-row>
				</div>
			</div>
            <div class="policy-content">
				<div class="policy-title">冲正信息</div>
				<div class="policy-con">
					<el-row type="flex" class="row-bg">
						<el-col :span="12">
                            <div style="display: flex;">
                                <span>冲正类型：</span>
                                <span class="text-right" >{{data.recTypeName}} 
                                    <span class="col-blue" v-if="data.resultType == '1'">(待冲正)</span>
                                    <span class="col-blue" v-if="data.resultType == '2'">(冲正成功)</span>
                                    <span class="col-blue" v-if="data.resultType == '3'">(冲正失败)</span>
                                    <el-tooltip :content="data.pushResp" placement="top" v-if="data.resultType == '3' && data.pushResp">
                                        <i class="el-icon-question col-orange f18"></i>
                                    </el-tooltip>
                                </span>
                            </div>
                        </el-col>
					</el-row>
                    <el-table :data="data.editInfo" style="width: 70%" border class="mt20" :header-cell-style="getRowClass">
                        <el-table-column label="字段名称" prop="label"></el-table-column>
                        <el-table-column label="原信息" prop="code"></el-table-column>
                        <el-table-column label="冲正后">
							<template slot-scope="scope">
								<span v-if="scope.row.newName">{{scope.row.newName == '无' ? '是否全面营销：否' : '是否全面营销：是，营销人员：' + scope.row.newName}}</span>
								<span v-else>{{scope.row.newCode}}</span>
							</template>
						</el-table-column>
                    </el-table>
				</div>
			</div>
            <div class="policy-content">
				<div class="policy-title">审核操作</div>
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm" v-if="$route.query.flag == '2' && form.nodeId">
                    <el-form-item label="审核状态" prop="status">
                        <el-radio v-model="form.status" :label="item.statusCode" v-for="item in nodeOperRespList" :key="item.name">{{item.name}}</el-radio>
                    </el-form-item>
                    <el-form-item label="审核建议">
                        <el-input type="textarea" :rows="3" placeholder="审核建议" style="width: 60%" v-model="form.comment"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('form')" :disabled="!disabledFlag">确认提交</el-button>
                    </el-form-item>
                </el-form>
				<div class="policy-con border-bottom" v-for="item in data.recResult" :key="item.id">
					<el-row type="flex" class="row-bg">
                        <el-col :span="8">
                            <div style="display: flex;">
                                <span class="text-right">{{item.appDate}}</span>
                            </div>
                        </el-col>
						<el-col :span="8"><div style="display: flex;">
							<!-- <span>结果：</span> -->
							<span class="col-green" v-if="item.approveResult == '同意'">{{item.approveResult}}</span>
							<span class="col-red" v-else>{{item.approveResult}}</span>
						</div></el-col>
						<el-col :span="8">
                            <div style="display: flex;">
                                <span>操作人：</span>
                                <span class="text-right">{{item.userName}}</span>
						    </div>
                        </el-col>
                        <el-col :span="8">
                        </el-col>
					</el-row>
					<el-row type="flex" class="row-bg" v-if="item.approveContent">
						<el-col :span="24">
                            <div style="display: flex;">
                                <!-- <span>审核意见：</span> -->
                                <span class="text-right" >{{item.approveContent}}</span>
                            </div>
                        </el-col>
					</el-row>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from 'moment'
import ProductService from '../../service/ProductService.js';
import UserService from '../../service/UserService.js';
import CorrectionManagement from '../../service/CorrectionManagement.js';
import mechanismCode from '../businessProcessing/data/mechanismCode.json';
export default {
	data() {
		return {
            recId:'',
			ProductService:new ProductService(),
            UserService:new UserService(),
            CorrectionManagement: new CorrectionManagement(),
			data:{
                application:'',
                type:'',
                pushResp:'',
                applicationFormCode:'',
                applicationMan:'',
                applicationDate:'',
                status:'',
                recType:'',
                recTypeName:'',
                resultType:'',
                branchName:'',
                editInfo:[],
				recResult:[],
				antDatedReason:''//跨期原因
            },
            nodeOperRespList:[],
            form: {
                "channel": "sequip",
                "comment": "",
                "nodeId": '',
                "status": ''
            },
            rules:{
                status: [
                    { required: true, message: '请选择审核状态', trigger: 'change' }
                ]
            },
            resToken:'',
            disabledFlag:true,  // 防止用户重复点击
			proofList:[
				{
					label:"委托协议签署流程延迟",
					value:"01"
				},
				{
					label:"框架协议/保险协议签署流程延迟",
					value:"02"
				},
				{
					label:"佣金比例确认延迟",
					value:"03"
				},
				{
					label:"保单/批单实际出具延迟",
					value:"04"
				},
				{
					label:"冲正调整重新确认数据",
					value:"05"
				},
				{
					label:"补录确认",
					value:"06"
				},
				{
					label:"承保清单提供延迟",
					value:"07"
				},
				{
					label:"其他",
					value:"08"
				},
				{
					label:"无法提供佐证原因",
					value:"12"
				},
			],
		}
	},
	computed:{
       
	},
	mounted() {
		
	},
	created(){
        this.recId = this.$route.query.id;
		if(this.$route.query.flag == '2') {
            this.getOption(this.recId);
            this.getResubToken();
        }
        this.getRectifyById(this.recId);
        this.getHistory(this.recId);
	},
	methods: {
        //获取防止刷新的header数据
        async getResubToken() {
           this.resToken = await this.UserService.getResToken() 
        },
        //审核退回 修改按钮
        editData() {
            this.$router.push({
                path: "/rectifyApplication",
                query:{
                    id:this.recId
                }
            });
        },
        //根据id获取冲正详情
        async getRectifyById(id) {
            let res = await this.CorrectionManagement.getDetail(id);
            if(res.code == '0000') {
                this.data.antDatedReason = this.proofList.find(item => item.value == res.data.antDatedReason) ? this.proofList.find(item => item.value == res.data.antDatedReason).label : '' ;
                this.data.application = res.data.policyHolder;
                this.data.type = res.data.orderType;
                this.data.pushResp = res.data.pushResp;
                this.data.applicationFormCode = res.data.correctNo;
                this.data.applicationMan = res.data.createByName;//'张三（广东分公司）';
                this.data.applicationDate = moment(new Date(res.data.createTime)).format('YYYY-MM-DD HH:mm:ss');
                this.data.status = res.data.approveStatus;
                this.data.recType =  res.data.correctType;
                this.data.recTypeName = res.data.correctType == '1' ? '一般性冲正' : res.data.correctType == '2' ? '保费冲正' : res.data.correctType == '3' ? '保单删除' : '全面营销信息';
                this.data.resultType = res.data.correctStatus;
                this.data.editInfo = JSON.parse(res.data.correctContent);
                this.data.branchName = mechanismCode.data.find(item => item.branchCode == res.data.branchCode) ? mechanismCode.data.find(item => item.branchCode == res.data.branchCode).branchName :'';
                this.data.reviewed = res.data.history ? res.data.history.userName : ''
                this.data.auditTime = res.data.history ? moment(new Date(res.data.history.createTime)).format('YYYY-MM-DD HH:mm:ss') : ''; 
            }
        },
        //获取操作按钮
        async getOption(id) {
            let res = await this.CorrectionManagement.getOptionData(id);
            if(res.code == '0000') {
                this.form.nodeId = res.data.nodeId;
                this.nodeOperRespList = res.data.nodeOperRespList;
            }
        },
        //获取审核历史记录
        async getHistory(id) {
            let res = await this.CorrectionManagement.getHistoryData(id);
            if(res.code == '0000') {
                res.data.forEach(element => {
                    element.appDate = moment(new Date(element.createTime)).format('YYYY-MM-DD HH:mm:ss');
                });
                this.data.recResult = res.data;
            }
        },
		 //修改表头样式
        getRowClass({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            if (rowIndex == 0) {
                // return 'background: #fefbf1;border-bottom:1px solid #f0dfbf;color:#cda160;font-size:16px;font-weight:500;';
                return 'background: #f7f7f7;color:#101010;font-size:16px;font-weight:500;';
            } else {
                return 'background: #fff';
            }
        },
        //提交审核 -》 校验
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.form.status == 2 && !this.form.comment) {
                        this.$message({message: '请填写审核建议', type: 'error'});
                    } else if(this.form.comment.length > 100) {
                        this.$message({message: '审核建议(1-100位)', type: 'error'});
                    }else {
                        this.submitFun();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //提交审核 = 函数
        async submitFun() {
            let res = await this.CorrectionManagement.postVerification(this.form,{"headers":{"X-RESUB-TOKEN":this.resToken}},{correctNo:this.data.applicationFormCode,recTypeName:this.data.recTypeName,});
			if(res.code == '0000') {
                this.$message({message: '操作成功', type: 'success'});
                this.disabledFlag = true;
                this.$router.push({
                    path: "/rectifyResult",
                    query:{
                        flag:'1',
                        id:this.recId
                    }
                });
            } else {
                await this.getHistory(this.recId);
                await this.getResubToken();
                this.disabledFlag = false;
            }
        }
			
	},
}

</script>

<style lang="less">
#rectifyResult{
	margin: 24px;
	padding-bottom: 80px;
	.bg-org {
		background-color: #fffaea;
		margin: 5px 40px 5px 0px;
		.kua-qi {
			padding: 20px 40px;
			.bold-title {
				color: #101010;
				font-weight: 600;
				display: inline-block;
				width: 80px;
			}
		}
	}
	.title{
		width: 100%;
		height: 40px;
		line-height: 40px;
		color: #535F7A;
		font-size: 20px;
		position: relative;
		.download-policy{
			display: block;
			width: 120px;
			height: 40px;
			border: 1px solid #213593;
			text-align: center;
			color: #213593;
			box-sizing: border-box;
			font-size: 16px;
			position: absolute;
			right: 0;
			top: 0;
			cursor: pointer;
		}
    }
    .mt40 {
        margin-top: 40px;
    }
    .mr40 {
        margin-right: 40px;
    }
	.content{
		width: 100%;
		min-height: 1332px;
		padding: 40px 32px 32px;
		margin-top: 24px;
		box-sizing: border-box;
		background-color: #fff;
        border-radius: 14px;
		.order-content{
			width: 100%;
			height: 40px;
			line-height: 40px;
			color: #181E2D;
			font-size: 16px;
			padding: 10px 0;
			border-bottom: 1px solid #ccc;
			span{
				margin-right: 40px;
			}
		}
		.policy-content{
			padding-bottom: 20px;
			.policy-title{
				width: 100%;
				box-sizing: border-box;
				line-height: 22px;
				height: 22px;
				margin: 30px 0;
				color: #000000;
				font-size: 18px;
				font-weight: 700;
				padding-left: 24px;
				border-left: 4px solid #273989;
            }
            .demo-ruleForm {
                margin-bottom: 40px;
            }
			.policy-con{
				// padding-left: 24px;
				margin: 0 28px;
				.text-title{
					font-size: 16px;
					color: #000;
					font-weight: 700;
				}
            }
            .border-bottom {
                padding-bottom: 20px;
                border-bottom:1px solid #ccc ;
            }
			.border-top{
				border-top:1px solid #ccc ;
			}
			.row-bg{
				margin-top:18px;
				.item3{
					display: block;
					width: 35%;
					padding-left: 50px;
					box-sizing: border-box;
				}
				.item4{
					display: block;
					width: calc(65% - 60px);
					vertical-align:middle;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;

				}
				
			}
			.personnel-list{
				width: 100%;
				min-height: 200px;
				padding: 24px;
				box-sizing: border-box;
				position: relative;
				// height: 50px;
				.content-total{
					width: 100%;
					text-align: right;
					position: absolute;
					bottom: 4px;
					right: 24px;
				}
			}
		}
		.policy-tit{
				width: 100%;
				box-sizing: border-box;
				line-height: 20px;
				height: 20px;
				margin: 40px 0;
				color: #000000;
				font-size: 14px;
				padding-left: 24px;
				border-left: 4px solid #273989;
			}
		.policyholder-content{
			width: 100%;
			display: flex;
			
			.holder-content{
				width: 50%;
				min-height: 352px;
				box-sizing: border-box;
				margin-top: 20px;
				font-size: 16px;
				color: #181E2D;
				.policy-title{
					width: 100%;
					height: 56px;
					background-color: #F1F4F9;
					border-bottom: 1px solid #D2D2D2;
					padding-left: 24px;
					box-sizing: border-box;
					line-height: 56px;
					color: #535F7A;
					font-size: 14px;
					span{
						float: right;
						margin-right: 16px;
					}
				}
				.row-bg{
					margin-top:18px;
					width: 100%;
					.item3{
						display: block;
						width: 35%;
						padding-left: 50px;
						box-sizing: border-box;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.item4{
						display: block;
						width: calc(65% - 60px);
						vertical-align:middle;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					
					.item5{
						width: calc(65% - 60px);
						.item6{
							display: block;
							width: 70%;
						}
						.item7{
							display: block;
							width: 27%;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
					}
				}
				.personnel-list{
					width: 100%;
					min-height: 300px;
					padding: 24px;
					box-sizing: border-box;
					position: relative;
					.content-total{
						width: 100%;
						text-align: right;
						position: absolute;
						bottom: -24px;
						right: 24px;
					}
				}
			}
		}
		.closes{
			width: 100%;
			margin-top: 32px;
			text-align: center;
			span{
				display: inline-block;
				width: 120px;
				height: 48px;
				border: 1px solid #213593;
				text-align: center;
				line-height: 48px;
				font-size: 16px;
				color: #213593;
				border-radius:6px;
				box-sizing: border-box;
				cursor: pointer;
			}
		}
	}
}
.mglet5{
	margin-left:5px;
	vertical-align:middle;
}
.text-right{
	color: #000;
}
.col-green {
    color: #009688;
}
.col-red {
    color: #f5222d;
}
.col-blue {
    color: #1890ff;
}
.col-orange {
    color: #ffa940;
}
</style>
