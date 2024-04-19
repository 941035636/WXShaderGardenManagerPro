<template>
    <div id="fileInfo">
        <div class="edit-top">
            <span class="content-title col-orange">索赔资料</span>
            <span class="fr mt16 edit-icon" v-if="!processNull && reportStatus == '04' || !processNull && reportStatus == '03'" @click="fileupload"><i class="el-icon-edit"></i> 增加</span>
        </div>
        <div class="border-style">
            <el-form>
                <el-button type="warning" plain :disabled="reportStatus != '04' && reportStatus != '03'" v-if="processNull" @click="fileupload">去添加</el-button>
                <div v-if="!processNull">
                    <el-table :data="tableData"  style="width: 90%;margin-top:20px;" :header-cell-style="getRowClass">
                        <el-table-column type="index" label="序号" align="center" width="100px"></el-table-column>
                        <el-table-column prop="resName" label="文件名" align="center"></el-table-column>
                        <el-table-column prop="typeName" label="资料类型" align="center"></el-table-column>
                        <el-table-column prop="fileDesc" label="资料描述" align="center"></el-table-column>
                        <el-table-column prop="createTime" label="上传时间" align="center" width="200px"></el-table-column>
                        <el-table-column prop="phone" label="操作" align="center" width="180px">
                            <template slot-scope="scope">
                                <el-button @click="downloadfile(scope.row)" type="text" size="small" icon="el-icon-download" >下载</el-button>
                                <el-button @click="deletefile(scope.row)" type="text" size="small"  v-if="reportStatus == '04' || reportStatus == '03'">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
            <el-dialog title="资料上传" :visible.sync="dialogVisible" width="40%" destroy-on-close>
                <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="资料类型:">
                        <el-select v-model="ruleForm.typeId" placeholder="请选择资料类型" @change="choice">
                            <el-option v-for="item in csaeDictionaries.fileType" :key="item.value" :label="item.label" :value="item.value" v-if="item.value != '07'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资料描述:">
                        <el-input v-model="ruleForm.fileDesc" placeholder="请输入案件理赔资料描述"></el-input>
                    </el-form-item>
                </el-form>
                <h5 class="fc">附件列表:</h5>
                <div>
                    <span class="notes">注:附件类</span><span style="margin-left:-12px;color:#FE8181;">型(doc、docx、xls、xlsx、ppt、pptx、pdf、rar、zip)，单文件上限30MB</span>
                    <el-upload class="upload-demo" action="#" :http-request="Upload" multiple :file-list="fileList" :show-file-list="false" accept=".doc , .docx , .ppt , .pptx , .pdf , .rar , .zip , .xlsx , .xls">
                        <span class="upload-style"><i class="el-icon-upload2"></i>上传附件</span>
                    </el-upload>
                </div> 
                 <el-table :data="fileList"  style="width: 96%;margin-top:20px;margin-left:4%;" :header-cell-style="getRowClass" fit>
                        <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
                        <el-table-column prop="resName" label="附件名称" align="center" min-width="200"></el-table-column>
                        <el-table-column prop="phone" label="操作" align="center" min-width="80">
                            <template slot-scope="scope">
                                <el-button @click.native.prevent="deletefiles(scope.$index,scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submit">提交确认</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import CaseService from '../../../service/CaseService.js';
