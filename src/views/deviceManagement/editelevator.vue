<template>
	<div class="eleinformation">
		<div class="modifyele">
			<p>电梯信息</p>
			<span class="elesearch-item1"></span>
		</div>
		<div class="content-form">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="230px" class="demo-ruleForm" size="small">
				<el-form-item label="编号类型">
					<el-radio-group v-model="radio" placeholder="请选择编号类型" @change="changes">
					    <el-radio :label="1">设备代码</el-radio>
					    <el-radio :label="2">出厂编号</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="设备代码" prop="equipmentsCode" v-if="type == 1">
					<el-input v-model.trim="ruleForm.equipmentsCode" autocomplete="off" placeholder="请输入有效的设备代码" class="form-item1"></el-input>
				</el-form-item>
				<el-form-item label="出厂编号" prop="licenceNo" v-if="type == 2">
					<el-input v-model.trim="ruleForm.licenceNo" autocomplete="off" placeholder="请输入有效的出厂编号" class="form-item1"></el-input>
				</el-form-item>
				<el-form-item label="设备代码" v-if="type == 2">
					<el-input v-model.trim="ruleForm.equipmentsCode" autocomplete="off" placeholder="请输入有效的设备代码" class="form-item1"></el-input>
				</el-form-item>
				<el-form-item label="出厂编号" v-if="type == 1">
					<el-input v-model.trim="ruleForm.licenceNo" autocomplete="off" placeholder="请输入有效的出厂编号" class="form-item1"></el-input>
				</el-form-item>
				<el-form-item label="电梯型号" prop="elevatorType">
					 <el-radio-group v-model="ruleForm.elevatorType" placeholder="请选择电梯型号">
					    <el-radio :label="1">直梯</el-radio>
					    <el-radio :label="2">扶梯</el-radio>
						<el-radio :label="3" v-if="ruleForm.productCode == '19PR344296'">货梯</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="电梯载重" prop="weight" v-if="ruleForm.elevatorType == 1">
					<el-input v-model="ruleForm.weight" placeholder="请填写电梯载重" class="form-item1">
						<template slot="append">KG</template>
					</el-input>
				</el-form-item>
				<el-form-item label="提升高度" prop="height" v-if="ruleForm.elevatorType == 2">
				  	<el-input v-model="ruleForm.height" placeholder="请填写提升高度" class="form-item1">
				  		<template slot="append">m</template>
				  	</el-input>
				</el-form-item>
				<el-form-item label="电梯使用场所" prop="elevatorSiteCode">
				  	<el-select v-model="ruleForm.elevatorSiteCode" placeholder="请选择电梯使用场所" class="form-item1" @change="variety1">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="其他场所说明" prop="otherSiteDes">
				  	<el-input v-model.trim="ruleForm.otherSiteDes" placeholder="请填写其他场所说明" autocomplete="off" class="form-item1"></el-input>
				</el-form-item>
				<el-form-item label="电梯使用年限" prop="elevatorYear">
				  	<el-input v-model="ruleForm.elevatorYear" placeholder="请填写电梯使用年限" class="form-item1">
				  		<template slot="append">年</template>
				  	</el-input>
				</el-form-item>
				<el-form-item label="电梯坐落区域" prop="useOfAddress">
				  	<el-select v-model="ruleForm.areaValueFirst" placeholder="请选择" class="form-item4" @change="variety2">
				  		<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
				  	</el-select>
					<el-select v-model="ruleForm.areaValueSecond" placeholder="请选择" class="form-item4" @change="variety3">
						<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-select v-model="ruleForm.areaValueThird" placeholder="请选择" class="form-item4" @change="variety4">
						<el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select><br/>
				  	<el-input v-model="ruleForm.useOfAddress" class="form-item1 form-item3" placeholder="请填写详细地址"></el-input>
				</el-form-item>
				<el-form-item label="生产商名称(品牌)">
				  	<el-input v-model.trim="ruleForm.producerName" placeholder="请输入生产商名称(品牌)" autocomplete="off" class="form-item1"></el-input>
				</el-form-item>
				<el-form-item label="电梯型号">
				  	<el-input v-model.trim="ruleForm.elevatorModel" placeholder="请输入电梯型号" autocomplete="off" class="form-item1"></el-input>
				</el-form-item>
				<el-form-item label="使用单位名称">
				  	<el-input v-model.trim="ruleForm.useOfUnit " autocomplete="off" placeholder="请输入使用单位名称" class="form-item1"></el-input>
				</el-form-item>
				<el-form-item label="电梯安全评价">
				  	<el-select v-model="ruleForm.elevatorLevelCode" placeholder="请选择电梯安全评价" class="form-item1"  @change="variety6">
				  		<el-option v-for="item in options6" :key="item.value" :label="item.label" :value="item.value">
				  		</el-option>
				  	</el-select>
				</el-form-item>
				<el-form-item label="有无专职人员管理">
				  	<el-select v-model="ruleForm.isManaged" placeholder="请选择有无专职人员管理" class="form-item1"  @change="variety7">
				  		<el-option v-for="item in options7" :key="item.value" :label="item.label" :value="item.value">
				  		</el-option>
				  	</el-select>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="ruleForm.comment" class="form-item1" placeholder="请填写备注信息"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')" :disabled="disabled" class="form-item2">保存</el-button>
					<el-button @click="resetForm('ruleForm')" type="info" class="form-item2">关闭</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js'
