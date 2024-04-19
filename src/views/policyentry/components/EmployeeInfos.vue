<template>
	<div id="EmployeeInfos">
		<Title :titles="title" :tip="tip"></Title>
		<div class="content">
			<el-form :model="employee" class="demo-ruleForm" label-position="left" label-width="140px" ref="employee">
				<el-form-item label="从业人员："  prop="employees">
					<span>{{employee.employees}}</span>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './Title'
export default {
	name:'EmployeeInfos',
	props:{
		'employee':Object
	},
	components:{
		Title
	},
	data() {
		return {
			title:'从业人员信息',
			tip:'被保类型为营业面积、设备数、床位数、参与人数时，从业人员请填0',
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
#EmployeeInfos{
	margin: 20px 0 40px;
}
</style>
