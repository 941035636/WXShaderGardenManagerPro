<template>
	<div id="AttachmentInfo">
		<Title :titles="title"></Title>
		<div class="content mt20">
			<el-form :model="attachment" class="demo-ruleForm" label-position="right" label-width="130px" ref="insureds">
				<el-form-item label="附件上传：">
					<div style="display:flex;">
						<el-upload class="upload-demo" action="#" :http-request="Upload" :show-file-list="false" accept=".pdf , .rar , .zip , .jpg , .png">
							<el-button icon="el-icon-upload2">上传</el-button>
						</el-upload>
						<div class="content-tips"><i class="el-icon-warning" style="margin-right:8px;"></i>温馨提示：上传统一社会信用代码证件或者身份证证件</div>
					</div>
					<span v-if="attachment.urlName" style="color: #21E72B;">{{attachment.urlName}}<el-button icon="el-icon-circle-close" @click="handleRemove" type="text" style="color:#E6A23C;margin-left:10px;"></el-button></span>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './Title'
import PolicyentryService from '../../../service/PolicyentryService'
import store from "../../../store/index"
export default {
	name:'AttachmentInfo',
	components:{
		Title
	},
	store,
	data() {
		return {
			PolicyentryService:new PolicyentryService(),
			title:'附件信息',
			attachment:{
				urlid:'',
				urlName:''
			}
		};
	},
	computed: {
		
	},
	created() {
		if(this.$route.query.flag == 'again'){
			this.getData();
		}
	},
	methods: {
		handleRemove(file, fileList) {
			this.attachment = {
				urlid:'',
				urlName:''
			}
		},
		getData(){
			this.attachment = this.$store.getters.attachmentInfo;
		},
		submitForm6(){
			return this.attachment;
		},
		async Upload(file){ // 图片上传
			const isLt2M = file.file.size / 1024 / 1024 < 10;
			if (!isLt2M) {
				this.$message.error('上传附件大小不能超过 10MB!');
				return;
			}
			const formData = new FormData();
			formData.append('files', file.file)
			formData.append('type', file.file.type)
			formData.append("channelcode", "safety"); 
			formData.append("resCode", "I001");
			let data = formData
			const res = await this.PolicyentryService.cateUpload(data);
			if(res.code == '0000'){
				this.attachment.urlid = res.list[0].fileId;
				this.attachment.urlName = file.file.name;
			}
		},
	}
};
</script>

<style lang="less">
#AttachmentInfo{
	background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 20px 40px;
	.content{
		.el-upload--text{
			width: 168px;
			height: 40px;
			border: 1px solid #ECECEC;
			border-radius: 4px;
			text-align: center;
			line-height: 40px;
			.el-button{
				width: 100%;
				height: 100%;
				border: none;
				color: #6683D5;
				font-weight: 600;
			}
		}
		.content-tips{
			height: 40px;
			margin-left: 20px;
			line-height: 40px;
			background-color: #F2F5FF;
			color: #6683D5;
			padding: 0 20px;
			box-sizing: border-box;
		}
	}
}
</style>
