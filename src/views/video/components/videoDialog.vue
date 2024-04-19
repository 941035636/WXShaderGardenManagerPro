<template>
    <div class="video-template">
        <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="canBtn">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="视频标题" prop="title">
                    <el-input v-model.trim="ruleForm.title" placeholder="请输入视频标题" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="视频分类" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择">
                        <el-option label="安全课堂" value=1></el-option>
                        <el-option label="安全宣传视频" value=2></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容简介" prop="description">
                    <el-input type="textarea" :rows="4" placeholder="请输入" style="width: 80%;" v-model.trim="ruleForm.description"></el-input>
                </el-form-item>
                <el-form-item label="视频地址" prop="mediaUrl1">
                    <el-input v-model.trim="ruleForm.mediaUrl1" placeholder="请输入视频地址或者上传" style="width: 80%;"></el-input>
                     <el-upload class="avatar-uploader1 mt10" accept=".mp4" :before-upload="beforeAvatarUpload" :show-file-list="true"  action="#" :http-request="Upload" :on-success="handleAvatarSuccess" :limit="1">
                        <el-button size="small" type="primary">上传视频</el-button>
                        <div slot="tip" class="el-upload__tip text-tip text-tip1">视频大小不超过50MB，只支持mp4格式</div>
                    </el-upload>
                </el-form-item>
                 <el-form-item label="发布时间" prop="publishTime">
                    <el-date-picker v-model="ruleForm.publishTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="视频封面" prop="coverPicture">
                    <img  :src="imageUrl1" v-if="imageUrl1" class="avatar1">
                    <el-upload class="avatar-uploader1 upload-btn" accept=".pdf,.PDF,.jpg,.JPG,.png,.PNG" :before-upload="beforeAvatarUpload1" :show-file-list="false"  action="#" :http-request="Upload1" :on-success="handleAvatarSuccess1">
                        <span class="avatar-uploader-icon">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </span>	
                        <br>
                        <span class="text-tip">只能上传 PDF/JPG/PNG文件，且不超过 10MB</span>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div class="fr">
				<el-button  round size="medium" @click="canBtn">取 消</el-button>
				<el-button type="warning" round size="medium" v-if="!editFlag" @click="confirmBtn">发 布</el-button>
				<el-button type="warning" round size="medium" v-if="editFlag" @click="confirmBtn">提 交</el-button>
			</div>
        </el-dialog>
    </div>
