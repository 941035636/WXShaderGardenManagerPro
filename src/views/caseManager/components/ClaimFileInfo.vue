<template>
    <div id="fileInfo">
        <div class="edit-top">
            <span class="col-orange"><span class="col-orange-bor"></span>索赔资料</span>
            <span class='fr mt16 edit-icon' style="border: 1px solid #FA8C16; padding: 5px 20px; border-radius: 20px; color: #fff;background-color: #Fa8c16;" v-if=" (reportStatus == '04' || reportStatus == '03') && !disabledBtn" @click="fileuploadJieAn">上传结案文件</span>
            <span class='fr mt16 edit-icon' style="border: 1px solid #FA8C16; padding: 5px 20px; border-radius: 20px; " v-if="(reportStatus == '04' ||  reportStatus == '03') && !disabledBtn" @click="fileupload">其他案件资料</span>
        </div>
        <!-- 结案文件 -->
        <div class="border-style" v-if="!processNull">
            <p style="padding: 20px 35px 0px;"> <i class="iconfont iconlianjie" style="color:#FA8C16;font-size:20px;vertical-align: middle;" ></i><span style="color: #000;padding: 0px 10px 5px;  display: inline-block; font-weight: 700;">结案文件</span></p>
            <el-form >
                <div v-if="!processNull">
                    <el-table :data="tableDataJieAn" :border="true"  style="width: 90%;margin-top:20px;" :header-cell-style="getRowClass">
                        <el-table-column type="index" label="序号" align="center" width="100px"></el-table-column>
                        <el-table-column prop="resName" label="文件名" align="center"></el-table-column>
                        <el-table-column prop="typeName" label="资料类型" align="center"></el-table-column>
                        <el-table-column prop="createTime" label="上传时间" align="center" width="200px"></el-table-column>
                        <el-table-column prop="phone" label="操作" align="center" width="180px">
                            <template slot-scope="scope">
                                <el-button @click="downloadfile(scope.row)" type="text" size="small" icon="el-icon-download" >下载</el-button>
                                <el-button @click="deletefile(scope.row)" type="text" size="small"  v-if="(reportStatus == '04' || reportStatus == '03')  && !disabledBtn">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
            
        </div>
        <div class="border-style">
            <el-dialog title="资料上传" :visible.sync="dialogVisibleJieAn" width="40%" destroy-on-close :close-on-click-modal='false'>
                <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="资料类型: " required>
                        <el-select v-model="ruleForm.typeId" placeholder="请选择资料类型" @change="choice">
                            <el-option v-for="item in getJieAnFileType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资料附件:" required>
                        <el-upload class="upload-demo" action="#" :http-request="Upload" multiple :file-list="fileList" :show-file-list="false" :limit="10" :before-upload="beforeAvatarUpload" accept=".doc , .docx , .ppt , .pptx , .pdf , .rar , .zip , .xlsx , .xls" :on-exceed="onExceed">
                            <span class="upload-style"> 上传附件</span>
                        </el-upload>
                    </el-form-item>
                    <span class="notes">只支持</span><span style="margin-left:-12px;color:#1890FF;">doc/docx/xls/xlsx/ppt/pptx/pdf/rar/zip，单文件上限10MB(最多可上传10件)</span>
                </el-form>
                <el-table :data="fileList"  style="width: 96%;margin-left:4%;" :header-cell-style="getRowClass">
                        <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
                        <el-table-column prop="resName" label="附件名称" align="center" min-width="200"></el-table-column>
                        <el-table-column prop="typeName" label="资料类型" align="center" min-width="80"></el-table-column>
                        <el-table-column prop="phone" label="操作" align="center" min-width="80">
                            <template slot-scope="scope">
                                <el-button @click.native.prevent="deletefiles(scope.$index,scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                </el-table>
                <div  class="btn">
                    <span class="btn-left" @click="dialogVisibleJieAn = false">取消</span>
                    <span class="btn-right" @click="submit()">确认提交</span>
                </div>
            </el-dialog>
        </div>
        
        <!-- 案件资料 -->
        <div class="border-style" v-if="!processNull">
            <p style="padding: 20px 35px 0px;"><i class="iconfont iconlianjie" style="color:#FA8C16;font-size:20px;vertical-align: middle;" ></i><span style="color: #000;padding: 0px 10px 5px;  display: inline-block; font-weight: 700;">索赔资料</span><span style="color:#FA9830">（选填）</span> </p>
            <el-form>
                <div v-if="!processNull">
                    <el-table :data="tableData" :border="true"  style="width: 90%;margin-top:20px;" :header-cell-style="getRowClass">
                        <el-table-column type="index" label="序号" align="center" width="100px"></el-table-column>
                        <el-table-column prop="resName" label="文件名" align="center"></el-table-column>
                        <el-table-column prop="typeName" label="资料类型" align="center"></el-table-column>
                        <!-- <el-table-column prop="fileDesc" label="资料描述" align="center"></el-table-column> -->
                        <el-table-column prop="createTime" label="上传时间" align="center" width="200px"></el-table-column>
                        <el-table-column prop="phone" label="操作" align="center" width="180px">
                            <template slot-scope="scope">
                                <el-button @click="downloadfile(scope.row)" type="text" size="small" icon="el-icon-download" >下载</el-button>
                                <el-button @click="deletefile(scope.row)" type="text" size="small"  v-if="(reportStatus == '04' || reportStatus == '03')  && !disabledBtn">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
        </div>
        <div class="border-style">
            <el-dialog title="资料上传" :visible.sync="dialogVisible" width="40%" destroy-on-close :close-on-click-modal='false'>
                <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" >
                    <el-form-item label="资料类型:" required>
                        <el-select v-model="ruleForm.typeId" placeholder="请选择资料类型" @change="choice">
                            <el-option v-for="item in getQiTaFileType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资料附件:" required>
                        <el-upload class="upload-demo" action="#" :http-request="Upload" multiple :file-list="fileList" :show-file-list="false" :limit="10" :before-upload="beforeAvatarUpload" accept=".doc , .docx , .ppt , .pptx , .pdf , .rar , .zip , .xlsx , .xls" :on-exceed="onExceed">
                            <span class="upload-style"> 上传附件</span>
                        </el-upload>
                    </el-form-item>
                    <span class="notes">只支持</span><span style="margin-left:-12px;color:#1890FF;">doc/docx/xls/xlsx/ppt/pptx/pdf/rar/zip，单文件上限10MB(最多可上传10件)</span>
                </el-form>
                <el-table :data="fileList"  style="width: 96%;margin-top:20px;margin-left:4%;" :header-cell-style="getRowClass" fit>
                        <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
                        <el-table-column prop="resName" label="附件名称" align="center" min-width="200"></el-table-column>
                        <el-table-column prop="typeName" label="资料类型" align="center" min-width="80"></el-table-column>
                        <el-table-column prop="phone" label="操作" align="center" min-width="80">
                            <template slot-scope="scope">
                                <el-button @click.native.prevent="deletefiles(scope.$index,scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                </el-table>
                <div  class="btn">
                    <span class="btn-left" @click="dialogVisible = false">取消</span>
                    <span class="btn-right" @click="submit()">确认提交</span>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import CaseService from '@/service/CaseService.js';
