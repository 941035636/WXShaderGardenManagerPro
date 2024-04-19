<template>
	<div id="AttachmentInfos">
		<Title :titles="title"></Title>
		<div class="content mt20">
			<el-form :model="attachment" class="demo-ruleForm" label-position="right" label-width="140px" ref="attachment">
				<el-form-item label="附件上传：">
					<span style="color: #21E72B;">{{attachment.urlName}}</span>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './Title'
export default {
	name:'AttachmentInfos',
	components:{
		Title
	},
	props:{
		'attachment':Object
	},
	data() {
		return {
			title:'附件信息'
		};
	},
	computed: {
		
	},
	created() {
		
	},
	methods: {

	}
};
</script>

<style lang="less">
#AttachmentInfos{
	margin: 20px 0;
}
</style>
