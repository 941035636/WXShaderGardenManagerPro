<template>
    <div class="share-template">
        <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="canBtn">
            <div>
                <span><i class="el-icon-link"></i><span class="col-gre" v-clipboard:copy="shareUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">点击复制链接</span></span>
                <p class="share-content mt10"><span>{{shareUrl}} <span class="ml10">[分享视频标题：{{titleMsg}}]</span></span></p>
            </div>
            <el-button type="warning" class="btn-left mt10" round size="medium" v-clipboard:copy="shareUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制链接</el-button>
        </el-dialog>
    </div>
</template>
<script>
import $apiUrl from '../../../api/apiUrl.js'
export default {
    name: 'shareTem',
    props:[
	],
	data() {
		return {
            title: '分享视频',
            dialogFormVisible: false,
            $apiUrl:$apiUrl,
            shareUrl:'',
            titleMsg:''
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
            this.titleMsg = obj.title;
            this.shareUrl = $apiUrl.SHARE_URL + 'safetyTrainingDetails?code=' + obj.videoCode
            this.dialogFormVisible = true;
        },
        canBtn() {
            this.titleMsg = '';
            this.shareUrl = ''
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
        onCopy() {
            this.canBtn();
			this.$message.success('分享链接已复制，快去粘贴吧');
		},
		onError() {
			this.$message.error("复制失败");
		}
    }
}
</script>
<style lang="less">
.share-template {
    .share-content {
        width: 90%;
        line-height: 20px;
        border: 1px solid #ffb860;
        background: #fff7e6;
        margin-left: 5%;
        padding: 10px;
    }
    .col-gre {
        font-size: 16px;
        color: #389e0d;
        line-height: 24px;
        cursor: pointer;
    }
    .el-icon-link {
        font-size: 22px;
        transform: rotate(90deg);
        margin-right: 10px;
        margin-left: 5%;
    }
    .btn-left {
         margin-left: 5%;
    }
}


</style>