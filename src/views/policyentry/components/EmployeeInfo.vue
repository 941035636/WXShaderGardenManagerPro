<template>
	<div id="EmployeeInfo">
		<Title :titles="title" :tip="tip"></Title>
		<div class="content">
			<el-form :model="employee" class="demo-ruleForm" label-position="left" label-width="130px" :rules="rules" ref="employee">
				<el-form-item label="从业人员："  prop="employees">
					<el-input placeholder="请输入从业人员" v-model="employee.employees" class="item1" clearable  maxlength="8"></el-input>
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
	name:'EmployeeInfo',
	components:{
		Title
	},
	store,
	data() {
		var checkEmployees = (rule, value, callback) => {
			let Reg = /^[0-9]\d{0,7}$/;
			if (!value && value != 0) {
				return callback(new Error("请输入从业人员"));
			} else if (!Reg.test(value)) {
				callback(new Error("从业人员必须为大于0的8位以内的正整数"));
			} else {
				callback();
			}
		};
		return {
			title:'从业人员信息',
			tip:'被保类型为营业面积、设备数、床位数、参与人数时，从业人员请填0',
			employee:{
				employees:'',
			},
			rules: {
				employees: [{ required: true, validator: checkEmployees, trigger: "blur" }]
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
                        message: '请填写从业人员信息！',
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
#EmployeeInfo{
	background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 20px 40px;
	.content{
		.item1{
			width: 320px;
		}
	}
}
</style>
