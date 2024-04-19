<template>
	<div class="editDialog" id="editDialog">
        <el-dialog title="代理人不一致" :visible.sync="outerVisible" :before-close="close">
            <div class="content-dialog">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="130px" class="demo-ruleForm">
                    <el-table :data="showList" style="width: 100%;color:#000000;margin-top:10px;" border :header-cell-style="getRowClass1">
                        <el-table-column label="渠道代理人">
                            <template slot-scope="scope">
                                <span class="col-blue">{{scope.row.qdAgent}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="业管代理人">
                            <template slot-scope="scope">
                                <span class="col-red">{{scope.row.ygAgent}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <p class="mt10 mb20 col-black">代理人不一致：代表业管平台是<span class="col-gre">“全面营销业务”</span> ，但<span class="col-red">“代理人信息不一致”</span></p>
                    <el-form-item label="从业人员工号" prop="userNo">
                        <el-select v-model="ruleForm.userNo" placeholder="请选择从业人员工号" size="medium" clearable filterable>
							<el-option v-for="item in agents" :key="item.employeeNum" :label="item.showName" :value="item.employeeNum">
							</el-option>
						</el-select>
                    </el-form-item>
                </el-form>
                <div class="content1-dialog btn-right">
                    <el-button  class="item9 info" @click="close">取消</el-button>
                    <el-button  class="item9 warning" @click="submitEdit">确认提交</el-button>
                </div>
            </div>
        </el-dialog>
	</div>
</template>

<script>
import AchievementService from '@/service/AchievementService.js';
export default {
    props:{
		'agents':Array,
	},
	data() {
		return {
            data1:{},
			outerVisible:false,
            AchievementService: new AchievementService(),
            rules: {
                userNo: [
                    { required: true, message: '请选择从业人员工号', trigger: 'blur' },
                ],
            },
            showList:[],
            ruleForm:{
                userNo:''
            }
		}
	},
	created(){
	},
	methods: {
		initData(row) {
            this.data1 = row;
            let ygAgent = row.content ? JSON.parse(row.content) : null
            let obj = {
                qdAgent: row.userName + '(' + row.userNo + ')',
                ygAgent: ygAgent &&  ygAgent.agentName? ygAgent.agentName + '(' + ygAgent.agentCode + ')' : '--',
            }
            this.showList[0] = obj;
            this.outerVisible = true;
        },
		close(){
            this.$refs['ruleForm'].resetFields();
			this.outerVisible = false
		},
        getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #f7f7f7;color:#101010;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
        submitEdit() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) { 
                    this.submitFun();
                } else {
                    return false;
                }
            })
        },
        async submitFun() {
            console.log(this.ruleForm.userNo,this.data1.userNo);
            if(this.ruleForm.userNo == this.data1.userNo) {
                this.$message.error('代理人信息修改前后不能一致！');
                return
            }
            let agent = this.agents.find(i=> i.employeeNum == this.ruleForm.userNo);
            let params = {
                id: this.data1.id,
                userCode: agent ? agent.userCode : '',
                userName: agent ? agent.userName : '',
                userNo: this.ruleForm.userNo,
                branchCode: agent ? agent.branchCode : '',
                branchName: agent ? agent.branchName : '',
                channelCode: agent ? agent.channelCode : '',
            }
            let res = await this.AchievementService.postUpdataRecord(params);
            if(res.code == '0000') {
                this.$message.success('修改成功。');
                this.$refs['ruleForm'].resetFields();
                this.close();
                this.$emit('sucCallback',this.data1,params,true);
            } 
        }
	},
}

</script>

<style lang="less" scoped>
#editDialog {
	background-color: #f2f1ef;
    .el-dialog__body {
        padding: 10px 20px;
        color: #606266;
        font-size: 14px;
        word-break: break-all;
    }
	.content-dialog{
        margin-left: 3%;
		width: 94%;
		background-color: #ffffff;
        .col-black {
            color: #101010;
            font-weight: 600;
        }
        .col-blue {
            color: #096dd9;
        }
        .col-red {
            color: #f5222d;
        }
        .col-gre {
            color: #389e0d;
        }
		.content1-dialog{
			width: 100%;
			min-height: 40px;
			margin-bottom: 30px;
			color: #666666;
			.item1{
				height: 40px;
				line-height:40px;
				box-sizing: border-box;
                font-weight: 700;
                font-size: 14px;
                color: #101010;
			}
			.item2{
				font-size: 14px;
				color: #666666;
				.item3{
					margin-right: 10px;
				}
				.item4{
					color: #333333;
					font-weight: 500;
				}
				.item6{
					color: #333333;
					font-weight: 500;
				}
			}
			.item2 p{
				line-height: 40px;
			}
            .item5{
                margin-left: 10px;
                color: #FF3000;
                font-weight: 500;
            }
			.updataPremium {
                line-height: 40px;
                margin: 0 40px;
                margin-right: 0;
                padding-bottom: 20px;
                border-bottom:2px dashed #ccc;
                .updataPremium-title {
                    display: flex;
                    font-size: 16px;
                    font-weight: 700;
                    p:first-child{
                        width: 180px;   
                    }

                }
                .updataPremium-content {
                    p:first-child{
                        width: 180px;   
                    }
                }
			}
			.item9{
				width: 150px;
				height: 40px;
                margin-left: 40px;
                border-radius:30px;
            }
            .info {
                background-color: #F5F5F5;
                color: #000;
                border-color: #F5F5F5;
            }
            .warning {
                background-color: #FFA940;
                color: #fff;
                border-color: #FFA940;
            }
        }
        .btn-right {
            text-align: right;
            margin-top: 20px;
            margin-bottom: 0px;
        }
	}
}
</style>