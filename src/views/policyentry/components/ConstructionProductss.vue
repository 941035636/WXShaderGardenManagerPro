<template>
	<div id="ConstructionProductss">
		<Title :titles="title"></Title>
		<div class="content">
			<el-form :model="employee" class="demo-ruleForm" label-position="left" label-width="150px" ref="employee">
				<el-form-item label="工程合同造价金额：">
					<span>{{employee.costAmount}}</span><span>元</span>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './Title'
export default {
	name:'ConstructionProductss',
	props:{
		'employee':Object
	},
	components:{
		Title
	},
	data() {
		return {
			title:'工程合同造价'
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
#ConstructionProductss{
	margin: 20px 0 40px;
}
</style>
