<template>
    <div id="caseRevisit">
        <div class="edit-top">
            <span class="col-orange"> <span class="col-orange-bor"></span>案件回访</span>
            <span class='fr  edit-icon' style="margin-top: 12px;background-color: #Fa8c16;color: #FFFF;padding: 5px 20px;border-radius: 20px;" v-if="(reportStatus == '04' || reportStatus == '03') && !disabledBtn" @click="toEditPass">增加回访</span>
        </div>    
        <div class="border-style">
                <!-- <el-button type="warning" plain v-if="caseReview.length == 0" @click="toEditPass" :disabled="reportStatus != '04' && reportStatus != '03'">去添加</el-button> -->
                <div v-for="(item,index) in caseReview" :key="index" :class="{'one-step':true,'one-step-border' : index != caseReview.length-1}" >
                    <el-row class="con-row">
                        <el-col :span="8">
                            <span>回访人员：</span>
                            <span class="col-black" style="color:#FA8C16">{{item.revisitName}}</span>
                        </el-col>
                        <el-col :span="6">
                            <span>回访类型：</span>
                            <span class="col-black">{{item.revisitType == '01' ? '现场查勘' : '电话回访'}}</span>
                        </el-col>
                        <el-col :span="8">
                            <span>回访时间：</span>
                            <span class="col-black">{{item.revisitTime}}</span>
                        </el-col>
                        <el-col :span="2">
                            <div class="fr20">
                                <span style="color: #096DD9;;cursor: pointer" v-if="(reportStatus == '04' || reportStatus == '03' ) && !disabledBtn" @click="editReview(caseReview[index])">修改</span>
                                <span style="color: #096DD9;cursor: pointer;margin-left:5px" v-if="(reportStatus == '04' || reportStatus == '03') && !disabledBtn" @click="deleteReview(caseReview[index],index)">删除</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="con-row">
                        <el-col :span="8">
                            <span>内容要点：</span>
                            <i class="iconfont iconxinxi" style="color:#FA8C16;font-size:20px;vertical-align: middle;" ></i>
                            <span class="col-black item1" style="color: #096DD9;">{{item.revisitContent}}</span>
                        </el-col>
                    </el-row>
                    
                </div>
                <p v-if="caseReview.length != 0" style="height:5px"></p>
        </div>
        <el-dialog title="案件回访"  :visible.sync="dialogVisible"  width="40%" :before-close="handleClose" :close-on-click-modal='false'>
			<el-form :model="form" ref="form" class="demo-ruleForm" label-width="120px"  :rules="rules">
                <el-form-item label="回访类型" prop="revisitType">
                    <el-radio-group v-model="form.revisitType">
                        <el-radio label="01">现场查勘</el-radio>
                        <el-radio label="02">电话回访</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="回访时间" prop="revisitTime">
                    <el-date-picker size="mini" v-model="form.revisitTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="回访人员" prop="revisitName">
                    <el-input  size="mini" v-model="form.revisitName" placeholder="请输入" class="item2"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="备注信息" prop="revisitContent">
                            <el-input  size="mini" type="textarea" v-model="form.revisitContent" :rows="2"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
			</el-form>
			<!-- <span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="submit('form')">确 认</el-button>
			</span> -->
            <div class="btn">
                <span class="btn-left" @click="dialogVisible = false">取消</span>
                <span class="btn-right" @click="submit('form')">确认提交</span>
            </div>
		</el-dialog>
    </div>
</template>
<script>
import CaseService from '../../../service/CaseService.js';
import store from '../../../store/index'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    props:{
        disabledBtn:{
            type:Boolean,
            default: false
        }
    },
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
            "reportStatus",
            "caseStopInfo"
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
            if(this.caseStopInfo && this.caseStopInfo.flag) {
                this.$message.error('请解除中止后继续操作');
                return false
            }
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
            await this.$emit('getCaseDetail');
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
            let res = await this.caseService.delRevisit(row.id,this.$route.query.reportNo);
            if(res.code =='0000') {
                this.caseReview.splice(index,1);
                this.$message({
					type: 'success',
					message: '删除成功!'
                });
                this.$store.commit('updataCaseReview',this.caseReview);
                this.getRevisit();
                await this.$emit('getCaseDetail');
            }
        }
    }
}
</script>
<style lang="less">
    #caseRevisit {
        margin-top: 20px;
        // padding-bottom: 1px;
        background-color: #fff;
        .col-orange {
            color: #c9984a;
        }
        .border-style {
            .con-row{
                margin-top: 10px;
                color: #000;
                .col-status{
                    display: inline-block;
                    padding: 5px 15px;
                    background-color: #FFE7BA;
                    border-radius: 20px;
                    color: #FA8C16;
                }
                
            }
        }
        .one-step {
            margin-bottom: 16px;
            margin: 0 35px;
            padding-bottom: 16px;
            padding-top: 10px;
            .item1{
                word-wrap:break-word;
            }
        }
        .one-step-border{
            border-bottom: 2px dotted #BBB;
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
        .btn{
            text-align: right;
            width: 100%;
            .btn-left{
                display: inline-block;
                padding: 5px 20px;
                border: 1px solid #ccc;
                color: #000;
                background-color: #F5F5F5;
                border-radius: 20px;
                cursor: pointer;
                margin-right: 20px;
            }
            .btn-right{
                display: inline-block;
                padding: 5px 20px;
                color: #FFF;
                background-color: #FA8C16;
                border-radius: 20px;
                cursor: pointer;
            }
        }
    }

</style>