<template>
	<div id="AddProductInfo">
		<el-dialog title="选择产品" :visible.sync="dialogVisible" :close-on-click-modal="false">
			<span>产品选择：</span>
			<el-select v-model.trim="form.productCode" placeholder="请选择产品" filterable clearable class="item1" @change="Chooseproducts">
				<el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.code"></el-option>
			</el-select>
			<div class="content" v-show="shwo">
				<el-collapse v-model="activeName" accordion>
					<el-collapse-item title="基本险：" name="1">
						<el-row type="flex" class="row-bg" v-for="(item,index) in form.MR" :key="index">
							<el-col :span="8"><div>
								{{item.name}}<span class="mock-button" @click="open(index,'M')" v-if="!item.show">+新增限额值</span>
							</div></el-col>
							<el-col :span="16"><div>
								<span v-for="(item1,index1) in item.list" :key="index1" @change="Selectlimit(index,index1)">
									<el-radio-group v-model="form.radioM[index]">
										<el-radio v-if="item1.showValue / 10000 >= 1" :label="item1.valueCode" style="min-width:110px;">{{item1.showValue/10000}}万元<i class="el-icon-edit" style="float: right;" v-if="item1.Editable" @click="opens(index,'M',item1.showValue)"></i></el-radio>
										<el-radio v-else-if="item1.showValue / 10000 <									 1" :label="item1.valueCode" style="min-width:110px;">{{item1.showValue}}元<i class="el-icon-edit mr10" style="float: right;" v-if="item1.Editable" @click="opens(index,'M',item1.showValue)"></i></el-radio>
										<el-radio v-else :label="item1.valueCode" style="margin-right:20px;">{{item1.showValue}}<i class="el-icon-edit" v-if="item1.Editable"></i></el-radio>
									</el-radio-group>
								</span>
							</div></el-col>
						</el-row>
					</el-collapse-item>
					<el-collapse-item title="附加险：" name="2" v-if="form.itemA.length">
						<el-collapse v-model="activeName1" @change="SelectitemA">
							<el-collapse-item v-for="(item,index) in form.itemA" :key="index" :name="(index + 1)">
								<template slot="title">
									{{item.riskName}}<el-switch v-model="form.radioA[index]" active-color="#13ce66" @change="ControlSwitch(index)"></el-switch>
								</template>
								<el-row type="flex" class="row-bg" v-for="(item1,index1) in item.list" :key="index1">
									<el-col :span="8"><div>
										{{item1.name}}<span class="mock-button" @click="open(index,index1)" v-if="!item1.show">+新增限额值</span>
									</div></el-col>
									<el-col :span="16"><div>
										<span v-for="(item2,index2) in item1.list" :key="index2" @change="Selectlimit1(index,index1,index2,item1)  ">
											<el-radio-group v-model="form.itemA[index].radioA[index1]" >
												<el-radio v-if="item2.showValue / 10000 >= 1" :label="item2.valueCode" style="min-width:110px;">{{item2.showValue/10000}}万元<i class="el-icon-edit mr10" style="float: right;" v-if="item2.Editable" @click="opens(index,index1,item2.showValue)"></i></el-radio>
												
												<el-radio v-else-if="item2.showValue / 10000 < 1" :label="item2.valueCode" style="min-width:110px;">{{item2.showValue}}元<i class="el-icon-edit mr10" style="float: right;" v-if="item2.Editable" @click="opens(index,index1,item2.showValue)"></i></el-radio>

												<el-radio v-else :label="item2.valueCode" style="margin-right:20px;">{{item2.showValue}}<i class="el-icon-edit ml10" v-if="item2.Editable" @click="opens(index,index1,item2.showValue)"></i></el-radio>
											</el-radio-group>
										</span>
									</div></el-col>
								</el-row>
							</el-collapse-item>
						</el-collapse>
					</el-collapse-item>
				</el-collapse>
			</div>
			<div class="content-footer" v-show="shwo">
				<el-button @click="resetForm()" round class="footer1">取消</el-button>
				<el-button type="warning" @click="submitForm()" round class="footer2">确认提交</el-button>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="centerDialogVisible" width="30%" :close-on-click-modal="false" :show-close="false">
			<el-form :model="forms" :rules="rules" ref="forms" label-width="80px" class="demo-ruleForm">
				<el-form-item label="限额值" prop="value">
					<el-input v-model="forms.value" placeholder="请输入限额值" @input="ConvertUppercase"></el-input>
					<span class="capitalize">大写：{{forms.name}}</span>
				</el-form-item>
				<el-form-item>
					<el-button @click="centerDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="AddLimitValue('forms')" v-if="identification == 'M'">确 定</el-button>
					<el-button type="primary" @click="AddLimitValues('forms')" v-if="identification == 'A'">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import PolicyentryService from '../../../service/PolicyentryService'
