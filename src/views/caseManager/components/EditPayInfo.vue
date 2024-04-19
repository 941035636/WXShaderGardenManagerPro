<template>
    <div id="editPayInfo">
        <el-dialog :title="showPF ? '赔付信息' :'索赔信息'" :visible.sync="dialogVisiblePayInfo"  width="40%" :before-close="handleClose" class="edit-payinfo" :close-on-click-modal='false'> 
            <PushInsuranceCloseCase></PushInsuranceCloseCase>
			<el-form :model="data" ref="data" :label-position="rightPosition" label-width="120px" v-if="!showPF" :rules="rules" :inline="true" class="demo-form-inline">
                <p style="color: #000; padding: 0px 11px 5px; font-weight: 700;">案件接收/原件寄送</p>
                <el-form-item label="案件接收时间" prop="clientOfferFullMaterialsTime">
                    <el-date-picker size="mini" v-model="data.clientOfferFullMaterialsTime" :picker-options="dealDateStartOptions" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"  placeholder="选择日期时间" />
                </el-form-item>
                <el-form-item label="原件寄送时间" prop="materialsSendInsuranceCompanyTime">
                    <el-date-picker size="mini" v-model="data.materialsSendInsuranceCompanyTime" :picker-options="dealDateStartOptions" value-format="yyyy-MM-dd HH:mm:ss"  type="datetime"  placeholder="选择日期时间" />
                </el-form-item>
                <el-form-item label="索赔金额" class="mt10" prop="claimAmount">
                    <el-input size="mini" placeholder="请输入索赔金额" v-model="data.claimAmount" clearable> </el-input>
                </el-form-item>
			</el-form>
            <div class="gs-money" v-if="!showPF">
            <h5>估损明细（至少填写一项）</h5>
                <el-row class="margin10">
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="10">
                            <span class="span-style">费用类型</span>
                        </el-col>
                        <el-col :span="10">
                            <span class="span-style1">估损金额</span>
                        </el-col>
                </el-row>
                <el-row v-for="(item,index) in data.loss2List.find(item =>item.lossFrom == '01').loss3List" :key="index" v-if="!item.isDelete" class="margin10">
                    <el-col :span="1">
                        <i class="iconfont iconjianhao" style="color:#1296db;font-size:18px;vertical-align: middle; cursor: pointer;line-height: 30px;"  @click="deleteGsOrLp(index,data.loss2List.find(item =>item.lossFrom == '01').lossFrom)"></i>
                        <!-- <i class="el-icon-edit" style="cursor: pointer;" @click="deleteGsOrLp(index,data.loss2List.find(item =>item.lossFrom == '01').lossFrom)"></i> -->
                    </el-col>
                    <el-col :span="10">
                        <!-- <span class="span-style">费用类型</span> -->
                        <el-select style="width:100%" size="mini" v-model="item.compensationItems" clearable placeholder="请选择" @change="setInfoName(item.compensationItems,csaeDictionaries.lossFromType,index,data.loss2List.find(item =>item.lossFrom == '01').lossFrom)">
                            <el-option  v-for="item in csaeDictionaries.lossFromType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="10">
                        <!-- <span class="span-style1">估损金额</span> -->
                        <el-input style="width:100%" size="mini" v-model="item.compensationAmount" placeholder="请输入估损金额" @blur="comMoneyGS">
                            <template slot="append">元</template>
                        </el-input>
                    </el-col>
                </el-row>
                <p class="option-btn">
                    <span class="add-col" @click="addMoney(data.loss2List.find(item =>item.lossFrom == '01').lossFrom)">
                        <i class="iconfont iconjiahao1" style="color:#1296db;font-size:21px;vertical-align: middle; cursor: pointer;"></i>
                    新增</span>
                    <!-- <span class="fr">估损总金额： <span class="money-color">{{formInline.GSmoney ? '￥' + formInline.GSmoney : '---'}}元</span></span> -->
                </p>   
            </div>
            <div class="gs-money" v-if="showPF">
                <div style="display:flex" class="mb10">
                    <h5>赔付明细</h5>
                    <el-switch v-model="delivery" class="mt10 ml10" style="color:#1B84E8" inactive-text="是否已核赔"></el-switch>
                </div>
                
                <div v-if="delivery">
                    <el-row class="margin10">
                        <el-col :span="1">&nbsp;</el-col>
                        <el-col :span="10">
                                <span class="span-style">费用类型</span>
                            </el-col>
                            <el-col :span="10">
                                <span class="span-style1">赔付金额</span>
                            </el-col>
                    </el-row>
                    <el-row v-for="(item,index) in data.loss2List.find(item =>item.lossFrom == '02').loss3List" v-if="!item.isDelete && data.loss2List" :key="index" class="margin10">
                        <el-col :span="1">
                            <i class="iconfont iconjianhao" style="color:#1296db;font-size:18px;vertical-align: middle; cursor: pointer;line-height: 30px;"  @click="deleteGsOrLp(index,data.loss2List.find(item =>item.lossFrom == '02').lossFrom)"></i>
                        </el-col>
                        <el-col :span="10">
                            <el-select size="mini" v-model="item.compensationItems" clearable placeholder="请选择" @change="setInfoName(item.compensationItems,csaeDictionaries.lossFromType,index,data.loss2List.find(item =>item.lossFrom == '02').lossFrom)">
                                <el-option v-for="item in csaeDictionaries.lossFromType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="10">
                            <el-input size="mini" v-model="item.compensationAmount" @blur="comMoneyLP" placeholder="请输入理赔金额"><template slot="append">元</template></el-input>
                        </el-col>
                    </el-row>
                    <p class="option-btn">
                        <span @click="addMoney(data.loss2List.find(item =>item.lossFrom == '02').lossFrom)" class="add-col">
                            <i class="iconfont iconjiahao1" style="color:#1296db;font-size:21px;vertical-align: middle; cursor: pointer;"></i>
                            新增
                        </span>
                        <!-- <span class="fr">赔付总金额： <span class="money-color">{{formInline.LPmoney ? '￥' + formInline.LPmoney : '---'}}元</span></span> -->
                    </p>
                </div>  
            </div>
            <div style="height:36px;margin-left:10px;margin-right:28px;line-height: 36px;background-color:#FFF7E6;padding-right:10px;border-radius:3px">
                <span class="fr" v-if="showPF">赔付金额： <span class="money-color">{{formInline.LPmoney ? '￥' + formInline.LPmoney : '0.00'}}元</span>(CNY人民币)</span>
                <span class="fr mr40" v-if="!showPF">估损金额： <span class="money-color">{{formInline.GSmoney ? '￥' + formInline.GSmoney : '0.00'}}元</span></span>
                <span class="fr mr40" v-if="!showPF">索赔金额： <span class="money-color">{{data.claimAmount ? '￥' + data.claimAmount : '0.00'}}元</span></span>
            </div>
            <div class="btn mt20" >
                <span class="btn-left" @click="handleClose">取消</span>
                <span class="btn-right" @click="submit('data')">确认提交</span>
            </div>
			<!-- <span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="submit('data')">确 认</el-button>
			</span> -->
		</el-dialog>
    </div>
    
