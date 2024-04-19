<template>
  <!-- 案件新增文件 -->
	<div class="caseAddFileDialog" id="caseAddFileDialog">
		 <el-dialog class="iframe-dialog" title="上传附件" :visible.sync="dialogVisible" width="800px" destroy-on-close :close-on-click-modal='false' append-to-body>
            <el-form :model="ruleForm" ref="ruleForm" label-width="130px" :rules="rules">
                <el-form-item label="文件类型"  prop="typeId">
                    <el-select v-model="ruleForm.typeId" size="mini" class="w280">
                        <el-option v-for="item in fileTypeData" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="mt15">
                    <span slot="label">
                        <span class="color-red">*</span>
                        文件
                    </span>
                    <el-upload class="upload-demo" action="#" :file-list="fileList" :http-request="uploadUrl" :limit="limit" multiple :on-exceed="handleExceed" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :accept="accept">
                        <el-button size="small" type="primary">选择附件</el-button>
                        <span slot="tip" style="color:#096DD9">
                            {{acceptRemarks}}
                        </span>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div class="btn" style="margin: 10px 0;text-align: right;width: 100%;">
                <span class="btn-left" style="display: inline-block;padding: 5px 20px;border: 1px solid #ccc;color: #000;background-color: #F5F5F5;border-radius: 20px;cursor: pointer;margin-right: 20px;" @click="close">取消</span>
                <span class="btn-right" style="display: inline-block;padding: 5px 20px;color: #FFF;background-color: #FA8C16;border-radius: 20px;cursor: pointer;" @click="onSubmit('ruleForm')">确认提交</span>
            </div>
        </el-dialog>
	</div>
</template>

<script>
import ResourcesService from '@/service/ResourcesService';
import moment from 'moment'
import {mapGetters,mapActions} from 'vuex'
export default {
    props:{
        // 文件最大数
        limit:{
            type:Number,
            default:()=>{
                return 50
            }
        },
        maxSize:{
            type:Number,
            default:()=>{
                return 20
            }
        },
        // 文件类型
        accept:{
            type:String,
            default:()=>{
                return ".pdf , .png, .jpg, .jpeg,.PDF , .PNG, .JPG, .JPEG"
            }
        },
        // 备注
        acceptRemarks:{
            type:String,
            default:()=>{
                return "只支持PDF/PNG/JPG/JPEG，大小不超过20M（最多可上传50件）"
            }
        },
        fileTypeData:{
            type:Array,
            default:()=>{
                return []
            }
        },
    },
	data() {
		return {
            ResourcesService: new ResourcesService(),
            dialogVisible:false,
            ruleForm: {
                typeId:'',
            },
            fileList:[],
            rules: {
                typeId: [
                    { required: true, message: '请选择文件类型', trigger: 'change' },
                ],
            },
        }
	},
    computed:{
        ...mapGetters(['caseInfo'])
    },
	created(){},
	methods: {
        ...mapActions(['fileListInfoUpload']),
        // 初始化数据
        openInit(val) {
            this.dialogVisible = true;
        },
        async uploadUrl(file){
            let files = [];
            files.push(file.file);
            let res = await this.ResourcesService.uploadFile('abts-case-svc','sequipCaseFile','0', files);
            if (res.code == "0000") {
                res.list[0].name = res.list[0].fileName;
                let obj  = {
                    name:res.list[0].fileName,
                    ...res.list[0]
                }
                this.fileList.push(obj);
            }
		},
        
        //超出文件上传上限的提示
		handleExceed() {
			this.$confirm("只能上传一个文件，如需更换，点击删除后重新上传", "提示", {	confirmButtonText: "确定" });
		},
        //删除上传的文件钩子函数
		handleRemove(e) {
			// this.ruleForm.fileId = "";
			// this.fileList = []
            this.fileList = this.fileList.filter(item=>item.fileId !== e.fileId)
		},
        // 文件上传大小校验
        beforeAvatarUpload(file) {
            const isLt10M = file.size / 1024 / 1024 < this.maxSize
            if (!isLt10M) {
                this.$message.error(`单文件上限${this.maxSize}MB!`)
            }
            return isLt10M
        },
        // 取消
        close(){
            this.dialogVisible = false
            this.fileList = []
            this.ruleForm = {
                typeId:'',
            }
        },
        // 确认关联
        onSubmit(){
            this.$refs.ruleForm.validate(value=>{
                if(value) {
                    if(this.fileList.length !== 0) {
                        this.onSubmitSave()
                    } else {
                        this.$message.warning('请上传文件')
                    }
                }
            })
        },
        async onSubmitSave(){
            let list = this.fileList.map(item=>{
                let obj = {
                    "fileId": item.fileId,
                    "fileName": item.fileName,
                    "fileSecType": "",
                    "fileThirdType": "",
                    "fileType": this.ruleForm.typeId,
                    "reportNo": this.caseInfo.reportNo,
                    "uploadTime": moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                }
                return obj
            })
            let code = await this.fileListInfoUpload(list)
            if(code === "0000"){
                this.close()
                this.$emit('successCb')
            }
        },

	},
}
</script>

<style lang="less"  scoped="scoped">
 /deep/.iframe-dialog .el-dialog__header{
     padding: 0 !important;
 }
/deep/.iframe-dialog .el-dialog__body{
  padding: 0 !important;
}
#caseAddFileDialog {
    .el-form-item {
        margin-bottom: 10px;
    }
    .btn{
        margin: 10px 0;
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
