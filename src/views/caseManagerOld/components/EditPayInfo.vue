<template>
    <div id="editPayInfo">
        <el-dialog title="索赔信息" :visible.sync="dialogVisiblePayInfo"  width="40%" :before-close="handleClose" class="edit-payinfo">
			<el-form ref="data" :label-position="rightPosition" label-width="120px" :inline="true" class="demo-form-inline">
                <el-form-item label="案件接收时间">
                    <el-date-picker v-model="data.clientOfferFullMaterialsTime"  value-format="yyyy-MM-dd HH:mm:ss" type="datetime"  placeholder="选择日期时间" />
                </el-form-item>
                <el-form-item label="原件寄送时间">
                    <el-date-picker v-model="data.materialsSendInsuranceCompanyTime" value-format="yyyy-MM-dd HH:mm:ss"  type="datetime"  placeholder="选择日期时间" />
                </el-form-item>
                <el-form-item label="索赔金额">
                    <el-input placeholder="请输入索赔金额" v-model="data.claimAmount" clearable> </el-input>
                </el-form-item>
			</el-form>
            <div class="gs-money">
            <h5>估损明细</h5>
                <el-row v-for="(item,index) in data.loss2List.find(item =>item.lossFrom == '01').loss3List" :key="index" class="margin10">
                    <el-col :span="12">
                        <span class="span-style">费用类型</span>
                        <el-select v-model="item.compensationItems" clearable placeholder="请选择" @change="setInfoName(item.compensationItems,csaeDictionaries.lossFromType,index,data.loss2List.find(item =>item.lossFrom == '01').lossFrom)">
                            <el-option v-for="item in csaeDictionaries.lossFromType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="11">
                        <span class="span-style1">估损金额</span>
                        <el-input v-model="item.compensationAmount" placeholder="请输入估损金额" @blur="comMoneyGS"></el-input>
                    </el-col>
                </el-row>
                <p class="option-btn">
                    <span class="add-col" @click="addMoney(data.loss2List.find(item =>item.lossFrom == '01').lossFrom)"><i class="el-icon-plus"></i>新增</span>
                    <span class="fr mr40">估损金额： <span class="money-color">{{formInline.GSmoney ? '￥' + formInline.GSmoney : '---'}}元</span></span>
                </p>   
            </div>
            <div class="gs-money">
                <h5>理赔明细</h5>
                <el-switch v-model="delivery" class="margin10" inactive-text="是否已核赔"></el-switch>
                <div v-if="delivery">
                    <el-row v-for="(item,index) in data.loss2List.find(item =>item.lossFrom == '02').loss3List" :key="index" class="margin10">
                        <el-col :span="12">
                            <span class="span-style">费用类型</span>
                            <el-select v-model="item.compensationItems" clearable placeholder="请选择" @change="setInfoName(item.compensationItems,csaeDictionaries.lossFromType,index,data.loss2List.find(item =>item.lossFrom == '02').lossFrom)">
                                <el-option v-for="item in csaeDictionaries.lossFromType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="9">
                            <span style="display:inline-block">理赔金额</span>
                            <el-input v-model="item.compensationAmount" @blur="comMoneyLP" placeholder="请输入估损金额"></el-input>
                        </el-col>
                    </el-row>
                    <p class="option-btn">
                        <span @click="addMoney(data.loss2List.find(item =>item.lossFrom == '02').lossFrom)" class="add-col"><i class="el-icon-plus"></i>添加理赔</span>
                        <span class="fr mr40">理赔金额： <span class="money-color">{{formInline.LPmoney ? '￥' + formInline.LPmoney : '---'}}元</span></span>
                    </p>
                </div>  
            </div>
			<span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="submit('data')">确 认</el-button>
			</span>
		</el-dialog>
    </div>
    
