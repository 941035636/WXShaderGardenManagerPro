<template>
     <div class="ts-insure-scheme pl20">
                <el-form :label-position="labelPosition" label-width="80px" :model="form" :rules="rules" ref="form">
                     <el-form-item label="选择日期" prop="startDate">
                         <el-date-picker
                            v-model="form.startDate"
                            @change="setTimer()"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :picker-options="dealDateStartOptions"
                            placeholder="选择日期">  
                    </el-date-picker> 00: 00: 00 起 
                    <span style="padding-left:30px"></span>
                    <el-date-picker
                        v-model="form.endDate"
                        disabled
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker> 23: 59: 59 止
                    <span  style="padding-left:30px"></span>
                        共<i style="color: #ff545c; font-weight: 700;">1</i>年
                    <div>
                        <img src="../../../../assets/images/slider/i-01.png" alt="">
                        <span style="color:#c88b5f">投保单实际支付日期等于或晚于您选择的保险起期时，我们将按照 按实际支付日期 + 1 作为您的保险起期</span>
                    </div>
                    </el-form-item>
                </el-form>

                <el-form :label-position="labelPosition" label-width="80px" :model="projectForm" :rules="rules" ref="projectForm">
                    <el-form-item label="基本险" prop="valueM">
                            <el-select :disabled="$globalProductCode.PRODUCT_CODE_GD ==productCode" v-model="projectForm.valueM" placeholder="请选择" @change="onMainRisk(projectForm.valueM)">
                                <el-option
                                v-for="(item,key) in mainRisk"
                                :key="key"
                                :label="item.programName"
                                :value="item.code">
                                </el-option>
                            </el-select>
                             <div class="ts-scheme" v-if="liabilityListM.length !=0" v-for="(items,index) in liabilityListM" :key="index">
                              <ul v-for="(item,key) in items.liabilityList" :key="key">
                                <li class="w770">{{item.name}}</li>
                                <li class="f12 pl20" v-for="(val,keys) in item.limitList" :key="keys">
                                    ●<span class="pl10"></span>
                                    {{val.name}}： 
                                    <span v-if="val.value.length<20 && val.value /10000 >= 1">{{val.value / 10000}}万元</span> 
                                    <span v-else-if="val.value.length<20 && val.value /10000 <1">{{val.value }}元</span>
                                     <span v-else >{{val.value}}</span>
                                </li>
                              </ul>
                           </div>
                           
                    </el-form-item>
                    <el-form-item label="附加险" v-if="subRisk.length !=0">
                            <el-checkbox-group v-model="checkListA">
                            <el-checkbox  
                                :disabled="$globalProductCode.PRODUCT_CODE_GD ==productCode"
                                v-for="(item,key) in subRisk " 
                                :key='key' 
                                :label="item.code">
                                {{item.name}}
                            </el-checkbox>
                            </el-checkbox-group>
                            <div class="ts-scheme" v-if="liabilityListA.length !='0'" v-for="(item,key) in liabilityListA" :key="key">
                                    <ul v-for="(items,keys) in item.liabilityList" :key="keys" >
                                        <li class="w770">{{item.name}}</li>
                                        <li class="f12 pl20" v-for="(val,keys) in items.limitList" :key="keys">
                                            ●<span class="pl10"></span> 
                                            {{val.name}} : 
                                            <span v-if="val.value.length<20 && val.value /10000 >=1">{{val.value / 10000}}万元</span>
                                            <span v-else-if="val.value.length<20 && val.value /10000<1">{{val.value }}元</span>
                                            <span v-else>{{val.value}}</span>
                                        </li>
                                    </ul>
                                </div>
                           
                    </el-form-item>
                </el-form> 
            </div>
</template>

