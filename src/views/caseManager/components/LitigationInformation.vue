<template>
    <div id="litigationInformation">
        <div class="edit-top">
            <span class="col-orange"><span class="col-orange-bor"></span>诉讼信息</span>
            <span class='fr mt16 edit-icon' style= "color:#Fa8c16;" v-if="!litigationInfos && (reportStatus == '04' || reportStatus == '03') && !disabledBtn" @click="toEditLitigation"><i  class="el-icon-edit"></i> 编辑内容</span>
            <span class='fr mt16 edit-icon' style="background-color: #Fa8c16;color: #FFFF;padding: 5px 20px;border-radius: 20px;"  v-if="litigationInfos && !disabledBtn" @click="toEditLitigation">立即处理</span>
        </div>
        <div class="border-style">
            <div v-if="!litigationInfos">
                <el-row class="con-row">
                    <el-col :span="7">
                            <span>诉讼时间：</span>
                            <span class="col-black">{{litigationInfo.litigationTime}}</span>
                    </el-col>
                    <el-col :span="7">
                            <span>诉讼金额：</span>
                            <span class="col-red">{{ '￥' + litigationInfo.litigationMoney}}</span>
                    </el-col>
                    <el-col :span="7">
                            <span>诉讼结果：</span>
                            <span class="col-black" style="color:#FA8C16">{{litigationInfo.litigationResult =='01' ? '胜诉' : '败诉'}}</span>
                    </el-col>
                </el-row>
                <el-row class="con-row pb20">
                    <el-col :span="24">
                        <span>备注：</span>
                        <span class="col-black" style="color:#096DD9">{{litigationInfo.otherContent}}</span>
                    </el-col>
                </el-row>
            </div>
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
        <el-dialog title="诉讼信息" :visible.sync="dialogVisibleLitigation"  width="40%" :before-close="handleClose" :close-on-click-modal='false'>
			<el-form :model="litigation" ref="litigation"  :label-position="rightPosition" label-width="120px" :rules="rules">
                <el-form-item label="诉讼结果：" prop="litigationResult">
                    <!-- <el-select size="mini" v-model="litigation.litigationResult" clearable placeholder="请选择">
                        <el-option label="胜诉" value="01" ></el-option>
                        <el-option label="败诉" value="02" ></el-option>
                    </el-select> -->
                    <el-radio-group v-model="litigation.litigationResult">
                        <el-radio  label="01">胜诉</el-radio>
                        <el-radio  label="02">败诉</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="诉讼时间：" prop="litigationTime">
                    <el-date-picker size="mini" v-model="litigation.litigationTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"> </el-date-picker>
                </el-form-item>
                <el-form-item label="诉讼金额：" prop="litigationMoney">
                    <el-input size="mini" v-model="litigation.litigationMoney" style="width:45%" type="input" placeholder="￥诉讼金额"><template slot="append">元</template></el-input> 
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="litigation.otherContent" type="textarea" row="2" placeholder="请输入备注"></el-input>
                </el-form-item>
			</el-form>
            <div class="btn">
                <span class="btn-left" @click="dialogVisibleLitigation = false">取消</span>
                <span class="btn-right" @click="submLtlitigation('litigation')">确认提交</span>
            </div>
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
    props:{
        disabledBtn:{
            type:Boolean,
            default: false
        }
    },
    components:{
        EditPayInfo
    },
    computed:{
        ...mapGetters([
            "payInfo",
            "accountInfo",
            "makemoneys",
            "litigationInfo",
            "reportStatus",
            "caseStopInfo"
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
            if(this.caseStopInfo && this.caseStopInfo.flag) {
                this.$message.error('请解除中止后继续操作');
                return false
            }
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
    #litigationInformation {
        margin-top: 20px;
        background-color: #fff;
        .col-orange {
            color: #c9984a;
        }
        .bor-btm {
            border-bottom: 1px dashed #ccc;
        }
        .bg-style {
            margin-bottom: 5px;
            padding: 5px 30px;
        }
        .border-style {
            margin-top: 10px;
            border-bottom: 0!important;
            .content-title {
                padding: 20px 60px 6px;
            }
            .con-row{
                padding-left: 35px;
                margin-top: 10px;
                color: #000;
                .col-status{
                    display: inline-block;
                    padding: 5px 15px;
                    background-color: #FFE7BA;
                    border-radius: 20px;
                    color: #FA8C16;
                }
                
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