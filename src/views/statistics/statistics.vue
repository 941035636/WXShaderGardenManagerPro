<template>
	<div class="statistics" id="statistics">
		<el-tabs v-model="activeName" @tab-click="handleClick" class="content1">
			<el-tab-pane label="电梯投保概览" name="1">
				<statistical-data :activeName="activeName"></statistical-data>
			</el-tab-pane>
			<!-- <el-tab-pane label="案件投保概览" name="2"> -->
				<!-- <statistical-data :activeName="activeName"></statistical-data> -->
			<!-- </el-tab-pane> -->
		</el-tabs>
	</div>
</template>

<script>
import statisticalData from "./statisticalData";
export default {
	components: {
		'statistical-data':statisticalData,
    },
	data() {
		return {
           	activeName:'1',    
		}
	},
	computed:{
       
	},
	mounted() {
	
	},
	methods: {
		handleClick(tab) {
			
      	},
	},
}

</script>

<style lang="less">
#statistics{
	padding-top: 20px;
	padding-bottom: 80px;
	background-color: #ffffff;
	.content1{
		width: 96%;
		margin-left: 2%;
	}
}
</style>
