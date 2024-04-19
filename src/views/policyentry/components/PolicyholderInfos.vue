<template>
	<div id="PolicyholderInfos">
		<Title :titles="title"></Title>
		<div class="content mt20">
			<el-form :model="form" class="demo-ruleForm" label-position="right" label-width="140px" ref="form">
				<el-form-item label="投保企业名称：">
					<span>{{form.holderName}}</span>
				</el-form-item>
				<el-form-item label="投保企业地址：">
					<span>{{form.provinceName}}/{{form.cityName}}/{{form.countyName}}/{{form.position}}</span>
				</el-form-item>
				<el-form-item label="企业类型：">
					<span>{{form.typeCName}}  -  {{form.typesName}}</span>
				</el-form-item>
				<el-form-item label="统一社会信用代码：" v-if="form.type == '2'">
					<span>{{form.threeInOneCode}}</span>
				</el-form-item>
				<el-form-item label="组织机构代码证：" v-else>
					<span>{{form.threeInOneCode}}</span>
				</el-form-item>
				<el-form-item label="联系人：">
					<span>{{form.person1}}</span>
				</el-form-item>
				<el-form-item label="联系电话：">
					<span>{{form.phone1}}</span>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './Title'
export default {
	name:'PolicyholderInfos',
	components:{
		Title
	},
	props:{
		'form':Object
	},
	data() {
		return {
			title:'投保人信息',
			
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
#PolicyholderInfos{
	background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 20px 40px;
}
</style>
