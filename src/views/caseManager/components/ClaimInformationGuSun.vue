<template>
    <div id="claimInformation">
        <div class="edit-top">
            <span class="col-orange"><span class="col-orange-bor"></span>索赔信息</span>
            <span class='fr mt16 edit-icon' style= "color:#Fa8c16;" v-if="showInfo && (reportStatus == '04' || reportStatus == '03') && !disabledBtn" @click="toEditPass"><i  class="el-icon-edit"></i> 编辑内容</span>
            <span class='fr mt16 edit-icon' style="background-color: #Fa8c16;color: #FFFF;padding: 5px 20px;border-radius: 20px;"  v-if="!showInfo && !disabledBtn" @click="toEditPass">立即处理</span>
        </div>
        <div class="border-style">
            <div v-if="showInfo">
                <div class="mt20">
                    <el-row class="con-row">
                        <el-col :span="7">
                            <span>案件原件接收时间：</span>
                            <span class="col-black">{{payInfo.clientOfferFullMaterialsTime}}</span>
                        </el-col>
                        <el-col :span="7">
                            <span>案件原件寄送时间：</span>
                            <span class="col-black">{{payInfo.materialsSendInsuranceCompanyTime}}</span>
                        </el-col>
                    </el-row>
                </div>
                <!-- <span class="content-title">估损明细</span> -->
                <span style="font-size:15px;color: #e6a23c; padding: 0px 35px 5px; display: inline-block; font-weight: 700;">估损明细</span>
                    <div>
                        <el-row class="con-row">
                            <el-col :span="7">
                                <span>估损金额：</span>
                                <span class="col-red">{{'￥'+Number(payInfo.GSmoney).toFixed(2)}}</span>
                                <span>元</span>
                            </el-col>
                        </el-row>
                        <div v-if="loss3List01.length != 0" class="con-row" style=" padding: 10px 40px;background-color: #FFF7E6;border-radius: 10px;width: 80%; " >
                            <el-row >
                                    <el-col :span="8" v-for="(item,key) in  loss3List01" :key="key" style="padding: 10px 0px">
                                        <span>{{item.compensationItems}}:</span>
                                        <span class="col-red">{{'￥'+Number(item.compensationAmount).toFixed(2)}}</span>
                                        <span>元</span>
                                    </el-col>
                            </el-row>
                        </div>
                    </div>
                <!-- <span style="font-size:15px;color: #e6a23c; padding: 0px 35px 5px; display: inline-block; font-weight: 700;">理赔明细</span>
                    <div class="pb20">
                        <el-row class="con-row" >
                            <el-col :span="6">
                                <span>理赔金额：</span>
                                <span class="col-red">{{'￥'+Number(payInfo.LPmoney).toFixed(2)}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>保险公司是否已核赔：</span>
                                <span class="col-black" style="color:#FA9830">{{payInfo.isCompanyClaims == '0' ? '是,保险公司已核赔':'否'}}</span>
                            </el-col>
                        </el-row>
                        <div v-if="loss3List02.length != 0" class="con-row" style=" padding: 10px 40px;background-color: #FFF7E6;border-radius: 10px;width: 80%; " >
                            <el-row >
                                    <el-col :span="8" v-for="(item,key) in  loss3List02" :key="key" style="padding: 10px 0px">
                                        <span>{{item.compensationItems}}:</span>
                                        <span class="col-red">{{'￥'+Number(item.compensationAmount).toFixed(2)}}</span>
                                        <span>元</span>
                                    </el-col>
                            </el-row>
                        </div>
                    </div> -->
            </div> 
        </div>
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
        EditPayInfo,
    },
    computed:{
        ...mapGetters([
            "payInfo",
            "accountInfo",
            "makemoneys",
            "litigationInfo",
            "reportStatus",
            "caseStopInfo",
            "pushInsuranceData"
        ]),
        loss3List01(){
            let payInfo = this.payInfo || []
            return  this.payInfo.loss2List.find(item =>item.lossFrom == '01')?payInfo.loss2List.find(item =>item.lossFrom == '01').loss3List:[]
        },
        loss3List02(){
            let payInfo = this.payInfo || []
            return  this.payInfo.loss2List.find(item =>item.lossFrom == '02')?payInfo.loss2List.find(item =>item.lossFrom == '02').loss3List:[]
        }
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
        async searchInfos() {//更新数据
            let res = await this.caseService.searchPayInfo(this.$route.query.reportNo);
            if(res.code == '0000') {
                this.$store.commit('updataPayInfo',res.data);
                this.searchInfo();
            }
        }, 
        toEditPass(){//打开弹框
            if(this.caseStopInfo && this.caseStopInfo.flag) {
                this.$message.error('请解除中止后继续操作');
                return false
            }
            this.showPayInfo = true;
            this.$refs.checkData.checkData(2);
        },
        async checkFalse() {//关闭弹框
            await this.$emit('getCaseDetail');
            this.$emit('changeBtn');
            this.showPayInfo = false;
        },
        // 清空索赔金额所有信息提示框
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
        // 清空索赔金额所有信息调用接口
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
        // 删除某一条金额数据提示信息
        delMoney(row){
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
        // 删除某一条金额数据调用接口
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
        openDetails(){
            for (const key in this.pushInsuranceData.pushInsuranceDetails) {
                this.lists.forEach(item => {
                    if(key == item.key) {
                        if(key == 'isCloseCase'){
                            item.value = this.pushInsuranceData.pushInsuranceDetails[key] == '0' ? '结案' : '未结案'
                        } else if(key == 'riskLocation') {
                            item.value = this.pushInsuranceData.pushInsuranceDetails[key] == '0' ? '境内' : '境外'
                        } else if(key == 'riskProvinceName') {
                            
                            item.value = `${this.pushInsuranceData.pushInsuranceDetails[key]}/${this.pushInsuranceData.pushInsuranceDetails['riskCityName']}/${this.pushInsuranceData.pushInsuranceDetails['riskAreaName']}`
                        } else if(key == 'estimatedLossAmount') {
                            item.value = `￥${this.pushInsuranceData.pushInsuranceDetails[key] || 0}`
                        } else if(key == 'totalMoney') {
                            item.value = `￥${this.pushInsuranceData.pushInsuranceDetails[key] || 0}`
                        } else {
                            item.value = this.pushInsuranceData.pushInsuranceDetails[key];
                        }
                    }
                })
            }
        }, 
	},
}
</script>
<style lang="less">
    #claimInformation {
        margin-top: 20px;
        background-color: #fff;
        padding-bottom: 20px;
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
                margin:10px 35px 15px;
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
    }

</style>