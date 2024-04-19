<template>
	<div id="InsuredInfos">
		<Title :titles="title"></Title>
		<div class="content mt20">
			<el-form :model="insureds" class="demo-ruleForm" label-position="right" label-width="140px" ref="insureds">
				<el-form-item label="同投保人：">
					<el-switch v-model="insureds.value" active-color="#6683D5" disabled></el-switch>
				</el-form-item>
				<el-form-item label="被保企业名称：">
					<span>{{insureds.holderName}}</span>
				</el-form-item>
				<el-form-item label="被保企业地址：">
					<span>{{insureds.provinceName}}/{{insureds.cityName}}/{{insureds.countyName}}/{{insureds.position}}</span>
				</el-form-item>
				<el-form-item label="统一社会信用代码：" v-if="insureds.type == '2'">
					<span>{{insureds.threeInOneCode}}</span>
				</el-form-item>
				<el-form-item label="组织机构代码证：" v-else>
					<span>{{insureds.threeInOneCode}}</span>
				</el-form-item>
				<el-form-item label="联系人：">
					<span>{{insureds.person1}}</span>
				</el-form-item>
				<el-form-item label="联系电话：">
					<span>{{insureds.phone1}}</span>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './Title'
export default {
	name:'InsuredInfos',
	props:{
		'insureds':Object
	},
	components:{
		Title
	},
	data() {
		return {
			title:'被保人信息'
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
#InsuredInfos{
	background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 20px 40px;
	.content{
		.options{
			margin-bottom: 20px;
		}
	}
}
</style>
