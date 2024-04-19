<template>
  <!-- 关联保单 -->
	<div class="relationPolicy" id="relationPolicy">
    <!-- 关联保单 -->
		<el-dialog title="关联保单" :visible.sync="exhibition" width="40%" :close-on-click-modal='false'>
			<el-form ref="insurance" :model="insurance" label-width="140px" :rules="rules">
				<el-form-item label="保单号:" prop="policyNo">
					<el-input size="mini" v-model.trim="insurance.policyNo" style="width:70%;"></el-input>
					<el-button  :disabled="isManualFlag" size="mini" @click="relation">查询</el-button>
					<div style="width:77%; background-color: #d8f9ef;margin-top:5px;padding: 0 10px;height: 30px;line-height: 30px;color: #00c699;border-radius: 8px;"><i class="iconfont iconinfo1"></i> 关联保单：查询保单 或 手动录入保单信息</div>
				</el-form-item>
				<el-form-item>
					<el-switch  v-model="isManualFlag" active-color="#13ce66" @change="setIsManualFlag" active-text="手动录入保单信息"></el-switch>
				</el-form-item>
        <!-- 回显查询保单嘻嘻 -->
				<div v-if="!isManualFlag && data1.userCode">
					<el-form-item >
						<div>
							<span style="color:#D69736">查询成功!保单详情回显:</span>
						</div>
						<div>
							<span>保单号:</span>
							<span>{{data1.policyNo}}</span>
						</div>
						<div>
							<span>产品名称:</span>
							<span>{{data1.productName}}</span>
						</div>
						<div>
							<span>出单公司:</span>
							<span>{{data1.issueCompanyName}}</span>
						</div>
						<div>
							<span>被保人名称:</span>
							<span>{{data1.insuredName}}</span>
						</div>
						<div>
							<span>投保人名称:</span>
							<span>{{data1.holderName}}</span>
						</div>
						<div>
							<span>保险期间:</span>
							<span>{{data1.polStartDate}}</span>
							<span>{{data1.polEndDate}}</span>
						</div>
						<div>
							<span>保费:</span>
							<span>{{Number(data1.premium).toFixed(2)}}</span>
							<span>元</span>
						</div>
					</el-form-item>
				</div>
        <el-form-item label="报案险种:" prop="riskType">
					<el-select size="mini" :disabled="!isManualFlag" v-model="insurance.riskType" filterable placeholder="请选择险种" style="width:70%;">
						<el-option v-for="(item,key) in riskTypeList" :key="key" :label="item.name" :value="item.code"></el-option>
					</el-select>
          <div v-if="isManualFlag" style="width:67%; background-color: #FFF7E6;margin-top:5px;padding: 0 10px;height: 60px;line-height: 30px;color: #FA8C16;border-radius: 8px;">
            <p>1、电梯、雇主、团意、索道：填写投保人名称</p>
            <p>2、物业、家政：填写被保人名称 </p>
          </div>
				</el-form-item>
        <!-- 手动录入保单信息 -->
        <div v-if="isManualFlag">
          <!-- 家政和物业在关联保单的时候将被保人名称字段放到投保投保人名称字段里面（和杰哥确认过的） -->
          <el-form-item label="被保人名称:"  v-if="(insurance.riskType=='jz'  || insurance.riskType=='wy') && isManualFlag" prop="holderOrInsuredName">
            <el-input size="mini" v-model.trim="insurance.holderOrInsuredName" style="width:70%;"></el-input>
          </el-form-item>
          <el-form-item label="投保人名称:"  v-if="insurance.riskType !='jz' && insurance.riskType !='wy' && isManualFlag" prop="holderName">
            <el-input size="mini" v-model.trim="insurance.holderName" style="width:70%;"></el-input>
          </el-form-item>
          <el-form-item label="保费:" prop="premium">
            <el-input size="mini" v-model.trim="insurance.premium" style="width:70%; padding-top:7px"><template slot="append">元</template></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="保险起期:" prop="polStartDate">
                <el-date-picker size="mini" v-model="insurance.polStartDate" type="date"  class="item5"  placeholder="保险起期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-form-item label="至" label-width="50px">
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item  label="" label-width="40px" prop="polEndDate">
                <el-date-picker size="mini" v-model="insurance.polEndDate" type="date" class="item5" placeholder="保险止期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="出单公司:" prop="issueCompanyName">
            <el-input size="mini" v-model.trim="insurance.issueCompanyName" style="width:70%;"></el-input>
          </el-form-item>
          <el-form-item label="产品名称:"  prop="productName">
            <el-input size="mini" v-model.trim="insurance.productName" style="width:70%;"></el-input>
          </el-form-item>
        </div>
        <!-- 查询到的保单,并且标的数据标识为true -->
        <div v-else-if="!isManualFlag && biDiIsConent">
          <el-form-item label="设备代码:" v-if="insurance.riskType == 'dt'" :rules="{required: true, message: '请选择出险设备', trigger: 'blur' }">
            <el-select size="mini" v-model="insurance.devicecode" filterable placeholder="请选择事故设备代码" style="width:70%;" @change="selectionEquipment">
              <el-option v-for="item in datas" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出险人员:" v-if="insurance.riskType=='gz' || insurance.riskType=='ty' || insurance.riskType=='jz'" :rules="{required: true, message: '请选择出险人员', trigger: 'blur' }">
            <el-select size="mini" v-model="insurance.insuredName" filterable placeholder="请选择出险人员" style="width:70%;" @change="selectionEquipment">
              <el-option v-for="item in datas" :key="item.value2" :label="item.label2" :value="item.value2">
                <span style="float: left">{{item.label2}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{item.value2}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物业项目:" prop="propertyName" v-if="insurance.riskType=='wy'" :rules="{required: true, message: '项目名称不能为空', trigger: 'blur' }">
            <el-select size="mini" v-model="insurance.propertyName" filterable placeholder="请选择出险人员" style="width:70%;" @change="selectionEquipment" >
              <el-option v-for="item in datas" :key="item.propertyName" :label="item.propertyName" :value="item.propertyName">
                <span style="float: left">{{item.propertyName}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="索道名称:" prop="ropewayName" v-if="insurance.riskType=='sd'">
            <el-select size="mini" v-model="insurance.ropewayName" filterable placeholder="请选择索道名称" style="width:70%;" @change="selectionEquipment">
              <el-option v-for="item in datas" :key="item.value" :label="item.label1" :value="item.value1"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- 手动关联表单，标的数据为空的时候 -->
        <div v-if="isManualFlag || (!isManualFlag && !biDiIsConent)">
          <el-form-item label="设备代码:" prop="value" v-if="insurance.riskType == 'dt'" :rules="{required: true, message: '设备代码不能为空', trigger: 'blur' }">
            <el-input size="mini" v-model.trim="insurance.value" style="width:70%;"></el-input>
          </el-form-item>
          <el-form-item label="电梯坐落地址:" prop="elevatorSeatAddress"  v-if="insurance.riskType == 'dt'" :rules="{required: true, message: '电梯坐落地址不能为空', trigger: 'blur' }">
            <el-input size="mini" v-model.trim="insurance.elevatorSeatAddress" style="width:70%;"></el-input>
          </el-form-item>
          <el-form-item label="索道名称:" prop="label1"  v-if="insurance.riskType=='sd'" :rules="{required: true, message: '索道名称不能为空', trigger: 'blur' }">
            <el-input size="mini" v-model.trim="insurance.label1" style="width:70%;"></el-input>
          </el-form-item>
          <el-form-item label="出险人员姓名:" prop="label2"  v-if="insurance.riskType=='gz' || insurance.riskType=='ty' || insurance.riskType=='jz'" :rules="{required: true, message: '出险人员姓名不能为空', trigger: 'blur' }">
            <el-input size="mini" v-model.trim="insurance.label2" style="width:70%;"></el-input>
          </el-form-item>
          <el-form-item label="出险人员证件号码:" prop="value2" v-if="insurance.riskType=='gz' || insurance.riskType=='ty' || insurance.riskType=='jz'" :rules="{required: true, message: '出险人员证件号码不能为空', trigger: 'blur' }">
            <el-input size="mini" v-model.trim="insurance.value2" style="width:70%;"></el-input>
          </el-form-item>
          <el-form-item label="出险人员岗位类型:" v-if="insurance.riskType == 'jz'" prop="postName">
            <el-select size="mini"  v-model="insurance.postName" filterable placeholder="请选择人员岗位类型" style="width:70%;">
              <el-option v-for="item in userTypeList" :key="item.value" :label="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物业项目名称:" prop="propertyName"  v-if="insurance.riskType=='wy'" :rules="{required: true, message: '项目名称不能为空', trigger: 'blur' }">
            <el-input size="mini" v-model.trim="insurance.propertyName" style="width:70%;"></el-input>
          </el-form-item>
        </div>
			</el-form>
			<div class="btn mt20">
        <span class="btn-left" @click="close">取消</span>
        <span class="btn-right" @click="relationpolicyNo('insurance')">确认提交</span>
      </div>
		</el-dialog>
	</div>
</template>

<script>
import CaseService from '@/service/CaseService.js';
import ProductService from '@/service/ProductService.js';
import RelatedPolicyData from '../js/RelatedPolicyData.js';
import caseSettleType from '../../../../static/data/caseSettleType.json';
import jiaZhengUserType from '../../../../static/data/jiaZhengUserType.json';
import moment from 'moment'
export default {
  props:{
  },
	data() {
    var checkCardNum= (rule, value, callback) => {
			var reg = /^[A-Za-z0-9]{5,22}$/;
            if (value === '') {
                callback(new Error('请输入出险人员证件号码'));
            } else if (!reg.test(value)) {
                callback(new Error('请输入正确的证件号码(5-22位数字、字母)!'));
            } else {
                callback();
            }
        };
		var checkNumber = (rule, value, callback) => {
			const numberReg = /^\d+(\.\d+)?$/
			if (!value) {
			return callback(new Error("保费不能为空"))
			}
			if (value<0 || value > 100000000) {
			return callback(new Error("保费必须大于0小于100000000"))
			}
			setTimeout(() => {
				if (numberReg.test(value)) {
					callback()
				} else {
					callback(new Error("保费只能为数字"))
				}
			}, 100)
		};
		return {
			RelatedPolicyData:new RelatedPolicyData(),
      productService: new ProductService(),
			caseService: new CaseService(),
      riskTypeList:caseSettleType.riskTypeList,
      userTypeList:jiaZhengUserType.userTypeList,
      insurance:{
				policyNo:'',
				devicecode:'',
				insuredName:'',
				ropewayName:'',
				premium:'',
				productName:'',
				polEndDate:'',
				polStartDate:'',
				channelCode: "sequip",
				channelName: "特设渠道",
				value: '',
				elevatorSeatAddress: '',
				label1: '',
				label2: '',
				value2: '',
				postName:'',
				issueCompanyName:'',
				holderName:'',
				holderOrInsuredName:'',
				propertyName:'',
        riskType:'',
			},
      selecttdata:{
				elevatorSeatAddress:'',
				theElevatorType:'',
				value:'',
				value1:'',
				label1:'',
				value2:'',
				label2:'',
				propertyName:''
			},
      datas:[], // 标的数据
      biDiIsConent:true,  // 标的是否有值，默认有值
			data1:{}, // 当前保单数据
			currentItem:{},
      exhibition:false, // dialog弹出窗
			isManualFlag:false, // 是否手动录入
      rules:{
				settleType: [
					{required: true, message: '请选择结案类型', trigger: 'change'}
				],
				riskType: [
					{required: true, message: '请选择报案险种', trigger: 'change'}
				],
				settlementContent: [
					{required: true, message: '请输入结案说明', trigger: 'change'}
				],
				closeAuditorCode: [
					{required: true, message: '请选择审核人员', trigger: 'change'}
				],
				auditOpinion: [
					{required: true, message: '请选择审核类型', trigger: 'change'}
				],
				reviewComments: [
					{required: true, message: '请输入审核说明', trigger: 'change'}
				],
				policyNo: [
					{required: true, message: '请输入保单号', trigger: 'blur'},
					// { min: 10, max: 30, message: '保单号10-30位', trigger: 'blur' }
				],
				devicecode: [
					{required: true, message: '请选择设备', trigger: 'change'}
				],
				holderName: [
					{required: true, message: '请输入投保人名称', trigger: 'blur'}
				],
				holderOrInsuredName: [
					{required: true, message: '请输入被保人名称', trigger: 'blur'}
				],
				insuredName: [
					{required: true, message: '请选择出险人员', trigger: 'change'}
				],
				ropewayName: [
					{required: true, message: '请选择索道', trigger: 'change'}
				],
				premium: [
					{required: true,validator: checkNumber, trigger: 'blur' }
					],
				polEndDate: [
					{required: true, message: '保险止期不能为空', trigger: 'change' }
				],
				polStartDate: [
					{required: true, message: '保险起期不能为空', trigger: 'change' }
				],
				productName: [
					{required: true, message: '产品名称不能为空', trigger: 'change' }
				],
				value: [
					{required: true, message: '设备代码不能为空', trigger: 'blur'},
					{min: 15, max: 25, message: '设备代码10-30位', trigger: 'blur'}
				],
				elevatorSeatAddress: [
					{required: true, message: '电梯坐落地址不能为空', trigger: 'blur'},
					{min: 6, max: 100, message: '保单号6-100位', trigger: 'blur'}
				],
				label2: [
					{required: true, message: '出险人员姓名不能为空', trigger: 'blur'},
					{min: 2, max: 10, message: '出险人员姓名2-10位', trigger: 'blur'}
				],
				value2: [
					{required: true, validator: checkCardNum, trigger: 'blur'},
					{min: 5, max: 22, message: '出险人员证件号码5-22位', trigger: 'blur'}
				],
				postName: [
					{required: true, message: '请选择岗位类型', trigger: 'change' }
				],
				issueCompanyName: [
					{required: true, message: '请输入出单公司', trigger: 'blur' }
				],
			},
    }
	},
	created(){
	},
	methods: {
    // 初始化数据
    openInit(val) {
      this.exhibition = true;
      let {riskType = ''} = val
      console.log(riskType);
      this.insurance.riskType = riskType
			this.currentItem = val
    },
    // 变更是否手动录入保单数据
    setIsManualFlag() {
      this.data1 = {}
      this.datas = [] // 标的数据
      this.biDiIsConent = true  // 标的是否有值，默认有值
      this.resetInsuranceForm()
    },
    // 变更重置form表单
    resetInsuranceForm() {
      for(let key in this.insurance) {
        if(key === 'channelCode' || key === 'channelName' || key === 'riskType') {
          this.$set(this.insurance,key,this.insurance[key])
        } else {
          this.$set(this.insurance,key,"")
        }
      }
    },
    // 选择标的数据
    selectionEquipment(value){
			if(this.insurance.riskType == 'dt'){
				this.datas.forEach(item => {
					if(value == item .value){
						this.selecttdata = item;
					}
				});
			}else if(this.insurance.riskType == 'gz' || this.insurance.riskType == 'ty'){
				this.datas.forEach(item => {
					if(value == item.value2){
						this.selecttdata.label2 = item.label2;
						this.selecttdata.value2 = item.value2;
					}
				});
			}else if(this.insurance.riskType == 'sd'){
				this.datas.forEach(item => {
					if(value == item .value1){
						this.selecttdata = item;
					}
				});
			}else if(this.insurance.riskType == 'jz'){
				this.datas.forEach(item => {
					if(value == item.value2){
						this.selecttdata.label2 = item.label2;
						this.selecttdata.value2 = item.value2;
						this.selecttdata.postName = item.postName;
					}
				});
			}else if(this.insurance.riskType == 'wy'){
				this.selecttdata.propertyName = value;
			}
		},
    // 确认提交
    relationpolicyNo(name){
			this.$refs[name].validate((valid) => {
				if (valid) {
					if(this.insurance.productName && (this.insurance.productName < 2 || this.insurance.productName > 50)) {
						this.$message({
							type: 'error',
							message: '产品名称位数2-50位。'
						});
						return false;
					}
					if(new Date(this.currentItem.riskTime).getTime()<new Date(this.insurance.polStartDate).getTime() || new Date(this.currentItem.riskTime).getTime()> new Date(this.insurance.polEndDate).getTime()){
						this.$message({
							type: 'error',
							message: '出险时间不在保障范围内'
						});
						return;
					}
					if(moment(this.insurance.polStartDate).format('YYYY-MM-DD') > moment(this.insurance.polEndDate).format('YYYY-MM-DD')) {
						this.$message({
							type: 'error',
							message: '保险起期大于保险止期，请重新选择。'
						});
						return false;
					}
					
					if(this.insurance.riskType == 'dt') {
						if((this.isManualFlag || (!this.isManualFlag && !this.biDiIsConent) ) && (!this.insurance.value || !this.insurance.elevatorSeatAddress)) {
							this.$message({
								type: 'error',
								message: '请补全出险设备信息。'
							});
						} else if(!this.isManualFlag && this.biDiIsConent && this.insurance.devicecode == '') {
							this.$message({
								type: 'error',
								message: '请选择设备代码。'
							});
						} else {
							this.PolicyDatas();
						}
					} else if(this.insurance.riskType == 'gz' || this.insurance.riskType == 'ty' || this.insurance.riskType == 'jz')  {
						let reg = /[A-Za-z0-9]{5,22}/;
						if(this.isManualFlag && (!this.insurance.label2 || !this.insurance.value2 )) {
							this.$message({
								type: 'error',
								message: '请补全出险人员信息。'
							});
						} else if(this.isManualFlag && !reg.test(this.insurance.value2)) {
							this.$message({
								type: 'error',
								message: '请输入正确的证件号码(5-22位数字、字母)!'
							});
						} else if(!this.isManualFlag && this.insurance.insuredName == '') {
							this.$message({
								type: 'error',
								message: '请选择出险人员。'
							});
						} else {
							this.PolicyDatas();
						}
					} else {
						this.PolicyDatas();
					}
				} else {
					return false;
				}
			});	
		},
    // 关联保单
		async PolicyDatas(){
      // 手动填写保单信息，或者标的数据为0的，后台补录保单标的数据为0
      let data1 = this.data1
			if(this.isManualFlag || (!this.isManualFlag && !this.biDiIsConent)) {
        data1 = {...this.insurance,...this.data1};
				this.selecttdata.value = this.insurance.value;
				this.selecttdata.elevatorSeatAddress = this.insurance.elevatorSeatAddress;
				this.selecttdata.value2 = this.insurance.value2;
				this.selecttdata.label2 = this.insurance.label2;
				this.selecttdata.label1 = this.insurance.label1;
				this.selecttdata.postName = this.insurance.postName;
				this.selecttdata.propertyName = this.insurance.propertyName;
        // 手动录入保单进行校验
        if(this.isManualFlag) {
          if (this.insurance.riskType == 'jz' || this.insurance.riskType == 'wy') {
            if(this.currentItem.holderName != this.insurance.holderOrInsuredName){
              this.$message({
                type: 'warning',
                message: '被保人名称不一致，请重新填写投被人名称'
              });
              return;
            }
          } else {
            if(this.currentItem.holderName != this.insurance.holderName){
              this.$message({
                type: 'warning',
                message: '投保人名称不一致，请重新填写投保人名称'
              });
              return;
            }
          }
        }
			}
			let data = this.RelatedPolicyData.PolicyData(data1,this.currentItem.caseNo,this.selecttdata,this.insurance.riskType,this.currentItem.reportNo)
			const res = await this.caseService.addpolicy(data);
			if(res.code == '0000'){
				this.$message({
					type: 'success',
					message: '关联成功'
				});
				try {
					await this.caseService.caseAsync([this.currentItem.reportNo]);
				} catch (error) {
					
				}
        this.$emit('successCallback',JSON.parse(JSON.stringify(this.insurance)))
				this.close()
			};
		},
    async relation(){ //获取保单详情
			if(!this.insurance.policyNo){
				this.$message({
          type: 'warning',
          message: '请填写保单号'
        });
        return;
			}
			let data = {
				"policyNo":this.insurance.policyNo
			};
			const res = await this.caseService.policydetails(data);
			if(res.code == '0000' && res.data){
				// const res1 = await this.productService.productDisplay(res.data.productCode);
				// if(res1.code == '0000') {
				// 	this.optionType = res1.data.list.find(item => item.sign == 'theElevatorType') ? res1.data.list.find(item => item.sign == 'theElevatorType').list : []
				// }
        this.$set(this.insurance,'riskType',res.data.tApplicationForm.productCategory1)
				if(new Date(this.currentItem.riskTime).getTime()<new Date(res.data.polStartDate).getTime() || new Date(this.currentItem.riskTime).getTime()> new Date(res.data.polEndDate).getTime()){
					this.$message({
						type: 'warning',
						message: '出险时间不在保障范围内'
					});
					return;
				}
				if((this.insurance.riskType != 'jz' && this.insurance.riskType != 'wy') && this.currentItem.holderName != res.data.holderName){
					this.$message({
						type: 'warning',
						message: '投保人名称不一致，请重新填写保单号'
					});
					return;
				}
				if((this.insurance.riskType == 'jz' || this.insurance.riskType == 'wy') && this.currentItem.holderName != res.data.insuredName){
					this.$message({
						type: 'warning',
						message: '被保人名称不一致，请重新填写保单号'
					});
					return;
				}
				this.data1 = res.data;
				this.datas = [];
				if(this.insurance.riskType != 'ty'){
					this.getInsurance(res.data.appCode)
				}else{
					if(res.data.insuredList[0].human.licenceNo){
						res.data.insuredList.forEach(item =>{
							let ele = {
								value: '',
								label: '',
								elevatorSeatAddress: '',
								riskProvinceCode: '',
								riskProvinceName: '',
								riskCityCode: '',
								riskCityName: '',
								riskAreaCode: '',
								riskAreaName: '',
								theElevatorType: '',
								value1: '',
								label1: '',
								value2: item.human.licenceNo,
								label2: item.human.name
							};
							this.datas.push(ele);
						})
            if(this.datas.length == 0) {
              this.biDiIsConent = false
            }
					}else{
						// this.$message({
						// 	type: 'warning',
						// 	message: '请输入险种类型正确的保单号'
						// });
            this.biDiIsConent = false
						return false;
					}
				}
			} else {
				this.getEbaoPoliyList(this.insurance.policyNo)
			}
		},
    async getEbaoPoliyList(policyNo=''){
      let params = {
        policyNo: policyNo,
        riskName: '',
        customerName: '',
        applicant: '',
        shipName: '',
        licenseNo: '',
        branchCode: '',
        insured: '',
        policyStartDate1: '',
        policyStartDate2: '',
        policyEndDate1: '',
        policyEndDate2: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        busType1Code: '',
        busType2Code: '',
        busType3Code: '',
        filterCar:'',
        pn:'1',
        ps:'20',
				fromSys:'400'
      }
      let res = await this.caseService.getCaseEBaoPolList(params)
      if(res.code === '0000' && res.list.length !==0) {
				console.log(res,'res');
				let currentData = res.list[0]
				if(new Date(this.currentItem.riskTime).getTime()<new Date(currentData.policyStartDate).getTime() || new Date(this.currentItem.riskTime).getTime()> new Date(currentData.policyEndDate).getTime()){
					this.$message({
						type: 'warning',
						message: '出险时间不在保障范围内'
					});
					return;
				}
				// if(this.currentItem.holderName != currentData.applicant){
				// 	this.$message({
				// 		type: 'warning',
				// 		message: '投保人名称不一致，请重新填写保单号'
				// 	});
				// 	return;
				// }
				// switch (this.currentItem.riskType) {
				// 	case 'dt':
				// 		this.valueAuto = true
				// 		break;
				// 	case 'gz':
				// 	case 'ty':
				// 	case 'jz':
				// 		this.valueAutoGZ = true
				// 		break
				// 	case 'wy':
				// 		this.valueAutoWY = true
				// 	default:
				// 		break;
				// }
        this.isManualFlag = true
				this.insurance.holderName = currentData.applicant
				this.insurance.premium = currentData.prem
				this.insurance.polStartDate = currentData.policyStartDate + ' 00:00:00'
				this.insurance.polEndDate = currentData.policyEndDate + ' 23:59:59'
				this.insurance.issueCompanyName = currentData.companyName
      } else if(res.code === '0000' && res.list.length ==0) {
        this.$message.error("暂无数据！");
      } else {
        this.$message.error(res.msg)
      }
    },
    async getInsurance(appFormCode){
			const res = await this.caseService.getInsurance(appFormCode,this.insurance.riskType);
			if(!res.length){
				// this.$message({
				// 	type: 'warning',
				// 	message: '请输入险种类型正确的保单号'
				// });
        this.biDiIsConent = false
			}else{
				this.datas = res;
			}
		},
    // 关闭关联保单弹出窗
		close(){
			this.exhibition = false;
			this.isManualFlag = false;
			this.biDiIsConent = true;
			this.data1 = []
			this.insurance = {
				policyNo:'',
				devicecode:'',
				insuredName:'',
				ropewayName:'',
				premium:'',
				productName:'',
				polEndDate:'',
				polStartDate:'',
				channelCode: "sequip",
				channelName: "特设渠道",
				value: '',
				elevatorSeatAddress: '',
				label1: '',
				label2: '',
				value2: '',
				issueCompanyName:'',
				holderName:'',
				riskType:'',
				propertyName:''
			};
			this.selecttdata = {
				elevatorSeatAddress:'',
				theElevatorType:'',
				value:'',
				value1:'',
				label1:'',
				value2:'',
				label2:'',
				postName:'',
				propertyName:''
      }
			this.$refs['insurance'].resetFields();
		},
	},
}
</script>

<style lang="less">
#relationPolicy {
  .btn{
		text-align: right;
		width: 100%;
		.btn-left{
			display: inline-block;
			padding: 5px 20px;
			border: 1px solid #ccc;
			color: #000;
			background-color: #F5F5F5;
			border-radius: 20px;
			cursor: pointer;
			margin-right: 20px;
		}
		.btn-right{
			display: inline-block;
			padding: 5px 20px;
			color: #FFF;
			background-color: #FA8C16;
			border-radius: 20px;
			cursor: pointer;
		}
	}
}
</style>
