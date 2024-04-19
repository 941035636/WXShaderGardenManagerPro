<template>
    <div id="claimInformation">
        <div class="edit-top">
            <span class="content-title col-orange">索赔信息</span>
        </div>
        <div class="border-style">
            <el-form :label-position="rightPosition">
                <el-button type="warning" plain v-if="!showInfo" @click="toEditPass" :disabled="reportStatus != '04' && reportStatus != '03'">去添加</el-button>
            </el-form>
            <div v-if="showInfo">
                <el-form :label-position="rightPosition">
                    <div>
                        <el-row>
                            <el-col :span="21">
                                <el-form-item label="索赔金额：">
                                    <span class="col-red">{{'￥'+Number(payInfo.claimAmount).toFixed(2)}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-button size="medium" v-if="reportStatus == '04' || reportStatus == '03'" type="primary" plain @click="toEditPass">修改</el-button>
                                <el-button size="medium" v-if="reportStatus == '04' || reportStatus == '03'" type="danger" plain @click="toDelete">删除</el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="7">
                                <el-form-item label="案件原件接收时间：">
                                    <span class="col-black">{{payInfo.clientOfferFullMaterialsTime}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="案件原件寄送时间：">
                                    <span class="col-black">{{payInfo.materialsSendInsuranceCompanyTime}}</span>
                                </el-form-item>
                            </el-col>
                            
                        </el-row>
                    </div>
                </el-form>
                <span class="content-title">估损明细</span>
                <el-form    :label-position="rightPosition">
                    <div>
                        <el-row>
                            <el-col :span="7">
                                <el-form-item label="估损金额：" >
                                    <span class="col-red">{{'￥'+Number(payInfo.GSmoney).toFixed(2)}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-table  :data="payInfo.loss2List.find(item =>item.lossFrom == '01').loss3List"  style="width: 80%;" :header-cell-style="getRowClass">
                            <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
                            <el-table-column prop="compensationItems" label="费用明细" align="center"></el-table-column>
                            <el-table-column prop="compensationAmount" label="估损金额" align="center">
                                <template slot-scope="scope">
                                    <span class="col-red">{{'￥'+Number(scope.row.compensationAmount).toFixed(2)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" v-if="reportStatus == '04' || reportStatus == '03'">
                                <template slot-scope="scope">
                                    <i class="el-icon-error" @click="delMoney(scope.row)"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form>
                <span class="content-title">理赔明细</span>
                <el-form  :label-position="rightPosition" class="bor-btm">
                    <div>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="保险公司是否已核赔：">
                                    <span class="col-black">{{payInfo.isCompanyClaims == '0' ? '是':'否'}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="理赔金额：">
                                    <span class="col-red">{{'￥'+Number(payInfo.LPmoney).toFixed(2)}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-table :data="payInfo.loss2List.find(item =>item.lossFrom == '02').loss3List"  style="width: 80%;" :header-cell-style="getRowClass">
                            <el-table-column type="index" label="序号" align="center"  width="80px"></el-table-column>
                            <el-table-column prop="compensationItems" label="费用明细" align="center"></el-table-column>
                            <el-table-column prop="compensationAmount" label="估损金额" align="center">
                                <template slot-scope="scope">
                                    <span class="col-red">{{'￥'+Number(scope.row.compensationAmount).toFixed(2)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" v-if="reportStatus == '04' || reportStatus == '03'">
                                <template slot-scope="scope">
                                    <i class="el-icon-error" @click="delMoney(scope.row)"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form>
            </div> 
        </div>
        <div class="border-style">
            <span class="content-title">收款人信息</span>
            <el-form    :label-position="rightPosition">
                <el-button type="warning" plain v-if="accountNull" :disabled="reportStatus != '04' && reportStatus != '03'" @click="toEditAccount">去添加</el-button>
                <div v-if="!accountNull" class="bg-style">
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="收款户名：">
                                <span class="col-black">{{accountInfo.payeeName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="收款账户：">
                                <span class="col-black">{{accountInfo.cardBank}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="开户银行：">
                                <span class="col-black">{{accountInfo.bankCardAccount}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-button size="mini" v-if="reportStatus == '04' || reportStatus == '03'" type="primary" plain @click="toEditAccount" style="margin-top:5px;">修改</el-button>
                            <el-button size="mini" v-if="reportStatus == '04' || reportStatus == '03'" type="danger" plain @click="deleteAccount" style="margin-top:5px;">删除</el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
            <span class="content-title">打款信息</span>
            <el-form :label-position="rightPosition" class="bor-btm">
                <el-button type="warning" plain v-if="accountNull" :disabled="reportStatus != '04' && reportStatus != '03'" @click="toEditAccount">去添加</el-button>
                <div v-if="makemoneys.paymentTime" class="bg-style">
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="打款时间：">
                                <span class="col-black">{{makemoneys.paymentTime ? makemoneys.paymentTime : '-'}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="到账时间：">
                                <span class="col-black">{{makemoneys.paymentDate ? makemoneys.paymentDate : '-'}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3" :offset="7">
                            <el-button size="mini" v-if="reportStatus == '04' || reportStatus == '03'" type="primary" plain @click="toEditTime">修改</el-button>
                            <el-button size="mini" v-if="makemoneys.paymentDate && reportStatus == '04' || makemoneys.paymentDate && reportStatus == '03'" type="danger" plain @click="deleteTime">删除</el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
        <div class="border-style">
            <span class="content-title">诉讼信息</span>
            <el-form  :label-position="rightPosition">
                <el-button type="warning" :disabled="reportStatus != '04' && reportStatus != '03'" plain v-if="litigationInfos" @click="toEditLitigation">去添加</el-button>
                <div v-if="!litigationInfos">
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="诉讼结果：">
                                <span class="col-black">{{litigationInfo.litigationResult =='01' ? '胜诉' : '败诉'}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="诉讼金额：">
                                <span class="col-red">{{ '￥' + litigationInfo.litigationMoney}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="诉讼时间：">
                                <span class="col-black">{{litigationInfo.litigationTime}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-button size="mini" v-if="reportStatus == '04' || reportStatus == '03'" type="primary" plain @click="toEditLitigationBefore" style="margin-top:5px;">修改</el-button>
                            <el-button size="mini" v-if="reportStatus == '04' || reportStatus == '03'" type="danger" plain @click="delLitigation" style="margin-top:5px;">删除</el-button>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="备注：">
                                <span class="col-black">{{litigationInfo.otherContent}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
        <el-dialog title="收款人账户" :visible.sync="dialogVisibleAccount"  width="40%" :before-close="handleClose">
			<el-form :model="account" ref="account"  :label-position="rightPosition" label-width="120px" :rules="rules">
                <el-form-item label="收款人：" prop="payeeName">
                    <el-input v-model="account.payeeName" type="input" placeholder="姓名/企业账户名"></el-input>
                </el-form-item>
                <el-form-item label="收款账户：" prop="cardBank">
                    <el-input v-model="account.cardBank" type="input" placeholder="收款账号"></el-input>
                </el-form-item>
                <el-form-item label="开户行：" prop="bankCardAccount">
                    <el-input v-model="account.bankCardAccount" type="input"  placeholder="请输入开户行"></el-input>
                </el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="submit('account')">确 认</el-button>
			</span>
		</el-dialog>
        <el-dialog title="诉讼信息" :visible.sync="dialogVisibleLitigation"  width="40%" :before-close="handleClose">
			<el-form :model="litigation" ref="litigation"  :label-position="rightPosition" label-width="120px" :rules="rules">
                <el-form-item label="诉讼结果：" prop="litigationResult">
                    <el-select v-model="litigation.litigationResult" clearable placeholder="请选择">
                        <el-option label="胜诉" value="01" ></el-option>
                        <el-option label="败诉" value="02" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="诉讼金额：" prop="litigationMoney">
                    <el-input v-model="litigation.litigationMoney" class="input-style" type="input" placeholder="￥诉讼金额"></el-input>&nbsp;&nbsp;单位(元)
                </el-form-item>
                <el-form-item label="诉讼时间：" prop="litigationTime">
                    <el-date-picker v-model="litigation.litigationTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="litigation.otherContent" type="textarea" row="3" placeholder="请输入备注"></el-input>
                </el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="submLtlitigation('litigation')">确 认</el-button>
			</span>
		</el-dialog>
        <el-dialog title="打款与到账" :visible.sync="dialogVisibleTime"  width="30%" :before-close="handleClose">
			<el-form :model="makemoney" ref="makemoney"  :label-position="rightPosition" label-width="100px" :rules="rules">
                <el-form-item label="打款时间" prop="paymentTime">
                    <el-date-picker v-model="makemoney.paymentTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="到账时间" prop="paymentDate">
                   <el-date-picker v-model="makemoney.paymentDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"> </el-date-picker>
                </el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="submitMT('makemoney')">确 认</el-button>
			</span>
		</el-dialog>

        <EditPayInfo :isShow="showPayInfo" ref="checkData"></EditPayInfo>

         
    </div>
</template>
<script>
import CaseService from '../../../service/CaseService.js';
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import EditPayInfo from './EditPayInfo.vue';
import store from '@/store/index'
export default {
    components:{
        EditPayInfo
    },
    computed:{
        ...mapGetters([
            "payInfo",
            "accountInfo",
            "makemoneys",
            "litigationInfo",
            "reportStatus"
        ]),
    },
    store,
    data() {
        var litigationMoney = (rule, value, callback) => {
			const litigationMoneyReg = /^\d+(\.\d{0,2})?$/
			if (!value) {
			return callback(new Error("诉讼金额不能为空"))
			}
			if (value<=0) {
			return callback(new Error("诉讼金额必须大于0"))
            }
            if (value > 100000000) {
			return callback(new Error("诉讼金额必须小于等于100000000"))
			}
			setTimeout(() => {
				if (litigationMoneyReg.test(value)) {
					callback()
				} else {
					callback(new Error("诉讼金额保留小数点后两位"))
				}
			}, 100)
		};
		return {
            caseService: new CaseService(),
            showPayInfo:false,
            accountNull:false,
            account:{},
            makemoney:{
                "paymentTime":'',
                "paymentDate":'',
                "reportNo":this.$route.query.reportNo,
            },
            litigation:{},
            dialogVisible:false,
            dialogVisibleAccount: false,
            dialogVisibleLitigation: false,
            dialogVisibleTime:false,
            showInfo: false,
            litigationInfos:false,
			rightPosition: 'rigth',
            rules:{
                paymentDate:[
                    {required: true, message: '请选择到账时间', trigger: 'change'}
                ],
                paymentTime:[
                    {required: true, message: '请选择打款时间', trigger: 'change'}
                ],
                payeeName:[
                    {required: true, message: '请输入姓名/企业账户名', trigger: 'blur'}
                ],
                cardBank:[
                    {required: true, message: '请输入收款账号', trigger: 'blur'}
                ],
                bankCardAccount:[
                    {required: true, message: '请输入开户行', trigger: 'blur'}
                ],
                litigationResult:[
                    {required: true, message: '请选择诉讼结果', trigger: 'change'}
                ],
                litigationMoney:[
                    {validator: litigationMoney, required: true,trigger: 'blur'}
                ],
                litigationTime:[
                    {required: true, message: '请选择诉讼时间', trigger: 'change'}
                ]
            },
		}
    },
    created() {
        this.searchInfo();
        this.accountInfos();
    },
    mounted() {
        
    },
    methods: {
        getRowClass({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #fefbf1;border-bottom:1px solid #f0dfbf;color:#cda160;font-size:16px;';
            } else {
                return 'background: #fff';
            }
		},
        accountInfos(){ //获取vuex数据
            this.account = JSON.parse(JSON.stringify(this.accountInfo));
            this.litigation = JSON.parse(JSON.stringify(this.litigationInfo));
            this.makemoney = JSON.parse(JSON.stringify(this.makemoneys));
            if(this.account.payeeName){
                this.accountNull = false;
            }else{
                this.accountNull = true;
            };
            if(this.litigationInfo.litigationResult){
                this.litigationInfos = false;
            }else{
                this.litigationInfos = true;
            };
        },
        toEditAccount() {//打开弹框
            this.account = JSON.parse(JSON.stringify(this.accountInfo));
			this.dialogVisibleAccount = true;
        },
        submit(account){ //修改或新增
            this.$refs[account].validate((valid) => {
                if (valid) {
                    this.submits();
                } else {
                    return false;
                }
            });
        },
        async submits(){
            if(this.account.id) {
                let res = await this.caseService.editAccount(this.account);
                if(res.code == '0000') {
                    this.$message({
                        message:'修改成功',
                        type: 'success'
                    });
                    this.getAccount();
                    this.handleClose();
                }
            } else {
                this.account.reportNo = this.$route.query.reportNo;
                this.account.caseNo = this.$route.query.caseNo;
                let res = await this.caseService.addAccount(this.account);
                if(res.code == '0000') {
                    this.$message({
                        message:'添加成功',
                        type: 'success'
                    })
                    this.accountNull = false;
                    this.getAccount();
                    this.handleClose();
                }
            }
        },
        async getAccount() { //查询
            let res = await this.caseService.searchAccount(this.$route.query.reportNo);
            if(res.code =='0000') {
                if(res.data) {
                    this.account = res.data;
                    this.accountNull = false;
                } else {
                    this.account = {};
                    this.accountNull = true;
                }
                this.$store.commit('updataAccountInfo',this.account);
            }
        },
        deleteAccount() {
            this.$confirm('是否删除账户信息?', '删除收款人账户信息', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
                this.deleteFun();
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除!'
				});          
			});
        },
        async deleteFun() { //删除
            let res = await this.caseService.delAccount(this.account.id);
            if(res.code =='0000') {
                this.account = {};
                this.accountNull = true;
                this.$store.commit('updataAccountInfo',this.account);
                this.$message({
					type: 'success',
					message: '删除成功!'
                });
            }
        },
        searchInfo(){//获取vuex数据索赔信息
            if(this.payInfo.id){
                this.showInfo = true;
                if( this.payInfo.loss2List) {
                    this.payInfo.loss2List.forEach(item =>{
                        if(item.loss3List == null){
                            item.loss3List = [];
                        }
                        if(item.lossFrom == '01'){
                            this.payInfo.GSmoney = item.totalAmount
                        } else if(item.lossFrom == '02') {
                            this.payInfo.LPmoney = item.totalAmount
                        }
                    })
                } 
            }else{
                let data = {
                    "claimAmount": "",
                    "clientOfferFullMaterialsTime": "",
                    "delivery":"",
                    "id": "",
                    "loss2List": [
                        {
                        "id": "",
                        "loss3List": [],
                        "lossFrom": "01",
                        "totalAmount":''
                        },
                        {
                        "id": "",
                        "loss3List": [],
                        "lossFrom": "02",
                        "totalAmount":''
                        }
                    ],
                    "materialsSendInsuranceCompanyTime": "",
                    "reportNo": this.$route.query.reportNo
                };
                this.$store.commit('updataPayInfo',data);
                this.showInfo = false;
            }
        }, 
        delMoney(row){//删除数据
            this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               this.deletesgl(row);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
            
        },
        async deletesgl(row){
            let res = await this.caseService.deletesgl(row.id);
            if(res.code == "0000"){
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.searchInfos();
            }
        },
        async searchInfos() {//更新数据
            let res = await this.caseService.searchPayInfo(this.$route.query.reportNo);
            if(res.code == '0000') {
                this.$store.commit('updataPayInfo',res.data);
                this.searchInfo();
            }
        }, 
        toEditPass(){//打开弹框
            this.showPayInfo = true;
            this.$refs.checkData.checkData();
        },
        checkFalse() {//关闭弹框
            this.showPayInfo = false;
        },
        toDelete() {
            this.$confirm('是否删除索赔资料?', '删除索赔资料信息', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
                this.deleteSourceFun();
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除!'
				});          
			});
        },
        async deleteSourceFun() {
            let res = await this.caseService.delSource(this.$route.query.reportNo);
            if(res.code =='0000') {
                this.$message({
					type: 'success',
					message: '删除成功!'
                });
                this.searchInfos();
            }
        },
        toEditTime() {
            this.makemoney = JSON.parse(JSON.stringify(this.makemoneys));
            this.dialogVisibleTime = true;
        },
        submitMT(formName) {//收款信息
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitFun();
                } else {
                    return false;
                }
            });
        },
        async submitFun() {//收款信息
            this.makemoney.reportNo = this.$route.query.reportNo;
            let res = await this.caseService.editPayment(this.makemoney);
            if(res.code == '0000') {
                this.$message({
                    message:'编辑成功',
                    type: 'success'
                });
                this.$store.commit('updataMakemoneys',this.makemoney);
                this.handleClose();
            }
        },
        deleteTime() {
            this.$confirm('是否删除打款与到账信息?', '删除信息', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
                this.deleteMTFun();
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除!'
				});          
			});
        },
        async deleteMTFun() {
            let res = await this.caseService.delPayment(this.$route.query.reportNo);
            if(res.code =='0000') {
                this.makemoney = {
                    paymentTime: "",
                    paymentDate: "",
                    reportNo: this.$route.query.reportNo,
                };
                this.$message({
					type: 'success',
					message: '删除成功!'
                });
                this.$store.commit('updataMakemoneys',this.makemoney);
            }
        },
        toEditLitigation() {//打开弹框
            this.dialogVisibleLitigation = true;
        },
        toEditLitigationBefore() {//打开弹框
            this.toEditLitigation();
        },
        submLtlitigation(litigation) { //诉讼信息
            this.$refs[litigation].validate((valid) => {
                if (valid) {
                    this.submLtlitigations();
                } else {
                    return false;
                }
            });
        },
        async submLtlitigations(){
            this.litigation.reportNo = this.$route.query.reportNo;
            this.litigation.caseNo = this.$route.query.caseNo;
            let res = await this.caseService.addLitigation(this.litigation);
            if(res.code == '0000') {
                this.$message({
                    message:'添加成功',
                    type: 'success'
                });
                if(res.data){
                    this.litigation.id = res.data;
                }
                this.$store.commit('updataLitigationInfo',this.litigation);
                this.accountInfos();
                this.handleClose();
            }
        },
        delLitigation() {
            this.$confirm('是否删除诉讼信息?', '删除诉讼信息', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
                this.deleteLitFun();
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除!'
				});          
			});
        },
        async deleteLitFun() {
            let res = await this.caseService.delLitigation(this.litigation.id);
            if(res.code =='0000') {
                this.$message({
					type: 'success',
					message: '删除成功!'
                });
                let litigationList = {
					litigationResult:"",
					litigationMoney:"",
					otherContent:"",
					litigationTime:"",
					id:"",
					reportNo: this.$route.query.reportNo,
					caseNo: this.$route.query.caseNo
				};
                this.$store.commit('updataLitigationInfo',litigationList);
                this.accountInfos();
            }
        },
        handleClose() {
			this.dialogVisibleAccount = false;
			this.dialogVisibleLitigation = false;
            this.dialogVisibleTime = false;
		},
	},
}
</script>
<style lang="less">
    #claimInformation {
        margin-top: 20px;
        background-color: #fff;
        .col-orange {
            color: #c9984a;
        }
        .bor-btm {
            border-bottom: 1px dashed #ccc;
        }
        .bg-style {
            background-color: #F7F7F7;
            margin-bottom: 5px;
            padding: 5px 30px;
        }
        .border-style {
            margin-top: 10px;
            border-bottom: 0!important;
            .content-title {
                padding: 20px 60px 6px;
            }
        }
        .el-dialog {
            .el-dialog__header {
                border-bottom: 1px solid #ccc;
                padding: 20px;
            }
            .el-dialog__body {
                .el-form {
                    .el-form-item__label {
                        color: #666;
                    }
                }
            }
            .el-dialog__footer {
                text-align: center;
                .el-button--warning {
                    padding: 14px 50px;
                    font-size: 14px;
                    background-color: #c9984a;
                    border-color: #c9984a;
                    font-size: 18px;
                }
            }
		}
		.inline-block {
			display: inline-block;
		}
		.mt50 {
			margin-top: 50px;
        }
        .input-style {
            width: 40%;
        }
        .col-red {
            color: #FF3000;
        }
    }

</style>