<script>
import moment from 'moment'
export default {
    props:{
        detalis:{
            type:Object,
        },
        mainRisk:{
            type:Array,
        },
        subRisk:{
            type:Array,
        },
        productCode:{
            type:String,
        },
        flag:{
            type:Boolean,
        },
    },
    data(){
        return{
            dealDateStartOptions:{
                disabledDate(time){
                //禁用当前时间之前的时间
                let t = new Date().getTime();
                return time.getTime()<t;
                }
            },
            labelPosition:'right',
            liabilityListM:[],  // 主险下面的责任
            liabilityListA:[],  // 主险下面的责任
            checkListA:[],   // 选中的附加附加险
            program:[],     // 主线附加险合并
            form:{
                startDate:'',  // 起
                endDate:"",    // 使
            },
            rules:{
                 startDate: [
                    { required: true, message: '请选择起止日期', trigger: 'blur' }
                ],
                valueM: [
                    {required: true, message: '请选择主险方案', trigger: 'change' }
                ],
            },
            projectForm:{
                valueM:'',  // 主线索引
            },
        }
    },
    watch:{
        
        checkListA:function(val,oldVal){
            this.liabilityListA=[]
            val.forEach(item =>{
              var subRisk =   this.subRisk[this.subRisk.map(pro => pro.code).indexOf(item)];
                this.liabilityListA.push(subRisk);
                
            });
            
        },
         deep: true
    },
    mounted(){
    },
    methods:{
        // 获取缓存数据
         getSession(){ 
            const obj =JSON.parse(window.sessionStorage.getItem('productClassifyList'));
            let productClassifyList=obj.productClassifyList;
            this.form=obj.timer;
            productClassifyList.forEach(item=>{   // 缓存中数据
                    if(item.riskFlag=="A"){
                        this.checkListA.push(item.code);
                    }else if(item.riskFlag=="M"){
                        this.liabilityListM[0] = item;
                        this.projectForm.valueM=item.code;
                         this.$emit('eleButtonNJ',false)
                    }
                });
        },
        // 获取当前时间
        setTimer(){
            let start = new Date(this.form.startDate);
            let yearFull = start.getFullYear() + 1;
            let mouthFull = start.getMonth() + 1;
            let dayFull = start.getDate();
            this.form.endDate = moment(new Date(yearFull + '-' + mouthFull + '-' + dayFull) - 24*60*60*1000).format('YYYY-MM-DD 23:59:59'); 
            this.form.startDate =	moment(this.form.startDate).format('YYYY-MM-DD 00:00:00');
           
        },
         // 主线方案
        onMainRisk(e){
          this.liabilityListM[0] =  this.mainRisk[this.mainRisk.map(item=>item.code).indexOf(e)];
          this.$emit('eleButtonNJ',false)
          this.precept()
        },
        // 方案拼接
        precept(){
            const obj = {}
            if(this.liabilityListM.length==0){
                obj.productClassifyList='9999'
               return obj
            }
            
            obj.productClassifyList=this.liabilityListM.concat(this.liabilityListA);
            obj.timer=this.form;
            window.sessionStorage.setItem('productClassifyList',JSON.stringify(obj))
            return  obj
        },
        proudctGD(mainRisk){
            const obj =JSON.parse(window.sessionStorage.getItem('productClassifyList'));
            
           if(obj == null){

               if(this.$globalProductCode.PRODUCT_CODE_GD ==this.productCode){   // 广东
                  this.projectForm.valueM=mainRisk[0].code
                  this.liabilityListM=mainRisk;
                   this.subRisk.forEach(item=>{   // 缓存中数据
                          this.checkListA.push(item.code);
                          
                  });
              }
           }    
        },
         verifyData(){ // 校验时间
            let status ='9999'
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    status = '0000'
                } else {
                    this.$message.error('请将时间信息填写完整');
                    return false;
                }
            });
             return status
        },
         verifyScheme(){ // 校验方案信息
          let status ='9999'
            this.$refs['projectForm'].validate(async (valid) => {
                if (valid) {
                       status = '0000'
                } else {
                    this.$message.error('请将方案填写完整');
                    return false;
                }
            });
             return status
        },
    }
}
</script>

<style>

</style>