</template>  
<script>
import CaseService from '../../../service/CaseService.js';
import verificationduplication from '../js/verificationduplication.js';
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    props: {
        isShow:{
            type: Boolean,
            required:true
        }
    },
    computed:{
        ...mapGetters([
            "payInfo",
            "csaeDictionaries",
        ]),
    },
    data() {
		return {
            formInline:{
                GSmoney:0,
                LPmoney:0,
            },
            data:{},
            delivery:false,
            caseService: new CaseService(),
            verificationduplication:new verificationduplication(),
            dialogVisiblePayInfo: false,
            rightPosition:'right',
            
		}
    },
    watch: {
        isShow(val) {
            this.dialogVisiblePayInfo = val;
        }
    },
    created() {
        this.checkData();
    },
    methods: {
        checkData(){//处理结构
            this.data = JSON.parse(JSON.stringify(this.payInfo));
            this.delivery = this.data.isCompanyClaims == '0'?true:false;
            if(this.data.id){
                if(this.data.loss2List){
                    this.data.loss2List.forEach(item =>{
                        if(item.lossFrom == '01'){
                            this.formInline.GSmoney = item.totalAmount
                        } else if(item.lossFrom == '02') {
                            this.formInline.LPmoney = item.totalAmount
                        }
                    })
                }
            }
        },
        async submit() { //保存
            this.data.isCompanyClaims = this.delivery?'0':'1';
            this.data.reportNo = this.$route.query.reportNo;
            let list = [];
            this.data.loss2List.find(item =>item.lossFrom == "01").loss3List.forEach(item => {
                if(item.compensationItems){
                    list.push(item)
                }
            });
            this.data.loss2List.find(item =>item.lossFrom == "01").loss3List = list;
            let list1 = [];
            this.data.loss2List.find(item =>item.lossFrom == "02").loss3List.forEach(ele => {
                if(ele.compensationItems){
                    list1.push(ele)
                }
            });
            this.data.loss2List.find(item =>item.lossFrom == "02").loss3List = list1;
            let res = await this.caseService.addPayInfo(this.data);
            if(res.code == '0000') {
                this.$message({
					type: 'success',
					message: '编辑成功!'
                });
                this.searchInfo();
            }
        },
        async searchInfo() {//更新数据
            let res = await this.caseService.searchPayInfo(this.$route.query.reportNo);
            if(res.code == '0000') {
                this.$store.commit('updataPayInfo',res.data);
                this.handleClose();
            }
        }, 
        handleClose() {//关闭弹框
            this.dialogVisiblePayInfo = false;
            this.$parent.checkFalse();
            this.$parent.searchInfo();
        },
        setInfoName(val,arr,index,lossFrom){//选择类型,验证
            let obj = {};
            obj = arr.find(item =>{
                return item.value == val;
            });
            this.data.loss2List.find(item =>item.lossFrom == lossFrom).loss3List[index].compensationItemsCode = obj.value;
            if(JSON.stringify(obj) != '{}') {
                let list = [];
                this.data.loss2List.find(item =>item.lossFrom == lossFrom).loss3List.forEach(item =>{
                    list.push(item.compensationItemsCode)
                });
                let isPass = this.verificationduplication.isRepeat(list,index,val);
                if(!isPass){
                    this.$message({
                        message: '费用类型重复,请重新选择',
                        type: 'warning'
                    });
                    this.data.loss2List.find(item =>item.lossFrom == lossFrom).loss3List[index].compensationItems = '';
                    this.data.loss2List.find(item =>item.lossFrom == lossFrom).loss3List[index].compensationItemsCode = "";
                    this.data.loss2List.find(item =>item.lossFrom == lossFrom).loss3List[index].compensationAmount = "";
                    this.comMoneyGS();
                    this.comMoneyLP();
                    return
                }
                this.data.loss2List.find(item =>item.lossFrom == lossFrom).loss3List[index].compensationItems = obj.label;
                this.data.loss2List.find(item =>item.lossFrom == lossFrom).loss3List[index].compensationItemsCode = obj.value;
            }
        },
        addMoney(lossFrom) {//添加数据
            let obj = {
                compensationItemsCode:"",
                compensationAmount:"",
            };
            this.data.loss2List.find(item =>item.lossFrom == lossFrom).loss3List.push(obj);
        },
        comMoneyGS() {//计算总和
            this.formInline.GSmoney = 0;
            this.data.loss2List.find(item =>item.lossFrom == "01").loss3List.forEach(item => {
                this.formInline.GSmoney += Number(item.compensationAmount);
            });
        },
        comMoneyLP() {//计算总和
            this.formInline.LPmoney = 0;
            this.data.loss2List.find(item =>item.lossFrom == "02").loss3List.forEach(item => {
                this.formInline.LPmoney += Number(item.compensationAmount);
            });
        },
	},
}
    
</script>
<style lang="less">
    #editPayInfo {
        .edit-payinfo {
            .el-form {
                margin: 0;
            }
        }
        .gs-money {
            .margin10,.option-btn {
                margin:10px 28px;
            }
            .mr40 {
                margin-right: 40px;
            }
            .el-input {
                width: 70%;
            }
            h5 {
                margin:10px;
                font-size:15px;
                color:#333;
                font-weight:700;
            }
        }
        .add-col {
            color: #c9984a;
            cursor:pointer;
        }
        .del-style {
            margin-top:10px;
            vertical-align: middle;
            color:#F56C6C;
            font-size:16px;
            cursor:pointer;
        }
        .span-style {
            display: inline-block;
            width: 83px;
            text-align: right;
            margin-right: 5px;
        }
        .span-style1 {
            display: inline-block;
            width: 73px;
            text-align: right;
            margin-right: 5px;
        }
        .money-color {
            color: #ff3000;
        }
        .option-btn {
            padding:10px;
            border: 1px solid #ececec;
        }
    }
</style>