import elevatorType from '../../../static/data/elevatorType.json';
import placeUse from '../../../static/data/placeUse.json';
import safetyEvaluation from '../../../static/data/safetyEvaluation.json';
import professional from '../../../static/data/professional.json';
export default {
	data() {
		return {
			Elevator:new elevator(),
			options:[],
			options2:[],
			options3:[],
			options4:[],
			options6:[],
			options7:[],
			ruleForm: {
				equipmentsCode:'',
				licenceNo:'',
				elevatorType:'',
				weight:'',
				height:'',
				elevatorSite:'',
				elevatorSiteCode:'',
				otherSiteDes :'',
				elevatorYear:'',
				areaValueFirst:'',
				areaValueSecond:'',
				areaValueThird:'',
				areaCodeFirst:'',
				areaCodeSecond:'',
				areaCodeThird:'',
				useOfAddress:'',
				producerName :'',
				elevatorTypeCode :'',
				elevatorLevel:'',
				elevatorLevelCode:'',
				comment:'',
				other:'',
				useOfUnit :'',
				otherProducerNameDes:'',
				isManaged :'',
				elevatorModel:'',
			},
			rules: {
			  equipmentsCode: [{ required: true, message: '请输入设备编号', trigger: 'blur' },{ min: 20, max: 20, message: '长度为20个字符', trigger: 'blur' }],
			  licenceNo: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
			  elevatorType: [{ required: true, message: '请选择电梯类型', trigger: 'change' }],
			  weight: [{required: true, message: '请输入载重', trigger: 'blur' }],
			  height: [{required: true, message: '请输入提升高度', trigger: 'blur' }],
			  elevatorSite: [{required: true, message: '请选择电梯使用场所', trigger: 'blur' }],
			  elevatorYear: [{required: true, message: '请输入电梯使用年限', trigger: 'blur' }],
			  useOfAddress: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
			},
			radio:1,
			type:'1',
			disabled:false,
		}
	},
	created(){
		this.getElevatorinformation();
		this.productDisplay();
		this.getAreas(); 
	},
	methods: {
		productDisplay(){
			this.options = placeUse.data;
			this.options6 = safetyEvaluation.data;
			this.options7 = professional.data;
		},
		changes(value){
			this.radio = value;
			this.type = value;
		},
		async getElevatorinformation(){
			let res = await this.Elevator.getElevatordetails(this.$route.query.id);
			if(res.code == '0000'){
				let list = res.data;
				this.ruleForm = list
				if(!list.equipmentsCode){
					this.radio = 2;
					this.type = '2';
					this.ruleForm.licenceNo = list.licenceNo;
					this.ruleForm.equipmentsCode = list.equipmentsCode;
				}else{
					this.radio = 1;
					this.type = '1';
					this.ruleForm.equipmentsCode = list.equipmentsCode;
					this.ruleForm.licenceNo = list.licenceNo;
				}
				this.ruleForm.elevatorType = Number(list.elevatorType);
			}
		},
		analysisNumber(){
		    if(this.ruleForm.radio == 1){
				this.ruleForm.equipmentsCode.length = 20;
		    }
		},
		variety1(value){
			let obj = {};
			obj = this.options.find((item)=>{
				return item.value === value;
			});
			this.ruleForm.elevatorSite = obj.label;
			this.ruleForm.elevatorSiteCode = value; 
		},
		variety2(value){
			let obj = {};
			obj = this.options2.find((item)=>{
				return item.value === value;
			});
			this.ruleForm.areaValueFirst  = obj.label;
			this.ruleForm.areaCodeFirst  = value;
			this.ruleForm.areaValueSecond = '';
			this.ruleForm.areaCodeSecond = '';
			this.ruleForm.areaValueThird = '';
			this.ruleForm.areaCodeThird = '';
			this.getAreas(); 
		},
		variety3(value){
			let obj = {};
			obj = this.options3.find((item)=>{
				return item.value == value;
			});
			this.ruleForm.areaValueSecond  = obj.label;
			this.ruleForm.areaCodeSecond  = value;
			this.ruleForm.areaValueThird = '';
			this.ruleForm.areaCodeThird = '';
			this.getAreas(); 
		},
		variety4(value){
			let obj = {};
			obj = this.options4.find((item)=>{
				return item.value == value;
			});
			this.ruleForm.areaValueThird  = obj.label;
			this.ruleForm.areaCodeThird  = value;
			this.getAreas(); 
		},
		variety6(value){
			let obj = {};
			obj = this.options6.find((item)=>{
				return item.value == value;
			});
			this.ruleForm.elevatorLevel = obj.label;
			this.ruleForm.elevatorLevelCode = value; 
		},
		variety7(value){
			this.ruleForm.isManaged= value; 
		},
		async getAreas(){ //获取地区
			const res = await this.Elevator.getAreas();
			if(res.code == '0000'){
				this.options2 = res.data;
				for(var i=0;i<res.data.length;i++){
					if(this.ruleForm.areaCodeFirst == res.data[i].value){
						this.options3 = res.data[i].children;
					}
					for(var j=0;j<this.options3.length;j++){
						if(this.ruleForm.areaCodeSecond == this.options3[j].value){
							this.options4 = this.options3[j].children;
						}
					}
				}
			}
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.disabled = true;
					this.submitForms();
				} else {
					return false;
				}
			});
	  	},
	  async submitForms(){
		let res = await this.Elevator.modifyElevator(this.ruleForm);
		if(res.code == '0000'){
			this.$message({message: '修改成功',type: 'success'});
			this.$router.go(-1);
		}else{
			this.disabled = false;
			return;
		}
	  },
      resetForm(formName) {
        this.$router.go(-1);
      }
	},
}

</script>

<style>
.eleinformation {
	padding-top: 20px;
	padding-bottom: 80px;
	background-color: #ffffff;
}
.modifyele{
	width: 90%;
	height: 46px;
	margin-left: 2%;
	font-size: 18px;
	color: #101010;
}
.elesearch-item1{
	display: block;
	width: 72px;
	height: 3px;
	background-color: #3A48E2;	
}
.content-form{
	width: 90%;
	margin-left: 5%;
}
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
</style>
