<template>
	<div id="InsuredInfoOther">
		<Title :titles="title"></Title>
		<div class="content mt20">
			<el-form :model="insureds" class="demo-ruleForm" label-position="right" label-width="130px" ref="insureds">
				<el-form-item label="被保人：">
					<span>{{insureds.entityInfo}}</span>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './Title'
import store from "../../../store/index"
export default {
	name:'InsuredInfoOther',
	components:{
		Title
	},
	props:{
		'areaData':Array
	},
	store,
	data() {
		return {
			insureds:{
				type:'02',
				entityInfo:'详情见清单',
			},
			title:'被保人信息',
		};
  	},
	computed: {
		
	},
	created() {
		
	},
	methods: {
		clearCorp() {
			this.insureds = {
				type:'02',
				entityInfo:'详情见清单',
			};
		},
		submitForm2(insureds){
			let data = this.insureds;
			return data;
		},
		identicals(){
			
		},
	}
};
</script>

<style lang="less">
#InsuredInfoOther{
	background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 20px 40px;
}
</style>