</template>  
<script>
import CaseService from '../../../service/CaseService.js';
import verificationduplication from '../js/verificationduplication.js';
import PushInsuranceCloseCase from './PushInsuranceCloseCase.vue';
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    props: {
        isShow:{
            type: Boolean,
            required:true
        }
    },
    components:{PushInsuranceCloseCase},
    computed:{
        ...mapGetters([
            "payInfo",
            "csaeDictionaries",
            "pushInsuranceData"
        ]),
    },
    data() {
		return {
            showPF: false,
            formInline:{
                GSmoney:0,
                LPmoney:0,
            },
            data:{
                clientOfferFullMaterialsTime:'',
                materialsSendInsuranceCompanyTime:'',
            },
            delivery:false,
            caseService: new CaseService(),
            verificationduplication:new verificationduplication(),
            dialogVisiblePayInfo: false,
            rightPosition:'right',
            rules: {
                clientOfferFullMaterialsTime: [
                    { required: true, message: '请选择案件接收时间', trigger: 'blur' }
                ],
                materialsSendInsuranceCompanyTime: [
                    { required: true, message: '请选择原件寄送时间', trigger: 'blur' }
                ],
                claimAmount: [
                    { required: true, message: '请输入索赔金额', trigger: 'blur' }
                ],
            },
            dealDateStartOptions:this.beginDate(),
		}
    },
    watch: {
        isShow(val) {
            this.dialogVisiblePayInfo = val;
        }
    },
    created() {
        this.checkData(1);
    },
    methods: {
        beginDate(){
            return {
                disabledDate(time){
                    return time.getTime() >  new Date()
                }
            }
        },
        checkData(flag){//处理结构
            let reDate = JSON.parse(JSON.stringify(this.payInfo));
            this.delivery = reDate.isCompanyClaims == '0'?true:false;
            if(reDate.id){
                if(reDate.loss2List){
                    if(flag == 1) {
                        let arr = [];
                        let obj1 =  {
                            id: "",
                            loss3List: [],
                            lossFrom: "02",
                            totalAmount: ""
                        },obj= {};
                        reDate.loss2List.find(item => item.lossFrom == '02') ? obj = reDate.loss2List.find(item => item.lossFrom == '02') : obj = obj1;
                        arr.push(obj)
                        this.data = {
                            id:reDate.id,
                            loss2List:arr,
                            isCompanyClaims:this.delivery?'0':'1'
                        }
                    } else if(flag == 2) {
                        this.data = reDate;
                        let arr = [];
                        let obj1 =  {
                            id: "",
                            loss3List: [],
                            lossFrom: "01",
                            totalAmount: ""
                        },obj= {};
                        reDate.loss2List.find(item => item.lossFrom == '01') ? obj = reDate.loss2List.find(item => item.lossFrom == '01') : obj = obj1;
                        arr.push(obj)
                        this.data.loss2List = arr;
                    }
                    this.data.loss2List.forEach(item =>{
                        if(item.lossFrom == '01'){
                            this.formInline.GSmoney = item.totalAmount
                        } else if(item.lossFrom == '02') {
                            this.formInline.LPmoney = item.totalAmount
                        }
                    })
                }
            } else {
                if(flag == 1) {
                    let arr = [];
                    arr.push(reDate.loss2List.find(item => item.lossFrom == '02'))
                    this.data = {
                        id:reDate.id,
                        loss2List:arr
                    }
                    
                } else if(flag == 2) {
                    this.data = reDate;
                    let arr = [];
                    arr.push(reDate.loss2List.find(item => item.lossFrom == '01'))
                    this.data.loss2List = arr;
                    if(this.pushInsuranceData && this.pushInsuranceData.isPushInsuranceFlag){
                        this.data.claimAmount = this.pushInsuranceData.pushInsuranceDetails.estimatedLossAmount
                    }
                }
            }
            if(flag == 1) {
                this.showPF = true;
            } else {
                this.showPF = false;
            }
        },
        async submit() { //保存
            this.data.isCompanyClaims = this.delivery?'0':'1';
            this.data.reportNo = this.$route.query.reportNo;
            let list = [];
            let list1 = [];
            let moneyFlagGS = false;  // true 不通过 false通过
            let moneyFlagLP = false; // true 不通过 false通过
            if(!this.showPF) {
                this.data.loss2List.find(item =>item.lossFrom == "01").loss3List.forEach(item => {
                    if(item.compensationItems){
                        list.push(item)
                    }
                    
                    let compensationAmount = item.compensationAmount.toString().replace(/\s*/g,"");
                    if(compensationAmount==''){
                        moneyFlagGS = true
                    }
                });
                this.data.loss2List.find(item =>item.lossFrom == "01").loss3List = list;
                this.data.loss2List.find(item =>item.lossFrom == "01").totalAmount = this.formInline.GSmoney.toString();
            } else {
                this.data.loss2List.find(item =>item.lossFrom == "02").loss3List.forEach(ele => {
                    if(ele.compensationItems){
                        list1.push(ele)
                    }
                    let compensationAmount = ele.compensationAmount.toString().replace(/\s*/g,"");
                    if(compensationAmount == ''){
                        moneyFlagLP = true
                    }
                });
                this.data.loss2List.find(item =>item.lossFrom == "02").loss3List = list1;
                this.data.loss2List.find(item =>item.lossFrom == "02").totalAmount = this.formInline.LPmoney.toString();
            }
            let claimAmount = Number(this.data.claimAmount)
            if(claimAmount < 0 && !this.showPF){
                this.$message.warning('索赔金额：不得小于0元')
                return
            }else if (list.length == 0 && !this.showPF) {
                this.$message.warning('估损明细必填项（至少填写一条）')
                return
            } else if(moneyFlagGS && !this.showPF){
                this.$message.warning('请将估损金额填写完整')
                return
            } else if (moneyFlagLP && this.showPF) {
                this.$message.warning('请将理赔金额填写完整')
                return
            } 
            let res = {};
            if(this.showPF) {
                res = await this.caseService.addPayInfoPF(this.data);
            } else {
                res = await this.caseService.addPayInfoSP(this.data);
            }
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
                isDelete:false, // true 删除 false 不删除
            };
            this.data.loss2List.find(item =>item.lossFrom == lossFrom).loss3List.push(obj);
        },
        /**
         * 删除选中的估损和理赔金额
         * index 索引
         * lossForm 用来区分理赔还是估损的标识
         */
        deleteGsOrLp (index,lossFrom) {
            if (lossFrom === '01') {    // 估损
                let list = this.data.loss2List.find(item =>item.lossFrom == "01").loss3List
                if(list[index] && list[index].id){
                    list[index].isDelete = true
                    this.data.loss2List.find(item =>item.lossFrom == "01").loss3List = list
                }else {
                    this.data.loss2List.find(item =>item.lossFrom == "01").loss3List.splice(index,1)
                }
                this.comMoneyGS()
            } else if (lossFrom === '02') { // 理赔
                let list = this.data.loss2List.find(item =>item.lossFrom == "02").loss3List
                if(list[index] && list[index].id){
                    list[index].isDelete = true
                    this.data.loss2List.find(item =>item.lossFrom == "02").loss3List = list
                }else {
                    this.data.loss2List.find(item =>item.lossFrom == "02").loss3List.splice(index,1)
                }
                this.comMoneyLP()
            }
        },
        // 计算估损金额总和
        comMoneyGS() {
            this.formInline.GSmoney = 0;
            this.data.loss2List.find(item =>item.lossFrom == "01").loss3List.forEach(item => {
                if(!item.isDelete){
                    this.formInline.GSmoney += Number(item.compensationAmount);
                }
            });
            // this.data.claimAmount = this.formInline.GSmoney
        },
        comMoneyLP() {//计算总和
            this.formInline.LPmoney = 0;
            this.data.loss2List.find(item =>item.lossFrom == "02").loss3List.forEach(item => {
                if(!item.isDelete){
                    this.formInline.LPmoney += Number(item.compensationAmount);
                }
            });
        },
	},
}
    
</script>
<style lang="less">
    #editPayInfo {
        .el-dialog__body .el-form .el-form-item {
            margin-bottom: 0px;  
        }
        .edit-payinfo {
            .el-form {
                margin: 0 !important;
            }
        }
        .gs-money {
            .margin10,.option-btn {
                margin:15px 28px 10px;
            }
            .mr40 {
                margin-right: 40px;
            }
            .el-input {
                width: 80%;
            }
            h5 {
                margin:10px;
                font-size:15px;
                color:#333;
                font-weight:700;
            }
        }
        .add-col {
            color: #1B84E8;
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
            margin-right: 5px;
            color: #000;
            font-weight: 700;
        }
        .span-style1 {
            display: inline-block;
            width: 73px;
            margin-right: 5px;
            color: #000;
            font-weight: 700;
        }
        .money-color {
            color: #ff3000;
        }
        .option-btn {
            padding:10px 0;
            padding-right: 10px;
            border-top: 1px dashed  #ececec;
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