<template>
	<div id="ConstructionProducts">
		<Title :titles="title"></Title>
		<div class="content">
			<el-form :model="employee" class="demo-ruleForm" label-position="left" label-width="150px" :rules="rules" ref="employee">
				<el-form-item label="工程合同造价金额：" prop="costAmount">
					<el-input placeholder="请输入工程合同造价金额" v-model="employee.costAmount" class="item1" maxlength="15">
						<span slot="append">元</span>
					</el-input>
				</el-form-item>
				<el-form-item style="display:none;">
					<el-button type="primary" @click="submitForm4(employee)" round>保存并选择</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import Title from './Title'
import store from "../../../store/index"
export default {
	name:'ConstructionProducts',
	components:{
		Title
	},
	store,
	data() {
		var checkEmployees = (rule, value, callback) => {
			let Reg = /^\d+(\.\d{0,2})?$/;
			if (!value) {
				return callback(new Error("请输入工程合同造价金额"));
			} else if (!Reg.test(value)) {
				callback(new Error("请输入大于0的数字，小数保留两位，15位以内"));
			} else {
				callback();
			}
		};
		return {
			title:'工程合同造价',
			employee:{
				costAmount:'',
			},
			rules: {
				costAmount: [{ required: true, validator: checkEmployees, trigger: "blur" }]
			},
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
		getData(){
			this.employee = this.$store.getters.employeeInfo;
		},
		submitForm4(employee){
			let data = {};
			this.$refs.employee.validate((valid) => {
				if (valid) {
					data = this.employee;
				} else {
					this.$message({
                        message: '请填写工程合同造价金额！',
                        type: 'warning'
                    });
					return false;
				}
			});
			return data;
        },
	}
};
</script>

<style lang="less">
#ConstructionProducts{
	margin: 20px 0 40px;
	.content{
		.item1{
			width: 350px;
		}
	}
}
</style>
