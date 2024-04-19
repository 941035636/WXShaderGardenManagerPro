<template>
	<div class="policyManagementNew" id="policyManagementNew">
		<div class="title-text common-style">
			<span class="item1">批单补录</span>
			<div class="fr">
				<el-button  round size="medium" @click="empty">取 消</el-button>
				<el-button type="warning" round size="medium" v-if="stepNum==1 && ((uploadTem == 'dt' && dTUpload)  || uploadTem == 'gz')" @click="nextStep">下一步</el-button>
				<el-button type="warning" round size="medium" @click="searchview(false)" v-if="stepNum==2 && ((uploadTem == 'dt' && dTUpload) || uploadTem == 'gz')">确认提交</el-button>
				<el-button type="warning" round size="medium" @click="searchview('ruleForm')" v-if="uploadTem != 'dt' && uploadTem != 'gz' || (uploadTem == 'dt' && !dTUpload)">确认提交</el-button>
			</div>
		</div>
		<div class="common-style pd20" v-if="$route.query.index == '2'">
			<el-form :model="ruleForm" label-width="140px" class="demo-ruleForm">
				<el-form-item label="保单号：">
					<el-input v-model.trim="ruleForm.insuranceNo" style="width:250px;display:inline-block;margin-right:20px"  @blur="searchs"></el-input><el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="policy-info common-style" v-if="data.policyNo">
			<el-form :model="data" label-width="140px" class="demo-ruleForm"> 
				<el-row>
					<el-col :span="8">
						<el-form-item label="保单号：">
							<span>{{data.policyNo}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="出单公司：">
							<span>{{data.insuranceCompany}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="投保产品：">
							<span>{{data.productName}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="投保人名称：">
							<span>{{data.holderName}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="保障期间：">
							<span>{{data.polStartDate}} 至 {{data.polEndDate}}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div class="step-line common-style" v-if="((uploadTem == 'dt' && dTUpload) || uploadTem == 'gz')">
			<el-steps :active="stepNum" align-center>
				<el-step title="填写批单信息"></el-step>
				<el-step title="上传清单"></el-step>
				<el-step title="提交"></el-step>
			</el-steps>
		</div>
		<div class="common-style pd-content" v-if="stepNum==1">
			<div class="title-text1">
				<span class="line"></span><span>填写批单信息</span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm mt20" size="small">
				<el-form-item label="批单类型" prop="endorsementsType">
					<el-select v-model="ruleForm.endorsementsType" placeholder="请选择批单类型" class="item3" @change="checkType">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-row>
					<el-col :span="24">
						<el-form-item label="批单生效日期" prop="startDate" style="display:inline-block;margin-right:20px">
							<el-date-picker v-model="ruleForm.startDate" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd" class="item3"></el-date-picker>
						</el-form-item>
						至
						<el-form-item style="display:inline-block;margin-left:-120px;">
							<el-date-picker v-model="ruleForm.endDate" type="date" placeholder="选择日期" disabled value-format="yyyy-MM-dd" class="item3"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="批单号" prop="endorsementsNo">
							<el-input v-model.trim="ruleForm.endorsementsNo" class="item3" oncopy="return false" onpaste="return false"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="确认批单号" prop="endorsementsNos">
							<el-input v-model.trim="ruleForm.endorsementsNos" class="item3" oncopy="return false" onpaste="return false"></el-input>
						</el-form-item>
					</el-col>
				
					<el-col :span="10">
						<el-form-item label="签单日期" prop="validDate">
							<el-date-picker :picker-options="datePicker" v-model="ruleForm.validDate" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd 00:00:00" class="item3"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="批单金额" prop="batchPremium1">
							<el-input v-model.trim="ruleForm.batchPremium1" :disabled="moneyDisable" class="item3"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="批单保额" prop="afterAmount">
					<el-input v-model.trim="ruleForm.afterAmount" style="width:360px" :disabled="moneyDisable"><template slot="append">元</template></el-input>
					<span style="color:#FA8C16;margin-left:10px"><i class="el-icon-magic-stick"></i>批单保额为本次批改的保额，非原保单保额+批单保额</span>
				</el-form-item>
				<el-row>
					<el-col :span="20">
						<el-form-item label="批单影印件" prop="urlid">
							<el-upload class="upload-demo" drag action="#" :http-request="Upload" multiple accept=".doc , .docx ,  .pptx , .pdf , .rar , .zip , .jpg , .png ">
								<img v-if="ruleForm.urlid" :src="ruleForm.urlid" class="avatar1">
								<i class="el-icon-upload" v-if="!ruleForm.urlid"></i>
								<div class="el-upload__text" v-if="!ruleForm.urlid">将文件拖到此处，或<em>点击上传</em></div>
							</el-upload>
						</el-form-item>
					</el-col>
					<el-col :span="20">
						<el-form-item label="备注">
							<el-input v-model="ruleForm.supplementaryNote" class="item3" :rows="3" placeholder="请输入备注" type="textarea"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				
				<Reason :multiData="ruleForm" :crossForm="ruleForm" ref="reason" :typeName="'CZPD'"></Reason>
				<BatchSettInfo ref="BatchSettInfo" :settlementData="settlementData"></BatchSettInfo>
			</el-form>
		</div>
		<div class="common-style pd-content" v-if="stepNum == 2 && uploadTem == 'dt'">
			<div class="title-text1">
				<span class="line"></span><span>上传清单</span>
				<el-button type="warning" size="small" class="ml50" @click="editEle">添加设备</el-button>
				<el-upload
					style="display:inline-block"
						class="upload-demo ml10"
						:action="url"
						:headers= 'headers'
						:on-success='handleSuccess'
						:on-error="onError"
						:before-upload="onProgress"
						:show-file-list='false'
						accept=".xlsx , .xls"
					>
					<el-button type="warning" size="small">批量上传设备</el-button>
				</el-upload>
				<span class="ts-download ml20" @click="download">
					<span class="el-icon-upload" style="color:#409EFF; font-size:24px"></span>
					<span style="color:#409EFF; font-size:14px;text-decoration:underline; ">下载设备导入模板</span>
				</span>
				<span class="fr">
					<span class="f14">已添加  <span style="color:#fa8c16">{{addList.length}}</span>  部设备</span>
					<span class="f14">已减少  <span style="color:#fa8c16">{{reduceList.length}}</span>  部设备</span>
					<span class="all-delete ml20" @click="allDel"><i class="el-icon-delete"></i>全部删除</span>
				</span>
			</div>
			<div class="no-data mt20" v-if="addList.length == 0 && reduceList.length == 0">
				暂无清单信息，请点击添加或批量上传
			</div>
			<el-table v-if="addList.length != 0" :data="addList"  style="width: 90%;margin-left:5%;" center border :header-cell-style="getRowClass" class="mt20">
                <el-table-column type="index" label="序号" align="center" width="80">
                </el-table-column>
                <el-table-column label="增加设备信息" width="400">
                    <template slot-scope="scope">
                        <el-row>
                            <span style="color:#d7a961" >{{scope.row.holderName}}</span>
                        </el-row>
						<el-row>
							<span>设备代码/出厂编号：</span>
							<span v-if="scope.row.equipmentsCode">{{scope.row.equipmentsCode}}</span>
						    <span  v-else-if="scope.row.factoryNumber">{{scope.row.factoryNumber}}</span>
						</el-row>
                        <el-row>
                            <span>坐落地址：</span>
                            <span>{{scope.row.areaValueFirst}}</span>
                            <span v-if="scope.row.areaValueSecond">/{{scope.row.areaValueSecond}}</span>
                            <span v-if="scope.row.areaValueThird">/{{scope.row.areaValueThird}}</span>
                            <span v-if="scope.row.useOfAddress">/{{scope.row.useOfAddress}}</span>
                            <span class="col-red" v-if="!scope.row.useOfAddress || !scope.row.areaValueThird || !scope.row.areaValueFirst || !scope.row.areaValueSecond"><i class="el-icon-warning"></i>  请补全设备坐落地址</span>
                        </el-row>
						<el-row>
							<span>使用单位名称：</span>
                            <span style="color:#d7a961" >{{scope.row.useOfUnit}}</span>
                        </el-row>
					</template>
                </el-table-column>
                <el-table-column  label="电梯类型" align="center">
                    <template slot-scope="scope">
                        <el-row>
                            <span v-if="scope.row.elevatorType ==1">直梯</span>
                            <span  v-else-if="scope.row.elevatorType ==2">扶梯</span>
                            <span  v-else>-</span>
                        </el-row>
					</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
						<el-button  type="text" class="col-edit" @click="editEle(scope.$index, scope.row)">修改</el-button>
						<el-button  type="text" class="col-del" @click="handleDelete(scope.$index, scope.row,'addList')">移除</el-button>
					</template>
                </el-table-column>
            </el-table>
			<el-table v-if="reduceList.length != 0" :data="reduceList"  style="width: 90%;margin-left:5%;" border center :header-cell-style="getRowClass" class="mt20">
                <el-table-column type="index" label="序号" align="center" width="80">
                </el-table-column>
                <el-table-column label="减少设备信息" width="400">
                    <template slot-scope="scope">
                        <el-row>
                            <span style="color:#d7a961" >{{scope.row.holderName}}</span>
                        </el-row>
						<el-row>
							<span>设备代码/出厂编号：</span>
							<span v-if="scope.row.equipmentsCode">{{scope.row.equipmentsCode}}</span>
						    <span  v-else-if="scope.row.factoryNumber">{{scope.row.factoryNumber}}</span>
						</el-row>
                        <el-row>
                            <span>坐落地址：</span>
                            <span>{{scope.row.areaValueFirst}}</span>
                            <span v-if="scope.row.areaValueSecond">/{{scope.row.areaValueSecond}}</span>
                            <span v-if="scope.row.areaValueThird">/{{scope.row.areaValueThird}}</span>
                            <span v-if="scope.row.useOfAddress">/{{scope.row.useOfAddress}}</span>
                            <span class="col-red" v-if="!scope.row.useOfAddress || !scope.row.areaValueThird || !scope.row.areaValueFirst || !scope.row.areaValueSecond"><i class="el-icon-warning"></i>  请补全设备坐落地址</span>
                        </el-row>
						<el-row>
							<span>使用单位名称：</span>
                            <span style="color:#d7a961" >{{scope.row.useOfUnit}}</span>
                        </el-row>
					</template>
                </el-table-column>
                <el-table-column  label="电梯类型" align="center">
                    <template slot-scope="scope">
                        <el-row>
                            <span v-if="scope.row.elevatorType ==1">直梯</span>
                            <span  v-else-if="scope.row.elevatorType ==2">扶梯</span>
                            <span  v-else>-</span>
                        </el-row>
					</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
						<el-button  type="text" class="col-edit" @click="editEle(scope.$index, scope.row)">修改</el-button>
						<el-button  type="text" class="col-del" @click="handleDelete(scope.$index, scope.row,'reduceList')">移除</el-button>
					</template>
                </el-table-column>
            </el-table>
		</div>
		<div class="common-style pd-content" v-if="stepNum == 2 && uploadTem == 'gz'">
			<div class="title-text1">
				<span class="line"></span><span>上传清单</span>
				<el-button type="warning" size="small" class="ml50" @click="editEle">添加人员</el-button>
				<el-upload
					style="display:inline-block"
						class="upload-demo ml10"
						:action="url1"
						:headers= 'headers'
						:on-success='handleSuccess1'
						:on-error="onError"
						:before-upload="onProgress"
						:show-file-list='false'
						accept=".xlsx , .xls"
					>
					<el-button type="warning" size="small">批量上传人员</el-button>
				</el-upload>
				<span class="ts-download ml20" @click="download">
					<span class="el-icon-upload" style="color:#409EFF; font-size:24px"></span>
					<span style="color:#409EFF; font-size:14px;text-decoration:underline; ">下载人员导入模板</span>
				</span>
				<span class="fr">
					<span class="f14">已添加  <span style="color:#fa8c16">{{addList.length}}</span>  位人员</span>
					<span class="f14">已减少  <span style="color:#fa8c16">{{reduceList.length}}</span>  位人员</span>
					<span class="all-delete ml20" @click="allDel"><i class="el-icon-delete"></i>全部删除</span>
				</span>
			</div>
			<div class="no-data mt20" v-if="addList.length == 0 && reduceList.length == 0">
				暂无清单信息，请点击添加或批量上传
			</div>
			<el-table v-if="addList.length != 0" :data="addList"  style="width: 90%;margin-left:5%;" center border :header-cell-style="getRowClass" class="mt20">
                <el-table-column type="index" label="序号" align="center" width="80">
                </el-table-column>
                <el-table-column label="添加人员信息" width="400">
                    <template slot-scope="scope">
                        <el-row>
                            <span style="color:#d7a961" >{{scope.row.name}}</span>
                        </el-row>
						<el-row>
							<span>证件号码：</span>
							<span>{{scope.row.id}}</span>
						</el-row>
						<el-row v-if="data.productCode == '21PR380984'">
							<span>有无社保：</span>
							<span v-if="scope.row.haveSocialSecurity == 1">有社保</span>
							<span v-if="scope.row.haveSocialSecurity == 0">无社保</span>
						</el-row>
					</template>
                </el-table-column>
                <el-table-column  label="证件类型" align="center">
                    <template slot-scope="scope">
                        <el-row>
                            <span>{{scope.row.idType}}</span>
                        </el-row>
					</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
						<el-button  type="text" class="col-edit" @click="editEle(scope.$index, scope.row)">修改</el-button>
						<el-button  type="text" class="col-del" @click="handleDelete(scope.$index, scope.row,'addList')">移除</el-button>
					</template>
                </el-table-column>
            </el-table>
			<el-table v-if="reduceList.length != 0" :data="reduceList"  style="width: 90%;margin-left:5%;" border center :header-cell-style="getRowClass" class="mt20">
                <el-table-column type="index" label="序号" align="center" width="80">
                </el-table-column>
                <el-table-column label="减少人员信息" width="400">
                    <template slot-scope="scope">
                        <el-row>
                            <span style="color:#d7a961" >{{scope.row.name}}</span>
                        </el-row>
						<el-row>
							<span>证件号码：</span>
							<span>{{scope.row.id}}</span>
						</el-row>
					</template>
                </el-table-column>
                <el-table-column  label="证件类型" align="center">
                    <template slot-scope="scope">
                        <el-row>
                            <span>{{scope.row.idType}}</span>
                        </el-row>
					</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
						<el-button  type="text" class="col-edit" @click="editEle(scope.$index, scope.row)">修改</el-button>
						<el-button  type="text" class="col-del" @click="handleDelete(scope.$index, scope.row,'reduceList')">移除</el-button>
					</template>
                </el-table-column>
            </el-table>
		</div>
		<elevatorEdit ref="elevatorEdit" :options="options1" @insertData="insertData" v-if="uploadTem == 'dt'"></elevatorEdit>
		<personEdit ref="elevatorEdit" :options="options1" @insertData="insertData" :productCode="data.productCode" v-if="uploadTem == 'gz'"></personEdit>
	</div>
</template>

<script>
import {elevator} from '@/server/accidenServer.js';
import productDT from './data/dtProductList.json';
import {Loading, Message} from 'element-ui'
import ResourcesService from '@/service/ResourcesService.js';
import PolicyentryService from '@/service/PolicyentryService.js';
import policyService from '@/service/policyService.js';
import UserService from '@/service/UserService.js';
import {address} from '@/util/addressAnalysis.js'
import battenType from '../../../static/data/battenType.json';
import elevatorEdit from './components/elevatorEdit'
import personEdit from './components/personEdit'
import pdPerType from '../../../static/data/pdPerType.json'
import Reason from './components/Reason'
import BatchSettInfo from "./components/batchSettInfo";
export default {
	data() {
		var checkNumber = (rule, value, callback) => {
			const numberReg = /^\d+(\.\d+)?$/
			if (value == '' && value != 0) {
			return callback(new Error("请填写批单金额"))
			}
			if (value<0) {
			return callback(new Error("输入批单金额必须大于等于0"))
			}
			setTimeout(() => {
				if (numberReg.test(value)) {
					callback()
				} else {
					callback(new Error("批单金额只能为数字"))
				}
			}, 100)
		};
		var checkNumber2 = (rule, value, callback) => {
			let Reg = /^\d+(\.\d{0,2})?$/;
			if (!value && value != 0) {
				return callback(new Error("请输入"));
			} else if (!Reg.test(value)) {
				callback(new Error("保额为最多保留两位小数的数字"));
			} else if (value<0 || value>1000000000) {
				callback(new Error(`保额值范围正数保留2位小数，最大不超过10亿`));
			} else {
				callback();
			}
		};
		var validatePass3 = (rule, value, callback) => {
			if (value == '') {
				callback(new Error('请再次输入批单号'));
			} else if (value != this.ruleForm.endorsementsNo) {
				callback(new Error('两次输入的批单号不一致,请重新输入'));
			} else {
				callback();
			}
		};
		return {
			dTUpload: false,
			address: {},
			options:[],
			url: this.$apiUrl.DOWNLODA_PD_TEM,
			url1: this.$apiUrl.DOWNLODA_PD_TEM_GZ + '?productCode=GZBLPD',
			headers:{
                authorization:window.sessionStorage.getItem('authorization'),
                'jtpf.userId': window.sessionStorage.getItem('userCode'),
            },
			addList: [],
			reduceList: [],
			stepNum:1,
			Elevator:new elevator(),
			ResourcesService:new ResourcesService(),
			UserService:new UserService(),
			PolicyentryService:new PolicyentryService(),
			policyService:new policyService(),
            ruleForm:{
				applyNo:'系统自动生成',
				insuranceNo:'',
				data:[],
				endorsementsNo:'',
				endorsementsNos:'',
				validDate:'',//签单日期
				startDate:'',
				endDate:'',
				endorsementsType :'',
				increaseOrDecreaseNumber:'',
				batchPremium:'',
				batchPremium1:'',
				afterAmount:'',
				urlid:'',
				supplementaryNote :'',
				fileInfoVO:{
					fileName:'',
					fileType:'',
					fileUrl:'',
				},
				incomeDate:'',
				proofReason:'',
				proofFile: [],
				proof:'',
				proofReasonOther:'',
			},
			rules:{
				endorsementsNo:[{required: true, message: '请输入批单号', trigger: 'blur'}],
				endorsementsNos:[{required: true,validator: validatePass3,trigger: 'blur'}],
				afterAmount:[{required: true,validator: checkNumber2,trigger: 'blur'}],
				validDate:[{ type: 'string', required: true, message: '请选择日期', trigger: 'change' }],
				startDate:[{ type: 'string', required: true, message: '请选择日期', trigger: 'change' }],
				endorsementsType:[{required: true, message: '请选择批单类型', trigger: 'change' }],
				batchPremium1:[{required: true,validator: checkNumber, trigger: 'blur'}],
				urlid:[{required: true, message: '请上传批单影印件', trigger: 'change'}]
			},
			options1:[],
			clearable:false,
			datePicker:this.beginDate(),
			id:'',
			fileName:'',
			disabled:false,
			data:{},
			numbers:0,
			premiumAmountAfter:0,
			index:'',
			res_token:'',
			uploadTem:'',
			moneyDisable:false,
			settlementData:{
				afterPrem: "",
				name:"保单保费",
				"insuranceCompanyVOS": [],
				"settlementDepartmentVOs": [],
			},
			classify:""
		}
	},
	computed:{
       
	},
	mounted() {
		
	},
	components:{
        elevatorEdit,personEdit,Reason,BatchSettInfo
    },
	created(){
		this.getAreas();
		this.types();
		this.getResToken()
		if(this.$route.query.insuranceNo){
			this.getDet();
			this.getApproval();
		}else if(this.$route.query.policyNo){
			this.getDets();
		};
	},
	methods: {
		beginDate(){
            let self = this
            return {
                disabledDate(time){
                    let startDate = self.serviceData?self.serviceData.split(" ")[0]: new Date();
                    return time.getTime() >  new Date(startDate)
                }
            }
        },
		nextStep() {
			if(this.ruleForm.endorsementsType && (this.ruleForm.endorsementsType == '01' || this.ruleForm.endorsementsType == '04')) {
				this.searchview('ruleForm');
			} else {
				this.$refs['ruleForm'].validate((valid) => {
					if (valid) {
						this.stepNum = 2;
						console.log(this.ruleForm)
					} else {
						return false;
					}
				});
			}
		},
		handleDelete(index,row,name) {
			let msg = this.uploadTem == 'dt' ? '是否删除电梯信息？' : this.uploadTem == 'gz' ? '是否删除人员信息？' : '';
			this.$confirm(msg, '删除提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this[name].splice(index,1);
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
		},
		insertData(form,index,flag) {
			form.holderName = this.data.holderName;
			let name = '';
			if(form.pdType == '1') {
				name = 'addList';
			} else {
				name = 'reduceList';
			}
			if(index != undefined) {
				if(!flag) {
					this[name].splice(index,1,form);
				} else {
					name == 'addList' ? this.reduceList.splice(index,1) : this.addList.splice(index,1);
					this[name].push(form);
				}
			} else {
				this[name].push(form);
			}
		},
		editEle(index,form) {
			this.$refs.elevatorEdit.showDialog(index,form);
		},
		types(){
			this.options = battenType.dataDT
		},
		async getDet(){//批单列表页跳转保单详情
			let res = await this.Elevator.getapprovaldetails(this.$route.query.insuranceNo);
			if(res.code == '0000'){
				this.ruleForm.applyNo = this.$route.query.applyNo;
				this.ruleForm.insuranceNo = this.$route.query.insuranceNo;
				this.ruleForm.data.push(res.data.polStartDate);
				this.ruleForm.data.push(res.data.polEndDate);
				this.ruleForm.endDate = res.data.polEndDate;
				this.ruleForm.endorsementsType = this.$route.query.endorsementsType;
			}
		},
		async getApproval(){//特设批单详情
			if(this.$route.query.applyNo){
				let res = await this.Elevator.getDet(this.$route.query.applyNo);
				if(res.code == '0000'){
					this.ruleForm.batchPremium = res.data.payPremium;
				}
			}
		},
		async getDets(){//订单列表页跳转
			let res = await this.Elevator.getapprovaldetails(this.$route.query.policyNo);
			if(res.code == '0000'){
				this.data = res.data;
				this.settlementData.insuranceCompanyVOS = res.data.insuranceCompanyVOS
        		this.settlementData.settlementDepartmentVOs = res.data.settlementDepartmentVOs
				this.data.holderName = res.data.holder.corporation.name;
				this.data.insuranceCompany = res.data.insuranceCompanyVOS.find(item => item.role2 == '01') ? res.data.insuranceCompanyVOS.find(item => item.role2 == '01').name : ''
				this.ruleForm.insuranceNo = this.$route.query.policyNo;
				this.ruleForm.data.push(this.data.polStartDate);
				this.ruleForm.data.push(this.data.polEndDate);
				this.ruleForm.endDate = this.data.polEndDate;
				this.uploadTem = this.data.tApplicationForm ? this.data.tApplicationForm.productCategory1 : '';
				if(this.uploadTem == 'dt') {
					this.dTUpload = true;
				}
				if(this.data.endorsementsInfo){
					this.numbers = this.data.endorsementsInfo.policyAmount;
					this.premiumAmountAfter = this.data.endorsementsInfo.premiumAmountAfter;
				}else{
					this.numbers = this.data.premium;
					this.premiumAmountAfter = this.data.premium;
				}
				if(this.data.tApplicationForm && this.data.tApplicationForm.productCategory1 == 'gz') {
					this.options = battenType.data
				}
				if(res.data.productName.indexOf('线下录单') != -1) {
					this.uploadTem = ''
				}
				if(res.data.productCode == '21PR380984') {
					this.url1 = this.$apiUrl.DOWNLODA_PD_TEM_GZ + '?productCode=QGGZBLPD';
				}
				let resp = await this.PolicyentryService.productDetalis(res.data.productCode)
					if(resp.code == '0000'){
						if(resp.data.attrInfoDTOList.find(item=> item.attrCode == 'classify')){
						this.classify = resp.data.attrInfoDTOList.find(item=> item.attrCode == 'classify').attrDTOList[0].value
						}
					}
					// 灵活版产品，如果第一次批单为一般性批改，第二次批单时，批单详情会没有结算集合，
					//（灵活版产品批单详情没有结算集合时，调用保单详情查询结算集合）
					if(this.classify == 'LHB'){  
						if(this.settlementData.settlementDepartmentVOs ==null || this.settlementData.settlementDepartmentVOs[0].settlementCompanyVOS.length == 0){
							let rest =await this.policyService.getPolicyDetail(res.data.appCode)
							if(rest.data.code == '0000'){
								this.settlementData.settlementDepartmentVOs = rest.data.data.settlementDepartmentVOs
							}
						}
					}
			}
		},
		async search(){
			if(this.ruleForm.insuranceNo){
				let res = await this.Elevator.getapprovaldetails(this.ruleForm.insuranceNo);
				if(res.code == '0000'){
					if(res.data){
						this.index = '';
						this.data = res.data;
						this.ruleForm.data = [];
						this.data.holderName = res.data.holder.corporation.name;
						this.data.insuranceCompany = res.data.insuranceCompanyVOS.find(item => item.role2 == '01') ? res.data.insuranceCompanyVOS.find(item => item.role2 == '01').name : '';
						this.uploadTem = this.data.tApplicationForm ? this.data.tApplicationForm.productCategory1 : '';
						if(this.uploadTem == 'dt') {
							this.dTUpload = true;
						}
						this.ruleForm.data.push(res.data.polStartDate);
						this.ruleForm.data.push(res.data.polEndDate);
						this.ruleForm.endDate = res.data.polEndDate;
						if(this.data.endorsementsInfo){
							this.numbers = this.data.endorsementsInfo.policyAmount;
							this.premiumAmountAfter = this.data.endorsementsInfo.premiumAmountAfter;
						}else{
							this.numbers = this.data.premium;
							this.premiumAmountAfter = this.data.premium;
						}
						if(this.data.tApplicationForm && this.data.tApplicationForm.productCategory1 == 'gz') {
							this.options = battenType.data
						}
						if(res.data.productName.indexOf('线下录单') != -1) {
							this.uploadTem = ''
						}
						if(res.data.productCode == '21PR380984') {
							this.url1 = this.$apiUrl.DOWNLODA_PD_TEM_GZ + '?productCode=QGGZBLPD';
						}
					}else{
						this.index = '1';
						this.data = {};
						this.$message({
							message: res.msg,
							type: 'warning'
						});
					}
				}
			}
		},
		async searchs(){
			if(this.ruleForm.insuranceNo){
				let res = await this.Elevator.getapprovaldetails(this.ruleForm.insuranceNo);
				if(res.code == '0000'){
					if(res.data){
						this.index = '';
						this.data = res.data;
						this.settlementData.insuranceCompanyVOS = res.data.insuranceCompanyVOS
        				this.settlementData.settlementDepartmentVOs = res.data.settlementDepartmentVOs
						this.ruleForm.data = [];
						this.data.holderName = res.data.holder.corporation.name;
						this.data.insuranceCompany = res.data.insuranceCompanyVOS.find(item => item.role2 == '01') ? res.data.insuranceCompanyVOS.find(item => item.role2 == '01').name : ''
						this.uploadTem = this.data.tApplicationForm ? this.data.tApplicationForm.productCategory1 : '';
						if(this.uploadTem == 'dt') {
							this.dTUpload = true;
						}
						this.ruleForm.data.push(res.data.polStartDate);
						this.ruleForm.data.push(res.data.polEndDate);
						this.ruleForm.endDate = res.data.polEndDate;
						if(this.data.endorsementsInfo){
							this.numbers = this.data.endorsementsInfo.policyAmount;
							this.premiumAmountAfter = this.data.endorsementsInfo.premiumAmountAfter;
						}else{
							this.numbers = this.data.premium;
							this.premiumAmountAfter = this.data.premium;
						}
						if(this.data.tApplicationForm && this.data.tApplicationForm.productCategory1 == 'gz') {
							this.options = battenType.data
						}
						if(res.data.productName.indexOf('线下录单') != -1) {
							this.uploadTem = ''
						}
						if(res.data.productCode == '21PR380984') {
							this.url1 = this.$apiUrl.DOWNLODA_PD_TEM_GZ + '?productCode=QGGZBLPD';
						}
						let resp = await this.PolicyentryService.productDetalis(res.data.productCode)
						if(resp.code == '0000'){
							if(resp.data.attrInfoDTOList.find(item=> item.attrCode == 'classify')){
							this.classify = resp.data.attrInfoDTOList.find(item=> item.attrCode == 'classify').attrDTOList[0].value
							}
						}
						// 灵活版产品，如果第一次批单为一般性批改，第二次批单时，批单详情会没有结算集合，
						//（灵活版产品批单详情没有结算集合时，调用保单详情查询结算集合）
						if(this.classify == 'LHB'){  
							if(this.settlementData.settlementDepartmentVOs ==null || this.settlementData.settlementDepartmentVOs[0].settlementCompanyVOS.length == 0){
								let rest =await this.policyService.getPolicyDetail(res.data.appCode)
								if(rest.data.code == '0000'){
									this.settlementData.settlementDepartmentVOs = rest.data.data.settlementDepartmentVOs
								}
							}
						}
					}else{
						this.data = {};
						this.index = '1';
						this.$message({
							message: res.msg,
							type: 'warning'
						});
					}
				}
			}
		},
		async Upload(file){ // 图片上传
			let data = [file.file]
			const res = await this.ResourcesService.uploadFile('sequip-svc','endorsements','0',data);
			if(res.code == '0000'){
				this.id = res.list[0].fileId;
				this.fileName = res.list[0].fileName;
				this.ruleForm.urlid = this.ResourcesService.downloadOViewLocationFile(file.file);
				
			}
		},
		searchview(formName){
			if(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if(this.ruleForm.data.length != 2){
							this.$message({
								message: '请检查保险期限是否回显',
								type: 'warning'
							});
							return;
						}
						this.disabled = true;
						this.testingUniqueness();
					} else {
						return false;
					}
				});		
			} else {
				this.testingUniqueness();
			}	
		},
		async testingUniqueness(){
			let channelCode = 'sequip'
			let res = await this.Elevator.TestingUniqueness(this.ruleForm.endorsementsNo,channelCode);
			if(res.code == '0000'){
				if(res.data.size){
					this.$message.error('批单号重复，请检查批单号');
					this.disabled = false;
					return;
				}else{
					this.searchviews();
				}
			}
		},
		async searchviews(){
			this.ruleForm.batchPremium = this.ruleForm.batchPremium1;
			if(((this.uploadTem == 'dt' && this.dTUpload) || this.uploadTem == 'gz') && (this.ruleForm.endorsementsType !='01' && this.ruleForm.endorsementsType != '04')) {
				let c = this.addList.concat(this.reduceList);
				if(c.length == 0) {
					this.$message.error('请上传清单。');
					return false;
				}
			}
			if(this.uploadTem == 'dt' && !this.checkSequip()) {
				this.$message.error('请补全设备信息。');
				return false;
			}
			this.ruleForm.batchPremium = Number(this.ruleForm.batchPremium);
			if(this.index == '1'){
				this.$message.error('保单信息为空，请检查保单号');
				this.disabled = false;
				return;
			}
			if(this.$route.query.index != '1'){
				if((this.ruleForm.endorsementsType == '02' || this.ruleForm.endorsementsType == '04') && this.ruleForm.batchPremium != 0){
					this.ruleForm.batchPremium = '-' + this.ruleForm.batchPremium;
				}
			}
			if((this.ruleForm.endorsementsType == '02' || this.ruleForm.endorsementsType == '03') && (this.ruleForm.batchPremium == 0 || this.ruleForm.afterAmount == 0)){
				this.$message.error('批增、批减金额和保额都不能等于0');
				return;
			}
			if(this.$refs.reason && !this.$refs.reason.sava()) {
				return;
			}
			if(this.classify && this.classify == 'LHB' && this.ruleForm.endorsementsType !="01" && this.ruleForm.endorsementsType !="10") {
				if(this.settlementData.settlementDepartmentVOs ==null || this.settlementData.settlementDepartmentVOs[0].settlementCompanyVOS.length == 0){
					this.$message.warning("批单结算信息错误，请联系管理员")
					return false;
				}
				this.settlementData.afterPrem = this.ruleForm.batchPremium
				this.handleSettCompany();
				this.$refs.BatchSettInfo.dialogBatchSett = true;
				return 
            }
			if(this.$route.query.index == '1'){
				let data = {
					"applyNo": this.ruleForm.applyNo,
					"batchPremium": Number(this.ruleForm.batchPremium),
					"endDate": this.ruleForm.endDate + ' ' + '23:59:59',
					"endorseStatus": '03',
					"endorsementsNo": this.ruleForm.endorsementsNo,
					'increaseOrDecreaseNumber':this.ruleForm.increaseOrDecreaseNumber,
					"endorsementsType": this.ruleForm.endorsementsType,
					"fileInfoVO": [
					{
						"fileName": this.fileName,
						"fileType": '05',
						"fileUrl": this.id,
					}
					],
					"issueDate": this.ruleForm.validDate,
					"validDate":this.ruleForm.startDate + ' ' + '00:00:00',
					'operateId':window.sessionStorage.getItem('userCode'),
					'operateName':window.sessionStorage.getItem('userName'),
				};
				let res = await this.Elevator.getInformationinput(data);
				if(res.code == '0000'){
					//南京，新疆，贵州，河北，深圳，青海
					if(this.data.productCode == '19PR232767' || this.data.productCode == '19PR152821' || this.data.productCode == '19PR344296' || this.data.productCode == '19PR502997' || this.data.productCode == '19PR265735'  || this.data.productCode == '19PR695659' || this.data.productCode == '21PR999909'){
						this.Batchlistpush(this.$route.query.applyNo,this.data.productCode);
					}else{
						this.$message({
							message: '批单上传成功',
							type: 'success'
						});
						this.$router.push('/order/pd');
					}
				}else{
					
					this.disabled = false;
					return;
				}
			}else{
				this.searchviewsFun();
			}
		},
		async searchviewsFun() {
			let datas = {
				"source":"00", //来源：pc端（00） 移动端（01） 合作方（02） 
				"operator":window.sessionStorage.getItem('userCode'), // 批单录入人员Code
				"entryType":"03",// 录入方式\n单笔录入（00）/批量导入（01）/事后补录（03）'
				'operatorName':window.sessionStorage.getItem('userName'), // 操作人
				'kind':'A2',
				"endorsements":[
					{
						"revenueRecognitionReason": this.ruleForm.proofReason ? this.ruleForm.proofReason: "", // 收入确认佐证原因-不可批改-显示-非必填
						"revenueRecognitionFile": this.ruleForm.proofFile, // 收入确认佐证文件-不可批改-显示-非必填
						"revenueRecognitionOtherReason": this.ruleForm.proofReasonOther, // 收入确认佐证其他原因-不可批改-显示-非必填
						"revenueRecognitionTime": this.ruleForm.incomeDate, // 收入确认时间点-不可批改-显示-非必填
						"reasonForBacklog": this.ruleForm.proof, // 倒签原因-不可批改-显示-非必填" 
						"endorsementsType":this.ruleForm.endorsementsType, //批改类型
						"endorsementMode":"02", //批改方式
						"endorsementsNo":this.ruleForm.endorsementsNo, //批单号
						"appCode":this.data.appCode, //投保单编码
						"insuranceNo":this.ruleForm.insuranceNo, //原保单号
						"productCode":this.data.productCode, //产品编码
						"productName":this.data.productName, // 产品名称
						"productType":"00",  //产品类型
						"channelCode":"sequip",  //渠道编码
						"channelName":"特设渠道", //渠道名称
						"applicantCode":this.data.holder.holderCode, // 申请人编码
						"applicant":this.data.holder.corporation?this.data.holder.corporation.name:this.data.holder.human.name, //批单申请人名称
						"branchCode": this.data.branchCode, //机构编码
						"branchName": this.data.branchName,  //机构名称
						"issueDate":this.ruleForm.validDate, //签单日期
						"validDate":this.ruleForm.startDate + ' ' + '00:00:00', //批单生效日期
						"startDate":this.ruleForm.startDate + ' ' + '00:00:00', //批单保险起期
						"endDate":this.ruleForm.endDate,  //批单保险止期
						"policyPremium":this.numbers, //保单保费（原保单保费 不变的）
						"batchPremium":this.ruleForm.batchPremium, //批单保费 （批减传"-"）
						"totalAmount":this.ruleForm.batchPremium,  //优惠前金额
						"preferentialPrem":0,  //优惠的金额
						"receivablePremium": this.ruleForm.batchPremium, //应收批单金额           
						"payPremium":this.ruleForm.batchPremium, //实收批单金额
						"premiumAmountBefore":Number.parseFloat(this.premiumAmountAfter), //变动前保费金额
						"premiumAmountAfter":Number.parseFloat(this.premiumAmountAfter) + Number.parseFloat(this.ruleForm.batchPremium),  //变动后保费金额
						"note": this.ruleForm.supplementaryNote, // 备注
						"attachments":[
							{
								"id":this.id, //批单附件id
								"type":'05', //批单附件类型
								"name":this.fileName, //批单附件名称
							}
						],
						"returnPremium":{
							"accountName": "", // 账户名称
							"accountBank": "",// 开户行
							"accountNo": "",  // 银行账号
							"note": "" //退费原因
						},
						risk:[]
					}
				]
			};
			this.data.riskList.forEach(item=>{
				let obj = {
						riskName:item.riskName,
						actualPrem:"",
						riskFlag2:item.riskFlag2,
						riskCode:item.riskCode,
						afterAmount:"0",
					}
					if(item.riskFlag2 == 'M'){
						if(this.ruleForm.endorsementsType == '02' || this.ruleForm.endorsementsType == '04' && this.ruleForm.afterAmount != 0){
							obj.afterAmount = '-' + this.ruleForm.afterAmount;
						} else {
							obj.afterAmount = this.ruleForm.afterAmount
						}
					}
					datas.endorsements[0].risk.push(obj)
			})
			if(this.classify && this.classify == 'LHB'  && this.ruleForm.endorsementsType !="01" && this.ruleForm.endorsementsType !="10"){
				datas.endorsements[0].insuranceCompanie = this.settlementData.insuranceCompanyVOS;
				datas.endorsements[0].settlementDepartments=this.settlementData.settlementDepartmentVOs;
				datas.endorsements[0].settlementDepartments[0].settlementCompanies=this.settlementData.settlementDepartmentVOs[0].settlementCompanyVOS;
				datas.endorsements[0].hasSettlement = "01" // 包含结算信息00-不包含 01-包含-不可批改-不显示-非必填”
			}else{
				datas.endorsements[0].hasSettlement = "00"
			}
			let res = await this.Elevator.submitEndors(datas,{"headers":{"X-RESUB-TOKEN":this.res_token}});
			if(res.code == '0000'){
				if(this.ruleForm.endorsementsType != '01' && this.ruleForm.endorsementsType != '04' && ((this.uploadTem == 'dt' && this.dTUpload) || this.uploadTem == 'gz')) {
					await this.uploadList(res);
				} 
				if(this.data.productCode == '19PR232767' || this.data.productCode == '19PR152821' || this.data.productCode == '19PR344296' || this.data.productCode == '19PR502997' || this.data.productCode == '19PR265735' || this.data.productCode == '19PR695659' || this.data.productCode == '21PR999909'){
					this.Batchlistpush(res.data.applyNos[0],this.data.productCode);
				}else{
					this.$message({
						message: '批单上传成功',
						type: 'success'
					});
					this.$router.push('/order/pd');
				}
			}else{
				this.getResToken()
				this.disabled = false;
				return;
			}
		},
		handleSettCompany(){
			let list = this.getSettList(this.settlementData.insuranceCompanyVOS,this.settlementData.settlementDepartmentVOs[0].settlementCompanyVOS)
			this.settlementData.insuranceCompanyVOS.forEach(item => {
				item.sharePremium = ((item.shareRate *  this.ruleForm.batchPremium)).toFixed(4)
				item['sharePrem']=item.sharePremium
			})
			list.map(item =>{ 
				if(item.hasTax =='01' && item.commissionType == '00'){
				//  结算金额=（结算比例/承保比例）*（保费*承保比例*佣金率 ）
				item.settlementAmount = ((item.settlementRatio /item.shareRate) * (this.ruleForm.batchPremium *item.shareRate * item.commissionValue)).toFixed(4)
				}else if(item.hasTax =='01' && item.commissionType == '01'){   
				item.settlementAmount = item.commissionValue;
				}else if(item.hasTax =='00' && item.commissionType == '00'){
				item.settlementAmount = (((item.settlementRatio /item.shareRate) * (this.ruleForm.batchPremium * item.shareRate * item.commissionValue))/1.06).toFixed(4)
				}else if(item.hasTax =='00' && item.commissionType == '01'){
				item.settlementAmount = item.commissionValue;
				}
				item.settlementRatioAmount = (this.ruleForm.batchPremium *item.settlementRatio).toFixed(4) // 总保费乘结算比例，
			})
			let dataArrTemp = JSON.stringify(list);
			this.settlementData.settlementDepartmentVOs[0].settlementCompanyVOS= JSON.parse(dataArrTemp);
		},
		getSettList(arr,arr1){
			const result = [];
			for (let i = 0; i < arr1.length; i++) {
				const codePrefix = arr1[i].code.split(".")[0];
				const insuranceCompany = arr.find(company => company.code.split(".")[0] === codePrefix);
				if (insuranceCompany) {
				const newItem = Object.assign({}, arr1[i]);
				// newItem.insuranceCompanyName = insuranceCompany.name;
				newItem.shareRate = insuranceCompany.shareRate;
				result.push(newItem);
				} else {
				result.push(arr1[i]);
				}
			}
			return result;
		},
		async sendDTData(params) {
			this.addList.map(item => {
				let obj = {
					"cityCode": item.areaCodeSecond,
					"cityName": item.areaValueSecond,
					"countryCode": item.areaCodeThird,
					"countryName": item.areaValueThird,
					"elevatorType": item.elevatorType == 1 ? '直梯' : '扶梯',
					"elevatorTypeCode": item.elevatorType,
					"endorType": 1,//批增或批减 1批增 2批减
					"equipmentsCode": item.equipmentsCode,
					"factoryNumber": item.factoryNumber,
					"productCode": this.data.productCode,
					"provinceCode": item.areaCodeFirst,
					"provinceName": item.areaValueFirst,
					"useOfAddress": item.useOfAddress,
					"useOfUnit": item.useOfUnit,
				}
				params.elevatorEndorsementList.push(obj);
			})
			this.reduceList.map(item => {
				let obj = {
					"cityCode": item.areaCodeSecond,
					"cityName": item.areaValueSecond,
					"countryCode": item.areaCodeThird,
					"countryName": item.areaValueThird,
					"elevatorType": item.elevatorType == 1 ? '直梯' : '扶梯',
					"elevatorTypeCode": item.elevatorType,
					"endorType": 2,//批增或批减 1批增 2批减
					"equipmentsCode": item.equipmentsCode,
					"factoryNumber": item.factoryNumber,
					"producerName": this.data.producerName,
					"productCode": this.data.productCode,
					"provinceCode": item.areaCodeFirst,
					"provinceName": item.areaValueFirst,
					"useOfAddress": item.useOfAddress,
					"useOfUnit": item.useOfUnit,
				}
				params.elevatorEndorsementList.push(obj);
			})
			let res = await this.Elevator.postSequipList(params);
			if(res.code == '0000') {
				
			}
		},
		async sendGZData(params) {
			this.addList.map(item => {
				let obj = {
					"idNo": item.id,
					"idType": item.licenceCode,
					"name": item.name,
					"workType": item.postCode,
					"endorType": 1,//批增或批减 1批增 2批减
					"haveSocialSecurity": item.haveSocialSecurity
				}
				params.employeeEndorsementList.push(obj);
			})
			this.reduceList.map(item => {
				let obj = {
					"idNo": item.id,
					"idType": item.licenceCode,
					"name": item.name,
					"workType": item.postCode,
					"endorType": 2,//批增或批减 1批增 2批减
					"haveSocialSecurity": item.haveSocialSecurity
				}
				params.employeeEndorsementList.push(obj);
			})
			let res = await this.Elevator.postPersonList(params);
			if(res.code == '0000') {
				
			}
		},
		async uploadList(data) {
			let params = {
				"amount": this.ruleForm.batchPremium,
				"applicationFormCode": this.data.appCode,//投保单号
				"applyNo": data.data.applyNos[0],//批单申请号
				"endDate": this.ruleForm.endDate,
				"endorsementsNo": this.ruleForm.endorsementsNo,//批单号
				"issueDate": this.ruleForm.validDate, //签单日期,
				"pdType": this.ruleForm.endorsementsType,
				"policyHolder": this.data.holderName,
				"policyNo": this.data.policyNo,
				"productCode": this.data.productCode,
				"productName": this.data.productName,
				"startDate": this.ruleForm.startDate + ' ' + '00:00:00', //批单保险起期,
				"userCode": window.sessionStorage.getItem('userCode')
			}
			if(this.uploadTem == 'dt') {
				params.elevatorEndorsementList = [];
				this.sendDTData(params)
			}else if(this.uploadTem == 'gz') {
				params.employeeEndorsementList = [];
				this.sendGZData(params)
			} 
		},
		checkSequip() {
			let flag = true;
			let c = this.addList.concat(this.reduceList);
			c.find(item => item.areaCodeFirst == undefined || item.areaCodeSecond == undefined || item.areaCodeThird == undefined || item.useOfAddress == undefined || item.useOfAddress == '') ? flag = false:flag= true;
			return flag;
		},
		async getResToken(){
			this.res_token = await this.UserService.getResToken()
		},
		async Batchlistpush(applyNos,productCode){
			let data = {
				pdCode:this.ruleForm.endorsementsNo,
				applicationPDCode:applyNos,
				productCode:productCode
			};
			let res = await this.Elevator.Batchlistpush(data);
			if(res.code == '0000'){
				this.$message({
					message: '批单上传成功',
					type: 'success'
				});
				this.$router.push('/order/pd');
			};
		},
		empty(){
			if(this.stepNum == 1) {
				this.$router.go(-1);
			} else {
				this.stepNum = 1;
			}
			
		},
		// 下载电梯模版
        async download(){
			let name = '';
			if(this.uploadTem == 'dt') {
				name = 'DTPD';
			} else if(this.uploadTem == 'gz' && this.data.productCode != '21PR380984') {
				name = 'GZBLPD';
			} else if(this.uploadTem == 'gz' && this.data.productCode == '21PR380984') {
				name = 'QGGZBLPD';
			}
            this.ResourcesService.exportFile(this.$apiUrl.NEW_TEMPLATE,{'productCode':name})
		},
		 //修改表头样式
        getRowClass({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            if (rowIndex == 0) {
                // return 'background: #fefbf1;border-bottom:1px solid #f0dfbf;color:#cda160;font-size:16px;font-weight:500;';
                return 'background: #e8e8e8;color:#101010;font-size:16px;font-weight:500;';
            } else {
                return 'background: #fff';
            }
		},
		async getAreas(){ //获取地区
			const res = await this.UserService.getArea();
			let {code} = res;
			if(code == "0000"){
				this.options1 = res.data;
				this.address = new address(res.data)
			}
		},
		// 模版上传成功
        handleSuccess(file, fileList) {
            this.loadingInstance.close();
            let {code} =file
            if(code=='0000'){
                this.$message.success('上传成功');
                file.list.forEach(item => {
					let  options = this.options1
					let areaObj = this.address.smart(item.useOfAddress)
					item.holderName = this.data.holderName;
					item.areaCodeFirst = areaObj.provinceCode;
					item.areaCodeSecond = areaObj.cityCode;
					item.areaCodeThird = areaObj.countyCode;
					item.useOfAddress = areaObj.location
					item.areaValueFirst = areaObj.province
					item.areaValueSecond = areaObj.city
					item.areaValueThird = areaObj.county
					item.template='Y';  // 模版上传
					if(item.pdType == '2' ) {
						this.reduceList.push(item)
					} else {
						this.addList.push(item)
					}
                });
            }else{
				this.dialogVisible=true;
				this.$message.error(file.msg);
            }
		}, 
		// 模版上传成功
        handleSuccess1(file, fileList) {
            this.loadingInstance.close();
            let {code} =file
            if(code=='0000'){
                this.$message.success('上传成功');
                file.list.forEach(item => {
					item.holderName = this.data.holderName;
					item.idType = item.licenceType;
					item.workType = item.post;
					item.licenceCode = pdPerType.idType.find(subItem => subItem.label == item.licenceType) ? pdPerType.idType.find(subItem => subItem.label == item.licenceType).value : ''
					item.postCode = pdPerType.typeOptions.find(i => i.label == item.post) ? pdPerType.typeOptions.find(i => i.label == item.post).value : '' ;
					item.template='Y';  // 模版上传
					if(item.changeType == '批减' ) {
						item.pdType = "2";
						this.reduceList.push(item)
					} else {
						item.pdType = "1";
						this.addList.push(item)
					}
                });
            }else{
                this.dialogVisible=true;
                this.$message.error(file.msg);
            }
        }, 
        onError(){
            this.loadingInstance.close();
            this.$message.error('失败');

		},
		// 上传时执行的函数
        onProgress(){
            this.loadingInstance = Loading.service({
                text: "加载中..."
            });
		},
		allDel() {
			let msg = this.uploadTem == 'dt' ? '是否删除全部设备？' : this.uploadTem == 'gz' ? '是否删除全部人员？' : '';
			this.$confirm(msg, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.addList = [];
				this.reduceList = [];
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
			
		},
		checkType() {
			if(this.ruleForm.endorsementsType == '01' || this.ruleForm.endorsementsType == '10') {
				this.ruleForm.batchPremium = 0;
				this.ruleForm.batchPremium1 = 0;
				this.ruleForm.afterAmount = 0;
				this.moneyDisable = true;
			} else {
				this.moneyDisable = false;
			}
		}
	},
}

</script>

<style lang="less">
#policyManagementNew{
	padding-top: 10px;
	padding-bottom: 80px;
	background-color: #FAFAFA;
	.common-style {
		margin: 10px;
		background-color: #ffffff;
		border-radius: 5px;
	}
	.pd20 {
		padding: 20px;
	}
	.title-text {
		height: 50px;
		line-height: 50px;
		font-size: 20px;
		color: #101010;
		padding: 5px 10px;
	}
	.policy-info {
		padding: 20px 10px 10px 10px;
		.el-form-item {
			margin-bottom: 0px;
		}
	}
	.step-line {
		padding: 25px;
		.el-step.is-horizontal .el-step__line {
			top: 20px;
		}
		.el-step__icon {
			width: 40px;
			height: 40px;
		}
		.el-step__title.is-process {
			font-weight: 500;
			color: #C0C4CC;
		}
		.is-finish .el-step__icon.is-text {
			border-width: 1px;
			background-color: #e6f7ff;
		}
		.is-wait .el-step__icon.is-text,.is-process .el-step__icon.is-text {
			border-width: 1px;
			background-color: #f7f7f7;
		}
		.el-step__head.is-process {
			color: #C0C4CC;
			border-color: #C0C4CC;
		}
		.el-step__head.is-finish {
			color: #096dd9;
			border-color:#096dd9;
		}
		.el-step__title.is-finish {
			color:#101010;
		}
	}
	.pd-content {
		padding: 20px;
		.title-text1 {
			font-size: 20px;
			color: #101010;
			padding: 20px 0px;
			border-bottom: 1px solid #ccc;
			.line {
				border-left: 5px solid #ffc069;
				margin-right: 20px;
				margin-left: 20px;
			}
			.all-delete {
				cursor: pointer;
				font-size: 18px;
				color: #ff7150;
				font-weight: 400;
			}
			.ts-download{
				display: inline-block;
				cursor: pointer;
				span{
					vertical-align: middle;
				}
			}
		}
	}
	.no-data {
		font-weight: 400;
		font-size: 18px;
		color:#919191;
		letter-spacing: 0px;
		line-height: 30px;
		text-decoration: none;
		text-align: center;
	}
	.col-red {
		color: #ff7150;
	}




	.content1{
		width: 100%;
		height: 60px;
		padding-left: 20px;
		.item1{
			display: block;
			font-size: 18px;
			font-weight: 600;
			color: #101010;
		}
		.item2{
			display: block;
			width: 70px;
			height: 3px;
			background-color: #3A48E2;
		}
	}
	.content2{
		width: 100%;
		padding-left: 15%;
		.item3{
			width: 360px;
		}
		.item4{
			width: 170px;
			height: 40px;
		}
	}
}
</style>