import getProductData from '../js/getProductData'
import getProductDatas from '../js/getProductDatas'
import SchemeVerification from '../js/SchemeVerification'
import transform from '../js/transform'
export default {
	name:'AddProductInfo',
	
	data() {
		var checkValue = (rule, value, callback) => {
			let Reg = /^[1-9]\d{0,7}$/;
			if (!value) {
				callback();
			} else if (!Reg.test(value)) {
				callback(new Error("限额值为1-8位的正整数"));
			} else {
				callback();
			}
		};
		return {
			dialogVisible:false,
			PolicyentryService:new PolicyentryService(),
			getProductData:new getProductData(),
			getProductDatas:new getProductDatas(),
			SchemeVerification:new SchemeVerification(),
			Transform:new transform(),
			options:[],
			form:{
				productCode:'',
				productName:'',
				projectCode:'',
				projectName:'',
				radioM:[],
				itemM:[],
				itemA:[],
				MR:[],
				radioA:[],
				ygBranchFlag:false,
				productType:''
			},
			shwo:false,
			activeName:'1',
			activeName1:[],
			centerDialogVisible:false,
			forms:{
				value:'',
				name:''
			},
			rules:{
				value:{ required: true, validator: checkValue, trigger: "blur" }
			},
			index:0,
			index1:0,
			identification:'M',
			selectContract:''
		};
  },
	computed: {
		
	},
	created() {

	},
	methods: {
		Opendialog(data){ // 打开选择产品弹框
			if(!data.productCode){
				this.form = {
					productCode:'',
					productName:'',
					projectCode:'',
					projectName:'',
					radioM:[],
					itemM:[],
					itemA:[],
					MR:[],
					radioA:[],
					ygBranchFlag:false,
					productType:''
				};
				this.shwo = false;
			}else{
				this.form = data;
				this.shwo = true;
				this.activeName = '1';
				this.activeName1 = [];
				this.form.radioA.forEach((item,index) =>{
					if(item){
						this.activeName1.push(Number(index +1))
					}
				})
			}
			this.dialogVisible = true;
			this.getProductList();
		},
		async getProductList(){ // 获取产品列表
			let areaCodeList = [];
			if(sessionStorage.getItem('branchCode') == 'JT0000'){
				areaCodeList = ['000000']
			}else{
				areaCodeList = sessionStorage.getItem('authDataArea').split(',')
			}
			let data = {
				'areaCodeList':areaCodeList,
				'clientNoList':['offline'],
				'pn':1,
				'ps':100,
				'upOrDown':'0',
				'needDetails':'0'
			};
			let res = await this.PolicyentryService.getProductList(data);
			if(res.code == '0000' && res.list){
				this.options = res.list;
			}
		},
		async Chooseproducts(val){ // 查询产品信息
			this.form = {
				productCode:val,
				productName:'',
				projectCode:'',
				projectName:'',
				radioM:[],
				itemM:[],
				itemA:[],
				MR:[],
				radioA:[],
				productSort:''
			};
			this.activeName = '1';
			this.activeName1 = [];
			let res = await this.PolicyentryService.productDetalis(val);
			if(res.code == '0000'){
				this.form.productName = res.data.name;
				this.form.projectCode = res.data.projectCode;
				this.form.projectName = res.data.projectName;
				this.form.productSort = res.data.attrInfoDTOList.find(item => item.attrCode == 'productSort').attrDTOList[0].valueMark;
				this.form.ygBranchFlag = res.data.attrInfoDTOList.find(item => item.attrCode == 'tipYG') ? res.data.attrInfoDTOList.find(item => item.attrCode == 'tipYG').attrDTOList[0].valueMark : false;
				this.form.productType = res.data.attrInfoDTOList && res.data.attrInfoDTOList.find(item => item.attrCode == 'classify')?res.data.attrInfoDTOList.find(item => item.attrCode == 'classify').attrDTOList[0].value:false,
				this.selectContract = res.data.attrInfoDTOList.find(item => item.attrCode == 'selectContract') ? res.data.attrInfoDTOList.find(item => item.attrCode == 'selectContract').attrDTOList[0].valueMark : 'N';
				let inusureCompanys = [];
				res.data.inusureCompanyList.forEach(item =>{
					if(item.partyRole == '2' && item.insuringType == 'Y'){
						inusureCompanys.push(item)
					}
				});
				inusureCompanys.forEach(item =>{
					res.data.inusureCompanyList.forEach(item1 =>{
						if(item.code == item1.code && item1.shareScale){
							item.shareScale = item1.shareScale;
						}
					});
				})
				sessionStorage.setItem('inusureCompanysData',JSON.stringify(res.data.inusureCompanyList))
				sessionStorage.setItem('inusureCompanys',JSON.stringify(inusureCompanys))
			}
			let response = await this.PolicyentryService.getRiskDisplay(val);
			if(response.code == '0000'){
				let data = this.getProductDatas.getProductDatas(response.list);
				this.form.itemM = data.itemM;
				this.form.MR = data.MR;
				this.form.itemA = data.itemA;
				this.form.radioA = data.radioA;
				this.shwo = true;
			}
		},
		open(index,index1){
			this.forms = {
				value:'',
				name:''
			};
			this.index = index;
			this.index1 = index1;
			this.identification = (index1 == 'M')?'M':'A';
			this.centerDialogVisible = true;

		},
		opens(index,index1,showValue){
			this.forms = {
				value:showValue,
				name:this.Transform.ControlSwitchs(showValue) + '元'
			};
			this.index = index;
			this.index1 = index1;
			this.identification = (index1 == 'M')?'M':'A';
			this.centerDialogVisible = true;

		},
		AddLimitValue(forms){ // 基本险增加限额值
			if(!this[forms].value) {
				this.$message({
					message: "请输入限额值",
					type: "warning"
				});
				return
			}
			this.$refs[forms].validate((valid) => {
				if (valid) {
					if(this.form.MR[this.index].list[0].valueCode == '20XEZSAFETY1'){
						this.form.MR[this.index].list[0].showValue = this.forms.value;
						this.form.itemM[0].duties[0].dutyLimits[this.index].list[0].showValue = this.forms.value;
						this.form.radioM[this.index] = this.form.MR[this.index].list[0].valueCode;
					}else{
						let obj = {
							limitValue: "",
							showValue: this.forms.value,
							unifiedCode: "",
							valueCode: "20XEZSAFETY1",
							Editable:true
						}
						this.form.MR[this.index].show = true;
						this.form.MR[this.index].list.unshift(obj)
						// this.form.itemM[0].duties[0].dutyLimits[this.index].list.unshift(obj)
						this.form.radioM[this.index] = obj.valueCode;
					}
					this.Selectlimit(this.index,0);
					this.centerDialogVisible = false;
				} else {
					return false;
				}
			});
		},
		Selectlimit(index,index1){ // 选择基本险限额
			this.form.MR[index].list.forEach((ele3,i) =>{
				if(i == index1){
					this.form.MR[index].list[index1].disabled = true;
				}else{
					this.form.MR[index].list[i].disabled = false;
				}
			})
			this.form.itemM.forEach(ele =>{
				ele.duties.forEach(ele1 =>{
					ele1.dutyLimits.forEach((ele2,index2) =>{
						if(index2 == index){
							ele2.list.forEach((ele4,i) =>{
								if(i == index1){
									ele4.disabled = true;
								}else{
									ele4.disabled = false;
								}
							})
						}
					})
				})
			})
		},
		ControlSwitch(index){
			if(!this.form.radioA[index]){
				this.form.itemA[index].radioA = [];
				this.form.itemA[index].list.forEach(ele1 =>{
					this.form.itemA[index].duties.forEach(ele3 =>{
						ele3.dutyLimits.forEach(ele4 =>{
							if(ele4.code == ele1.code){
								ele4.disabled = false;
								ele4.list.forEach((ele5,i5) =>{
									ele5.disabled = false;
								})
							}
						})
					})
					ele1.disabled = false;
					ele1.list.forEach((ele2,i2) =>{
						ele2.disabled = false;
					})
				})
			}
		},
		SelectitemA(val){
			let list = [];
			this.form.itemA.forEach(item =>{
				list.push(false)
			})
			val.forEach(item =>{
				list[item -1] = true;
			})
			this.form.radioA = list
			this.form.radioA.forEach((item1,index1) =>{
				if(!this.form.radioA[index1]){
					this.form.itemA[index1].list.forEach(ele1 =>{
						this.form.itemA[index1].duties.forEach(ele3 =>{
							ele3.dutyLimits.forEach(ele4 =>{
								if(ele4.code == ele1.code){
									ele4.disabled = false;
									ele4.list.forEach(ele5 =>{
										ele5.disabled = false;
									})
								}
							})
						})
						ele1.disabled = false;
						ele1.list.forEach(ele2 =>{
							ele2.disabled = false;
						})
						this.form.itemA[index1].radioA = [];
					})
				}
			})
			if(!this.form.radioA.length){
				this.form.itemA.forEach(ele =>{
					ele.list.forEach(ele1 =>{
						ele1.disabled = false;
						ele1.list.forEach(ele2 =>{
							ele2.disabled = false;
						})
					})
					ele.duties.forEach(ele2 =>{
						ele2.dutyLimits.forEach(ele3 =>{
							ele3.disabled = false;
							ele3.list.forEach(ele4 =>{
								ele4.disabled = false;
							})
						})
					})
					ele.radioA = [];
				})
			}
		},
		AddLimitValues(forms){
			if(!this[forms].value) {
				this.$message({
					message: "请输入限额值",
					type: "warning"
				});
				return
			}
			this.$refs[forms].validate((valid) => {
				if (valid) {
					if(this.form.itemA[this.index].list[this.index1].list[0].valueCode == '20XEZSAFETY2'){
						this.form.itemA[this.index].list[this.index1].list[0].showValue = this.forms.value;
						this.form.itemA[this.index].duties[0].dutyLimits[this.index1].list[0].showValue = this.forms.value;
						this.form.itemA[this.index].radioA[this.index1] = this.form.itemA[this.index].list[this.index1].list[0].valueCode;
					}else{
						let obj = {
							limitValue: "",
							showValue: this.forms.value,
							unifiedCode: "",
							valueCode: "20XEZSAFETY2",
							Editable:true
						}
						// this.form.itemA[this.index].duties[0].dutyLimits[this.index1].list.unshift(obj)
						this.form.itemA[this.index].list[this.index1].show = true;
						this.form.itemA[this.index].list[this.index1].list.unshift(obj)
						this.form.itemA[this.index].radioA[this.index1] = obj.valueCode;
					}
					this.Selectlimit1(this.index,this.index1,0,this.form.itemA[this.index].list[this.index1]);
					this.centerDialogVisible = false;
				} else {
					return false;
				}
			});
		},
		Selectlimit1(index,index1,index2,item1){ // 选择基本险限额
			this.form.itemA.forEach((ele,i) =>{
				if(i == index){
					ele.list.forEach((ele1,i1) =>{
						if(i1 == index1){
							ele1.disabled = true;
							ele1.list.forEach((ele2,i2) =>{
								if(i2 == index2){
									ele2.disabled = true;
								}else{
									ele2.disabled = false;
								}
							})
						}
					})
					ele.duties.forEach(ele3 =>{
						ele3.dutyLimits.forEach(ele4 =>{
							if(ele4.code == item1.code){
								ele4.disabled = true;
								ele4.list.forEach((ele5,i5) =>{
									if(i5 == index2){
										ele5.disabled = true;
									}else{
										ele5.disabled = false;
									}
								})
							}
						})
					})
				}
			})
		},
		ConvertUppercase(val){
			this.forms.name = this.Transform.ControlSwitchs(val) + '元'
		},
		resetForm(){ //取消
			this.dialogVisible = false;
		},
    	submitForm(){ // 确定
			this.$emit('funcYG',this.form.ygBranchFlag);
			this.$emit('funcLHB',this.form.productType);
			let item  = this.SchemeVerification.getSchemeVerification(this.form);
			if(item.rules){
				let data = this.getProductData.getProductData(this.form)
        		this.$emit('func',data);
        		// Bus.$emit("productBus",this.form.projectCode)
				this.$parent.$parent.setProductSort(this.form.productSort)
				this.$parent.$parent.setContractFlag(this.selectContract)
				this.dialogVisible = false;
			}else{
				this.$message({
					message: "请选择" + item.name,
					type: "warning"
				});
			}
		},
	}
};
</script>

<style lang="less">
#AddProductInfo{
	.el-dialog{
		width: 80%;
		.item1{
			width: 400px;
		}
		.content{
			width: 98%;
			margin-top: 20px;
			padding: 0 1%;
			border: 1px solid #ECECEC;
			box-sizing: border-box;
			.row-bg{
				line-height: 40px;
				.mock-button{
					cursor: pointer;
					color: #208ded;
					margin-left: 20px;
				}
			}
		}
		.content-footer{
			width: 100%;
			line-height: 80px;
			text-align: center;
			.footer1{
				width: 110px;
				text-align: center;
			}
			.footer2{
				width: 160px;
				text-align: center;
			}
		}
		.capitalize{
			display: block;
			line-height: 50px;
		}
	}	
}
</style>
