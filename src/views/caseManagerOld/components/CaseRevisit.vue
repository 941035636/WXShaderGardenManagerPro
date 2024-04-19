<template>
    <div id="caseRevisit">
        <div class="edit-top">
            <span class="content-title col-orange">案件回访</span>
            <span class="fr mt16 edit-icon" v-if="caseReview.length != 0 && reportStatus == '04' || caseReview.length != 0 && reportStatus == '03'" @click="toEditPass"><i class="el-icon-circle-plus"></i> 添加</span>
        </div>
        <div class="border-style">
            <el-form  :label-position="labelPosition">
                <el-button type="warning" plain v-if="caseReview.length == 0" @click="toEditPass" :disabled="reportStatus != '04' && reportStatus != '03'">去添加</el-button>
                <div v-for="(item,index) in caseReview" :key="index" class="one-step">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="回访类型：">
                                    <span class="col-black">{{item.revisitType == '01' ? '现场查勘' : '电话回访'}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="回访人员：">
                                    <span class="col-black">{{item.revisitName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="回访时间：">
                                    <span class="col-black">{{item.revisitTime}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="内容要点：">
                                    <span class="col-black item1">{{item.revisitContent}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="mr-top">
                            <div class="fr20">
                                <el-button size="medium" type="primary" v-if="reportStatus == '04' || reportStatus == '03'" plain @click="editReview(caseReview[index])">修改</el-button>
                                <el-button size="medium" type="danger" v-if="reportStatus == '04' || reportStatus == '03'" plain @click="deleteReview(caseReview[index],index)">删除</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                
            </el-form>
        </div>
        <el-dialog title="案件回访"  :visible.sync="dialogVisible"  width="50%" :before-close="handleClose">
			<el-form :model="form" ref="form" class="demo-ruleForm" label-width="120px"  :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="回访时间" prop="revisitTime">
                            <el-date-picker v-model="form.revisitTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"> </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="回访类型" prop="revisitType">
                            <el-select v-model="form.revisitType" placeholder="请选择">
                                <el-option label="现场查勘" value="01"></el-option>
                                <el-option label="电话回访" value="02"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="回访人员" prop="revisitName">
                    <el-input v-model="form.revisitName" placeholder="请输入" class="item2"></el-input>
                </el-form-item>
                <el-form-item label="内容要点" prop="revisitContent">
                    <el-input type="textarea" v-model="form.revisitContent" :rows="3"></el-input>
                </el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="submit('form')">确 认</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import CaseService from '../../../service/CaseService.js';
import store from '../../../store/index'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    data() {
		return {
            caseService: new CaseService(),
			tableData:[],
			tableData1:[],
			occupation:'',
			idNumber:'',
			fileList2:[],
			dialogVisible:false,
			processNull:true,
			labelPosition: 'left',
			form: {
                reportNo: this.$route.query.reportNo,
                caseNo: this.$route.query.caseNo,
                revisitContent:"",
                revisitName:"",
                revisitTime:"",
                revisitType:"",
                id:""
            },
            typeOptions:[],
            rules:{
                revisitTime:[
                    {required: true, message: '请选择回访时间', trigger: 'change'}
                ],
                revisitType:[
                    {required: true, message: '请选择回访类型', trigger: 'change'}
                ],
                revisitName:[
                    {required: true, message: '请输入回访人员', trigger: 'blur'},
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                revisitContent:[
                    {required: true, message: '请输入内容要点', trigger: 'blur'},
                    { max: 200, message: '内容长度不能超过200个字符', trigger: 'blur' }
                ],
            }
		}
    },
    computed:{
        ...mapGetters([
            "caseReview",
            "reportStatus"
        ]),
    },
    store,
    created() {
        if(this.caseReview.length != 0) {
            this.processNull = false;
        }
    },
    mounted() {
        
    },
    methods:{
        toEditPass(){//添加
            this.form = {
                reportNo: this.$route.query.reportNo,
                caseNo: this.$route.query.caseNo,
                revisitContent:"",
                revisitName:"",
                revisitTime:"",
                revisitType:"",
                id:""
            };
			this.dialogVisible = true;
        },
        submit(formName){//验证
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitFun();
                } else {
                    return false;
                }
            });
        },
        async submitFun(){//添加修改
            if(this.form.id) {
                let res = await this.caseService.editRevisit(this.form);
                if(res.code == '0000') {
                    this.$message({
                        message:'修改成功',
                        type: 'success'
                    });
                }
            } else {
                let res = await this.caseService.addRevisit(this.form);
                if(res.code == '0000') {
                    this.processNull = false;
                    this.$message({
                        message:'添加成功',
                        type: 'success'
                    })
                }
            }
            this.getRevisit();
            this.handleClose();
        },
		handleClose() {
            this.$refs['form'].resetFields();
			this.dialogVisible = false;
        },
        async getRevisit() {
            let res = await this.caseService.searchRevisit(this.$route.query.reportNo);
            if(res.code == '0000') {
                if(res.total == 0) {
                    this.processNull = true;
                    this.$store.commit('updataCaseReview',[]);
                } else {
                    this.processNull = false;
                    this.$store.commit('updataCaseReview',res.list);
                } 
            }
        },
        editReview(row) {
            this.form = JSON.parse(JSON.stringify(row));
            this.form.reportNo = this.$route.query.reportNo;
            this.form.caseNo = this.$route.query.caseNo;
            this.dialogVisible = true;
        },
        deleteReview(row,index) {
            this.$confirm('是否删除回访信息?', '删除回访信息', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
                this.deleteFun(row,index);
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除!'
				});          
			});
        },
        async deleteFun(row,index) {
            let res = await this.caseService.delRevisit(row.id);
            if(res.code =='0000') {
                this.caseReview.splice(index,1);
                this.$message({
					type: 'success',
					message: '删除成功!'
                });
                this.$store.commit('updataCaseReview',this.caseReview);
                this.getRevisit();
            }
        }
    }
}
</script>
<style lang="less">
    #caseRevisit {
        margin-top: 20px;
        padding-bottom: 1px;
        background-color: #fff;
        .col-orange {
            color: #c9984a;
        }
        .border-style {
            .el-form {
                margin:20px 30px;
                padding: 0 30px;
            }
        }
        .one-step {
            margin-bottom: 10px;
            background-color: #f8f8f8;
            border: 1px dotted #ececec;
            border-radius: 5px;
            padding-left: 30px;
            .item1{
                word-wrap:break-word;
            }
        }
        .item2{
            width: 250px;
        }
        .mr-top {
            margin-top: -20px;
            .fr20 {
                float: right;
                margin-right: 20px;
            }
        }
    }

</style>