import ResourcesService from '@/service/ResourcesService';
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
            ResourcesService: new ResourcesService(),
            processNull:true,
            dialogVisible:false,
            dialogVisibleJieAn:false,
            tableData:[],//页面数据
            tableDataJieAn:[],  // 结案文件列表
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
            "reportStatus",
            "caseStopInfo"
        ]),
        getJieAnFileType(){
            let list = this.csaeDictionaries.fileType.filter(item=>item.value == '07' || item.value == '08' || item.value == '09')
            return list
        },
        getQiTaFileType(){
            let list = this.csaeDictionaries.fileType.filter(item=>item.value != '07' && item.value != '08' && item.value != '09')
            return list
        },
    },
    created() {
        this.getfilelist();
    },
    methods: {
        async getfilelist(){ //获取资料
            this.tableData = [];
            this.tableDataJieAn = [];
            const res = await this.caseService.cateFilequery(this.$route.query.reportNo);
            if(res.code == '0000'){
                if(!res.data.length){
                    this.processNull = true;
                }else{
                    res.data.forEach(item => {
                        if(item.typeId != '07' && item.typeId != '08' && item.typeId != '09') {
                            this.tableData.push(item);
                        }else if(item.typeId == '07' || item.typeId == '08'|| item.typeId == '09') {
                            this.tableDataJieAn.push(item);
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
        //打开弹框
        fileupload(){ 
            if(this.caseStopInfo && this.caseStopInfo.flag) {
                this.$message.error('请解除中止后继续操作');
                return false
            }
            this.ruleForm = {
                'typeId':'',
                "typeName":'',
                'fileDesc':'',
            };
            this.fileList = [];
            this.dialogVisible = true;
            console.log(this.dialogVisible);
        },
        // 打开结案文件弹框
        fileuploadJieAn(){ 
            if(this.caseStopInfo && this.caseStopInfo.flag) {
                this.$message.error('请解除中止后继续操作');
                return false
            }
            this.ruleForm = {
                'typeId':'07',
                "typeName":'结案文件',
                'fileDesc':'',
            };
            this.fileList = [];
            this.dialogVisibleJieAn = true;
        },
        beforeAvatarUpload(file) {
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message.error('单文件上限10MB!');
            }
            return isLt10M;
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
        //上传案件中心,案件资料
        async submit(){
            let data = {
                'reportNo': this.$route.query.reportNo,
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
                this.dialogVisibleJieAn = false;
                this.getfilelist();
                await this.$emit('getCaseDetail');
                this.$emit('changeBtn');
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
            let res = await this.ResourcesService.downloadOrViewFile(row.url,true);
            
        },
        // 删除案件中心文件信息(提示)
        deletefile(row){ 
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
        // 删除案件中心文件信息
        async deletesfile(resId){
            const res = await this.caseService.cateFiledelete(resId,this.$route.query.reportNo);
            if(res.code == '0000'){
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getfilelist();
                await this.$emit('getCaseDetail');
                this.$emit('changeBtn');
            }   
        },
        getRowClass({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background:#E9E9E9;border-bottom:1px solid #BEBEBE;color:#101010;font-size:16px;';
            } else {
                return 'background: #fff';
            }
        },
        onExceed(){
            this.$message.warning('最多支持10个附件')
        }
    }
}
</script>
<style lang="less" scoped>
#fileInfo {
    margin-top: 20px;
    background-color: #fff;
    .border-style {
        border: 0;
        .el-table {
			border: 1px solid #BEBEBE;
            margin-bottom: 20px;
        }
        .el-table--border td{
            border-right: 1px solid #BEBEBE;
        }
        .col-orange {
            color: #c9984a;
        }
        .demo-ruleForm{
            margin: 0;
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
            width: 90px;
            font-size: 14px;
            line-height: 40px;
            text-align: right;
            padding: 0 12px 0 0;
            box-sizing: border-box;
            color: #1890FF;
            margin-top:-10px
        }
        .upload-style {
            color: #ffffff;
            background-color: #1890F5;
            padding: 5px 10px;
            border-radius: 5px;
            i {
                margin-right: 5px;
            }
        }
        .upload-demo{
            width: 100px;
            // float: right;
            text-align: center;
            .upload-btn{
                width: 100px;
                border: 1px solid #0175CC;
                color: #0175CC;
                border-radius: 20px;
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
}
</style>