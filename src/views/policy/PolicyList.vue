<template>
  <div id="policyReview">
        <div class="ts-wrapper mt30">
            <Step :two="true"></Step>
            <!-- 投保人信息 -->
            <Title title="投保人信息"></Title>
            <div class="ts-insure-scheme">
                <el-form :label-position="labelPosition" label-width="100px" :inline="true" :model="form" class="demo-form-inline">
                    <el-form-item label="投保人名称：">
                        {{form.applicant.orgFullName}}
                    </el-form-item>
                    <el-form-item label="地址：">
                        {{form.applicant.province}}
                        {{form.applicant.city}}
                        {{form.applicant.county}}
                        {{form.applicant.orgAddress}}
                    </el-form-item>
                    <el-form-item label="联系人：">
                        {{form.applicant.linkManName}}
                    </el-form-item>
                    <el-form-item label="联系人电话：">
                        {{form.applicant.linkManPhone}}
                    </el-form-item>
                </el-form>
            </div>

          
            <!-- 方案信息 -->
            <Title title="投保方案"></Title>
            <div class="ts-insure-scheme">
                <el-form :label-position="labelPosition" label-width="100px" ref="form" :model="form">
                    <el-form-item label="所选方案：">
                        <div class="ts-scheme" v-if="form.productClassifyList.length != 0" v-for="(item,key) in form.productClassifyList" :key="key">
                            <ul v-for="(items,keys) in item.liabilityList" :key="keys" >
                                <li class="w770">{{item.name}}</li>
                                <li class="f12 pl20" v-for="(val,keys) in items.limitList" :key="keys">
                                    ●<span class="pl10"></span> 
                                    {{val.name}} : 
                                    <span v-if="val.value.length<20 && val.value /10000 >0">{{val.value / 10000}}万元</span>
                                    <span v-else-if="val.value.length<20 && val.value /10000<0">{{val.value }}元</span>
                                    <span v-else>{{val.value}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-form-item>
                    <el-form-item label="开始日期：">
                        {{form.startDate}} 起 
                    </el-form-item>
                    <el-form-item label="结束日期：">
                        {{form.endDate}}止
                    </el-form-item>
                </el-form>
            </div>

            <!-- 保单信息 -->
            <Title title="保单信息"></Title>
            <div class="ts-insure-scheme">
                <el-form :label-position="labelPosition" label-width="100px"  :inline="true" :model="form"  class="demo-form-inline">
                    <el-form-item label="保单类型：">
                        {{form.policyType.type=='1'?'电子保单':'纸质保单'}}
                    </el-form-item>
                    <el-form-item label="接收邮箱：">
                        {{form.policyType.email}}
                    </el-form-item>
                    <el-form-item label="邮寄地址："  v-if="form.policyType.type == '2'">
                        {{form.policyType.site}}
                    </el-form-item>
                </el-form>
            </div>

             <!-- 人员信息 -->
            <Title title="投保电梯信息"></Title>
            <div class="ts-ele-scheme pl10">
                <span class="ml10" @click="importElevator()">查看电梯清单</span>
            </div> 


            <div class="btm-btn mt20 mb20">
                <el-button type="info" @click="returnEdit">返回修改</el-button>
                <el-button type="warning" @click="submitOrder">提交</el-button>    
                <!-- <el-button type="warning" @click="submit()">提交支付</el-button>     -->
            </div> 
        </div>

       <PresentElevatorList 
            :operation="true"
            ref="myChildPresentEle"  >
        </PresentElevatorList>
    </div>
   
</template>

<script>
import productService from '@/service/ProductService'
import PremiumTrial from './js/PremiumTrial.js'
// import divisors from '../../global/divisor.json'
import moment from 'moment'

import PresentElevatorList from './PresentElevatorList';
import Step from './components/Step';
import Title from './components/Title';


export default {
    name: 'PolicyReview',
    components: {
        Step, Title, PresentElevatorList
    },
    data(){
        return{
            productService: new productService(),
            // divisors:divisors,
            activeNames:[0,1,2],
            detalis:{},   // 产品详情
            form:{
                applicant:{},
                policyType:{
                    type:"",
                },
                total:0,
                mainInfo:{
                    liabilityList:[]
                },
            },      // 保单信息
            straight:0,   // 直梯
            escalator:0,  // 扶梯
            elevatorSum:0,  // 扶梯
            elevatorDivisor:[],   // 保险电梯因子
            orderNumber:"",   // 订单编号
            amount:"",   // 订单金额
            eleListID:[],   // 电梯数据id，批量插入返回
            labelPosition: 'right',
        }
    },
     mounted(){
        this.productDetalis()

    },
    methods:{
       // 获取产品详情啊
		async productDetalis() {
            this.form = JSON.parse(window.sessionStorage.getItem('policyData'))
            
            this.elevatorSum = this.form.elevatorMessage.length 
            const elevatorMessage = this.form.elevatorMessage

            for(let i = 0 ; i< elevatorMessage.length;i++){
                if(elevatorMessage[i].elevatorType=="1"){
                    this.straight++
                }else if(elevatorMessage[i].elevatorType=="2"){
                    this.escalator++
                }
            }
           
        },
         submitOrder(){
             if(this.form.id){
                 this.updateOrder()
             }else{
                 this.submits()
             }
         },
        async updateOrder(){
            let form = this.form;
            let  params = {
				'managerCode':window.sessionStorage.getItem('userCode'),
				'applyCode':form.serialNumber,
				'policyHolderCode':window.localStorage.getItem('userCode'),
				'policyHolderName':form.applicant.orgFullName,
				'state':1,
				'content':window.sessionStorage.getItem('policyData'),
				'startDate':form.startDate,
				'endDate':form.endDate,
				'productCode': form.productCode,
				'productName':form.productName,
				'premium':form.total,
				'applyType':1,
            }
                let data = await this.productService.updataRecord(form.id,params);
                let {code} = data;
                if(code == '0000'){
                    this.$router.push({
                        path:'/payOrder'
                    });
                }
        },
        async submitss(){
            let form = this.form;
            let  params = {
				'managerCode':window.sessionStorage.getItem('userCode'),
				'applyCode':form.serialNumber,
				'policyHolderCode':window.localStorage.getItem('userCode'),
				'policyHolderName':form.applicant.orgFullName,
				'state':1,
				'content':window.sessionStorage.getItem('policyData'),
				'startDate':form.startDate,
				'endDate':form.endDate,
				'productCode': form.productCode,
				'productName':form.productName,
				'premium':form.total,
				'applyType':1,
            }
                let data = await this.productService.preRecord(params);
                let {code} = data;
                if(code == '0000'){
                    this.$router.push({
                        path:'/payOrder'
                    });
                }
        },
        async submits(){
			let userCode = window.localStorage.getItem('userCode');
            let content = window.sessionStorage.getItem('policyData');
            let displayContent = {
                   productCode: this.form.productCode,
                   productName: this.form.productName,
                   applyType:"1",      // 电梯（1），雇主，团体（2），索道（3）,团体（4）
                }
			let serialNo = await this.productService.saveTempForm(userCode,content,displayContent);
            let {code,data} = serialNo;
			if(code == '0000'){
                this.form.serialNumber = data.serialNo;
                this.submitss();
			}
		},
       
        // 电梯保单电梯列表 
        importElevator(){
            this.$refs.myChildPresentEle.flagTrue()
        },
        // 疑问提示
		insuranceQuery(){
			Dialog.alert({
			title: '责任说明',
			message: '每次事故法律费用责任限额在每次事故赔偿限额内计算。每次事故每人赔偿限额在每次事故赔偿限额内计算。对每次事故每位雇员的伤亡赔偿、医疗费用赔偿总和不超过每次事故每人赔偿限额。'
			}).then(() => {
			// on close
			});
        },
         returnEdit() {
            this.$router.go(-1)
        },

    }
}
</script>

<style lang="less" scoped>
    #policyReview {
        .ts-insure-scheme{
            padding-left: 120px;
            padding-right: 120px; 
        }
        .pl160{
            padding-left: 160px;
        }
        .ts-wrapper{
            width: 1200px;
            margin: 0 auto;
            background-color: #fff;
        }
        .mt30{
            margin-top: 30px;
            padding: 50px;
        }
        .el-form-item {
            width: 47%;
        }
        .ts-ele-scheme{
            background-color: #f6fbfe;
            line-height: 50px;
            height: 50px;
        }
        .ts-ele-scheme .ts-ele-length{
            font-weight: 700;
            color: #f74f50;
        }
        .ml10 {
            margin-left: 40px;
            color: #0198ef;
            cursor: pointer;
        }
        .btm-btn {
            text-align: center;
            .el-button {
                padding: 15px 65px;
            }
            .el-button+.el-button {
                margin-left: 30px;
            }
        }

    }
.ts-scheme{
    margin: 10px 0;
    width: 770px;
    background-color: #f6fbfe;
}
.ts-scheme ul {
    padding: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.ts-scheme ul >li {
    width: 45%;
    height: 40px;
    /* overflow: hidden; */
}
.w770{
    width: 770px !important; 
}
</style>
