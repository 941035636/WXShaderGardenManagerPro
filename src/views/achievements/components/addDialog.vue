<template>
	<div class="addDialog" id="addDialog">
        <el-dialog title="批量添加" :visible.sync="outerVisible">
            <div class="content-dialog">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="发放月份" prop="mouth">
                        <el-date-picker v-model="ruleForm.mouth" type="month" value-format="yyyy-MM" placeholder="请选择年月" size="medium" class="item1"></el-date-picker>
                    </el-form-item>
                    <p>
                        <el-button type="primary" size="medium" @click="addAI">智能识别</el-button>
                        <el-button type="primary" size="medium" class="ml10" @click="addSigin">添加记录</el-button>
                        <span class="ml20">已添加 {{recordList.length}} 条记录</span>
                        <span class="fr col-red cur-op" @click="handleDelete(null)"><i class="el-icon-delete mr5"></i>全部删除</span>
                    </p>
                    <el-table :data="recordList" style="width: 100%;color:#000000;margin-top:10px;" border :header-cell-style="getRowClass1">
                        <el-table-column label="序号" type="index" width="50"></el-table-column>
                        <el-table-column label="从业人员工号"  prop="userNo" width="200"></el-table-column>
                        <el-table-column label="类型" width="90">
                            <template slot-scope="scope">
                                <span v-if="scope.row.policyNo">保单</span>
                                <span v-if="scope.row.endorseNo">批单</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="保单号/批单号">
                            <template slot-scope="scope">
                                <span v-if="scope.row.policyNo">{{scope.row.policyNo}}</span>
                                <span v-if="scope.row.endorseNo">{{scope.row.endorseNo}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="180">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" class="col-blue" @click="editRecord(scope.row,scope.$index)">修改</el-button>
                                <span class="col-blue">|</span>
                                <el-button size="mini" type="text" class="col-blue" @click="handleDelete(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
                <div class="content1-dialog btn-right">
                    <el-button  class="item9 info" @click="close">取消</el-button>
                    <el-button  class="item9 warning" @click="submitForm">确认提交</el-button>
                </div>
            </div>
            <el-dialog :title="defaultText" :visible.sync="dialogVisible"  width="40%" append-to-body :before-close="closeDialogVisible">
                <el-form :model="ruleFormAdd" :rules="rules" ref="ruleFormAdd" label-width="160px" class="demo-ruleForm">
                    <el-form-item label="从业人员工号" prop="userNo">
                        <el-select v-model="ruleFormAdd.userNo" placeholder="请选择从业人员工号" size="medium" class="w80" clearable filterable>
							<el-option v-for="item in agents" :key="item.employeeNum" :label="item.showName" :value="item.employeeNum">
							</el-option>
						</el-select>
                    </el-form-item>
                    <el-form-item label="类型" required>
                        <el-radio-group v-model="radio" @change="clearData">
                            <el-radio :label="1">保单</el-radio>
                            <el-radio :label="2">批单</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="保单号" prop="policyNo" v-if="radio == 1">
                        <el-input v-model.trim="ruleFormAdd.policyNo" placeholder="请输入保单号" class="w80"></el-input>
                    </el-form-item>
                    <el-form-item label="批单号" prop="endorseNo" v-if="radio == 2">
                        <el-input v-model.trim="ruleFormAdd.endorseNo" placeholder="请输入批单号" class="w80"></el-input>
                    </el-form-item>
                    <el-form-item label-width="55px">
                        <p class="col-red" v-if="tipAgain"><i class="el-icon-warning f16 mr10"></i> 已存在 {{ruleFormAdd.policyNo ? ruleFormAdd.policyNo : ruleFormAdd.endorseNo}} 记录，请确认</p>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button class="item9 info"  @click="closeDialogVisible">取 消</el-button>
                    <el-button class="item9 warning" @click="singleAdd">确定提交</el-button>
                </span>
            </el-dialog>
            <el-dialog title="智能识别" :visible.sync="dialogVisibleAI"  width="40%" append-to-body class="add-dialog">
                <p class="col-org">规则：每行一条记录，“工号、保单/批单、保单号/批单号” 中间用逗号、空格隔开</p>
                <p class="col-org">例如：jt0000123 保单 BD452343555555</p>
                <el-input type="textarea" :rows="5" placeholder="请输入" v-model="textarea" class="mt10"></el-input>
                <p class="col-red mt10" v-if="tipExit"><i class="el-icon-warning f16 mr10"></i> 工号校验：{{textExit.join('、')}}，未查询到代理人</p>
                <p class="col-red mt10" v-if="tipAgain"><i class="el-icon-warning f16 mr10"></i> 重复校验：{{textAgain.join('、')}}，存在重复记录</p>
                <span slot="footer" class="dialog-footer">
                    <el-button class="item9 info" @click="dialogVisibleAI = false">取 消</el-button>
                    <el-button class="item9 warning" @click="submitAI">确定提交</el-button>
                </span>
            </el-dialog>
        </el-dialog>
	</div>
</template>

<script>
import moment from 'moment'
import AchievementService from '@/service/AchievementService.js';
export default {
    props:{
		'agents':Array,
	},
	data() {
        var checkPolicyNo = (rule, value, callback) => {
			var reg = /^[\w_-\u4e00-\u9fa5]+$/;
			if (!value) {
				return callback(new Error("请输入保单号/批单号"));
			} else if (value.length > 40) {
				callback(new Error("请输入1到40位字母、数字、中横线、下划线的保单号/批单号"));
			}else if (!reg.test(value)) {
				callback(new Error("请输入1到40位字母、数字、中横线、下划线的保单号/批单号"));
			} else {
				callback();
			}
		};
		return {
            radio: 1,
			ruleForm:{
                mouth:'',
                list:[]
            },
            ruleFormAdd:{
                userNo:'',
                policyNo:'',
                userName:'',
                userCode:'',
                channelCode:'',
                branchCode:'',
                branchName:'',
                endorseNo:'',
                policyOrgCode: window.sessionStorage.getItem('branchCode'),
                policyOrgName: window.sessionStorage.getItem('branchName')
            },
            outerVisible:false,
			dialogVisible:false,
			dialogVisibleAI:false,
            rules: {
                mouth: [
                    { required: true, message: '请选择年月', trigger: 'change,blur' },
                ],
                userNo: [
                    { required: true, message: '请选择从业人员工号', trigger: 'blur' },
                ],
                policyNo: [
                    { required: true, validator: checkPolicyNo, trigger: 'blur' },
                ],
                endorseNo: [
                    { required: true, validator: checkPolicyNo, trigger: 'blur' },
                ],
            },
            recordList:[],
            textarea:'',
            tipAgain: false,
            textAgain: [],
            tipExit: false,
            textExit: [],
            AchievementService: new AchievementService(),
            defaultText:'添加记录',
            editIndex:0,
		}
	},
	created(){
	},
	methods: {
        clearData() {
            this.ruleFormAdd.policyNo = ''
            this.ruleFormAdd.endorseNo = ''
        },
		initData() {
            this.textarea = '';
            this.recordList = [];
            this.ruleForm = {
                mouth:'',
                list:[]
            };
            this.ruleFormAdd = {
                userNo:'',
                policyNo:'',
                userName:'',
                userCode:'',
                channelCode:'',
                branchCode:'',
                branchName:'',
                endorseNo:'',
                policyOrgCode: window.sessionStorage.getItem('branchCode'),
                policyOrgName: window.sessionStorage.getItem('branchName')
            };
            this.outerVisible = true
        },
		close(){
			this.outerVisible = false
		},
        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    if(this.recordList.length != 0) {
                        this.recordList.forEach(item => {
                            item.issueMonth = this.ruleForm.mouth;
                        })
                        this.submitFormFun();
                    } else {
                        this.$message.warning('请添加记录。');
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async submitFormFun() {
            let res = await this.AchievementService.postRecord(this.recordList);
            if(res.code == '0000') {
                let msg = [];
                this.recordList.forEach(i => {
                    let item = '营销员工号：' + i.userNo + ',保单/批单号：' + (i.policyNo ? i.policyNo : i.endorseNo);
                    msg.push(item)
                })
                console.log(msg)
                this.$logger.info(
					'M9-001','',
					{
						'total':this.recordList.length,
						'recordMsg':msg.join(',')
                    }
				);
                this.$message.success('新增成功。');
                this.$emit('successCallback');
                this.close();
            }
        },
        getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #f7f7f7;color:#101010;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
        editRecord(row,index) {
            this.ruleFormAdd = JSON.parse(JSON.stringify(row));
            this.radio = this.ruleFormAdd.policyNo ? 1 : 2;
            this.editIndex = index + 1;
            this.defaultText = '修改记录';
            this.dialogVisible = true;
        },
        handleDelete(index) {
            let text = '';
            if(index == 0 || index) {
                text = '是否删除当前记录?'
            } else {
                text = '是否删除全部记录?'
            }
            this.$confirm(text, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(index == 0 || index) {
                    this.recordList.splice(index,1);
                } else {
                    this.recordList = [];
                }
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
        addAI() {
            this.textarea = '';
            this.dialogVisibleAI = true;
        },
        addSigin() {
            this.defaultText = '添加记录';
            this.dialogVisible = true;
        },
        closeDialogVisible() {
            this.editIndex = 0;
            this.ruleFormAdd = {
                userNo:'',
                policyNo:'',
                userName:'',
                userCode:'',
                channelCode:'',
                branchCode:'',
                branchName:'',
                endorseNo:'',
                policyOrgCode: window.sessionStorage.getItem('branchCode'),
                policyOrgName: window.sessionStorage.getItem('branchName')
            };
            this.dialogVisible = false;
        },
        singleAdd() {
            this.$refs['ruleFormAdd'].validate((valid) => {
                if (valid) {
                    if(this.recordList.find((i,index) => (i.policyNo &&i.policyNo == this.ruleFormAdd.policyNo && index != this.editIndex - 1 ) || (i.endorseNo &&i.endorseNo == this.ruleFormAdd.endorseNo && index != this.editIndex - 1))) {
                        this.tipAgain = true;
                    } else {
                        let obj = JSON.parse(JSON.stringify(this.ruleFormAdd))
                        obj.userName = this.agents.find(i => i.employeeNum == obj.userNo) ? this.agents.find(i => i.employeeNum == obj.userNo).userName : '';
                        obj.userCode = this.agents.find(i => i.employeeNum == obj.userNo) ? this.agents.find(i => i.employeeNum == obj.userNo).userCode : '';
                        obj.channelCode = this.agents.find(i => i.employeeNum == obj.userNo) ? this.agents.find(i => i.employeeNum == obj.userNo).channelCode : '';
                        obj.branchCode = this.agents.find(i => i.employeeNum == obj.userNo) ? this.agents.find(i => i.employeeNum == obj.userNo).branchCode : '';
                        obj.branchName = this.agents.find(i => i.employeeNum == obj.userNo) ? this.agents.find(i => i.employeeNum == obj.userNo).branchName : '';
                        obj.policyOrgCode = window.sessionStorage.getItem('branchCode');
                        obj.policyOrgName = window.sessionStorage.getItem('branchName');
                        this.tipAgain = false;
                        console.log(this.editIndex)
                        if(this.editIndex) {
                            this.recordList.splice(this.editIndex - 1,1,obj);
                        } else {
                            this.recordList.push(obj);
                        } 
                        this.closeDialogVisible();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        submitAI() {
            if(!this.textarea) {
                this.$message.warning('请输入智能识别内容。');
                return
            }
            let arrRecord = [];
            this.textAgain = [];
            this.textExit = [];
            let msg = [];
            let arrData = this.textarea.trim().split(/\n/)
            arrData.forEach(item =>{
                let flag = item.indexOf(',') != -1 ? ',' : item.indexOf(' ') != -1 ? ' ' : item.indexOf('、') != -1 ? '、' : ' ';
                if(item.trim() && /\S/.test(item)){
                    let single = item.trim().split(flag)
                    let polNo = '',pDNo = '';
                    single.forEach( t => {
                        if(single.findIndex(e => e == '保单' ) != -1 && t != single[0] && t != flag && t != '保单') {
                            polNo = t;
                        } 
                        if(single.findIndex(e => e == '批单' ) != -1 && t != single[0] && t != flag && t != '批单') {
                            pDNo = t;
                        }
                    })
                    let resg = /^[\w_-\u4e00-\u9fa5]+$/;
                    if((polNo && resg.test(polNo) && polNo.length <= 40) || (pDNo && resg.test(pDNo) && pDNo.length <= 40)) {
                        let ele = {
                            userNo:single[0],
                            policyNo:polNo,
                            endorseNo:pDNo,
                        };
                        if(item.split(flag).findIndex(e => e == '保单' ) != -1 || item.split(flag).findIndex(e => e == '批单' ) != -1) {
                            if(this.agents.find(i => i.employeeNum == ele.userNo)) {
                                ele.userName = this.agents.find(i => i.employeeNum == ele.userNo) ? this.agents.find(i => i.employeeNum == ele.userNo).userName : '';
                                ele.userCode = this.agents.find(i => i.employeeNum == ele.userNo) ? this.agents.find(i => i.employeeNum == ele.userNo).userCode : '';
                                ele.channelCode = this.agents.find(i => i.employeeNum == ele.userNo) ? this.agents.find(i => i.employeeNum == ele.userNo).channelCode : '';
                                ele.branchCode = this.agents.find(i => i.employeeNum == ele.userNo) ? this.agents.find(i => i.employeeNum == ele.userNo).branchCode : '';
                                ele.branchName = this.agents.find(i => i.employeeNum == ele.userNo) ? this.agents.find(i => i.employeeNum == ele.userNo).branchName : '';
                                ele.policyOrgCode = window.sessionStorage.getItem('branchCode');
                                ele.policyOrgName = window.sessionStorage.getItem('branchName');
                                if(ele.policyNo && (this.recordList.find(e => e.policyNo == ele.policyNo) || arrRecord.find(e => e.policyNo == ele.policyNo))) {
                                    this.textAgain.push(ele.policyNo)
                                } else if(ele.endorseNo && (this.recordList.find(e => e.endorseNo == ele.endorseNo) || arrRecord.find(e => e.endorseNo == ele.endorseNo))) {
                                    this.textAgain.push(ele.endorseNo)
                                } else {
                                    arrRecord.push(ele);
                                }
                            } else {
                                this.textExit.push(ele.userNo);
                            }
                        }
                    } else {
                        msg.push(polNo?polNo:pDNo)
                    }
                }
            });
            if(this.textAgain.length == 0 &&  this.textExit.length == 0) {
                this.tipExit = false;
                this.tipAgain = false;
                this.recordList = this.recordList.concat(arrRecord);
                this.dialogVisibleAI = false;
            } else {
                this.textExit.length != 0 ? this.tipExit = true : this.tipExit = false
                this.textAgain.length != 0 ? this.tipAgain = true : this.tipAgain = false
            }
            if(msg.length != 0) {
                let str = '保单号/批单号：' + msg.join(',') + '不符合规范。'
                this.$message.error(str);
            }
        }
	},
}

</script>

<style lang="less" scoped>
#addDialog {
	background-color: #f2f1ef;
	.content-dialog{
		width: 96%;
        margin-left: 2%;
		background-color: #ffffff;
		.content1-dialog{
			width: 100%;
			min-height: 40px;
			margin-bottom: 30px;
			color: #666666;
			.item1{
				height: 40px;
				line-height:40px;
				box-sizing: border-box;
				font-weight: 600;
			}
        }
        .btn-right {
            text-align: right;
            margin-top: 20px;
            margin-bottom: 0px;
        }
	}
}
.col-org {
    color: #d46b08;
    line-height: 25px;
}
.item9{
    width: 120px;
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
.w80 {
    width: 80%;
}
.col-red {
    color: #f5222d;
}
</style>