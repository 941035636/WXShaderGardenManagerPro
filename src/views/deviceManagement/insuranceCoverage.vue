<template>
	<div class="insuranceCoverage" id="insuranceCoverage">
		<div class="modifyele">
			<p>新增</p>
			<span class="elesearch-item1"></span>
		</div>
		<div class="content-form">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="230px" class="demo-ruleForm" size="small">
				<!-- <el-form-item label="年份" prop="year">
					<el-date-picker v-model="ruleForm.year" type="year" value-format="yyyy" placeholder="请选择年度" style="width: 300px;"></el-date-picker>
				</el-form-item> -->
				<el-form-item label="区域" prop="region">
					<el-cascader :options="options1" v-model="ruleForm.region" placeholder="请选择区域" change-on-select clearable @change="handleChange" class="form-item1" size="small"></el-cascader>
				</el-form-item>
				<el-form-item label="该地区其他渠道投保数量" prop="otherEquipmentsCount">
					<el-input v-model.trim="ruleForm.otherEquipmentsCount" autocomplete="off" placeholder="请输入该地区其他渠道投保数量" class="form-item1"> <template slot="append">部</template></el-input>
				</el-form-item>
				<el-form-item label="该地区保有量" prop="allEquipmentsCount">
					<el-input v-model.trim="ruleForm.allEquipmentsCount" autocomplete="off" placeholder="请输入该地区保有量" class="form-item1"> <template slot="append">部</template></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm(ruleForm)" class="form-item2">保存</el-button>
					<el-button @click="resetForm" type="info" class="form-item2">关闭</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js'
import getCascaderObj from '../userCenter/js/selectedOptions.js';
export default {
	data() {
		var licenceNoNumber = (rule, value, callback) => {
			const licenceReg = /^\d+$/
			if (value == "" && value != 0) {
			return callback(new Error("投保数量不能为空"))
			}
			if (value<0) {
			return callback(new Error("投保数量不能小于0"))
			}
			setTimeout(() => {
				if (licenceReg.test(value)) {
					callback()
				} else {
					callback(new Error("投保数量只能为数字"))
				}
			}, 100)
		};
		var equipmentsCodeNumber = (rule, value, callback) => {
			const equipmentsCodeReg = /^\d+$/
			if (value == "" && value != 0) {
			return callback(new Error("该地区保有量不能为空"))
			}
			if (value<0) {
			return callback(new Error("该地区保有量不能小于0"))
			}
			setTimeout(() => {
				if (equipmentsCodeReg.test(value)) {
					callback()
				} else {
					callback(new Error("该地区保有量只能为数字"))
				}
			}, 100)
		};
		return {
			Elevator:new elevator(),
			select:new getCascaderObj(),
			options1:[],
			provinceName:'',
			cityName:'',
			countryName:'',
			ruleForm: {
				region:[],
				region1:'',
				region2:'',
				region3:'',
				otherEquipmentsCount:0,
				allEquipmentsCount:0,
			},
			rules: {
			  region: [{ required: true, message: '请选择地区', trigger: 'change' }],
			  otherEquipmentsCount: [{validator: licenceNoNumber, required: true,trigger: 'blur' }],
			  allEquipmentsCount: [{ validator: equipmentsCodeNumber,required: true, trigger: 'blur' }],
			},
		}
	},
	created(){
		this.getAreas(); 
	},
	methods: {
		async getAreas(){ //获取地区
			let parmes = await this.Elevator.getAreas();
			if(parmes.code == '0000'){
				this.options1 = parmes.data;
			};
		},
		handleChange(value){
			if(value!=""){
				var vals = this.select.getlable(this.ruleForm.region, this.options1);
				if(vals.length == '1'){
					this.provinceName = vals[0].label;
					this.ruleForm.region1 = vals[0].value;
					this.cityName = "";
					this.ruleForm.region2 = "";
					this.countryName = "";
					this.ruleForm.region3 = "";
				}else if(vals.length == '2'){
					this.provinceName = vals[0].label;
					this.ruleForm.region1 = vals[0].value;
					this.cityName = vals[1].label;
					this.ruleForm.region2 = vals[1].value;
					this.countryName = "";
					this.ruleForm.region3 = "";
				}else{
					this.provinceName = vals[0].label;
					this.ruleForm.region1 = vals[0].value;
					this.cityName = vals[1].label;
					this.ruleForm.region2 = vals[1].value;
					this.countryName = vals[2].label;
					this.ruleForm.region3 = vals[2].value;
				}
			}else{
				this.provinceName = "";
				this.ruleForm.region1 = "";
				this.cityName = "";
				this.ruleForm.region2 = "";
				this.countryName = "";
				this.ruleForm.region3 = "";
			}
		},
		submitForm(ruleForm){
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					this.preservations();
				} else {
					return false;
				}
				
			});
		},
		async preservations(){
			let data = {
				"cityCode":this.ruleForm.region2,
				"cityName":this.cityName,
				"countryCode":this.ruleForm.region3,
				"countryName":this.countryName,
				"equipmentsType":1,
				"provinceCode":this.ruleForm.region1,
				"provinceName":this.provinceName,
				"userCode":window.sessionStorage.getItem("userCode"),
				"otherEquipmentsCount":this.ruleForm.otherEquipmentsCount,
				"allEquipmentsCount":this.ruleForm.allEquipmentsCount
			};
			let parmes = await this.Elevator.getEquipmentdataentry(data);
			if(parmes.code == '0000'){
				this.$message({
          			message: '添加成功',
          			type: 'success'
				});
				this.$router.go(-1);
			}
		},
      	resetForm() {
        	this.$router.go(-1);
      	}
	},
}

</script>

<style lang="less">
#insuranceCoverage {
	padding-top: 20px;
	padding-bottom: 80px;
	background-color: #ffffff;
	.modifyele{
		width: 90%;
		height: 46px;
		margin-left: 2%;
		font-size: 18px;
		color: #101010;
		.elesearch-item1{
			display: block;
			width: 72px;
			height: 3px;
			background-color: #3A48E2;	
		}
	}
	.content-form{
		width: 90%;
		margin-left: 5%;
		.form-item1{
			width: 300px;
		}
		.form-item2{
			width: 100px;
			margin-right: 60px;
		}
		.form-item3{
			margin-top: 10px;
		}
		.form-item4{
			width: 90px;
			margin-right: 10px;
		}
	}
}
</style>