</template>
<script>
import moment from 'moment'
import ContractService from '../../../service/ContractService'
import UserService from '../../../service/UserService'
import {elevator} from '../../../server/accidenServer.js'
import $apiUrl from '../../../api/apiUrl.js'
export default {
    name: 'videoTem',
    props:[
	],
	data() {
		return {
            title: '添加视频',
            moment:moment,
            dialogFormVisible: false,
            ruleForm: {
                "coverPicture": "",
                "description": "",
                "mediaUrl": "",
                "mediaUrl1":"",
                "publishTime": '',
                "status": 1,
                "title": "",
                "type": ""
            },
            rules: {
                title: [
                    { required: true, message: '请输入视频标题', trigger: 'blur' },
                    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                ],
                mediaUrl1: [
                    { required: true, message: '请输入视频地址或上传', trigger: 'blur' },
                ],
                type: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                publishTime: [
                    {  required: true, message: '请选择日期', trigger: 'change' }
                ],
                coverPicture: [
                    { required: true, message: '请选择', trigger: 'change'  }
                ],
                description: [
                    { required: true, message: '请输入', trigger: 'blur' },
                    { min: 1, max: 400, message: '长度在 1 到 400 个字符', trigger: 'blur' }
                ]
            },
            UserService: new UserService(),
            Elevator: new elevator(),
            imageUrl1:'',
            $apiUrl:$apiUrl,
            editFlag:false
		}
	},
	computed:{
       
	},
	mounted() {
		
	},
	created(){
		
	},
	methods: {
        initData(obj) {
            if(obj) {
                this.title = "编辑视频";
                this.ruleForm = JSON.parse(JSON.stringify(obj));
                this.imageUrl1 = this.ruleForm.imgUrl;
                this.editFlag = true;
            } else {
                this.title = "添加视频";
                this.ruleForm = {
                    "coverPicture": "",
                    "description": "",
                    "mediaUrl": "",
                    "mediaUrl1":"",
                    "publishTime": '',
                    "status": 1,
                    "title": "",
                    "type": ""
                };
                if(this.imageUrl1) {
                    this.$refs['ruleForm'].resetFields();
                }
                this.imageUrl1 = '';
                this.editFlag = false;
            }
            this.dialogFormVisible = true;
        },
        canBtn() {
            this.$refs['ruleForm'].resetFields();
            this.title = "添加视频";
            this.dialogFormVisible = false;
        },
        confirmBtn() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    if(!this.editFlag) {
                        this.submitVideo();
                    } else {
                        this.submitEditVideo();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async submitEditVideo() {
            console.log(this.ruleForm);
            let res = await this.UserService.putEditVideo(this.ruleForm.id,this.ruleForm);
            if(res.code == '0000') {
                this.dialogFormVisible = false;
                this.$message.success('编辑成功!');
                this.$parent.searchview();
            }
        },
        async submitVideo() {
            let res = await this.UserService.postAddVideo(this.ruleForm);
            if(res.code == '0000') {
                this.dialogFormVisible = false;
                this.$message.success('上传成功!');
                this.$parent.searchview();
            }
        },
        async Upload(file){ // 视频上传
			const formData = new FormData();
			formData.append('files', file.file)
			formData.append('type', file.file.type)
			formData.append("channelcode", "sequip"); 
			formData.append("resCode", "media");
			let data = formData
			let res = await this.Elevator.cateUploadAuth(data,'abts-svc','1','media');
			let {code} = res
			if(code == "0000"){
				this.ruleForm.mediaUrl = res.list[0].fileId;
				this.ruleForm.mediaUrl1 =  window.location.hostname + '/' + $apiUrl.SHOW_VIDEO + res.list[0].fileId;
			}
		},
		handleAvatarSuccess(res, file) {
			// this.ruleForm.mediaUrl = URL.createObjectURL(file.raw);
		},
        async Upload1(file){ // 图片上传
			const formData = new FormData();
			formData.append('files', file.file)
			formData.append('type', file.file.type)
			formData.append("applicationName", "abts-svc");
			formData.append("businessTypeCode", "media");
			formData.append("free", "1");
			let data = formData
			const res = await this.UserService.uploadVideoImg(data);
			let {code} = res
			if(code == "0000"){
				this.ruleForm.coverPicture = res.list[0].fileId;
			}
		},
		handleAvatarSuccess1(res, file) {
			this.imageUrl1 = URL.createObjectURL(file.raw);
		},
        beforeAvatarUpload(file) {
            const isMP4 = file.type === 'video/mp4';
            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isMP4) {
                this.$message.error('上传视频只支持mp4格式!');
            }
            if (!isLt50M) {
                this.$message.error('上传视频大小不超过50MB!');
            }
            return isMP4 && isLt50M;
        },
        beforeAvatarUpload1(file) {
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message.error('视频封面图片大小不超过10MB!');
            }
            return isLt10M;
        }
    }
}
</script>
<style lang="less">
.video-template {
    .wid300 {
        width: 300px;
    }
    .el-pagination {
        text-align: center;
    }
    .tip-text {
        width: 278px;
        height: 40px;
        background-color: #fff1f0;
        color: #ff7875;
        border-radius: 6px;
        font-size: 14px;
        padding: 0px;
        text-align: center;
        line-height: 40px;
        margin-left: 5%;
    }
    .el-dialog__body {
        padding-bottom: 50px;
    }
    .el-upload-list {
        width: 80%;
    }
    .avatar1 {
        width: 120px;
        display: inline-block;
    }
    .upload-btn {
        display: inline-block;
        vertical-align: top;
        margin-left: 10px;
    }
    .el-upload {
       text-align: left; 
    }
    .text-tip {
        font-size: 14px;
        color: #096dd9;
        line-height: 20px;
    }
    .text-tip1 {
        display: inline-block;
        margin-left: 10px;
    }
}


</style>