import ResourcesService from '../../../service/ResourcesService';
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    data() {
		return {
            caseService: new CaseService(),
            ResourcesService: new ResourcesService(),
            processNull:true,
            dialogVisible:false,
            tableData:[],//页面数据
            fileList:[],//弹框数据
            ruleForm:{ //form表单
                'typeId':'',
                "typeName":'',
                'fileDesc':'',
            },
		}
    },
    computed:{
        ...mapGetters([
            "csaeDictionaries",
            "reportStatus"
        ]),
    },
    created() {
        this.getfilelist();
    },
    methods: {
        async getfilelist(){ //获取资料
            this.tableData = [];
            const res = await this.caseService.cateFilequery(this.$route.query.reportNo);
            if(res.code == '0000'){
                if(!res.data.length){
                    this.processNull = true;
                }else{
                   res.data.forEach(item => {
                        if(item.typeId != '07') {
                            this.tableData.push(item);
                        }
                    });
                   this.processNull = false;
                }
            }
        },
        choice(value){ //选择资料类型
            this.csaeDictionaries.fileType.find(item => {
                if(item.value == value){
                    this.ruleForm.typeName = item.label;
                }
            });
        },
        fileupload(){ //打开弹框
            this.ruleForm = {
                'typeId':'',
                "typeName":'',
                'fileDesc':'',
            };
            this.fileList = [];
            this.dialogVisible = true;
        },
        async Upload(file){ // 资料上传服务器
            if(!this.ruleForm.typeId){
                this.$message({
                    message: '请选择资料类型',
                    type: 'warning'
                });
                return;
            };
            let data = [file.file]
			const res = await this.ResourcesService.uploadFile('case-svc','caseFile','0',data);
            if(res.code == '0000'){
                let item = {
                    'caseNo':this.$route.query.caseNo,
                    'fileDesc':this.ruleForm.fileDesc,
                    "fromSys":'sequip',
                    'id':'',
                    'reportNo':this.$route.query.reportNo,
                    'resId':res.list[0].fileId,
                    'resName':file.file.name,
                    'typeId':this.ruleForm.typeId,
                    'typeName':this.ruleForm.typeName,
                    'userCode':window.sessionStorage.getItem('userCode'),
                    'userName':window.sessionStorage.getItem('userName'),
                };
                this.fileList.push(item)
            };
        },
        async submit(){//上传案件中心
            let data = {
                'channel':'sequip',
                'fileInfos':this.fileList
            };
            const res = await this.caseService.cateFileprese(data);
            if(res.code == '0000'){
                this.$message({
                    message: '文件上传成功',
                    type: 'success'
                });
                this.dialogVisible = false;
                this.getfilelist();
            }
        },
        deletefiles(index,row){ //删除弹框中上传的文件
            this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.fileList.splice(index,1);
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
        async downloadfile(row) {
            // window.location.href = this.$apiUrl.COM_INDENT + row.resId;
            let res = await this.ResourcesService.downloadOrViewFile(row.url,true);
            
        },
        deletefile(row){ //删除案件中心文件信息
            this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deletesfile(row.resId);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        async deletesfile(resId){
            const res = await this.caseService.cateFiledelete(resId);
            if(res.code == '0000'){
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getfilelist();
            }   
        },
        getRowClass({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #fefbf1;border-bottom:1px solid #f0dfbf;color:#cda160;font-size:16px;';
            } else {
                return 'background: #fff';
            }
		},
    }
}
</script>
<style lang="less" scoped>
#fileInfo {
    margin-top: 20px;
    background-color: #fff;
    .border-style {
        border: 0;
        .col-orange {
            color: #c9984a;
        }
        .demo-ruleForm{
            margin: 0;
            border-bottom: 1px solid #DEDEDE;
        } 
        .fc{
            width: 100px;
            text-align: right;
            vertical-align: middle;
            font-size: 16px;
            color: #000000;
            font-weight: 600;
            line-height: 40px;
            padding: 0 12px 0 0;
            box-sizing: border-box;
        }
        .notes{
            display: inline-block;
            width: 100px;
            font-size: 14px;
            line-height: 40px;
            text-align: right;
            padding: 0 12px 0 0;
            box-sizing: border-box;
            color: #FE8181;
        }
        .upload-style {
            color: #2F68D5;
            i {
                margin-right: 5px;
            }
        }
        .upload-demo{
            margin-top: 8px;
            width: 100px;
            float: right;
            text-align: center;
            .upload-btn{
                width: 100px;
                border: 1px solid #0175CC;
                color: #0175CC;
                border-radius: 20px;
            }
        }
    }
}
</style>